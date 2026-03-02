"""
Cache Service - 缓存服务
支持内存缓存和 Redis 缓存
"""

import json
import hashlib
from typing import Any, Optional, Dict, List
from datetime import datetime, timedelta
import redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class CacheService:
    """缓存服务类"""

    def __init__(self):
        """初始化缓存服务"""
        self.redis_client: Optional[redis.Redis] = None
        self.memory_cache: Dict[str, tuple] = {}  # (value, expiry_time)
        self.use_redis = False

        # 尝试连接 Redis
        if settings.CACHE_ENABLED:
            try:
                self.redis_client = redis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5
                )
                # 测试连接
                self.redis_client.ping()
                self.use_redis = True
                logger.info("Redis cache connected successfully")
            except Exception as e:
                logger.warning(f"Redis connection failed: {e}, using memory cache")
                self.use_redis = False

    def _generate_key(self, prefix: str, identifier: str) -> str:
        """生成缓存键"""
        key = f"{prefix}:{identifier}"
        # 如果键太长，使用哈希
        if len(key) > 200:
            return f"{prefix}:{hashlib.md5(identifier.encode()).hexdigest()}"
        return key

    def get(self, key: str) -> Optional[Any]:
        """获取缓存"""
        cache_key = self._generate_key("cyberpress", key)

        try:
            if self.use_redis and self.redis_client:
                # 使用 Redis
                data = self.redis_client.get(cache_key)
                if data:
                    return json.loads(data)
            else:
                # 使用内存缓存
                if cache_key in self.memory_cache:
                    value, expiry = self.memory_cache[cache_key]
                    if expiry is None or datetime.now() < expiry:
                        return value
                    else:
                        # 过期，删除
                        del self.memory_cache[cache_key]
        except Exception as e:
            logger.error(f"Cache get error: {e}")

        return None

    def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """
        设置缓存

        Args:
            key: 缓存键
            value: 缓存值
            ttl: 过期时间（秒），默认使用配置的 TTL
        """
        cache_key = self._generate_key("cyberpress", key)
        ttl = ttl or settings.CACHE_TTL

        try:
            # 序列化值
            serialized_value = json.dumps(value, ensure_ascii=False)

            if self.use_redis and self.redis_client:
                # 使用 Redis
                if ttl > 0:
                    self.redis_client.setex(cache_key, ttl, serialized_value)
                else:
                    self.redis_client.set(cache_key, serialized_value)
            else:
                # 使用内存缓存
                expiry = datetime.now() + timedelta(seconds=ttl) if ttl > 0 else None
                self.memory_cache[cache_key] = (value, expiry)

            logger.debug(f"Cache set: {cache_key}")
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False

    def delete(self, key: str) -> bool:
        """删除缓存"""
        cache_key = self._generate_key("cyberpress", key)

        try:
            if self.use_redis and self.redis_client:
                self.redis_client.delete(cache_key)
            else:
                if cache_key in self.memory_cache:
                    del self.memory_cache[cache_key]
            logger.debug(f"Cache deleted: {cache_key}")
            return True
        except Exception as e:
            logger.error(f"Cache delete error: {e}")
            return False

    def clear_pattern(self, pattern: str) -> int:
        """清除匹配模式的所有缓存"""
        try:
            if self.use_redis and self.redis_client:
                keys = self.redis_client.keys(f"*{pattern}*")
                if keys:
                    return self.redis_client.delete(*keys)
            else:
                # 内存缓存不支持模式匹配，需要遍历
                keys_to_delete = [
                    k for k in self.memory_cache.keys()
                    if pattern in k
                ]
                for key in keys_to_delete:
                    del self.memory_cache[key]
                return len(keys_to_delete)
        except Exception as e:
            logger.error(f"Cache clear pattern error: {e}")
        return 0

    def clear_all(self) -> bool:
        """清空所有缓存"""
        try:
            if self.use_redis and self.redis_client:
                # 只清除 cyberpress 前缀的键
                keys = self.redis_client.keys("cyberpress:*")
                if keys:
                    self.redis_client.delete(*keys)
            else:
                self.memory_cache.clear()
            logger.info("All cache cleared")
            return True
        except Exception as e:
            logger.error(f"Cache clear all error: {e}")
            return False

    def get_stats(self) -> Dict[str, Any]:
        """获取缓存统计信息"""
        stats = {
            "type": "redis" if self.use_redis else "memory",
            "enabled": settings.CACHE_ENABLED
        }

        if self.use_redis and self.redis_client:
            try:
                info = self.redis_client.info()
                stats.update({
                    "total_keys": self.redis_client.dbsize(),
                    "memory_used": info.get("used_memory_human", "unknown"),
                    "hits": info.get("keyspace_hits", 0),
                    "misses": info.get("keyspace_misses", 0)
                })
            except Exception as e:
                logger.error(f"Failed to get Redis stats: {e}")
        else:
            stats["total_keys"] = len(self.memory_cache)

        return stats

    def remember(self, key: str, callback, ttl: int = None) -> Any:
        """
        记忆化缓存：如果缓存存在则返回，否则执行回调并缓存结果

        Args:
            key: 缓存键
            callback: 回调函数，返回要缓存的值
            ttl: 过期时间（秒）
        """
        value = self.get(key)
        if value is not None:
            return value

        # 执行回调获取值
        value = callback()
        if value is not None:
            self.set(key, value, ttl)

        return value

    def get_many(self, keys: List[str]) -> Dict[str, Any]:
        """批量获取缓存"""
        result = {}
        for key in keys:
            value = self.get(key)
            if value is not None:
                result[key] = value
        return result

    def set_many(self, data: Dict[str, Any], ttl: int = None) -> bool:
        """批量设置缓存"""
        success = True
        for key, value in data.items():
            if not self.set(key, value, ttl):
                success = False
        return success

    def delete_many(self, keys: List[str]) -> int:
        """批量删除缓存"""
        count = 0
        for key in keys:
            if self.delete(key):
                count += 1
        return count

    def exists(self, key: str) -> bool:
        """检查缓存是否存在"""
        cache_key = self._generate_key("cyberpress", key)

        if self.use_redis and self.redis_client:
            return bool(self.redis_client.exists(cache_key))
        else:
            return cache_key in self.memory_cache

    def increment(self, key: str, delta: int = 1) -> Optional[int]:
        """增加计数器"""
        cache_key = self._generate_key("cyberpress", key)

        try:
            if self.use_redis and self.redis_client:
                return self.redis_client.incrby(cache_key, delta)
            else:
                # 内存缓存实现
                if cache_key in self.memory_cache:
                    value, expiry = self.memory_cache[cache_key]
                    if isinstance(value, int):
                        new_value = value + delta
                        self.memory_cache[cache_key] = (new_value, expiry)
                        return new_value
                else:
                    self.set(key, delta, settings.CACHE_TTL)
                    return delta
        except Exception as e:
            logger.error(f"Cache increment error: {e}")

        return None

    def expire(self, key: str, ttl: int) -> bool:
        """设置过期时间"""
        cache_key = self._generate_key("cyberpress", key)

        try:
            if self.use_redis and self.redis_client:
                return self.redis_client.expire(cache_key, ttl)
            else:
                if cache_key in self.memory_cache:
                    value, _ = self.memory_cache[cache_key]
                    expiry = datetime.now() + timedelta(seconds=ttl)
                    self.memory_cache[cache_key] = (value, expiry)
                    return True
        except Exception as e:
            logger.error(f"Cache expire error: {e}")

        return False


# 创建全局缓存服务实例
cache_service = CacheService()


# 装饰器：缓存函数结果
def cached(key_prefix: str, ttl: int = None):
    """
    缓存装饰器

    Usage:
        @cached("user_profile", ttl=3600)
        async def get_user_profile(user_id: int):
            return await db.fetch_user(user_id)
    """
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # 生成缓存键
            key_parts = [key_prefix]
            key_parts.extend(str(arg) for arg in args)
            key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
            cache_key = ":".join(key_parts)

            # 尝试从缓存获取
            cached_value = cache_service.get(cache_key)
            if cached_value is not None:
                return cached_value

            # 执行函数
            result = await func(*args, **kwargs)

            # 缓存结果
            if result is not None:
                cache_service.set(cache_key, result, ttl)

            return result
        return wrapper
    return decorator
