"""
API Key Management API Routes
"""
from datetime import datetime, timedelta
from typing import List
import secrets
import hashlib
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.api_key import ApiKey, ApiKeyUsage
from app.schemas.api_key import (
    ApiKeyCreate,
    ApiKeyUpdate,
    ApiKeyResponse,
    ApiKeyDetail,
    ApiKeyWithUsage,
    ApiKeyUsageStats,
    ApiKeyUsageLog,
)
from app.core.security import hash_api_key

router = APIRouter(prefix="/api-keys", tags=["API Keys"])


def generate_api_key() -> str:
    """生成随机 API 密钥"""
    return f"cp_{secrets.token_urlsafe(32)}"


def get_api_key_prefix(key: str) -> str:
    """获取密钥前缀（前8位）"""
    return key[:8]


@router.post("", response_model=ApiKeyDetail, status_code=status.HTTP_201_CREATED)
def create_api_key(
    data: ApiKeyCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    创建新的 API 密钥

    - **name**: 密钥名称
    - **scopes**: 权限范围 (read, write, delete, admin)
    - **expires_days**: 过期天数（1-3650天）
    """
    # 生成 API 密钥
    api_key = generate_api_key()
    key_hash = hash_api_key(api_key)

    # 计算过期时间
    expires_at = None
    if data.expires_days:
        expires_at = datetime.utcnow() + timedelta(days=data.expires_days)

    # 创建 API 密钥记录
    db_api_key = ApiKey(
        user_id=current_user.id,
        name=data.name,
        key_hash=key_hash,
        prefix=get_api_key_prefix(api_key),
        scopes=data.scopes,
        expires_at=expires_at,
    )

    db.add(db_api_key)
    db.commit()
    db.refresh(db_api_key)

    # 只在创建时返回完整密钥
    response = ApiKeyDetail.from_orm(db_api_key)
    response.key = api_key

    return response


@router.get("", response_model=List[ApiKeyResponse])
def list_api_keys(
    skip: int = Query(0, ge=0, description="跳过条数"),
    limit: int = Query(20, ge=1, le=100, description="返回条数"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取当前用户的 API 密钥列表

    返回用户的 API 密钥列表，包含基本信息和状态
    """
    api_keys = (
        db.query(ApiKey)
        .filter(ApiKey.user_id == current_user.id)
        .order_by(desc(ApiKey.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [ApiKeyResponse.from_orm(key) for key in api_keys]


@router.get("/{api_key_id}", response_model=ApiKeyWithUsage)
def get_api_key(
    api_key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取 API 密钥详情

    返回指定 API 密钥的详细信息和使用统计
    """
    api_key = (
        db.query(ApiKey)
        .filter(ApiKey.id == api_key_id, ApiKey.user_id == current_user.id)
        .first()
    )

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )

    # 获取使用统计
    stats = (
        db.query(
            func.count(ApiKeyUsage.id).label("total"),
            func.sum(func.cast(ApiKeyUsage.status_code < 400, Integer)).label("successful"),
            func.sum(func.cast(ApiKeyUsage.status_code >= 400, Integer)).label("failed"),
            func.avg(ApiKeyUsage.response_time).label("avg_time"),
            func.max(ApiKeyUsage.timestamp).label("last_used"),
        )
        .filter(ApiKeyUsage.api_key_id == api_key_id)
        .first()
    )

    usage_stats = ApiKeyUsageStats(
        total_requests=stats.total or 0,
        successful_requests=stats.successful or 0,
        failed_requests=stats.failed or 0,
        avg_response_time=float(stats.avg_time) if stats.avg_time else None,
        last_used=stats.last_used,
        most_used_endpoint=None,  # 可以通过额外查询获取
    )

    # 获取最近的使用日志
    recent_logs = (
        db.query(ApiKeyUsage)
        .filter(ApiKeyUsage.api_key_id == api_key_id)
        .order_by(desc(ApiKeyUsage.timestamp))
        .limit(10)
        .all()
    )

    response = ApiKeyWithUsage.from_orm(api_key)
    response.usage_stats = usage_stats
    response.recent_logs = [ApiKeyUsageLog.from_orm(log) for log in recent_logs]

    return response


@router.put("/{api_key_id}", response_model=ApiKeyResponse)
def update_api_key(
    api_key_id: int,
    data: ApiKeyUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    更新 API 密钥

    可以更新名称、权限范围和状态
    """
    api_key = (
        db.query(ApiKey)
        .filter(ApiKey.id == api_key_id, ApiKey.user_id == current_user.id)
        .first()
    )

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )

    # 更新字段
    if data.name is not None:
        api_key.name = data.name
    if data.scopes is not None:
        api_key.scopes = data.scopes
    if data.is_active is not None:
        api_key.is_active = data.is_active

    db.commit()
    db.refresh(api_key)

    return ApiKeyResponse.from_orm(api_key)


@router.delete("/{api_key_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_api_key(
    api_key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    删除 API 密钥

    永久删除指定的 API 密钥
    """
    api_key = (
        db.query(ApiKey)
        .filter(ApiKey.id == api_key_id, ApiKey.user_id == current_user.id)
        .first()
    )

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )

    db.delete(api_key)
    db.commit()

    return None


@router.post("/{api_key_id}/revoke", response_model=ApiKeyResponse)
def revoke_api_key(
    api_key_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    撤销 API 密钥

    禁用指定的 API 密钥（不删除）
    """
    api_key = (
        db.query(ApiKey)
        .filter(ApiKey.id == api_key_id, ApiKey.user_id == current_user.id)
        .first()
    )

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )

    api_key.revoke()
    db.commit()
    db.refresh(api_key)

    return ApiKeyResponse.from_orm(api_key)


@router.post("/{api_key_id}/refresh", response_model=ApiKeyResponse)
def refresh_api_key_expiry(
    api_key_id: int,
    days: int = Query(365, ge=1, le=3650, description="延期天数"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    刷新 API 密钥过期时间

    延长 API 密钥的有效期
    """
    api_key = (
        db.query(ApiKey)
        .filter(ApiKey.id == api_key_id, ApiKey.user_id == current_user.id)
        .first()
    )

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )

    api_key.refresh_expiry(days)
    db.commit()
    db.refresh(api_key)

    return ApiKeyResponse.from_orm(api_key)


@router.get("/{api_key_id}/usage", response_model=List[ApiKeyUsageLog])
def get_api_key_usage_logs(
    api_key_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    获取 API 密钥使用日志

    返回指定 API 密钥的使用记录
    """
    # 验证所有权
    api_key = (
        db.query(ApiKey)
        .filter(ApiKey.id == api_key_id, ApiKey.user_id == current_user.id)
        .first()
    )

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )

    logs = (
        db.query(ApiKeyUsage)
        .filter(ApiKeyUsage.api_key_id == api_key_id)
        .order_by(desc(ApiKeyUsage.timestamp))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [ApiKeyUsageLog.from_orm(log) for log in logs]
