"""
Base Model
基础模型
"""

from datetime import datetime
from sqlalchemy import Column, Integer, DateTime
from app.core.database import Base as SQLAlchemyBase


class Base(SQLAlchemyBase):
    """所有模型的基类"""

    __abstract__ = True

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
