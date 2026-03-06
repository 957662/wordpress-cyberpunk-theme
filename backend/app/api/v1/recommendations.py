"""
Recommendations API - Content recommendation system
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from ....core.database import get_db
from ....schemas.recommendation import (
    RecommendationResponse,
    RecommendationItem,
    RecommendationStrategy,
)
from ....services.recommendation_service import RecommendationService
from ....api.dependencies import get_current_user
from ....models.user import User

router = APIRouter()


@router.get("/posts/{post_id}/related", response_model=RecommendationResponse)
async def get_related_posts(
    post_id: str,
    limit: int = Query(5, ge=1, le=20),
    strategy: RecommendationStrategy = Query(
        RecommendationStrategy.hybrid,
        description="Recommendation strategy to use"
    ),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Get related posts based on various recommendation strategies.

    Strategies:
    - collaborative: Based on user behavior and preferences
    - content_based: Based on post content similarity
    - hybrid: Combines multiple strategies (default)
    - trending: Based on recent popularity
    - random: Random posts for discovery
    """
    try:
        recommendation_service = RecommendationService(db)

        recommendations = await recommendation_service.get_related_posts(
            post_id=post_id,
            user_id=current_user.id if current_user else None,
            strategy=strategy,
            limit=limit
        )

        return RecommendationResponse(
            post_id=post_id,
            strategy=strategy,
            recommendations=recommendations,
            generated_at=datetime.utcnow()
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate recommendations: {str(e)}"
        )


@router.get("/posts/discover", response_model=List[RecommendationItem])
async def discover_posts(
    limit: int = Query(10, ge=1, le=50),
    offset: int = Query(0, ge=0),
    category_id: Optional[str] = Query(None),
    exclude_read: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """
    Discover new posts based on user preferences and reading history.
    """
    try:
        recommendation_service = RecommendationService(db)

        posts = await recommendation_service.discover_posts(
            user_id=current_user.id if current_user else None,
            category_id=category_id,
            exclude_read=exclude_read,
            limit=limit,
            offset=offset
        )

        return posts

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to discover posts: {str(e)}"
        )


@router.get("/users/{user_id}/feed", response_model=List[RecommendationItem])
async def get_personalized_feed(
    user_id: str,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get a personalized feed for the user based on their interests and behavior.
    """
    try:
        # Users can only view their own feed
        if current_user.id != user_id:
            raise HTTPException(
                status_code=403,
                detail="You can only view your own feed"
            )

        recommendation_service = RecommendationService(db)

        feed = await recommendation_service.get_personalized_feed(
            user_id=user_id,
            limit=limit,
            offset=offset
        )

        return feed

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate personalized feed: {str(e)}"
        )


@router.get("/trending", response_model=List[RecommendationItem])
async def get_trending_posts(
    time_range: str = Query(
        "24h",
        regex="^(1h|6h|24h|7d|30d)$",
        description="Time range for trending posts"
    ),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """
    Get trending posts within a specified time range.
    """
    try:
        recommendation_service = RecommendationService(db)

        # Convert time range to datetime
        time_map = {
            "1h": timedelta(hours=1),
            "6h": timedelta(hours=6),
            "24h": timedelta(days=1),
            "7d": timedelta(days=7),
            "30d": timedelta(days=30),
        }

        since = datetime.utcnow() - time_map[time_range]

        trending = await recommendation_service.get_trending_posts(
            since=since,
            limit=limit
        )

        return trending

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch trending posts: {str(e)}"
        )


@router.post("/feedback/{post_id}")
async def submit_feedback(
    post_id: str,
    feedback: str = Query(..., regex="^(like|dislike|hide)$"),
    reason: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Submit feedback on recommendations to improve future suggestions.
    """
    try:
        recommendation_service = RecommendationService(db)

        await recommendation_service.record_feedback(
            user_id=current_user.id,
            post_id=post_id,
            feedback=feedback,
            reason=reason
        )

        return {
            "success": True,
            "message": "Feedback recorded successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to record feedback: {str(e)}"
        )


@router.get("/stats", response_model=dict)
async def get_recommendation_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get statistics about the recommendation system.
    """
    try:
        recommendation_service = RecommendationService(db)

        stats = await recommendation_service.get_stats()

        return stats

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch stats: {str(e)}"
        )
