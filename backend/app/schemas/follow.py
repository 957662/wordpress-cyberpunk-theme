"""
Follow Schemas
关注相关的数据验证模型
"""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class FollowBase(BaseModel):
    """关注基础模型"""
    follower_id: int
    following_id: int


class FollowCreate(FollowBase):
    """创建关注请求"""
    pass


class FollowResponse(FollowBase):
    """关注响应"""
    id: int
    followed_at: datetime
    follower_username: Optional[str] = None
    following_username: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class FollowerInfo(BaseModel):
    """粉丝信息"""
    id: int
    user_id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    followed_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FollowingInfo(BaseModel):
    """关注信息"""
    id: int
    user_id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    followed_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FollowersListResponse(BaseModel):
    """粉丝列表响应"""
    followers: List[FollowerInfo]
    total: int
    page: int
    page_size: int


class FollowingListResponse(BaseModel):
    """关注列表响应"""
    following: List[FollowingInfo]
    total: int
    page: int
    page_size: int


class FollowStatsResponse(BaseModel):
    """关注统计响应"""
    followers_count: int
    following_count: int


class FollowStatusResponse(BaseModel):
    """关注状态响应"""
    is_following: bool
    is_followed_by: bool


class BulkFollowRequest(BaseModel):
    """批量关注请求"""
    user_ids: List[int]


class BulkFollowResponse(BaseModel):
    """批量关注响应"""
    successful: List[int]
    failed: List[dict]
