# CyberPress API Documentation

## Base URL
```
Production: https://api.cyberpress.com/api/v1
Development: http://localhost:8000/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "full_name": "John Doe"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Posts

### Get Posts
```http
GET /posts?page=1&limit=20&category=1&tag=python&status=published
```

Response:
```json
{
  "items": [
    {
      "id": 1,
      "title": "Post Title",
      "slug": "post-title",
      "excerpt": "Post excerpt...",
      "content": "Full post content...",
      "status": "published",
      "view_count": 100,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "author": {
        "id": 1,
        "username": "username",
        "full_name": "John Doe"
      },
      "category": {
        "id": 1,
        "name": "Technology"
      },
      "tags": [
        {
          "id": 1,
          "name": "python"
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5
}
```

### Create Post
```http
POST /posts/
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Post",
  "content": "Post content...",
  "excerpt": "Short excerpt",
  "category_id": 1,
  "tags": [1, 2, 3],
  "status": "draft"
}
```

### Get Post by ID
```http
GET /posts/{id}
```

### Update Post
```http
PUT /posts/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

### Delete Post
```http
DELETE /posts/{id}
Authorization: Bearer <token>
```

## Users

### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

### Get User by Username
```http
GET /users/{username}
```

### Update User Profile
```http
PUT /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Doe",
  "bio": "Software developer...",
  "website": "https://example.com"
}
```

## Comments

### Get Comments
```http
GET /comments?post_id=1&parent_id=
```

### Create Comment
```http
POST /comments/
Authorization: Bearer <token>
Content-Type: application/json

{
  "post_id": 1,
  "content": "Comment content...",
  "parent_id": null
}
```

### Update Comment
```http
PUT /comments/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Updated comment..."
}
```

### Delete Comment
```http
DELETE /comments/{id}
Authorization: Bearer <token>
```

## Social Features

### Follow User
```http
POST /social/follow/{user_id}
Authorization: Bearer <token>
```

### Unfollow User
```http
DELETE /social/follow/{user_id}
Authorization: Bearer <token>
```

### Like Post
```http
POST /social/like/{post_id}
Authorization: Bearer <token>
```

### Unlike Post
```http
DELETE /social/like/{post_id}
Authorization: Bearer <token>
```

### Bookmark Post
```http
POST /social/bookmark/{post_id}
Authorization: Bearer <token>
```

## Notifications

### Get Notifications
```http
GET /notifications?page=1&limit=20&unread_only=true
Authorization: Bearer <token>
```

### Mark as Read
```http
PUT /notifications/{id}/read
Authorization: Bearer <token>
```

### Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer <token>
```

## Search

### Search
```http
GET /search?q=query&type=all&sort=relevance&page=1&limit=20
```

Parameters:
- `q`: Search query
- `type`: all | posts | users | tags
- `sort`: relevance | newest | oldest

## Analytics

### Get Overview
```http
GET /analytics/overview?days=30
Authorization: Bearer <token>
```

### Get Post Analytics
```http
GET /analytics/posts/{post_id}?days=30
Authorization: Bearer <token>
```

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "detail": "Validation error"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "detail": "Rate limit exceeded",
  "Retry-After": "60"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

- Default: 100 requests per minute
- Auth endpoints: 5 requests per 5 minutes
- Upload endpoints: 20 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```
