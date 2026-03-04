# 🚀 增强功能快速开始指南

> CyberPress Platform 新功能使用说明

---

## 📱 PWA 功能

### 启用步骤

#### 1. 在根布局中添加组件

```tsx
// app/layout.tsx
import { PWAInstaller, OfflineIndicator, ServiceWorkerRegister } from '@/components/pwa';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00f0ff" />
      </head>
      <body>
        <PWAInstaller />
        <OfflineIndicator />
        <ServiceWorkerRegister />
        {children}
      </body>
    </html>
  );
}
```

#### 2. 准备应用图标

创建以下尺寸的图标并放在 `public/icons/` 目录:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

#### 3. 测试 PWA

```bash
npm run build
npm run start
```

在 Chrome DevTools 中检查:
- Application → Manifest
- Application → Service Workers
- Application → Lighthouse (PWA 分析)

---

## 🔍 SEO 优化

### 文章页面优化示例

```tsx
// app/blog/[slug]/page.tsx
import { OpenGraphTags, BlogPostJsonLd } from '@/components/seo';

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  
  const metadata = {
    title: post.title,
    description: post.excerpt,
    image: post.coverImage,
    url: `https://yourdomain.com/blog/${post.slug}`,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    author: post.author.name,
    tags: post.tags.map(t => t.name),
  };

  return (
    <>
      <OpenGraphTags {...metadata} />
      <BlogPostJsonLd {...metadata} />
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </>
  );
}
```

### 验证 SEO

使用以下工具验证:
- Google Rich Results Test
- Facebook Sharing Debugger
- Twitter Card Validator

---

## 📊 性能监控

### 启用性能监控

```tsx
// app/layout.tsx
import { PerformanceMonitor } from '@/components/performance';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  );
}
```

### 使用快捷键

按 `Ctrl + Shift + P` 切换性能面板

### 查看指标

面板会显示:
- FCP (首次内容绘制)
- LCP (最大内容绘制)
- FID (首次输入延迟)
- CLS (累积布局偏移)
- TTFB (首字节时间)
- 页面加载时间
- 性能评分

---

## 🛠️ 工具函数

### 类名合并

```tsx
import { cn } from '@/lib/utils/cn';

export function Button({ variant, className, ...props }) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        variant === 'primary' && 'bg-cyber-cyan text-black',
        variant === 'secondary' && 'bg-cyber-purple text-white',
        className
      )}
      {...props}
    />
  );
}
```

### 日期格式化

```tsx
import { formatSmartTime, getGreeting, formatDate } from '@/lib/utils/date';

export function PostMeta({ date }) {
  return (
    <div>
      <span>{getGreeting()}</span>
      <time>{formatSmartTime(date)}</time>
      <time>{formatDate(date, 'yyyy年MM月dd日')}</time>
    </div>
  );
}
```

### 本地存储

```tsx
import { storage } from '@/lib/utils/storage';

// 保存用户偏好
storage.set('user-preferences', {
  theme: 'dark',
  language: 'zh-CN',
});

// 获取用户偏好
const prefs = storage.get('user-preferences');

// 删除数据
storage.remove('user-preferences');
```

### 表单验证

```tsx
import { useState } from 'react';
import { isValidEmail, validatePassword } from '@/lib/utils/validators';

export function SignupForm() {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // 验证邮箱
    if (!isValidEmail(formData.get('email'))) {
      setErrors({ email: '请输入有效的邮箱地址' });
      return;
    }
    
    // 验证密码
    const passwordCheck = validatePassword(formData.get('password'));
    if (!passwordCheck.isValid) {
      setErrors({ password: passwordCheck.issues.join(', ') });
      return;
    }
    
    // 提交表单
  };
  
  // ...
}
```

### 错误处理

```tsx
import { handleError, retry } from '@/lib/utils/error-handler';

export async function fetchData() {
  try {
    const response = await retry(
      () => fetch('/api/data'),
      { maxAttempts: 3 }
    );
    return response.json();
  } catch (error) {
    handleError(error, 'fetchData');
    // 显示错误提示
  }
}
```

---

## 🎨 页面过渡

```tsx
// app/layout.tsx
import { PageTransition } from '@/components/common/PageTransition';

export default function Template({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
```

### 可用过渡效果

- `PageTransition` - 默认淡入淡出
- `FadeTransition` - 纯淡入淡出
- `SlideTransition` - 滑动效果
- `ScaleTransition` - 缩放效果
- `GlitchTransition` - 故障效果

---

## ⚡ 加载状态

```tsx
import { LoadingScreen, SkeletonLoader } from '@/components/common/LoadingScreen';

export function PostList() {
  const { data, isLoading } = usePosts();

  if (isLoading) {
    return <LoadingScreen message="加载文章中..." />;
  }

  return (
    <div>
      {data.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="p-4 border rounded">
      <SkeletonLoader />
    </div>
  );
}
```

---

## 🚨 错误边界

```tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export default function Layout({ children }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('Error caught:', error, errorInfo);
        // 发送错误到监控服务
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
```

---

## 📋 最佳实践

### 1. 组件开发

```tsx
// ✅ 好的做法
import { cn } from '@/lib/utils/cn';

export function Button({ variant, className, ...props }) {
  return (
    <button
      className={cn(
        'base-styles',
        variant === 'primary' && 'primary-styles',
        className
      )}
      {...props}
    />
  );
}

// ❌ 不好的做法
export function Button({ variant, className }) {
  return (
    <button className={`base-styles ${variant === 'primary' ? 'primary-styles' : ''} ${className}`}>
      {/* 容易出错,不易维护 */}
    </button>
  );
}
```

### 2. 数据获取

```tsx
// ✅ 使用错误处理
import { handleError } from '@/lib/utils/error-handler';

export async function getData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Network error');
    return response.json();
  } catch (error) {
    handleError(error, 'getData');
    throw error;
  }
}
```

### 3. 性能优化

```tsx
// ✅ 使用防抖
import { debounce } from '@/lib/utils/performance';

export function SearchInput() {
  const [query, setQuery] = useState('');
  
  const debouncedSearch = debounce((q) => {
    search(q);
  }, 300);
  
  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
    />
  );
}
```

---

## 🧪 测试

```tsx
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

---

## 📚 更多资源

- [完整文档](./SESSION_4_DEVELOPMENT_COMPLETE.md)
- [项目 README](./README.md)
- [开发指南](./DEVELOPER_QUICKSTART.md)

---

## 🆘 获取帮助

遇到问题？

1. 查看文档
2. 检查示例代码
3. 查看测试文件
4. 提交 Issue

---

**最后更新**: 2026-03-05  
**版本**: 1.0.0
