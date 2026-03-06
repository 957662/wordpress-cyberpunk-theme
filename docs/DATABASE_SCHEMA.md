# CyberPress Platform - 数据库架构设计

> PostgreSQL 数据库设计文档
>
> 生成时间: 2026-03-06

## 📊 数据库概述

CyberPress Platform 使用 PostgreSQL 15+ 作为主要数据库，采用规范化的关系型设计，支持完整的博客系统功能。

### 设计原则

- **规范化设计**：遵循第三范式（3NF），减少数据冗余
- **性能优化**：合理使用索引，优化查询性能
- **扩展性**：预留扩展字段，支持未来功能迭代
- **数据完整性**：使用外键约束，确保数据一致性

---

## 📋 数据库表结构

### 1. 用户表 (users)

存储用户基本信息和认证数据。

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    website VARCHAR(500),
    location VARCHAR(100),
    birth_date DATE,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

### 2. 分类表 (categories)

博客文章分类。

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    icon VARCHAR(50),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
```

### 3. 标签表 (tags)

博客文章标签。

```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(20),
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_post_count ON tags(post_count DESC);
CREATE INDEX idx_tags_name ON tags(name);
```

### 4. 文章表 (posts)

核心文章数据。

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image VARCHAR(500),
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    comment_status VARCHAR(20) DEFAULT 'open' CHECK (comment_status IN ('open', 'closed')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    read_time INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_views_count ON posts(views_count DESC);
CREATE INDEX idx_posts_likes_count ON posts(likes_count DESC);
CREATE INDEX idx_posts_is_featured ON posts(is_featured);
CREATE INDEX idx_posts_is_pinned ON posts(is_pinned);

-- 全文搜索索引
CREATE INDEX idx_posts_content_search ON posts USING gin(to_tsvector('english', title || ' ' || content));
```

### 5. 文章标签关联表 (post_tags)

文章与标签的多对多关系。

```sql
CREATE TABLE post_tags (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, tag_id)
);

-- 索引
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);
```

### 6. 评论表 (comments)

文章评论数据。

```sql
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
    likes_count INTEGER DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
```

### 7. 点赞表 (likes)

用户点赞记录。

```sql
CREATE TABLE likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

-- 索引
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);
CREATE INDEX idx_likes_created_at ON likes(created_at DESC);
```

### 8. 收藏表 (bookmarks)

用户收藏记录。

```sql
CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    folder_name VARCHAR(50) DEFAULT 'default',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 索引
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX idx_bookmarks_folder ON bookmarks(user_id, folder_name);
```

### 9. 关注表 (follows)

用户关注关系。

```sql
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- 索引
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
```

### 10. 通知表 (notifications)

系统通知。

```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

### 11. 活动流表 (activities)

用户活动记录。

```sql
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    target_type VARCHAR(50),
    target_id INTEGER,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_target ON activities(target_type, target_id);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
```

### 12. 会话表 (sessions)

用户会话管理。

```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### 13. 密码重置表 (password_resets)

密码重置令牌。

```sql
CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_expires_at ON password_resets(expires_at);
```

---

## 🔧 触发器和函数

### 自动更新 updated_at 字段

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 应用到所有需要的表
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 更新文章计数

```sql
CREATE OR REPLACE FUNCTION update_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- 更新分类文章数
        IF NEW.category_id IS NOT NULL THEN
            UPDATE categories
            SET post_count = post_count + 1
            WHERE id = NEW.category_id;
        END IF;

        -- 更新标签文章数
        IF TG_TABLE_NAME = 'post_tags' THEN
            UPDATE tags
            SET post_count = post_count + 1
            WHERE id = NEW.tag_id;
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        -- 更新分类文章数
        IF OLD.category_id IS NOT NULL THEN
            UPDATE categories
            SET post_count = post_count - 1
            WHERE id = OLD.category_id;
        END IF;

        -- 更新标签文章数
        IF TG_TABLE_NAME = 'post_tags' THEN
            UPDATE tags
            SET post_count = post_count - 1
            WHERE id = OLD.tag_id;
        END IF;

    ELSIF TG_OP = 'UPDATE' THEN
        -- 更新分类文章数
        IF NEW.category_id != OLD.category_id THEN
            IF OLD.category_id IS NOT NULL THEN
                UPDATE categories
                SET post_count = post_count - 1
                WHERE id = OLD.category_id;
            END IF;
            IF NEW.category_id IS NOT NULL THEN
                UPDATE categories
                SET post_count = post_count + 1
                WHERE id = NEW.category_id;
            END IF;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_post_counts
    AFTER INSERT OR UPDATE OR DELETE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();

CREATE TRIGGER trigger_update_tag_counts
    AFTER INSERT OR DELETE ON post_tags
    FOR EACH ROW EXECUTE FUNCTION update_post_counts();
```

### 更新评论计数

```sql
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts
        SET comments_count = comments_count + 1
        WHERE id = NEW.post_id;

    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts
        SET comments_count = comments_count - 1
        WHERE id = OLD.post_id;
    END IF;

    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_comment_counts
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_comment_counts();
```

---

## 📁 初始化数据脚本

### 插入默认管理员用户

```sql
INSERT INTO users (username, email, password_hash, role, is_verified) VALUES
('admin', 'admin@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc4i', 'admin', TRUE);
-- 密码: admin123
```

### 插入默认分类

```sql
INSERT INTO categories (name, slug, description, sort_order) VALUES
('技术', 'tech', '技术相关文章', 1),
('设计', 'design', '设计相关文章', 2),
('教程', 'tutorial', '教程和指南', 3),
('资源', 'resources', '资源分享', 4),
('思考', 'thoughts', '思考和感悟', 5);
```

### 插入默认标签

```sql
INSERT INTO tags (name, slug) VALUES
('React', 'react'),
('Next.js', 'nextjs'),
('TypeScript', 'typescript'),
('Python', 'python'),
('FastAPI', 'fastapi'),
('UI/UX', 'ui-ux'),
('Database', 'database'),
('DevOps', 'devops');
```

---

## 🚀 性能优化建议

### 1. 定期维护

```sql
-- 定期VACUUM和ANALYZE
VACUUM ANALYZE;

-- 重建索引
REINDEX DATABASE CONCURRENTLY cyberpress;
```

### 2. 分区策略

对于大型数据集，考虑按时间分区：

```sql
-- 按月分区posts表
CREATE TABLE posts_2026_03 PARTITION OF posts
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
```

### 3. 查询优化

```sql
-- 使用EXPLAIN ANALYZE分析查询
EXPLAIN ANALYZE SELECT * FROM posts WHERE status = 'published';

-- 创建部分索引
CREATE INDEX idx_posts_published
    ON posts(published_at DESC)
    WHERE status = 'published';
```

---

## 🔐 安全建议

1. **使用准备语句**：防止SQL注入
2. **最小权限原则**：应用用户只授予必要权限
3. **定期备份**：每日自动备份数据库
4. **加密敏感数据**：使用pgcrypto扩展
5. **审计日志**：记录关键操作

---

## 📚 扩展阅读

- [PostgreSQL 官方文档](https://www.postgresql.org/docs/)
- [数据库设计最佳实践](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [性能优化指南](https://www.postgresql.org/docs/current/performance-tips.html)

---

**文档版本**: 1.0.0
**最后更新**: 2026-03-06
