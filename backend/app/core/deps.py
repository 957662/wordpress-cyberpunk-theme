"""
Dependencies for FastAPI routes
依赖注入：认证和权限检查
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional

from app.core.database import get_db
from app.models.user import User
from app.services.auth_service import AuthService

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    获取当前登录用户
    依赖注入：验证JWT token并返回用户对象
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证认证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 解码token
    username = AuthService.decode_access_token(token=token)
    if not username:
        raise credentials_exception

    # 获取用户
    user = AuthService.get_user_by_username(db=db, username=username)
    if not user:
        raise credentials_exception

    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    获取当前活跃用户
    检查用户是否处于激活状态
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="账户已被禁用"
        )
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    获取当前管理员用户
    检查用户是否具有管理员权限
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，需要管理员权限"
        )
    return current_user


async def get_current_author_user(
    current_user: User = Depends(get_current_active_user),
) -> User:
    """
    获取当前作者用户
    检查用户是否具有作者或管理员权限
    """
    if not (current_user.is_admin or current_user.is_author):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足，需要作者权限"
        )
    return current_user


class PermissionChecker:
    """
    权限检查器
    用于检查用户是否具有特定权限
    """

    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    def __call__(self, current_user: User = Depends(get_current_active_user)) -> User:
        """检查用户权限"""
        # 管理员拥有所有权限
        if current_user.is_admin:
            return current_user

        # 检查用户权限
        user_permissions = current_user.permissions or []
        if self.required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"缺少必需的权限: {self.required_permission}"
            )

        return current_user


# 预定义的权限检查器
require_post_create = PermissionChecker("post:create")
require_post_update = PermissionChecker("post:update")
require_post_delete = PermissionChecker("post:delete")
require_comment_moderate = PermissionChecker("comment:moderate")
require_user_manage = PermissionChecker("user:manage")


def can_modify_post(current_user: User, post_author_id: int) -> bool:
    """
    检查用户是否可以修改文章
    管理员和文章作者可以修改
    """
    return current_user.is_admin or current_user.id == post_author_id


def can_delete_post(current_user: User, post_author_id: int) -> bool:
    """
    检查用户是否可以删除文章
    只有管理员可以删除
    """
    return current_user.is_admin


def can_moderate_comment(current_user: User) -> bool:
    """
    检查用户是否可以管理评论
    管理员可以管理评论
    """
    return current_user.is_admin
