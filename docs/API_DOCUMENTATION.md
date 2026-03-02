# CyberPress Platform API 文档

## 概述

CyberPress Platform 提供了一套完整的 RESTful API，用于管理博客内容、用户、评论等功能。

**Base URL:** `http://localhost:3000/api` 或 `https://your-domain.com/api`

**认证方式:** Bearer Token (JWT)

---

## 目录

- [认证](#认证)
- [用户](#用户)
- [文章](#文章)
- [分类](#分类)
- [标签](#标签)
- [评论](#评论)
- [搜索](#搜索)
- [通知](#通知)
- [文件上传](#文件上传)

---

## 认证

大部分 API 需要认证。在请求头中包含 Token：

```http
Authorization: Bearer YOUR_TOKEN_HERE
```

### 获取 Token

**请求:**

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**响应:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com"
    }
  }
}
```

---

## 用户

### 获取当前用户信息

**请求:**

```http
GET /api/user
Authorization: Bearer YOUR_TOKEN
```

**响应:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "author",
    "avatar": "https://...",
    "bio": "User biography",
    "createdAt": "2026-01-01T00:00:00Z"
  }
}
```

### 更新用户信息

**请求:**

```http
PUT /api/user
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "New Name",
  "bio": "New biography",
  "website": "https://example.com"
}
```

### 获取用户设置

**请求:**

```http
GET /api/user/settings
Authorization: Bearer YOUR_TOKEN
```

**响应:**

```json
{
  "success": true,
  "data": {
    "theme": "dark",
    "accentColor": "cyan",
    "language": "zh-CN",
    "emailNotifications": true
  }
}
```

### 更新用户设置

**请求:**

```http
PUT /api/user/settings
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "theme": "dark",
  "accentColor": "cyan",
  "emailNotifications": true
}
```

---

## 文章

### 获取文章列表

**请求:**

```http
GET /api/posts?page=1&per_page=10&status=publish
```

**查询参数:**

| 参数 | 类型 | 描述 |
|------|------|------|
| page | integer | 页码（默认: 1） |
| per_page | integer | 每页数量（默认: 10, 最大: 100） |
| status | string | 状态筛选（publish, draft） |
| category | string | 分类 slug |
| tag | string | 标签 slug |
| search | string | 搜索关键词 |
| orderby | string | 排序（date, views, likes） |
| order | string | 排序方向（asc, desc） |

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "文章标题",
      "slug": "article-slug",
      "excerpt": "文章摘要",
      "content": "文章内容",
      "featuredImage": "https://...",
      "author": {
        "id": 1,
        "name": "作者名"
      },
      "category": {
        "id": 1,
        "name": "分类名",
        "slug": "category-slug"
      },
      "tags": [
        { "id": 1, "name": "标签名", "slug": "tag-slug" }
      ],
      "status": "publish",
      "viewCount": 100,
      "likeCount": 10,
      "commentCount": 5,
      "createdAt": "2026-01-01T00:00:00Z",
      "updatedAt": "2026-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 获取单篇文章

**请求:**

```http
GET /api/posts/{id}
```

或

```http
GET /api/posts/slug/{slug}
```

**响应:** 同上，返回单个文章对象。

### 创建文章

**请求:**

```http
POST /api/posts
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "新文章标题",
  "content": "文章内容",
  "excerpt": "文章摘要",
  "categoryId": 1,
  "tags": [1, 2, 3],
  "status": "draft",
  "featuredImage": "https://..."
}
```

### 更新文章

**请求:**

```http
PUT /api/posts/{id}
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "title": "更新的标题",
  "content": "更新的内容"
}
```

### 删除文章

**请求:**

```http
DELETE /api/posts/{id}
Authorization: Bearer YOUR_TOKEN
```

---

## 分类

### 获取分类列表

**请求:**

```http
GET /api/categories
```

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "分类名",
      "slug": "category-slug",
      "description": "分类描述",
      "parentId": null,
      "postCount": 10,
      "createdAt": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### 创建分类

**请求:**

```http
POST /api/categories
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "新分类",
  "slug": "new-category",
  "description": "分类描述"
}
```

---

## 标签

### 获取标签列表

**请求:**

```http
GET /api/tags?search=keyword
```

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "标签名",
      "slug": "tag-slug",
      "description": "标签描述",
      "postCount": 5
    }
  ]
}
```

---

## 评论

### 获取文章评论

**请求:**

```http
GET /api/posts/{postId}/comments
```

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "author": {
        "name": "评论者",
        "email": "commenter@example.com",
        "avatar": "https://..."
      },
      "content": "评论内容",
      "parentId": null,
      "status": "approved",
      "createdAt": "2026-01-01T00:00:00Z",
      "replies": []
    }
  ]
}
```

### 创建评论

**请求:**

```http
POST /api/posts/{postId}/comments
Content-Type: application/json

{
  "authorName": "评论者",
  "authorEmail": "commenter@example.com",
  "content": "评论内容",
  "parentId": null
}
```

---

## 搜索

### 全文搜索

**请求:**

```http
POST /api/search
Content-Type: application/json

{
  "query": "搜索关键词",
  "types": ["posts", "users"],
  "page": 1,
  "perPage": 10
}
```

**响应:**

```json
{
  "success": true,
  "data": {
    "posts": [...],
    "users": [...]
  },
  "meta": {
    "total": 50,
    "page": 1,
    "perPage": 10
  }
}
```

---

## 文件上传

### 上传图片

**请求:**

```http
POST /api/upload
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

file: [binary]
```

**响应:**

```json
{
  "success": true,
  "data": {
    "url": "https://...",
    "filename": "image.jpg",
    "size": 12345,
    "width": 1920,
    "height": 1080
  }
}
```

---

## 错误响应

所有错误响应遵循以下格式：

```json
{
  "error": "Error Type",
  "message": "Error message",
  "details": {}
}
```

### 常见 HTTP 状态码

| 状态码 | 描述 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 422 | 验证失败 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

---

## 速率限制

API 请求有速率限制：

- **未认证用户:** 60 次/分钟
- **已认证用户:** 300 次/分钟

速率限制信息会在响应头中返回：

```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1640995200
```

---

## 版本控制

当前 API 版本: **v1**

版本通过请求头指定：

```http
API-Version: v1
```

---

## SDK 和库

官方提供以下语言的 SDK：

- **JavaScript/TypeScript:** `@cyberpress/sdk`
- **Python:** `cyberpress-python`
- **PHP:** `cyberpress-php`

安装示例：

```bash
npm install @cyberpress/sdk
```

使用示例：

```typescript
import { CyberPressClient } from '@cyberpress/sdk';

const client = new CyberPressClient({
  baseURL: 'https://your-domain.com/api',
  token: 'YOUR_TOKEN'
});

const posts = await client.posts.list({ page: 1, per_page: 10 });
```

---

## 支持

如有问题，请联系：

- 邮箱: api-support@cyberpress.dev
- 文档: https://docs.cyberpress.dev
- GitHub Issues: https://github.com/cyberpress/platform/issues
