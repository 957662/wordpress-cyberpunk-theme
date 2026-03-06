"""
Backup Management API Routes
"""
import os
import json
from datetime import datetime, timedelta
from typing import List
import shutil
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.core.database import get_db
from app.core.auth import get_current_user
from app.core.config import settings
from app.models.user import User
from app.models.backup import Backup, BackupStatus, BackupRestore
from app.schemas.backup import (
    BackupCreate,
    BackupUpdate,
    BackupResponse,
    BackupList,
    BackupStats,
    BackupRestoreCreate,
    BackupRestoreResponse,
    BackupRestoreList,
    DownloadUrl,
    StorageInfo,
)

router = APIRouter(prefix="/backups", tags=["Backups"])


def get_backup_dir() -> str:
    """获取备份目录"""
    backup_dir = getattr(settings, "BACKUP_DIR", "/tmp/backups")
    os.makedirs(backup_dir, exist_ok=True)
    return backup_dir


def calculate_storage_info(backup_dir: str) -> StorageInfo:
    """计算存储信息"""
    total_space = shutil.disk_usage(backup_dir).total
    used_space = shutil.disk_usage(backup_dir).used
    available_space = shutil.disk_usage(backup_dir).free
    usage_percent = round((used_space / total_space) * 100, 2)

    return StorageInfo(
        total_space=total_space,
        used_space=used_space,
        available_space=available_space,
        usage_percent=usage_percent,
    )


