# 博客组件快速开始指南

## 📦 已创建的文件

### WordPress API 集成
- ✅ `frontend/lib/wordpress/client.ts` - REST API 客户端
- ✅ `frontend/lib/wordpress/adapters.ts` - 数据适配器
- ✅ `frontend/lib/wordpress/types.ts` - TypeScript 类型定义
- ✅ `frontend/lib/wordpress/hooks.ts` - React Query hooks

### 增强版博客组件
- ✅ `frontend/components/blog/BlogListEnhancedNew.tsx` - 博客列表组件
- ✅ `frontend/components/blog/BlogGridEnhancedNew.tsx` - 博客网格组件
- ✅ `frontend/components/blog/BlogPaginationEnhanced.tsx` - 分页组件
- ✅ `frontend/components/blog/BlogSearchBarEnhanced.tsx` - 搜索栏组件
- ✅ `frontend/components/blog/BlogSidebarEnhanced.tsx` - 侧边栏组件

### 工具和示例
- ✅ `frontend/lib/blog-helpers.ts` - 辅助工具函数
- ✅ `frontend/app/blog/page-enhanced.tsx` - 完整示例页面
- ✅ `frontend/verify-blog-creation.sh` - 验证脚本
- ✅ `frontend/CREATED_FILES_REPORT.md` - 详细文档

## 🚀 快速开始

### 1. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
# WordPress API 地址
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json
```

### 2. 基础使用 - 简单博客列表

```typescript
// app/blog/page.tsx
'use client';

import { BlogListEnhancedNew } from '@/components/blog';
import { usePosts } from '@/lib/wordpress/hooks';

export default function BlogPage() {
  const { data: posts, isLoading } = usePosts({ per_page: 12 });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">博客</h1>
      <BlogListEnhancedNew
        posts={posts}
        loading={isLoading}
        layout="grid"
        columns={3}
      />
    </div>
  );
}
```

### 3. 高级使用 - 完整博客页面

```typescript
// app/blog/page.tsx
'use client';

import React from 'react';
import {
  BlogListEnhancedNew,
  BlogSearchBarEnhanced,
  BlogSidebarEnhanced
} from '@/components/blog';
import { usePosts, useCategories, useTags } from '@/lib/wordpress/hooks';

export default function BlogPage() {
  const [page, setPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: posts, isLoading } = usePosts({
    page,
    per_page: 12,
    search: searchQuery || undefined,
  });

  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  return (
    <div className="min-h-screen bg-cyber-dark">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-white text-center mb-8">
          博客
        </h1>
        <BlogSearchBarEnhanced
          onSearch={setSearchQuery}
          placeholder="搜索文章..."
        />
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Blog List */}
          <div className="lg:col-span-3">
            <BlogListEnhancedNew
              posts={posts}
              loading={isLoading}
              layout="grid"
              columns={3}
              currentPage={page}
              totalPages={10}
              onPageChange={setPage}
              showFilters
              showPagination
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebarEnhanced
              categories={categories}
              tags={tags}
              popularPosts={posts.slice(0, 5)}
              recentPosts={posts.slice(0, 5)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
```

### 4. 文章详情页

```typescript
// app/blog/[slug]/page.tsx
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { usePostBySlug } from '@/lib/wordpress/hooks';
import { formatDateRelative, calculateReadingTime } from '@/lib/blog-helpers';

export default function BlogPostPage() {
  const params = useParams();
  const { data: post, isLoading } = usePostBySlug(params.slug as string);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (!post) {
    return <div>文章未找到</div>;
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title.rendered}</h1>
        <div className="flex items-center gap-4 text-cyber-muted/60">
          <time>{formatDateRelative(post.date)}</time>
          <span>·</span>
          <span>{calculateReadingTime(post.content.rendered)} 分钟阅读</span>
        </div>
      </header>

      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}
```

## 📚 组件 API 文档

### BlogListEnhancedNew

**Props:**
```typescript
interface BlogListEnhancedProps {
  posts: PostCardData[];
  loading?: boolean;
  layout?: 'list' | 'grid' | 'masonry';
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
  showSearch?: boolean;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
}
```

**使用示例:**
```tsx
<BlogListEnhancedNew
  posts={posts}
  loading={isLoading}
  layout="grid"
  columns={3}
  showFilters
  showPagination
/>
```

### BlogGridEnhancedNew

**Props:**
```typescript
interface BlogGridEnhancedProps {
  posts: PostCardData[];
  loading?: boolean;
  columns?: 2 | 3 | 4;
  masonry?: boolean;
  gap?: 'sm' | 'md' | 'lg';
  showAnimation?: boolean;
  animationDelay?: number;
  className?: string;
}
```

**使用示例:**
```tsx
<BlogGridEnhancedNew
  posts={posts}
  columns={3}
  masonry
  gap="md"
  showAnimation
/>
```

### BlogSearchBarEnhanced

**Props:**
```typescript
interface BlogSearchBarEnhancedProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  showHistory?: boolean;
  debounceDelay?: number;
  className?: string;
}
```

**使用示例:**
```tsx
<BlogSearchBarEnhanced
  onSearch={(query) => console.log(query)}
  placeholder="搜索文章..."
  showSuggestions
  showHistory
/>
```

### BlogPaginationEnhanced

**Props:**
```typescript
interface BlogPaginationEnhancedProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'compact' | 'minimal' | 'numbers';
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
}
```

**使用示例:**
```tsx
<BlogPaginationEnhanced
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log(page)}
  variant="default"
