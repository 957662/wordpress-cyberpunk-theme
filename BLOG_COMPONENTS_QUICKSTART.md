# 🚀 博客组件快速开始指南

## 📦 新增组件总览

本次更新为 CyberPress Platform 添加了 **8个全新的博客组件**，总计约 **1,164行代码**，所有组件都采用赛博朋克风格设计。

## 🎯 组件清单

### 1️⃣ 过滤器组件 (4个)

#### BlogFilterBar
完整的博客过滤栏，支持搜索、分类、排序和视图模式切换。

```tsx
import { BlogFilterBar } from '@/components/blog';

function MyBlogPage() {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sort: 'latest'
  });
  const [viewMode, setViewMode] = useState('grid');

  return (
    <BlogFilterBar
      filters={filters}
      onFiltersChange={setFilters}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      categories={categories}
      totalResults={100}
    />
  );
}
```

#### CategoryFilter
分类过滤器，支持三种布局模式。

```tsx
import { CategoryFilter } from '@/components/blog';

<CategoryFilter
  categories={categories}
  selectedCategory={selectedCategory}
  onCategorySelect={handleCategorySelect}
  layout="list" // 'list' | 'grid' | 'dropdown'
  showCount={true}
/>
```

#### TagCloud
标签云组件，支持多种布局和字体大小加权。

```tsx
import { TagCloud } from '@/components/blog';

<TagCloud
  tags={tags}
  selectedTag={selectedTag}
  onTagSelect={handleTagSelect}
  layout="cloud" // 'cloud' | 'list' | 'pill'
  sizeVariant="mixed" // 'uniform' | 'weighted' | 'mixed'
  showCount={true}
/>
```

#### BlogViewToggle
视图模式切换组件。

```tsx
import { BlogViewToggle } from '@/components/blog';

<BlogViewToggle
  viewMode={viewMode}
  onViewModeChange={setViewMode}
/>
```

### 2️⃣ 实用工具组件 (3个)

#### BlogSearch
高级搜索组件，支持搜索建议、历史记录和键盘导航。

```tsx
import { BlogSearch } from '@/components/blog';

<BlogSearch
  onSearch={handleSearch}
  suggestions={searchSuggestions}
  recentSearches={recentSearches}
  trendingSearches={trendingSearches}
  placeholder="搜索文章..."
  debounceMs={300}
/>
```

#### BlogStatsCard
博客统计卡片，显示浏览、点赞、评论、收藏数据。

```tsx
import { BlogStatsCard } from '@/components/blog';

<BlogStatsCard
  views={1234}
  likes={56}
  comments={23}
  bookmarks={12}
  readingTime={5}
  trend="up"
  trendValue={15}
  layout="horizontal" // 'horizontal' | 'vertical' | 'compact'
  showLabels={true}
  showIcons={true}
  variant="neon" // 'default' | 'neon' | 'minimal'
/>
```

#### LoadingState
加载状态组件，支持多种加载动画模式。

```tsx
import { BlogLoadingState } from '@/components/blog';

<BlogLoadingState
  type="grid" // 'list' | 'grid' | 'card' | 'skeleton'
  count={6}
  columns={3}
/>
```

### 3️⃣ 核心博客组件

#### BlogList & BlogGrid
博客列表和网格组件（已存在，已增强）。

```tsx
import { BlogList, BlogGrid } from '@/components/blog';

// 列表视图
<BlogList
  posts={posts}
  loading={loading}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>

// 网格视图
<BlogGrid
  posts={posts}
  loading={loading}
  columns={3}
/>
```

#### ArticleCard
文章卡片组件（已存在，已增强）。

```tsx
import { ArticleCard } from '@/components/blog';

<ArticleCard
  post={post}
  variant="featured" // 'default' | 'compact' | 'featured' | 'minimal'
  showAuthor={true}
  showStats={true}
  showBookmark={true}
/>
```

## 🎨 样式和主题

所有组件都使用了赛博朋克风格的 CSS 类：

```css
/* 主要类名 */
.cyber-card           /* 卡片容器 */
.cyber-button         /* 按钮样式 */
.cyber-badge          /* 徽章样式 */
.cyber-input          /* 输入框样式 */

/* 颜色变体 */
.cyber-button--neon   /* 霓虹按钮 */
.cyber-button--ghost  /* 幽灵按钮 */
.cyber-badge--cyan    /* 青色徽章 */
.cyber-badge--purple  /* 紫色徽章 */

/* 文字效果 */
.text-glow-cyan       /* 青色发光文字 */
.text-glow-purple     /* 紫色发光文字 */
```

## 📊 类型定义

所有组件都有完整的 TypeScript 类型定义：

```typescript
import type {
  BlogCardData,
  BlogFilters,
  BlogViewMode,
  SearchSuggestion,
  Category,
  TagItem
} from '@/types/blog';
```

## 🔧 完整示例

```tsx
'use client';

import { useState } from 'react';
import {
  BlogFilterBar,
  BlogSearch,
  BlogGrid,
  BlogStatsCard,
  BlogLoadingState
} from '@/components/blog';
import type { BlogFilters, BlogViewMode } from '@/types/blog';

export default function BlogPage() {
  const [filters, setFilters] = useState<BlogFilters>({
    search: '',
    sort: 'latest'
  });
  const [viewMode, setViewMode] = useState<BlogViewMode>('grid');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* 搜索和过滤 */}
      <div className="space-y-4">
        <BlogSearch
          onSearch={(query) => setFilters({ ...filters, search: query })}
          recentSearches={['React', 'TypeScript']}
          trendingSearches={['Next.js', 'AI']}
        />

        <BlogFilterBar
          filters={filters}
          onFiltersChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          categories={categories}
          totalResults={posts.length}
        />
      </div>

      {/* 统计信息 */}
      <BlogStatsCard
        views={1234}
        likes={56}
        comments={23}
        layout="horizontal"
        variant="neon"
      />

      {/* 博客列表 */}
      {loading ? (
        <BlogLoadingState type="grid" count={6} columns={3} />
      ) : (
        <BlogGrid
          posts={posts}
          columns={viewMode === 'grid' ? 3 : 1}
        />
      )}
    </div>
  );
}
```

## 🚀 快速集成

1. **确保依赖已安装**：
```bash
npm install framer-motion lucide-react
```

2. **导入组件**：
```tsx
import { ComponentName } from '@/components/blog';
```

3. **使用组件**：
```tsx
<ComponentName prop1="value1" prop2="value2" />
```

## 📚 相关文档

- [完整组件文档](./COMPONENT_INDEX.md)
- [类型定义](./types/blog.ts)
- [使用示例](./examples/blog)

## 🎯 特性清单

- ✅ 完整的 TypeScript 支持
- ✅ 赛博朋克风格设计
- ✅ Framer Motion 动画
- ✅ 响应式布局
- ✅ 无障碍访问（ARIA）
- ✅ 键盘导航支持
- ✅ 性能优化

---

**最后更新**: 2026-03-07
**版本**: 1.0.0
