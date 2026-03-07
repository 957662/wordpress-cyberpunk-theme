"""
User Model
用户模型
"""

from sqlalchemy import Column, String, Boolean, Text, Integer, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base


class User(Base):
    """用户表"""

    __tablename__ = "users"

    # 基本信息
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100))

    # 用户资料
    bio = Column(Text)
    avatar_url = Column(String(500))
    website_url = Column(String(500))

    # 状态
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_admin = Column(Boolean, default=False)
    is_author = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    # 权限列表
    permissions = Column(JSON, default=list)

    # WordPress 关联
    wordpress_id = Column(Integer, unique=True, index=True)

    # 关系 - 使用 lazy="dynamic" 避免循环依赖问题
    posts = relationship("Post", back_populates="author", lazy="dynamic")
    projects = relationship("Project", back_populates="author", lazy="dynamic")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"
