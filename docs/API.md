# CyberPress Platform - API 文档

**版本**: 1.0.0  
**更新日期**: 2026-03-03

---

## 📡 基础信息

### Base URL
- **开发环境**: `http://localhost:8000/api`
- **生产环境**: `https://api.cyberpress.dev`

### 认证方式
使用 JWT Bearer Token 认证：

```http
Authorization: Bearer <access_token>
```

### 响应格式

#### 成功响应
```json
{
  "data": { ... },
  "message": "Success"
}
```

#### 错误响应
```json
{
  "error": true,
  "message": "Error description",
  "status_code": 400
}
```

---

## 🔐 认证 API

### 用户注册

```http
POST /api/auth/register
Content-Type: application/json
```

**请求体**:
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "full_name": "string (optional)"
}
```

**响应**:
```json
{
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "full_name": "string",
    "role": "admin|editor|author|subscriber"
  },
  "tokens": {
    "access_token": "string",
    "refresh_token": "string",
    "expires_in": 3600,
    "token_type": "Bearer"
  }
}
```

### 用户登录

```http
POST /api/auth/login
Content-Type: application/json
```

**请求体**:
```json
{
  "username": "string",
  "password": "string"
}
```

**响应**: 同注册响应

### 刷新令牌

```http
POST /api/auth/refresh
Content-Type: application/json
```

**请求体**:
```json
{
  "refresh_token": "string"
}
```

**响应**:
```json
{
  "access_token": "string",
  "expires_in": 3600
}
```

### 用户登出

```http
POST /api/auth/logout
Content-Type: application/json
Authorization: Bearer <token>
```

**请求体**:
```json
{
  "refresh_token": "string"
}
```

---

## 👤 用户 API

### 获取当前用户

```http
GET /api/users/me
Authorization: Bearer <token>
```

**响应**:
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "full_name": "string",
  "role": "string",
  "avatar": "string",
  "bio": "string",
  "created_at": "ISO 8601"
}
```

### 更新用户资料

```http
PATCH /api/users/me
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "full_name": "string",
  "bio": "string",
  "avatar": "string"
}
```

### 修改密码

```http
POST /api/users/me/change-password
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "current_password": "string",
  "new_password": "string"
}
```

---

## 📝 文章 API

### 获取文章列表

```http
GET /api/posts
```

**查询参数**:
- `page` (number, 默认: 1)
- `per_page` (number, 默认: 10, 最大: 100)
- `status` (string: draft|published|archived)
- `category` (string)
- `tag` (string)
- `search` (string)
- `sort` (string: created_at|updated_at|view_count|like_count)
- `order` (string: asc|desc)

**示例**:
```http
GET /api/posts?page=1&per_page=10&status=published&sort=created_at&order=desc
```

**响应**:
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "excerpt": "string",
      "content": "string",
      "featured_image": "string",
      "author": {
        "id": "string",
        "username": "string",
        "avatar": "string"
      },
      "categories": [...],
      "tags": [...],
      "status": "published",
      "view_count": 0,
      "comment_count": 0,
      "like_count": 0,
      "is_featured": false,
      "published_at": "ISO 8601",
      "created_at": "ISO 8601",
      "updated_at": "ISO 8601"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 10,
    "total_pages": 10
  }
}
```

### 获取单篇文章

```http
GET /api/posts/{slug}
```

**响应**: 同文章对象

### 创建文章

```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "title": "string",
  "content": "string",
  "excerpt": "string",
  "featured_image": "string",
  "category_ids": ["string"],
  "tag_ids": ["string"],
  "status": "draft|published",
  "allow_comments": true
}
```

### 更新文章

```http
PATCH /api/posts/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**: 同创建文章

### 删除文章

```http
DELETE /api/posts/{id}
Authorization: Bearer <token>
```

### 点赞文章

```http
POST /api/posts/{id}/like
Authorization: Bearer <token>
```

### 取消点赞

```http
DELETE /api/posts/{id}/like
Authorization: Bearer <token>
```

---

## 💬 评论 API

### 获取文章评论

```http
GET /api/posts/{post_id}/comments
```

**查询参数**:
- `page` (number, 默认: 1)
- `per_page` (number, 默认: 20)
- `parent_id` (string, 获取嵌套评论)
- `sort` (string: created_at|like_count)

**响应**:
```json
{
  "data": [
    {
      "id": "string",
      "content": "string",
      "author": {
        "id": "string",
        "username": "string",
        "avatar": "string"
      },
      "parent_id": "string|null",
      "status": "approved|pending|rejected",
      "like_count": 0,
      "created_at": "ISO 8601",
      "updated_at": "ISO 8601",
      "replies": []
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "per_page": 20
  }
}
```

### 创建评论

```http
POST /api/posts/{post_id}/comments
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "content": "string",
  "parent_id": "string (optional)"
}
```

### 更新评论

```http
PATCH /api/comments/{id}
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "content": "string"
}
```

