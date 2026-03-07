"""
Analytics Schemas
数据分析模式
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class AnalyticsBase(BaseModel):
    """分析基础模式"""
    views: int = 0
    unique_visitors: int = 0
    likes: int = 0
    comments: int = 0
    shares: int = 0


class AnalyticsCreate(AnalyticsBase):
    """创建分析数据"""
    post_id: int
    read_time: Optional[float] = None
    bounce_rate: Optional[float] = None


class AnalyticsUpdate(BaseModel):
    """更新分析数据"""
    views: Optional[int] = None
    unique_visitors: Optional[int] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    shares: Optional[int] = None
    read_time: Optional[float] = None
    bounce_rate: Optional[float] = None


class AnalyticsResponse(AnalyticsBase):
    """分析响应"""
    id: int
    post_id: int
    read_time: Optional[float] = None
    bounce_rate: Optional[float] = None
    date: datetime

    class Config:
        from_attributes = True


class ChartDataPoint(BaseModel):
    """图表数据点"""
    label: str
    value: int


class AnalyticsOverview(BaseModel):
    """分析概览"""
    period: str
    data: AnalyticsBase
    chart_data: List[ChartDataPoint]


class PostAnalyticsStats(BaseModel):
    """文章统计"""
    post_id: int
    title: str
    views: int
    likes: int
    comments: int
    shares: int
    engagement_rate: float


class DailyAnalytics(BaseModel):
    """每日分析"""
    date: datetime
    total_views: int
    unique_visitors: int
    new_users: int
    total_posts: int
    total_comments: int
    total_likes: int
    avg_session_duration: float


class TrendData(BaseModel):
    """趋势数据"""
    date: str
    value: int


class TrendResponse(BaseModel):
    """趋势响应"""
    metric: str
    data: List[TrendData]


class PostAnalytics(BaseModel):
    """文章分析（API响应用）"""
    post_id: int
    title: Optional[str] = None
    views: int = 0
    unique_visitors: int = 0
    likes: int = 0
    comments: int = 0
    shares: int = 0
    read_time: Optional[float] = None
    engagement_rate: float = 0.0


class UserAnalytics(BaseModel):
    """用户分析"""
    user_id: int
    username: str
    posts_count: int = 0
    comments_count: int = 0
    likes_received: int = 0
    followers_count: int = 0
    following_count: int = 0


class TrafficAnalytics(BaseModel):
    """流量分析"""
    date: str
    page_views: int = 0
    unique_visitors: int = 0
    avg_session_duration: float = 0.0
    bounce_rate: float = 0.0
    top_pages: List[str] = []
