# CyberPress Platform - 数据库架构文档

## 📊 概述

CyberPress Platform 使用 PostgreSQL 作为主数据库，采用规范化的关系型数据库设计，支持博客、社交、用户管理等完整功能。

---

## 🏗️ 数据库结构

### 核心表

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| `users` | 用户表 | id, username, email, password_hash |
| `posts` | 文章表 | id, title, slug, content, author_id, status |
| `categories` | 分类表 | id, name, slug, parent_id |
| `tags` | 标签表 | id, name, slug |
| `comments` | 评论表 | id, post_id, author_id, content, status |
| `likes` | 点赞表 | id, user_id, target_id, target_type |
| `bookmarks` | 收藏表 | id, user_id, post_id, folder_id |
| `follows` | 关注表 | id, follower_id, following_id |
| `notifications` | 通知表 | id, user_id, type, title, is_read |
| `reading_progress` | 阅读进度 | id, user_id, post_id, progress_percent |

### 辅助表

| 表名 | 说明 |
|------|------|
| `post_tags` | 文章标签关联表 |
| `bookmark_folders` | 收藏夹表 |
| `sessions` | 会话表 |
| `audit_logs` | 操作日志表 |
| `media` | 媒体文件表 |

---

## 🔍 ER 图

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │───────│   posts     │───────│  comments   │
│             │ 1   N │             │ 1   N │             │
│ - id        │       │ - id        │       │ - id        │
│ - username  │       │ - title     │       │ - content   │
│ - email     │       │ - content   │       │ - status    │
│ - password  │       │ - author_id │       └─────────────┘
└─────────────┘       └─────────────┘
       │                      │
       │                      │
       │ N               N   N │
       │                      │
       ▼                      ▼
┌─────────────┐       ┌─────────────┐
│  follows    │       │  post_tags  │───────┌─────────────┐
│             │       │             │       │    tags     │
│ - follower  │       │ - post_id   │       │             │
│ - following │       │ - tag_id    │       │ - id        │
└─────────────┘       └─────────────┘       │ - name      │
                                              │ - slug      │
┌─────────────┐       ┌─────────────┐       └─────────────┘
│   likes     │       │ bookmarks   │
│             │       │             │
│ - user_id   │       │ - user_id   │
│ - target_id │       │ - post_id   │
└─────────────┘       └─────────────┘
```

---

## 📋 表结构详解

### 1. users (用户表)

存储用户账户和个人资料信息。

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY,
    username        VARCHAR(50) UNIQUE,
    email           VARCHAR(255) UNIQUE,
    password_hash   VARCHAR(255),
    full_name       VARCHAR(100),
    bio             TEXT,
    avatar_url      VARCHAR(500),
    is_active       BOOLEAN,
    is_verified     BOOLEAN,
    is_staff        BOOLEAN,
    created_at      TIMESTAMP,
    updated_at      TIMESTAMP
);
```

**索引:**
- `idx_users_username` - 用户名查询
- `idx_users_email` - 邮箱查询
- `idx_users_search` - 全文搜索

---

### 2. posts (文章表)

存储博客文章的所有信息。

```sql
CREATE TABLE posts (
    id              UUID PRIMARY KEY,
    title           VARCHAR(500),
    slug            VARCHAR(500),
    excerpt         TEXT,
    content         TEXT,
    author_id       UUID REFERENCES users(id),
    category_id     INTEGER REFERENCES categories(id),
    status          VARCHAR(20),
    is_featured     BOOLEAN,
    view_count      INTEGER,
    like_count      INTEGER,
    comment_count   INTEGER,
    created_at      TIMESTAMP,
    published_at    TIMESTAMP
);
```

**状态值:**
- `draft` - 草稿
- `published` - 已发布
- `archived` - 已归档

**索引:**
- `idx_posts_slug` - URL slug 查询
- `idx_posts_author_id` - 按作者查询
- `idx_posts_status_published` - 已发布文章
- `idx_posts_search` - 全文搜索

---

### 3. comments (评论表)

存储文章评论和回复。

```sql
CREATE TABLE comments (
    id              UUID PRIMARY KEY,
    post_id         UUID REFERENCES posts(id),
    author_id       UUID REFERENCES users(id),
    parent_id       UUID REFERENCES comments(id),
    author_name     VARCHAR(100),
    author_email    VARCHAR(255),
    content         TEXT,
    status          VARCHAR(20),
    ip_address      INET,
    created_at      TIMESTAMP
);
```

**状态值:**
- `pending` - 待审核
- `approved` - 已批准
- `spam` - 垃圾评论
- `trash` - 已删除

---

### 4. likes (点赞表)

存储用户对文章和评论的点赞。

