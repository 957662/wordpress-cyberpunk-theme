"""
Portfolio Models
作品集相关模型
"""

from sqlalchemy import Column, String, Text, Integer, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from app.models.base import Base


class Project(Base):
    """项目作品"""

    __tablename__ = "projects"

    # 基本信息
    title = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    content = Column(Text)

    # 项目链接
    demo_url = Column(String(500))
    repo_url = Column(String(500))

    # 技术栈
    technologies = Column(ARRAY(String))  # ['React', 'Next.js', 'TypeScript']

    # 项目图片
    thumbnail_url = Column(String(500))
    images_urls = Column(ARRAY(String))  # 多张图片

    # 项目信息
    client_name = Column(String(255))
    project_date = Column(String(50))  # '2024 Q1' or 'March 2024'
    project_type = Column(String(100))  # 'Web App', 'Mobile App', 'API'

    # 状态
    status = Column(String(20), default="draft", index=True)  # draft, published
    featured = Column(Integer, default=0)  # 是否精选

    # 排序
    sort_order = Column(Integer, default=0)

    # 统计
    view_count = Column(Integer, default=0)
    like_count = Column(Integer, default=0)

    # 外键
    author_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # 关系
    author = relationship("User", back_populates="projects")

    def __repr__(self):
        return f"<Project(id={self.id}, title={self.title}, status={self.status})>"
