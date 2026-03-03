-- CyberPress Platform - PostgreSQL 索引设计
-- 版本: 1.0.0
-- 创建日期: 2026-03-03

-- ============================================
-- 用户表索引
-- ============================================

-- 用户名索引（已通过 UNIQUE 约束自动创建）
-- email 索引（已通过 UNIQUE 约束自动创建）

-- 角色查询索引
CREATE INDEX idx_users_role ON users(role) WHERE is_active = TRUE;

-- 搜索索引（用户名和全名）
CREATE INDEX idx_users_search ON users USING gin(
    username gin_trgm_ops,
    full_name gin_trgm_ops
);

-- 最后登录时间索引（用于活跃用户查询）
CREATE INDEX idx_users_last_login ON users(last_login_at DESC) WHERE last_login_at IS NOT NULL;

-- ============================================
-- 分类表索引
-- ============================================

-- slug 索引（已通过 UNIQUE 约束自动创建）

-- 父分类查询索引
CREATE INDEX idx_categories_parent ON categories(parent_id) WHERE parent_id IS NOT NULL;

-- 排序索引
CREATE INDEX idx_categories_sort ON categories(sort_order ASC, post_count DESC);

-- 名称搜索索引
CREATE INDEX idx_categories_name ON categories USING gin(name gin_trgm_ops);

-- ============================================
-- 标签表索引
-- ============================================

-- slug 索引（已通过 UNIQUE 约束自动创建）

-- 名称搜索索引
CREATE INDEX idx_tags_name ON tags USING gin(name gin_trgm_ops);

-- 热门标签索引
CREATE INDEX idx_tags_popular ON tags(post_count DESC) WHERE post_count > 0;

-- ============================================
-- 媒体表索引
-- ============================================

-- 上传者查询索引
CREATE INDEX idx_media_uploader ON media(uploaded_by);

-- MIME 类型筛选索引
CREATE INDEX idx_media_mime ON media(mime_type);

-- 文件名搜索索引
CREATE INDEX idx_media_filename ON media USING gin(filename gin_trgm_ops);

-- 尺寸筛选索引（用于查找特定尺寸的图片）
CREATE INDEX idx_media_dimensions ON media(width, height) WHERE width IS NOT NULL;

-- ============================================
-- 文章表索引
-- ============================================

-- slug 索引（已通过 UNIQUE 约束自动创建）

-- 作者查询索引
CREATE INDEX idx_posts_author ON posts(author_id) WHERE status = 'published';

-- 分类查询索引
CREATE INDEX idx_posts_category ON posts(category_id) WHERE status = 'published';

-- 状态和发布时间复合索引
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC);

-- 特色文章索引
CREATE INDEX idx_posts_featured ON posts(featured, published_at DESC) WHERE featured = TRUE AND status = 'published';

-- 置顶文章索引
CREATE INDEX idx_posts_sticky ON posts(sticky, published_at DESC) WHERE sticky = TRUE AND status = 'published';

-- 浏览量排序索引
CREATE INDEX idx_posts_popular ON posts(view_count DESC) WHERE status = 'published';

-- 点赞数排序索引
CREATE INDEX idx_posts_liked ON posts(like_count DESC) WHERE status = 'published';

-- 全文搜索索引（标题和内容）
CREATE INDEX idx_posts_fulltext ON posts USING gin(
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content, ''))
);

-- 文章类型索引
CREATE INDEX idx_posts_type ON posts(post_type, status, published_at DESC);

-- 作者和状态复合索引
CREATE INDEX idx_posts_author_status ON posts(author_id, status, published_at DESC);

-- ============================================
-- 文章-标签关联表索引
-- ============================================

-- tag_id 索引（用于查找某个标签的所有文章）
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);

-- 创建时间索引
CREATE INDEX idx_post_tags_created ON post_tags(created_at);

-- ============================================
-- 评论表索引
-- ============================================

-- 文章评论查询索引
CREATE INDEX idx_comments_post ON comments(post_id, status, created_at DESC);

-- 用户评论查询索引
CREATE INDEX idx_comments_user ON comments(user_id, created_at DESC);

-- 父评论索引（用于查找子评论）
CREATE INDEX idx_comments_parent ON comments(parent_id) WHERE parent_id IS NOT NULL;

-- 待审核评论索引
CREATE INDEX idx_comments_pending ON comments(created_at) WHERE status = 'pending';

-- 评论者邮箱索引
CREATE INDEX idx_comments_email ON comments(author_email) WHERE status = 'approved';

-- 全文搜索索引
CREATE INDEX idx_comments_fulltext ON comments USING gin(
    to_tsvector('simple', coalesce(content, ''))
);

-- ============================================
-- 作品集表索引
-- ============================================

