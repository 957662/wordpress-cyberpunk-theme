"""
Notification API Routes
通知相关的 API 路由
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationListResponse,
    NotificationStatsResponse,
    NotificationPreferenceResponse,
    NotificationPreferenceUpdate,
    MarkAsReadRequest
)
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["通知系统"])


@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(
    notification: NotificationCreate,
    recipient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    创建通知（管理员功能）

    - **notification**: 通知内容
    - **recipient_id**: 接收者ID
    """
    # 检查权限：只有管理员可以创建通知
    if not current_user.is_admin and not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="只有管理员可以创建通知"
        )

    try:
        result = await NotificationService.create_notification(
            db=db,
            recipient_id=recipient_id,
            **notification.model_dump()
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/", response_model=NotificationListResponse)
async def get_notifications(
    unread_only: bool = Query(False, description="只获取未读通知"),
    type: Optional[str] = Query(None, description="通知类型过滤"),
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(20, ge=1, le=100, description="每页数量"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户的通知列表

    - **unread_only**: 是否只获取未读通知
    - **type**: 通知类型过滤
    - **page**: 页码，从1开始
    - **page_size**: 每页数量，最大100
    """
    skip = (page - 1) * page_size
    result = await NotificationService.get_notifications(
        db=db,
        user_id=current_user.id,
        unread_only=unread_only,
        type=type,
        skip=skip,
        limit=page_size
    )
    return result


@router.get("/stats", response_model=NotificationStatsResponse)
async def get_notification_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户的通知统计

    返回总通知数、未读数、各类型统计
    """
    result = await NotificationService.get_notification_stats(db, current_user.id)
    return result


@router.get("/unread-count")
async def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """获取未读通知数量"""
    stats = await NotificationService.get_notification_stats(db, current_user.id)
    return {"count": stats.unread}


@router.put("/read", status_code=status.HTTP_200_OK)
async def mark_notifications_as_read(
    request: MarkAsReadRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    标记通知为已读

    - **request**: 包含要标记的通知ID列表或标记全部
    """
    if request.all:
        count = await NotificationService.mark_all_as_read(db, current_user.id)
        return {"message": f"已标记 {count} 条通知为已读", "count": count}
    elif request.notification_ids:
        count = 0
        for notification_id in request.notification_ids:
            success = await NotificationService.mark_as_read(
                db, notification_id, current_user.id
            )
            if success:
                count += 1
        return {"message": f"已标记 {count} 条通知为已读", "count": count}
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="必须提供 notification_ids 或设置 all=true"
        )


@router.post("/read-all")
async def mark_all_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """标记所有通知为已读（便捷接口）"""
    count = await NotificationService.mark_all_as_read(db, current_user.id)
    return {"message": f"已标记 {count} 条通知为已读", "count": count}


@router.put("/{notification_id}/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_notification_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    标记单个通知为已读

    - **notification_id**: 通知ID
    """
    success = await NotificationService.mark_as_read(db, notification_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="通知不存在"
        )
    return None


@router.delete("/{notification_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    删除通知

    - **notification_id**: 通知ID
    """
    success = await NotificationService.delete_notification(db, notification_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="通知不存在"
        )
    return None


@router.get("/preferences", response_model=NotificationPreferenceResponse)
async def get_notification_preferences(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户的通知偏好设置
    """
    result = await NotificationService.get_preferences(db, current_user.id)
    return result


@router.put("/preferences", response_model=NotificationPreferenceResponse)
async def update_notification_preferences(
    preferences: NotificationPreferenceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    更新当前用户的通知偏好设置

    - **preferences**: 偏好设置更新数据
    """
    result = await NotificationService.update_preferences(
        db, current_user.id, preferences
    )
    return result


@router.delete("/clear-all", status_code=status.HTTP_204_NO_CONTENT)
async def clear_all_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    清除所有已读通知

    这将删除当前用户的所有已读通知
    """
    from app.models.notification import Notification
    from sqlalchemy import and_

    # 删除所有已读通知
    db.query(Notification).filter(
        and_(
            Notification.recipient_id == current_user.id,
            Notification.is_read == True
        )
    ).delete()

    db.commit()
    return None


@router.post("/test", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_test_notification(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    创建测试通知（开发调试用）

    为当前用户创建一条测试通知
    """
    result = await NotificationService.create_notification(
        db=db,
        recipient_id=current_user.id,
        type="test",
        title="这是一条测试通知",
        content="这是一条测试通知的内容，用于测试通知功能是否正常工作。",
        priority="normal"
    )
    return result
