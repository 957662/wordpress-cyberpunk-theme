# 🚀 快速开始指南 - 新组件使用

## 📦 新组件概览

本次更新添加了 5 个核心组件文件,包含 13 个可复用组件:

| 组件文件 | 导出的组件 | 用途 |
|---------|-----------|------|
| LoadingSpinner.tsx | 5个 | 加载动画和骨架屏 |
| EmptyState.tsx | 4个 | 空状态展示 |
| CategoryFilter.tsx | 3个 | 分类筛选 |
| Pagination.tsx | 3个 | 分页导航 |
| SearchBar.tsx | 3个 | 搜索功能 |

---

## 🎯 最常见的使用场景

### 场景1: 博客列表页面

```typescript
'use client';

import { useState } from 'react';
import { SearchBar } from '@/components/blog/SearchBar';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Pagination } from '@/components/blog/Pagination';
import { EmptyState } from '@/components/blog/EmptyState';
import { ArticleListSkeleton } from '@/components/blog/LoadingSpinner';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 搜索栏 */}
      <SearchBar onSearch={setSearch} />

      {/* 分类筛选 */}
      <CategoryFilter
        categories={categories}
        selectedCategory={category}
        onSelectCategory={setCategory}
      />

      {/* 文章列表 */}
      {isLoading ? (
        <ArticleListSkeleton count={6} />
      ) : posts.length === 0 ? (
        <EmptyState type="no-posts" />
      ) : (
        <>
          <BlogGrid posts={posts} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
```

### 场景2: 文章详情页面

```typescript
import { FullPageLoading } from '@/components/blog/LoadingSpinner';
import { ErrorState } from '@/components/blog/EmptyState';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { post, isLoading, error } = usePost(params.slug);

  if (isLoading) return <FullPageLoading message="加载文章..." />;
  if (error) return <ErrorState message="文章加载失败" />;

  return <ArticleDetail post={post} />;
}
```

### 场景3: 搜索页面

```typescript
'use client';

import { useState } from 'react';
import { AdvancedSearchBar } from '@/components/blog/SearchBar';
import { ArticleSkeleton } from '@/components/blog/LoadingSpinner';
import { SearchEmptyState } from '@/components/blog/EmptyState';
import { SimplePagination } from '@/components/blog/Pagination';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  return (
    <div>
      <AdvancedSearchBar />
      {isLoading ? (
        <ArticleSkeleton />
      ) : results.length === 0 ? (
        <SearchEmptyState query={query} />
      ) : (
        <>
          <ResultsList results={results} />
          <SimplePagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
```

---

## 🎨 组件速查表

### LoadingSpinner 组件

```typescript
// 1. 基础加载动画
<LoadingSpinner size="md" color="cyan" />

// 2. 文章骨架屏
<ArticleSkeleton showImage={true} />

// 3. 列表骨架屏
<ArticleListSkeleton count={6} />

// 4. 全屏加载
<FullPageLoading message="加载中..." showLogo={true} />

// 5. 按钮加载状态
<ButtonLoading loading={isLoading}>提交</ButtonLoading>
```

### EmptyState 组件

```typescript
// 1. 通用空状态
<EmptyState
  type="no-posts"
  title="暂无文章"
  description="还没有发布任何文章"
  action={{ label: '创建', onClick: handleCreate }}
/>

// 2. 文章空状态
<PostsEmptyState onReset={handleReset} />

// 3. 搜索空状态
<SearchEmptyState query="关键词" onClear={handleClear} />

// 4. 错误状态
<ErrorState message="加载失败" onRetry={handleRetry} />
```

### CategoryFilter 组件

```typescript
// 1. 分类筛选器
<CategoryFilter
  categories={categories}
  selectedCategory={selected}
  onSelectCategory={setSelected}
/>

// 2. 分类标签云
<CategoryCloud
  categories={categories}
  selectedCategory={selected}
  onSelectCategory={setSelected}
  maxCount={10}
/>

// 3. 分类下拉选择
<CategorySelect
  categories={categories}
  selectedCategory={selected}
  onSelectCategory={setSelected}
/>
```

### Pagination 组件

```typescript
// 1. 完整分页
<Pagination
  currentPage={page}
  totalPages={total}
  onPageChange={setPage}
  showFirstLast={true}
  maxVisiblePages={5}
/>

// 2. 简单分页
<SimplePagination
  currentPage={page}
  totalPages={total}
  onPageChange={setPage}
/>

// 3. 加载更多
<LoadMorePagination
  currentPage={page}
  totalPages={total}
  onLoadMore={loadMore}
  isLoading={isLoading}
/>
```

### SearchBar 组件

```typescript
// 1. 基础搜索栏
<SearchBar
  placeholder="搜索文章..."
  onSearch={setSearch}
/>

// 2. 高级搜索栏
<AdvancedSearchBar />

// 3. 带建议的搜索
<SearchWithSuggestions suggestions={suggestions} />
```

---

## 📋 Props 快速参考

### LoadingSpinner
- `size`: 'sm' | 'md' | 'lg'
- `color`: 'cyan' | 'purple' | 'pink' | 'green'
- `className`: string

### EmptyState
- `type`: 'no-posts' | 'no-results' | 'no-data' | 'error'
- `title`: string
- `description`: string
- `action`: { label: string; onClick: () => void }
- `className`: string

### CategoryFilter
- `categories`: Category[]
- `selectedCategory`: string | null
- `onSelectCategory`: (slug: string | null) => void
- `className`: string

### Pagination
- `currentPage`: number
- `totalPages`: number
- `onPageChange`: (page: number) => void
- `showFirstLast`: boolean (default: true)
- `maxVisiblePages`: number (default: 5)
- `className`: string

### SearchBar
- `placeholder`: string (default: '搜索文章...')
- `onSearch`: (query: string) => void
- `className`: string

---

## 🔧 常见问题

### Q1: 如何自定义样式?

所有组件都支持 `className` prop:

```typescript
<SearchBar className="my-custom-class" />
```

### Q2: 如何集成到现有页面?

```typescript
// 1. 导入组件
import { SearchBar, CategoryFilter } from '@/components/blog';

// 2. 使用组件
<SearchBar onSearch={handleSearch} />
<CategoryFilter categories={categories} onSelectCategory={handleCategory} />
```

### Q3: 如何处理加载状态?

```typescript
const [isLoading, setIsLoading] = useState(false);

{isLoading ? (
  <ArticleListSkeleton />
) : (
  <BlogGrid posts={posts} />
)}
```

### Q4: 如何处理空状态?

```typescript
{posts.length === 0 ? (
  <EmptyState type="no-posts" />
) : (
  <BlogGrid posts={posts} />
)}
```

---

## 📚 更多资源

- **完整文档**: `QUICKREF_NEW_COMPONENTS.md`
- **文件列表**: `FILES_CREATED_2026-03-07-ACTUAL.md`
- **最终总结**: `FINAL_SUMMARY_2026-03-07.md`
- **验证脚本**: `verify-new-components-2026-03-07.sh`

---

## 🚀 下一步

1. **查看示例**: 浏览 `page-new.tsx` 了解完整用法
2. **阅读文档**: 查看 `QUICKREF_NEW_COMPONENTS.md` 了解所有组件
3. **运行测试**: 执行 `verify-new-components-2026-03-07.sh` 验证安装

---

**更新时间**: 2026-03-07  
**维护者**: AI Development Team
