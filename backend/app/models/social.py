"""
Social Models
User interactions: follow, like, bookmark, notifications
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from app.core.database import Base


class Follow(Base):
    """User follow relationships"""
    __tablename__ = "follows"

    id = Column(Integer, primary_key=True, index=True)
    follower_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    following_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    follower = relationship("User", foreign_keys=[follower_id], backref="following")
    following = relationship("User", foreign_keys=[following_id], backref="followers")

    # Unique constraint
    __table_args__ = (
        Index('ix_follows_follower_following', 'follower_id', 'following_id', unique=True),
    )


class Like(Base):
    """Post and comment likes"""
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_id = Column(Integer, nullable=False)
    target_type = Column(String(20), nullable=False)  # 'post' or 'comment'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", backref="likes")

    # Unique constraint
    __table_args__ = (
        Index('ix_likes_user_target', 'user_id', 'target_id', 'target_type', unique=True),
        Index('ix_likes_target', 'target_id', 'target_type'),
    )


class BookmarkFolder(Base):
    """User bookmark folders/collections"""
    __tablename__ = "bookmark_folders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False)
    icon = Column(String(50))
    color = Column(String(20))
    description = Column(Text)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", backref="bookmark_folders")
    bookmarks = relationship("Bookmark", back_populates="folder", cascade="all, delete-orphan")


class Bookmark(Base):
    """User bookmarks for posts and comments"""
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_id = Column(Integer, nullable=False)
    target_type = Column(String(20), nullable=False)  # 'post' or 'comment'
    folder_id = Column(Integer, ForeignKey("bookmark_folders.id", ondelete="SET NULL"))
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", backref="bookmarks")
    folder = relationship("BookmarkFolder", back_populates="bookmarks")

    # Unique constraint
    __table_args__ = (
        Index('ix_bookmarks_user_target', 'user_id', 'target_id', 'target_type', unique=True),
        Index('ix_bookmarks_target', 'target_id', 'target_type'),
    )


class Notification(Base):
    """User notifications"""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # 'follow', 'like', 'comment', 'mention', 'reply', 'bookmark', 'system'
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    data = Column(Text)  # JSON string
    actor_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    target_id = Column(Integer)
    target_type = Column(String(20))
    is_read = Column(Boolean, default=False, nullable=False)
    is_muted = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="notifications")
    actor = relationship("User", foreign_keys=[actor_id])

    # Indexes
    __table_args__ = (
        Index('ix_notifications_user_read', 'user_id', 'is_read'),
        Index('ix_notifications_user_created', 'user_id', 'created_at'),
    )


class NotificationPreference(Base):
    """User notification preferences"""
    __tablename__ = "notification_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # Email notifications
    email_follows = Column(Boolean, default=True)
    email_likes = Column(Boolean, default=True)
    email_comments = Column(Boolean, default=True)
    email_mentions = Column(Boolean, default=True)
    email_replies = Column(Boolean, default=True)
    email_bookmarks = Column(Boolean, default=False)
    email_system = Column(Boolean, default=True)

    # Push notifications
    push_follows = Column(Boolean, default=True)
    push_likes = Column(Boolean, default=True)
    push_comments = Column(Boolean, default=True)
    push_mentions = Column(Boolean, default=True)
    push_replies = Column(Boolean, default=True)
    push_bookmarks = Column(Boolean, default=False)
    push_system = Column(Boolean, default=True)

    # In-app notifications
    inapp_follows = Column(Boolean, default=True)
    inapp_likes = Column(Boolean, default=True)
    inapp_comments = Column(Boolean, default=True)
    inapp_mentions = Column(Boolean, default=True)
    inapp_replies = Column(Boolean, default=True)
    inapp_bookmarks = Column(Boolean, default=True)
    inapp_system = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", backref="notification_preferences")


class Activity(Base):
    """User activity feed"""
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # 'post_created', 'post_updated', 'comment_created', 'follow', 'like', 'bookmark'
    actor_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    target_id = Column(Integer)
    target_type = Column(String(20))
    metadata = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", foreign_keys=[user_id], backref="activities")
    actor = relationship("User", foreign_keys=[actor_id])

    # Indexes
    __table_args__ = (
        Index('ix_activities_user_created', 'user_id', 'created_at'),
        Index('ix_activities_actor_created', 'actor_id', 'created_at'),
    )
