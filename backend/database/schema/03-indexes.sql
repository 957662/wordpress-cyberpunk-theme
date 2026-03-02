-- CyberPress Platform - 索引设计
-- 优化查询性能的关键索引策略

-- ============================================
-- 索引设计原则
-- ============================================
-- 1. B-tree 索引：等值查询、范围查询、排序
-- 2. GIN 索引：JSONB、数组、全文搜索
-- 3. GiST 索引：地理位置、范围搜索
-- 4. 部分索引：只索引符合条件的数据
-- 5. 复合索引：多列联合查询优化
-- 6. 表达式索引：基于函数/表达式的索引

-- ============================================
-- users 表索引
-- ============================================

-- 用户名查找（登录）
CREATE INDEX idx_users_username ON users(username) WHERE status = 'active';

-- 邮箱查找（登录/验证）
CREATE INDEX idx_users_email ON users(email) WHERE status = 'active';

-- 角色查询
CREATE INDEX idx_users_role ON users(role) WHERE status = 'active';

-- 显示名称搜索（前缀匹配）
CREATE INDEX idx_users_display_name_trgm ON users USING gin(display_name gin_trgm_ops);

-- 作者列表查询
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================
-- categories 表索引
-- ============================================

-- slug 查找（已有 UNIQUE 索引）
-- CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);

-- 父分类查询
CREATE INDEX idx_categories_parent_id ON categories(parent_id) WHERE parent_id IS NOT NULL;

-- 排序
CREATE INDEX idx_categories_sort_order ON categories(sort_order ASC);

-- 名称搜索
CREATE INDEX idx_categories_name_trgm ON categories USING gin(name gin_trgm_ops);

-- ============================================
-- tags 表索引
-- ============================================

-- 名称搜索（用于自动完成）
CREATE INDEX idx_tags_name_trgm ON tags USING gin(name gin_trgm_ops);

-- 热门标签
CREATE INDEX idx_tags_post_count ON tags(post_count DESC);

-- ============================================
-- posts 表索引
-- ============================================

-- 作者查询
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- slug 查找（已有 UNIQUE 索引）
-- CREATE UNIQUE INDEX idx_posts_slug ON posts(slug);

-- 状态筛选
CREATE INDEX idx_posts_status ON posts(status);

-- 类型筛选
CREATE INDEX idx_posts_post_type ON posts(post_type);

-- 发布文章列表（复合索引）
CREATE INDEX idx_posts_published_status ON posts(status, published_at DESC NULLS LAST)
    WHERE status = 'publish';

-- 精选文章
CREATE INDEX idx_posts_featured ON posts(is_featured, published_at DESC)
    WHERE is_featured = TRUE AND status = 'publish';

-- 置顶文章
CREATE INDEX idx_posts_sticky ON posts(is_sticky, published_at DESC)
    WHERE is_sticky = TRUE AND status = 'publish';

-- 浏览量排序
CREATE INDEX idx_posts_view_count ON posts(view_count DESC)
    WHERE status = 'publish';

-- 点赞数排序
CREATE INDEX idx_posts_like_count ON posts(like_count DESC)
    WHERE status = 'publish';

-- 标题全文搜索
CREATE INDEX idx_posts_title_trgm ON posts USING gin(title gin_trgm_ops);

-- 内容全文搜索（中文需要额外配置 zhparser）
CREATE INDEX idx_posts_content_trgm ON posts USING gin(content gin_trgm_ops);

-- 元数据搜索（JSONB）
CREATE INDEX idx_posts_meta_gin ON posts USING gin(meta);

-- SEO 查询
CREATE INDEX idx_posts_seo_title ON posts(seo_title) WHERE seo_title IS NOT NULL;

-- 按日期查询
CREATE INDEX idx_posts_published_date ON posts(date_trunc('day', published_at))
    WHERE published_at IS NOT NULL;

-- ============================================
-- post_categories 表索引
-- ============================================

-- 查询分类下的所有文章
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);

-- 查询文章的所有分类
CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);

-- ============================================
-- post_tags 表索引
-- ============================================

-- 查询标签下的所有文章
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- 查询文章的所有标签
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);

-- ============================================
-- comments 表索引
-- ============================================

-- 文章评论查询
CREATE INDEX idx_comments_post_id ON comments(post_id, created_at DESC);

-- 用户评论查询
CREATE INDEX idx_comments_author_id ON comments(author_id) WHERE author_id IS NOT NULL;

-- 父评论查询（回复）
CREATE INDEX idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;

-- 待审核评论
CREATE INDEX idx_comments_status ON comments(status, created_at DESC)
    WHERE status = 'pending';

-- 评论审核队列
CREATE INDEX idx_comments_pending ON comments(created_at ASC)
    WHERE status = 'pending';

