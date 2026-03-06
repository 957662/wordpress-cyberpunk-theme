"""
Unit tests for system monitoring functionality
"""
import pytest
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.system_metrics import SystemMetric
from app.api.v1.system import get_system_status, get_cpu_info, get_memory_info
from app.api.v1.metrics import query_metrics, aggregate_metrics


@pytest.mark.asyncio
async def test_get_system_status_success(db_session: AsyncSession, mock_current_user):
    """Test successful system status retrieval"""
    response = await get_system_status(current_user=mock_current_user)

    assert response.timestamp is not None
    assert response.uptime >= 0
    assert response.system is not None
    assert response.cpu is not None
    assert response.memory is not None
    assert response.disk is not None
    assert isinstance(response.disk, list)


@pytest.mark.asyncio
async def test_get_cpu_info_success(db_session: AsyncSession, mock_current_user):
    """Test successful CPU info retrieval"""
    response = await get_cpu_info(current_user=mock_current_user)

    assert response.percent >= 0
    assert response.percent <= 100
    assert response.count_physical > 0
    assert response.count_logical > 0
    assert response.freq_current >= 0


@pytest.mark.asyncio
async def test_get_memory_info_success(db_session: AsyncSession, mock_current_user):
    """Test successful memory info retrieval"""
    response = await get_memory_info(current_user=mock_current_user)

    assert response.total > 0
    assert response.used >= 0
    assert response.free >= 0
    assert response.available >= 0
    assert response.percent >= 0
    assert response.percent <= 100


@pytest.mark.asyncio
async def test_query_metrics_empty(db_session: AsyncSession, mock_current_user):
    """Test querying metrics when no data exists"""
    response = await query_metrics(
        metric_name='cpu_percent',
        start_time=datetime.utcnow() - timedelta(hours=1),
        end_time=datetime.utcnow(),
        limit=100,
        current_user=mock_current_user,
        db=db_session
    )

    assert response.metric_name == 'cpu_percent'
    assert response.data == []
    assert response.total_points == 0


@pytest.mark.asyncio
async def test_query_metrics_with_data(db_session: AsyncSession, mock_current_user):
    """Test querying metrics with existing data"""
    # Create test metrics
    now = datetime.utcnow()
    for i in range(10):
        metric = SystemMetric(
            metric_name='cpu_percent',
            metric_value=50.0 + i,
            unit='percent',
            timestamp=now - timedelta(minutes=i)
        )
        db_session.add(metric)

    await db_session.commit()

    # Query metrics
    response = await query_metrics(
        metric_name='cpu_percent',
        start_time=now - timedelta(hours=1),
        end_time=now,
        limit=100,
        current_user=mock_current_user,
        db=db_session
    )

    assert response.metric_name == 'cpu_percent'
    assert len(response.data) == 10
    assert response.total_points == 10
    assert response.data[0].value == 50.0


@pytest.mark.asyncio
async def test_aggregate_metrics_avg(db_session: AsyncSession, mock_current_user):
    """Test metric aggregation with average function"""
    now = datetime.utcnow()

    # Create test metrics
    for i in range(10):
        metric = SystemMetric(
            metric_name='memory_percent',
            metric_value=60.0 + i,
            unit='percent',
            timestamp=now - timedelta(minutes=i)
        )
        db_session.add(metric)

    await db_session.commit()

    # Aggregate metrics
    response = await aggregate_metrics(
        metric_name='memory_percent',
        aggregation='avg',
        interval='1h',
        start_time=now - timedelta(hours=1),
        end_time=now,
        current_user=mock_current_user,
        db=db_session
    )

    assert response.metric_name == 'memory_percent'
    assert response.aggregation == 'avg'
    assert response.interval == '1h'
    assert len(response.data) > 0
    assert response.data[0]['value'] > 0


@pytest.mark.asyncio
async def test_ingest_metrics_success(db_session: AsyncSession, mock_current_user):
    """Test successful metric ingestion"""
    from app.api.v1.metrics import ingest_metrics, BulkMetricData

    data = BulkMetricData(
        metrics=[
            {
                'metric_name': 'cpu_percent',
                'metric_value': 75.5,
                'unit': 'percent',
                'timestamp': datetime.utcnow()
            },
            {
                'metric_name': 'memory_percent',
                'metric_value': 82.3,
                'unit': 'percent',
                'timestamp': datetime.utcnow()
            }
        ]
    )

    response = await ingest_metrics(
        data=data,
        current_user=mock_current_user,
        db=db_session
    )

    assert response.success is True
    assert response.inserted_count == 2
    assert len(response.errors) == 0


@pytest.mark.asyncio
async def test_cleanup_old_metrics_dry_run(db_session: AsyncSession, mock_current_user):
    """Test cleanup old metrics in dry run mode"""
    from app.api.v1.metrics import cleanup_old_metrics

    now = datetime.utcnow()

    # Create old metrics
    for i in range(5):
        metric = SystemMetric(
            metric_name='cpu_percent',
            metric_value=50.0,
            unit='percent',
            timestamp=now - timedelta(days=35)  # Older than 30 days
        )
        db_session.add(metric)

    await db_session.commit()

    # Run cleanup in dry run mode
    response = await cleanup_old_metrics(
        retention_days=30,
        dry_run=True,
        current_user=mock_current_user,
        db=db_session
    )

    assert response.dry_run is True
    assert response.metrics_deleted >= 0


@pytest.mark.asyncio
async def test_get_realtime_metrics(db_session: AsyncSession, mock_current_user):
    """Test getting realtime metrics"""
    from app.api.v1.metrics import get_realtime_metrics

    now = datetime.utcnow()

    # Create latest metrics
    for name in ['cpu_percent', 'memory_percent', 'disk_percent']:
        metric = SystemMetric(
            metric_name=name,
            metric_value=65.0,
            unit='percent',
            timestamp=now
        )
        db_session.add(metric)

    await db_session.commit()

    response = await get_realtime_metrics(
        metric_names=['cpu_percent', 'memory_percent', 'disk_percent'],
        current_user=mock_current_user,
        db=db_session
    )

    assert 'timestamp' in response
    assert 'metrics' in response
    assert 'cpu_percent' in response['metrics']
    assert response['metrics']['cpu_percent'] is not None
    assert response['metrics']['cpu_percent']['value'] == 65.0


@pytest.fixture
def mock_current_user():
    """Mock authenticated user"""
    return {
        'id': 'test-user-id',
        'email': 'test@example.com',
        'is_active': True
    }


@pytest.fixture
async def db_session(test_db):
    """Provide test database session"""
    async with test_db() as session:
        yield session
        await session.rollback()
