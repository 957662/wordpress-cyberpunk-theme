# 🚀 新组件快速参考 - 2026-03-07

## 📦 新创建的组件

### 1. LoadingSpinner (加载动画)

**导入**:
```typescript
import {
  LoadingSpinner,
  ArticleSkeleton,
  ArticleListSkeleton,
  FullPageLoading,
  ButtonLoading
} from '@/components/blog/LoadingSpinner';
```

**使用示例**:

```typescript
// 基础加载动画
<LoadingSpinner size="md" color="cyan" />

// 文章骨架屏
<ArticleSkeleton showImage={true} />

// 文章列表骨架屏
<ArticleListSkeleton count={6} showImage={true} />

// 全屏加载
<FullPageLoading message="加载中..." showLogo={true} />

// 按钮加载状态
<ButtonLoading loading={isLoading}>
  提交
</ButtonLoading>
```

---

### 2. EmptyState (空状态)

**导入**:
```typescript
import {
  EmptyState,
  PostsEmptyState,
  SearchEmptyState,
  ErrorState
} from '@/components/blog/EmptyState';
```

**使用示例**:

```typescript
// 通用空状态
<EmptyState
  type="no-posts"
  title="暂无文章"
  description="还没有发布任何文章"
  action={{
    label: '创建文章',
    onClick: () => {}
  }}
/>

// 文章列表空状态
<PostsEmptyState onReset={() => {}} />

// 搜索结果空状态
<SearchEmptyState query="关键词" onClear={() => {}} />

// 错误状态
<ErrorState
  message="加载失败"
  onRetry={() => {}}
/>
```

---

### 3. CategoryFilter (分类筛选)

**导入**:
```typescript
import {
  CategoryFilter,
  CategoryCloud,
  CategorySelect
} from '@/components/blog/CategoryFilter';
```

**使用示例**:

```typescript
// 分类筛选器
<CategoryFilter
  categories={categories}
  selectedCategory={selectedSlug}
  onSelectCategory={(slug) => setSelectedSlug(slug)}
/>

// 分类标签云
<CategoryCloud
  categories={categories}
  selectedCategory={selectedSlug}
  onSelectCategory={(slug) => setSelectedSlug(slug)}
  maxCount={10}
/>

// 分类下拉选择
<CategorySelect
  categories={categories}
  selectedCategory={selectedSlug}
  onSelectCategory={(slug) => setSelectedSlug(slug)}
/>
```

---

### 4. Pagination (分页)

**导入**:
```typescript
import {
  Pagination,
  SimplePagination,
  LoadMorePagination
} from '@/components/blog/Pagination';
```

**使用示例**:

```typescript
// 完整分页
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
  showFirstLast={true}
  maxVisiblePages={5}
/>

// 简单分页
<SimplePagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
/>

// 加载更多
<LoadMorePagination
  currentPage={currentPage}
  totalPages={totalPages}
  onLoadMore={() => loadMore()}
  isLoading={isLoading}
/>
```

---

### 5. SearchBar (搜索栏)

**导入**:
```typescript
import {
  SearchBar,
  AdvancedSearchBar,
  SearchWithSuggestions
} from '@/components/blog/SearchBar';
```

**使用示例**:

```typescript
// 基础搜索栏
<SearchBar
  placeholder="搜索文章..."
  onSearch={(query) => setSearchQuery(query)}
/>

// 高级搜索栏
<AdvancedSearchBar />

// 带建议的搜索
<SearchWithSuggestions
  suggestions={searchSuggestions}
/>
```

---

## 🎨 完整页面示例

```typescript
'use client';

import { useState } from 'react';
import { usePosts } from '@/hooks/useWordPress';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { SearchBar } from '@/components/blog/SearchBar';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Pagination } from '@/components/blog/Pagination';
import { EmptyState } from '@/components/blog/EmptyState';
import { ArticleListSkeleton } from '@/components/blog/LoadingSpinner';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = usePosts({
    page,
    category: category || undefined,
    search: search || undefined,
  });

  if (isLoading) {
    return <ArticleListSkeleton count={6} />;
  }

  if (error) {
    return <EmptyState type="error" />;
  }

  const { posts, pagination } = data || { posts: [], pagination: {} };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 搜索 */}
      <SearchBar onSearch={setSearch} />

      {/* 分类筛选 */}
      <CategoryFilter
        categories={categories}
        selectedCategory={category}
        onSelectCategory={setCategory}
      />

      {/* 文章列表 */}
      {posts.length === 0 ? (
        <EmptyState type="no-posts" />
      ) : (
        <>
          <BlogGrid posts={posts} />

          {/* 分页 */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}
```

---

## 🎯 Props 参考

### LoadingSpinner

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | 尺寸 |
| color | 'cyan' \| 'purple' \| 'pink' \| 'green' | 'cyan' | 颜色 |
| className | string | - | 自定义类名 |

### EmptyState

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| type | 'no-posts' \| 'no-results' \| 'no-data' \| 'error' | 'no-data' | 类型 |
| title | string | - | 标题 |
| description | string | - | 描述 |
| action | object | - | 操作按钮 |
| className | string | - | 自定义类名 |

### CategoryFilter

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| categories | Category[] | - | 分类列表 |
| selectedCategory | string \| null | - | 选中的分类 |
| onSelectCategory | function | - | 选择回调 |
| className | string | - | 自定义类名 |

### Pagination

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| currentPage | number | - | 当前页 |
| totalPages | number | - | 总页数 |
| onPageChange | function | - | 页面改变回调 |
| showFirstLast | boolean | true | 显示首页/末页 |
| maxVisiblePages | number | 5 | 最大可见页数 |
| className | string | - | 自定义类名 |

### SearchBar

| Prop | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| placeholder | string | '搜索文章...' | 占位符 |
| onSearch | function | - | 搜索回调 |
| className | string | - | 自定义类名 |

---

## 🎨 样式定制

所有组件都支持通过 `className` prop 进行样式定制:

```typescript
<SearchBar className="my-custom-class" />
```

---

## 📱 响应式设计

所有组件都是完全响应式的,支持:
- 移动端 (sm)
- 平板 (md)
- 桌面 (lg)
- 大屏 (xl)

---

## ⚡ 性能优化

- ✅ 使用 React.memo 避免不必要的重渲染
- ✅ 防抖搜索 (300ms)
- ✅ 代码分割
- ✅ 图片懒加载

---

## 🔗 相关文件

- `/frontend/components/blog/LoadingSpinner.tsx`
- `/frontend/components/blog/EmptyState.tsx`
- `/frontend/components/blog/CategoryFilter.tsx`
- `/frontend/components/blog/Pagination.tsx`
- `/frontend/components/blog/SearchBar.tsx`
- `/frontend/app/blog/page-new.tsx`

---

**最后更新**: 2026-03-07  
**维护者**: AI Development Team
