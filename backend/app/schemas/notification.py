from uuid import UUID
"""
Notification Schemas
通知相关的数据验证模型
"""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, EmailStr
from pydantic.types import Json


class ActorInfo(BaseModel):
    """通知发起者信息"""
    id: UUID
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class NotificationBase(BaseModel):
    """通知基础模型"""
    type: str
    title: str
    content: str


class NotificationCreate(NotificationBase):
    """创建通知请求"""
    actor_id: Optional[UUID] = None
    entity_type: Optional[str] = None
    entity_id: Optional[UUID] = None
    data: Optional[Dict[str, Any]] = None
    priority: str = "normal"
    action_url: Optional[str] = None
    expires_at: Optional[datetime] = None


class NotificationResponse(NotificationBase):
    """通知响应"""
    id: UUID
    recipient_id: UUID
    actor: Optional[ActorInfo] = None
    entity_type: Optional[str] = None
    entity_id: Optional[UUID] = None
    data: Dict[str, Any]
    is_read: bool
    read_at: Optional[datetime] = None
    priority: str
    action_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationListResponse(BaseModel):
    """通知列表响应"""
    items: List[NotificationResponse]
    total: int
    unread_count: int
    page: int
    page_size: int


class NotificationStatsResponse(BaseModel):
    """通知统计响应"""
    total: int
    unread: int
    by_type: Dict[str, int]


class NotificationPreferenceBase(BaseModel):
    """通知偏好设置基础模型"""
    email_follow: bool = True
    email_like: bool = True
    email_comment: bool = True
    email_mention: bool = True
    email_system: bool = True

    site_follow: bool = True
    site_like: bool = True
    site_comment: bool = True
    site_mention: bool = True
    site_system: bool = True

    push_follow: bool = False
    push_like: bool = False
    push_comment: bool = False
    push_mention: bool = False
    push_system: bool = False


class NotificationPreferenceUpdate(BaseModel):
    """更新通知偏好设置请求"""
    email_follow: Optional[bool] = None
    email_like: Optional[bool] = None
    email_comment: Optional[bool] = None
    email_mention: Optional[bool] = None
    email_system: Optional[bool] = None

    site_follow: Optional[bool] = None
    site_like: Optional[bool] = None
    site_comment: Optional[bool] = None
    site_mention: Optional[bool] = None
    site_system: Optional[bool] = None

    push_follow: Optional[bool] = None
    push_like: Optional[bool] = None
    push_comment: Optional[bool] = None
    push_mention: Optional[bool] = None
    push_system: Optional[bool] = None

    digest_frequency: Optional[str] = None
    do_not_disturb_start: Optional[str] = None
    do_not_disturb_end: Optional[str] = None


class NotificationPreferenceResponse(NotificationPreferenceBase):
    """通知偏好设置响应"""
    user_id: UUID
    digest_frequency: str = "immediate"
    do_not_disturb_start: Optional[str] = None
    do_not_disturb_end: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class BulkNotificationCreate(BaseModel):
    """批量创建通知请求"""
    recipient_ids: List[int]
    notification: NotificationCreate


class MarkAsReadRequest(BaseModel):
    """标记已读请求"""
    notification_ids: Optional[List[int]] = None
    all: bool = False


class NotificationTemplateCreate(BaseModel):
    """创建通知模板请求"""
    type: str
    title_template: str
    content_template: str
    default_priority: str = "normal"
    channels: List[str] = ["site"]


class NotificationTemplateResponse(BaseModel):
    """通知模板响应"""
    id: UUID
    type: str
    title_template: str
    content_template: str
    default_priority: str
    is_enabled: bool
    channels: List[str]

    model_config = ConfigDict(from_attributes=True)
