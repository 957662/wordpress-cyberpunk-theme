# API 使用指南

## 概述

CyberPress Platform 提供了完整的 RESTful API，用于管理博客文章、用户、评论等内容。

## 基础信息

- **Base URL**: `http://localhost:8000/api/v1`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON

## 认证

### 1. 用户注册

```http
POST /auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "displayName": "John Doe"
}
```

**响应**:

```json
{
  "user": {
    "id": "user_123",
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. 用户登录

```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### 3. 刷新令牌

```http
POST /auth/refresh
Content-Type: application/json
Authorization: Bearer <refresh_token>

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 博客文章

### 1. 获取文章列表

```http
GET /posts?page=1&pageSize=12&category=tech&sortBy=latest
Authorization: Bearer <token>
```

**查询参数**:
- `page`: 页码（默认：1）
- `pageSize`: 每页数量（默认：12，最大：100）
- `category`: 分类筛选
- `tag`: 标签筛选
- `search`: 搜索关键词
- `sortBy`: 排序方式（latest, popular, trending）

### 2. 获取单篇文章

```http
GET /posts/{slug}
Authorization: Bearer <token>
```

### 3. 创建文章

```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content...",
  "excerpt": "Short description...",
  "featuredImage": "https://example.com/image.jpg",
  "categories": ["tech", "programming"],
  "tags": ["javascript", "react"],
  "status": "published"
}
```

### 4. 更新文章

```http
PUT /posts/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### 5. 删除文章

```http
DELETE /posts/{id}
Authorization: Bearer <token>
```

## 评论

### 1. 获取文章评论

```http
GET /comments/posts/{post_id}?page=1&pageSize=20
```

### 2. 创建评论

```http
POST /comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": "post_123",
  "content": "Great article!",
  "parentId": "comment_456"  // 可选，用于回复评论
}
```

### 3. 更新评论

```http
PUT /comments/{comment_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment..."
}
```

### 4. 删除评论

```http
DELETE /comments/{comment_id}
Authorization: Bearer <token>
```

## 点赞

### 1. 点赞文章

```http
POST /likes/{post_id}
Authorization: Bearer <token>
```

### 2. 取消点赞

```http
DELETE /likes/{post_id}
Authorization: Bearer <token>
```

### 3. 检查是否已点赞

```http
GET /likes/{post_id}/check
Authorization: Bearer <token>
```

**响应**:

```json
{
  "is_liked": true
}
```

## 收藏

### 1. 创建收藏

```http
POST /bookmarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "postId": "post_123",
  "notes": "Useful reference"
}
```

### 2. 获取收藏列表

```http
GET /bookmarks?page=1&limit=20
Authorization: Bearer <token>
```

### 3. 删除收藏

```http
DELETE /bookmarks/{bookmark_id}
Authorization: Bearer <token>
```

## 通知

### 1. 获取通知列表

```http
GET /notifications?page=1&limit=20&unreadOnly=true
Authorization: Bearer <token>
```

### 2. 获取通知统计

```http
GET /notifications/stats
Authorization: Bearer <token>
```

**响应**:

```json
{
  "total": 50,
  "unread": 5
}
```

### 3. 标记为已读

```http
PUT /notifications/{notification_id}/read
Authorization: Bearer <token>
```

### 4. 全部标记为已读

```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

## 用户

### 1. 获取用户资料

```http
GET /users/{username}
```

### 2. 更新用户资料

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "John Doe",
  "bio": "Web developer",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 3. 关注用户

```http
POST /users/{user_id}/follow
Authorization: Bearer <token>
```

### 4. 取消关注

```http
DELETE /users/{user_id}/follow
Authorization: Bearer <token>
```

## 错误处理

API 使用标准 HTTP 状态码：

- `200 OK`: 请求成功
- `201 Created`: 资源创建成功
- `400 Bad Request`: 请求参数错误
- `401 Unauthorized`: 未授权
- `403 Forbidden`: 禁止访问
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器错误

**错误响应格式**:

```json
{
  "message": "Error message",
  "detail": "Detailed error description",
  "code": "ERROR_CODE"
}
```

## 速率限制

API 实施了速率限制：

- **默认**: 100 请求 / 60 秒
- **认证用户**: 200 请求 / 60 秒

超过限制将返回 `429 Too Many Requests` 状态码。

## 分页

所有列表端点都支持分页：

```http
GET /posts?page=2&pageSize=20
```

**响应**:

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 2,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

## WebSocket 实时通知

连接 WebSocket 以接收实时通知：

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/notifications?token=<jwt_token>');

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log('New notification:', notification);
};
```

## SDK 使用

### JavaScript/TypeScript

```typescript
import { blogApi, userApi } from '@/lib/api';

// 获取文章
const posts = await blogApi.getPosts({
  page: 1,
  category: 'tech'
});

// 创建文章
const newPost = await blogApi.createPost({
  title: 'New Post',
  content: 'Content...'
});

// 用户登录
const auth = await userApi.login({
  email: 'user@example.com',
  password: 'password'
});
```

### Python

```python
from cyberpress_client import CyberPressClient

client = CyberPressClient(
    base_url='http://localhost:8000/api/v1',
    token='your-jwt-token'
)

# 获取文章
posts = client.posts.list(page=1, category='tech')

# 创建文章
new_post = client.posts.create(
    title='New Post',
    content='Content...'
)
```

## 更多信息

- [API 文档](http://localhost:8000/docs) - Swagger UI
- [API 参考](./API_REFERENCE.md) - 详细的 API 参考
- [示例代码](./EXAMPLES.md) - 代码示例
