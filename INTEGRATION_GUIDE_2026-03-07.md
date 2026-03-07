# 集成指南 - 新创建的文件

## 📋 快速开始

### 1. 安装依赖

```bash
# 进入前端目录
cd frontend

# 确保安装了必要的依赖
npm install @tanstack/react-query
npm install framer-motion
```

### 2. 环境配置

创建或更新 `frontend/.env.local`:

```env
# WordPress API 配置
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json
NEXT_PUBLIC_WP_API_USERNAME=
NEXT_PUBLIC_WP_API_PASSWORD=

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 分析配置
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_ANALYTICS_ENABLED=true
```

### 3. 配置 React Query

在 `frontend/app/providers.tsx` 或相应的 providers 文件中：

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## 🎯 使用方式

### 在页面中使用

#### 博客列表页面

```typescript
// frontend/app/blog/page.tsx (已创建)
import { wordpressDataService } from '@/services/blog/wordpress-data-service';

export default async function BlogPage() {
  const { posts, total, totalPages } = await wordpressDataService.getPosts({
    page: 1,
    per_page: 12,
  });

  return <BlogList posts={posts} />;
}
```

#### 客户端组件中使用 Hooks

```typescript
'use client';

import { usePosts, useCategories } from '@/hooks/blog/use-blog-data';

export function BlogPageClient() {
  const { data: postsData, isLoading } = usePosts({ page: 1 });
  const { data: categoriesData } = useCategories();

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <CategoryFilter categories={categoriesData.categories} />
      <BlogList posts={postsData.posts} />
    </div>
  );
}
```

### 使用缓存服务

```typescript
import { blogCache } from '@/services/blog/blog-data-cache';

// 手动缓存数据
blogCache.set('posts', { page: 1 }, postsData);

// 获取缓存数据
const cached = blogCache.get('posts', { page: 1 });

// 清除缓存
blogCache.invalidate('posts');
```

### 后端 API 使用

```python
# 在 FastAPI 路由中使用
from fastapi import APIRouter, Depends
from app.api.analytics.enhanced import router as analytics_router

# 注册路由
app.include_router(analytics_router)

# 访问端点
# GET /api/analytics/overview?period=7d
# GET /api/analytics/trending?limit=10
```

## 🔧 配置选项

### WordPress 数据服务配置

```typescript
// frontend/services/blog/wordpress-data-service.ts

// 自定义配置
const customConfig = {
  baseUrl: 'https://your-wordpress.com/wp-json',
  timeout: 10000,
  headers: {
    'Authorization': 'Basic your_credentials',
  },
};
```

### 缓存配置

```typescript
// frontend/services/blog/blog-data-cache.ts

// 创建自定义缓存实例
const customCache = new BlogDataCache({
  ttl: 10 * 60 * 1000, // 10 minutes
  maxSize: 200,         // 200 items
});
```

## 📊 数据流

### 服务端渲染流程

```
1. 用户请求页面
   ↓
2. Next.js 服务端调用 wordpressDataService
   ↓
3. 数据从 WordPress API 获取
   ↓
4. 数据适配为应用格式
   ↓
5. 页面渲染并发送给客户端
   ↓
6. 客户端 hydrate
```

### 客户端数据流程

```
1. 组件调用 usePosts Hook
   ↓
2. Hook 检查 React Query 缓存
   ↓
3. 如果缓存有效，直接返回
   ↓
4. 如果缓存失效，调用 API
   ↓
5. 数据存储到 blogCache
   ↓
6. 返回数据给组件
```

## 🐛 故障排除

### 问题 1: 类型错误

```typescript
// 确保 @/types/models/blog.ts 正确导入
import type { BlogPost } from '@/types/models';

// 检查 tsconfig.json 路径别名
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### 问题 2: API 请求失败

```bash
# 检查网络请求
curl -I https://your-wordpress.com/wp-json/wp/v2/posts

# 检查 CORS 配置
# WordPress 需要允许你的域名
```

### 问题 3: 缓存不生效

```typescript
// 确保使用了正确的 Query Keys
import { blogQueryKeys } from '@/hooks/blog/use-blog-data';

// 检查缓存配置
console.log(blogCache.getStats());
```

## 🧪 测试

### 单元测试示例

```typescript
import { wordpressDataService } from '@/services/blog/wordpress-data-service';

describe('WordPressDataService', () => {
  it('should adapt post correctly', () => {
    const wpPost = {
      id: 1,
      title: { rendered: 'Test Post' },
      // ... other fields
    };
    
    const adapted = wordpressDataService.adaptPost(wpPost);
    expect(adapted.title).toBe('Test Post');
  });
});
```

### 集成测试示例

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { usePosts } from '@/hooks/blog/use-blog-data';

describe('usePosts', () => {
  it('should fetch posts', async () => {
    const { result } = renderHook(() => usePosts({ page: 1 }));
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined();
    });
  });
});
```

## 📈 性能优化建议

### 1. 启用静态生成

```typescript
// frontend/app/blog/page.tsx
export const revalidate = 300; // 5 minutes

// 或使用增量静态再生
export const dynamic = 'force-static';
```

### 2. 图片优化

```typescript
import Image from 'next/image';

<Image
  src={post.coverImage}
  alt={post.title}
  width={800}
  height={600}
  loading="lazy"
/>
```

### 3. 代码分割

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

## 🔄 数据同步

### WordPress 变更后刷新缓存

```typescript
import { useInvalidateBlog } from '@/hooks/blog/use-blog-data';

function RefreshButton() {
  const { invalidateAll } = useInvalidateBlog();
  
  return (
    <button onClick={invalidateAll}>
      刷新数据
    </button>
  );
}
```

### Webhook 集成

```typescript
// frontend/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (body.type === 'post_updated') {
    revalidatePath('/blog');
    revalidatePath(`/blog/${body.slug}`);
  }
  
  return Response.json({ revalidated: true });
}
```

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [React Query 文档](https://tanstack.com/query/latest)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [FastAPI 文档](https://fastapi.tiangolo.com/)

---

**创建日期**: 2026-03-07
**版本**: 1.0.0
