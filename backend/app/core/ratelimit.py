"""
Rate Limiter
API 速率限制器
"""

from functools import wraps
from typing import Callable, Optional
from datetime import datetime, timedelta

from fastapi import Request, HTTPException, status
from redis import Redis
from redis.exceptions import RedisError

from app.core.config import settings


class RateLimiter:
    """速率限制器"""

    def __init__(self):
        self.redis = Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            db=settings.REDIS_DB,
            password=settings.REDIS_PASSWORD,
            decode_responses=True,
        )

    def _get_key(self, prefix: str, identifier: str) -> str:
        """生成 Redis 键"""
        return f"ratelimit:{prefix}:{identifier}"

    def is_allowed(
        self,
        prefix: str,
        identifier: str,
        limit: int,
        window: int,
    ) -> bool:
        """
        检查是否允许请求

        Args:
            prefix: 键前缀
            identifier: 唯一标识符（如 IP、用户 ID）
            limit: 限制次数
            window: 时间窗口（秒）

        Returns:
            是否允许请求
        """
        key = self._get_key(prefix, identifier)

        try:
            # 使用 Redis 的 INCR 实现计数器
            pipe = self.redis.pipeline()
            pipe.incr(key)
            pipe.expire(key, window)
            current = pipe.execute()[0]

            return current <= limit
        except RedisError:
            # Redis 出错时，默认允许请求
            return True

    def get_remaining(
        self,
        prefix: str,
        identifier: str,
        limit: int,
    ) -> int:
        """
        获取剩余请求次数

        Args:
            prefix: 键前缀
            identifier: 唯一标识符
            limit: 限制次数

        Returns:
            剩余次数
        """
        key = self._get_key(prefix, identifier)

        try:
            current = int(self.redis.get(key) or 0)
            return max(0, limit - current)
        except RedisError:
            return limit

    def reset(self, prefix: str, identifier: str) -> bool:
        """
        重置计数器

        Args:
            prefix: 键前缀
            identifier: 唯一标识符

        Returns:
            是否成功
        """
        key = self._get_key(prefix, identifier)

        try:
            self.redis.delete(key)
            return True
        except RedisError:
            return False


# 创建全局实例
rate_limiter = RateLimiter()


def rate_limit(
    prefix: str,
    limit: int,
    window: int,
    identifier_func: Optional[Callable[[Request], str]] = None,
):
    """
    速率限制装饰器

    Args:
        prefix: 键前缀
        limit: 限制次数
        window: 时间窗口（秒）
        identifier_func: 自定义标识符函数，默认使用客户端 IP

    Example:
        @rate_limit("api", 100, 60)  # 每分钟 100 次
        async def endpoint():
            pass
    """

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # 获取 Request 对象
            request: Optional[Request] = kwargs.get("request")
            if not request:
                # 尝试从参数中获取
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                        break

            if not request:
                # 如果找不到 Request 对象，直接执行
                return await func(*args, **kwargs)

            # 获取标识符
            if identifier_func:
                identifier = identifier_func(request)
            else:
                # 默认使用客户端 IP
                identifier = request.client.host if request.client else "unknown"

            # 检查是否允许请求
            if not rate_limiter.is_allowed(prefix, identifier, limit, window):
                remaining = rate_limiter.get_remaining(prefix, identifier, limit)
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail={
                        "error": "Too many requests",
                        "limit": limit,
                        "window": window,
                        "remaining": remaining,
                    },
                )

            return await func(*args, **kwargs)

        return wrapper

    return decorator


# ============================================
# 预定义的速率限制器
# ============================================

# API 通用限制：每分钟 100 次
api_rate_limit = rate_limit("api", 100, 60)

# 登录限制：每分钟 5 次
login_rate_limit = rate_limit("login", 5, 60)

# 注册限制：每小时 3 次
register_rate_limit = rate_limit("register", 3, 3600)

# 评论限制：每分钟 10 次
comment_rate_limit = rate_limit("comment", 10, 60)

# 搜索限制：每分钟 20 次
search_rate_limit = rate_limit("search", 20, 60)

# 文件上传限制：每小时 10 次
upload_rate_limit = rate_limit("upload", 10, 3600)


# ============================================
# 用户标识符函数
# ============================================

def get_user_id(request: Request) -> str:
    """获取用户 ID 作为标识符"""
    # 从认证信息中获取用户 ID
    if hasattr(request.state, "user"):
        return f"user:{request.state.user.id}"
    # 回退到 IP
    return f"ip:{request.client.host}" if request.client else "unknown"


def get_ip_address(request: Request) -> str:
    """获取 IP 地址作为标识符"""
    return request.client.host if request.client else "unknown"


# ============================================
# 用户级别的速率限制装饰器
# ============================================

def user_rate_limit(limit: int, window: int):
    """用户级别速率限制"""
    return rate_limit("user", limit, window, identifier_func=get_user_id)


# IP 级别的速率限制装饰器
def ip_rate_limit(limit: int, window: int):
    """IP 级别速率限制"""
    return rate_limit("ip", limit, window, identifier_func=get_ip_address)
