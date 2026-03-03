# 🚀 CyberPress Platform - 快速入门指南

**欢迎！** 这份指南将帮助你快速开始使用 CyberPress Platform。

---

## 📦 项目概览

CyberPress Platform 是一个基于 **Next.js 14 + WordPress** 的赛博朋克风格博客平台。

### 核心技术栈
- **框架**: Next.js 14.2 (App Router)
- **语言**: TypeScript 5.4
- **样式**: Tailwind CSS 3.4
- **状态管理**: React Hooks + Custom Services
- **后端**: WordPress REST API

---

## 🎯 本次更新内容

### 新增服务层 (3个服务)
✅ `PostService` - 文章管理服务
✅ `CommentService` - 评论管理服务
✅ `SearchService` - 搜索服务

### 新增 React Hooks (2个)
✅ `usePosts` - 文章数据管理
✅ `useSearch` - 搜索功能

### 新增工具函数 (2个)
✅ `formatUtils` - 格式化工具
✅ `validationUtils` - 验证工具

### 新增API路由 (4个)
✅ `/api/categories` - 分类列表
✅ `/api/search/suggestions` - 搜索建议
✅ `/api/posts-new` - 文章列表
✅ `/api/search-new` - 搜索功能

---

## 🏃 快速开始

### 1. 环境准备

确保你的开发环境已安装：
- Node.js >= 18.17
- npm >= 9.0
- Docker & Docker Compose (用于WordPress后端)

### 2. 启动后端 (WordPress)

```bash
cd backend
docker-compose up -d
```

访问 http://localhost:8080 查看WordPress后台

### 3. 配置前端环境变量

创建 `frontend/.env.local`:

```env
# WordPress API 配置
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/wp-json
WP_API_USERNAME=your_username
WP_API_PASSWORD=your_app_password

# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=CyberPress
```

### 4. 安装依赖并启动前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看前端

---

## 💡 使用示例

### 示例 1: 使用 Post Service

```typescript
// app/blog/page.tsx
import { postService } from '@/lib/services/post.service';

export default async function BlogPage() {
  // 获取文章列表
  const { posts, total, totalPages } = await postService.getPosts({
    page: 1,
    per_page: 10,
  });

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title.rendered}</h2>
          <p>{post.excerpt.rendered}</p>
        </article>
      ))}
    </div>
  );
}
```

### 示例 2: 使用 usePosts Hook

```typescript
// components/PostList.tsx
'use client';

import { usePosts } from '@/lib/hooks/usePosts';

export function PostList() {
  const { posts, loading, error, goToPage } = usePosts({
    page: 1,
    per_page: 10,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title.rendered}</h3>
        </div>
      ))}
    </div>
  );
}
```

### 示例 3: 使用搜索功能

```typescript
// components/SearchBar.tsx
'use client';

import { useSearch } from '@/lib/hooks/useSearch';
import { useSearchHistory } from '@/lib/hooks/useSearch';

export function SearchBar() {
  const { query, results, loading, setQuery } = useSearch({
    debounceMs: 300,
  });

  const { history, addToHistory } = useSearchHistory();

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          addToHistory(e.target.value);
        }}
        placeholder="Search posts..."
      />
      {loading && <div>Searching...</div>}
      <ul>
        {results.map(result => (
          <li key={result.id}>
            <a href={result.url}>{result.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 示例 4: 使用格式化工具

```typescript
import { formatDate, formatReadingTime, formatNumber } from '@/lib/utils/format-new';

// 格式化日期
const dateStr = formatDate('2026-03-04'); // "March 4, 2026"

// 格式化阅读时间
const readTime = formatReadingTime(post.content); // "5 min read"

// 格式化数字
const formattedNum = formatNumber(12500); // "12.5K"
```

### 示例 5: 使用验证工具

```typescript
import { isValidEmail, isValidPassword } from '@/lib/utils/validation-new';

