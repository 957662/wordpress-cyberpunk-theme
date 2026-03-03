"""
Social Service
Business logic for social features
"""

from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from datetime import datetime, timedelta

from app.models.social import Follow, Like, Bookmark, BookmarkFolder, Notification, NotificationPreference, Activity
from app.models.user import User
from app.schemas.social import (
    FollowCreate, FollowStats, FollowUser, FollowListResponse,
    LikeCreate, LikeResponse, LikeStats,
    BookmarkCreate, BookmarkFolderCreate, BookmarkFolderUpdate,
    BookmarkResponse, BookmarkItem, BookmarksListResponse, BookmarkFolderResponse,
    NotificationCreate, NotificationListResponse, NotificationStats,
    NotificationPreferences, NotificationPreferencesUpdate,
    ActivityFeedResponse
)


class SocialService:
    """Social features service"""

    # ========================================================================
    # Follow Methods
    # ========================================================================

    @staticmethod
    def follow_user(db: Session, follower_id: int, following_id: int) -> Tuple[bool, str]:
        """Follow a user"""
        # Check if trying to follow self
        if follower_id == following_id:
            return False, "Cannot follow yourself"

        # Check if already following
        existing = db.query(Follow).filter(
            and_(
                Follow.follower_id == follower_id,
                Follow.following_id == following_id
            )
        ).first()

        if existing:
            return False, "Already following this user"

        # Create follow relationship
        follow = Follow(
            follower_id=follower_id,
            following_id=following_id
        )
        db.add(follow)

        # Create notification
        SocialService._create_notification(
            db,
            user_id=following_id,
            type="follow",
            title="New follower",
            message=f"User #${follower_id} started following you",
            actor_id=follower_id,
            target_id=following_id,
            target_type="user"
        )

        # Create activity
        SocialService._create_activity(
            db,
            user_id=follower_id,
            type="follow",
            actor_id=follower_id,
            target_id=following_id,
            target_type="user"
        )

        db.commit()
        return True, "Successfully followed user"

    @staticmethod
    def unfollow_user(db: Session, follower_id: int, following_id: int) -> Tuple[bool, str]:
        """Unfollow a user"""
        follow = db.query(Follow).filter(
            and_(
                Follow.follower_id == follower_id,
                Follow.following_id == following_id
            )
        ).first()

        if not follow:
            return False, "Not following this user"

        db.delete(follow)
        db.commit()
        return True, "Successfully unfollowed user"

    @staticmethod
    def get_follow_stats(db: Session, user_id: int, current_user_id: Optional[int] = None) -> FollowStats:
        """Get user follow statistics"""
        followers_count = db.query(func.count(Follow.id)).filter(
            Follow.following_id == user_id
        ).scalar() or 0

        following_count = db.query(func.count(Follow.id)).filter(
            Follow.follower_id == user_id
        ).scalar() or 0

        is_following = False
        if current_user_id and current_user_id != user_id:
            existing = db.query(Follow).filter(
                and_(
                    Follow.follower_id == current_user_id,
                    Follow.following_id == user_id
                )
            ).first()
            is_following = existing is not None

        return FollowStats(
            user_id=user_id,
            followers_count=followers_count,
            following_count=following_count,
            is_following=is_following
        )

    @staticmethod
    def get_followers(db: Session, user_id: int, page: int = 1, page_size: int = 20) -> FollowListResponse:
        """Get user's followers"""
        query = db.query(Follow).filter(Follow.following_id == user_id)
        total = query.count()

        offset = (page - 1) * page_size
        follows = query.order_by(desc(Follow.created_at)).offset(offset).limit(page_size).all()

        items = []
        for follow in follows:
            user = db.query(User).filter(User.id == follow.follower_id).first()
            if user:
                items.append(FollowUser(
                    id=user.id,
                    username=user.username,
                    display_name=user.display_name or user.username,
                    avatar=user.avatar_url,
                    bio=user.bio,
                    verified=False,
                    followers_count=0,  # Can be optimized with joins
                    is_following=False,
                    followed_at=follow.created_at
                ))

        return FollowListResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            has_more=offset + page_size < total
        )

    @staticmethod
    def get_following(db: Session, user_id: int, page: int = 1, page_size: int = 20) -> FollowListResponse:
        """Get users that user is following"""
        query = db.query(Follow).filter(Follow.follower_id == user_id)
        total = query.count()

        offset = (page - 1) * page_size
        follows = query.order_by(desc(Follow.created_at)).offset(offset).limit(page_size).all()

        items = []
        for follow in follows:
            user = db.query(User).filter(User.id == follow.following_id).first()
            if user:
                items.append(FollowUser(
                    id=user.id,
                    username=user.username,
                    display_name=user.display_name or user.username,
                    avatar=user.avatar_url,
                    bio=user.bio,
                    verified=False,
                    followers_count=0,
                    is_following=True,
                    followed_at=follow.created_at
                ))

        return FollowListResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            has_more=offset + page_size < total
        )

    # ========================================================================
    # Like Methods
    # ========================================================================

    @staticmethod
    def like_item(db: Session, user_id: int, target_id: int, target_type: str) -> LikeResponse:
        """Like a post or comment"""
        # Check if already liked
        existing = db.query(Like).filter(
            and_(
                Like.user_id == user_id,
                Like.target_id == target_id,
                Like.target_type == target_type
            )
        ).first()

        if existing:
            # Unlike (toggle off)
            db.delete(existing)
            db.commit()
            likes_count = db.query(func.count(Like.id)).filter(
                and_(
                    Like.target_id == target_id,
                    Like.target_type == target_type
                )
            ).scalar() or 0

            return LikeResponse(
                success=True,
                liked=False,
                likes_count=likes_count,
                message="Removed like"
            )

        # Create like
        like = Like(
            user_id=user_id,
            target_id=target_id,
            target_type=target_type
        )
        db.add(like)

        # Get likes count
        likes_count = db.query(func.count(Like.id)).filter(
            and_(
                Like.target_id == target_id,
                Like.target_type == target_type
            )
        ).scalar() or 1

        # Create notification for post owner
        if target_type == "post":
            # Get post owner
            post = db.query(Post).filter(Post.id == target_id).first()
            if post and post.author_id != user_id:
                SocialService._create_notification(
                    db,
                    user_id=post.author_id,
                    type="like",
                    title="Your post was liked",
                    message=f"Someone liked your post",
                    actor_id=user_id,
                    target_id=target_id,
                    target_type="post"
                )

        db.commit()
        return LikeResponse(
            success=True,
            liked=True,
            likes_count=likes_count,
            message="Added like"
        )

    @staticmethod
    def get_like_stats(db: Session, target_id: int, target_type: str, user_id: Optional[int] = None) -> LikeStats:
        """Get like statistics for a target"""
        likes_count = db.query(func.count(Like.id)).filter(
            and_(
                Like.target_id == target_id,
                Like.target_type == target_type
            )
        ).scalar() or 0

        is_liked = False
        if user_id:
            existing = db.query(Like).filter(
                and_(
                    Like.user_id == user_id,
                    Like.target_id == target_id,
                    Like.target_type == target_type
                )
            ).first()
            is_liked = existing is not None

        return LikeStats(
            likes_count=likes_count,
            is_liked=is_liked
        )

    # ========================================================================
    # Bookmark Methods
    # ========================================================================

    @staticmethod
    def create_bookmark_folder(db: Session, user_id: int, data: BookmarkFolderCreate) -> BookmarkFolder:
        """Create a bookmark folder"""
        folder = BookmarkFolder(
            user_id=user_id,
            name=data.name,
            icon=data.icon,
            color=data.color,
            description=data.description,
            is_default=False
        )
        db.add(folder)
        db.commit()
        db.refresh(folder)
        return folder

    @staticmethod
    def add_bookmark(db: Session, user_id: int, data: BookmarkCreate) -> BookmarkResponse:
        """Add a bookmark"""
        # Check if already bookmarked
        existing = db.query(Bookmark).filter(
            and_(
                Bookmark.user_id == user_id,
                Bookmark.target_id == data.target_id,
                Bookmark.target_type == data.target_type
            )
        ).first()

        if existing:
            # Remove bookmark (toggle off)
            db.delete(existing)
            db.commit()
            bookmarks_count = db.query(func.count(Bookmark.id)).filter(
                Bookmark.user_id == user_id
            ).scalar() or 0

            return BookmarkResponse(
                success=True,
                bookmarked=False,
                bookmarks_count=bookmarks_count,
                message="Removed bookmark"
            )

        # Create bookmark
        bookmark = Bookmark(
            user_id=user_id,
            target_id=data.target_id,
            target_type=data.target_type,
            folder_id=data.folder_id,
            notes=data.notes
        )
        db.add(bookmark)

        # Get bookmarks count
        bookmarks_count = db.query(func.count(Bookmark.id)).filter(
            Bookmark.user_id == user_id
        ).scalar() or 1

        db.commit()
        return BookmarkResponse(
            success=True,
            bookmarked=True,
            bookmarks_count=bookmarks_count,
            message="Added bookmark"
        )

    # ========================================================================
    # Notification Methods
    # ========================================================================

    @staticmethod
    def _create_notification(
        db: Session,
        user_id: int,
        type: str,
        title: str,
        message: str,
        actor_id: Optional[int] = None,
        target_id: Optional[int] = None,
        target_type: Optional[str] = None,
        data: Optional[dict] = None
    ) -> Notification:
        """Create a notification (internal)"""
        import json

        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            actor_id=actor_id,
            target_id=target_id,
            target_type=target_type,
            data=json.dumps(data) if data else None
        )
        db.add(notification)
        return notification

    @staticmethod
    def get_notifications(
        db: Session,
        user_id: int,
        page: int = 1,
        page_size: int = 20,
        type_filter: Optional[str] = None,
        unread_only: bool = False
    ) -> NotificationListResponse:
        """Get user notifications"""
        query = db.query(Notification).filter(Notification.user_id == user_id)

        if type_filter:
            query = query.filter(Notification.type == type_filter)

        if unread_only:
            query = query.filter(Notification.is_read == False)

        # Don't show muted notifications
        query = query.filter(Notification.is_muted == False)

        total = query.count()
        unread_count = db.query(func.count(Notification.id)).filter(
            and_(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
        ).scalar() or 0

        offset = (page - 1) * page_size
        notifications = query.order_by(desc(Notification.created_at)).offset(offset).limit(page_size).all()

        items = []
        for notification in notifications:
            import json
            data = None
            if notification.data:
                try:
                    data = json.loads(notification.data)
                except:
                    pass

            items.append(Notification(
                id=notification.id,
                user_id=notification.user_id,
                type=notification.type,
                title=notification.title,
                message=notification.message,
                data=data,
                actor_id=notification.actor_id,
                target_id=notification.target_id,
                target_type=notification.target_type,
                is_read=notification.is_read,
                is_muted=notification.is_muted,
                created_at=notification.created_at,
                updated_at=notification.updated_at
            ))

        return NotificationListResponse(
            items=items,
            total=total,
            unread=unread_count,
            page=page,
            page_size=page_size,
            has_more=offset + page_size < total
        )

    @staticmethod
    def mark_notification_read(db: Session, notification_id: int, user_id: int) -> bool:
        """Mark notification as read"""
        notification = db.query(Notification).filter(
            and_(
                Notification.id == notification_id,
                Notification.user_id == user_id
            )
        ).first()

        if not notification:
            return False

        notification.is_read = True
        notification.updated_at = datetime.utcnow()
        db.commit()
        return True

    @staticmethod
    def mark_all_read(db: Session, user_id: int) -> int:
        """Mark all notifications as read"""
        count = db.query(Notification).filter(
            and_(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
        ).update({
            "is_read": True,
            "updated_at": datetime.utcnow()
        })
        db.commit()
        return count

    @staticmethod
    def get_notification_stats(db: Session, user_id: int) -> NotificationStats:
        """Get notification statistics"""
        total = db.query(func.count(Notification.id)).filter(
            Notification.user_id == user_id
        ).scalar() or 0

        unread = db.query(func.count(Notification.id)).filter(
            and_(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
        ).scalar() or 0

        return NotificationStats(
            total=total,
            unread=unread,
            read=total - unread
        )

    # ========================================================================
    # Activity Methods
    # ========================================================================

    @staticmethod
    def _create_activity(
        db: Session,
        user_id: int,
        type: str,
        actor_id: Optional[int] = None,
        target_id: Optional[int] = None,
        target_type: Optional[str] = None,
        metadata: Optional[dict] = None
    ) -> Activity:
        """Create an activity (internal)"""
        import json

        activity = Activity(
            user_id=user_id,
            type=type,
            actor_id=actor_id,
            target_id=target_id,
            target_type=target_type,
            metadata=json.dumps(metadata) if metadata else None
        )
        db.add(activity)
        return activity

    @staticmethod
    def get_activity_feed(
        db: Session,
        user_id: int,
        page: int = 1,
        page_size: int = 20
    ) -> ActivityFeedResponse:
        """Get user activity feed"""
        query = db.query(Activity).filter(Activity.user_id == user_id)
        total = query.count()

        offset = (page - 1) * page_size
        activities = query.order_by(desc(Activity.created_at)).offset(offset).limit(page_size).all()

        items = []
        for activity in activities:
            import json
            metadata = None
            if activity.metadata:
                try:
                    metadata = json.loads(activity.metadata)
                except:
                    pass

            items.append(Activity(
                id=activity.id,
                user_id=activity.user_id,
                type=activity.type,
                actor_id=activity.actor_id,
                target_id=activity.target_id,
                target_type=activity.target_type,
                metadata=metadata,
                created_at=activity.created_at
            ))

        return ActivityFeedResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            has_more=offset + page_size < total
        )
