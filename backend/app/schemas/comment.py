"""
Comment Schemas
评论相关的Pydantic模型
"""

from __future__ import annotations

from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional, List


class CommentBase(BaseModel):
    """评论基础模型"""
    content: str = Field(..., min_length=1, max_length=5000, description="评论内容")
    author_name: Optional[str] = Field(None, max_length=100, description="作者名称（游客）")
    author_email: Optional[EmailStr] = Field(None, description="作者邮箱（游客）")


class CommentCreate(CommentBase):
    """创建评论模型"""
    post_id: int = Field(..., description="文章ID")
    parent_id: Optional[int] = Field(None, description="父评论ID（用于回复）")


class CommentUpdate(BaseModel):
    """更新评论模型"""
    content: str = Field(..., min_length=1, max_length=5000, description="评论内容")


class CommentResponse(BaseModel):
    """评论详情响应模型"""
    id: int
    post_id: int
    content: str
    author_name: Optional[str]
    author_email: Optional[str]
    author_id: Optional[int]
    parent_id: Optional[int]
    status: str
    created_at: datetime
    updated_at: Optional[datetime]
    replies: List['CommentResponse'] = []

    class Config:
        from_attributes = True


class CommentList(BaseModel):
    """评论列表项模型"""
    id: int
    post_id: int
    content: str
    author_name: Optional[str]
    author_id: Optional[int]
    parent_id: Optional[int]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# 更新前向引用
CommentResponse.model_rebuild()
