"""
Enhanced Recommendation Service
增强版推荐服务 - 使用多种算法提供智能推荐
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc, case
from collections import defaultdict
import math

from app.models.post import Post, Category, Tag, PostTag
from app.models.user import User
from app.models.like import Like
from app.models.bookmark import Bookmark
from app.models.reading_progress import ReadingProgress
from app.core.cache_manager import cache_manager


class EnhancedRecommendationService:
    """增强版推荐服务类"""

    def __init__(self, db: Session):
        self.db = db

    async def get_personalized_recommendations(
        self,
        user_id: int,
        limit: int = 10,
        exclude_post_ids: Optional[List[int]] = None,
    ) -> List[Post]:
        """
        获取个性化推荐文章

        综合考虑:
        1. 用户阅读历史
        2. 用户点赞和收藏
        3. 内容相似度
        4. 热门程度
        5. 时间新鲜度
        """

        cache_key = f"recommendations:{user_id}:{limit}"
        cached = await cache_manager.get(cache_key)
        if cached:
            return cached

        # 获取用户偏好
        user_preferences = await self._get_user_preferences(user_id)

        # 获取已读文章ID
        read_post_ids = await self._get_read_post_ids(user_id)
        exclude_ids = set(read_post_ids)
        if exclude_post_ids:
            exclude_ids.update(exclude_post_ids)

        # 基于不同策略获取推荐
        recommendations = []

        # 策略1: 基于阅读历史的协同过滤
        cf_recommendations = await self._collaborative_filtering(
            user_id, user_preferences, limit // 3, exclude_ids
        )
        recommendations.extend(cf_recommendations)
        exclude_ids.update([p.id for p in cf_recommendations])

        # 策略2: 基于内容的推荐
        content_recommendations = await self._content_based_recommendations(
            user_id, user_preferences, limit // 3, exclude_ids
        )
        recommendations.extend(content_recommendations)
        exclude_ids.update([p.id for p in content_recommendations])

        # 策略3: 热门且新鲜的文章
        trending_recommendations = await self._get_trending_fresh(
            user_preferences, limit // 3, exclude_ids
        )
        recommendations.extend(trending_recommendations)

        # 去重并排序
        seen = set()
        unique_recommendations = []
        for post in recommendations:
            if post.id not in seen:
                seen.add(post.id)
                unique_recommendations.append(post)

        # 限制数量
        final_recommendations = unique_recommendations[:limit]

        # 缓存结果
        await cache_manager.set(cache_key, final_recommendations, ttl=1800)  # 30分钟

        return final_recommendations

    async def _get_user_preferences(self, user_id: int) -> Dict[str, Any]:
        """获取用户偏好"""

        # 获取用户喜欢的分类
        liked_categories = (
            self.db.query(
                Category.id,
                func.count(Like.id).label('likes')
            )
            .join(Post, Category.id == Post.category_id)
            .join(Like, Post.id == Like.post_id)
            .filter(Like.user_id == user_id)
            .group_by(Category.id)
            .order_by(desc('likes'))
            .limit(5)
            .all()
        )

        # 获取用户喜欢的标签
        liked_tags = (
            self.db.query(
                Tag.id,
                func.count(Like.id).label('likes')
            )
            .join(PostTag, Tag.id == PostTag.tag_id)
            .join(Post, PostTag.post_id == Post.id)
            .join(Like, Post.id == Like.post_id)
            .filter(Like.user_id == user_id)
            .group_by(Tag.id)
            .order_by(desc('likes'))
            .limit(10)
            .all()
        )

        # 获取用户收藏的分类
        bookmarked_categories = (
            self.db.query(
                Category.id,
                func.count(Bookmark.id).label('bookmarks')
            )
            .join(Post, Category.id == Post.category_id)
            .join(Bookmark, Post.id == Bookmark.post_id)
            .filter(Bookmark.user_id == user_id)
            .group_by(Category.id)
            .order_by(desc('bookmarks'))
            .limit(5)
            .all()
        )

        return {
            'category_ids': [c[0] for c in liked_categories],
            'tag_ids': [t[0] for t in liked_tags],
            'bookmarked_category_ids': [c[0] for c in bookmarked_categories],
        }

    async def _get_read_post_ids(self, user_id: int) -> List[int]:
        """获取用户已读文章ID"""

        read_posts = (
            self.db.query(ReadingProgress.post_id)
            .filter(
                ReadingProgress.user_id == user_id,
                ReadingProgress.progress >= 80  # 读了80%以上算已读
            )
            .all()
        )

        return [p[0] for p in read_posts]

    async def _collaborative_filtering(
        self,
        user_id: int,
        preferences: Dict[str, Any],
        limit: int,
        exclude_ids: set,
    ) -> List[Post]:
        """协同过滤推荐"""

        # 找到相似用户（有相似阅读/点赞行为的用户）
        similar_users = (
            self.db.query(
                Like.user_id,
                func.count(Like.id).label('common_likes')
            )
            .join(Post, Like.post_id == Post.id)
            .filter(
                Post.category_id.in_(preferences['category_ids'])
            )
            .filter(Like.user_id != user_id)
            .group_by(Like.user_id)
            .order_by(desc('common_likes'))
            .limit(20)
            .all()
        )

        similar_user_ids = [u[0] for u in similar_users]

        if not similar_user_ids:
            return []

        # 获取相似用户喜欢的文章
        recommendations = (
            self.db.query(Post)
            .join(Like, Post.id == Like.post_id)
            .filter(
                Like.user_id.in_(similar_user_ids),
                Post.status == 'published',
                ~Post.id.in_(exclude_ids) if exclude_ids else True,
            )
            .group_by(Post.id)
            .order_by(desc(func.count(Like.id)))
            .limit(limit)
            .all()
        )

        return recommendations

    async def _content_based_recommendations(
        self,
        user_id: int,
        preferences: Dict[str, Any],
        limit: int,
        exclude_ids: set,
    ) -> List[Post]:
        """基于内容的推荐"""

        # 基于用户喜欢的分类
        category_posts = (
            self.db.query(Post)
            .filter(
                Post.category_id.in_(preferences['category_ids']),
                Post.status == 'published',
                ~Post.id.in_(exclude_ids) if exclude_ids else True,
            )
            .order_by(desc(Post.created_at))
            .limit(limit * 2)
            .all()
        )

        # 基于用户喜欢的标签
        if preferences['tag_ids']:
            tag_posts = (
                self.db.query(Post)
                .join(PostTag, Post.id == PostTag.post_id)
                .filter(
                    PostTag.tag_id.in_(preferences['tag_ids']),
                    Post.status == 'published',
                    ~Post.id.in_(exclude_ids) if exclude_ids else True,
                )
                .group_by(Post.id)
                .order_by(desc(func.count(PostTag.tag_id)))
                .limit(limit * 2)
                .all()
            )
        else:
            tag_posts = []

        # 合并并去重
        all_posts = category_posts + tag_posts
        seen = set()
        unique_posts = []
        for post in all_posts:
            if post.id not in seen:
                seen.add(post.id)
                unique_posts.append(post)

        return unique_posts[:limit]

    async def _get_trending_fresh(
        self,
        preferences: Dict[str, Any],
        limit: int,
        exclude_ids: set,
    ) -> List[Post]:
        """获取热门且新鲜的文章"""

        # 最近7天内的文章
        since_date = datetime.utcnow() - timedelta(days=7)

        trending_posts = (
            self.db.query(Post)
            .filter(
                Post.status == 'published',
                Post.created_at >= since_date,
                ~Post.id.in_(exclude_ids) if exclude_ids else True,
            )
            .order_by(desc(Post.view_count))
            .limit(limit)
            .all()
        )

        return trending_posts

    async def get_similar_posts(
        self,
        post_id: int,
        limit: int = 5
    ) -> List[Post]:
        """获取相似文章"""

        cache_key = f"similar_posts:{post_id}:{limit}"
        cached = await cache_manager.get(cache_key)
        if cached:
            return cached

        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            return []

        # 基于分类、标签的相似度
        similar_posts = (
            self.db.query(Post)
            .filter(
                Post.id != post_id,
                Post.status == 'published',
                or_(
                    Post.category_id == post.category_id,
                    Post.id.in_(
                        self.db.query(PostTag.post_id)
                        .filter(PostTag.tag_id.in_([t.id for t in post.tags]))
                        .distinct()
                        .subquery()
                    )
                )
            )
            .order_by(desc(Post.view_count))
            .limit(limit * 2)
            .all()
        )

        # 计算相似度分数
        scored_posts = []
        for similar_post in similar_posts:
            score = 0

            # 分类匹配
            if similar_post.category_id == post.category_id:
                score += 10

            # 标签匹配
            post_tag_ids = {t.id for t in post.tags}
            similar_tag_ids = {t.id for t in similar_post.tags}
            common_tags = post_tag_ids & similar_tag_ids
            score += len(common_tags) * 5

            # 时间新鲜度
            days_old = (datetime.utcnow() - similar_post.created_at).days
            if days_old < 7:
                score += 3
            elif days_old < 30:
                score += 2

            scored_posts.append((similar_post, score))

        # 排序并返回
        scored_posts.sort(key=lambda x: x[1], reverse=True)
        result = [post for post, score in scored_posts[:limit]]

        await cache_manager.set(cache_key, result, ttl=3600)

        return result

    async def get_trending_posts(
        self,
        days: int = 7,
        limit: int = 10
    ) -> List[Post]:
        """获取热门文章"""

        cache_key = f"trending_posts:{days}:{limit}"
        cached = await cache_manager.get(cache_key)
        if cached:
            return cached

        since_date = datetime.utcnow() - timedelta(days=days)

        trending_posts = (
            self.db.query(Post)
            .filter(
                Post.status == 'published',
                Post.created_at >= since_date
            )
            .order_by(desc(Post.view_count))
            .limit(limit)
            .all()
        )

        await cache_manager.set(cache_key, trending_posts, ttl=600)

        return trending_posts

    async def get_editor_pick(
        self,
        limit: int = 5
    ) -> List[Post]:
        """编辑精选"""

        cache_key = f"editor_pick:{limit}"
        cached = await cache_manager.get(cache_key)
        if cached:
            return cached

        editor_picks = (
            self.db.query(Post)
            .filter(
                Post.status == 'published',
                Post.is_featured == True
            )
            .order_by(desc(Published.created_at))
            .limit(limit)
            .all()
        )

        await cache_manager.set(cache_key, editor_picks, ttl=3600)

        return editor_picks
