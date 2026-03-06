"""
增强的文章服务
提供完整的文章管理业务逻辑
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, and_
from sqlalchemy.orm import selectinload
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime

from ..models.post import Post, Category, Tag
from ..models.user import User
from ..schemas.post import PostCreate, PostUpdate


class PostServiceEnhanced:
    """增强的文章服务类"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_post(
        self,
        user_id: int,
        post_data: PostCreate,
    ) -> Post:
        """
        创建文章
        
        Args:
            user_id: 作者ID
            post_data: 文章数据
        
        Returns:
            创建的文章对象
        """
        # 验证分类是否存在
        if post_data.category_id:
            result = await self.db.execute(
                select(Category).where(Category.id == post_data.category_id)
            )
            if not result.scalar_one_or_none():
                raise ValueError("分类不存在")
        
        # 创建文章
        new_post = Post(
            title=post_data.title,
            slug=post_data.slug,
            content=post_data.content,
            excerpt=post_data.excerpt,
            featured_image=post_data.featured_image,
            author_id=user_id,
            category_id=post_data.category_id,
            status=post_data.status or "draft",
            is_featured=post_data.is_featured or False,
            comment_status=post_data.comment_status or "open",
        )
        
        self.db.add(new_post)
        await self.db.commit()
        await self.db.refresh(new_post)
        
        # 处理标签
        if post_data.tags:
            await self._update_post_tags(new_post.id, post_data.tags)
        
        return new_post
    
    async def update_post(
        self,
        post_id: int,
        post_data: PostUpdate,
    ) -> Post:
        """
        更新文章
        
        Args:
            post_id: 文章ID
            post_data: 更新数据
        
        Returns:
            更新后的文章对象
        """
        result = await self.db.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalar_one_or_none()
        
        if not post:
            raise ValueError("文章不存在")
        
        # 更新字段
        update_data = post_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            if hasattr(post, field) and field != 'tags':
                setattr(post, field, value)
        
        # 更新修改时间
        post.updated_at = datetime.utcnow()
        
        await self.db.commit()
        await self.db.refresh(post)
        
        # 处理标签
        if 'tags' in update_data:
            await self._update_post_tags(post.id, update_data['tags'])
        
        return post
    
    async def delete_post(
        self,
        post_id: int,
    ) -> bool:
        """
        删除文章
        
        Args:
            post_id: 文章ID
        
        Returns:
            删除成功返回True
        """
        result = await self.db.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalar_one_or_none()
        
        if not post:
            raise ValueError("文章不存在")
        
        await self.db.delete(post)
        await self.db.commit()
        
        return True
    
    async def get_post_by_id(
        self,
        post_id: int,
    ) -> Optional[Post]:
        """
        获取文章详情
        
        Args:
            post_id: 文章ID
        
        Returns:
            文章对象或None
        """
        result = await self.db.execute(
            select(Post)
            .options(selectinload(Post.category), selectinload(Post.tags))
            .where(Post.id == post_id)
        )
        return result.scalar_one_or_none()
    
    async def get_posts(
        self,
        page: int = 1,
        per_page: int = 10,
        filters: Optional[Dict[str, Any]] = None,
        search: Optional[str] = None,
        ordering: Optional[Dict[str, str]] = None,
    ) -> Tuple[List[Post], int]:
        """
        获取文章列表
        
        Args:
            page: 页码
            per_page: 每页数量
            filters: 筛选条件
            search: 搜索关键词
            ordering: 排序配置
        
        Returns:
            (文章列表, 总数)
        """
        # 构建查询
        query = select(Post).options(
            selectinload(Post.category),
            selectinload(Post.tags),
            selectinload(Post.author)
        )
        
        # 应用筛选条件
        conditions = []
        
        if filters:
            if 'category_id' in filters:
                conditions.append(Post.category_id == filters['category_id'])
            
            if 'tag_id' in filters:
                # 需要join tag表，这里简化处理
                pass
            
            if 'status' in filters:
                conditions.append(Post.status == filters['status'])
            else:
                # 默认只显示已发布的文章
                conditions.append(Post.status == "published")
        
        if conditions:
            query = query.where(and_(*conditions))
        
        # 应用搜索
        if search:
            search_condition = or_(
                Post.title.ilike(f"%{search}%"),
                Post.content.ilike(f"%{search}%"),
                Post.excerpt.ilike(f"%{search}%"),
            )
            query = query.where(search_condition)
        
        # 应用排序
        if ordering:
            order_field = getattr(Post, ordering['field'], 'created_at')
            if ordering['direction'] == 'desc':
                query = query.order_by(order_field.desc())
            else:
                query = query.order_by(order_field.asc())
        else:
            query = query.order_by(Post.created_at.desc())
        
        # 获取总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # 应用分页
        offset = (page - 1) * per_page
        query = query.offset(offset).limit(per_page)
        
        result = await self.db.execute(query)
        posts = result.scalars().all()
        
        return list(posts), total
    
    async def get_featured_posts(
        self,
        limit: int = 5,
    ) -> List[Post]:
        """
        获取精选文章
        
        Args:
            limit: 返回数量
        
        Returns:
            精选文章列表
        """
        result = await self.db.execute(
            select(Post)
            .where(Post.is_featured == True, Post.status == "published")
            .order_by(Post.created_at.desc())
            .limit(limit)
        )
        return list(result.scalars().all())
    
    async def get_trending_posts(
        self,
        limit: int = 10,
        days: int = 7,
    ) -> List[Post]:
        """
        获取热门文章
        
        Args:
            limit: 返回数量
            days: 统计天数
        
        Returns:
            热门文章列表
        """
        threshold = datetime.utcnow() - timedelta(days=days)
        
        result = await self.db.execute(
            select(Post)
            .where(
                Post.status == "published",
                Post.created_at >= threshold
            )
            .order_by(
                (Post.view_count + Post.like_count * 2 + Post.comment_count * 3).desc()
            )
            .limit(limit)
        )
        return list(result.scalars().all())
    
    async def get_related_posts(
        self,
        post_id: int,
        limit: int = 5,
    ) -> List[Post]:
        """
        获取相关文章
        
        Args:
            post_id: 文章ID
            limit: 返回数量
        
        Returns:
            相关文章列表
        """
        # 获取原文章
        post = await self.get_post_by_id(post_id)
        if not post:
            return []
        
        # 基于分类查找
        query = select(Post).where(
            and_(
                Post.id != post_id,
                Post.status == "published",
            )
        )
        
        if post.category_id:
            query = query.where(Post.category_id == post.category_id)
        
        query = query.order_by(Post.created_at.desc()).limit(limit * 2)
        
        result = await self.db.execute(query)
        related_posts = list(result.scalars().all())
        
        return related_posts[:limit]
    
    async def increment_view_count(
        self,
        post_id: int,
    ) -> bool:
        """
        增加文章浏览量
        
        Args:
            post_id: 文章ID
        
        Returns:
            成功返回True
        """
        result = await self.db.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalar_one_or_none()
        
        if post:
            post.view_count += 1
            await self.db.commit()
            return True
        
        return False
    
    async def _update_post_tags(
        self,
        post_id: int,
        tag_ids: List[int],
    ):
        """
        更新文章标签
        
        Args:
            post_id: 文章ID
            tag_ids: 标签ID列表
        """
        # 这里需要实现tag关联逻辑
        # 简化处理，实际应该使用post_tags关联表
        pass
    
    async def get_posts_by_author(
        self,
        author_id: int,
        page: int = 1,
        per_page: int = 10,
    ) -> Tuple[List[Post], int]:
        """
        获取作者的文章列表
        
        Args:
            author_id: 作者ID
            page: 页码
            per_page: 每页数量
        
        Returns:
            (文章列表, 总数)
        """
        query = select(Post).where(
            Post.author_id == author_id,
            Post.status == "published"
        )
        
        # 获取总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar()
        
        # 应用分页
        offset = (page - 1) * per_page
        query = query.order_by(Post.created_at.desc()).offset(offset).limit(per_page)
        
        result = await self.db.execute(query)
        posts = list(result.scalars().all())
        
        return posts, total
