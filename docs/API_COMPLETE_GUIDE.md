# 📡 CyberPress API 完整指南

## 🌐 API 概述

CyberPress Platform 提供了一套完整的 RESTful API，用于管理博客内容、用户、评论等核心功能。

## 🔗 基础信息

### Base URLs

- **开发环境**: `http://localhost:8000/api/v1`
- **生产环境**: `https://api.cyberpress.dev/api/v1`
- **测试环境**: `https://api-staging.cyberpress.dev/api/v1`

### 认证方式

```http
Authorization: Bearer <access_token>
```

### 响应格式

所有 API 响应遵循统一格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "errors": null,
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

## 📚 API 目录

### 1. 认证系统 (Authentication)

#### 1.1 用户注册

```http
POST /api/v1/auth/register
```

**请求体**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "display_name": "John Doe"
}
```

**响应** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "display_name": "John Doe",
      "role": "subscriber",
      "created_at": "2026-03-03T10:00:00Z"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "token_type": "bearer",
      "expires_in": 3600
    }
  }
}
```

#### 1.2 用户登录

```http
POST /api/v1/auth/login
```

**请求体**:
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "display_name": "John Doe",
      "avatar_url": "https://cdn.cyberpress.dev/avatars/1.jpg"
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIs...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
      "expires_in": 3600
    }
  }
}
```

#### 1.3 刷新令牌

```http
POST /api/v1/auth/refresh
```

**请求体**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### 1.4 用户登出

```http
POST /api/v1/auth/logout
```

**请求头**:
```http
Authorization: Bearer <access_token>
```

### 2. 文章管理 (Posts)

#### 2.1 获取文章列表

```http
GET /api/v1/posts
```

**查询参数**:
- `page` (integer, default: 1) - 页码
- `per_page` (integer, default: 20, max: 100) - 每页数量
- `status` (string) - 状态筛选: `publish`, `draft`, `pending`
- `category` (string) - 分类 slug
- `tag` (string) - 标签 slug
- `author` (integer) - 作者 ID
- `search` (string) - 搜索关键词
- `sort` (string) - 排序: `date`, `title`, `views`, `likes`
- `order` (string) - 顺序: `asc`, `desc`

**示例请求**:
```http
GET /api/v1/posts?page=1&per_page=10&status=publish&sort=date&order=desc
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "探索 Next.js 14 的新特性",
        "slug": "exploring-nextjs-14-features",
        "excerpt": "Next.js 14 带来了许多激动人心的新特性...",
        "content": "<p>完整的文章内容...</p>",
        "featured_image": "https://cdn.cyberpress.dev/images/1.jpg",
        "author": {
          "id": 1,
          "username": "johndoe",
          "display_name": "John Doe",
          "avatar_url": "https://cdn.cyberpress.dev/avatars/1.jpg"
        },
        "category": {
          "id": 1,
          "name": "技术",
          "slug": "tech"
        },
        "tags": [
          {"id": 1, "name": "Next.js", "slug": "nextjs"},
          {"id": 2, "name": "React", "slug": "react"}
        ],
        "status": "publish",
        "view_count": 1250,
        "like_count": 45,
        "comment_count": 12,
        "is_featured": true,
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z",
        "published_at": "2026-03-01T10:00:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

#### 2.2 获取文章详情

```http
GET /api/v1/posts/{id}
```

