# 🔌 WordPress API 集成指南

本文档详细介绍如何使用 WordPress REST API 与 CyberPress Platform 进行数据交互。

---

## 📚 目录

- [快速开始](#快速开始)
- [配置](#配置)
- [API 客户端](#api-客户端)
- [数据获取](#数据获取)
- [类型定义](#类型定义)
- [最佳实践](#最佳实践)
- [故障排查](#故障排查)

---

## 快速开始

### 1. 环境配置

在 `frontend/.env.local` 中配置 WordPress API 地址：

```env
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
```

### 2. 测试连接

```bash
curl http://localhost:8080/wp-json/wp/v2/posts
```

如果返回 JSON 数据，说明连接成功！

---

## 配置

### 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `NEXT_PUBLIC_WP_API_URL` | WordPress REST API 基础 URL | `http://localhost:8080/wp-json` |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL | `http://localhost:3000` |

### WordPress 插件要求

确保安装以下 WordPress 插件：

1. **REST API** - WordPress 4.7+ 内置
2. **CORS** - 允许跨域请求
3. **JWT Authentication** - API 认证（可选）

---

## API 客户端

### 基础用法

CyberPress 提供了封装好的 WordPress API 客户端：

```tsx
import { wpClient } from '@/lib/wordpress/client';

// 获取文章列表
const posts = await wpClient.getPosts({
  page: 1,
  perPage: 10
});

// 获取单篇文章
const post = await wpClient.getPost(123);

// 通过 slug 获取文章
const post = await wpClient.getPostBySlug('hello-world');

// 获取分类
const categories = await wpClient.getCategories();

// 获取标签
const tags = await wpClient.getTags();
```

---

## 数据获取

### 使用 React Query

项目使用 TanStack Query (React Query) 进行数据管理：

```tsx
import { usePosts, usePostBySlug } from '@/lib/hooks/useWordPress';

function BlogList() {
  const { data, isLoading, error } = usePosts({
    page: 1,
    perPage: 10
  });

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div>
      {data?.data.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 服务端渲染

在服务端组件中直接调用：

```tsx
// app/blog/page.tsx
import { wpClient } from '@/lib/wordpress/client';

export default async function BlogPage() {
  const posts = await wpClient.getPosts({
    page: 1,
    perPage: 10,
    _embed: true
  });

  return <BlogList posts={posts.data} />;
}
```

### 客户端渲染

在客户端组件中使用 Hooks：

```tsx
'use client';

import { usePosts } from '@/lib/hooks/useWordPress';

export default function BlogListClient() {
  const { data, isLoading } = usePosts();

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* 渲染数据 */}</div>;
}
```

---

## API 方法

### getPosts

获取文章列表。

```tsx
interface GetPostsOptions {
  page?: number;          // 页码 (默认: 1)
  perPage?: number;       // 每页数量 (默认: 10)
  categories?: number[];  // 分类 ID 数组
  tags?: number[];        // 标签 ID 数组
  search?: string;        // 搜索关键词
  orderBy?: 'date' | 'title' | 'id';  // 排序字段 (默认: 'date')
  order?: 'asc' | 'desc'; // 排序方向 (默认: 'desc')
  _embed?: boolean;       // 是否嵌入关联数据 (默认: true)
}

const result = await wpClient.getPosts(options);
// 返回: { data: WPPost[], total: number, totalPages: number, page: number }
```

#### 示例

```tsx
// 获取第一页的 10 篇文章
const posts = await wpClient.getPosts();

// 获取分类 1 下的文章
const posts = await wpClient.getPosts({
  categories: [1]
});

// 搜索文章
const posts = await wpClient.getPosts({
  search: 'Next.js'
});

// 按标题排序
const posts = await wpClient.getPosts({
  orderBy: 'title',
  order: 'asc'
});
```

### getPost

获取单篇文章。

```tsx
const post = await wpClient.getPost(
  postId,    // 文章 ID
  true       // 是否嵌入关联数据 (可选)
);
```

### getPostBySlug

通过文章 slug 获取文章。

```tsx
const post = await wpClient.getPostBySlug('hello-world');
```

### getCategories

获取分类列表。

```tsx
interface GetCategoriesOptions {
  hideEmpty?: boolean;  // 是否隐藏空分类 (默认: true)
}

const categories = await wpClient.getCategories({
  hideEmpty: true
});
```

### getTags

获取标签列表。

```tsx
const tags = await wpClient.getTags({
  hideEmpty: true
});
```

### getUser

获取用户信息。

```tsx
const user = await wpClient.getUser(userId);
```

### search

搜索文章、页面等。

```tsx
const results = await wpClient.search('关键词', 'post');
```

---

## 类型定义

### WPPost

```tsx
interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
      avatar_urls?: {
        [size: string]: string;
      };
    }>;
  };
}
```

### WPCategory

```tsx
interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}
```

### WPTag

```tsx
interface WPTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}
```

---

## 工具函数

### 提取纯文本

```tsx
import { extractPlainText } from '@/lib/wordpress/posts';

const text = extractPlainText(post);
```

### 计算阅读时间

```tsx
import { calculateReadTime } from '@/lib/wordpress/posts';

const minutes = calculateReadTime(post);
```

### 获取特色图片

```tsx
import { getFeaturedImage } from '@/lib/wordpress/posts';

const imageUrl = getFeaturedImage(post);
```

### 获取作者名称

```tsx
import { getAuthorName } from '@/lib/wordpress/posts';

const author = getAuthorName(post);
```

### 格式化日期

```tsx
import { formatDate } from '@/lib/wordpress/posts';

const dateStr = formatDate(post.date);
// 输出: "2024年3月2日"
```

---

## 最佳实践

### 1. 使用 React Query

```tsx
// ✅ 推荐
const { data } = usePosts();

// ❌ 不推荐
const [posts, setPosts] = useState([]);
useEffect(() => {
  wpClient.getPosts().then(setPosts);
}, []);
```

### 2. 启用嵌入数据

```tsx
// ✅ 推荐 - 一次请求获取所有数据
const posts = await wpClient.getPosts({ _embed: true });

// ❌ 不推荐 - 多次请求
const posts = await wpClient.getPosts();
for (const post of posts) {
  const author = await wpClient.getUser(post.author);
}
```

### 3. 错误处理

```tsx
const { data, error, isLoading } = usePosts();

if (isLoading) return <LoadingSpinner />;
if (error) {
  return (
    <Alert variant="danger">
      加载失败: {error.message}
    </Alert>
  );
}
```

### 4. 分页处理

```tsx
function BlogList() {
  const [page, setPage] = useState(1);
  const { data } = usePosts({ page });

  return (
    <>
      <BlogList posts={data?.data || []} />
      <Pagination
        currentPage={page}
        totalPages={data?.totalPages || 1}
        onPageChange={setPage}
      />
    </>
  );
}
```

### 5. 搜索防抖

```tsx
import { useDebounce } from '@/lib/hooks/useDebounce';

function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const { data } = usePosts({
    search: debouncedQuery
  });

  return <input onChange={(e) => setQuery(e.target.value)} />;
}
```

---

## 故障排查

### CORS 错误

**问题**: 浏览器控制台显示 CORS 错误

**解决方案**:

1. 安装 WordPress CORS 插件
2. 或在 WordPress 中添加以下代码到 `functions.php`:

```php
add_action('rest_api_init', function() {
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
  header('Access-Control-Allow-Headers: Authorization, Content-Type');
});
```

### 404 错误

**问题**: API 返回 404

**解决方案**:

1. 检查 WordPress REST API 是否启用
2. 检查 URL 是否正确
3. 确认永久链接设置

```bash
# 测试 API 是否可访问
curl http://localhost:8080/wp-json
```

### 数据不完整

**问题**: 文章数据缺少特色图片或分类

**解决方案**:

使用 `_embed` 参数获取关联数据：

```tsx
const posts = await wpClient.getPosts({ _embed: true });
```

### 性能问题

**问题**: 页面加载缓慢

**解决方案**:

1. 使用服务端渲染
2. 启用 React Query 缓存
3. 减少 `perPage` 数量
4. 使用图片优化

```tsx
// 服务端组件
export default async function Page() {
  const posts = await wpClient.getPosts({ perPage: 6 });
  return <BlogList posts={posts.data} />;
}
```

---

## 📚 相关资源

- [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)
- [TanStack Query 文档](https://tanstack.com/query/latest)
- [React Query WordPress 示例](https://github.com/WordPress/gutenberg/tree/trunk/packages/react-query-source)

---

<div align="center">

**Need help?** [提交 Issue](https://github.com/your-username/cyberpress-platform/issues)

</div>
