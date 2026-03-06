# 数据层快速启动指南

本指南将帮助您快速开始使用新创建的数据层和组件。

---

## 🚀 快速开始

### 1. 配置环境变量

创建或更新 `.env.local` 文件：

```bash
# WordPress API URL
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json

# 示例：
# NEXT_PUBLIC_WORDPRESS_API_URL=https://example.com/wp-json
```

---

### 2. 基础使用示例

#### 获取文章列表（服务端组件）

```typescript
// app/blog/page.tsx
import { getPosts } from '@/lib/data';
import { BlogGrid } from '@/components/blog/BlogGrid';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const page = parseInt(searchParams.page || '1');

  // 在服务端获取数据
  const { posts, pagination } = await getPosts({
    page,
    perPage: 12,
    category: searchParams.category,
  });

  return (
    <div>
      <h1>Blog</h1>
      <BlogGrid
        posts={posts}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
      />
    </div>
  );
}
```

#### 获取单篇文章

```typescript
// app/blog/[slug]/page.tsx
import { getPostBySlug } from '@/lib/data';
import { ArticleDetail } from '@/components/blog/ArticleDetail';

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug({ slug: params.slug });

  if (!post) {
    return <div>Post not found</div>;
  }

  return <ArticleDetail post={post} />;
}
```

#### 使用自适应组件

```typescript
import { BlogCardAdaptive } from '@/components/blog/BlogCardAdaptive';

// 自动适配不同格式的数据
function PostList({ posts }: { posts: any[] }) {
  return (
    <div>
      {posts.map((post) => (
        <BlogCardAdaptive
          key={post.id}
          post={post} // 可以是 WordPress 格式或 BlogPost 格式
          variant="default"
          showExcerpt={true}
          showAuthor={true}
        />
      ))}
    </div>
  );
}
```

---

### 3. 高级用法

#### 带筛选的文章列表

```typescript
import { getPosts } from '@/lib/data';

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  // 获取分类信息
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return <div>Category not found</div>;
  }

  // 获取该分类的文章
  const { posts, pagination } = await getPosts({
    page: 1,
    perPage: 12,
    category: category.id.toString(),
  });

  return (
    <div>
      <h1>{category.name}</h1>
      <BlogGrid posts={posts} />
    </div>
  );
}
```

#### 搜索功能

```typescript
import { searchPosts } from '@/lib/data';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';

  const { posts, pagination } = await searchPosts(query, {
    page: 1,
    perPage: 12,
  });

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <BlogGrid posts={posts} />
    </div>
  );
}
```

#### 获取分类和标签

```typescript
import {
  getAllCategories,
  getAllTags,
  getPopularCategories,
} from '@/lib/data';
import { CategoryList } from '@/components/blog/CategoryList';
import { TagCloud } from '@/components/blog/TagCloud';

export default async function Sidebar() {
  // 获取所有分类
  const categories = await getAllCategories();

  // 获取热门标签
  const tags = await getPopularTags(20);

  return (
    <aside>
      <CategoryList categories={categories} />
      <TagCloud tags={tags} />
    </aside>
  );
}
```

---

### 4. 数据适配器使用

如果您有来自 WordPress API 的原始数据：

```typescript
import { adaptWordPressPosts } from '@/lib/data/adapter';

// WordPress API 响应
const wpResponse = await fetch('https://example.com/wp-json/wp/v2/posts');
const wpPosts = await wpResponse.json();

// 转换为 BlogPost 格式
const posts = adaptWordPressPosts(wpPosts);

// 现在可以在任何组件中使用
return <BlogGrid posts={posts} />;
```

---

### 5. 客户端数据获取

如果您需要在客户端获取数据：

```typescript
'use client';

import { useState, useEffect } from 'react';
import type { BlogPost } from '@/types/models/blog';

export function useClientPosts(page: number = 1) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const response = await fetch(`/api/posts?page=${page}`);
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [page]);

  return { posts, loading, error };
}
```

---

## 📋 组件 Props 参考

### BlogCardAdaptive

```typescript
interface BlogCardAdaptiveProps {
  post: any; // 自动适配 WordPress 或 BlogPost 格式
  variant?: 'default' | 'compact' | 'featured';
  showExcerpt?: boolean; // 默认 true
  showAuthor?: boolean; // 默认 true
  showDate?: boolean; // 默认 true
  showReadingTime?: boolean; // 默认 true
  showCategory?: boolean; // 默认 true
  className?: string;
}
```

### BlogGrid

```typescript
interface BlogGridProps {
  posts: BlogPost[];
  columns?: 2 | 3 | 4; // 默认 3
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number; // 默认 9
  emptyMessage?: string; // 默认 '暂无文章'
  className?: string;
}
```

### BlogList

```typescript
interface BlogListProps {
  posts: BlogPost[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number; // 默认 10
  emptyMessage?: string; // 默认 '暂无文章'
  className?: string;
}
```

---

## 🎨 样式定制

所有组件都使用 Tailwind CSS，您可以通过 `className` prop 自定义样式：

```typescript
<BlogCardAdaptive
  post={post}
  className="border-2 border-purple-500 rounded-xl"
/>
```

---

## 🔧 故障排查

### 问题 1: "WordPress API URL not configured"

**解决方案**:
确保在 `.env.local` 中设置了 `NEXT_PUBLIC_WORDPRESS_API_URL`

### 问题 2: 数据不显示

**检查清单**:
- [ ] WordPress API URL 是否正确
- [ ] 网络请求是否成功（检查浏览器控制台）
- [ ] 数据格式是否正确（使用 `adaptPost` 转换）
- [ ] 组件 props 是否正确传递

### 问题 3: 类型错误

**解决方案**:
确保导入正确的类型：
```typescript
import type { BlogPost } from '@/types/models/blog';
```

---

## 📚 更多资源

- [完整 API 文档](./API_DOCUMENTATION.md)
- [组件文档](./COMPONENT_DOCUMENTATION.md)
- [类型定义](./frontend/types/models/blog.ts)

---

## 🆘 获取帮助

如有问题，请查看：
1. [开发任务报告](./DEVELOPMENT_TASKS_2026-03-07-ACTUAL.md)
2. [项目 README](./README.md)
3. [GitHub Issues](https://github.com/957662/wordpress-cyberpunk-theme/issues)

---

**最后更新**: 2026-03-07
