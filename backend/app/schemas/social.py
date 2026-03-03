"""
Social Schemas
Pydantic models for social features
"""

from datetime import datetime
from typing import Optional, List, Generic, TypeVar
from pydantic import BaseModel, Field, ConfigDict


# ============================================================================
# Follow Schemas
# ============================================================================

class FollowBase(BaseModel):
    """Base follow schema"""
    user_id: int = Field(..., description="User to follow/unfollow")


class FollowCreate(FollowBase):
    """Create follow relationship"""
    pass


class FollowResponse(BaseModel):
    """Follow response"""
    success: bool
    is_following: bool
    followers_count: int
    message: Optional[str] = None


class FollowStats(BaseModel):
    """User follow statistics"""
    user_id: int
    followers_count: int
    following_count: int
    is_following: bool = False


class FollowUser(BaseModel):
    """User in follow list"""
    id: int
    username: str
    display_name: str
    avatar: Optional[str] = None
    bio: Optional[str] = None
    verified: bool = False
    followers_count: int
    is_following: bool = False
    followed_at: Optional[datetime] = None


class FollowListResponse(BaseModel):
    """Follow list response"""
    items: List[FollowUser]
    total: int
    page: int
    page_size: int
    has_more: bool


# ============================================================================
# Like Schemas
# ============================================================================

class LikeBase(BaseModel):
    """Base like schema"""
    target_id: int
    target_type: str = Field(..., pattern="^(post|comment)$")


class LikeCreate(LikeBase):
    """Create like"""
    pass


class LikeResponse(BaseModel):
    """Like response"""
    success: bool
    liked: bool
    likes_count: int
    message: Optional[str] = None


class LikeStats(BaseModel):
    """Like statistics"""
    likes_count: int
    is_liked: bool = False


class Liker(BaseModel):
    """User who liked"""
    id: int
    username: str
    display_name: str
    avatar: Optional[str] = None
    liked_at: datetime


class LikersListResponse(BaseModel):
    """Likers list response"""
    items: List[Liker]
    total: int
    page: int
    page_size: int
    has_more: bool


# ============================================================================
# Bookmark Schemas
# ============================================================================

class BookmarkFolderBase(BaseModel):
    """Base bookmark folder schema"""
    name: str = Field(..., min_length=1, max_length=100)
    icon: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None


class BookmarkFolderCreate(BookmarkFolderBase):
    """Create bookmark folder"""
    pass


