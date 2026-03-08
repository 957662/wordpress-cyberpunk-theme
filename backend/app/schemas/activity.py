from uuid import UUID
"""
Activity Schemas - Pydantic schemas for activity stream
Includes request/response schemas for activities and notifications.
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class ActivityCreate(BaseModel):
    """Schema for creating a new activity."""

    type: str = Field(..., description="Type of activity (like, comment, follow, etc.)")
    target_type: Optional[str] = Field(None, description="Type of target object")
    target_id: Optional[UUID] = Field(None, description="ID of target object")
    target_user_id: Optional[UUID] = Field(None, description="ID of user being acted upon")
    content: Optional[str] = Field(None, max_length=1000, description="Activity content")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")
    is_public: bool = Field(True, description="Whether activity is public")


class ActivityUpdate(BaseModel):
    """Schema for updating an activity."""

    content: Optional[str] = Field(None, max_length=1000)
    is_read: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None


class ActivityResponse(BaseModel):
    """Schema for activity response."""

    id: UUID
    actor_id: UUID
    type: str
    target_type: Optional[str] = None
    target_id: Optional[UUID] = None
    target_user_id: Optional[UUID] = None
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    is_read: bool
    read_at: Optional[datetime] = None
    is_public: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ActivityListItem(BaseModel):
    """Schema for activity in a list."""

    id: UUID
    actor: Optional[dict] = None
    type: str
    target: Optional[dict] = None
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ActivityListResponse(BaseModel):
    """Schema for paginated activity list."""

    items: List[ActivityListItem]
    total: int
    page: int
    per_page: int
    total_pages: int


class ActivityStats(BaseModel):
    """Schema for activity statistics."""

    total_activities: int = Field(0, description="Total number of activities")
    activities_by_type: Dict[str, int] = Field(default_factory=dict, description="Activities grouped by type")
    unread_count: int = Field(0, description="Number of unread activities")
    period_days: int = Field(30, description="Period covered by statistics")


class NotificationResponse(BaseModel):
    """Schema for notification response (specialized activity)."""

    id: UUID
    type: str
    actor: dict
    target: Optional[dict] = None
    content: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    """Schema for paginated notification list."""

    items: List[NotificationResponse]
    total: int
    unread_count: int
    page: int
    per_page: int
    total_pages: int


class TrendingActivityResponse(BaseModel):
    """Schema for trending activity response."""

    id: UUID
    type: str
    actor: dict
    target: Optional[dict] = None
    content: Optional[str] = None
    engagement_score: float = Field(0, description="Calculated engagement score")
    created_at: datetime

    class Config:
        from_attributes = True
