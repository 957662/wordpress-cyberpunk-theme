# CyberPress Platform - 数据库优化指南

## 📋 目录
- [查询优化](#查询优化)
- [索引优化](#索引优化)
- [表结构优化](#表结构优化)
- [缓存策略](#缓存策略)
- [分区策略](#分区策略)
- [监控与维护](#监控与维护)
- [性能测试](#性能测试)

---

## 查询优化

### 1. 查询分析工具

```sql
-- 使用 EXPLAIN ANALYZE 分析查询
EXPLAIN ANALYZE
SELECT p.title, p.slug, u.name
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 10;

-- 详细分析（包含缓冲区使用）
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT * FROM posts WHERE status = 'published';

-- 查看查询执行计划
EXPLAIN (FORMAT JSON)
SELECT * FROM comments WHERE post_id = '...';
```

### 2. 常见查询优化

#### 优化前：N+1 查询问题
```sql
-- 低效：为每个文章单独查询评论
SELECT * FROM posts WHERE status = 'published';
-- 然后对每个文章执行：
SELECT * FROM comments WHERE post_id = ?;
```

#### 优化后：使用 JOIN
```sql
-- 高效：一次性获取所有数据
SELECT
    p.*,
    COUNT(c.id) as comment_count,
    COUNT(DISTINCT cl.user_id) as like_count
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id AND c.status = 'approved'
LEFT JOIN comment_likes cl ON c.id = cl.comment_id
WHERE p.status = 'published'
GROUP BY p.id
ORDER BY p.published_at DESC
LIMIT 10;
```

### 3. 分页查询优化

```sql
-- 传统分页（深分页性能差）
SELECT * FROM posts
ORDER BY published_at DESC
LIMIT 10 OFFSET 1000;

-- 优化：使用游标分页
SELECT * FROM posts
WHERE published_at < '2024-01-01 12:00:00'
ORDER BY published_at DESC
LIMIT 10;

-- 更优化：使用覆盖索引
SELECT id, title, slug, published_at
FROM posts
WHERE status = 'published'
ORDER BY published_at DESC
LIMIT 10 OFFSET 1000;
```

### 4. 全文搜索优化

```sql
-- 使用 ts_rank 进行相关性排序
SELECT
    p.*,
    ts_rank(
        to_tsvector('english', p.title || ' ' || p.content),
        to_tsquery('english', 'react & nextjs')
    ) as rank
FROM posts p
WHERE to_tsvector('english', p.title || ' ' || p.content)
    @@ to_tsquery('english', 'react & nextjs')
    AND p.status = 'published'
ORDER BY rank DESC, p.published_at DESC
LIMIT 20;

-- 使用 ts_headline 高亮搜索结果
SELECT
    title,
    ts_headline('english', content, to_tsquery('english', 'database'), 'MaxWords=50') as highlight
FROM posts
WHERE to_tsvector('english', title || ' ' || content)
    @@ to_tsquery('english', 'database');
```

### 5. 聚合查询优化

```sql
-- 使用物化视图缓存复杂聚合
CREATE MATERIALIZED VIEW daily_stats AS
SELECT
    DATE(created_at) as date,
    COUNT(*) as total_views,
    COUNT(DISTINCT post_id) as unique_posts,
    COUNT(DISTINCT session_id) as unique_sessions
FROM page_views
GROUP BY DATE(created_at);

-- 定期刷新物化视图
REFRESH MATERIALIZED VIEW daily_stats;

-- 创建索引加速查询
CREATE INDEX ON daily_stats(date);
```

---

## 索引优化

### 1. 索引使用监控

```sql
-- 查看索引使用统计
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan ASC;

-- 查找未使用的索引
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
    AND indexname NOT LIKE '%_pkey'
    AND indexname NOT LIKE '%_unique'
ORDER BY pg_relation_size(indexrelid) DESC;

-- 删除未使用的索引
-- DROP INDEX IF EXISTS idx_unused_index;
```

### 2. 索引大小优化

```sql
-- 查看表和索引大小
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 重建碎片化的索引
REINDEX INDEX CONCURRENTLY idx_posts_search;
```

### 3. 复合索引优化

```sql
-- 为常见查询模式创建复合索引
CREATE INDEX idx_posts_home_list ON posts(status, published_at DESC, view_count DESC)
INCLUDE (title, slug, featured_image)
WHERE status = 'published';

-- 使用复合索引的查询示例
SELECT title, slug, featured_image, published_at, view_count
FROM posts
WHERE status = 'published'
ORDER BY published_at DESC, view_count DESC
LIMIT 10;
```

---

## 表结构优化

### 1. 表分区

```sql
-- 按时间分区 page_views 表
CREATE TABLE page_views_partitioned (
    id UUID,
    post_id UUID,
    path VARCHAR(500),
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(255),
    created_at TIMESTAMP
) PARTITION BY RANGE (created_at);

-- 创建分区
CREATE TABLE page_views_2024_01 PARTITION OF page_views_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE page_views_2024_02 PARTITION OF page_views_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- 自动创建未来分区的函数
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
    partition_date TEXT;
    start_date TEXT;
    end_date TEXT;
BEGIN
    partition_date := to_char(CURRENT_DATE + INTERVAL '1 month', 'YYYY_MM');
    start_date := to_char(CURRENT_DATE + INTERVAL '1 month', 'YYYY-MM-DD');
    end_date := to_char(CURRENT_DATE + INTERVAL '2 months', 'YYYY-MM-DD');

    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS page_views_%s PARTITION OF page_views_partitioned
        FOR VALUES FROM (%L) TO (%L)',
        partition_date, start_date, end_date
    );
END;
$$ LANGUAGE plpgsql;

-- 定期执行创建分区
-- SELECT create_monthly_partition();
```

### 2. 表压缩

```sql
-- 对历史数据使用列压缩
ALTER TABLE page_views_2023 SET (toast_tuple_target = 128);

-- 使用更紧凑的数据类型
ALTER TABLE posts ALTER COLUMN view_count TYPE BIGINT;
ALTER TABLE posts ALTER COLUMN like_count TYPE INTEGER;
```

### 3. 归档策略

```sql
-- 创建归档表
CREATE TABLE posts_archive (
    LIKE posts INCLUDING ALL
);

-- 归档旧文章
INSERT INTO posts_archive
SELECT * FROM posts
WHERE status = 'archived'
    AND updated_at < CURRENT_DATE - INTERVAL '6 months';

-- 删除已归档数据
DELETE FROM posts
WHERE status = 'archived'
    AND updated_at < CURRENT_DATE - INTERVAL '6 months';
```

---

## 缓存策略

### 1. 查询结果缓存

```sql
-- 使用 pg_persistence 扩展（如果安装）
-- CREATE EXTENSION IF NOT EXISTS pg_persistence;

-- 或使用应用层缓存（Redis）
-- 示例伪代码：
-- cached_posts = redis.get("posts:home:page1")
-- if not cached_posts:
--     cached_posts = db.query("SELECT * FROM posts ...")
--     redis.set("posts:home:page1", cached_posts, ex=300)
```

### 2. 函数结果缓存

```sql
-- 创建带缓存的函数
CREATE OR REPLACE FUNCTION get_post_stats(p_post_id UUID)
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    -- 检查缓存
    SELECT value INTO result FROM cache
    WHERE key = 'post_stats_' || p_post_id;

    IF result IS NULL THEN
        -- 计算结果
        SELECT json_build_object(
            'views', view_count,
            'likes', like_count,
            'comments', comment_count
        ) INTO result
        FROM posts WHERE id = p_post_id;

        -- 存入缓存
        INSERT INTO cache (key, value, expires_at)
        VALUES ('post_stats_' || p_post_id, result, NOW() + INTERVAL '5 minutes')
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

### 3. 物化视图缓存

```sql
-- 创建热门文章缓存
CREATE MATERIALIZED VIEW popular_posts_cache AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.featured_image,
    p.view_count,
    p.published_at,
    u.name as author_name
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'published'
    AND p.published_at > CURRENT_DATE - INTERVAL '7 days'
ORDER BY p.view_count DESC
LIMIT 100;

-- 创建唯一索引加速刷新
CREATE UNIQUE INDEX ON popular_posts_cache(id);

-- 定时刷新（使用 cron 或 pg_cron）
-- REFRESH MATERIALIZED VIEW CONCURRENTLY popular_posts_cache;
```

---

## 分区策略

### 1. 时间范围分区

```sql
-- 按月分区活动日志表
CREATE TABLE activity_log_partitioned (
    LIKE activity_log INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- 自动创建分区函数
CREATE OR REPLACE FUNCTION create_partitions()
RETURNS void AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
BEGIN
    -- 创建未来3个月的分区
    FOR i IN 0..2 LOOP
        start_date := date_trunc('month', CURRENT_DATE + (i || ' months')::interval);
        end_date := start_date + INTERVAL '1 month';
        partition_name := 'activity_log_' || to_char(start_date, 'YYYY_MM');

        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF activity_log_partitioned
            FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### 2. 哈希分区

```sql
-- 按 ID 哈希分区（均匀分布）
CREATE TABLE users_hash (
    LIKE users INCLUDING ALL
) PARTITION BY HASH (id);

-- 创建4个分区
CREATE TABLE users_hash_0 PARTITION OF users_hash FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE users_hash_1 PARTITION OF users_hash FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE users_hash_2 PARTITION OF users_hash FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE users_hash_3 PARTITION OF users_hash FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

### 3. 列表分区

```sql
-- 按状态分区
CREATE TABLE posts_list (
    LIKE posts INCLUDING ALL
) PARTITION BY LIST (status);

-- 创建各状态分区
CREATE TABLE posts_draft PARTITION OF posts_list FOR VALUES IN ('draft');
CREATE TABLE posts_published PARTITION OF posts_list FOR VALUES IN ('published');
CREATE TABLE posts_archived PARTITION OF posts_list FOR VALUES IN ('archived', 'scheduled');
```

---

## 监控与维护

### 1. 性能监控查询

```sql
-- 慢查询监控
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time,
    rows
FROM pg_stat_statements
WHERE mean_time > 100  -- 超过100ms
ORDER BY mean_time DESC
LIMIT 20;

-- 表大小监控
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    (SELECT COUNT(*) FROM quote_ident(tablename)) as row_count
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 索引效率监控
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch,
    CASE WHEN idx_scan > 0
        THEN idx_tup_read::FLOAT / idx_scan
        ELSE 0
    END as tuples_per_scan
FROM pg_stat_user_indexes
WHERE idx_scan > 0
ORDER BY tuples_per_scan DESC;
```

### 2. 自动维护任务

```sql
-- 自动 VACUUM ANALYZE 函数
CREATE OR REPLACE FUNCTION auto_vacuum_table(p_table TEXT)
RETURNS void AS $$
BEGIN
    EXECUTE format('VACUUM ANALYZE %I', p_table);
    RAISE NOTICE 'Vacuumed table: %', p_table;
END;
$$ LANGUAGE plpgsql;

-- 批量维护所有表
CREATE OR REPLACE FUNCTION vacuum_all_tables()
RETURNS void AS $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        PERFORM auto_vacuum_table(table_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 定时执行（使用 pg_cron）
-- SELECT cron.schedule('vacuum-all', '0 2 * * *', 'SELECT vacuum_all_tables()');
```

### 3. 统计信息更新

```sql
-- 更新表统计信息
ANALYZE posts;
ANALYZE comments;
ANALYZE users;

-- 批量更新所有表
ANALYZE;

-- 更新特定列的统计信息
ANALYZE posts (title, content, status);
```

### 4. 索引重建

```sql
-- 重建单个索引
REINDEX INDEX CONCURRENTLY idx_posts_search;

-- 重建表的所有索引
REINDEX TABLE CONCURRENTLY posts;

-- 重建数据库的所有索引
REINDEX DATABASE CONCURRENTLY cyberpress;
```

---

## 性能测试

### 1. 基准测试脚本

```sql
-- 测试文章列表查询性能
EXPLAIN ANALYZE
SELECT p.*, u.name as author_name, c.name as category_name
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 20;

-- 测试全文搜索性能
EXPLAIN ANALYZE
SELECT p.*,
    ts_rank(
        to_tsvector('english', p.title || ' ' || p.content),
        to_tsquery('english', 'react & nextjs')
    ) as rank
FROM posts p
WHERE to_tsvector('english', p.title || ' ' || p.content)
    @@ to_tsquery('english', 'react & nextjs')
    AND p.status = 'published'
ORDER BY rank DESC
LIMIT 20;

-- 测试评论查询性能
EXPLAIN ANALYZE
SELECT c.*,
    COALESCE(u.avatar_url, '/default-avatar.png') as avatar
FROM comments c
LEFT JOIN users u ON c.author_id = u.id
WHERE c.post_id = '...' AND c.status = 'approved'
ORDER BY c.created_at ASC;
```

### 2. 并发测试

```sql
-- 使用 pgbench 进行压力测试
-- 初始化测试数据库
pgbench -i -s 10 cyberpress_db

-- 运行测试（10个客户端，持续5分钟）
pgbench -c 10 -T 300 cyberpress_db

-- 自定义测试脚本
-- 创建 test.sql:
\set aid random(1, 1000000)
SELECT * FROM posts WHERE id = :aid;

-- 运行自定义测试
pgbench -f test.sql -c 10 -T 60 cyberpress_db
```

### 3. 性能对比

```sql
-- 创建测试数据
INSERT INTO posts (title, slug, content, author_id, status, published_at)
SELECT
    'Test Post ' || i,
    'test-post-' || i,
    repeat('Lorem ipsum dolor sit amet ', 100),
    (SELECT id FROM users WHERE email = 'admin@cyberpress.dev'),
    'published',
    NOW() - (i || ' days')::interval
FROM generate_series(1, 10000) AS i;

-- 对比有索引和无索引的查询
-- 测试1：有索引
EXPLAIN ANALYZE SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 10;

-- 测试2：删除索引后
-- DROP INDEX idx_posts_status;
EXPLAIN ANALYZE SELECT * FROM posts WHERE status = 'published' ORDER BY published_at DESC LIMIT 10;

-- 恢复索引
-- CREATE INDEX idx_posts_status ON posts(status, published_at DESC) WHERE status = 'published';
```

---

## 优化检查清单

### 查询优化
- [ ] 使用 EXPLAIN ANALYZE 分析慢查询
- [ ] 避免 SELECT *，只查询需要的列
- [ ] 使用 JOIN 替代子查询
- [ ] 使用 EXISTS 替代 IN（对于大数据集）
- [ ] 优化 ORDER BY 和 GROUP BY
- [ ] 使用 LIMIT 限制结果集
- [ ] 避免在 WHERE 子句中使用函数

### 索引优化
- [ ] 为外键创建索引
- [ ] 为频繁查询的列创建索引
- [ ] 使用复合索引优化多列查询
- [ ] 使用部分索引减少索引大小
- [ ] 定期检查索引使用情况
- [ ] 删除未使用的索引
- [ ] 定期重建碎片化索引

### 表结构优化
- [ ] 对大表进行分区
- [ ] 使用合适的数据类型
- [ ] 归档历史数据
- [ ] 使用表压缩
- [ ] 正确设置外键约束
- [ ] 使用触发器维护统计信息

### 缓存优化
- [ ] 使用 Redis 缓存热点数据
- [ ] 使用物化视图缓存复杂查询
- [ ] 实现查询结果缓存
- [ ] 设置合理的缓存过期时间
- [ ] 监控缓存命中率

### 维护优化
- [ ] 定期执行 VACUUM ANALYZE
- [ ] 定期更新统计信息
- [ ] 监控数据库性能
- [ ] 设置慢查询日志
- [ ] 定期备份数据
- [ ] 监控磁盘空间使用

---

## 性能优化目标

### 响应时间目标
- 首页文章列表: < 50ms
- 文章详情页: < 30ms
- 全文搜索: < 100ms
- 评论列表: < 50ms
- 用户登录: < 100ms

### 吞吐量目标
- 支持 1000+ 并发用户
- 支持 10,000+ QPS
- 99% 请求响应时间 < 200ms

### 资源使用目标
- CPU 使用率 < 70%
- 内存使用率 < 80%
- 磁盘 I/O < 70%
- 缓存命中率 > 90%

---

## 总结

数据库优化是一个持续的过程，需要：

1. **监控**: 持续监控数据库性能指标
2. **分析**: 使用工具分析慢查询和瓶颈
3. **优化**: 根据分析结果进行针对性优化
4. **测试**: 在生产环境前充分测试优化效果
5. **迭代**: 持续迭代和改进

记住：过早优化是万恶之源，先确保代码正确，再优化性能。
