# WordPress API 集成快速开始指南

> 本指南将帮助你在 CyberPress Platform 中快速集成 WordPress REST API

## 📋 前置要求

- WordPress 站点已安装并运行
- WordPress REST API 已启用（默认启用）
- Next.js 开发环境已配置

## 🚀 快速开始

### 步骤 1: 配置环境变量

在项目根目录创建 `.env.local` 文件：

```bash
# WordPress API 配置
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json
NEXT_PUBLIC_WORDPRESS_CDN_URL=https://cdn.your-wordpress-site.com  # 可选
```

### 步骤 2: 添加 Provider 到根布局

更新 `app/layout.tsx`:

```tsx
import { WordPressProvider } from '@/components/providers/WordPressProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <WordPressProvider
          apiURL={process.env.NEXT_PUBLIC_WORDPRESS_API_URL}
        >
          {children}
        </WordPressProvider>
      </body>
    </html>
  );
}
```

### 步骤 3: 使用 React Query Hooks

在页面或组件中使用 WordPress 数据：

```tsx
'use client';

import { usePosts, useCategories } from '@/lib/wordpress/react-query-hooks';
import { BlogCard } from '@/components/blog/BlogCard';

export default function BlogPage() {
  // 获取文章列表
  const { data: posts, isLoading, error } = usePosts({
    page: 1,
    per_page: 12,
    _embed: true,
  });

  // 获取分类列表
  const { data: categories } = useCategories();

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败: {error.message}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts?.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## 📚 可用的 Hooks

### 文章相关

#### `usePosts(params)`
获取文章列表

```tsx
const { data: posts } = usePosts({
  page: 1,
  per_page: 12,
  categories: [1, 2],  // 分类 ID
  tags: [3, 4],        // 标签 ID
  search: '关键词',    // 搜索
  orderby: 'date',     // 排序方式
  order: 'desc',       // 排序方向
});
```

#### `usePost(slug)`
获取单篇文章

```tsx
const { data: post } = usePost('hello-world');
```

#### `useSearchPosts(query, params)`
搜索文章

```tsx
const { data: results } = useSearchPosts('React', {
  per_page: 10,
});
```

#### `useRelatedPosts(postId, categoryIds, tagIds)`
获取相关文章

```tsx
const { data: related } = useRelatedPosts(
  123,
  [1, 2],  // 分类 ID
  [3, 4]   // 标签 ID
);
```

### 分类和标签

#### `useCategories()`
获取所有分类

```tsx
const { data: categories } = useCategories();
```

#### `useCategory(slug)`
获取单个分类

```tsx
const { data: category } = useCategory('technology');
```

#### `useTags()`
获取所有标签

```tsx
const { data: tags } = useTags();
```

### 特殊查询

#### `useFeaturedPosts(tagSlug, perPage)`
获取特色文章

```tsx
const { data: featured } = useFeaturedPosts('featured', 3);
```

#### `useTrendingPosts(perPage)`
获取热门文章

```tsx
const { data: trending } = useTrendingPosts(5);
```

#### `useRecentPosts(perPage)`
获取最新文章

```tsx
const { data: recent } = useRecentPosts(5);
```

## 🎨 使用加载状态组件

```tsx
import {
  BlogGridSkeleton,
  BlogCardSkeleton,
  BlogDetailSkeleton,
} from '@/components/blog/LoadingState';

// 网格加载状态
<BlogGridSkeleton count={6} />

// 单个卡片加载
<BlogCardSkeleton />

// 详情页加载
<BlogDetailSkeleton />
```

## 🔧 直接使用 WordPress 客户端

如果需要更底层的控制，可以直接使用客户端：

```tsx
import { wpClient } from '@/lib/wordpress/enhanced-client';

