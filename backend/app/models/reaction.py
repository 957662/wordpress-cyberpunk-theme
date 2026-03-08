"""
反应模型
"""
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class ReactionType(str, enum.Enum):
    """反应类型枚举"""
    LIKE = "like"
    LOVE = "love"
    FIRE = "fire"
    INTERESTING = "interesting"
    TRENDING = "trending"
    AWESOME = "awesome"


class Reaction(Base):
    """反应模型"""
    
    __tablename__ = "reactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    reaction_type = Column(Enum(ReactionType), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # 唯一约束：每个用户对每篇文章只能有一种反应
    __table_args__ = (
        UniqueConstraint('post_id', 'user_id', 'reaction_type', name='unique_post_user_reaction'),
    )
    
    # 关系
    post = relationship("Post", back_populates="reactions")
    user = relationship("User", back_populates="reactions")
    
    def __repr__(self):
        return f"<Reaction(id={self.id}, post_id={self.post_id}, type={self.reaction_type})>"
    
    def to_dict(self):
        """转换为字典"""
        return {
            "id": str(self.id),
            "post_id": str(self.post_id),
            "user_id": str(self.user_id) if self.user_id else None,
            "reaction_type": self.reaction_type.value,
            "created_at": self.created_at.isoformat(),
        }
