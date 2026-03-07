# CyberPress Platform - Integration Guide
# 集成指南

## 📋 目录

1. [WordPress 集成](#wordpress-集成)
2. [后端 API 集成](#后端-api-集成)
3. [前端组件集成](#前端组件集成)
4. [测试配置](#测试配置)
5. [部署配置](#部署配置)

---

## WordPress 集成

### 配置步骤

#### 1. 环境变量配置

在 `frontend/.env.local` 中添加：

```bash
# WordPress API URL
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com

# API 超时设置（毫秒）
NEXT_PUBLIC_WORDPRESS_TIMEOUT=30000

# 启用调试模式（开发环境）
NEXT_PUBLIC_DEBUG=true
```

#### 2. 使用 WordPress Hooks

```typescript
import { usePosts, usePost, useCategories } from '@/lib/wordpress';

// 获取文章列表
function BlogPage() {
  const { data, isLoading, error } = usePosts({
    page: 1,
    perPage: 10,
    orderBy: 'date',
    order: 'desc',
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <Error message={error.message} />;

  return (
    <div>
      {data?.posts.map(post => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// 获取单个文章
function PostPage({ id }) {
  const { data: post, isLoading } = usePost(id);

  if (isLoading) return <LoadingSpinner />;
  if (!post) return <NotFound />;

  return <ArticleDetail post={post} />;
}
```

#### 3. 使用数据适配器

```typescript
import { adaptWordPressPost, adaptWordPressPosts } from '@/lib/wordpress/adapters';

// 单个文章适配
const blogPost = adaptWordPressPost(wpPost);

// 批量适配
const blogPosts = adaptWordPressPosts(wpPosts);
```

---

## 后端 API 集成

### 新增 API 端点

#### 1. WordPress 代理 API

位置：`backend/app/api/wordpress.py`

**端点列表：**
- `GET /api/v1/wordpress/posts` - 获取文章列表
- `GET /api/v1/wordpress/posts/{id}` - 获取单个文章
- `GET /api/v1/wordpress/categories` - 获取分类列表
- `GET /api/v1/wordpress/tags` - 获取标签列表
- `GET /api/v1/wordpress/search` - 搜索内容

**使用示例：**
```bash
# 获取文章列表
curl http://localhost:8000/api/v1/wordpress/posts?page=1&per_page=10

# 搜索文章
curl http://localhost:8000/api/v1/wordpress/search?query=technology
```

#### 2. 统计分析 API

位置：`backend/app/api/analytics.py`

**端点列表：**
- `POST /api/v1/analytics/events/track` - 记录事件
- `POST /api/v1/analytics/events/pageview` - 记录页面浏览
- `GET /api/v1/analytics/posts/{id}/stats` - 获取文章统计
- `GET /api/v1/analytics/dashboard/overview` - 获取仪表盘概览

#### 3. 推荐系统 API

位置：`backend/app/api/recommendations.py`

**端点列表：**
- `POST /api/v1/recommendations/` - 获取个性化推荐
- `GET /api/v1/recommendations/posts/{id}/related` - 获取相关文章
- `GET /api/v1/recommendations/trending` - 获取热门文章

### 集成到路由

在 `backend/app/api/routes.py` 中添加：

```python
from app.api import wordpress, analytics, recommendations

api_router.include_router(wordpress.router)
api_router.include_router(analytics.router)
api_router.include_router(recommendations.router)
```

---

## 前端组件集成

### 使用博客组件

#### 1. BlogList 组件

```typescript
import { BlogList } from '@/components/blog';

function BlogPage() {
  const [page, setPage] = useState(1);
  const { data } = usePosts({ page });

  return (
    <BlogList
      posts={data?.posts || []}
      loading={isLoading}
      currentPage={page}
      totalPages={data?.totalPages || 0}
      totalItems={data?.total || 0}
      onPageChange={setPage}
    />
  );
}
```

#### 2. BlogGrid 组件

```typescript
import { BlogGrid } from '@/components/blog';

function BlogGridPage() {
  return (
    <BlogGrid
      posts={posts}
      columns={3}
      loading={isLoading}
    />
  );
}
```

#### 3. BlogSearch 组件

```typescript
import { BlogSearch } from '@/components/blog';

function SearchPage() {
  const handleSearch = (query: string) => {
    // 执行搜索
  };

  return (
    <BlogSearch
      onSearch={handleSearch}
      placeholder="搜索文章..."
      debounce={300}
    />
  );
}
```

---

## 测试配置

### 前端测试

#### 1. 安装测试依赖

```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

#### 2. 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test blog-components.test.tsx

# 监听模式
npm test -- --watch

# 生成覆盖率报告
npm test -- --coverage
```

### 后端测试

#### 1. 安装测试依赖

```bash
cd backend
pip install pytest pytest-asyncio pytest-cov httpx
```

#### 2. 运行测试

```bash
# 运行所有测试
pytest

# 运行特定测试文件
pytest tests/test_api.py

# 生成覆盖率报告
pytest --cov=app --cov-report=html

# 详细输出
pytest -v
```

---

## 部署配置

### 环境变量

#### 前端 (`.env.production`)

```bash
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

#### 后端 (`.env.production`)

```bash
DATABASE_URL=postgresql://user:password@localhost/dbname
WORDPRESS_URL=https://your-wordpress-site.com
CORS_ORIGINS=["https://yourdomain.com"]
SECRET_KEY=your-secret-key
DEBUG=False
```

### Docker 部署

#### 1. 构建镜像

```bash
# 构建前端
docker build -t cyberpress-frontend ./frontend

# 构建后端
docker build -t cyberpress-backend ./backend
```

#### 2. 使用 Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 生产环境检查清单

- [ ] 更新所有环境变量
- [ ] 配置数据库连接
- [ ] 设置 CORS 策略
- [ ] 启用 HTTPS
- [ ] 配置 CDN（可选）
- [ ] 设置日志记录
- [ ] 配置备份策略
- [ ] 启用监控
- [ ] 运行测试套件
- [ ] 性能优化检查

---

## 故障排除

### 常见问题

#### 1. CORS 错误

**问题：** 前端无法访问后端 API

**解决方案：**
```python
# backend/app/core/config.py
CORS_ORIGINS = [
    "http://localhost:3000",
    "https://yourdomain.com",
]
```

#### 2. WordPress 连接超时

**问题：** WordPress API 请求超时

**解决方案：**
```typescript
// frontend/config/wordpress-integration.config.ts
export const wordpressConfig = {
  timeout: 60000, // 增加到 60 秒
  retry: {
    attempts: 5,
    delay: 2000,
  },
};
```

#### 3. 测试失败

**问题：** 测试无法运行

**解决方案：**
```bash
# 清理缓存
rm -rf node_modules/.cache
rm -rf frontend/.next

# 重新安装依赖
npm install

# 检查配置
npm run type-check
```

---

## 性能优化建议

### 前端优化

1. **启用代码分割**
```typescript
const BlogPage = dynamic(() => import('./BlogPage'), {
  loading: () => <LoadingSpinner />,
});
```

2. **图片优化**
```typescript
import Image from 'next/image';

<Image
  src={post.coverImage}
  alt={post.title}
  width={800}
  height={600}
  loading="lazy"
/>
```

3. **缓存策略**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});
```

### 后端优化

1. **数据库查询优化**
```python
# 使用索引
# 批量查询
# 缓存结果
```

2. **API 响应优化**
```python
# 使用分页
# 压缩响应
# CDN 集成
```

---

## 支持

如有问题，请查看：
- [项目文档](./README.md)
- [API 文档](./API_DOCUMENTATION.md)
- [开发指南](./DEVELOPMENT_GUIDE.md)

---

**最后更新：** 2026-03-07
**版本：** 1.0.0
