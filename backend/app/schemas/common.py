"""
Common Schemas
通用数据模式
"""

from typing import Generic, TypeVar, List, Optional
from pydantic import BaseModel, Field


T = TypeVar("T")


class PaginationParams(BaseModel):
    """分页参数"""

    page: int = Field(1, ge=1, description="页码")
    page_size: int = Field(10, ge=1, le=100, description="每页数量")


class PaginatedResponse(BaseModel, Generic[T]):
    """分页响应"""

    data: List[T] = Field(..., description="数据列表")
    total: int = Field(..., description="总记录数")
    page: int = Field(..., description="当前页码")
    page_size: int = Field(..., description="每页数量")
    total_pages: int = Field(..., description="总页数")

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    """消息响应"""

    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    """错误响应"""

    error: bool = True
    message: str
    detail: Optional[str] = None
    status_code: int
