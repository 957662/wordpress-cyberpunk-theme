# CyberPress Platform - 数据库架构设计

## 数据库概述

**数据库类型**: PostgreSQL 15+
**字符集**: UTF-8
**时区**: UTC

## ER 图

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   users     │         │   posts     │         │  comments   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │──┐    ┌──│ id (PK)     │──┐    ┌──│ id (PK)     │
│ username    │  │    │  │ title       │  │    │  │ content     │
│ email       │  │    │  │ slug        │  │    │  │ user_id     │
│ password    │  │    │  │ content     │  │    │  │ post_id     │
│ avatar_url  │  │    │  │ author_id   │◄─┘    │  │ created_at  │
│ bio         │  │    │  │ status      │        └─────────────┘
│ created_at  │  │    │  │ created_at  │              │
└─────────────┘  │    │  └─────────────┘              │
                 │    │                               │
┌─────────────┐  │    │    ┌─────────────┐           │
│  follows    │  │    │    │   likes     │           │
├─────────────┤  │    │    ├─────────────┤           │
│ id (PK)     │  │    │    │ id (PK)     │           │
│ follower_id │◄─┘    │    │ user_id     │           │
│ following_id│◄───────┘    │ post_id     │◄───────────┘
│ created_at  │       │    │ created_at  │
└─────────────┘       │    └─────────────┘
                      │
┌─────────────┐       │    ┌─────────────┐
│ categories  │       │    │    tags     │
├─────────────┤       │    ├─────────────┤
│ id (PK)     │       │    │ id (PK)     │
│ name        │       │    │ name        │
│ slug        │       │    │ slug        │
│ description │       │    └─────────────┘
└─────────────┘       │              │
                      │              │
                ┌─────────┐    ┌─────────┐
                │post_tags│    │post_cat │
                ├─────────┤    ├─────────┤
                │post_id  │    │post_id  │
                │tag_id   │    │cat_id   │
                └─────────┘    └─────────┘
```

## 表结构详解

### 1. 用户表 (users)

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(100),
    birth_date DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    role VARCHAR(20) DEFAULT 'user', -- 'admin', 'editor', 'user'
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 全文搜索索引
CREATE INDEX idx_users_search ON users USING gin(
    to_tsvector('simple',
        COALESCE(username, '') || ' ' ||
        COALESCE(display_name, '') || ' ' ||
        COALESCE(bio, '')
    )
);
```

### 2. 文章表 (posts)

```sql
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image VARCHAR(500),
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    post_type VARCHAR(20) DEFAULT 'post', -- 'post', 'page', 'portfolio'
    comment_status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed'
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    comment_count BIGINT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    reading_time INT, -- in minutes
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 索引
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_view_count ON posts(view_count DESC);
CREATE INDEX idx_posts_like_count ON posts(like_count DESC);

-- 全文搜索索引
CREATE INDEX idx_posts_search ON posts USING gin(
    to_tsvector('english',
        COALESCE(title, '') || ' ' ||
        COALESCE(content, '') || ' ' ||
        COALESCE(excerpt, '')
    )
);

-- 复合索引
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC);
CREATE INDEX idx_posts_author_status ON posts(author_id, status);
```

### 3. 评论表 (comments)

```sql
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_name VARCHAR(100),
    author_email VARCHAR(255),
    author_ip VARCHAR(45),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'spam', 'trash'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_user ON comments(user_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
```

### 4. 分类表 (categories)

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INT REFERENCES categories(id) ON DELETE SET NULL,
    icon VARCHAR(50),
    color VARCHAR(7), -- hex color
    sort_order INT DEFAULT 0,
    post_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_sort ON categories(sort_order);
