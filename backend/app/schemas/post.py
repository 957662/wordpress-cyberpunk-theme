from uuid import UUID
"""
Post Schemas
文章相关数据模式
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class CategoryBasic(BaseModel):
    """分类基础信息"""

    id: UUID
    name: str
    slug: str

    class Config:
        from_attributes = True


class TagBasic(BaseModel):
    """标签基础信息"""

    id: UUID
    name: str
    slug: str

    class Config:
        from_attributes = True


class AuthorBasic(BaseModel):
    """作者基础信息"""

    id: UUID
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class PostBase(BaseModel):
    """文章基础模式"""

    title: str = Field(..., min_length=1, max_length=255)
    slug: Optional[str] = Field(None, max_length=255)
    content: str = Field(..., min_length=1)
    excerpt: Optional[str] = None
    category_id: Optional[UUID] = None
    tags: Optional[List[int]] = []  # 标签ID列表
    featured_image_url: Optional[str] = None
    status: str = Field("draft", pattern="^(draft|published|archived)$")


class PostCreate(PostBase):
    """创建文章"""

    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = Field(None, max_length=255)


class PostUpdate(BaseModel):
    """更新文章"""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    excerpt: Optional[str] = None
    category_id: Optional[UUID] = None
    tags: Optional[List[int]] = None
    featured_image_url: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(draft|published|archived)$")
    meta_title: Optional[str] = Field(None, max_length=255)
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = Field(None, max_length=255)


class PostResponse(BaseModel):
    """文章响应"""

    id: UUID
    title: str
    slug: str
    content: str
    excerpt: Optional[str]
    status: str
    featured_image_url: Optional[str]
    view_count: int
    comment_count: int
    created_at: datetime
    updated_at: datetime

    # 关联数据
    author: AuthorBasic
    category: Optional[CategoryBasic] = None
    tags: List[TagBasic] = []

    class Config:
        from_attributes = True


class PostList(BaseModel):
    """文章列表项"""

    id: UUID
    title: str
    slug: str
    excerpt: Optional[str]
    status: str
    featured_image_url: Optional[str]
    view_count: int
    created_at: datetime

    author: AuthorBasic
    category: Optional[CategoryBasic] = None
    tags: List[TagBasic] = []

    class Config:
        from_attributes = True
