"""
认证服务 - 完整实现
处理用户认证、令牌管理和会话管理
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import HTTPException, status
from pydantic import EmailStr
import redis.asyncio as redis

from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token, TokenPayload
from app.core.deps import db_session


class AuthService:
    """认证服务类"""

    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.redis_client: Optional[redis.Redis] = None

    async def get_redis(self) -> redis.Redis:
        """获取 Redis 客户端"""
        if self.redis_client is None:
            self.redis_client = redis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True
            )
        return self.redis_client

    # =====================================================
    # 密码处理
    # =====================================================

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """验证密码"""
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """生成密码哈希"""
        return self.pwd_context.hash(password)

    # =====================================================
    # JWT 令牌处理
    # =====================================================

    def create_access_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """创建访问令牌"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def create_refresh_token(self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """创建刷新令牌"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    async def verify_token(self, token: str, token_type: str = "access") -> TokenPayload:
        """验证令牌"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            token_data = TokenPayload(**payload)

            # 检查令牌类型
            if token_data.type != token_type:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )

            # 检查令牌是否在黑名单中
            if await self.is_token_blacklisted(token):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has been revoked"
                )

            return token_data

        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )

    async def blacklist_token(self, token: str, expire_seconds: int) -> None:
        """将令牌加入黑名单"""
        redis_client = await self.get_redis()
        await redis_client.setex(f"blacklist:{token}", expire_seconds, "1")

    async def is_token_blacklisted(self, token: str) -> bool:
        """检查令牌是否在黑名单中"""
        redis_client = await self.get_redis()
        return await redis_client.exists(f"blacklist:{token}") > 0

    # =====================================================
    # 用户认证
    # =====================================================

    async def authenticate(self, email: EmailStr, password: str) -> User:
        """验证用户凭据"""
        async with db_session() as db:
            user = await db.query(User).filter(User.email == email).first()
            
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )

            if not self.verify_password(password, user.password_hash):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Incorrect email or password"
                )

            if not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User account is disabled"
                )

            return user

    async def login(self, email: EmailStr, password: str) -> Token:
        """用户登录"""
        # 验证用户
        user = await self.authenticate(email, password)

        # 创建令牌
        access_token = self.create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        refresh_token = self.create_refresh_token(
            data={"sub": str(user.id), "email": user.email}
        )

        # 存储刷新令牌
        await self.store_refresh_token(user.id, refresh_token)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )

    async def refresh_tokens(self, refresh_token: str) -> Token:
        """刷新令牌"""
        # 验证刷新令牌
        payload = await self.verify_token(refresh_token, token_type="refresh")

        # 检查刷新令牌是否存在
        if not await self.get_refresh_token(payload.sub, refresh_token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )

        # 获取用户
        async with db_session() as db:
            user = await db.query(User).filter(User.id == payload.sub).first()
            if not user or not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found or inactive"
                )

        # 创建新令牌
        access_token = self.create_access_token(
            data={"sub": str(user.id), "email": user.email}
        )
        new_refresh_token = self.create_refresh_token(
            data={"sub": str(user.id), "email": user.email}
        )

        # 移除旧刷新令牌，存储新令牌
        await self.remove_refresh_token(payload.sub, refresh_token)
        await self.store_refresh_token(user.id, new_refresh_token)

        # 将旧刷新令牌加入黑名单
        await self.blacklist_token(refresh_token, settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600)

        return Token(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer"
        )

    async def logout(self, access_token: str, refresh_token: str, user_id: int) -> None:
        """用户登出"""
        # 将令牌加入黑名单
        await self.blacklist_token(access_token, settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
        await self.blacklist_token(refresh_token, settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600)

        # 移除刷新令牌
        await self.remove_refresh_token(user_id, refresh_token)

    # =====================================================
    # 刷新令牌管理
    # =====================================================

    async def store_refresh_token(self, user_id: int, token: str) -> None:
        """存储刷新令牌"""
        redis_client = await self.get_redis()
        key = f"refresh_token:{user_id}:{token}"
        await redis_client.setex(key, settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 3600, "1")

    async def get_refresh_token(self, user_id: int, token: str) -> Optional[str]:
        """获取刷新令牌"""
        redis_client = await self.get_redis()
        key = f"refresh_token:{user_id}:{token}"
        return await redis_client.get(key)

    async def remove_refresh_token(self, user_id: int, token: str) -> None:
        """移除刷新令牌"""
        redis_client = await self.get_redis()
        key = f"refresh_token:{user_id}:{token}"
        await redis_client.delete(key)

    async def revoke_all_user_tokens(self, user_id: int) -> None:
        """撤销用户的所有令牌"""
        redis_client = await self.get_redis()
        pattern = f"refresh_token:{user_id}:*"
        keys = await redis_client.keys(pattern)
        if keys:
            await redis_client.delete(*keys)

    # =====================================================
    # 用户注册
    # =====================================================

    async def register(self, user_data: UserCreate) -> UserResponse:
        """用户注册"""
        async with db_session() as db:
            # 检查邮箱是否已存在
            existing_user = await db.query(User).filter(User.email == user_data.email).first()
            if existing_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )

            # 检查用户名是否已存在
            existing_username = await db.query(User).filter(User.username == user_data.username).first()
            if existing_username:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already taken"
                )

            # 创建用户
            hashed_password = self.get_password_hash(user_data.password)
            user = User(
                username=user_data.username,
                email=user_data.email,
                password_hash=hashed_password,
                full_name=user_data.full_name,
                role="user",
                is_active=True
            )

            db.add(user)
            await db.commit()
            await db.refresh(user)

            return UserResponse.from_orm(user)

    # =====================================================
    # 会话管理
    # =====================================================

    async def create_session(self, user_id: int, session_data: Dict[str, Any]) -> str:
        """创建会话"""
        redis_client = await self.get_redis()
        session_id = f"session:{user_id}:{datetime.utcnow().timestamp()}"
        await redis_client.hset(session_id, mapping=session_data)
        await redis_client.expire(session_id, settings.SESSION_EXPIRE_HOURS * 3600)
        return session_id

    async def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """获取会话"""
        redis_client = await self.get_redis()
        session_data = await redis_client.hgetall(session_id)
        return session_data if session_data else None

    async def delete_session(self, session_id: str) -> None:
        """删除会话"""
        redis_client = await self.get_redis()
        await redis_client.delete(session_id)

    async def delete_user_sessions(self, user_id: int) -> None:
        """删除用户的所有会话"""
        redis_client = await self.get_redis()
        pattern = f"session:{user_id}:*"
        keys = await redis_client.keys(pattern)
        if keys:
            await redis_client.delete(*keys)


# 单例实例
auth_service = AuthService()
