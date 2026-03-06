"""
API Key 数据模型
"""
from datetime import datetime, timedelta
from typing import Optional, List
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY

from app.models.base import Base


class ApiKey(Base):
    """API 密钥模型"""

    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(200), nullable=False)
    key_hash = Column(String(500), nullable=False, unique=True)
    prefix = Column(String(20), nullable=False)  # 显示前8位
    scopes = Column(ARRAY(String), default=list)  # 权限范围: read, write, delete, admin
    is_active = Column(Boolean, default=True)
    last_used = Column(DateTime, nullable=True)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关联关系
    user = relationship("User", back_populates="api_keys")

    def __repr__(self):
        return f"<ApiKey(id={self.id}, name='{self.name}', prefix='{self.prefix}')>"

    @property
    def is_expired(self) -> bool:
        """检查密钥是否过期"""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at

    @property
    def is_valid(self) -> bool:
        """检查密钥是否有效"""
        return self.is_active and not self.is_expired

    @property
    def display_key(self) -> str:
        """显示密钥（脱敏）"""
        return f"{self.prefix}{'*' * 32}"

    def has_scope(self, scope: str) -> bool:
        """检查是否有特定权限"""
        return scope in self.scopes

    def revoke(self):
        """撤销密钥"""
        self.is_active = False

    def refresh_expiry(self, days: int = 365):
        """刷新过期时间"""
        self.expires_at = datetime.utcnow() + timedelta(days=days)


class ApiKeyUsage(Base):
    """API 密钥使用记录"""

    __tablename__ = "api_key_usage"

    id = Column(Integer, primary_key=True, index=True)
    api_key_id = Column(Integer, ForeignKey("api_keys.id"), nullable=False)
    endpoint = Column(String(500), nullable=False)
    method = Column(String(10), nullable=False)  # GET, POST, PUT, DELETE
    status_code = Column(Integer, nullable=False)
    response_time = Column(Integer, nullable=True)  # 毫秒
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    # 关联关系
    api_key = relationship("ApiKey", back_populates="usage_logs")

    def __repr__(self):
        return f"<ApiKeyUsage(id={self.id}, endpoint='{self.endpoint}', status={self.status_code})>"


# 扩展 User 模型的关系
from app.models.user import User
User.api_keys = relationship("ApiKey", back_populates="user", cascade="all, delete-orphan")
ApiKey.usage_logs = relationship("ApiKeyUsage", back_populates="api_key", cascade="all, delete-orphan")
