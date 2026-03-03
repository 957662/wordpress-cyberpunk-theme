"""
Follow Service
关注服务
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from app.models.follow import Follow, FollowerStat
from app.models.user import User
from app.schemas.follow import FollowResponse, FollowersListResponse, FollowingListResponse


class FollowService:
    """关注服务类"""

    @staticmethod
    async def follow_user(db: Session, follower_id: int, following_id: int) -> FollowResponse:
        """
        关注用户

        Args:
            db: 数据库会话
            follower_id: 关注者ID
            following_id: 被关注者ID

        Returns:
            FollowResponse: 关注结果
        """
        # 检查是否尝试关注自己
        if follower_id == following_id:
            raise ValueError("不能关注自己")

        # 检查用户是否存在
        following_user = db.query(User).filter(User.id == following_id).first()
        if not following_user:
            raise ValueError("用户不存在")

        # 检查是否已经关注
        existing_follow = db.query(Follow).filter(
            and_(
                Follow.follower_id == follower_id,
                Follow.following_id == following_id
            )
        ).first()

        if existing_follow:
            raise ValueError("已经关注过该用户")

        # 创建关注关系
        follow = Follow(
            follower_id=follower_id,
            following_id=following_id
        )
        db.add(follow)

        # 更新统计
        FollowService._update_follow_stats(db, follower_id, following_id)

        db.commit()
        db.refresh(follow)

        return FollowResponse(
            id=follow.id,
            follower_id=follow.follower_id,
            following_id=follow.following_id,
            followed_at=follow.followed_at,
            follower_username=None,
            following_username=None
        )

    @staticmethod
    async def unfollow_user(db: Session, follower_id: int, following_id: int) -> bool:
        """
        取消关注用户

        Args:
            db: 数据库会话
            follower_id: 关注者ID
            following_id: 被关注者ID

        Returns:
            bool: 是否成功取消关注
        """
        # 查找关注关系
        follow = db.query(Follow).filter(
            and_(
                Follow.follower_id == follower_id,
                Follow.following_id == following_id
            )
        ).first()

        if not follow:
            raise ValueError("未关注该用户")

        # 删除关注关系
        db.delete(follow)

        # 更新统计
        FollowService._update_follow_stats(db, follower_id, following_id, increment=False)

        db.commit()
        return True

    @staticmethod
    async def is_following(db: Session, follower_id: int, following_id: int) -> bool:
        """
        检查是否已关注

        Args:
            db: 数据库会话
            follower_id: 关注者ID
            following_id: 被关注者ID

        Returns:
            bool: 是否已关注
        """
        follow = db.query(Follow).filter(
            and_(
                Follow.follower_id == follower_id,
                Follow.following_id == following_id
            )
        ).first()

        return follow is not None

    @staticmethod
    async def get_followers(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> FollowersListResponse:
        """
        获取粉丝列表

        Args:
            db: 数据库会话
            user_id: 用户ID
            skip: 跳过数量
            limit: 限制数量

        Returns:
            FollowersListResponse: 粉丝列表
        """
        # 查询粉丝
        query = db.query(
            Follow,
            User
        ).join(
            User,
            Follow.follower_id == User.id
        ).filter(
            Follow.following_id == user_id
        ).order_by(
            desc(Follow.followed_at)
        )

        total = query.count()
        follows = query.offset(skip).limit(limit).all()

        followers = []
        for follow, user in follows:
            followers.append({
                "id": follow.id,
                "user_id": user.id,
                "username": user.username,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,
                "bio": user.bio,
                "followed_at": follow.followed_at
            })

        return FollowersListResponse(
            followers=followers,
            total=total,
            page=skip // limit + 1,
            page_size=limit
        )

    @staticmethod
    async def get_following(
        db: Session,
        user_id: int,
        skip: int = 0,
        limit: int = 20
    ) -> FollowingListResponse:
        """
        获取关注列表

        Args:
            db: 数据库会话
            user_id: 用户ID
            skip: 跳过数量
            limit: 限制数量

        Returns:
            FollowingListResponse: 关注列表
        """
        # 查询关注
        query = db.query(
            Follow,
            User
        ).join(
            User,
            Follow.following_id == User.id
        ).filter(
            Follow.follower_id == user_id
        ).order_by(
            desc(Follow.followed_at)
        )

        total = query.count()
        follows = query.offset(skip).limit(limit).all()

        following = []
        for follow, user in follows:
            following.append({
                "id": follow.id,
                "user_id": user.id,
                "username": user.username,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,
                "bio": user.bio,
                "followed_at": follow.followed_at
            })

        return FollowingListResponse(
            following=following,
            total=total,
            page=skip // limit + 1,
            page_size=limit
        )

    @staticmethod
    async def get_follow_stats(db: Session, user_id: int) -> dict:
        """
        获取关注统计

        Args:
            db: 数据库会话
            user_id: 用户ID

        Returns:
            dict: 关注统计信息
        """
        # 从统计表获取
        stat = db.query(FollowerStat).filter(
            FollowerStat.user_id == user_id
        ).first()

        if stat:
            return {
                "followers_count": stat.followers_count,
                "following_count": stat.following_count
            }

        # 如果没有统计记录，实时计算
        followers_count = db.query(Follow).filter(
            Follow.following_id == user_id
        ).count()

        following_count = db.query(Follow).filter(
            Follow.follower_id == user_id
        ).count()

        # 创建统计记录
        stat = FollowerStat(
            user_id=user_id,
            followers_count=followers_count,
            following_count=following_count
        )
        db.add(stat)
        db.commit()

        return {
            "followers_count": followers_count,
            "following_count": following_count
        }

    @staticmethod
    def _update_follow_stats(
        db: Session,
        follower_id: int,
        following_id: int,
        increment: bool = True
    ):
        """
        更新关注统计（内部方法）

        Args:
            db: 数据库会话
            follower_id: 关注者ID
            following_id: 被关注者ID
            increment: 是否增加（False为减少）
        """
        delta = 1 if increment else -1

        # 更新关注者的关注数
        follower_stat = db.query(FollowerStat).filter(
            FollowerStat.user_id == follower_id
        ).first()

        if follower_stat:
            follower_stat.following_count += delta
        else:
            follower_stat = FollowerStat(
                user_id=follower_id,
                followers_count=0,
                following_count=1 if increment else 0
            )
            db.add(follower_stat)

        # 更新被关注者的粉丝数
        following_stat = db.query(FollowerStat).filter(
            FollowerStat.user_id == following_id
        ).first()

        if following_stat:
            following_stat.followers_count += delta
        else:
            following_stat = FollowerStat(
                user_id=following_id,
                followers_count=1 if increment else 0,
                following_count=0
            )
            db.add(following_stat)
