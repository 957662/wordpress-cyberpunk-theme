"""
阅读进度相关的 Pydantic 模型
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ReadingProgressBase(BaseModel):
    """阅读进度基础模型"""
    article_id: str = Field(..., description="文章ID")
    article_title: str = Field(..., description="文章标题")
    progress: float = Field(default=0, ge=0, le=100, description="阅读进度 (0-100)")
    last_position: int = Field(default=0, ge=0, description="最后阅读位置（像素）")
    total_time: int = Field(default=0, ge=0, description="总阅读时间（秒）")
    completed: bool = Field(default=False, description="是否已完成")


class ReadingProgressCreate(ReadingProgressBase):
    """创建阅读进度"""
    progress: Optional[float] = Field(default=0, ge=0, le=100)
    last_position: Optional[int] = Field(default=0)
    total_time: Optional[int] = Field(default=0)
    completed: Optional[bool] = Field(default=False)


class ReadingProgressUpdate(BaseModel):
    """更新阅读进度"""
    progress: Optional[float] = Field(None, ge=0, le=100)
    last_position: Optional[int] = Field(None, ge=0)
    total_time: Optional[int] = Field(None, ge=0)
    completed: Optional[bool] = None


class ReadingProgress(ReadingProgressBase):
    """阅读进度完整模型"""
    id: int
    user_id: int
    last_read_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ReadingProgressStats(BaseModel):
    """阅读进度统计"""
    total_articles: int = Field(..., description="总文章数")
    completed_articles: int = Field(..., description="已完成文章数")
    in_progress_articles: int = Field(..., description="进行中文章数")
    total_reading_time: int = Field(..., description="总阅读时间（秒）")
    average_progress: float = Field(..., description="平均进度")


class BatchUpdateRequest(BaseModel):
    """批量更新请求"""
    updates: List[dict] = Field(..., description="更新列表，每项包含 article_id 和要更新的字段")


class ImportExportResult(BaseModel):
    """导入导出结果"""
    imported: int = Field(..., description="成功导入/导出的数量")
    failed: int = Field(..., description="失败的数量")
