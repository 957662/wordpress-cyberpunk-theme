-- =====================================================
-- CyberPress Platform - SQL Query Examples
-- SQL 查询示例
-- =====================================================
-- Author: AI Database Architect
-- Created: 2026-03-03
-- =====================================================

-- =====================================================
-- 1. 用户相关查询
-- =====================================================

-- 获取所有活跃用户
SELECT 
    id,
    username,
    email,
    display_name,
    role,
    created_at
FROM users
WHERE status = 'active'
ORDER BY created_at DESC;

-- 获取用户统计信息
SELECT 
    role,
    COUNT(*) as user_count,
    COUNT(*) FILTER (WHERE status = 'active') as active_users,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as new_users
FROM users
GROUP BY role;

-- 获取最受欢迎的作者（按文章浏览量）
SELECT 
    u.id,
    u.username,
    u.display_name,
    COUNT(p.id) as post_count,
    SUM(p.view_count) as total_views,
    AVG(p.view_count) as avg_views
FROM users u
JOIN posts p ON u.id = p.author_id
WHERE p.status = 'published'
GROUP BY u.id
ORDER BY total_views DESC
LIMIT 10;

-- =====================================================
-- 2. 文章相关查询
-- =====================================================

-- 获取最新发布的文章
SELECT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    u.username as author_name,
    p.view_count,
    p.like_count,
    p.published_at
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'published'
ORDER BY p.published_at DESC
LIMIT 10;

-- 获取热门文章（按浏览量）
SELECT 
    p.id,
    p.title,
    p.slug,
    u.username as author_name,
    p.view_count,
    p.like_count,
    COUNT(DISTINCT c.id) as comment_count,
    p.published_at
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN comments c ON p.id = c.post_id AND c.status = 'approved'
WHERE p.status = 'published'
GROUP BY p.id, u.username
ORDER BY p.view_count DESC
LIMIT 10;

-- 获取精选文章
SELECT 
    p.*,
    u.username as author_name,
    u.avatar_url as author_avatar
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'published' 
  AND p.is_featured = true
ORDER BY p.published_at DESC;

-- 搜索文章（全文搜索）
SELECT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    ts_rank(to_tsvector('english', p.title || ' ' || p.content), query) as rank
FROM posts p, 
     to_tsquery('english', 'Next.js & TypeScript') query
WHERE to_tsvector('english', p.title || ' ' || p.content) @@ query
  AND p.status = 'published'
ORDER BY rank DESC
LIMIT 20;

-- 获取文章的分类和标签
SELECT 
    p.id,
    p.title,
    json_agg(DISTINCT jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'slug', c.slug,
        'color', c.color
    )) as categories,
    json_agg(DISTINCT jsonb_build_object(
        'id', t.id,
        'name', t.name,
        'slug', t.slug,
        'color', t.color
    )) as tags
FROM posts p
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.id = 'post-id-here'
GROUP BY p.id;

-- =====================================================
-- 3. 分类和标签查询
-- =====================================================

-- 获取所有分类及文章数
SELECT 
    c.id,
    c.name,
    c.slug,
    c.description,
    c.color,
    c.icon,
    COUNT(DISTINCT pc.post_id) as post_count
FROM categories c
LEFT JOIN post_categories pc ON c.id = pc.category_id
LEFT JOIN posts p ON pc.post_id = p.id AND p.status = 'published'
GROUP BY c.id
ORDER BY c.sort_order, c.name;

-- 获取热门标签
SELECT 
    t.id,
    t.name,
    t.slug,
    t.color,
    t.usage_count,
    COUNT(DISTINCT pt.post_id) as actual_count
FROM tags t
LEFT JOIN post_tags pt ON t.id = pt.tag_id
LEFT JOIN posts p ON pt.post_id = p.id AND p.status = 'published'
GROUP BY t.id
ORDER BY actual_count DESC
LIMIT 20;

-- =====================================================
-- 4. 评论相关查询
-- =====================================================

-- 获取文章的评论树
WITH RECURSIVE comment_tree AS (
    -- 根评论
    SELECT 
        c.id,
        c.post_id,
        c.author_name,
        c.content,
        c.created_at,
        c.parent_id,
        0 as level,
        ARRAY[c.id] as path
    FROM comments c
    WHERE c.post_id = 'post-id-here' 
      AND c.parent_id IS NULL 
      AND c.status = 'approved'
    
    UNION ALL
    
    -- 子评论
    SELECT 
        c.id,
        c.post_id,
        c.author_name,
        c.content,
        c.created_at,
        c.parent_id,
        ct.level + 1,
        ct.path || c.id
    FROM comments c
    JOIN comment_tree ct ON c.parent_id = ct.id
    WHERE c.status = 'approved'
)
SELECT * FROM comment_tree
ORDER BY path;

-- 获取最新评论
SELECT 
    c.id,
    c.content,
    c.author_name,
    c.created_at,
    p.title as post_title,
    p.slug as post_slug
FROM comments c
JOIN posts p ON c.post_id = p.id
WHERE c.status = 'approved'
ORDER BY c.created_at DESC
LIMIT 10;

-- =====================================================
-- 5. 统计和分析查询
-- =====================================================

-- 文章发布趋势（按月）
SELECT 
    DATE_TRUNC('month', published_at) as month,
    COUNT(*) as post_count,
    SUM(view_count) as total_views
FROM posts
WHERE status = 'published'
  AND published_at > NOW() - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', published_at)
ORDER BY month DESC;

