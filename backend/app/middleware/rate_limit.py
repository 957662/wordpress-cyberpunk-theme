"""
Rate limiting middleware
"""
from fastapi import Request, HTTPException
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, Tuple
import time

class RateLimiter:
    """Simple in-memory rate limiter"""

    def __init__(self):
        # Store request counts: {key: (count, window_start)}
        self.requests: Dict[str, Tuple[int, datetime]] = defaultdict(
            lambda: (0, datetime.utcnow())
        )

    def is_allowed(
        self,
        key: str,
        max_requests: int,
        window_seconds: int
    ) -> bool:
        """Check if request is allowed"""
        now = datetime.utcnow()
        count, window_start = self.requests[key]

        # Reset if window expired
        if (now - window_start).total_seconds() >= window_seconds:
            count = 0
            window_start = now

        # Check limit
        if count >= max_requests:
            return False

        # Increment counter
        self.requests[key] = (count + 1, window_start)
        return True


# Global rate limiter instance
rate_limiter = RateLimiter()


# Rate limit configurations
RATE_LIMITS = {
    "default": (100, 60),  # 100 requests per minute
    "strict": (10, 60),    # 10 requests per minute
    "auth": (5, 300),      # 5 requests per 5 minutes (for login/register)
    "upload": (20, 3600),  # 20 uploads per hour
}


async def rate_limit_middleware(
    request: Request,
    limit_type: str = "default"
):
    """Rate limiting middleware"""
    # Get client identifier
    client_ip = request.client.host if request.client else "unknown"
    user_id = getattr(request.state, "user_id", None)

    # Create rate limit key
    key = f"{limit_type}:{user_id or client_ip}"

    # Get rate limit config
    max_requests, window_seconds = RATE_LIMITS.get(
        limit_type,
        RATE_LIMITS["default"]
    )

    # Check if allowed
    if not rate_limiter.is_allowed(key, max_requests, window_seconds):
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Try again in {window_seconds} seconds.",
            headers={
                "Retry-After": str(window_seconds),
                "X-RateLimit-Limit": str(max_requests),
                "X-RateLimit-Window": str(window_seconds),
            }
        )

    # Add rate limit headers
    current_count = rate_limiter.requests[key][0]
    request.state.rate_limit = {
        "limit": max_requests,
        "remaining": max_requests - current_count,
        "window": window_seconds,
    }
