# Blog Components - 博客组件文档

## 📋 概述

这是 CyberPress Platform 的博客组件库，包含所有与博客相关的 React 组件。这些组件采用赛博朋克风格设计，使用 Framer Motion 实现流畅的动画效果。

## 🗂️ 组件列表

### 核心组件 (Core Components)

| 组件名 | 文件 | 说明 |
|--------|------|------|
| `PostCard` | `core/PostCard.tsx` | 文章卡片组件 |
| `PostList` | `core/PostList.tsx` | 文章列表组件 |
| `CategoryBadge` | `core/CategoryBadge.tsx` | 分类徽章组件 |

## 🎨 组件使用示例

### PostCard - 文章卡片

文章卡片组件用于显示单篇文章的信息。

#### 基本用法

```tsx
import { PostCard } from '@/components/blog/core/PostCard';

<PostCard post={postData} />
```

#### 变体

```tsx
// 默认样式
<PostCard post={postData} variant="default" />

// 紧凑样式
<PostCard post={postData} variant="compact" />

// 精选样式
<PostCard post={postData} variant="featured" />

// 网格样式
<PostCard post={postData} variant="grid" />
```

#### 属性

```tsx
interface PostCardProps {
  post: Post;              // 文章数据
  variant?: 'default' | 'compact' | 'featured' | 'grid';
  showExcerpt?: boolean;   // 是否显示摘要
  showMeta?: boolean;      // 是否显示元数据
  showTags?: boolean;      // 是否显示标签
  className?: string;      // 自定义类名
}
```

---

### PostList - 文章列表

文章列表组件用于显示多篇文章，支持网格和列表两种布局。

#### 基本用法

```tsx
import { PostList } from '@/components/blog/core/PostList';

<PostList
  posts={postsData}
  total={totalCount}
  layout="list"
  onLoadMore={handleLoadMore}
/>
```

#### 属性

```tsx
interface PostListProps {
  posts: Post[];              // 文章数组
  loading?: boolean;          // 加载状态
  total?: number;             // 总文章数
  page?: number;              // 当前页码
  pageSize?: number;          // 每页文章数
  layout?: 'grid' | 'list';   // 布局方式
  onLoadMore?: () => void;    // 加载更多回调
  className?: string;         // 自定义类名
}
```

---

## 🛠️ Blog Service

博客服务层提供了与后端 API 交互的方法。

### 使用方法

```tsx
import blogService from '@/services/blog';

// 获取文章列表
const { data } = await blogService.post.getList({
  page: 1,
  pageSize: 10,
  status: ['publish']
});

// 根据 slug 获取文章
const post = await blogService.post.getBySlug('post-slug');

// 获取热门文章
const popularPosts = await blogService.post.getPopular(10);

// 搜索文章
const results = await blogService.post.search('keyword');

// 点赞文章
await blogService.post.like(postId);
```

### API 方法

#### postService

```tsx
postService.getList(params)          // 获取文章列表
postService.getBySlug(slug)          // 根据 slug 获取文章
postService.getById(id)              // 根据 ID 获取文章
postService.getPopular(limit)        // 获取热门文章
postService.getFeatured(limit)       // 获取精选文章
postService.getSticky()              // 获取置顶文章
postService.getRelated(postId)       // 获取相关文章
postService.search(query, params)    // 搜索文章
postService.getArchive(year)         // 获取文章归档
postService.incrementViews(postId)   // 增加浏览量
postService.like(postId)             // 点赞文章
postService.unlike(postId)           // 取消点赞
```

#### categoryService

```tsx
categoryService.getList(params)      // 获取分类列表
categoryService.getBySlug(slug)      // 根据 slug 获取分类
categoryService.getById(id)          // 根据 ID 获取分类
categoryService.getPopular(limit)    // 获取热门分类
categoryService.getTree()            // 获取分类树
```

#### tagService

```tsx
tagService.getList(params)           // 获取标签列表
tagService.getBySlug(slug)           // 根据 slug 获取标签
tagService.getById(id)               // 根据 ID 获取标签
tagService.getPopular(limit)         // 获取热门标签
tagService.search(query)             // 搜索标签
```

---

## 🎯 类型定义

所有类型定义都在 `services/blog/types.ts` 文件中。

```tsx
import type {
  User,
  Category,
  Tag,
  Post,
  Comment,
  Media,
  PostQueryParams,
  PaginatedResponse,
  PostStats,
} from '@/services/blog/types';
```

---

## 📝 开发指南

### 创建新组件

1. 在相应的目录下创建组件文件
2. 导入必要的依赖
3. 定义 Props 接口
4. 实现组件逻辑
5. 导出组件

```tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface YourComponentProps {
  // 定义你的属性
}

export const YourComponent: React.FC<YourComponentProps> = (props) => {
  return (
    <div className={cn('your-default-classes', props.className)}>
      {/* 你的组件内容 */}
    </div>
  );
};

export default YourComponent;
```

---

## 📄 许可证

MIT License

---

**作者**: Claude (Frontend Architect)
**创建时间**: 2026-03-08
**版本**: 1.0.0
