# 🚀 实用工具组件快速参考

**CyberPress Platform - Utility Components Quick Reference**

---

## 📦 组件索引

### CodeBlock - 代码块组件

```tsx
import { CodeBlock } from '@/components/utils';

<CodeBlock
  code="const hello = 'world';"
  language="typescript"
  title="example.ts"
  showLineNumbers={true}
  theme="cyber"
  copyable={true}
/>
```

**主题选项**: `dark` | `neon` | `cyber`  
**尺寸**: 自动适配内容

---

### TimeAgo - 相对时间

```tsx
import { TimeAgo, DateRange, ReadTime } from '@/components/utils';

// 相对时间
<TimeAgo date={new Date()} />

// 日期范围
<DateRange start="2024-01-01" end="2024-12-31" format="long" />

// 阅读时间
<ReadTime content="Your article content..." wordsPerMinute={200} />
```

---

### TagList - 标签列表

```tsx
import { TagList, TagCloud, TagInput } from '@/components/utils';

// 标签列表
<TagList
  tags={[
    { id: '1', label: 'React', count: 10 },
    { id: '2', label: 'TypeScript', count: 5 }
  ]}
  variant="neon"
  onTagClick={(tag) => console.log(tag)}
/>

// 标签云
<TagCloud
  tags={[
    { name: 'React', weight: 10 },
    { name: 'Vue', weight: 5 }
  ]}
  onTagClick={(tag) => console.log(tag)}
/>

// 标签输入
<TagInput
  tags={['React', 'TypeScript']}
  onChange={(tags) => console.log(tags)}
  maxTags={5}
/>
```

**变体**: `default` | `pill` | `outline` | `neon`  
**尺寸**: `sm` | `md` | `lg`

---

### Badge - 徽章

```tsx
import { Badge, StatusBadge, LevelBadge, NotificationBadge } from '@/components/utils';

// 基础徽章
<Badge
  variant="success"
  label="Completed"
  count={5}
  icon="star"
  pulse
/>

// 状态徽章
<StatusBadge
  status="online"
  label="Available"
  showDot
/>

// 等级徽章
<LevelBadge
  level={42}
  maxLevel={100}
  showProgress
/>

// 通知徽章
<NotificationBadge
  count={5}
  position="top-right"
>
  <Bell />
</NotificationBadge>
```

**变体**: `default` | `success` | `warning` | `error` | `info` | `neon` | `cyber`  
**图标**: `award` | `star` | `trending` | `zap` | `flame` | `crown`

---

### ProgressBar - 进度条

```tsx
import { ProgressBar, CircularProgress, ProgressSteps, StatCard } from '@/components/utils';

// 线性进度条
<ProgressBar
  value={75}
  max={100}
  label="Loading..."
  variant="cyber"
  animated
  striped
  showPercentage
/>

// 圆形进度
<CircularProgress
  value={75}
  size={120}
  strokeWidth={8}
  label="Progress"
  variant="success"
/>

// 步骤进度
<ProgressSteps
  steps={[
    { label: 'Step 1', status: 'complete' },
    { label: 'Step 2', status: 'current' },
    { label: 'Step 3', status: 'pending' }
  ]}
/>

// 统计卡片
<StatCard
  title="Total Views"
  value="125,430"
  change={12.5}
  changeType="increase"
  icon={<Eye />}
/>
```

---

### Tooltip - 工具提示

```tsx
import { Tooltip, Popover, HoverCard } from '@/components/utils';

// 基础提示
<Tooltip content="Help text" position="top">
  <button>Hover me</button>
</Tooltip>

// 弹出框
<Popover
  trigger={<button>Click</button>}
  content={<div>Content here</div>}
  position="bottom"
/>

// 悬停卡片
<HoverCard
  trigger={<span>Hover me</span>}
  content={<div>Card content</div>}
/>
```

**位置**: `top` | `bottom` | `left` | `right`  
**变体**: `dark` | `light` | `cyber` | `neon`

---

## 🛠️ 工具函数

### String Helpers

```typescript
import {
  slugify,
  truncate,
  formatNumber,
  generateId,
  highlightTerm,
  maskEmail,
  getReadingTime,
  escapeHtml
} from '@/lib/utils/string-helpers';

// 生成 slug
slugify('Hello World!') // 'hello-world'

// 截断文本
truncate('Long text here...', 20) // 'Long text here...'

// 格式化数字
formatNumber(1500000) // '1.5M'
formatNumber(1500) // '1.5K'

// 生成唯一 ID
generateId('user') // 'user_xxx123'
generateId() // 'xxx123'

// 高亮关键词
highlightTerm('Search for text', 'text') // 'Search for <mark>text</mark>'

// 隐藏邮箱
maskEmail('john@example.com') // 'j***@example.com'

// 计算阅读时间
getReadingTime('Article content...', 200) // 5 (minutes)

// 转义 HTML
escapeHtml('<script>alert("xss")</script>') // '&lt;script&gt;...'
```

---

### Storage Helpers

```typescript
import { local, session, ExpiringStorage, createNamespacedStorage } from '@/lib/utils/storage';

// LocalStorage
local.set('user', { name: 'John' });
const user = local.get('user');
local.has('user'); // true
local.remove('user');
local.clear();

// SessionStorage
session.set('temp', 'data');
const data = session.get('temp');

// 过期存储
const expiring = new ExpiringStorage('cache_');
expiring.set('key', 'value', 60000); // 60秒后过期
const value = expiring.get('key');

// 命名空间存储
const userStorage = createNamespacedStorage('user');
userStorage.set('preferences', { theme: 'dark' });
```

