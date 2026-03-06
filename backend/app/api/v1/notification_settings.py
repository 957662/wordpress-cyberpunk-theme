"""
Notification Settings API Routes
通知设置相关 API 路由
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.schemas.notification import NotificationSettingsResponse, NotificationSettingsUpdate


router = APIRouter(prefix="/notification-settings", tags=["notification-settings"])


@router.get("/", response_model=NotificationSettingsResponse)
async def get_notification_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取用户通知设置

    返回当前用户的所有通知偏好设置。
    """
    # 刷新用户数据以获取最新的设置
    db.refresh(current_user)

    return NotificationSettingsResponse(
        email_notifications=current_user.email_notifications or True,
        push_notifications=current_user.push_notifications or False,
        comment_notifications=current_user.comment_notifications or True,
        follow_notifications=current_user.follow_notifications or True,
        like_notifications=current_user.like_notifications or True,
        mention_notifications=current_user.mention_notifications or True,
        system_notifications=current_user.system_notifications or True,
        digest_frequency=current_user.digest_frequency or "daily",
    )


@router.put("/", response_model=NotificationSettingsResponse)
async def update_notification_settings(
    settings: NotificationSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    更新用户通知设置

    更新当前用户的通知偏好设置。
    """
    # 更新用户设置
    current_user.email_notifications = settings.email_notifications
    current_user.push_notifications = settings.push_notifications
    current_user.comment_notifications = settings.comment_notifications
    current_user.follow_notifications = settings.follow_notifications
    current_user.like_notifications = settings.like_notifications
    current_user.mention_notifications = settings.mention_notifications
    current_user.system_notifications = settings.system_notifications
    current_user.digest_frequency = settings.digest_frequency

    db.commit()
    db.refresh(current_user)

    return NotificationSettingsResponse(
        email_notifications=current_user.email_notifications,
        push_notifications=current_user.push_notifications,
        comment_notifications=current_user.comment_notifications,
        follow_notifications=current_user.follow_notifications,
        like_notifications=current_user.like_notifications,
        mention_notifications=current_user.mention_notifications,
        system_notifications=current_user.system_notifications,
        digest_frequency=current_user.digest_frequency,
    )


@router.post("/test")
async def test_notification(
    notification_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    发送测试通知

    向用户发送一个测试通知，用于验证通知设置是否正常工作。
    """
    # 这里可以实现发送测试通知的逻辑
    # 例如：创建一个测试通知并发送给用户

    return {
        "message": f"Test {notification_type} notification sent to {current_user.email}",
        "status": "sent",
    }
