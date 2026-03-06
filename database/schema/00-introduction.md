# 🎯 CyberPress 数据库架构设计

> 这是一个完整的 PostgreSQL 数据库架构，专为 CyberPress 博客平台设计

## 📊 架构概览

本数据库采用 PostgreSQL 15+ 设计，包含以下核心功能模块：

### 1. 核心内容系统
- **用户管理** - 用户账户、角色、权限
- **文章系统** - 博客文章、页面、作品集
- **分类标签** - 内容分类和组织
- **评论系统** - 用户评论和互动

### 2. 社交功能系统
- **点赞系统** - 文章、评论点赞
- **收藏系统** - 书签和收藏夹
- **关注系统** - 用户关注和粉丝
- **通知系统** - 实时通知推送

### 3. 分析追踪系统
- **阅读进度** - 文章阅读进度追踪
- **数据统计** - 页面访问、用户行为
- **审计日志** - 系统操作审计

## 🗂️ 表结构设计

### 核心表 (10个)

```sql
-- 用户表
users (id, username, email, password_hash, role, status, created_at, updated_at)

-- 文章表
posts (id, author_id, title, slug, content, excerpt, status, view_count, comment_count, like_count, created_at, updated_at, published_at)

-- 分类表
categories (id, name, slug, description, parent_id, sort_order, post_count, created_at, updated_at)

-- 标签表
tags (id, name, slug, color, post_count, created_at, updated_at)

-- 评论表
comments (id, post_id, author_id, parent_id, content, status, like_count, created_at, updated_at)

-- 媒体表
media (id, file_name, file_path, file_url, file_size, mime_type, width, height, alt_text, uploaded_by, created_at)

-- 作品集表
portfolios (id, author_id, title, slug, description, content, project_url, github_url, thumbnail_url, status, sort_order, created_at, updated_at)

-- 页面表
pages (id, title, slug, content, excerpt, template, status, meta_title, meta_description, created_at, updated_at)

-- 设置表
settings (id, key, value, type, category, description, updated_at)

-- 分析表
analytics (id, post_id, user_id, session_id, action_type, duration, ip_address, user_agent, referrer, created_at)
```

### 社交功能表 (4个)

```sql
-- 点赞表
likes (id, user_id, target_type, target_id, created_at)

-- 收藏表
bookmarks (id, user_id, post_id, folder, note, created_at, updated_at)

-- 关注表
follows (id, follower_id, following_id, created_at)

-- 通知表
notifications (id, user_id, type, title, content, action_url, is_read, created_at, read_at)
```

### 扩展功能表 (3个)

```sql
-- 阅读进度表
reading_progress (id, user_id, post_id, progress_percent, last_position, completed, reading_time, created_at, updated_at)

-- 审计日志表
audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at)

-- 关系表
post_categories (post_id, category_id)

post_tags (post_id, tag_id)
```

## 🔍 索引策略

### 性能优化索引

```sql
-- 用户表
CREATE UNIQUE INDEX idx_users_username ON users(username);
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);

-- 文章表
CREATE UNIQUE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_view_count ON posts(view_count DESC);
CREATE INDEX idx_posts_like_count ON posts(like_count DESC);
CREATE FULLTEXT INDEX idx_posts_fulltext ON posts(title, content);

-- 评论表
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 点赞表
CREATE UNIQUE INDEX idx_likes_unique ON likes(user_id, target_type, target_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);

-- 收藏表
CREATE UNIQUE INDEX idx_bookmarks_user_post ON bookmarks(user_id, post_id);
CREATE INDEX idx_bookmarks_folder ON bookmarks(user_id, folder);

-- 关注表
CREATE UNIQUE INDEX idx_follows_unique ON follows(follower_id, following_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- 通知表
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- 阅读进度表
CREATE UNIQUE INDEX idx_reading_progress_user_post ON reading_progress(user_id, post_id);
CREATE INDEX idx_reading_progress_user_id ON reading_progress(user_id);
```

## 🔐 安全设计

### 数据加密
- 密码使用 bcrypt 哈希
- 敏感数据使用 AES 加密
- API Token 使用 JWT

### 访问控制
- 基于角色的访问控制 (RBAC)
- 行级安全策略 (RLS)
- IP 白名单

### 审计追踪
- 所有数据变更记录
- 敏感操作日志
- 异常行为监控

## 📈 性能优化

### 查询优化
- 物化视图用于热门内容
- 分区表用于历史数据
- 连接池配置优化

### 缓存策略
- Redis 缓存热门文章
- 查询结果缓存
- 静态数据缓存

### 数据维护
- 定期 VACUUM 和 ANALYZE
- 索引重建
- 分区表维护

## 🚀 部署建议

### 生产环境配置
```ini
# postgresql.conf
shared_buffers = 4GB
effective_cache_size = 12GB
maintenance_work_mem = 1GB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
max_worker_processes = 8
max_parallel_workers_per_gather = 4
max_parallel_workers = 8
max_parallel_maintenance_workers = 4
```

### 备份策略
- 每日增量备份
- 每周完整备份
- 异地备份存储
- 备份恢复演练

## 📚 相关文档

- [完整架构 SQL](./01-init-database-postgres.sql)
- [ER 图说明](./er-diagram.md)
- [表结构参考](./tables-reference.md)
- [初始化脚本](./init.sh)

---

**版本**: 1.0.0
**创建日期**: 2026-03-07
**维护者**: AI Development Team
