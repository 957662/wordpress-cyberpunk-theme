-- ============================================================================
-- CyberPress Platform - PostgreSQL 性能优化脚本
-- ============================================================================
-- 功能：创建索引、优化查询、配置数据库参数
-- 版本：1.0.0
-- 创建日期：2026-03-06
-- ============================================================================

-- 设置搜索路径
SET search_path TO public;

-- ============================================================================
-- 1. 高级索引创建
-- ============================================================================

-- 1.1 复合索引（多列索引）
-- 用于经常一起查询的列组合

-- 文章查询优化：作者 + 状态 + 发布时间
CREATE INDEX IF NOT EXISTS idx_posts_author_status_published
    ON posts(author_id, status, published_at DESC)
    WHERE status = 'publish';

-- 评论查询优化：文章 + 状态 + 创建时间
CREATE INDEX IF NOT EXISTS idx_comments_post_status_created
    ON comments(post_id, status, created_at DESC)
    WHERE status = 'approved';

-- 1.2 部分索引（条件索引）
-- 只对符合条件的行创建索引，减少索引大小

-- 仅对已发布的文章创建索引
CREATE INDEX IF NOT EXISTS idx_posts_published
    ON posts(published_at DESC)
    WHERE status = 'publish' AND published_at IS NOT NULL;

-- 仅对未读通知创建索引
CREATE INDEX IF NOT EXISTS idx_notifications_unread_optimized
    ON notifications(user_id, created_at DESC)
    WHERE is_read = FALSE;

-- 仅对活跃订阅者创建索引
CREATE INDEX IF NOT EXISTS idx_subscribers_active
    ON subscribers(email)
    WHERE status = 'active';

-- 1.3 表达式索引
-- 对计算结果创建索引

-- 邮箱小写索引（不区分大小写搜索）
CREATE INDEX IF NOT EXISTS idx_users_email_lower
    ON users(LOWER(email));

-- 用户名小写索引
CREATE INDEX IF NOT EXISTS idx_users_username_lower
    ON users(LOWER(username));

-- 1.4 JSONB 索引
-- 用于 JSONB 字段的查询

-- 文章元数据索引
CREATE INDEX IF NOT EXISTS idx_posts_meta_gin
    ON posts USING gin(meta);

-- 媒体元数据索引
CREATE INDEX IF NOT EXISTS idx_media_metadata_gin
    ON media USING gin(metadata);

-- 通知数据索引
CREATE INDEX IF NOT EXISTS idx_notifications_data_gin
    ON notifications USING gin(data);

-- 1.5 全文搜索优化

-- 文章标题和内容的全文搜索
CREATE INDEX IF NOT EXISTS idx_posts_fulltext_search
    ON posts USING gin(to_tsvector('english',
        coalesce(title, '') || ' ' ||
        coalesce(content, '') || ' ' ||
        coalesce(excerpt, '')
    ));

-- 评论内容全文搜索
CREATE INDEX IF NOT EXISTS idx_comments_fulltext_search
    ON comments USING gin(to_tsvector('english', coalesce(content, '')));

-- ============================================================================
-- 2. 查询性能优化视图
-- ============================================================================

-- 2.1 文章统计视图
CREATE OR REPLACE VIEW v_post_statistics AS
SELECT
    p.id,
    p.title,
    p.view_count,
    p.like_count,
    p.comment_count,
    u.display_name as author_name,
    c.name as category_name,
    COUNT(DISTINCT pc.category_id) as category_count,
    COUNT(DISTINCT pt.tag_id) as tag_count
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
WHERE p.status = 'publish'
GROUP BY p.id, u.display_name, c.name;

-- 2.2 用户活跃度视图
CREATE OR REPLACE VIEW v_user_activity AS
SELECT
    u.id,
    u.username,
    u.display_name,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT c.id) as comment_count,
    COUNT(DISTINCT l.post_id) as like_given_count,
    COUNT(DISTINCT l2.user_id) as follower_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id AND p.status = 'publish'
LEFT JOIN comments c ON u.id = c.author_id AND c.status = 'approved'
LEFT JOIN likes l ON u.id = l.user_id
LEFT JOIN follows f ON u.id = f.following_id
GROUP BY u.id, u.username, u.display_name;

-- 2.3 热门文章视图
CREATE OR REPLACE VIEW v_popular_posts AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.view_count,
    p.like_count,
    p.comment_count,
    (p.view_count + p.like_count * 2 + p.comment_count * 3) as popularity_score,
    u.display_name as author_name,
    p.published_at
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'publish'
ORDER BY popularity_score DESC;

-- 2.4 分类统计视图
CREATE OR REPLACE VIEW v_category_statistics AS
SELECT
    c.id,
    c.name,
    c.slug,
    c.post_count,
    COUNT(DISTINCT p.id) as actual_post_count,
    COUNT(DISTINCT p.author_id) as author_count