### 删除评论

```http
DELETE /api/comments/{id}
Authorization: Bearer <token>
```

---

## 📁 分类 API

### 获取分类列表

```http
GET /api/categories
```

**响应**:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "icon": "string",
      "color": "string",
      "parent_id": "string|null",
      "post_count": 0
    }
  ]
}
```

### 创建分类

```http
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "name": "string",
  "description": "string",
  "icon": "string",
  "color": "string",
  "parent_id": "string (optional)"
}
```

---

## 🏷️ 标签 API

### 获取标签列表

```http
GET /api/tags
```

**查询参数**:
- `search` (string)
- `sort` (string: name|created_at|post_count)

**响应**:
```json
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "color": "string",
      "post_count": 0
    }
  ]
}
```

### 创建标签

```http
POST /api/tags
Authorization: Bearer <token>
Content-Type: application/json
```

**请求体**:
```json
{
  "name": "string",
  "description": "string",
  "color": "string"
}
```

---

## 🎨 作品集 API

### 获取作品集列表

```http
GET /api/portfolio
```

**查询参数**:
- `page` (number)
- `per_page` (number)
- `author` (string)
- `featured` (boolean)

**响应**:
```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "description": "string",
      "featured_image": "string",
      "project_url": "string",
      "github_url": "string",
      "technologies": ["string"],
      "author": {
        "id": "string",
        "username": "string"
      },
      "is_featured": false,
      "published_at": "ISO 8601"
    }
  ]
}
```

### 创建作品

```http
POST /api/portfolio
Authorization: Bearer <token>
Content-Type: application/json
```

---

## 🔍 搜索 API

### 全文搜索

```http
GET /api/search
```

**查询参数**:
- `q` (string, 必需)
- `type` (string: posts|comments|users|all)
- `page` (number)
- `per_page` (number)

**示例**:
```http
GET /api/search?q=react&type=posts&page=1
```

**响应**:
```json
{
  "query": "react",
  "results": {
    "posts": { "data": [...], "total": 10 },
    "comments": { "data": [...], "total": 5 },
    "users": { "data": [...], "total": 2 }
  },
  "total": 17
}
```

---

## 📊 统计 API

### 获取文章统计

```http
GET /api/stats/posts
Authorization: Bearer <token>
```

**响应**:
```json
{
  "total": 100,
  "published": 80,
  "drafts": 20,
  "this_month": 10,
  "popular": [...]
}
```

### 获取用户统计

```http
GET /api/stats/users
Authorization: Bearer <token>
```

---

## 🔔 通知 API

### 获取通知列表

```http
GET /api/notifications
Authorization: Bearer <token>
```

**响应**:
```json
{
  "data": [
    {
      "id": "string",
      "type": "comment|like|follow|mention",
      "title": "string",
      "content": "string",
      "read": false,
      "created_at": "ISO 8601"
    }
  ],
  "unread_count": 5
}
```

### 标记已读

```http
POST /api/notifications/{id}/read
Authorization: Bearer <token>
```

### 标记全部已读

```http
POST /api/notifications/read-all
Authorization: Bearer <token>
```

---

## ⚡ Rate Limiting

API 请求限制：
- 匿名用户: 100 请求/小时
- 认证用户: 1000 请求/小时

响应头包含限制信息：
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

---

## 🔧 WebSocket API

### 连接

```
wss://api.cyberpress.dev/ws
Authorization: Bearer <token>
```

### 消息格式

#### 客户端 → 服务器
```json
{
  "type": "subscribe",
  "channel": "posts",
  "data": {}
}
```

#### 服务器 → 客户端
```json
{
  "type": "post_created",
  "channel": "posts",
  "data": { ... }
}
```

### 可用频道
- `posts` - 文章更新
- `comments` - 评论通知
- `notifications` - 用户通知
- `stats` - 实时统计

---

## 📁 文件上传

### 上传图片

```http
POST /api/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求体**:
```
file: <binary>
type: "image|video|document"
```

**响应**:
```json
{
  "id": "string",
  "filename": "string",
  "url": "string",
  "size": 1024000,
  "mime_type": "image/jpeg",
  "width": 1920,
  "height": 1080
}
```

---

## 🌙 国际化

支持语言：
- `zh-CN` - 简体中文
- `en-US` - English

设置语言：
```http
GET /api/posts?lang=zh-CN
Accept-Language: zh-CN
```

---

## 📄 分页

所有列表接口支持分页，响应格式：

```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 10,
    "total_pages": 10,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## 🐛 错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 429 | 请求过于频繁 |
| 500 | 服务器错误 |
| 503 | 服务维护中 |

---

## 📝 更新日志

### v1.0.0 (2026-03-03)
- 初始版本发布
- 完整的 REST API
- WebSocket 支持
- JWT 认证
- 文件上传

---

**最后更新**: 2026-03-03  
**文档版本**: 1.0.0
