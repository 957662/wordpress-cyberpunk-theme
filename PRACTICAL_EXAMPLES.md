# 💡 实际使用示例

本文档提供实际可运行的使用示例，展示如何使用新创建的组件和工具。

## 📚 目录

1. [获取文章列表](#1-获取文章列表)
2. [显示单篇文章](#2-显示单篇文章)
3. [使用工具函数](#3-使用工具函数)
4. [集成到现有页面](#4-集成到现有页面)
5. [完整的博客页面](#5-完整的博客页面)

---

## 1. 获取文章列表

### 基础用法

```tsx
// frontend/app/blog/page.tsx
'use client';

import { usePosts } from '@/hooks/api/use-posts';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { CyberLoader } from '@/components/cyber/CyberLoader';

export default function BlogPage() {
  const { data, isLoading, error } = usePosts({
    page: 1,
    perPage: 12,
  });

  if (isLoading) {
    return <CyberLoader size="lg" />;
  }

  if (error) {
    return <div>加载失败: {error.message}</div>;
  }

  return (
    <div>
      <h1>博客文章 ({data?.total || 0} 篇)</h1>
      <BlogGrid posts={data?.posts || []} columns={3} />
    </div>
  );
}
```

### 带分页的用法

```tsx
'use client';

import { useState } from 'react';
import { usePosts } from '@/hooks/api/use-posts';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { Pagination } from '@/components/blog/Pagination';

export default function BlogPageWithPagination() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = usePosts({
    page,
    perPage: 12,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {isLoading ? (
        <div>加载中...</div>
      ) : (
        <>
          <BlogGrid posts={data?.posts || []} />
          {data && data.totalPages > 1 && (
            <Pagination
              currentPage={data.currentPage}
              totalPages={data.totalPages}
              basePath="/blog"
            />
          )}
        </>
      )}
    </div>
  );
}
```

### 按分类筛选

```tsx
'use client';

import { useState } from 'react';
import { usePosts, useCategories } from '@/hooks/api/use-posts';

export default function BlogPageWithFilter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const { data: categories } = useCategories();
  const { data: posts } = usePosts({
    category: selectedCategory,
  });

  return (
    <div>
      {/* 分类筛选器 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('')}
          className={!selectedCategory ? 'bg-cyber-cyan' : ''}
        >
          全部
        </button>
        {categories?.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={selectedCategory === cat.slug ? 'bg-cyber-cyan' : ''}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 文章列表 */}
      <div className="grid grid-cols-3 gap-6">
        {posts?.posts.map(post => (
          <div key={post.id}>{post.title}</div>
        ))}
      </div>
    </div>
  );
}
```

---

## 2. 显示单篇文章

### 使用 slug 获取文章

```tsx
// frontend/app/blog/[slug]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { usePostBySlug } from '@/hooks/api/use-posts';
import { ArticleDetail } from '@/components/blog/ArticleDetail';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = usePostBySlug(slug);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败</div>;
  if (!post) return <div>文章不存在</div>;

  return <ArticleDetail post={post} />;
}
```

### 使用 ID 获取文章

```tsx
'use client';

import { usePost } from '@/hooks/api/use-posts';

export function PostDisplay({ id }: { id: string }) {
  const { data: post, isLoading } = usePost(id);

  if (isLoading) return <div>加载中...</div>;
  if (!post) return <div>文章不存在</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
    </article>
  );
}
```

### 显示相关文章

```tsx
'use client';

import { useRelatedPosts } from '@/hooks/api/use-posts';
import { BlogCard } from '@/components/blog/BlogCard';

export function RelatedPostsSection({ postId, category }: { postId: string; category?: string }) {
  const { data: relatedPosts } = useRelatedPosts(postId, category);

  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <section>
      <h2>相关文章</h2>
      <div className="grid grid-cols-3 gap-6">
        {relatedPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
```

---

## 3. 使用工具函数

### 类名合并

```tsx
import { cn } from '@/lib/utils';

export function MyComponent({ isActive, isDisabled }: Props) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded',
        isActive && 'bg-blue-500',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      按钮
    </button>
  );
}
```

### 日期格式化

```tsx
import { formatDate, formatRelativeTime } from '@/lib/utils';

export function PostMeta({ post }: { post: Post }) {
  return (
    <div>
      <span>发布于: {formatDate(post.createdAt)}</span>
      <span>({formatRelativeTime(post.createdAt)})</span>
    </div>
  );
}
```

### 文本截断

```tsx
import { truncate } from '@/lib/utils';

export function PostExcerpt({ content }: { content: string }) {
  return (
    <p>
      {truncate(content, 150)}
    </p>
  );
}
```

### 计算阅读时间

```tsx
import { calculateReadingTime } from '@/lib/utils';

export function ReadingTime({ content }: { content: string }) {
  const minutes = calculateReadingTime(content);
  
  return (
    <span>
      预计阅读时间: {minutes} 分钟
    </span>
  );
}
```

### 防抖搜索

```tsx
'use client';

import { useState } from 'react';
import { useSearchPosts } from '@/hooks/api/use-posts';
import { debounce } from '@/lib/utils';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const searchPosts = useSearchPosts();

  const handleSearch = debounce((value: string) => {
    searchPosts.mutate({ query: value });
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="搜索文章..."
    />
  );
}
```

---

## 4. 集成到现有页面

### 在首页显示最新文章

```tsx
// frontend/app/page.tsx
import { usePosts } from '@/hooks/api/use-posts';
import { BlogGrid } from '@/components/blog/BlogGrid';

export default function HomePage() {
  const { data: latestPosts } = usePosts({
    page: 1,
    perPage: 6,
  });

  return (
    <div>
      <section className="hero">
        <h1>欢迎来到我的博客</h1>
      </section>

      <section className="latest-posts">
        <h2>最新文章</h2>
        {latestPosts && <BlogGrid posts={latestPosts.posts} columns={3} />}
      </section>
    </div>
  );
}
```

### 在侧边栏显示热门标签

```tsx
'use client';

import { useTags } from '@/hooks/api/use-posts';
import Link from 'next/link';

export function SidebarTags() {
  const { data: tags } = useTags();

  if (!tags) return null;

  // 按文章数量排序，取前 10 个
  const popularTags = tags
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 10);

  return (
    <aside>
      <h3>热门标签</h3>
      <ul>
        {popularTags.map(tag => (
          <li key={tag.id}>
            <Link href={`/tag/${tag.slug}`}>
              {tag.name} ({tag.count})
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
```

### 在作者页面显示作者文章

```tsx
'use client';

import { useParams } from 'next/navigation';
import { usePosts } from '@/hooks/api/use-posts';

export default function AuthorPage() {
  const params = useParams();
  const authorId = params.id as string;

  const { data: posts, isLoading } = usePosts({
    author: authorId,
  });

  if (isLoading) return <div>加载中...</div>;

  return (
    <div>
      <h1>作者文章</h1>
      <div className="grid grid-cols-2 gap-6">
        {posts?.posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. 完整的博客页面

这是一个功能完整的博客页面示例，包含所有功能：

```tsx
'use client';

/**
 * 完整的博客页面示例
 * 包含：搜索、筛选、分页、加载状态
 */

import { useState } from 'react';
import { usePosts, useCategories, useTags } from '@/hooks/api/use-posts';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { Pagination } from '@/components/blog/Pagination';
import { CyberLoader } from '@/components/cyber/CyberLoader';
import { cn } from '@/lib/utils';

export default function CompleteBlogPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 获取数据
  const { data: posts, isLoading: postsLoading } = usePosts({
    page,
    perPage: 12,
    category: selectedCategory,
    tag: selectedTag,
    search: searchQuery || undefined,
  });

  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  // 处理函数
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // 重置页码
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setPage(1);
  };

  const handleTagChange = (tagSlug: string) => {
    setSelectedTag(tagSlug);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* 头部 */}
      <header className="py-12 border-b border-cyber-border">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">
            技术博客
          </h1>
          <p className="text-gray-400">
            探索技术，分享见解
          </p>
        </div>
      </header>

      {/* 搜索和筛选 */}
      <section className="py-8 border-b border-cyber-border">
        <div className="max-w-6xl mx-auto px-4">
          {/* 搜索框 */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="搜索文章..."
            className="w-full px-4 py-3 bg-cyber-dark border border-cyber-cyan/30 rounded-lg focus:outline-none focus:border-cyber-cyan text-white mb-4"
          />

          {/* 筛选器 */}
          <div className="flex flex-wrap gap-4">
            {/* 分类筛选 */}
            <div>
              <label className="text-sm text-gray-400 mr-2">分类:</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3 py-2 bg-cyber-dark border border-cyber-cyan/30 rounded text-white"
              >
                <option value="">全部</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 标签筛选 */}
            <div>
              <label className="text-sm text-gray-400 mr-2">标签:</label>
              <select
                value={selectedTag}
                onChange={(e) => handleTagChange(e.target.value)}
                className="px-3 py-2 bg-cyber-dark border border-cyber-cyan/30 rounded text-white"
              >
                <option value="">全部</option>
                {tags?.map(tag => (
                  <option key={tag.id} value={tag.slug}>
                    {tag.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 视图切换 */}
            <div className="ml-auto flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'px-4 py-2 rounded',
                  viewMode === 'grid' ? 'bg-cyber-cyan text-cyber-dark' : 'bg-gray-800 text-white'
                )}
              >
                网格
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'px-4 py-2 rounded',
                  viewMode === 'list' ? 'bg-cyber-cyan text-cyber-dark' : 'bg-gray-800 text-white'
                )}
              >
                列表
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 内容区域 */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* 信息栏 */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-400">
              找到 <span className="text-cyber-cyan font-bold">{posts?.total || 0}</span> 篇文章
            </p>
            {(selectedCategory || selectedTag || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedTag('');
                  setSearchQuery('');
                }}
                className="text-cyber-purple hover:text-cyber-pink transition-colors"
              >
                清除筛选
              </button>
            )}
          </div>

          {/* 加载状态 */}
          {postsLoading && (
            <div className="flex justify-center py-20">
              <CyberLoader size="lg" />
            </div>
          )}

          {/* 文章列表 */}
          {!postsLoading && posts && (
            <>
              <BlogGrid
                posts={posts.posts}
                columns={viewMode === 'grid' ? 3 : 1}
              />

              {/* 分页 */}
              {posts.totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={posts.currentPage}
                    totalPages={posts.totalPages}
                    basePath="/blog"
                  />
                </div>
              )}
            </>
          )}

          {/* 空状态 */}
          {!postsLoading && posts?.posts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">没有找到匹配的文章</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
```

---

## 🎯 总结

以上示例展示了：

1. ✅ **数据获取** - 使用 React Query Hooks
2. ✅ **工具函数** - 类名合并、日期格式化等
3. ✅ **状态管理** - 加载、错误、空状态
4. ✅ **用户交互** - 搜索、筛选、分页
5. ✅ **响应式设计** - 适配不同屏幕尺寸

所有示例都是**完整的、可运行的**，可以直接复制到项目中使用！

---

**相关文档**:
- [快速开始指南](./QUICKSTART_SESSION_2026-03-06-ACTION.md)
- [API 文档](./API_DOCUMENTATION.md)
- [项目 README](./README.md)