// 验证邮箱
const email = 'user@example.com';
if (isValidEmail(email)) {
  console.log('Valid email!');
}

// 验证密码
const password = 'MySecurePass123';
const result = isValidPassword(password);
console.log(result.isValid); // true/false
console.log(result.strength); // 'weak' | 'medium' | 'strong'
console.log(result.errors); // Array of error messages
```

---

## 🎨 组件使用

### PostCard 组件

```typescript
import { PostCard, PostGrid } from '@/components/blog/PostCard.new';

// 单个文章卡片
<PostCard
  post={post}
  variant="default"
  showThumbnail
  showMeta
  showExcerpt
/>

// 文章网格
<PostGrid
  posts={posts}
  columns={3}
  className="mt-8"
/>
```

### PostPagination 组件

```typescript
import { PostPagination } from '@/components/blog/PostPagination';

<PostPagination
  currentPage={1}
  totalPages={10}
  total={100}
  perPage={10}
  onPageChange={(page) => console.log('Page:', page)}
/>
```

---

## 🔧 API 路由使用

### 获取文章列表

```bash
GET /api/posts-new?page=1&per_page=10&categories=1,2
```

响应：
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

### 搜索

```bash
GET /api/search-new?q=react&posts=true&pages=true&limit=10
```

响应：
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "query": "react",
    "count": 5
  }
}
```

### 搜索建议

```bash
GET /api/search/suggestions?q=rea
```

响应：
```json
{
  "success": true,
  "data": ["React", "React Native", "Real-time"]
}
```

---

## 📚 可用的 Hooks

| Hook | 用途 |
|------|------|
| `usePosts` | 文章列表数据管理 |
| `usePost` | 单篇文章数据 |
| `useCategories` | 分类数据 |
| `useTags` | 标签数据 |
| `useLatestPosts` | 最新文章 |
| `useRelatedPosts` | 相关文章 |
| `useSearch` | 搜索功能 |
| `useSearchHistory` | 搜索历史 |
| `useTrendingSearches` | 热门搜索 |

---

## 🛠️ 可用的服务

| Service | 方法 | 用途 |
|---------|------|------|
| `postService` | `getPosts()` | 获取文章列表 |
| `postService` | `getPostBySlug()` | 根据slug获取文章 |
| `postService` | `getPostById()` | 根据ID获取文章 |
| `postService` | `getCategories()` | 获取分类 |
| `postService` | `getTags()` | 获取标签 |
| `postService` | `getLatestPosts()` | 获取最新文章 |
| `postService` | `getPopularPosts()` | 获取热门文章 |
| `postService` | `getRelatedPosts()` | 获取相关文章 |
| `commentService` | `getComments()` | 获取评论 |
| `commentService` | `createComment()` | 创建评论 |
| `searchService` | `search()` | 执行搜索 |
| `searchService` | `getSearchSuggestions()` | 获取搜索建议 |

---

## 🎯 下一步

1. **探索组件库**
   - 查看 `frontend/components/` 目录
   - 阅读组件文档

2. **自定义样式**
   - 修改 `frontend/app/globals.css`
   - 调整 Tailwind 配置

3. **添加新功能**
   - 创建新的服务
   - 添加自定义 Hooks
   - 开发新组件

4. **部署**
   - 构建: `npm run build`
   - 启动: `npm start`

---

## 📖 更多文档

- [项目 README](./README.md)
- [设计系统](./DESIGN-SYSTEM.md)
- [组件文档](./COMPONENTS_QUICK_REFERENCE.md)
- [开发任务](./DEVELOPMENT_TASKS.md)

---

## 🆘 需要帮助？

- 查看 [Issues](https://github.com/your-username/cyberpress-platform/issues)
- 提交 [Pull Request](https://github.com/your-username/cyberpress-platform/pulls)
- 联系: contact@cyberpress.dev

---

**祝你使用愉快！** 🎉

Built with ❤️ by AI Development Team
