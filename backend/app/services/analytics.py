"""
Analytics Service
提供分析和统计功能
"""

from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy import select, func, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.analytics import (
    PageView,
    Event,
    Session,
    Metric,
    AnalyticsReport
)
from app.schemas.analytics import (
    PageViewCreate,
    EventCreate,
    AnalyticsFilter,
    DashboardStats,
    TrafficSource,
    PopularContent
)


class AnalyticsService:
    """分析服务类"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def track_page_view(
        self,
        page_view: PageViewCreate,
        session_id: Optional[str] = None
    ) -> PageView:
        """记录页面浏览"""
        db_page_view = PageView(**page_view.dict())

        if session_id:
            db_page_view.session_id = session_id

        self.db.add(db_page_view)
        await self.db.commit()
        await self.db.refresh(db_page_view)

        return db_page_view

    async def track_event(
        self,
        event: EventCreate,
        session_id: Optional[str] = None
    ) -> Event:
        """记录事件"""
        db_event = Event(**event.dict())

        if session_id:
            db_event.session_id = session_id

        self.db.add(db_event)
        await self.db.commit()
        await self.db.refresh(db_event)

        return db_event

    async def get_dashboard_stats(
        self,
        filters: AnalyticsFilter
    ) -> DashboardStats:
        """获取仪表板统计数据"""
        # 时间范围
        start_date = filters.start_date or datetime.now() - timedelta(days=30)
        end_date = filters.end_date or datetime.now()

        # 总浏览量
        total_views = await self.db.scalar(
            select(func.count(PageView.id))
            .where(
                and_(
                    PageView.created_at >= start_date,
                    PageView.created_at <= end_date
                )
            )
        )

        # 独立访客
        unique_visitors = await self.db.scalar(
            select(func.count(func.distinct(PageView.session_id)))
            .where(
                and_(
                    PageView.created_at >= start_date,
                    PageView.created_at <= end_date
                )
            )
        )

        # 总事件数
        total_events = await self.db.scalar(
            select(func.count(Event.id))
            .where(
                and_(
                    Event.created_at >= start_date,
                    Event.created_at <= end_date
                )
            )
        )

        # 平均会话时长
        avg_session_duration = await self.db.scalar(
            select(func.avg(Session.duration))
            .where(
                and_(
                    Session.created_at >= start_date,
                    Session.created_at <= end_date
                )
            )
        )

        # 跳出率
        total_sessions = await self.db.scalar(
            select(func.count(Session.id))
            .where(
                and_(
                    Session.created_at >= start_date,
                    Session.created_at <= end_date
                )
            )
        )

        bounce_sessions = await self.db.scalar(
            select(func.count(Session.id))
            .where(
                and_(
                    Session.created_at >= start_date,
                    Session.created_at <= end_date,
                    Session.page_views == 1
                )
            )
        )

        bounce_rate = (bounce_sessions / total_sessions * 100) if total_sessions else 0

        return DashboardStats(
            total_views=total_views or 0,
            unique_visitors=unique_visitors or 0,
            total_events=total_events or 0,
            avg_session_duration=avg_session_duration or 0,
            bounce_rate=bounce_rate
        )

    async def get_traffic_sources(
        self,
        filters: AnalyticsFilter
    ) -> List[TrafficSource]:
        """获取流量来源统计"""
        start_date = filters.start_date or datetime.now() - timedelta(days=30)
        end_date = filters.end_date or datetime.now()

        result = await self.db.execute(
            select(
                PageView.source,
                func.count(PageView.id).label('count')
            )
            .where(
                and_(
                    PageView.created_at >= start_date,
                    PageView.created_at <= end_date
                )
            )
            .group_by(PageView.source)
            .order_by(func.count(PageView.id).desc())
            .limit(10)
        )

        traffic_sources = [
            TrafficSource(source=row.source or 'Direct', count=row.count)
            for row in result
        ]

        return traffic_sources

    async def get_popular_content(
        self,
        filters: AnalyticsFilter,
        limit: int = 10
    ) -> List[PopularContent]:
        """获取热门内容"""
        start_date = filters.start_date or datetime.now() - timedelta(days=30)
        end_date = filters.end_date or datetime.now()

        result = await self.db.execute(
            select(
                PageView.path,
                func.count(PageView.id).label('views')
            )
            .where(
                and_(
                    PageView.created_at >= start_date,
                    PageView.created_at <= end_date
                )
            )
            .group_by(PageView.path)
            .order_by(func.count(PageView.id).desc())
            .limit(limit)
        )

        popular_content = [
            PopularContent(path=row.path, views=row.views)
            for row in result
        ]

        return popular_content

    async def get_page_views_over_time(
        self,
        filters: AnalyticsFilter,
        interval: str = 'day'
    ) -> List[Dict[str, Any]]:
        """获取页面浏览趋势"""
        start_date = filters.start_date or datetime.now() - timedelta(days=30)
        end_date = filters.end_date or datetime.now()

        # 根据时间间隔分组
        if interval == 'hour':
            date_format = func.date_format(
                PageView.created_at,
                '%Y-%m-%d %H:00'
            )
        elif interval == 'day':
            date_format = func.date_format(
                PageView.created_at,
                '%Y-%m-%d'
            )
        else:  # week
            date_format = func.date_format(
                PageView.created_at,
                '%Y-%u'
            )

        result = await self.db.execute(
            select(
                date_format.label('date'),
                func.count(PageView.id).label('count')
            )
            .where(
                and_(
                    PageView.created_at >= start_date,
                    PageView.created_at <= end_date
                )
            )
            .group_by(date_format)
            .order_by(date_format)
        )

        return [
            {'date': row.date, 'count': row.count}
            for row in result
        ]

    async def create_analytics_report(
        self,
        name: str,
        filters: AnalyticsFilter
    ) -> AnalyticsReport:
        """创建分析报告"""
        # 获取统计数据
        stats = await self.get_dashboard_stats(filters)
        traffic_sources = await self.get_traffic_sources(filters)
        popular_content = await self.get_popular_content(filters)

        # 创建报告
        report = AnalyticsReport(
            name=name,
            start_date=filters.start_date,
            end_date=filters.end_date,
            data={
                'stats': stats.dict(),
                'traffic_sources': [t.dict() for t in traffic_sources],
                'popular_content': [p.dict() for p in popular_content]
            }
        )

        self.db.add(report)
        await self.db.commit()
        await self.db.refresh(report)

        return report

    async def get_user_retention(
        self,
        cohort_date: datetime,
        days: int = 7
    ) -> List[Dict[str, Any]]:
        """获取用户留存率"""
        # 获取特定日期的新用户
        cohort_users = await self.db.execute(
            select(func.distinct(PageView.session_id))
            .where(
                func.date(PageView.created_at) == cohort_date.date()
            )
        )

        session_ids = [row[0] for row in cohort_users]

        # 计算留存率
        retention_data = []
        for day in range(days + 1):
            target_date = cohort_date + timedelta(days=day)

            retained_count = await self.db.scalar(
                select(func.count(func.distinct(PageView.session_id)))
                .where(
                    and_(
                        PageView.session_id.in_(session_ids),
                        func.date(PageView.created_at) == target_date.date()
                    )
                )
            )

            retention_rate = (
                retained_count / len(session_ids) * 100
                if session_ids else 0
            )

            retention_data.append({
                'day': day,
                'date': target_date.date().isoformat(),
                'retained': retained_count or 0,
                'rate': retention_rate
            })

        return retention_data

    async def cleanup_old_data(self, days: int = 90):
        """清理旧数据"""
        cutoff_date = datetime.now() - timedelta(days=days)

        # 删除旧的页面浏览记录
        await self.db.execute(
            PageView.__table__.delete()
            .where(PageView.created_at < cutoff_date)
        )

        # 删除旧的事件记录
        await self.db.execute(
            Event.__table__.delete()
            .where(Event.created_at < cutoff_date)
        )

        # 删除旧的会话记录
        await self.db.execute(
            Session.__table__.delete()
            .where(Session.created_at < cutoff_date)
        )

        await self.db.commit()
