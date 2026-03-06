"""
Newsletter API Endpoints
Handles newsletter subscriptions, unsubscribes, and management
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from datetime import datetime, timedelta
import secrets

from ...core.auth import get_current_user, get_current_admin_user
from ...core.database import get_db
from ...schemas.newsletter import (
    NewsletterSubscription,
    NewsletterSubscriber,
    NewsletterStats,
    UnsubscribeRequest,
    SubscriberUpdate,
    NewsletterCampaign,
    NewsletterCampaignCreate,
)
from ...services.newsletter_service import newsletter_service

router = APIRouter(prefix="/newsletter", tags=["newsletter"])


@router.post("/subscribe", response_model=NewsletterSubscriber)
async def subscribe_to_newsletter(
    subscription: NewsletterSubscription,
    db: AsyncSession = Depends(get_db),
):
    """
    Subscribe a new email to the newsletter
    """
    try:
        # Check if email is already subscribed
        existing = await newsletter_service.get_subscriber_by_email(db, subscription.email)
        if existing and existing.status == "active":
            raise HTTPException(
                status_code=400,
                detail="Email is already subscribed to the newsletter",
            )

        # Create new subscriber
        subscriber = await newsletter_service.create_subscriber(db, subscription)

        # Send welcome email if enabled
        await newsletter_service.send_welcome_email(subscriber)

        return subscriber
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/unsubscribe")
async def unsubscribe_from_newsletter(
    request: UnsubscribeRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Unsubscribe an email from the newsletter
    """
    subscriber = await newsletter_service.get_subscriber_by_token(db, request.token)
    if not subscriber:
        raise HTTPException(status_code=404, detail="Invalid unsubscribe token")

    await newsletter_service.unsubscribe(db, subscriber)
    await newsletter_service.send_goodbye_email(subscriber)

    return {"success": True, "message": "Successfully unsubscribed"}


@router.get("/status")
async def check_subscription_status(
    email: str = Query(..., description="Email to check"),
    db: AsyncSession = Depends(get_db),
):
    """
    Check if an email is subscribed to the newsletter
    """
    subscriber = await newsletter_service.get_subscriber_by_email(db, email)

    if not subscriber:
        return {"subscribed": False}

    return {
        "subscribed": subscriber.status == "active",
        "subscriber": subscriber,
    }


@router.get("/subscribers/{subscriber_id}", response_model=NewsletterSubscriber)
async def get_subscriber(
    subscriber_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Get subscriber profile by ID (admin only)
    """
    subscriber = await newsletter_service.get_subscriber_by_id(db, subscriber_id)
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")

    return subscriber


@router.patch("/subscribers/{subscriber_id}", response_model=NewsletterSubscriber)
async def update_subscriber(
    subscriber_id: str,
    update: SubscriberUpdate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Update subscriber preferences (admin only)
    """
    subscriber = await newsletter_service.get_subscriber_by_id(db, subscriber_id)
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")

    updated_subscriber = await newsletter_service.update_subscriber(db, subscriber, update)
    return updated_subscriber


@router.delete("/subscribers/{subscriber_id}")
async def delete_subscriber(
    subscriber_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Delete a subscriber (admin only)
    """
    subscriber = await newsletter_service.get_subscriber_by_id(db, subscriber_id)
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")

    await newsletter_service.delete_subscriber(db, subscriber)
    return {"success": True}


@router.get("/subscribers")
async def get_subscribers(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search by email or name"),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Get all subscribers with pagination (admin only)
    """
    subscribers, total = await newsletter_service.get_subscribers(
        db, page=page, limit=limit, status=status, search=search
    )

    return {
        "items": subscribers,
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit,
    }


@router.get("/subscribers/export")
async def export_subscribers(
    format: str = Query("csv", description="Export format (csv or json)"),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Export all subscribers (admin only)
    """
    if format not in ["csv", "json"]:
        raise HTTPException(status_code=400, detail="Format must be csv or json")

    subscribers, _ = await newsletter_service.get_subscribers(db, page=1, limit=10000)

    if format == "csv":
        csv_data = newsletter_service.export_subscribers_csv(subscribers)
        return Response(content=csv_data, media_type="text/csv", headers={
            "Content-Disposition": "attachment; filename=subscribers.csv"
        })
    else:
        json_data = newsletter_service.export_subscribers_json(subscribers)
        return Response(content=json_data, media_type="application/json", headers={
            "Content-Disposition": "attachment; filename=subscribers.json"
        })


@router.get("/stats", response_model=NewsletterStats)
async def get_newsletter_stats(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Get newsletter statistics (admin only)
    """
    stats = await newsletter_service.get_stats(db)
    return stats


@router.get("/campaigns", response_model=List[NewsletterCampaign])
async def get_campaigns(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Get all campaigns (admin only)
    """
    campaigns = await newsletter_service.get_campaigns(db)
    return campaigns


@router.post("/campaigns", response_model=NewsletterCampaign)
async def create_campaign(
    campaign: NewsletterCampaignCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Create a new campaign (admin only)
    """
    new_campaign = await newsletter_service.create_campaign(db, campaign)
    return new_campaign


@router.post("/campaigns/{campaign_id}/send")
async def send_campaign(
    campaign_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Send a campaign (admin only)
    """
    campaign = await newsletter_service.get_campaign_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")

    if campaign.status != "draft":
        raise HTTPException(status_code=400, detail="Campaign has already been sent")

    # Send campaign in background
    await newsletter_service.send_campaign(db, campaign)

    return {"success": True, "message": "Campaign is being sent"}


@router.get("/analytics")
async def get_analytics(
    period: str = Query("7d", description="Time period (1d, 7d, 30d, 90d)"),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """
    Get newsletter analytics (admin only)
    """
    analytics = await newsletter_service.get_analytics(db, period)
    return analytics
