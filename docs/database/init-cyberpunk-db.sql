-- ============================================
-- WordPress Cyberpunk Theme - 数据库初始化脚本
-- ============================================
-- 版本: 1.0.0
-- 日期: 2026-02-28
-- 作者: Database Architect
--
-- 使用说明:
-- 1. 将 @prefix 替换为实际的 WordPress 表前缀 (默认为 wp_)
-- 2. 在 phpMyAdmin 或 MySQL 命令行中执行
-- 3. 或使用以下命令替换前缀:
--    sed 's/@prefix/wp_/g' init-cyberpunk-db.sql | mysql -u username -p database_name
-- ============================================

-- 设置字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================
-- 表 1: 访问日志表
-- ============================================
-- 用途: 记录文章访问历史、用户行为追踪
-- 清理策略: 保留最近 90 天数据
-- ============================================

DROP TABLE IF EXISTS `@prefixcyberpunk_visits`;

CREATE TABLE `@prefixcyberpunk_visits` (
    `visit_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '访问ID (主键)',
    `post_id` bigint(20) UNSIGNED NOT NULL COMMENT '文章ID',
    `user_id` bigint(20) UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID (0表示游客)',
    `ip_address` varchar(45) NOT NULL COMMENT 'IP地址 (支持IPv6)',
    `user_agent` varchar(255) NOT NULL COMMENT '浏览器User Agent',
    `visit_url` varchar(500) NOT NULL COMMENT '访问的URL',
    `referer` varchar(500) NOT NULL DEFAULT '' COMMENT '来源页面',
    `visit_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '访问时间',
    `session_id` varchar(100) NOT NULL COMMENT '会话ID',
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
-- 表 2: 用户动作表 (点赞/收藏)
-- ============================================
-- 用途: 记录用户点赞、收藏、分享等互动行为
-- 特性: 防重复约束 (用户+文章+动作类型)
-- ============================================

DROP TABLE IF EXISTS `@prefixcyberpunk_user_actions`;

CREATE TABLE `@prefixcyberpunk_user_actions` (
    `action_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '动作ID (主键)',
    `user_id` bigint(20) UNSIGNED NOT NULL COMMENT '用户ID',
    `post_id` bigint(20) UNSIGNED NOT NULL COMMENT '文章ID',
    `action_type` enum('like', 'bookmark', 'share') NOT NULL COMMENT '动作类型',
    `action_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '动作时间',
    `ip_address` varchar(45) NOT NULL COMMENT 'IP地址',
    PRIMARY KEY (`action_id`),
    UNIQUE KEY `idx_unique_user_post` (`user_id`, `post_id`, `action_type`) COMMENT '防止重复操作',
    KEY `idx_user_id` (`user_id`),
    KEY `idx_post_id` (`post_id`),
    KEY `idx_action_type` (`action_type`),
    KEY `idx_action_time` (`action_time`),
    KEY `idx_user_action` (`user_id`, `action_type`),
    KEY `idx_post_action` (`post_id`, `action_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme - 用户互动记录 (点赞/收藏/分享)';

-- ============================================
-- 表 3: 社交分享统计表
-- ============================================
-- 用途: 记录各社交平台的分享次数
-- 平台: facebook, twitter, linkedin, pinterest, etc.
-- ============================================

DROP TABLE IF EXISTS `@prefixcyberpunk_shares`;

CREATE TABLE `@prefixcyberpunk_shares` (
    `share_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分享ID (主键)',
    `post_id` bigint(20) UNSIGNED NOT NULL COMMENT '文章ID',
    `platform` varchar(50) NOT NULL COMMENT '平台名称 (facebook, twitter, etc.)',
    `share_count` int(11) UNSIGNED NOT NULL DEFAULT 0 COMMENT '分享次数',
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
-- 数据插入: 初始化分享计数器
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
-- 视图 1: 文章统计汇总
-- ============================================
-- 用途: 提供文章的综合统计数据
-- 包含: 浏览数、点赞数、收藏数、评论数
-- ============================================

DROP VIEW IF EXISTS `@prefixcyberpunk_post_stats`;

CREATE VIEW `@prefixcyberpunk_post_stats` AS
SELECT
    p.ID as post_id,
    p.post_title,
    p.post_type,
    p.post_status,
    p.post_date,
    CAST(COALESCE(
        (SELECT meta_value
         FROM `@prefixpostmeta` pm
         WHERE pm.post_id = p.ID
         AND pm.meta_key = 'cyberpunk_views_count'
         LIMIT 1),
        0
    ) AS UNSIGNED) as views_count,
    CAST(COALESCE(
        (SELECT meta_value
         FROM `@prefixpostmeta` pm
         WHERE pm.post_id = p.ID
         AND pm.meta_key = 'cyberpunk_likes_count'
         LIMIT 1),
        0
    ) AS UNSIGNED) as likes_meta_count,
    (SELECT COUNT(*)
     FROM `@prefixcyberpunk_user_actions` cua
     WHERE cua.post_id = p.ID
     AND cua.action_type = 'like') as likes_real_count,
    (SELECT COUNT(*)
     FROM `@prefixcyberpunk_user_actions` cua
     WHERE cua.post_id = p.ID
     AND cua.action_type = 'bookmark') as bookmarks_count,
    (SELECT SUM(share_count)
     FROM `@prefixcyberpunk_shares` cs
     WHERE cs.post_id = p.ID) as total_shares,
    p.comment_count as comments_count
FROM `@prefixposts` p
WHERE p.post_type IN ('post', 'portfolio')
AND p.post_status = 'publish';

-- ============================================
-- 视图 2: 用户活跃度统计
-- ============================================
-- 用途: 分析用户活跃度、互动行为
-- ============================================

DROP VIEW IF EXISTS `@prefixcyberpunk_user_activity`;

CREATE VIEW `@prefixcyberpunk_user_activity` AS
SELECT
    u.ID as user_id,
    u.user_login,
    u.user_email,
    u.display_name,
    (SELECT COUNT(*)
     FROM `@prefixcyberpunk_user_actions` cua
     WHERE cua.user_id = u.ID
     AND cua.action_type = 'like') as total_likes,
    (SELECT COUNT(*)
     FROM `@prefixcyberpunk_user_actions` cua
     WHERE cua.user_id = u.ID
     AND cua.action_type = 'bookmark') as total_bookmarks,
    (SELECT COUNT(*)
     FROM `@prefixcyberpunk_visits` cv
     WHERE cv.user_id = u.ID) as total_visits,
    (SELECT MAX(visit_time)
     FROM `@prefixcyberpunk_visits` cv
     WHERE cv.user_id = u.ID) as last_visit
FROM `@prefixusers` u
WHERE u.user_status = 0;

-- ============================================
-- 存储过程 1: 清理旧访问日志
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

    -- 输出结果
    SELECT deleted_count as deleted_rows,
           days_to_keep as days_kept,
           CONCAT('Successfully deleted ', deleted_count, ' old visit records') as message;
END$$

DELIMITER ;

-- ============================================
-- 存储过程 2: 更新文章浏览数
-- ============================================
-- 用途: 原子性增加文章浏览计数
-- 参数: post_id_param - 文章ID
-- ============================================

DROP PROCEDURE IF EXISTS `cyberpunk_increment_views`;

DELIMITER $$

CREATE PROCEDURE `cyberpunk_increment_views`(IN post_id_param BIGINT)
BEGIN
    DECLARE current_views INT DEFAULT 0;

    -- 获取当前浏览数
    SELECT CAST(meta_value AS UNSIGNED) INTO current_views
    FROM `@prefixpostmeta`
    WHERE post_id = post_id_param
    AND meta_key = 'cyberpunk_views_count'
    LIMIT 1;

    -- 如果不存在则插入，否则更新
    IF current_views IS NULL THEN
        INSERT INTO `@prefixpostmeta` (post_id, meta_key, meta_value)
        VALUES (post_id_param, 'cyberpunk_views_count', 1);
    ELSE
        UPDATE `@prefixpostmeta`
        SET meta_value = current_views + 1
        WHERE post_id = post_id_param
        AND meta_key = 'cyberpunk_views_count';
    END IF;

    -- 返回新的浏览数
    SELECT CAST(meta_value AS UNSIGNED) as new_views_count
    FROM `@prefixpostmeta`
    WHERE post_id = post_id_param
    AND meta_key = 'cyberpunk_views_count'
    LIMIT 1;
END$$

DELIMITER ;

-- ============================================
-- 存储过程 3: 批量更新文章浏览数
-- ============================================
-- 用途: 批量增加多篇文章的浏览计数
-- 参数: post_ids_csv - 逗号分隔的文章ID列表
-- ============================================

DROP PROCEDURE IF EXISTS `cyberpunk_batch_increment_views`;

DELIMITER $$

CREATE PROCEDURE `cyberpunk_batch_increment_views`(IN post_ids_csv TEXT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE post_id_val BIGINT;
    DECLARE cur CURSOR FOR
        SELECT CAST(TRIM(value) AS UNSIGNED)
        FROM (
            SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(post_ids_csv, ',', numbers.n), ',', -1) value
            FROM (
                SELECT 1 n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8
                UNION ALL SELECT 9 UNION ALL SELECT 10
            ) numbers
            WHERE numbers.n <= 1 + (LENGTH(post_ids_csv) - LENGTH(REPLACE(post_ids_csv, ',', '')))
        ) split_values
        WHERE TRIM(value) REGEXP '^[0-9]+$';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO post_id_val;
        IF done THEN
            LEAVE read_loop;
        END IF;

        CALL cyberpunk_increment_views(post_id_val);
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

-- ============================================
-- 存储过程 4: 获取热门文章
-- ============================================
-- 用途: 获取浏览数最高的文章列表
-- 参数: limit_count - 返回的记录数
--       post_type_val - 文章类型 (post, portfolio)
-- ============================================

DROP PROCEDURE IF EXISTS `cyberpunk_get_popular_posts`;

DELIMITER $$

CREATE PROCEDURE `cyberpunk_get_popular_posts`(
    IN limit_count INT,
    IN post_type_val VARCHAR(20)
)
BEGIN
    SELECT
        p.ID,
        p.post_title,
        p.post_type,
        p.post_date,
        p.guid,
        CAST(COALESCE(pm.meta_value, 0) AS UNSIGNED) as views_count,
        (SELECT COUNT(*)
         FROM `@prefixcyberpunk_user_actions` cua
         WHERE cua.post_id = p.ID
         AND cua.action_type = 'like') as likes_count,
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
-- 定时事件: 每日清理任务
-- ============================================
-- 用途: 每天凌晨 3 点自动清理 90 天前的访问日志
-- 注意: 需要确保 event_scheduler 已开启
--       SET GLOBAL event_scheduler = ON;
-- ============================================

-- 确保事件调度器已开启
SET GLOBAL event_scheduler = ON;

DROP EVENT IF EXISTS `cyberpunk_daily_cleanup`;

CREATE EVENT IF NOT EXISTS `cyberpunk_daily_cleanup`
ON SCHEDULE EVERY 1 DAY
STARTS (TIMESTAMP(CURRENT_DATE) + INTERVAL 1 DAY + INTERVAL 3 HOUR)
DO
    CALL cyberpunk_clean_old_visits(90);

-- ============================================
-- 主题选项初始化
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
('cyberpunk_db_version', '1.0.0', 'no'),
('cyberpunk_last_cleanup', NOW(), 'no');

-- ============================================
-- 索引优化: wp_postmeta
-- ============================================
-- 添加常用 meta_key 的索引以提升查询性能
-- ============================================

-- 为 cyberpunk_ 开头的 meta_key 添加索引
-- 注意: MySQL 5.6 不支持部分索引，MySQL 5.7+ 支持

ALTER TABLE `@prefixpostmeta`
ADD INDEX IF NOT EXISTS `idx_cyberpunk_views` (`meta_key`(191), `meta_value`(20)),
ADD INDEX IF NOT EXISTS `idx_cyberpunk_likes` (`meta_key`(191));

-- ============================================
-- 完成提示
-- ============================================

SELECT
    '============================================' as '',
    'Cyberpunk Theme Database Initialization' as title,
    '============================================' as '',
    '' as '',
    '✅ 所有表已创建' as status_1,
    '✅ 索引已优化' as status_2,
    '✅ 存储过程已创建' as status_3,
    '✅ 视图已创建' as status_4,
    '✅ 定时任务已设置' as status_5,
    '✅ 主题选项已初始化' as status_6,
    '' as '',
    'Created Tables:' as section_1,
    CONCAT('  - ', '@prefix', 'cyberpunk_visits') as table_1,
    CONCAT('  - ', '@prefix', 'cyberpunk_user_actions') as table_2,
    CONCAT('  - ', '@prefix', 'cyberpunk_shares') as table_3,
    '' as '',
    'Created Views:' as section_2,
    CONCAT('  - ', '@prefix', 'cyberpunk_post_stats') as view_1,
    CONCAT('  - ', '@prefix', 'cyberpunk_user_activity') as view_2,
    '' as '',
    'Created Procedures:' as section_3,
    '  - cyberpunk_clean_old_visits' as proc_1,
    '  - cyberpunk_increment_views' as proc_2,
    '  - cyberpunk_batch_increment_views' as proc_3,
    '  - cyberpunk_get_popular_posts' as proc_4,
    '' as '',
    'Scheduled Event:' as section_4,
    '  - cyberpunk_daily_cleanup (Daily at 3 AM)' as event_1,
    '' as '',
    'Next Steps:' as section_5,
    '1. 测试存储过程:' as step_1,
    '   CALL cyberpunk_increment_views(1);' as step_1_example,
    '2. 查看热门文章:' as step_2,
    '   CALL cyberpunk_get_popular_posts(10, ''post'');' as step_2_example,
    '3. 查看统计数据:' as step_3,
    '   SELECT * FROM wp_cyberpunk_post_stats;' as step_3_example,
    '' as '',
    '============================================' as '',
    'Database initialized successfully!' as message,
    '============================================' as '';

-- ============================================
-- 验证脚本
-- ============================================
-- 检查所有创建的对象
-- ============================================

-- 检查表
SELECT
    'Tables Created:' as info,
    TABLE_NAME as table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as size_mb,
    TABLE_ROWS as rows,
    TABLE_COMMENT as description
FROM information_schema.TABLES
WHERE table_schema = DATABASE()
AND TABLE_NAME LIKE '@prefixcyberpunk%'
ORDER BY TABLE_NAME;

-- 检查视图
SELECT
    'Views Created:' as info,
    TABLE_NAME as view_name
FROM information_schema.VIEWS
WHERE table_schema = DATABASE()
AND TABLE_NAME LIKE '@prefixcyberpunk%'
ORDER BY TABLE_NAME;

-- 检查存储过程
SELECT
    'Procedures Created:' as info,
    ROUTINE_NAME as procedure_name,
    ROUTINE_TYPE as type
FROM information_schema.ROUTINES
WHERE routine_schema = DATABASE()
AND ROUTINE_NAME LIKE 'cyberpunk%'
ORDER BY ROUTINE_NAME;

-- 检查事件
SELECT
    'Events Created:' as info,
    EVENT_NAME as event_name,
    EXECUTE_AT as execute_at,
    INTERVAL_VALUE as interval_value,
    INTERVAL_FIELD as interval_field
FROM information_schema.EVENTS
WHERE event_schema = DATABASE()
AND EVENT_NAME LIKE 'cyberpunk%';

-- ============================================
-- 脚本结束
-- ============================================
