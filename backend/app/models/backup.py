"""
数据备份数据模型
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime, BigInteger, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.models.base import Base


class BackupType(str, type):
    """备份类型"""
    FULL = "full"           # 完整备份
    INCREMENTAL = "incremental"  # 增量备份
    DATABASE = "database"   # 仅数据库
    MEDIA = "media"         # 仅媒体文件


class BackupStatus(str, type):
    """备份状态"""
    PENDING = "pending"     # 待处理
    RUNNING = "running"     # 进行中
    COMPLETED = "completed" # 已完成
    FAILED = "failed"       # 失败
    DELETING = "deleting"   # 删除中


class Backup(Base):
    """备份记录模型"""

    __tablename__ = "backups"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)

    # 备份信息
    backup_type = Column(String(20), nullable=False, index=True)  # full, incremental, database, media
    status = Column(String(20), default=BackupStatus.PENDING, index=True)

    # 文件信息
    file_path = Column(String(1000), nullable=True)
    file_size = Column(BigInteger, nullable=True)  # 字节
    file_count = Column(Integer, default=0)

    # 存储信息
    storage_location = Column(String(200), nullable=True)  # local, s3, dropbox
    storage_url = Column(String(1000), nullable=True)

    # 备份内容
    included_tables = Column(Text, nullable=True)  # JSON: users, posts, comments
    excluded_tables = Column(Text, nullable=True)
    include_media = Column(Boolean, default=True)

    # 进度信息
    progress = Column(Integer, default=0)  # 0-100
    error_message = Column(Text, nullable=True)

    # 时间信息
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)  # 自动删除时间

    # 关联关系
    user = relationship("User", back_populates="backups")

    def __repr__(self):
        return f"<Backup(id={self.id}, name='{self.name}', type='{self.backup_type}', status='{self.status}')>"

    @property
    def duration(self) -> Optional[int]:
        """备份耗时（秒）"""
        if self.started_at and self.completed_at:
            return int((self.completed_at - self.started_at).total_seconds())
        return None

    @property
    def file_size_mb(self) -> Optional[float]:
        """文件大小（MB）"""
        if self.file_size:
            return round(self.file_size / (1024 * 1024), 2)
        return None

    @property
    def is_expired(self) -> bool:
        """检查是否过期"""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at

    @property
    def can_restore(self) -> bool:
        """是否可以恢复"""
        return self.status == BackupStatus.COMPLETED and not self.is_expired

    def start(self):
        """开始备份"""
        self.status = BackupStatus.RUNNING
        self.started_at = datetime.utcnow()

    def complete(self, file_path: str, file_size: int):
        """完成备份"""
        self.status = BackupStatus.COMPLETED
        self.completed_at = datetime.utcnow()
        self.file_path = file_path
        self.file_size = file_size
        self.progress = 100

    def fail(self, error_message: str):
        """标记失败"""
        self.status = BackupStatus.FAILED
        self.completed_at = datetime.utcnow()
        self.error_message = error_message
        self.progress = 0

    def update_progress(self, progress: int):
        """更新进度"""
        self.progress = max(0, min(100, progress))


class BackupRestore(Base):
    """备份恢复记录"""

    __tablename__ = "backup_restores"

    id = Column(Integer, primary_key=True, index=True)
    backup_id = Column(Integer, ForeignKey("backups.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(20), default=BackupStatus.PENDING, index=True)

    # 恢复选项
    restore_database = Column(Boolean, default=True)
    restore_media = Column(Boolean, default=True)
    force_restore = Column(Boolean, default=False)  # 强制覆盖现有数据

    # 进度信息
    progress = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)

    # 时间信息
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关联关系
    backup = relationship("Backup", back_populates="restores")
    user = relationship("User", back_populates="backup_restores")

    def __repr__(self):
        return f"<BackupRestore(id={self.id}, backup_id={self.backup_id}, status='{self.status}')>"

    @property
    def duration(self) -> Optional[int]:
        """恢复耗时（秒）"""
        if self.started_at and self.completed_at:
            return int((self.completed_at - self.started_at).total_seconds())
        return None

    def start(self):
        """开始恢复"""
        self.status = BackupStatus.RUNNING
        self.started_at = datetime.utcnow()

    def complete(self):
        """完成恢复"""
        self.status = BackupStatus.COMPLETED
        self.completed_at = datetime.utcnow()
        self.progress = 100

    def fail(self, error_message: str):
        """标记失败"""
        self.status = BackupStatus.FAILED
        self.completed_at = datetime.utcnow()
        self.error_message = error_message

    def update_progress(self, progress: int):
        """更新进度"""
        self.progress = max(0, min(100, progress))


# 扩展 User 模型的关系
from app.models.user import User
User.backups = relationship("Backup", back_populates="user", cascade="all, delete-orphan")
User.backup_restores = relationship("BackupRestore", back_populates="user", cascade="all, delete-orphan")
Backup.restores = relationship("BackupRestore", back_populates="backup", cascade="all, delete-orphan")
