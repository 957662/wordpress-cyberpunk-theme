"""
Tag Service - 标签服务
处理标签相关的业务逻辑
"""
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta

from app.models.tag import Tag
from app.models.post import Post
from app.models.post_tag import post_tags
from app.schemas.tag import TagCreate, TagUpdate, TagStats


class TagService:
    """标签服务类"""

    def __init__(self, db: Session):
        self.db = db

    def get_tag(self, tag_id: int) -> Optional[Tag]:
        """获取单个标签"""
        return self.db.query(Tag).filter(Tag.id == tag_id).first()

    def get_tag_by_slug(self, slug: str) -> Optional[Tag]:
        """通过slug获取标签"""
        return self.db.query(Tag).filter(Tag.slug == slug).first()

    def get_tags(
        self,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        sort_by: str = "name"
    ) -> Tuple[List[Tag], int]:
        """获取标签列表"""
        query = self.db.query(Tag)

        # 搜索过滤
        if search:
            query = query.filter(
                (Tag.name.ilike(f"%{search}%")) |
                (Tag.description.ilike(f"%{search}%"))
            )

        # 排序
        if sort_by == "name":
            query = query.order_by(Tag.name)
        elif sort_by == "posts_count":
            query = query.outerjoin(Tag.posts).group_by(Tag.id).order_by(
                desc(func.count(Post.id))
            )
        elif sort_by == "created":
            query = query.order_by(desc(Tag.created_at))
        elif sort_by == "popular":
            # 按最近30天的文章数排序
            since = datetime.utcnow() - timedelta(days=30)
            query = query.join(Tag.posts).filter(
                Post.published_at >= since
            ).group_by(Tag.id).order_by(desc(func.count(Post.id)))

        # 计数
        total = query.count()

        # 分页
        tags = query.offset(skip).limit(limit).all()

        return tags, total

    def create_tag(self, tag_data: TagCreate) -> Tag:
        """创建标签"""
        # 检查标签名是否已存在
        existing = self.db.query(Tag).filter(Tag.name == tag_data.name).first()
        if existing:
            raise ValueError(f"Tag '{tag_data.name}' already exists")

        # 生成slug
        slug = self._generate_slug(tag_data.name)

        tag = Tag(
            name=tag_data.name,
            slug=slug,
            description=tag_data.description,
            color=tag_data.color,
            icon=tag_data.icon
        )

        self.db.add(tag)
        self.db.commit()
        self.db.refresh(tag)

        return tag

    def update_tag(self, tag_id: int, tag_data: TagUpdate) -> Optional[Tag]:
        """更新标签"""
        tag = self.get_tag(tag_id)
        if not tag:
            return None

        # 更新字段
        if tag_data.name is not None:
            # 检查新名称是否与其他标签冲突
            existing = self.db.query(Tag).filter(
                Tag.name == tag_data.name,
                Tag.id != tag_id
            ).first()
            if existing:
                raise ValueError(f"Tag '{tag_data.name}' already exists")
            tag.name = tag_data.name
            tag.slug = self._generate_slug(tag_data.name)

        if tag_data.description is not None:
            tag.description = tag_data.description

        if tag_data.color is not None:
            tag.color = tag_data.color

        if tag_data.icon is not None:
            tag.icon = tag_data.icon

        tag.updated_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(tag)

        return tag

    def delete_tag(self, tag_id: int) -> bool:
        """删除标签"""
        tag = self.get_tag(tag_id)
        if not tag:
            return False

        self.db.delete(tag)
        self.db.commit()

        return True

    def get_tag_stats(self, tag_id: int) -> Optional[TagStats]:
        """获取标签统计信息"""
        tag = self.get_tag(tag_id)
        if not tag:
            return None

        # 文章总数
        posts_count = self.db.query(func.count(Post.id)).join(
            post_tags
        ).filter(post_tags.c.tag_id == tag_id).scalar()

        # 已发布文章数
        published_count = self.db.query(func.count(Post.id)).join(
            post_tags
        ).filter(
            post_tags.c.tag_id == tag_id,
            Post.status == "published"
        ).scalar()

        # 最近30天文章数
        since = datetime.utcnow() - timedelta(days=30)
        recent_count = self.db.query(func.count(Post.id)).join(
            post_tags
        ).filter(
            post_tags.c.tag_id == tag_id,
            Post.published_at >= since
        ).scalar()

        return TagStats(
            tag_id=tag.id,
            posts_count=posts_count,
            published_count=published_count,
            recent_count=recent_count
        )

    def get_popular_tags(self, limit: int = 20, days: int = 30) -> List[Tag]:
        """获取热门标签"""
        since = datetime.utcnow() - timedelta(days=days)

        tags = self.db.query(Tag).join(
            post_tags
        ).join(
            Post
        ).filter(
            Post.status == "published",
            Post.published_at >= since
        ).group_by(
            Tag.id
        ).order_by(
            desc(func.count(Post.id))
        ).limit(limit).all()

        return tags

    def get_related_tags(self, tag_id: int, limit: int = 10) -> List[Tag]:
        """获取相关标签（基于共同文章）"""
        # 找到与该标签共同出现最多的其他标签
        subquery = self.db.query(
            post_tags.c.post_id
        ).filter(
            post_tags.c.tag_id == tag_id
        ).subquery()

        tags = self.db.query(Tag).join(
            post_tags
        ).filter(
            post_tags.c.post_id.in_(subquery),
            post_tags.c.tag_id != tag_id
        ).group_by(
            Tag.id
        ).order_by(
            desc(func.count(post_tags.c.post_id))
        ).limit(limit).all()

        return tags

    def merge_tags(self, source_id: int, target_id: int) -> bool:
        """合并标签（将source标签的文章转移到target标签）"""
        source_tag = self.get_tag(source_id)
        target_tag = self.get_tag(target_id)

        if not source_tag or not target_tag:
            return False

        # 更新所有使用source标签的文章关联
        self.db.execute(
            post_tags.update()
            .where(post_tags.c.tag_id == source_id)
            .values(tag_id=target_id)
        )

        # 删除source标签
        self.db.delete(source_tag)
        self.db.commit()

        return True

    def _generate_slug(self, name: str) -> str:
        """生成URL友好的slug"""
        # 简单的slug生成
        slug = name.lower().strip()
        # 替换空格和特殊字符
        slug = "-".join(c for c in slug if c.isalnum() or c in (" ", "-"))
        slug = slug.replace(" ", "-")

        # 确保slug唯一
        counter = 1
        original_slug = slug
        while self.db.query(Tag).filter(Tag.slug == slug).first():
            slug = f"{original_slug}-{counter}"
            counter += 1

        return slug

    def get_or_create_tag(self, name: str) -> Tag:
        """获取或创建标签（用于导入等场景）"""
        tag = self.db.query(Tag).filter(Tag.name == name).first()
        if tag:
            return tag

        slug = self._generate_slug(name)
        tag = Tag(name=name, slug=slug)
        self.db.add(tag)
        self.db.commit()
        self.db.refresh(tag)

        return tag

    def bulk_create_tags(self, names: List[str]) -> List[Tag]:
        """批量创建标签"""
        tags = []
        for name in names:
            try:
                tag = self.get_or_create_tag(name)
                tags.append(tag)
            except Exception:
                continue

        return tags

    def get_tag_cloud(self, min_posts: int = 1, limit: int = 50) -> List[dict]:
        """获取标签云（包含权重）"""
        tags = self.db.query(
            Tag.id,
            Tag.name,
            Tag.slug,
            func.count(Post.id).label("count")
        ).join(
            post_tags
        ).join(
            Post
        ).filter(
            Post.status == "published"
        ).group_by(
            Tag.id
        ).having(
            func.count(Post.id) >= min_posts
        ).order_by(
            desc("count")
        ).limit(limit).all()

        # 计算权重（1-10）
        if tags:
            max_count = max(tag.count for tag in tags)
            min_count = min(tag.count for tag in tags)

            result = []
            for tag in tags:
                if max_count == min_count:
                    weight = 5
                else:
                    weight = 1 + int((tag.count - min_count) / (max_count - min_count) * 9)

                result.append({
                    "id": tag.id,
                    "name": tag.name,
                    "slug": tag.slug,
                    "count": tag.count,
                    "weight": weight
                })

            return result

        return []
