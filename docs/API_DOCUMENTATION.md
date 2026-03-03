# API 文档

## 概述

CyberPress Platform 提供完整的 RESTful API，支持前端应用与后端服务的交互。

---

## 基础信息

- **Base URL**: `http://localhost:8000/api/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 认证 API

### 用户注册

```http
POST /api/v1/auth/register
```

**请求体：**
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "full_name": "string (optional)"
}
```

**响应：**
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "full_name": "string",
  "role": "user",
  "created_at": "2026-03-03T00:00:00Z"
}
```

### 用户登录

```http
POST /api/v1/auth/login
```

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**响应：**
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "bearer"
}
```

### 刷新令牌

```http
POST /api/v1/auth/refresh
```

**请求体：**
```json
{
  "refresh_token": "string"
}
```

### 用户登出

```http
POST /api/v1/auth/logout
```

**Headers：**
```
Authorization: Bearer {access_token}
```

---

## 文章 API

### 获取文章列表

```http
GET /api/v1/posts
```

**查询参数：**
- `page`: 页码（默认: 1）
- `per_page`: 每页数量（默认: 10）
- `category`: 分类 ID
- `tag`: 标签 ID
- `search`: 搜索关键词
- `sort`: 排序方式（date, views, likes）
- `order`: 排序方向（asc, desc）

**响应：**
```json
{
  "items": [
    {
      "id": 1,
      "title": "string",
      "slug": "string",
      "excerpt": "string",
      "content": "string",
      "status": "published",
      "author": {
        "id": 1,
        "username": "string",
        "full_name": "string"
      },
      "category": {
        "id": 1,
        "name": "string",
        "slug": "string"
      },
      "tags": [
        {
          "id": 1,
          "name": "string",
          "slug": "string"
        }
      ],
      "featured_image": "string",
      "view_count": 0,
      "like_count": 0,
      "published_at": "2026-03-03T00:00:00Z",
      "created_at": "2026-03-03T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "per_page": 10,
  "pages": 10
}
```

### 获取单篇文章

```http
GET /api/v1/posts/{id}
```

**路径参数：**
- `id`: 文章 ID 或 slug

### 创建文章

```http
POST /api/v1/posts
```

**Headers：**
```
Authorization: Bearer {access_token}
```

**请求体：**
```json
{
  "title": "string",
  "content": "string",
  "excerpt": "string (optional)",
  "category_id": 1,
  "tag_ids": [1, 2, 3],
  "featured_image": "string (optional)",
  "status": "draft"
}
```

### 更新文章

```http
PUT /api/v1/posts/{id}
```

### 删除文章

```http
DELETE /api/v1/posts/{id}
```

---

## 评论 API

### 获取评论列表

```http
GET /api/v1/comments
```

**查询参数：**
- `post_id`: 文章 ID
- `page`: 页码
- `per_page`: 每页数量

### 创建评论

```http
POST /api/v1/comments
```

**请求体：**
```json
{
  "post_id": 1,
  "author_name": "string",
  "author_email": "user@example.com",
  "content": "string",
  "parent_id": 1 (optional)
}
```

---

## 分类 API

### 获取所有分类

```http
GET /api/v1/categories
```

### 获取单个分类

```http
GET /api/v1/categories/{id}
```

---

## 标签 API

### 获取所有标签

```http
GET /api/v1/tags
```

### 获取单个标签

```http
GET /api/v1/tags/{id}
```

---

## 搜索 API

### 全文搜索

```http
GET /api/v1/search
```

**查询参数：**
- `q`: 搜索关键词
- `type`: 内容类型（post, project, page）
- `page`: 页码
- `per_page`: 每页数量

**响应：**
```json
{
  "results": [
    {
      "type": "post",
      "id": 1,
      "title": "string",
      "excerpt": "string",
      "url": "/posts/1",
      "highlights": {
        "title": "搜索高亮标题",
        "content": "搜索高亮内容..."
      },
      "relevance": 0.95
    }
  ],
  "total": 50,
  "page": 1,
  "per_page": 10
}
```

---

## WebSocket API

### 连接

```
ws://localhost:8000/ws
```

### 消息格式

**客户端消息：**
```json
{
  "type": "message_type",
  "data": {},
  "timestamp": 1679012345678
}
```

**服务端消息：**
```json
{
  "type": "message_type",
  "data": {},
  "timestamp": 1679012345678,
  "id": "unique_message_id"
}
```

### 消息类型

- `comment.new`: 新评论通知
- `comment.update`: 评论更新通知
- `notification`: 系统通知
- `user.online`: 用户上线
- `user.offline`: 用户下线

---

## 错误响应

**标准错误响应：**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {}
  }
}
```

**常见错误码：**
- `400`: 请求参数错误
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `422`: 验证错误
- `500`: 服务器错误

---

## 分页

所有列表 API 支持分页：

**请求头：**
```
X-Page: 1
X-Per-Page: 10
```

**响应头：**
```
X-Total: 100
X-Total-Pages: 10
X-Current-Page: 1
X-Per-Page: 10
```

---

## 速率限制

- 每个用户每分钟最多 60 个请求
- 匿名用户每分钟最多 30 个请求

**速率限制响应头：**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1679012345
```

---

## API 版本

当前 API 版本: `v1`

旧版本仍然可用，但建议使用最新版本。

---

## SDK 和客户端库

### JavaScript/TypeScript

```bash
npm install @cyberpress/api-client
```

```typescript
import { CyberPressAPI } from '@cyberpress/api-client'

const api = new CyberPressAPI({
  baseURL: 'http://localhost:8000/api/v1',
  token: 'your-access-token'
})

const posts = await api.posts.list()
```

### Python

```bash
pip install cyberpress-python
```

```python
from cyberpress import CyberPressAPI

api = CyberPressAPI(
    base_url='http://localhost:8000/api/v1',
    token='your-access-token'
)

posts = api.posts.list()
```

---

## 联系方式

- API 问题反馈: [GitHub Issues](https://github.com/cyberpress/platform/issues)
- 邮箱: api@cyberpress.dev

---

*最后更新: 2026-03-03*
