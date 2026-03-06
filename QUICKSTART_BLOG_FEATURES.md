# 博客功能快速开始指南

> **创建日期**: 2026-03-06
> **版本**: 1.0.0

---

## 📦 新增功能概览

本次更新为 CyberPress Platform 添加了完整的博客功能，包括：

- ✅ 统一的博客 API 服务
- ✅ 认证和授权系统
- ✅ 评论系统 API
- ✅ 增强的博客列表页面
- ✅ 文章元数据和标签组件
- ✅ 数据转换工具库

---

## 🚀 快速开始

### 1. 配置环境变量

在 `frontend/.env.local` 中添加：

```bash
# WordPress API 地址
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2

# 应用 API 地址（如果使用自定义后端）
NEXT_PUBLIC_API_URL=https://your-api.com/api
```

### 2. 使用博客 API

```typescript
// 导入博客 API 服务
import {
  getPosts,
  getPostBySlug,
  getCategories,
  getTags
} from '@/services/api/blog-api.service';

// 获取文章列表
const { posts, totalPages, totalPosts } = await getPosts({
  page: 1,
  per_page: 10,
  categories: [1, 2],
  tags: [5, 10]
});

// 根据 slug 获取文章
const post = await getPostBySlug('my-article-slug');

// 获取分类列表
const categories = await getCategories({ per_page: 100 });

// 获取标签列表
const tags = await getTags({ per_page: 100 });
```

### 3. 使用增强版博客页面

直接访问 `/blog/page-enhanced` 或复制以下代码到你的页面：

```typescript
'use client';

import { BlogPageEnhanced } from '@/app/(public)/blog/page-enhanced';

export default function BlogPage() {
  return <BlogPageEnhanced />;
}
```

### 4. 使用文章组件

#### ArticleMetaDisplay - 文章元数据

```typescript
import { ArticleMetaDisplay } from '@/components/blog';

<ArticleMetaDisplay
  author={{
    id: 1,
    name: 'John Doe',
    avatar: '/images/avatar.jpg',
    slug: 'john-doe'
  }}
  date="2024-03-06T10:00:00"
  readingTime={5}
  category={{
    id: 1,
    name: 'Technology',
    slug: 'technology'
  }}
  views={1234}
  showAuthor
  showDate
  showReadingTime
  showCategory
  showViews
/>
```

#### ArticleTags - 文章标签

```typescript
import { ArticleTags, ArticleTagCloud } from '@/components/blog';

// 基础标签
<ArticleTags
  tags={[
    { id: 1, name: 'React', slug: 'react', count: 10 },
    { id: 2, name: 'TypeScript', slug: 'typescript', count: 8 }
  ]}
  variant="default"
  size="md"
/>

// 标签云
<ArticleTagCloud
  tags={tags}
  maxTags={50}
/>

// 标签选择器（用于筛选）
<ArticleTagSelector
  tags={tags}
  selectedTags={[1, 2]}
  onTagToggle={(tagId) => console.log('Toggle:', tagId)}
/>
```

### 5. 使用工具函数

```typescript
import {
  transformWordPressPost,
  calculateReadingTime,
  generateShareLinks,
  getPostUrl
} from '@/lib/blog-utils';

// 转换 WordPress 数据为应用层数据
const article = transformWordPressPost(wordPressPost);

// 计算阅读时间
const time = calculateReadingTime(postContent);
// 返回: 5 (分钟)

// 生成社交分享链接
const shareLinks = generateShareLinks(
  '文章标题',
  'https://example.com/article',
  '文章描述'
);
// 返回: { twitter: '...', facebook: '...', ... }

// 生成文章 URL
const url = getPostUrl('my-article-slug');
// 返回: /blog/my-article-slug
```

---

## 📚 完整示例

### 创建一个简单的博客列表页面

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { getPosts } from '@/services/api/blog-api.service';
import { BlogListUnified } from '@/components/blog';
import { LoadingState } from '@/components/blog';
import { PaginationControls } from '@/components/pagination';

export default function MyBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await getPosts({
        page: currentPage,
        per_page: 10
      });
      setPosts(response.posts);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div>
      <BlogListUnified posts={posts} />

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={10}
          totalItems={posts.length}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
