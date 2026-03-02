# 快速开始指南 - 新组件使用

本文档介绍最新创建的博客组件和服务。

## 📦 新创建的组件

### BlogCard

博客卡片组件，支持多种布局变体。

```tsx
import { BlogCard } from '@/components/blog';

<BlogCard
  id="1"
  title="文章标题"
  slug="post-slug"
  excerpt="文章摘要..."
  featuredImage="/image.jpg"
  author={{ name: "作者名", avatar: "/avatar.jpg" }}
  categories={[{ name: "技术", slug: "tech" }]}
  publishedAt="2024-03-01"
  readingTime={5}
  viewCount={100}
  likeCount={20}
  variant="default"
  showStats={true}
/>
```

**Props:**
- `variant`: 'default' | 'compact' | 'featured' | 'grid'
- `showStats`: 是否显示统计信息

### BlogGrid

博客网格布局组件。

```tsx
import { BlogGrid } from '@/components/blog';

<BlogGrid
  posts={postsData}
  columns={3}
  variant="grid"
  showStats={true}
/>
```

### BlogList

带筛选和分页的博客列表组件。

```tsx
import { BlogList } from '@/components/blog';

<BlogList
  posts={postsData}
  categories={categoriesData}
  itemsPerPage={10}
  showCategories={true}
  showSort={true}
/>
```

### RelatedPosts

相关文章推荐组件。

```tsx
import { RelatedPosts } from '@/components/blog';

<RelatedPosts
  posts={relatedPostsData}
  title="相关推荐"
  maxPosts={4}
  columns={3}
/>
```

### ReadingTime

阅读时间计算组件。

```tsx
import { ReadingTime } from '@/components/blog';

<ReadingTime
  content={postContent}
  wordsPerMinute={200}
  showLabel={true}
/>

// 或使用 Hook
import { useReadingTime } from '@/components/blog';

const readingTime = useReadingTime(postContent);
console.log(`${readingTime} 分钟`);
```

## 🎣 React Hooks

### usePosts

获取文章列表。

```tsx
import { usePosts } from '@/hooks';

const { posts, total, totalPages, isLoading, setPage } = usePosts({
  page: 1,
  per_page: 10,
  category: 'tech',
});

if (isLoading) return <LoadingSpinner />;

return (
  <>
    {posts.map(post => <PostCard key={post.id} {...post} />)}
    <Pagination currentPage={1} totalPages={totalPages} onPageChange={setPage} />
  </>
);
```

### usePost

获取单篇文章。

```tsx
import { usePost } from '@/hooks';

const { post, isLoading } = usePost(postSlug);

if (isLoading) return <LoadingSkeleton />;
if (!post) return <NotFound />;

return <ArticleDetail post={post} />;
```

### usePostLike

文章点赞功能。

```tsx
import { usePostLike } from '@/hooks';

const { liked, likeCount, isLoading, toggleLike } = usePostLike(
  postId,
  initialLiked,
  initialCount
);

<button onClick={toggleLike} disabled={isLoading}>
  {liked ? '已赞' : '点赞'} ({likeCount})
</button>
```

### useSearchPosts

文章搜索。

```tsx
import { useSearchPosts } from '@/hooks';

const { results, isLoading, search, clearSearch } = useSearchPosts();

<SearchInput onSearch={(query) => search(query)} />
{results.map(post => <SearchResult key={post.id} {...post} />)}
```

### usePortfolio

作品集管理。

```tsx
import { usePortfolio } from '@/hooks';

const { items, featured, isLoading, setPage } = usePortfolio({
  per_page: 12,
});
```

### useReadingList

阅读列表管理。

```tsx
import { useReadingList } from '@/hooks';

const { items, stats, addItem, updateProgress } = useReadingList();

// 添加到阅读列表
<button onClick={() => addItem(postId)}>加入阅读列表</button>

// 更新进度
<Slider
  value={progress}
  onChange={(val) => updateProgress(postId, val)}
/>
```

### useBookmarks

书签管理。

```tsx
import { useBookmarks } from '@/hooks';

const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();

<button onClick={() => addBookmark(postId)}>
  {isBookmarked(postId) ? '已收藏' : '收藏'}
</button>
```

## 🛠️ 服务层

### blogService

博客相关 API 调用。

```typescript
import { blogService } from '@/lib/services';

// 获取文章
const posts = await blogService.getPosts({ page: 1, per_page: 10 });

// 获取单篇文章
const post = await blogService.getPost('post-slug');

// 搜索文章
const results = await blogService.searchPosts({ query: 'keyword' });

// 获取分类
const categories = await blogService.getCategories();

// 获取标签
const tags = await blogService.getPopularTags(20);

// 点赞文章
await blogService.togglePostLike(postId);

// 增加浏览量
await blogService.incrementPostViews(postId);
```

### portfolioService

作品集 API 调用。

```typescript
import { portfolioService } from '@/lib/services';

// 获取作品集
const portfolio = await portfolioService.getPortfolioItems({ per_page: 12 });

// 获取单个作品
const item = await portfolioService.getPortfolioItem('project-slug');

// 获取精选作品
const featured = await portfolioService.getFeaturedPortfolio(6);

// 获取技术栈
const technologies = await portfolioService.getPortfolioTechnologies();
```

## 📐 类型定义

### Blog Types

```typescript
import type { Post, Category, Tag, Comment } from '@/lib/types';

interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: number;
  featured_image?: string;
  status: 'draft' | 'publish' | 'private';
  view_count: number;
  like_count: number;
  created_at: string;
  published_at?: string;
}
```

## 🎨 样式类

### Tailwind 类

组件使用自定义的 Tailwind 类：

- `cyber-card` - 赛博朋克卡片
- `cyber-button` - 赛博朋克按钮
- `cyber-input` - 赛博朋克输入框
- `cyber-select` - 赛博朋克下拉框

### 颜色系统

```css
--cyber-dark: #0a0a0f      /* 深空黑 */
--cyber-cyan: #00f0ff      /* 霓虹青 */
--cyber-purple: #9d00ff    /* 赛博紫 */
--cyber-pink: #ff0080      /* 激光粉 */
```

## 📝 完整示例

### 博客列表页

```tsx
// app/blog/page.tsx
'use client';

import { usePosts, useCategories } from '@/hooks';
import { BlogList } from '@/components/blog';

export default function BlogPage() {
  const { posts, total, isLoading } = usePosts({ per_page: 10 });
  const { categories } = useCategories();

  if (isLoading) return <BlogListSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">博客</h1>
      <BlogList
        posts={posts}
        categories={categories}
        itemsPerPage={10}
      />
    </div>
  );
}
```

### 文章详情页

```tsx
// app/blog/[slug]/page.tsx
'use client';

import { usePost, usePostLike, useRelatedPosts } from '@/hooks';
import { ReadingTime } from '@/components/blog';

export default function PostPage({ params }: { params: { slug: string } }) {
  const { post, isLoading } = usePost(params.slug);
  const { liked, likeCount, toggleLike } = usePostLike(post?.id);
  const { posts: relatedPosts } = useRelatedPosts(post?.id);

  if (isLoading) return <ArticleSkeleton />;
  if (!post) return <NotFound />;

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        <ReadingTime content={post.content} />
      </header>

      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <footer>
        <button onClick={toggleLike}>
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>
      </footer>

      <RelatedPosts posts={relatedPosts} />
    </article>
  );
}
```

## 🔗 相关链接

- [组件文档](./components/)
- [API 文档](./api/)
- [样式指南](./styles/)
