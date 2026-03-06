"""
Metrics collection and aggregation endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
import json

from ...core.deps import get_db, get_current_user
from ...core.database import get_db_session
from ...models.user import User

router = APIRouter()


class MetricDataPoint(BaseModel):
    """Single metric data point"""
    timestamp: datetime
    value: float
    unit: Optional[str] = None
    tags: Optional[Dict[str, Any]] = None


class MetricQuery(BaseModel):
    """Query parameters for metrics"""
    metric_name: str
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    aggregation: Optional[str] = Field(
        None,
        description="Aggregation function: avg, min, max, sum, count"
    )
    interval: Optional[str] = Field(
        None,
        description="Time interval for grouping: 1m, 5m, 15m, 1h, 1d"
    )
    limit: int = Field(100, ge=1, le=10000)


class MetricResponse(BaseModel):
    """Response with metric data"""
    metric_name: str
    data: List[MetricDataPoint]
    aggregation: Optional[str] = None
    total_points: int


class MetricsSummary(BaseModel):
    """Summary of multiple metrics"""
    time_range: Dict[str, datetime]
    metrics: Dict[str, Dict[str, float]]
    metadata: Dict[str, Any]


class AggregatedMetrics(BaseModel):
    """Aggregated metrics response"""
    metric_name: str
    aggregation: str
    interval: str
    data: List[Dict[str, Any]]
    start_time: datetime
    end_time: datetime


class BulkMetricData(BaseModel):
    """Bulk metric data for insertion"""
    metrics: List[Dict[str, Any]]


class MetricIngestResponse(BaseModel):
    """Response for metric ingestion"""
    success: bool
    inserted_count: int
    errors: List[str] = []


@router.post("/ingest", response_model=MetricIngestResponse)
async def ingest_metrics(
    data: BulkMetricData,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Ingest multiple metric data points

    Requires authentication.
    """
    from ...models.system_metrics import SystemMetric

    inserted_count = 0
    errors = []

    try:
        for metric_data in data.metrics:
            try:
                metric = SystemMetric(
                    metric_name=metric_data.get('metric_name'),
                    metric_value=metric_data.get('metric_value'),
                    unit=metric_data.get('unit'),
                    tags=metric_data.get('tags'),
                    timestamp=metric_data.get('timestamp', datetime.utcnow())
                )
                db.add(metric)
                inserted_count += 1
            except Exception as e:
                errors.append(f"Failed to insert metric: {str(e)}")

        await db.commit()

        return MetricIngestResponse(
            success=len(errors) == 0,
            inserted_count=inserted_count,
            errors=errors
        )

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to ingest metrics: {str(e)}"
        )


