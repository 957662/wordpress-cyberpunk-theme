"""
Search service for advanced search functionality
"""
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from app.models.post import Post
from app.models.tag import Tag
from app.models.category import Category
from app.core.logging import get_logger

logger = get_logger(__name__)


class SearchService:
    """Service for handling search operations"""

    def __init__(self, db: Session):
        self.db = db

    def search_posts(
        self,
        query: str,
        category_id: Optional[int] = None,
        tag_ids: Optional[List[int]] = None,
        author_id: Optional[int] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Dict[str, Any]:
        """
        Search posts with filters

        Args:
            query: Search query string
            category_id: Filter by category
            tag_ids: Filter by tags
            author_id: Filter by author
            page: Page number
            page_size: Items per page

        Returns:
            Dict with results and metadata
        """
        try:
            # Build base query
            q = self.db.query(Post).filter(Post.status == "published")

            # Apply text search
            if query:
                search_pattern = f"%{query}%"
                q = q.filter(
                    or_(
                        Post.title.ilike(search_pattern),
                        Post.content.ilike(search_pattern),
                        Post.excerpt.ilike(search_pattern)
                    )
                )

            # Apply filters
            if category_id:
                q = q.filter(Post.category_id == category_id)

            if tag_ids:
                q = q.join(Post.tags).filter(Tag.id.in_(tag_ids))

            if author_id:
                q = q.filter(Post.author_id == author_id)

            # Get total count
            total = q.count()

            # Apply pagination
            offset = (page - 1) * page_size
            results = q.order_by(Post.created_at.desc()).offset(offset).limit(page_size).all()

            # Calculate metadata
            total_pages = (total + page_size - 1) // page_size

            logger.info(f"Search completed: {total} results for query '{query}'")

            return {
                "results": [self._post_to_dict(post) for post in results],
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
            }

        except Exception as e:
            logger.error(f"Search failed: {str(e)}")
            return {
                "results": [],
                "total": 0,
                "page": page,
                "page_size": page_size,
                "total_pages": 0,
            }

    def search_suggestions(
        self,
        query: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get search suggestions

        Args:
            query: Partial search query
            limit: Max number of suggestions

        Returns:
            List of suggestion objects
        """
        try:
            if not query or len(query) < 2:
                return []

            search_pattern = f"%{query}%"

            # Search posts
            posts = self.db.query(Post).filter(
                and_(
                    Post.status == "published",
                    or_(
                        Post.title.ilike(search_pattern),
                        Post.excerpt.ilike(search_pattern)
                    )
                )
            ).limit(limit).all()

            # Search categories
            categories = self.db.query(Category).filter(
                Category.name.ilike(search_pattern)
            ).limit(5).all()

            # Search tags
            tags = self.db.query(Tag).filter(
                Tag.name.ilike(search_pattern)
            ).limit(5).all()

            suggestions = []

            # Add post suggestions
            for post in posts:
                suggestions.append({
                    "type": "post",
                    "id": post.id,
                    "title": post.title,
                    "url": f"/blog/{post.slug}",
                })

            # Add category suggestions
            for category in categories:
                suggestions.append({
                    "type": "category",
                    "id": category.id,
                    "title": f"Category: {category.name}",
                    "url": f"/categories/{category.slug}",
                })

            # Add tag suggestions
            for tag in tags:
                suggestions.append({
                    "type": "tag",
                    "id": tag.id,
                    "title": f"Tag: {tag.name}",
                    "url": f"/tags/{tag.slug}",
                })

            return suggestions[:limit]

        except Exception as e:
            logger.error(f"Suggestions failed: {str(e)}")
            return []

    def get_trending_searches(
        self,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get trending search terms

        Args:
            limit: Max number of trending items

        Returns:
            List of trending search terms with counts
        """
        try:
            # This would typically use a search analytics table
            # For now, return mock data
            return [
                {"query": "Cyberpunk 2077", "count": 1234},
                {"query": "Next.js 14", "count": 987},
                {"query": "TypeScript", "count": 876},
                {"query": "FastAPI", "count": 765},
                {"query": "React Server Components", "count": 654},
            ][:limit]

        except Exception as e:
            logger.error(f"Trending searches failed: {str(e)}")
            return []

    def _post_to_dict(self, post: Post) -> Dict[str, Any]:
        """Convert post to dictionary"""
        return {
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "excerpt": post.excerpt,
            "content": post.content,
            "featured_image": post.featured_image,
            "category_id": post.category_id,
            "author_id": post.author_id,
            "status": post.status,
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "updated_at": post.updated_at.isoformat() if post.updated_at else None,
        }
