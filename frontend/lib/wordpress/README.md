# 🌐 WordPress REST API Client

> CyberPress Platform 的 WordPress REST API 客户端

## 📋 概述

这是一个完整的 TypeScript WordPress REST API 客户端，专为 Next.js 14 应用设计。它提供了类型安全的数据获取、自动缓存、错误处理等功能。

## 🚀 快速开始

### 1. 环境配置

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json
NEXT_PUBLIC_WORDPRESS_API_USERNAME=your_username
NEXT_PUBLIC_WORDPRESS_API_PASSWORD=your_application_password
```

### 2. 基础使用

```typescript
import { wpClient } from '@/lib/wordpress/client';

// 获取文章列表
const posts = await wpClient.getPosts({
  page: 1,
  perPage: 10,
  status: 'publish'
});

// 获取单篇文章
const post = await wpClient.getPost('post-slug');

// 获取分类
const categories = await wpClient.getCategories();

// 搜索文章
const results = await wpClient.searchPosts('search term');
```

### 3. 使用 React Hooks

```typescript
import { usePosts, usePost } from '@/lib/wordpress/hooks';

function BlogPage() {
  const { posts, loading, error } = usePosts({
    page: 1,
    perPage: 10
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## 📚 API 文档

### 文章 API

#### `getPosts(params)`
获取文章列表

**参数：**
```typescript
interface GetPostsParams {
  page?: number;           // 页码，默认 1
  perPage?: number;        // 每页数量，默认 10
  category?: number[];     // 分类 ID 数组
  tag?: number[];          // 标签 ID 数组
  author?: number[];       // 作者 ID 数组
  search?: string;         // 搜索关键词
  status?: 'publish' | 'pending' | 'draft' | 'private';  // 文章状态
  orderBy?: 'date' | 'title' | 'relevance';  // 排序方式
  order?: 'asc' | 'desc';  // 排序方向
  exclude?: number[];      // 排除的文章 ID
  include?: number[];      // 包含的文章 ID
}
```

**返回：**
```typescript
interface PostsResponse {
  posts: BlogPost[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    perPage: number;
  };
}
```

#### `getPost(slug)`
获取单篇文章

**参数：**
- `slug`: 文章的 slug

**返回：**
```typescript
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: Author;
  categories: Category[];
  tags: Tag[];
  date: string;
  modified: string;
  featuredMedia?: Media;
  meta: PostMeta;
}
```

### 分类 API

#### `getCategories(params)`
获取分类列表

**参数：**
```typescript
interface GetCategoriesParams {
  page?: number;
  perPage?: number;
  hideEmpty?: boolean;  // 隐藏空分类
  parent?: number;      // 父分类 ID
}
```

#### `getCategory(id)`
获取单个分类

**参数：**
- `id`: 分类 ID 或 slug

### 标签 API

#### `getTags(params)`
获取标签列表

**参数：**
```typescript
interface GetTagsParams {
  page?: number;
  perPage?: number;
  hideEmpty?: boolean;
}
```

#### `getTag(id)`
获取单个标签

### 评论 API

#### `getComments(params)`
获取评论列表

**参数：**
```typescript
interface GetCommentsParams {
  post?: number;    // 文章 ID
  page?: number;
  perPage?: number;
  order?: 'asc' | 'desc';
}
```

### 用户 API

#### `getUsers(params)`
获取用户列表

**参数：**
```typescript
interface GetUsersParams {
  page?: number;
  perPage?: number;
  role?: string;
}
```

#### `getUser(id)`
获取单个用户

### 媒体 API

#### `getMedia(id)`
获取媒体文件

**参数：**
- `id`: 媒体 ID

## 🔧 配置选项

### 客户端配置

```typescript
// lib/wordpress/config.ts
export const wpConfig = {
  apiUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL!,
  username: process.env.NEXT_PUBLIC_WORDPRESS_API_USERNAME,
  password: process.env.NEXT_PUBLIC_WORDPRESS_API_PASSWORD,
  cache: {
    enabled: true,
    ttl: 300,  // 5分钟
  },
  retry: {
    attempts: 3,
    delay: 1000,
  },
};
```

### 自定义拦截器

```typescript
// 请求拦截器
wpClient.setRequestInterceptor((config) => {
  // 添加自定义头
  config.headers['X-Custom-Header'] = 'value';
  return config;
});

// 响应拦截器
wpClient.setResponseInterceptor((response) => {
  // 处理响应数据
  return response.data;
});
```

## 🎯 React Hooks

### `usePosts(params)`
获取文章列表

```typescript
const { posts, loading, error, pagination, refetch } = usePosts({
  page: 1,
  perPage: 10,
});
```

### `usePost(slug)`
获取单篇文章

```typescript
const { post, loading, error } = usePost('post-slug');
```

### `useCategories(params)`
获取分类列表

```typescript
const { categories, loading, error } = useCategories();
```

### `useTags(params)`
获取标签列表

```typescript
const { tags, loading, error } = useTags();
```

## 🔐 认证

### Basic Auth
```typescript
import { wpClient } from '@/lib/wordpress/client';

// 设置认证
wpClient.setAuth({
  username: 'your_username',
  password: 'your_app_password'
});
```

### JWT Token
```typescript
// 设置 JWT Token
wpClient.setToken('your_jwt_token');
```

## 📊 数据转换

客户端会自动将 WordPress 数据转换为应用使用的格式：

```typescript
// WordPress 原始格式
{
  id: 123,
  title: { rendered: "Post Title" },
  content: { rendered: "<p>Post content...</p>" },
  _embedded: {
    author: [{ id: 1, name: "Author Name" }],
    'wp:term': [[{ id: 5, name: "Category" }]]
  }
}

// 转换后格式
{
  id: 123,
  title: "Post Title",
  content: "<p>Post content...</p>",
  author: { id: 1, name: "Author Name" },
  categories: [{ id: 5, name: "Category" }]
}
```

## ⚡ 性能优化

### 缓存策略

```typescript
// 启用缓存
wpClient.enableCache();

// 设置缓存时间
wpClient.setCacheConfig({
  defaultTTL: 300,  // 5分钟
  posts: {
    ttl: 600,       // 10分钟
  },
});

// 清除缓存
wpClient.clearCache();
```

### 预取数据

```typescript
import { usePrefetchPost } from '@/lib/wordpress/hooks';

function PostList({ posts }) {
  const prefetchPost = usePrefetchPost();

  return (
    <div>
      {posts.map(post => (
        <div
          key={post.id}
          onMouseEnter={() => prefetchPost(post.slug)}
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
```

## 🐛 错误处理

客户端自动处理以下错误：

- 网络错误
- 超时错误
- 4xx/5xx 响应
- 数据格式错误

```typescript
try {
  const posts = await wpClient.getPosts();
} catch (error) {
  if (error instanceof NetworkError) {
    // 处理网络错误
  } else if (error instanceof ApiError) {
    // 处理 API 错误
  }
}
```

## 📝 类型定义

所有类型定义在 `types/models/blog.ts` 中：

```typescript
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: Author;
  categories: Category[];
  tags: Tag[];
  date: string;
  modified: string;
  featuredMedia?: Media;
  meta: PostMeta;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent?: number;
  count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
}
```

## 🧪 测试

```typescript
import { wpClient } from '@/lib/wordpress/client';

describe('WordPress Client', () => {
  it('should fetch posts', async () => {
    const result = await wpClient.getPosts({ page: 1 });
    expect(result.posts).toBeDefined();
    expect(result.pagination).toBeDefined();
  });

  it('should handle errors', async () => {
    await expect(
      wpClient.getPost('invalid-slug')
    ).rejects.toThrow();
  });
});
```

## 📚 相关文档

- [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)
- [Next.js 数据获取](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React Query 文档](https://tanstack.com/query/latest)

---

**版本**: 1.0.0
**创建日期**: 2026-03-07
**维护者**: AI Development Team
