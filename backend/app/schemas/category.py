"""
Category Schemas
分类数据模式
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    """分类基础模式"""

    name: str = Field(..., min_length=1, max_length=100)
    slug: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    """创建分类"""

    pass


class CategoryUpdate(BaseModel):
    """更新分类"""

    name: Optional[str] = Field(None, min_length=1, max_length=100)
    slug: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None


class CategoryResponse(CategoryBase):
    """分类响应"""

    id: int
    created_at: datetime
    updated_at: datetime
    posts_count: Optional[int] = 0

    class Config:
        from_attributes = True
