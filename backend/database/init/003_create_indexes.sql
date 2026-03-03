-- ============================================================================
-- CyberPress Platform - 索引优化脚本
-- ============================================================================
-- 功能: 创建性能优化索引，提升查询效率
-- 版本: 1.0.0
-- 日期: 2026-03-03
-- ============================================================================

-- ============================================================================
-- 1. 用户表索引
-- ============================================================================

-- 用户名唯一索引（已存在，这里作为注释参考）
-- CREATE UNIQUE INDEX idx_users_username ON users(username);

-- 邮箱唯一索引（已存在）
-- CREATE UNIQUE INDEX idx_users_email ON users(email);

-- 角色索引（用于权限查询）
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 状态索引（用于过滤活跃用户）
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 复合索引：角色 + 状态（常用的管理员查询）
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

-- 创建时间索引（用于按时间排序）
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- 全文搜索索引（用户名和全名）
CREATE INDEX IF NOT EXISTS idx_users_fulltext ON users USING gin(
  to_tsvector('simple', COALESCE(username, '') || ' ' || COALESCE(full_name, ''))
);

-- ============================================================================
-- 2. 文章表索引
-- ============================================================================

-- slug 唯一索引（已存在）
-- CREATE UNIQUE INDEX idx_posts_slug ON posts(slug);

-- 作者 ID 索引（用于查询某作者的所有文章）
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);

-- 分类 ID 索引（用于查询某分类下的文章）
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);

-- 状态索引（用于过滤已发布文章）
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);

-- 文章类型索引（用于区分文章、页面等）
CREATE INDEX IF NOT EXISTS idx_posts_post_type ON posts(post_type);

-- 特色文章索引（用于首页展示）
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured) WHERE featured = true;

-- 置顶文章索引（用于置顶文章查询）
CREATE INDEX IF NOT EXISTS idx_posts_sticky ON posts(sticky) WHERE sticky = true;

-- 发布时间索引（用于按时间排序和归档）
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);

-- 浏览量索引（用于热门文章排序）
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count DESC);

-- 点赞数索引（用于最受欢迎文章排序）
CREATE INDEX IF NOT EXISTS idx_posts_like_count ON posts(like_count DESC);

-- 复合索引：状态 + 发布时间（常用的文章列表查询）
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status, published_at DESC);

-- 复合索引：状态 + 特色 + 发布时间（首页特色文章查询）
CREATE INDEX IF NOT EXISTS idx_posts_status_featured_published ON posts(status, featured, published_at DESC)
WHERE status = 'published';

-- 复合索引：分类 + 状态 + 发布时间（分类页面查询）
CREATE INDEX IF NOT EXISTS idx_posts_category_status_published ON posts(category_id, status, published_at DESC)
WHERE status = 'published';

-- 复合索引：作者 + 状态 + 发布时间（作者页面查询）
CREATE INDEX IF NOT EXISTS idx_posts_author_status_published ON posts(author_id, status, published_at DESC)
WHERE status = 'published';

-- 全文搜索索引（标题和摘要）
CREATE INDEX IF NOT EXISTS idx_posts_fulltext ON posts USING gin(
  to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(excerpt, '') || ' ' || COALESCE(content, ''))
);

-- 部分索引：只索引已发布的文章
CREATE INDEX IF NOT EXISTS idx_posts_published_fulltext ON posts USING gin(
  to_tsvector('simple', title || ' ' || COALESCE(excerpt, '') || ' ' || content)
) WHERE status = 'published';

-- ============================================================================
-- 3. 评论表索引
-- ============================================================================

-- 文章 ID 索引（用于查询某文章的所有评论）
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- 作者 ID 索引（用于查询某用户的所有评论）
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);

-- 父评论 ID 索引（用于查询子评论）
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;

-- 状态索引（用于审核状态过滤）
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);

-- 复合索引：文章 + 状态 + 创建时间（文章评论列表查询）
CREATE INDEX IF NOT EXISTS idx_comments_post_status_created ON comments(post_id, status, created_at DESC);

-- 复合索引：作者 + 状态（用户评论管理）
CREATE INDEX IF NOT EXISTS idx_comments_author_status ON comments(author_id, status);

-- ============================================================================
-- 4. 分类表索引
-- ============================================================================

