# 博客组件系统 - 统一使用指南

## 📋 概述

这是一个完整的博客组件系统，支持多种数据格式和布局变体。所有组件都已更新，使用统一的导入路径和数据适配器。

## ✨ 主要特性

- ✅ **多格式支持**: 自动适配 WordPress API 和自定义数据格式
- ✅ **统一导入路径**: 所有组件都使用 `@/lib/utils`
- ✅ **数据适配器**: 自动转换不同格式的数据
- ✅ **TypeScript 类型**: 完整的类型定义
- ✅ **多种变体**: Default、Compact、Featured、Minimal 等
- ✅ **响应式设计**: 完美适配各种设备
- ✅ **赛博朋克风格**: 独特的视觉效果

## 🚀 快速开始

### 1. 基础用法

```tsx
import { BlogListUnified } from '@/components/blog';

export default function BlogPage() {
  return (
    <BlogListUnified
      posts={posts}
      loading={loading}
      variant="default"
      columns={3}
      showFeatured
      featuredCount={1}
    />
  );
}
```

### 2. 使用不同变体

```tsx
import { BlogCardUnified } from '@/components/blog';

// Default 变体
<BlogCardUnified post={post} variant="default" />

// Compact 变体
<BlogCardUnified post={post} variant="compact" />

// Featured 变体
<BlogCardUnified post={post} variant="featured" />

// Minimal 变体
<BlogCardUnified post={post} variant="minimal" />
```

### 3. WordPress API 数据

```tsx
// 组件会自动适配 WordPress API 格式
const wpPost = {
  id: 1,
  title: { rendered: '文章标题' },
  excerpt: { rendered: '<p>摘要...</p>' },
  // ... 其他 WordPress 字段
};

<BlogCardUnified post={wpPost} />
```

### 4. 自定义数据格式

```tsx
// 使用标准化的数据结构
const customPost = {
  id: '1',
  title: '文章标题',
  slug: 'post-slug',
  excerpt: '摘要...',
  author: { id: '1', name: '作者名' },
  categories: [{ id: '1', name: '分类' }],
  tags: [],
  publishedAt: '2024-03-06',
  readTime: 5,
};

<BlogCardUnified post={customPost} />
```

## 📦 组件列表

### 核心组件（推荐使用）

- `BlogCardUnified` - 统一的博客卡片
- `BlogListUnified` - 统一的博客列表
- `BlogGridUnified` - 统一的博客网格

### 标准组件

- `BlogCard` - 基础博客卡片
- `BlogList` - 基础博客列表
- `BlogGrid` - 基础博客网格

### 文章组件

- `ArticleCard` - 文章卡片
- `ArticleCardUnified` - 统一的文章卡片

### 增强组件

- `BlogListEnhanced` - 增强的博客列表
- `BlogGridEnhanced` - 增强的博客网格
- `BlogListEnhancedNew` - 最新增强版
- `BlogGridEnhancedNew` - 最新增强版

### 详情页组件

- `BlogDetail` - 博客详情页
- `BlogDetailEnhanced` - 增强版
- `BlogDetailEnhancedNew` - 最新版

### 搜索组件

- `BlogSearchBar` - 搜索栏
- `BlogSearchBarEnhanced` - 增强版
- `BlogAdvancedSearch` - 高级搜索

### 分页组件

- `BlogPagination` - 分页组件
- `BlogPaginationEnhanced` - 增强版

### 侧边栏组件

- `BlogSidebar` - 侧边栏
- `BlogSidebarEnhanced` - 增强版

### 交互组件

- `LikeButton` - 点赞按钮
- `LikeButtonEnhanced` - 增强版
- `BookmarkButton` - 收藏按钮
- `BookmarkButtonEnhanced` - 增强版

### 评论组件

- `CommentSystem` - 评论系统
- `CommentSystemEnhanced` - 增强版
- `CommentForm` - 评论表单
- `CommentList` - 评论列表

### 其他组件

- `BlogHero` - 博客头部
- `RelatedPosts` - 相关文章
- `ReadingProgress` - 阅读进度
- `TableOfContents` - 目录
- `SocialShare` - 社交分享
- `TagCloud` - 标签云
- `CategoryFilter` - 分类筛选
- `AuthorBio` - 作者简介
- `CodeHighlight` - 代码高亮
- `LoadingState` - 加载状态

