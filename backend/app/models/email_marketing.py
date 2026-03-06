"""
邮件营销数据模型
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB

from app.models.base import Base


class CampaignStatus(str, type):
    """活动状态"""
    DRAFT = "draft"           # 草稿
    SCHEDULED = "scheduled"   # 已排期
    SENDING = "sending"       # 发送中
    SENT = "sent"             # 已发送
    PAUSED = "paused"         # 已暂停
    CANCELLED = "cancelled"   # 已取消


class EmailCampaign(Base):
    """邮件营销活动模型"""

    __tablename__ = "email_campaigns"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(500), nullable=False)
    subject = Column(String(500), nullable=False)
    preheader = Column(String(500), nullable=True)  # 预览文本

    # 邮件内容
    content_html = Column(Text, nullable=False)
    content_text = Column(Text, nullable=True)
    template_id = Column(String(100), nullable=True)

    # 收件人
    recipient_list = Column(Text, nullable=False)  # JSON: [user_id1, user_id2, ...]
    segment_id = Column(Integer, nullable=True)  # 用户分群ID
    recipient_count = Column(Integer, default=0)

    # 发送设置
    status = Column(String(20), default=CampaignStatus.DRAFT, index=True)
    scheduled_at = Column(DateTime, nullable=True, index=True)
    sent_at = Column(DateTime, nullable=True)

    # 追踪设置
    track_opens = Column(Boolean, default=True)
    track_clicks = Column(Boolean, default=True)

    # 统计数据
    sent_count = Column(Integer, default=0)
    delivered_count = Column(Integer, default=0)
    opened_count = Column(Integer, default=0)
    clicked_count = Column(Integer, default=0)
    bounced_count = Column(Integer, default=0)
    unsubscribed_count = Column(Integer, default=0)

    # 转化统计
    conversion_rate = Column(Float, default=0.0)

    # 元数据
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # 关联关系
    user = relationship("User", back_populates="email_campaigns")
    emails = relationship("EmailMessage", back_populates="campaign", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<EmailCampaign(id={self.id}, name='{self.name}', status='{self.status}')>"

    @property
    def open_rate(self) -> float:
        """打开率"""
        if self.delivered_count == 0:
            return 0.0
        return round((self.opened_count / self.delivered_count) * 100, 2)

    @property
    def click_rate(self) -> float:
        """点击率"""
        if self.delivered_count == 0:
            return 0.0
        return round((self.clicked_count / self.delivered_count) * 100, 2)

    @property
    def bounce_rate(self) -> float:
        """退回率"""
        if self.sent_count == 0:
            return 0.0
        return round((self.bounced_count / self.sent_count) * 100, 2)

    @property
    def is_ready_to_send(self) -> bool:
        """是否准备好发送"""
        return (
            self.status == CampaignStatus.DRAFT and
            self.recipient_count > 0 and
            self.content_html
        )

    def update_stats(self):
        """更新统计数据"""
        self.conversion_rate = self.open_rate

    def calculate_recipient_count(self):
        """计算收件人数量"""
        import json
        if self.recipient_list:
            recipients = json.loads(self.recipient_list)
            self.recipient_count = len(recipients)


class EmailMessage(Base):
    """邮件消息模型"""

    __tablename__ = "email_messages"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("email_campaigns.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)  # 收件人

    # 邮件信息
    to_email = Column(String(255), nullable=False)
    to_name = Column(String(255), nullable=True)
    subject = Column(String(500), nullable=False)

    # 状态
    status = Column(String(20), default="pending", index=True)  # pending, sent, delivered, bounced, opened, clicked
    sent_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)

    # 追踪
    opened_at = Column(DateTime, nullable=True)
    open_count = Column(Integer, default=0)
    clicked_at = Column(DateTime, nullable=True)
    click_count = Column(Integer, default=0)

    # 错误信息
    error_message = Column(Text, nullable=True)

    # 元数据
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联关系
    campaign = relationship("EmailCampaign", back_populates="emails")
    recipient = relationship("User", back_populates="received_emails", foreign_keys=[user_id])

    def __repr__(self):
        return f"<EmailMessage(id={self.id}, to='{self.to_email}', status='{self.status}')>"

    def mark_as_sent(self):
        """标记为已发送"""
        self.status = "sent"
        self.sent_at = datetime.utcnow()

    def mark_as_delivered(self):
        """标记为已送达"""
        self.status = "delivered"
        self.delivered_at = datetime.utcnow()
        # 更新活动统计
        if self.campaign:
            self.campaign.delivered_count += 1

    def mark_as_opened(self):
        """标记为已打开"""
        if self.status != "opened":
            self.status = "opened"
            self.opened_at = datetime.utcnow()
            self.open_count += 1
            # 更新活动统计
            if self.campaign:
                self.campaign.opened_count += 1

    def mark_as_clicked(self):
        """标记为已点击"""
        if self.status != "clicked":
            self.status = "clicked"
            self.clicked_at = datetime.utcnow()
            self.click_count += 1
            # 更新活动统计
            if self.campaign:
                self.campaign.clicked_count += 1

    def mark_as_bounced(self, error_message: str):
        """标记为退回"""
        self.status = "bounced"
        self.error_message = error_message
        # 更新活动统计
        if self.campaign:
            self.campaign.bounced_count += 1


class EmailTemplate(Base):
    """邮件模板模型"""

    __tablename__ = "email_templates"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)

    # 模板内容
    subject = Column(String(500), nullable=False)
    html_content = Column(Text, nullable=False)
    text_content = Column(Text, nullable=True)

    # 模板变量（用于替换）
    variables = Column(JSONB, nullable=True)  # {"{{name}}": "User Name", "{{link}}": "Article Link"}

    # 分类
    category = Column(String(100), nullable=True)  # newsletter, notification, promotion
    thumbnail = Column(String(500), nullable=True)

    # 使用统计
    usage_count = Column(Integer, default=0)

    # 元数据
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联关系
    user = relationship("User", back_populates="email_templates")

    def __repr__(self):
        return f"<EmailTemplate(id={self.id}, name='{self.name}', category='{self.category}')>"

    def increment_usage(self):
        """增加使用次数"""
        self.usage_count += 1


class EmailSubscriber(Base):
    """邮件订阅者模型"""

    __tablename__ = "email_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # 可选，可以是注册用户
    email = Column(String(255), nullable=False, unique=True, index=True)
    name = Column(String(255), nullable=True)

    # 订阅信息
    is_active = Column(Boolean, default=True, index=True)
    subscribed_at = Column(DateTime, default=datetime.utcnow)
    unsubscribed_at = Column(DateTime, nullable=True)
    unsubscribe_reason = Column(Text, nullable=True)

    # 订阅偏好
    preferences = Column(JSONB, nullable=True)  # {"newsletter": true, "promotions": false}

    # 统计
    emails_sent = Column(Integer, default=0)
    emails_opened = Column(Integer, default=0)
    emails_clicked = Column(Integer, default=0)

    # 元数据
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联关系
    user = relationship("User", back_populates="email_subscriptions", foreign_keys=[user_id])

    def __repr__(self):
        return f"<EmailSubscriber(id={self.id}, email='{self.email}', active={self.is_active})>"

    @property
    def open_rate(self) -> float:
        """打开率"""
        if self.emails_sent == 0:
            return 0.0
        return round((self.emails_opened / self.emails_sent) * 100, 2)

    def unsubscribe(self, reason: Optional[str] = None):
        """取消订阅"""
        self.is_active = False
        self.unsubscribed_at = datetime.utcnow()
        self.unsubscribe_reason = reason

    def resubscribe(self):
        """重新订阅"""
        self.is_active = True
        self.unsubscribed_at = None
        self.unsubscribe_reason = None


# 扩展 User 模型的关系
from app.models.user import User
User.email_campaigns = relationship("EmailCampaign", back_populates="user", cascade="all, delete-orphan")
User.received_emails = relationship("EmailMessage", back_populates="recipient", foreign_keys="EmailMessage.user_id")
User.email_templates = relationship("EmailTemplate", back_populates="user", cascade="all, delete-orphan")
User.email_subscriptions = relationship("EmailSubscriber", back_populates="user", cascade="all, delete-orphan")
