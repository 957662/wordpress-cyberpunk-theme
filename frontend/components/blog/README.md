# 博客组件使用指南

本目录包含所有博客相关的 React 组件。

## 组件列表

### 1. BlogList
博客列表组件，以垂直列表形式展示文章。

**Props:**
- `posts: BlogPost[]` - 文章数组
- `loading?: boolean` - 加载状态
- `currentPage?: number` - 当前页码
- `totalPages?: number` - 总页数
- `totalItems?: number` - 总条目数
- `onPageChange?: (page: number) => void` - 页码改变回调
- `onPageSizeChange?: (size: number) => void` - 每页条数改变回调
- `pageSize?: number` - 每页条数
- `emptyMessage?: string` - 空状态提示
- `className?: string` - 自定义类名

**使用示例:**
```tsx
import { BlogList } from '@/components/blog/BlogList';

<BlogList
  posts={posts}
  currentPage={1}
  totalPages={5}
  totalItems={50}
  onPageChange={setPage}
  onPageSizeChange={setPageSize}
/>
```

### 2. BlogGrid
博客网格组件，以网格形式展示文章。

**Props:**
- `posts: BlogPost[]` - 文章数组
- `columns?: 2 | 3 | 4` - 列数（默认3列）
- 其他 props 同 BlogList

**使用示例:**
```tsx
import { BlogGrid } from '@/components/blog/BlogGrid';

<BlogGrid
  posts={posts}
  columns={3}
  currentPage={1}
  totalPages={5}
  totalItems={50}
/>
```

### 3. ArticleCard
文章卡片组件，用于展示单篇文章。

**Props:**
- `post: BlogPost` - 文章数据
- `variant?: 'list' | 'grid' | 'featured'` - 显示样式
- `showExcerpt?: boolean` - 是否显示摘要
- `showAuthor?: boolean` - 是否显示作者
- `showReadingTime?: boolean` - 是否显示阅读时间

**使用示例:**
```tsx
import { ArticleCard } from '@/components/blog/ArticleCard';

<ArticleCard post={post} variant="grid" />
```

### 4. BlogHero
博客英雄区组件，用于展示特色文章。

**Props:**
- `post: BlogPost` - 特色文章数据

**使用示例:**
```tsx
import { BlogHero } from '@/components/blog/BlogHero';

<BlogHero post={featuredPost} />
```

### 5. BlogSidebar
博客侧边栏组件，包含搜索、分类、标签等。

**Props:**
- `categories?: string[]` - 分类列表
- `tags?: string[]` - 标签列表
- `popularPosts?: Array<{...}>` - 热门文章
- `showSearch?: boolean` - 是否显示搜索
- `showCategories?: boolean` - 是否显示分类
- `showTags?: boolean` - 是否显示标签
- `showPopular?: boolean` - 是否显示热门文章

**使用示例:**
```tsx
import { BlogSidebar } from '@/components/blog/BlogSidebar';

<BlogSidebar
  categories={['前端', '后端', '全栈']}
  tags={['React', 'Vue', 'Node.js']}
  popularPosts={popularPosts}
/>
```

## 数据类型

所有组件使用 `BlogPost` 类型：

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  date: string;
  modified?: string;
  author?: string;
  featuredImage?: string;
  category?: string;
  tags?: string[];
  readingTime?: number;
  status?: 'publish' | 'draft' | 'pending';
  link?: string;
  views?: number;
  likes?: number;
  commentCount?: number;
}
```

## WordPress 集成

### 使用 API Hooks

```typescript
import { usePosts, useCategories, useTags } from '@/lib/wordpress';

function MyBlogPage() {
  const { data: posts, isLoading } = usePosts({ 
    page: 1, 
    per_page: 10 
  });
  
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  if (isLoading) return <div>Loading...</div>;

  return <BlogGrid posts={posts} />;
}
```

### 数据适配器

如果使用 WordPress API，需要使用适配器转换数据：

```typescript
import { adaptWPPostsToBlogPosts } from '@/lib/wordpress';
import { wpClient } from '@/lib/wordpress';

const wpPosts = await wpClient.getPosts();
const posts = adaptWPPostsToBlogPosts(wpPosts);
```

## 样式定制

所有组件都支持 Tailwind CSS 类名覆盖：

```tsx
<BlogList
  posts={posts}
  className="space-y-4"
/>
```

## 完整示例

查看 `/app/examples/blog-complete/page.tsx` 获取完整的使用示例。

## 依赖

- React 18+
- Next.js 14+
- TypeScript 5+
- Tailwind CSS
- Lucide Icons
- @tanstack/react-query（用于数据获取）

## 注意事项

1. 确保已配置 WordPress API URL
2. 所有图片应使用 Next.js Image 组件优化
3. 使用 `cn` 工具函数合并类名
4. 所有组件都是客户端组件（'use client'）