-- 垃圾评论过滤
CREATE INDEX idx_comments_spam ON comments(created_at DESC)
    WHERE status = 'spam';

-- 邮箱查找（访客评论）
CREATE INDEX idx_comments_author_email ON comments(author_email) WHERE author_email IS NOT NULL;

-- ============================================
-- media 表索引
-- ============================================

-- 上传者查询
CREATE INDEX idx_media_uploader_id ON media(uploader_id);

-- MIME 类型筛选
CREATE INDEX idx_media_mime_type ON media(mime_type);

-- 文件名搜索
CREATE INDEX idx_media_filename_trgm ON media USING gin(filename gin_trgm_ops);

-- 存储提供商
CREATE INDEX idx_media_storage_provider ON media(storage_provider);

-- ============================================
-- portfolios 表索引
-- ============================================

-- 作者查询
CREATE INDEX idx_portfolios_author_id ON portfolios(author_id);

-- slug 查找（已有 UNIQUE 索引）
-- CREATE UNIQUE INDEX idx_portfolios_slug ON portfolios(slug);

-- 状态筛选
CREATE INDEX idx_portfolios_status ON portfolios(status);

-- 精选作品
CREATE INDEX idx_portfolios_featured ON portfolios(is_featured, sort_order)
    WHERE is_featured = TRUE;

-- 排序
CREATE INDEX idx_portfolios_sort_order ON portfolios(sort_order ASC);

-- ============================================
-- portfolio_tags 表索引
-- ============================================

CREATE INDEX idx_portfolio_tags_tag_id ON portfolio_tags(tag_id);
CREATE INDEX idx_portfolio_tags_portfolio_id ON portfolio_tags(portfolio_id);

-- ============================================
-- portfolio_media 表索引
-- ============================================

CREATE INDEX idx_portfolio_media_portfolio_id ON portfolio_media(portfolio_id, sort_order);
CREATE INDEX idx_portfolio_media_media_id ON portfolio_media(media_id);

-- ============================================
-- subscribers 表索引
-- ============================================

-- 邮箱查找（已有 UNIQUE 索引）
-- CREATE UNIQUE INDEX idx_subscribers_email ON subscribers(email);

-- 状态筛选
CREATE INDEX idx_subscribers_status ON subscribers(status);

-- 确认令牌
CREATE INDEX idx_subscribers_confirmation_token ON subscribers(confirmation_token)
    WHERE confirmation_token IS NOT NULL;

-- 退订令牌
CREATE INDEX idx_subscribers_unsubscribe_token ON subscribers(unsubscribe_token)
    WHERE unsubscribe_token IS NOT NULL;

-- ============================================
-- reading_history 表索引
-- ============================================

-- 用户阅读历史
CREATE INDEX idx_reading_history_user_id ON reading_history(user_id, last_read_at DESC);

-- 文章阅读用户
CREATE INDEX idx_reading_history_post_id ON reading_history(post_id);

-- 阅读进度
CREATE INDEX idx_reading_history_completed ON reading_history(user_id, completed_at DESC)
    WHERE completed_at IS NOT NULL;

-- ============================================
-- bookmarks 表索引
-- ============================================

-- 用户书签
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id, created_at DESC);

-- 文章收藏者
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);

-- ============================================
-- likes 表索引
-- ============================================

-- 用户点赞
CREATE INDEX idx_likes_user_id ON likes(user_id, created_at DESC);

-- 文章点赞者
CREATE INDEX idx_likes_post_id ON likes(post_id);

-- ============================================
-- follows 表索引
-- ============================================

-- 用户关注的人
CREATE INDEX idx_follows_follower_id ON follows(follower_id, created_at DESC);

-- 用户的粉丝
CREATE INDEX idx_follows_following_id ON follows(following_id, created_at DESC);

-- ============================================
-- notifications 表索引
-- ============================================

-- 用户未读通知
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC)
    WHERE is_read = FALSE;

-- 通知类型
CREATE INDEX idx_notifications_type ON notifications(type, created_at DESC);

-- 清理旧通知
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- ============================================
-- search_logs 表索引
-- ============================================

-- 用户搜索历史
CREATE INDEX idx_search_logs_user_id ON search_logs(user_id, created_at DESC);

-- 热门搜索
CREATE INDEX idx_search_logs_query ON search_logs(query);

-- 搜索统计
CREATE INDEX idx_search_logs_created_at ON search_logs(date_trunc('day', created_at));

-- ============================================
-- analytics 表索引
-- ============================================

-- 时间序列查询
CREATE INDEX idx_analytics_date ON analytics(date DESC);

-- 指标类型
CREATE INDEX idx_analytics_metric_type ON analytics(metric_type, date DESC);

