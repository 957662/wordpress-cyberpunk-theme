# CyberPress Platform - 数据库快速参考

## 📋 目录

- [常用命令](#常用命令)
- [查询示例](#查询示例)
- [性能优化](#性能优化)
- [故障排查](#故障排查)
- [最佳实践](#最佳实践)

---

## 常用命令

### 连接数据库

```bash
# 使用 psql 连接
psql -U postgres -d cyberpress_platform

# 从环境变量读取
psql $DATABASE_URL

# 连接到特定主机
psql -h localhost -p 5432 -U postgres -d cyberpress_platform
```

### 基本操作

```bash
# 查看所有表
\dt

# 查看表结构
\d posts

# 查看索引
\di

# 执行 SQL 文件
psql -U postgres -d cyberpress_platform -f script.sql

# 导出查询结果
psql -U postgres -d cyberpress_platform -c "SELECT * FROM users" -o output.csv
```

### 备份恢复

```bash
# 备份
pg_dump -U postgres cyberpress_platform > backup.sql

# 恢复
psql -U postgres cyberpress_platform < backup.sql

# 压缩备份
pg_dump -U postgres cyberpress_platform | gzip > backup.sql.gz

# 压缩恢复
gunzip -c backup.sql.gz | psql -U postgres cyberpress_platform
```

---

## 查询示例

### 用户查询

```sql
-- 获取用户列表（分页）
SELECT
    u.id,
    u.username,
    u.email,
    u.role,
    up.display_name,
    up.followers_count,
    up.posts_count
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.status = 'active'
ORDER BY u.created_at DESC
LIMIT 20 OFFSET 0;

-- 搜索用户
SELECT
    u.id,
    u.username,
    up.display_name
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.username ILIKE '%keyword%'
   OR up.display_name ILIKE '%keyword%'
LIMIT 20;

-- 获取用户统计
SELECT
    (SELECT COUNT(*) FROM users WHERE status = 'active') AS active_users,
    (SELECT COUNT(*) FROM users WHERE created_at > CURRENT_DATE - INTERVAL '7 days') AS new_users_week,
    (SELECT COUNT(*) FROM users WHERE created_at > CURRENT_DATE - INTERVAL '30 days') AS new_users_month;
```

### 文章查询

```sql
-- 获取已发布文章列表（分页）
SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.published_at,
    u.username AS author_name,
    up.display_name AS author_display_name,
    up.avatar_url AS author_avatar,
    COALESCE(json_agg(DISTINCT jsonb_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL), '[]') AS categories
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id
WHERE p.status = 'publish'
  AND p.deleted_at IS NULL
GROUP BY p.id, u.username, up.display_name, up.avatar_url
ORDER BY p.published_at DESC
LIMIT 20;

-- 获取特色文章
SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.featured_order,
    u.username AS author_name
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.status = 'publish'
  AND p.featured = true
  AND p.deleted_at IS NULL
ORDER BY p.featured_order ASC, p.published_at DESC;

-- 获取热门文章（按浏览量）
SELECT
    p.id,
    p.title,
    p.slug,
    p.view_count,
    p.like_count,
    p.comment_count,
    u.username AS author_name
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.status = 'publish'
  AND p.published_at > CURRENT_DATE - INTERVAL '30 days'
  AND p.deleted_at IS NULL
ORDER BY p.view_count DESC
LIMIT 10;

-- 搜索文章（全文搜索）
SELECT
    p.id,
    p.title,
    p.slug,
    ts_rank_cd(to_tsvector('chinese', p.title || ' ' || p.content), query) AS rank
FROM posts p,
     to_tsquery('chinese', '关键词') query
WHERE p.status = 'publish'
  AND p.deleted_at IS NULL
  AND to_tsvector('chinese', p.title || ' ' || p.content) @@ query
ORDER BY rank DESC
LIMIT 20;
```

### 评论查询

```sql
-- 获取文章评论
SELECT
    c.id,
    c.content,
    c.created_at,
    u.username,
    up.display_name,
    up.avatar_url,
    c.like_count,
    (SELECT COUNT(*) FROM comments WHERE parent_id = c.id) AS reply_count
FROM comments c
LEFT JOIN users u ON c.author_id = u.id
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE c.post_id = $1
  AND c.status = 'approved'
  AND c.parent_id IS NULL
ORDER BY c.created_at DESC;

-- 获取最新评论
SELECT
    c.id,
    c.content,
    c.created_at,
    p.title AS post_title,
    p.slug AS post_slug,
    u.username AS author_name
FROM comments c
LEFT JOIN posts p ON c.post_id = p.id
LEFT JOIN users u ON c.author_id = u.id
WHERE c.status = 'approved'
ORDER BY c.created_at DESC
LIMIT 10;
```

### 统计查询

```sql
-- 仪表板统计
SELECT
    (SELECT COUNT(*) FROM posts WHERE status = 'publish') AS total_posts,
    (SELECT COUNT(*) FROM users WHERE status = 'active') AS total_users,
    (SELECT COUNT(*) FROM comments WHERE status = 'approved') AS total_comments,
    (SELECT COUNT(*) FROM page_views WHERE created_at > CURRENT_DATE) AS today_views,
    (SELECT SUM(view_count) FROM posts) AS total_views;

-- 文章分类统计
SELECT
    c.id,
    c.name,
    c.slug,
    c.post_count,
    COUNT(p.id) AS actual_count
FROM categories c
LEFT JOIN post_categories pc ON c.id = pc.category_id
LEFT JOIN posts p ON pc.post_id = p.id AND p.status = 'publish'
GROUP BY c.id, c.name, c.slug, c.post_count
ORDER BY c.post_count DESC;

-- 用户活跃度统计
SELECT
    u.id,
    u.username,
    up.display_name,
    (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND status = 'publish') AS post_count,
    (SELECT COUNT(*) FROM comments WHERE author_id = u.id) AS comment_count,
    (SELECT COUNT(*) FROM user_follows WHERE following_id = u.id) AS follower_count
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.status = 'active'
ORDER BY post_count DESC
LIMIT 20;
```

---

## 性能优化

### 使用 EXPLAIN ANALYZE

```sql
-- 分析查询性能
EXPLAIN ANALYZE
SELECT * FROM posts WHERE status = 'publish' ORDER BY published_at DESC LIMIT 10;

-- 详细分析
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT p.*, u.username
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.status = 'publish';
```

### 批量操作

```sql
-- 批量插入
INSERT INTO posts (author_id, title, slug, content, status)
VALUES
    (1, 'Title 1', 'title-1', 'Content 1', 'publish'),
    (2, 'Title 2', 'title-2', 'Content 2', 'publish'),
    (3, 'Title 3', 'title-3', 'Content 3', 'publish');

-- 批量更新
UPDATE posts
SET view_count = view_count + 1
WHERE id IN (1, 2, 3, 4, 5);
```

### 使用 CTE (WITH 子句)

```sql
-- 获取作者及其文章统计
WITH author_stats AS (
    SELECT
        author_id,
        COUNT(*) AS post_count,
        SUM(view_count) AS total_views
    FROM posts
    WHERE status = 'publish'
    GROUP BY author_id
)
SELECT
    u.username,
    up.display_name,
    COALESCE(ast.post_count, 0) AS post_count,
    COALESCE(ast.total_views, 0) AS total_views
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN author_stats ast ON u.id = ast.author_id
WHERE u.status = 'active'
ORDER BY post_count DESC;
```

### 使用物化视图

```sql
-- 创建物化视图
CREATE MATERIALIZED VIEW popular_posts AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.view_count,
    p.like_count,
    p.comment_count,
    u.username AS author_name,
    (p.view_count * 0.5 + p.like_count * 0.3 + p.comment_count * 0.2) AS popularity_score
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.status = 'publish'
  AND p.published_at > CURRENT_DATE - INTERVAL '30 days'
ORDER BY popularity_score DESC;

-- 刷新物化视图
REFRESH MATERIALIZED VIEW popular_posts;
```

---

## 故障排查

### 检查连接问题

```sql
-- 查看当前连接
SELECT
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    state_change
FROM pg_stat_activity
ORDER BY state_change;

-- 查看阻塞的查询
SELECT
    pid,
    usename,
    pg_blocking_pids(pid) AS blocked_by,
    query AS blocked_query
FROM pg_stat_activity
WHERE cardinality(pg_blocking_pids(pid)) > 0;
```

### 检查慢查询

```sql
-- 启用慢查询日志
ALTER SYSTEM SET log_min_duration_statement = 1000; -- 1秒
SELECT pg_reload_conf();

-- 查看长时间运行的查询
SELECT
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query,
    state
FROM pg_stat_activity
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
```

### 检查表膨胀

```sql
-- 检查表膨胀
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 检查索引使用

```sql
-- 查找未使用的索引
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE '%_pkey'
ORDER BY schemaname, tablename;
```

---

## 最佳实践

### 1. 使用事务

```sql
BEGIN;
  INSERT INTO posts (author_id, title, content) VALUES (1, 'Title', 'Content');
  INSERT INTO post_categories (post_id, category_id) VALUES (currval('posts_id_seq'), 1);
COMMIT;

-- 或回滚
-- ROLLBACK;
```

### 2. 使用参数化查询

```javascript
// 好（防止 SQL 注入）
db.query('SELECT * FROM users WHERE id = $1', [userId]);

// 坏（SQL 注入风险）
db.query(`SELECT * FROM users WHERE id = ${userId}`);
```

### 3. 合理使用索引

```sql
-- 为常用查询条件创建索引
CREATE INDEX idx_posts_status_published
ON posts(status, published_at DESC)
WHERE status = 'publish';

-- 为外键创建索引
CREATE INDEX idx_comments_post_id
ON comments(post_id);
```

### 4. 定期维护

```sql
-- 每周运行
VACUUM ANALYZE;

-- 每月运行
VACUUM FULL ANALYZE;
REINDEX DATABASE cyberpress_platform;
```

### 5. 监控查询性能

```sql
-- 创建日志表
CREATE TABLE query_log (
    id BIGSERIAL PRIMARY KEY,
    query_text TEXT,
    execution_time INT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 记录慢查询
INSERT INTO query_log (query_text, execution_time)
SELECT query, mean_time
FROM pg_stat_statements
WHERE mean_time > 1000;
```

### 6. 使用连接池

```ini
# pgbouncer.ini
[databases]
cyberpress_platform = host=localhost port=5432 dbname=cyberpress_platform

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 100
server_idle_timeout = 600
```

### 7. 分区大表

```sql
-- 按月分区 page_views
CREATE TABLE page_views_2026_04 PARTITION OF page_views
FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
```

### 8. 定期备份

```bash
# 每日备份
0 2 * * * pg_dump -U postgres cyberpress_platform | gzip > /backup/cyberpress_$(date +\%Y\%m\%d).sql.gz
```

---

## 常见问题解决

### 问题：连接数过多

```sql
-- 终止空闲连接
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < CURRENT_TIMESTAMP - INTERVAL '10 minutes';
```

### 问题：表膨胀

```sql
-- 清理表
VACUUM FULL ANALYZE posts;
```

### 问题：查询慢

```sql
-- 分析查询
EXPLAIN ANALYZE SELECT ...;

-- 更新统计信息
ANALYZE posts;
```

### 问题：锁等待

```sql
-- 查看锁等待
SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock';

-- 终止长时间运行的查询
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE query_start < NOW() - INTERVAL '1 hour';
```

---

**文档版本**: v1.0
**最后更新**: 2026-03-05
**维护者**: CyberPress Team
