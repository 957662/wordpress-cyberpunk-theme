"""
Newsletter Models
Database models for newsletter subscribers and campaigns
"""

from sqlalchemy import Column, String, DateTime, Text, Integer, JSON, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import secrets

from ...core.database import Base


class NewsletterSubscriber(Base):
    """
    Newsletter Subscriber Model
    """

    __tablename__ = "newsletter_subscribers"

    id = Column(String, primary_key=True, default=lambda: secrets.token_urlsafe(16))
    email = Column(String, unique=True, nullable=False, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    tags = Column(JSON, default=list)
    status = Column(String, default="active", index=True)  # active, unsubscribed, bounced
    subscribed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    unsubscribed_at = Column(DateTime, nullable=True)
    unsubscribe_token = Column(String, unique=True, nullable=False, default=lambda: secrets.token_urlsafe(32))
    metadata = Column(JSON, nullable=True)  # source, user_agent, ip_address, etc.

    # Relationships
    events = relationship("NewsletterEvent", back_populates="subscriber", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<NewsletterSubscriber(id={self.id}, email={self.email}, status={self.status})>"


class NewsletterCampaign(Base):
    """
    Newsletter Campaign Model
    """

    __tablename__ = "newsletter_campaigns"

    id = Column(String, primary_key=True, default=lambda: secrets.token_urlsafe(16))
    name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    preview_text = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    status = Column(String, default="draft")  # draft, scheduled, sending, sent
    scheduled_at = Column(DateTime, nullable=True)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Statistics
    stats_sent = Column(Integer, default=0)
    stats_opened = Column(Integer, default=0)
    stats_clicked = Column(Integer, default=0)
    stats_bounced = Column(Integer, default=0)
    stats_unsubscribed = Column(Integer, default=0)

    # Relationships
    events = relationship("NewsletterEvent", back_populates="campaign", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<NewsletterCampaign(id={self.id}, name={self.name}, status={self.status})>"


class NewsletterEvent(Base):
    """
    Newsletter Event Model
    Tracks all newsletter-related events (opens, clicks, bounces, etc.)
    """

    __tablename__ = "newsletter_events"

    id = Column(String, primary_key=True, default=lambda: secrets.token_urlsafe(16))
    event_type = Column(String, nullable=False, index=True)  # open, click, bounce, complaint, etc.
    subscriber_id = Column(String, ForeignKey("newsletter_subscribers.id"), nullable=False, index=True)
    campaign_id = Column(String, ForeignKey("newsletter_campaigns.id"), nullable=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    metadata = Column(JSON, nullable=True)  # Additional event data

    # Relationships
    subscriber = relationship("NewsletterSubscriber", back_populates="events")
    campaign = relationship("NewsletterCampaign", back_populates="events")

    def __repr__(self):
        return f"<NewsletterEvent(id={self.id}, type={self.event_type}, subscriber_id={self.subscriber_id})>"


class NewsletterTemplate(Base):
    """
    Newsletter Template Model
    """

    __tablename__ = "newsletter_templates"

    id = Column(String, primary_key=True, default=lambda: secrets.token_urlsafe(16))
    name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    variables = Column(JSON, default=list)  # List of template variables
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<NewsletterTemplate(id={self.id}, name={self.name})>"


class NewsletterSegment(Base):
    """
    Newsletter Segment Model
    For segmenting subscribers
    """

    __tablename__ = "newsletter_segments"

    id = Column(String, primary_key=True, default=lambda: secrets.token_urlsafe(16))
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    conditions = Column(JSON, nullable=False)  # Segment conditions
    subscriber_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<NewsletterSegment(id={self.id}, name={self.name})>"


class NewsletterAutomation(Base):
    """
    Newsletter Automation Model
    For automated email sequences
    """

    __tablename__ = "newsletter_automations"

    id = Column(String, primary_key=True, default=lambda: secrets.token_urlsafe(16))
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    trigger_type = Column(String, nullable=False)  # subscription, date, event
    trigger_config = Column(JSON, nullable=False)
    actions = Column(JSON, nullable=False)  # List of actions
    status = Column(String, default="draft")  # active, paused, draft
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<NewsletterAutomation(id={self.id}, name={self.name}, status={self.status})>"
