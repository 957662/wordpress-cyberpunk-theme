"""
Analytics Service for CyberPress Platform
分析服务 - 用于收集和分析用户行为数据
"""

from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_

from ..models.analytics import (
    PageView,
    Event,
    Session,
    Conversion,
    AnalyticsAggregate
)
from ..schemas.analytics import (
    PageViewCreate,
    EventCreate,
    ConversionCreate,
    AnalyticsDashboard,
    TrafficAnalytics,
    UserAnalytics,
    ContentAnalytics
)


class AnalyticsService:
    """分析服务类"""

    def __init__(self, db: Session):
        self.db = db

    # ==================== 页面浏览 ====================

    def track_page_view(
        self,
        page_view: PageViewCreate,
        session_id: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> PageView:
        """记录页面浏览"""

        db_page_view = PageView(
            **page_view.dict(),
            session_id=session_id,
            user_id=user_id,
            timestamp=datetime.utcnow()
        )

        self.db.add(db_page_view)

        # 更新会话信息
        if session_id:
            session = self.db.query(Session).filter(
                Session.session_id == session_id
            ).first()

            if not session:
                session = Session(
                    session_id=session_id,
                    user_id=user_id,
                    start_time=datetime.utcnow(),
                    last_activity=datetime.utcnow()
                )
                self.db.add(session)
            else:
                session.last_activity = datetime.utcnow()
                session.page_views += 1

        self.db.commit()
        self.db.refresh(db_page_view)
        return db_page_view

    def get_page_views(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[PageView]:
        """获取页面浏览记录"""

        query = self.db.query(PageView)

        if start_date:
            query = query.filter(PageView.timestamp >= start_date)
        if end_date:
            query = query.filter(PageView.timestamp <= end_date)

        return query.order_by(PageView.timestamp.desc()).limit(limit).all()

    def get_page_views_stats(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """获取页面浏览统计"""

        query = self.db.query(PageView)

        if start_date:
            query = query.filter(PageView.timestamp >= start_date)
        if end_date:
            query = query.filter(PageView.timestamp <= end_date)

        total_views = query.count()
        unique_visitors = query.distinct(PageView.session_id).count()

        # 最受欢迎的页面
        popular_pages = (
            query.with_entities(
                PageView.path,
                func.count(PageView.id).label('views')
            )
            .group_by(PageView.path)
            .order_by(func.count(PageView.id).desc())
            .limit(10)
            .all()
        )

        return {
            'total_views': total_views,
            'unique_visitors': unique_visitors,
            'popular_pages': [
                {'path': path, 'views': views}
                for path, views in popular_pages
            ]
        }

    # ==================== 事件追踪 ====================

    def track_event(
        self,
        event: EventCreate,
        session_id: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> Event:
        """追踪自定义事件"""

        db_event = Event(
            **event.dict(),
            session_id=session_id,
            user_id=user_id,
            timestamp=datetime.utcnow()
        )

        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)
        return db_event

    def get_events(
        self,
        category: Optional[str] = None,
        action: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[Event]:
        """获取事件记录"""

        query = self.db.query(Event)

        if category:
            query = query.filter(Event.category == category)
        if action:
            query = query.filter(Event.action == action)
        if start_date:
            query = query.filter(Event.timestamp >= start_date)
        if end_date:
            query = query.filter(Event.timestamp <= end_date)

        return query.order_by(Event.timestamp.desc()).limit(limit).all()

    def get_events_stats(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """获取事件统计"""

        query = self.db.query(Event)

        if start_date:
            query = query.filter(Event.timestamp >= start_date)
        if end_date:
            query = query.filter(Event.timestamp <= end_date)

        total_events = query.count()

        # 按类别统计
        category_stats = (
            query.with_entities(
                Event.category,
                func.count(Event.id).label('count')
            )
            .group_by(Event.category)
            .all()
        )

        # 按操作统计
        action_stats = (
            query.with_entities(
                Event.action,
                func.count(Event.id).label('count')
            )
            .group_by(Event.action)
            .order_by(func.count(Event.id).desc())
            .limit(10)
            .all()
        )

        return {
            'total_events': total_events,
            'category_stats': [
                {'category': cat, 'count': count}
                for cat, count in category_stats
            ],
            'top_actions': [
                {'action': action, 'count': count}
                for action, count in action_stats
            ]
        }

    # ==================== 转化追踪 ====================

    def track_conversion(
        self,
        conversion: ConversionCreate,
        session_id: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> Conversion:
        """追踪转化"""

        db_conversion = Conversion(
            **conversion.dict(),
            session_id=session_id,
            user_id=user_id,
            timestamp=datetime.utcnow()
        )

        self.db.add(db_conversion)
        self.db.commit()
        self.db.refresh(db_conversion)
        return db_conversion

    def get_conversions(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 100
    ) -> List[Conversion]:
        """获取转化记录"""

        query = self.db.query(Conversion)

        if start_date:
            query = query.filter(Conversion.timestamp >= start_date)
        if end_date:
            query = query.filter(Conversion.timestamp <= end_date)

        return query.order_by(Conversion.timestamp.desc()).limit(limit).all()

    def get_conversion_stats(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """获取转化统计"""

        query = self.db.query(Conversion)

        if start_date:
            query = query.filter(Conversion.timestamp >= start_date)
        if end_date:
            query = query.filter(Conversion.timestamp <= end_date)

        total_conversions = query.count()
        total_value = query.with_entities(
            func.sum(Conversion.value)
        ).scalar() or 0

        # 按类型统计
        type_stats = (
            query.with_entities(
                Conversion.conversion_type,
                func.count(Conversion.id).label('count'),
                func.sum(Conversion.value).label('total_value')
            )
            .group_by(Conversion.conversion_type)
            .all()
        )

        return {
            'total_conversions': total_conversions,
            'total_value': float(total_value),
            'type_stats': [
                {
                    'type': conv_type,
                    'count': count,
                    'total_value': float(value)
                }
                for conv_type, count, value in type_stats
            ]
        }

    # ==================== 仪表盘数据 ====================

    def get_dashboard_data(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> AnalyticsDashboard:
        """获取仪表盘数据"""

        # 默认时间范围：最近7天
        if not end_date:
            end_date = datetime.utcnow()
        if not start_date:
            start_date = end_date - timedelta(days=7)

        # 获取各项统计
        page_view_stats = self.get_page_views_stats(start_date, end_date)
        event_stats = self.get_events_stats(start_date, end_date)
        conversion_stats = self.get_conversion_stats(start_date, end_date)

        # 流量趋势
        traffic_trend = (
            self.db.query(
                func.date(PageView.timestamp).label('date'),
                func.count(PageView.id).label('views')
            )
            .filter(
                and_(
                    PageView.timestamp >= start_date,
                    PageView.timestamp <= end_date
                )
            )
            .group_by(func.date(PageView.timestamp))
            .order_by(func.date(PageView.timestamp))
            .all()
        )

        # 用户活跃度
        active_users = (
            self.db.query(func.count(func.distinct(PageView.user_id)))
            .filter(
                and_(
                    PageView.timestamp >= start_date,
                    PageView.timestamp <= end_date,
                    PageView.user_id.isnot(None)
                )
            )
            .scalar() or 0
        )

        return AnalyticsDashboard(
            period_start=start_date,
            period_end=end_date,
            total_page_views=page_view_stats['total_views'],
            unique_visitors=page_view_stats['unique_visitors'],
            total_events=event_stats['total_events'],
            total_conversions=conversion_stats['total_conversions'],
            conversion_rate=(
                conversion_stats['total_conversions'] /
                page_view_stats['unique_visitors']
                if page_view_stats['unique_visitors'] > 0
                else 0
            ),
            active_users=active_users,
            traffic_trend=[
                {'date': str(date), 'views': views}
                for date, views in traffic_trend
            ],
            popular_pages=page_view_stats['popular_pages'][:5],
            top_events=event_stats['top_actions'][:5]
        )

    # ==================== 流量分析 ====================

    def get_traffic_analytics(
        self,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> TrafficAnalytics:
        """获取流量分析"""

        # 默认时间范围：最近30天
        if not end_date:
            end_date = datetime.utcnow()
        if not start_date:
            start_date = end_date - timedelta(days=30)

        # 流量来源统计
        traffic_sources = (
            self.db.query(
                PageView.traffic_source,
                func.count(PageView.id).label('views')
            )
            .filter(
                and_(
                    PageView.timestamp >= start_date,
                    PageView.timestamp <= end_date
                )
            )
            .group_by(PageView.traffic_source)
            .all()
        )

        # 设备类型统计
        device_types = (
            self.db.query(
                PageView.device_type,
                func.count(PageView.id).label('views')
            )
            .filter(
                and_(
                    PageView.timestamp >= start_date,
                    PageView.timestamp <= end_date
                )
            )
            .group_by(PageView.device_type)
            .all()
        )

        # 浏览器统计
        browsers = (
            self.db.query(
                PageView.browser,
                func.count(PageView.id).label('views')
            )
            .filter(
                and_(
                    PageView.timestamp >= start_date,
                    PageView.timestamp <= end_date
                )
            )
            .group_by(PageView.browser)
            .order_by(func.count(PageView.id).desc())
            .limit(10)
            .all()
        )

        return TrafficAnalytics(
            period_start=start_date,
            period_end=end_date,
            traffic_sources=[
                {'source': source, 'views': views}
                for source, views in traffic_sources
            ],
            device_types=[
                {'device': device, 'views': views}
                for device, views in device_types
            ],
            browsers=[
                {'browser': browser, 'views': views}
                for browser, views in browsers
            ]
        )

    # ==================== 数据清理 ====================

    def cleanup_old_data(self, days_to_keep: int = 90) -> int:
        """清理旧数据"""

        cutoff_date = datetime.utcnow() - timedelta(days=days_to_keep)

        # 删除旧的页面浏览记录
        deleted_page_views = (
            self.db.query(PageView)
            .filter(PageView.timestamp < cutoff_date)
            .delete()
        )

        # 删除旧的事件记录
        deleted_events = (
            self.db.query(Event)
            .filter(Event.timestamp < cutoff_date)
            .delete()
        )

        # 删除旧的转化记录
        deleted_conversions = (
            self.db.query(Conversion)
            .filter(Conversion.timestamp < cutoff_date)
            .delete()
        )

        self.db.commit()

        return deleted_page_views + deleted_events + deleted_conversions