```

### 5. 标签表 (tags)

```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    post_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);
```

### 6. 文章标签关联表 (post_tags)

```sql
CREATE TABLE post_tags (
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

-- 索引
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
```

### 7. 关注表 (follows)

```sql
CREATE TABLE follows (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- 索引
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- 检查约束
ALTER TABLE follows ADD CONSTRAINT check_not_self_follow
    CHECK (follower_id != following_id);
```

### 8. 点赞表 (likes)

```sql
CREATE TABLE likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 索引
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_post ON likes(post_id);
CREATE INDEX idx_likes_created_at ON likes(created_at DESC);
```

### 9. 收藏表 (bookmarks)

```sql
CREATE TABLE bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    folder_id INT REFERENCES bookmark_folders(id) ON DELETE SET NULL,
    notes TEXT,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 索引
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_folder ON bookmarks(folder_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
```

### 10. 收藏夹表 (bookmark_folders)

```sql
CREATE TABLE bookmark_folders (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    is_public BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_bookmark_folders_user ON bookmark_folders(user_id);
```

### 11. 通知表 (notifications)

```sql
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'follow', 'like', 'comment', 'mention', 'system'
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT FALSE,
    data JSONB, -- 存储额外的结构化数据
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
```

### 12. 阅读列表表 (reading_list)

```sql
CREATE TABLE reading_list (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    progress INT DEFAULT 0, -- 阅读进度 0-100
    is_completed BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 索引
CREATE INDEX idx_reading_list_user ON reading_list(user_id);
CREATE INDEX idx_reading_list_progress ON reading_list(progress);
```

### 13. 活动日志表 (activity_logs)

```sql
CREATE TABLE activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'login', 'logout', 'create_post', 'update_profile', etc.
    entity_type VARCHAR(50), -- 'post', 'comment', 'user', etc.
    entity_id BIGINT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
```

### 14. 搜索历史表 (search_history)

```sql
CREATE TABLE search_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    query VARCHAR(255) NOT NULL,
    results_count INT DEFAULT 0,
    clicked_post_id BIGINT REFERENCES posts(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_search_history_user ON search_history(user_id);
CREATE INDEX idx_search_history_query ON search_history(query);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);
```

## 触发器

### 更新时间戳触发器

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用到相关表
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 更新文章统计触发器

```sql
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'likes' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'comments' THEN
        IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
            UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'UPDATE' AND OLD.status != 'approved' AND NEW.status = 'approved' THEN
            UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'UPDATE' AND OLD.status = 'approved' AND NEW.status != 'approved' THEN
            UPDATE posts SET comment_count = comment_count - 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
            UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_like_counts
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER update_post_comment_counts
    AFTER INSERT OR UPDATE OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();
```

## 视图

### 文章详情视图

```sql
CREATE VIEW posts_view AS
SELECT
    p.*,
    u.username AS author_username,
    u.display_name AS author_name,
    u.avatar_url AS author_avatar,
    c.name AS category_name,
    c.slug AS category_slug,
    c.color AS category_color,
    COALESCE(json_agg(DISTINCT t.name) FILTER (WHERE t.id IS NOT NULL), '[]') AS tags
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id, u.username, u.display_name, u.avatar_url, c.name, c.slug, c.color;
```

### 用户统计视图

```sql
CREATE VIEW user_stats_view AS
SELECT
    u.id,
    u.username,
    u.display_name,
    u.avatar_url,
    u.bio,
    u.created_at,
    COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'published') AS post_count,
    COUNT(DISTINCT f.id) FILTER (WHERE f.following_id = u.id) AS follower_count,
    COUNT(DISTINCT f.id) FILTER (WHERE f.follower_id = u.id) AS following_count,
    COUNT(DISTINCT l.id) AS total_likes_received
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
LEFT JOIN follows f ON u.id = f.follower_id OR u.id = f.following_id
LEFT JOIN likes l ON p.id = l.post_id
GROUP BY u.id;
```

## 数据库性能优化建议

1. **连接池配置**:
   - 使用 pgBouncer 或类似工具
   - 建议连接池大小: CPU 核心数 * 2

2. **查询优化**:
   - 使用 EXPLAIN ANALYZE 分析慢查询
   - 为常用查询条件创建适当的索引
   - 使用 prepared statements

3. **缓存策略**:
   - 使用 Redis 缓存热点数据
   - 缓存用户会话、文章统计等

4. **分区策略** (当数据量很大时):
   - 按时间分区 posts 表
   - 按用户分区 activity_logs 表

5. **定期维护**:
   ```sql
   -- 定期分析表以更新统计信息
   ANALYZE posts;
   ANALYZE users;

   -- 定期清理死行
   VACUUM ANALYZE posts;

   -- 重建索引
   REINDEX TABLE posts;
   ```

## 备份策略

1. **日常备份**:
   ```bash
   # 全量备份
   pg_dump -U username -d cyberpress -F c -f backup_$(date +%Y%m%d).dump

   # 只备份结构
   pg_dump -U username -d cyberpress --schema-only -f schema.sql

   # 只备份特定表
   pg_dump -U username -d cyberpress -t posts -t users -f specific_tables.sql
   ```

2. **恢复备份**:
   ```bash
   # 恢复全量备份
   pg_restore -U username -d cyberpress -c backup_20240101.dump
   ```

## 安全建议

1. **用户权限**:
   ```sql
   -- 创建只读用户
   CREATE USER cyberpress_readonly WITH PASSWORD 'secure_password';
   GRANT CONNECT ON DATABASE cyberpress TO cyberpress_readonly;
   GRANT USAGE ON SCHEMA public TO cyberpress_readonly;
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyberpress_readonly;

   -- 创建应用用户
   CREATE USER cyberpress_app WITH PASSWORD 'secure_password';
   GRANT CONNECT ON DATABASE cyberpress TO cyberpress_app;
   GRANT USAGE ON SCHEMA public TO cyberpress_app;
   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cyberpress_app;
   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cyberpress_app;
   ```

2. **敏感数据加密**:
   - 密码使用 bcrypt 哈希
   - 考虑使用 pgcrypto 扩展加密敏感字段

3. **SQL 注入防护**:
   - 始终使用参数化查询
   - 在应用层进行输入验证
