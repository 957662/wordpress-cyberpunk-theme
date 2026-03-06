# Quick Start Guide - New Features

## 🚀 System Monitoring

### Backend Setup

1. **Run the migration:**
```bash
psql -U cyberpress -d cyberpress -f database/migrations/20260307_create_system_monitoring_tables.sql
```

2. **Add system monitoring to main.py:**
```python
from app.api.v1 import system

api_router = APIRouter()
api_router.include_router(system.router, prefix="/system", tags=["system"])
```

3. **Test the endpoint:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/system/status
```

### Frontend Usage

```tsx
import SystemMonitor from '@/components/system-metrics/SystemMonitor';

export default function MonitoringPage() {
  return (
    <div className="container">
      <SystemMonitor />
    </div>
  );
}
```

## 📦 Batch Operations

### Backend Service

```python
from app.services.batch_operations import BatchOperationsService
from app.models.post import Post

async def batch_delete_posts(post_ids: list[int], db: AsyncSession):
    service = BatchOperationsService(Post, db)
    result = await service.batch_delete(post_ids)
    return result
```

### Frontend Component

```tsx
import { BatchOperationPanel } from '@/components/batch/BatchOperationPanel';

function PostsList() {
  const [posts, setPosts] = useState([]);

  const handleBatchDelete = async (ids) => {
    const response = await fetch('/api/v1/posts/batch', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
    return await response.json();
  };

  return (
    <BatchOperationPanel
      items={posts}
      itemType="posts"
      onBatchDelete={handleBatchDelete}
    />
  );
}
```

## 🔒 Data Validation

### Backend Usage

```python
from app.services.data_validator import validator_service

# Validate and sanitize input
result = validator_service.validate_and_sanitize(
    data=user_input,
    schema=UserCreateSchema,
    sanitize_html=True
)

if result.is_valid:
    save_to_db(result.sanitized_data)
else:
    return {'errors': result.errors}
```

### Sanitize HTML Content

```python
from app.services.data_validator import sanitize_html

clean_html = sanitize_html(
    html=user_content,
    allow_tags=['p', 'br', 'strong', 'em']
)
```

### Validate User Input

```python
from app.services.data_validator import sanitize_input

clean_text = sanitize_input(user_comment)
```

## 📊 Analytics & Metrics

### Prometheus Metrics

```python
from app.core.prometheus import (
    http_requests_total,
    track_http_request,
    init_prometheus_metrics
)

# Initialize metrics
init_prometheus_metrics(
    app_name="CyberPress",
    app_version="1.0.0",
    start_server=True,
    port=9090
)

# Track an endpoint
@track_http_request('GET', '/api/posts')
async def get_posts():
    return posts
```

### Query Metrics API

```bash
# Get CPU metrics for last hour
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/v1/metrics/query?metric_name=cpu_percent&hours=1"

# Get aggregated metrics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:8000/api/v1/metrics/aggregate?metric_name=memory_percent&aggregation=avg&interval=5m"
```

### Frontend Charts

```tsx
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';

const chartData = {
  title: 'Daily Active Users',
  description: 'User activity over time',
  data: [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 150 },
    { name: 'Wed', value: 180 },
    { name: 'Thu', value: 200 },
    { name: 'Fri', value: 170 },
  ],
  type: 'line',
  colorScheme: 'vibrant',
  showTrend: true,
};

<AnalyticsChart
  chartData={chartData}
  onRefresh={refreshData}
  height={300}
/>
```

## 🔔 Notification Center

### Basic Usage

```tsx
import NotificationCenter from '@/components/notifications/NotificationCenter';

function Layout() {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'info',
      category: 'system',
      title: 'System Update',
      message: 'System will restart in 10 minutes',
      timestamp: new Date(),
      read: false,
    },
  ]);

  const handleMarkRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? {...n, read: true} : n)
    );
  };

  return (
    <NotificationCenter
      notifications={notifications}
      onMarkRead={handleMarkRead}
      refreshable
      onRefresh={() => fetchNotifications()}
    />
  );
}
```

## 🎯 Filter Panel

### Usage Example

```tsx
import { FilterPanel } from '@/components/filter-panels/FilterPanel';

const filterGroups = [
  {
    id: 'status',
    label: 'Status',
    type: 'checkbox',
    options: [
      { label: 'Published', value: 'published', count: 45 },
      { label: 'Draft', value: 'draft', count: 12 },
      { label: 'Archived', value: 'archived', count: 8 },
    ],
  },
  {
    id: 'date',
    label: 'Publication Date',
    type: 'date',
  },
  {
    id: 'views',
    label: 'View Count',
    type: 'range',
    min: 0,
    max: 10000,
    step: 100,
  },
];

