"""
Enhanced Analytics API
增强的分析 API
提供更详细的内容分析功能
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import List, Optional
from datetime import datetime, timedelta
import pytz

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.post import Post
from app.models.analytics import PostView, PostAnalytics
from app.schemas.analytics import (
    AnalyticsOverview,
    PostAnalyticsDetail,
    TrendingPost,
    AnalyticsTimeSeries,
    PopularCategory,
    PopularTag,
)

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# 时区配置
TIMEZONE = pytz.UTC


@router.get("/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(
    period: str = Query("7d", description="时间周期: 1d, 7d, 30d, 90d, all"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取分析概览
    """
    # 计算时间范围
    end_date = datetime.now(TIMEZONE)
    start_date = _calculate_start_date(period)

    # 获取文章总数
    total_posts_result = await db.execute(
        select(func.count(Post.id))
        .where(Post.status == "published")
    )
    total_posts = total_posts_result.scalar() or 0

    # 获取时间段内的浏览量
    views_result = await db.execute(
        select(func.count(PostView.id))
        .where(
            and_(
                PostView.created_at >= start_date,
                PostView.created_at <= end_date
            )
        )
    )
    total_views = views_result.scalar() or 0

    # 获取独立访客数
    unique_visitors_result = await db.execute(
        select(func.count(func.distinct(PostView.session_id)))
        .where(
            and_(
                PostView.created_at >= start_date,
                PostView.created_at <= end_date
            )
        )
    )
    unique_visitors = unique_visitors_result.scalar() or 0

    # 计算平均阅读时长
    avg_duration_result = await db.execute(
        select(func.avg(PostView.duration))
        .where(
            and_(
                PostView.created_at >= start_date,
                PostView.created_at <= end_date,
                PostView.duration.isnot(None)
            )
        )
    )
    avg_duration = avg_duration_result.scalar() or 0

    return AnalyticsOverview(
        total_posts=total_posts,
        total_views=total_views,
        unique_visitors=unique_visitors,
        avg_reading_time=round(avg_duration, 2),
        period=period,
        start_date=start_date,
        end_date=end_date,
    )


