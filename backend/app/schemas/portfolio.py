from uuid import UUID
"""
Portfolio Schemas
作品集数据模式
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class AuthorBasic(BaseModel):
    """作者基础信息"""

    id: UUID
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


class ProjectBase(BaseModel):
    """项目基础模式"""

    title: str = Field(..., min_length=1, max_length=255)
    slug: Optional[str] = Field(None, max_length=255)
    description: str = Field(..., min_length=1)
    content: Optional[str] = None
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    technologies: Optional[List[str]] = []
    project_type: Optional[str] = None
    client_name: Optional[str] = None
    project_date: Optional[str] = None
    status: str = Field("draft", pattern="^(draft|published)$")
    featured: int = Field(0, ge=0, le=1)


class ProjectCreate(ProjectBase):
    """创建项目"""

    thumbnail_url: Optional[str] = None
    images_urls: Optional[List[str]] = []


class ProjectUpdate(BaseModel):
    """更新项目"""

    title: Optional[str] = Field(None, min_length=1, max_length=255)
    slug: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    content: Optional[str] = None
    demo_url: Optional[str] = None
    repo_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    images_urls: Optional[List[str]] = None
    project_type: Optional[str] = None
    client_name: Optional[str] = None
    project_date: Optional[str] = None
    status: Optional[str] = Field(None, pattern="^(draft|published)$")
    featured: Optional[int] = Field(None, ge=0, le=1)


class ProjectResponse(BaseModel):
    """项目响应"""

    id: UUID
    title: str
    slug: str
    description: str
    content: Optional[str]
    demo_url: Optional[str]
    repo_url: Optional[str]
    technologies: List[str]
    thumbnail_url: Optional[str]
    images_urls: Optional[List[str]]
    project_type: Optional[str]
    client_name: Optional[str]
    project_date: Optional[str]
    status: str
    featured: int
    view_count: int
    like_count: int
    created_at: datetime
    updated_at: datetime

    author: AuthorBasic

    class Config:
        from_attributes = True
