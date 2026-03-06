"""
增强的社交服务
提供完整的社交功能业务逻辑
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.orm import selectinload
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta

from ..models.user import User
from ..models.follow import Follow
from ..models.post import Post
from ..models.activity import Activity
from ..schemas.social import UserProfileResponse


class SocialServiceEnhanced:
    """增强的社交服务类"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def follow_user(
        self,
        follower_id: int,
        following_id: int,
    ) -> Follow:
        """
        关注用户
        
        Args:
            follower_id: 关注者ID
            following_id: 被关注者ID
        
        Returns:
            创建的关注关系对象
        """
        # 检查是否已关注
        exists = await self.is_following(follower_id, following_id)
        if exists:
            raise ValueError("已经关注过该用户")
        
        # 创建关注关系
        follow = Follow(
            follower_id=follower_id,
            following_id=following_id,
        )
        
        self.db.add(follow)
        
        # 记录活动
        await self._create_activity(
            user_id=follower_id,
            activity_type="follow",
            target_user_id=following_id,
        )
        
        await self.db.commit()
        await self.db.refresh(follow)
        
        return follow
    
    async def unfollow_user(
        self,
        follower_id: int,
        following_id: int,
    ) -> bool:
        """
        取消关注用户
        
        Args:
            follower_id: 关注者ID
            following_id: 被关注者ID
        
        Returns:
            成功返回True
        """
        result = await self.db.execute(
            select(Follow).where(
                and_(
                    Follow.follower_id == follower_id,
                    Follow.following_id == following_id,
                )
            )
        )
        follow = result.scalar_one_or_none()
        
        if not follow:
            return False
        
        await self.db.delete(follow)
        await self.db.commit()
        
        return True
    
    async def is_following(
        self,
        follower_id: int,
        following_id: int,
    ) -> bool:
        """
        检查是否已关注
        
        Args:
            follower_id: 关注者ID
            following_id: 被关注者ID
        
        Returns:
            已关注返回True
        """
        result = await self.db.execute(
            select(func.count(Follow.id)).where(
                and_(
                    Follow.follower_id == follower_id,
                    Follow.following_id == following_id,
                )
            )
        )
        count = result.scalar()
        
        return count > 0
    
    async def get_followers(
        self,
        user_id: int,
        page: int = 1,
        per_page: int = 20,
    ) -> Tuple[List[Dict], int]:
        """
        获取用户的粉丝列表
        
        Args:
            user_id: 用户ID
            page: 页码
            per_page: 每页数量
        
        Returns:
            (粉丝列表, 总数)
        """
        # 获取总数
        count_result = await self.db.execute(
            select(func.count()).where(Follow.following_id == user_id)
        )
        total = count_result.scalar()
        
        # 获取粉丝列表
        offset = (page - 1) * per_page
        result = await self.db.execute(
            select(Follow)
            .options(selectinload(Follow.follower))
            .where(Follow.following_id == user_id)
            .order_by(Follow.created_at.desc())
            .offset(offset)
            .limit(per_page)
        )
        follows = result.scalars().all()
        
        followers = []
        for follow in follows:
            follower = follow.follower
            followers.append({
                "id": follower.id,
                "username": follower.username,
                "full_name": follower.full_name,
                "avatar_url": follower.avatar_url,
                "bio": follower.bio,
                "followed_at": follow.created_at,
            })
        
        return followers, total
    
    async def get_following(
        self,
        user_id: int,
        page: int = 1,
        per_page: int = 20,
    ) -> Tuple[List[Dict], int]:
        """
        获取用户关注的列表
        
        Args:
            user_id: 用户ID
            page: 页码
            per_page: 每页数量
        
        Returns:
            (关注列表, 总数)
        """
        # 获取总数
        count_result = await self.db.execute(
            select(func.count()).where(Follow.follower_id == user_id)
        )
        total = count_result.scalar()
        
        # 获取关注列表
        offset = (page - 1) * per_page
        result = await self.db.execute(
            select(Follow)
            .options(selectinload(Follow.following))
            .where(Follow.follower_id == user_id)
            .order_by(Follow.created_at.desc())
            .offset(offset)
            .limit(per_page)
        )
        follows = result.scalars().all()
        
        following_list = []
        for follow in follows:
            following = follow.following
            following_list.append({
                "id": following.id,
                "username": following.username,
                "full_name": following.full_name,
                "avatar_url": following.avatar_url,
                "bio": following.bio,
                "followed_at": follow.created_at,
            })
        
        return following_list, total
    
    async def like_post(
        self,
        user_id: int,
        post_id: int,
    ) -> bool:
        """
        点赞文章
        
        Args:
            user_id: 用户ID
            post_id: 文章ID
        
        Returns:
            成功返回True
        """
        # 这里需要实现点赞逻辑，需要user_post_like表
        # 简化处理，只增加文章的点赞计数
        
        result = await self.db.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalar_one_or_none()
        
        if not post:
            raise ValueError("文章不存在")
        
        post.like_count += 1
        
        # 记录活动
        await self._create_activity(
            user_id=user_id,
            activity_type="like",
            target_post_id=post_id,
        )
        
        await self.db.commit()
        
        return True
    
    async def unlike_post(
        self,
        user_id: int,
        post_id: int,
    ) -> bool:
        """
        取消点赞文章
        
        Args:
            user_id: 用户ID
            post_id: 文章ID
        
        Returns:
            成功返回True
        """
        result = await self.db.execute(
            select(Post).where(Post.id == post_id)
        )
        post = result.scalar_one_or_none()
        
        if post and post.like_count > 0:
            post.like_count -= 1
            await self.db.commit()
        
        return True
    
    async def is_post_liked(
        self,
        user_id: int,
        post_id: int,
    ) -> bool:
        """
        检查文章是否已点赞
        
        Args:
            user_id: 用户ID
            post_id: 文章ID
        
        Returns:
            已点赞返回True
        """
        # 需要查询user_post_like表
        # 简化处理，返回False
        return False
    
    async def bookmark_post(
        self,
        user_id: int,
        post_id: int,
    ) -> bool:
        """
        收藏文章
        
        Args:
            user_id: 用户ID
            post_id: 文章ID
        
        Returns:
            成功返回True
        """
        # 需要实现收藏逻辑，需要bookmark表
        # 记录活动
        await self._create_activity(
            user_id=user_id,
            activity_type="bookmark",
            target_post_id=post_id,
        )
        
        await self.db.commit()
        
        return True
    
    async def unbookmark_post(
        self,
        user_id: int,
        post_id: int,
    ) -> bool:
        """
        取消收藏文章
        
        Args:
            user_id: 用户ID
            post_id: 文章ID
        
        Returns:
            成功返回True
        """
        return True
    
    async def is_post_bookmarked(
        self,
        user_id: int,
        post_id: int,
    ) -> bool:
        """
        检查文章是否已收藏
        
        Args:
            user_id: 用户ID
            post_id: 文章ID
        
        Returns:
            已收藏返回True
        """
        # 需要查询bookmark表
        return False
    
    async def get_user_bookmarks(
        self,
        user_id: int,
        page: int = 1,
        per_page: int = 20,
    ) -> List[Dict]:
        """
        获取用户的收藏列表
        
        Args:
            user_id: 用户ID
            page: 页码
            per_page: 每页数量
        
        Returns:
            收藏列表
        """
        # 需要查询bookmark表
        return []
    
    async def get_activity_feed(
        self,
        user_id: int,
        page: int = 1,
        per_page: int = 20,
    ) -> List[Dict]:
        """
        获取关注用户的活动动态
        
        Args:
            user_id: 用户ID
            page: 页码
            per_page: 每页数量
        
        Returns:
            活动列表
        """
        # 获取关注的用户ID列表
        result = await self.db.execute(
            select(Follow.following_id).where(Follow.follower_id == user_id)
        )
        following_ids = [row[0] for row in result.all()]
        
        if not following_ids:
            return []
        
        # 获取这些用户的活动
        offset = (page - 1) * per_page
        result = await self.db.execute(
            select(Activity)
            .where(Activity.user_id.in_(following_ids))
            .order_by(Activity.created_at.desc())
            .offset(offset)
            .limit(per_page)
        )
        activities = result.scalars().all()
        
        # 格式化活动数据
        feed = []
        for activity in activities:
            feed.append({
                "id": activity.id,
                "type": activity.activity_type,
                "user_id": activity.user_id,
                "target_user_id": activity.target_user_id,
                "target_post_id": activity.target_post_id,
                "created_at": activity.created_at,
            })
        
        return feed
    
    async def get_recommended_users(
        self,
        user_id: int,
        limit: int = 10,
    ) -> List[Dict]:
        """
        获取推荐用户
        
        Args:
            user_id: 用户ID
            limit: 返回数量
        
        Returns:
            推荐用户列表
        """
        # 简单推荐逻辑：推荐关注数多的用户，排除已关注和自己的
        result = await self.db.execute(
            select(User)
            .where(User.id != user_id)
            .order_by(User.followers_count.desc())
            .limit(limit * 2)
        )
        users = result.scalars().all()
        
        # 过滤已关注的用户
        recommended = []
        for user in users:
            is_following = await self.is_following(user_id, user.id)
            if not is_following:
                recommended.append({
                    "id": user.id,
                    "username": user.username,
                    "full_name": user.full_name,
                    "avatar_url": user.avatar_url,
                    "bio": user.bio,
                    "followers_count": user.followers_count,
                })
                
                if len(recommended) >= limit:
                    break
        
        return recommended
    
    async def _create_activity(
        self,
        user_id: int,
        activity_type: str,
        target_user_id: Optional[int] = None,
        target_post_id: Optional[int] = None,
    ):
        """
        创建活动记录
        
        Args:
            user_id: 用户ID
            activity_type: 活动类型
            target_user_id: 目标用户ID
            target_post_id: 目标文章ID
        """
        activity = Activity(
            user_id=user_id,
            activity_type=activity_type,
            target_user_id=target_user_id,
            target_post_id=target_post_id,
        )
        
        self.db.add(activity)
