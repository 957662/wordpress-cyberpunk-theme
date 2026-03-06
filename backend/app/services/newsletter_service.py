"""
Newsletter Service
Business logic for newsletter operations
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional, Tuple
from datetime import datetime, timedelta
import csv
import io
import json

from ..models.newsletter import (
    NewsletterSubscriber,
    NewsletterCampaign,
    NewsletterEvent,
)
from ..schemas.newsletter import (
    NewsletterSubscription,
    SubscriberUpdate,
    NewsletterCampaignCreate,
)


class NewsletterService:
    """Service for managing newsletter operations"""

    async def create_subscriber(
        self, db: AsyncSession, subscription: NewsletterSubscription
    ) -> NewsletterSubscriber:
        """Create a new newsletter subscriber"""
        subscriber = NewsletterSubscriber(
            email=subscription.email,
            first_name=subscription.firstName,
            last_name=subscription.lastName,
            tags=subscription.tags or [],
            status="active",
            subscribed_at=datetime.utcnow(),
            metadata={
                "source": subscription.source or "direct",
            },
        )

        db.add(subscriber)
        await db.commit()
        await db.refresh(subscriber)

        return subscriber

    async def get_subscriber_by_id(
        self, db: AsyncSession, subscriber_id: str
    ) -> Optional[NewsletterSubscriber]:
        """Get subscriber by ID"""
        result = await db.execute(
            select(NewsletterSubscriber).where(
                NewsletterSubscriber.id == subscriber_id
            )
        )
        return result.scalar_one_or_none()

    async def get_subscriber_by_email(
        self, db: AsyncSession, email: str
    ) -> Optional[NewsletterSubscriber]:
        """Get subscriber by email"""
        result = await db.execute(
            select(NewsletterSubscriber).where(
                NewsletterSubscriber.email == email
            )
        )
        return result.scalar_one_or_none()

    async def get_subscriber_by_token(
        self, db: AsyncSession, token: str
    ) -> Optional[NewsletterSubscriber]:
        """Get subscriber by unsubscribe token"""
        result = await db.execute(
            select(NewsletterSubscriber).where(
                NewsletterSubscriber.unsubscribe_token == token
            )
        )
        return result.scalar_one_or_none()

    async def update_subscriber(
        self, db: AsyncSession, subscriber: NewsletterSubscriber, update: SubscriberUpdate
    ) -> NewsletterSubscriber:
        """Update subscriber preferences"""
        if update.tags is not None:
            subscriber.tags = update.tags
        if update.firstName is not None:
            subscriber.first_name = update.firstName
        if update.lastName is not None:
            subscriber.last_name = update.lastName

        await db.commit()
        await db.refresh(subscriber)

        return subscriber

    async def unsubscribe(
        self, db: AsyncSession, subscriber: NewsletterSubscriber
    ) -> NewsletterSubscriber:
        """Unsubscribe a subscriber"""
        subscriber.status = "unsubscribed"
        subscriber.unsubscribed_at = datetime.utcnow()

        await db.commit()
        await db.refresh(subscriber)

        return subscriber

    async def delete_subscriber(
        self, db: AsyncSession, subscriber: NewsletterSubscriber
    ) -> bool:
        """Delete a subscriber"""
        await db.delete(subscriber)
        await db.commit()
        return True

    async def get_subscribers(
        self,
        db: AsyncSession,
        page: int = 1,
        limit: int = 20,
        status: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[NewsletterSubscriber], int]:
        """Get subscribers with pagination and filters"""
        query = select(NewsletterSubscriber)

        # Apply filters
        if status:
            query = query.where(NewsletterSubscriber.status == status)

        if search:
            search_pattern = f"%{search}%"
            query = query.where(
                or_(
                    NewsletterSubscriber.email.ilike(search_pattern),
                    NewsletterSubscriber.first_name.ilike(search_pattern),
                    NewsletterSubscriber.last_name.ilike(search_pattern),
                )
            )

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar()

        # Apply pagination and ordering
        query = query.order_by(NewsletterSubscriber.subscribed_at.desc())
        query = query.offset((page - 1) * limit).limit(limit)

        result = await db.execute(query)
        subscribers = result.scalars().all()

        return list(subscribers), total

    async def get_stats(self, db: AsyncSession) -> dict:
        """Get newsletter statistics"""
        # Total subscribers
        total_result = await db.execute(
            select(func.count()).select_from(NewsletterSubscriber)
        )
        total_subscribers = total_result.scalar()

        # Active subscribers
        active_result = await db.execute(
            select(func.count())
            .select_from(NewsletterSubscriber)
            .where(NewsletterSubscriber.status == "active")
        )
        active_subscribers = active_result.scalar()

        # Unsubscribed count
        unsubscribed_result = await db.execute(
            select(func.count())
            .select_from(NewsletterSubscriber)
            .where(NewsletterSubscriber.status == "unsubscribed")
        )
        unsubscribed_count = unsubscribed_result.scalar()

        # New subscribers this week
        week_ago = datetime.utcnow() - timedelta(days=7)
        new_week_result = await db.execute(
            select(func.count())
            .select_from(NewsletterSubscriber)
            .where(NewsletterSubscriber.subscribed_at >= week_ago)
        )
        new_subscribers_this_week = new_week_result.scalar()

        # New subscribers this month
        month_ago = datetime.utcnow() - timedelta(days=30)
        new_month_result = await db.execute(
            select(func.count())
            .select_from(NewsletterSubscriber)
            .where(NewsletterSubscriber.subscribed_at >= month_ago)
        )
        new_subscribers_this_month = new_month_result.scalar()

        # Calculate unsubscribe rate
        unsubscribe_rate = 0
        if total_subscribers > 0:
            unsubscribe_rate = (unsubscribed_count / total_subscribers) * 100

        return {
            "totalSubscribers": total_subscribers,
            "activeSubscribers": active_subscribers,
            "unsubscribedCount": unsubscribed_count,
            "bouncedCount": 0,  # Would be calculated from bounce events
            "newSubscribersThisWeek": new_subscribers_this_week,
            "newSubscribersThisMonth": new_subscribers_this_month,
            "unsubscribeRate": round(unsubscribe_rate, 2),
            "averageOpenRate": 0.0,  # Would be calculated from events
            "averageClickRate": 0.0,  # Would be calculated from events
        }

    async def create_campaign(
        self, db: AsyncSession, campaign: NewsletterCampaignCreate
    ) -> NewsletterCampaign:
        """Create a new campaign"""
        new_campaign = NewsletterCampaign(
            name=campaign.name,
            subject=campaign.subject,
            content=campaign.content,
            status="draft",
            scheduled_at=campaign.scheduledAt,
        )

        db.add(new_campaign)
        await db.commit()
        await db.refresh(new_campaign)

        return new_campaign

    async def get_campaign_by_id(
        self, db: AsyncSession, campaign_id: str
    ) -> Optional[NewsletterCampaign]:
        """Get campaign by ID"""
        result = await db.execute(
            select(NewsletterCampaign).where(NewsletterCampaign.id == campaign_id)
        )
        return result.scalar_one_or_none()

    async def get_campaigns(
        self, db: AsyncSession
    ) -> List[NewsletterCampaign]:
        """Get all campaigns"""
        result = await db.execute(
            select(NewsletterCampaign)
            .order_by(NewsletterCampaign.created_at.desc())
        )
        return list(result.scalars().all())

    async def send_campaign(
        self, db: AsyncSession, campaign: NewsletterCampaign
    ) -> bool:
        """Send a campaign to all active subscribers"""
        # Get all active subscribers
        result = await db.execute(
            select(NewsletterSubscriber).where(
                NewsletterSubscriber.status == "active"
            )
        )
        subscribers = result.scalars().all()

        # Update campaign status
        campaign.status = "sending"
        await db.commit()

        # In a real implementation, you would:
        # 1. Queue emails to be sent
        # 2. Use a background task or Celery to send them
        # 3. Track delivery status

        # For now, just mark as sent
        campaign.status = "sent"
        campaign.sent_at = datetime.utcnow()
        campaign.stats_sent = len(subscribers)

        await db.commit()

        return True

    def export_subscribers_csv(
        self, subscribers: List[NewsletterSubscriber]
    ) -> str:
        """Export subscribers to CSV format"""
        output = io.StringIO()
        writer = csv.writer(output)

        # Write header
        writer.writerow([
            "Email",
            "First Name",
            "Last Name",
            "Tags",
            "Status",
            "Subscribed At",
            "Unsubscribed At",
        ])

        # Write data
        for subscriber in subscribers:
            writer.writerow([
                subscriber.email,
                subscriber.first_name or "",
                subscriber.last_name or "",
                ", ".join(subscriber.tags or []),
                subscriber.status,
                subscriber.subscribed_at.isoformat() if subscriber.subscribed_at else "",
                subscriber.unsubscribed_at.isoformat() if subscriber.unsubscribed_at else "",
            ])

        return output.getvalue()

    def export_subscribers_json(
        self, subscribers: List[NewsletterSubscriber]
    ) -> str:
        """Export subscribers to JSON format"""
        data = []
        for subscriber in subscribers:
            data.append({
                "email": subscriber.email,
                "first_name": subscriber.first_name,
                "last_name": subscriber.last_name,
                "tags": subscriber.tags,
                "status": subscriber.status,
                "subscribed_at": subscriber.subscribed_at.isoformat() if subscriber.subscribed_at else None,
                "unsubscribed_at": subscriber.unsubscribed_at.isoformat() if subscriber.unsubscribed_at else None,
            })

        return json.dumps(data, indent=2)

    async def send_welcome_email(self, subscriber: NewsletterSubscriber):
        """Send welcome email to new subscriber"""
        # In a real implementation, you would use an email service
        # like SendGrid, Mailgun, or AWS SES
        pass

    async def send_goodbye_email(self, subscriber: NewsletterSubscriber):
        """Send goodbye email to unsubscribed user"""
        # In a real implementation, you would use an email service
        pass

    async def get_analytics(self, db: AsyncSession, period: str) -> dict:
        """Get analytics for a time period"""
        # Calculate date range based on period
        if period == "1d":
            start_date = datetime.utcnow() - timedelta(days=1)
        elif period == "7d":
            start_date = datetime.utcnow() - timedelta(days=7)
        elif period == "30d":
            start_date = datetime.utcnow() - timedelta(days=30)
        else:  # 90d
            start_date = datetime.utcnow() - timedelta(days=90)

        # Get new subscribers in period
        new_result = await db.execute(
            select(func.count())
            .select_from(NewsletterSubscriber)
            .where(NewsletterSubscriber.subscribed_at >= start_date)
        )
        new_subscribers = new_result.scalar()

        return {
            "period": period,
            "new_subscribers": new_subscribers,
        }


# Create singleton instance
newsletter_service = NewsletterService()