或使用 slug:
```http
GET /api/v1/posts/slug/{slug}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "探索 Next.js 14 的新特性",
      "slug": "exploring-nextjs-14-features",
      "excerpt": "Next.js 14 带来了许多激动人心的新特性...",
      "content": "<p>完整的文章内容...</p>",
      "featured_image": "https://cdn.cyberpress.dev/images/1.jpg",
      "author": {
        "id": 1,
        "username": "johndoe",
        "display_name": "John Doe",
        "avatar_url": "https://cdn.cyberpress.dev/avatars/1.jpg",
        "bio": "全栈开发者，热爱技术分享"
      },
      "category": {
        "id": 1,
        "name": "技术",
        "slug": "tech",
        "description": "技术相关文章"
      },
      "tags": [
        {"id": 1, "name": "Next.js", "slug": "nextjs"},
        {"id": 2, "name": "React", "slug": "react"}
      ],
      "related_posts": [
        {"id": 2, "title": "React Server Components", "slug": "react-server-components"}
      ],
      "status": "publish",
      "view_count": 1250,
      "like_count": 45,
      "comment_count": 12,
      "is_featured": true,
      "allow_comments": true,
      "meta": {
        "reading_time": 8,
        "seo_title": "探索 Next.js 14 的新特性 | CyberPress",
        "seo_description": "深入了解 Next.js 14 的新特性...",
        "seo_keywords": ["Next.js", "React", "Web开发"]
      },
      "created_at": "2026-03-01T10:00:00Z",
      "updated_at": "2026-03-01T10:00:00Z",
      "published_at": "2026-03-01T10:00:00Z"
    }
  }
}
```

#### 2.3 创建文章

```http
POST /api/v1/posts
```

**请求头**:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**请求体**:
```json
{
  "title": "探索 Next.js 14 的新特性",
  "content": "完整的文章内容（支持 Markdown）",
  "excerpt": "文章摘要",
  "featured_image": "https://cdn.cyberpress.dev/images/1.jpg",
  "category_id": 1,
  "tags": [1, 2],
  "status": "draft",
  "is_featured": false,
  "allow_comments": true,
  "meta": {
    "seo_title": "自定义 SEO 标题",
    "seo_description": "自定义 SEO 描述"
  }
}
```

**响应** (201 Created):
```json
{
  "success": true,
  "data": {
    "post": {
      "id": 1,
      "title": "探索 Next.js 14 的新特性",
      "slug": "exploring-nextjs-14-features",
      "status": "draft",
      "created_at": "2026-03-03T10:00:00Z"
    }
  }
}
```

#### 2.4 更新文章

```http
PUT /api/v1/posts/{id}
```

**请求头**:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

**请求体**: (与创建文章相同，所有字段可选)

#### 2.5 删除文章

```http
DELETE /api/v1/posts/{id}
```

**请求头**:
```http
Authorization: Bearer <access_token>
```

**响应** (200 OK):
```json
{
  "success": true,
  "message": "文章已删除"
}
```

### 3. 分类管理 (Categories)

#### 3.1 获取分类列表

```http
GET /api/v1/categories
```

**查询参数**:
- `parent_id` (integer) - 父分类 ID
- `hide_empty` (boolean) - 隐藏空分类
- `include` (string) - 包含的字段

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "技术",
        "slug": "tech",
        "description": "技术相关文章",
        "parent_id": null,
        "post_count": 45,
        "children": [
          {
            "id": 5,
            "name": "前端开发",
            "slug": "frontend",
            "post_count": 20
          }
        ],
        "created_at": "2026-03-01T10:00:00Z"
      }
    ]
  }
}
```

#### 3.2 创建分类

```http
POST /api/v1/categories
```

**请求体**:
```json
{
  "name": "设计",
  "slug": "design",
  "description": "设计与创意相关",
  "parent_id": null
}
```

### 4. 标签管理 (Tags)

#### 4.1 获取标签列表

```http
GET /api/v1/tags
```

**查询参数**:
- `search` (string) - 搜索标签
- `sort` (string) - 排序: `name`, `count`
- `hide_empty` (boolean) - 隐藏未使用的标签

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": 1,
        "name": "Next.js",
        "slug": "nextjs",
        "post_count": 25
      },
      {
        "id": 2,
        "name": "React",
        "slug": "react",
        "post_count": 38
      }
    ]
  }
}
```

### 5. 评论系统 (Comments)

#### 5.1 获取文章评论

```http
GET /api/v1/posts/{post_id}/comments
```

