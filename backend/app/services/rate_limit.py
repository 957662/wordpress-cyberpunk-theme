"""
Rate Limit Service
速率限制服务，支持多种限制策略
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from enum import Enum
import asyncio
from dataclasses import dataclass

logger = __import__('logging').getLogger(__name__)


class RateLimitError(Exception):
    """速率限制错误"""
    def __init__(self, message: str, retry_after: Optional[float] = None):
        super().__init__(message)
        self.retry_after = retry_after


class RateLimitStrategy(str, Enum):
    """速率限制策略"""
    FIXED_WINDOW = "fixed_window"      # 固定时间窗口
    SLIDING_WINDOW = "sliding_window"   # 滑动时间窗口
    TOKEN_BUCKET = "token_bucket"       # 令牌桶算法
    LEAKY_BUCKET = "leaky_bucket"       # 漏桶算法


@dataclass
class RateLimitConfig:
    """速率限制配置"""
    max_requests: int          # 最大请求数
    window_seconds: int        # 时间窗口（秒）
    strategy: RateLimitStrategy = RateLimitStrategy.FIXED_WINDOW
    burst_size: Optional[int] = None      # 突发容量（令牌桶/漏桶）
    refill_rate: Optional[float] = None   # 令牌补充速率（每秒）


@dataclass
class RateLimitState:
    """速率限制状态"""
    request_count: int = 0
    window_start: datetime = None
    tokens: float = 0.0
    last_refill: datetime = None


class RateLimiter:
    """
    速率限制器
    支持多种速率限制策略
    """

    def __init__(self, config: RateLimitConfig):
        self.config = config
        self._states: Dict[str, RateLimitState] = {}
        self._lock = asyncio.Lock()

    async def check_limit(self, key: str) -> bool:
        """
        检查是否超过速率限制

        Args:
            key: 限制键（通常是用户ID、IP地址等）

        Returns:
            bool: True if allowed, False if rate limited

        Raises:
            RateLimitError: 如果超过限制
        """
        state = await self._get_state(key)

        if self.config.strategy == RateLimitStrategy.FIXED_WINDOW:
            return await self._check_fixed_window(state, key)
        elif self.config.strategy == RateLimitStrategy.SLIDING_WINDOW:
            return await self._check_sliding_window(state, key)
        elif self.config.strategy == RateLimitStrategy.TOKEN_BUCKET:
            return await self._check_token_bucket(state, key)
        elif self.config.strategy == RateLimitStrategy.LEAKY_BUCKET:
            return await self._check_leaky_bucket(state, key)
        else:
            raise ValueError(f"Unknown strategy: {self.config.strategy}")

    async def _check_fixed_window(self, state: RateLimitState, key: str) -> bool:
        """固定时间窗口检查"""
        now = datetime.utcnow()

        # Reset window if expired
        if state.window_start is None:
            state.window_start = now
            state.request_count = 0
        elif (now - state.window_start).total_seconds() >= self.config.window_seconds:
            state.window_start = now
            state.request_count = 0

        # Check limit
        if state.request_count >= self.config.max_requests:
            retry_after = self.config.window_seconds - (now - state.window_start).total_seconds()
            raise RateLimitError(
                f"Rate limit exceeded for {key}",
                retry_after=retry_after
            )

        state.request_count += 1
        return True

    async def _check_sliding_window(self, state: RateLimitState, key: str) -> bool:
        """滑动时间窗口检查"""
        now = datetime.utcnow()

        if state.window_start is None:
            state.window_start = now
            state.request_count = 0

        # Calculate sliding window count
        window_start = now - timedelta(seconds=self.config.window_seconds)

        # For simplicity, this implementation uses request_count
        # A production implementation would track individual request timestamps
        state.request_count += 1

        if state.request_count > self.config.max_requests:
            raise RateLimitError(
                f"Rate limit exceeded for {key}",
                retry_after=self.config.window_seconds
            )

        return True

    async def _check_token_bucket(self, state: RateLimitState, key: str) -> bool:
        """令牌桶算法检查"""
        now = datetime.utcnow()
        burst_size = self.config.burst_size or self.config.max_requests
        refill_rate = self.config.refill_rate or (
            self.config.max_requests / self.config.window_seconds
        )

        if state.tokens == 0:
            state.tokens = burst_size
            state.last_refill = now

        # Refill tokens
        if state.last_refill:
            elapsed = (now - state.last_refill).total_seconds()
            state.tokens = min(burst_size, state.tokens + elapsed * refill_rate)
            state.last_refill = now

        # Check if token available
        if state.tokens < 1:
            retry_after = (1 - state.tokens) / refill_rate
            raise RateLimitError(
                f"Rate limit exceeded for {key}",
                retry_after=retry_after
            )

        state.tokens -= 1
        return True

    async def _check_leaky_bucket(self, state: RateLimitState, key: str) -> bool:
        """漏桶算法检查"""
        now = datetime.utcnow()
        leak_rate = self.config.refill_rate or (
            self.config.max_requests / self.config.window_seconds
        )
        capacity = self.config.max_requests

        if state.last_refill is None:
            state.last_refill = now

        # Leak (remove) tokens over time
        elapsed = (now - state.last_refill).total_seconds()
        leaked = elapsed * leak_rate
        state.request_count = max(0, state.request_count - leaked)
        state.last_refill = now

        # Check if bucket is full
        if state.request_count >= capacity:
            retry_after = (state.request_count - capacity + 1) / leak_rate
            raise RateLimitError(
                f"Rate limit exceeded for {key}",
                retry_after=retry_after
            )

        state.request_count += 1
        return True

    async def _get_state(self, key: str) -> RateLimitState:
        """获取或创建限制状态"""
        async with self._lock:
            if key not in self._states:
                self._states[key] = RateLimitState()
            return self._states[key]

    async def reset(self, key: str):
        """重置限制状态"""
        async with self._lock:
            if key in self._states:
                del self._states[key]

    async def get_usage(self, key: str) -> Dict[str, Any]:
        """获取当前使用情况"""
        state = await self._get_state(key)

        return {
            "key": key,
            "request_count": state.request_count,
            "window_start": state.window_start.isoformat() if state.window_start else None,
            "tokens": state.tokens,
            "max_requests": self.config.max_requests,
            "window_seconds": self.config.window_seconds,
            "strategy": self.config.strategy.value,
        }

    async def clear_old_states(self, older_than: timedelta = timedelta(hours=1)):
        """清理旧的状态"""
        now = datetime.utcnow()

        async with self._lock:
            old_keys = [
                key for key, state in self._states.items()
                if state.window_start and (now - state.window_start) > older_than
            ]

            for key in old_keys:
                del self._states[key]


class RateLimitService:
    """
    速率限制服务
    管理多个速率限制器
    """

    def __init__(self):
        self._limiters: Dict[str, RateLimiter] = {}

    def create_limiter(self, name: str, config: RateLimitConfig) -> RateLimiter:
        """创建速率限制器"""
        limiter = RateLimiter(config)
        self._limiters[name] = limiter
        return limiter

    def get_limiter(self, name: str) -> Optional[RateLimiter]:
        """获取速率限制器"""
        return self._limiters.get(name)

    async def check_limit(self, limiter_name: str, key: str) -> bool:
        """检查速率限制"""
        limiter = self.get_limiter(limiter_name)
        if not limiter:
            raise ValueError(f"Limiter '{limiter_name}' not found")
        return await limiter.check_limit(key)

    async def reset(self, limiter_name: str, key: str):
        """重置速率限制"""
        limiter = self.get_limiter(limiter_name)
        if not limiter:
            raise ValueError(f"Limiter '{limiter_name}' not found")
        await limiter.reset(key)


# Common rate limit configurations
API_RATE_LIMIT = RateLimitConfig(
    max_requests=100,
    window_seconds=60,
    strategy=RateLimitStrategy.TOKEN_BUCKET,
    burst_size=20
)

STRICT_RATE_LIMIT = RateLimitConfig(
    max_requests=10,
    window_seconds=60,
    strategy=RateLimitStrategy.FIXED_WINDOW
)

LOGIN_RATE_LIMIT = RateLimitConfig(
    max_requests=5,
    window_seconds=300,  # 5 minutes
    strategy=RateLimitStrategy.SLIDING_WINDOW
)

# Global rate limit service instance
rate_limit_service = RateLimitService()

# Create common limiters
rate_limit_service.create_limiter("api", API_RATE_LIMIT)
rate_limit_service.create_limiter("strict", STRICT_RATE_LIMIT)
rate_limit_service.create_limiter("login", LOGIN_RATE_LIMIT)