@router.get("/posts/{post_id}", response_model=PostAnalyticsDetail)
async def get_post_analytics(
    post_id: str,
    period: str = Query("7d", description="时间周期"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    获取文章详细分析
    """
    # 获取文章
    post_result = await db.execute(
        select(Post).where(Post.id == post_id)
    )
    post = post_result.scalar_one_or_none()

    if not post:
        raise HTTPException(status_code=404, detail="文章不存在")

    # 计算时间范围
    end_date = datetime.now(TIMEZONE)
    start_date = _calculate_start_date(period)

    # 获取浏览量
    views_result = await db.execute(
        select(func.count(PostView.id))
        .where(
            and_(
                PostView.post_id == post_id,
                PostView.created_at >= start_date,
                PostView.created_at <= end_date
            )
        )
    )
    total_views = views_result.scalar() or 0

    # 获取独立访客
    unique_visitors_result = await db.execute(
        select(func.count(func.distinct(PostView.session_id)))
        .where(
            and_(
                PostView.post_id == post_id,
                PostView.created_at >= start_date,
                PostView.created_at <= end_date
            )
        )
    )
    unique_visitors = unique_visitors_result.scalar() or 0

    # 获取平均阅读时长
    avg_duration_result = await db.execute(
        select(func.avg(PostView.duration))
        .where(
            and_(
                PostView.post_id == post_id,
                PostView.created_at >= start_date,
                PostView.created_at <= end_date,
                PostView.duration.isnot(None)
            )
        )
    )
    avg_duration = avg_duration_result.scalar() or 0

    # 获取跳出率（只浏览了一页的会话）
    bounce_rate_result = await db.execute(
        select(func.count(PostView.id))
        .where(
            and_(
                PostView.post_id == post_id,
                PostView.created_at >= start_date,
                PostView.created_at <= end_date
            )
        )
    )
    total_sessions = bounce_rate_result.scalar() or 0

    # 获取分享次数（假设有分享表）
    shares = 0  # TODO: 从分享表获取

    return PostAnalyticsDetail(
        post_id=post_id,
        post_title=post.title,
        total_views=total_views,
        unique_visitors=unique_visitors,
        avg_reading_time=round(avg_duration, 2),
        bounce_rate=round((1 - (unique_visitors / total_sessions if total_sessions > 0 else 0)) * 100, 2),
        shares=shares,
        period=period,
    )


@router.get("/trending", response_model=List[TrendingPost])
async def get_trending_posts(
    limit: int = Query(10, ge=1, le=50),
    period: str = Query("7d", description="时间周期"),
    db: AsyncSession = Depends(get_db),
):
    """
    获取热门文章
    """
    end_date = datetime.now(TIMEZONE)
    start_date = _calculate_start_date(period)

    # 计算文章热度分数
    # 热度 = 浏览量 * 1 + 点赞数 * 3 + 评论数 * 5
    trend_query = select(
        Post,
        func.count(PostView.id).label('views'),
        func.coalesce(func.sum(Post.like_count), 0).label('likes'),
        func.coalesce(func.sum(Post.comment_count), 0).label('comments')
    ).outerjoin(
        PostView,
        and_(
            PostView.post_id == Post.id,
            PostView.created_at >= start_date,
            PostView.created_at <= end_date
        )
    ).where(
        Post.status == 'published'
    ).group_by(
        Post.id
    ).order_by(
        (func.count(PostView.id) * 1 + func.coalesce(func.sum(Post.like_count), 0) * 3).desc()
    ).limit(limit)

    result = await db.execute(trend_query)
    posts = result.all()

    trending_posts = []
    for post, views, likes, comments in posts:
        trend_score = int(views * 1 + likes * 3 + comments * 5)
        trending_posts.append(TrendingPost(
            post_id=post.id,
            post_title=post.title,
            views=int(views),
            likes=int(likes),
            comments=int(comments),
            trend_score=trend_score,
        ))

    return trending_posts


@router.get("/timeseries", response_model=List[AnalyticsTimeSeries])
async def get_analytics_timeseries(
    period: str = Query("7d", description="时间周期"),
    granularity: str = Query("day", description="粒度: hour, day, week"),
    db: AsyncSession = Depends(get_db),
):
    """
    获取时间序列数据
    """
    end_date = datetime.now(TIMEZONE)
    start_date = _calculate_start_date(period)

    # 根据粒度确定分组
    if granularity == "hour":
        date_trunc = func.date_trunc('hour', PostView.created_at)
    elif granularity == "week":
        date_trunc = func.date_trunc('week', PostView.created_at)
    else:
        date_trunc = func.date_trunc('day', PostView.created_at)

    # 查询时间序列数据
    query = select(
        date_trunc.label('timestamp'),
        func.count(PostView.id).label('views'),
        func.count(func.distinct(PostView.session_id)).label('visitors')
    ).where(
        and_(
            PostView.created_at >= start_date,
            PostView.created_at <= end_date
        )
    ).group_by(
        date_trunc
    ).order_by(
        date_trunc
    )

    result = await db.execute(query)
    timeseries_data = result.all()

    return [
        AnalyticsTimeSeries(
            timestamp=timestamp,
            views=int(views),
            visitors=int(visitors),
        )
        for timestamp, views, visitors in timeseries_data
    ]


@router.get("/categories/popular", response_model=List[PopularCategory])
async def get_popular_categories(
    limit: int = Query(10, ge=1, le=50),
    period: str = Query("30d", description="时间周期"),
    db: AsyncSession = Depends(get_db),
):
    """
    获取热门分类
    """
    end_date = datetime.now(TIMEZONE)
    start_date = _calculate_start_date(period)

    # TODO: 实现分类统计逻辑
    # 需要关联 post_categories 表
    return []


@router.get("/tags/popular", response_model=List[PopularTag])
async def get_popular_tags(
    limit: int = Query(10, ge=1, le=50),
    period: str = Query("30d", description="时间周期"),
    db: AsyncSession = Depends(get_db),
):
    """
    获取热门标签
    """
    end_date = datetime.now(TIMEZONE)
    start_date = _calculate_start_date(period)

    # TODO: 实现标签统计逻辑
    # 需要关联 post_tags 表
    return []


def _calculate_start_date(period: str) -> datetime:
    """
    计算开始日期
    """
    now = datetime.now(TIMEZONE)

    if period == "1d":
        return now - timedelta(days=1)
    elif period == "7d":
        return now - timedelta(days=7)
    elif period == "30d":
        return now - timedelta(days=30)
    elif period == "90d":
        return now - timedelta(days=90)
    else:  # all
        return datetime.min.replace(tzinfo=TIMEZONE)
