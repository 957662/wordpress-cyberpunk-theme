"""
点赞 Pydantic 模型
"""
from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class LikeBase(BaseModel):
    """点赞基础模型"""
    target_type: str = Field(..., description="目标类型：post, comment, project")
    target_id: int = Field(..., description="目标ID")


class LikeCreate(LikeBase):
    """创建点赞"""
    pass


class LikeResponse(BaseModel):
    """点赞响应"""
    id: int
    user_id: int
    target_type: str
    target_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class LikeStatusResponse(BaseModel):
    """点赞状态响应"""
    is_liked: bool
    like_count: int


class LikeStatsResponse(BaseModel):
    """点赞统计响应"""
    total_likes: int
    recent_likes: int  # 最近7天的点赞数
