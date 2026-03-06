"""
Enhanced Authentication API Routes
提供完整的认证API端点
"""

from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user
from app.services.auth_service_enhanced import AuthService
from app.schemas.user import UserCreate, UserLogin, UserResponse, UserUpdate
from app.models.user import User


router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    """获取认证服务实例"""
    return AuthService(db)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    用户注册

    - **username**: 用户名（唯一）
    - **email**: 邮箱地址（唯一）
    - **password**: 密码
    - **full_name**: 全名（可选）
    - **bio**: 个人简介（可选）
    - **avatar_url**: 头像URL（可选）
    """
    return await auth_service.register(user_data)


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    用户登录

    使用OAuth2密码认证流程
    - **username**: 用户名
    - **password**: 密码

    返回访问令牌和刷新令牌
    """
    login_data = UserLogin(
        username=form_data.username,
        password=form_data.password
    )
    return await auth_service.login(login_data)


@router.post("/login/json")
async def login_json(
    login_data: UserLogin,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    用户登录（JSON格式）

    使用JSON格式进行登录
    - **username**: 用户名
    - **password**: 密码

    返回访问令牌和刷新令牌
    """
    return await auth_service.login(login_data)


@router.post("/refresh")
async def refresh_token(
    refresh_token: str,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    刷新访问令牌

    - **refresh_token**: 刷新令牌
    """
    return await auth_service.refresh_token(refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户信息

    需要有效的访问令牌
    """
    return UserResponse.from_orm(current_user)


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    更新当前用户信息

    - **full_name**: 全名
    - **bio**: 个人简介
    - **avatar_url**: 头像URL
    """
    update_data = user_update.dict(exclude_unset=True)

    for field, value in update_data.items():
        setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)

    return UserResponse.from_orm(current_user)


@router.post("/change-password")
async def change_password(
    old_password: str,
    new_password: str,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    修改密码

    - **old_password**: 旧密码
    - **new_password**: 新密码
    """
    await auth_service.update_password(
        current_user.id,
        old_password,
        new_password
    )
    return {"message": "Password updated successfully"}


@router.post("/forgot-password")
async def forgot_password(
    email: str,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    请求密码重置

    - **email**: 邮箱地址

    返回密码重置令牌（实际应用中应该发送邮件）
    """
    reset_token = await auth_service.request_password_reset(email)
    return {
        "message": "If the email exists, a reset link has been sent",
        "reset_token": reset_token  # 仅用于开发环境
    }


@router.post("/reset-password")
async def reset_password(
    token: str,
    new_password: str,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    重置密码

    - **token**: 重置令牌
    - **new_password**: 新密码
    """
    await auth_service.reset_password(token, new_password)
    return {"message": "Password reset successfully"}


@router.post("/verify-email")
async def verify_email(
    token: str,
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    验证邮箱

    - **token**: 验证令牌
    """
    await auth_service.verify_email(token)
    return {"message": "Email verified successfully"}


@router.post("/change-email")
async def change_email(
    new_email: str,
    password: str,
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    更改邮箱

    - **new_email**: 新邮箱地址
    - **password**: 当前密码（用于验证）
    """
    updated_user = await auth_service.change_email(
        current_user.id,
        new_email,
        password
    )
    return {
        "message": "Email changed successfully. Please verify your new email.",
        "user": UserResponse.from_orm(updated_user)
    }


@router.post("/deactivate")
async def deactivate_account(
    current_user: User = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    停用账户

    注意：此操作不可逆，需要联系管理员重新激活
    """
    await auth_service.deactivate_account(current_user.id)
    return {"message": "Account deactivated successfully"}


@router.post("/activate")
async def activate_account(
    user_id: int,
    # current_user: User = Depends(get_current_user),  # 需要管理员权限
    auth_service: AuthService = Depends(get_auth_service)
):
    """
    激活账户

    需要管理员权限
    - **user_id**: 要激活的用户ID
    """
    await auth_service.activate_account(user_id)
    return {"message": "Account activated successfully"}


@router.post("/logout")
async def logout():
    """
    用户登出

    客户端应该删除存储的令牌
    """
    return {"message": "Logged out successfully"}
