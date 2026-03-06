-- CyberPress Platform - Performance Optimization Schema
-- 版本: 1.0.0
-- 创建日期: 2026-03-07

-- =====================================================
-- 缓存表
-- =====================================================
CREATE TABLE IF NOT EXISTS cache_entries (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cache_entries_expires_at ON cache_entries(expires_at);

-- =====================================================
-- 统计表（定期聚合）
-- =====================================================
CREATE TABLE IF NOT EXISTS daily_stats (
    id BIGSERIAL PRIMARY KEY,
    stat_date DATE NOT NULL UNIQUE,

    -- 用户统计
    new_users INTEGER DEFAULT 0,
    active_users INTEGER DEFAULT 0,

    -- 文章统计
    new_posts INTEGER DEFAULT 0,
    published_posts INTEGER DEFAULT 0,

    -- 互动统计
    total_views BIGINT DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    total_bookmarks INTEGER DEFAULT 0,

    -- 其他统计
    total_sessions BIGINT DEFAULT 0,
    avg_session_duration DECIMAL(10,2) DEFAULT 0.00,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 搜索历史（用于优化搜索建议）
-- =====================================================
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    query VARCHAR(255) NOT NULL,
    results_count INTEGER DEFAULT 0,
    clicked_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_query ON search_history(query);
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);

-- 热门搜索查询（自动聚合）
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hot_searches AS
SELECT
    query,
    COUNT(*) as search_count,
    MAX(created_at) as last_searched
FROM search_history
WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
GROUP BY query
ORDER BY search_count DESC
LIMIT 100;

-- 定期刷新热门搜索
CREATE OR REPLACE FUNCTION refresh_hot_searches()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hot_searches;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 文章趋势（用于推荐）
-- =====================================================
CREATE TABLE IF NOT EXISTS post_trends (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    trend_date DATE NOT NULL,

    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    bookmarks_count INTEGER DEFAULT 0,

    trend_score DECIMAL(10,2) DEFAULT 0.00,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (post_id, trend_date)
);

CREATE INDEX idx_post_trends_trend_date ON post_trends(trend_date DESC);
CREATE INDEX idx_post_trends_trend_score ON post_trends(trend_score DESC);

-- =====================================================
-- 用户行为追踪（用于个性化推荐）
-- =====================================================
CREATE TABLE IF NOT EXISTS user_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),

    event_type VARCHAR(50) NOT NULL,  -- view, like, comment, share, search, etc.
    event_data JSONB DEFAULT '{}',

    post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    tag_id UUID REFERENCES tags(id) ON DELETE SET NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_event_type ON user_events(event_type);
CREATE INDEX idx_user_events_post_id ON user_events(post_id);
CREATE INDEX idx_user_events_created_at ON user_events(created_at DESC);

-- 用户兴趣画像（自动聚合）
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_user_interests AS
SELECT
    user_id,
    category_id,
    COUNT(*) as interaction_count,
    SUM(CASE WHEN event_type = 'view' THEN 1 ELSE 0 END) as view_count,
    SUM(CASE WHEN event_type = 'like' THEN 2 ELSE 0 END) as like_score,
    SUM(CASE WHEN event_type = 'comment' THEN 3 ELSE 0 END) as comment_score,
    MAX(created_at) as last_interaction
FROM user_events
WHERE user_id IS NOT NULL
  AND created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
GROUP BY user_id, category_id;

CREATE UNIQUE INDEX idx_mv_user_interests_user_category ON mv_user_interests(user_id, category_id);

-- =====================================================
-- 定期维护任务
-- =====================================================

-- 清理过期缓存
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void AS $$
BEGIN
    DELETE FROM cache_entries WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- 清理过期通知
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS void AS $$
BEGIN
    DELETE FROM notifications WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- 清理旧的用户事件（保留90天）
CREATE OR REPLACE FUNCTION cleanup_old_user_events()
RETURNS void AS $$
BEGIN
    DELETE FROM user_events
    WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- 聚合每日统计
