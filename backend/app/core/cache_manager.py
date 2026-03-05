"""
缓存管理器
CyberPress Platform

提供多级缓存支持,包括内存、Redis等
"""

import json
import hashlib
import time
from typing import Any, Dict, Optional, Callable, TypeVar, Union
from functools import wraps
from datetime import timedelta


T = TypeVar('T')


class CacheBackend:
    """缓存后端抽象基类"""

    def get(self, key: str) -> Optional[Any]:
        """获取缓存值"""
        raise NotImplementedError

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """设置缓存值"""
        raise NotImplementedError

    def delete(self, key: str) -> bool:
        """删除缓存值"""
        raise NotImplementedError

    def clear(self) -> bool:
        """清空所有缓存"""
        raise NotImplementedError

    def exists(self, key: str) -> bool:
        """检查键是否存在"""
        raise NotImplementedError

    def expire(self, key: str, ttl: int) -> bool:
        """设置过期时间"""
        raise NotImplementedError


class MemoryCacheBackend(CacheBackend):
    """内存缓存后端"""

    def __init__(self):
        """初始化内存缓存"""
        self._cache: Dict[str, Dict[str, Any]] = {}

    def get(self, key: str) -> Optional[Any]:
        """获取缓存值"""
        if key not in self._cache:
            return None

        item = self._cache[key]

        # 检查是否过期
        if item.get('expires_at') and item['expires_at'] < time.time():
            self.delete(key)
            return None

        return item.get('value')

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """设置缓存值"""
        expires_at = None
        if ttl:
            expires_at = time.time() + ttl

        self._cache[key] = {
            'value': value,
            'expires_at': expires_at,
            'created_at': time.time(),
        }
        return True

    def delete(self, key: str) -> bool:
        """删除缓存值"""
        if key in self._cache:
            del self._cache[key]
            return True
        return False

    def clear(self) -> bool:
        """清空所有缓存"""
        self._cache.clear()
        return True

    def exists(self, key: str) -> bool:
        """检查键是否存在"""
        if key not in self._cache:
            return False

        item = self._cache[key]
        if item.get('expires_at') and item['expires_at'] < time.time():
            self.delete(key)
            return False

        return True

    def expire(self, key: str, ttl: int) -> bool:
        """设置过期时间"""
        if key not in self._cache:
            return False

        self._cache[key]['expires_at'] = time.time() + ttl
        return True


