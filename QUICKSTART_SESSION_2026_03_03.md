# 🚀 新组件快速使用指南

> 快速上手 2026-03-03 创建的新组件

---

## 📦 目录

1. [性能监控](#性能监控)
2. [错误处理](#错误处理)
3. [SEO优化](#seo优化)
4. [自定义Hooks](#自定义hooks)
5. [实用页面](#实用页面)

---

## 🔥 性能监控

### Web Vitals 监控

在根布局中添加性能监控:

```typescript
// app/layout.tsx
import { WebVitals } from '@/components/performance/WebVitals';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebVitals 
          showInDev={true}  // 开发模式显示面板
          onReport={(metric) => {
            // 自定义上报
            console.log('Metric:', metric);
          }}
        />
        {children}
      </body>
    </html>
  );
}
```

### 懒加载图片

```typescript
import { LazyImage } from '@/components/performance/LazyImage';

<LazyImage
  src="/photo.jpg"
  alt="照片描述"
  width={800}
  height={600}
  priority={false}  // 是否优先加载
  fill={false}      // 是否填充容器
/>
```

### 虚拟滚动

```typescript
import { VirtualScroll } from '@/components/performance/VirtualScroll';

<VirtualScroll
  items={largeDataSet}
  renderItem={(item, index) => <div key={index}>{item.name}</div>}
  itemHeight={50}
  height={600}
  onReachBottom={() => loadMore()}
/>
```

---

## 🛡️ 错误处理

### 错误边界

```typescript
import { ErrorBoundary } from '@/components/error/ErrorBoundary';

<ErrorBoundary
  onError={(error, errorInfo) => {
    // 错误上报
    reportError(error);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### 服务器错误页面

```typescript
import { ServerError } from '@/components/error/ServerError';

// 在 error.tsx 中使用
export default function Error() {
  return <ServerError 
    title="服务器错误"
    message="服务暂时不可用,请稍后再试"
  />;
}
```

---

## 🎯 SEO优化

### Meta 标签

```typescript
import { MetaTags } from '@/components/seo/MetaTags';

<MetaTags
  title="页面标题"
  description="页面描述"
  keywords={['关键词1', '关键词2']}
  ogImage="/og-image.jpg"
  twitterCard="summary_large_image"
  canonical="https://example.com/page"
/>
```

### 文章 Meta 标签

```typescript
import { ArticleMetaTags } from '@/components/seo/MetaTags';

<ArticleMetaTags
  title="文章标题"
  description="文章描述"
  publishedTime="2026-03-03T00:00:00Z"
  author="作者名"
  tags={['React', 'Next.js']}
  ogImage="/article-cover.jpg"
/>
```

---

## 🪝 自定义Hooks

### useLocalStorage

```typescript
import { useLocalStorage } from '@/components/hooks/useLocalStorage';

function MyComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      当前主题: {theme}
    </button>
  );
}
```

### useMediaQuery

```typescript
import { useMediaQuery, useIsMobile } from '@/components/hooks/useMediaQuery';

function MyComponent() {
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
  
  if (isMobile) return <MobileView />;
  if (isTablet) return <TabletView />;
  return <DesktopView />;
}
```

### useIntersection

```typescript
import { useIntersection } from '@/components/hooks/useIntersection';

function FadeInSection({ children }) {
  const [ref, isInView] = useIntersection({
    threshold: 0.3,
    triggerOnce: true
  });
  
  return (
    <div ref={ref} style={{ opacity: isInView ? 1 : 0 }}>
      {children}
    </div>
  );
}
```

### useClickOutside

```typescript
import { useClickOutside } from '@/components/hooks/useClickOutside';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  
  useClickOutside(ref, () => setIsOpen(false));
  
  return (
    <div ref={ref}>
      <button onClick={() => setIsOpen(!isOpen)}>菜单</button>
      {isOpen && <div>下拉内容</div>}
    </div>
  );
}
```

### useDebounce

```typescript
import { useDebounce } from '@/components/hooks/useDebounce';

function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  useEffect(() => {
    // 使用防抖后的查询
    search(debouncedQuery);
  }, [debouncedQuery]);
  
  return (
    <input 
      value={query} 
      onChange={(e) => setQuery(e.target.value)} 
    />
  );
}
```

---

## 📄 实用页面

### FAQ 页面

访问 `/faq` 查看常见问题页面。

自定义问题数据:

```typescript
// app/(public)/faq/page.tsx
const faqData = [
  {
    category: '分类名称',
    questions: [
      { q: '问题?', a: '答案!' },
    ]
  }
];
```

### 定价页面

访问 `/pricing` 查看定价方案页面。

自定义定价方案:

```typescript
// app/(public)/pricing/page.tsx
const plans = [
  {
    name: '方案名',
    price: '¥99/月',
    features: ['功能1', '功能2'],
    highlighted: true
  }
];
```

---

## 🛠️ 工具函数

### 性能工具

```typescript
import { debounce, throttle, formatBytes } from '@/lib/utils/performance';

// 防抖
const debouncedFn = debounce(() => {
  // 延迟执行的代码
}, 300);

// 节流
const throttledFn = throttle(() => {
  // 限制执行频率
}, 1000);

// 格式化字节
formatBytes(1024); // "1 KB"
```

### 格式化工具

```typescript
import { 
  formatDate, 
  timeAgo, 
  formatCurrency,
  truncate,
  slugify 
} from '@/lib/utils/format';

// 格式化日期
formatDate(new Date(), 'YYYY-MM-DD');

// 相对时间
timeAgo(new Date()); // "2小时前"

// 格式化货币
formatCurrency(99.99); // "¥99.99"

// 截断文本
truncate('长文本...', 20); // "长文本..."

// 生成 slug
slugify('Hello World'); // "hello-world"
```

---

## 📊 性能分析

### 性能指标

```typescript
import { getPerformanceMetrics } from '@/lib/utils/performance';

// 在组件中使用
useEffect(() => {
  const metrics = getPerformanceMetrics();
  console.log('页面加载时间:', metrics.pageLoadTime);
  console.log('首次绘制:', metrics.firstPaint);
}, []);
```

---

## 🎨 最佳实践

### 1. 性能优化

- ✅ 使用 `WebVitals` 监控核心指标
- ✅ 图片使用 `LazyImage` 懒加载
- ✅ 大列表使用 `VirtualScroll` 虚拟滚动
- ✅ 使用 `debounce/throttle` 优化频繁操作

### 2. 错误处理

- ✅ 在关键组件外包裹 `ErrorBoundary`
- ✅ 提供友好的错误提示
- ✅ 上报错误到监控系统

### 3. SEO优化

- ✅ 每个页面使用 `MetaTags` 
- ✅ 文章使用 `ArticleMetaTags`
- ✅ 提供 canonical URL
- ✅ 添加结构化数据

### 4. 用户体验

- ✅ 使用 `useLocalStorage` 保存用户设置
- ✅ 使用 `useMediaQuery` 响应式适配
- ✅ 使用 `useIntersection` 实现滚动动画
- ✅ 使用 `useDebounce` 优化输入体验

---

## 🚀 快速开始

### 1. 确认依赖

所有组件依赖项目已有的包,无需额外安装。

### 2. 导入组件

```typescript
// 从对应目录导入
import { WebVitals } from '@/components/performance/WebVitals';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { MetaTags } from '@/components/seo/MetaTags';
import { useLocalStorage } from '@/components/hooks/useLocalStorage';
```

### 3. 使用组件

参考上面的示例代码,快速集成到你的项目中。

### 4. 自定义样式

所有组件使用 Tailwind CSS 和赛博朋克主题,可以根据需要自定义。

---

## 📚 更多资源

- [完整文档](./CREATION_SUCCESS_2026_03_03.md)
- [组件清单](./NEW_FILES_CREATED_2026_03_03_SESSION.md)
- [项目 README](./README.md)
- [项目规划](./PROJECT.md)

---

## 💡 提示

- 所有组件都是 TypeScript 编写,提供完整的类型定义
- 组件支持响应式设计,适配各种屏幕尺寸
- 遵循赛博朋克设计系统,保持视觉一致性
- 性能优化,代码分割和懒加载

---

**最后更新**: 2026-03-03  
**版本**: 1.0.0

🎉 **开始使用这些强大的新组件吧!**
