"""
搜索服务
提供全文搜索功能
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import selectinload
from typing import List, Dict, Any, Optional


class SearchService:
    """搜索服务类"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def search_posts(
        self,
        query: str,
        page: int = 1,
        per_page: int = 10,
        category_id: Optional[int] = None,
        tag_id: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        搜索文章
        
        Args:
            query: 搜索关键词
            page: 页码
            per_page: 每页数量
            category_id: 分类筛选
            tag_id: 标签筛选
        
        Returns:
            搜索结果字典
        """
        from ..models.post import Post
        
        # 构建搜索条件
        search_conditions = or_(
            Post.title.ilike(f"%{query}%"),
            Post.content.ilike(f"%{query}%"),
            Post.excerpt.ilike(f"%{query}%"),
        )
        
        # 构建基础查询
        query_obj = select(Post).options(
            selectinload(Post.category),
            selectinload(Post.tags),
            selectinload(Post.author)
        ).where(
            and_(
                search_conditions,
                Post.status == "published"
            )
        )
        
        # 应用分类筛选
        if category_id:
            query_obj = query_obj.where(Post.category_id == category_id)
        
        # 应用标签筛选（需要join tag表，这里简化）
        
        # 获取总数
        from sqlalchemy import func
        count_query = select(func.count()).select_from(query_obj.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # 应用分页和排序
        offset = (page - 1) * per_page
        query_obj = query_obj.order_by(Post.created_at.desc()).offset(offset).limit(per_page)
        
        result = await self.db.execute(query_obj)
        posts = list(result.scalars().all())
        
        # 格式化结果
        formatted_posts = []
        for post in posts:
            formatted_posts.append({
                "id": post.id,
                "title": post.title,
                "slug": post.slug,
                "excerpt": post.excerpt,
                "featured_image": post.featured_image,
                "created_at": post.created_at,
                "updated_at": post.updated_at,
                "view_count": post.view_count,
                "like_count": post.like_count,
                "comment_count": post.comment_count,
                "author": {
                    "id": post.author.id,
                    "username": post.author.username,
                    "full_name": post.author.full_name,
                    "avatar_url": post.author.avatar_url,
                } if post.author else None,
                "category": {
                    "id": post.category.id,
                    "name": post.category.name,
                    "slug": post.category.slug,
                } if post.category else None,
            })
        
        return {
            "posts": formatted_posts,
            "total": total,
        }
    
    async def search_users(
        self,
        query: str,
        page: int = 1,
        per_page: int = 10,
    ) -> Dict[str, Any]:
        """
        搜索用户
        
        Args:
            query: 搜索关键词
            page: 页码
            per_page: 每页数量
        
        Returns:
            搜索结果字典
        """
        from ..models.user import User
        from sqlalchemy import func
        
        # 构建搜索条件
        search_conditions = or_(
            User.username.ilike(f"%{query}%"),
            User.full_name.ilike(f"%{query}%"),
            User.bio.ilike(f"%{query}%"),
        )
        
        # 构建查询
        query_obj = select(User).where(
            and_(
                search_conditions,
                User.is_active == True
            )
        )
        
        # 获取总数
        count_query = select(func.count()).select_from(query_obj.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # 应用分页
        offset = (page - 1) * per_page
        query_obj = query_obj.order_by(User.created_at.desc()).offset(offset).limit(per_page)
        
        result = await self.db.execute(query_obj)
        users = list(result.scalars().all())
        
        # 格式化结果
        formatted_users = []
        for user in users:
            formatted_users.append({
                "id": user.id,
                "username": user.username,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,
                "bio": user.bio,
                "followers_count": user.followers_count,
                "following_count": user.following_count,
            })
        
        return {
            "users": formatted_users,
            "total": total,
        }
    
    async def get_suggestions(
        self,
        query: str,
        limit: int = 5,
    ) -> Dict[str, List[str]]:
        """
        获取搜索建议
        
        Args:
            query: 搜索关键词
            limit: 返回数量
        
        Returns:
            建议字典
        """
        from ..models.post import Post
        from ..models.user import User
        
        suggestions = {
            "posts": [],
            "users": [],
        }
        
        # 文章标题建议
        result = await self.db.execute(
            select(Post.title)
            .where(
                and_(
                    Post.title.ilike(f"%{query}%"),
                    Post.status == "published"
                )
            )
            .limit(limit)
        )
        suggestions["posts"] = [row[0] for row in result.all()]
        
        # 用户名建议
        result = await self.db.execute(
            select(User.username)
            .where(
                and_(
                    User.username.ilike(f"%{query}%"),
                    User.is_active == True
                )
            )
            .limit(limit)
        )
        suggestions["users"] = [row[0] for row in result.all()]
        
        return suggestions
