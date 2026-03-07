# 博客系统集成快速开始指南

## 🚀 5分钟快速开始

### 1. 环境配置

创建 `.env.local` 文件：
```bash
# WordPress API 配置
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8000/wp-json/wp/v2
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8000

# 或使用 FastAPI 后端
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_BASE_URL=http://localhost:8000
```

### 2. 基本使用

#### 在客户端组件中使用

```typescript
'use client';

import { usePosts, useCategories } from '@/lib/wordpress';
import { BlogGrid } from '@/components/blog';
import { LoadingSpinner } from '@/components/blog/LoadingSpinner';

export default function MyBlogPage() {
  // 获取文章列表
  const { data, isLoading, error } = usePosts({
    page: 1,
    per_page: 12,
    _embed: true,
  });

  // 获取分类
  const { data: categories } = useCategories({
    hide_empty: true,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Blog</h1>
      <BlogGrid posts={data || []} />
    </div>
  );
}
```

### 3. 可用的 Hooks

#### 文章相关
```typescript
// 获取文章列表
const { data: posts } = usePosts({
  page: 1,
  per_page: 12,
  categories: [1, 2],  // 按分类筛选
  tags: [3, 4],        // 按标签筛选
  search: 'keyword',   // 搜索
  orderby: 'date',     // 排序
  order: 'desc',
});

// 获取单个文章
const { data: post } = usePost(123);

// 通过 slug 获取文章
const { data: post } = usePostBySlug('my-post-slug');

// 获取精选文章
const { data: featured } = useFeaturedPosts(5);

// 获取最新文章
const { data: recent } = useRecentPosts(10);
```

#### 分类相关
```typescript
// 获取所有分类
const { data: categories } = useCategories({
  hide_empty: true,
});

// 获取单个分类
const { data: category } = useCategory(1);

// 按分类获取文章
const { data: posts } = usePostsByCategory(1, {
  page: 1,
  per_page: 10,
});
```

#### 标签相关
```typescript
// 获取所有标签
const { data: tags } = useTags({
  hide_empty: true,
});

// 获取单个标签
const { data: tag } = useTag(1);

// 按标签获取文章
const { data: posts } = usePostsByTag(1, {
  page: 1,
  per_page: 10,
});
```

#### 搜索
```typescript
// 搜索文章
const { data: results } = useSearchPosts('keyword', {
  page: 1,
  per_page: 10,
});
```

### 4. 博客页面示例

#### 服务端组件 (推荐)

```typescript
// app/blog/page.tsx
import { BlogPageClient } from './components/BlogPageClient';

export default function BlogPage() {
  return <BlogPageClient />;
}
```

#### 客户端组件

```typescript
// app/blog/components/BlogPageClient.tsx
'use client';

import { usePosts } from '@/lib/wordpress';
import { BlogGrid } from '@/components/blog';

export function BlogPageClient() {
  const { data: posts, isLoading } = usePosts({
    page: 1,
    per_page: 12,
  });

  if (isLoading) return <div>Loading...</div>;

  return <BlogGrid posts={posts || []} />;
}
```

### 5. 数据适配

如果需要将 WordPress 数据转换为自定义格式：

```typescript
import { adaptWordPressPost } from '@/components/blog/utils/blogDataAdapter';

// WordPress API 返回的数据
const wpPost = {
  id: 123,
  title: { rendered: 'My Post' },
  content: { rendered: '<p>Content</p>' },
  // ...
};

// 转换为统一格式
const blogPost = adaptWordPressPost(wpPost);

console.log(blogPost);
// {
//   id: '123',
//   title: 'My Post',
//   content: '<p>Content</p>',
//   author: { ... },
//   categories: [ ... ],
//   // ...
// }
```

### 6. 组件使用

#### BlogGrid - 博客网格
```typescript
<BlogGrid
  posts={posts}
  columns={3}
  showAuthor={true}
  showDate={true}
  showCategories={true}
  showReadingTime={true}
/>
```

#### BlogList - 博客列表
```typescript
<BlogList
  posts={posts}
  showAuthor={true}
  showDate={true}
/>
```

#### ArticleCard - 文章卡片
```typescript
<ArticleCard
  post={post}
  showExcerpt={true}
  showAuthor={true}
/>
```

#### Pagination - 分页
```typescript
<Pagination
  currentPage={1}
  totalPages={10}
  baseUrl="/blog"
/>
```

#### CategoryFilter - 分类筛选
```typescript
<CategoryFilter />
```

#### BlogSearch - 搜索
```typescript
<BlogSearch
  onSearch={(query) => console.log(query)}
  placeholder="Search articles..."
/>
```

### 7. 错误处理

```typescript
import { usePosts } from '@/lib/wordpress';
import { EmptyState } from '@/components/blog/EmptyState';

export function MyComponent() {
  const { data, isLoading, error, refetch } = usePosts();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <EmptyState
        title="Failed to load posts"
        description={error.message}
        action={{
          label: 'Try Again',
          onClick: () => refetch(),
        }}
      />
    );
  }

  return <BlogGrid posts={data || []} />;
}
```

### 8. 类型安全

所有 hooks 都提供完整的 TypeScript 类型：

```typescript
import type {
  WordPressPost,
  WordPressCategory,
  WordPressTag,
} from '@/types/wordpress';

import type {
  BlogPost,
  BlogCategory,
  BlogTag,
} from '@/types/blog';
```

## 📚 完整示例

### 博客首页

```typescript
'use client';

import { usePosts, useCategories, useTags } from '@/lib/wordpress';
import {
  BlogGrid,
  BlogHero,
  CategoryFilter,
  BlogSearch,
  Pagination,
  LoadingSpinner,
  EmptyState,
} from '@/components/blog';
import { useSearchParams } from 'next/navigation';

export default function BlogHomePage() {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const { data: posts, isLoading, error } = usePosts({
    page,
    per_page: 12,
    category,
    search,
  });

  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <BlogHero
        title="Blog"
        description="Latest articles and tutorials"
      />

      <div className="container mx-auto py-12">
        <div className="mb-8">
          <BlogSearch />
          <CategoryFilter categories={categories} />
        </div>

        {posts && posts.length > 0 ? (
          <>
            <BlogGrid posts={posts} />
            <Pagination
              currentPage={page}
              totalPages={10}
              baseUrl="/blog"
            />
          </>
        ) : (
          <EmptyState title="No posts found" />
        )}
      </div>
    </div>
  );
}
```

## 🔧 配置选项

### React Query 配置

在 `app/providers.tsx` 中配置：

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

## 🐛 故障排除

### 问题: 无法连接到 WordPress API

**解决方案:**
1. 检查 `.env.local` 配置
2. 确认 WordPress 后端正在运行
3. 检查 CORS 设置

### 问题: 类型错误

**解决方案:**
```bash
cd frontend
npm run type-check
```

### 问题: 组件未找到

**解决方案:**
```typescript
// 确保从正确的路径导入
import { BlogGrid } from '@/components/blog'; // ✅ 正确
import { BlogGrid } from '@/components/blog/BlogGrid'; // ✅ 也正确
```

## 📖 更多资源

- [完整文档](./DEVELOPMENT_COMPLETION_REPORT_2026-03-07-ACTUAL.md)
- [文件清单](./FILES_CREATED_SUMMARY_2026-03-07-ACTUAL.txt)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

---

**最后更新**: 2026-03-07
**版本**: 1.0.0