// 在服务器组件中
export default async function ServerComponent() {
  const posts = await wpClient.getPosts({
    per_page: 10,
    _embed: true,
  });

  const categories = await wpClient.getCategories();

  return <div>{/* 渲染内容 */}</div>;
}
```

## 📝 完整示例

### 博客列表页面

```tsx
// app/blog/page.tsx
import { wpClient } from '@/lib/wordpress/enhanced-client';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogGridSkeleton } from '@/components/blog/LoadingState';
import { Pagination } from '@/components/blog/Pagination';

interface BlogPageProps {
  searchParams: { page?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1');
  const perPage = 12;

  // 获取文章
  const posts = await wpClient.getPosts({
    page,
    per_page: perPage,
    _embed: true,
  });

  // 获取总数
  const totalCount = await wpClient.getPostsCount();
  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div>
      <h1>博客文章</h1>
      <BlogGrid posts={posts} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/blog"
      />
    </div>
  );
}
```

### 博客详情页面

```tsx
// app/blog/[slug]/page.tsx
import { wpClient } from '@/lib/wordpress/enhanced-client';
import { BlogDetailSkeleton } from '@/components/blog/LoadingState';

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await wpClient.getPostBySlug(params.slug, { _embed: true });

  if (!post) {
    return <div>文章未找到</div>;
  }

  return (
    <article>
      <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}
```

### 客户端组件（使用 Hooks）

```tsx
// components/RecentPostsWidget.tsx
'use client';

import { useRecentPosts } from '@/lib/wordpress/react-query-hooks';
import { BlogCardSkeleton } from '@/components/blog/LoadingState';

export function RecentPostsWidget() {
  const { data: posts, isLoading } = useRecentPosts(5);

  if (isLoading) {
    return (
      <div>
        {[...Array(5)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2>最新文章</h2>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.slug}`}>
              {post.title.rendered}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 🎯 TypeScript 类型支持

所有 hooks 和客户端函数都有完整的 TypeScript 类型支持：

```tsx
import type { WordPressPost, WordPressCategory, WordPressTag } from '@/lib/wordpress/enhanced-client';

// 使用类型
const post: WordPressPost = {
  id: 1,
  title: { rendered: 'Hello' },
  // ... 其他字段
};
```

## 🔍 调试技巧

### 1. 查看 React Query 状态

开发模式下，访问页面时会自动显示 React Query Devtools。

### 2. 控制台查看请求

打开浏览器控制台，查看网络请求：

```tsx
// 在组件中添加
console.log('Posts:', posts);
console.log('Loading:', isLoading);
console.log('Error:', error);
```

### 3. 测试 API 连接

创建测试页面验证 API 连接：

```tsx
// app/test-api/page.tsx
import { wpClient } from '@/lib/wordpress/enhanced-client';

export default async function TestAPIPage() {
  const health = await wpClient.healthCheck();

  return (
    <div>
      <h1>API 测试</h1>
      <p>状态: {health ? '✅ 连接成功' : '❌ 连接失败'}</p>
    </div>
  );
}
```

## ⚠️ 常见问题

### 1. CORS 错误

如果遇到 CORS 错误，需要在 WordPress 站点添加以下代码到 `functions.php`：

```php
add_action('rest_api_init', function() {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization');
});
```

### 2. 认证问题

如果需要访问受保护的内容，需要在客户端配置认证：

```tsx
// enhanced-client.ts
this.client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3. 性能优化

- 使用 `usePrefetchPost` 预取文章
- 配置合适的 `staleTime` 和 `gcTime`
- 启用 Next.js 图片优化

## 📚 更多资源

- [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)
- [React Query 文档](https://tanstack.com/query/latest)
- [Next.js 14 文档](https://nextjs.org/docs)

## 🆘 获取帮助

如有问题，请查看：
- 项目文档: `/DEVELOPMENT_SESSION_2026-03-06.md`
- WordPress API 集成: `/frontend/lib/wordpress/`
- 示例代码: `/app/blog/`

---

**最后更新**: 2026-03-06
**版本**: 1.0.0
