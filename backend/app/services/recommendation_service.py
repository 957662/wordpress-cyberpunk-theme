"""
Recommendation Service
推荐服务 - 基于用户行为和内容相似度的智能推荐
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc, func, and_, or_
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import math

from ..models.post import Post, Tag, Category
from ..models.user import User
from ..models.activity import Activity


class RecommendationService:
    """推荐服务类"""

    def __init__(self, db: Session):
        self.db = db

    async def get_personalized_recommendations(
        self,
        user_id: int,
        limit: int = 10,
        exclude_read: bool = True
    ) -> List[Dict]:
        """
        获取个性化推荐

        基于用户的阅读历史、点赞、收藏等行为推荐内容

        Args:
            user_id: 用户ID
            limit: 推荐数量
            exclude_read: 是否排除已读内容

        Returns:
            推荐文章列表
        """
        # 获取用户
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return []

        # 获取用户喜欢的标签
        liked_tags = await self._get_user_preferred_tags(user_id)

        # 获取用户喜欢的分类
        liked_categories = await self._get_user_preferred_categories(user_id)

        # 获取已读文章ID列表
        read_post_ids = []
        if exclude_read:
            read_post_ids = await self._get_user_read_post_ids(user_id)

        # 构建推荐查询
        query = self.db.query(Post).filter(Post.status == "published")

        # 排除已读
        if read_post_ids:
            query = query.filter(~Post.id.in_(read_post_ids))

        # 基于标签推荐
        if liked_tags:
            query = query.join(Post.tags).filter(Tag.id.in_(liked_tags))

        # 基于分类推荐
        if liked_categories:
            query = query.filter(Post.category_id.in_(liked_categories))

        # 按互动量和时间排序
        query = query.order_by(
            desc(Post.view_count + Post.comment_count * 2),
            desc(Post.created_at)
        )

        # 获取推荐结果
        recommendations = query.limit(limit).all()

        # 计算推荐分数
        scored_recommendations = []
        for post in recommendations:
            score = await self._calculate_recommendation_score(post, user_id)
            scored_recommendations.append((post, score))

        # 按分数排序
        scored_recommendations.sort(key=lambda x: x[1], reverse=True)

        # 转换为字典并返回
        results = []
        for post, score in scored_recommendations[:limit]:
            post_dict = self._post_to_dict(post)
            post_dict["recommendationScore"] = score
            results.append(post_dict)

        return results

    async def get_related_posts(
        self,
        post_id: int,
        limit: int = 5
    ) -> List[Dict]:
        """
        获取相关文章推荐

        基于标签、分类、内容相似度推荐相关文章

        Args:
            post_id: 文章ID
            limit: 推荐数量

        Returns:
            相关文章列表
        """
        # 获取当前文章
        current_post = self.db.query(Post).filter(Post.id == post_id).first()
        if not current_post:
            return []

        # 获取标签ID列表
        tag_ids = [tag.id for tag in current_post.tags]

        # 获取分类ID
        category_id = current_post.category_id

        # 查询相关文章
        query = self.db.query(Post).filter(
            Post.status == "published",
            Post.id != post_id
        )

        # 优先推荐相同标签的文章
        if tag_ids:
            query = query.join(Post.tags).filter(Tag.id.in_(tag_ids))

        # 或者相同分类的文章
        if category_id:
            query = query.filter(
                or_(
                    Post.category_id == category_id,
                    Post.id.in_(
                        self.db.query(Post.id)
                        .join(Post.tags)
                        .filter(Tag.id.in_(tag_ids))
                        .subquery()
                    )
                )
            )

        # 按相关度排序（相同标签越多越相关）
        query = query.order_by(desc(Post.created_at))

        related_posts = query.limit(limit * 2).all()

        # 计算相似度分数
        scored_posts = []
        for post in related_posts:
            similarity = await self._calculate_similarity(current_post, post)
            scored_posts.append((post, similarity))

        # 按相似度排序并返回前N个
        scored_posts.sort(key=lambda x: x[1], reverse=True)

        results = []
        for post, similarity in scored_posts[:limit]:
            post_dict = self._post_to_dict(post)
            post_dict["similarityScore"] = similarity
            results.append(post_dict)

        return results

    async def get_trending_posts(
        self,
        days: int = 7,
        limit: int = 10
    ) -> List[Dict]:
        """
        获取热门文章

        基于最近的浏览量、点赞、评论等互动数据

        Args:
            days: 统计天数
            limit: 返回数量

        Returns:
            热门文章列表
        """
        # 计算时间范围
        start_date = datetime.now() - timedelta(days=days)

        # 查询热门文章
        trending_posts = self.db.query(Post).filter(
            Post.status == "published",
            Post.created_at >= start_date
        ).order_by(
            desc(Post.view_count + Post.comment_count * 3)
        ).limit(limit).all()

        # 转换为字典
        results = []
        for post in trending_posts:
            post_dict = self._post_to_dict(post)
            post_dict["trendingScore"] = post.view_count + post.comment_count * 3
            results.append(post_dict)

        return results

    async def get_latest_posts(
        self,
        limit: int = 10
    ) -> List[Dict]:
        """
        获取最新文章

        Args:
            limit: 返回数量

        Returns:
            最新文章列表
        """
        latest_posts = self.db.query(Post).filter(
            Post.status == "published"
        ).order_by(desc(Post.created_at)).limit(limit).all()

        return [self._post_to_dict(post) for post in latest_posts]

    async def _get_user_preferred_tags(
        self,
        user_id: int,
        limit: int = 5
    ) -> List[int]:
        """
        获取用户喜欢的标签

        基于用户的互动行为分析
        """
        # 查询用户点赞、收藏、评论过的文章的标签
        # 这里简化实现，实际应该从活动记录中统计
        return []

    async def _get_user_preferred_categories(
        self,
        user_id: int,
        limit: int = 3
    ) -> List[int]:
        """
        获取用户喜欢的分类

        基于用户的互动行为分析
        """
        # 简化实现
        return []

    async def _get_user_read_post_ids(
        self,
        user_id: int
    ) -> List[int]:
        """
        获取用户已读文章ID列表
        """
        # 简化实现
        return []

    async def _calculate_recommendation_score(
        self,
        post: Post,
        user_id: int
    ) -> float:
        """
        计算推荐分数

        基于多个因素综合计算
        """
        score = 0.0

        # 基础分数：浏览量
        score += math.log(post.view_count + 1) * 10

        # 互动分数：评论数
        score += post.comment_count * 5

        # 新鲜度分数：发布时间
        days_since_published = (datetime.now() - post.created_at).days if post.created_at else 365
        score += max(0, 30 - days_since_published)

        return score

    async def _calculate_similarity(
        self,
        post1: Post,
        post2: Post
    ) -> float:
        """
        计算两篇文章的相似度

        基于标签、分类等
        """
        similarity = 0.0

        # 标签相似度
        tags1 = set(tag.id for tag in post1.tags)
        tags2 = set(tag.id for tag in post2.tags)

        if tags1 or tags2:
            common_tags = len(tags1 & tags2)
            total_tags = len(tags1 | tags2)
            tag_similarity = common_tags / total_tags if total_tags > 0 else 0
            similarity += tag_similarity * 0.7

        # 分类相似度
        if post1.category_id and post1.category_id == post2.category_id:
            similarity += 0.3

        return similarity

    def _post_to_dict(self, post: Post) -> Dict:
        """将文章对象转换为字典"""
        return {
            "id": str(post.id),
            "title": post.title,
            "slug": post.slug,
            "excerpt": post.excerpt,
            "content": post.content[:200] if post.content else None,
            "imageUrl": post.featured_image_url,
            "viewCount": post.view_count,
            "commentCount": post.comment_count,
            "createdAt": post.created_at.isoformat() if post.created_at else None,
            "updatedAt": post.updated_at.isoformat() if post.updated_at else None,
            "category": {
                "id": str(post.category.id),
                "name": post.category.name,
                "slug": post.category.slug,
            } if post.category else None,
            "tags": [
                {
                    "id": str(tag.id),
                    "name": tag.name,
                    "slug": tag.slug,
                }
                for tag in post.tags
            ],
            "author": {
                "id": str(post.author.id),
                "name": post.author.username,
                "avatar": post.author.avatar_url,
            } if post.author else None,
        }
