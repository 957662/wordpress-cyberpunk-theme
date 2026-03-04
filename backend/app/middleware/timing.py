"""
Timing Middleware
请求计时中间件
"""

import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable


class RequestTimingMiddleware(BaseHTTPMiddleware):
    """请求计时中间件"""

    def __init__(self, app, slow_request_threshold: float = 1.0):
        """
        初始化中间件

        Args:
            app: FastAPI应用
            slow_request_threshold: 慢请求阈值(秒)
        """
        super().__init__(app)
        self.slow_request_threshold = slow_request_threshold

    async def dispatch(self, request: Request, call_next: Callable):
        """处理请求并计时"""
        start_time = time.time()

        # 处理请求
        response = await call_next(request)

        # 计算处理时间
        process_time = time.time() - start_time

        # 添加响应头
        response.headers["X-Process-Time"] = str(round(process_time, 3))

        # 检查是否为慢请求
        if process_time > self.slow_request_threshold:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(
                f"Slow request detected: {request.method} {request.url.path} "
                f"took {process_time:.3f}s"
            )

        return response
