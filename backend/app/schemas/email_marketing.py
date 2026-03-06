"""
Email Marketing Pydantic Schemas
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator


class CampaignStatus(str):
    """活动状态枚举"""
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    SENDING = "sending"
    SENT = "sent"
    PAUSED = "paused"
    CANCELLED = "cancelled"


class EmailCampaignBase(BaseModel):
    """邮件活动基础 Schema"""
    name: str = Field(..., min_length=1, max_length=500, description="活动名称")
    subject: str = Field(..., min_length=1, max_length=500, description="邮件主题")
    preheader: Optional[str] = Field(None, max_length=500, description="预览文本")

    # 邮件内容
    content_html: str = Field(..., description="HTML 内容")
    content_text: Optional[str] = Field(None, description="纯文本内容")
    template_id: Optional[str] = Field(None, max_length=100, description="模板ID")

    # 收件人设置
    recipient_list: List[int] = Field(..., min_items=1, description="收件人用户ID列表")
    segment_id: Optional[int] = Field(None, description="用户分群ID")

    # 追踪设置
    track_opens: bool = Field(default=True, description="追踪打开")
    track_clicks: bool = Field(default=True, description="追踪点击")


class EmailCampaignCreate(EmailCampaignBase):
    """创建邮件活动 Schema"""
    scheduled_at: Optional[datetime] = Field(None, description="排期发送时间")


class EmailCampaignUpdate(BaseModel):
    """更新邮件活动 Schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    subject: Optional[str] = Field(None, min_length=1, max_length=500)
    preheader: Optional[str] = Field(None, max_length=500)
    content_html: Optional[str] = None
    content_text: Optional[str] = None
    template_id: Optional[str] = Field(None, max_length=100)
    recipient_list: Optional[List[int]] = Field(None, min_items=1)
    segment_id: Optional[int] = None
    track_opens: Optional[bool] = None
    track_clicks: Optional[bool] = None
    scheduled_at: Optional[datetime] = None
    status: Optional[str] = Field(None, description="状态")


class EmailCampaignResponse(EmailCampaignBase):
    """邮件活动响应 Schema"""
    id: int
    user_id: int
    status: str
    recipient_count: int
    scheduled_at: Optional[datetime]
    sent_at: Optional[datetime]

    # 统计数据
    sent_count: int
    delivered_count: int
    opened_count: int
    clicked_count: int
    bounced_count: int
    unsubscribed_count: int
    conversion_rate: float

    # 计算属性
    open_rate: float
    click_rate: float
    bounce_rate: float

    # 元数据
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]

    class Config:
        from_attributes = True


class EmailCampaignList(BaseModel):
    """邮件活动列表响应 Schema"""
    total: int
    items: List[EmailCampaignResponse]
    page: int
    page_size: int


class EmailCampaignStats(BaseModel):
    """邮件活动统计 Schema"""
    total_campaigns: int
    active_campaigns: int
    total_sent: int
    total_opened: int
    total_clicked: int
    avg_open_rate: float
    avg_click_rate: float


class EmailMessageResponse(BaseModel):
    """邮件消息响应 Schema"""
    id: int
    campaign_id: int
    to_email: str
    to_name: Optional[str]
    subject: str
    status: str
    sent_at: Optional[datetime]
    delivered_at: Optional[datetime]
    opened_at: Optional[datetime]
    open_count: int
    clicked_at: Optional[datetime]
    click_count: int
    error_message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class EmailTemplateBase(BaseModel):
    """邮件模板基础 Schema"""
    name: str = Field(..., min_length=1, max_length=200, description="模板名称")
    description: Optional[str] = Field(None, description="模板描述")
    subject: str = Field(..., min_length=1, max_length=500, description="主题")
    html_content: str = Field(..., description="HTML 内容")
    text_content: Optional[str] = Field(None, description="纯文本内容")
    category: Optional[str] = Field(None, max_length=100, description="分类")
    thumbnail: Optional[str] = Field(None, max_length=500, description="缩略图")


class EmailTemplateCreate(EmailTemplateBase):
    """创建邮件模板 Schema"""
    variables: Optional[dict] = Field(None, description="模板变量")


class EmailTemplateUpdate(BaseModel):
    """更新邮件模板 Schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    subject: Optional[str] = Field(None, min_length=1, max_length=500)
    html_content: Optional[str] = None
    text_content: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    thumbnail: Optional[str] = Field(None, max_length=500)
    variables: Optional[dict] = None
    is_active: Optional[bool] = None


class EmailTemplateResponse(EmailTemplateBase):
    """邮件模板响应 Schema"""
    id: int
    user_id: int
    variables: Optional[dict]
    usage_count: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EmailTemplateList(BaseModel):
    """邮件模板列表响应 Schema"""
    total: int
    items: List[EmailTemplateResponse]
    page: int
    page_size: int


class EmailSubscriberBase(BaseModel):
    """邮件订阅者基础 Schema"""
    email: str = Field(..., description="邮箱地址")
    name: Optional[str] = Field(None, max_length=255, description="姓名")


class EmailSubscriberCreate(EmailSubscriberBase):
    """创建邮件订阅者 Schema"""
    preferences: Optional[dict] = Field(None, description="订阅偏好")


class EmailSubscriberUpdate(BaseModel):
    """更新邮件订阅者 Schema"""
    name: Optional[str] = Field(None, max_length=255)
    preferences: Optional[dict] = None
    is_active: Optional[bool] = None


class EmailSubscriberResponse(EmailSubscriberBase):
    """邮件订阅者响应 Schema"""
    id: int
    user_id: Optional[int]
    is_active: bool
    subscribed_at: datetime
    unsubscribed_at: Optional[datetime]
    unsubscribe_reason: Optional[str]
    preferences: Optional[dict]

    # 统计
    emails_sent: int
    emails_opened: int
    emails_clicked: int
    open_rate: float

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class EmailSubscriberList(BaseModel):
    """邮件订阅者列表响应 Schema"""
    total: int
    items: List[EmailSubscriberResponse]
    page: int
    page_size: int


class UnsubscribeRequest(BaseModel):
    """取消订阅请求 Schema"""
    email: str = Field(..., description="邮箱地址")
    reason: Optional[str] = Field(None, description="取消原因")
