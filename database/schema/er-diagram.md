# 🔗 CyberPress Platform - Database ER Diagram

> 完整的数据库实体关系图文档

---

## 📊 ER 图概览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CYBERPRESS DATABASE SCHEMA                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│    USERS     │────────<│    POSTS     │>────────│  CATEGORIES  │
│              │  1:N    │              │  N:M    │              │
│ - id         │         │ - id         │         │ - id         │
│ - username   │         │ - author_id  │         │ - name       │
│ - email      │         │ - title      │         │ - slug       │
│ - role       │         │ - content    │         │ - parent_id  │
│ - status     │         │ - status     │         │ - color      │
│              │         │ - view_count │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
       │                         │                         │
       │                         │                         │
       │ N:M                     │ N:M                     │
       v                         v                         v
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   FOLLOWS    │         │    TAGS      │         │ POST_TAGS    │
│              │         │              │         │(Junction)    │
│ - follower_id│         │ - id         │         │ - post_id    │
│ - following  │         │ - name       │         │ - tag_id     │
│   _id        │         │ - slug       │         │              │
│ - created_at │         │ - color      │         │              │
└──────────────┘         └──────────────┘         └──────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   COMMENTS   │         │    LIKES     │         │  BOOKMARKS   │
│              │         │              │         │              │
│ - id         │         │ - id         │         │ - id         │
│ - post_id    │         │ - user_id    │         │ - user_id    │
│ - author_id  │         │ - target_type│         │ - post_id    │
│ - content    │         │ - target_id  │         │ - folder     │
│ - status     │         │ - created_at │         │ - created_at │
│ - like_count │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│ NOTIFICATIONS│         │READING_PROG. │         │  AUDIT_LOGS  │
│              │         │              │         │              │
│ - id         │         │ - id         │         │ - id         │
│ - user_id    │         │ - user_id    │         │ - user_id    │
│ - type       │         │ - post_id    │         │ - action     │
│ - title      │         │ - progress % │         │ - entity_type│
│ - is_read    │         │ - is_read    │         │ - entity_id  │
│ - created_at │         │ - notes      │         │ - created_at │
└──────────────┘         └──────────────┘         └──────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   MEDIA      │         │  PORTFOLIOS  │         │   PAGES      │
│              │         │              │         │              │
│ - id         │         │ - id         │         │ - id         │
│ - uploader_id│         │ - author_id  │         │ - author_id  │
│ - file_name  │         │ - title      │         │ - title      │
│ - file_path  │         │ - project_url│         │ - slug       │
│ - mime_type  │         │ - github_url │         │ - content    │
│ - file_type  │         │ - technologies│         │ - template   │
└──────────────┘         └──────────────┘         └──────────────┘
```

---

## 🔗 关系详解

### 1. 核心关系

```
USERS ──────< POSTS
  │            │
  │            │
  │            ├─────< COMMENTS
  │            │
  │            ├─────> CATEGORIES (via post_categories)
  │            │
  │            └─────> TAGS (via post_tags)
  │
  ├─────< LIKES
  │
  ├─────< BOOKMARKS
  │
  ├─────< FOLLOWS
  │
  ├─────< READING_PROGRESS
  │
  ├─────< AUDIT_LOGS
  │
  └─────< NOTIFICATIONS
