# 点赞和收藏 API 文档

## 概述

本文档描述了 CyberPress Platform 新增的**点赞系统**和**收藏功能**的 API 接口。

### 功能特性

- ✅ 支持对文章、评论、项目进行点赞
- ✅ 支持对文章、项目、分类进行收藏
- ✅ 防止重复点赞/收藏
- ✅ 点赞/收藏状态查询
- ✅ 用户点赞/收藏历史
- ✅ 收藏备注功能
- ✅ 收藏搜索功能
- ✅ 点赞统计功能

---

## 点赞 API

### 基础信息

- **Base URL**: `/api/v1/likes`
- **认证方式**: Bearer Token (除公开接口外)
- **Content-Type**: `application/json`

### API 端点

#### 1. 创建点赞

```http
POST /api/v1/likes
Authorization: Bearer <token>
Content-Type: application/json

{
  "target_type": "post",
  "target_id": 1
}
```

**参数说明**:
- `target_type` (string, required): 目标类型，可选值: `post`, `comment`, `project`
- `target_id` (integer, required): 目标ID

**响应示例**:
```json
{
  "id": 1,
  "user_id": 1,
  "target_type": "post",
  "target_id": 1,
  "created_at": "2026-03-06T19:10:00.000000"
}
```

**错误响应**:
- `400 Bad Request`: 已点赞过
- `401 Unauthorized`: 未授权

---

#### 2. 取消点赞

```http
DELETE /api/v1/likes/{target_type}/{target_id}
Authorization: Bearer <token>
```

**路径参数**:
- `target_type`: 目标类型
- `target_id`: 目标ID

**响应**: `204 No Content`

**错误响应**:
- `404 Not Found`: 点赞记录不存在

---

#### 3. 获取点赞状态

```http
GET /api/v1/likes/status/{target_type}/{target_id}
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "is_liked": true,
  "like_count": 5
}
```

---

#### 4. 获取点赞数量（公开接口）

```http
GET /api/v1/likes/count/{target_type}/{target_id}
```

**响应示例**:
```json
{
  "count": 10
}
```

---

#### 5. 获取我的点赞列表

```http
GET /api/v1/likes/my?skip=0&limit=20
Authorization: Bearer <token>
```

**查询参数**:
- `skip` (integer): 跳过的记录数，默认 0
- `limit` (integer): 返回的记录数，默认 20，最大 100

**响应示例**:
```json
{
  "items": [
    {
      "id": 1,
      "user_id": 1,
      "target_type": "post",
      "target_id": 1,
      "created_at": "2026-03-06T19:10:00.000000"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```

---

#### 6. 获取目标的点赞列表（公开接口）

```http
GET /api/v1/likes/target/{target_type}/{target_id}?skip=0&limit=20
```

**响应示例**: 同"获取我的点赞列表"

---

#### 7. 获取点赞统计（公开接口）

```http
GET /api/v1/likes/stats?target_type=post&target_id=1
```

**查询参数**:
- `target_type` (string, optional): 目标类型
- `target_id` (integer, optional): 目标ID

**响应示例**:
```json
{
  "total_likes": 100,
  "recent_likes": 15
}
```

---

#### 8. 切换点赞状态

```http
POST /api/v1/likes/toggle/{target_type}/{target_id}
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "is_liked": true,
  "like_count": 1
}
```

---

## 收藏 API

### 基础信息

- **Base URL**: `/api/v1/bookmarks`
- **认证方式**: Bearer Token
- **Content-Type**: `application/json`

### API 端点

#### 1. 创建收藏

```http
POST /api/v1/bookmarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "target_type": "post",
  "target_id": 1,
  "notes": "这是一篇很好的文章"
}
```

**参数说明**:
- `target_type` (string, required): 目标类型，可选值: `post`, `project`, `category`
- `target_id` (integer, required): 目标ID
- `notes` (string, optional): 备注信息

**响应示例**:
```json
{
  "id": 1,
  "user_id": 1,
  "target_type": "post",
  "target_id": 1,
  "notes": "这是一篇很好的文章",
  "created_at": "2026-03-06T19:10:00.000000",
  "updated_at": "2026-03-06T19:10:00.000000"
}
```

**错误响应**:
- `400 Bad Request`: 已收藏过
- `401 Unauthorized`: 未授权

---

#### 2. 更新收藏

```http
PUT /api/v1/bookmarks/{bookmark_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "更新后的备注"
}
```

**路径参数**:
- `bookmark_id`: 收藏ID

**响应示例**:
```json
{
  "id": 1,
  "user_id": 1,
  "target_type": "post",
  "target_id": 1,
  "notes": "更新后的备注",
  "created_at": "2026-03-06T19:10:00.000000",
  "updated_at": "2026-03-06T19:15:00.000000"
}
```

---

#### 3. 删除收藏（通过ID）

```http
DELETE /api/v1/bookmarks/{bookmark_id}
Authorization: Bearer <token>
```

**响应**: `204 No Content`

---

#### 4. 删除收藏（通过目标）

```http
DELETE /api/v1/bookmarks/target/{target_type}/{target_id}
Authorization: Bearer <token>
```

**响应**: `204 No Content`

---

#### 5. 获取收藏状态

```http
GET /api/v1/bookmarks/status/{target_type}/{target_id}
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "is_bookmarked": true,
  "bookmark_id": 1
}
```

---

#### 6. 获取我的收藏列表

```http
GET /api/v1/bookmarks/my?target_type=post&skip=0&limit=20
Authorization: Bearer <token>
```

**查询参数**:
- `target_type` (string, optional): 目标类型过滤
- `skip` (integer): 跳过的记录数，默认 0
- `limit` (integer): 返回的记录数，默认 20，最大 100