@router.get("/query", response_model=MetricResponse)
async def query_metrics(
    metric_name: str,
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    aggregation: Optional[str] = None,
    interval: Optional[str] = None,
    limit: int = Query(100, ge=1, le=10000),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Query metrics with optional aggregation and time grouping

    Args:
        metric_name: Name of the metric to query
        start_time: Start of time range (default: 24 hours ago)
        end_time: End of time range (default: now)
        aggregation: Aggregation function (avg, min, max, sum, count)
        interval: Time interval for grouping (1m, 5m, 15m, 1h, 1d)
        limit: Maximum number of data points to return

    Requires authentication.
    """
    from ...models.system_metrics import SystemMetric

    # Set default time range
    if not end_time:
        end_time = datetime.utcnow()
    if not start_time:
        start_time = end_time - timedelta(hours=24)

    # Build base query
    query = select(SystemMetric).where(
        and_(
            SystemMetric.metric_name == metric_name,
            SystemMetric.timestamp >= start_time,
            SystemMetric.timestamp <= end_time
        )
    ).order_by(SystemMetric.timestamp.asc()).limit(limit)

    result = await db.execute(query)
    metrics = result.scalars().all()

    # Convert to response format
    data_points = [
        MetricDataPoint(
            timestamp=m.timestamp,
            value=float(m.metric_value),
            unit=m.unit,
            tags=m.tags
        )
        for m in metrics
    ]

    return MetricResponse(
        metric_name=metric_name,
        data=data_points,
        aggregation=aggregation,
        total_points=len(data_points)
    )


@router.get("/aggregate", response_model=AggregatedMetrics)
async def aggregate_metrics(
    metric_name: str,
    aggregation: str = Query(..., regex="^(avg|min|max|sum|count)$"),
    interval: str = Query(..., regex="^(1m|5m|15m|1h|1d)$"),
    start_time: Optional[datetime] = None,
    end_time: Optional[datetime] = None,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get aggregated metrics with time-based grouping

    Args:
        metric_name: Name of the metric to aggregate
        aggregation: Aggregation function (avg, min, max, sum, count)
        interval: Time interval for grouping (1m, 5m, 15m, 1h, 1d)
        start_time: Start of time range (default: 24 hours ago)
        end_time: End of time range (default: now)

    Requires authentication.
    """
    from ...models.system_metrics import SystemMetric

    # Set default time range
    if not end_time:
        end_time = datetime.utcnow()
    if not start_time:
        start_time = end_time - timedelta(hours=24)

    # Parse interval
    interval_seconds = {
        '1m': 60,
        '5m': 300,
        '15m': 900,
        '1h': 3600,
        '1d': 86400
    }.get(interval, 60)

    # Build aggregation query
    agg_func = {
        'avg': func.avg(SystemMetric.metric_value),
        'min': func.min(SystemMetric.metric_value),
        'max': func.max(SystemMetric.metric_value),
        'sum': func.sum(SystemMetric.metric_value),
        'count': func.count(SystemMetric.metric_value)
    }[aggregation]

    # Create time buckets
    time_bucket = func.date_trunc(
        interval.replace('1', '') if interval in ['1m', '1h', '1d'] else 'hour',
        SystemMetric.timestamp
    )

    query = select(
        time_bucket.label('time_bucket'),
        agg_func.label('value')
    ).where(
        and_(
            SystemMetric.metric_name == metric_name,
            SystemMetric.timestamp >= start_time,
            SystemMetric.timestamp <= end_time
        )
    ).group_by(time_bucket).order_by(time_bucket.asc())

    result = await db.execute(query)
    aggregated_data = [
        {
            'timestamp': row.time_bucket,
            'value': float(row.value) if row.value is not None else 0.0
        }
        for row in result
    ]

    return AggregatedMetrics(
        metric_name=metric_name,
        aggregation=aggregation,
        interval=interval,
        data=aggregated_data,
        start_time=start_time,
        end_time=end_time
    )


@router.get("/summary", response_model=MetricsSummary)
async def get_metrics_summary(
    hours: int = Query(24, ge=1, le=720),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get summary statistics for key metrics over the specified time period

    Args:
        hours: Number of hours to look back (default: 24, max: 720)

    Requires authentication.
    """
    from ...models.system_metrics import SystemMetric

    end_time = datetime.utcnow()
    start_time = end_time - timedelta(hours=hours)

    # Get summary for key metrics
    key_metrics = [
        'cpu_percent',
        'memory_percent',
        'disk_percent',
        'load_average_1m'
    ]

    metrics_data = {}

    for metric_name in key_metrics:
        query = select(
            func.avg(SystemMetric.metric_value).label('avg'),
            func.min(SystemMetric.metric_value).label('min'),
            func.max(SystemMetric.metric_value).label('max'),
            func.count(SystemMetric.metric_value).label('count')
        ).where(
            and_(
                SystemMetric.metric_name == metric_name,
                SystemMetric.timestamp >= start_time,
                SystemMetric.timestamp <= end_time
            )
        )

        result = await db.execute(query)
        row = result.first()

        if row and row.count > 0:
            metrics_data[metric_name] = {
                'avg': float(row.avg) if row.avg else 0.0,
                'min': float(row.min) if row.min else 0.0,
                'max': float(row.max) if row.max else 0.0,
                'count': row.count
            }

    return MetricsSummary(
        time_range={
            'start': start_time,
            'end': end_time
        },
        metrics=metrics_data,
        metadata={
            'generated_at': datetime.utcnow(),
            'period_hours': hours
        }
    )


@router.get("/available")
async def list_available_metrics(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    List all available metric names and their metadata

    Requires authentication.
    """
    from ...models.system_metrics import SystemMetric

    query = select(
        SystemMetric.metric_name,
        func.count(SystemMetric.id).label('count'),
        func.min(SystemMetric.timestamp).label('first_seen'),
        func.max(SystemMetric.timestamp).label('last_seen')
    ).group_by(SystemMetric.metric_name).order_by(SystemMetric.metric_name)

    result = await db.execute(query)

    metrics = [
        {
            'name': row.metric_name,
            'data_points': row.count,
            'first_seen': row.first_seen,
            'last_seen': row.last_seen
        }
        for row in result
    ]

    return {'metrics': metrics}


@router.delete("/cleanup")
async def cleanup_old_metrics(
    retention_days: int = Query(30, ge=1, le=365),
    dry_run: bool = Query(True, description="If true, don't actually delete"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Cleanup metrics older than specified retention period

    Args:
        retention_days: Number of days to retain (default: 30)
        dry_run: If true, only report what would be deleted

    Requires authentication.
    """
    from ...models.system_metrics import SystemMetric

    cutoff_date = datetime.utcnow() - timedelta(days=retention_days)

    # Count metrics to be deleted
    count_query = select(func.count(SystemMetric.id)).where(
        SystemMetric.timestamp < cutoff_date
    )
    result = await db.execute(count_query)
    count = result.scalar() or 0

    if not dry_run:
        # Delete old metrics
        delete_query = SystemMetric.__table__.delete().where(
            SystemMetric.timestamp < cutoff_date
        )
        await db.execute(delete_query)
        await db.commit()

    return {
        'retention_days': retention_days,
        'cutoff_date': cutoff_date,
        'metrics_deleted': count,
        'dry_run': dry_run
    }


@router.get("/realtime")
async def get_realtime_metrics(
    metric_names: List[str] = Query(..., description="List of metric names to fetch"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get the latest value for specified metrics

    Requires authentication.
    """
    from ...models.system_metrics import SystemMetric

    results = {}

    for metric_name in metric_names:
        query = select(SystemMetric).where(
            SystemMetric.metric_name == metric_name
        ).order_by(SystemMetric.timestamp.desc()).limit(1)

        result = await db.execute(query)
        metric = result.scalar_one_or_none()

        if metric:
            results[metric_name] = {
                'value': float(metric.metric_value),
                'unit': metric.unit,
                'timestamp': metric.timestamp,
                'tags': metric.tags
            }
        else:
            results[metric_name] = None

    return {
        'timestamp': datetime.utcnow(),
        'metrics': results
    }
