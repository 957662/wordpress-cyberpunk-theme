# WordPress 集成指南

本指南将帮助你将 CyberPress Platform 前端与 WordPress 后端集成。

## 📋 目录

- [环境配置](#环境配置)
- [客户端设置](#客户端设置)
- [数据获取](#数据获取)
- [组件使用](#组件使用)
- [常见问题](#常见问题)

## 🔧 环境配置

### 1. 安装依赖

```bash
cd frontend
npm install axios @tanstack/react-query
```

### 2. 配置环境变量

在 `.env.local` 文件中添加：

```env
# WordPress API URL
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json

# WordPress 认证（可选）
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_application_password
```

### 3. WordPress 后端设置

确保你的 WordPress 站点已安装以下插件：

- **JWT Authentication** - 用于 API 认证
- **Custom Post Type UI** - 自定义文章类型
- **ACF Pro** - 自定义字段

## 🔌 客户端设置

### 初始化 WordPress 客户端

在应用启动时初始化客户端：

```typescript
// app/layout.tsx
import { WordPressProvider } from '@/providers/wordpress-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <WordPressProvider>
          {children}
        </WordPressProvider>
      </body>
    </html>
  );
}
```

## 📊 数据获取

### 使用 React Query Hooks

```typescript
// 在组件中使用
import { usePosts, usePost } from '@/lib/wordpress/hooks';

function BlogList() {
  const { data: posts, isLoading, error } = usePosts({
    per_page: 12,
    page: 1,
  });

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorMessage />;

  return (
    <div>
      {posts?.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 服务端渲染

```typescript
// app/blog/page.tsx
import { wpClient } from '@/lib/wordpress/client';

async function getPosts() {
  const posts = await wpClient.getPosts({
    per_page: 12,
    status: 'publish',
  });
  return posts;
}

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogGrid posts={posts} />;
}
```

## 🎨 组件使用

### BlogList 组件

```tsx
import { BlogList } from '@/components/blog';

<BlogList
  posts={posts}
  loading={isLoading}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

### BlogGrid 组件

```tsx
import { BlogGrid } from '@/components/blog';

<BlogGrid
  posts={posts}
  columns={3}
  emptyMessage="暂无文章"
/>
```

### ArticleCard 组件

```tsx
import { ArticleCard } from '@/components/blog';

<ArticleCard
  post={post}
  variant="default"
  showComments={true}
  showLikes={true}
/>
```

## 🛠️ 高级功能

### 搜索功能

```tsx
import { useSearch } from '@/lib/wordpress/hooks';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useSearch(query);

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="搜索文章..."
    />
  );
}
```

### 分类筛选

```tsx
import { useCategories } from '@/lib/wordpress/hooks';

function CategoryFilter() {
  const { data: categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: posts } = usePosts(
    selectedCategory ? { categories: selectedCategory } : undefined
  );

  return (
    <div>
      <select onChange={(e) => setSelectedCategory(Number(e.target.value))}>
        <option value="">所有分类</option>
        {categories?.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    </div>
  );
}
```

## ❓ 常见问题

### Q: 如何处理认证？

A: 使用 JWT 认证：

```typescript
import { createWPClient } from '@/lib/wordpress/client';

const client = createWPClient({
  baseURL: 'https://your-site.com/wp-json',
  auth: {
    username: 'your_username',
    password: 'your_app_password',
  },
});
```

### Q: 如何优化性能？

A: 使用 React Query 的缓存功能：

```typescript
const { data } = usePosts(
  params,
  {
    staleTime: 5 * 60 * 1000, // 5 分钟
    gcTime: 10 * 60 * 1000, // 10 分钟
  }
);
```

### Q: 如何处理错误？

A: 使用错误边界和错误处理：

```typescript
const { data, error, isLoading } = usePosts();

if (error) {
  return <ErrorAlert message="加载失败" />;
}
```

### Q: 如何支持多语言？

A: 使用 WPML 插件并修改 API 端点：

```typescript
const client = createWPClient({
  baseURL: `https://your-site.com/${currentLang}/wp-json`,
});
```

## 📚 更多资源

- [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)
- [React Query 文档](https://tanstack.com/query/latest)
- [Next.js 文档](https://nextjs.org/docs)

---

**最后更新**: 2026-03-07
