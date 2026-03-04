"""
Logging Middleware
请求日志中间件
"""

import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from typing import Callable


logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """请求日志中间件"""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """处理请求"""
        # 生成请求ID
        request_id = f"{id(request)}"

        # 记录请求开始
        start_time = time.time()

        # 提取请求信息
        method = request.method
        url = str(request.url)
        client_host = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")

        logger.info(
            f"[{request_id}] Started: {method} {url} from {client_host} - {user_agent}"
        )

        # 处理请求
        try:
            response = await call_next(request)

            # 计算处理时间
            process_time = time.time() - start_time

            # 记录请求完成
            logger.info(
                f"[{request_id}] Completed: {method} {url} - "
                f"Status: {response.status_code} - "
                f"Time: {process_time:.3f}s"
            )

            # 添加响应头
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.3f}"

            return response

        except Exception as e:
            # 计算处理时间
            process_time = time.time() - start_time

            # 记录错误
            logger.error(
                f"[{request_id}] Failed: {method} {url} - "
                f"Error: {str(e)} - "
                f"Time: {process_time:.3f}s",
                exc_info=True
            )

            raise
