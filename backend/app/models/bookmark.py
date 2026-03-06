"""
收藏模型
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from app.core.database import Base


class Bookmark(Base):
    """收藏模型"""

    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_type = Column(String(50), nullable=False)  # 'post', 'project', 'category'
    target_id = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)  # 用户备注
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # 关系
    user = relationship("User", back_populates="bookmarks")

    # 唯一约束：一个用户对同一对象只能收藏一次
    __table_args__ = (
        UniqueConstraint('user_id', 'target_type', 'target_id', name='uq_user_target_bookmark'),
        Index('idx_bookmark_target', 'target_type', 'target_id'),
        Index('idx_bookmark_user', 'user_id'),
        Index('idx_bookmark_created', 'created_at'),
    )

    def __repr__(self):
        return f"<Bookmark(user_id={self.user_id}, target_type={self.target_type}, target_id={self.target_id})>"