```

### 创建一个文章详情页面

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPostBySlug } from '@/services/api/blog-api.service';
import { ArticleMetaDisplay, ArticleTags } from '@/components/blog';
import { LoadingState } from '@/components/blog';

export default function ArticleDetailPage() {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [params.slug]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const postData = await getPostBySlug(params.slug);
      setPost(postData);
    } catch (error) {
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!post) {
    return <div>文章不存在</div>;
  }

  return (
    <article>
      <h1>{post.title.rendered}</h1>

      <ArticleMetaDisplay
        author={{
          id: post.author,
          name: post._embedded?.author?.[0]?.name
        }}
        date={post.date}
        readingTime={5}
        category={post._embedded?.['wp:term']?.[0]?.[0]}
      />

      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

      <ArticleTags
        tags={post._embedded?.['wp:term']?.[1] || []}
      />
    </article>
  );
}
```

---

## 🔧 高级用法

### 自定义 API 配置

```typescript
import { blogApiService } from '@/services/api/blog-api.service';

// 设置自定义配置
blogApiService.baseUrl = 'https://custom-api.com';
blogApiService.cacheTimeout = 10 * 60 * 1000; // 10分钟

// 清除缓存
blogApiService.clearCache();
```

### 使用认证 API

```typescript
import {
  login,
  logout,
  getCurrentUser
} from '@/services/api/auth-api.service';

// 登录
const result = await login({
  username: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  console.log('登录成功', result.user);
}

// 获取当前用户
const user = await getCurrentUser();
if (user) {
  console.log('当前用户:', user);
}

// 登出
await logout();
```

### 使用评论 API

```typescript
import {
  getComments,
  createComment,
  likeComment
} from '@/services/api/comment-api.service';

// 获取文章评论
const { comments, total } = await getComments(postId, {
  page: 1,
  per_page: 20
});

// 创建评论
const result = await createComment({
  postId: 123,
  content: '这是一条评论',
  parentId: undefined // 如果是回复评论，传入父评论 ID
});

// 点赞评论
await likeComment(commentId);
```

---

## 🎨 样式定制

所有组件都使用 Tailwind CSS，可以通过以下方式定制：

### 1. 使用 className

```typescript
<ArticleMetaDisplay
  className="custom-meta-style"
  // ...其他 props
/>
```

### 2. 修改配置文件

编辑 `frontend/config/blog.config.ts`:

```typescript
export const BLOG_CONFIG = {
  pagination: {
    defaultPageSize: 20, // 修改默认每页文章数
  },
  article: {
    excerptLength: 200, // 修改摘要长度
  },
  // ...
};
```

### 3. 使用 Tailwind 配置

编辑 `frontend/tailwind.config.ts` 添加自定义颜色：

```typescript
export default {
  theme: {
    extend: {
      colors: {
        'blog-primary': '#your-color',
        // ...
      }
    }
  }
}
```

---

## 🐛 故障排除

### 问题：API 调用失败

**解决方案**：
1. 检查环境变量是否正确设置
2. 确认 WordPress API 端点可访问
3. 检查 CORS 配置

### 问题：组件样式不正确

**解决方案**：
1. 确保已安装 Tailwind CSS
2. 运行 `npm run dev` 重启开发服务器
3. 清除浏览器缓存

### 问题：类型错误

**解决方案**：
1. 运行 `npm run type-check` 检查类型
2. 确保所有导入路径正确
3. 检查 TypeScript 配置

---

## 📖 更多资源

- [完整 API 文档](./API_DOCUMENTATION.md)
- [组件文档](./frontend/docs/COMPONENT_INDEX.md)
- [项目配置](./PROJECT_SETUP.md)
- [开发指南](./DEVELOPMENT_TASKS.md)

---

## 📝 更新日志

### 2026-03-06
- ✨ 添加统一的博客 API 服务
- ✨ 添加认证和评论 API
- ✨ 创建增强版博客列表页面
- ✨ 添加文章元数据和标签组件
- ✨ 添加数据转换工具库
- 📝 编写完整文档

---

**需要帮助？** 查看 [完整文档](./CREATION_REPORT_2026-03-06.md) 或提交 Issue。
