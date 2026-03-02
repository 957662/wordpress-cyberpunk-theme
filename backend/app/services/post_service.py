"""
Post Service
文章业务逻辑服务
"""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models.post import Post, Category, Tag
from app.schemas.post import PostCreate, PostUpdate


class PostService:
    """文章服务"""

    @staticmethod
    def get_post_by_id(db: Session, post_id: int) -> Optional[Post]:
        """通过ID获取文章"""
        return db.query(Post).filter(Post.id == post_id).first()

    @staticmethod
    def get_post_by_slug(db: Session, slug: str) -> Optional[Post]:
        """通过slug获取文章"""
        return db.query(Post).filter(Post.slug == slug).first()

    @staticmethod
    def get_posts(
        db: Session,
        skip: int = 0,
        limit: int = 10,
        status: str = "published",
        category_id: Optional[int] = None,
        tag_id: Optional[int] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[Post], int]:
        """获取文章列表"""
        query = db.query(Post).filter(Post.status == status)

        # 分类筛选
        if category_id:
            query = query.filter(Post.category_id == category_id)

        # 标签筛选
        if tag_id:
            query = query.join(Post.tags).filter(Tag.id == tag_id)

        # 搜索
        if search:
            query = query.filter(
                or_(
                    Post.title.ilike(f"%{search}%"),
                    Post.content.ilike(f"%{search}%"),
                    Post.excerpt.ilike(f"%{search}%"),
                )
            )

        # 总数
        total = query.count()

        # 分页
        posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()

        return posts, total

    @staticmethod
    def create_post(db: Session, post_data: PostCreate, author_id: int) -> Post:
        """创建文章"""
        # 创建文章对象
        db_post = Post(
            title=post_data.title,
            slug=post_data.slug or post_data.title.lower().replace(" ", "-"),
            content=post_data.content,
            excerpt=post_data.excerpt,
            author_id=author_id,
            category_id=post_data.category_id,
            featured_image_url=post_data.featured_image_url,
            status=post_data.status,
        )

        # 添加标签
        if post_data.tags:
            tags = db.query(Tag).filter(Tag.id.in_(post_data.tags)).all()
            db_post.tags = tags

        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return db_post

    @staticmethod
    def update_post(db: Session, post: Post, post_data: PostUpdate) -> Post:
        """更新文章"""
        # 更新字段
        update_data = post_data.model_dump(exclude_unset=True)
        tags = update_data.pop("tags", None)

        for field, value in update_data.items():
            setattr(post, field, value)

        # 更新标签
        if tags is not None:
            tag_objects = db.query(Tag).filter(Tag.id.in_(tags)).all()
            post.tags = tag_objects

        db.commit()
        db.refresh(post)
        return post

    @staticmethod
    def delete_post(db: Session, post: Post) -> None:
        """删除文章"""
        db.delete(post)
        db.commit()

    @staticmethod
    def increment_view_count(db: Session, post: Post) -> None:
        """增加浏览次数"""
        post.view_count += 1
        db.commit()

    @staticmethod
    def get_featured_posts(db: Session, limit: int = 5) -> List[Post]:
        """获取精选文章"""
        return (
            db.query(Post)
            .filter(Post.status == "published")
            .order_by(Post.view_count.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_recent_posts(db: Session, limit: int = 10) -> List[Post]:
        """获取最新文章"""
        return (
            db.query(Post)
            .filter(Post.status == "published")
            .order_by(Post.created_at.desc())
            .limit(limit)
            .all()
        )
