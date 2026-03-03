"""
通知 API 路由
处理用户通知的 CRUD 操作
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_

from app.core.deps import db_session, get_current_user
from app.models.user import User
from app.schemas.common import PaginatedResponse
from pydantic import BaseModel, Field

router = APIRouter(prefix="/notifications", tags=["Notifications"])


# ============================================================================
# Schema 定义
# ============================================================================

class NotificationBase(BaseModel):
    """通知基础模型"""
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., max_length=2000)


class NotificationCreate(NotificationBase):
    """创建通知"""
    type: str = Field(..., regex="^(comment|like|follow|mention|system)$")
    recipient_id: int
    link_url: Optional[str] = None


class NotificationUpdate(BaseModel):
    """更新通知"""
    is_read: bool = True


class NotificationResponse(NotificationBase):
    """通知响应"""
    id: int
    type: str
    is_read: bool
    link_url: Optional[str]
    created_at: str

    class Config:
        from_attributes = True


class NotificationListResponse(PaginatedResponse):
    """通知列表响应"""
    data: List[NotificationResponse]
    unread_count: int


# ============================================================================
# 辅助函数
# ============================================================================

async def get_unread_count(db: AsyncSession, user_id: int) -> int:
    """获取未读通知数量"""
    result = await db.execute(
        select(func.count())
        .select_from(Notification)
        .where(
            and_(
                Notification.recipient_id == user_id,
                Notification.is_read == False
            )
        )
    )
    return result.scalar() or 0


# ============================================================================
# 路由定义
# ============================================================================

@router.get("", response_model=NotificationListResponse)
async def get_notifications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    is_read: Optional[bool] = None,
    notification_type: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(db_session),
):
    """
    获取当前用户的通知列表
    
    - **page**: 页码（从1开始）
    - **per_page**: 每页数量（最大100）
    - **is_read**: 过滤已读/未读（可选）
    - **notification_type**: 通知类型（可选）
    """
    # 构建查询
    query = select(Notification).where(Notification.recipient_id == current_user.id)

    # 应用过滤条件
    if is_read is not None:
        query = query.where(Notification.is_read == is_read)

    if notification_type:
        query = query.where(Notification.type == notification_type)

    # 排序：最新的在前
    query = query.order_by(Notification.created_at.desc())

    # 分页
    offset = (page - 1) * per_page
    query = query.offset(offset).limit(per_page)

    # 执行查询
    result = await db.execute(query)
    notifications = result.scalars().all()

    # 获取总数
    count_query = select(func.count()).select_from(Notification).where(
        Notification.recipient_id == current_user.id
    )
    if is_read is not None:
        count_query = count_query.where(Notification.is_read == is_read)
    if notification_type:
        count_query = count_query.where(Notification.type == notification_type)

    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # 获取未读数量
    unread_count = await get_unread_count(db, current_user.id)

    return NotificationListResponse(
        data=[
            NotificationResponse(
                id=n.id,
                title=n.title,
                content=n.content,
                type=n.type,
                is_read=n.is_read,
                link_url=n.link_url,
                created_at=n.created_at.isoformat(),
            )
            for n in notifications
        ],
        meta={
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page,
        },
        unread_count=unread_count,
    )


@router.get("/unread-count")
async def get_unread_notifications_count(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(db_session),
):
    """获取未读通知数量"""
    count = await get_unread_count(db, current_user.id)
    return {"count": count}


@router.post("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(db_session),
):
    """标记通知为已读"""
    # 获取通知
    result = await db.execute(
        select(Notification).where(
            and_(
                Notification.id == notification_id,
                Notification.recipient_id == current_user.id
            )
        )
    )
    notification = result.scalar_one_or_none()

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    # 更新状态
    notification.is_read = True
    await db.commit()
    await db.refresh(notification)

    return NotificationResponse(
        id=notification.id,
        title=notification.title,
        content=notification.content,
        type=notification.type,
        is_read=notification.is_read,
        link_url=notification.link_url,
        created_at=notification.created_at.isoformat(),
    )


@router.post("/read-all")
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(db_session),
):
    """标记所有通知为已读"""
    # 更新所有未读通知
    await db.execute(
        select(Notification)
        .where(
            and_(
                Notification.recipient_id == current_user.id,
                Notification.is_read == False
            )
        )
    )

    # 批量更新
    await db.execute(
        Notification.__table__
        .update()
        .where(
            and_(
                Notification.recipient_id == current_user.id,
                Notification.is_read == False
            )
        )
        .values(is_read=True)
    )

    await db.commit()

    return {"message": "All notifications marked as read"}


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(db_session),
):
    """删除通知"""
    # 获取通知
    result = await db.execute(
        select(Notification).where(
            and_(
                Notification.id == notification_id,
                Notification.recipient_id == current_user.id
            )
        )
    )
    notification = result.scalar_one_or_none()

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    # 删除通知
    await db.delete(notification)
    await db.commit()

    return {"message": "Notification deleted"}


# 导入通知模型（假设已定义）
class Notification:
    """通知模型（占位符，实际应该在 models 中定义）"""
    id: int
    title: str
    content: str
    type: str
    is_read: bool
    recipient_id: int
    link_url: Optional[str]
    created_at: str
