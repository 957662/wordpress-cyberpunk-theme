-- ============================================================================
-- CyberPress Platform - Performance Indexes
-- PostgreSQL Database Schema v1.0
-- ============================================================================
-- 说明: 高性能索引设计，用于优化查询性能
-- 作者: CyberPress Team
-- 创建日期: 2026-03-05
-- ============================================================================

-- 设置搜索路径
SET search_path TO public, pg_catalog;

-- ============================================================================
-- 索引设计原则
-- ============================================================================
-- 1. 为频繁查询的列创建索引
-- 2. 为 JOIN 操作的外键创建索引
-- 3. 为排序和分组操作创建索引
-- 4. 使用覆盖索引减少回表查询
-- 5. 合理使用复合索引
-- 6. 定期监控和优化索引使用情况
-- ============================================================================

-- ============================================================================
-- 1. 核心业务索引（已在 schema 文件中创建，这里进行补充）
-- ============================================================================

-- ============================================================================
-- 2. 复合索引优化
-- ============================================================================

-- 文章查询优化 - 热门文章列表
CREATE INDEX IF NOT EXISTS idx_posts_hot_articles
    ON posts(status, published_at DESC)
    WHERE status = 'publish' AND published_at IS NOT NULL;

-- 文章查询优化 - 作者文章列表
CREATE INDEX IF NOT EXISTS idx_posts_author_list
    ON posts(author_id, status, published_at DESC)
    WHERE status IN ('publish', 'private');

-- 文章查询优化 - 特色文章
CREATE INDEX IF NOT EXISTS idx_posts_featured_articles
    ON posts(featured, status, published_at DESC)
    WHERE featured = true AND status = 'publish';

-- 文章查询优化 - 浏览量排行
CREATE INDEX IF NOT EXISTS idx_posts_popular
    ON posts(view_count DESC, published_at DESC)
    WHERE status = 'publish' AND published_at > CURRENT_DATE - INTERVAL '30 days';

-- 评论查询优化 - 文章评论
CREATE INDEX IF NOT EXISTS idx_comments_post_approved
    ON comments(post_id, created_at DESC)
    WHERE status = 'approved';

-- 用户查询优化 - 活跃用户
CREATE INDEX IF NOT EXISTS idx_users_active
    ON users(status, last_login_at DESC)
    WHERE status = 'active';

-- ============================================================================
-- 3. 全文搜索索引优化
-- ============================================================================

-- 创建全文搜索配置
CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS chinese (COPY = simple);

-- 文章全文搜索（中文）
CREATE INDEX IF NOT EXISTS idx_posts_fulltext_chinese
    ON posts USING gin(to_tsvector('chinese', coalesce(title, '') || ' ' || coalesce(content, '')));

-- 用户全文搜索
CREATE INDEX IF NOT EXISTS idx_users_fulltext_name
    ON users USING gin(to_tsvector('english', coalesce(username, '') || ' ' || coalesce(email, '')));

-- 标签全文搜索
CREATE INDEX IF NOT EXISTS idx_tags_fulltext_search
    ON tags USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

-- 分类全文搜索
CREATE INDEX IF NOT EXISTS idx_categories_fulltext_search
    ON categories USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

-- ============================================================================
-- 4. 覆盖索引（包含查询所需的所有列）
-- ============================================================================

-- 文章列表查询（包含标题、作者、状态、发布时间）
CREATE INDEX IF NOT EXISTS idx_posts_covering_list
    ON posts(status, published_at DESC)
    INCLUDE (title, author_id, slug, excerpt, view_count, like_count)
    WHERE status = 'publish';

-- 用户列表查询（包含用户名、邮箱、角色、状态）
CREATE INDEX IF NOT EXISTS idx_users_covering_list
    ON users(status, created_at DESC)
    INCLUDE (username, email, role, display_name)
    WHERE status = 'active';

-- 评论列表查询（包含评论者、内容、状态）
CREATE INDEX IF NOT EXISTS idx_comments_covering_list
    ON comments(post_id, created_at DESC)
    INCLUDE (author_id, author_name, content, status)
    WHERE status = 'approved';

-- ============================================================================
-- 5. 条件索引（部分索引）
-- ============================================================================

-- 草稿文章索引
CREATE INDEX IF NOT EXISTS idx_posts_drafts
    ON posts(author_id, updated_at DESC)
    WHERE status = 'draft';

-- 待审核评论索引
CREATE INDEX IF NOT EXISTS idx_comments_pending
    ON comments(post_id, created_at ASC)
    WHERE status = 'pending';

-- 活跃用户关注关系索引
CREATE INDEX IF NOT EXISTS idx_user_follows_active
    ON users(id)
    WHERE EXISTS (
        SELECT 1 FROM user_follows
        WHERE user_follows.follower_id = users.id
        AND user_follows.status = 'active'
    );