class CacheManager:
    """缓存管理器"""

    def __init__(self, backend: Optional[CacheBackend] = None):
        """
        初始化缓存管理器

        Args:
            backend: 缓存后端,默认使用内存缓存
        """
        self.backend = backend or MemoryCacheBackend()
        self._prefix = "cyberpress:"
        self._stats = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'deletes': 0,
        }

    def _make_key(self, key: str) -> str:
        """生成带前缀的键"""
        return f"{self._prefix}{key}"

    def _hash_key(self, key: Union[str, Dict, tuple]) -> str:
        """
        生成哈希键

        Args:
            key: 可以是字符串、字典或元组

        Returns:
            哈希后的键名
        """
        if isinstance(key, str):
            return key

        if isinstance(key, dict):
            # 对字典按键排序确保一致性
            sorted_items = sorted(key.items())
            key_str = json.dumps(sorted_items, sort_keys=True)
        elif isinstance(key, tuple):
            key_str = str(key)
        else:
            key_str = str(key)

        return hashlib.md5(key_str.encode()).hexdigest()

    def get(self, key: Union[str, Dict, tuple]) -> Optional[Any]:
        """
        获取缓存值

        Args:
            key: 缓存键

        Returns:
            缓存值,不存在返回None
        """
        cache_key = self._make_key(self._hash_key(key))
        value = self.backend.get(cache_key)

        if value is not None:
            self._stats['hits'] += 1
        else:
            self._stats['misses'] += 1

        return value

    def set(
        self,
        key: Union[str, Dict, tuple],
        value: Any,
        ttl: Optional[int] = None
    ) -> bool:
        """
        设置缓存值

        Args:
            key: 缓存键
            value: 缓存值
            ttl: 过期时间(秒)

        Returns:
            是否成功
        """
        cache_key = self._make_key(self._hash_key(key))
        result = self.backend.set(cache_key, value, ttl)
        if result:
            self._stats['sets'] += 1
        return result

    def delete(self, key: Union[str, Dict, tuple]) -> bool:
        """
        删除缓存值

        Args:
            key: 缓存键

        Returns:
            是否成功
        """
        cache_key = self._make_key(self._hash_key(key))
        result = self.backend.delete(cache_key)
        if result:
            self._stats['deletes'] += 1
        return result

    def clear(self) -> bool:
        """
        清空所有缓存

        Returns:
            是否成功
        """
        return self.backend.clear()

    def exists(self, key: Union[str, Dict, tuple]) -> bool:
        """
        检查键是否存在

        Args:
            key: 缓存键

        Returns:
            是否存在
        """
        cache_key = self._make_key(self._hash_key(key))
        return self.backend.exists(cache_key)

    def expire(self, key: Union[str, Dict, tuple], ttl: int) -> bool:
        """
        设置过期时间

        Args:
            key: 缓存键
            ttl: 过期时间(秒)

        Returns:
            是否成功
        """
        cache_key = self._make_key(self._hash_key(key))
        return self.backend.expire(cache_key, ttl)

    def get_or_set(
        self,
        key: Union[str, Dict, tuple],
        factory: Callable[[], T],
        ttl: Optional[int] = None
    ) -> T:
        """
        获取缓存值,如果不存在则通过工厂函数创建

        Args:
            key: 缓存键
            factory: 值工厂函数
            ttl: 过期时间(秒)

        Returns:
            缓存值
        """
        value = self.get(key)
        if value is None:
            value = factory()
            self.set(key, value, ttl)
        return value

    def get_many(self, keys: list) -> Dict[str, Any]:
        """
        批量获取缓存值

        Args:
            keys: 缓存键列表

        Returns:
            键值对字典
        """
        result = {}
        for key in keys:
            value = self.get(key)
            if value is not None:
                result[str(key)] = value
        return result

    def set_many(self, mapping: Dict[Union[str, Dict, tuple], Any], ttl: Optional[int] = None) -> bool:
        """
        批量设置缓存值

        Args:
            mapping: 键值对字典
            ttl: 过期时间(秒)

        Returns:
            是否全部成功
        """
        success = True
        for key, value in mapping.items():
            if not self.set(key, value, ttl):
                success = False
        return success

    def delete_many(self, keys: list) -> bool:
        """
        批量删除缓存值

        Args:
            keys: 缓存键列表

        Returns:
            是否全部成功
        """
        success = True
        for key in keys:
            if not self.delete(key):
                success = False
        return success

    def incr(self, key: Union[str, Dict, tuple], delta: int = 1) -> Optional[int]:
        """
        递增计数器

        Args:
            key: 缓存键
            delta: 增量

        Returns:
            新的值,失败返回None
        """
        value = self.get(key)
        if value is None:
            new_value = delta
        else:
            try:
                new_value = int(value) + delta
            except (ValueError, TypeError):
                return None

        self.set(key, new_value)
        return new_value

    def decr(self, key: Union[str, Dict, tuple], delta: int = 1) -> Optional[int]:
        """
        递减计数器

        Args:
            key: 缓存键
            delta: 减量

        Returns:
            新的值,失败返回None
        """
        return self.incr(key, -delta)

    def remember_forever(self, key: Union[str, Dict, tuple], factory: Callable[[], T]) -> T:
        """
        永久缓存并记住值

        Args:
            key: 缓存键
            factory: 值工厂函数

        Returns:
            缓存值
        """
        return self.get_or_set(key, factory, ttl=None)

    def remember(
        self,
        key: Union[str, Dict, tuple],
        ttl: int,
        factory: Callable[[], T]
    ) -> T:
        """
        缓存并记住值

        Args:
            key: 缓存键
            ttl: 过期时间(秒)
            factory: 值工厂函数

        Returns:
            缓存值
        """
        return self.get_or_set(key, factory, ttl)

    def stats(self) -> Dict[str, int]:
        """
        获取缓存统计信息

        Returns:
            统计信息字典
        """
        total_requests = self._stats['hits'] + self._stats['misses']
        hit_rate = (
            self._stats['hits'] / total_requests * 100
            if total_requests > 0
            else 0
        )

        return {
            **self._stats,
            'total_requests': total_requests,
            'hit_rate': round(hit_rate, 2),
        }

    def reset_stats(self) -> None:
        """重置统计信息"""
        self._stats = {
            'hits': 0,
            'misses': 0,
            'sets': 0,
            'deletes': 0,
        }


def cached(
    ttl: Optional[int] = None,
    key_prefix: Optional[str] = None,
    cache: Optional[CacheManager] = None
):
    """
    函数缓存装饰器

    Args:
        ttl: 过期时间(秒)
        key_prefix: 键名前缀
        cache: 缓存管理器实例

    Example:
        @cached(ttl=3600)
        def get_user(user_id: int):
            return db.query(User).filter(User.id == user_id).first()
    """

    def decorator(func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs):
            # 使用缓存管理器
            cache_manager = cache or default_cache

            # 生成缓存键
            cache_key_parts = [key_prefix or func.__name__]

            # 添加参数到键
            if args:
                cache_key_parts.extend(str(arg) for arg in args)
            if kwargs:
                sorted_kwargs = sorted(kwargs.items())
                cache_key_parts.extend(f"{k}={v}" for k, v in sorted_kwargs)

            cache_key = ":".join(cache_key_parts)

            # 尝试获取缓存
            cached_value = cache_manager.get(cache_key)
            if cached_value is not None:
                return cached_value

            # 执行函数并缓存结果
            result = func(*args, **kwargs)
            cache_manager.set(cache_key, result, ttl)

            return result

        return wrapper
    return decorator


# 创建默认缓存实例
default_cache = CacheManager()


# 便捷函数
def cache_get(key: Union[str, Dict, tuple]) -> Optional[Any]:
    """获取缓存"""
    return default_cache.get(key)


def cache_set(key: Union[str, Dict, tuple], value: Any, ttl: Optional[int] = None) -> bool:
    """设置缓存"""
    return default_cache.set(key, value, ttl)


def cache_delete(key: Union[str, Dict, tuple]) -> bool:
    """删除缓存"""
    return default_cache.delete(key)


def cache_clear() -> bool:
    """清空缓存"""
    return default_cache.clear()


def cache_exists(key: Union[str, Dict, tuple]) -> bool:
    """检查缓存是否存在"""
    return default_cache.exists(key)


def cache_incr(key: Union[str, Dict, tuple], delta: int = 1) -> Optional[int]:
    """递增计数器"""
    return default_cache.incr(key, delta)


def cache_decr(key: Union[str, Dict, tuple], delta: int = 1) -> Optional[int]:
    """递减计数器"""
    return default_cache.decr(key, delta)