**响应示例**:
```json
{
  "items": [
    {
      "id": 1,
      "user_id": 1,
      "target_type": "post",
      "target_id": 1,
      "notes": "很好的文章",
      "created_at": "2026-03-06T19:10:00.000000",
      "updated_at": "2026-03-06T19:10:00.000000"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 20
}
```

---

#### 7. 获取收藏详情

```http
GET /api/v1/bookmarks/{bookmark_id}
Authorization: Bearer <token>
```

**响应示例**: 同"创建收藏"响应

---

#### 8. 切换收藏状态

```http
POST /api/v1/bookmarks/toggle/{target_type}/{target_id}?notes=备注
Authorization: Bearer <token>
```

**查询参数**:
- `notes` (string, optional): 备注信息（仅在新建时使用）

**响应示例**:
```json
{
  "is_bookmarked": true,
  "bookmark_id": 1
}
```

---

#### 9. 搜索收藏

```http
GET /api/v1/bookmarks/search?keyword=Python&target_type=post&skip=0&limit=20
Authorization: Bearer <token>
```

**查询参数**:
- `keyword` (string, optional): 搜索关键词（搜索备注）
- `target_type` (string, optional): 目标类型过滤
- `skip` (integer): 跳过的记录数，默认 0
- `limit` (integer): 返回的记录数，默认 20，最大 100

**响应示例**: 同"获取我的收藏列表"响应

---

## 使用示例

### JavaScript/TypeScript

```typescript
// 点赞文章
async function likePost(postId: number) {
  const response = await fetch('/api/v1/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      target_type: 'post',
      target_id: postId
    })
  });
  return response.json();
}

// 取消点赞
async function unlikePost(postId: number) {
  const response = await fetch(`/api/v1/likes/post/${postId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.status === 204;
}

// 获取点赞状态
async function getLikeStatus(postId: number) {
  const response = await fetch(`/api/v1/likes/status/post/${postId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}

// 收藏文章
async function bookmarkPost(postId: number, notes?: string) {
  const response = await fetch('/api/v1/bookmarks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      target_type: 'post',
      target_id: postId,
      notes
    })
  });
  return response.json();
}

// 获取我的收藏
async function getMyBookmarks(targetType?: string) {
  const params = new URLSearchParams();
  if (targetType) params.append('target_type', targetType);

  const response = await fetch(`/api/v1/bookmarks/my?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}

// 搜索收藏
async function searchBookmarks(keyword: string) {
  const response = await fetch(`/api/v1/bookmarks/search?keyword=${encodeURIComponent(keyword)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
}
```

### Python

```python
import requests

API_BASE = "http://localhost:8000/api/v1"
TOKEN = "your_token_here"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# 点赞文章
def like_post(post_id):
    response = requests.post(
        f"{API_BASE}/likes",
        headers=headers,
        json={
            "target_type": "post",
            "target_id": post_id
        }
    )
    return response.json()

# 取消点赞
def unlike_post(post_id):
    response = requests.delete(
        f"{API_BASE}/likes/post/{post_id}",
        headers=headers
    )
    return response.status_code == 204

# 获取点赞状态
def get_like_status(post_id):
    response = requests.get(
        f"{API_BASE}/likes/status/post/{post_id}",
        headers=headers
    )
    return response.json()

# 收藏文章
def bookmark_post(post_id, notes=None):
    response = requests.post(
        f"{API_BASE}/bookmarks",
        headers=headers,
        json={
            "target_type": "post",
            "target_id": post_id,
            "notes": notes
        }
    )
    return response.json()

# 获取我的收藏
def get_my_bookmarks(target_type=None):
    params = {}
    if target_type:
        params["target_type"] = target_type

    response = requests.get(
        f"{API_BASE}/bookmarks/my",
        headers=headers,
        params=params
    )
    return response.json()
```

---

## 数据模型

### Like 模型

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键 |
| user_id | Integer | 用户ID（外键） |
| target_type | String(50) | 目标类型 |
| target_id | Integer | 目标ID |
| created_at | DateTime | 创建时间 |

### Bookmark 模型

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键 |
| user_id | Integer | 用户ID（外键） |
| target_type | String(50) | 目标类型 |
| target_id | Integer | 目标ID |
| notes | Text | 备注信息 |
| created_at | DateTime | 创建时间 |
| updated_at | DateTime | 更新时间 |

---

## 错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 204 | 删除成功（无内容） |
| 400 | 请求错误（如重复点赞/收藏） |
| 401 | 未授权 |
| 404 | 资源不存在 |
| 422 | 验证错误 |

---

## 数据库迁移

运行迁移命令创建表：

```bash
cd backend

# 应用迁移
alembic upgrade head

# 回滚迁移
alembic downgrade -1
```

---

## 测试

运行单元测试：

```bash
cd backend

# 运行所有测试
pytest app/tests/

# 运行点赞相关测试
pytest app/tests/test_likes.py

# 运行收藏相关测试
pytest app/tests/test_bookmarks.py

# 生成覆盖率报告
pytest app/tests/ --cov=app --cov-report=html
```

---

## 注意事项

1. **认证**: 大多数接口需要 Bearer Token 认证
2. **防重复**: 系统自动防止重复点赞/收藏
3. **级联删除**: 当用户被删除时，其点赞和收藏记录会自动删除
4. **性能优化**: 已为常用查询字段添加索引
5. **目标类型**:
   - 点赞: `post`, `comment`, `project`
   - 收藏: `post`, `project`, `category`

---

## 更新日志

### v1.0.0 (2026-03-06)
- ✨ 初始版本
- ✅ 实现点赞系统
- ✅ 实现收藏功能
- ✅ 添加单元测试
- ✅ 添加API文档

---

**最后更新**: 2026-03-06
**作者**: AI Backend Team
