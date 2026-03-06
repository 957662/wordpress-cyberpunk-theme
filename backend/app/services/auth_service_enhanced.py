"""
Enhanced Authentication Service
提供完整的认证服务功能
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User
from app.core.config import settings
from app.core.security import create_access_token, create_refresh_token, verify_token
from app.schemas.user import UserCreate, UserLogin, UserResponse


class AuthService:
    """增强的认证服务"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    async def hash_password(self, password: str) -> str:
        """密码加密"""
        return self.pwd_context.hash(password)

    async def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """验证密码"""
        return self.pwd_context.verify(plain_password, hashed_password)

    async def register(self, user_data: UserCreate) -> UserResponse:
        """用户注册"""
        # 检查用户名是否存在
        existing_user = await self.db.execute(
            select(User).where(User.username == user_data.username)
        )
        if existing_user.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        # 检查邮箱是否存在
        existing_email = await self.db.execute(
            select(User).where(User.email == user_data.email)
        )
        if existing_email.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # 创建新用户
        hashed_password = await self.hash_password(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            bio=user_data.bio,
            avatar_url=user_data.avatar_url,
            is_active=True,
            is_verified=False
        )

        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)

        return UserResponse.from_orm(db_user)

    async def login(self, login_data: UserLogin) -> Dict[str, Any]:
        """用户登录"""
        # 查找用户
        result = await self.db.execute(
            select(User).where(User.username == login_data.username)
        )
        user = result.scalar_one_or_none()

        if not user or not await self.verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user"
            )

        # 更新最后登录时间
        user.last_login = datetime.utcnow()
        await self.db.commit()

        # 生成token
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": UserResponse.from_orm(user)
        }

    async def refresh_token(self, refresh_token: str) -> Dict[str, str]:
        """刷新访问令牌"""
        try:
            payload = verify_token(refresh_token)
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token"
                )

            # 验证用户是否存在
            result = await self.db.execute(
                select(User).where(User.id == int(user_id))
            )
            user = result.scalar_one_or_none()

            if not user or not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found or inactive"
                )

            # 生成新的access token
            access_token = create_access_token(data={"sub": str(user.id)})

            return {
                "access_token": access_token,
                "token_type": "bearer"
            }
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

    async def get_current_user(self, token: str) -> User:
        """获取当前用户"""
        try:
            payload = verify_token(token)
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials"
                )
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

        result = await self.db.execute(
            select(User).where(User.id == int(user_id))
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        return user

    async def update_password(self, user_id: int, old_password: str, new_password: str) -> bool:
        """更新密码"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if not await self.verify_password(old_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password"
            )

        user.hashed_password = await self.hash_password(new_password)
        await self.db.commit()

        return True

    async def request_password_reset(self, email: str) -> str:
        """请求密码重置"""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()

        if not user:
            # 为了安全，即使用户不存在也返回成功
            return "If the email exists, a reset link has been sent"

        # 生成重置令牌
        reset_token = create_access_token(
            data={"sub": str(user.id), "type": "reset"},
            expires_delta=timedelta(hours=1)
        )

        # 这里应该发送邮件
        # TODO: 实现邮件发送功能

        return reset_token

    async def reset_password(self, token: str, new_password: str) -> bool:
        """重置密码"""
        try:
            payload = verify_token(token)
            user_id = payload.get("sub")
            token_type = payload.get("type")

            if not user_id or token_type != "reset":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid reset token"
                )

            result = await self.db.execute(
                select(User).where(User.id == int(user_id))
            )
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            user.hashed_password = await self.hash_password(new_password)
            await self.db.commit()

            return True
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )

    async def verify_email(self, token: str) -> bool:
        """验证邮箱"""
        try:
            payload = verify_token(token)
            user_id = payload.get("sub")
            token_type = payload.get("type")

            if not user_id or token_type != "verification":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid verification token"
                )

            result = await self.db.execute(
                select(User).where(User.id == int(user_id))
            )
            user = result.scalar_one_or_none()

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found"
                )

            user.is_verified = True
            await self.db.commit()

            return True
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification token"
            )

    async def change_email(self, user_id: int, new_email: str, password: str) -> UserResponse:
        """更改邮箱"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        if not await self.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password"
            )

        # 检查新邮箱是否已被使用
        existing_email = await self.db.execute(
            select(User).where(User.email == new_email)
        )
        if existing_email.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        user.email = new_email
        user.is_verified = False  # 需要重新验证
        await self.db.commit()
        await self.db.refresh(user)

        # 生成验证令牌
        verification_token = create_access_token(
            data={"sub": str(user.id), "type": "verification"},
            expires_delta=timedelta(days=7)
        )

        # 这里应该发送验证邮件
        # TODO: 实现邮件发送功能

        return UserResponse.from_orm(user)

    async def deactivate_account(self, user_id: int) -> bool:
        """停用账户"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        user.is_active = False
        user.deactivated_at = datetime.utcnow()
        await self.db.commit()

        return True

    async def activate_account(self, user_id: int) -> bool:
        """激活账户"""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        user.is_active = True
        user.deactivated_at = None
        await self.db.commit()

        return True
