-- ============================================
-- Cyberpunk Theme Phase 2.2 Database Init
-- ============================================
-- 作者: 首席数据库架构师
-- 日期: 2026-03-01
-- 版本: 2.2.0 → 2.5.0
-- ============================================
-- 使用说明:
-- 1. 将 wp_ 替换为实际的表前缀
-- 2. 在 phpMyAdmin 或命令行中执行
-- 3. 或使用 WordPress 插件 "SQL Executioner" 执行
-- ============================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- Table 1: Audit Logs (安全审计日志)
-- ============================================
DROP TABLE IF EXISTS `wp_cyberpunk_audit_logs`;
CREATE TABLE `wp_cyberpunk_audit_logs` (
    `log_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0,
    `event_type` VARCHAR(50) NOT NULL,
    `event_action` VARCHAR(100) NOT NULL,
    `event_description` TEXT,
    `ip_address` VARCHAR(45) NOT NULL,
    `user_agent` VARCHAR(500),
    `request_method` VARCHAR(10),
    `request_uri` VARCHAR(500),
    `post_id` BIGINT UNSIGNED DEFAULT NULL,
    `old_values` JSON,
    `new_values` JSON,
    `severity` ENUM('info', 'warning', 'critical', 'emergency') DEFAULT 'info',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`log_id`),
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_event_type` (`event_type`),
    INDEX `idx_severity` (`severity`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_user_time` (`user_id`, `created_at` DESC),
    INDEX `idx_event_time` (`event_type`, `created_at` DESC),
    INDEX `idx_audit_covering` (`user_id`, `event_type`, `created_at`, `log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme Security Audit Logs';

-- ============================================
-- Table 2: Security Events (安全事件)
-- ============================================
DROP TABLE IF EXISTS `wp_cyberpunk_security_events`;
CREATE TABLE `wp_cyberpunk_security_events` (
    `event_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `event_type` VARCHAR(50) NOT NULL,
    `threat_level` ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    `source_ip` VARCHAR(45) NOT NULL,
    `user_id` BIGINT UNSIGNED DEFAULT NULL,
    `attack_vector` VARCHAR(100),
    `payload` TEXT,
    `request_method` VARCHAR(10),
    `request_uri` VARCHAR(500),
    `headers` JSON,
    `is_blocked` BOOLEAN DEFAULT FALSE,
    `block_reason` VARCHAR(255),
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `resolved_at` DATETIME DEFAULT NULL,
    `resolved_by` BIGINT UNSIGNED DEFAULT NULL,
    `resolution_notes` TEXT,
    `status` ENUM('open', 'investigating', 'resolved', 'false_positive') DEFAULT 'open',
    PRIMARY KEY (`event_id`),
    INDEX `idx_event_type` (`event_type`),
    INDEX `idx_threat_level` (`threat_level`),
    INDEX `idx_source_ip` (`source_ip`),
    INDEX `idx_status` (`status`),
    INDEX `idx_created_at` (`created_at`),
    INDEX `idx_threat_time` (`threat_level`, `created_at` DESC),
    INDEX `idx_status_time` (`status`, `created_at` DESC),
    INDEX `idx_security_threat_status` (`threat_level`, `status`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme Security Events';

-- ============================================
-- Table 3: Performance Cache (性能缓存)
-- ============================================
DROP TABLE IF EXISTS `wp_cyberpunk_performance_cache`;
CREATE TABLE `wp_cyberpunk_performance_cache` (
    `cache_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `cache_key` VARCHAR(255) NOT NULL,
    `cache_group` VARCHAR(100) DEFAULT 'default',
    `cache_value` LONGTEXT NOT NULL,
    `cache_type` ENUM('json', 'serialized', 'html', 'text', 'binary') DEFAULT 'json',
    `expiration` DATETIME NOT NULL,
    `hits` INT UNSIGNED DEFAULT 0,
    `last_accessed` DATETIME DEFAULT NULL,
    `size_bytes` INT UNSIGNED DEFAULT 0,
    `tags` JSON,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`cache_id`),
    UNIQUE KEY `unique_key_group` (`cache_key`, `cache_group`),
    INDEX `idx_cache_group` (`cache_group`),
    INDEX `idx_expiration` (`expiration`),
    INDEX `idx_cache_group_expire` (`cache_group`, `expiration`),
    INDEX `idx_cache_expire_group` (`expiration`, `cache_group`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Cyberpunk Theme Performance Cache';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入默认缓存条目
INSERT INTO `wp_cyberpunk_performance_cache`
(`cache_key`, `cache_group`, `cache_value`, `cache_type`, `expiration`, `size_bytes`, `tags`)
VALUES
('cyberpunk_theme_version', 'theme', '"2.5.0"', 'json', DATE_ADD(NOW(), INTERVAL 1 YEAR), 8, '["version", "theme"]'),
('cyberpunk_stats_initialized', 'system', 'true', 'json', DATE_ADD(NOW(), INTERVAL 1 DAY), 4, '["stats", "init"]');

-- ============================================
-- 创建视图
-- ============================================

-- 视图 1: 安全事件汇总
CREATE OR REPLACE VIEW `wp_cyberpunk_security_summary` AS
SELECT
    DATE(created_at) as event_date,
    event_type,
    threat_level,
    status,
    COUNT(*) as event_count,
    COUNT(DISTINCT source_ip) as unique_ips,
    COUNT(DISTINCT user_id) as affected_users
FROM `wp_cyberpunk_security_events`
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(created_at), event_type, threat_level, status;

-- 视图 2: 用户活动汇总
CREATE OR REPLACE VIEW `wp_cyberpunk_user_activity` AS
SELECT
    user_id,
    COUNT(*) as total_actions,
    COUNT(CASE WHEN event_type = 'auth' THEN 1 END) as auth_events,
    COUNT(CASE WHEN event_type = 'content' THEN 1 END) as content_events,
    COUNT(CASE WHEN event_type = 'security' THEN 1 END) as security_events,
    MAX(created_at) as last_activity,
    COUNT(CASE WHEN severity IN ('critical', 'emergency') THEN 1 END) as critical_events
FROM `wp_cyberpunk_audit_logs`
WHERE user_id > 0
GROUP BY user_id;

-- ============================================
-- 创建存储过程
-- ============================================

DELIMITER $$

-- 存储过程 1: 记录审计日志
CREATE PROCEDURE `sp_cyberpunk_log_audit`(
    IN p_user_id BIGINT,
    IN p_event_type VARCHAR(50),
    IN p_event_action VARCHAR(100),
    IN p_event_description TEXT,
    IN p_ip_address VARCHAR(45),
    IN p_user_agent VARCHAR(500),
    IN p_severity VARCHAR(20)
)
BEGIN
    INSERT INTO `wp_cyberpunk_audit_logs` (
        user_id, event_type, event_action, event_description,
        ip_address, user_agent, severity
    ) VALUES (
        p_user_id, p_event_type, p_event_action, p_event_description,
        p_ip_address, p_user_agent, p_severity
    );
    SELECT LAST_INSERT_ID() as log_id;
END$$

-- 存储过程 2: 清理过期缓存
CREATE PROCEDURE `sp_cyberpunk_clean_cache`()
BEGIN
    DELETE FROM `wp_cyberpunk_performance_cache`
    WHERE expiration < NOW();
    SELECT ROW_COUNT() as deleted_count;
END$$

-- 存储过程 3: 清理旧审计日志 (保留90天)
CREATE PROCEDURE `sp_cyberpunk_clean_audit_logs`(
    IN p_days_to_keep INT
)
BEGIN
    DELETE FROM `wp_cyberpunk_audit_logs`
    WHERE created_at < DATE_SUB(NOW(), INTERVAL p_days_to_keep DAY)
    AND severity NOT IN ('critical', 'emergency');
    SELECT ROW_COUNT() as deleted_count;
END$$

DELIMITER ;

-- ============================================
-- 创建定时任务
-- ============================================

-- 启用事件调度器
SET GLOBAL event_scheduler = ON;

-- 每天凌晨 2 点清理过期缓存
DROP EVENT IF EXISTS `evt_cyberpunk_clean_cache`;
CREATE EVENT `evt_cyberpunk_clean_cache`
ON SCHEDULE EVERY 1 DAY
STARTS CONCAT(CURDATE() + INTERVAL 1 DAY, ' 02:00:00')
DO
    CALL sp_cyberpunk_clean_cache();

-- 每周日凌晨 3 点清理旧审计日志 (保留90天)
DROP EVENT IF EXISTS `evt_cyberpunk_clean_audit_logs`;
CREATE EVENT `evt_cyberpunk_clean_audit_logs`
ON SCHEDULE EVERY 1 WEEK
STARTS CONCAT(CURDATE() + INTERVAL 7 DAY, ' 03:00:00')
DO
    CALL sp_cyberpunk_clean_audit_logs(90);

-- ============================================
-- 添加主题选项
-- ============================================
INSERT IGNORE INTO `wp_options` (`option_name`, `option_value`, `autoload`)
VALUES
('cyberpunk_audit_log_enabled', '1', 'yes'),
('cyberpunk_audit_retention_days', '90', 'yes'),
('cyberpunk_security_log_enabled', '1', 'yes'),
('cyberpunk_cache_enabled', '1', 'yes'),
('cyberpunk_cache_default_ttl', '3600', 'yes');

-- ============================================
-- 完成
-- ============================================
SET FOREIGN_KEY_CHECKS = 1;

SELECT '✅ Cyberpunk Theme Phase 2.2 Database initialized successfully!' as message;
