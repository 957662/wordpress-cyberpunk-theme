"""
Tag Schemas
标签数据模式
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class TagBase(BaseModel):
    """标签基础模式"""

    name: str = Field(..., min_length=1, max_length=50)
    slug: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None


class TagCreate(TagBase):
    """创建标签"""

    pass


class TagUpdate(BaseModel):
    """更新标签"""

    name: Optional[str] = Field(None, min_length=1, max_length=50)
    slug: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None


class TagResponse(TagBase):
    """标签响应"""

    id: int
    created_at: datetime
    updated_at: datetime
    posts_count: Optional[int] = 0

    class Config:
        from_attributes = True


class TagListResponse(BaseModel):
    """标签列表响应"""

    data: List[TagResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class TagBasic(BaseModel):
    """标签基础信息"""

    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True


class TagStats(BaseModel):
    """标签统计信息"""

    tag_id: int
    posts_count: int
    published_count: int
    recent_count: int
