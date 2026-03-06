"""
Enhanced Post Service
提供完整的文章服务功能
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from fastapi import HTTPException, status

from app.models.post import Post, Tag, Category, post_tags
from app.models.user import User
from app.schemas.post import PostCreate, PostUpdate, PostResponse
from app.core.config import settings


class PostService:
    """增强的文章服务"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_post(
        self,
        post_data: PostCreate,
        author_id: int,
        status: str = "draft"
    ) -> PostResponse:
        """创建文章"""
        # 验证分类是否存在
        if post_data.category_id:
            category = await self.db.get(Category, post_data.category_id)
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Category not found"
                )

        # 创建文章
        db_post = Post(
            title=post_data.title,
            content=post_data.content,
            excerpt=post_data.excerpt,
            featured_image=post_data.featured_image,
            author_id=author_id,
            category_id=post_data.category_id,
            status=status,
            meta_title=post_data.meta_title,
            meta_description=post_data.meta_description,
            meta_keywords=post_data.meta_keywords,
            allow_comments=post_data.allow_comments,
            is_featured=post_data.is_featured
        )

        self.db.add(db_post)
        await self.db.commit()
        await self.db.refresh(db_post)

        # 添加标签
        if post_data.tags:
            await self._add_tags_to_post(db_post.id, post_data.tags)

        await self.db.refresh(db_post)
        return PostResponse.from_orm(db_post)

    async def get_post(self, post_id: int, include_deleted: bool = False) -> Optional[Post]:
        """获取文章"""
        query = select(Post).where(Post.id == post_id)
        if not include_deleted:
            query = query.where(Post.deleted_at.is_(None))

        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def get_post_by_slug(self, slug: str) -> Optional[Post]:
        """通过slug获取文章"""
        result = await self.db.execute(
            select(Post).where(
                and_(
                    Post.slug == slug,
                    Post.deleted_at.is_(None)
                )
            )
        )
        return result.scalar_one_or_none()

    async def get_posts(
        self,
        skip: int = 0,
        limit: int = 20,
        status: str = "published",
        category_id: Optional[int] = None,
        tag_id: Optional[int] = None,
        author_id: Optional[int] = None,
        search: Optional[str] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> tuple[List[Post], int]:
        """获取文章列表"""
        # 构建查询
        query = select(Post).where(Post.deleted_at.is_(None))

        # 状态筛选
        if status:
            query = query.where(Post.status == status)

        # 分类筛选
        if category_id:
            query = query.where(Post.category_id == category_id)

        # 标签筛选
        if tag_id:
            query = query.join(post_tags).where(post_tags.c.tag_id == tag_id)

        # 作者筛选
        if author_id:
            query = query.where(Post.author_id == author_id)

        # 搜索
        if search:
            search_pattern = f"%{search}%"
            query = query.where(
                or_(
                    Post.title.ilike(search_pattern),
                    Post.content.ilike(search_pattern),
                    Post.excerpt.ilike(search_pattern)
                )
            )

        # 统计总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 排序
        sort_column = getattr(Post, sort_by, Post.created_at)
        if sort_order == "asc":
            query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(sort_column.desc())

        # 分页
        query = query.offset(skip).limit(limit)

        # 执行查询
        result = await self.db.execute(query)
        posts = result.scalars().all()

        return list(posts), total

    async def update_post(
        self,
        post_id: int,
        post_data: PostUpdate,
        user_id: int
    ) -> PostResponse:
        """更新文章"""
        post = await self.get_post(post_id)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )

        # 检查权限
        if post.author_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to update this post"
            )

        # 更新字段
        update_data = post_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(post, field, value)

        post.updated_at = datetime.utcnow()

        # 更新标签
        if post_data.tags is not None:
            await self._update_post_tags(post_id, post_data.tags)

        await self.db.commit()
        await self.db.refresh(post)

        return PostResponse.from_orm(post)

    async def delete_post(self, post_id: int, user_id: int, permanent: bool = False) -> bool:
        """删除文章"""
        post = await self.get_post(post_id)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )

        # 检查权限
        if post.author_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this post"
            )

        if permanent:
            # 永久删除
            await self.db.delete(post)
        else:
            # 软删除
            post.deleted_at = datetime.utcnow()

        await self.db.commit()
        return True

    async def publish_post(self, post_id: int, user_id: int) -> PostResponse:
        """发布文章"""
        post = await self.get_post(post_id)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )

        # 检查权限
        if post.author_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to publish this post"
            )

        post.status = "published"
        post.published_at = datetime.utcnow()
        post.updated_at = datetime.utcnow()

        await self.db.commit()
        await self.db.refresh(post)

        return PostResponse.from_orm(post)

    async def unpublish_post(self, post_id: int, user_id: int) -> PostResponse:
        """取消发布文章"""
        post = await self.get_post(post_id)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )

        # 检查权限
        if post.author_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to unpublish this post"
            )

        post.status = "draft"
        post.updated_at = datetime.utcnow()

        await self.db.commit()
        await self.db.refresh(post)

        return PostResponse.from_orm(post)

    async def increment_views(self, post_id: int) -> bool:
        """增加浏览次数"""
        post = await self.get_post(post_id)
        if not post:
            return False

        post.view_count += 1
        await self.db.commit()

        return True

    async def get_trending_posts(
        self,
        limit: int = 10,
        days: int = 7
    ) -> List[Post]:
        """获取热门文章"""
        since_date = datetime.utcnow() - timedelta(days=days)

        result = await self.db.execute(
            select(Post)
            .where(
                and_(
                    Post.status == "published",
                    Post.deleted_at.is_(None),
                    Post.created_at >= since_date
                )
            )
            .order_by(desc(Post.view_count))
            .limit(limit)
        )

        return list(result.scalars().all())

    async def get_featured_posts(self, limit: int = 10) -> List[Post]:
        """获取精选文章"""
        result = await self.db.execute(
            select(Post)
            .where(
                and_(
                    Post.status == "published",
                    Post.deleted_at.is_(None),
                    Post.is_featured == True
                )
            )
            .order_by(desc(Post.created_at))
            .limit(limit)
        )

        return list(result.scalars().all())

    async def get_related_posts(
        self,
        post_id: int,
        limit: int = 5
    ) -> List[Post]:
        """获取相关文章"""
        post = await self.get_post(post_id)
        if not post:
            return []

        # 通过分类查找相关文章
        result = await self.db.execute(
            select(Post)
            .where(
                and_(
                    Post.id != post_id,
                    Post.category_id == post.category_id,
                    Post.status == "published",
                    Post.deleted_at.is_(None)
                )
            )
            .order_by(desc(Post.created_at))
            .limit(limit)
        )

        return list(result.scalars().all())

    async def search_posts(
        self,
        query: str,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Post], int]:
        """搜索文章"""
        search_pattern = f"%{query}%"

        # 构建查询
        db_query = select(Post).where(
            and_(
                Post.status == "published",
                Post.deleted_at.is_(None),
                or_(
                    Post.title.ilike(search_pattern),
                    Post.content.ilike(search_pattern),
                    Post.excerpt.ilike(search_pattern),
                    Post.meta_keywords.ilike(search_pattern)
                )
            )
        )

        # 统计总数
        count_query = select(func.count()).select_from(db_query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 分页
        db_query = db_query.offset(skip).limit(limit)
        db_query = db_query.order_by(desc(Post.created_at))

        # 执行查询
        result = await self.db.execute(db_query)
        posts = result.scalars().all()

        return list(posts), total

    async def get_posts_by_author(
        self,
        author_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Post], int]:
        """获取作者的文章列表"""
        query = select(Post).where(
            and_(
                Post.author_id == author_id,
                Post.deleted_at.is_(None)
            )
        )

        # 统计总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 分页和排序
        query = query.order_by(desc(Post.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        posts = result.scalars().all()

        return list(posts), total

    async def get_posts_by_category(
        self,
        category_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Post], int]:
        """获取分类的文章列表"""
        query = select(Post).where(
            and_(
                Post.category_id == category_id,
                Post.status == "published",
                Post.deleted_at.is_(None)
            )
        )

        # 统计总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 分页和排序
        query = query.order_by(desc(Post.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        posts = result.scalars().all()

        return list(posts), total

    async def get_posts_by_tag(
        self,
        tag_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Post], int]:
        """获取标签的文章列表"""
        query = select(Post).join(post_tags).where(
            and_(
                post_tags.c.tag_id == tag_id,
                Post.status == "published",
                Post.deleted_at.is_(None)
            )
        )

        # 统计总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 分页和排序
        query = query.order_by(desc(Post.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        posts = result.scalars().all()

        return list(posts), total

    async def _add_tags_to_post(self, post_id: int, tag_names: List[str]) -> None:
        """为文章添加标签"""
        for tag_name in tag_names:
            # 查找或创建标签
            result = await self.db.execute(
                select(Tag).where(Tag.name == tag_name)
            )
            tag = result.scalar_one_or_none()

            if not tag:
                tag = Tag(name=tag_name, slug=tag_name.lower().replace(" ", "-"))
                self.db.add(tag)
                await self.db.flush()

            # 关联标签
            post = await self.get_post(post_id)
            if tag not in post.tags:
                post.tags.append(tag)

        await self.db.commit()

    async def _update_post_tags(self, post_id: int, tag_names: List[str]) -> None:
        """更新文章标签"""
        post = await self.get_post(post_id)
        if not post:
            return

        # 清除现有标签
        post.tags.clear()

        # 添加新标签
        await self._add_tags_to_post(post_id, tag_names)

    async def get_post_stats(self, post_id: int) -> Dict[str, Any]:
        """获取文章统计"""
        post = await self.get_post(post_id)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Post not found"
            )

        return {
            "view_count": post.view_count,
            "comment_count": len(post.comments),
            "like_count": 0,  # TODO: 实现点赞功能
            "share_count": 0,  # TODO: 实现分享功能
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "published_at": post.published_at
        }