-- slug 索引（已通过 UNIQUE 约束自动创建）

-- 状态查询索引
CREATE INDEX idx_portfolios_status ON portfolos(status, sort_order);

-- 特色项目索引
CREATE INDEX idx_portfolios_featured ON portfolios(featured, sort_order) WHERE featured = TRUE;

-- 技术栈索引（用于按技术筛选项目）
CREATE INDEX idx_portfolios_technologies ON portfolios USING gin(technologies);

-- 时间范围索引
CREATE INDEX idx_portfolios_dates ON portfolios(start_date DESC, end_date DESC);

-- 全文搜索索引
CREATE INDEX idx_portfolios_fulltext ON portfolios USING gin(
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- ============================================
-- 阅读列表索引
-- ============================================

-- 用户阅读列表索引
CREATE INDEX idx_reading_list_user ON reading_list(user_id, updated_at DESC);

-- 已读/未读筛选索引
CREATE INDEX idx_reading_list_unread ON reading_list(user_id, is_read) WHERE is_read = FALSE;

-- 进度索引
CREATE INDEX idx_reading_list_progress ON reading_list(user_id, read_progress DESC);

-- ============================================
-- 通知表索引
-- ============================================

-- 用户未读通知索引
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC) WHERE is_read = FALSE;

-- 通知类型索引
CREATE INDEX idx_notifications_type ON notifications(user_id, type, created_at DESC);

-- 过期通知清理索引
CREATE INDEX idx_notifications_expires ON notifications(created_at) WHERE expires_at IS NOT NULL;

-- ============================================
-- 用户设置表索引
-- ============================================

-- 用户设置查询索引
CREATE INDEX idx_user_settings_user ON user_settings(user_id, category);

-- 键名搜索索引
CREATE INDEX idx_user_settings_key ON user_settings(key);

-- ============================================
-- 分析表索引
-- ============================================

-- 文章分析索引
CREATE INDEX idx_analytics_post ON analytics(post_id, created_at DESC);

-- 用户活动索引
CREATE INDEX idx_analytics_user ON analytics(user_id, created_at DESC);

-- 事件类型索引
CREATE INDEX idx_analytics_event_type ON analytics(event_type, created_at DESC);

-- 会话索引
CREATE INDEX idx_analytics_session ON analytics(session_id, created_at DESC);

-- 时间范围索引（用于数据统计）
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);

-- ============================================
-- 点赞表索引
-- ============================================

-- user_id 索引（用于查找用户的所有点赞）
CREATE INDEX idx_likes_user ON likes(user_id, created_at DESC);

-- 目标对象索引（用于查找某个对象的所有点赞）
CREATE INDEX idx_likes_target ON likes(target_type, target_id);

-- 复合唯一索引（已通过 UNIQUE 约束自动创建）

-- ============================================
-- 密码重置表索引
-- ============================================

-- token 索引（已通过 UNIQUE 约束自动创建）

-- 用户索引
CREATE INDEX idx_password_resets_user ON password_resets(user_id, created_at DESC);

-- 过期时间索引（用于清理过期token）
CREATE INDEX idx_password_resets_expires ON password_resets(expires_at);

-- ============================================
-- 会话表索引
-- ============================================

-- 用户会话索引
CREATE INDEX idx_sessions_user ON sessions(user_id, last_activity DESC);

-- 最后活动时间索引（用于清理过期会话）
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity);

-- ============================================
-- 性能优化建议
-- ============================================

-- 1. 定期维护索引
-- REINDEX INDEX idx_posts_fulltext;
-- REINDEX INDEX idx_comments_fulltext;

-- 2. 更新统计信息
-- ANALYZE posts;
-- ANALYZE comments;
-- ANALYZE users;

-- 3. 清理死元组
-- VACUUM ANALYZE posts;
-- VACUUM ANALYZE comments;

-- 4. 监控索引使用情况
-- SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';

-- 5. 查找未使用的索引
-- SELECT
--     schemaname,
--     tablename,
--     indexname,
--     idx_scan
-- FROM pg_stat_user_indexes
-- WHERE idx_scan = 0
-- AND indexname NOT LIKE '%_pkey'
-- ORDER BY schemaname, tablename;

-- ============================================
-- 分区建议（大数据量时使用）
-- ============================================

-- 对 analytics 表按月分区
-- CREATE TABLE analytics (
--     -- ... same columns ...
-- ) PARTITION BY RANGE (created_at);

-- CREATE TABLE analytics_2026_01 PARTITION OF analytics
--     FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

-- CREATE TABLE analytics_2026_02 PARTITION OF analytics
--     FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

-- 自动创建未来月份的分区（需要使用 pg_cron 扩展或外部脚本）
