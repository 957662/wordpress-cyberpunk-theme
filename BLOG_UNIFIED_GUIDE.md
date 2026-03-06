# 🎉 博客统一组件使用指南

**创建日期**: 2026-03-06
**版本**: 1.0.0

---

## 📦 概述

我们创建了一套统一的博客组件系统，解决了 WordPress API 和自定义 Post 类型之间的数据格式不兼容问题。

### 核心特性

✅ **自动数据适配** - 支持 WordPress API 和标准 Post 格式
✅ **统一接口** - 一套组件，多种数据源
✅ **完整功能** - 列表、网格、卡片全覆盖
✅ **响应式设计** - 完美适配所有设备
✅ **赛博朋克风格** - 保持项目设计一致性
✅ **TypeScript 类型安全** - 完整的类型定义

---

## 🚀 快速开始

### 1. 导入组件

```tsx
// 推荐：使用统一组件
import {
  ArticleCardUnified,
  BlogListUnified,
  BlogGridUnified,
} from '@/components/blog';

// 也可以使用优化版本
import {
  BlogListOptimized,
  BlogGridOptimized,
} from '@/components/blog';
```

### 2. 基础使用

```tsx
import { BlogListUnified } from '@/components/blog';
import { Post } from '@/types';

function MyBlogPage() {
  const posts: Post[] = [...]; // 你的文章数据

  return (
    <BlogListUnified
      posts={posts}
      layout="grid"
      columns={3}
      loading={false}
      hasMore={true}
      onLoadMore={handleLoadMore}
    />
  );
}
```

---

## 📚 组件文档

### ArticleCardUnified

统一的文章卡片组件，支持多种数据格式。

#### Props

```typescript
interface ArticleCardUnifiedProps {
  post: Post | any;              // 文章数据（自动适配）
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showExcerpt?: boolean;         // 显示摘要
  showMeta?: boolean;            // 显示元信息
  showStats?: boolean;           // 显示统计数据
  showAuthor?: boolean;          // 显示作者
  showCategory?: boolean;        // 显示分类
  showTags?: boolean;            // 显示标签
  className?: string;            // 自定义类名
}
```

#### 示例

```tsx
// 标准卡片
<ArticleCardUnified post={post} />

// 紧凑型卡片
<ArticleCardUnified post={post} variant="compact" showExcerpt={false} />

// 特色卡片
<ArticleCardUnified post={post} variant="featured" showStats={true} />

// 极简卡片
<ArticleCardUnified post={post} variant="minimal" />
```

---

### BlogListUnified

统一的博客列表组件，支持列表和网格布局。

#### Props

```typescript
interface BlogListUnifiedProps {
  posts: Post[];                  // 文章数组
  loading?: boolean;              // 加载状态
  error?: string | null;          // 错误信息
  onLoadMore?: () => void;        // 加载更多回调
  hasMore?: boolean;              // 是否有更多
  layout?: 'list' | 'grid';       // 布局方式
  columns?: 1 | 2 | 3;            // 列数（网格模式）
  showLoadMore?: boolean;         // 显示加载更多按钮
  emptyMessage?: string;          // 空状态消息
  className?: string;             // 自定义类名
}
```

#### 示例

```tsx
// 列表布局
<BlogListUnified
  posts={posts}
  layout="list"
  hasMore={true}
  onLoadMore={loadMore}
/>

// 网格布局（3列）
<BlogListUnified
  posts={posts}
  layout="grid"
  columns={3}
  hasMore={true}
  onLoadMore={loadMore}
/>

// 带错误处理
<BlogListUnified
  posts={posts}
  error={error}
  loading={loading}
  emptyMessage="没有找到文章"
/>
```

---

### BlogGridUnified

优化的网格布局组件，专注于网格展示。

#### Props

```typescript
interface BlogGridUnifiedProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  columns?: 2 | 3 | 4;           // 列数
  gap?: 'sm' | 'md' | 'lg';       // 间距
  cardVariant?: 'default' | 'compact' | 'featured' | 'minimal';
  showLoadMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
  className?: string;
}
```

#### 示例

```tsx
// 3列网格，中等间距
<BlogGridUnified
  posts={posts}
  columns={3}
  gap="md"
  cardVariant="compact"
/>

// 4列网格，小间距
<BlogGridUnified
  posts={posts}
  columns={4}
  gap="sm"
  cardVariant="minimal"
/>

// 带加载更多
<BlogGridUnified
  posts={posts}
  showLoadMore={true}
  hasMore={true}
  onLoadMore={loadMore}
/>
```

---

## 🔧 数据适配器

### 自动适配

所有统一组件都内置了数据适配器，会自动检测并转换数据格式：

```tsx
// WordPress API 格式
const wpPost = {
  id: 123,
  title: { rendered: "Hello World" },
  content: { rendered: "<p>Content...</p>" },
  _embedded: { ... }
};

// 标准 Post 格式
const standardPost = {
  id: "123",
  title: "Hello World",
  content: "Content...",
  author: { ... }
};

// 两种格式都可以直接使用！
<ArticleCardUnified post={wpPost />        // ✅ 自动适配
<ArticleCardUnified post={standardPost />  // ✅ 直接使用
```

