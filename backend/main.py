"""
CyberPress Backend - FastAPI Application
赛博朋克博客平台后端服务
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
from typing import Dict, Any

from app.api.routes import api_router
from app.core.config import settings
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时
    setup_logging()
    print("🚀 CyberPress Backend Starting...")
    print(f"📡 API Version: {settings.API_VERSION}")
    print(f"🔧 Debug Mode: {settings.DEBUG}")
    yield
    # 关闭时
    print("🛑 CyberPress Backend Shutting down...")


# 创建 FastAPI 应用
app = FastAPI(
    title="CyberPress API",
    description="赛博朋克风格博客平台后端服务",
    version=settings.API_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 健康检查端点
@app.get("/health", tags=["Health"])
async def health_check() -> Dict[str, Any]:
    """健康检查端点"""
    return {
        "status": "healthy",
        "service": "CyberPress Backend",
        "version": settings.API_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# 根路径
@app.get("/", tags=["Root"])
async def root() -> Dict[str, Any]:
    """根路径"""
    return {
        "message": "Welcome to CyberPress API",
        "docs": "/api/docs",
        "version": settings.API_VERSION,
    }


# 注册路由
app.include_router(api_router, prefix="/api")


# 全局异常处理
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """HTTP异常处理"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.detail,
            "status_code": exc.status_code,
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """通用异常处理"""
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "status_code": 500,
        },
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info",
    )
