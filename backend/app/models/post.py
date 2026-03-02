"""
Post Models
文章相关模型
"""

from sqlalchemy import Column, String, Text, Integer, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.models.base import Base


# 文章-标签关联表（多对多）
post_tags = Table(
    'post_tags',
    Base.metadata,
    Column('post_id', Integer, ForeignKey('posts.id', ondelete='CASCADE'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete='CASCADE'), primary_key=True),
)


class Category(Base):
    """文章分类"""

    __tablename__ = "categories"

    name = Column(String(100), unique=True, index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text)

    # WordPress 关联
    wordpress_id = Column(Integer, unique=True, index=True)

    # 关系
    posts = relationship("Post", back_populates="category", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Category(id={self.id}, name={self.name}, slug={self.slug})>"


class Tag(Base):
    """文章标签"""

    __tablename__ = "tags"

    name = Column(String(50), unique=True, index=True, nullable=False)
    slug = Column(String(50), unique=True, index=True, nullable=False)

    # WordPress 关联
    wordpress_id = Column(Integer, unique=True, index=True)

    # 关系
    posts = relationship("Post", secondary=post_tags, back_populates="tags")

    def __repr__(self):
        return f"<Tag(id={self.id}, name={self.name}, slug={self.slug})>"


class Post(Base):
    """文章表"""

    __tablename__ = "posts"

    # 基本信息
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    excerpt = Column(Text)

    # SEO
    meta_title = Column(String(255))
    meta_description = Column(Text)
    meta_keywords = Column(String(255))

    # 状态
    status = Column(String(20), default="draft", index=True)  # draft, published, archived
    post_type = Column(String(20), default="post")  # post, page

    # 特色图片
    featured_image_url = Column(String(500))

    # 统计
    view_count = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)

    # WordPress 关联
    wordpress_id = Column(Integer, unique=True, index=True)

    # 外键
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="SET NULL"))

    # 关系
    author = relationship("User", back_populates="posts")
    category = relationship("Category", back_populates="posts")
    tags = relationship("Tag", secondary=post_tags, back_populates="posts", cascade="all, delete")

    def __repr__(self):
        return f"<Post(id={self.id}, title={self.title}, status={self.status})>"
