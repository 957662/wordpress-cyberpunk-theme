# 🚀 WordPress Integration Quick Reference
# WordPress 集成快速参考

> 快速开始使用 CyberPress WordPress 集成

---

## ⚡ 5 分钟快速开始

### 1️⃣ 配置环境变量

```bash
# 复制配置文件
cp frontend/.env.wordpress.example frontend/.env.local

# 编辑 frontend/.env.local
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json
```

### 2️⃣ 基础使用

```typescript
// Server Component
import { wpClient } from '@/lib/wordpress-client';

export default async function BlogPage() {
  const posts = await wpClient.getPosts({ per_page: 10, _embed: true });
  return <BlogGrid posts={posts} />;
}
```

```typescript
// Client Component
'use client';
import { usePosts } from '@/hooks/use-wordpress';

export default function BlogPage() {
  const { posts, loading, error } = usePosts({ per_page: 10 });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <BlogGrid posts={posts} />;
}
```

---

## 📚 常用 Hooks

### 文章相关

```typescript
// 文章列表
const { posts, loading, error } = usePosts({ per_page: 10 });

// 单篇文章
const { post, loading, error } = usePost(123);
const { post, loading, error } = usePostBySlug('hello-world');

// 分页文章
const { posts, page, nextPage, prevPage } = usePaginatedPosts(1, 10);

// 最新文章
const { posts } = useLatestPosts(5);

// 相关文章
const { posts } = useRelatedPosts(123);
```

### 分类和标签

```typescript
// 分类列表
const { categories } = useCategories();

// 单个分类
const { category } = useCategory(1);

// 分类文章
const { posts } = useCategoryPosts(1);

// 标签列表
const { tags } = useTags();

// 标签文章
const { posts } = useTagPosts(1);
```

### 搜索

```typescript
// 搜索功能
const { results, loading, search, clearSearch } = useSearch();

// 使用
<SearchBar onSearch={search} />
<BlogGrid posts={results} />
```

---

## 🛠️ 常用工具函数

### 日期处理

```typescript
import { formatDate, formatRelativeTime, calculateReadingTime } from '@/lib/date';

// 格式化日期
formatDate(post.date) // "2026年3月7日"
formatDate(post.date, 'relative') // "2天前"

// 计算阅读时间
calculateReadingTime(post.content.rendered) // 5 (分钟)
```

### 字符串处理

```typescript
import { extractExcerpt, truncate, slugify } from '@/lib/string';

// 提取摘要
extractExcerpt(post.content.rendered, 150) // "前150个字符..."

// 截断文本
truncate(text, 100) // "前100个字符..."

// URL 友好化
slugify("Hello World!") // "hello-world"
```

---

## 🎨 常用组件

### SearchBar

```typescript
import { SearchBar } from '@/components/blog/SearchBar';

<SearchBar
  placeholder="搜索文章..."
  onSearch={(query) => console.log(query)}
  delay={300}
  showSuggestions={true}
  suggestions={['React', 'Vue', 'Angular']}
/>
```

### BlogGrid

```typescript
import { BlogGrid } from '@/components/blog/BlogGrid';

<BlogGrid
  posts={posts}
  columns={3}
  gap="md"
  showExcerpt={true}
  showAuthor={true}
/>
```

### BlogList

```typescript
import { BlogList } from '@/components/blog/BlogList';

<BlogList
  posts={posts}
  currentPage={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  pageSize={10}
/>
```

---

## 📋 常见场景

### 场景 1: 博客首页

```typescript
'use client';

import { usePaginatedPosts } from '@/hooks/use-wordpress';
import { BlogGrid, Pagination } from '@/components/blog';

export default function BlogPage() {
  const { posts, loading, page, totalPages, nextPage, prevPage } =
    usePaginatedPosts(1, 12);

  return (
    <>
      <BlogGrid posts={posts} columns={3} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onNext={nextPage}
        onPrev={prevPage}
      />
    </>
  );
}
```

