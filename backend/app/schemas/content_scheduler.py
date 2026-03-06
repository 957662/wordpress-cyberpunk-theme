"""
Content Scheduler Pydantic Schemas
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator


class ScheduleStatus(str):
    """排期状态枚举"""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ContentScheduleBase(BaseModel):
    """内容排期基础 Schema"""
    title: str = Field(..., min_length=1, max_length=500, description="标题")
    content: Optional[str] = Field(None, description="内容")
    excerpt: Optional[str] = Field(None, max_length=500, description="摘要")
    featured_image: Optional[str] = Field(None, max_length=500, description="特色图片")

    # 分类和标签
    category_id: Optional[int] = Field(None, description="分类ID")
    tag_ids: List[int] = Field(default=[], description="标签ID列表")

    # 排期时间
    scheduled_at: datetime = Field(..., description="排期时间")

    # 通知设置
    notify_before: int = Field(default=60, ge=0, le=1440, description="提前通知分钟数")

    # 社交媒体同步
    sync_to_social: bool = Field(default=False, description="同步到社交媒体")
    social_platforms: Optional[List[str]] = Field(None, description="社交平台列表")

    # SEO 设置
    meta_title: Optional[str] = Field(None, max_length=200, description="SEO 标题")
    meta_description: Optional[str] = Field(None, description="SEO 描述")
    meta_keywords: Optional[str] = Field(None, max_length=500, description="SEO 关键词")


class ContentScheduleCreate(ContentScheduleBase):
    """创建内容排期 Schema"""
    post_id: Optional[int] = Field(None, description="关联文章ID")


class ContentScheduleUpdate(BaseModel):
    """更新内容排期 Schema"""
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = None
    excerpt: Optional[str] = Field(None, max_length=500)
    featured_image: Optional[str] = Field(None, max_length=500)
    category_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None
    scheduled_at: Optional[datetime] = None
    notify_before: Optional[int] = Field(None, ge=0, le=1440)
    sync_to_social: Optional[bool] = None
    social_platforms: Optional[List[str]] = None
    meta_title: Optional[str] = Field(None, max_length=200)
    meta_description: Optional[str] = Field(None)
    meta_keywords: Optional[str] = Field(None, max_length=500)
    status: Optional[str] = Field(None, description="状态")


class ContentScheduleResponse(ContentScheduleBase):
    """内容排期响应 Schema"""
    id: int
    user_id: int
    post_id: Optional[int]
    status: str
    publish_result: Optional[str]
    notification_sent: bool
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]

    # 关联数据
    category: Optional[dict] = None
    tags: List[dict] = []
    post: Optional[dict] = None

    class Config:
        from_attributes = True


class ContentScheduleList(BaseModel):
    """内容排期列表响应 Schema"""
    total: int
    items: List[ContentScheduleResponse]
    page: int
    page_size: int


class ContentScheduleStats(BaseModel):
    """内容排期统计 Schema"""
    total: int
    draft: int
    scheduled: int
    published: int
    failed: int
    cancelled: int
    due_today: int
    overdue: int


class BulkOperation(BaseModel):
    """批量操作 Schema"""
    schedule_ids: List[int] = Field(..., min_items=1, description="排期ID列表")
    action: str = Field(..., description="操作类型: cancel, delete, publish")


class BulkOperationResult(BaseModel):
    """批量操作结果 Schema"""
    success_count: int
    failed_count: int
    errors: List[str] = []
