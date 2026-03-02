# CyberPress API Documentation

## Overview

The CyberPress API is a RESTful API built with FastAPI that provides endpoints for managing blog posts, users, comments, and more.

## Base URL

```
Development: http://localhost:8000/api
Production: https://api.cyberpress.dev/api
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "user",
    "role": "author"
  }
}
```

### Using the Token

```http
Authorization: Bearer <access_token>
```

## Endpoints

### Posts

#### List Posts

```http
GET /api/v1/posts?page=1&page_size=20&status=published
```

**Parameters:**
- `page` (optional): Page number (default: 1)
- `page_size` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (draft, published, archived)
- `category` (optional): Filter by category ID
- `tag` (optional): Filter by tag ID
- `search` (optional): Search in title and content

**Response:**

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "Post excerpt...",
      "content": "Full post content...",
      "status": "published",
      "category": {
        "id": "uuid",
        "name": "Technology",
        "slug": "technology"
      },
      "tags": [
        {
          "id": "uuid",
          "name": "JavaScript",
          "slug": "javascript"
        }
      ],
      "author": {
        "id": "uuid",
        "username": "admin",
        "full_name": "Admin User"
      },
      "featured_image": "https://...",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "published_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "total_pages": 5
}
```

#### Get Post by ID

```http
GET /api/v1/posts/{id}
```

#### Create Post

```http
POST /api/v1/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Post",
  "content": "Post content...",
  "excerpt": "Short excerpt",
  "category_id": "uuid",
  "tags": ["uuid1", "uuid2"],
  "status": "draft",
  "featured_image": "https://..."
}
```

#### Update Post

```http
PUT /api/v1/posts/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Post

```http
DELETE /api/v1/posts/{id}
Authorization: Bearer <token>
```

### Categories

#### List Categories

```http
GET /api/v1/categories
```

**Response:**

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Technology",
      "slug": "technology",
      "description": "Tech-related posts",
      "post_count": 25,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Create Category

```http
POST /api/v1/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Category",
  "description": "Category description",
  "slug": "new-category"
}
```

### Tags

#### List Tags

```http
GET /api/v1/tags
```

**Response:**

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "JavaScript",
      "slug": "javascript",
      "post_count": 15
    }
  ]
}
```

#### Create Tag

```http
POST /api/v1/tags
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Tag",
  "slug": "new-tag"
}
```

### Comments

#### List Comments

```http
GET /api/v1/comments?post_id=uuid&status=approved
```

#### Create Comment

```http
POST /api/v1/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "post_id": "uuid",
  "content": "Comment content...",
  "parent_id": "uuid"  // Optional, for replies
}
```

#### Moderate Comment

```http
PUT /api/v1/comments/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "approved"  // or "rejected", "spam"
}
```

### User Profile

#### Get Current User

```http
GET /api/user
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "bio": "Software developer...",
  "avatar_url": "https://..."
}
```

#### Change Password

```http
POST /api/user/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "current_password": "oldpass",
  "new_password": "newpass"
}
```

## Error Responses

All errors follow this format:

```json
{
  "error": true,
  "message": "Error description",
  "status_code": 400,
  "details": {}
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## Rate Limiting

The API implements rate limiting:

- **Default**: 60 requests per minute
- **Authenticated**: 100 requests per minute

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination:

- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

Response includes pagination metadata:

```json
{
  "items": [],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "total_pages": 5
}
```

## Filtering & Sorting

### Filtering

Use query parameters for filtering:

```http
GET /api/v1/posts?status=published&category=uuid&tag=uuid
```

### Sorting

```http
GET /api/v1/posts?sort=-created_at  // Descending
GET /api/v1/posts?sort=created_at   // Ascending
```

## Webhooks

Configure webhooks to receive notifications:

```http
POST /api/v1/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-site.com/webhook",
  "events": ["post.created", "comment.pending"]
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Login
const { data } = await api.post('/v1/auth/login', {
  email: 'user@example.com',
  password: 'password',
});

// Set token
api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

// Get posts
const posts = await api.get('/v1/posts');
```

### Python

```python
import requests

api = requests.Session()
api.base_url = 'http://localhost:8000/api'

# Login
response = api.post('/v1/auth/login', json={
    'email': 'user@example.com',
    'password': 'password'
})
token = response.json()['access_token']

# Set token
api.headers.update({'Authorization': f'Bearer {token}'})

# Get posts
posts = api.get('/v1/posts').json()
```

## Testing

Use the interactive API documentation at `/api/docs` to test endpoints.

---

For more details, visit the full API documentation at http://localhost:8000/api/docs