```sql
CREATE TABLE likes (
    id              UUID PRIMARY KEY,
    user_id         UUID REFERENCES users(id),
    target_id       UUID,
    target_type     VARCHAR(20),
    created_at      TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);
```

**target_type 值:**
- `post` - 文章点赞
- `comment` - 评论点赞

---

### 5. bookmarks (收藏表)

存储用户收藏的文章。

```sql
CREATE TABLE bookmarks (
    id              UUID PRIMARY KEY,
    user_id         UUID REFERENCES users(id),
    post_id         UUID REFERENCES posts(id),
    folder_id       INTEGER REFERENCES bookmark_folders(id),
    notes           TEXT,
    created_at      TIMESTAMP
);
```

---

## 🔧 触发器

数据库包含自动维护触发器：

| 触发器 | 功能 |
|--------|------|
| `update_posts_updated_at` | 自动更新文章的 `updated_at` |
| `update_post_comment_count` | 自动更新文章评论数 |
| `update_post_like_count` | 自动更新文章点赞数 |
| `update_post_bookmark_count` | 自动更新文章收藏数 |
| `update_category_post_count` | 自动更新分类文章数 |
| `update_tag_post_count` | 自动更新标签文章数 |

---

## 📈 视图

### post_stats (文章统计视图)

```sql
CREATE VIEW post_stats AS
SELECT
    p.id,
    p.title,
    p.status,
    p.view_count,
    p.like_count,
    p.comment_count,
    u.username as author_username,
    c.name as category_name
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id;
```

### user_stats (用户统计视图)

```sql
CREATE VIEW user_stats AS
SELECT
    u.id,
    u.username,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT f1.follower_id) as follower_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
LEFT JOIN follows f1 ON u.id = f1.following_id
GROUP BY u.id;
```

---

## 🔍 全文搜索

使用 PostgreSQL 的全文搜索功能：

```sql
-- 文章搜索
SELECT * FROM posts
WHERE to_tsvector('simple', title || ' ' || content)
@@ plainto_tsquery('search term');

-- 用户搜索
SELECT * FROM users
WHERE to_tsvector('simple', username || ' ' || full_name)
@@ plainto_tsquery('search term');
```

---

## 📦 数据导入

### 从 WordPress 导入

```sql
-- 导入文章
INSERT INTO posts (title, slug, content, author_id, status, published_at)
SELECT
    post_title,
    post_name,
    post_content,
    (SELECT id FROM users WHERE email = wp_post_author_email),
    CASE post_status
        WHEN 'publish' THEN 'published'
        ELSE 'draft'
    END,
    post_date
FROM wp_posts;
```

---

## 🔐 备份策略

### 每日备份

```bash
pg_dump -U cyberpress_user -d cyberpress_db \
    -F c -b -v -f /backups/cyberpress_$(date +%Y%m%d).dump
```

### 恢复

```bash
pg_restore -U cyberpress_user -d cyberpress_db \
    -v /backups/cyberpress_20260306.dump
```

---

## 📊 性能优化

### 查询优化建议

1. **使用 EXPLAIN ANALYZE** 分析查询计划
2. **避免 SELECT *** 只查询需要的字段
3. **使用 LIMIT** 限制返回行数
4. **合理使用索引** 避免全表扫描

### 索引维护

```sql
-- 查看索引使用情况
SELECT * FROM pg_stat_user_indexes;

-- 重建索引
REINDEX INDEX idx_posts_slug;

-- 分析表统计信息
ANALYZE posts;
```

---

## 🔧 常用查询

### 获取热门文章

```sql
SELECT p.*, u.username, c.name as category_name
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published'
ORDER BY (p.view_count + p.like_count * 2 + p.comment_count * 3) DESC
LIMIT 10;
```

### 获取用户的关注动态

```sql
SELECT
    p.title,
    p.slug,
    u.username as author_name,
    p.published_at
FROM posts p
JOIN users u ON p.author_id = u.id
JOIN follows f ON f.following_id = u.id
WHERE f.follower_id = $1
    AND p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 20;
```

### 搜索文章

```sql
SELECT
    p.*,
    ts_rank_cd(
        to_tsvector('simple', p.title || ' ' || p.content),
        plainto_tsquery('simple', $1)
    ) as rank
FROM posts p
WHERE p.status = 'published'
    AND to_tsvector('simple', p.title || ' ' || p.content)
        @@ plainto_tsquery('simple', $1)
ORDER BY rank DESC
LIMIT 20;
```

---

## 📝 版本历史

| 版本 | 日期 | 变更 |
|------|------|------|
| 1.0.0 | 2026-03-06 | 初始架构设计 |

---

## 📞 支持

如有问题，请联系开发团队或查看项目文档。
