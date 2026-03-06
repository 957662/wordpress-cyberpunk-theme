"""
Redis 缓存服务
用于提高 API 性能
"""
import json
import logging
from typing import Any, Optional, TypeVar, Type
from datetime import timedelta
from redis import Redis
from functools import wraps
import hashlib

from app.core.config import settings

logger = logging.getLogger(__name__)

T = TypeVar('T')


class CacheService:
    """Redis 缓存服务"""

    def __init__(self):
        """初始化 Redis 连接"""
        try:
            self.redis = Redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_timeout=5,
                socket_connect_timeout=5
            )
            # 测试连接
            self.redis.ping()
            logger.info("Redis 缓存服务已启动")
        except Exception as e:
            logger.warning(f"Redis 连接失败: {e}")
            self.redis = None

    def get(self, key: str) -> Optional[Any]:
        """
        获取缓存

        Args:
            key: 缓存键

        Returns:
            缓存值，不存在返回 None
        """
        if not self.redis:
            return None

        try:
            data = self.redis.get(key)
            if data:
                return json.loads(data)
            return None
        except Exception as e:
            logger.error(f"获取缓存失败: {e}")
            return None

    def set(self, key: str, value: Any, ttl: int = 3600) -> bool:
        """
        设置缓存

        Args:
            key: 缓存键
            value: 缓存值
            ttl: 过期时间（秒），默认 1 小时

        Returns:
            是否设置成功
        """
        if not self.redis:
            return False

        try:
            data = json.dumps(value, ensure_ascii=False)
            self.redis.setex(key, ttl, data)
            return True
        except Exception as e:
            logger.error(f"设置缓存失败: {e}")
            return False

    def delete(self, key: str) -> bool:
        """
        删除缓存

        Args:
            key: 缓存键

        Returns:
            是否删除成功
        """
        if not self.redis:
            return False

        try:
            self.redis.delete(key)
            return True
        except Exception as e:
            logger.error(f"删除缓存失败: {e}")
            return False

    def delete_pattern(self, pattern: str) -> int:
        """
        批量删除匹配模式的缓存

        Args:
            pattern: 匹配模式，如 "user:*"

        Returns:
            删除的数量
        """
        if not self.redis:
            return 0

        try:
            keys = self.redis.keys(pattern)
            if keys:
                return self.redis.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"批量删除缓存失败: {e}")
            return 0

    def exists(self, key: str) -> bool:
        """
        检查缓存是否存在

        Args:
            key: 缓存键

        Returns:
            是否存在
        """
        if not self.redis:
            return False

        try:
            return self.redis.exists(key) > 0
        except Exception as e:
            logger.error(f"检查缓存失败: {e}")
            return False

    def clear_all(self) -> bool:
        """
        清空所有缓存

        Returns:
            是否清空成功
        """
        if not self.redis:
            return False

        try:
            self.redis.flushdb()
            logger.info("所有缓存已清空")
            return True
        except Exception as e:
            logger.error(f"清空缓存失败: {e}")
            return False

    def get_stats(self) -> dict:
        """
        获取缓存统计信息

        Returns:
            统计信息字典
        """
        if not self.redis:
            return {"status": "disconnected"}

        try:
            info = self.redis.info()
            return {
                "status": "connected",
                "keys": info.get("db0", {}).get("keys", 0),
                "memory_used": info.get("used_memory_human", "N/A"),
                "hits": info.get("keyspace_hits", 0),
                "misses": info.get("keyspace_misses", 0),
            }
        except Exception as e:
            logger.error(f"获取缓存统计失败: {e}")
            return {"status": "error", "message": str(e)}


# 全局缓存实例
cache = CacheService()


def cache_key(*args, **kwargs) -> str:
    """
    生成缓存键

    Args:
        *args: 位置参数
        **kwargs: 关键字参数

    Returns:
        MD5 哈希的缓存键
    """
    key_data = json.dumps([args, kwargs], sort_keys=True)
    return hashlib.md5(key_data.encode()).hexdigest()


def cached(ttl: int = 3600, key_prefix: str = ""):
    """
    缓存装饰器

    Args:
        ttl: 缓存时间（秒）
        key_prefix: 缓存键前缀

    Returns:
        装饰器函数

    Example:
        @cached(ttl=600, key_prefix="user")
        async def get_user(user_id: int):
            return await db.fetch_user(user_id)
    """

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 生成缓存键
            cache_key_str = f"{key_prefix}:{func.__name__}:{cache_key(*args, **kwargs)}"

            # 尝试从缓存获取
            cached_value = cache.get(cache_key_str)
            if cached_value is not None:
                logger.debug(f"缓存命中: {cache_key_str}")
                return cached_value

            # 执行函数
            result = await func(*args, **kwargs)

            # 存入缓存
            cache.set(cache_key_str, result, ttl)
            logger.debug(f"缓存已设置: {cache_key_str}")

            return result

        return wrapper

    return decorator


class CacheBuilder:
    """缓存构建器 - 用于复杂缓存场景"""

    def __init__(self):
        self.key = ""
        self.ttl = 3600
        self.tags = []

    def with_key(self, key: str):
        """设置缓存键"""
        self.key = key
        return self

    def with_ttl(self, ttl: int):
        """设置过期时间"""
        self.ttl = ttl
        return self

    def with_tags(self, *tags: str):
        """设置缓存标签"""
        self.tags = tags
        return self

    def get(self, fetch_func: callable) -> Any:
        """
        获取或设置缓存

        Args:
            fetch_func: 数据获取函数

        Returns:
            缓存数据或新获取的数据
        """
        # 尝试从缓存获取
        cached_data = cache.get(self.key)
        if cached_data is not None:
            return cached_data

        # 执行获取函数
        data = fetch_func()

        # 存入缓存
        cache.set(self.key, data, self.ttl)

        # 存储标签映射
        for tag in self.tags:
            tag_key = f"tag:{tag}"
            cache.redis.sadd(tag_key, self.key)
            cache.redis.expire(tag_key, self.ttl + 3600)

        return data

    def invalidate_by_tag(self, tag: str) -> int:
        """
        按标签失效缓存

        Args:
            tag: 缓存标签

        Returns:
            失效的缓存数量
        """
        tag_key = f"tag:{tag}"
        keys = cache.redis.smembers(tag_key)
        if keys:
            count = cache.redis.delete(*keys)
            cache.redis.delete(tag_key)
            return count
        return 0


# 导出
__all__ = [
    "cache",
    "cached",
    "CacheBuilder",
    "cache_key",
]
