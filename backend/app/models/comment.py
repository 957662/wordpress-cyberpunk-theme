"""
评论模型
"""
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, ForeignKey, Enum, DateTime
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship
import uuid
import enum

from app.core.database import Base


class CommentStatus(str, enum.Enum):
    """评论状态枚举"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SPAM = "spam"


class Comment(Base):
    """评论模型"""
    
    __tablename__ = "comments"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    post_id = Column(UUID(as_uuid=True), ForeignKey("posts.id", ondelete="CASCADE"), nullable=False)
    author_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("comments.id", ondelete="CASCADE"), nullable=True)
    
    # 作者信息（未登录用户）
    author_name = Column(String(100), nullable=True)
    author_email = Column(String(255), nullable=True)
    
    content = Column(Text, nullable=False)
    status = Column(
        Enum(CommentStatus),
        default=CommentStatus.PENDING,
        nullable=False
    )
    
    # 元数据
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)
    like_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # 关系
    post = relationship("Post", back_populates="comments")
    author = relationship("User", back_populates="comments")
    parent = relationship("Comment", remote_side=[id], backref="replies")
    
    def __repr__(self):
        return f"<Comment(id={self.id}, post_id={self.post_id}, status={self.status})>"
    
    def to_dict(self):
        """转换为字典"""
        return {
            "id": str(self.id),
            "post_id": str(self.post_id),
            "author_id": str(self.author_id) if self.author_id else None,
            "parent_id": str(self.parent_id) if self.parent_id else None,
            "author_name": self.author_name,
            "author_email": self.author_email,
            "content": self.content,
            "status": self.status.value,
            "like_count": self.like_count,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "author": {
                "id": str(self.author.id),
                "username": self.author.username,
                "display_name": self.author.display_name,
                "avatar_url": self.author.avatar_url,
            } if self.author else {
                "name": self.author_name,
                "email": self.author_email,
            } if self.author_name else None,
            "replies_count": len(self.replies) if hasattr(self, 'replies') else 0,
        }
