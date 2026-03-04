"""
Recommendation Service - Content and user recommendation engine
Provides personalized recommendations based on user behavior,
preferences, and collaborative filtering.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.orm import selectinload
import logging

from ..models.post import Post, Category, Tag
from ..models.user import User
from ..models.analytics import PostView, Like, Bookmark
from ..models.follow import Follow

logger = logging.getLogger(__name__)


class RecommendationService:
    """
    Service for generating personalized recommendations.
    Uses collaborative filtering and content-based filtering.
    """

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_recommended_posts(
        self,
        user_id: int,
        limit: int = 10,
        exclude_read: bool = True
    ) -> List[Post]:
        """
        Get recommended posts for a user based on their interests and behavior.

        Args:
            user_id: ID of the user to get recommendations for
            limit: Maximum number of posts to return
            exclude_read: Whether to exclude posts the user has already read

        Returns:
            List of recommended posts
        """
        try:
            # Get user's interests based on their liked and bookmarked posts
            user_interests = await self._get_user_interests(user_id)

            # Get posts the user has already interacted with
            interacted_post_ids = await self._get_interacted_post_ids(user_id)

            # Build query
            query = (
                select(Post)
                .where(
                    and_(
                        Post.is_published == True,
                        Post.published_at <= datetime.utcnow()
                    )
                )
            )

            # Exclude interacted posts if requested
            if exclude_read and interacted_post_ids:
                query = query.where(Post.id.notin_(interacted_post_ids))

            # Get posts matching user interests
            if user_interests['category_ids']:
                query = query.where(Post.category_id.in_(user_interests['category_ids']))

            # Order by relevance (likes, views, comments)
            query = query.order_by(
                desc(Post.likes_count),
                desc(Post.views_count),
                desc(Post.published_at)
            )

            # Limit and execute
            query = query.limit(limit)
            result = await self.db.execute(query)
            posts = result.scalars().all()

            logger.info(f"Generated {len(posts)} recommendations for user {user_id}")
            return posts

        except Exception as e:
            logger.error(f"Error generating post recommendations: {e}")
            return []

    async def get_recommended_users(
        self,
        user_id: int,
        limit: int = 10
    ) -> List[User]:
        """
        Get recommended users to follow based on similar interests and connections.

        Args:
            user_id: ID of the user to get recommendations for
            limit: Maximum number of users to return

        Returns:
            List of recommended users
        """
        try:
            # Get users already followed
            follow_query = select(Follow.followed_id).where(
                Follow.follower_id == user_id
            )
            follow_result = await self.db.execute(follow_query)
            followed_ids = [row[0] for row in follow_result.fetchall()]

            # Get user's interests
            user_interests = await self._get_user_interests(user_id)

            # Find users with similar interests
            # This is a simplified version - in production you'd use more sophisticated algorithms
            query = (
                select(User)
                .where(
                    and_(
                        User.id != user_id,
                        User.id.notin_(followed_ids) if followed_ids else True,
                        User.is_active == True
                    )
                )
                .order_by(func.random())
                .limit(limit)
            )

            result = await self.db.execute(query)
            users = result.scalars().all()

            logger.info(f"Generated {len(users)} user recommendations for user {user_id}")
            return users

        except Exception as e:
            logger.error(f"Error generating user recommendations: {e}")
            return []

    async def get_trending_posts(
        self,
        limit: int = 10,
        time_period: int = 7
    ) -> List[Post]:
        """
        Get trending posts based on recent engagement.

        Args:
            limit: Maximum number of posts to return
            time_period: Number of days to look back

        Returns:
            List of trending posts
        """
        try:
            since_date = datetime.utcnow() - timedelta(days=time_period)

            # Get posts with high engagement in the time period
            query = (
                select(Post)
                .where(
                    and_(
                        Post.is_published == True,
                        Post.published_at >= since_date
                    )
                )
                .order_by(
                    desc(Post.likes_count + Post.comments_count * 2),
                    desc(Post.published_at)
                )
                .limit(limit)
            )

            result = await self.db.execute(query)
            posts = result.scalars().all()

            logger.info(f"Retrieved {len(posts)} trending posts")
            return posts

        except Exception as e:
            logger.error(f"Error getting trending posts: {e}")
            return []

    async def get_related_posts(
        self,
        post_id: int,
        limit: int = 5
    ) -> List[Post]:
        """
        Get posts related to a given post.

        Args:
            post_id: ID of the post to find related posts for
            limit: Maximum number of posts to return

        Returns:
            List of related posts
        """
        try:
            # Get the source post
            post_query = select(Post).where(Post.id == post_id)
            post_result = await self.db.execute(post_query)
            post = post_result.scalar_one_or_none()

            if not post:
                return []

            # Find related posts by category and tags
            query = (
                select(Post)
                .where(
                    and_(
                        Post.id != post_id,
                        Post.is_published == True,
                        or_(
                            Post.category_id == post.category_id,
                            # In a real implementation, you'd also check for shared tags
                        )
                    )
                )
                .order_by(
                    desc(Post.likes_count),
                    desc(Post.published_at)
                )
                .limit(limit)
            )

            result = await self.db.execute(query)
            posts = result.scalars().all()

            logger.info(f"Found {len(posts)} related posts for post {post_id}")
            return posts

        except Exception as e:
            logger.error(f"Error getting related posts: {e}")
            return []

    async def _get_user_interests(self, user_id: int) -> Dict[str, List[int]]:
        """
        Get user's interests based on their interactions.

        Args:
            user_id: ID of the user

        Returns:
            Dictionary with category_ids and tag_ids
        """
        try:
            # Get liked posts
            like_query = (
                select(Like.post_id)
                .where(Like.user_id == user_id)
                .distinct()
            )
            like_result = await self.db.execute(like_query)
            liked_post_ids = [row[0] for row in like_result.fetchall()]

            # Get bookmarked posts
            bookmark_query = (
                select(Bookmark.post_id)
                .where(Bookmark.user_id == user_id)
                .distinct()
            )
            bookmark_result = await self.db.execute(bookmark_query)
            bookmarked_post_ids = [row[0] for row in bookmark_result.fetchall()]

            # Combine post IDs
            interacted_post_ids = list(set(liked_post_ids + bookmarked_post_ids))

            if not interacted_post_ids:
                return {'category_ids': [], 'tag_ids': []}

            # Get categories from these posts
            post_query = select(Post).where(Post.id.in_(interacted_post_ids))
            post_result = await self.db.execute(post_query)
            posts = post_result.scalars().all()

            category_ids = list(set([post.category_id for post in posts if post.category_id]))

            return {
                'category_ids': category_ids,
                'tag_ids': [],  # Would be populated if posts had tags
            }

        except Exception as e:
            logger.error(f"Error getting user interests: {e}")
            return {'category_ids': [], 'tag_ids': []}

    async def _get_interacted_post_ids(self, user_id: int) -> List[int]:
        """
        Get IDs of posts the user has interacted with.

        Args:
            user_id: ID of the user

        Returns:
            List of post IDs
        """
        try:
            # Get viewed posts
            view_query = select(PostView.post_id).where(PostView.user_id == user_id)
            view_result = await self.db.execute(view_query)
            viewed_ids = [row[0] for row in view_result.fetchall()]

            # Get liked posts
            like_query = select(Like.post_id).where(Like.user_id == user_id)
            like_result = await self.db.execute(like_query)
            liked_ids = [row[0] for row in like_result.fetchall()]

            # Get bookmarked posts
            bookmark_query = select(Bookmark.post_id).where(Bookmark.user_id == user_id)
            bookmark_result = await self.db.execute(bookmark_query)
            bookmarked_ids = [row[0] for row in bookmark_result.fetchall()]

            # Combine all IDs
            all_ids = list(set(viewed_ids + liked_ids + bookmarked_ids))

            return all_ids

        except Exception as e:
            logger.error(f"Error getting interacted post IDs: {e}")
            return []


# Factory function for easy instantiation
def get_recommendation_service(db: AsyncSession) -> RecommendationService:
    """Create a recommendation service instance."""
    return RecommendationService(db)
