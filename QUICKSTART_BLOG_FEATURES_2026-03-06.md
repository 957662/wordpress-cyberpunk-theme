# 🚀 博客功能快速使用指南

**更新时间**: 2026-03-06

本文档提供新创建博客组件的快速使用示例。

---

## 📦 组件快速参考

### 1. BlogCardNew - 博客卡片

#### 基础使用

```tsx
import { BlogCardNew } from '@/components/blog/BlogCardNew';

function BlogList({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map(post => (
        <BlogCardNew key={post.id} post={post} />
      ))}
    </div>
  );
}
```

#### 不同变体

```tsx
// 默认样式
<BlogCardNew post={post} variant="default" />

// 紧凑样式（适合侧边栏）
<BlogCardNew post={post} variant="compact" />

// 特色样式（带操作按钮）
<BlogCardNew post={post} variant="featured" />

// 精简样式
<BlogCardNew post={post} variant="minimal" />
```

#### 带交互功能

```tsx
<BlogCardNew
  post={post}
  variant="featured"
  showStats={true}
  showAuthor={true}
  showCategory={true}
  showTags={true}
  onLike={(postId) => {
    console.log('点赞:', postId);
    // 处理点赞逻辑
  }}
  onBookmark={(postId) => {
    console.log('收藏:', postId);
    // 处理收藏逻辑
  }}
  onShare={(postId) => {
    console.log('分享:', postId);
    // 处理分享逻辑
  }}
/>
```

---

### 2. BlogTimeline - 时间线

#### 基础使用

```tsx
import { BlogTimeline } from '@/components/blog/BlogTimeline';

function BlogArchive({ posts }) {
  return <BlogTimeline posts={posts} />;
}
```

#### 按年分组

```tsx
<BlogTimeline posts={posts} groupBy="year" />
```

#### 按月分组

```tsx
<BlogTimeline posts={posts} groupBy="month" />
```

#### 按年月分组

```tsx
<BlogTimeline posts={posts} groupBy="year-month" />
```

---

### 3. BlogAdvancedSearch - 高级搜索

#### 基础使用

```tsx
import { BlogAdvancedSearch } from '@/components/blog/BlogAdvancedSearch';
import { useState } from 'react';

function BlogSearch({ categories, tags }) {
  const [results, setResults] = useState([]);

  const handleSearch = async (params) => {
    console.log('搜索参数:', params);
    // 执行搜索
    const response = await fetch('/api/blog/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    const data = await response.json();
    setResults(data.posts);
  };

  const handleReset = () => {
    setResults([]);
  };

  return (
    <BlogAdvancedSearch
      categories={categories}
      tags={tags}
      onSearch={handleSearch}
      onReset={handleReset}
    />
  );
}
```

#### 集成 TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { BlogAdvancedSearch } from '@/components/blog/BlogAdvancedSearch';

function BlogSearch() {
  const [searchParams, setSearchParams] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['blog-search', searchParams],
    queryFn: () => fetch('/api/blog/search', {
      method: 'POST',
      body: JSON.stringify(searchParams),
    }).then(res => res.json()),
    enabled: !!searchParams,
  });

  return (
    <div>
      <BlogAdvancedSearch
        onSearch={setSearchParams}
        loading={isLoading}
      />
      {data && <BlogList posts={data.posts} />}
    </div>
  );
}
```

---

### 4. BlogStatsCard - 统计卡片

#### 基础使用

```tsx
import { BlogStatsCard } from '@/components/blog/BlogStatsCard';

function Dashboard({ posts }) {
  return (
    <div className="space-y-6">
      <BlogStatsCard posts={posts} />
    </div>
  );
}
```

#### 不同时间段

```tsx
// 全部时间
<BlogStatsCard posts={posts} period="all" />

// 最近一周
<BlogStatsCard posts={posts} period="week" />

// 最近一个月
<BlogStatsCard posts={posts} period="month" />

// 最近一年
<BlogStatsCard posts={posts} period="year" />
```

#### 完整仪表板示例

```tsx
import { BlogStatsCard } from '@/components/blog/BlogStatsCard';

function BlogDashboard({ posts }) {
  return (
    <div className="space-y-8">
      {/* 概览统计 */}
      <BlogStatsCard posts={posts} period="all" />

      {/* 月度统计 */}
      <BlogStatsCard posts={posts} period="month" />

      {/* 周统计 */}
      <BlogStatsCard posts={posts} period="week" />
    </div>
  );
}
```

---

### 5. BlogEditorPreview - 编辑器预览

#### 卡片预览模式

```tsx
import { BlogEditorPreview } from '@/components/blog/BlogEditorPreview';
import { useState } from 'react';

