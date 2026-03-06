# 博客组件使用指南

## 🎉 新增内容

本次更新添加了完整的 WordPress 博客集成系统和增强版博客组件。

## 📦 快速导航

- 🚀 [快速开始](#快速开始)
- 📚 [组件列表](#组件列表)
- 💡 [使用示例](#使用示例)
- 🔧 [API 文档](#api-文档)
- 🎨 [样式定制](#样式定制)

## 🚀 快速开始

### 1. 基础使用

```typescript
import { BlogListEnhancedNew } from '@/components/blog';
import { usePosts } from '@/lib/wordpress/hooks';

export default function BlogPage() {
  const { data: posts, isLoading } = usePosts();

  return (
    <BlogListEnhancedNew
      posts={posts}
      loading={isLoading}
      layout="grid"
      columns={3}
    />
  );
}
```

### 2. 完整示例

参考 `app/blog/page-enhanced.tsx` 查看完整的使用示例。

## 📚 组件列表

### 核心组件

| 组件 | 文件 | 功能 |
|------|------|------|
| BlogListEnhancedNew | `components/blog/BlogListEnhancedNew.tsx` | 博客列表（支持多种布局） |
| BlogGridEnhancedNew | `components/blog/BlogGridEnhancedNew.tsx` | 博客网格（瀑布流布局） |
| BlogPaginationEnhanced | `components/blog/BlogPaginationEnhanced.tsx` | 分页组件（多种样式） |
| BlogSearchBarEnhanced | `components/blog/BlogSearchBarEnhanced.tsx` | 搜索栏（实时搜索） |
| BlogSidebarEnhanced | `components/blog/BlogSidebarEnhanced.tsx` | 侧边栏（多功能） |

### API 集成

| 模块 | 文件 | 功能 |
|------|------|------|
| WordPress Client | `lib/wordpress/client.ts` | REST API 客户端 |
| Adapters | `lib/wordpress/adapters.ts` | 数据适配器 |
| Hooks | `lib/wordpress/hooks.ts` | React Query hooks |
| Types | `lib/wordpress/types.ts` | TypeScript 类型 |

### 工具函数

| 模块 | 文件 | 功能 |
|------|------|------|
| Blog Helpers | `lib/blog-helpers.ts` | 辅助工具函数 |

## 💡 使用示例

### 博客列表（带搜索和过滤）

```typescript
'use client';

import { useState } from 'react';
import {
  BlogListEnhancedNew,
  BlogSearchBarEnhanced,
  BlogSidebarEnhanced
} from '@/components/blog';
import { usePosts, useCategories, useTags } from '@/lib/wordpress/hooks';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: posts, isLoading } = usePosts({
    page,
    per_page: 12,
    search: searchQuery || undefined,
  });

  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* 主内容区 */}
      <div className="lg:col-span-3">
        <BlogSearchBarEnhanced onSearch={setSearchQuery} />
        <BlogListEnhancedNew
          posts={posts}
          loading={isLoading}
          currentPage={page}
          totalPages={10}
          onPageChange={setPage}
          showFilters
        />
      </div>

      {/* 侧边栏 */}
      <div className="lg:col-span-1">
        <BlogSidebarEnhanced
          categories={categories}
          tags={tags}
        />
      </div>
    </div>
  );
}
```

### 文章详情页

```typescript
'use client';

import { usePostBySlug } from '@/lib/wordpress/hooks';
import { calculateReadingTime, formatDateRelative } from '@/lib/blog-helpers';

export default function BlogPostPage({ slug }: { slug: string }) {
  const { data: post, isLoading } = usePostBySlug(slug);

  if (isLoading) return <div>加载中...</div>;
  if (!post) return <div>文章未找到</div>;

  return (
    <article>
      <h1>{post.title.rendered}</h1>
      <div className="meta">
        <time>{formatDateRelative(post.date)}</time>
        <span>{calculateReadingTime(post.content.rendered)} 分钟</span>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}
```

## 🔧 API 文档

### BlogListEnhancedNew

```typescript
interface BlogListEnhancedProps {
  posts: PostCardData[];           // 文章数据
  loading?: boolean;                // 加载状态
  layout?: 'list' | 'grid';        // 布局方式
  columns?: 2 | 3 | 4;             // 列数（网格布局）
  showFilters?: boolean;            // 显示过滤器
  showSearch?: boolean;             // 显示搜索
  showPagination?: boolean;         // 显示分页
  currentPage?: number;             // 当前页
  totalPages?: number;              // 总页数
  onPageChange?: (page: number) => void;
  className?: string;
}
```

### BlogSearchBarEnhanced

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

### BlogSidebarEnhanced

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

## 🎨 样式定制

### 颜色主题

组件使用赛博朋克主题，在 `tailwind.config.ts` 中定义：

```typescript
colors: {
  'cyber-dark': '#0a0a0f',      // 深空黑
  'cyber-cyan': '#00f0ff',      // 霓虹青
  'cyber-purple': '#9d00ff',    // 赛博紫
  'cyber-pink': '#ff0080',      // 激光粉
  'cyber-green': '#00ff88',     // 赛博绿
  'cyber-muted': '#1a1a2e',     // 深空蓝
}
```

### 自定义样式

所有组件都支持 `className` prop，可以添加自定义样式：

```typescript
<BlogListEnhancedNew
  posts={posts}
  className="my-custom-class"
/>
```

## 🛠️ 工具函数

### blog-helpers.ts

```typescript
import {
  // 内容处理
  calculateReadingTime,      // 计算阅读时间
  extractExcerpt,            // 提取摘要
  extractFirstImage,         // 提取第一张图片

  // 日期格式化
  formatDateRelative,        // 相对时间（如：3小时前）
  formatDateFull,           // 完整日期
  formatDateShort,          // 短日期

  // URL 生成
  generatePostUrl,          // 文章 URL
  generateCategoryUrl,      // 分类 URL
  generateTagUrl,           // 标签 URL

  // 其他
  formatNumber,             // 格式化数字（如：1.5k）
  validatePostContent,      // 验证文章内容
  sanitizeHTML,             // 清理 HTML
  highlightSearchTerms,     // 高亮搜索词
  generateShareLinks,       // 生成分享链接
} from '@/lib/blog-helpers';
```

## 📖 更多文档

- [快速开始指南](../QUICKSTART_BLOG_ENHANCED.md)
- [详细报告](../CREATED_FILES_REPORT.md)
- [完成总结](../COMPLETION_SUMMARY.md)
- [验证脚本](./verify-blog-creation.sh)

## 🧪 验证

运行验证脚本确认所有文件已创建：

```bash
./verify-blog-creation.sh
```

## 🔍 故障排除

### 导入错误

确保正确导入：

```typescript
// ✅ 正确
import { BlogListEnhancedNew } from '@/components/blog';

// ❌ 错误
import { BlogListEnhancedNew } from '@/components/blog/BlogListEnhancedNew';
```

### API 连接失败

1. 检查环境变量：
```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json
```

2. 确保 WordPress REST API 已启用

3. 检查 CORS 设置

### 样式问题

1. 确保 Tailwind CSS 已配置
2. 检查赛博朋克主题颜色
3. 清除浏览器缓存

## 🎯 下一步

1. **自定义样式**：根据品牌调整颜色和样式
2. **添加功能**：集成评论、收藏等功能
3. **性能优化**：实现图片懒加载、虚拟滚动
4. **SEO 优化**：添加结构化数据、meta 标签

## 📞 支持

如有问题，请查看：
- 项目文档：`../README.md`
- 示例代码：`app/blog/page-enhanced.tsx`
- 组件文档：各组件文件的 JSDoc 注释

---

**版本**: 1.0.0
**更新日期**: 2026-03-06
**作者**: AI Development Team
