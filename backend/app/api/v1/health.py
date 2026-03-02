"""
Health Check Endpoints
健康检查端点
"""

from fastapi import APIRouter
from typing import Dict

router = APIRouter()


@router.get("/health")
async def health_check() -> Dict[str, str]:
    """健康检查"""
    return {
        "status": "healthy",
        "service": "CyberPress API v1",
    }


@router.get("/ping")
async def ping() -> Dict[str, str]:
    """Ping检查"""
    return {"ping": "pong"}
