"""
Prometheus metrics integration for application monitoring
"""
from prometheus_client import Counter, Histogram, Gauge, Info, start_http_server
from functools import wraps
import time
from typing import Callable, Any
from contextlib import contextmanager

# HTTP metrics
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

http_request_duration_seconds = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

http_requests_in_progress = Gauge(
    'http_requests_in_progress',
    'HTTP requests currently in progress',
    ['method', 'endpoint']
)

# Database metrics
db_query_duration_seconds = Histogram(
    'db_query_duration_seconds',
    'Database query latency',
    ['operation', 'table']
)

db_connections_total = Gauge(
    'db_connections_total',
    'Total database connections',
    ['state']  # idle, active
)

db_transactions_total = Counter(
    'db_transactions_total',
    'Total database transactions',
    ['status']  # committed, rolled_back
)

# Cache metrics
cache_hits_total = Counter(
    'cache_hits_total',
    'Total cache hits',
    ['backend']
)

cache_misses_total = Counter(
    'cache_misses_total',
    'Total cache misses',
    ['backend']
)

cache_size_bytes = Gauge(
    'cache_size_bytes',
    'Current cache size in bytes',
    ['backend']
)

# System metrics
cpu_usage_percent = Gauge(
    'cpu_usage_percent',
    'Current CPU usage percentage'
)

memory_usage_bytes = Gauge(
    'memory_usage_bytes',
    'Current memory usage in bytes',
    ['type']  # used, available, cached, buffers
)

disk_usage_bytes = Gauge(
    'disk_usage_bytes',
    'Current disk usage in bytes',
    ['mountpoint', 'type']  # used, free, total
)

# Application metrics
active_users_total = Gauge(
    'active_users_total',
    'Total active users',
    ['timeframe']  # daily, weekly, monthly
)

articles_total = Gauge(
    'articles_total',
    'Total number of articles',
    ['status']  # published, draft, archived
)

comments_total = Gauge(
    'comments_total',
    'Total number of comments',
    ['status']  # approved, pending, spam
)

# Background task metrics
background_tasks_total = Counter(
    'background_tasks_total',
    'Total background tasks executed',
    ['task_name', 'status']
)

background_task_duration_seconds = Histogram(
    'background_task_duration_seconds',
    'Background task execution duration',
    ['task_name']
)

# Error metrics
errors_total = Counter(
    'errors_total',
    'Total errors',
    ['type', 'severity']
)

# WebSocket metrics
websocket_connections_total = Gauge(
    'websocket_connections_total',
    'Total active WebSocket connections'
)

websocket_messages_total = Counter(
    'websocket_messages_total',
    'Total WebSocket messages',
    ['direction']  # incoming, outgoing
)

# API rate limiting metrics
rate_limit_hits_total = Counter(
    'rate_limit_hits_total',
    'Total rate limit violations',
    ['endpoint', 'user_id']
)

# Search metrics
search_queries_total = Counter(
    'search_queries_total',
    'Total search queries',
    ['type']  # fulltext, filtered, advanced
)

search_duration_seconds = Histogram(
    'search_duration_seconds',
    'Search query duration',
    ['type']
)

# Content metrics
content_word_count = Histogram(
    'content_word_count',
    'Word count distribution of content',
    ['content_type']
)

content_reading_time_minutes = Histogram(
    'content_reading_time_minutes',
    'Estimated reading time of content',
    ['content_type']
)

# Application info
app_info = Info(
    'app',
    'Application information'
)


def track_http_request(method: str, endpoint: str):
    """Decorator to track HTTP request metrics"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            start_time = time.time()
            status = '200'

            http_requests_in_progress.labels(
                method=method,
                endpoint=endpoint
            ).inc()

            try:
                result = await func(*args, **kwargs)
                return result
            except Exception as e:
                status = '500'
                raise
            finally:
                duration = time.time() - start_time

                http_requests_total.labels(
                    method=method,
                    endpoint=endpoint,
                    status=status
                ).inc()

                http_request_duration_seconds.labels(
                    method=method,
                    endpoint=endpoint
                ).observe(duration)

                http_requests_in_progress.labels(
                    method=method,
                    endpoint=endpoint
                ).dec()

        return wrapper
    return decorator


@contextmanager
def track_db_query(operation: str, table: str):
    """Context manager to track database query metrics"""
    start_time = time.time()
    try:
        yield
    finally:
        duration = time.time() - start_time
        db_query_duration_seconds.labels(
            operation=operation,
            table=table
        ).observe(duration)


@contextmanager
def track_cache_operation(backend: str, operation: str):
    """Context manager to track cache operations"""
    try:
        yield
        if operation == 'hit':
            cache_hits_total.labels(backend=backend).inc()
        elif operation == 'miss':
            cache_misses_total.labels(backend=backend).inc()
    except Exception:
        pass


def track_background_task(task_name: str):
    """Decorator to track background task metrics"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            start_time = time.time()
            status = 'success'

            try:
                result = await func(*args, **kwargs)
                return result
            except Exception as e:
                status = 'failure'
                raise
            finally:
                duration = time.time() - start_time

                background_tasks_total.labels(
                    task_name=task_name,
                    status=status
                ).inc()

                background_task_duration_seconds.labels(
                    task_name=task_name
                ).observe(duration)

        return wrapper
    return decorator


def track_search_query(search_type: str):
    """Decorator to track search query metrics"""
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            start_time = time.time()

            search_queries_total.labels(type=search_type).inc()

            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration = time.time() - start_time
                search_duration_seconds.labels(type=search_type).observe(duration)

        return wrapper
    return decorator


def init_prometheus_metrics(
    app_name: str,
    app_version: str,
    start_server: bool = True,
    port: int = 9090
):
    """
    Initialize Prometheus metrics

    Args:
        app_name: Application name
        app_version: Application version
        start_server: Whether to start Prometheus HTTP server
        port: Port for Prometheus server
    """
    # Set application info
    app_info.info({
        'name': app_name,
        'version': app_version
    })

    # Start Prometheus HTTP server if requested
    if start_server:
        start_http_server(port)

    print(f"Prometheus metrics available at http://localhost:{port}/metrics")
