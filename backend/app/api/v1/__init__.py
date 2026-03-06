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
    users,
    analytics,
    dashboard,
    notifications,
    follows,
    search,
    reading_list,
    likes,
    bookmarks,
)

# 创建v1路由
api_router = APIRouter()

# 注册路由
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(posts.router, prefix="/posts", tags=["Posts"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(tags.router, prefix="/tags", tags=["Tags"])
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])
api_router.include_router(comments.router, prefix="/comments", tags=["Comments"])
api_router.include_router(analytics.router, tags=["Analytics"])
api_router.include_router(dashboard.router, tags=["Dashboard"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(follows.router, prefix="/follows", tags=["Follows"])
api_router.include_router(search.router, prefix="/search", tags=["Search"])
api_router.include_router(reading_list.router, prefix="/reading-list", tags=["Reading List"])
api_router.include_router(likes.router, tags=["Likes"])
api_router.include_router(bookmarks.router, tags=["Bookmarks"])
