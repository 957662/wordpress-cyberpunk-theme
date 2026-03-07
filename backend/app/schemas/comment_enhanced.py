"""
Enhanced Comment Schemas
增强版评论相关的Pydantic模型，支持点赞、回复等功能
"""

from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import Optional, List
from enum import Enum


class CommentStatus(str, Enum):
    """评论状态枚举"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SPAM = "spam"


class CommentAuthorBase(BaseModel):
    """评论作者基础信息"""
    id: Optional[int] = None
    name: str = Field(..., min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    avatar: Optional[str] = None
    website: Optional[str] = None

    class Config:
        from_attributes = True


class CommentBase(BaseModel):
    """评论基础模型"""
    content: str = Field(..., min_length=1, max_length=5000, description="评论内容")
    parent_id: Optional[int] = Field(None, description="父评论ID（用于回复）")


class CommentCreate(CommentBase):
    """创建评论模型"""
    post_id: int = Field(..., description="文章ID")
    author_name: Optional[str] = Field(None, max_length=100, description="作者名称（游客）")
    author_email: Optional[EmailStr] = Field(None, description="作者邮箱（游客）")


class CommentUpdate(BaseModel):
    """更新评论模型"""
    content: str = Field(..., min_length=1, max_length=5000, description="评论内容")
    status: Optional[CommentStatus] = None


class CommentReaction(BaseModel):
    """评论互动统计"""
    likes_count: int = 0
    replies_count: int = 0
    is_liked_by_user: bool = False
    is_reported_by_user: bool = False


class CommentReply(BaseModel):
    """评论回复"""
    id: int
    content: str
    author: CommentAuthorBase
    created_at: datetime
    likes_count: int
    is_liked: bool

    class Config:
        from_attributes = True


class CommentDetail(CommentBase):
    """评论详情模型"""
    id: int
    post_id: int
    author: CommentAuthorBase
    author_id: Optional[int]
    status: CommentStatus
    created_at: datetime
    updated_at: Optional[datetime]
    ip_address: Optional[str]
    user_agent: Optional[str]

    # 互动数据
    likes_count: int = 0
    replies_count: int = 0
    is_liked: bool = False
    is_reported: bool = False

    # 回复列表（仅顶层评论包含）
    replies: List['CommentDetail'] = []

    class Config:
        from_attributes = True


class CommentListResponse(BaseModel):
    """评论列表响应"""
    comments: List[CommentDetail]
    total: int
    page: int
    page_size: int
    has_next: bool
    has_prev: bool


class CommentStats(BaseModel):
    """评论统计"""
    total_comments: int
    pending_comments: int
    approved_comments: int
    rejected_comments: int
    spam_comments: int
    total_likes: int


class CommentLikeCreate(BaseModel):
    """评论点赞"""
    comment_id: int = Field(..., description="评论ID")


class CommentReport(BaseModel):
    """举报评论"""
    comment_id: int = Field(..., description="评论ID")
    reason: str = Field(..., min_length=1, max_length=500, description="举报原因")
    type: str = Field(default="spam", description="举报类型: spam, abuse, other")


class CommentModeration(BaseModel):
    """评论审核"""
    comment_ids: List[int] = Field(..., description="评论ID列表")
    action: str = Field(..., description="操作: approve, reject, spam")
    reason: Optional[str] = Field(None, description="拒绝或标记原因")


# 更新前向引用
CommentDetail.model_rebuild()