class BookmarkFolderUpdate(BaseModel):
    """Update bookmark folder"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    icon: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None


class BookmarkFolderResponse(BookmarkFolderBase):
    """Bookmark folder response"""
    id: int
    user_id: int
    is_default: bool
    bookmarks_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BookmarkBase(BaseModel):
    """Base bookmark schema"""
    target_id: int
    target_type: str = Field(..., pattern="^(post|comment)$")
    folder_id: Optional[int] = None
    notes: Optional[str] = None


class BookmarkCreate(BookmarkBase):
    """Create bookmark"""
    pass


class BookmarkUpdate(BaseModel):
    """Update bookmark"""
    folder_id: Optional[int] = None
    notes: Optional[str] = None


class BookmarkResponse(BaseModel):
    """Bookmark response"""
    success: bool
    bookmarked: bool
    bookmarks_count: int
    message: Optional[str] = None


class BookmarkItem(BaseModel):
    """Bookmark item in list"""
    id: int
    target_id: int
    target_type: str
    folder: Optional[BookmarkFolderResponse] = None
    notes: Optional[str] = None
    created_at: datetime

    # Post or comment details
    post: Optional[dict] = None
    comment: Optional[dict] = None

    model_config = ConfigDict(from_attributes=True)


class BookmarksListResponse(BaseModel):
    """Bookmarks list response"""
    items: List[BookmarkItem]
    total: int
    page: int
    page_size: int
    has_more: bool


# ============================================================================
# Notification Schemas
# ============================================================================

class NotificationBase(BaseModel):
    """Base notification schema"""
    type: str
    title: str
    message: str


class NotificationCreate(NotificationBase):
    """Create notification (admin only)"""
    user_id: int
    actor_id: Optional[int] = None
    target_id: Optional[int] = None
    target_type: Optional[str] = None
    data: Optional[dict] = None


class NotificationData(BaseModel):
    """Notification data"""
    actor_id: Optional[int] = None
    actor_name: Optional[str] = None
    actor_avatar: Optional[str] = None
    target_id: Optional[int] = None
    target_type: Optional[str] = None
    target_title: Optional[str] = None
    target_url: Optional[str] = None
    comment: Optional[str] = None
    folder: Optional[str] = None


class Notification(NotificationBase):
    """Notification response"""
    id: int
    user_id: int
    data: Optional[NotificationData] = None
    actor_id: Optional[int] = None
    target_id: Optional[int] = None
    target_type: Optional[str] = None
    is_read: bool = False
    is_muted: bool = False
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class NotificationListParams(BaseModel):
    """Notification list parameters"""
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
    type: Optional[str] = None
    unread_only: bool = False


class NotificationListResponse(BaseModel):
    """Notification list response"""
    items: List[Notification]
    total: int
    unread: int
    page: int
    page_size: int
    has_more: bool


class NotificationStats(BaseModel):
    """Notification statistics"""
    total: int
    unread: int
    read: int


class NotificationPreferencesBase(BaseModel):
    """Base notification preferences"""
    # Email notifications
    email_follows: bool = True
    email_likes: bool = True
    email_comments: bool = True
    email_mentions: bool = True
    email_replies: bool = True
    email_bookmarks: bool = False
    email_system: bool = True

    # Push notifications
    push_follows: bool = True
    push_likes: bool = True
    push_comments: bool = True
    push_mentions: bool = True
    push_replies: bool = True
    push_bookmarks: bool = False
    push_system: bool = True

    # In-app notifications
    inapp_follows: bool = True
    inapp_likes: bool = True
    inapp_comments: bool = True
    inapp_mentions: bool = True
    inapp_replies: bool = True
    inapp_bookmarks: bool = True
    inapp_system: bool = True


class NotificationPreferencesUpdate(BaseModel):
    """Update notification preferences"""
    email_follows: Optional[bool] = None
    email_likes: Optional[bool] = None
    email_comments: Optional[bool] = None
    email_mentions: Optional[bool] = None
    email_replies: Optional[bool] = None
    email_bookmarks: Optional[bool] = None
    email_system: Optional[bool] = None
    push_follows: Optional[bool] = None
    push_likes: Optional[bool] = None
    push_comments: Optional[bool] = None
    push_mentions: Optional[bool] = None
    push_replies: Optional[bool] = None
    push_bookmarks: Optional[bool] = None
    push_system: Optional[bool] = None
    inapp_follows: Optional[bool] = None
    inapp_likes: Optional[bool] = None
    inapp_comments: Optional[bool] = None
    inapp_mentions: Optional[bool] = None
    inapp_replies: Optional[bool] = None
    inapp_bookmarks: Optional[bool] = None
    inapp_system: Optional[bool] = None


class NotificationPreferences(NotificationPreferencesBase):
    """Notification preferences response"""
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ============================================================================
# Activity Schemas
# ============================================================================

class ActivityBase(BaseModel):
    """Base activity schema"""
    type: str
    metadata: Optional[dict] = None


class ActivityCreate(ActivityBase):
    """Create activity (internal)"""
    user_id: int
    actor_id: Optional[int] = None
    target_id: Optional[int] = None
    target_type: Optional[str] = None


class Activity(ActivityBase):
    """Activity response"""
    id: int
    user_id: int
    actor_id: Optional[int] = None
    target_id: Optional[int] = None
    target_type: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ActivityFeedResponse(BaseModel):
    """Activity feed response"""
    items: List[Activity]
    total: int
    page: int
    page_size: int
    has_more: bool


# ============================================================================
# Common Schemas
# ============================================================================

class SocialApiResponse(BaseModel):
    """Generic social API response"""
    success: bool
    message: Optional[str] = None
    data: Optional[dict] = None


class SocialError(BaseModel):
    """Social error response"""
    code: str
    message: str
    type: str
    details: Optional[dict] = None