-- slug 唯一索引（已存在）
-- CREATE UNIQUE INDEX idx_categories_slug ON categories(slug);

-- 父分类索引（用于层级查询）
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id) WHERE parent_id IS NOT NULL;

-- 显示顺序索引（用于排序）
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- ============================================================================
-- 5. 标签表索引
-- ============================================================================

-- slug 唯一索引（已存在）
-- CREATE UNIQUE INDEX idx_tags_slug ON tags(slug);

-- 名称索引（用于搜索）
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- 颜色索引（用于主题筛选）
CREATE INDEX IF NOT EXISTS idx_tags_color ON tags(color);

-- ============================================================================
-- 6. 文章标签关联表索引
-- ============================================================================

-- 文章 ID 索引（用于查询文章的所有标签）
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);

-- 标签 ID 索引（用于查询某标签的所有文章）
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

-- 复合唯一索引（已存在）
-- CREATE UNIQUE INDEX idx_post_tags_post_tag ON post_tags(post_id, tag_id);

-- ============================================================================
-- 7. 媒体表索引
-- ============================================================================

-- 上传者 ID 索引（用于查询某用户的媒体）
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);

-- 文件类型索引（用于按类型筛选）
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);

-- MIME 类型索引（用于按 MIME 类型筛选）
CREATE INDEX IF NOT EXISTS idx_media_mime_type ON media(mime_type);

-- 复合索引：上传者 + 文件类型（媒体库查询）
CREATE INDEX IF NOT EXISTS idx_media_uploader_type ON media(uploaded_by, file_type);

-- 全文搜索索引（文件名和标题）
CREATE INDEX IF NOT EXISTS idx_media_fulltext ON media USING gin(
  to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(file_name, ''))
);

-- ============================================================================
-- 8. 选项表索引
-- ============================================================================

-- 选项名唯一索引（已存在）
-- CREATE UNIQUE INDEX idx_site_options_name ON site_options(option_name);

-- 自动加载索引（用于查询自动加载的选项）
CREATE INDEX IF NOT EXISTS idx_site_options_autoload ON site_options(autoload);

-- ============================================================================
-- 9. 链接表索引
-- ============================================================================

-- 分类索引（用于友情链接分类查询）
CREATE INDEX IF NOT EXISTS idx_links_category ON links(category);

-- 可见性索引（用于过滤显示的链接）
CREATE INDEX IF NOT EXISTS idx_links_visible ON links(visible);

-- ============================================================================
-- 10. 术语表索引
-- ============================================================================

-- 词汇唯一索引（已存在）
-- CREATE UNIQUE INDEX idx_glossary_term ON glossary(term);

-- 类别索引（用于术语分类）
CREATE INDEX IF NOT EXISTS idx_glossary_category ON glossary(category);

-- 首字母索引（用于 A-Z 索引）
CREATE INDEX IF NOT EXISTS idx_glossary_first_letter ON glossary(SUBSTRING(UPPER(term), 1, 1));

-- ============================================================================
-- 11. 代码片段表索引
-- ============================================================================

-- 作者 ID 索引（用于查询某用户的代码片段）
CREATE INDEX IF NOT EXISTS idx_code_snippets_author_id ON code_snippets(author_id);

-- 语言索引（用于按编程语言筛选）
CREATE INDEX IF NOT EXISTS idx_code_snippets_language ON code_snippets(language);

-- 状态索引（用于审核状态过滤）
CREATE INDEX IF NOT EXISTS idx_code_snippets_status ON code_snippets(status);

-- 复合索引：语言 + 状态 + 创建时间（代码片段列表查询）
CREATE INDEX IF NOT EXISTS idx_code_snippets_language_status_created ON code_snippets(language, status, created_at DESC);

-- 全文搜索索引（标题和描述）
CREATE INDEX IF NOT EXISTS idx_code_snippets_fulltext ON code_snippets USING gin(
  to_tsvector('simple', COALESCE(title, '') || ' ' || COALESCE(description, ''))
);

-- ============================================================================
-- 12. 邮件订阅表索引
-- ============================================================================

-- 邮箱唯一索引（已存在）
-- CREATE UNIQUE INDEX idx_newsletter_email ON newsletter_subscriptions(email);

-- 状态索引（用于过滤活跃订阅）
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);