function BlogEditor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* 编辑器 */}
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="文章标题"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="文章内容"
        />
      </div>

      {/* 预览 */}
      <BlogEditorPreview
        title={title}
        content={content}
        mode="card"
        showPreview={showPreview}
        onTogglePreview={() => setShowPreview(!showPreview)}
      />
    </div>
  );
}
```

#### 分屏预览模式

```tsx
<BlogEditorPreview
  title={title}
  content={content}
  excerpt={excerpt}
  featuredImage={imageUrl}
  category={selectedCategory}
  tags={selectedTags}
  author={currentUser}
  mode="split"
  showPreview={true}
/>
```

#### 完整预览模式

```tsx
<BlogEditorPreview
  title={title}
  content={content}
  mode="full"
  showPreview={true}
/>
```

---

## 🛠️ 工具函数使用

### blog-helpers 工具函数

```typescript
import {
  formatExcerpt,
  calculateReadingTime,
  formatPublishDate,
  searchPosts,
  paginatePosts,
  getPostUrl,
  validatePost,
  generateSlug,
} from '@/lib/utils/blog-helpers';

// 格式化摘要
const excerpt = formatExcerpt(post.content, 200);

// 计算阅读时间
const readingTime = calculateReadingTime(post.content);

// 格式化发布时间
const formattedDate = formatPublishDate(post.publishedAt);

// 搜索文章
const results = searchPosts(posts, 'React');

// 分页
const paginatedPosts = paginatePosts(posts, 1, 10);

// 生成URL
const url = getPostUrl(post.slug);

// 验证文章
const validation = validatePost(postData);

// 生成slug
const slug = generateSlug('我的文章标题');
```

---

### API 服务使用

```typescript
import { BlogApiService } from '@/services/blog-api.service';

// 获取文章列表
const { posts, total } = await BlogApiService.getPosts({
  page: 1,
  limit: 10,
  category: 'tech',
  sortBy: 'latest',
});

// 获取单篇文章
const post = await BlogApiService.getPost(postId);

// 创建文章
const newPost = await BlogApiService.createPost({
  title: '新文章',
  content: '内容...',
  status: 'published',
});

// 更新文章
const updatedPost = await BlogApiService.updatePost(postId, {
  title: '更新后的标题',
});

// 删除文章
await BlogApiService.deletePost(postId);

// 点赞文章
const { liked, count } = await BlogApiService.likePost(postId);

// 收藏文章
const { bookmarked } = await BlogApiService.bookmarkPost(postId);

// 获取评论
const { comments } = await BlogApiService.getComments(postId);

// 创建评论
const comment = await BlogApiService.createComment(postId, {
  content: '评论内容',
});

// 上传图片
const { url } = await BlogApiService.uploadImage(file, 'featured');

// 搜索文章
const searchResults = await BlogApiService.searchPosts('React');

// 获取相关文章
const relatedPosts = await BlogApiService.getRelatedPosts(postId);

// 获取热门文章
const trendingPosts = await BlogApiService.getTrendingPosts(10);
```

---

## 📄 完整页面示例

### 博客列表页

```tsx
'use client';

import { useState } from 'react';
import { BlogCardNew } from '@/components/blog/BlogCardNew';
import { BlogAdvancedSearch } from '@/components/blog/BlogAdvancedSearch';
import { BlogStatsCard } from '@/components/blog/BlogStatsCard';
import { usePosts } from '@/hooks/use-blog-data';

export default function BlogPage() {
  const [searchParams, setSearchParams] = useState(null);
  const { posts, loading, error, loadMore, hasMore } = usePosts({
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 统计 */}
      <BlogStatsCard posts={posts} period="month" />

      {/* 搜索 */}
      <BlogAdvancedSearch
        onSearch={setSearchParams}
        loading={loading}
      />

      {/* 文章列表 */}
      {error && (
        <div className="text-red-400 text-center py-8">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <BlogCardNew key={post.id} post={post} />
        ))}
      </div>

      {/* 加载更多 */}
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-3 bg-cyber-cyan text-gray-900 rounded-lg font-semibold hover:bg-cyber-cyan/80 transition-colors"
          >
            {loading ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### 博客归档页（时间线）

```tsx
'use client';

import { BlogTimeline } from '@/components/blog/BlogTimeline';
import { usePosts } from '@/hooks/use-blog-data';

export default function BlogArchivePage() {
  const { posts, loading } = usePosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">文章归档</h1>

      {loading ? (
        <div className="text-center py-8">加载中...</div>
      ) : (
        <BlogTimeline posts={posts} groupBy="year-month" />
      )}
    </div>
  );
}
```

---

## 🎨 样式定制

所有组件都支持通过 `className` prop 进行样式定制：

```tsx
<BlogCardNew
  post={post}
  className="custom-card-styles"
/>
```

---

## 📱 响应式设计

所有组件都是响应式的，在不同屏幕尺寸下自动调整布局：

- 移动端 (< 768px)
- 平板 (768px - 1024px)
- 桌面 (> 1024px)

---

## 🔗 相关链接

- [完整文档](./CREATED_FILES_SUMMARY_2025-03-06.md)
- [项目 README](./README.md)
- [开发任务](./TODO.md)

---

**需要帮助？** 查看文档或提交 Issue。
