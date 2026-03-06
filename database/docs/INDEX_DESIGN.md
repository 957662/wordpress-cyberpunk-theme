# CyberPress Platform - 索引设计文档

## 索引设计原则

### 1. 选择性原则
- 为高选择性的列创建索引（唯一值多）
- 避免为低选择性列创建索引（如性别、状态）

### 2. 最左前缀原则
- 复合索引按照查询频率和选择性排列
- 最常用的列放在最左边

### 3. 覆盖索引原则
- 索引包含查询所需的所有字段
- 避免回表查询，提升性能

### 4. 避免过度索引
- 每个索引都会占用存储空间
- 写入操作需要维护索引，影响性能

## 核心索引设计

### 1. 用户表索引

```sql
-- 主键索引（自动创建）
PRIMARY KEY (id)

-- 唯一索引
UNIQUE KEY uk_username (username)
UNIQUE KEY uk_email (email)

-- 单列索引
CREATE INDEX idx_status ON users(status);
CREATE INDEX idx_created_at ON users(created_at);

-- 复合索引（用于用户列表查询）
CREATE INDEX idx_status_created ON users(status, created_at DESC);
CREATE INDEX idx_status_followers ON users(status, followers_count DESC);

-- 全文索引
CREATE FULLTEXT INDEX ft_search ON users(username, bio);
```

**查询优化场景**:
```sql
-- 1. 按状态和时间查询用户列表
SELECT * FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 20;
-- 使用索引: idx_status_created

-- 2. 按粉丝数查询热门用户
SELECT * FROM users
WHERE status = 'active'
ORDER BY followers_count DESC
LIMIT 10;
-- 使用索引: idx_status_followers

-- 3. 用户搜索
SELECT * FROM users
WHERE MATCH(username, bio) AGAINST('developer' IN NATURAL LANGUAGE MODE);
-- 使用索引: ft_search
```

### 2. 文章表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引
UNIQUE KEY uk_slug (slug)

-- 单列索引
CREATE INDEX idx_author ON posts(author_id);
CREATE INDEX idx_category ON posts(category_id);
CREATE INDEX idx_published_at ON posts(published_at);

-- 复合索引（核心查询优化）
CREATE INDEX idx_status_published ON posts(status, published_at DESC);
CREATE INDEX idx_author_status ON posts(author_id, status);
CREATE INDEX idx_category_published ON posts(category_id, status, published_at DESC);

-- 特色文章索引
CREATE INDEX idx_featured ON posts(is_featured, status, published_at DESC);

-- 热门文章索引
CREATE INDEX idx_trending ON posts(is_trending, status, view_count DESC);

-- 性能优化索引（用于列表查询）
CREATE INDEX idx_performance ON posts(status, published_at, view_count DESC);

-- 全文索引
CREATE FULLTEXT INDEX ft_content ON posts(title, content, excerpt);

-- 覆盖索引（避免回表）
CREATE INDEX idx_covering ON posts(status, published_at, author_id, title, slug, excerpt, view_count, like_count);
```

**查询优化场景**:
```sql
-- 1. 首页文章列表
SELECT id, title, slug, excerpt, author_id, view_count, like_count
FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 20;
-- 使用索引: idx_covering（无需回表）

-- 2. 作者文章列表
SELECT * FROM posts
WHERE author_id = 123 AND status = 'published'
ORDER BY published_at DESC;
-- 使用索引: idx_author_status

-- 3. 分类文章列表
SELECT * FROM posts
WHERE category_id = 5 AND status = 'published'
ORDER BY published_at DESC;
-- 使用索引: idx_category_published

-- 4. 特色文章
SELECT * FROM posts
WHERE is_featured = TRUE AND status = 'published'
ORDER BY published_at DESC;
-- 使用索引: idx_featured

-- 5. 热门文章
SELECT * FROM posts
WHERE is_trending = TRUE AND status = 'published'
ORDER BY view_count DESC;
-- 使用索引: idx_trending