### 手动适配

如果需要手动转换数据：

```tsx
import { adaptPost, adaptPosts } from '@/lib/utils/adapters';

// 单个转换
const post = adaptPost(wpPost);

// 批量转换
const posts = adaptPosts(wpPosts);
```

---

## 📄 完整示例

### 博客首页

查看完整示例：`frontend/app/(public)/blog-unified/page.tsx`

关键代码：

```tsx
'use client';

import { useState } from 'react';
import { BlogListUnified } from '@/components/blog';
import { Post } from '@/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [layout, setLayout] = useState<'list' | 'grid'>('grid');
  const [loading, setLoading] = useState(false);

  const handleLoadMore = () => {
    setLoading(true);
    fetchMorePosts().then(newPosts => {
      setPosts([...posts, ...newPosts]);
      setLoading(false);
    });
  };

  return (
    <div>
      {/* 搜索和过滤器 */}
      <SearchBar />
      <CategoryFilter />

      {/* 文章列表 */}
      <BlogListUnified
        posts={posts}
        layout={layout}
        columns={3}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
```

---

## 🎨 自定义样式

所有组件都支持通过 `className` 自定义样式：

```tsx
<BlogListUnified
  posts={posts}
  className="my-custom-class"
/>

<ArticleCardUnified
  post={post}
  className="hover:shadow-xl"
/>
```

---

## 🌟 最佳实践

### 1. 使用统一组件

```tsx
// ✅ 推荐
import { BlogListUnified } from '@/components/blog';

// ❌ 不推荐（除非特殊需求）
import { BlogList } from '@/components/blog';
```

### 2. 利用自动适配

```tsx
// ✅ 让组件自动处理数据格式
<ArticleCardUnified post={anyPostData} />

// ❌ 不需要手动转换
const adapted = adaptPost(rawData);
<ArticleCardUnified post={adapted} />
```

### 3. 错误处理

```tsx
<BlogListUnified
  posts={posts}
  error={error}
  loading={loading}
  emptyMessage="没有找到文章"
/>
```

### 4. 性能优化

```tsx
// 使用无限滚动
<BlogListUnified
  posts={posts}
  hasMore={true}
  onLoadMore={loadMore}
/>

// 或使用分页按钮
<BlogGridUnified
  posts={posts}
  showLoadMore={true}
  hasMore={true}
  onLoadMore={loadMore}
/>
```

---

## 🐛 故障排除

### 问题：组件找不到

**解决方案**：

```tsx
// 确保从正确的路径导入
import { BlogListUnified } from '@/components/blog'; // ✅
import { BlogListUnified } from '@/components/blog/BlogListUnified'; // ✅
```

### 问题：类型错误

**解决方案**：

```tsx
// 使用 Post 类型或 any（自动适配）
import { Post } from '@/types';

const posts: Post[] = [...]; // ✅
const posts: any[] = [...];  // ✅ 自动适配
```

### 问题：样式不显示

**解决方案**：

```tsx
// 确保使用了赛博朋克主题类名
className="border-cyber-cyan/30 bg-deep-black/80"  // ✅
```

---

## 📊 性能对比

| 特性 | 旧组件 | 统一组件 |
|------|--------|----------|
| 数据格式支持 | 单一 | 多种自动适配 |
| TypeScript | 部分 | 完整 |
| 响应式 | 基础 | 完整 |
| 动画 | 基础 | Framer Motion |
| 错误处理 | 无 | 完整 |
| 空状态 | 无 | 完整 |
| 加载状态 | 部分 | 完整 |

---

## 🔄 迁移指南

### 从旧组件迁移

```tsx
// 旧代码
import { BlogCard } from '@/components/blog';
<BlogCard post={wpPost} />

// 新代码
import { ArticleCardUnified } from '@/components/blog';
<ArticleCardUnified post={wpPost} />  // ✅ 自动适配
```

```tsx
// 旧代码
import { BlogList } from '@/components/blog';
<BlogList posts={posts} />

// 新代码
import { BlogListUnified } from '@/components/blog';
<BlogListUnified posts={posts} layout="list" />
```

---

## 📚 相关资源

- **组件源码**: `frontend/components/blog/`
- **数据适配器**: `frontend/lib/utils/adapters.ts`
- **类型定义**: `frontend/types/index.ts`
- **完整示例**: `frontend/app/(public)/blog-unified/page.tsx`
- **格式化工具**: `frontend/lib/utils/format.ts`

---

## 🎯 下一步

### 计划功能

- [ ] 添加骨架屏变体
- [ ] 支持虚拟滚动
- [ ] 添加更多卡片变体
- [ ] 优化加载性能
- [ ] 添加单元测试

### 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📝 更新日志

### v1.0.0 (2026-03-06)

- ✅ 初始版本
- ✅ ArticleCardUnified 组件
- ✅ BlogListUnified 组件
- ✅ BlogGridUnified 组件
- ✅ 数据适配器
- ✅ 完整示例页面
- ✅ 使用文档

---

**创建者**: AI Development Team
**维护者**: CyberPress Platform Team
**许可证**: MIT

---

<div align="center">

**Built with ❤️ for CyberPress Platform**

**Happy Coding! 🚀**

</div>
