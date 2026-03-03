"""
Analytics Models
数据分析模型
"""
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime

from app.models.base import Base


class PostAnalytics(Base):
    """文章分析数据"""
    __tablename__ = "post_analytics"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    views = Column(Integer, default=0)
    unique_visitors = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    comments = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    read_time = Column(Float, default=0)  # 平均阅读时间（秒）
    bounce_rate = Column(Float, default=0)  # 跳出率
    date = Column(DateTime, default=datetime.utcnow)

    # 关系
    post = relationship("Post", back_populates="analytics")

    __table_args__ = (
        Index('idx_post_analytics_post_date', 'post_id', 'date'),
    )


class DailyAnalytics(Base):
    """每日分析数据汇总"""
    __tablename__ = "daily_analytics"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, nullable=False, unique=True)
    total_views = Column(Integer, default=0)
    unique_visitors = Column(Integer, default=0)
    new_users = Column(Integer, default=0)
    total_posts = Column(Integer, default=0)
    total_comments = Column(Integer, default=0)
    total_likes = Column(Integer, default=0)
    avg_session_duration = Column(Float, default=0)

    __table_args__ = (
        Index('idx_daily_analytics_date', 'date'),
    )


class UserActivity(Base):
    """用户活动记录"""
    __tablename__ = "user_activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_type = Column(String(50), nullable=False)  # post, comment, like, share, etc.
    target_type = Column(String(50))  # post, comment, user
    target_id = Column(Integer)
    metadata = Column(String)  # JSON string for additional data
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('idx_user_activities_user', 'user_id'),
        Index('idx_user_activities_type', 'activity_type'),
        Index('idx_user_activities_date', 'created_at'),
    )
