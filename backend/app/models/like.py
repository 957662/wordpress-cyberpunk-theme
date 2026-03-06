"""
点赞模型
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from app.core.database import Base


class Like(Base):
    """点赞模型"""

    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    target_type = Column(String(50), nullable=False)  # 'post', 'comment', 'project'
    target_id = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # 关系
    user = relationship("User", back_populates="likes")

    # 唯一约束：一个用户对同一对象只能点赞一次
    __table_args__ = (
        UniqueConstraint('user_id', 'target_type', 'target_id', name='uq_user_target_like'),
        Index('idx_like_target', 'target_type', 'target_id'),
        Index('idx_like_user', 'user_id'),
    )

    def __repr__(self):
        return f"<Like(user_id={self.user_id}, target_type={self.target_type}, target_id={self.target_id})>"