-- 6. 全文搜索
SELECT *,
MATCH(title, content, excerpt) AGAINST('Next.js tutorial' IN NATURAL LANGUAGE MODE) AS score
FROM posts
WHERE MATCH(title, content, excerpt) AGAINST('Next.js tutorial' IN NATURAL LANGUAGE MODE)
ORDER BY score DESC;
-- 使用索引: ft_content
```

### 3. 评论表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 单列索引
CREATE INDEX idx_post ON comments(post_id);
CREATE INDEX idx_author ON comments(author_id);
CREATE INDEX idx_parent ON comments(parent_id);
CREATE INDEX idx_thread ON comments(thread_id);
CREATE INDEX idx_status ON comments(status);
CREATE INDEX idx_created_at ON comments(created_at);

-- 复合索引
CREATE INDEX idx_post_status ON comments(post_id, status, created_at DESC);
CREATE INDEX idx_post_thread ON comments(post_id, thread_id, created_at);

-- 性能优化索引
CREATE INDEX idx_performance ON comments(post_id, status, created_at, like_count DESC);
```

**查询优化场景**:
```sql
-- 1. 文章评论列表
SELECT * FROM comments
WHERE post_id = 123 AND status = 'approved'
ORDER BY created_at DESC;
-- 使用索引: idx_post_status

-- 2. 顶层评论（不含回复）
SELECT * FROM comments
WHERE post_id = 123 AND parent_id IS NULL AND status = 'approved'
ORDER BY like_count DESC;
-- 使用索引: idx_performance

-- 3. 评论回复
SELECT * FROM comments
WHERE thread_id = 456 AND status = 'approved'
ORDER BY created_at ASC;
-- 使用索引: idx_post_thread
```

### 4. 点赞表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引（防止重复点赞）
UNIQUE KEY uk_like (user_id, target_id, target_type)

-- 单列索引
CREATE INDEX idx_user ON likes(user_id);
CREATE INDEX idx_target ON likes(target_id, target_type);

-- 复合索引
CREATE INDEX idx_target_type ON likes(target_id, target_type, created_at DESC);
```

**查询优化场景**:
```sql
-- 1. 检查是否已点赞
SELECT * FROM likes
WHERE user_id = 123 AND target_id = 456 AND target_type = 'post';
-- 使用索引: uk_like

-- 2. 文章点赞列表
SELECT * FROM likes
WHERE target_id = 789 AND target_type = 'post'
ORDER BY created_at DESC;
-- 使用索引: idx_target_type

-- 3. 用户点赞历史
SELECT * FROM likes
WHERE user_id = 123
ORDER BY created_at DESC;
-- 使用索引: idx_user
```

### 5. 收藏表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引
UNIQUE KEY uk_bookmark (user_id, post_id)

-- 单列索引
CREATE INDEX idx_user ON bookmarks(user_id);
CREATE INDEX idx_post ON bookmarks(post_id);
CREATE INDEX idx_folder ON bookmarks(folder_id);
CREATE INDEX idx_created_at ON bookmarks(created_at DESC);

-- 复合索引
CREATE INDEX idx_user_folder ON bookmarks(user_id, folder_id, created_at DESC);
CREATE INDEX idx_user_created ON bookmarks(user_id, created_at DESC);
```

### 6. 阅读历史索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引
UNIQUE KEY uk_reading (user_id, post_id)

-- 单列索引
CREATE INDEX idx_user ON reading_history(user_id);
CREATE INDEX idx_post ON reading_history(post_id);
CREATE INDEX idx_last_read ON reading_history(last_read_at DESC);

-- 复合索引
CREATE INDEX idx_user_progress ON reading_history(user_id, is_completed, last_read_at DESC);
CREATE INDEX idx_user_completed ON reading_history(user_id, is_completed);
```

**查询优化场景**:
```sql
-- 1. 继续阅读（未完成的文章）
SELECT * FROM reading_history
WHERE user_id = 123 AND is_completed = FALSE
ORDER BY last_read_at DESC;
-- 使用索引: idx_user_progress