-- 文章统计
CREATE INDEX idx_analytics_post_id ON analytics(post_id, date DESC)
    WHERE post_id IS NOT NULL;

-- 用户统计
CREATE INDEX idx_analytics_user_id ON analytics(user_id, date DESC)
    WHERE user_id IS NOT NULL;

-- 维度搜索（JSONB）
CREATE INDEX idx_analytics_dimensions_gin ON analytics USING gin(dimensions);

-- ============================================
-- 全文搜索配置
-- ============================================

-- 创建全文搜索配置（支持多语言）
CREATE TEXT SEARCH CONFIGURATION cyberpress_fulltext (COPY = simple);

-- 添加中文搜索支持（需要 zhparser 扩展）
-- CREATE TEXT SEARCH CONFIGURATION chinese (COPY = simple);
-- ALTER TEXT SEARCH CONFIGURATION chinese
--     ALTER MAPPING FOR asciiword, asciihword, hword_asciipart, word, hword, hword_part
--     WITH stem_zh;

-- ============================================
-- 性能优化视图
-- ============================================

-- 热门文章视图
CREATE MATERIALIZED VIEW mv_popular_posts AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.published_at,
    u.display_name as author_name,
    COALESCE(p.view_count * 0.5 + p.like_count * 1 + p.comment_count * 2, 0) as popularity_score
FROM posts p
JOIN users u ON p.author_id = u.id
WHERE p.status = 'publish' AND p.published_at <= CURRENT_TIMESTAMP
ORDER BY popularity_score DESC;

CREATE UNIQUE INDEX idx_mv_popular_posts_id ON mv_popular_posts(id);
CREATE INDEX idx_mv_popular_posts_score ON mv_popular_posts(popularity_score DESC);

-- 分类统计视图
CREATE MATERIALIZED VIEW mv_category_stats AS
SELECT
    c.id,
    c.name,
    c.slug,
    c.post_count,
    COUNT(pc.post_id) as actual_post_count
FROM categories c
LEFT JOIN post_categories pc ON c.id = pc.category_id
GROUP BY c.id, c.name, c.slug, c.post_count;

CREATE UNIQUE INDEX idx_mv_category_stats_id ON mv_category_stats(id);

-- 标签云视图
CREATE MATERIALIZED VIEW mv_tag_cloud AS
SELECT
    t.id,
    t.name,
    t.slug,
    t.post_count,
    COUNT(pt.post_id) as actual_post_count
FROM tags t
LEFT JOIN post_tags pt ON t.id = pt.tag_id
GROUP BY t.id, t.name, t.slug, t.post_count
ORDER BY actual_post_count DESC;

CREATE UNIQUE INDEX idx_mv_tag_cloud_id ON mv_tag_cloud(id);

-- 作者统计视图
CREATE MATERIALIZED VIEW mv_author_stats AS
SELECT
    u.id,
    u.username,
    u.display_name,
    COUNT(p.id) as post_count,
    SUM(p.view_count) as total_views,
    SUM(p.like_count) as total_likes
FROM users u
LEFT JOIN posts p ON u.id = p.author_id AND p.status = 'publish'
GROUP BY u.id, u.username, u.display_name
ORDER BY post_count DESC;

CREATE UNIQUE INDEX idx_mv_author_stats_id ON mv_author_stats(id);

-- ============================================
-- 定期刷新物化视图
-- ============================================

-- 创建刷新函数
CREATE OR REPLACE FUNCTION refresh_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_popular_posts;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_category_stats;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_tag_cloud;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_author_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 索引使用情况分析
-- ============================================

-- 检查未使用的索引
-- SELECT
--     schemaname,
--     tablename,
--     indexname,
--     idx_scan as index_scans,
--     idx_tup_read as tuples_read,
--     idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes
-- WHERE idx_scan = 0
--   AND indexname NOT LIKE '%_pkey'
-- ORDER BY schemaname, tablename, indexname;

-- 检查索引大小
-- SELECT
--     tablename,
--     indexname,
--     pg_size_pretty(pg_relation_size(indexrelid::regclass)) as size
-- FROM pg_stat_user_indexes
-- ORDER BY pg_relation_size(indexrelid::regclass) DESC;

-- ============================================
-- 索引维护建议
-- ============================================

-- 1. 定期重建索引（维护窗口）
-- REINDEX TABLE CONCURRENTLY posts;
-- REINDEX TABLE CONCURRENTLY comments;

-- 2. 分析表统计信息
-- ANALYZE posts;
-- ANALYZE comments;

-- 3. 清理死元组
-- VACUUM ANALYZE posts;

-- 4. 设置自动清理
-- ALTER TABLE posts SET (autovacuum_analyze_scale_factor = 0.05);
-- ALTER TABLE posts SET (autovacuum_vacuum_scale_factor = 0.1);
