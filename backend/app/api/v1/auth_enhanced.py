"""
增强的认证API路由
提供完整的用户认证功能，包括注册、登录、令牌刷新、密码重置等
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timedelta
from typing import Optional
import secrets

from ...core.security import (
    create_access_token,
    create_refresh_token,
    verify_token,
    get_password_hash,
    verify_password,
)
from ...core.database import get_db
from ...models.user import User
from ...schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    TokenResponse,
    PasswordResetRequest,
    PasswordResetConfirm,
    EmailVerificationRequest,
)
from ...services.email_service import send_verification_email, send_password_reset_email

router = APIRouter(prefix="/auth", tags=["认证"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    用户注册

    - **email**: 用户邮箱（唯一）
    - **username**: 用户名（唯一）
    - **password**: 密码（最少8位）
    - **full_name**: 全名（可选）
    """
    # 检查邮箱是否已存在
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该邮箱已被注册"
        )

    # 检查用户名是否已存在
    result = await db.execute(select(User).where(User.username == user_data.username))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该用户名已被使用"
        )

    # 创建新用户
    verification_token = secrets.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8')

    new_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        full_name=user_data.full_name,
        is_active=False,
        verification_token=verification_token,
        verification_token_expires=datetime.utcnow() + timedelta(hours=24),
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # 发送验证邮件
    base_url = str(request.base_url)
    await send_verification_email(
        email=new_user.email,
        username=new_user.username,
        verification_url=f"{base_url}api/v1/auth/verify?token={verification_token}"
    )

    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        username=new_user.username,
        full_name=new_user.full_name,
        is_active=new_user.is_active,
        is_verified=False,
        created_at=new_user.created_at,
    )


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """
    用户登录（OAuth2标准）

    - **username**: 邮箱或用户名
    - **password**: 密码
    """
    # 支持邮箱或用户名登录
    result = await db.execute(
        select(User).where(
            (User.email == form_data.username) | (User.username == form_data.username)
        )
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="邮箱或密码错误",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="账户已被禁用"
        )

    # 更新最后登录时间
    user.last_login = datetime.utcnow()
    await db.commit()

    # 创建令牌
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            is_active=user.is_active,
            is_verified=user.is_verified,
            avatar_url=user.avatar_url,
            bio=user.bio,
            created_at=user.created_at,
        )
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    refresh_token: str,
    db: AsyncSession = Depends(get_db),
):
    """
    刷新访问令牌
    """
    try:
        payload = verify_token(refresh_token)
        user_id = payload.get("sub")

        result = await db.execute(select(User).where(User.id == int(user_id)))
        user = result.scalar_one_or_none()

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="无效的刷新令牌"
            )

        # 创建新的访问令牌
        access_token = create_access_token(data={"sub": str(user.id)})
        new_refresh_token = create_refresh_token(data={"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的刷新令牌"
        )


@router.post("/verify-email")
async def verify_email(
    token: str,
    db: AsyncSession = Depends(get_db),
):
    """
    验证邮箱
    """
    result = await db.execute(
        select(User).where(User.verification_token == token)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的验证令牌"
        )

    if user.verification_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="验证令牌已过期"
        )

    # 激活用户
    user.is_active = True
    user.is_verified = True
    user.verification_token = None
    user.verification_token_expires = None
    user.email_verified_at = datetime.utcnow()

    await db.commit()

    return {"message": "邮箱验证成功"}


@router.post("/resend-verification")
async def resend_verification(
    request_data: EmailVerificationRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    重新发送验证邮件
    """
    result = await db.execute(
        select(User).where(User.email == request_data.email)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="邮箱已验证"
        )

    # 生成新的验证令牌
    verification_token = secrets.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8')
    user.verification_token = verification_token
    user.verification_token_expires = datetime.utcnow() + timedelta(hours=24)

    await db.commit()

    # 发送验证邮件
    base_url = str(request.base_url)
    await send_verification_email(
        email=user.email,
        username=user.username,
        verification_url=f"{base_url}api/v1/auth/verify?token={verification_token}"
    )

    return {"message": "验证邮件已发送"}


@router.post("/reset-password-request")
async def reset_password_request(
    request_data: PasswordResetRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    请求密码重置
    """
    result = await db.execute(
        select(User).where(User.email == request_data.email)
    )
    user = result.scalar_one_or_none()

    # 即使用户不存在也返回成功（安全考虑）
    if not user:
        return {"message": "如果该邮箱存在，重置链接已发送"}

    # 生成重置令牌
    reset_token = secrets.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8')
    user.reset_password_token = reset_token
    user.reset_password_expires = datetime.utcnow() + timedelta(hours=1)

    await db.commit()

    # 发送重置邮件
    base_url = str(request.base_url)
    await send_password_reset_email(
        email=user.email,
        username=user.username,
        reset_url=f"{base_url}api/v1/auth/reset-password-confirm?token={reset_token}"
    )

    return {"message": "如果该邮箱存在，重置链接已发送"}


@router.post("/reset-password-confirm")
async def reset_password_confirm(
    request_data: PasswordResetConfirm,
    db: AsyncSession = Depends(get_db),
):
    """
    确认密码重置
    """
    result = await db.execute(
        select(User).where(User.reset_password_token == request_data.token)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="无效的重置令牌"
        )

    if user.reset_password_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="重置令牌已过期"
        )

    # 更新密码
    user.hashed_password = get_password_hash(request_data.new_password)
    user.reset_password_token = None
    user.reset_password_expires = None
    user.password_changed_at = datetime.utcnow()

    await db.commit()

    return {"message": "密码重置成功"}


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    """
    获取当前用户信息
    """
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")

        result = await db.execute(select(User).where(User.id == int(user_id)))
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="用户不存在"
            )

        return UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            is_active=user.is_active,
            is_verified=user.is_verified,
            avatar_url=user.avatar_url,
            bio=user.bio,
            website=user.website,
            location=user.location,
            created_at=user.created_at,
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的认证令牌"
        )


@router.post("/logout")
async def logout():
    """
    用户登出（客户端应删除令牌）
    """
    return {"message": "登出成功"}