-- 2. 已读文章列表
SELECT * FROM reading_history
WHERE user_id = 123 AND is_completed = TRUE
ORDER BY last_read_at DESC;
-- 使用索引: idx_user_progress

-- 3. 文章阅读统计
SELECT COUNT(*) as total_readers,
AVG(progress_percent) as avg_progress
FROM reading_history
WHERE post_id = 456;
-- 使用索引: idx_post
```

### 7. 通知表索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 单列索引
CREATE INDEX idx_user ON notifications(user_id);
CREATE INDEX idx_sender ON notifications(sender_id);
CREATE INDEX idx_type ON notifications(type);
CREATE INDEX idx_created_at ON notifications(created_at DESC);

-- 复合索引（核心查询）
CREATE INDEX idx_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_user_type ON notifications(user_id, type, created_at DESC);
```

**查询优化场景**:
```sql
-- 1. 未读通知列表
SELECT * FROM notifications
WHERE user_id = 123 AND is_read = FALSE
ORDER BY created_at DESC
LIMIT 20;
-- 使用索引: idx_user_unread

-- 2. 按类型查询通知
SELECT * FROM notifications
WHERE user_id = 123 AND type = 'like'
ORDER BY created_at DESC;
-- 使用索引: idx_user_type

-- 3. 未读通知计数
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = 123 AND is_read = FALSE;
-- 使用索引: idx_user_unread
```

### 8. 文章浏览统计索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 单列索引
CREATE INDEX idx_post ON post_views(post_id);
CREATE INDEX idx_user ON post_views(user_id);
CREATE INDEX idx_session ON post_views(session_id);
CREATE INDEX idx_created_at ON post_views(created_at);

-- 复合索引（分区表优化）
CREATE INDEX idx_post_date ON post_views(post_id, created_at DESC);
CREATE INDEX idx_date_post ON post_views(created_at, post_id);
```

**查询优化场景**:
```sql
-- 1. 文章浏览量统计（按天）
SELECT DATE(created_at) as date, COUNT(*) as views
FROM post_views
WHERE post_id = 123
  AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(created_at);
-- 使用索引: idx_post_date，利用分区裁剪

-- 2. 用户浏览历史
SELECT * FROM post_views
WHERE user_id = 456
ORDER BY created_at DESC
LIMIT 20;
-- 使用索引: idx_user

-- 3. 热门文章统计（24小时）
SELECT post_id, COUNT(*) as views
FROM post_views
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
GROUP BY post_id
ORDER BY views DESC
LIMIT 10;
-- 使用索引: idx_created_at
```

### 9. 关注关系索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 唯一索引
UNIQUE KEY uk_follow (follower_id, following_id)

-- 单列索引
CREATE INDEX idx_follower ON followers(follower_id);
CREATE INDEX idx_following ON followers(following_id);
CREATE INDEX idx_created_at ON followers(created_at DESC);

-- 反向索引（查找关注者）
CREATE INDEX idx_following_created ON followers(following_id, created_at DESC);
```

**查询优化场景**:
```sql
-- 1. 关注列表
SELECT users.*
FROM followers
JOIN users ON followers.following_id = users.id
WHERE followers.follower_id = 123
ORDER BY followers.created_at DESC;
-- 使用索引: idx_follower

-- 2. 粉丝列表
SELECT users.*
FROM followers
JOIN users ON followers.follower_id = users.id
WHERE followers.following_id = 456
ORDER BY followers.created_at DESC;
-- 使用索引: idx_following_created

-- 3. 检查是否已关注
SELECT * FROM followers
WHERE follower_id = 123 AND following_id = 456;
-- 使用索引: uk_follow
```

### 10. 媒体文件索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 单列索引
CREATE INDEX idx_uploader ON media(uploader_id);
CREATE INDEX idx_post ON media(post_id);
CREATE INDEX idx_type ON media(media_type);
CREATE INDEX idx_status ON media(status);
CREATE INDEX idx_created_at ON media(created_at DESC);

