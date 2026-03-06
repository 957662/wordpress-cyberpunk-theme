"""
博客服务
处理博客相关的业务逻辑
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_

from backend.app.models.post import Post
from backend.app.models.category import Category
from backend.app.models.tag import Tag
from backend.app.models.user import User
from backend.app.schemas.post import PostCreate, PostUpdate


class BlogService:
    """博客服务类"""

    def __init__(self, db: Session):
        self.db = db

    async def get_posts(
        self,
        page: int = 1,
        per_page: int = 10,
        category_id: Optional[int] = None,
        tag_id: Optional[int] = None,
        author_id: Optional[int] = None,
        search: Optional[str] = None,
        status: str = "published",
        order_by: str = "created_at",
        order: str = "desc",
    ) -> Dict[str, Any]:
        """
        获取文章列表
        """
        # 构建查询
        query = self.db.query(Post).filter(Post.status == status)

        # 筛选条件
        if category_id:
            query = query.filter(Post.category_id == category_id)
        if tag_id:
            query = query.filter(Post.tags.any(Tag.id == tag_id))
        if author_id:
            query = query.filter(Post.author_id == author_id)
        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                or_(
                    Post.title.ilike(search_pattern),
                    Post.content.ilike(search_pattern),
                    Post.excerpt.ilike(search_pattern),
                )
            )

        # 排序
        order_column = getattr(Post, order_by, Post.created_at)
        if order == "desc":
            query = query.order_by(order_column.desc())
        else:
            query = query.order_by(order_column.asc())

        # 分页
        total = query.count()
        offset = (page - 1) * per_page
        posts = query.offset(offset).limit(per_page).all()

        # 序列化
        posts_data = [self._post_to_dict(post) for post in posts]

        return {
            "posts": posts_data,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page,
        }

    async def get_post(self, post_id: int) -> Optional[Dict[str, Any]]:
        """
        获取单篇文章
        """
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return None

        # 增加浏览量
        post.view_count = (post.view_count or 0) + 1
        self.db.commit()

        return self._post_to_dict(post)

    async def get_post_by_slug(self, slug: str) -> Optional[Dict[str, Any]]:
        """
        通过 slug 获取文章
        """
        post = self.db.query(Post).filter(Post.slug == slug).first()
        if not post:
            return None

        # 增加浏览量
        post.view_count = (post.view_count or 0) + 1
        self.db.commit()

        return self._post_to_dict(post)

    async def create_post(
        self, post_data: PostCreate, author_id: int
    ) -> Dict[str, Any]:
        """
        创建文章
        """
        # 生成 slug
        slug = self._generate_slug(post_data.title)

        # 创建文章对象
        post = Post(
            title=post_data.title,
            slug=slug,
            content=post_data.content,
            excerpt=post_data.excerpt,
            featured_image=post_data.featured_image,
            category_id=post_data.category_id,
            author_id=author_id,
            status=post_data.status or "draft",
            meta_title=post_data.meta_title,
            meta_description=post_data.meta_description,
            meta_keywords=post_data.meta_keywords,
        )

        # 添加标签
        if post_data.tags:
            tags = (
                self.db.query(Tag).filter(Tag.id.in_(post_data.tags)).all()
            )
            post.tags = tags

        self.db.add(post)
        self.db.commit()
        self.db.refresh(post)

        return self._post_to_dict(post)

    async def update_post(
        self, post_id: int, post_data: PostUpdate
    ) -> Dict[str, Any]:
        """
        更新文章
        """
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return None

        # 更新字段
        if post_data.title:
            post.title = post_data.title
            post.slug = self._generate_slug(post_data.title)

        if post_data.content is not None:
            post.content = post_data.content

        if post_data.excerpt is not None:
            post.excerpt = post_data.excerpt

        if post_data.featured_image is not None:
            post.featured_image = post_data.featured_image

        if post_data.category_id is not None:
            post.category_id = post_data.category_id

        if post_data.status is not None:
            post.status = post_data.status

        if post_data.meta_title is not None:
            post.meta_title = post_data.meta_title

        if post_data.meta_description is not None:
            post.meta_description = post_data.meta_description

        if post_data.meta_keywords is not None:
            post.meta_keywords = post_data.meta_keywords

        # 更新标签
        if post_data.tags is not None:
            tags = (
                self.db.query(Tag).filter(Tag.id.in_(post_data.tags)).all()
            )
            post.tags = tags

        post.updated_at = func.now()

        self.db.commit()
        self.db.refresh(post)

        return self._post_to_dict(post)

    async def delete_post(self, post_id: int) -> bool:
        """
        删除文章
        """
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return False

        self.db.delete(post)
        self.db.commit()
        return True

    async def get_categories(
        self,
        page: int = 1,
        per_page: int = 20,
        hide_empty: bool = False,
    ) -> Dict[str, Any]:
        """
        获取分类列表
        """
        query = self.db.query(Category)

        if hide_empty:
            query = query.join(Category.posts).filter(Post.status == "published")

        total = query.count()
        offset = (page - 1) * per_page
        categories = query.offset(offset).limit(per_page).all()

        return {
            "categories": [self._category_to_dict(cat) for cat in categories],
            "total": total,
            "page": page,
            "per_page": per_page,
        }

    async def get_tags(
        self,
        page: int = 1,
        per_page: int = 20,
        hide_empty: bool = False,
    ) -> Dict[str, Any]:
        """
        获取标签列表
        """
        query = self.db.query(Tag)

        if hide_empty:
            query = query.join(Tag.posts).filter(Post.status == "published")

        total = query.count()
        offset = (page - 1) * per_page
        tags = query.offset(offset).limit(per_page).all()

        return {
            "tags": [self._tag_to_dict(tag) for tag in tags],
            "total": total,
            "page": page,
            "per_page": per_page,
        }

    async def like_post(self, post_id: int, user_id: int) -> Dict[str, Any]:
        """
        点赞文章
        """
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return {"success": False, "message": "文章不存在"}

        # TODO: 实现点赞记录，防止重复点赞
        post.like_count = (post.like_count or 0) + 1
        self.db.commit()

        return {
            "success": True,
            "like_count": post.like_count,
            "message": "点赞成功",
        }

    async def bookmark_post(self, post_id: int, user_id: int) -> Dict[str, Any]:
        """
        收藏文章
        """
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return {"success": False, "message": "文章不存在"}

        # TODO: 实现收藏记录表
        post.bookmark_count = (post.bookmark_count or 0) + 1
        self.db.commit()

        return {
            "success": True,
            "bookmark_count": post.bookmark_count,
            "message": "收藏成功",
        }

    def _post_to_dict(self, post: Post) -> Dict[str, Any]:
        """将 Post 对象转换为字典"""
        return {
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "content": post.content,
            "excerpt": post.excerpt,
            "featured_image": post.featured_image,
            "category_id": post.category_id,
            "author_id": post.author_id,
            "status": post.status,
            "view_count": post.view_count or 0,
            "like_count": post.like_count or 0,
            "comment_count": post.comment_count or 0,
            "bookmark_count": post.bookmark_count or 0,
            "created_at": post.created_at.isoformat() if post.created_at else None,
            "updated_at": post.updated_at.isoformat() if post.updated_at else None,
            "published_at": post.published_at.isoformat() if post.published_at else None,
            "meta_title": post.meta_title,
            "meta_description": post.meta_description,
            "meta_keywords": post.meta_keywords,
            "tags": [tag.id for tag in post.tags] if post.tags else [],
        }

    def _category_to_dict(self, category: Category) -> Dict[str, Any]:
        """将 Category 对象转换为字典"""
        return {
            "id": category.id,
            "name": category.name,
            "slug": category.slug,
            "description": category.description,
            "parent_id": category.parent_id,
        }

    def _tag_to_dict(self, tag: Tag) -> Dict[str, Any]:
        """将 Tag 对象转换为字典"""
        return {
            "id": tag.id,
            "name": tag.name,
            "slug": tag.slug,
            "description": tag.description,
        }

    def _generate_slug(self, title: str) -> str:
        """
        生成 URL 友好的 slug
        """
        import re
        from urllib.parse import quote

        # 转换为小写
        slug = title.lower()

        # 替换空格和特殊字符为连字符
        slug = re.sub(r"[^\w\s-]", "", slug)
        slug = re.sub(r"[-\s]+", "-", slug)

        # URL 编码
        slug = quote(slug)

        return slug