CREATE OR REPLACE FUNCTION aggregate_daily_stats(target_date DATE DEFAULT CURRENT_DATE)
RETURNS void AS $$
BEGIN
    INSERT INTO daily_stats (
        stat_date,
        new_users,
        active_users,
        new_posts,
        published_posts,
        total_views,
        total_likes,
        total_comments,
        total_bookmarks
    )
    SELECT
        target_date,
        COUNT(DISTINCT u.id) FILTER (WHERE DATE(u.created_at) = target_date),
        COUNT(DISTINCT ue.user_id) FILTER (WHERE DATE(ue.created_at) = target_date),
        COUNT(DISTINCT p.id) FILTER (WHERE DATE(p.created_at) = target_date),
        COUNT(DISTINCT p.id) FILTER (WHERE DATE(p.published_at) = target_date AND p.status = 'published'),
        COALESCE(SUM(p.views_count) FILTER (WHERE DATE(p.created_at) = target_date), 0),
        COALESCE(SUM(p.likes_count) FILTER (WHERE DATE(p.created_at) = target_date), 0),
        COALESCE(SUM(p.comments_count) FILTER (WHERE DATE(p.created_at) = target_date), 0),
        COALESCE(SUM(p.bookmarks_count) FILTER (WHERE DATE(p.created_at) = target_date), 0)
    FROM users u
    LEFT JOIN user_events ue ON u.id = ue.user_id
    LEFT JOIN posts p ON u.id = p.author_id
    ON CONFLICT (stat_date) DO UPDATE SET
        new_users = EXCLUDED.new_users,
        active_users = EXCLUDED.active_users,
        new_posts = EXCLUDED.new_posts,
        published_posts = EXCLUDED.published_posts,
        total_views = EXCLUDED.total_views,
        total_likes = EXCLUDED.total_likes,
        total_comments = EXCLUDED.total_comments,
        total_bookmarks = EXCLUDED.total_bookmarks;
END;
$$ LANGUAGE plpgsql;

-- 更新文章趋势分数
CREATE OR REPLACE FUNCTION update_post_trend_scores()
RETURNS void AS $$
BEGIN
    UPDATE post_trends
    SET trend_score =
        (views_count * 1.0) +
        (likes_count * 2.0) +
        (comments_count * 3.0) +
        (bookmarks_count * 2.5)
    WHERE trend_date = CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 定时任务计划（需要 pg_catalog 扩展）
-- =====================================================
-- 注意：这些任务需要通过外部调度器（如 pg_cron 或应用层）执行

-- 示例：每天凌晨2点执行
-- SELECT cron.schedule('cleanup-cache', '0 2 * * *', 'SELECT cleanup_expired_cache()');
-- SELECT cron.schedule('aggregate-stats', '0 2 * * *', 'SELECT aggregate_daily_stats()');

-- =====================================================
-- 性能分析函数
-- =====================================================

-- 获取热门文章
CREATE OR REPLACE FUNCTION get_hot_posts(days_interval INTEGER DEFAULT 7, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    post_id UUID,
    title VARCHAR(255),
    trend_score DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        pt.post_id,
        p.title,
        SUM(pt.trend_score) as trend_score
    FROM post_trends pt
    JOIN posts p ON pt.post_id = p.id
    WHERE pt.trend_date >= CURRENT_DATE - (days_interval || ' days')::INTERVAL
      AND p.status = 'published'
      AND p.deleted_at IS NULL
    GROUP BY pt.post_id, p.title
    ORDER BY trend_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 获取推荐文章（基于用户兴趣）
CREATE OR REPLACE FUNCTION get_recommended_posts(user_id_param UUID, limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    post_id UUID,
    title VARCHAR(255),
    match_score DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        SUM(ui.interest_score) as match_score
    FROM posts p
    JOIN mv_user_interests ui ON p.category_id = ui.category_id
    WHERE ui.user_id = user_id_param
      AND p.status = 'published'
      AND p.deleted_at IS NULL
      AND p.author_id != user_id_param
    GROUP BY p.id, p.title
    ORDER BY match_score DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 完成
-- =====================================================
-- 性能优化架构创建完成
-- 版本: 1.0.0