**查询参数**:
- `page` (integer) - 页码
- `per_page` (integer) - 每页数量
- `parent_id` (integer) - 父评论 ID（获取回复）
- `sort` (string) - 排序: `date`, `likes`

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": 1,
        "post_id": 1,
        "parent_id": null,
        "author": {
          "id": 2,
          "username": "janedoe",
          "display_name": "Jane Doe",
          "avatar_url": "https://cdn.cyberpress.dev/avatars/2.jpg"
        },
        "content": "很棒的文章！学到了很多。",
        "like_count": 5,
        "created_at": "2026-03-02T15:30:00Z",
        "replies": [
          {
            "id": 2,
            "content": "感谢你的评论！",
            "author": {
              "username": "johndoe",
              "display_name": "John Doe"
            },
            "created_at": "2026-03-02T16:00:00Z"
          }
        ]
      }
    ]
  }
}
```

#### 5.2 创建评论

```http
POST /api/v1/posts/{post_id}/comments
```

**请求体**:
```json
{
  "content": "很棒的文章！",
  "parent_id": null
}
```

**注意**: 未登录用户需要提供额外的 `author_name` 和 `author_email`。

### 6. 搜索功能 (Search)

#### 6.1 全文搜索

```http
GET /api/v1/search
```

**查询参数**:
- `q` (string, required) - 搜索关键词
- `type` (string) - 搜索类型: `all`, `posts`, `users`, `tags`
- `page` (integer) - 页码
- `per_page` (integer) - 每页数量

**示例**:
```http
GET /api/v1/search?q=Next.js&type=posts&page=1
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "results": {
      "posts": [
        {
          "type": "post",
          "id": 1,
          "title": "探索 Next.js 14 的新特性",
          "excerpt": "匹配的摘要...",
          "url": "/posts/exploring-nextjs-14-features"
        }
      ],
      "users": [],
      "tags": [
        {
          "type": "tag",
          "id": 1,
          "name": "Next.js",
          "slug": "nextjs",
          "url": "/tags/nextjs"
        }
      ]
    },
    "meta": {
      "total_results": 15,
      "search_time": "0.05s"
    }
  }
}
```

### 7. 用户管理 (Users)

#### 7.1 获取用户信息

```http
GET /api/v1/users/{id}
```

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "display_name": "John Doe",
      "bio": "全栈开发者，热爱技术分享",
      "avatar_url": "https://cdn.cyberpress.dev/avatars/1.jpg",
      "role": "author",
      "stats": {
        "post_count": 45,
        "comment_count": 120,
        "follower_count": 250,
        "following_count": 180
      },
      "social_links": {
        "github": "https://github.com/johndoe",
        "twitter": "https://twitter.com/johndoe"
      },
      "created_at": "2026-01-01T10:00:00Z"
    }
  }
}
```

#### 7.2 更新用户信息

```http
PUT /api/v1/users/me
```

**请求头**:
```http
Authorization: Bearer <access_token>
```

**请求体**:
```json
{
  "display_name": "John Doe",
  "bio": "新的个人简介",
  "avatar_url": "https://cdn.cyberpress.dev/avatars/new.jpg"
}
```

#### 7.3 修改密码

```http
PUT /api/v1/users/me/password
```

