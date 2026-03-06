# 🚀 使用指南 - CyberPress 博客组件

## 快速开始

### 1. 导入组件和 Hooks

```typescript
// 导入博客组件
import { BlogList } from '@/components/blog/BlogListComplete';
import { BlogGrid } from '@/components/blog/BlogGridComplete';
import { ArticleCard } from '@/components/blog/ArticleCardComplete';

// 导入 React Query Hooks
import { 
  usePosts, 
  usePost, 
  useCategories, 
  useTags,
  useAuthors 
} from '@/lib/wordpress/hooks-final';
```

### 2. 创建博客列表页面

```typescript
// app/blog/page.tsx
'use client';

import { BlogGrid } from '@/components/blog/BlogGridComplete';
import { usePosts } from '@/lib/wordpress/hooks-final';

export default function BlogPage() {
  // 获取文章列表
  const { data: posts, isLoading, error } = usePosts({
    page: 1,
    pageSize: 12,
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // 加载状态
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--cyber-cyan)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">加载失败</h2>
          <p className="text-gray-400">{error.message}</p>
        </div>
      </div>
    );
  }

  // 显示文章网格
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">博客文章</h1>
      <BlogGrid posts={posts || []} columns={3} />
    </div>
  );
}
```

### 3. 创建博客详情页面

```typescript
// app/blog/[slug]/page.tsx
'use client';

import { usePost } from '@/lib/wordpress/hooks-final';
import { useParams } from 'next/navigation';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = usePost(slug);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;
  if (!post) return <div>文章不存在</div>;

  return (
    <article className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
      <div className="text-gray-400 mb-8">
        <span>{post.author?.name}</span>
        <span className="mx-2">•</span>
        <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### 4. 带分类筛选的博客页面

```typescript
'use client';

import { useState } from 'react';
import { BlogList } from '@/components/blog/BlogListComplete';
import { usePosts, useCategories } from '@/lib/wordpress/hooks-final';

export default function BlogWithFilterPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { data: posts, isLoading } = usePosts({
    category: selectedCategory ? [selectedCategory] : undefined,
  });
  
  const { data: categories } = useCategories();

  return (
    <div className="container mx-auto px-6 py-12">
      {/* 分类筛选 */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">分类</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-lg ${
              !selectedCategory 
                ? 'bg-[var(--cyber-cyan)] text-black' 
                : 'bg-[var(--cyber-muted)] text-gray-400'
            }`}
          >
            全部
          </button>
          {categories?.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category.id
                  ? 'bg-[var(--cyber-cyan)] text-black'
                  : 'bg-[var(--cyber-muted)] text-gray-400'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* 文章列表 */}
      <BlogList 
        posts={posts || []} 
        loading={isLoading}
        variant="grid"
      />
    </div>
  );
}
```

### 5. 使用单个文章卡片

```typescript
import { ArticleCard } from '@/components/blog/ArticleCardComplete';

function FeaturedPost({ post }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">推荐文章</h2>
      <ArticleCard post={post} />
    </div>
  );
}
```

## 高级用法

### 自定义 WordPress API 端点

```typescript
// .env.local
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com
```

### 使用 PostFilters 进行高级筛选

```typescript
import { PostFilters } from '@/types/blog';

const filters: PostFilters = {
  page: 1,
  pageSize: 20,
  search: 'React',
  category: ['1', '2'],
  tags: ['3'],
  author: ['5'],
  sortBy: 'views',
  sortOrder: 'desc',
  featured: true,
};

const { data } = usePosts(filters);
```

### 服务端渲染 (SSR)

```typescript
// app/blog/page.tsx (服务端组件)
import { BlogGrid } from '@/components/blog/BlogGridComplete';
import { wpClient } from '@/lib/wordpress/client-final';

export default async function BlogPageSSR() {
  // 在服务端获取数据
  const postsData = await wpClient.getPosts({ per_page: 12 });
  const posts = postsData.data;

  return <BlogGrid posts={posts} columns={3} />;
}
```

## 样式定制

### 覆盖默认样式

```css
/* globals.css */
:root {
  --cyber-dark: #0a0a0f;
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
  --cyber-pink: #ff0080;
  --cyber-muted: #1a1a2e;
  --cyber-border: #2a2a3e;
}
```

### 自定义卡片样式

```typescript
<ArticleCard 
  post={post}
  className="custom-card-style"
/>
```

## 性能优化

### 启用 React Query 缓存

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分钟
      cacheTime: 10 * 60 * 1000, // 10 分钟
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 图片优化

```typescript
import Image from 'next/image';

<Image
  src={post.featuredImage}
  alt={post.title}
  width={800}
  height={600}
  loading="lazy"
/>
```

## 常见问题

### Q: 如何处理加载状态？
A: 使用 `isLoading` 和 `error` 状态：

```typescript
const { data, isLoading, error } = usePosts();

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error.message} />;
```

### Q: 如何实现分页？
A: 使用 `page` 和 `pageSize` 参数：

```typescript
const [page, setPage] = useState(1);

const { data } = usePosts({ page, pageSize: 12 });

// 分页按钮
<button onClick={() => setPage(page - 1)} disabled={page === 1}>
  上一页
</button>
<button onClick={() => setPage(page + 1)}>
  下一页
</button>
```

### Q: 如何搜索文章？
A: 使用 `search` 参数：

```typescript
const [searchQuery, setSearchQuery] = useState('');

const { data } = usePosts({ 
  search: searchQuery 
});

<input 
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="搜索文章..."
/>
```

## 总结

通过本指南，你已经学会了：

✅ 导入和使用博客组件
✅ 使用 React Query Hooks 获取数据
✅ 创建列表和详情页面
✅ 实现分类和标签筛选
✅ 处理加载和错误状态
✅ 自定义样式和性能优化

开始构建你的赛博朋克博客吧！🚀
