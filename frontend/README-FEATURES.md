# CyberPress Platform - 新功能文档

本文档记录了最新添加的功能和组件。

---

## 📦 新增文件列表 (2026-03-07)

### 1. PWA 功能增强

#### `frontend/public/sw.js`
完整的 Service Worker 实现，包含：
- 缓存策略（Cache First, Network First, Stale While Revalidate）
- 后台同步
- 推送通知支持
- IndexedDB 集成
- 智能缓存清理

**使用方式：**
```javascript
// Service Worker 会自动注册
// 可以通过 PWA Manager 进行控制
```

#### `frontend/lib/pwa/pwa-register.ts`
PWA 管理器类，提供：
- Service Worker 注册和更新管理
- 推送通知订阅
- 安装提示控制
- 网络状态监控
- 缓存管理

**使用示例：**
```typescript
import { getPWAManager } from '@/lib/pwa/pwa-register';

const pwa = getPWAManager();
await pwa.register();

// 检查更新
await pwa.checkForUpdates();

// 显示通知
await pwa.showNotification('Hello', { body: 'World' });
```

---

### 2. SEO 优化组件

#### `frontend/components/seo/TwitterCard.tsx`
Twitter Card 元标签组件，支持：
- 4种卡片类型（summary, summary_large_image, app, player）
- 完整的 Twitter 元数据
- 响应式卡片生成

**使用示例：**
```tsx
import { TwitterSummaryCard, TwitterLargeImageCard } from '@/components/seo/TwitterCard';

<TwitterSummaryCard
  title="文章标题"
  description="文章描述"
  image="https://example.com/image.jpg"
  site="@username"
/>
```

---

### 3. 性能监控系统

#### `frontend/lib/performance/PerformanceMonitor.ts`
全面的性能监控工具：
- Core Web Vitals 追踪（LCP, FID, CLS, FCP, TTFB）
- 自定义指标追踪
- 性能评分和推荐
- 性能报告生成

**使用示例：**
```typescript
import { getPerformanceMonitor } from '@/lib/performance/PerformanceMonitor';

const monitor = getPerformanceMonitor();
await monitor.init();

// 生成报告
const report = monitor.generateReport();
console.log(report);
```

#### `frontend/components/performance/PerformanceReport.tsx`
可视化性能报告组件：
- 实时性能指标显示
- 彩色状态指示器
- 问题诊断和建议
- 自动刷新功能

**使用示例：**
```tsx
import { PerformanceReportComponent } from '@/components/performance/PerformanceReport';

<PerformanceReportComponent
  showDetails={true}
  autoRefresh={true}
  onReportGenerated={(report) => console.log(report)}
/>
```

---

### 4. 工具函数库

#### `frontend/lib/utils/FormatUtils.ts`
全面的格式化工具：
- 数字格式化（千分位、字节、持续时间）
- 日期时间格式化（相对时间、本地化）
- 文本格式化（截断、列表）
- 数据格式化（百分比、货币、电话号码）
- 特殊格式（罗马数字、阅读时间、地址）

**使用示例：**
```typescript
import { formatBytes, formatRelativeTime, formatReadingTime } from '@/lib/utils/FormatUtils';

formatBytes(1024 * 1024); // "1 MB"
formatRelativeTime(new Date()); // "2 hours ago"
formatReadingTime(500); // "3 min read"
```

---

### 5. Analytics 服务

#### `frontend/services/analytics/AnalyticsService.ts`
完整的分析服务：
- Google Analytics 集成
- 自定义事件追踪
- 页面浏览追踪
- 错误追踪
- 性能指标追踪
- 转化追踪
- 用户属性管理

**使用示例：**
```typescript
import analyticsService from '@/services/analytics/AnalyticsService';

// 初始化
await analyticsService.init('GA_TRACKING_ID');

// 追踪页面浏览
analyticsService.trackPageView({
  page: '/blog/post-1',
  title: 'My Blog Post',
});

// 追踪事件
analyticsService.trackEvent({
  category: 'Engagement',
  action: 'click',
  label: 'button',
});

// 追踪错误
analyticsService.trackError(error, { context: 'additional info' });
```

---

### 6. 搜索服务