-- 作者排行
SELECT 
    u.username,
    u.display_name,
    COUNT(DISTINCT p.id) as post_count,
    SUM(p.view_count) as total_views,
    COUNT(DISTINCT c.id) as comment_count
FROM users u
LEFT JOIN posts p ON u.id = p.author_id AND p.status = 'published'
LEFT JOIN comments c ON p.id = c.post_id AND c.status = 'approved'
GROUP BY u.id
ORDER BY total_views DESC;

-- 浏览量趋势
SELECT 
    DATE_TRUNC('day', created_at) as date,
    COUNT(DISTINCT session_id) as unique_visitors,
    COUNT(*) as total_views,
    AVG(duration_seconds) as avg_duration
FROM analytics
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- =====================================================
-- 6. 作品集查询
-- =====================================================

-- 获取所有作品集项目
SELECT 
    id,
    title,
    slug,
    description,
    featured_image_url,
    technologies,
    is_featured,
    view_count,
    created_at
FROM portfolios
WHERE status = 'published'
ORDER BY sort_order, created_at DESC;

-- 获取精选作品
SELECT 
    p.*,
    u.username as author_name
FROM portfolios p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'published' 
  AND p.is_featured = true
ORDER BY p.sort_order;

-- =====================================================
-- 7. 搜索相关查询
-- =====================================================

-- 热门搜索关键词
SELECT 
    query,
    COUNT(*) as search_count,
    AVG(results_count) as avg_results
FROM search_logs
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY query
ORDER BY search_count DESC
LIMIT 20;

-- 无结果搜索
SELECT 
    query,
    COUNT(*) as search_count
FROM search_logs
WHERE results_count = 0
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY query
ORDER BY search_count DESC
LIMIT 20;

-- =====================================================
-- 8. 通知查询
-- =====================================================

-- 获取用户未读通知
SELECT 
    id,
    type,
    title,
    content,
    link_url,
    created_at
FROM notifications
WHERE user_id = 'user-id-here'
  AND is_read = false
ORDER BY created_at DESC;

-- 通知统计
SELECT 
    type,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE is_read = false) as unread_count
FROM notifications
WHERE user_id = 'user-id-here'
GROUP BY type;

-- =====================================================
-- 9. 阅读列表查询
-- =====================================================

-- 获取用户阅读列表
SELECT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    u.username as author_name,
    rl.is_read,
    rl.is_favorite,
    rl.progress_percent,
    rl.created_at as added_at
FROM reading_list rl
JOIN posts p ON rl.post_id = p.id
JOIN users u ON p.author_id = u.id
WHERE rl.user_id = 'user-id-here'
ORDER BY rl.created_at DESC;

-- 获取收藏的文章
SELECT 
    p.*,
    rl.created_at as favorited_at
FROM reading_list rl
JOIN posts p ON rl.post_id = p.id
WHERE rl.user_id = 'user-id-here'
  AND rl.is_favorite = true
ORDER BY rl.created_at DESC;

-- =====================================================
-- 10. 性能监控查询
-- =====================================================

-- 表大小统计
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 索引使用情况
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY schemaname, tablename;

-- 慢查询（需要 pg_stat_statements 扩展）
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;

-- 活跃连接
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query_start,
    state_change
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;

-- =====================================================
-- 11. 维护查询
-- =====================================================

-- 需要清理的表（死元组过多）
SELECT 
    schemaname,
    tablename,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    round(100 * n_dead_tup / NULLIF(n_live_tup + n_dead_tup, 0), 2) as dead_ratio,
    last_vacuum,
    last_autovacuum
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY dead_ratio DESC;

-- 未使用的索引
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexrelname NOT LIKE '%_pkey'
ORDER BY pg_relation_size(indexrelid) DESC;

-- =====================================================
-- 12. 复杂组合查询
-- =====================================================

-- 获取文章的完整信息
SELECT 
    p.id,
    p.title,
    p.slug,
    p.content,
    p.excerpt,
    p.featured_image_url,
    p.view_count,
    p.like_count,
    p.published_at,
    json_build_object(
        'id', u.id,
        'username', u.username,
        'display_name', u.display_name,
        'avatar_url', u.avatar_url
    ) as author,
    (
        SELECT json_agg(json_build_object(
            'id', c.id,
            'name', c.name,
            'slug', c.slug,
            'color', c.color
        ))
        FROM post_categories pc
        JOIN categories c ON pc.category_id = c.id
        WHERE pc.post_id = p.id
    ) as categories,
    (
        SELECT json_agg(json_build_object(
            'id', t.id,
            'name', t.name,
            'slug', t.slug,
            'color', t.color
        ))
        FROM post_tags pt
        JOIN tags t ON pt.tag_id = t.id
        WHERE pt.post_id = p.id
    ) as tags,
    (
        SELECT COUNT(*)
        FROM comments c
        WHERE c.post_id = p.id AND c.status = 'approved'
    ) as comment_count
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.slug = 'post-slug-here'
  AND p.status = 'published';

-- 获取仪表板统计
WITH stats AS (
    SELECT 
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'published') as total_posts,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'draft') as draft_posts,
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'pending') as pending_comments,
        SUM(p.view_count) as total_views,
        COUNT(DISTINCT a.session_id) FILTER (WHERE a.created_at > NOW() - INTERVAL '24 hours') as daily_visitors
    FROM posts p
    CROSS JOIN users u
    CROSS JOIN comments c
    CROSS JOIN analytics a
)
SELECT * FROM stats;

-- =====================================================
-- 完成
-- =====================================================