-- 未读通知索引
CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON notifications(user_id, created_at DESC)
    WHERE is_read = false;

-- 即将过期的 API 令牌索引
CREATE INDEX IF NOT EXISTS idx_api_tokens_expiring_soon
    ON api_tokens(user_id, expires_at)
    WHERE is_revoked = false
    AND expires_at > CURRENT_TIMESTAMP
    AND expires_at < CURRENT_TIMESTAMP + INTERVAL '7 days';

-- ============================================================================
-- 6. JSONB 索引（用于查询 JSON 字段）
-- ============================================================================

-- 用户设置的社交链接索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_social_links
    ON user_profiles USING gin((social_links));

-- 文章元数据索引
CREATE INDEX IF NOT EXISTS idx_post_meta_key_value
    ON post_meta USING gin((meta_key), (meta_value));

-- 动态数据索引
CREATE INDEX IF NOT EXISTS idx_activities_data
    ON activities USING gin((data));

-- 通知数据索引
CREATE INDEX IF NOT EXISTS idx_notifications_data
    ON notifications USING gin((data));

-- 消息反应索引
CREATE INDEX IF NOT EXISTS idx_messages_reactions
    ON messages USING gin((reactions));

-- ============================================================================
-- 7. 唯一性约束索引
-- ============================================================================

-- 文章 slug 全局唯一（支持多语言）
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug_unique
    ON posts(slug, deleted_at)
    WHERE deleted_at IS NULL;

-- 用户名和邮箱唯一（支持软删除）
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique
    ON users(email)
    WHERE deleted_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique
    ON users(username)
    WHERE deleted_at IS NULL;

-- 分类 slug 唯一
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug_unique
    ON categories(slug)
    WHERE deleted_at IS NULL;

-- 标签 slug 唯一
CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_slug_unique
    ON tags(slug)
    WHERE deleted_at IS NULL;

-- ============================================================================
-- 8. 表达式索引（函数索引）
-- ============================================================================

-- 邮箱不区分大小写索引
CREATE INDEX IF NOT EXISTS idx_users_email_lower
    ON users(lower(email));

-- 用户名不区分大小写索引
CREATE INDEX IF NOT EXISTS idx_users_username_lower
    ON users(lower(username));

-- 文章 slug URL 编码索引
CREATE INDEX IF NOT EXISTS idx_posts_slug_url_encoded
    ON posts(slug);

-- 评论内容长度索引（用于查询长评论）
CREATE INDEX IF NOT EXISTS idx_comments_content_length
    ON comments(length(content));

-- ============================================================================
-- 9. 时间序列索引
-- ============================================================================

-- 最近发布的文章
CREATE INDEX IF NOT EXISTS idx_posts_recently_published
    ON posts(published_at DESC)
    WHERE status = 'publish'
    AND published_at > CURRENT_DATE - INTERVAL '7 days';

-- 最近活跃的用户
CREATE INDEX IF NOT EXISTS idx_users_recently_active
    ON users(last_login_at DESC)
    WHERE status = 'active'
    AND last_login_at > CURRENT_TIMESTAMP - INTERVAL '30 days';

-- 最近的分析事件
CREATE INDEX IF NOT EXISTS idx_analytics_events_recent
    ON analytics_events(created_at DESC)
    WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '7 days';

-- ============================================================================
-- 10. 统计查询优化索引
-- ============================================================================

-- 文章统计（每日）
CREATE INDEX IF NOT EXISTS idx_post_statistics_daily
    ON post_statistics(post_id, stat_date DESC)
    WHERE stat_date > CURRENT_DATE - INTERVAL '90 days';

-- 用户统计（每日）
CREATE INDEX IF NOT EXISTS idx_user_statistics_daily
    ON user_statistics(user_id, stat_date DESC)
    WHERE stat_date > CURRENT_DATE - INTERVAL '90 days';

-- 页面浏览统计（每小时）
CREATE INDEX IF NOT EXISTS idx_page_views_hourly
    ON page_views(created_at DESC, session_id)
    WHERE created_at > CURRENT_TIMESTAMP - INTERVAL '24 hours';

-- ============================================================================
-- 11. 社交功能索引
-- ============================================================================

-- 用户关注列表
CREATE INDEX IF NOT EXISTS idx_user_follows_following_list
    ON user_follows(follower_id, created_at DESC)
    WHERE status = 'active';

-- 用户粉丝列表
CREATE INDEX IF NOT EXISTS idx_user_follows_followers_list
    ON user_follows(following_id, created_at DESC)
    WHERE status = 'active';

-- 用户动态（按时间）
CREATE INDEX IF NOT EXISTS idx_activities_timeline
    ON activities(created_at DESC)
    WHERE visibility = 'public'
    AND deleted_at IS NULL;

