"""
推荐系统服务

基于多种算法实现内容推荐:
- 协同过滤
- 内容相似度
- 热度排序
- 个性化推荐
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, func
from app.models.post import Post
from app.models.user import User
from app.models.interaction import Like, Bookmark, View
import math


class RecommendationService:
    """推荐系统服务"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def get_related_posts(
        self,
        post_id: str,
        user_id: Optional[str] = None,
        limit: int = 6,
        algorithm: str = 'hybrid'
    ) -> List[Dict[str, Any]]:
        """
        获取相关文章推荐
        
        Args:
            post_id: 当前文章ID
            user_id: 用户ID（可选，用于个性化）
            limit: 返回数量
            algorithm: 推荐算法 (tags, category, hybrid, collaborative)
        
        Returns:
            推荐文章列表
        """
        current_post = self.db.query(Post).filter(Post.id == post_id).first()
        if not current_post:
            return []
        
        if algorithm == 'tags':
            return await self._recommend_by_tags(current_post, limit)
        elif algorithm == 'category':
            return await self._recommend_by_category(current_post, limit)
        elif algorithm == 'collaborative':
            return await self._recommend_collaborative(post_id, user_id, limit)
        else:  # hybrid
            return await self._recommend_hybrid(current_post, user_id, limit)
    
    async def _recommend_by_tags(self, post: Post, limit: int) -> List[Dict[str, Any]]:
        """基于标签推荐"""
        # 获取当前文章的标签
        post_tags = [tag.name for tag in post.tags]
        
        # 查找有共同标签的文章
        related_posts = self.db.query(Post).filter(
            and_(
                Post.id != post.id,
                Post.published == True,
                Post.tags.any(Post.id.in_([t.id for t in post.tags]))
            )
        ).all()
        
        # 计算相似度分数
        scored_posts = []
        for related_post in related_posts:
            related_tags = [tag.name for tag in related_post.tags]
            common_tags = set(post_tags) & set(related_tags)
            score = len(common_tags) / max(len(post_tags), len(related_tags))
            
            scored_posts.append({
                'post': related_post,
                'score': score
            })
        
        # 排序并返回
        scored_posts.sort(key=lambda x: x['score'], reverse=True)
        return [
            self._post_to_dict(sp['post'], sp['score'])
            for sp in scored_posts[:limit]
        ]
    
    async def _recommend_by_category(self, post: Post, limit: int) -> List[Dict[str, Any]]:
        """基于分类推荐"""
        related_posts = self.db.query(Post).filter(
            and_(
                Post.id != post.id,
                Post.published == True,
                Post.category_id == post.category_id
            )
        ).order_by(desc(Post.created_at)).limit(limit * 2).all()
        
        # 结合热度分数
        scored_posts = []
        for related_post in related_posts:
            score = self._calculate_popularity_score(related_post)
            scored_posts.append({
                'post': related_post,
                'score': score
            })
        
        scored_posts.sort(key=lambda x: x['score'], reverse=True)
        return [
            self._post_to_dict(sp['post'], sp['score'])
            for sp in scored_posts[:limit]
        ]
    
    async def _recommend_collaborative(
        self, 
        post_id: str, 
        user_id: Optional[str], 
        limit: int
    ) -> List[Dict[str, Any]]:
        """协同过滤推荐"""
        # 找到喜欢当前文章的用户
        users_who_liked = self.db.query(Like.user_id).filter(
            Like.post_id == post_id
        ).all()
        
        if not users_who_liked:
            return []
        
        user_ids = [u[0] for u in users_who_liked]
        
        # 找到这些用户喜欢的其他文章
        related_posts = self.db.query(Post).join(
            Like, Post.id == Like.post_id
        ).filter(
            and_(
                Post.id != post_id,
                Post.published == True,
                Like.user_id.in_(user_ids)
            )
        ).group_by(Post.id).order_by(
            desc(func.count(Like.id))
        ).limit(limit).all()
        
        return [
            self._post_to_dict(post, self._calculate_popularity_score(post))
            for post in related_posts
        ]
    
    async def _recommend_hybrid(
        self, 
        post: Post, 
        user_id: Optional[str], 
        limit: int
    ) -> List[Dict[str, Any]]:
        """混合推荐算法"""
        # 获取各种算法的推荐结果
        tag_recommendations = await self._recommend_by_tags(post, limit * 2)
        category_recommendations = await self._recommend_by_category(post, limit * 2)
        
        # 合并并计算综合分数
        combined_scores = {}
        
        # 标签相似度权重: 40%
        for rec in tag_recommendations:
            post_id = rec['id']
            combined_scores[post_id] = combined_scores.get(post_id, 0) + rec['score'] * 0.4
        
        # 分类相似度权重: 30%
        for rec in category_recommendations:
            post_id = rec['id']
            combined_scores[post_id] = combined_scores.get(post_id, 0) + rec['score'] * 0.3
        
        # 热度权重: 30%
        all_posts = self.db.query(Post).filter(
            and_(
                Post.id != post.id,
                Post.published == True
            )
        ).all()
        
        for p in all_posts:
            popularity = self._calculate_popularity_score(p)
            combined_scores[p.id] = combined_scores.get(p.id, 0) + popularity * 0.3
        
        # 排序并返回
        sorted_posts = sorted(
            combined_scores.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:limit]
        
        # 构建结果
        result = []
        for post_id, score in sorted_posts:
            post_obj = self.db.query(Post).filter(Post.id == post_id).first()
            if post_obj:
                result.append(self._post_to_dict(post_obj, score))
        
        return result
    
    def _calculate_popularity_score(self, post: Post) -> float:
        """
        计算文章热度分数
        
        考虑因素:
        - 点赞数: 30%
        - 评论数: 25%
        - 收藏数: 25%
        - 浏览数: 15%
        - 时间衰减: 5%
        """
        # 获取交互数据
        likes_count = self.db.query(func.count(Like.id)).filter(
            Like.post_id == post.id
        ).scalar() or 0
        
        bookmarks_count = self.db.query(func.count(Bookmark.id)).filter(
            Bookmark.post_id == post.id
        ).scalar() or 0
        
        views_count = self.db.query(func.count(View.id)).filter(
            View.post_id == post.id
        ).scalar() or 0
        
        comments_count = post.comments_count or 0
        
        # 标准化 (假设最大值)
        max_likes = 1000
        max_bookmarks = 500
        max_views = 10000
        max_comments = 200
        
        normalized_likes = min(likes_count / max_likes, 1.0)
        normalized_bookmarks = min(bookmarks_count / max_bookmarks, 1.0)
        normalized_views = min(views_count / max_views, 1.0)
        normalized_comments = min(comments_count / max_comments, 1.0)
        
        # 计算时间衰减 (7天内无衰减，之后逐渐降低)
        days_since_created = (datetime.now() - post.created_at).days
        time_decay = max(0.5, 1 - (days_since_created / 365))
        
        # 综合分数
        score = (
            normalized_likes * 0.30 +
            normalized_comments * 0.25 +
            normalized_bookmarks * 0.25 +
            normalized_views * 0.15
        ) * time_decay
        
        return score
    
    def _post_to_dict(self, post: Post, score: float) -> Dict[str, Any]:
        """转换文章为字典"""
        return {
            'id': post.id,
            'title': post.title,
            'slug': post.slug,
            'excerpt': post.excerpt,
            'cover_image': post.cover_image,
            'category': post.category.name if post.category else None,
            'tags': [tag.name for tag in post.tags],
            'reading_time': post.reading_time,
            'published_at': post.published_at.isoformat() if post.published_at else None,
            'author': {
                'id': post.author.id,
                'name': post.author.name,
                'avatar': post.author.avatar,
            },
            'metrics': {
                'views': post.views_count,
                'likes': post.likes_count,
                'comments': post.comments_count,
            },
            'relevance_score': score,
        }
    
    async def get_trending_posts(
        self, 
        period: str = 'week', 
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        获取热门文章
        
        Args:
            period: 时间周期 (day, week, month, year, all)
            limit: 返回数量
        
        Returns:
            热门文章列表
        """
        # 计算时间范围
        now = datetime.now()
        if period == 'day':
            start_date = now - timedelta(days=1)
        elif period == 'week':
            start_date = now - timedelta(weeks=1)
        elif period == 'month':
            start_date = now - timedelta(days=30)
        elif period == 'year':
            start_date = now - timedelta(days=365)
        else:
            start_date = None
        
        # 查询文章
        query = self.db.query(Post).filter(Post.published == True)
        
        if start_date:
            query = query.filter(Post.created_at >= start_date)
        
        posts = query.all()
        
        # 计算热度分数并排序
        scored_posts = [
            (post, self._calculate_popularity_score(post))
            for post in posts
        ]
        
        scored_posts.sort(key=lambda x: x[1], reverse=True)
        
        return [
            self._post_to_dict(post, score)
            for post, score in scored_posts[:limit]
        ]
    
    async def get_personalized_recommendations(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        获取个性化推荐
        
        基于用户行为历史推荐内容
        
        Args:
            user_id: 用户ID
            limit: 返回数量
        
        Returns:
            个性化推荐列表
        """
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return []
        
        # 获取用户交互过的文章
        liked_posts = self.db.query(Like.post_id).filter(
            Like.user_id == user_id
        ).all()
        
        bookmarked_posts = self.db.query(Bookmark.post_id).filter(
            Bookmark.user_id == user_id
        ).all()
        
        viewed_posts = self.db.query(View.post_id).filter(
            View.user_id == user_id
        ).all()
        
        # 合并所有交互过的文章ID
        interacted_post_ids = set(
            [p[0] for p in liked_posts] +
            [p[0] for p in bookmarked_posts] +
            [p[0] for p in viewed_posts]
        )
        
        if not interacted_post_ids:
            # 新用户，返回热门文章
            return await self.get_trending_posts(period='week', limit=limit)
        
        # 获取交互过的文章
        interacted_posts = self.db.query(Post).filter(
            Post.id.in_(interacted_post_ids)
        ).all()
        
        # 分析用户偏好
        category_counts = {}
        tag_counts = {}
        
        for post in interacted_posts:
            if post.category:
                category_counts[post.category.name] = \
                    category_counts.get(post.category.name, 0) + 1
            for tag in post.tags:
                tag_counts[tag.name] = tag_counts.get(tag.name, 0) + 1
        
        # 基于偏好推荐
        preferred_categories = sorted(
            category_counts.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:3]
        
        preferred_tags = sorted(
            tag_counts.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:5]
        
        # 查找匹配的文章
        category_names = [c[0] for c in preferred_categories]
        tag_names = [t[0] for t in preferred_tags]
        
        recommended_posts = self.db.query(Post).filter(
            and_(
                Post.published == True,
                ~Post.id.in_(interacted_post_ids),
                or_(
                    Post.category.has(Post.name.in_(category_names)),
                    Post.tags.any(Post.name.in_(tag_names))
                )
            )
        ).limit(limit * 2).all()
        
        # 计算匹配分数
        scored_posts = []
        for post in recommended_posts:
            score = 0
            if post.category and post.category.name in category_names:
                score += 0.5
            
            post_tags = [tag.name for tag in post.tags]
            common_tags = set(post_tags) & set(tag_names)
            score += len(common_tags) * 0.3
            
            # 添加热度分数
            score += self._calculate_popularity_score(post) * 0.2
            
            scored_posts.append({
                'post': post,
                'score': score
            })
        
        scored_posts.sort(key=lambda x: x['score'], reverse=True)
        
        return [
            self._post_to_dict(sp['post'], sp['score'])
            for sp in scored_posts[:limit]
        ]
