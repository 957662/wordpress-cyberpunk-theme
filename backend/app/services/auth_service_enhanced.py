"""
增强的认证服务
提供完整的用户认证业务逻辑
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import secrets

from ..core.security import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from ..models.user import User


class AuthServiceEnhanced:
    """增强的认证服务类"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def register_user(
        self,
        email: str,
        username: str,
        password: str,
        full_name: Optional[str] = None,
    ) -> User:
        """
        注册新用户
        
        Args:
            email: 邮箱
            username: 用户名
            password: 密码
            full_name: 全名
        
        Returns:
            创建的用户对象
        """
        # 检查邮箱是否已存在
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        if result.scalar_one_or_none():
            raise ValueError("该邮箱已被注册")
        
        # 检查用户名是否已存在
        result = await self.db.execute(
            select(User).where(User.username == username)
        )
        if result.scalar_one_or_none():
            raise ValueError("该用户名已被使用")
        
        # 生成验证令牌
        verification_token = secrets.urlsafe_b64encode(
            secrets.token_bytes(32)
        ).decode('utf-8')
        
        # 创建新用户
        new_user = User(
            email=email,
            username=username,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            is_active=False,
            verification_token=verification_token,
            verification_token_expires=datetime.utcnow() + timedelta(hours=24),
        )
        
        self.db.add(new_user)
        await self.db.commit()
        await self.db.refresh(new_user)
        
        return new_user
    
    async def authenticate_user(
        self,
        email_or_username: str,
        password: str,
    ) -> Optional[User]:
        """
        验证用户登录
        
        Args:
            email_or_username: 邮箱或用户名
            password: 密码
        
        Returns:
            验证成功返回用户对象，失败返回None
        """
        # 支持邮箱或用户名登录
        result = await self.db.execute(
            select(User).where(
                (User.email == email_or_username) |
                (User.username == email_or_username)
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        if not verify_password(password, user.hashed_password):
            return None
        
        if not user.is_active:
            raise ValueError("账户已被禁用")
        
        # 更新最后登录时间
        user.last_login = datetime.utcnow()
        await self.db.commit()
        
        return user
    
    async def create_tokens(
        self,
        user: User,
    ) -> Dict[str, str]:
        """
        创建访问令牌和刷新令牌
        
        Args:
            user: 用户对象
        
        Returns:
            包含access_token和refresh_token的字典
        """
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }
    
    async def verify_email(
        self,
        token: str,
    ) -> bool:
        """
        验证邮箱
        
        Args:
            token: 验证令牌
        
        Returns:
            验证成功返回True
        """
        result = await self.db.execute(
            select(User).where(User.verification_token == token)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise ValueError("无效的验证令牌")
        
        if user.verification_token_expires < datetime.utcnow():
            raise ValueError("验证令牌已过期")
        
        # 激活用户
        user.is_active = True
        user.is_verified = True
        user.verification_token = None
        user.verification_token_expires = None
        user.email_verified_at = datetime.utcnow()
        
        await self.db.commit()
        
        return True
    
    async def request_password_reset(
        self,
        email: str,
    ) -> Optional[str]:
        """
        请求密码重置
        
        Args:
            email: 邮箱
        
        Returns:
            重置令牌，用户不存在时返回None
        """
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            return None
        
        # 生成重置令牌
        reset_token = secrets.urlsafe_b64encode(
            secrets.token_bytes(32)
        ).decode('utf-8')
        
        user.reset_password_token = reset_token
        user.reset_password_expires = datetime.utcnow() + timedelta(hours=1)
        
        await self.db.commit()
        
        return reset_token
    
    async def reset_password(
        self,
        token: str,
        new_password: str,
    ) -> bool:
        """
        重置密码
        
        Args:
            token: 重置令牌
            new_password: 新密码
        
        Returns:
            重置成功返回True
        """
        result = await self.db.execute(
            select(User).where(User.reset_password_token == token)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise ValueError("无效的重置令牌")
        
        if user.reset_password_expires < datetime.utcnow():
            raise ValueError("重置令牌已过期")
        
        # 更新密码
        user.hashed_password = get_password_hash(new_password)
        user.reset_password_token = None
        user.reset_password_expires = None
        user.password_changed_at = datetime.utcnow()
        
        await self.db.commit()
        
        return True
    
    async def change_password(
        self,
        user_id: int,
        old_password: str,
        new_password: str,
    ) -> bool:
        """
        修改密码
        
        Args:
            user_id: 用户ID
            old_password: 旧密码
            new_password: 新密码
        
        Returns:
            修改成功返回True
        """
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise ValueError("用户不存在")
        
        if not verify_password(old_password, user.hashed_password):
            raise ValueError("旧密码错误")
        
        user.hashed_password = get_password_hash(new_password)
        user.password_changed_at = datetime.utcnow()
        
        await self.db.commit()
        
        return True
    
    async def get_user_by_id(
        self,
        user_id: int,
    ) -> Optional[User]:
        """
        根据ID获取用户
        
        Args:
            user_id: 用户ID
        
        Returns:
            用户对象或None
        """
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_email(
        self,
        email: str,
    ) -> Optional[User]:
        """
        根据邮箱获取用户
        
        Args:
            email: 邮箱
        
        Returns:
            用户对象或None
        """
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def update_user_profile(
        self,
        user_id: int,
        updates: Dict[str, Any],
    ) -> User:
        """
        更新用户资料
        
        Args:
            user_id: 用户ID
            updates: 更新字段字典
        
        Returns:
            更新后的用户对象
        """
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise ValueError("用户不存在")
        
        # 允许更新的字段
        allowed_fields = {
            'full_name', 'bio', 'avatar_url', 'website',
            'location', 'twitter_handle', 'github_handle'
        }
        
        for field, value in updates.items():
            if field in allowed_fields and hasattr(user, field):
                setattr(user, field, value)
        
        await self.db.commit()
        await self.db.refresh(user)
        
        return user
