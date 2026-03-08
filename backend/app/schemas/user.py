from uuid import UUID
"""
User Schemas
用户相关数据模式
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    """用户基础模式"""

    username: str = Field(..., min_length=3, max_length=50, pattern="^[a-zA-Z0-9_-]+$")
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    website_url: Optional[str] = None


class UserCreate(UserBase):
    """创建用户"""

    password: str = Field(..., min_length=8, max_length=100)


class UserUpdate(BaseModel):
    """更新用户"""

    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    website_url: Optional[str] = None


class UserLogin(BaseModel):
    """用户登录"""

    username: str
    password: str


class UserResponse(UserBase):
    """用户响应"""

    id: UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserWithStatsResponse(UserResponse):
    """带统计信息的用户响应"""

    posts_count: int = 0
    projects_count: int = 0
    total_views: int = 0


class UserList(BaseModel):
    """用户列表项"""

    id: UUID
    username: str
    email: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    is_admin: bool
    is_author: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ChangePassword(BaseModel):
    """修改密码"""

    old_password: str
    new_password: str = Field(..., min_length=8, max_length=100)


class Token(BaseModel):
    """访问令牌"""

    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """令牌数据"""

    username: Optional[str] = None
