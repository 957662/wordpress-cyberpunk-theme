"""
Enhanced User Model
增强的用户模型 - 包含完整的用户信息和关系
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from datetime import datetime
import enum

from app.models.base import Base


# 用户角色枚举
class UserRole(str, enum.Enum):
    ADMIN = "admin"
    EDITOR = "editor"
    AUTHOR = "author"
    USER = "user"


# 用户状态枚举
class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING = "pending"


# 多对多关系表：用户关注
user_follows = Table(
    'user_follows',
    Base.metadata,
    Column('follower_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('following_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('created_at', DateTime, default=datetime.utcnow),
)


class User(Base):
    """用户模型"""
    __tablename__ = "users"

    # 基础信息
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    # 用户资料
    full_name = Column(String(100))
    avatar = Column(String(255))
    bio = Column(Text)
    website = Column(String(255))
    location = Column(String(100))
    
    # 社交媒体链接
    twitter_url = Column(String(255))
    github_url = Column(String(255))
    linkedin_url = Column(String(255))
    
    # 用户状态
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    status = Column(Enum(UserStatus), default=UserStatus.PENDING, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # 统计信息
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    posts_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    
    # 偏好设置
    preferences = Column(Text)  # JSON格式存储用户偏好
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime)
    deleted_at = Column(DateTime)  # 软删除
    
    # 邮箱验证
    verification_token = Column(String(255))
    verified_at = Column(DateTime)
    password_reset_token = Column(String(255))
    password_reset_expires = Column(DateTime)
    
    # 关系
    posts = relationship("Post", back_populates="author", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="author", cascade="all, delete-orphan")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    
    # 关注关系
    followers = relationship(
        "User",
        secondary=user_follows,
        primaryjoin=(user_follows.c.following_id == id),
        secondaryjoin=(user_follows.c.follower_id == id),
        backref="following"
    )
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"
    
    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "avatar": self.avatar,
            "bio": self.bio,
            "website": self.website,
            "location": self.location,
            "role": self.role.value if self.role else None,
            "status": self.status.value if self.status else None,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "followers_count": self.followers_count,
            "following_count": self.following_count,
            "posts_count": self.posts_count,
            "comments_count": self.comments_count,
            "likes_count": self.likes_count,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
        }
    
    def is_admin(self) -> bool:
        """是否是管理员"""
        return self.role == UserRole.ADMIN
    
    def is_editor(self) -> bool:
        """是否是编辑"""
        return self.role in [UserRole.ADMIN, UserRole.EDITOR]
    
    def is_author(self) -> bool:
        """是否是作者"""
        return self.role in [UserRole.ADMIN, UserRole.EDITOR, UserRole.AUTHOR]
    
    def can_edit_post(self, post_author_id: int) -> bool:
        """是否可以编辑文章"""
        return self.is_admin() or self.is_editor() or self.id == post_author_id
    
    def can_delete_post(self, post_author_id: int) -> bool:
        """是否可以删除文章"""
        return self.is_admin() or self.id == post_author_id
    
    def update_stats(self, db):
        """更新用户统计信息"""
        from sqlalchemy import func
        
        # 更新文章数
        self.posts_count = db.query(func.count(Post.id)).filter(
            Post.author_id == self.id,
            Post.deleted_at.is_(None)
        ).scalar()
        
        # 更新评论数
        self.comments_count = db.query(func.count(Comment.id)).filter(
            Comment.author_id == self.id,
            Comment.deleted_at.is_(None)
        ).scalar()
        
        # 更新点赞数
        self.likes_count = db.query(func.count(Like.id)).filter(
            Like.user_id == self.id
        ).scalar()
        
        # 更新关注数
        self.followers_count = len(self.followers)
        self.following_count = len(self.following)
        
        db.commit()


class UserProfile(Base):
    """用户详细资料（扩展信息）"""
    __tablename__ = "user_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True, nullable=False)
    
    # 个人信息
    birth_date = Column(DateTime)
    gender = Column(String(10))
    phone = Column(String(20))
    address = Column(String(255))
    city = Column(String(100))
    country = Column(String(100))
    
    # 职业信息
    occupation = Column(String(100))
    company = Column(String(100))
    company_website = Column(String(255))
    
    # 兴趣爱好
    interests = Column(Text)  # JSON数组
    skills = Column(Text)  # JSON数组
    
    # 社交统计
    twitter_followers = Column(Integer, default=0)
    github_repositories = Column(Integer, default=0)
    linkedin_connections = Column(Integer, default=0)
    
    # 其他
    timezone = Column(String(50))
    language = Column(String(10), default="zh")
    currency = Column(String(10), default="CNY")
    
    # 时间戳
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    user = relationship("User", back_populates="profile")
    
    def to_dict(self):
        """转换为字典"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "birth_date": self.birth_date.isoformat() if self.birth_date else None,
            "gender": self.gender,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "country": self.country,
            "occupation": self.occupation,
            "company": self.company,
            "company_website": self.company_website,
            "interests": self.interests,
            "skills": self.skills,
            "twitter_followers": self.twitter_followers,
            "github_repositories": self.github_repositories,
            "linkedin_connections": self.linkedin_connections,
            "timezone": self.timezone,
            "language": self.language,
            "currency": self.currency,
        }


# 在User模型中添加profile关系
User.profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