---

## 🔌 服务

### Analytics Service

```typescript
import { analytics, useAnalytics } from '@/services/analytics';

// 初始化
analytics.init({ debug: true });

// 追踪页面浏览
analytics.trackPageView({
  path: '/blog/post-1',
  title: 'My Blog Post',
  userId: 'user-123'
});

// 追踪事件
analytics.trackEvent({
  category: 'interaction',
  action: 'click',
  label: 'button',
  value: 1
});

// 追踪交互
analytics.trackInteraction('button_click', 'header_cta');

// 追踪错误
analytics.trackError(error, { context: 'form_submission' });

// 设置用户
analytics.setUser({
  userId: 'user-123',
  email: 'user@example.com',
  customProperties: { plan: 'pro' }
});

// React Hook
function MyComponent() {
  const { trackEvent, trackPageView } = useAnalytics();
  
  useEffect(() => {
    trackPageView({ path: '/my-page', title: 'My Page' });
  }, []);
}
```

---

### SEO Service

```typescript
import { seo } from '@/services/seo';

// 生成 Meta 标签
const metaTags = seo.generateMetaTags({
  title: 'My Page Title',
  description: 'Page description',
  keywords: 'react, nextjs, typescript',
  og: {
    title: 'My Page',
    description: 'Page description',
    image: '/og-image.jpg',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Page',
    description: 'Page description',
    image: '/twitter-image.jpg'
  }
});

// 生成结构化数据
const articleData = seo.generateArticleData({
  title: 'Article Title',
  description: 'Article description',
  image: '/article.jpg',
  datePublished: '2024-01-01',
  author: { name: 'John Doe', url: 'https://example.com' },
  publisher: { name: 'My Site', logo: '/logo.png' }
});

// 生成 Sitemap
const sitemap = seo.generateSitemap([
  {
    loc: 'https://example.com/page1',
    lastmod: '2024-01-01',
    changefreq: 'weekly',
    priority: 1.0
  }
]);

// 生成 robots.txt
const robots = seo.generateRobotsTxt({
  userAgent: '*',
  allow: ['/'],
  disallow: ['/admin', '/api'],
  sitemap: 'https://example.com/sitemap.xml'
});

// 验证 SEO
const score = seo.validateSEOScore({
  title: 'Page Title',
  description: 'Page description...',
  headings: ['h1', 'h2'],
  images: 5,
  internalLinks: 10,
  wordCount: 500
});
// { score: 85, issues: [] }
```

---

## 🎨 博客组件

### AuthorCard

```tsx
import { AuthorCard, AuthorCardCompact } from '@/components/blog';

// 完整卡片
<AuthorCard
  name="John Doe"
  avatar="/avatar.jpg"
  bio="Full-stack developer passionate about React"
  role="Senior Developer"
  location="San Francisco, CA"
  email="john@example.com"
  twitter="@johndoe"
  github="johndoe"
  website="https://johndoe.com"
/>

// 紧凑版本
<AuthorCardCompact
  name="John Doe"
  avatar="/avatar.jpg"
  role="Senior Developer"
  twitter="@johndoe"
  github="johndoe"
/>
```

---

### RelatedPosts

```tsx
import { RelatedPosts, RelatedPostsInline } from '@/components/blog';

// 网格布局
<RelatedPosts
  posts={relatedPosts}
  title="You might also like"
  layout="grid"
  maxPosts={3}
/>

// 列表布局
<RelatedPosts
  posts={relatedPosts}
  layout="list"
  maxPosts={5}
/>

// 内联版本
<RelatedPostsInline
  posts={relatedPosts}
/>
```

**文章对象格式**:
```typescript
{
  id: string | number;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
  date: string;
  readTime: number;
  category?: string;
  tags?: string[];
}
```

---

## 📄 页面

### Sitemap Page

访问 `/sitemap` 查看站点地图页面。

---

## 🎯 最佳实践

### 组件使用
1. **按需导入** - 只导入需要的组件
2. **类型安全** - 使用 TypeScript 类型定义
3. **响应式** - 所有组件都支持响应式设计
4. **可访问性** - 遵循 WCAG 2.1 标准

### 性能优化
1. **懒加载** - 对大型组件使用动态导入
2. **记忆化** - 使用 React.memo 避免不必要的渲染
3. **防抖/节流** - 对频繁操作使用防抖或节流

### 错误处理
1. **边界检查** - 使用 ErrorBoundary 捕获错误
2. **验证输入** - 验证 props 和数据
3. **优雅降级** - 提供默认值和备用方案

---

## 🔗 相关资源

- [完整文档](./NEW_UTILITIES_SESSION_2026_03_03.md)
- [项目 README](./README.md)
- [组件快速参考](./COMPONENTS_QUICK_REFERENCE.md)
- [开发报告](./DEVELOPMENT_REPORT_2026_03_03.md)

---

**版本**: v1.0.0  
**最后更新**: 2026-03-03  
**状态**: ✅ 就绪

---

<div align="center">

**Built with ❤️ by AI Development Team**

</div>