**请求体**:
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!"
}
```

### 8. 作品集 (Portfolios)

#### 8.1 获取作品列表

```http
GET /api/v1/portfolios
```

**查询参数**:
- `status` (string) - 状态: `completed`, `in-progress`, `planned`
- `technology` (string) - 技术栈筛选
- `author_id` (integer) - 作者 ID

**响应** (200 OK):
```json
{
  "success": true,
  "data": {
    "portfolios": [
      {
        "id": 1,
        "title": "E-Commerce Platform",
        "slug": "e-commerce-platform",
        "description": "一个功能完整的电商平台",
        "featured_image": "https://cdn.cyberpress.dev/projects/1.jpg",
        "status": "completed",
        "technologies": ["Next.js", "PostgreSQL", "Stripe"],
        "links": {
          "demo": "https://demo.example.com",
          "github": "https://github.com/johndoe/e-commerce",
          "external": null
        },
        "start_date": "2026-01-01",
        "end_date": "2026-02-28",
        "author": {
          "username": "johndoe",
          "display_name": "John Doe"
        },
        "created_at": "2026-03-01T10:00:00Z"
      }
    ]
  }
}
```

### 9. 媒体管理 (Media)

#### 9.1 上传文件

```http
POST /api/v1/media/upload
```

**请求头**:
```http
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**请求体**:
```
file: [binary]
alt_text: "图片描述"
```

**响应** (201 Created):
```json
{
  "success": true,
  "data": {
    "media": {
      "id": 1,
      "filename": "image-001.jpg",
      "original_name": "photo.jpg",
      "mime_type": "image/jpeg",
      "file_size": 245678,
      "width": 1920,
      "height": 1080,
      "url": "https://cdn.cyberpress.dev/uploads/image-001.jpg",
      "alt_text": "图片描述",
      "created_at": "2026-03-03T10:00:00Z"
    }
  }
}
```

## 🔐 错误处理

### 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求数据验证失败",
    "details": {
      "email": ["邮箱格式不正确"],
      "password": ["密码长度至少8个字符"]
    }
  },
  "timestamp": "2026-03-03T10:00:00Z"
}
```

### 常见错误码

| 状态码 | 错误码 | 描述 |
|--------|--------|------|
| 400 | VALIDATION_ERROR | 请求数据验证失败 |
| 401 | UNAUTHORIZED | 未认证或令牌无效 |
| 403 | FORBIDDEN | 无权限访问 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | CONFLICT | 资源冲突（如用户名已存在） |
| 422 | UNPROCESSABLE_ENTITY | 无法处理的请求 |
| 429 | RATE_LIMIT_EXCEEDED | 请求频率超限 |
| 500 | INTERNAL_ERROR | 服务器内部错误 |

## 🚀 速率限制

- **未认证用户**: 100 请求/小时
- **已认证用户**: 1000 请求/小时
- **管理员**: 无限制

速率限制响应头:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1615724800
```

## 📝 使用示例

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加认证令牌
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 获取文章列表
const getPosts = async (page = 1) => {
  const response = await api.get('/posts', {
    params: { page, per_page: 20 }
  });
  return response.data;
};

// 创建文章
const createPost = async (postData: any) => {
  const response = await api.post('/posts', postData);
  return response.data;
};
```

### Python

```python
import requests

class CyberPressAPI:
    def __init__(self, base_url='http://localhost:8000/api/v1'):
        self.base_url = base_url
        self.token = None

    def set_token(self, token):
        self.token = token

    def _headers(self):
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        return headers

    def get_posts(self, page=1, per_page=20):
        url = f'{self.base_url}/posts'
        params = {'page': page, 'per_page': per_page}
        response = requests.get(url, headers=self._headers(), params=params)
        return response.json()

    def create_post(self, post_data):
        url = f'{self.base_url}/posts'
        response = requests.post(url, headers=self._headers(), json=post_data)
        return response.json()
```

## 🧪 测试

### 使用 Postman Collection

导入以下 Collection 到 Postman:

```json
{
  "info": {
    "name": "CyberPress API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000/api/v1"
    },
    {
      "key": "access_token",
      "value": ""
    }
  ]
}
```

## 📚 相关文档

- [数据库架构](../backend/database/schema/01-er-diagram.md)
- [迁移指南](../backend/database/migrations/MIGRATION_GUIDE.md)
- [部署指南](./DEPLOYMENT_GUIDE.md)

## 🤝 贡献

欢迎提交 API 改进建议和 bug 报告！

---

**最后更新**: 2026-03-03
**API 版本**: v1.0.0
