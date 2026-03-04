# CyberPress API Reference

WordPress REST API 集成文档

## 基础信息

### API Base URL

```
http://localhost:8080/wp-json
```

### 认证

CyberPress 使用 JWT (JSON Web Token) 进行认证。

#### 获取 Token

```http
POST /wp-json/jwt-auth/v1/token
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

响应：

```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user_email": "admin@cyberpress.dev",
  "user_nicename": "admin",
  "user_display_name": "admin"
}
```

#### 使用 Token

```http
GET /wp-json/wp/v2/posts
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

## 端点

### Posts (文章)

#### 获取文章列表

```http
GET /wp/v2/posts
```

查询参数：

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| page | int | 1 | 页码 |
| per_page | int | 10 | 每页数量 |
| search | string | - | 搜索关键词 |
| categories | int | - | 分类 ID |
| tags | int | - | 标签 ID |
| orderby | string | date | 排序方式 |
| order | string | desc | 排序方向 |
| _embed | bool | false | 嵌入关联数据 |

示例：

```http
GET /wp/v2/posts?per_page=10&page=1&_embed=true
```

响应：

```json
[
  {
    "id": 1,
    "date": "2024-03-01T10:00:00",
    "slug": "hello-world",
    "link": "http://localhost:8080/hello-world",
    "title": { "rendered": "Hello World" },
    "content": { "rendered": "<p>Welcome...</p>" },
    "excerpt": { "rendered": "<p>Welcome...</p>" },
    "author": 1,
    "featured_media": 0,
    "categories": [1],
    "tags": [1, 2],
    "_embedded": {
      "wp:featuredmedia": [{ ... }],
      "wp:term": [[...], [...]]
    }
  }
]
```

#### 获取单篇文章

```http
GET /wp/v2/posts/{id}
```

或通过 slug：

```http
GET /wp/v2/posts?slug={slug}
```

### Categories (分类)

#### 获取分类列表

```http
GET /wp/v2/categories
```

查询参数：

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| per_page | int | 10 | 每页数量 |
| hide_empty | bool | true | 隐藏空分类 |
| parent | int | 0 | 父分类 ID |

响应：

```json
[
  {
    "id": 1,
    "name": "Technology",
    "slug": "technology",
    "description": "Tech articles",
    "count": 42,
    "parent": 0,
    "link": "http://localhost:8080/category/technology"
  }
]
```

#### 获取单个分类

```http
GET /wp/v2/categories/{id}
```

### Tags (标签)

#### 获取标签列表

```http
GET /wp/v2/tags
```

查询参数：

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| per_page | int | 10 | 每页数量 |
| hide_empty | bool | true | 隐藏空标签 |

响应：

```json
[
  {
    "id": 1,
    "name": "JavaScript",
    "slug": "javascript",
    "description": "JS articles",
    "count": 15,
    "link": "http://localhost:8080/tag/javascript"
  }
]
```

### Media (媒体)

#### 获取媒体列表

```http
GET /wp/v2/media
```

查询参数：

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| per_page | int | 10 | 每页数量 |
| search | string | - | 搜索关键词 |
| media_type | string | all | 媒体类型 |

响应：

```json
[
  {
    "id": 1,
    "date": "2024-03-01T10:00:00",
    "slug": "image-1",
    "link": "http://localhost:8080/image-1",
    "title": { "rendered": "Image 1" },
    "alt_text": "Alt text",
    "media_type": "image",
    "mime_type": "image/jpeg",
    "source_url": "http://localhost:8080/wp-content/uploads/2024/03/image.jpg",
    "media_details": {
      "width": 1920,
      "height": 1080,
      "file": "image.jpg",
      "sizes": {
        "thumbnail": { "source_url": "...", "width": 150, "height": 150 },
        "medium": { "source_url": "...", "width": 300, "height": 169 }
      }
    }
  }
]
```

#### 获取单个媒体

```http
GET /wp/v2/media/{id}
```

### Users (用户)

#### 获取用户列表

```http
GET /wp/v2/users
```

查询参数：

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| per_page | int | 10 | 每页数量 |
| search | string | - | 搜索关键词 |

响应：

```json
[
  {
    "id": 1,
    "name": "admin",
    "url": "",
    "description": "Administrator",
    "link": "http://localhost:8080/author/admin",
    "slug": "admin",
    "avatar_urls": {
      "24": "https://secure.gravatar.com/avatar/...?s=24",
      "48": "https://secure.gravatar.com/avatar/...?s=48",
      "96": "https://secure.gravatar.com/avatar/...?s=96"
    }
  }
]
```

#### 获取单个用户

```http
GET /wp/v2/users/{id}
```

### Comments (评论)

#### 获取文章评论

