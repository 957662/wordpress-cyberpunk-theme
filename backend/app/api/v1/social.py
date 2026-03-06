"""
Social Features API Routes
提供完整的社交功能API端点
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.social_service_enhanced import SocialService
from app.schemas.social import FollowCreate, FollowResponse
from app.models.user import User
from app.models.notification import Notification


router = APIRouter()


def get_social_service(db: AsyncSession = Depends(get_db)) -> SocialService:
    """获取社交服务实例"""
    return SocialService(db)


# ==================== 关注功能 ====================

@router.post("/follow/{user_id}", response_model=FollowResponse)
async def follow_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    关注用户

    需要认证
    """
    return await social_service.follow_user(
        follower_id=current_user.id,
        following_id=user_id
    )


@router.delete("/follow/{user_id}")
async def unfollow_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    取消关注用户

    需要认证
    """
    await social_service.unfollow_user(
        follower_id=current_user.id,
        following_id=user_id
    )
    return {"message": "Unfollowed successfully"}


@router.get("/follow/{user_id}/check")
async def check_following(
    user_id: int,
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    检查是否关注了指定用户

    需要认证
    """
    is_following = await social_service.is_following(
        follower_id=current_user.id,
        following_id=user_id
    )
    return {"is_following": is_following}


@router.get("/followers/{user_id}")
async def get_followers(
    user_id: int,
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    social_service: SocialService = Depends(get_social_service)
):
    """
    获取用户的粉丝列表
    """
    followers, total = await social_service.get_followers(
        user_id=user_id,
        skip=skip,
        limit=limit
    )

    return {
        "followers": followers,
        "total": total
    }


@router.get("/following/{user_id}")
async def get_following(
    user_id: int,
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    social_service: SocialService = Depends(get_social_service)
):
    """
    获取用户的关注列表
    """
    following, total = await social_service.get_following(
        user_id=user_id,
        skip=skip,
        limit=limit
    )

    return {
        "following": following,
        "total": total
    }


@router.get("/suggested-users")
async def get_suggested_users(
    limit: int = Query(10, ge=1, le=50, description="返回的用户数"),
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    获取推荐用户

    需要认证
    """
    users = await social_service.get_suggested_users(
        user_id=current_user.id,
        limit=limit
    )

    return {"users": users}


# ==================== 通知功能 ====================

@router.get("/notifications", response_model=List[Notification])
async def get_notifications(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    unread_only: bool = Query(False, description="只返回未读通知"),
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    获取通知列表

    需要认证
    """
    notifications, total = await social_service.get_notifications(
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        unread_only=unreadOnly
    )

    return notifications


@router.get("/notifications/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    获取未读通知数量

    需要认证
    """
    count = await social_service.get_unread_count(current_user.id)
    return {"unread_count": count}


@router.put("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    标记通知为已读

    需要认证
    """
    await social_service.mark_notification_read(
        notification_id=notification_id,
        user_id=current_user.id
    )
    return {"message": "Notification marked as read"}


@router.put("/notifications/read-all")
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    标记所有通知为已读

    需要认证
    """
    count = await social_service.mark_all_notifications_read(current_user.id)
    return {
        "message": f"Marked {count} notifications as read",
        "count": count
    }


@router.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    删除通知

    需要认证
    """
    await social_service.delete_notification(
        notification_id=notification_id,
        user_id=current_user.id
    )
    return {"message": "Notification deleted"}


@router.delete("/notifications/clear-all")
async def clear_all_notifications(
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    清空所有通知

    需要认证
    """
    count = await social_service.clear_all_notifications(current_user.id)
    return {
        "message": f"Cleared {count} notifications",
        "count": count
    }


# ==================== Feed功能 ====================

@router.get("/feed")
async def get_feed(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    获取用户Feed（关注用户的文章）

    需要认证
    """
    posts, total = await social_service.get_feed(
        user_id=current_user.id,
        skip=skip,
        limit=limit
    )

    return {
        "posts": posts,
        "total": total
    }


@router.get("/feed/explore")
async def get_explore_feed(
    skip: int = Query(0, ge=0, description="跳过的记录数"),
    limit: int = Query(20, ge=1, le=100, description="返回的记录数"),
    social_service: SocialService = Depends(get_social_service)
):
    """
    获取探索Feed（推荐文章）

    不需要认证
    """
    posts, total = await social_service.get_explore_feed(
        skip=skip,
        limit=limit
    )

    return {
        "posts": posts,
        "total": total
    }


# ==================== 统计功能 ====================

@router.get("/stats")
async def get_social_stats(
    current_user: User = Depends(get_current_user),
    social_service: SocialService = Depends(get_social_service)
):
    """
    获取社交统计信息

    需要认证
    """
    return await social_service.get_social_stats(current_user.id)


@router.get("/stats/{user_id}")
async def get_user_social_stats(
    user_id: int,
    social_service: SocialService = Depends(get_social_service)
):
    """
    获取指定用户的社交统计信息

    不需要认证
    """
    return await social_service.get_social_stats(user_id)
