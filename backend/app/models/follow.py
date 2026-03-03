"""
Follow Model
关注模型
"""

from datetime import datetime
from sqlalchemy import Column, Integer, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.orm import relationship
from app.models.base import Base


class Follow(Base):
    """用户关注关系表"""

    __tablename__ = "follows"

    # 关注者和被关注者
    follower_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    following_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # 关注时间
    followed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # 唯一约束：不能重复关注同一个人
    __table_args__ = (
        UniqueConstraint('follower_id', 'following_id', name='unique_follow'),
        Index('idx_follower', 'follower_id'),
        Index('idx_following', 'following_id'),
    )

    def __repr__(self):
        return f"<Follow(follower={self.follower_id}, following={self.following_id})>"


class FollowerStat(Base):
    """关注统计表（用于缓存关注数）"""

    __tablename__ = "follower_stats"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)

    # 统计数据
    followers_count = Column(Integer, default=0, nullable=False)  # 粉丝数
    following_count = Column(Integer, default=0, nullable=False)  # 关注数

    def __repr__(self):
        return f"<FollowerStat(user_id={self.user_id}, followers={self.followers_count})>"