```http
GET /wp/v2/comments
```

查询参数：

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| post | int | - | 文章 ID |
| per_page | int | 10 | 每页数量 |
| order | string | asc | 排序方向 |

响应：

```json
[
  {
    "id": 1,
    "post": 1,
    "parent": 0,
    "author": 1,
    "author_name": "admin",
    "author_email": "admin@example.com",
    "date": "2024-03-01T10:00:00",
    "content": { "rendered": "<p>Great article!</p>" },
    "link": "http://localhost:8080/hello-world/#comment-1"
  }
]
```

#### 创建评论

```http
POST /wp/v2/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "post": 1,
  "content": "Great article!",
  "author": "John Doe",
  "author_email": "john@example.com"
}
```

## 分页

API 使用 `Link` 头来提供分页信息：

```http
Link: <http://localhost:8080/wp-json/wp/v2/posts?page=2>; rel="next",
      <http://localhost:8080/wp-json/wp/v2/posts?page=1>; rel="prev"
```

响应头：

| 头 | 描述 |
|-----|------|
| X-WP-Total | 总记录数 |
| X-WP-TotalPages | 总页数 |

## 嵌入 (Embedding)

使用 `_embed` 参数获取关联数据：

```http
GET /wp/v2/posts?_embed
```

可嵌入的资源：

- `wp:featuredmedia` - 特色图片
- `wp:term` - 分类和标签
- `wp:author` - 作者信息
- `replies` - 评论

## 错误处理

### 错误响应格式

```json
{
  "code": "rest_post_invalid_id",
  "message": "Invalid post ID.",
  "data": { "status": 404 }
}
```

### HTTP 状态码

| 代码 | 描述 |
|------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 未找到 |
| 500 | 服务器错误 |

## 限流

默认限制：

- 认证用户：1000 requests/hour
- 未认证用户：100 requests/hour

响应头：

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1709654400
```

## 缓存

使用 `Cache-Control` 头：

```http
Cache-Control: max-age=3600, must-revalidate
```

推荐缓存时间：

- 文章列表：5 分钟
- 单篇文章：1 小时
- 分类/标签：1 天
- 媒体：30 天

## TypeScript 类型

```typescript
interface WPPost {
  id: number
  date: string
  slug: string
  link: string
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  author: number
  featured_media: number
  categories: number[]
  tags: number[]
  _embedded?: {
    'wp:featuredmedia'?: WPMedia[]
    'wp:term'?: WPTerm[][]
    'author'?: WPUser[]
  }
}

interface WPCategory {
  id: number
  name: string
  slug: string
  description: string
  count: number
  parent: number
}

interface WPTag {
  id: number
  name: string
  slug: string
  description: string
  count: number
}

interface WPMedia {
  id: number
  date: string
  slug: string
  link: string
  title: { rendered: string }
  alt_text: string
  media_type: string
  mime_type: string
  source_url: string
  media_details: {
    width: number
    height: number
    sizes?: Record<string, {
      source_url: string
      width: number
      height: number
    }>
  }
}

interface WPUser {
  id: number
  name: string
  url: string
  description: string
  link: string
  slug: string
  avatar_urls: Record<string, string>
}
```

## 客户端使用

### React Query

```typescript
import { useQuery } from '@tanstack/react-query'
import { wpClient } from '@/lib/wordpress/client'

export function usePosts(page = 1) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => wpClient.getPosts({ page, perPage: 10 }),
    staleTime: 5 * 60 * 1000, // 5 分钟
  })
}
```

### Axios

```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/wp-json',
})

export async function getPosts() {
  const { data } = await api.get('/wp/v2/posts', {
    params: { _embed: true, per_page: 10 }
  })
  return data
}
```

### Fetch

```typescript
export async function getPosts() {
  const response = await fetch(
    'http://localhost:8080/wp-json/wp/v2/posts?_embed=true&per_page=10'
  )
  return response.json()
}
```

## 最佳实践

1. **缓存策略**
   - 使用 React Query 缓存数据
   - 设置合理的 `staleTime`
   - 使用 `revalidateOnFocus` 保持数据新鲜

2. **错误处理**
   - 优雅处理 API 错误
   - 显示用户友好的错误信息
   - 实现重试机制

3. **性能优化**
   - 使用 `_embed` 减少请求
   - 实现请求去重
   - 使用 ISR 预渲染页面

4. **安全性**
   - 验证所有输入
   - 使用 HTTPS
   - 限制请求频率

## 相关资源

- [WP REST API Handbook](https://developer.wordpress.org/rest-api/)
- [JWT Authentication](https://wordpress.org/plugins/jwt-authentication/)
- [React Query Documentation](https://tanstack.com/query/latest)
