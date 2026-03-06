"""
内容排期数据模型
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
import enum

from app.models.base import Base


class ScheduleStatus(str, enum.Enum):
    """排期状态"""
    DRAFT = "draft"           # 草稿
    SCHEDULED = "scheduled"   # 已排期
    PUBLISHED = "published"   # 已发布
    FAILED = "failed"         # 发布失败
    CANCELLED = "cancelled"   # 已取消


class ContentSchedule(Base):
    """内容排期模型"""

    __tablename__ = "content_schedules"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=True)  # 可选，关联已创建的文章
    title = Column(String(500), nullable=False)
    content = Column(Text, nullable=True)
    excerpt = Column(Text, nullable=True)
    featured_image = Column(String(500), nullable=True)

    # 分类和标签
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    tags = relationship("ContentScheduleTag", back_populates="schedule", cascade="all, delete-orphan")

    # 排期信息
    scheduled_at = Column(DateTime, nullable=False, index=True)
    status = Column(SQLEnum(ScheduleStatus), default=ScheduleStatus.DRAFT, index=True)
    publish_result = Column(Text, nullable=True)  # 发布结果或失败原因

    # 通知设置
    notify_before = Column(Integer, default=60)  # 提前多少分钟通知
    notification_sent = Column(Boolean, default=False)

    # 社交媒体同步
    sync_to_social = Column(Boolean, default=False)
    social_platforms = Column(Text, nullable=True)  # JSON: ["twitter", "facebook"]

    # SEO 设置
    meta_title = Column(String(200), nullable=True)
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(String(500), nullable=True)

    # 元数据
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = Column(DateTime, nullable=True)

    # 关联关系
    user = relationship("User", back_populates="content_schedules")
    post = relationship("Post", back_populates="schedules")
    category = relationship("Category", back_populates="content_schedules")

    def __repr__(self):
        return f"<ContentSchedule(id={self.id}, title='{self.title}', scheduled_at='{self.scheduled_at}')>"

    @property
    def is_due(self) -> bool:
        """检查是否到期"""
        if self.status != ScheduleStatus.SCHEDULED:
            return False
        return datetime.utcnow() >= self.scheduled_at

    @property
    def is_overdue(self) -> bool:
        """检查是否逾期"""
        if self.status != ScheduleStatus.SCHEDULED:
            return False
        return datetime.utcnow() > self.scheduled_at

    def mark_as_published(self, post_id: Optional[int] = None):
        """标记为已发布"""
        self.status = ScheduleStatus.PUBLISHED
        self.published_at = datetime.utcnow()
        if post_id:
            self.post_id = post_id

    def mark_as_failed(self, reason: str):
        """标记为发布失败"""
        self.status = ScheduleStatus.FAILED
        self.publish_result = reason

    def cancel(self):
        """取消排期"""
        self.status = ScheduleStatus.CANCELLED


class ContentScheduleTag(Base):
    """内容排期标签关联"""

    __tablename__ = "content_schedule_tags"

    id = Column(Integer, primary_key=True, index=True)
    schedule_id = Column(Integer, ForeignKey("content_schedules.id"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关联关系
    schedule = relationship("ContentSchedule", back_populates="tags")
    tag = relationship("Tag", back_populates="content_schedules")

    def __repr__(self):
        return f"<ContentScheduleTag(schedule_id={self.schedule_id}, tag_id={self.tag_id})>"


# 扩展其他模型的关系
from app.models.user import User
from app.models.post import Post
from app.models.category import Category
from app.models.tag import Tag

User.content_schedules = relationship("ContentSchedule", back_populates="user", cascade="all, delete-orphan")
Post.schedules = relationship("ContentSchedule", back_populates="post", cascade="all, delete-orphan")
Category.content_schedules = relationship("ContentSchedule", back_populates="category")
Tag.content_schedules = relationship("ContentScheduleTag", back_populates="tag")
