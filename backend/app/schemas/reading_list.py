"""
Reading List Schemas
阅读列表相关的Pydantic模型
"""

from __future__ import annotations

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List


class ReadingListBase(BaseModel):
    """阅读列表基础模型"""
    post_id: int = Field(..., description="文章ID")
    status: str = Field("unread", description="阅读状态: unread, reading, completed")


class ReadingListCreate(ReadingListBase):
    """创建阅读列表项模型"""
    pass


class ReadingListUpdate(BaseModel):
    """更新阅读列表项模型"""
    status: Optional[str] = Field(None, description="阅读状态: unread, reading, completed")
    notes: Optional[str] = Field(None, max_length=1000, description="阅读笔记")


class ReadingListResponse(BaseModel):
    """阅读列表项响应模型"""
    id: int
    user_id: int
    post_id: int
    status: str
    notes: Optional[str]
    added_at: datetime
    last_read_at: Optional[datetime]
    completed_at: Optional[datetime]
    
    # 文章信息（可选）
    post_title: Optional[str] = None
    post_slug: Optional[str] = None
    post_author: Optional[str] = None

    class Config:
        from_attributes = True


class ReadingStats(BaseModel):
    """阅读统计模型"""
    total_articles: int = 0
    unread_count: int = 0
    reading_count: int = 0
    completed_count: int = 0
    total_reading_time: float = 0.0  # 分钟
    average_completion_rate: float = 0.0


class ReadingProgressUpdate(BaseModel):
    """阅读进度更新模型"""
    reading_time: Optional[float] = Field(None, description="阅读时间（分钟）")
    scroll_progress: Optional[float] = Field(None, ge=0, le=100, description="滚动进度百分比")
    last_position: Optional[int] = Field(None, description="最后阅读位置（字符数）")
