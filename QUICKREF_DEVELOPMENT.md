# 🚀 CyberPress Platform - 开发快速参考

> 项目快速开发参考指南 | 最后更新: 2026-03-07

## 📋 目录

- [项目结构](#项目结构)
- [核心功能](#核心功能)
- [组件使用](#组件使用)
- [API 集成](#api-集成)
- [开发规范](#开发规范)
- [常见问题](#常见问题)

---

## 🏗️ 项目结构

```
cyberpress-platform/
├── frontend/                   # Next.js 前端应用
│   ├── app/                   # App Router 页面
│   │   ├── blog/             # 博客相关页面
│   │   ├── admin/            # 管理后台
│   │   └── auth/             # 认证页面
│   ├── components/            # React 组件
│   │   ├── blog/             # 博客组件 (163个)
│   │   ├── ui/               # 基础 UI 组件
│   │   └── effects/          # 特效组件
│   ├── lib/                   # 工具库
│   │   ├── data/             # 数据获取层
│   │   ├── utils/            # 工具函数
│   │   └── services/         # API 服务
│   ├── hooks/                 # 自定义 Hooks
│   ├── types/                 # TypeScript 类型
│   └── styles/                # 全局样式
├── backend/                    # FastAPI 后端
│   ├── app/                   # 应用代码
│   │   ├── api/              # API 路由
│   │   ├── models/           # 数据模型
│   │   └── services/         # 业务逻辑
│   └── database/              # 数据库
└── docs/                       # 项目文档
```

---

## 🎯 核心功能

### 博客系统

#### 1. 文章列表
```typescript
// 使用服务端组件
import { getPosts } from '@/lib/data/posts';
import { BlogGrid } from '@/components/blog';

export default async function BlogPage() {
  const { posts, pagination } = await getPosts({
    page: 1,
    perPage: 12,
  });
  
  return <BlogGrid posts={posts} />;
}
```

#### 2. 文章详情
```typescript
// 使用自适应组件
import { BlogCardAdaptive } from '@/components/blog';

<BlogCardAdaptive 
  post={postData} 
  variant="featured"
/>
```

#### 3. 分页功能
```typescript
import { Pagination } from '@/components/pagination';

<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={(newPage) => setPage(newPage)}
/>
```

### 数据获取

#### 服务端数据获取
```typescript
import { getPosts, getPostBySlug } from '@/lib/data/posts';

// 获取文章列表
const { posts } = await getPosts({ page: 1 });

// 获取单篇文章
const post = await getPostBySlug('post-slug');
```

#### 客户端数据获取
```typescript
import { usePosts } from '@/hooks/usePosts';

function BlogList() {
  const { posts, loading, error } = usePosts({ page: 1 });
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  
  return <BlogGrid posts={posts} />;
}
```

### 评论系统
```typescript
import { CommentSystem } from '@/components/blog';

<CommentSystem
  postId="123"
  comments={comments}
  onAddComment={handleAddComment}
  currentUser={user}
/>
```

### 分享功能
```typescript
import { ShareButtons } from '@/components/blog';

<ShareButtons
  url="https://example.com/post"
  title="文章标题"
  platforms={['twitter', 'facebook', 'copy']}
/>
```

---

## 🧩 组件使用

### BlogCard
```typescript
import { BlogCardAdaptive } from '@/components/blog';

// 支持多种数据格式
<BlogCardAdaptive
  post={wordpressData}  // WordPress API 数据
  variant="default"      // default | compact | featured
  showExcerpt={true}
  showAuthor={true}
/>
```

### Table
```typescript
import { Table } from '@/components/ui';

const columns: Column<Post>[] = [
  { key: 'title', title: '标题', sortable: true },
  { key: 'date', title: '日期', sortable: true },
  { key: 'status', title: '状态' },
];

<Table
  data={posts}
  columns={columns}
  loading={loading}
  pagination={paginationConfig}
  onRowClick={(post) => router.push(\`/blog/\${post.id}\`)}
/>
```

### Tabs
```typescript
import { Tabs } from '@/components/ui';

const tabs: Tab[] = [
  { id: '1', label: '最新', content: <LatestPosts /> },
  { id: '2', label: '热门', content: <PopularPosts /> },
  { id: '3', label: '精选', content: <FeaturedPosts /> },
];

<Tabs tabs={tabs} variant="line" />
```

---

## 🔌 API 集成

### WordPress REST API

#### 配置
```bash
# .env.local
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json
```

#### 使用
```typescript
import { wpClient } from '@/lib/api/wordpress';

// 获取文章
const posts = await wpClient.getPosts({ page: 1, perPage: 10 });

// 获取单篇文章
const post = await wpClient.getPostById(123);

// 获取分类
const categories = await wpClient.getCategories();
```

### 后端 API

#### 配置
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### 使用
```typescript
import { apiClient } from '@/lib/api/client';

// 获取文章
const { data } = await apiClient.get('/posts');

// 创建文章
const { data } = await apiClient.post('/posts', {
  title: '新文章',
  content: '内容...',
});
```

---

## 📐 开发规范

### 命名规范

#### 文件命名
- 组件文件: `PascalCase.tsx` (例: `BlogCard.tsx`)
- 工具文件: `kebab-case.ts` (例: `date-utils.ts`)
- 类型文件: `*.types.ts` (例: `blog.types.ts`)
- Hook 文件: `use*.ts` (例: `usePosts.ts`)

#### 变量命名
- 组件: `PascalCase`
- 函数: `camelCase`
- 常量: `UPPER_SNAKE_CASE`
- 类型/接口: `PascalCase`

### 代码规范

#### TypeScript
```typescript
// ✅ 推荐
interface BlogPost {
  id: string;
  title: string;
  content: string;
}

async function getPost(id: string): Promise<BlogPost> {
  const response = await fetch(\`/api/posts/\${id}\`);
  return response.json();
}

// ❌ 避免
function getPost(id) {  // 缺少类型
  return fetch('/api/posts/' + id);  // 字符串拼接
}
```

#### React 组件
```typescript
// ✅ 推荐
interface ComponentProps {
  title: string;
  onSubmit: () => void;
}

export function Component({ title, onSubmit }: ComponentProps) {
  return (
    <div className="cyber-card">
      <h1>{title}</h1>
      <button onClick={onSubmit}>提交</button>
    </div>
  );
}

// ❌ 避免
export function Component(props: any) {  // any 类型
  return <div className="bg-white">...</div>;  // 非赛博朋克样式
}
```

### 样式规范

#### Tailwind CSS
```typescript
// ✅ 推荐 - 使用赛博朋克主题
<div className="cyber-card bg-cyber-darker border-cyber-cyan/30 text-white">

// ❌ 避免 - 普通样式
<div className="bg-white border-gray-200 text-black">
```

#### 颜色使用
```typescript
// 主色调
text-cyber-cyan      // 霓虹青
text-cyber-purple    // 赛博紫
text-cyber-pink      // 激光粉
bg-cyber-darker      // 深空黑

// 功能色
text-success         // 成功 (绿色)
text-warning         // 警告 (黄色)
text-error           // 错误 (粉红)
```

---

## 🐛 常见问题

### 1. 导入路径错误

**问题**: `Cannot find module '@/lib/utils'`

**解决**:
```typescript
// ✅ 正确
import { cn } from '@/lib/utils';

// ❌ 错误
import { cn } from '@/lib/utils/cn';
import { cn } from '@/lib/utils/classname';
```

### 2. 类型不匹配

**问题**: BlogPost 类型冲突

**解决**:
```typescript
// ✅ 统一使用 models 中的类型
import type { BlogPost } from '@/types/models/blog';

// ❌ 避免使用其他地方的类型
import type { BlogPost } from '@/types/blog';
import type { BlogPost } from '@/components/blog/types';
```

### 3. 组件 Props 不匹配

**问题**: BlogCard 接收的数据格式不对

**解决**:
```typescript
// ✅ 使用自适应组件
import { BlogCardAdaptive } from '@/components/blog';

<BlogCardAdaptive post={anyDataFormat} />

// ❌ 使用原始组件（需要特定格式）
import { BlogCard } from '@/components/blog';
<BlogCard post={wordpressData} />  // 可能不匹配
```

### 4. 服务端组件错误

**问题**: `use client` 指令丢失

**解决**:
```typescript
// ✅ 服务端页面使用服务端数据获取
import { getPosts } from '@/lib/data/posts';

export default async function BlogPage() {
  const posts = await getPosts();  // 服务端执行
  return <BlogGrid posts={posts} />;
}

// ✅ 客户端交互使用客户端组件
'use client';

import { useState } from 'react';

export function BlogPageClient() {
  const [page, setPage] = useState(1);  // 客户端状态
  // ...
}
```

---

## 📚 相关文档

- [完整文档](./README.md)
- [开发指南](./DEVELOPMENT_GUIDE.md)
- [API 文档](./API_DOCUMENTATION.md)
- [组件文档](./frontend/docs/COMPONENT_INDEX.md)
- [设计系统](./frontend/docs/COLOR_REFERENCE.md)

---

## 🚀 快速命令

```bash
# 前端开发
cd frontend
npm run dev              # 启动开发服务器
npm run build           # 构建生产版本
npm run lint            # 代码检查
npm run type-check      # 类型检查

# 后端开发
cd backend
uvicorn main:app --reload  # 启动开发服务器
pytest tests/               # 运行测试

# Docker
docker-compose up -d     # 启动所有服务
docker-compose logs -f   # 查看日志
```

---

**维护者**: AI Development Team
**更新日期**: 2026-03-07
