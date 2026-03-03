"""
Notification Model
通知模型
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from app.models.base import Base


class Notification(Base):
    """通知表"""

    __tablename__ = "notifications"

    # 接收者
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # 通知类型
    type = Column(String(50), nullable=False, index=True)
    # 类型: follow, like, comment, mention, reply, system, etc.

    # 通知标题和内容
    title = Column(String(255), nullable=False)
    content = Column(Text)

    # 关联数据
    actor_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    # 发起动作的用户ID（如果是系统通知则为NULL）

    entity_type = Column(String(50), nullable=True)
    # 关联实体类型: post, comment, user, etc.

    entity_id = Column(Integer, nullable=True)
    # 关联实体ID

    # 额外数据（JSON格式，用于存储扩展信息）
    data = Column(JSON, default=dict)

    # 状态
    is_read = Column(Boolean, default=False, nullable=False, index=True)
    read_at = Column(DateTime, nullable=True)

    # 优先级
    priority = Column(String(20), default="normal", nullable=False)
    # 优先级: low, normal, high, urgent

    # 过期时间
    expires_at = Column(DateTime, nullable=True)

    # 链接
    action_url = Column(String(500), nullable=True)

    def __repr__(self):
        return f"<Notification(id={self.id}, type={self.type}, recipient_id={self.recipient_id})>"


class NotificationPreference(Base):
    """通知偏好设置表"""

    __tablename__ = "notification_preferences"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # 邮件通知开关
    email_follow = Column(Boolean, default=True, nullable=False)
    email_like = Column(Boolean, default=True, nullable=False)
    email_comment = Column(Boolean, default=True, nullable=False)
    email_mention = Column(Boolean, default=True, nullable=False)
    email_system = Column(Boolean, default=True, nullable=False)

    # 站内通知开关
    site_follow = Column(Boolean, default=True, nullable=False)
    site_like = Column(Boolean, default=True, nullable=False)
    site_comment = Column(Boolean, default=True, nullable=False)
    site_mention = Column(Boolean, default=True, nullable=False)
    site_system = Column(Boolean, default=True, nullable=False)

    # 推送通知开关
    push_follow = Column(Boolean, default=False, nullable=False)
    push_like = Column(Boolean, default=False, nullable=False)
    push_comment = Column(Boolean, default=False, nullable=False)
    push_mention = Column(Boolean, default=False, nullable=False)
    push_system = Column(Boolean, default=False, nullable=False)

    # 通知汇总
    digest_frequency = Column(String(20), default="immediate", nullable=False)
    # 汇总频率: immediate, hourly, daily, weekly

    # 免打扰时段
    do_not_disturb_start = Column(String(5), nullable=True)
    # 格式: HH:MM
    do_not_disturb_end = Column(String(5), nullable=True)

    def __repr__(self):
        return f"<NotificationPreference(user_id={self.user_id})>"


class NotificationTemplate(Base):
    """通知模板表"""

    __tablename__ = "notification_templates"

    type = Column(String(50), unique=True, nullable=False, index=True)

    # 模板内容
    title_template = Column(String(255), nullable=False)
    content_template = Column(Text, nullable=False)

    # 默认优先级
    default_priority = Column(String(20), default="normal", nullable=False)

    # 是否启用
    is_enabled = Column(Boolean, default=True, nullable=False)

    # 支持的渠道
    channels = Column(JSON, default=list)
    # 渠道列表: ["email", "site", "push"]

    def __repr__(self):
        return f"<NotificationTemplate(type={self.type})>"
