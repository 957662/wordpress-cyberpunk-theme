"""
活动流服务

管理用户活动动态和通知
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc
from app.models.user import User
from app.models.post import Post
from app.models.interaction import Like, Bookmark, Comment, Follow, View
from app.models.notification import Notification


class ActivityService:
    """活动流服务"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def get_user_activity(
        self,
        user_id: str,
        activity_type: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        获取用户活动流
        
        Args:
            user_id: 用户ID
            activity_type: 活动类型筛选 (like, comment, bookmark, share, follow, view)
            limit: 返回数量
            offset: 偏移量
        
        Returns:
            活动流字典
        """
        # 构建活动查询
        activities = []
        
        # 获取点赞活动
        if not activity_type or activity_type == 'like':
            likes = self.db.query(Like).filter(
                Like.user_id == user_id
            ).order_by(desc(Like.created_at)).limit(limit).all()
            
            for like in likes:
                activities.append({
                    'id': f'like_{like.id}',
                    'type': 'like',
                    'actor': self._get_user_dict(like.user),
                    'target': self._get_post_dict(like.post) if like.post else None,
                    'created_at': like.created_at.isoformat(),
                })
        
        # 获取评论活动
        if not activity_type or activity_type == 'comment':
            comments = self.db.query(Comment).filter(
                Comment.user_id == user_id
            ).order_by(desc(Comment.created_at)).limit(limit).all()
            
            for comment in comments:
                activities.append({
                    'id': f'comment_{comment.id}',
                    'type': 'comment',
                    'actor': self._get_user_dict(comment.user),
                    'target': self._get_post_dict(comment.post) if comment.post else None,
                    'metadata': {
                        'content': comment.content,
                    },
                    'created_at': comment.created_at.isoformat(),
                })
        
        # 获取收藏活动
        if not activity_type or activity_type == 'bookmark':
            bookmarks = self.db.query(Bookmark).filter(
                Bookmark.user_id == user_id
            ).order_by(desc(Bookmark.created_at)).limit(limit).all()
            
            for bookmark in bookmarks:
                activities.append({
                    'id': f'bookmark_{bookmark.id}',
                    'type': 'bookmark',
                    'actor': self._get_user_dict(bookmark.user),
                    'target': self._get_post_dict(bookmark.post) if bookmark.post else None,
                    'created_at': bookmark.created_at.isoformat(),
                })
        
        # 获取关注活动
        if not activity_type or activity_type == 'follow':
            follows = self.db.query(Follow).filter(
                Follow.follower_id == user_id
            ).order_by(desc(Follow.created_at)).limit(limit).all()
            
            for follow in follows:
                activities.append({
                    'id': f'follow_{follow.id}',
                    'type': 'follow',
                    'actor': self._get_user_dict(follow.follower),
                    'target': self._get_user_dict(follow.following) if follow.following else None,
                    'created_at': follow.created_at.isoformat(),
                })
        
        # 排序和分页
        activities.sort(key=lambda x: x['created_at'], reverse=True)
        
        total = len(activities)
        paginated_activities = activities[offset:offset + limit]
        
        return {
            'total': total,
            'activities': paginated_activities,
        }
    
    async def get_notifications(
        self,
        user_id: str,
        notification_type: Optional[str] = None,
        unread_only: bool = False,
        limit: int = 20,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        获取用户通知
        
        Args:
            user_id: 用户ID
            notification_type: 通知类型筛选
            unread_only: 是否只显示未读
            limit: 返回数量
            offset: 偏移量
        
        Returns:
            通知列表
        """
        query = self.db.query(Notification).filter(
            Notification.recipient_id == user_id
        )
        
        if notification_type:
            query = query.filter(Notification.type == notification_type)
        
        if unread_only:
            query = query.filter(Notification.read == False)
        
        total = query.count()
        notifications = query.order_by(
            desc(Notification.created_at)
        ).limit(limit).offset(offset).all()
        
        return {
            'total': total,
            'unread_count': self.db.query(Notification).filter(
                and_(
                    Notification.recipient_id == user_id,
                    Notification.read == False
                )
            ).count(),
            'notifications': [
                self._notification_to_dict(notif)
                for notif in notifications
            ]
        }
    
    async def mark_notification_read(
        self,
        notification_id: str,
        user_id: str
    ) -> bool:
        """
        标记通知为已读
        
        Args:
            notification_id: 通知ID
            user_id: 用户ID
        
        Returns:
            是否成功
        """
        notification = self.db.query(Notification).filter(
            and_(
                Notification.id == notification_id,
                Notification.recipient_id == user_id
            )
        ).first()
        
        if notification:
            notification.read = True
            notification.read_at = datetime.now()
            self.db.commit()
            return True
        
        return False
    
    async def mark_all_notifications_read(self, user_id: str) -> int:
        """
        标记所有通知为已读
        
        Args:
            user_id: 用户ID
        
        Returns:
            更新的数量
        """
        count = self.db.query(Notification).filter(
            and_(
                Notification.recipient_id == user_id,
                Notification.read == False
            )
        ).update({
            'read': True,
            'read_at': datetime.now()
        })
        
        self.db.commit()
        return count
    
    async def create_notification(
        self,
        recipient_id: str,
        notification_type: str,
        actor_id: str,
        entity_type: str,
        entity_id: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Notification:
        """
        创建通知
        
        Args:
            recipient_id: 接收者ID
            notification_type: 通知类型
            actor_id: 触发者ID
            entity_type: 实体类型
            entity_id: 实体ID
            metadata: 额外数据
        
        Returns:
            创建的通知对象
        """
        notification = Notification(
            recipient_id=recipient_id,
            type=notification_type,
            actor_id=actor_id,
            entity_type=entity_type,
            entity_id=entity_id,
            metadata=metadata or {},
            read=False,
        )
        
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        
        return notification
    
    async def create_like_notification(self, like: Like):
        """创建点赞通知"""
        if like.post and like.post.author_id != like.user_id:
            await self.create_notification(
                recipient_id=like.post.author_id,
                notification_type='like',
                actor_id=like.user_id,
                entity_type='post',
                entity_id=like.post_id,
                metadata={
                    'post_title': like.post.title,
                }
            )
    
    async def create_comment_notification(self, comment: Comment):
        """创建评论通知"""
        if comment.post and comment.post.author_id != comment.user_id:
            await self.create_notification(
                recipient_id=comment.post.author_id,
                notification_type='comment',
                actor_id=comment.user_id,
                entity_type='comment',
                entity_id=comment.id,
                metadata={
                    'post_title': comment.post.title,
                    'comment_content': comment.content,
                }
            )
    
    async def create_follow_notification(self, follow: Follow):
        """创建关注通知"""
        await self.create_notification(
            recipient_id=follow.following_id,
            notification_type='follow',
            actor_id=follow.follower_id,
            entity_type='user',
            entity_id=follow.following_id,
        )
    
    async def get_feed(
        self,
        user_id: str,
        feed_type: str = 'following',
        limit: int = 20,
        offset: int = 0
    ) -> Dict[str, Any]:
        """
        获取动态信息流
        
        Args:
            user_id: 用户ID
            feed_type: 信息流类型 (following, trending, latest)
            limit: 返回数量
            offset: 偏移量
        
        Returns:
            信息流字典
        """
        if feed_type == 'following':
            return await self._get_following_feed(user_id, limit, offset)
        elif feed_type == 'trending':
            return await self._get_trending_feed(limit, offset)
        else:  # latest
            return await self._get_latest_feed(limit, offset)
    
    async def _get_following_feed(
        self,
        user_id: str,
        limit: int,
        offset: int
    ) -> Dict[str, Any]:
        """获取关注用户的动态"""
        # 获取关注的用户ID
        following_ids = self.db.query(Follow.following_id).filter(
            Follow.follower_id == user_id
        ).all()
        
        following_ids = [f[0] for f in following_ids]
        
        if not following_ids:
            return {
                'total': 0,
                'posts': []
            }
        
        # 获取关注用户的文章
        query = self.db.query(Post).filter(
            and_(
                Post.author_id.in_(following_ids),
                Post.published == True
            )
        )
        
        total = query.count()
        posts = query.order_by(desc(Post.created_at)).limit(limit).offset(offset).all()
        
        return {
            'total': total,
            'posts': [self._post_to_dict(post) for post in posts]
        }
    
    async def _get_trending_feed(
        self,
        limit: int,
        offset: int
    ) -> Dict[str, Any]:
        """获取热门动态"""
        # 这里应该使用推荐系统计算热度
        # 暂时简单地按浏览量排序
        query = self.db.query(Post).filter(
            Post.published == True
        )
        
        total = query.count()
        posts = query.order_by(
            desc(Post.views_count)
        ).limit(limit).offset(offset).all()
        
        return {
            'total': total,
            'posts': [self._post_to_dict(post) for post in posts]
        }
    
    async def _get_latest_feed(
        self,
        limit: int,
        offset: int
    ) -> Dict[str, Any]:
        """获取最新动态"""
        query = self.db.query(Post).filter(
            Post.published == True
        )
        
        total = query.count()
        posts = query.order_by(desc(Post.created_at)).limit(limit).offset(offset).all()
        
        return {
            'total': total,
            'posts': [self._post_to_dict(post) for post in posts]
        }
    
    def _get_user_dict(self, user: User) -> Dict[str, Any]:
        """转换用户为字典"""
        return {
            'id': user.id,
            'name': user.name,
            'username': user.username,
            'avatar': user.avatar,
        }
    
    def _get_post_dict(self, post: Post) -> Dict[str, Any]:
        """转换文章为字典"""
        return {
            'id': post.id,
            'type': 'post',
            'title': post.title,
            'slug': post.slug,
            'excerpt': post.excerpt,
            'cover_image': post.cover_image,
            'reading_time': post.reading_time,
            'published_at': post.published_at.isoformat() if post.published_at else None,
        }
    
    def _post_to_dict(self, post: Post) -> Dict[str, Any]:
        """转换文章为完整字典"""
        return {
            'id': post.id,
            'title': post.title,
            'slug': post.slug,
            'excerpt': post.excerpt,
            'content': post.content,
            'cover_image': post.cover_image,
            'category': post.category.name if post.category else None,
            'tags': [tag.name for tag in post.tags],
            'reading_time': post.reading_time,
            'published_at': post.published_at.isoformat() if post.published_at else None,
            'author': {
                'id': post.author.id,
                'name': post.author.name,
                'username': post.author.username,
                'avatar': post.author.avatar,
            },
            'metrics': {
                'views': post.views_count,
                'likes': post.likes_count,
                'comments': post.comments_count,
            }
        }
    
    def _notification_to_dict(self, notification: Notification) -> Dict[str, Any]:
        """转换通知为字典"""
        result = {
            'id': notification.id,
            'type': notification.type,
            'read': notification.read,
            'created_at': notification.created_at.isoformat(),
            'read_at': notification.read_at.isoformat() if notification.read_at else None,
            'metadata': notification.metadata,
        }
        
        # 加载关联数据
        if notification.actor:
            result['actor'] = self._get_user_dict(notification.actor)
        
        if notification.entity_type == 'post':
            post = self.db.query(Post).filter(
                Post.id == notification.entity_id
            ).first()
            if post:
                result['post'] = self._get_post_dict(post)
        
        return result
