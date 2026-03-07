"""
Activity Models - Database models for activity stream
Includes Activity model for tracking user actions and social interactions.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Index, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import Base


class Activity(Base):
    """
    Activity model for tracking user actions in the activity stream.
    Records events like likes, comments, follows, posts, etc.
    """

    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # like, comment, follow, post, bookmark, mention, achievement
    target_type = Column(String(50), nullable=True)  # post, comment, user, etc.
    target_id = Column(Integer, nullable=True)  # ID of target object
    target_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)  # User being acted upon
    content = Column(Text, nullable=True)  # Activity content/description
    extra_data = Column(JSON, nullable=True)  # Additional metadata (points, reason, etc.)
    is_read = Column(Boolean, default=False, nullable=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    is_public = Column(Boolean, default=True, nullable=False)  # Whether activity is public
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    actor = relationship("User", foreign_keys=[actor_id], back_populates="activities")
    target_user = relationship("User", foreign_keys=[target_user_id], back_populates="received_activities")

    # Indexes for efficient queries
    __table_args__ = (
        Index('idx_activity_actor', 'actor_id', 'created_at'),
        Index('idx_activity_target_user', 'target_user_id', 'created_at'),
        Index('idx_activity_type', 'type', 'created_at'),
        Index('idx_activity_read', 'is_read', 'created_at'),
        Index('idx_activity_public', 'is_public', 'created_at'),
    )

    def __repr__(self):
        return f"<Activity(id={self.id}, type={self.type}, actor_id={self.actor_id})>"

    @property
    def excerpt(self):
        """Get a short excerpt of the activity content."""
        if self.content and len(self.content) > 100:
            return self.content[:97] + "..."
        return self.content
