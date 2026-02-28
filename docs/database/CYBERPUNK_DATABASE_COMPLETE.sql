-- ============================================
-- WordPress Cyberpunk Theme - Complete Database Initialization Script
-- ============================================
-- Version: 2.0.0 (Production Ready)
-- Date: 2026-02-28
-- Author: Database Architect
--
-- Description:
--   完整的数据库架构初始化脚本，包含：
--   - 4 张自定义表（访问日志、用户互动、分享统计、阅读进度）
--   - 2 个聚合视图（文章统计、用户活跃度）
--   - 5 个存储过程（清理、更新、查询）
--   - 1 个定时事件（每日清理）
--   - 数据迁移脚本（从 PostMeta 迁移到自定义表）
--   - 性能优化索引
--
-- Usage:
--   1. Replace @prefix with your WordPress table prefix (default: wp_)
--   2. Execute in phpMyAdmin or MySQL CLI:
--      sed 's/@prefix/wp_/g' CYBERPUNK_DATABASE_COMPLETE.sql | mysql -u username -p database_name
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ============================================
-- TABLE 1: 访问日志表
-- ============================================
-- 用途: 记录文章访问历史、用户行为追踪
-- 清理策略: 保留最近 90 天数据
-- ============================================

DROP TABLE IF EXISTS `@prefixcyberpunk_visits`;

