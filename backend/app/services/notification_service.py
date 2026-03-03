"""
Notification Service
通知服务
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from app.models.notification import Notification, NotificationPreference, NotificationTemplate
from app.models.user import User
from app.schemas.notification import (
    NotificationCreate,
    NotificationResponse,
    NotificationListResponse,
    NotificationStatsResponse,
    NotificationPreferenceResponse,
    NotificationPreferenceUpdate
)


class NotificationService:
    """通知服务类"""

    # 通知类型常量
    TYPE_FOLLOW = "follow"
    TYPE_LIKE_POST = "like_post"
    TYPE_LIKE_COMMENT = "like_comment"
    TYPE_COMMENT = "comment"
    TYPE_REPLY = "reply"
    TYPE_MENTION = "mention"
    TYPE_SYSTEM = "system"
    TYPE_WELCOME = "welcome"

    @staticmethod
    async def create_notification(
        db: Session,
        recipient_id: int,
        type: str,
        title: str,
        content: str,
        actor_id: Optional[int] = None,
        entity_type: Optional[str] = None,
        entity_id: Optional[int] = None,
        data: Optional[Dict[str, Any]] = None,
        priority: str = "normal",
        action_url: Optional[str] = None,
        expires_at: Optional[datetime] = None
    ) -> NotificationResponse:
        """
        创建通知

        Args:
            db: 数据库会话
            recipient_id: 接收者ID
            type: 通知类型
            title: 通知标题
            content: 通知内容
            actor_id: 发起者ID（可选）
            entity_type: 实体类型（可选）
            entity_id: 实体ID（可选）
            data: 额外数据（可选）
            priority: 优先级
            action_url: 操作链接
            expires_at: 过期时间

        Returns:
            NotificationResponse: 创建的通知
        """
        # 检查接收者是否存在
        recipient = db.query(User).filter(User.id == recipient_id).first()
        if not recipient:
            raise ValueError("接收者不存在")

        # 获取用户通知偏好
        preference = db.query(NotificationPreference).filter(
            NotificationPreference.user_id == recipient_id
        ).first()

        # 如果没有偏好设置，创建默认设置
        if not preference:
            preference = NotificationPreference(user_id=recipient_id)
            db.add(preference)
            db.commit()

        # 检查用户是否关闭了该类型的通知
        if not NotificationService._check_notification_preference(preference, type):
            return None  # 用户关闭了该类型通知

        # 创建通知
        notification = Notification(
            recipient_id=recipient_id,
            type=type,
            title=title,
            content=content,
            actor_id=actor_id,
            entity_type=entity_type,
            entity_id=entity_id,
            data=data or {},
            priority=priority,
            action_url=action_url,
            expires_at=expires_at
        )

        db.add(notification)
        db.commit()
        db.refresh(notification)

        # 这里可以触发实时通知（WebSocket）
        # await NotificationService._send_realtime_notification(notification)

        # 如果需要，发送邮件通知
        # if NotificationService._should_send_email(preference, type):
        #     await NotificationService._send_email_notification(notification)

        return NotificationService._to_response(db, notification)

    @staticmethod
    async def get_notifications(
        db: Session,
        user_id: int,
        unread_only: bool = False,
        type: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> NotificationListResponse:
        """
        获取用户通知列表

        Args:
            db: 数据库会话
            user_id: 用户ID
            unread_only: 是否只获取未读通知
            type: 通知类型过滤
            skip: 跳过数量
            limit: 限制数量

        Returns:
            NotificationListResponse: 通知列表
        """
        # 构建查询
        query = db.query(Notification).filter(
            Notification.recipient_id == user_id
        )

        # 过滤条件
        if unread_only:
            query = query.filter(Notification.is_read == False)

        if type:
            query = query.filter(Notification.type == type)

        # 过期通知过滤
        query = query.filter(
            or_(
                Notification.expires_at == None,
                Notification.expires_at > datetime.utcnow()
            )
        )

        # 排序和分页
        query = query.order_by(desc(Notification.created_at))
        total = query.count()
        notifications = query.offset(skip).limit(limit).all()

        # 转换为响应格式
        items = [NotificationService._to_response(db, n) for n in notifications]

        return NotificationListResponse(
            items=items,
            total=total,
            unread_count=NotificationService._get_unread_count(db, user_id),
            page=skip // limit + 1,
            page_size=limit
        )

    @staticmethod
    async def mark_as_read(
        db: Session,
        notification_id: int,
        user_id: int
    ) -> bool:
        """
        标记通知为已读

        Args:
            db: 数据库会话
            notification_id: 通知ID
            user_id: 用户ID

        Returns:
            bool: 是否成功
        """
        notification = db.query(Notification).filter(
            and_(
                Notification.id == notification_id,
                Notification.recipient_id == user_id
            )
        ).first()

        if not notification:
            return False

        notification.is_read = True
        notification.read_at = datetime.utcnow()
        db.commit()

        return True

    @staticmethod
    async def mark_all_as_read(db: Session, user_id: int) -> int:
        """
        标记所有通知为已读

        Args:
            db: 数据库会话
            user_id: 用户ID

        Returns:
            int: 标记的通知数量
        """
        count = db.query(Notification).filter(
            and_(
                Notification.recipient_id == user_id,
                Notification.is_read == False
            )
        ).update({
            "is_read": True,
            "read_at": datetime.utcnow()
        })

        db.commit()
        return count

    @staticmethod
    async def delete_notification(
        db: Session,
        notification_id: int,
        user_id: int
    ) -> bool:
        """
        删除通知

        Args:
            db: 数据库会话
            notification_id: 通知ID
            user_id: 用户ID

        Returns:
            bool: 是否成功
        """
        notification = db.query(Notification).filter(
            and_(
                Notification.id == notification_id,
                Notification.recipient_id == user_id
            )
        ).first()

        if not notification:
            return False

        db.delete(notification)
        db.commit()

        return True

    @staticmethod
    async def get_notification_stats(
        db: Session,
        user_id: int
    ) -> NotificationStatsResponse:
        """
        获取通知统计

        Args:
            db: 数据库会话
            user_id: 用户ID

        Returns:
            NotificationStatsResponse: 统计信息
        """
        # 总通知数（未过期）
        total = db.query(Notification).filter(
            and_(
                Notification.recipient_id == user_id,
                or_(
                    Notification.expires_at == None,
                    Notification.expires_at > datetime.utcnow()
                )
            )
        ).count()

        # 未读数
        unread = db.query(Notification).filter(
            and_(
                Notification.recipient_id == user_id,
                Notification.is_read == False,
                or_(
                    Notification.expires_at == None,
                    Notification.expires_at > datetime.utcnow()
                )
            )
        ).count()

        # 按类型统计
        type_stats = db.query(
            Notification.type,
            func.count(Notification.id).label('count')
        ).filter(
            and_(
                Notification.recipient_id == user_id,
                or_(
                    Notification.expires_at == None,
                    Notification.expires_at > datetime.utcnow()
                )
            )
        ).group_by(Notification.type).all()

        by_type = {t: 0 for t in [
            NotificationService.TYPE_FOLLOW,
            NotificationService.TYPE_LIKE_POST,
            NotificationService.TYPE_COMMENT,
            NotificationService.TYPE_MENTION,
            NotificationService.TYPE_SYSTEM
        ]}

        for type, count in type_stats:
            by_type[type] = count

        return NotificationStatsResponse(
            total=total,
            unread=unread,
            by_type=by_type
        )

    @staticmethod
    async def get_preferences(
        db: Session,
        user_id: int
    ) -> NotificationPreferenceResponse:
        """
        获取用户通知偏好设置

        Args:
            db: 数据库会话
            user_id: 用户ID

        Returns:
            NotificationPreferenceResponse: 偏好设置
        """
        preference = db.query(NotificationPreference).filter(
            NotificationPreference.user_id == user_id
        ).first()

        if not preference:
            # 创建默认偏好
            preference = NotificationPreference(user_id=user_id)
            db.add(preference)
            db.commit()
            db.refresh(preference)

        return NotificationPreferenceService._to_response(preference)

    @staticmethod
    async def update_preferences(
        db: Session,
        user_id: int,
        preferences: NotificationPreferenceUpdate
    ) -> NotificationPreferenceResponse:
        """
        更新用户通知偏好设置

        Args:
            db: 数据库会话
            user_id: 用户ID
            preferences: 偏好设置更新

        Returns:
            NotificationPreferenceResponse: 更新后的偏好设置
        """
        preference = db.query(NotificationPreference).filter(
            NotificationPreference.user_id == user_id
        ).first()

        if not preference:
            preference = NotificationPreference(user_id=user_id)
            db.add(preference)

        # 更新字段
        update_data = preferences.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(preference, field, value)

        db.commit()
        db.refresh(preference)

        return NotificationPreferenceService._to_response(preference)

    @staticmethod
    def _to_response(db: Session, notification: Notification) -> NotificationResponse:
        """转换为响应格式"""
        actor = None
        if notification.actor_id:
            actor = db.query(User).filter(User.id == notification.actor_id).first()
            if actor:
                actor = {
                    "id": actor.id,
                    "username": actor.username,
                    "full_name": actor.full_name,
                    "avatar_url": actor.avatar_url
                }

        return NotificationResponse(
            id=notification.id,
            recipient_id=notification.recipient_id,
            type=notification.type,
            title=notification.title,
            content=notification.content,
            actor=actor,
            entity_type=notification.entity_type,
            entity_id=notification.entity_id,
            data=notification.data,
            is_read=notification.is_read,
            read_at=notification.read_at,
            priority=notification.priority,
            action_url=notification.action_url,
            created_at=notification.created_at
        )

    @staticmethod
    def _get_unread_count(db: Session, user_id: int) -> int:
        """获取未读通知数量"""
        return db.query(Notification).filter(
            and_(
                Notification.recipient_id == user_id,
                Notification.is_read == False,
                or_(
                    Notification.expires_at == None,
                    Notification.expires_at > datetime.utcnow()
                )
            )
        ).count()

    @staticmethod
    def _check_notification_preference(preference: NotificationPreference, type: str) -> bool:
        """检查用户是否允许该类型通知"""
        type_mapping = {
            NotificationService.TYPE_FOLLOW: ("site_follow", "email_follow"),
            NotificationService.TYPE_LIKE_POST: ("site_like", "email_like"),
            NotificationService.TYPE_LIKE_COMMENT: ("site_like", "email_like"),
            NotificationService.TYPE_COMMENT: ("site_comment", "email_comment"),
            NotificationService.TYPE_REPLY: ("site_comment", "email_comment"),
            NotificationService.TYPE_MENTION: ("site_mention", "email_mention"),
            NotificationService.TYPE_SYSTEM: ("site_system", "email_system"),
            NotificationService.TYPE_WELCOME: ("site_system", "email_system"),
        }

        if type not in type_mapping:
            return True

        site_field, _ = type_mapping[type]
        return getattr(preference, site_field, True)


class NotificationPreferenceService:
    """通知偏好设置服务"""

    @staticmethod
    def _to_response(preference: NotificationPreference) -> NotificationPreferenceResponse:
        """转换为响应格式"""
        return NotificationPreferenceResponse(
            user_id=preference.user_id,
            email_follow=preference.email_follow,
            email_like=preference.email_like,
            email_comment=preference.email_comment,
            email_mention=preference.email_mention,
            email_system=preference.email_system,
            site_follow=preference.site_follow,
            site_like=preference.site_like,
            site_comment=preference.site_comment,
            site_mention=preference.site_mention,
            site_system=preference.site_system,
            push_follow=preference.push_follow,
            push_like=preference.push_like,
            push_comment=preference.push_comment,
            push_mention=preference.push_mention,
            push_system=preference.push_system,
            digest_frequency=preference.digest_frequency,
            do_not_disturb_start=preference.do_not_disturb_start,
            do_not_disturb_end=preference.do_not_disturb_end
        )