/>
```

### BlogSidebarEnhanced

**Props:**
```typescript
interface BlogSidebarEnhancedProps {
  categories?: BlogCategory[];
  tags?: BlogTag[];
  popularPosts?: PostListItem[];
  recentPosts?: PostListItem[];
  showNewsletter?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showPopularPosts?: boolean;
  showRecentPosts?: boolean;
  className?: string;
}
```

**使用示例:**
```tsx
<BlogSidebarEnhanced
  categories={categories}
  tags={tags}
  popularPosts={popularPosts}
  recentPosts={recentPosts}
  showNewsletter
/>
```

## 🔧 工具函数

### blog-helpers.ts

提供的实用函数：

```typescript
import {
  calculateReadingTime,      // 计算阅读时间
  extractExcerpt,            // 提取摘要
  extractFirstImage,         // 提取第一张图片
  formatDateRelative,        // 格式化相对时间
  formatDateFull,           // 格式化完整日期
  generatePostUrl,          // 生成文章 URL
  formatNumber,             // 格式化数字
  validatePostContent,      // 验证文章内容
  sanitizeHTML,             // 清理 HTML
  highlightSearchTerms,     // 高亮搜索词
  generateShareLinks,       // 生成分享链接
} from '@/lib/blog-helpers';
```

**使用示例:**
```typescript
// 计算阅读时间
const readingTime = calculateReadingTime(post.content);

// 提取摘要
const excerpt = extractExcerpt(post.content, 200);

// 格式化日期
const date = formatDateRelative(post.date);

// 生成分享链接
const shareLinks = generateShareLinks(url, title);
```

## 🎨 自定义样式

所有组件都使用 Tailwind CSS 和赛博朋克主题。你可以在 `tailwind.config.ts` 中自定义颜色：

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-green': '#00ff88',
        'cyber-muted': '#1a1a2e',
      },
    },
  },
};
```

## 📝 数据类型

所有组件都使用 TypeScript 类型定义：

```typescript
// frontend/components/blog/types.ts
export interface PostCardData {
  id: string | number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: {
    name: string;
    avatar?: string;
  };
  category?: {
    name: string;
    slug: string;
  };
  tags?: Array<{
    name: string;
    slug: string;
  }>;
  featuredImage?: string;
  readingTime?: number;
  stats?: {
    views?: number;
    likes?: number;
    comments?: number;
  };
}
```

## 🧪 测试

运行验证脚本确认所有文件已创建：

```bash
cd frontend
./verify-blog-creation.sh
```

## 🔍 故障排除

### 问题：组件导入错误

**解决方案：**
确保已更新 `frontend/components/blog/index.ts` 导出文件。

### 问题：API 连接失败

**解决方案：**
1. 检查 `.env.local` 中的 `NEXT_PUBLIC_WORDPRESS_API_URL`
2. 确保 WordPress REST API 已启用
3. 检查 CORS 设置

### 问题：样式不正确

**解决方案：**
1. 确保 Tailwind CSS 已正确配置
2. 检查赛博朋克主题颜色是否定义
3. 清除浏览器缓存

## 📖 更多资源

- [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)
- [React Query 文档](https://tanstack.com/query/latest)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 🎯 下一步

1. **添加评论系统**
   - 集成 WordPress 评论 API
   - 或使用第三方评论服务（如 Disqus）

2. **实现搜索功能**
   - 添加高级搜索过滤器
   - 实现搜索结果高亮

3. **性能优化**
   - 实现图片懒加载
   - 添加虚拟滚动
   - 代码分割

4. **SEO 优化**
   - 添加结构化数据
   - 优化 meta 标签
   - 生成 sitemap

## 💡 提示

- 所有组件都是客户端组件（'use client'）
- 使用 React Query 进行数据获取和缓存
- 使用 Framer Motion 实现动画效果
- 所有组件都支持 TypeScript 类型检查

---

**创建日期**: 2026-03-06
**版本**: 1.0.0
**作者**: AI Development Team
