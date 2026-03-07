# 博客组件集成演示

这个页面展示了如何使用 CyberPress 平台的博客组件系统。

## 📦 功能特性

### 1. 多视图模式
- **网格视图**: 使用 `BlogGrid` 组件，以网格布局展示文章
- **列表视图**: 使用 `BlogList` 组件，以列表布局展示文章
- **赛博风格**: 使用 `BlogCardUnified` 组件，展示赛博朋克风格

### 2. 搜索和过滤
- **实时搜索**: 使用 `BlogSearch` 组件进行文章搜索
- **分类过滤**: 使用 `CategoryFilter` 组件按分类筛选文章

### 3. 数据格式兼容
- 支持标准 `BlogPost` 数据格式
- 支持 WordPress API 响应格式
- 通过 `BlogCardUnified` 组件自动适配

## 🚀 使用方法

### 访问演示页面

启动开发服务器后，访问：
```
http://localhost:3000/examples/blog-components-demo
```

### 组件使用示例

#### 1. BlogGrid 组件

```tsx
import { BlogGrid } from '@/components/blog/BlogGrid';

function MyBlogPage() {
  return (
    <BlogGrid
      posts={posts}
      loading={false}
      currentPage={1}
      totalPages={5}
      totalItems={50}
      onPageChange={(page) => console.log('Page:', page)}
      columns={3}
    />
  );
}
```

**Props:**
- `posts`: 文章数组（`BlogPost[]`）
- `loading`: 加载状态（boolean）
- `currentPage`: 当前页码（number）
- `totalPages`: 总页数（number）
- `totalItems`: 总文章数（number）
- `onPageChange`: 页面变化回调
- `columns`: 列数（2 | 3 | 4）
- `pageSize`: 每页文章数（number）

#### 2. BlogList 组件

```tsx
import { BlogList } from '@/components/blog/BlogList';

function MyBlogPage() {
  return (
    <BlogList
      posts={posts}
      loading={false}
      currentPage={1}
      totalPages={5}
      totalItems={50}
      onPageChange={(page) => console.log('Page:', page)}
    />
  );
}
```

**Props:**
- `posts`: 文章数组（`BlogPost[]`）
- `loading`: 加载状态（boolean）
- `currentPage`: 当前页码（number）
- `totalPages`: 总页数（number）
- `totalItems`: 总文章数（number）
- `onPageChange`: 页面变化回调
- `pageSize`: 每页文章数（number）

#### 3. BlogCardUnified 组件

```tsx
import { BlogCardUnified } from '@/components/blog/BlogCardUnified';

function MyBlogPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCardUnified
          key={post.id}
          post={post}
          variant="default" // 'default' | 'compact' | 'featured' | 'minimal'
          showStats={true}
          showAuthor={true}
          showDate={true}
          showReadTime={true}
          showExcerpt={true}
        />
      ))}
    </div>
  );
}
```

**Props:**
- `post`: 文章数据（支持多种格式）
- `variant`: 显示样式变体
- `showStats`: 显示统计信息
- `showAuthor`: 显示作者
- `showDate`: 显示日期
- `showReadTime`: 显示阅读时间
- `showExcerpt`: 显示摘要

## 📊 数据格式

### 标准 BlogPost 格式

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  date?: string;
  readingTime?: number;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
}
```

### WordPress API 格式

`BlogCardUnified` 组件会自动转换 WordPress API 响应格式：

```typescript
interface WordPressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  slug: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
    }>;
  };
}
```

## 🎨 自定义样式

所有组件都支持通过 `className` prop 自定义样式：

```tsx
<BlogGrid
  posts={posts}
  className="my-custom-class"
/>
```

## 🔧 集成到实际项目

### 1. 从 API 获取数据

```tsx
'use client';

import { useState, useEffect } from 'react';
import { BlogGrid } from '@/components/blog/BlogGrid';
import type { BlogPost } from '@/types/models/blog';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <BlogGrid posts={posts} />;
}
```

### 2. 服务端渲染（SSR）

```tsx
import { BlogGrid } from '@/components/blog/BlogGrid';
import { wpClient } from '@/lib/wordpress-client';

export default async function BlogPage() {
  const posts = await wpClient.getPosts({ per_page: 12 });

  return <BlogGrid posts={posts} />;
}
```

### 3. 与搜索集成

```tsx
'use client';

import { useState } from 'react';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogSearch } from '@/components/blog/BlogSearch';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    const response = await fetch(`/api/posts?q=${query}`);
    const data = await response.json();
    setPosts(data);
  };

  return (
    <div>
      <BlogSearch onSearch={handleSearch} />
      <BlogGrid posts={posts} />
    </div>
  );
}
```

## 📝 注意事项

1. **类型安全**: 确保 BlogPost 数据符合类型定义
2. **图片优化**: 使用 Next.js Image 组件优化图片加载
3. **错误处理**: 添加适当的错误处理和加载状态
4. **性能优化**: 对于大量文章，考虑使用虚拟化列表

## 🐛 故障排除

### 问题: 组件无法找到

**解决方案**: 确保导入路径正确：
```tsx
import { BlogGrid } from '@/components/blog/BlogGrid';
```

### 问题: 类型不匹配

**解决方案**: 使用 `BlogCardUnified` 组件，它支持多种数据格式：
```tsx
import { BlogCardUnified } from '@/components/blog/BlogCardUnified';

<BlogCardUnified post={post} />
```

### 问题: 样式冲突

**解决方案**: 使用 `className` prop 覆盖默认样式：
```tsx
<BlogGrid posts={posts} className="my-custom-styles" />
```

## 📚 相关文档

- [组件文档](../../components/blog/README.md)
- [类型定义](../../../types/models/blog.ts)
- [适配器文档](../../../lib/blog/adapters.ts)

## 🤝 贡献

如果发现问题或有改进建议，欢迎提交 Issue 或 Pull Request。

---

**最后更新**: 2026-03-07
**版本**: 1.0.0
