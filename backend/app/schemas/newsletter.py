"""
Newsletter Schemas
Pydantic models for newsletter API
"""

from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime


class NewsletterSubscription(BaseModel):
    """Schema for newsletter subscription request"""

    email: EmailStr
    tags: Optional[List[str]] = Field(default_factory=list)
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    source: Optional[str] = Field(default="direct")


class NewsletterSubscriber(BaseModel):
    """Schema for newsletter subscriber"""

    id: str
    email: EmailStr
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    status: str = Field(default="active")
    subscribedAt: datetime
    unsubscribedAt: Optional[datetime] = None
    unsubscribeToken: str
    metadata: Optional[dict] = None

    class Config:
        from_attributes = True


class UnsubscribeRequest(BaseModel):
    """Schema for unsubscribe request"""

    email: EmailStr
    token: str


class SubscriberUpdate(BaseModel):
    """Schema for updating subscriber preferences"""

    tags: Optional[List[str]] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None


class NewsletterStats(BaseModel):
    """Schema for newsletter statistics"""

    totalSubscribers: int
    activeSubscribers: int
    unsubscribedCount: int
    bouncedCount: int
    newSubscribersThisWeek: int
    newSubscribersThisMonth: int
    unsubscribeRate: float
    averageOpenRate: float
    averageClickRate: float


class NewsletterCampaignCreate(BaseModel):
    """Schema for creating a campaign"""

    name: str
    subject: str
    content: str
    scheduledAt: Optional[datetime] = None


class NewsletterCampaign(BaseModel):
    """Schema for newsletter campaign"""

    id: str
    name: str
    subject: str
    content: str
    status: str
    scheduledAt: Optional[datetime] = None
    sentAt: Optional[datetime] = None
    createdAt: datetime
    updatedAt: datetime
    stats: Optional[dict] = None

    class Config:
        from_attributes = True


class NewsletterAnalytics(BaseModel):
    """Schema for newsletter analytics"""

    period: str
    subscribers: dict
    engagement: dict
    campaigns: dict
    growth: dict


class NewsletterSettings(BaseModel):
    """Schema for newsletter settings"""

    fromEmail: EmailStr
    fromName: str
    replyToEmail: Optional[EmailStr] = None
    defaultSender: Optional[dict] = None
    branding: Optional[dict] = None
    features: Optional[dict] = None
    limits: Optional[dict] = None


class WelcomeEmailData(BaseModel):
    """Schema for welcome email data"""

    subscriber_email: str
    subscriber_name: Optional[str] = None
    unsubscribe_link: str
    preferences_link: str


class GoodbyeEmailData(BaseModel):
    """Schema for goodbye email data"""

    subscriber_email: str
    subscriber_name: Optional[str] = None
    resubscribe_link: str
    feedback_link: Optional[str] = None


class NewsletterTemplate(BaseModel):
    """Schema for newsletter template"""

    id: str
    name: str
    subject: str
    content: str
    variables: List[str] = Field(default_factory=list)
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True


class NewsletterSegment(BaseModel):
    """Schema for newsletter segment"""

    id: str
    name: str
    description: Optional[str] = None
    conditions: List[dict] = Field(default_factory=list)
    subscriberCount: int = 0
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True
