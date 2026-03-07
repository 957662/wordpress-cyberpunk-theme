"""
Tag Model
标签模型 - 用于文章标签
"""

from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base
from app.models.post import post_tags


class Tag(Base):
    """标签模型"""

    __tablename__ = "tags"

    name = Column(String(50), unique=True, index=True, nullable=False, comment="标签名称")
    slug = Column(String(50), unique=True, index=True, nullable=False, comment="URL友好的标识符")
    description = Column(String(255), nullable=True, comment="标签描述")

    # WordPress 关联
    wordpress_id = Column(Integer, unique=True, index=True, comment="WordPress标签ID")

    # 统计
    post_count = Column(Integer, default=0, comment="文章数量")

    # 关系
    posts = relationship("Post", secondary=post_tags, back_populates="tags")

    def __repr__(self):
        return f"<Tag(id={self.id}, name={self.name}, slug={self.slug})>"

    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "post_count": self.post_count,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
