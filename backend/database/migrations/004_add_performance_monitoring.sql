-- =====================================================
-- Migration: 004_add_performance_monitoring
-- =====================================================
-- Version: 1.0.0
-- Created: 2026-03-03
-- Description: 添加性能监控和慢查询分析
-- =====================================================

-- 记录迁移
INSERT INTO `migrations` (`migration`, `batch`)
VALUES ('004_add_performance_monitoring', 1);

-- =====================================================
-- 1. 创建性能监控表
-- =====================================================

-- 慢查询日志表
CREATE TABLE IF NOT EXISTS `slow_queries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `query_hash` VARCHAR(64) NOT NULL COMMENT '查询哈希值',
  `query_sql` LONGTEXT NOT NULL COMMENT 'SQL语句',
  `execution_time` DECIMAL(10,4) NOT NULL COMMENT '执行时间（秒）',
  `rows_examined` INT UNSIGNED DEFAULT NULL COMMENT '扫描行数',
  `rows_sent` INT UNSIGNED DEFAULT NULL COMMENT '返回行数',
  `database_name` VARCHAR(100) DEFAULT NULL COMMENT '数据库名',
  `user_host` VARCHAR(255) DEFAULT NULL COMMENT '用户主机',
  `request_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '请求时间',
  `query_type` VARCHAR(50) DEFAULT NULL COMMENT '查询类型（SELECT/INSERT/UPDATE/DELETE）',
  `table_name` VARCHAR(100) DEFAULT NULL COMMENT '涉及的表',
  `is_optimized` BOOLEAN NOT NULL DEFAULT false COMMENT '是否已优化',
  `notes` TEXT DEFAULT NULL COMMENT '优化备注',
  PRIMARY KEY (`id`),
  KEY `idx_query_hash` (`query_hash`),
  KEY `idx_execution_time` (`execution_time` DESC),
  KEY `idx_request_time` (`request_time` DESC),
  KEY `idx_query_type` (`query_type`),
  KEY `idx_is_optimized` (`is_optimized`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='慢查询日志表';

-- 表性能统计表
CREATE TABLE IF NOT EXISTS `table_performance` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '统计ID',
  `table_name` VARCHAR(100) NOT NULL COMMENT '表名',
  `table_rows` BIGINT UNSIGNED DEFAULT NULL COMMENT '表行数',
  `data_length` BIGINT UNSIGNED DEFAULT NULL COMMENT '数据大小（字节）',
  `index_length` BIGINT UNSIGNED DEFAULT NULL COMMENT '索引大小（字节）',
  `data_free` BIGINT UNSIGNED DEFAULT NULL COMMENT '碎片空间（字节）',
  `avg_row_length` BIGINT UNSIGNED DEFAULT NULL COMMENT '平均行长度',
  `auto_increment` BIGINT UNSIGNED DEFAULT NULL COMMENT '自增值',
  `create_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '统计时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_table_create_time` (`table_name`, `create_time`),
  KEY `idx_create_time` (`create_time` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='表性能统计表';

-- 索引使用统计表
CREATE TABLE IF NOT EXISTS `index_usage_stats` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '统计ID',
  `table_name` VARCHAR(100) NOT NULL COMMENT '表名',
  `index_name` VARCHAR(100) NOT NULL COMMENT '索引名',
  `columns_in_index` VARCHAR(500) DEFAULT NULL COMMENT '索引列',
  `index_type` VARCHAR(50) DEFAULT NULL COMMENT '索引类型',
  `cardinality` BIGINT UNSIGNED DEFAULT NULL COMMENT '基数',
  `nullable` VARCHAR(3) DEFAULT NULL COMMENT '是否可为空',
  `seq_in_index` INT DEFAULT NULL COMMENT '索引中的位置',
  `is_used` BOOLEAN NOT NULL DEFAULT true COMMENT '是否使用中',
  `last_checked` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '检查时间',
  PRIMARY KEY (`id`),
  KEY `idx_table_name` (`table_name`),
  KEY `idx_index_name` (`index_name`),
  KEY `idx_is_used` (`is_used`),
  KEY `idx_cardinality` (`cardinality`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='索引使用统计表';

-- =====================================================
-- 2. 创建性能监控视图
-- =====================================================

-- 慢查询汇总视图
CREATE OR REPLACE VIEW `v_slow_query_summary` AS
SELECT
  query_hash,
  query_sql,
  COUNT(*) as occurrence_count,
  AVG(execution_time) as avg_execution_time,
  MAX(execution_time) as max_execution_time,
  MIN(execution_time) as min_execution_time,
  AVG(rows_examined) as avg_rows_examined,
  MAX(request_time) as last_occurrence,
  MIN(request_time) as first_occurrence,
  is_optimized
FROM slow_queries
GROUP BY query_hash, query_sql, is_optimized
ORDER BY occurrence_count DESC, avg_execution_time DESC;

-- 表性能趋势视图
CREATE OR REPLACE VIEW `v_table_performance_trend` AS
SELECT
  table_name,
  AVG(table_rows) as avg_rows,
  MAX(table_rows) - MIN(table_rows) as row_growth,
  AVG(data_length + index_length) as avg_total_size,
  MAX(data_length + index_length) as max_total_size,
  MAX(create_time) as last_check
FROM table_performance
WHERE create_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY table_name
ORDER BY avg_total_size DESC;

-- 未使用的索引视图
CREATE OR REPLACE VIEW `v_unused_indexes` AS
SELECT
  table_name,
  index_name,
  columns_in_index,
  index_type,
  cardinality,
  seq_in_index
FROM index_usage_stats
WHERE is_used = false
ORDER BY table_name, index_name;

-- =====================================================
-- 3. 创建性能监控存储过程
-- =====================================================

DELIMITER //

-- 收集表性能统计
CREATE PROCEDURE `sp_collect_table_stats`()
BEGIN
  INSERT INTO table_performance (
    table_name,
    table_rows,
    data_length,
    index_length,
    data_free,
    avg_row_length,
    auto_increment
  )
  SELECT
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH,
    DATA_FREE,
    AVG_ROW_LENGTH,
    AUTO_INCREMENT
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_TYPE = 'BASE TABLE';
END //

-- 收集索引使用统计
CREATE PROCEDURE `sp_collect_index_stats`()
BEGIN
  TRUNCATE TABLE index_usage_stats;

  INSERT INTO index_usage_stats (
    table_name,
    index_name,
    columns_in_index,
    index_type,
    cardinality,
    nullable,
    seq_in_index
  )
  SELECT
    TABLE_NAME,
    INDEX_NAME,
    GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX SEPARATOR ', '),
    INDEX_TYPE,
    CARDINALITY,
    NULLABLE,
    SEQ_IN_INDEX
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
  GROUP BY TABLE_NAME, INDEX_NAME, INDEX_TYPE, CARDINALITY, NULLABLE, SEQ_IN_INDEX;
END //

-- 清理旧的慢查询日志
CREATE PROCEDURE `sp_cleanup_slow_queries`(IN days_to_keep INT)
BEGIN
  DELETE FROM slow_queries
  WHERE request_time < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);

  -- 清理旧的性能统计数据
  DELETE FROM table_performance
  WHERE create_time < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);
