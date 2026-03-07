"""
Social Features API Router
Endpoints for follow, like, bookmark, and notifications
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.social import (
    FollowCreate, FollowResponse, FollowStats, FollowListResponse,
    LikeCreate, LikeResponse, LikeStats,
    BookmarkCreate, BookmarkFolderCreate, BookmarkFolderUpdate,
    BookmarkResponse, BookmarksListResponse, BookmarkFolderResponse,
    NotificationCreate, NotificationListResponse, NotificationStats,
    NotificationPreferences, NotificationPreferencesUpdate,
)
from app.services.social_service import SocialService

router = APIRouter(prefix="/api/social", tags=["social"])

# ============================================================================
# Follow Endpoints
# ============================================================================

@router.post("/follow/{user_id}", response_model=FollowResponse)
async def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Follow a user"""
    success, message = SocialService.follow_user(db, current_user.id, user_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    stats = SocialService.get_follow_stats(db, user_id, current_user.id)

    return FollowResponse(
        success=True,
        is_following=True,
        followers_count=stats.followers_count,
        message=message
    )


@router.delete("/follow/{user_id}", response_model=FollowResponse)
async def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Unfollow a user"""
    success, message = SocialService.unfollow_user(db, current_user.id, user_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )

    stats = SocialService.get_follow_stats(db, user_id, current_user.id)

    return FollowResponse(
        success=True,
        is_following=False,
        followers_count=stats.followers_count,
        message=message
    )


@router.get("/follow/{user_id}/stats", response_model=FollowStats)
async def get_follow_stats(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user follow statistics"""
    current_user_id = current_user.id if current_user else None
    return SocialService.get_follow_stats(db, user_id, current_user_id)


@router.get("/users/{user_id}/followers", response_model=FollowListResponse)
async def get_followers(
    user_id: int,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """Get user's followers list"""
    if page < 1 or page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid pagination parameters"
        )

    return SocialService.get_followers(db, user_id, page, page_size)


@router.get("/users/{user_id}/following", response_model=FollowListResponse)
async def get_following(
    user_id: int,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """Get users that user is following"""
    if page < 1 or page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid pagination parameters"
        )

    return SocialService.get_following(db, user_id, page, page_size)


# ============================================================================
# Like Endpoints
# ============================================================================

@router.post("/like", response_model=LikeResponse)
async def like_item(
    data: LikeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Like a post or comment"""
    return SocialService.like_item(
        db,
        current_user.id,
        data.target_id,
        data.target_type
    )


@router.get("/likes/{target_id}/stats", response_model=LikeStats)
async def get_like_stats(
    target_id: int,
    target_type: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get like statistics for a target"""
    if target_type not in ['post', 'comment']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid target type. Must be 'post' or 'comment'"
        )

    user_id = current_user.id if current_user else None
    return SocialService.get_like_stats(db, target_id, target_type, user_id)


# ============================================================================
# Bookmark Endpoints
# ============================================================================

@router.post("/bookmarks/folders", response_model=BookmarkFolderResponse)
async def create_bookmark_folder(
    data: BookmarkFolderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a bookmark folder"""
    folder = SocialService.create_bookmark_folder(db, current_user.id, data)
    return BookmarkFolderResponse(
        id=folder.id,
        user_id=folder.user_id,
        name=folder.name,
        icon=folder.icon,
        color=folder.color,
        description=folder.description,
        is_default=folder.is_default,
        bookmarks_count=0,
        created_at=folder.created_at,
        updated_at=folder.updated_at
    )


@router.post("/bookmarks", response_model=BookmarkResponse)
async def add_bookmark(
    data: BookmarkCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add or remove a bookmark"""
    return SocialService.add_bookmark(db, current_user.id, data)


@router.get("/bookmarks", response_model=BookmarksListResponse)
async def get_bookmarks(
    page: int = 1,
    page_size: int = 20,
    folder_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's bookmarks"""
    # Implementation would fetch bookmarks from database
    # This is a placeholder
    return BookmarksListResponse(
        items=[],
        total=0,
        page=page,
        page_size=page_size,
        has_more=False
    )


# ============================================================================
# Notification Endpoints
# ============================================================================

@router.get("/notifications", response_model=NotificationListResponse)
async def get_notifications(
    page: int = 1,
    page_size: int = 20,
    type_filter: str = None,
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user notifications"""
    if page < 1 or page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid pagination parameters"
        )

    return SocialService.get_notifications(
        db,
        current_user.id,
        page,
        page_size,
        type_filter,
        unread_only
    )


@router.patch("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a notification as read"""
    success = SocialService.mark_notification_read(
        db,
        notification_id,
        current_user.id
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    return {"success": True}


@router.post("/notifications/mark-all-read")
async def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark all notifications as read"""
    count = SocialService.mark_all_read(db, current_user.id)
    return {"success": True, "count": count}


@router.get("/notifications/stats", response_model=NotificationStats)
async def get_notification_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get notification statistics"""
    return SocialService.get_notification_stats(db, current_user.id)


@router.delete("/notifications/{notification_id}")
async def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a notification"""
    # Implementation would delete notification
    return {"success": True}


# ============================================================================
# Notification Preferences Endpoints
# ============================================================================

@router.get("/notifications/preferences", response_model=NotificationPreferences)
async def get_notification_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user notification preferences"""
    # Implementation would fetch preferences
    # This is a placeholder
    return NotificationPreferences(
        user_id=current_user.id,
        created_at=None,
        updated_at=None
    )


@router.patch("/notifications/preferences", response_model=NotificationPreferences)
async def update_notification_preferences(
    updates: NotificationPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update user notification preferences"""
    # Implementation would update preferences
    # This is a placeholder
    return NotificationPreferences(
        user_id=current_user.id,
        created_at=None,
        updated_at=None
    )
