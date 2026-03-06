-- ====================================================================
-- CyberPress Platform - 性能优化索引迁移
-- ====================================================================
-- 创建时间: 2026-03-07
-- 目的: 添加性能优化索引
-- ====================================================================

USE `cyberpress`;

-- ====================================================================
-- 1. 文章表性能优化索引
-- ====================================================================

-- 复合索引用于热门文章查询
CREATE INDEX IF NOT EXISTS `idx_hot_posts`
ON `posts`(`status`, `published_at`, `view_count` DESC, `like_count` DESC);

-- 复合索引用于作者文章列表（含状态过滤）
CREATE INDEX IF NOT EXISTS `idx_author_published`
ON `posts`(`author_id`, `status`, `published_at` DESC);

-- 覆盖索引用于文章列表（避免回表）
CREATE INDEX IF NOT EXISTS `idx_covering_list`
ON `posts`(`status`, `published_at` DESC, `id`, `title`, `slug`, `excerpt`, `featured_image`);

-- ====================================================================
-- 2. 评论表性能优化索引
-- ====================================================================

-- 复合索引用于获取评论及其回复
CREATE INDEX IF NOT EXISTS `idx_post_parent_created`
ON `comments`(`post_id`, `parent_id`, `created_at` DESC);

-- 覆盖索引用于评论列表
CREATE INDEX IF NOT EXISTS `idx_comments_covering`
ON `comments`(`post_id`, `status`, `id`, `author_id`, `content`, `created_at`, `like_count`);

-- ====================================================================
-- 3. 用户表性能优化索引
-- ====================================================================

-- 复合索引用于活跃用户查询
CREATE INDEX IF NOT EXISTS `idx_active_users`
ON `users`(`status`, `created_at` DESC, `followers_count` DESC);

-- ====================================================================
-- 4. 通知表性能优化索引
-- ====================================================================

-- 覆盖索引用于未读通知列表
CREATE INDEX IF NOT EXISTS `idx_notifications_covering`
ON `notifications`(`user_id`, `is_read`, `created_at` DESC, `id`, `type`, `title`, `content`);

-- ====================================================================
-- 5. 点赞表性能优化索引
-- ====================================================================

-- 复合索引用于文章点赞用户列表
CREATE INDEX IF NOT EXISTS `idx_post_likes`
ON `likes`(`target_id`, `target_type`, `created_at` DESC, `user_id`);

-- ====================================================================
-- 6. 收藏表性能优化索引
-- ====================================================================

-- 复合索引用于公开收藏列表
CREATE INDEX IF NOT EXISTS `idx_public_bookmarks`
ON `bookmarks`(`user_id`, `created_at` DESC, `post_id`, `folder_id`);

-- ====================================================================
-- 7. 阅读历史性能优化索引
-- ====================================================================

-- 复合索引用于继续阅读功能
CREATE INDEX IF NOT EXISTS `idx_continue_reading`
ON `reading_history`(`user_id`, `is_completed`, `last_read_at` DESC, `post_id`, `progress_percent`);

-- ====================================================================
-- 8. 关注关系性能优化索引
-- ====================================================================

-- 复合索引用于关注推荐
CREATE INDEX IF NOT EXISTS `idx_follow_recommendations`
ON `followers`(`following_id`, `created_at` DESC, `follower_id`);

-- ====================================================================
-- 9. 全文搜索索引优化
-- ====================================================================

-- 为文章表添加 ngram 全文索引（支持中文搜索）
CREATE FULLTEXT INDEX IF NOT EXISTS `ft_content_ngram`
ON `posts`(`title`, `content`, `excerpt`)
WITH PARSER ngram;

-- ====================================================================
-- 10. 分区表维护
-- ====================================================================

-- 为 post_views 表添加新的年度分区（需要执行）
-- ALTER TABLE `post_views` ADD PARTITION (
--     PARTITION p2028 VALUES LESS THAN (2029)
-- );

-- ====================================================================
-- 索引统计信息更新
-- ====================================================================

ANALYZE TABLE `users`;
ANALYZE TABLE `posts`;
ANALYZE TABLE `comments`;
ANALYZE TABLE `likes`;
ANALYZE TABLE `bookmarks`;
ANALYZE TABLE `reading_history`;
ANALYZE TABLE `notifications`;
ANALYZE TABLE `post_views`;

-- ====================================================================
-- 验证索引创建
-- ====================================================================

-- 显示所有索引
SELECT
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX,
    INDEX_TYPE
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'cyberpress'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- 显示索引大小
SELECT
    TABLE_NAME,
    INDEX_NAME,
    ROUND(STAT_VALUE * @@innodb_page_size / 1024 / 1024, 2) AS 'Size (MB)'
FROM mysql.innodb_index_stats
WHERE DATABASE_NAME = 'cyberpress'
  AND STAT_NAME = 'size'
ORDER BY STAT_VALUE DESC;

-- ====================================================================
-- 完成
-- ====================================================================

SELECT '✅ 性能优化索引迁移完成！' AS message;
