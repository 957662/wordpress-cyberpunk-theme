-- =====================================================
-- Migration: 003_add_search_optimization
-- =====================================================
-- Version: 1.0.0
-- Created: 2026-03-03
-- Description: 添加搜索优化索引和全文搜索配置
-- =====================================================

-- 记录迁移
INSERT INTO `migrations` (`migration`, `batch`)
VALUES ('003_add_search_optimization', 1);

-- =====================================================
-- 1. 添加全文搜索最小词长配置
-- =====================================================

-- 设置全文搜索最小词长为2（支持中文搜索）
SET GLOBAL ft_min_word_len = 2;
SET GLOBAL ft_boolean_syntax = ' ->,()<~+*:""&|';

-- 重建全文索引以应用新配置
ALTER TABLE posts DROP INDEX ft_search;
ALTER TABLE posts ADD FULLTEXT INDEX ft_search (title, content, excerpt) WITH PARSER ngram;

ALTER TABLE portfolio_items DROP INDEX ft_search;
ALTER TABLE portfolio_items ADD FULLTEXT INDEX ft_search (title, description) WITH PARSER ngram;

-- =====================================================
-- 2. 添加搜索优化索引
-- =====================================================

-- 文章搜索优化索引（状态+发布时间）
CREATE INDEX idx_search_post ON posts(status, post_type, published_at DESC);

-- 用户搜索索引（用户名前缀）
CREATE INDEX idx_username_prefix ON users(username(20));

-- 分类搜索索引（名称前缀）
CREATE INDEX idx_category_name_prefix ON categories(name(30));

-- =====================================================
-- 3. 添加搜索历史表
-- =====================================================

CREATE TABLE IF NOT EXISTS `search_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '搜索ID',
  `keyword` VARCHAR(500) NOT NULL COMMENT '搜索关键词',
  `results_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '结果数量',
  `search_type` ENUM('posts', 'portfolio', 'all') NOT NULL DEFAULT 'all' COMMENT '搜索类型',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID',
  `ip_address` VARCHAR(100) DEFAULT NULL COMMENT 'IP地址',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '搜索时间',
  PRIMARY KEY (`id`),
  KEY `idx_keyword` (`keyword`(100)),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_user` (`user_id`),
  KEY `idx_search_type` (`search_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='搜索历史表';

-- =====================================================
-- 4. 添加热门关键词表
-- =====================================================

CREATE TABLE IF NOT EXISTS `popular_keywords` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `keyword` VARCHAR(200) NOT NULL COMMENT '关键词',
  `search_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '搜索次数',
  `trend_score` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '趋势分数',
  `last_searched_at` TIMESTAMP NULL DEFAULT NULL COMMENT '最后搜索时间',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_keyword` (`keyword`),
  KEY `idx_search_count` (`search_count` DESC),
  KEY `idx_trend_score` (`trend_score` DESC),
  KEY `idx_last_searched` (`last_searched_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='热门关键词表';

-- =====================================================
-- 5. 创建搜索统计视图
-- =====================================================

CREATE OR REPLACE VIEW `v_search_stats` AS
SELECT
  DATE(sh.created_at) as search_date,
  sh.search_type,
  COUNT(*) as total_searches,
  AVG(sh.results_count) as avg_results,
  COUNT(DISTINCT sh.user_id) as unique_users,
  COUNT(DISTINCT sh.ip_address) as unique_ips
FROM search_history sh
WHERE sh.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY DATE(sh.created_at), sh.search_type
ORDER BY search_date DESC, sh.search_type;

-- =====================================================
-- 6. 添加搜索优化存储过程
-- =====================================================

DELIMITER //

-- 记录搜索并更新热门关键词
CREATE PROCEDURE `sp_record_search`(
  IN p_keyword VARCHAR(500),
  IN p_results_count INT,
  IN p_search_type VARCHAR(20),
  IN p_user_id BIGINT,
  IN p_ip_address VARCHAR(100)
)
BEGIN
  DECLARE keyword_id BIGINT;

  -- 插入搜索历史
  INSERT INTO search_history (keyword, results_count, search_type, user_id, ip_address)
  VALUES (p_keyword, p_results_count, p_search_type, p_user_id, p_ip_address);

  -- 更新或插入热门关键词
  SELECT id INTO keyword_id FROM popular_keywords WHERE keyword = p_keyword LIMIT 1;

  IF keyword_id IS NOT NULL THEN
    UPDATE popular_keywords
    SET search_count = search_count + 1,
        trend_score = trend_score + 1.0,
        last_searched_at = NOW()
    WHERE id = keyword_id;
  ELSE
    INSERT INTO popular_keywords (keyword, search_count, trend_score, last_searched_at)
    VALUES (p_keyword, 1, 1.0, NOW());
  END IF;
END //

-- 更新关键词趋势分数（每日执行）
CREATE PROCEDURE `sp_update_keyword_trends`()
BEGIN
  -- 衰减旧分数
  UPDATE popular_keywords
  SET trend_score = trend_score * 0.9
  WHERE last_searched_at < DATE_SUB(NOW(), INTERVAL 7 DAY);

  -- 删除长期未搜索的关键词
  DELETE FROM popular_keywords
  WHERE last_searched_at < DATE_SUB(NOW(), INTERVAL 30 DAY)
    AND search_count < 5;
END //

DELIMITER ;

-- =====================================================
-- 7. 添加触发器
-- =====================================================

DELIMITER //

-- 搜索后自动记录
CREATE TRIGGER `tr_search_record`
AFTER INSERT ON search_history
FOR EACH ROW
BEGIN
  -- 更新关键词表（如果存储过程未调用）
  INSERT INTO popular_keywords (keyword, search_count, trend_score, last_searched_at)
  VALUES (NEW.keyword, 1, 1.0, NOW())
  ON DUPLICATE KEY UPDATE
    search_count = search_count + 1,
    trend_score = trend_score + 1.0,
    last_searched_at = NOW();
END //

DELIMITER ;

-- =====================================================
-- 验证脚本
-- =====================================================

-- 验证全文索引
SHOW INDEX FROM posts WHERE Key_name = 'ft_search';
SHOW INDEX FROM portfolio_items WHERE Key_name = 'ft_search';

-- 验证新表
SHOW TABLES LIKE '%search%';
SHOW TABLES LIKE '%popular%';

-- 验证存储过程
SHOW PROCEDURE STATUS WHERE Db = DATABASE() AND Name LIKE 'sp_%search%';

-- 验证视图
SHOW FULL TABLES WHERE Table_Type = 'VIEW' AND Table_Name LIKE 'v_search%';

-- =====================================================
-- 测试查询
-- =====================================================

-- 测试全文搜索
SELECT * FROM posts
WHERE MATCH(title, content, excerpt) AGAINST('cyberpunk' IN NATURAL LANGUAGE MODE)
LIMIT 5;

-- 测试搜索历史
SELECT * FROM search_history ORDER BY created_at DESC LIMIT 10;

-- 测试热门关键词
SELECT * FROM popular_keywords ORDER BY search_count DESC LIMIT 10;

-- =====================================================
-- 完成标记
-- =====================================================

SELECT 'Migration 003_add_search_optimization completed successfully!' AS message;

-- =====================================================
-- 使用说明
-- =====================================================
-- 1. 全文搜索现在支持中文和短词搜索
-- 2. 所有搜索操作应通过 sp_record_search 存储过程记录
-- 3. 每日执行 sp_update_keyword_trends 更新趋势分数
-- 4. 使用 v_search_stats 视图查看搜索统计数据
-- =====================================================