### 场景 2: 文章详情页

```typescript
'use client';

import { usePostBySlug } from '@/hooks/use-wordpress';
import { useParams } from 'next/navigation';

export default function PostDetail() {
  const params = useParams();
  const { post, loading, error } = usePostBySlug(params.slug as string);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <article>
      <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}
```

### 场景 3: 搜索页面

```typescript
'use client';

import { useSearch } from '@/hooks/use-wordpress';
import { SearchBar } from '@/components/blog/SearchBar';
import { BlogGrid } from '@/components/blog/BlogGrid';

export default function SearchPage() {
  const { results, loading, search, clearSearch } = useSearch();

  return (
    <>
      <SearchBar onSearch={search} onClear={clearSearch} />
      {loading && <div>Searching...</div>}
      <BlogGrid posts={results} />
    </>
  );
}
```

### 场景 4: 分类页面

```typescript
'use client';

import { useCategoryPosts } from '@/hooks/use-wordpress';
import { BlogGrid } from '@/components/blog/BlogGrid';

export default function CategoryPage({ categoryId }: { categoryId: number }) {
  const { posts, loading } = useCategoryPosts(categoryId);

  return (
    <>
      {loading && <div>Loading...</div>}
      <BlogGrid posts={posts} />
    </>
  );
}
```

---

## 🔧 配置选项

### WordPress API

```env
# 必填
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json

# 可选
NEXT_PUBLIC_WORDPRESS_API_TIMEOUT=10000
NEXT_PUBLIC_WORDPRESS_POSTS_PER_PAGE=12
NEXT_PUBLIC_WORDPRESS_IMAGE_SIZE=large
NEXT_PUBLIC_WORDPRESS_EMBED_ENABLED=true
```

### 缓存

```env
NEXT_PUBLIC_WORDPRESS_CACHE_ENABLED=true
NEXT_PUBLIC_WORDPRESS_CACHE_DURATION=300
```

---

## 🐛 调试技巧

### 1. 检查 API 连接

```typescript
import { wpClient } from '@/lib/wordpress-client';

const isHealthy = await wpClient.healthCheck();
console.log('API Health:', isHealthy);
```

### 2. 查看错误信息

```typescript
const { posts, loading, error } = usePosts();

if (error) {
  console.error('Error details:', error);
  console.error('Error message:', error.message);
  console.error('Error stack:', error.stack);
}
```

### 3. 监控加载状态

```typescript
const { posts, loading } = usePosts();

console.log('Loading:', loading);
console.log('Posts count:', posts?.length);
```

---

## 💡 最佳实践

### 1. 错误处理

```typescript
try {
  const posts = await wpClient.getPosts();
} catch (error) {
  console.error('Failed to fetch posts:', error);
  // 显示错误消息给用户
}
```

### 2. 加载状态

```typescript
const { posts, loading, error } = usePosts();

if (loading) return <BlogLoadingState />;
if (error) return <ErrorMessage error={error} />;
return <BlogGrid posts={posts} />;
```

### 3. 类型安全

```typescript
import type { WordPressPost } from '@/lib/wordpress-client';

function displayPost(post: WordPressPost) {
  // TypeScript 会检查类型
  console.log(post.title.rendered);
}
```

### 4. 性能优化

```typescript
// 使用防抖
const debouncedSearch = debounce(search, 300);

// 使用缓存
const { posts } = usePosts({ per_page: 10 });
```

---

## 📚 更多资源

### 文档

- [WordPress Integration Guide](./WORDPRESS_INTEGRATION_GUIDE.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- [Quick Start](./QUICKSTART.md)

### API 参考

- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [React Hooks](https://react.dev/reference/react)
- [Next.js](https://nextjs.org/docs)

---

**最后更新**: 2026-03-07
**版本**: v1.0.0

🎉 **开始使用吧！**
