"""
Rate Limit Middleware
速率限制中间件
"""

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from typing import Callable, Dict
import time
from collections import defaultdict


class RateLimitMiddleware(BaseHTTPMiddleware):
    """速率限制中间件"""

    def __init__(
        self,
        app,
        requests_per_minute: int = 60,
        requests_per_hour: int = 1000,
        whitelist: list = None
    ):
        """
        初始化中间件

        Args:
            app: FastAPI应用
            requests_per_minute: 每分钟请求数限制
            requests_per_hour: 每小时请求数限制
            whitelist: 白名单IP列表
        """
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        self.whitelist = whitelist or []

        # 存储请求记录
        self.request_history: Dict[str, list] = defaultdict(list)

    def _get_client_ip(self, request: Request) -> str:
        """获取客户端IP"""
        # 检查代理头
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()

        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip

        return request.client.host if request.client else "unknown"

    def _is_whitelisted(self, ip: str) -> bool:
        """检查IP是否在白名单中"""
        return ip in self.whitelist

    def _check_rate_limit(self, client_ip: str) -> bool:
        """检查速率限制"""
        now = time.time()

        # 获取客户端请求历史
        history = self.request_history[client_ip]

        # 清理过期的请求记录
        # 保留最近1小时的记录
        self.request_history[client_ip] = [
            timestamp for timestamp in history
            if now - timestamp < 3600
        ]
        history = self.request_history[client_ip]

        # 检查每分钟限制
        minute_ago = now - 60
        requests_last_minute = sum(1 for t in history if t > minute_ago)
        if requests_last_minute >= self.requests_per_minute:
            return False

        # 检查每小时限制
        if len(history) >= self.requests_per_hour:
            return False

        # 记录此次请求
        history.append(now)

        return True

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """处理请求"""
        client_ip = self._get_client_ip(request)

        # 白名单检查
        if self._is_whitelisted(client_ip):
            return await call_next(request)

        # 速率限制检查
        if not self._check_rate_limit(client_ip):
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again later.",
                headers={
                    "Retry-After": "60",
                    "X-RateLimit-Limit": str(self.requests_per_minute),
                    "X-RateLimit-Remaining": "0",
                }
            )

        # 计算剩余请求配额
        now = time.time()
        history = self.request_history[client_ip]
        minute_ago = now - 60
        requests_last_minute = sum(1 for t in history if t > minute_ago)
        remaining = max(0, self.requests_per_minute - requests_last_minute - 1)

        # 处理请求
        response = await call_next(request)

        # 添加速率限制响应头
        response.headers["X-RateLimit-Limit"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(remaining)

        return response