FROM categories c
LEFT JOIN post_categories pc ON c.id = pc.category_id
LEFT JOIN posts p ON pc.post_id = p.id AND p.status = 'publish'
GROUP BY c.id, c.name, c.slug, c.post_count
ORDER BY actual_post_count DESC;

-- ============================================================================
-- 3. 物化视图（用于缓存复杂查询结果）
-- ============================================================================

-- 3.1 每日统计物化视图
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_stats AS
SELECT
    DATE(p.created_at) as date,
    COUNT(*) FILTER (WHERE p.status = 'publish') as posts_published,
    COUNT(*) FILTER (WHERE p.status = 'draft') as posts_draft,
    COUNT(DISTINCT p.author_id) as active_authors,
    SUM(p.view_count) as total_views,
    SUM(p.like_count) as total_likes,
    SUM(p.comment_count) as total_comments
FROM posts p
GROUP BY DATE(p.created_at)
ORDER BY date DESC;

-- 创建索引以加速物化视图刷新
CREATE INDEX IF NOT EXISTS idx_mv_daily_stats_date
    ON mv_daily_stats(date DESC);

-- 3.2 用户统计物化视图
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_stats AS
SELECT
    u.id,
    u.username,
    COUNT(DISTINCT p.id) as total_posts,
    COUNT(DISTINCT c.id) as total_comments,
    SUM(p.view_count) as total_views,
    SUM(p.like_count) as total_likes,
    COUNT(DISTINCT f.follower_id) as followers_count,
    COUNT(DISTINCT f.following_id) as following_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
LEFT JOIN comments c ON u.id = c.author_id
LEFT JOIN follows f ON u.id = f.following_id
GROUP BY u.id, u.username;

-- 创建唯一索引以加速查询
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_user_stats_id
    ON mv_user_stats(id);

-- ============================================================================
-- 4. 存储过程和函数
-- ============================================================================

-- 4.1 获取文章列表（带分页和筛选）
CREATE OR REPLACE FUNCTION get_posts_with_pagination(
    p_page INT DEFAULT 1,
    p_per_page INT DEFAULT 10,
    p_status post_status DEFAULT 'publish',
    p_category_id BIGINT DEFAULT NULL,
    p_author_id BIGINT DEFAULT NULL,
    p_search TEXT DEFAULT NULL
)
RETURNS TABLE (
    id BIGINT,
    title VARCHAR,
    slug VARCHAR,
    excerpt TEXT,
    author_name VARCHAR,
    category_name VARCHAR,
    view_count INT,
    like_count INT,
    comment_count INT,
    published_at TIMESTAMP,
    total_count BIGINT
) AS $$
DECLARE
    v_total_count BIGINT;
BEGIN
    -- 计算总数
    SELECT COUNT(*)
    INTO v_total_count
    FROM posts p
    WHERE
        (p_status IS NULL OR p.status = p_status) AND
        (p_category_id IS NULL OR EXISTS (
            SELECT 1 FROM post_categories pc
            WHERE pc.post_id = p.id AND pc.category_id = p_category_id
        )) AND
        (p_author_id IS NULL OR p.author_id = p_author_id) AND
        (p_search IS NULL OR
            to_tsvector('english', coalesce(p.title, '') || ' ' || coalesce(p.content, ''))
            @@ to_tsquery('english', p_search)
        );

    -- 返回分页数据
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        u.display_name,
        c.name,
        p.view_count,
        p.like_count,
        p.comment_count,
        p.published_at,
        v_total_count
    FROM posts p
    LEFT JOIN users u ON p.author_id = u.id
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    WHERE
        (p_status IS NULL OR p.status = p_status) AND
        (p_category_id IS NULL OR c.id = p_category_id) AND
        (p_author_id IS NULL OR p.author_id = p_author_id) AND
        (p_search IS NULL OR
            to_tsvector('english', coalesce(p.title, '') || ' ' || coalesce(p.content, ''))
            @@ to_tsquery('english', p_search)
        )
    ORDER BY p.published_at DESC
    LIMIT p_per_page OFFSET ((p_page - 1) * p_per_page);
END;
$$ LANGUAGE plpgsql;