function ContentList() {
  const [filters, setFilters] = useState({});

  return (
    <FilterPanel
      groups={filterGroups}
      filters={filters}
      onChange={setFilters}
      onReset={() => setFilters({})}
    />
  );
}
```

## 🧪 Running Tests

### System Monitoring Tests
```bash
pytest backend/app/tests/test_system_monitoring.py -v
```

### With Coverage
```bash
pytest backend/app/tests/test_system_monitoring.py \
  --cov=app.api.v1.system \
  --cov=app.api.v1.metrics \
  --cov-report=html
```

## 📡 API Endpoints Reference

### System Monitoring
- `GET /api/v1/system/info` - System information
- `GET /api/v1/system/cpu` - CPU usage
- `GET /api/v1/system/memory` - Memory usage
- `GET /api/v1/system/disk` - Disk usage
- `GET /api/v1/system/status` - Complete status
- `GET /api/v1/system/processes` - Running processes
- `POST /api/v1/system/cache/clear` - Clear cache

### Metrics
- `POST /api/v1/metrics/ingest` - Ingest metrics
- `GET /api/v1/metrics/query` - Query metrics
- `GET /api/v1/metrics/aggregate` - Aggregated metrics
- `GET /api/v1/metrics/summary` - Metrics summary
- `GET /api/v1/metrics/available` - Available metrics
- `DELETE /api/v1/metrics/cleanup` - Cleanup old metrics
- `GET /api/v1/metrics/realtime` - Realtime values

## 🔧 Configuration

### Environment Variables
```bash
# System Monitoring
SYSTEM_MONITORING_ENABLED=true
METRICS_RETENTION_DAYS=30

# Prometheus
PROMETHEUS_PORT=9090
PROMETHEUS_ENABLED=true

# Cache
REDIS_URL=redis://localhost:6379/0
CACHE_TTL=3600
```

### Settings Update
```python
# backend/app/core/config.py
class Settings(BaseSettings):
    # System Monitoring
    SYSTEM_MONITORING_ENABLED: bool = True
    METRICS_RETENTION_DAYS: int = 30

    # Prometheus
    PROMETHEUS_PORT: int = 9090
    PROMETHEUS_ENABLED: bool = True
```

## 📚 Component Props Reference

### SystemMonitor
No props required - auto-fetches system data

### BatchOperationPanel
```typescript
interface Props {
  items: BatchItem[];
  itemType: 'posts' | 'comments' | 'users' | 'media';
  onBatchDelete?: (ids: ID[]) => Promise<Result>;
  onBatchUpdate?: (ids: ID[], data: any) => Promise<Result>;
  onBatchExport?: (ids: ID[]) => Promise<void>;
  onBatchImport?: (file: File) => Promise<Result>;
  selectable?: boolean;
  maxSelection?: number;
}
```

### AnalyticsChart
```typescript
interface Props {
  chartData: {
    title: string;
    description?: string;
    data: DataPoint[];
    type?: 'line' | 'area' | 'bar' | 'pie';
    colorScheme?: string;
    showTrend?: boolean;
  };
  onRefresh?: () => void;
  onExport?: () => void;
  loading?: boolean;
  height?: number;
}
```

### NotificationCenter
```typescript
interface Props {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDelete?: (id: string) => void;
  onClearAll?: () => void;
  onActionClick?: (notification: Notification) => void;
  refreshable?: boolean;
  onRefresh?: () => void;
  loading?: boolean;
  maxDisplay?: number;
}
```

## 🎨 Styling Customization

### Color Schemes for Charts
Available schemes:
- `default` - Blue, green, amber, red, purple, pink
- `pastel` - Softer variants
- `vibrant` - Bold, saturated colors
- `monochrome` - Gray scale

### Status Colors
- `< 50%`: Green (good)
- `50-80%`: Yellow (warning)
- `> 80%`: Red (critical)

## 🐛 Troubleshooting

### System Monitor Not Updating
- Check authentication token
- Verify backend is running
- Check browser console for errors

### Batch Operations Failing
- Verify all items are selected
- Check network requests in browser
- Review backend logs

### Metrics Not Appearing
- Ensure Prometheus server is running
- Check metric ingestion is working
- Verify database connection

## 📞 Support

For issues or questions:
1. Check the main documentation
2. Review test files for examples
3. Check GitHub issues
4. Contact the development team

---

**Last Updated:** 2026-03-07
**Version:** 1.0.0
