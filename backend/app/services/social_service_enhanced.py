"""
Enhanced Social Service
提供完整的社交功能服务
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc, exists
from fastapi import HTTPException, status

from app.models.user import User
from app.models.post import Post
from app.models.follow import Follow
from app.models.notification import Notification
from app.schemas.social import FollowCreate, FollowResponse
from app.core.config import settings


class SocialService:
    """增强的社交服务"""

    def __init__(self, db: AsyncSession):
        self.db = db

    # ==================== 关注功能 ====================

    async def follow_user(
        self,
        follower_id: int,
        following_id: int
    ) -> FollowResponse:
        """关注用户"""
        if follower_id == following_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot follow yourself"
            )

        # 检查被关注用户是否存在
        following_user = await self.db.get(User, following_id)
        if not following_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # 检查是否已经关注
        existing_follow = await self.db.execute(
            select(Follow).where(
                and_(
                    Follow.follower_id == follower_id,
                    Follow.following_id == following_id
                )
            )
        )
        if existing_follow.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already following this user"
            )

        # 创建关注关系
        db_follow = Follow(
            follower_id=follower_id,
            following_id=following_id
        )

        self.db.add(db_follow)

        # 更新用户的关注数和粉丝数
        follower = await self.db.get(User, follower_id)
        following = await self.db.get(User, following_id)

        follower.following_count += 1
        following.followers_count += 1

        await self.db.commit()
        await self.db.refresh(db_follow)

        # 创建通知
        await self._create_notification(
            user_id=following_id,
            type="follow",
            actor_id=follower_id,
            content=f"{follower.username} started following you"
        )

        return FollowResponse.from_orm(db_follow)

    async def unfollow_user(
        self,
        follower_id: int,
        following_id: int
    ) -> bool:
        """取消关注"""
        # 查找关注关系
        result = await self.db.execute(
            select(Follow).where(
                and_(
                    Follow.follower_id == follower_id,
                    Follow.following_id == following_id
                )
            )
        )
        follow = result.scalar_one_or_none()

        if not follow:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Follow relationship not found"
            )

        # 删除关注关系
        await self.db.delete(follow)

        # 更新用户的关注数和粉丝数
        follower = await self.db.get(User, follower_id)
        following = await self.db.get(User, following_id)

        follower.following_count -= 1
        following.followers_count -= 1

        await self.db.commit()

        return True

    async def is_following(
        self,
        follower_id: int,
        following_id: int
    ) -> bool:
        """检查是否关注"""
        result = await self.db.execute(
            select(Follow).where(
                and_(
                    Follow.follower_id == follower_id,
                    Follow.following_id == following_id
                )
            )
        )
        return result.scalar_one_or_none() is not None

    async def get_followers(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[User], int]:
        """获取粉丝列表"""
        # 查询关注关系
        query = select(Follow).where(Follow.following_id == user_id)

        # 统计总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 分页
        query = query.offset(skip).limit(limit)
        query = query.order_by(desc(Follow.created_at))

        result = await self.db.execute(query)
        follows = result.scalars().all()

        # 获取用户信息
        followers = []
        for follow in follows:
            user = await self.db.get(User, follow.follower_id)
            if user:
                followers.append(user)

        return followers, total

    async def get_following(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[User], int]:
        """获取关注列表"""
        # 查询关注关系
        query = select(Follow).where(Follow.follower_id == user_id)

        # 统计总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 分页
        query = query.offset(skip).limit(limit)
        query = query.order_by(desc(Follow.created_at))

        result = await self.db.execute(query)
        follows = result.scalars().all()

        # 获取用户信息
        following = []
        for follow in follows:
            user = await self.db.get(User, follow.following_id)
            if user:
                following.append(user)

        return following, total

    async def get_suggested_users(
        self,
        user_id: int,
        limit: int = 10
    ) -> List[User]:
        """获取推荐用户"""
        # 获取用户关注的人
        result = await self.db.execute(
            select(Follow.following_id).where(Follow.follower_id == user_id)
        )
        following_ids = [row[0] for row in result.all()]

        # 排除自己和已关注的人
        exclude_ids = [user_id] + following_ids

        # 推荐活跃用户（根据文章数量）
        result = await self.db.execute(
            select(User)
            .where(
                and_(
                    User.id.not_in(exclude_ids) if exclude_ids else True,
                    User.is_active == True
                )
            )
            .order_by(desc(User.followers_count))
            .limit(limit)
        )

        return list(result.scalars().all())

    # ==================== 通知功能 ====================

    async def get_notifications(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 20,
        unread_only: bool = False
    ) -> tuple[List[Notification], int]:
        """获取通知列表"""
        query = select(Notification).where(Notification.user_id == user_id)

        if unread_only:
            query = query.where(Notification.is_read == False)

        # 统计总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 分页和排序
        query = query.order_by(desc(Notification.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        notifications = result.scalars().all()

        return list(notifications), total

    async def get_unread_count(self, user_id: int) -> int:
        """获取未读通知数量"""
        result = await self.db.execute(
            select(func.count(Notification.id))
            .where(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read == False
                )
            )
        )
        return result.scalar() or 0

    async def mark_notification_read(
        self,
        notification_id: int,
        user_id: int
    ) -> bool:
        """标记通知为已读"""
        notification = await self.db.execute(
            select(Notification).where(
                and_(
                    Notification.id == notification_id,
                    Notification.user_id == user_id
                )
            )
        )
        notification = notification.scalar_one_or_none()

        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )

        notification.is_read = True
        notification.read_at = datetime.utcnow()

        await self.db.commit()
        return True

    async def mark_all_notifications_read(self, user_id: int) -> int:
        """标记所有通知为已读"""
        result = await self.db.execute(
            select(Notification).where(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read == False
                )
            )
        )
        notifications = result.scalars().all()

        for notification in notifications:
            notification.is_read = True
            notification.read_at = datetime.utcnow()

        await self.db.commit()
        return len(notifications)

    async def delete_notification(
        self,
        notification_id: int,
        user_id: int
    ) -> bool:
        """删除通知"""
        notification = await self.db.execute(
            select(Notification).where(
                and_(
                    Notification.id == notification_id,
                    Notification.user_id == user_id
                )
            )
        )
        notification = notification.scalar_one_or_none()

        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Notification not found"
            )

        await self.db.delete(notification)
        await self.db.commit()

        return True

    async def clear_all_notifications(self, user_id: int) -> int:
        """清空所有通知"""
        result = await self.db.execute(
            select(Notification).where(Notification.user_id == user_id)
        )
        notifications = result.scalars().all()

        count = len(notifications)
        for notification in notifications:
            await self.db.delete(notification)

        await self.db.commit()
        return count

    async def _create_notification(
        self,
        user_id: int,
        type: str,
        actor_id: int,
        content: str,
        post_id: Optional[int] = None,
        link: Optional[str] = None
    ) -> Notification:
        """创建通知"""
        notification = Notification(
            user_id=user_id,
            type=type,
            actor_id=actor_id,
            content=content,
            post_id=post_id,
            link=link,
            is_read=False
        )

        self.db.add(notification)
        await self.db.commit()
        await self.db.refresh(notification)

        return notification

    # ==================== Feed功能 ====================

    async def get_feed(
        self,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Post], int]:
        """获取用户Feed（关注用户的文章）"""
        # 获取关注的人
        result = await self.db.execute(
            select(Follow.following_id).where(Follow.follower_id == user_id)
        )
        following_ids = [row[0] for row in result.all()]

        if not following_ids:
            return [], 0

        # 获取关注用户的文章
        query = select(Post).where(
            and_(
                Post.author_id.in_(following_ids),
                Post.status == "published",
                Post.deleted_at.is_(None)
            )
        )

        # 统计总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 分页和排序
        query = query.order_by(desc(Post.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        posts = result.scalars().all()

        return list(posts), total

    async def get_explore_feed(
        self,
        skip: int = 0,
        limit: int = 20
    ) -> tuple[List[Post], int]:
        """获取探索Feed（推荐文章）"""
        # 获取最近的热门文章
        since_date = datetime.utcnow() - timedelta(days=7)

        query = select(Post).where(
            and_(
                Post.status == "published",
                Post.deleted_at.is_(None),
                Post.created_at >= since_date
            )
        )

        # 统计总数
        count_query = select(func.count()).select_from(query.subquery())
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # 按浏览量和创建时间排序
        query = query.order_by(desc(Post.view_count), desc(Post.created_at))
        query = query.offset(skip).limit(limit)

        result = await self.db.execute(query)
        posts = result.scalars().all()

        return list(posts), total

    # ==================== 活动功能 ====================

    async def get_user_activity(
        self,
        user_id: int,
        activity_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 20
    ) -> List[Dict[str, Any]]:
        """获取用户活动"""
        # TODO: 实现活动记录功能
        # 这里需要根据实际需求实现不同的活动类型
        activities = []

        return activities

    # ==================== 统计功能 ====================

    async def get_social_stats(self, user_id: int) -> Dict[str, Any]:
        """获取社交统计"""
        user = await self.db.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # 获取未读通知数量
        unread_count = await self.get_unread_count(user_id)

        # 获取最近的活动
        # TODO: 实现活动统计

        return {
            "followers_count": user.followers_count,
            "following_count": user.following_count,
            "unread_notifications_count": unread_count,
            "post_count": len(user.posts) if user.posts else 0
        }