-- 订阅时间索引（用于按时间排序）
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed_at ON newsletter_subscriptions(subscribed_at DESC);

-- ============================================================================
-- 13. 活动日志表索引
-- ============================================================================

-- 用户 ID 索引（用于查询用户活动）
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id) WHERE user_id IS NOT NULL;

-- 操作类型索引（用于按操作类型筛选）
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);

-- IP 地址索引（用于安全分析）
CREATE INDEX IF NOT EXISTS idx_activity_logs_ip_address ON activity_logs(ip_address);

-- 创建时间索引（用于按时间查询）
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- 复合索引：用户 + 操作 + 时间（用户活动历史）
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_action_time ON activity_logs(user_id, action, created_at DESC);

-- 复合索引：操作 + 时间（全局操作统计）
CREATE INDEX IF NOT EXISTS idx_activity_logs_action_time ON activity_logs(action, created_at DESC);

-- ============================================================================
-- 14. 统计数据表索引
-- ============================================================================

-- 资源类型索引（用于按类型筛选统计）
CREATE INDEX IF NOT EXISTS idx_analytics_resource_type ON analytics(resource_type);

-- 日期索引（用于按日期查询统计）
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date DESC);

-- 复合索引：资源 + 日期（统计趋势查询）
CREATE INDEX IF NOT EXISTS idx_analytics_resource_date ON analytics(resource_type, resource_id, date DESC);

-- ============================================================================
-- 15. 任务队列表索引
-- ============================================================================

-- 任务状态索引（用于获取待执行任务）
CREATE INDEX IF NOT EXISTS idx_job_queue_status ON job_queue(status);

-- 任务类型索引（用于按类型筛选）
CREATE INDEX IF NOT EXISTS idx_job_queue_type ON job_queue(job_type);

-- 计划执行时间索引（用于定时任务查询）
CREATE INDEX IF NOT EXISTS idx_job_queue_scheduled_at ON job_queue(scheduled_at) WHERE status = 'pending';

-- 优先级索引（用于高优先级任务）
CREATE INDEX IF NOT EXISTS idx_job_queue_priority ON job_queue(priority DESC, scheduled_at) WHERE status = 'pending';

-- 复合索引：状态 + 计划时间（任务队列查询）
CREATE INDEX IF NOT EXISTS idx_job_queue_status_scheduled ON job_queue(status, scheduled_at);

-- ============================================================================
-- 性能优化建议
-- ============================================================================

-- 1. 定期运行 ANALYZE 更新统计信息
-- ANALYZE;

-- 2. 定期运行 VACUUM 回收空间
-- VACUUM ANALYZE;

-- 3. 监控索引使用情况，删除未使用的索引
-- SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;

-- 4. 考虑使用 BRIN 索引对大表进行优化（如日志表）
-- CREATE INDEX idx_activity_logs_created_at_brin ON activity_logs USING brin(created_at);

-- 5. 对全文搜索进行自定义配置
-- CREATE TEXT SEARCH CONFIGURATION chinese (COPY = simple);

-- ============================================================================
-- 索引统计信息
-- ============================================================================

DO $$
DECLARE
  index_count INT;
  index_size TEXT;
BEGIN
  -- 统计索引数量
  SELECT COUNT(*) INTO index_count FROM pg_indexes WHERE schemaname = 'public';

  -- 统计索引大小
  SELECT pg_size_pretty(sum(pg_relation_size(idx))::bigint)
  INTO index_size
  FROM (
    SELECT indexrelid as idx
    FROM pg_stat_user_indexes
  ) sub;

  RAISE NOTICE '=== 索引创建完成 ===';
  RAISE NOTICE '索引总数: %', index_count;
  RAISE NOTICE '索引总大小: %', index_size;
  RAISE NOTICE '===================';
END $$;

-- ============================================================================
-- 维护命令参考
-- ============================================================================

/*
-- 重建所有索引（谨慎使用，会锁表）
REINDEX DATABASE cyberpress;

-- 重建单个表的索引
REINDEX TABLE posts;

-- 查看索引使用情况
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- 查看表和索引大小
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 查看缺失的索引（潜在优化点）
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
ORDER BY n_distinct DESC;
*/

-- ============================================================================
-- 完成
-- ============================================================================

-- 输出完成信息
SELECT '✅ 所有索引创建完成！' as status;