-- 复合索引
CREATE INDEX idx_uploader_type ON media(uploader_id, media_type, created_at DESC);
CREATE INDEX idx_post_type ON media(post_id, media_type);
```

### 11. 分析事件索引

```sql
-- 主键索引
PRIMARY KEY (id)

-- 单列索引
CREATE INDEX idx_session ON analytics_events(session_id);
CREATE INDEX idx_user ON analytics_events(user_id);
CREATE INDEX idx_type ON analytics_events(event_type);
CREATE INDEX idx_created_at ON analytics_events(created_at DESC);

-- 复合索引
CREATE INDEX idx_session_type ON analytics_events(session_id, event_type, created_at);
CREATE INDEX idx_user_type ON analytics_events(user_id, event_type, created_at DESC);
CREATE INDEX idx_type_created ON analytics_events(event_type, created_at DESC);
```

## 索引维护策略

### 1. 定期分析表

```sql
-- MySQL
ANALYZE TABLE users;
ANALYZE TABLE posts;
ANALYZE TABLE comments;

-- PostgreSQL
ANALYZE users;
ANALYZE posts;
ANALYZE comments;
```

### 2. 优化表

```sql
-- MySQL
OPTIMIZE TABLE users;
OPTIMIZE TABLE posts;

-- PostgreSQL
VACUUM ANALYZE users;
VACUUM ANALYZE posts;
```

### 3. 监控索引使用情况

```sql
-- 查看未使用的索引
SELECT
    table_name,
    index_name,
    cardinality
FROM information_schema.statistics
WHERE table_schema = 'cyberpress'
ORDER BY cardinality DESC;

-- 查看索引大小
SELECT
    table_name,
    index_name,
    ROUND(stat_value * @@innodb_page_size / 1024 / 1024, 2) AS size_mb
FROM mysql.innodb_index_stats
WHERE database_name = 'cyberpress'
  AND stat_name = 'size'
ORDER BY size_mb DESC;
```

### 4. 删除冗余索引

定期检查并删除重复或未使用的索引：
```sql
-- 示例：删除重复的索引
-- DROP INDEX idx_old_index ON posts;
```

## 索引性能监控

### 1. 慢查询日志

```sql
-- 启用慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1; -- 1秒
```

### 2. 查询执行计划

```sql
-- 查看查询执行计划
EXPLAIN SELECT * FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 20;

EXPLAIN ANALYZE SELECT * FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 20;
```

### 3. 索引命中率

```sql
-- 查看索引使用情况
SHOW STATUS LIKE 'Handler_read%';
SHOW STATUS LIKE 'Innodb_buffer_pool_read%';
```

## 索引最佳实践

### ✅ DO（推荐）

1. **为 WHERE 子句中的列创建索引**
   ```sql
   CREATE INDEX idx_status ON posts(status);
   ```

2. **为 ORDER BY 子句中的列创建索引**
   ```sql
   CREATE INDEX idx_created_at ON posts(created_at DESC);
   ```

3. **创建复合索引时，考虑列的顺序**
   ```sql
   CREATE INDEX idx_status_created ON posts(status, published_at DESC);
   ```

4. **使用覆盖索引避免回表**
   ```sql
   CREATE INDEX idx_covering ON posts(status, published_at, title, slug);
   ```

### ❌ DON'T（不推荐）

1. **不要为低选择性的列创建索引**
   ```sql
   -- ❌ 不推荐（只有2个值）
   CREATE INDEX idx_gender ON users(gender);
   ```

2. **不要创建过多索引**
   ```sql
   -- ❌ 避免为每个列都创建索引
   ```

3. **不要在频繁更新的列上创建太多索引**
   ```sql
   -- ❌ 影响写入性能
   ```

4. **不要忽略索引维护**
   ```sql
   -- 定期 ANALYZE 和 OPTIMIZE 表
   ```

---

**创建时间**: 2026-03-07
**架构师**: AI Database Architect
**版本**: 1.0.0
