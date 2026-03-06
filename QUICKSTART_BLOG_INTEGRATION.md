# 博客系统快速开始指南

本指南将帮助你快速上手 CyberPress Platform 的博客系统开发。

## 📋 前置要求

- Node.js >= 18.17
- npm 或 yarn 或 pnpm
- 基础的 React 和 TypeScript 知识

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
# API 地址
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json

# 其他配置
NEXT_PUBLIC_ANALYTICS_ENABLED=false
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📚 核心概念

### 统一工具函数

所有工具函数都从 `@/lib/utils` 导入：

```typescript
import { cn, debounce, formatDate, formatNumber } from '@/lib/utils';

// 合并类名
const className = cn('px-4 py-2', isActive && 'bg-primary');

// 防抖函数
const handleSearch = debounce((query: string) => {
  console.log('搜索:', query);
}, 300);

// 格式化日期
const dateStr = formatDate(new Date()); // 2026年3月6日

// 格式化数字
const numStr = formatNumber(1234); // 1.2k
```

### 博客服务层

所有 API 调用通过 `blogService`：

```typescript
import { blogService } from '@/lib/services/blog';

// 获取文章列表
const { data, meta } = await blogService.getPosts({
  page: 1,
  pageSize: 10,
  category: ['tech'],
});

// 获取单篇文章
const post = await blogService.getPost('post-slug');

// 搜索文章
const results = await blogService.searchPosts('Next.js');

// 获取分类
const categories = await blogService.getCategories();

// 提交评论
const comment = await blogService.submitComment('post-id', {
  author: '张三',
  email: 'zhang@example.com',
  content: '很好的文章！',
});

// 点赞文章
await blogService.likePost('post-id');

// 收藏文章
await blogService.bookmarkPost('post-id');
```

### React Hooks

使用 Hooks 简化组件开发：

```typescript
import {
  usePosts,
  usePost,
  useSearch,
  useCategories,
  useLikePost,
  useBookmark,
} from '@/lib/hooks/useBlog';

// 文章列表
function BlogList() {
  const { posts, loading, error, meta } = usePosts({
    page: 1,
    pageSize: 12,
  });

  if (loading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;

  return (
    <>
      {posts.map(post => (
        <ArticleCard key={post.id} post={post} />
      ))}
      <Pagination
        currentPage={meta?.page}
        totalPages={meta?.totalPages}
      />
    </>
  );
}

// 文章详情
function PostDetail({ slug }) {
  const { post, loading } = usePost(slug);

  if (loading) return <div>加载中...</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// 搜索
function SearchBar() {
  const [query, setQuery] = useState('');
  const { results, loading } = useSearch(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索文章..."
      />
      {results.map(result => (
        <SearchResult key={result.id} {...result} />
      ))}
    </div>
  );
}

// 点赞和收藏
function PostActions({ postId }) {
  const { likePost, liking } = useLikePost();
  const { bookmarkPost, unbookmarkPost, bookmarking } = useBookmark();
  const [bookmarked, setBookmarked] = useState(false);

  const handleBookmark = async () => {
    if (bookmarked) {
      await unbookmarkPost(postId);
    } else {
      await bookmarkPost(postId);
    }
    setBookmarked(!bookmarked);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => likePost(postId)} disabled={liking}>
        {liking ? '点赞中...' : '👍 点赞'}
      </button>
      <button onClick={handleBookmark} disabled={bookmarking}>
        {bookmarked ? '❤️ 已收藏' : '🤍 收藏'}
      </button>
    </div>
  );
}
```

## 🎨 组件使用

### 文章卡片

```typescript
import { ArticleCardUnified } from '@/components/blog';

<ArticleCardUnified
  post={post}
  variant="default"  // default | featured | compact | minimal
  showExcerpt={true}
  showMeta={true}
  showAuthor={true}
  showCategory={true}
  showTags={false}
/>
```

### 文章列表

```typescript
import { BlogListUnified } from '@/components/blog';

<BlogListUnified
  posts={posts}
  variant="grid"  // grid | list
  columns={3}
/>
```

### 文章网格

```typescript
import { BlogGridUnified } from '@/components/blog';

<BlogGridUnified
  posts={posts}
  columns={3}  // 1-6 列
  gap={6}
/>
```

### 分页组件

```typescript
import { PaginationEnhanced } from '@/components/blog';

<PaginationEnhanced
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
  showFirstLast={true}
  showPrevNext={true}
/>
```

### 分类筛选器

```typescript
import { CategoryFilter } from '@/components/blog';

<CategoryFilter
  categories={categories}
  activeCategory={activeCategory}
  onSelectCategory={(slug) => setActiveCategory(slug)}
  layout="horizontal"  // horizontal | vertical
/>
```

### 搜索栏

```typescript
import { BlogSearchBar } from '@/components/blog';

<BlogSearchBar
  onSearch={(query) => console.log(query)}
  placeholder="搜索文章、分类、标签..."
  debounceTime={300}
  showSuggestions={true}
/>
```

## 🔧 高级用法

### 自定义配置

