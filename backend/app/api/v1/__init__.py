"""API v1 Package"""

from fastapi import APIRouter
from app.api.v1 import (
    posts,
    categories,
    tags,
    projects,
    health,
    auth,
    comments,
)

# 创建v1路由
api_router = APIRouter()

# 注册路由
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(posts.router, prefix="/posts", tags=["Posts"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(tags.router, prefix="/tags", tags=["Tags"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(comments.router, prefix="/comments", tags=["Comments"])
