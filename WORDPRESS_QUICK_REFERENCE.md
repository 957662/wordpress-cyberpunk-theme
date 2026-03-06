# WordPress 集成快速参考

## 📁 文件结构

```
cyberpress-platform/
├── frontend/
│   ├── lib/wordpress/
│   │   ├── client.ts          # WordPress REST API 客户端
│   │   ├── hooks.ts           # React Query Hooks
│   │   ├── helpers.ts         # 数据适配器和辅助函数
│   │   └── index.ts           # 统一导出
│   ├── types/
│   │   └── api.ts             # WordPress API 类型定义
│   └── app/
│       ├── blog-demo/wordpress-integration/page.tsx       # 基础示例
│       └── examples/wordpress-integration-advanced/page.tsx # 高级示例
├── .env.wordpress.example     # 环境变量模板
├── WORDPRESS_INTEGRATION_GUIDE.md  # 集成指南
└── verify-wordpress-integration.sh # 验证脚本
```

## 🚀 快速开始

### 1. 安装和配置

```bash
# 复制环境变量模板
cp .env.wordpress.example .env.local

# 编辑 .env.local
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json
```

### 2. 基本使用

#### 获取文章列表

```tsx
import { usePosts } from '@/lib/wordpress';

function BlogList() {
  const { data: posts, isLoading } = usePosts({
    page: 1,
    perPage: 12,
  });

  if (isLoading) return <div>加载中...</div>;
  return <div>{posts?.map(p => <div key={p.id}>{p.title.rendered}</div>)}</div>;
}
```

#### 获取单篇文章

```tsx
import { usePostBySlug } from '@/lib/wordpress';

function BlogPost({ slug }) {
  const { data: post, isLoading } = usePostBySlug(slug);

  if (isLoading) return <div>加载中...</div>;
  return <article>
    <h1>{post?.title.rendered}</h1>
    <div dangerouslySetInnerHTML={{ __html: post?.content.rendered }} />
  </article>;
}
```

## 🎯 常用 Hooks

### 数据查询

| Hook | 用途 | 示例 |
|------|------|------|
| `usePosts()` | 获取文章列表 | `usePosts({ page: 1, perPage: 10 })` |
| `usePost(id)` | 获取单篇文章 | `usePost(123)` |
| `usePostBySlug(slug)` | 根据 slug 获取文章 | `usePostBySlug('hello-world')` |
| `useCategories()` | 获取分类列表 | `useCategories()` |
| `useTags()` | 获取标签列表 | `useTags()` |
| `useComments()` | 获取评论列表 | `useComments({ post: 123 })` |
| `useSearch(query)` | 搜索内容 | `useSearch('keyword')` |

### 数据变更

| Hook | 用途 | 示例 |
|------|------|------|
| `usePostComment()` | 提交评论 | `mutateAsync({ postId: 1, content: '...' })` |
| `useLogin()` | 用户登录 | `mutateAsync({ username, password })` |
| `useCreatePost()` | 创建文章 | `mutateAsync({ post, token })` |
| `useUpdatePost()` | 更新文章 | `mutateAsync({ id, updates, token })` |
| `useDeletePost()` | 删除文章 | `mutateAsync({ id, token })` |

### 缓存控制

| Hook | 用途 | 示例 |
|------|------|------|
| `usePrefetchPost()` | 预取文章 | `prefetchPost(123)` |
| `useInvalidatePosts()` | 使缓存失效 | `invalidatePosts()` |

## 🛠️ 辅助函数

### 数据适配

```typescript
import { adaptWPPost, adaptWPPosts } from '@/lib/wordpress';

// 转换单篇文章
const post = adaptWPPost(wpPost);

// 批量转换
const posts = adaptWPPosts(wpPosts);
```

### 工具函数

```typescript
import {
  formatPostDate,
  getRelativeTime,
  truncateText,
  stripHtml,
  getExcerpt,
} from '@/lib/wordpress';

// 格式化日期
formatPostDate('2024-03-07', 'long'); // "2024年03月07日"

// 相对时间
getRelativeTime('2024-03-07'); // "3天前"

// 截取文本
truncateText('长文本...', 100); // "长文本..."

// 清理 HTML
stripHtml('<p>Hello</p>'); // "Hello"

// 获取摘要
getExcerpt(content, 160); // 提取160字符摘要
```

