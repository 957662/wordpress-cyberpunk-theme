"""
Analytics Service
数据分析服务
"""
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.models.analytics import PostAnalytics, DailyAnalytics, UserActivity
from app.models.post import Post
from app.schemas.analytics import (
    AnalyticsCreate,
    AnalyticsUpdate,
    AnalyticsResponse,
    PostAnalyticsStats,
)


class AnalyticsService:
    """数据分析服务"""

    @staticmethod
    async def record_post_view(
        db: Session,
        post_id: int,
        user_id: Optional[int] = None
    ) -> PostAnalytics:
        """
        记录文章浏览

        Args:
            db: 数据库会话
            post_id: 文章ID
            user_id: 用户ID（可选）

        Returns:
            更新后的分析数据
        """
        # 获取或创建文章分析记录
        analytics = db.query(PostAnalytics).filter(
            and_(
                PostAnalytics.post_id == post_id,
                func.date(PostAnalytics.date) == datetime.utcnow().date()
            )
        ).first()

        if not analytics:
            analytics = PostAnalytics(
                post_id=post_id,
                views=1,
                unique_visitors=1 if user_id else 0,
                date=datetime.utcnow()
            )
            db.add(analytics)
        else:
            analytics.views += 1
            if user_id:
                analytics.unique_visitors += 1

        db.commit()
        db.refresh(analytics)
        return analytics

    @staticmethod
    async def get_post_analytics(
        db: Session,
        post_id: int,
        days: int = 30
    ) -> List[AnalyticsResponse]:
        """
        获取文章分析数据

        Args:
            db: 数据库会话
            post_id: 文章ID
            days: 天数

        Returns:
            分析数据列表
        """
        start_date = datetime.utcnow() - timedelta(days=days)

        analytics = db.query(PostAnalytics).filter(
            and_(
                PostAnalytics.post_id == post_id,
                PostAnalytics.date >= start_date
            )
        ).order_by(PostAnalytics.date).all()

        return analytics

    @staticmethod
    async def get_overview_stats(
        db: Session,
        period: str = "week"
    ) -> Dict[str, Any]:
        """
        获取概览统计

        Args:
            db: 数据库会话
            period: 时间周期 (day, week, month)

        Returns:
            统计数据
        """
        if period == "day":
            days = 1
        elif period == "week":
            days = 7
        else:
            days = 30

        start_date = datetime.utcnow() - timedelta(days=days)

        # 查询每日分析数据
        daily_stats = db.query(DailyAnalytics).filter(
            DailyAnalytics.date >= start_date
        ).all()

        # 汇总数据
        total_views = sum(stat.total_views for stat in daily_stats)
        total_visitors = sum(stat.unique_visitors for stat in daily_stats)
        total_likes = sum(stat.total_likes for stat in daily_stats)
        total_comments = sum(stat.total_comments for stat in daily_stats)
        total_shares = sum(stat.total_views for stat in daily_stats)  # 简化处理

        # 计算互动率
        engagement_rate = (
            (total_likes + total_comments + total_shares) / total_views * 100
            if total_views > 0
            else 0
        )

        return {
            "views": total_views,
            "visitors": total_visitors,
            "likes": total_likes,
            "comments": total_comments,
            "shares": total_shares,
            "engagement": round(engagement_rate, 1),
        }

    @staticmethod
    async def get_popular_posts(
        db: Session,
        limit: int = 10,
        days: int = 30
    ) -> List[PostAnalyticsStats]:
        """
        获取热门文章

        Args:
            db: 数据库会话
            limit: 返回数量
            days: 天数

        Returns:
            热门文章列表
        """
        start_date = datetime.utcnow() - timedelta(days=days)

        # 查询文章分析数据
        analytics = db.query(PostAnalytics, Post).join(
            Post,
            PostAnalytics.post_id == Post.id
        ).filter(
            PostAnalytics.date >= start_date
        ).all()

        # 汇总每个文章的数据
        post_stats = {}
        for analytics_item, post in analytics:
            if post.id not in post_stats:
                post_stats[post.id] = {
                    "post_id": post.id,
                    "title": post.title,
                    "views": 0,
                    "likes": 0,
                    "comments": 0,
                    "shares": 0,
                }

            post_stats[post.id]["views"] += analytics_item.views
            post_stats[post.id]["likes"] += analytics_item.likes
            post_stats[post.id]["comments"] += analytics_item.comments
            post_stats[post.id]["shares"] += analytics_item.shares

        # 计算互动率并排序
        stats_list = []
        for stat in post_stats.values():
            total_engagement = stat["likes"] + stat["comments"] + stat["shares"]
            engagement_rate = (
                total_engagement / stat["views"] * 100
                if stat["views"] > 0
                else 0
            )
            stat["engagement_rate"] = round(engagement_rate, 2)
            stats_list.append(PostAnalyticsStats(**stat))

        # 按浏览量排序
        stats_list.sort(key=lambda x: x.views, reverse=True)

        return stats_list[:limit]

    @staticmethod
    async def record_user_activity(
        db: Session,
        user_id: int,
        activity_type: str,
        target_type: Optional[str] = None,
        target_id: Optional[int] = None,
        metadata: Optional[str] = None
    ) -> UserActivity:
        """
        记录用户活动

        Args:
            db: 数据库会话
            user_id: 用户ID
            activity_type: 活动类型
            target_type: 目标类型
            target_id: 目标ID
            metadata: 元数据

        Returns:
            活动记录
        """
        activity = UserActivity(
            user_id=user_id,
            activity_type=activity_type,
            target_type=target_type,
            target_id=target_id,
            metadata=metadata
        )

        db.add(activity)
        db.commit()
        db.refresh(activity)

        return activity

    @staticmethod
    async def get_recent_activities(
        db: Session,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        获取最近活动

        Args:
            db: 数据库会话
            limit: 返回数量

        Returns:
            活动列表
        """
        activities = db.query(UserActivity).order_by(
            UserActivity.created_at.desc()
        ).limit(limit).all()

        return [
            {
                "id": str(activity.id),
                "type": activity.activity_type,
                "message": f"User {activity.user_id} {activity.activity_type}",
                "time": activity.created_at.isoformat(),
                "user_id": activity.user_id,
            }
            for activity in activities
        ]
