# CyberPress Platform - 博客系统集成指南

> 完整的博客功能集成和使用指南

## 📦 已创建的文件

### 1. 数据适配器
**文件**: `frontend/lib/utils/adapters-blog.ts`

博客数据适配器，用于将 WordPress API 格式转换为统一的 BlogPost 格式。

```typescript
import { adaptWordPressToBlogPost, adaptWordPressPosts } from '@/lib/utils/adapters-blog';

// 转换单个帖子
const blogPost = adaptWordPressToBlogPost(wpPost);

// 批量转换
const blogPosts = adaptWordPressPosts(wpPosts);
```

### 2. React Hooks
**文件**: `frontend/hooks/use-blog-data.ts`

简化的博客数据获取 Hooks。

```typescript
import {
  useBlogPosts,
  useBlogPost,
  useSearchPosts,
  useBlogStats,
  useLikePost,
  useBookmarkPost
} from '@/hooks/use-blog-data';

// 获取文章列表
const { data, isLoading, isError } = useBlogPosts({
  page: 1,
  pageSize: 10,
  search: '关键词',
  categories: ['category-id'],
});

// 获取单篇文章
const { data: post } = useBlogPost('post-slug');

// 搜索文章
const { data: results } = useSearchPosts('搜索词');

// 获取统计信息
const { data: stats } = useBlogStats();

// 点赞文章
const likeMutation = useLikePost();
likeMutation.mutate(postId);
```

### 3. 增强搜索组件
**文件**: `frontend/components/blog/BlogSearchEnhanced.tsx`

功能完整的搜索组件，支持：
- 实时搜索建议
- 最近搜索历史
- 热门搜索
- 键盘导航
- 防抖优化

```typescript
import { BlogSearch } from '@/components/blog/BlogSearchEnhanced';

<BlogSearch
  onSearch={(query) => console.log(query)}
  placeholder="搜索文章..."
  showSuggestions={true}
/>
```

## 🚀 快速开始

### 1. 配置环境变量

在 `.env.local` 中配置 WordPress API 地址：

```bash
NEXT_PUBLIC_WP_API_URL=https://your-site.com/wp-json
```

### 2. 在页面中使用

#### 博客列表页

```typescript
// app/blog/page.tsx
'use client';

import { BlogList } from '@/components/blog/BlogList';
import { useBlogPosts } from '@/hooks/use-blog-data';

export default function BlogPage() {
  const { data, isLoading } = useBlogPosts({ page: 1, pageSize: 10 });

  if (isLoading) return <div>加载中...</div>;

  return (
    <BlogList
      posts={data?.posts || []}
      currentPage={data?.page || 1}
      totalPages={data?.totalPages || 1}
      totalItems={data?.total || 0}
    />
  );
}
```

#### 博客详情页

```typescript
// app/blog/[slug]/page.tsx
'use client';

import { useBlogPost } from '@/hooks/use-blog-data';
import { ArticleContent } from '@/components/blog/ArticleContent';

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { data: post, isLoading } = useBlogPost(params.slug);

  if (isLoading) return <div>加载中...</div>;
  if (!post) return <div>文章不存在</div>;

  return <ArticleContent post={post} />;
}
```

### 3. 使用搜索组件

```typescript
'use client';

import { useState } from 'react';
import { BlogSearch } from '@/components/blog/BlogSearchEnhanced';
import { useSearchPosts } from '@/hooks/use-blog-data';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useSearchPosts(query);

  return (
    <div>
      <BlogSearch onSearch={setQuery} />
      {isLoading && <div>搜索中...</div>}
      {results && (
        <ul>
          {results.map(post => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 🎨 组件使用示例

### BlogGrid 组件

网格布局的博客列表：

```typescript
import { BlogGrid } from '@/components/blog/BlogGrid';

<BlogGrid
  posts={posts}
  columns={3}  // 2, 3, 或 4 列
  currentPage={1}
  totalPages={5}
  onPageChange={(page) => console.log(page)}
/>
```

### BlogList 组件

列表布局的博客列表：

```typescript
import { BlogList } from '@/components/blog/BlogList';

<BlogList
  posts={posts}
  currentPage={1}
  totalPages={5}
  onPageChange={(page) => console.log(page)}
  pageSize={10}
/>
```

### ArticleCard 组件

单篇文章卡片：

```typescript
import { ArticleCard } from '@/components/blog/ArticleCard';

<ArticleCard
  post={post}
  variant="grid"  // 'list' | 'grid' | 'featured'
  showExcerpt={true}
  showAuthor={true}
  showReadingTime={true}
/>
```

## 🔧 高级配置

### 自定义数据转换

如果 WordPress API 响应格式不同，可以修改适配器：

```typescript
// lib/utils/adapters-blog.ts
export function adaptWordPressToBlogPost(wpPost: WordPressPost): BlogPost {
  return {
    id: String(wpPost.id),
    title: wpPost.title.rendered,
    // ... 自定义映射
  };
}
```

### 添加缓存策略

```typescript
import { useBlogPosts } from '@/hooks/use-blog-data';

const { data } = useBlogPosts(
  { page: 1 },
  {
    staleTime: 10 * 60 * 1000, // 10 分钟
    cacheTime: 15 * 60 * 1000,  // 15 分钟
  }
);
```

### 自定义错误处理

```typescript
const { data, isError, error } = useBlogPosts({ page: 1 });

if (isError) {
  return (
    <div>
      加载失败: {error.message}
      <button onClick={() => window.location.reload()}>重试</button>
    </div>
  );
}
```

## 📊 数据结构

### BlogPost 类型

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
    name: string;
    slug: string;
    avatar: string;
    bio: string;
  };
  category: Category[];
  tags: Tag[];
  coverImage: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  likeCount: number;
  commentCount: number;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  readingTime: number;
}
```

### BlogListResponse 类型

```typescript
interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

## 🎯 最佳实践

### 1. SEO 优化

```typescript
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await fetchPost(params.slug);

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}
```

### 2. 性能优化

```typescript
// 使用 React.memo 优化卡片渲染
import { memo } from 'react';

const MemoizedArticleCard = memo(ArticleCard);

// 使用虚拟化处理大量数据
import { useVirtualizer } from '@tanstack/react-virtual';
```

### 3. 错误边界

```typescript
'use client';

import { Component, ReactNode } from 'react';

export class BlogErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>出错了，请刷新页面</div>;
    }
    return this.props.children;
  }
}
```

## 🧪 测试

### 组件测试

```typescript
import { render, screen } from '@testing-library/react';
import { BlogList } from '@/components/blog/BlogList';

test('renders blog list', () => {
  const posts = [
    { id: '1', title: 'Test Post', /* ... */ },
  ];

  render(<BlogList posts={posts} />);
  expect(screen.getByText('Test Post')).toBeInTheDocument();
});
```

### Hook 测试

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useBlogPosts } from '@/hooks/use-blog-data';

test('fetches blog posts', async () => {
  const { result } = renderHook(() => useBlogPosts({ page: 1 }));

  await waitFor(() => expect(result.current.data).toBeDefined());
  expect(result.current.data?.posts).toHaveLength(10);
});
```

## 📚 相关文档

- [项目 README](../README.md)
- [TODO 列表](../TODO.md)
- [组件文档](./frontend/components/blog/README.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**最后更新**: 2026-03-08
