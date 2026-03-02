"""
高性能缓存服务
支持内存缓存、Redis、分层缓存、缓存预热
"""

import json
import asyncio
import hashlib
import time
from typing import Any, Optional, Dict, List, Callable, TypeVar, Generic
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from functools import wraps
from abc import ABC, abstractmethod

try:
    import redis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False


T = TypeVar('T')


@dataclass
class CacheEntry:
    """缓存条目"""
    key: str
    value: Any
    ttl: Optional[int] = None
    created_at: datetime = field(default_factory=datetime.now)
    accessed_at: datetime = field(default_factory=datetime.now)
    access_count: int = 0
    tags: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    def is_expired(self) -> bool:
        """检查是否过期"""
        if self.ttl is None:
            return False
        return (datetime.now() - self.created_at).total_seconds() > self.ttl

    def touch(self):
        """更新访问时间和计数"""
        self.accessed_at = datetime.now()
        self.access_count += 1


class CacheBackend(ABC):
    """缓存后端抽象类"""

    @abstractmethod
    async def get(self, key: str) -> Optional[Any]:
        """获取缓存值"""
        pass

    @abstractmethod
    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """设置缓存值"""
        pass

    @abstractmethod
    async def delete(self, key: str) -> bool:
        """删除缓存值"""
        pass

    @abstractmethod
    async def clear(self) -> bool:
        """清空所有缓存"""
        pass

    @abstractmethod
    async def exists(self, key: str) -> bool:
        """检查键是否存在"""
        pass

    @abstractmethod
    async def keys(self, pattern: str = "*") -> List[str]:
        """获取匹配的键"""
        pass


class MemoryCacheBackend(CacheBackend):
    """内存缓存后端"""

    def __init__(self, max_size: int = 10000):
        self.cache: Dict[str, CacheEntry] = {}
        self.max_size = max_size
        self.lock = asyncio.Lock()

    async def get(self, key: str) -> Optional[Any]:
        """获取缓存值"""
        async with self.lock:
            entry = self.cache.get(key)
            if entry is None:
                return None

            if entry.is_expired():
                await self.delete(key)
                return None

            entry.touch()
            return entry.value

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """设置缓存值"""
        async with self.lock:
            # 检查是否超过最大容量
            if len(self.cache) >= self.max_size and key not in self.cache:
                await self._evict_lru()

            entry = CacheEntry(key=key, value=value, ttl=ttl)
            self.cache[key] = entry
            return True

    async def delete(self, key: str) -> bool:
        """删除缓存值"""
        async with self.lock:
            if key in self.cache:
                del self.cache[key]
                return True
            return False

    async def clear(self) -> bool:
        """清空所有缓存"""
        async with self.lock:
            self.cache.clear()
            return True

    async def exists(self, key: str) -> bool:
        """检查键是否存在"""
        async with self.lock:
            entry = self.cache.get(key)
            if entry is None:
                return False
            return not entry.is_expired()

    async def keys(self, pattern: str = "*") -> List[str]:
        """获取匹配的键"""
        async with self.lock:
            import fnmatch
            return [k for k in self.cache.keys() if fnmatch.fnmatch(k, pattern)]

    async def _evict_lru(self):
        """淘汰最少使用的缓存"""
        if not self.cache:
            return

        # 找出访问次数最少的条目
        lru_key = min(self.cache.keys(), key=lambda k: self.cache[k].access_count)
        await self.delete(lru_key)