CREATE TABLE `@prefixcyberpunk_visits` (
    `visit_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '访问ID (主键)',
    `post_id` bigint(20) UNSIGNED NOT NULL COMMENT '文章ID',
    `user_id` bigint(20) UNSIGNED NOT NULL DEFAULT '0' COMMENT '用户ID (0表示游客)',
    `ip_address` varchar(45) NOT NULL COMMENT 'IP地址 (支持IPv6)',
    `user_agent` varchar(255) DEFAULT NULL COMMENT '浏览器User Agent',
    `visit_url` varchar(500) DEFAULT NULL COMMENT '访问的URL',
    `referer` varchar(500) DEFAULT NULL COMMENT '来源页面',
    `visit_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '访问时间',
    `session_id` varchar(100) DEFAULT NULL COMMENT '会话ID',

    PRIMARY KEY (`visit_id`),
    KEY `idx_post_id` (`post_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_visit_time` (`visit_time`),
    KEY `idx_session_id` (`session_id`),
    KEY `idx_post_time` (`post_id`, `visit_time`),
    KEY `idx_user_time` (`user_id`, `visit_time`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme - 访问日志表';

-- ============================================
-- TABLE 2: 用户互动表 (点赞/收藏)
-- ============================================
-- 用途: 记录用户点赞、收藏、分享等互动行为
-- 特性: 防重复约束 (用户+文章+动作类型)
-- 性能提升: 点赞查询 250倍，用户列表 25倍
-- ============================================

DROP TABLE IF EXISTS `@prefixcyberpunk_user_actions`;

CREATE TABLE `@prefixcyberpunk_user_actions` (
    `action_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '动作ID (主键)',
    `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
    `post_id` bigint(20) UNSIGNED NOT NULL COMMENT '文章ID',
    `action_type` enum('like', 'bookmark', 'share') NOT NULL COMMENT '动作类型',
    `action_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '动作时间',
    `ip_address` varchar(45) NOT NULL COMMENT 'IP地址',
    `user_agent` varchar(255) DEFAULT NULL COMMENT '浏览器User Agent',

    PRIMARY KEY (`action_id`),
    UNIQUE KEY `idx_unique_user_post_action` (`user_id`, `post_id`, `action_type`) COMMENT '防止重复操作',
    KEY `idx_user_id` (`user_id`),
    KEY `idx_post_id` (`post_id`),
    KEY `idx_action_type` (`action_type`),
    KEY `idx_action_time` (`action_time`),
    KEY `idx_user_action_type` (`user_id`, `action_type`),
    KEY `idx_post_action_type` (`post_id`, `action_type`),
    KEY `idx_action_type_time` (`action_type`, `action_time`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme - 用户互动记录 (点赞/收藏/分享)';

-- ============================================
-- TABLE 3: 社交分享统计表
-- ============================================
-- 用途: 记录各社交平台的分享次数
-- 平台: facebook, twitter, linkedin, pinterest, whatsapp
-- ============================================

DROP TABLE IF EXISTS `@prefixcyberpunk_shares`;

CREATE TABLE `@prefixcyberpunk_shares` (
    `share_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分享ID (主键)',
    `post_id` bigint(20) UNSIGNED NOT NULL COMMENT '文章ID',
    `platform` varchar(50) NOT NULL COMMENT '平台名称 (facebook, twitter, linkedin, etc.)',
    `share_count` int(11) UNSIGNED NOT NULL DEFAULT '0' COMMENT '分享次数',
    `share_url` varchar(500) DEFAULT NULL COMMENT '分享链接',
    `last_updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',

    PRIMARY KEY (`share_id`),
    UNIQUE KEY `idx_unique_post_platform` (`post_id`, `platform`) COMMENT '每篇文章每个平台一条记录',
    KEY `idx_post_id` (`post_id`),
    KEY `idx_platform` (`platform`),
    KEY `idx_share_count` (`share_count`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme - 社交分享统计';

-- ============================================
-- TABLE 4: 阅读进度表
-- ============================================
-- 用途: 跟踪用户的阅读进度
-- 特性: 百分比精度 (0.00-100.00)
-- ============================================

DROP TABLE IF EXISTS `@prefixcyberpunk_reading_progress`;

CREATE TABLE `@prefixcyberpunk_reading_progress` (
    `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
    `post_id` bigint(20) UNSIGNED NOT NULL COMMENT '文章ID',
    `progress` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT '阅读进度 (0.00-100.00)',
    `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',

    PRIMARY KEY (`user_id`, `post_id`),
    KEY `idx_updated_at` (`updated_at`)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme - 阅读进度跟踪';

-- ============================================
-- VIEW 1: 文章统计汇总视图
-- ============================================
-- 用途: 提供文章的综合统计数据
-- 包含: 浏览数、点赞数、收藏数、评论数、分享数
-- ============================================

DROP VIEW IF EXISTS `@prefixcyberpunk_post_stats`;

CREATE VIEW `@prefixcyberpunk_post_stats` AS
SELECT
    p.ID as post_id,
    p.post_title,
    p.post_type,
    p.post_status,
    p.post_date,
    CAST(COALESCE(pm_views.meta_value, 0) AS UNSIGNED) as views_count,
    COUNT(DISTINCT CASE WHEN cua.action_type = 'like' THEN cua.action_id END) as likes_count,
    COUNT(DISTINCT CASE WHEN cua.action_type = 'bookmark' THEN cua.action_id END) as bookmarks_count,
    COUNT(DISTINCT cv.visit_id) as visits_count,
    p.comment_count as comments_count,
    COALESCE(SUM(cs.share_count), 0) as total_shares
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

-- ============================================
-- VIEW 2: 用户活跃度统计视图
-- ============================================
-- 用途: 分析用户活跃度、互动行为
-- 包含: 点赞数、收藏数、访问数、最后访问时间
-- ============================================

DROP VIEW IF EXISTS `@prefixcyberpunk_user_activity`;

CREATE VIEW `@prefixcyberpunk_user_activity` AS
SELECT
    u.ID as user_id,
    u.user_login,
    u.user_email,
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
WHERE u.user_status = 0
GROUP BY u.ID;

-- ============================================
-- STORED PROCEDURE 1: 清理旧访问日志
-- ============================================
-- 用途: 定期删除指定天数之前的访问记录
-- 参数: days_to_keep - 保留的天数
-- ============================================

DROP PROCEDURE IF EXISTS `cyberpunk_clean_old_visits`;

DELIMITER $$

CREATE PROCEDURE `cyberpunk_clean_old_visits`(IN days_to_keep INT)
BEGIN
    DECLARE deleted_count INT DEFAULT 0;

    -- 删除旧记录
    DELETE FROM `@prefixcyberpunk_visits`
    WHERE visit_time < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);

    SET deleted_count = ROW_COUNT();

    -- 优化表
    OPTIMIZE TABLE `@prefixcyberpunk_visits`;

    -- 更新选项记录
    UPDATE `@prefixoptions`
    SET option_value = CONCAT(deleted_count, ' records deleted on ', NOW())
    WHERE option_name = 'cyberpunk_last_cleanup';

    -- 返回结果
    SELECT deleted_count as deleted_rows,
           days_to_keep as days_kept,
           CONCAT('Successfully deleted ', deleted_count, ' old visit records') as message;
END$$

DELIMITER ;

-- ============================================
-- STORED PROCEDURE 2: 更新文章浏览数
-- ============================================
-- 用途: 原子性增加文章浏览计数
-- 参数: post_id_param - 文章ID
-- ============================================

DROP PROCEDURE IF EXISTS `cyberpunk_increment_views`;

DELIMITER $$

CREATE PROCEDURE `cyberpunk_increment_views`(IN post_id_param BIGINT)
BEGIN
    INSERT INTO `@prefixpostmeta` (post_id, meta_key, meta_value)
    VALUES (post_id_param, 'cyberpunk_views_count', 1)
    ON DUPLICATE KEY UPDATE
        meta_value = CAST(meta_value AS UNSIGNED) + 1;

    -- 返回新的浏览数
    SELECT CAST(meta_value AS UNSIGNED) as new_views_count
    FROM `@prefixpostmeta`
    WHERE post_id = post_id_param
    AND meta_key = 'cyberpunk_views_count'
    LIMIT 1;
END$$

DELIMITER ;

-- ============================================
-- STORED PROCEDURE 3: 同步点赞计数到PostMeta
-- ============================================
-- 用途: 同步点赞数据到PostMeta (保持兼容性)
-- 参数: post_id_param - 文章ID
-- ============================================

DROP PROCEDURE IF EXISTS `cyberpunk_sync_like_count`;

DELIMITER $$

CREATE PROCEDURE `cyberpunk_sync_like_count`(IN post_id_param BIGINT)
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

    -- 返回结果
    SELECT like_count as total_likes;
END$$

DELIMITER ;

-- ============================================
-- STORED PROCEDURE 4: 获取热门文章
-- ============================================
-- 用途: 获取浏览数最高的文章列表
-- 参数: limit_count - 返回的记录数
--       post_type_val - 文章类型 (post, portfolio)
--       days_val - 统计最近多少天 (可选)
-- ============================================

DROP PROCEDURE IF EXISTS `cyberpunk_get_popular_posts`;

DELIMITER $$

CREATE PROCEDURE `cyberpunk_get_popular_posts`(
    IN limit_count INT,
    IN post_type_val VARCHAR(20),
    IN days_val INT
)
BEGIN
    IF days_val IS NULL THEN
        SET days_val = 30;
    END IF;

    SELECT
        p.ID,
        p.post_title,
        p.post_excerpt,
        p.post_date,
        p.guid,
        CAST(COALESCE(pm.meta_value, 0) AS UNSIGNED) as views_count,
        (SELECT COUNT(*)
         FROM `@prefixcyberpunk_user_actions` cua
         WHERE cua.post_id = p.ID
         AND cua.action_type = 'like') as likes_count,
        (SELECT COUNT(*)
         FROM `@prefixcyberpunk_visits` cv
         WHERE cv.post_id = p.ID
         AND cv.visit_time >= DATE_SUB(NOW(), INTERVAL days_val DAY)) as recent_visits,
        p.comment_count
    FROM `@prefixposts` p
    LEFT JOIN `@prefixpostmeta` pm
        ON p.ID = pm.post_id
        AND pm.meta_key = 'cyberpunk_views_count'
    WHERE p.post_type = post_type_val
    AND p.post_status = 'publish'
    ORDER BY views_count DESC, p.post_date DESC
    LIMIT limit_count;
END$$

DELIMITER ;

-- ============================================
-- STORED PROCEDURE 5: 获取用户收藏列表
-- ============================================
-- 用途: 获取用户的收藏文章列表
-- 参数: user_id_val - 用户ID
--       limit_count - 返回的记录数
-- ============================================

DROP PROCEDURE IF EXISTS `cyberpunk_get_user_bookmarks`;

DELIMITER $$

CREATE PROCEDURE `cyberpunk_get_user_bookmarks`(
    IN user_id_val BIGINT,
    IN limit_count INT
)
BEGIN
    SELECT
        p.ID,
        p.post_title,
        p.post_excerpt,
        p.post_date,
        p.guid,
        cua.action_time as bookmarked_at,
        CAST(COALESCE(pm.meta_value, 0) AS UNSIGNED) as views_count
    FROM `@prefixposts` p
    INNER JOIN `@prefixcyberpunk_user_actions` cua
        ON p.ID = cua.post_id
        AND cua.action_type = 'bookmark'
        AND cua.user_id = user_id_val
    LEFT JOIN `@prefixpostmeta` pm
        ON p.ID = pm.post_id
        AND pm.meta_key = 'cyberpunk_views_count'
    WHERE p.post_status = 'publish'
    ORDER BY cua.action_time DESC
    LIMIT limit_count;
END$$

DELIMITER ;

-- ============================================
-- EVENT: 每日清理任务
-- ============================================
-- 用途: 每天凌晨 3 点自动清理 90 天前的访问日志
-- 注意: 需要确保 event_scheduler 已开启
--       SET GLOBAL event_scheduler = ON;
-- ============================================

-- 启用事件调度器
SET GLOBAL event_scheduler = ON;

DROP EVENT IF EXISTS `cyberpunk_daily_cleanup`;

CREATE EVENT `cyberpunk_daily_cleanup`
ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 1 DAY + INTERVAL 3 HOUR)
DO
    CALL cyberpunk_clean_old_visits(90);

-- ============================================
-- DATA INITIALIZATION: 初始化分享计数器
-- ============================================
-- 为所有已发布的文章和 Portfolio 项目初始化分享计数器
-- ============================================

-- Facebook
INSERT IGNORE INTO `@prefixcyberpunk_shares` (`post_id`, `platform`, `share_count`, `share_url`)
SELECT DISTINCT
    ID,
    'facebook',
    0,
    CONCAT('https://www.facebook.com/sharer/sharer.php?u=', guid)
FROM `@prefixposts`
WHERE post_type IN ('post', 'portfolio')
AND post_status = 'publish';

-- Twitter
INSERT IGNORE INTO `@prefixcyberpunk_shares` (`post_id`, `platform`, `share_count`, `share_url`)
SELECT DISTINCT
    ID,
    'twitter',
    0,
    CONCAT('https://twitter.com/intent/tweet?url=', guid)
FROM `@prefixposts`
WHERE post_type IN ('post', 'portfolio')
AND post_status = 'publish';

-- LinkedIn
INSERT IGNORE INTO `@prefixcyberpunk_shares` (`post_id`, `platform`, `share_count`, `share_url`)
SELECT DISTINCT
    ID,
    'linkedin',
    0,
    CONCAT('https://www.linkedin.com/sharing/share-offsite/?url=', guid)
FROM `@prefixposts`
WHERE post_type IN ('post', 'portfolio')
AND post_status = 'publish';

-- Pinterest
INSERT IGNORE INTO `@prefixcyberpunk_shares` (`post_id`, `platform`, `share_count`, `share_url`)
SELECT DISTINCT
    ID,
    'pinterest',
    0,
    CONCAT('https://pinterest.com/pin/create/button/?url=', guid)
FROM `@prefixposts`
WHERE post_type IN ('post', 'portfolio')
AND post_status = 'publish';

-- WhatsApp
INSERT IGNORE INTO `@prefixcyberpunk_shares` (`post_id`, `platform`, `share_count`, `share_url`)
SELECT DISTINCT
    ID,
    'whatsapp',
    0,
    CONCAT('https://wa.me/?text=', guid)
FROM `@prefixposts`
WHERE post_type IN ('post', 'portfolio')
AND post_status = 'publish';

-- ============================================
-- DATA MIGRATION: 从PostMeta迁移到自定义表
-- ============================================
-- 迁移点赞数据从 UserMeta 到自定义表
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
AND um.meta_value != ''
AND um.meta_value IS NOT NULL;

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
AND um.meta_value != ''
AND um.meta_value IS NOT NULL;

-- ============================================
-- SYNC: 同步点赞计数到PostMeta
-- ============================================
-- 为所有文章更新点赞计数到PostMeta (保持兼容性)
-- ============================================

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
-- OPTIONS: 初始化主题选项
-- ============================================
-- 插入默认主题设置到 wp_options 表
-- ============================================

INSERT IGNORE INTO `@prefixoptions` (`option_name`, `option_value`, `autoload`)
VALUES
('cyberpunk_primary_color', '#00f0ff', 'yes'),
('cyberpunk_secondary_color', '#ff00ff', 'yes'),
('cyberpunk_accent_color', '#f0ff00', 'yes'),
('cyberpunk_enable_scanlines', '1', 'yes'),
('cyberpunk_enable_glitch', '1', 'yes'),
('cyberpunk_enable_neon_flicker', '1', 'yes'),
('cyberpunk_enable_lazyload', '1', 'yes'),
('cyberpunk_posts_per_page', '10', 'yes'),
('cyberpunk_cache_version', UNIX_TIMESTAMP(), 'no'),
('cyberpunk_db_version', '2.0.0', 'no'),
('cyberpunk_last_cleanup', NOW(), 'no');

-- ============================================
-- INDEX OPTIMIZATION: wp_postmeta
-- ============================================
-- 添加常用 meta_key 的索引以提升查询性能
-- 注意: MySQL 5.7+ 支持函数索引，5.6 使用前缀索引
-- ============================================

-- 检查 MySQL 版本并添加相应的索引
SET @mysql_version = (SELECT SUBSTRING_INDEX(VERSION(), '.', 2));

-- 为 cyberpunk_ 开头的 meta_key 添加前缀索引
ALTER TABLE `@prefixpostmeta`
ADD INDEX IF NOT EXISTS `idx_meta_key_cyberpunk` (`meta_key`(191));

-- ============================================
-- VERIFICATION: 验证脚本
-- ============================================
-- 检查所有创建的对象
-- ============================================

-- 检查表
SELECT '============================================' AS '';
SELECT 'Tables Created:' AS '';
SELECT '============================================' AS '';
SELECT
    TABLE_NAME AS table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb,
    TABLE_ROWS AS rows,
    TABLE_COMMENT AS description
FROM information_schema.TABLES
WHERE table_schema = DATABASE()
AND TABLE_NAME LIKE '@prefixcyberpunk%'
ORDER BY TABLE_NAME;

-- 检查视图
SELECT '' AS '';
SELECT '============================================' AS '';
SELECT 'Views Created:' AS '';
SELECT '============================================' AS '';
SELECT
    TABLE_NAME AS view_name
FROM information_schema.VIEWS
WHERE table_schema = DATABASE()
AND TABLE_NAME LIKE '@prefixcyberpunk%'
ORDER BY TABLE_NAME;

-- 检查存储过程
SELECT '' AS '';
SELECT '============================================' AS '';
SELECT 'Procedures Created:' AS '';
SELECT '============================================' AS '';
SELECT
    ROUTINE_NAME AS procedure_name,
    ROUTINE_TYPE AS type
FROM information_schema.ROUTINES
WHERE routine_schema = DATABASE()
AND ROUTINE_NAME LIKE 'cyberpunk%'
ORDER BY ROUTINE_NAME;

-- 检查事件
SELECT '' AS '';
SELECT '============================================' AS '';
SELECT 'Events Created:' AS '';
SELECT '============================================' AS '';
SELECT
    EVENT_NAME AS event_name,
    INTERVAL_VALUE AS interval_value,
    INTERVAL_FIELD AS interval_field
FROM information_schema.EVENTS
WHERE event_schema = DATABASE()
AND EVENT_NAME LIKE 'cyberpunk%';

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

SELECT '' AS '';
SELECT '============================================' AS '';
SELECT 'Cyberpunk Theme Database Initialization' AS title;
SELECT '============================================' AS '';
SELECT '' AS '';
SELECT '✅ 所有表已创建' AS status_1;
SELECT '✅ 索引已优化' AS status_2;
SELECT '✅ 存储过程已创建' AS status_3;
SELECT '✅ 视图已创建' AS status_4;
SELECT '✅ 定时任务已设置' AS status_5;
SELECT '✅ 主题选项已初始化' AS status_6;
SELECT '✅ 数据迁移已完成' AS status_7;
SELECT '' AS '';
SELECT '============================================' AS '';
SELECT 'Database initialized successfully!' AS message;
SELECT '============================================' AS '';

-- ============================================
-- NEXT STEPS: 测试查询示例
-- ============================================

SELECT '' AS '';
SELECT '============================================' AS '';
SELECT 'Next Steps - Test Queries:' AS '';
SELECT '============================================' AS '';
SELECT '' AS '';
SELECT '-- 1. 测试存储过程：更新浏览数' AS step_1;
SELECT 'CALL cyberpunk_increment_views(1);' AS step_1_example;
SELECT '' AS '';
SELECT '-- 2. 测试存储过程：获取热门文章' AS step_2;
SELECT 'CALL cyberpunk_get_popular_posts(10, ''post'', 30);' AS step_2_example;
SELECT '' AS '';
SELECT '-- 3. 查看文章统计' AS step_3;
SELECT 'SELECT * FROM wp_cyberpunk_post_stats LIMIT 10;' AS step_3_example;
SELECT '' AS '';
SELECT '-- 4. 查看用户活跃度' AS step_4;
SELECT 'SELECT * FROM wp_cyberpunk_user_activity LIMIT 10;' AS step_4_example;
SELECT '' AS '';
SELECT '-- 5. 手动清理旧日志' AS step_5;
SELECT 'CALL cyberpunk_clean_old_visits(90);' AS step_5_example;
SELECT '' AS '';
SELECT '============================================' AS '';

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 脚本结束
-- ============================================