@router.post("", response_model=BackupResponse, status_code=status.HTTP_201_CREATED)
def create_backup(
    data: BackupCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    创建备份

    - **backup_type**: 备份类型 (full, incremental, database, media)
    - **include_media**: 是否包含媒体文件
    - **expires_days**: 保留天数
    """
    # 计算过期时间
    expires_at = None
    if data.expires_days:
        expires_at = datetime.utcnow() + timedelta(days=data.expires_days)

    # 创建备份记录
    backup = Backup(
        user_id=current_user.id,
        name=data.name,
        description=data.description,
        backup_type=data.backup_type,
        storage_location=data.storage_location,
        include_media=data.include_media,
        included_tables=",".join(data.included_tables) if data.included_tables else None,
        excluded_tables=",".join(data.excluded_tables) if data.excluded_tables else None,
        expires_at=expires_at,
        status=BackupStatus.PENDING,
    )

    db.add(backup)
    db.commit()
    db.refresh(backup)

    # 添加后台任务执行备份
    background_tasks.add_task(perform_backup, backup.id, db)

    return BackupResponse.from_orm(backup)


async def perform_backup(backup_id: int, db: Session):
    """执行备份（后台任务）"""
    backup = db.query(Backup).filter(Backup.id == backup_id).first()
    if not backup:
        return

    try:
        backup.start()
        db.commit()

        # 这里实现实际的备份逻辑
        # 1. 导出数据库
        # 2. 复制媒体文件（如果需要）
        # 3. 创建压缩文件
        # 4. 上传到存储（如果不是本地）

        # 模拟备份过程
        backup_dir = get_backup_dir()
        filename = f"backup_{backup.id}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.tar.gz"
        file_path = os.path.join(backup_dir, filename)

        # 这里应该是实际的备份逻辑
        # 使用 pg_dump, tar 等工具

        # 模拟完成
        file_size = 1024 * 1024 * 100  # 100 MB
        backup.complete(file_path, file_size)
        db.commit()

    except Exception as e:
        backup.fail(str(e))
        db.commit()


@router.get("", response_model=BackupList)
def list_backups(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None, description="状态过滤"),
    backup_type: Optional[str] = Query(None, description="类型过滤"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取备份列表

    支持按状态、类型过滤和分页
    """
    query = db.query(Backup).filter(Backup.user_id == current_user.id)

    if status:
        query = query.filter(Backup.status == status)

    if backup_type:
        query = query.filter(Backup.backup_type == backup_type)

    total = query.count()

    backups = (
        query.order_by(desc(Backup.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return BackupList(
        total=total,
        items=[BackupResponse.from_orm(b) for b in backups],
        page=skip // limit + 1,
        page_size=limit,
    )


@router.get("/stats", response_model=BackupStats)
def get_backup_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取备份统计

    返回备份的数量和大小统计
    """
    backups = db.query(Backup).filter(Backup.user_id == current_user.id).all()

    total_size = sum(b.file_size for b in backups if b.file_size) or 0

    return BackupStats(
        total_backups=len(backups),
        total_size_mb=round(total_size / (1024 * 1024), 2),
        completed_backups=len([b for b in backups if b.status == BackupStatus.COMPLETED]),
        failed_backups=len([b for b in backups if b.status == BackupStatus.FAILED]),
        pending_backups=len([b for b in backups if b.status == BackupStatus.PENDING]),
        running_backups=len([b for b in backups if b.status == BackupStatus.RUNNING]),
    )


@router.get("/storage", response_model=StorageInfo)
def get_storage_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取存储信息

    返回备份存储的空间使用情况
    """
    backup_dir = get_backup_dir()
    return calculate_storage_info(backup_dir)


@router.get("/{backup_id}", response_model=BackupResponse)
def get_backup(
    backup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取备份详情

    返回指定备份的详细信息
    """
    backup = (
        db.query(Backup)
        .filter(Backup.id == backup_id, Backup.user_id == current_user.id)
        .first()
    )

    if not backup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )

    return BackupResponse.from_orm(backup)


@router.put("/{backup_id}", response_model=BackupResponse)
def update_backup(
    backup_id: int,
    data: BackupUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    更新备份

    可以更新名称、描述和过期时间
    """
    backup = (
        db.query(Backup)
        .filter(Backup.id == backup_id, Backup.user_id == current_user.id)
        .first()
    )

    if not backup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )

    if data.name is not None:
        backup.name = data.name
    if data.description is not None:
        backup.description = data.description
    if data.expires_days is not None:
        backup.expires_at = datetime.utcnow() + timedelta(days=data.expires_days)

    db.commit()
    db.refresh(backup)

    return BackupResponse.from_orm(backup)


@router.delete("/{backup_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_backup(
    backup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    删除备份

    永久删除指定的备份文件和记录
    """
    backup = (
        db.query(Backup)
        .filter(Backup.id == backup_id, Backup.user_id == current_user.id)
        .first()
    )

    if not backup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )

    # 删除文件
    if backup.file_path and os.path.exists(backup.file_path):
        os.remove(backup.file_path)

    db.delete(backup)
    db.commit()

    return None


@router.post("/{backup_id}/download", response_model=DownloadUrl)
def get_download_url(
    backup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取备份下载链接

    生成带签名的下载链接（24小时有效）
    """
    backup = (
        db.query(Backup)
        .filter(Backup.id == backup_id, Backup.user_id == current_user.id)
        .first()
    )

    if not backup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )

    if not backup.can_restore:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Backup cannot be downloaded"
        )

    # 生成下载链接（这里简化处理，实际应该使用签名URL）
    download_url = f"/api/v1/backups/{backup_id}/download-file"
    expires_at = datetime.utcnow() + timedelta(hours=24)

    return DownloadUrl(
        download_url=download_url,
        expires_at=expires_at,
    )


@router.get("/{backup_id}/download-file")
def download_backup_file(
    backup_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    下载备份文件

    返回备份文件供下载
    """
    backup = (
        db.query(Backup)
        .filter(Backup.id == backup_id, Backup.user_id == current_user.id)
        .first()
    )

    if not backup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )

    if not backup.file_path or not os.path.exists(backup.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup file not found"
        )

    filename = os.path.basename(backup.file_path)
    return FileResponse(
        path=backup.file_path,
        filename=filename,
        media_type="application/gzip",
    )


@router.post("/{backup_id}/restore", response_model=BackupRestoreResponse, status_code=status.HTTP_201_CREATED)
def create_restore(
    backup_id: int,
    data: BackupRestoreCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    从备份恢复

    创建恢复任务并后台执行
    """
    backup = (
        db.query(Backup)
        .filter(Backup.id == backup_id, Backup.user_id == current_user.id)
        .first()
    )

    if not backup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Backup not found"
        )

    if not backup.can_restore:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Backup cannot be restored"
        )

    # 创建恢复记录
    restore = BackupRestore(
        backup_id=backup_id,
        user_id=current_user.id,
        restore_database=data.restore_database,
        restore_media=data.restore_media,
        force_restore=data.force_restore,
    )

    db.add(restore)
    db.commit()
    db.refresh(restore)

    # 添加后台任务执行恢复
    background_tasks.add_task(perform_restore, restore.id, db)

    return BackupRestoreResponse.from_orm(restore)


async def perform_restore(restore_id: int, db: Session):
    """执行恢复（后台任务）"""
    restore = db.query(BackupRestore).filter(BackupRestore.id == restore_id).first()
    if not restore:
        return

    try:
        restore.start()
        db.commit()

        # 这里实现实际的恢复逻辑
        # 1. 解压备份文件
        # 2. 恢复数据库
        # 3. 恢复媒体文件（如果需要）

        # 模拟完成
        restore.complete()
        db.commit()

    except Exception as e:
        restore.fail(str(e))
        db.commit()


@router.get("/restores", response_model=BackupRestoreList)
def list_restores(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    backup_id: Optional[int] = Query(None, description="备份ID过滤"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取恢复任务列表

    返回用户的备份恢复任务列表
    """
    query = db.query(BackupRestore).filter(BackupRestore.user_id == current_user.id)

    if backup_id:
        query = query.filter(BackupRestore.backup_id == backup_id)

    total = query.count()

    restores = (
        query.order_by(desc(BackupRestore.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return BackupRestoreList(
        total=total,
        items=[BackupRestoreResponse.from_orm(r) for r in restores],
        page=skip // limit + 1,
        page_size=limit,
    )
