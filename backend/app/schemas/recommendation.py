"""
Recommendation schemas for content recommendation system
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class RecommendationStrategy(str, Enum):
    """Recommendation strategy types"""
    collaborative = "collaborative"
    content_based = "content_based"
    hybrid = "hybrid"
    trending = "trending"
    random = "random"


class RecommendationItem(BaseModel):
    """Individual recommendation item"""
    id: str
    title: str
    slug: str
    excerpt: Optional[str] = None
    cover_image: Optional[str] = None
    category: dict
    tags: List[dict] = []
    author: dict
    published_at: datetime
    read_time: Optional[int] = None
    stats: Optional[dict] = None
    score: Optional[float] = Field(
        default=None,
        description="Relevance score (0-1)"
    )
    reason: Optional[str] = Field(
        default=None,
        description="Why this post was recommended"
    )

    class Config:
        from_attributes = True


class RecommendationResponse(BaseModel):
    """Response for related posts recommendation"""
    post_id: str
    strategy: RecommendationStrategy
    recommendations: List[RecommendationItem]
    generated_at: datetime
    total: int = Field(default=0)


class RecommendationFeedback(BaseModel):
    """Feedback on recommendations"""
    user_id: str
    post_id: str
    feedback: str  # like, dislike, hide
    reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class RecommendationStats(BaseModel):
    """Statistics about the recommendation system"""
    total_recommendations: int
    avg_score: float
    popular_categories: List[dict]
    recent_activity: List[dict]
    strategy_performance: dict
