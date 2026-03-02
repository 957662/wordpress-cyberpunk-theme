"""
Notification Service
提供通知和消息推送功能
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.notification import Notification, NotificationPreference
from app.schemas.notification import (
    NotificationCreate,
    NotificationUpdate,
    NotificationFilter,
    NotificationPreferenceUpdate
)


class NotificationService:
    """通知服务类"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_notification(
        self,
        notification: NotificationCreate
    ) -> Notification:
        """创建通知"""
        db_notification = Notification(**notification.dict())
        db_notification.is_read = False
        db_notification.created_at = datetime.now()

        self.db.add(db_notification)
        await self.db.commit()
        await self.db.refresh(db_notification)

        return db_notification

    async def bulk_create_notifications(
        self,
        notifications: List[NotificationCreate]
    ) -> List[Notification]:
        """批量创建通知"""
        db_notifications = [
            Notification(**n.dict(), is_read=False, created_at=datetime.now())
            for n in notifications
        ]

        self.db.add_all(db_notifications)
        await self.db.commit()

        for notification in db_notifications:
            await self.db.refresh(notification)

        return db_notifications

    async def get_user_notifications(
        self,
        user_id: str,
        filters: Optional[NotificationFilter] = None
    ) -> List[Notification]:
        """获取用户通知列表"""
        query = select(Notification).where(Notification.user_id == user_id)

        if filters:
            if filters.is_read is not None:
                query = query.where(Notification.is_read == filters.is_read)

            if filters.type:
                query = query.where(Notification.type == filters.type)

            if filters.start_date:
                query = query.where(Notification.created_at >= filters.start_date)

            if filters.end_date:
                query = query.where(Notification.created_at <= filters.end_date)

        query = query.order_by(Notification.created_at.desc())

        if filters and filters.limit:
            query = query.limit(filters.limit)

        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_unread_count(self, user_id: str) -> int:
        """获取未读通知数量"""
        count = await self.db.scalar(
            select(func.count(Notification.id))
            .where(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read == False
                )
            )
        )
        return count or 0

    async def mark_as_read(
        self,
        notification_id: str,
        user_id: str
    ) -> Optional[Notification]:
        """标记通知为已读"""
        result = await self.db.execute(
            select(Notification)
            .where(
                and_(
                    Notification.id == notification_id,
                    Notification.user_id == user_id
                )
            )
        )
        notification = result.scalar_one_or_none()

        if notification:
            notification.is_read = True
            notification.read_at = datetime.now()
            await self.db.commit()
            await self.db.refresh(notification)

        return notification

    async def mark_all_as_read(self, user_id: str) -> int:
        """标记所有通知为已读"""
        result = await self.db.execute(
            select(Notification)
            .where(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read == False
                )
            )
        )
        notifications = result.scalars().all()

        for notification in notifications:
            notification.is_read = True
            notification.read_at = datetime.now()

        await self.db.commit()
        return len(notifications)

    async def delete_notification(
        self,
        notification_id: str,
        user_id: str
    ) -> bool:
        """删除通知"""
        result = await self.db.execute(
            select(Notification)
            .where(
                and_(
                    Notification.id == notification_id,
                    Notification.user_id == user_id
                )
            )
        )
        notification = result.scalar_one_or_none()

        if notification:
            await self.db.delete(notification)
            await self.db.commit()
            return True

        return False

    async def get_user_preferences(
        self,
        user_id: str
    ) -> Optional[NotificationPreference]:
        """获取用户通知偏好"""
        result = await self.db.execute(
            select(NotificationPreference)
            .where(NotificationPreference.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def update_preferences(
        self,
        user_id: str,
        preferences: NotificationPreferenceUpdate
    ) -> NotificationPreference:
        """更新用户通知偏好"""
        result = await self.db.execute(
            select(NotificationPreference)
            .where(NotificationPreference.user_id == user_id)
        )
        db_preferences = result.scalar_one_or_none()

        if not db_preferences:
            db_preferences = NotificationPreference(
                user_id=user_id,
                **preferences.dict()
            )
            self.db.add(db_preferences)
        else:
            for key, value in preferences.dict(exclude_unset=True).items():
                setattr(db_preferences, key, value)

        await self.db.commit()
        await self.db.refresh(db_preferences)

        return db_preferences

    async def cleanup_old_notifications(
        self,
        days: int = 30,
        keep_unread: bool = True
    ) -> int:
        """清理旧通知"""
        cutoff_date = datetime.now() - timedelta(days=days)

        query = select(Notification).where(
            and_(
                Notification.created_at < cutoff_date,
                Notification.is_read == True if keep_unread else True
            )
        )

        result = await self.db.execute(query)
        notifications = result.scalars().all()

        for notification in notifications:
            await self.db.delete(notification)

        await self.db.commit()
        return len(notifications)

    async def send_comment_notification(
        self,
        user_id: str,
        commenter_name: str,
        post_title: str,
        post_slug: str,
        comment_content: str
    ) -> Notification:
        """发送评论通知"""
        return await self.create_notification(
            NotificationCreate(
                user_id=user_id,
                type='comment',
                title=f'新评论: {commenter_name} 评论了你的文章',
                message=f'{commenter_name} 在文章 "{post_title}" 下发表了评论: {comment_content[:100]}...',
                action_url=f'/blog/{post_slug}#comments',
                data={
                    'commenter_name': commenter_name,
                    'post_title': post_title,
                    'post_slug': post_slug
                }
            )
        )

    async def send_like_notification(
        self,
        user_id: str,
        liker_name: str,
        post_title: str,
        post_slug: str
    ) -> Notification:
        """发送点赞通知"""
        return await self.create_notification(
            NotificationCreate(
                user_id=user_id,
                type='like',
                title=f'新点赞: {liker_name} 喜欢了你的文章',
                message=f'{liker_name} 喜欢了你的文章 "{post_title}"',
                action_url=f'/blog/{post_slug}',
                data={
                    'liker_name': liker_name,
                    'post_title': post_title,
                    'post_slug': post_slug
                }
            )
        )

    async def send_follower_notification(
        self,
        user_id: str,
        follower_name: str,
        follower_id: str
    ) -> Notification:
        """发送关注者通知"""
        return await self.create_notification(
            NotificationCreate(
                user_id=user_id,
                type='follow',
                title=f'新关注者: {follower_name}',
                message=f'{follower_name} 开始关注你',
                action_url=f'/profile/${follower_id}',
                data={
                    'follower_name': follower_name,
                    'follower_id': follower_id
                }
            )
        )

    async def send_system_notification(
        self,
        user_ids: List[str],
        title: str,
        message: str,
        action_url: Optional[str] = None
    ) -> List[Notification]:
        """发送系统通知"""
        notifications = [
            NotificationCreate(
                user_id=user_id,
                type='system',
                title=title,
                message=message,
                action_url=action_url
            )
            for user_id in user_ids
        ]

        return await self.bulk_create_notifications(notifications)


# 导出 func
from sqlalchemy import func
