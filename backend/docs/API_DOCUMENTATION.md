# CyberPress Platform API Documentation

> 📅 Generated: 2026-03-05
> 🤖 AI Development Team

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Response Format](#response-format)
5. [Error Codes](#error-codes)
6. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#users)
   - [Posts](#posts)
   - [Categories](#categories)
   - [Tags](#tags)
   - [Comments](#comments)
   - [Social](#social)
   - [Notifications](#notifications)
   - [Media](#media)
7. [Rate Limiting](#rate-limiting)
8. [Webhooks](#webhooks)

---

## Overview

CyberPress Platform RESTful API provides complete access to all platform features including user management, blog posts, social features, and more.

**Base URL**: `http://localhost:8000/api/v1` (development)

**API Version**: v1

---

## Authentication

Most endpoints require authentication using JWT (JSON Web Token).

### How to Get Token

```bash
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### Using the Token

Include the token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Response Format

All API responses follow this standard format:

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 422 | Request validation failed |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## API Endpoints

### Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "full_name": "John Doe",
      "created_at": "2026-03-05T10:00:00Z"
    },
    "access_token": "eyJhbGci...",
    "token_type": "bearer"
  }
}
```

#### Login

```http
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Refresh Token

```http
POST /api/v1/auth/refresh
```

**Headers:**
```
Authorization: Bearer <access_token>
```

#### Logout

```http
POST /api/v1/auth/logout
```

**Headers:**
```
Authorization: Bearer <access_token>
```

---

### Users

#### Get Current User

```http
GET /api/v1/users/me
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "bio": "Software developer",
    "avatar": "https://example.com/avatar.jpg",
    "location": "San Francisco",
    "website": "https://johndoe.com",
    "followers_count": 150,
    "following_count": 75,
    "posts_count": 42,
    "created_at": "2026-01-01T00:00:00Z"
  }
}
```

#### Update Profile

```http
PUT /api/v1/users/me
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "bio": "Software developer and blogger",
  "location": "San Francisco, CA",
  "website": "https://johndoe.com"
}
```

#### Get User by ID

```http
GET /api/v1/users/{user_id}
```

#### Get User Posts

```http
GET /api/v1/users/{user_id}/posts?page=1&per_page=10
```

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `per_page` (integer): Items per page (default: 10, max: 100)

---

### Posts

#### List Posts

```http
GET /api/v1/posts?page=1&per_page=20&status=published
```

**Query Parameters:**
- `page` (integer): Page number
- `per_page` (integer): Items per page
- `status` (string): Filter by status (published, draft, scheduled)
- `category` (string): Filter by category slug
- `tag` (string): Filter by tag slug
- `author` (string): Filter by author ID
- `search` (string): Search in title and content
- `sort` (string): Sort by (date, views, likes)
- `order` (string): Order direction (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "My First Post",
        "slug": "my-first-post",
        "excerpt": "This is an excerpt...",
        "content": "<p>Full content here...</p>",
        "cover_image": "https://example.com/cover.jpg",
        "author": {
          "id": "uuid",
          "username": "johndoe",
          "full_name": "John Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "category": {
          "id": "uuid",
          "name": "Technology",
          "slug": "technology"
        },
        "tags": [
          { "id": "uuid", "name": "JavaScript", "slug": "javascript" }
        ],
        "status": "published",
        "views": 1250,
        "likes_count": 45,
        "comments_count": 12,
        "published_at": "2026-03-01T10:00:00Z",
        "created_at": "2026-02-28T15:30:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

#### Get Post by Slug

```http
GET /api/v1/posts/{slug}
```

#### Create Post

```http
POST /api/v1/posts
```

**Request Body:**
```json
{
  "title": "My New Post",
  "content": "<p>Post content here...</p>",
  "excerpt": "Short excerpt",
  "cover_image": "https://example.com/cover.jpg",
  "category_id": "uuid",
  "tags": ["uuid1", "uuid2"],
  "status": "draft",
  "published_at": "2026-03-06T10:00:00Z"
}
```

#### Update Post

```http
PUT /api/v1/posts/{post_id}
```

#### Delete Post

```http
DELETE /api/v1/posts/{post_id}
```

#### Like Post

```http
POST /api/v1/posts/{post_id}/like
```

#### Unlike Post

```http
DELETE /api/v1/posts/{post_id}/like
```

---

### Categories

#### List Categories

```http
GET /api/v1/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Technology",
        "slug": "technology",
        "description": "Tech-related posts",
        "posts_count": 45,
        "parent_id": null
      }
    ]
  }
}
```

#### Get Category by Slug

```http
GET /api/v1/categories/{slug}
```

#### Create Category

```http
POST /api/v1/categories
```

**Request Body:**
```json
{
  "name": "Technology",
  "slug": "technology",
  "description": "Tech-related posts",
  "parent_id": null
}
```

---

### Tags

#### List Tags

```http
GET /api/v1/tags
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "uuid",
        "name": "JavaScript",
        "slug": "javascript",
        "posts_count": 23
      }
    ]
  }
}
```

#### Get Tag by Slug

```http
GET /api/v1/tags/{slug}
```

#### Create Tag

```http
POST /api/v1/tags
```

**Request Body:**
```json
{
  "name": "JavaScript",
  "slug": "javascript"
}
```

---

### Comments

#### List Comments

```http
GET /api/v1/posts/{post_id}/comments
```

**Response:**
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": "uuid",
        "content": "Great post!",
        "author": {
          "id": "uuid",
          "username": "janedoe",
          "full_name": "Jane Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "parent_id": null,
        "replies_count": 2,
        "created_at": "2026-03-05T12:00:00Z",
        "updated_at": "2026-03-05T12:00:00Z"
      }
    ]
  }
}
```