class RedisCacheBackend(CacheBackend):
    """Redis 缓存后端"""

    def __init__(
        self,
        host: str = "localhost",
        port: int = 6379,
        db: int = 0,
        password: Optional[str] = None,
        prefix: str = "cache:",
    ):
        if not REDIS_AVAILABLE:
            raise ImportError("Redis package is not installed")

        self.client = redis.Redis(
            host=host,
            port=port,
            db=db,
            password=password,
            decode_responses=True
        )
        self.prefix = prefix

    def _make_key(self, key: str) -> str:
        """生成带前缀的键"""
        return f"{self.prefix}{key}"

    async def get(self, key: str) -> Optional[Any]:
        """获取缓存值"""
        try:
            value = self.client.get(self._make_key(key))
            if value is None:
                return None

            return json.loads(value)
        except Exception as e:
            print(f"Redis get error: {e}")
            return None

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """设置缓存值"""
        try:
            serialized = json.dumps(value, default=str)
            redis_key = self._make_key(key)

            if ttl:
                self.client.setex(redis_key, ttl, serialized)
            else:
                self.client.set(redis_key, serialized)

            return True
        except Exception as e:
            print(f"Redis set error: {e}")
            return False

    async def delete(self, key: str) -> bool:
        """删除缓存值"""
        try:
            self.client.delete(self._make_key(key))
            return True
        except Exception as e:
            print(f"Redis delete error: {e}")
            return False

    async def clear(self) -> bool:
        """清空所有缓存"""
        try:
            pattern = f"{self.prefix}*"
            keys = self.client.keys(pattern)
            if keys:
                self.client.delete(*keys)
            return True
        except Exception as e:
            print(f"Redis clear error: {e}")
            return False

    async def exists(self, key: str) -> bool:
        """检查键是否存在"""
        try:
            return self.client.exists(self._make_key(key)) > 0
        except Exception as e:
            print(f"Redis exists error: {e}")
            return False

    async def keys(self, pattern: str = "*") -> List[str]:
        """获取匹配的键"""
        try:
            redis_pattern = f"{self.prefix}{pattern}"
            keys = self.client.keys(redis_pattern)
            # 移除前缀
            return [k.replace(self.prefix, "", 1) for k in keys]
        except Exception as e:
            print(f"Redis keys error: {e}")
            return []


class LayeredCacheBackend(CacheBackend):
    """分层缓存后端（L1 内存 + L2 Redis）"""

    def __init__(
        self,
        l1_backend: CacheBackend,
        l2_backend: CacheBackend,
        sync_to_l2: bool = True,
    ):
        self.l1 = l1_backend
        self.l2 = l2_backend
        self.sync_to_l2 = sync_to_l2

    async def get(self, key: str) -> Optional[Any]:
        """获取缓存值（先查 L1，再查 L2）"""
        # 先从 L1 获取
        value = await self.l1.get(key)
        if value is not None:
            return value

        # 从 L2 获取并更新 L1
        value = await self.l2.get(key)
        if value is not None:
            await self.l1.set(key, value)

        return value

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """设置缓存值（同时写入 L1 和 L2）"""
        # 写入 L1
        await self.l1.set(key, value, ttl)

        # 写入 L2
        if self.sync_to_l2:
            await self.l2.set(key, value, ttl)

        return True

    async def delete(self, key: str) -> bool:
        """删除缓存值（同时删除 L1 和 L2）"""
        await self.l1.delete(key)
        await self.l2.delete(key)
        return True

    async def clear(self) -> bool:
        """清空所有缓存"""
        await self.l1.clear()
        await self.l2.clear()
        return True

    async def exists(self, key: str) -> bool:
        """检查键是否存在"""
        return await self.l1.exists(key) or await self.l2.exists(key)

    async def keys(self, pattern: str = "*") -> List[str]:
        """获取匹配的键"""
        l1_keys = await self.l1.keys(pattern)
        l2_keys = await self.l2.keys(pattern)
        return list(set(l1_keys + l2_keys))


