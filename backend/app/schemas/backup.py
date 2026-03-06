"""
Backup Pydantic Schemas
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class BackupType(str):
    """备份类型枚举"""
    FULL = "full"
    INCREMENTAL = "incremental"
    DATABASE = "database"
    MEDIA = "media"


class BackupStatus(str):
    """备份状态枚举"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    DELETING = "deleting"


class BackupBase(BaseModel):
    """备份基础 Schema"""
    name: str = Field(..., min_length=1, max_length=500, description="备份名称")
    description: Optional[str] = Field(None, description="备份描述")
    backup_type: str = Field(..., description="备份类型: full, incremental, database, media")

    # 备份选项
    include_media: bool = Field(default=True, description="包含媒体文件")
    included_tables: Optional[List[str]] = Field(None, description="包含的表")
    excluded_tables: Optional[List[str]] = Field(None, description="排除的表")

    # 过期设置
    expires_days: Optional[int] = Field(default=30, ge=1, le=365, description="保留天数")


class BackupCreate(BackupBase):
    """创建备份 Schema"""
    storage_location: str = Field(default="local", description="存储位置: local, s3, dropbox")


class BackupUpdate(BaseModel):
    """更新备份 Schema"""
    name: Optional[str] = Field(None, min_length=1, max_length=500)
    description: Optional[str] = None
    expires_days: Optional[int] = Field(None, ge=1, le=365)


class BackupResponse(BackupBase):
    """备份响应 Schema"""
    id: int
    user_id: int
    status: str

    # 文件信息
    file_path: Optional[str]
    file_size: Optional[int]
    file_size_mb: Optional[float]
    file_count: int

    # 存储信息
    storage_location: Optional[str]
    storage_url: Optional[str]

    # 进度信息
    progress: int
    error_message: Optional[str]

    # 时间信息
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    expires_at: Optional[datetime]
    duration: Optional[int]

    # 状态标志
    is_expired: bool
    can_restore: bool

    class Config:
        from_attributes = True


class BackupList(BaseModel):
    """备份列表响应 Schema"""
    total: int
    items: List[BackupResponse]
    page: int
    page_size: int


class BackupStats(BaseModel):
    """备份统计 Schema"""
    total_backups: int
    total_size_mb: float
    completed_backups: int
    failed_backups: int
    pending_backups: int
    running_backups: int


class BackupRestoreBase(BaseModel):
    """备份恢复基础 Schema"""
    backup_id: int = Field(..., description="备份ID")
    restore_database: bool = Field(default=True, description="恢复数据库")
    restore_media: bool = Field(default=True, description="恢复媒体文件")
    force_restore: bool = Field(default=False, description="强制覆盖现有数据")


class BackupRestoreCreate(BackupRestoreBase):
    """创建备份恢复 Schema"""
    pass


class BackupRestoreResponse(BackupRestoreBase):
    """备份恢复响应 Schema"""
    id: int
    user_id: int
    status: str
    progress: int
    error_message: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    duration: Optional[int]

    # 关联数据
    backup: BackupResponse

    class Config:
        from_attributes = True


class BackupRestoreList(BaseModel):
    """备份恢复列表响应 Schema"""
    total: int
    items: List[BackupRestoreResponse]
    page: int
    page_size: int


class DownloadUrl(BaseModel):
    """下载URL Schema"""
    download_url: str
    expires_at: datetime


class StorageInfo(BaseModel):
    """存储信息 Schema"""
    total_space: int
    used_space: int
    available_space: int
    usage_percent: float
