"""
Health check endpoints
"""
from fastapi import APIRouter, status
from pydantic import BaseModel
from typing import Dict, Any
import time

from ...core.config import settings

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    version: str
    timestamp: float
    uptime: float


class DetailedHealthResponse(BaseModel):
    """Detailed health check response model"""
    status: str
    version: str
    timestamp: float
    uptime: float
    details: Dict[str, Any]


# Application start time
start_time = time.time()


@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
async def health_check():
    """
    Basic health check endpoint
    Returns the current status of the API
    """
    return HealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        timestamp=time.time(),
        uptime=time.time() - start_time
    )


@router.get("/health/detailed", response_model=DetailedHealthResponse, status_code=status.HTTP_200_OK)
async def detailed_health_check():
    """
    Detailed health check endpoint
    Returns the status of various components
    """
    # Check database connection (would need actual implementation)
    db_status = "connected"  # Placeholder
    
    # Check Redis connection (would need actual implementation)
    redis_status = "connected"  # Placeholder
    
    return DetailedHealthResponse(
        status="healthy",
        version=settings.APP_VERSION,
        timestamp=time.time(),
        uptime=time.time() - start_time,
        details={
            "database": db_status,
            "redis": redis_status,
            "environment": "development" if settings.DEBUG else "production",
            "api_name": settings.APP_NAME,
        }
    )


@router.get("/ping", status_code=status.HTTP_200_OK)
async def ping():
    """
    Simple ping endpoint for monitoring
    """
    return {"message": "pong"}