```typescript
import { CONFIG } from '@/lib/config/blog';

// 修改配置
CONFIG.pagination.defaultPageSize = 20;
CONFIG.search.debounceTime = 500;
CONFIG.cache.defaultTimeout = 10 * 60 * 1000; // 10 分钟

// 使用配置
const { posts } = usePosts({
  pageSize: CONFIG.pagination.defaultPageSize,
});
```

### 缓存管理

```typescript
import { blogService } from '@/lib/services/blog';

// 清除所有缓存
blogService.clearCache();

// 清除特定缓存
blogService.clearCache('posts');

// 禁用缓存
blogService.setCacheEnabled(false);

// 设置缓存超时
blogService.setCacheTimeout(10 * 60 * 1000); // 10 分钟
```

### 错误处理

```typescript
import { usePosts } from '@/lib/hooks/useBlog';

function BlogList() {
  const { posts, loading, error, refetch } = usePosts();

  if (loading) return <LoadingState />;
  if (error) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => refetch()}
        message="加载文章列表失败"
      />
    );
  }

  return <div>{/* ... */}</div>;
}
```

### 加载状态

```typescript
import { LoadingState } from '@/components/blog';

<LoadingState
  variant="spinner"  // spinner | skeleton | dots
  message="加载中..."
  fullScreen={false}
/>
```

## 📝 实际示例

### 博客首页

```typescript
'use client';

import { usePosts, useFeaturedPosts } from '@/lib/hooks/useBlog';
import { BlogGridUnified } from '@/components/blog';
import { BlogSearchBar } from '@/components/blog';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { posts, loading } = usePosts({
    search: searchQuery || undefined,
  });
  const { posts: featuredPosts } = useFeaturedPosts(3);

  return (
    <div>
      {/* 搜索栏 */}
      <BlogSearchBar onSearch={setSearchQuery} />

      {/* 特色文章 */}
      {featuredPosts.length > 0 && (
        <section>
          <h2>精选文章</h2>
          <BlogGridUnified posts={featuredPosts} columns={3} />
        </section>
      )}

      {/* 所有文章 */}
      <section>
        <h2>最新文章</h2>
        {loading ? (
          <LoadingState />
        ) : (
          <BlogGridUnified posts={posts} columns={3} />
        )}
      </section>
    </div>
  );
}
```

### 文章详情页

```typescript
'use client';

import { usePost } from '@/lib/hooks/useBlog';
import { ArticleCardUnified } from '@/components/blog';
import { useLikePost, useBookmark } from '@/lib/hooks/useBlog';

export default function PostDetailPage({ params }) {
  const { post, loading } = usePost(params.slug);
  const { likePost, liking } = useLikePost();
  const { bookmarkPost, bookmarking } = useBookmark();
  const [bookmarked, setBookmarked] = useState(false);

  if (loading) return <LoadingState />;
  if (!post) return <NotFound />;

  const handleBookmark = async () => {
    await bookmarkPost(post.id);
    setBookmarked(!bookmarked);
  };

  return (
    <article>
      <ArticleCardUnified post={post} variant="detail" />

      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="actions">
        <button onClick={() => likePost(post.id)} disabled={liking}>
          {liking ? '点赞中...' : '👍 点赞'}
        </button>
        <button onClick={handleBookmark} disabled={bookmarking}>
          {bookmarked ? '❤️ 已收藏' : '🤍 收藏'}
        </button>
      </div>
    </article>
  );
}
```

### 分类页面

```typescript
'use client';

import { useCategory, usePosts } from '@/lib/hooks/useBlog';
import { BlogListUnified } from '@/components/blog';

export default function CategoryPage({ params }) {
  const { category, loading: catLoading } = useCategory(params.slug);
  const { posts, loading, meta } = usePosts({
    category: [params.slug],
  });

  if (catLoading) return <LoadingState />;
  if (!category) return <NotFound />;

  return (
    <div>
      <h1>{category.name}</h1>
      <p>{category.description}</p>

      <BlogListUnified
        posts={posts}
        loading={loading}
        meta={meta}
      />
    </div>
  );
}
```

## 🐛 常见问题

### 导入错误

**问题**: `Cannot find module '@/lib/utils'`

**解决**:
确保 `tsconfig.json` 中配置了路径别名：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### API 调用失败

**问题**: `API request failed`

**解决**:
1. 检查 `.env.local` 配置
2. 确保后端服务正在运行
3. 检查网络连接

### 类型错误

**问题**: TypeScript 类型不匹配

**解决**:
确保使用统一的类型定义：

```typescript
import type { Post, Category, Tag } from '@/types/blog';
```

## 📚 更多资源

- [完整文档](./BLOG_INTEGRATION_REPORT.md)
- [组件清单](./COMPONENT_USAGE_GUIDE.md)
- [API 文档](./API_DOCUMENTATION.md)
- [开发任务](./TODO.md)

## 🆘 获取帮助

如有问题，请查看：
- GitHub Issues
- 项目 Wiki
- 开发文档

---

**最后更新**: 2026-03-06
**版本**: 1.0.0
