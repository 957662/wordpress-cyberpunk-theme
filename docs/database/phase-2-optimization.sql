-- ============================================
-- WordPress Cyberpunk Theme - Phase 2 Database Optimization
-- ============================================
-- Author: Database Architect
-- Date: 2026-02-28
-- Description: 创建优化的自定义表,提升性能
-- ============================================

-- 设置表前缀 (根据实际情况修改)
SET @prefix = 'wp_';

-- ============================================
-- 1. 创建用户互动表 (点赞、收藏、分享)
-- ============================================

CREATE TABLE IF NOT EXISTS `@prefixcyberpunk_user_actions` (
    `action_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` bigint(20) UNSIGNED NOT NULL,
    `post_id` bigint(20) UNSIGNED NOT NULL,
    `action_type` enum('like', 'bookmark', 'share') NOT NULL,
    `action_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `ip_address` varchar(45) NOT NULL,
    `user_agent` varchar(255) DEFAULT NULL,

    PRIMARY KEY (`action_id`),

    -- 防止重复操作
    UNIQUE KEY `idx_unique_user_post_action` (`user_id`, `post_id`, `action_type`),

    -- 性能优化索引
    KEY `idx_user_id` (`user_id`),
    KEY `idx_post_id` (`post_id`),
    KEY `idx_action_type` (`action_type`),
    KEY `idx_action_time` (`action_time`),
    KEY `idx_user_action_type` (`user_id`, `action_type`),
    KEY `idx_post_action_type` (`post_id`, `action_type`),
    KEY `idx_action_type_time` (`action_type`, `action_time`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme - User Interactions (Likes, Bookmarks, Shares)';

-- ============================================
-- 2. 创建访问日志表
-- ============================================

CREATE TABLE IF NOT EXISTS `@prefixcyberpunk_visits` (
    `visit_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` bigint(20) UNSIGNED NOT NULL,
    `user_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0',
    `ip_address` varchar(45) NOT NULL,
    `user_agent` varchar(255) DEFAULT NULL,
    `visit_url` varchar(500) DEFAULT NULL,
    `referer` varchar(500) DEFAULT NULL,
    `visit_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `session_id` varchar(100) DEFAULT NULL,

    PRIMARY KEY (`visit_id`),
    KEY `idx_post_id` (`post_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_visit_time` (`visit_time`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_post_time` (`post_id`, `visit_time`),
    KEY `idx_user_time` (`user_id`, `visit_time`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme - Visit Logs';

-- ============================================
-- 3. 创建阅读进度表
-- ============================================

CREATE TABLE IF NOT EXISTS `@prefixcyberpunk_reading_progress` (
    `user_id` bigint(20) UNSIGNED NOT NULL,
    `post_id` bigint(20) UNSIGNED NOT NULL,
    `progress` decimal(5,2) NOT NULL DEFAULT '0.00',
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`user_id`, `post_id`),
    KEY `idx_updated_at` (`updated_at`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme - Reading Progress Tracking';

-- ============================================
-- 4. 创建社交分享统计表
-- ============================================

CREATE TABLE IF NOT EXISTS `@prefixcyberpunk_shares` (
    `share_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` bigint(20) UNSIGNED NOT NULL,
    `platform` varchar(50) NOT NULL,
    `share_count` int(11) UNSIGNED NOT NULL DEFAULT '0',
    `share_url` varchar(500) DEFAULT NULL,
    `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`share_id`),
    UNIQUE KEY `idx_unique_post_platform` (`post_id`, `platform`),
    KEY `idx_post_id` (`post_id`),
    KEY `idx_platform` (`platform`),
    KEY `idx_share_count` (`share_count`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme - Social Share Statistics';

-- ============================================
-- 5. 创建数据分析视图
-- ============================================

-- 文章统计汇总视图
CREATE OR REPLACE VIEW `@prefixcyberpunk_post_stats` AS
SELECT
    p.ID as post_id,
    p.post_title,
    p.post_type,
    p.post_date,
    CAST(COALESCE(pm_views.meta_value, 0) AS UNSIGNED) as views_count,
    COUNT(DISTINCT CASE WHEN cua.action_type = 'like' THEN cua.action_id END) as likes_count,
    COUNT(DISTINCT CASE WHEN cua.action_type = 'bookmark' THEN cua.action_id END) as bookmarks_count,
    COUNT(DISTINCT cv.visit_id) as visits_count,
    p.comment_count as comments_count,
    SUM(cs.share_count) as total_shares
FROM `@prefixposts` p
LEFT JOIN `@prefixpostmeta` pm_views
    ON p.ID = pm_views.post_id
    AND pm_views.meta_key = 'cyberpunk_views_count'
LEFT JOIN `@prefixcyberpunk_user_actions` cua
    ON p.ID = cua.post_id
LEFT JOIN `@prefixcyberpunk_visits` cv
    ON p.ID = cv.post_id
LEFT JOIN `@prefixcyberpunk_shares` cs
    ON p.ID = cs.post_id
WHERE p.post_status = 'publish'
GROUP BY p.ID;

-- 用户活跃度视图
CREATE OR REPLACE VIEW `@prefixcyberpunk_user_activity` AS
SELECT
    u.ID as user_id,
    u.user_login,
    u.display_name,
    COUNT(DISTINCT CASE WHEN cua.action_type = 'like' THEN cua.action_id END) as total_likes,
    COUNT(DISTINCT CASE WHEN cua.action_type = 'bookmark' THEN cua.action_id END) as total_bookmarks,
    COUNT(DISTINCT cv.visit_id) as total_visits,
    MAX(cv.visit_time) as last_visit
FROM `@prefixusers` u
LEFT JOIN `@prefixcyberpunk_user_actions` cua
    ON u.ID = cua.user_id
LEFT JOIN `@prefixcyberpunk_visits` cv
    ON u.ID = cv.user_id
GROUP BY u.ID;

-- ============================================
-- 6. 创建存储过程
-- ============================================

DELIMITER $$

-- 清理旧访问日志
CREATE PROCEDURE IF NOT EXISTS `cyberpunk_clean_old_visits`(IN days_to_keep INT)
BEGIN
    DECLARE deleted_count INT DEFAULT 0;

    DELETE FROM `@prefixcyberpunk_visits`
    WHERE visit_time < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);

    SET deleted_count = ROW_COUNT();

    -- 优化表
    OPTIMIZE TABLE `@prefixcyberpunk_visits`;

    SELECT deleted_count as deleted_rows;
END$$

-- 更新文章浏览数
CREATE PROCEDURE IF NOT EXISTS `cyberpunk_increment_views`(IN post_id_param BIGINT)
BEGIN
    INSERT INTO `@prefixpostmeta` (post_id, meta_key, meta_value)
    VALUES (post_id_param, 'cyberpunk_views_count', 1)
    ON DUPLICATE KEY UPDATE
        meta_value = CAST(meta_value AS UNSIGNED) + 1;
END$$

-- 同步点赞数据到PostMeta (保持兼容性)
CREATE PROCEDURE IF NOT EXISTS `cyberpunk_sync_like_count`(IN post_id_param BIGINT)
BEGIN
    DECLARE like_count INT DEFAULT 0;

    -- 统计点赞数
    SELECT COUNT(*) INTO like_count
    FROM `@prefixcyberpunk_user_actions`
    WHERE post_id = post_id_param
    AND action_type = 'like';

    -- 更新PostMeta
    INSERT INTO `@prefixpostmeta` (post_id, meta_key, meta_value)
    VALUES (post_id_param, '_cyberpunk_like_count', like_count)
    ON DUPLICATE KEY UPDATE
        meta_value = like_count;
END$$

DELIMITER ;

-- ============================================
-- 7. 创建定时任务
-- ============================================

-- 启用事件调度器
SET GLOBAL event_scheduler = ON;

-- 每天凌晨3点清理90天前的访问日志
DROP EVENT IF EXISTS `cyberpunk_daily_cleanup`;
CREATE EVENT `cyberpunk_daily_cleanup`
ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 1 DAY + INTERVAL 3 HOUR)
DO
    CALL cyberpunk_clean_old_visits(90);

-- ============================================
-- 8. 初始化社交分享计数器
-- ============================================

-- 为所有已发布的文章创建分享计数器
INSERT IGNORE INTO `@prefixcyberpunk_shares` (`post_id`, `platform`, `share_count`)
SELECT DISTINCT `ID`, 'facebook', 0 FROM `@prefixposts`
WHERE `post_type` IN ('post', 'portfolio')
AND `post_status` = 'publish';

INSERT IGNORE INTO `@prefixcyberpunk_shares` (`post_id`, `platform`, `share_count`)
SELECT DISTINCT `ID`, 'twitter', 0 FROM `@prefixposts`
WHERE `post_type` IN ('post', 'portfolio')
AND `post_status` = 'publish';

INSERT IGNORE INTO `@prefixcyberpunk_shares` (`post_id`, `platform`, `share_count`)
SELECT DISTINCT `ID`, 'linkedin', 0 FROM `@prefixposts`
WHERE `post_type` IN ('post', 'portfolio')
AND `post_status` = 'publish';

-- ============================================
-- 9. 数据迁移: 从PostMeta迁移到自定义表
-- ============================================

-- 迁移点赞数据
INSERT IGNORE INTO `@prefixcyberpunk_user_actions` (`user_id`, `post_id`, `action_type`, `action_time`, `ip_address`)
SELECT
    CAST(um.user_id AS UNSIGNED),
    CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(um.meta_value, ',', n.n), ',', -1) AS UNSIGNED),
    'like',
    NOW(),
    '0.0.0.0'
FROM `@prefixusermeta` um
JOIN (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
    SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL
    SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) n
ON n.n <= LENGTH(um.meta_value) - LENGTH(REPLACE(um.meta_value, ',', '')) + 1
WHERE um.meta_key = '_cyberpunk_liked_posts'
AND um.meta_value != '';

-- 迁移书签数据
INSERT IGNORE INTO `@prefixcyberpunk_user_actions` (`user_id`, `post_id`, `action_type`, `action_time`, `ip_address`)
SELECT
    CAST(um.user_id AS UNSIGNED),
    CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(um.meta_value, ',', n.n), ',', -1) AS UNSIGNED),
    'bookmark',
    NOW(),
    '0.0.0.0'
FROM `@prefixusermeta` um
JOIN (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
    SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL
    SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) n
ON n.n <= LENGTH(um.meta_value) - LENGTH(REPLACE(um.meta_value, ',', '')) + 1
WHERE um.meta_key = '_cyberpunk_bookmarks'
AND um.meta_value != '';

-- ============================================
-- 10. 同步点赞计数到PostMeta
-- ============================================

-- 为所有文章更新点赞计数
INSERT INTO `@prefixpostmeta` (`post_id`, `meta_key`, `meta_value`)
SELECT
    p.ID,
    '_cyberpunk_like_count',
    COUNT(cua.action_id)
FROM `@prefixposts` p
LEFT JOIN `@prefixcyberpunk_user_actions` cua
    ON p.ID = cua.post_id
    AND cua.action_type = 'like'
WHERE p.post_status = 'publish'
GROUP BY p.ID
ON DUPLICATE KEY UPDATE
    meta_value = VALUES(meta_value);

-- ============================================
-- 完成
-- ============================================

SELECT '=====================================' as '';
SELECT 'Cyberpunk Theme Phase 2 Database' as '';
SELECT 'Optimization Complete!' as '';
SELECT '=====================================' as '';

-- 显示统计信息
SELECT
    'Tables Created' as Info,
    COUNT(*) as Count
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME LIKE '@prefixcyberpunk%';

SELECT
    'Total User Actions' as Info,
    COUNT(*) as Count
FROM `@prefixcyberpunk_user_actions`;

SELECT
    'Total Visit Logs' as Info,
    COUNT(*) as Count
FROM `@prefixcyberpunk_visits`;

SELECT
    'Total Share Records' as Info,
    COUNT(*) as Count
FROM `@prefixcyberpunk_shares`;
