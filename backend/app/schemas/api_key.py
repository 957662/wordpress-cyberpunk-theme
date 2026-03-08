from uuid import UUID
"""
API Key Pydantic Schemas
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator


class ApiKeyBase(BaseModel):
    """API Key 基础 Schema"""
    name: str = Field(..., min_length=1, max_length=200, description="API 密钥名称")
    scopes: List[str] = Field(default=["read"], description="权限范围")


class ApiKeyCreate(ApiKeyBase):
    """创建 API Key Schema"""
    expires_days: Optional[int] = Field(default=365, ge=1, le=3650, description="过期天数")


class ApiKeyUpdate(BaseModel):
    """更新 API Key Schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    scopes: Optional[List[str]] = None
    is_active: Optional[bool] = None


class ApiKeyResponse(ApiKeyBase):
    """API Key 响应 Schema"""
    id: UUID
    prefix: str
    display_key: str
    is_active: bool
    is_valid: bool
    is_expired: bool
    last_used: Optional[datetime]
    expires_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ApiKeyDetail(ApiKeyResponse):
    """API Key 详情 Schema"""
    key: Optional[str] = Field(None, description="完整密钥（仅在创建时返回）")


class ApiKeyUsageStats(BaseModel):
    """API Key 使用统计 Schema"""
    total_requests: int
    successful_requests: int
    failed_requests: int
    avg_response_time: Optional[float]
    last_used: Optional[datetime]
    most_used_endpoint: Optional[str]


class ApiKeyUsageLog(BaseModel):
    """API Key 使用日志 Schema"""
    id: UUID
    endpoint: str
    method: str
    status_code: int
    response_time: Optional[int]
    ip_address: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True


class ApiKeyWithUsage(ApiKeyResponse):
    """包含使用统计的 API Key Schema"""
    usage_stats: ApiKeyUsageStats
    recent_logs: List[ApiKeyUsageLog] = []


# 验证器
@validator('scopes')
def validate_scopes(cls, v):
    """验证权限范围"""
    valid_scopes = {'read', 'write', 'delete', 'admin'}
    if not all(scope in valid_scopes for scope in v):
        raise ValueError(f'Invalid scope. Valid scopes are: {", ".join(valid_scopes)}')
    return v
