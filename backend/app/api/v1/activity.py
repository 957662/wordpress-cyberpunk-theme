"""
Activity Stream API - Real-time activity feed
Provides endpoints for retrieving user activities, notifications,
and building social activity streams.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import logging

from ...core.database import get_db
from ...core.auth import get_current_user
from ...models.user import User
from ...models.activity import Activity
from ...models.follow import Follow
from ...schemas.activity import (
    ActivityResponse,
    ActivityListResponse,
    ActivityStats,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("/feed", response_model=ActivityListResponse)
async def get_activity_feed(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get personalized activity feed for the current user.
    Includes activities from followed users and own activities.

    Args:
        page: Page number for pagination
        per_page: Number of items per page
        current_user: Authenticated user
        db: Database session

    Returns:
        Paginated list of activities
    """
    try:
        # Get list of followed user IDs
        follow_query = select(Follow.followed_id).where(
            Follow.follower_id == current_user.id
        )
        follow_result = await db.execute(follow_query)
        followed_ids = [row[0] for row in follow_result.fetchall()]

        # Include current user's own activities
        followed_ids.append(current_user.id)

        # Build query
        query = (
            select(Activity)
            .where(Activity.actor_id.in_(followed_ids))
            .order_by(desc(Activity.created_at))
        )

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar()

        # Apply pagination
        query = query.offset((page - 1) * per_page).limit(per_page)
        result = await db.execute(query)
        activities = result.scalars().all()

        # Mark as read
        for activity in activities:
            if not activity.is_read and activity.actor_id != current_user.id:
                activity.is_read = True
                activity.read_at = datetime.utcnow()

        await db.commit()

        return {
            'items': activities,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page,
        }

    except Exception as e:
        logger.error(f"Error getting activity feed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve activity feed"
        )


@router.get("/stats", response_model=ActivityStats)
async def get_activity_stats(
    days: int = Query(30, ge=1, le=365, description="Number of days to analyze"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get activity statistics for the current user.

    Args:
        days: Number of days to include in statistics
        current_user: Authenticated user
        db: Database session

    Returns:
        Activity statistics
    """
    try:
        since_date = datetime.utcnow() - timedelta(days=days)

        # Total activities
        total_query = select(func.count(Activity.id)).where(
            and_(
                Activity.actor_id == current_user.id,
                Activity.created_at >= since_date
            )
        )
        total_result = await db.execute(total_query)
        total_activities = total_result.scalar() or 0

        # Activities by type
        type_query = (
            select(Activity.type, func.count(Activity.id))
            .where(
                and_(
                    Activity.actor_id == current_user.id,
                    Activity.created_at >= since_date
                )
            )
            .group_by(Activity.type)
        )
        type_result = await db.execute(type_query)
        activities_by_type = {row[0]: row[1] for row in type_result.fetchall()}

        # Unread count
        unread_query = select(func.count(Activity.id)).where(
            and_(
                Activity.actor_id != current_user.id,
                Activity.is_read == False
            )
        )
        unread_result = await db.execute(unread_query)
        unread_count = unread_result.scalar() or 0

        return {
            'total_activities': total_activities,
            'activities_by_type': activities_by_type,
            'unread_count': unread_count,
            'period_days': days,
        }

    except Exception as e:
        logger.error(f"Error getting activity stats: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve activity statistics"
        )


@router.get("/notifications", response_model=ActivityListResponse)
async def get_notifications(
    page: int = Query(1, ge=1),
    per_page: int = Query(50, ge=1, le=100),
    unread_only: bool = Query(False, description="Only return unread notifications"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get notifications for the current user (activities where user is the target).

    Args:
        page: Page number for pagination
        per_page: Number of items per page
        unread_only: If true, only return unread notifications
        current_user: Authenticated user
        db: Database session

    Returns:
        Paginated list of notifications
    """
    try:
        # Build query for activities where user is mentioned or followed
        query = (
            select(Activity)
            .where(
                and_(
                    Activity.actor_id != current_user.id,
                    or_(
                        Activity.target_user_id == current_user.id,
                        Activity.type.in_(['follow', 'mention', 'like', 'comment'])
                    )
                )
            )
            .order_by(desc(Activity.created_at))
        )

        if unread_only:
            query = query.where(Activity.is_read == False)

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar()

        # Apply pagination
        query = query.offset((page - 1) * per_page).limit(per_page)
        result = await db.execute(query)
        activities = result.scalars().all()

        return {
            'items': activities,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page,
        }

    except Exception as e:
        logger.error(f"Error getting notifications: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve notifications"
        )


@router.post("/activities/{activity_id}/read", status_code=status.HTTP_204_NO_CONTENT)
async def mark_activity_read(
    activity_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Mark an activity as read.

    Args:
        activity_id: ID of the activity
        current_user: Authenticated user
        db: Database session
    """
    try:
        query = select(Activity).where(Activity.id == activity_id)
        result = await db.execute(query)
        activity = result.scalar_one_or_none()

        if not activity:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Activity not found"
            )

        activity.is_read = True
        activity.read_at = datetime.utcnow()

        await db.commit()
        return None

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking activity as read: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark activity as read"
        )


@router.post("/notifications/read-all", status_code=status.HTTP_204_NO_CONTENT)
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Mark all notifications as read for the current user.

    Args:
        current_user: Authenticated user
        db: Database session
    """
    try:
        # Get all unread notifications
        query = select(Activity).where(
            and_(
                Activity.actor_id != current_user.id,
                Activity.is_read == False,
                or_(
                    Activity.target_user_id == current_user.id,
                    Activity.type.in_(['follow', 'mention', 'like', 'comment'])
                )
            )
        )
        result = await db.execute(query)
        activities = result.scalars().all()

        # Mark all as read
        for activity in activities:
            activity.is_read = True
            activity.read_at = datetime.utcnow()

        await db.commit()

        logger.info(f"Marked {len(activities)} notifications as read for user {current_user.id}")
        return None

    except Exception as e:
        logger.error(f"Error marking all notifications as read: {e}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to mark all notifications as read"
        )


@router.get("/trending", response_model=ActivityListResponse)
async def get_trending_activities(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get trending activities across the platform.
    Based on recent engagement metrics.

    Args:
        page: Page number for pagination
        per_page: Number of items per page
        current_user: Authenticated user
        db: Database session

    Returns:
        Paginated list of trending activities
    """
    try:
        # Get activities from the last 7 days
        since_date = datetime.utcnow() - timedelta(days=7)

        # For now, just return recent activities
        # In a real implementation, you'd calculate trending scores
        # based on likes, comments, shares, etc.
        query = (
            select(Activity)
            .where(Activity.created_at >= since_date)
            .order_by(desc(Activity.created_at))
        )

        # Get total count
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar()

        # Apply pagination
        query = query.offset((page - 1) * per_page).limit(per_page)
        result = await db.execute(query)
        activities = result.scalars().all()

        return {
            'items': activities,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page,
        }

    except Exception as e:
        logger.error(f"Error getting trending activities: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve trending activities"
        )
