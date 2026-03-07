"""
阅读进度模型
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class ReadingProgress(Base):
    """阅读进度模型"""

    __tablename__ = "reading_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    article_id = Column(String, nullable=False, index=True)
    article_title = Column(String, nullable=False)
    progress = Column(Float, default=0, nullable=False)  # 0-100
    last_position = Column(Integer, default=0, nullable=False)  # 像素位置
    total_time = Column(Integer, default=0, nullable=False)  # 总阅读时间（秒）
    completed = Column(Boolean, default=False, nullable=False)
    last_read_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # 关系
    user = relationship("User")
