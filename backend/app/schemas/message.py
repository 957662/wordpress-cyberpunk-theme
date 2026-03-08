from uuid import UUID
"""
Message Schemas - Pydantic schemas for messaging system
Includes request/response schemas for messages and conversations.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime


class MessageCreate(BaseModel):
    """Schema for creating a new message."""

    content: str = Field(..., min_length=1, max_length=10000, description="Message content")
    message_type: Optional[str] = Field(default="text", description="Type of message (text, image, file, etc.)")
    attachment_url: Optional[str] = Field(None, max_length=500, description="URL of attachment if any")
    attachment_name: Optional[str] = Field(None, max_length=255, description="Name of attachment file")

    @field_validator('content')
    def validate_content(cls, v):
        if not v or not v.strip():
            raise ValueError('Message content cannot be empty')
        return v.strip()


class MessageUpdate(BaseModel):
    """Schema for updating a message."""

    content: Optional[str] = Field(None, min_length=1, max_length=10000)
    is_deleted: Optional[bool] = None


class MessageResponse(BaseModel):
    """Schema for message response."""

    id: UUID
    conversation_id: UUID
    sender_id: UUID
    content: str
    message_type: str
    attachment_url: Optional[str] = None
    attachment_name: Optional[str] = None
    is_read: bool
    read_at: Optional[datetime] = None
    is_deleted: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageListItem(BaseModel):
    """Schema for message in a list."""

    id: UUID
    sender_id: UUID
    content: str
    message_type: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class MessageListResponse(BaseModel):
    """Schema for paginated message list."""

    items: List[MessageListItem]
    total: int
    page: int
    per_page: int
    total_pages: int


class ConversationCreate(BaseModel):
    """Schema for creating a new conversation."""

    user_id: UUID = Field(..., description="ID of the user to start conversation with")
    subject: Optional[str] = Field(None, max_length=255, description="Optional subject for conversation")

    @field_validator('user_id')
    def validate_user_id(cls, v):
        if v <= 0:
            raise ValueError('Invalid user ID')
        return v


class ConversationUpdate(BaseModel):
    """Schema for updating a conversation."""

    subject: Optional[str] = Field(None, max_length=255)


class ConversationResponse(BaseModel):
    """Schema for conversation response."""

    id: UUID
    user_id_1: int
    user_id_2: int
    subject: Optional[str] = None
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationListItem(BaseModel):
    """Schema for conversation in a list."""

    id: UUID
    other_user: Optional[dict] = None
    subject: Optional[str] = None
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


class ConversationListResponse(BaseModel):
    """Schema for paginated conversation list."""

    items: List[ConversationListItem]
    total: int
    page: int
    per_page: int
    total_pages: int


class UnreadCountResponse(BaseModel):
    """Schema for unread message count response."""

    count: int = Field(0, description="Number of unread messages")


class TypingIndicator(BaseModel):
    """Schema for typing indicator WebSocket message."""

    type: str = Field("typing", description="Message type")
    conversation_id: UUID = Field(..., description="ID of the conversation")
    user_id: UUID = Field(..., description="ID of the user typing")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of typing event")


class MessageNotification(BaseModel):
    """Schema for new message notification."""

    type: str = Field("new_message", description="Notification type")
    conversation_id: UUID
    message_id: UUID
    sender_id: UUID
    sender_username: Optional[str] = None
    content: str
    created_at: datetime


class WebSocketMessage(BaseModel):
    """Base schema for WebSocket messages."""

    type: str = Field(..., description="Message type")
    data: dict = Field(default_factory=dict, description="Message data")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Message timestamp")
