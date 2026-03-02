"""
Comment Model
评论数据模型
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base


class Comment(Base):
    """评论模型"""
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False, index=True)
    content = Column(Text, nullable=False)

    # 作者信息（可能为注册用户或游客）
    author_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    author_name = Column(String(100), nullable=True)  # 游客名称
    author_email = Column(String(255), nullable=True)  # 游客邮箱
    author_ip = Column(String(45), nullable=True)  # IP地址

    # 评论层级
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True, index=True)

    # 状态
    status = Column(
        Enum("pending", "approved", "spam", "trash", name="comment_status"),
        default="pending",
        nullable=False,
        index=True
    )

    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, onupdate=datetime.utcnow, nullable=True)

    # 关系
    post = relationship("Post", back_populates="comments")
    author = relationship("User", foreign_keys=[author_id], back_populates="comments")

    # 自引用关系（父评论和子评论）
    parent = relationship("Comment", remote_side=[id], backref="replies")

    def __repr__(self):
        return f"<Comment(id={self.id}, post_id={self.post_id}, status='{self.status}')>"
