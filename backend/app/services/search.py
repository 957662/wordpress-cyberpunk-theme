"""
Search Service
搜索服务 - 提供全文搜索和过滤功能
"""

from typing import List, Optional, Dict, Any
from sqlalchemy import or_, and_, func
from sqlalchemy.orm import Session

from app.models.post import Post, Category, Tag
from app.models.user import User
from app.schemas.post import PostResponse


class SearchService:
    """搜索服务类"""

    def __init__(self, db: Session):
        self.db = db

    def search_posts(
        self,
        query: str,
        category_id: Optional[int] = None,
        tag_id: Optional[int] = None,
        author_id: Optional[int] = None,
        status: str = "published",
        limit: int = 20,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """
        搜索文章

        Args:
            query: 搜索关键词
            category_id: 分类ID
            tag_id: 标签ID
            author_id: 作者ID
            status: 文章状态
            limit: 返回数量
            offset: 偏移量

        Returns:
            包含搜索结果和总数的字典
        """
        # 构建基础查询
        db_query = self.db.query(Post).filter(Post.status == status)

        # 关键词搜索
        if query:
            search_pattern = f"%{query}%"
            db_query = db_query.filter(
                or_(
                    Post.title.ilike(search_pattern),
                    Post.content.ilike(search_pattern),
                    Post.excerpt.ilike(search_pattern),
                )
            )

        # 分类过滤
        if category_id:
            db_query = db_query.filter(Post.category_id == category_id)

        # 标签过滤
        if tag_id:
            db_query = db_query.join(Post.tags).filter(Tag.id == tag_id)

        # 作者过滤
        if author_id:
            db_query = db_query.filter(Post.author_id == author_id)

        # 获取总数
        total = db_query.count()

        # 分页和排序
        results = (
            db_query
            .order_by(Post.created_at.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

        # 转换为响应格式
        posts_data = [self._post_to_dict(post) for post in results]

        return {
            "results": posts_data,
            "total": total,
            "limit": limit,
            "offset": offset,
        }

    def search_users(
        self,
        query: str,
        limit: int = 20,
        offset: int = 0,
    ) -> Dict[str, Any]:
        """
        搜索用户

        Args:
            query: 搜索关键词
            limit: 返回数量
            offset: 偏移量

        Returns:
            包含搜索结果和总数的字典
        """
        search_pattern = f"%{query}%"

        db_query = self.db.query(User).filter(
            or_(
                User.username.ilike(search_pattern),
                User.email.ilike(search_pattern),
                User.display_name.ilike(search_pattern),
                User.bio.ilike(search_pattern),
            )
        )

        # 获取总数
        total = db_query.count()

        # 分页
        results = (
            db_query
            .order_by(User.created_at.desc())
            .limit(limit)
            .offset(offset)
            .all()
        )

        users_data = [self._user_to_dict(user) for user in results]

        return {
            "results": users_data,
            "total": total,
            "limit": limit,
            "offset": offset,
        }

    def get_trending_searches(self, limit: int = 10) -> List[str]:
        """
        获取热门搜索词

        Args:
            limit: 返回数量

        Returns:
            热门搜索词列表
        """
        # 这里可以实现热门搜索的逻辑
        # 例如：基于搜索日志、浏览量等
        # 暂时返回空列表
        return []

    def get_search_suggestions(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        获取搜索建议

        Args:
            query: 搜索关键词
            limit: 返回数量

        Returns:
            搜索建议列表
        """
        if not query or len(query) < 2:
            return []

        search_pattern = f"%{query}%"

        # 搜索文章标题
        posts = (
            self.db.query(Post)
            .filter(
                and_(
                    Post.title.ilike(search_pattern),
                    Post.status == "published"
                )
            )
            .limit(limit)
            .all()
        )

        suggestions = []
        for post in posts:
            suggestions.append({
                "type": "post",
                "id": post.id,
                "title": post.title,
                "slug": post.slug,
            })

        return suggestions

    def _post_to_dict(self, post: Post) -> Dict[str, Any]:
        """将文章对象转换为字典"""
        return {
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "excerpt": post.excerpt,
            "content": post.content,
            "status": post.status,
            "featured_image_url": post.featured_image_url,
            "view_count": post.view_count,
            "comment_count": post.comment_count,
            "category": {
                "id": post.category.id,
                "name": post.category.name,
                "slug": post.category.slug,
            } if post.category else None,
            "tags": [
                {"id": tag.id, "name": tag.name, "slug": tag.slug}
                for tag in post.tags
            ],
            "author": {
                "id": post.author.id,
                "username": post.author.username,
                "display_name": post.author.display_name,
                "avatar_url": post.author.avatar_url,
            },
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "updated_at": post.updated_at.isoformat() if post.updated_at else None,
        }

    def _user_to_dict(self, user: User) -> Dict[str, Any]:
        """将用户对象转换为字典"""
        return {
            "id": user.id,
            "username": user.username,
            "display_name": user.display_name,
            "avatar_url": user.avatar_url,
            "bio": user.bio,
            "location": user.location,
            "website": user.website,
            "created_at": user.created_at.isoformat() if user.created_at else None,
        }