class CacheService:
    """缓存服务"""

    def __init__(
        self,
        backend: Optional[CacheBackend] = None,
        default_ttl: int = 3600,
        enable_stats: bool = True,
    ):
        self.backend = backend or MemoryCacheBackend()
        self.default_ttl = default_ttl
        self.enable_stats = enable_stats

        self.stats = {
            "hits": 0,
            "misses": 0,
            "sets": 0,
            "deletes": 0,
        }

    async def get(self, key: str) -> Optional[Any]:
        """获取缓存值"""
        value = await self.backend.get(key)

        if self.enable_stats:
            if value is not None:
                self.stats["hits"] += 1
            else:
                self.stats["misses"] += 1

        return value

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        tags: Optional[List[str]] = None,
    ) -> bool:
        """设置缓存值"""
        if ttl is None:
            ttl = self.default_ttl

        success = await self.backend.set(key, value, ttl)

        if self.enable_stats and success:
            self.stats["sets"] += 1

        return success

    async def delete(self, key: str) -> bool:
        """删除缓存值"""
        success = await self.backend.delete(key)

        if self.enable_stats and success:
            self.stats["deletes"] += 1

        return success

    async def clear(self) -> bool:
        """清空所有缓存"""
        return await self.backend.clear()

    async def exists(self, key: str) -> bool:
        """检查键是否存在"""
        return await self.backend.exists(key)

    async def keys(self, pattern: str = "*") -> List[str]:
        """获取匹配的键"""
        return await self.backend.keys(pattern)

    async def get_or_set(
        self,
        key: str,
        factory: Callable[[], Any],
        ttl: Optional[int] = None,
    ) -> Any:
        """获取或设置缓存值"""
        value = await self.get(key)

        if value is None:
            value = await factory() if asyncio.iscoroutinefunction(factory) else factory()
            await self.set(key, value, ttl)

        return value

    async def get_many(self, keys: List[str]) -> Dict[str, Any]:
        """批量获取缓存值"""
        result = {}
        for key in keys:
            value = await self.get(key)
            if value is not None:
                result[key] = value
        return result

    async def set_many(
        self,
        items: Dict[str, Any],
        ttl: Optional[int] = None,
    ) -> bool:
        """批量设置缓存值"""
        for key, value in items.items():
            await self.set(key, value, ttl)
        return True

    async def delete_many(self, keys: List[str]) -> bool:
        """批量删除缓存值"""
        for key in keys:
            await self.delete(key)
        return True

    async def invalidate_tags(self, tags: List[str]) -> bool:
        """按标签失效缓存"""
        # 这个功能需要缓存后端支持标签
        # 简化实现：清空所有缓存
        return await self.clear()

    def generate_key(self, *args, **kwargs) -> str:
        """生成缓存键"""
        key_parts = [str(arg) for arg in args]
        key_parts.extend([f"{k}={v}" for k, v in sorted(kwargs.items())])
        key_string = ":".join(key_parts)

        # 使用 MD5 哈希生成固定长度的键
        return hashlib.md5(key_string.encode()).hexdigest()

    def get_stats(self) -> Dict[str, Any]:
        """获取缓存统计"""
        total = self.stats["hits"] + self.stats["misses"]
        hit_rate = (self.stats["hits"] / total * 100) if total > 0 else 0

        return {
            **self.stats,
            "hit_rate": round(hit_rate, 2),
            "total_requests": total,
        }

    def reset_stats(self):
        """重置统计数据"""
        self.stats = {
            "hits": 0,
            "misses": 0,
            "sets": 0,
            "deletes": 0,
        }


def cached(
    cache_service: CacheService,
    ttl: Optional[int] = None,
    key_prefix: str = "",
    ignore_args: Optional[List[str]] = None,
):
    """缓存装饰器"""

    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> T:
            # 生成缓存键
            cache_key_parts = [key_prefix, func.__name__]

            # 添加参数到键
            if ignore_args:
                filtered_kwargs = {k: v for k, v in kwargs.items() if k not in ignore_args}
            else:
                filtered_kwargs = kwargs

            cache_key = cache_service.generate_key(*cache_key_parts, *args, **filtered_kwargs)

            # 尝试从缓存获取
            cached_value = await cache_service.get(cache_key)
            if cached_value is not None:
                return cached_value

            # 调用函数并缓存结果
            result = await func(*args, **kwargs)
            await cache_service.set(cache_key, result, ttl)

            return result

        return wrapper

    return decorator


# 单例实例
_cache_service: Optional[CacheService] = None


def get_cache_service() -> CacheService:
    """获取缓存服务单例"""
    global _cache_service
    if _cache_service is None:
        # 尝试使用 Redis，如果不可用则使用内存缓存
        try:
            backend = RedisCacheBackend()
        except:
            backend = MemoryCacheBackend()

        _cache_service = CacheService(backend=backend)
    return _cache_service


# 预热缓存
async def warmup_cache(
    cache_service: CacheService,
    data_loaders: List[Callable[[], Dict[str, Any]]],
):
    """预热缓存"""
    for loader in data_loaders:
        try:
            data = await loader() if asyncio.iscoroutinefunction(loader) else loader()
            await cache_service.set_many(data)
        except Exception as e:
            print(f"Error warming up cache: {e}")