END //

-- 生成性能报告
CREATE PROCEDURE `sp_generate_performance_report`()
BEGIN
  -- 慢查询TOP 10
  SELECT '=== Slow Queries TOP 10 ===' as report_section;
  SELECT * FROM v_slow_query_summary LIMIT 10;

  -- 表大小TOP 10
  SELECT '=== Largest Tables TOP 10 ===' as report_section;
  SELECT
    table_name,
    ROUND((data_length + index_length) / 1024 / 1024, 2) as size_mb,
    table_rows
  FROM table_performance
  WHERE create_time >= DATE_SUB(NOW(), INTERVAL 1 DAY)
  ORDER BY (data_length + index_length) DESC
  LIMIT 10;

  -- 未使用的索引
  SELECT '=== Unused Indexes ===' as report_section;
  SELECT * FROM v_unused_indexes;

  -- 索引基数低的索引
  SELECT '=== Low Cardinality Indexes ===' as report_section;
  SELECT
    table_name,
    index_name,
    cardinality
  FROM index_usage_stats
  WHERE cardinality < 100
    AND index_name != 'PRIMARY'
  ORDER BY cardinality ASC;
END //

DELIMITER ;

-- =====================================================
-- 4. 添加性能优化建议表
-- =====================================================

CREATE TABLE IF NOT EXISTS `optimization_suggestions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '建议ID',
  `suggestion_type` ENUM('index', 'query', 'schema', 'configuration') NOT NULL COMMENT '建议类型',
  `table_name` VARCHAR(100) DEFAULT NULL COMMENT '表名',
  `priority` ENUM('low', 'medium', 'high', 'critical') NOT NULL DEFAULT 'medium' COMMENT '优先级',
  `title` VARCHAR(500) NOT NULL COMMENT '建议标题',
  `description` TEXT DEFAULT NULL COMMENT '详细说明',
  `sql_statement` TEXT DEFAULT NULL COMMENT '建议的SQL语句',
  `estimated_impact` VARCHAR(200) DEFAULT NULL COMMENT '预估影响',
  `status` ENUM('pending', 'in_progress', 'completed', 'dismissed') NOT NULL DEFAULT 'pending' COMMENT '状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `completed_at` TIMESTAMP NULL DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`),
  KEY `idx_suggestion_type` (`suggestion_type`),
  KEY `idx_priority` (`priority`),
  KEY `idx_status` (`status`),
  KEY `idx_table_name` (`table_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='优化建议表';

-- =====================================================
-- 5. 插入初始优化建议
-- =====================================================

INSERT INTO `optimization_suggestions` (
  suggestion_type,
  table_name,
  priority,
  title,
  description,
  sql_statement,
  estimated_impact
) VALUES
(
  'index',
  'posts',
  'high',
  'Add composite index for author post listing',
  'Create a composite index on (author_id, status, published_at) to optimize author profile page queries',
  'CREATE INDEX idx_author_status_published ON posts(author_id, status, published_at DESC);',
  'Improves author page load time by 50-70%'
),
(
  'index',
  'comments',
  'medium',
  'Add composite index for comment threading',
  'Create a composite index on (post_id, status, parent_id, created_at) for efficient comment retrieval',
  'CREATE INDEX idx_post_status_parent_created ON comments(post_id, status, parent_id, created_at DESC);',
  'Reduces comment query time by 30-50%'
),
(
  'query',
  'posts',
  'low',
  'Optimize full-text search query',
  'Add status filter to full-text search to reduce result set',
  'SELECT * FROM posts WHERE MATCH(title, content, excerpt) AGAINST(? IN NATURAL LANGUAGE MODE) AND status = "publish" LIMIT 20;',
  'Improves search performance by 20-30%'
);

-- =====================================================
-- 6. 创建定时事件
-- =====================================================

DELIMITER //

-- 每日收集统计信息
CREATE EVENT IF NOT EXISTS `evt_daily_performance_stats`
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
  CALL sp_collect_table_stats();
  CALL sp_collect_index_stats();
END //

-- 每周清理旧日志
CREATE EVENT IF NOT EXISTS `evt_weekly_cleanup_performance_logs`
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
DO
BEGIN
  CALL sp_cleanup_slow_queries(90);  -- 保留90天
END //

DELIMITER ;

-- =====================================================
-- 验证脚本
-- =====================================================

-- 验证新表创建
SHOW TABLES LIKE 'slow_queries';
SHOW TABLES LIKE 'table_performance';
SHOW TABLES LIKE 'index_usage_stats';
SHOW TABLES LIKE 'optimization_suggestions';

-- 验证存储过程
SHOW PROCEDURE STATUS WHERE Db = DATABASE() AND Name LIKE 'sp_%';

-- 验证视图
SHOW FULL TABLES WHERE Table_Type = 'VIEW' AND Table_Name LIKE 'v_%';

-- 测试收集统计
CALL sp_collect_table_stats();
CALL sp_collect_index_stats();

-- 查看收集的数据
SELECT * FROM table_performance ORDER BY create_time DESC LIMIT 5;
SELECT * FROM index_usage_stats LIMIT 5;

-- =====================================================
-- 完成标记
-- =====================================================

SELECT 'Migration 004_add_performance_monitoring completed successfully!' AS message;

-- =====================================================
-- 使用说明
-- =====================================================
-- 1. 每日自动收集表和索引统计信息
-- 2. 使用 v_slow_query_summary 视图查看慢查询汇总
-- 3. 使用 v_table_performance_trend 视图查看表性能趋势
-- 4. 使用 v_unused_indexes 视图查找未使用的索引
-- 5. 定期执行 sp_generate_performance_report 生成性能报告
-- 6. 根据 optimization_suggestions 表中的建议进行优化
-- =====================================================