```

### 2. 用户关系 (USERS)

**主键：** `id (UUID)`

**一对多关系：**
- `USERS.id` → `POSTS.author_id` (一个用户可以写多篇文章)
- `USERS.id` → `COMMENTS.author_id` (一个用户可以写多条评论)
- `USERS.id` → `MEDIA.uploader_id` (一个用户可以上传多个媒体)
- `USERS.id` → `PORTFOLIOS.author_id` (一个用户可以有多个作品)
- `USERS.id` → `PAGES.author_id` (一个用户可以创建多个页面)

**多对多关系：**
- `USERS` ↔ `USERS` (via FOLLOWS) - 用户关注关系
- `USERS` ↔ `POSTS` (via LIKES) - 用户点赞文章
- `USERS` ↔ `POSTS` (via BOOKMARKS) - 用户收藏文章
- `USERS` ↔ `POSTS` (via READING_PROGRESS) - 阅读进度

### 3. 文章关系 (POSTS)

**主键：** `id (UUID)`

**外键：**
- `author_id` → `USERS.id` (CASCADE DELETE)

**一对多关系：**
- `POSTS.id` → `COMMENTS.post_id` (一篇文章有多条评论)

**多对多关系：**
- `POSTS` ↔ `CATEGORIES` (via post_categories)
- `POSTS` ↔ `TAGS` (via post_tags)

**级联规则：**
- 删除文章 → 删除所有评论
- 删除文章 → 删除所有分类关系
- 删除文章 → 删除所有标签关系

### 4. 评论关系 (COMMENTS)

**主键：** `id (UUID)`

**外键：**
- `post_id` → `POSTS.id` (CASCADE DELETE)
- `author_id` → `USERS.id` (SET NULL)
- `parent_id` → `COMMENTS.id` (CASCADE DELETE) - 自引用

**特点：**
- 支持嵌套评论（父评论-子评论）
- 删除文章时删除所有评论
- 删除用户时保留评论但设为匿名

### 5. 分类和标签 (CATEGORIES & TAGS)

**分类：**
- 支持层级结构（`parent_id` 自引用）
- 多对多关系（via `post_categories`）

**标签：**
- 扁平结构
- 多对多关系（via `post_tags`）

### 6. 社交功能关系

#### 点赞 (LIKES)

```
USERS ──────< LIKES ──────> POSTS/COMMENTS
```

- 多态关系：可以点赞文章或评论
- `target_type`: 'post' 或 'comment'
- `target_id`: 目标实体 ID

#### 收藏 (BOOKMARKS)

```
USERS ──────< BOOKMARKS ──────> POSTS
```

- 一个用户可以收藏多篇文章
- 支持文件夹分类

#### 关注 (FOLLOWS)

```
USERS ──────< FOLLOWS ──────> USERS
```

- 用户之间的关注关系
- `follower_id`: 关注者
- `following_id`: 被关注者
- 唯一约束：`(follower_id, following_id)`

---

## 📊 表结构详解

### 核心表

#### 1. USERS（用户表）

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100),
    bio             TEXT,
    avatar_url      VARCHAR(500),
    website_url     VARCHAR(500),
    role            VARCHAR(20) CHECK (role IN ('admin', 'editor', 'author', 'subscriber')),
    status          VARCHAR(20) CHECK (status IN ('active', 'inactive', 'banned')),
    email_verified_at TIMESTAMP,
    last_login_at   TIMESTAMP,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**索引：**
- `idx_users_email` - 邮箱查询
- `idx_users_username` - 用户名查询
- `idx_users_status` - 状态筛选
- `idx_users_role` - 角色筛选

#### 2. POSTS（文章表）

```sql
CREATE TABLE posts (
    id                  UUID PRIMARY KEY,
    author_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    excerpt             TEXT,
    content             TEXT NOT NULL,
    content_html        TEXT,
    featured_image_url  VARCHAR(500),
    status              VARCHAR(20) CHECK (status IN ('draft', 'published', 'private', 'trash')),
    post_type           VARCHAR(20) CHECK (post_type IN ('post', 'portfolio', 'page')),
    comment_status      VARCHAR(20) CHECK (comment_status IN ('open', 'closed')),
    view_count          INTEGER DEFAULT 0,
    like_count          INTEGER DEFAULT 0,
    is_featured         BOOLEAN DEFAULT FALSE,
    is_sticky           BOOLEAN DEFAULT FALSE,
    published_at        TIMESTAMP,
    metadata            JSONB DEFAULT '{}',
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**索引：**
- `idx_posts_author_id` - 作者查询
- `idx_posts_slug` - URL 查询
- `idx_posts_status` - 状态筛选
- `idx_posts_published_at` - 发布时间排序
- `idx_posts_title_gin` - 全文搜索（标题）
- `idx_posts_content_gin` - 全文搜索（内容）

#### 3. CATEGORIES（分类表）

```sql
CREATE TABLE categories (
    id          UUID PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
    icon        VARCHAR(50),
    color       VARCHAR(7),
    sort_order  INTEGER DEFAULT 0,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**关系：**
- 自引用：`parent_id` → `categories.id`

#### 4. TAGS（标签表）

```sql
CREATE TABLE tags (
    id          UUID PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    slug        VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color       VARCHAR(7),
    usage_count INTEGER DEFAULT 0,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 5. COMMENTS（评论表）

```sql
CREATE TABLE comments (
    id            UUID PRIMARY KEY,
    post_id       UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    parent_id     UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_name   VARCHAR(100),
    author_email  VARCHAR(255),
    author_url    VARCHAR(500),
    author_ip     VARCHAR(45),
    content       TEXT NOT NULL,
    content_html  TEXT,
    status        VARCHAR(20) CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
    agent         VARCHAR(255),
    like_count    INTEGER DEFAULT 0,
    metadata      JSONB DEFAULT '{}',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 社交功能表

#### 6. LIKES（点赞表）

```sql
CREATE TABLE likes (
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id   UUID NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);
```

**多态关系：**
- `target_type + target_id` 可以指向 `posts` 或 `comments`

#### 7. BOOKMARKS（收藏表）

```sql
CREATE TABLE bookmarks (
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    folder      VARCHAR(50) DEFAULT 'default',
    notes       TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);
```

#### 8. FOLLOWS（关注表）

```sql
CREATE TABLE follows (
    id           UUID PRIMARY KEY,
    follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);
```

**约束：**
- 不能关注自己
- 唯一关注关系

#### 9. NOTIFICATIONS（通知表）

```sql
CREATE TABLE notifications (
    id          UUID PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(50) NOT NULL,
    title       VARCHAR(255) NOT NULL,
    content     TEXT,
    link_url    VARCHAR(500),
    is_read     BOOLEAN DEFAULT FALSE,
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 扩展功能表

#### 10. READING_PROGRESS（阅读进度表）

```sql
CREATE TABLE reading_progress (
    id               UUID PRIMARY KEY,
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id          UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    is_read          BOOLEAN DEFAULT FALSE,
    is_favorite      BOOLEAN DEFAULT FALSE,
    notes            TEXT,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);
```

#### 11. AUDIT_LOGS（审计日志表）

```sql
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   UUID NOT NULL,
    old_values  JSONB,
    new_values  JSONB,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 12. SETTINGS（系统设置表）

```sql
CREATE TABLE settings (
    id          BIGSERIAL PRIMARY KEY,
    key         VARCHAR(100) UNIQUE NOT NULL,
    value       TEXT,
    category    VARCHAR(50) DEFAULT 'general',
    description TEXT,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔍 查询模式

### 常用查询

#### 1. 获取文章列表（带作者和分类）

```sql
SELECT
    p.*,
    u.username as author_name,
    u.avatar_url as author_avatar,
    ARRAY_AGG(c.name) as categories,
    ARRAY_AGG(t.name) as tags
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.status = 'published'
GROUP BY p.id, u.id
ORDER BY p.published_at DESC
LIMIT 10;
```

#### 2. 获取用户信息（含统计）

```sql
SELECT
    u.*,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT f.following_id) as following_count,
    COUNT(DISTINCT f2.follower_id) as follower_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id AND p.status = 'published'
LEFT JOIN comments c ON u.id = c.author_id AND c.status = 'approved'
LEFT JOIN follows f ON u.id = f.follower_id
LEFT JOIN follows f2 ON u.id = f2.following_id
WHERE u.id = $1
GROUP BY u.id;
```

#### 3. 获取文章评论（嵌套）

```sql
WITH RECURSIVE comment_tree AS (
    -- 根评论
    SELECT
        c.*,
        u.username,
        u.avatar_url,
        0 as depth,
        ARRAY[c.id] as path
    FROM comments c
    LEFT JOIN users u ON c.author_id = u.id
    WHERE c.post_id = $1
    AND c.parent_id IS NULL
    AND c.status = 'approved'

    UNION ALL

    -- 子评论
    SELECT
        c.*,
        u.username,
        u.avatar_url,
        ct.depth + 1,
        ct.path || c.id
    FROM comments c
    LEFT JOIN users u ON c.author_id = u.id
    JOIN comment_tree ct ON c.parent_id = ct.id
    WHERE c.status = 'approved'
    AND ct.depth < 5 -- 限制嵌套深度
)
SELECT * FROM comment_tree
ORDER BY depth, created_at;
```

---

## 📈 性能优化

### 索引策略

1. **主键索引** - 所有表的 `id` 字段
2. **外键索引** - 所有外键字段
3. **唯一索引** - 用户名、邮箱、slug 等唯一字段
4. **全文搜索索引** - 使用 GIN 索引支持全文搜索
5. **复合索引** - 多列组合查询优化

### 查询优化

1. **使用物化视图** - 预计算复杂查询
2. **分页查询** - 使用 `LIMIT` 和 `OFFSET`
3. **缓存策略** - 使用应用层缓存
4. **查询分析** - 使用 `EXPLAIN ANALYZE`

---

## 📚 参考资料

- [PostgreSQL 文档](https://www.postgresql.org/docs/15/)
- [数据库设计最佳实践](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [索引优化指南](https://www.postgresql.org/docs/current/indexes.html)

---

**创建日期:** 2026-03-07
**版本:** 1.0.0
**维护者:** AI Development Team