#### `frontend/services/search/SearchService.ts`
高级搜索功能：
- 模糊搜索（Levenshtein 距离）
- 多字段搜索
- 高级过滤
- 搜索建议
- 分页搜索
- 防抖搜索
- 高亮匹配

**使用示例：**
```typescript
import { SearchService } from '@/services/search/SearchService';

// 基本搜索
const results = SearchService.search(
  items,
  'search query',
  ['title', 'description'],
  { fuzzy: true, threshold: 0.6 }
);

// 带过滤的搜索
const filtered = SearchService.searchWithFilters(
  items,
  'query',
  ['title'],
  [
    { field: 'status', operator: 'eq', value: 'published' },
    { field: 'date', operator: 'gte', value: '2024-01-01' }
  ]
);

// 分页搜索
const paginated = SearchService.searchPaginated(
  items,
  'query',
  ['title'],
  1,
  10
);
```

---

## 🎯 核心特性

### PWA 功能
- ✅ 离线支持
- ✅ 安装到桌面
- ✅ 推送通知
- ✅ 后台同步
- ✅ 智能缓存

### SEO 优化
- ✅ 结构化数据（JSON-LD）
- ✅ Open Graph 标签
- ✅ Twitter Cards
- ✅ 元标签管理
- ✅ 面包屑导航

### 性能监控
- ✅ Core Web Vitals
- ✅ 自定义指标
- ✅ 性能报告
- ✅ 实时监控
- ✅ 问题诊断

### 工具库
- ✅ 格式化工具（50+ 函数）
- ✅ 验证工具（40+ 函数）
- ✅ 日期工具（30+ 函数）
- ✅ 数组工具（20+ 函数）
- ✅ 字符串工具（25+ 函数）

---

## 📝 使用指南

### 1. 启用 PWA

在 `app/layout.tsx` 中添加：

```tsx
import { getPWAManager } from '@/lib/pwa/pwa-register';

useEffect(() => {
  const pwa = getPWAManager();
  pwa.register();
}, []);
```

### 2. 添加性能监控

```tsx
import { getPerformanceMonitor } from '@/lib/performance/PerformanceMonitor';

useEffect(() => {
  const monitor = getPerformanceMonitor();
  monitor.init();

  return () => monitor.destroy();
}, []);
```

### 3. 集成 Analytics

```tsx
import analyticsService from '@/services/analytics/AnalyticsService';

useEffect(() => {
  analyticsService.init(process.env.NEXT_PUBLIC_GA_ID);
}, []);

// 追踪页面浏览
useEffect(() => {
  analyticsService.trackPageView({
    page: pathname,
    title: document.title,
  });
}, [pathname]);
```

### 4. 实现搜索功能

```tsx
import { SearchService } from '@/services/search/SearchService';

const [results, setResults] = useState([]);

const handleSearch = (query: string) => {
  const searchResults = SearchService.search(
    items,
    query,
    ['title', 'description', 'tags'],
    { fuzzy: true, threshold: 0.6 }
  );
  setResults(searchResults);
};
```

---

## 🔧 配置选项

### 环境变量

```env
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=/api
```

### 性能监控配置

```typescript
const monitor = getPerformanceMonitor('/api/analytics/performance', true);
```

### PWA 配置

在 `next.config.js` 中：

```javascript
module.exports = {
  // ... other config
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
  },
}
```

---

## 📊 API 参考

详细的 API 文档请参考各文件内的 TypeScript 类型定义和注释。

---

## 🐛 已知问题

- 某些旧浏览器不支持 Service Worker
- 性能监控在 Safari 中部分功能受限
- 推送通知需要用户授权

---

## 🔄 更新日志

### v1.0.0 (2026-03-07)
- ✅ 初始版本
- ✅ PWA 核心功能
- ✅ SEO 组件
- ✅ 性能监控
- ✅ 工具库
- ✅ Analytics 服务
- ✅ 搜索服务

---

## 📚 相关文档

- [项目 README](../README.md)
- [开发指南](./DEVELOPMENT.md)
- [API 文档](./API_DOCUMENTATION.md)
- [组件文档](./COMPONENT_USAGE_GUIDE.md)

---

**文档更新时间**: 2026-03-07
**维护团队**: AI Development Team