-- 关注用户的动态
CREATE INDEX IF NOT EXISTS idx_activities_following
    ON activities(user_id, created_at DESC)
    WHERE visibility IN ('public', 'followers')
    AND deleted_at IS NULL;

-- ============================================================================
-- 12. 搜索优化索引
-- ============================================================================

-- 使用 pg_trgm 扩展创建三元组索引（模糊搜索）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 文章标题模糊搜索
CREATE INDEX IF NOT EXISTS idx_posts_title_trgm
    ON posts USING gin(title gin_trgm_ops);

-- 用户名模糊搜索
CREATE INDEX IF NOT EXISTS idx_users_username_trgm
    ON users USING gin(username gin_trgm_ops);

-- 标签名模糊搜索
CREATE INDEX IF NOT EXISTS idx_tags_name_trgm
    ON tags USING gin(name gin_trgm_ops);

-- 分类名模糊搜索
CREATE INDEX IF NOT EXISTS idx_categories_name_trgm
    ON categories USING gin(name gin_trgm_ops);

-- ============================================================================
-- 13. 性能监控索引
-- ============================================================================

-- API 性能监控（慢查询）
CREATE INDEX IF NOT EXISTS idx_api_performance_slow
    ON api_performance(response_time DESC, created_at DESC)
    WHERE response_time > 1000;  -- 大于1秒的查询

-- 查询性能监控（慢查询）
CREATE INDEX IF NOT EXISTS idx_query_performance_slow
    ON query_performance(execution_time DESC, created_at DESC)
    WHERE execution_time > 500;  -- 大于500ms的查询

-- 错误日志（最近的错误）
CREATE INDEX IF NOT EXISTS idx_error_logs_recent_errors
    ON error_logs(created_at DESC, error_level)
    WHERE error_level IN ('error', 'critical')
    AND created_at > CURRENT_TIMESTAMP - INTERVAL '7 days';

-- ============================================================================
-- 14. 缓存优化索引
-- ============================================================================

-- 用户权限缓存查询
CREATE INDEX IF NOT EXISTS idx_user_permissions_cache_lookup
    ON user_permissions_cache(user_id, updated_at DESC);

-- 会话活跃查询
CREATE INDEX IF NOT EXISTS idx_sessions_active
    ON sessions(user_id, last_activity DESC)
    WHERE ended_at IS NULL
    AND last_activity > CURRENT_TIMESTAMP - INTERVAL '1 hour';

-- ============================================================================
-- 15. 维护索引
-- ============================================================================

-- 为定期清理任务创建索引
CREATE INDEX IF NOT EXISTS idx_audit_logs_cleanup
    ON audit_logs(created_at)
    WHERE created_at < CURRENT_DATE - INTERVAL '90 days';

CREATE INDEX IF NOT EXISTS idx_page_views_cleanup
    ON page_views(created_at)
    WHERE created_at < CURRENT_DATE - INTERVAL '180 days';

CREATE INDEX IF NOT EXISTS idx_analytics_events_cleanup
    ON analytics_events(created_at)
    WHERE created_at < CURRENT_DATE - INTERVAL '90 days';

-- ============================================================================
-- 索引使用统计视图
-- ============================================================================

-- 创建索引使用情况统计视图
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    idx_scan,
    CASE
        WHEN idx_scan = 0 THEN 'UNUSED'
        WHEN idx_scan < 100 THEN 'LOW USAGE'
        WHEN idx_scan < 1000 THEN 'MEDIUM USAGE'
        ELSE 'HIGH USAGE'
    END AS usage_level
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- 创建索引大小统计视图
CREATE OR REPLACE VIEW index_size_stats AS
SELECT
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid::regclass)) AS index_size,
    pg_relation_size(indexrelid::regclass) AS index_size_bytes
FROM pg_stat_user_indexes
ORDER BY pg_relation_size(indexrelid::regclass) DESC;

-- ============================================================================
-- 索引维护建议
-- ============================================================================

-- 1. 定期运行 ANALYZE 更新统计信息
-- ANALYZE;

-- 2. 定期运行 VACUUM 清理死元组
-- VACUUM ANALYZE;

-- 3. 检查未使用的索引
-- SELECT * FROM index_usage_stats WHERE usage_level = 'UNUSED';

-- 4. 检查索引碎片
-- SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid::regclass))
-- FROM pg_stat_user_indexes
-- ORDER BY pg_relation_size(indexrelid::regclass) DESC;

-- 5. 重建大索引（如果需要）
-- REINDEX INDEX CONCURRENTLY idx_posts_covering_list;

-- ============================================================================
-- 完成
-- ============================================================================

-- 添加注释
COMMENT ON SCHEMA public IS 'CyberPress Platform - Public Schema';

-- 性能索引创建完成
-- 建议：在生产环境中，使用 CONCURRENTLY 选项创建索引，避免锁表
-- 示例：CREATE INDEX CONCURRENTLY idx_posts_covering_list ON posts(...)