#### Create Comment

```http
POST /api/v1/posts/{post_id}/comments
```

**Request Body:**
```json
{
  "content": "Great post!",
  "parent_id": null
}
```

#### Update Comment

```http
PUT /api/v1/comments/{comment_id}
```

#### Delete Comment

```http
DELETE /api/v1/comments/{comment_id}
```

---

### Social

#### Follow User

```http
POST /api/v1/social/follow/{user_id}
```

#### Unfollow User

```http
DELETE /api/v1/social/follow/{user_id}
```

#### Get Followers

```http
GET /api/v1/users/{user_id}/followers
```

#### Get Following

```http
GET /api/v1/users/{user_id}/following
```

---

### Notifications

#### List Notifications

```http
GET /api/v1/notifications
```

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "comment",
        "title": "New comment on your post",
        "message": "John Doe commented on your post",
        "data": {
          "post_id": "uuid",
          "comment_id": "uuid"
        },
        "read": false,
        "created_at": "2026-03-05T12:00:00Z"
      }
    ]
  }
}
```

#### Mark as Read

```http
PUT /api/v1/notifications/{notification_id}/read
```

#### Mark All as Read

```http
PUT /api/v1/notifications/read-all
```

---

### Media

#### Upload File

```http
POST /api/v1/media/upload
```

**Content-Type:** `multipart/form-data`

**Form Data:**
```
file: <binary>
type: "image" | "document" | "video"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "url": "https://example.com/uploads/image.jpg",
    "filename": "image.jpg",
    "size": 245678,
    "mime_type": "image/jpeg",
    "width": 1920,
    "height": 1080
  }
}
```

#### Delete File

```http
DELETE /api/v1/media/{file_id}
```

---

## Rate Limiting

API requests are rate limited to prevent abuse:

- **Anonymous requests**: 100 requests per 15 minutes
- **Authenticated requests**: 1000 requests per 15 minutes

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1678123456
```

---

## WebSocket API

Real-time updates are available via WebSocket connection:

**URL:** `ws://localhost:8000/api/v1/ws`

**Authentication:** Include JWT token in query parameter:
```
ws://localhost:8000/api/v1/ws?token=<jwt_token>
```

**Events:**
- `notification.new` - New notification received
- `comment.new` - New comment on user's post
- `follow.new` - New follower
- `like.new` - New like on user's post

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get posts
const { data } = await api.get('/posts');

// Create post
const newPost = await api.post('/posts', {
  title: 'My Post',
  content: 'Post content'
});
```

### Python

```python
import requests

API_BASE = 'http://localhost:8000/api/v1'
headers = {'Authorization': f'Bearer {token}'}

# Get posts
response = requests.get(f'{API_BASE}/posts', headers=headers)

# Create post
new_post = requests.post(
    f'{API_BASE}/posts',
    json={'title': 'My Post', 'content': 'Post content'},
    headers=headers
)
```

---

## Support

For API support and questions:
- 📧 Email: support@cyberpress.com
- 📖 Documentation: https://docs.cyberpress.com
- 💬 Community: https://community.cyberpress.com

---

**Last Updated:** 2026-03-05
**API Version:** 1.0.0
