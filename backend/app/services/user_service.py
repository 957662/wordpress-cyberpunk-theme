"""
User Service Module for CyberPress Platform

This module provides business logic for user management operations including:
- User registration and authentication
- Profile management
- User settings
- Follow relationships
- User statistics
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc
import jwt

from app.models.user import User, UserProfile, UserSettings
from app.models.follow import UserFollow
from app.schemas.user import (
    UserCreate,
    UserUpdate,
    UserProfileUpdate,
    UserSettingsUpdate,
    UserResponse,
    UserProfileResponse
)
from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    """Service class for user management operations"""

    def __init__(self, db: Session):
        self.db = db

    # ==========================================
    # Authentication Methods
    # ==========================================

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create a JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
        return encoded_jwt

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        # Check if email already exists
        existing_user = self.db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise ValueError("Email already registered")

        # Check if username already exists
        existing_username = self.db.query(User).filter(User.username == user_data.username).first()
        if existing_username:
            raise ValueError("Username already taken")

        # Hash password
        hashed_password = self.hash_password(user_data.password)

        # Create user
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            password_hash=hashed_password,
            role=user_data.role or "subscriber",
            status="pending"  # Require email verification
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)

        # Create user profile
        db_profile = UserProfile(
            user_id=db_user.id,
            display_name=user_data.username,
            bio="",
            followers_count=0,
            following_count=0,
            posts_count=0
        )
        self.db.add(db_profile)

        # Create user settings
        db_settings = UserSettings(
            user_id=db_user.id,
            theme="dark",
            language="zh-CN",
            timezone="Asia/Shanghai",
            email_notifications=True,
            push_notifications=True
        )
        self.db.add(db_settings)
        self.db.commit()

        return db_user

    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if not self.verify_password(password, user.password_hash):
            return None
        if user.status != "active":
            raise ValueError("User account is not active")
        return user

    def verify_email(self, user_id: int) -> bool:
        """Verify user email"""
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return False
        user.email_verified = True
        user.status = "active"
        self.db.commit()
        return True

    # ==========================================
    # User CRUD Methods
    # ==========================================

    def get_user(self, user_id: int) -> Optional[User]:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        return self.db.query(User).filter(User.email == email).first()

    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username"""
        return self.db.query(User).filter(User.username == username).first()

    def get_users(
        self,
        skip: int = 0,
        limit: int = 100,
        status: Optional[str] = None,
        role: Optional[str] = None
    ) -> List[User]:
        """Get list of users with optional filters"""
        query = self.db.query(User)

        if status:
            query = query.filter(User.status == status)
        if role:
            query = query.filter(User.role == role)

        return query.offset(skip).limit(limit).all()

    def update_user(self, user_id: int, user_data: UserUpdate) -> Optional[User]:
        """Update user information"""
        user = self.get_user(user_id)
        if not user:
            return None

        update_data = user_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)

        self.db.commit()
        self.db.refresh(user)
        return user

    def delete_user(self, user_id: int) -> bool:
        """Delete a user"""
        user = self.get_user(user_id)
        if not user:
            return False

        self.db.delete(user)
        self.db.commit()
        return True

    def change_password(self, user_id: int, old_password: str, new_password: str) -> bool:
        """Change user password"""
        user = self.get_user(user_id)
        if not user:
            return False

        if not self.verify_password(old_password, user.password_hash):
            raise ValueError("Incorrect current password")

        user.password_hash = self.hash_password(new_password)
        self.db.commit()
        return True

    def reset_password(self, email: str, new_password: str) -> bool:
        """Reset user password (for forgot password flow)"""
        user = self.get_user_by_email(email)
        if not user:
            return False

        user.password_hash = self.hash_password(new_password)
        self.db.commit()
        return True

    # ==========================================
    # Profile Methods
    # ==========================================

    def get_user_profile(self, user_id: int) -> Optional[UserProfile]:
        """Get user profile"""
        return self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

    def update_user_profile(
        self,
        user_id: int,
        profile_data: UserProfileUpdate
    ) -> Optional[UserProfile]:
        """Update user profile"""
        profile = self.get_user_profile(user_id)
        if not profile:
            # Create profile if it doesn't exist
            profile = UserProfile(user_id=user_id)
            self.db.add(profile)

        update_data = profile_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(profile, field, value)

        self.db.commit()
        self.db.refresh(profile)
        return profile

    def update_avatar(self, user_id: int, avatar_url: str) -> Optional[UserProfile]:
        """Update user avatar"""
        profile = self.get_user_profile(user_id)
        if not profile:
            return None

        profile.avatar_url = avatar_url
        self.db.commit()
        self.db.refresh(profile)
        return profile

    # ==========================================
    # Settings Methods
    # ==========================================

    def get_user_settings(self, user_id: int) -> Optional[UserSettings]:
        """Get user settings"""
        return self.db.query(UserSettings).filter(UserSettings.user_id == user_id).first()

    def update_user_settings(
        self,
        user_id: int,
        settings_data: UserSettingsUpdate
    ) -> Optional[UserSettings]:
        """Update user settings"""
        settings = self.get_user_settings(user_id)
        if not settings:
            # Create settings if they don't exist
            settings = UserSettings(user_id=user_id)
            self.db.add(settings)

        update_data = settings_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(settings, field, value)

        self.db.commit()
        self.db.refresh(settings)
        return settings

    # ==========================================
    # Follow Methods
    # ==========================================

    def follow_user(self, follower_id: int, following_id: int) -> bool:
        """Follow a user"""
        if follower_id == following_id:
            raise ValueError("Cannot follow yourself")

        # Check if already following
        existing = self.db.query(UserFollow).filter(
            and_(
                UserFollow.follower_id == follower_id,
                UserFollow.following_id == following_id
            )
        ).first()

        if existing:
            if existing.status == "blocked":
                existing.status = "active"
                self.db.commit()
            return True

        # Create follow relationship
        follow = UserFollow(
            follower_id=follower_id,
            following_id=following_id,
            status="active"
        )
        self.db.add(follow)

        # Update follower counts
        self._update_follower_counts(follower_id, following_id)

        self.db.commit()
        return True

    def unfollow_user(self, follower_id: int, following_id: int) -> bool:
        """Unfollow a user"""
        follow = self.db.query(UserFollow).filter(
            and_(
                UserFollow.follower_id == follower_id,
                UserFollow.following_id == following_id
            )
        ).first()

        if not follow:
            return False

        self.db.delete(follow)

        # Update follower counts
        self._update_follower_counts(follower_id, following_id)

        self.db.commit()
        return True

    def get_followers(self, user_id: int, skip: int = 0, limit: int = 100) -> List[User]:
        """Get list of followers"""
        follows = self.db.query(UserFollow).filter(
            UserFollow.following_id == user_id
        ).offset(skip).limit(limit).all()

        follower_ids = [f.follower_id for f in follows]
        return self.db.query(User).filter(User.id.in_(follower_ids)).all()

    def get_following(self, user_id: int, skip: int = 0, limit: int = 100) -> List[User]:
        """Get list of users that the user is following"""
        follows = self.db.query(UserFollow).filter(
            UserFollow.follower_id == user_id
        ).offset(skip).limit(limit).all()

        following_ids = [f.following_id for f in follows]
        return self.db.query(User).filter(User.id.in_(following_ids)).all()

    def is_following(self, follower_id: int, following_id: int) -> bool:
        """Check if user is following another user"""
        follow = self.db.query(UserFollow).filter(
            and_(
                UserFollow.follower_id == follower_id,
                UserFollow.following_id == following_id,
                UserFollow.status == "active"
            )
        ).first()
        return follow is not None

    def _update_follower_counts(self, follower_id: int, following_id: int):
        """Update follower/following counts"""
        # Update following count for follower
        following_count = self.db.query(UserFollow).filter(
            UserFollow.follower_id == follower_id,
            UserFollow.status == "active"
        ).count()

        follower_profile = self.db.query(UserProfile).filter(
            UserProfile.user_id == follower_id
        ).first()
        if follower_profile:
            follower_profile.following_count = following_count

        # Update followers count for following
        followers_count = self.db.query(UserFollow).filter(
            UserFollow.following_id == following_id,
            UserFollow.status == "active"
        ).count()

        following_profile = self.db.query(UserProfile).filter(
            UserProfile.user_id == following_id
        ).first()
        if following_profile:
            following_profile.followers_count = followers_count

    # ==========================================
    # Search Methods
    # ==========================================

    def search_users(
        self,
        query: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[User]:
        """Search users by username or email"""
        return self.db.query(User).filter(
            or_(
                User.username.ilike(f"%{query}%"),
                User.email.ilike(f"%{query}%")
            )
        ).offset(skip).limit(limit).all()

    # ==========================================
    # Statistics Methods
    # ==========================================

    def get_user_statistics(self, user_id: int) -> Dict[str, Any]:
        """Get user statistics"""
        from app.models.post import Post
        from app.models.comment import Comment

        user = self.get_user(user_id)
        if not user:
            return {}

        profile = self.get_user_profile(user_id)

        # Count posts
        posts_count = self.db.query(Post).filter(
            Post.author_id == user_id,
            Post.status == "publish"
        ).count()

        # Count comments
        comments_count = self.db.query(Comment).filter(
            Comment.author_id == user_id,
            Comment.status == "approved"
        ).count()

        return {
            "user_id": user_id,
            "username": user.username,
            "followers_count": profile.followers_count if profile else 0,
            "following_count": profile.following_count if profile else 0,
            "posts_count": posts_count,
            "comments_count": comments_count,
            "role": user.role,
            "status": user.status,
            "created_at": user.created_at
        }

    # ==========================================
    # Admin Methods
    # ==========================================

    def ban_user(self, user_id: int) -> bool:
        """Ban a user"""
        user = self.get_user(user_id)
        if not user:
            return False

        user.status = "suspended"
        self.db.commit()
        return True

    def unban_user(self, user_id: int) -> bool:
        """Unban a user"""
        user = self.get_user(user_id)
        if not user:
            return False

        user.status = "active"
        self.db.commit()
        return True

    def update_user_role(self, user_id: int, role: str) -> bool:
        """Update user role"""
        user = self.get_user(user_id)
        if not user:
            return False

        if role not in ["admin", "editor", "author", "subscriber"]:
            raise ValueError("Invalid role")

        user.role = role
        self.db.commit()
        return True
