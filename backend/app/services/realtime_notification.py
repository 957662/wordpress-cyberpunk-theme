"""
实时通知服务
处理实时通知的创建、发送和管理
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from sqlalchemy.orm import selectinload

from app.models.notification import Notification
from app.models.user import User
from app.core.websocket_manager import get_websocket_manager
import logging

logger = logging.getLogger(__name__)


class RealtimeNotificationService:
    """实时通知服务"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.ws_manager = get_websocket_manager()

    async def create_notification(
        self,
        user_id: int,
        notification_type: str,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
        action_url: Optional[str] = None,
        priority: str = "normal",
    ) -> Notification:
        """
        创建并发送通知

        Args:
            user_id: 接收通知的用户 ID
            notification_type: 通知类型
            title: 通知标题
            message: 通知消息
            data: 附加数据
            action_url: 操作链接
            priority: 优先级 (low, normal, high, urgent)

        Returns:
            创建的通知对象
        """
        # 创建通知记录
        notification = Notification(
            user_id=user_id,
            type=notification_type,
            title=title,
            message=message,
            data=data or {},
            action_url=action_url,
            priority=priority,
            is_read=False,
            created_at=datetime.utcnow(),
        )

        self.db.add(notification)
        await self.db.commit()
        await self.db.refresh(notification)

        # 实时推送给用户
        await self._push_to_user(notification)

        logger.info(f"通知已创建并推送给用户 {user_id}: {title}")

        return notification

    async def _push_to_user(self, notification: Notification) -> bool:
        """
        实时推送通知给用户

        Args:
            notification: 通知对象

        Returns:
            是否推送成功
        """
        # 检查用户是否在线
        if not self.ws_manager.is_user_online(notification.user_id):
            logger.debug(f"用户 {notification.user_id} 不在线，通知将被缓存")
            return False

        # 构建推送数据
        push_data = {
            "id": notification.id,
            "type": notification.type,
            "title": notification.title,
            "message": notification.message,
            "data": notification.data,
            "action_url": notification.action_url,
            "priority": notification.priority,
            "created_at": notification.created_at.isoformat(),
        }

        # 推送给用户的所有连接
        success_count = await self.ws_manager.send_to_user(
            user_id=notification.user_id,
            message_type="notification",
            data=push_data,
        )

        return success_count > 0

    async def broadcast_to_all(
        self,
        notification_type: str,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
        exclude_user_ids: Optional[List[int]] = None,
    ) -> int:
        """
        向所有在线用户广播通知

        Args:
            notification_type: 通知类型
            title: 通知标题
            message: 通知消息
            data: 附加数据
            exclude_user_ids: 要排除的用户 ID 列表

        Returns:
            推送成功的用户数
        """
        exclude_user_ids = exclude_user_ids or []

        push_data = {
            "type": notification_type,
            "title": title,
            "message": message,
            "data": data or {},
            "broadcast": True,
        }

        # 向所有在线用户广播
        success_count = 0
        for user_id in self.ws_manager.get_online_users():
            if user_id in exclude_user_ids:
                continue
            count = await self.ws_manager.send_to_user(
                user_id=user_id,
                message_type="notification",
                data=push_data,
            )
            if count > 0:
                success_count += 1

        logger.info(f"广播通知已推送给 {success_count} 个在线用户")

        return success_count

    async def notify_followers(
        self,
        follower_ids: List[int],
        notification_type: str,
        title: str,
        message: str,
        data: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, int]:
        """
        通知关注者

        Args:
            follower_ids: 关注者 ID 列表
            notification_type: 通知类型
            title: 通知标题
            message: 通知消息
            data: 附加数据

        Returns:
            推送统计 {成功数, 失败数}
        """
        success_count = 0
        failed_count = 0

        for user_id in follower_ids:
            try:
                # 创建通知记录
                await self.create_notification(
                    user_id=user_id,
                    notification_type=notification_type,
                    title=title,
                    message=message,
                    data=data,
                )
                success_count += 1
            except Exception as e:
                logger.error(f"通知用户 {user_id} 失败: {e}")
                failed_count += 1

        return {"success": success_count, "failed": failed_count}

    async def mark_as_read(
        self,
        notification_id: int,
        user_id: int,
    ) -> bool:
        """
        标记通知为已读

        Args:
            notification_id: 通知 ID
            user_id: 用户 ID

        Returns:
            是否成功
        """
        result = await self.db.execute(
            select(Notification).where(
                and_(
                    Notification.id == notification_id,
                    Notification.user_id == user_id,
                )
            )
        )
        notification = result.scalar_one_or_none()

        if not notification:
            return False

        notification.is_read = True
        notification.read_at = datetime.utcnow()
        await self.db.commit()

        # 推送已读状态
        await self.ws_manager.send_to_user(
            user_id=user_id,
            message_type="notification_read",
            data={"notification_id": notification_id},
        )

        return True

    async def mark_all_as_read(self, user_id: int) -> int:
        """
        标记所有通知为已读

        Args:
            user_id: 用户 ID

        Returns:
            标记的通知数
        """
        result = await self.db.execute(
            select(Notification).where(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read == False,
                )
            )
        )
        notifications = result.scalars().all()

        count = 0
        for notification in notifications:
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            count += 1

        await self.db.commit()

        # 推送全部已读状态
        await self.ws_manager.send_to_user(
            user_id=user_id,
            message_type="all_notifications_read",
            data={"count": count},
        )

        return count

    async def get_unread_count(self, user_id: int) -> int:
        """
        获取未读通知数

        Args:
            user_id: 用户 ID

        Returns:
            未读通知数
        """
        result = await self.db.execute(
            select(func.count(Notification.id))
            .where(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read == False,
                )
            )
        )
        return result.scalar() or 0

    async def get_notifications(
        self,
        user_id: int,
        unread_only: bool = False,
        limit: int = 50,
        offset: int = 0,
    ) -> List[Notification]:
        """
        获取用户通知列表

        Args:
            user_id: 用户 ID
            unread_only: 是否只获取未读通知
            limit: 返回数量
            offset: 偏移量

        Returns:
            通知列表
        """
        query = select(Notification).where(Notification.user_id == user_id)

        if unread_only:
            query = query.where(Notification.is_read == False)

        query = query.order_by(Notification.created_at.desc())
        query = query.limit(limit).offset(offset)

        result = await self.db.execute(query)
        return result.scalars().all()

    async def delete_old_notifications(
        self,
        days: int = 30,
    ) -> int:
        """
        删除旧通知

        Args:
            days: 保留天数

        Returns:
            删除的通知数
        """
        cutoff_date = datetime.utcnow() - timedelta(days=days)

        result = await self.db.execute(
            select(Notification).where(
                and_(
                    Notification.is_read == True,
                    Notification.created_at < cutoff_date,
                )
            )
        )
        old_notifications = result.scalars().all()

        count = len(old_notifications)
        for notification in old_notifications:
            await self.db.delete(notification)

        await self.db.commit()

        logger.info(f"删除了 {count} 个旧通知")

        return count

    async def send_typing_indicator(
        self,
        conversation_id: int,
        user_id: int,
        is_typing: bool,
    ) -> None:
        """
        发送正在输入指示器

        Args:
            conversation_id: 对话 ID
            user_id: 用户 ID
            is_typing: 是否正在输入
        """
        # 推送到对话房间
        await self.ws_manager.send_to_room(
            room_id=f"conversation_{conversation_id}",
            message_type="typing_indicator",
            data={
                "user_id": user_id,
                "is_typing": is_typing,
            },
        )

    async def notify_new_message(
        self,
        conversation_id: int,
        message_id: int,
        sender_id: int,
        recipient_id: int,
        content_preview: str,
    ) -> None:
        """
        通知新消息

        Args:
            conversation_id: 对话 ID
            message_id: 消息 ID
            sender_id: 发送者 ID
            recipient_id: 接收者 ID
            content_preview: 内容预览
        """
        # 创建通知
        await self.create_notification(
            user_id=recipient_id,
            notification_type="new_message",
            title="新消息",
            message=content_preview[:100] + "..." if len(content_preview) > 100 else content_preview,
            data={
                "conversation_id": conversation_id,
                "message_id": message_id,
                "sender_id": sender_id,
            },
            action_url=f"/messages?conversation={conversation_id}",
            priority="normal",
        )

        # 推送到对话房间
        await self.ws_manager.send_to_room(
            room_id=f"conversation_{conversation_id}",
            message_type="new_message",
            data={
                "message_id": message_id,
                "conversation_id": conversation_id,
                "sender_id": sender_id,
                "content_preview": content_preview,
            },
            exclude_connection_id=None,  # 不排除任何人，除了发送者在客户端处理
        )


def get_realtime_notification_service(db: AsyncSession) -> RealtimeNotificationService:
    """获取实时通知服务实例"""
    return RealtimeNotificationService(db)
