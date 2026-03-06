# 组件使用指南

本指南详细说明新创建的页面和组件的使用方法。

---

## 📋 目录

1. [博客列表页面](#博客列表页面)
2. [博客详情页面](#博客详情页面)
3. [WordPress Hooks](#wordpress-hooks)
4. [工具函数](#工具函数)
5. [集成示例](#集成示例)

---

## 🎯 博客列表页面

### 基础使用

#### 访问页面
```
URL: /blog/enhanced
```

#### 功能特性
- ✅ 分页（默认12条/页）
- ✅ 高级筛选（分类、标签、日期范围）
- ✅ 实时搜索
- ✅ 网格/列表视图切换
- ✅ 加载状态
- ✅ 错误处理
- ✅ 空状态

### 自定义配置

#### 修改每页显示数量
```typescript
// frontend/app/blog/enhanced/page.tsx
const [pageSize, setPageSize] = useState(24); // 默认12
```

#### 修改筛选配置
```typescript
const filterConfig = [
  {
    id: 'category',
    label: '分类',
    type: 'checkbox',
    options: [
      { label: '前端开发', value: 'frontend' },
      { label: '后端开发', value: 'backend' },
      { label: 'UI设计', value: 'design' },
      // 添加更多选项...
    ],
  },
  // 添加更多筛选器...
];
```

#### 修改视图模式
```typescript
// 默认网格视图
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

// 改为列表视图
const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
```

### 数据集成

#### 使用WordPress API
```typescript
import wordpressService from '@/lib/services/wordpress-service';

const loadPosts = async () => {
  const response = await wordpressService.getPosts({
    page: currentPage,
    per_page: pageSize,
    categories: activeFilters.category?.join(','),
    tags: activeFilters.tags?.join(','),
    search: searchQuery,
  });
  
  setPosts(response.data);
  setTotalItems(response.total);
};
```

#### 使用模拟数据
```typescript
const mockPosts: BlogPost[] = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  title: `文章标题 ${i + 1}`,
  // ...其他字段
}));
```

---

## 📖 博客详情页面

### 基础使用

#### 访问页面
```
URL: /blog/[slug]
示例: /blog/nextjs-14-app-router-guide
```

#### 功能特性
- ✅ 阅读进度指示器
- ✅ 自动生成目录
- ✅ 评论区
- ✅ 社交分享
- ✅ 点赞/收藏
- ✅ 作者信息
- ✅ 相关文章

### 组件配置

#### 阅读进度指示器
```typescript
import { ReadingProgressIndicator } from '@/components/blog/ReadingProgressIndicator';

// 自动显示在页面顶部
<ReadingProgressIndicator />
```

#### 目录生成
```typescript
import { TableOfContents } from '@/components/blog/TableOfContents';

<TableOfContents
  content={post.content}
  activeHeading={activeHeading}
  onHeadingChange={setActiveHeading}
/>
```

#### 评论区
```typescript
import { CommentSystem } from '@/components/blog/CommentSystem';

<CommentSystem 
  postId={post.id}
  onCommentAdd={(comment) => {
    console.log('新评论:', comment);
  }}
/>
```

#### 社交分享
```typescript
import { SocialShare } from '@/components/blog/SocialShare';

<SocialShare
  title={post.title}
  url={`/blog/${post.slug}`}
  platforms={['twitter', 'facebook', 'linkedin']}
  onClose={() => setShowShareDialog(false)}
/>
```

### 自定义样式

#### 修改文章内容样式
```css
/* globals.css */
.prose {
  --prose-headings-color: #ffffff;
  --prose-text-color: #9ca3af;
  /* 更多自定义... */
}

.prose h2 {
  font-size: 2rem;
  margin-top: 3rem;
  margin-bottom: 1.5rem;
}

.prose code {
  background: rgba(0, 240, 255, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}
```

---

## 🔌 WordPress Hooks

### usePosts - 获取文章列表

```typescript
import { usePosts } from '@/lib/hooks/use-wordpress';

function BlogList() {
  const { 
    posts, 
    loading, 
    error, 
    totalPages, 
    total 
  } = usePosts({
    page: 1,
    per_page: 12,
    categories: 'frontend',
    tags: 'nextjs',
    search: '关键词',
    orderby: 'date',
    order: 'desc'
  });

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      <p>共 {total} 篇文章</p>
      {posts.map(post => (
        <ArticleCard key={post.id} {...post} />
      ))}
    </div>
  );
}
```

### usePost - 获取单篇文章

```typescript
import { usePost } from '@/lib/hooks/use-wordpress';

function BlogPost({ slug }: { slug: string }) {
  const { post, loading, error } = usePost(slug);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!post) return <div>文章不存在</div>;

  return (
    <article>
      <h1>{post.title.rendered}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}
```

### useSearch - 搜索文章

```typescript
import { useSearch } from '@/lib/hooks/use-wordpress';

function SearchBar() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useSearch(query, 300);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索文章..."
      />
      
      {loading && <div>搜索中...</div>}
      {error && <div>搜索出错</div>}
      
      <ul>
        {results.map(post => (
          <li key={post.id}>
            <a href={`/blog/${post.slug}`}>{post.title.rendered}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### useCategories - 获取分类

```typescript
import { useCategories } from '@/lib/hooks/use-wordpress';

function CategoryList() {
  const { data: categories, loading, error } = useCategories();

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <ul>
      {categories?.map(category => (
        <li key={category.id}>
          <a href={`/categories/${category.slug}`}>
            {category.name} ({category.count})
          </a>
        </li>
      ))}
    </ul>
  );
}
```

---

## 🛠️ 工具函数

### cn - 类名合并

```typescript
import { cn } from '@/lib/utils/exports';

// 基础使用
cn('text-white', 'bg-blue-500'); 
// => "text-white bg-blue-500"

// 条件类名
cn('base-class', isActive && 'active-class', isLoading && 'loading-class');

// 覆盖冲突类名
cn('p-4', 'p-6'); // => "p-6" (后面的覆盖前面的)

// 响应式类名
cn('text-sm', 'md:text-base', 'lg:text-lg');
```

### formatDate - 格式化日期

```typescript
import { formatDate } from '@/lib/utils/exports';

const date = '2024-03-01T10:00:00Z';
formatDate(date); // => "2024年3月1日"
formatDate(date, 'en-US'); // => "March 1, 2024"
```

### truncate - 截断文本

```typescript
import { truncate } from '@/lib/utils/exports';

const longText = '这是一段很长的文本...';
truncate(longText, 10); // => "这是一段很长的文..."
```

### formatNumber - 格式化数字

```typescript
import { formatNumber } from '@/lib/utils/exports';

formatNumber(1234); // => "1,234"
formatNumber(1000000); // => "1M"
```

---

## 🔗 集成示例

### 创建自定义博客页面

```typescript
'use client';

import { useState } from 'react';
import { usePosts } from '@/lib/hooks/use-wordpress';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { PaginationControls } from '@/components/pagination/PaginationControls';
import { cn } from '@/lib/utils/exports';

export default function CustomBlogPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const { posts, loading, error, totalPages } = usePosts({
    page,
    per_page: 12,
    categories: selectedCategory
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* 头部 */}
      <header className="py-12">
        <h1 className="text-4xl font-bold text-white">技术博客</h1>
      </header>

      {/* 分类筛选 */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setSelectedCategory('')}
          className={cn(
            'px-4 py-2 rounded-lg',
            !selectedCategory ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'
          )}
        >
          全部
        </button>
        <button
          onClick={() => setSelectedCategory('frontend')}
          className={cn(
            'px-4 py-2 rounded-lg',
            selectedCategory === 'frontend' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'
          )}
        >
          前端开发
        </button>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="grid grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="text-red-500 text-center py-12">
          加载失败: {error}
        </div>
      )}

      {/* 文章列表 */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <ArticleCard
                key={post.id}
                id={String(post.id)}
                title={post.title.rendered}
                slug={post.slug}
                excerpt={post.excerpt.rendered}
                featuredImage={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
                author={{
                  name: post._embedded?.author?.[0]?.name || 'Unknown',
                  avatar: post._embedded?.author?.[0]?.avatar_urls?.['96']
                }}
                categories={post._embedded?.['wp:term']?.[0] || []}
                publishedAt={post.date}
                readTime={Math.ceil(post.content.rendered.split(/\s+/).length / 200)}
                viewCount={0}
                likeCount={0}
                commentCount={0}
              />
            ))}
          </div>

          {/* 分页 */}
          <div className="mt-12">
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              pageSize={12}
              totalItems={posts.length}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
```

### 集成搜索功能

```typescript
'use client';

import { useState } from 'react';
import { useSearch } from '@/lib/hooks/use-wordpress';
import { ArticleCard } from '@/components/blog/ArticleCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { results, loading } = useSearch(query, 500);

  return (
    <div>
      {/* 搜索框 */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索文章..."
          className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* 搜索结果 */}
      {query && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {results.map(post => (
            <ArticleCard
              key={post.id}
              id={String(post.id)}
              title={post.title.rendered}
              slug={post.slug}
              excerpt={post.excerpt.rendered}
              author={{ name: 'Author' }}
              categories={[]}
              publishedAt={post.date}
              readTime={5}
              viewCount={0}
              likeCount={0}
              commentCount={0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 📚 更多资源

- [项目README](./README.md)
- [快速启动指南](./QUICKSTART_CREATED_FILES.md)
- [文件创建总结](./FILES_CREATED_SESSION_2026_03_06.md)
- [TODO列表](./TODO_UPDATED.md)

---

**祝您使用愉快！** 🎉
