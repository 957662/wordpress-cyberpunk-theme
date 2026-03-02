"""
Media Model
媒体文件模型
"""

from sqlalchemy import Column, String, Integer, Text
from app.models.base import Base


class Media(Base):
    """媒体文件表"""

    __tablename__ = "media"

    # 文件信息
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)  # bytes

    # 文件路径
    file_path = Column(String(500), nullable=False)
    url = Column(String(500), nullable=False)

    # 图片信息（如果是图片）
    width = Column(Integer)
    height = Column(Integer)
    alt_text = Column(String(255))
    caption = Column(Text)

    # WordPress 关联
    wordpress_id = Column(Integer, unique=True, index=True)

    def __repr__(self):
        return f"<Media(id={self.id}, filename={self.filename}, mime_type={self.mime_type})>"
