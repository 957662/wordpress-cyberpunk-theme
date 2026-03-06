"""
收藏 Pydantic 模型
"""
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class BookmarkBase(BaseModel):
    """收藏基础模型"""
    target_type: str = Field(..., description="目标类型：post, project, category")
    target_id: int = Field(..., description="目标ID")
    notes: Optional[str] = Field(None, description="用户备注")


class BookmarkCreate(BookmarkBase):
    """创建收藏"""
    pass


class BookmarkUpdate(BaseModel):
    """更新收藏"""
    notes: Optional[str] = Field(None, description="用户备注")


class BookmarkResponse(BaseModel):
    """收藏响应"""
    id: int
    user_id: int
    target_type: str
    target_id: int
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class BookmarkListResponse(BaseModel):
    """收藏列表响应"""
    items: list[BookmarkResponse]
    total: int
    page: int
    page_size: int


class BookmarkStatusResponse(BaseModel):
    """收藏状态响应"""
    is_bookmarked: bool
    bookmark_id: Optional[int]
