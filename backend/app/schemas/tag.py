"""
Tag Schemas
标签数据模式
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class TagBase(BaseModel):
    """标签基础模式"""

    name: str = Field(..., min_length=1, max_length=50)
    slug: Optional[str] = Field(None, max_length=50)


class TagCreate(TagBase):
    """创建标签"""

    pass


class TagUpdate(BaseModel):
    """更新标签"""

    name: Optional[str] = Field(None, min_length=1, max_length=50)
    slug: Optional[str] = Field(None, max_length=50)


class TagResponse(TagBase):
    """标签响应"""

    id: int
    created_at: datetime
    updated_at: datetime
    posts_count: Optional[int] = 0

    class Config:
        from_attributes = True