## 🔧 工具函数

### 数据适配器

```tsx
import {
  adaptWordPressPost,
  adaptWordPressPosts,
  adaptCustomPost,
  blogPostToArticleCard,
} from '@/components/blog';

// WordPress API 数据转换
const blogPost = adaptWordPressPost(wpPost);
const blogPosts = adaptWordPressPosts(wpPosts);

// 自定义数据转换
const blogPost = adaptCustomPost(customPost);

// 跨组件格式转换
const articleCardData = blogPostToArticleCard(blogPost);
```

### 工具函数

```tsx
import {
  extractPostTitle,
  extractPostExcerpt,
  formatAuthor,
  formatTerm,
  validateBlogPost,
  fixBlogPost,
} from '@/components/blog';

// 提取标题
const title = extractPostTitle(post);

// 提取摘要
const excerpt = extractPostExcerpt(post, 150);

// 格式化作者
const author = formatAuthor(rawAuthor);

// 格式化分类/标签
const term = formatTerm(rawTerm);

// 验证数据
const isValid = validateBlogPost(post);

// 修复不完整数据
const fixedPost = fixBlogPost(incompletePost);
```

## 📝 类型定义

所有类型都定义在 `@/types/blog` 中：

```tsx
import type {
  BlogPost,
  Author,
  Term,
  WordPressPost,
  BlogCardProps,
  BlogListProps,
  BlogGridProps,
  ArticleCardProps,
  PaginationProps,
  SearchFilters,
  Comment,
} from '@/types/blog';
```

## 🎨 样式定制

所有组件使用 Tailwind CSS，可以通过 className 自定义：

```tsx
<BlogCardUnified
  post={post}
  className="custom-class"
  variant="featured"
/>
```

## 🐛 常见问题

### 1. 导入路径错误

**问题**: 找不到模块 `@/lib/utils/cn`

**解决方案**: 使用统一的导入路径：
```tsx
// ❌ 错误
import { cn } from '@/lib/utils/cn';

// ✅ 正确
import { cn } from '@/lib/utils';
```

### 2. 数据格式不匹配

**问题**: 组件不显示数据或报错

**解决方案**: 使用数据适配器或检查数据格式：
```tsx
import { adaptWordPressPost, validateBlogPost } from '@/lib/blog/adapters';

// 方法 1: 使用适配器
const blogPost = adaptWordPressPost(wpPost);

// 方法 2: 验证数据
if (validateBlogPost(post)) {
  // 数据有效
} else {
  // 数据无效，使用修复器
  const fixedPost = fixBlogPost(post);
}
```

### 3. TypeScript 类型错误

**问题**: 类型不匹配

**解决方案**: 确保使用正确的类型：
```tsx
import type { BlogPost } from '@/types/blog';

const post: BlogPost = {
  id: '1',
  title: '标题',
  // ... 其他必需字段
};
```

## 📚 更多示例

查看完整示例：
```bash
open /frontend/app/examples/blog-usage-example/page.tsx
```

## 🔗 相关链接

- [主组件导出](./index.ts)
- [统一组件导出](./index-unified.ts)
- [数据适配器](../../lib/blog/adapters.ts)
- [类型定义](../../types/blog.ts)
- [工具函数](../../lib/utils/index.ts)

## 🔄 更新日志

### 2026-03-06
- ✅ 统一所有导入路径为 `@/lib/utils`
- ✅ 添加数据适配器系统
- ✅ 创建统一组件（BlogCardUnified、BlogListUnified、BlogGridUnified）
- ✅ 完善类型定义
- ✅ 添加完整的使用示例
- ✅ 修复导入路径不一致问题

## 💡 最佳实践

1. **使用统一组件**: 优先使用 `BlogCardUnified`、`BlogListUnified`、`BlogGridUnified`
2. **统一导入路径**: 总是从 `@/lib/utils` 导入工具函数
3. **使用数据适配器**: 让适配器自动处理数据格式转换
4. **类型安全**: 使用 TypeScript 类型确保数据正确性
5. **错误处理**: 使用 LoadingState 和 ErrorBoundary 处理异常情况

## 📞 支持

如有问题，请查看：
- [项目 TODO.md](../../../../TODO.md)
- [开发指南](../../../../DEVELOPMENT_GUIDE.md)
- [使用示例](./app/examples/blog-usage-example/page.tsx)
