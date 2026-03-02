"""
API Routes
路由聚合
"""

from fastapi import APIRouter
from app.api.v1 import api_router as v1_router

# 创建主路由
api_router = APIRouter()

# 包含v1路由
api_router.include_router(v1_router, prefix="/v1")

# 健康检查
@api_router.get("/health")
async def health_check():
    """API健康检查"""
    return {"status": "ok", "version": "1.0.0"}