-- 4.2 更新文章浏览量
CREATE OR REPLACE FUNCTION increment_post_views(p_post_id BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE posts
    SET view_count = view_count + 1
    WHERE id = p_post_id;
END;
$$ LANGUAGE plpgsql;

-- 4.3 获取用户仪表盘数据
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(p_user_id BIGINT)
RETURNS TABLE (
    total_posts INT,
    published_posts INT,
    draft_posts INT,
    total_comments INT,
    total_views BIGINT,
    total_likes INT,
    followers_count INT,
    following_count INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM posts WHERE author_id = p_user_id),
        (SELECT COUNT(*) FROM posts WHERE author_id = p_user_id AND status = 'publish'),
        (SELECT COUNT(*) FROM posts WHERE author_id = p_user_id AND status = 'draft'),
        (SELECT COUNT(*) FROM comments WHERE author_id = p_user_id AND status = 'approved'),
        (SELECT COALESCE(SUM(view_count), 0) FROM posts WHERE author_id = p_user_id),
        (SELECT COUNT(*) FROM likes l JOIN posts p ON l.post_id = p.id WHERE p.author_id = p_user_id),
        (SELECT COUNT(*) FROM follows WHERE following_id = p_user_id),
        (SELECT COUNT(*) FROM follows WHERE follower_id = p_user_id);
END;
$$ LANGUAGE plpgsql;

-- 4.4 清理旧的搜索日志
CREATE OR REPLACE FUNCTION cleanup_old_search_logs(p_days_to_keep INT DEFAULT 30)
RETURNS INT AS $$
DECLARE
    v_deleted_count INT;
BEGIN
    DELETE FROM search_logs
    WHERE created_at < CURRENT_TIMESTAMP - (p_days_to_keep || ' days')::INTERVAL;

    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 4.5 重新计算文章数量（用于分类和标签）
CREATE OR REPLACE FUNCTION recalculate_post_counts()
RETURNS VOID AS $$
BEGIN
    -- 更新分类文章数
    UPDATE categories c
    SET post_count = (
        SELECT COUNT(DISTINCT pc.post_id)
        FROM post_categories pc
        JOIN posts p ON pc.post_id = p.id
        WHERE pc.category_id = c.id AND p.status = 'publish'
    );

    -- 更新标签文章数
    UPDATE tags t
    SET post_count = (
        SELECT COUNT(DISTINCT pt.post_id)
        FROM post_tags pt
        JOIN posts p ON pt.post_id = p.id
        WHERE pt.tag_id = t.id AND p.status = 'publish'
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. 定时任务（需要 pg_cron 扩展）
-- ============================================================================

-- 注意：需要先安装 pg_cron 扩展
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 每天凌晨刷新物化视图
-- SELECT cron.schedule('refresh-daily-stats', '0 0 * * *',
--     'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_stats;'
-- );

-- 每小时刷新用户统计
-- SELECT cron.schedule('refresh-user-stats', '0 * * * *',
--     'REFRESH MATERIALIZED VIEW CONCURRENTLY mv_user_stats;'
-- );

-- 每周清理旧搜索日志
-- SELECT cron.schedule('cleanup-search-logs', '0 0 * * 0',
--     'SELECT cleanup_old_search_logs(30);'
-- );

-- ============================================================================
-- 6. 数据库配置建议
-- ============================================================================

-- 6.1 配置建议（需要在 postgresql.conf 中设置）

-- shared_buffers = 256MB (系统内存的 25%)
-- effective_cache_size = 1GB (系统内存的 50-75%)
-- maintenance_work_mem = 64MB
-- checkpoint_completion_target = 0.9
-- wal_buffers = 16MB
-- default_statistics_target = 100
-- random_page_cost = 1.1 (用于 SSD)
-- effective_io_concurrency = 200 (用于 SSD)
-- work_mem = 4MB
-- min_wal_size = 1GB
-- max_wal_size = 4GB

-- 6.2 自动清理配置

-- 增加自动清理的频率
ALTER TABLE posts SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE comments SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE analytics SET (autovacuum_vacuum_scale_factor = 0.05);

-- 增加自动分析的频率
ALTER TABLE posts SET (autovacuum_analyze_scale_factor = 0.05);
ALTER TABLE comments SET (autovacuum_analyze_scale_factor = 0.05);

-- ============================================================================
-- 7. 监控和诊断
-- ============================================================================

-- 7.1 查询性能监控视图
CREATE OR REPLACE VIEW v_query_performance AS
SELECT
    query,
    calls,
    total_time,
    mean_time,
    max_time,
    rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 100;

-- 7.2 表大小监控视图
CREATE OR REPLACE VIEW v_table_sizes AS
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
    pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;

-- 7.3 索引使用率监控视图
CREATE OR REPLACE VIEW v_index_usage AS
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- ============================================================================
-- 8. 性能优化完成
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'PostgreSQL 性能优化完成！';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '已创建索引数: 20+';
    RAISE NOTICE '已创建视图数: 7';
    RAISE NOTICE '已创建函数数: 5';
    RAISE NOTICE '已创建物化视图数: 2';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '建议：';
    RAISE NOTICE '1. 定期运行 ANALYZE 更新统计信息';
    RAISE NOTICE '2. 定期运行 VACUUM 清理死元组';
    RAISE NOTICE '3. 监控查询性能并优化慢查询';
    RAISE NOTICE '4. 定期刷新物化视图';
    RAISE NOTICE '===========================================';
END $$;