## 📊 WordPress API 端点

| 端点 | 方法 | 用途 |
|------|------|------|
| `/wp/v2/posts` | GET | 获取文章列表 |
| `/wp/v2/posts/{id}` | GET | 获取单篇文章 |
| `/wp/v2/categories` | GET | 获取分类列表 |
| `/wp/v2/tags` | GET | 获取标签列表 |
| `/wp/v2/comments` | GET | 获取评论列表 |
| `/wp/v2/comments` | POST | 提交评论 |
| `/wp/v2/users` | GET | 获取用户列表 |
| `/wp/v2/media` | GET | 获取媒体列表 |
| `/search` | GET | 搜索内容 |
| `/jwt-auth/v1/token` | POST | 获取 JWT token |

## 🎨 示例页面

访问以下 URL 查看完整示例：

- **基础集成**: `/blog-demo/wordpress-integration`
  - 文章列表展示
  - 分类/标签筛选
  - 搜索功能
  - 代码示例

- **高级功能**: `/examples/wordpress-integration-advanced`
  - 评论系统
  - 提交评论
  - 全文搜索
  - 缓存策略

## ⚙️ 配置选项

### 环境变量

```env
# 必需
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json

# 可选
NEXT_PUBLIC_WORDPRESS_API_KEY=your-api-key
NEXT_PUBLIC_JWT_AUTH_URL=https://your-wordpress-site.com/wp-json/jwt-auth/v1
NEXT_PUBLIC_WORDPRESS_SITE_URL=https://your-wordpress-site.com
NEXT_PUBLIC_WORDPRESS_API_TIMEOUT=10000
NEXT_PUBLIC_WORDPRESS_DEBUG=true
```

### React Query 配置

```tsx
import { usePosts } from '@/lib/wordpress';

const { data } = usePosts({
  // API 选项
  page: 1,
  perPage: 10,
}, {
  // Query 选项
  staleTime: 5 * 60 * 1000,     // 5分钟
  gcTime: 10 * 60 * 1000,       // 10分钟
  enabled: true,                // 是否启用
  refetchOnWindowFocus: true,   // 窗口聚焦时重新获取
});
```

## 🐛 调试

### 启用详细日志

```env
NEXT_PUBLIC_WORDPRESS_DEBUG=true
```

### 查看请求日志

打开浏览器控制台，所有 API 请求都会被记录：

```
[WordPress API] GET /wp/v2/posts
[WordPress API] GET /wp/v2/posts/123
```

### React Query DevTools

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {children}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## 💡 最佳实践

### 1. 数据预取

```tsx
import { usePrefetchPost } from '@/lib/wordpress';

function PostList() {
  const prefetchPost = usePrefetchPost();

  return (
    <Link
      href="/blog/post-1"
      onMouseEnter={() => prefetchPost(1)}
    >
      文章标题
    </Link>
  );
}
```

### 2. 错误处理

```tsx
const { data, error, isLoading } = usePosts();

if (error) {
  console.error('加载失败:', error);
  return <ErrorFallback error={error} />;
}
```

### 3. 加载状态

```tsx
const { data, isLoading, isFetching } = usePosts();

return (
  <>
    {isLoading && <Skeleton />}
    {isFetching && !isLoading && <LoadingSpinner />}
    {data && <PostList posts={data} />}
  </>
);
```

### 4. 分页

```tsx
const [page, setPage] = useState(1);
const { data, totalPages } = usePosts({ page });

return (
  <>
    <PostList posts={data} />
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  </>
);
```

## 📚 相关资源

- 📖 [完整集成指南](./WORDPRESS_INTEGRATION_GUIDE.md)
- 📋 [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)
- 📚 [React Query 文档](https://tanstack.com/query/latest)
- 💬 [项目 Issues](https://github.com/957662/wordpress-cyberpunk-theme/issues)

## ❓ 快速故障排除

| 问题 | 解决方案 |
|------|----------|
| CORS 错误 | 在 WordPress 端配置 CORS |
| 401 认证失败 | 检查 API 密钥配置 |
| 数据不更新 | 使缓存失效或刷新页面 |
| 请求超时 | 增加 `API_TIMEOUT` 值 |

---

**最后更新**: 2026-03-07
**版本**: 1.0.0
