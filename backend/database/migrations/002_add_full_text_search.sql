-- =====================================================
-- Migration: Add Full-Text Search Indexes
-- Version: 002
-- Created: 2026-03-03
-- Description: Optimize search functionality with full-text indexes
-- =====================================================

-- =====================================================
-- 1. Full-Text Search Indexes
-- =====================================================

-- Posts full-text search index (re-create with better configuration)
ALTER TABLE posts DROP INDEX IF EXISTS ft_search;
ALTER TABLE posts ADD FULLTEXT INDEX `ft_search` (`title`, `content`, `excerpt`) WITH PARSER ngram;

-- Portfolio items full-text search
ALTER TABLE portfolio_items ADD FULLTEXT INDEX `ft_search` (`title`, `description`, `content`) WITH PARSER ngram;

-- Comments full-text search for admin
ALTER TABLE comments ADD FULLTEXT INDEX `ft_search` (`content`) WITH PARSER ngram;

-- =====================================================
-- 2. Composite Indexes for Common Queries
-- =====================================================

-- Blog listing query: published posts by date
CREATE INDEX `idx_blog_listing` ON posts (`status`, `post_type`, `published_at` DESC);

-- Archive query: posts by month/year
CREATE INDEX `idx_archive` ON posts (`status`, YEAR(`published_at`), MONTH(`published_at`), `published_at` DESC);

-- Author posts query
CREATE INDEX `idx_author_posts` ON posts (`author_id`, `status`, `published_at` DESC);

-- Category posts query optimization
CREATE INDEX `idx_category_posts` ON post_categories (`category_id`, `post_id`);

-- Related posts query
CREATE INDEX `idx_related_posts` ON post_categories (`post_id`, `category_id`);

-- Popular posts query
CREATE INDEX `idx_popular_posts` ON posts (`status`, `view_count` DESC, `published_at` DESC);

-- Featured posts query
CREATE INDEX `idx_featured_posts` ON posts (`status`, `post_type`, `published_at` DESC) WHERE `status` = 'publish';

-- Recent comments query
CREATE INDEX `idx_recent_comments` ON comments (`post_id`, `status`, `created_at` DESC);

-- User reading list query
CREATE INDEX `idx_user_reading_list` ON reading_list (`user_id`, `completed`, `updated_at` DESC);

-- =====================================================
-- 3. Search Results View
-- =====================================================

CREATE OR REPLACE VIEW `v_search_results` AS
SELECT
  p.id,
  p.title,
  p.slug,
  p.excerpt,
  p.featured_image,
  p.post_type,
  p.published_at,
  p.view_count,
  MATCH(p.title, p.content, p.excerpt) AGAINST (? IN NATURAL LANGUAGE MODE) AS relevance,
  u.username AS author_name,
  u.avatar_url AS author_avatar,
  GROUP_CONCAT(DISTINCT CASE WHEN c.type = 'category' THEN c.name END) AS categories,
  GROUP_CONCAT(DISTINCT CASE WHEN c.type = 'tag' THEN c.name END) AS tags
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id
WHERE p.status = 'publish'
  AND MATCH(p.title, p.content, p.excerpt) AGAINST (? IN NATURAL LANGUAGE MODE)
GROUP BY p.id
ORDER BY relevance DESC, p.published_at DESC;

-- =====================================================
-- 4. Search Stored Procedures
-- =====================================================

DELIMITER //

-- Simple search procedure
CREATE PROCEDURE `sp_search_posts`(
  IN search_query VARCHAR(500),
  IN limit_count INT,
  IN offset_count INT
)
BEGIN
  SELECT
    p.*,
    u.username AS author_username,
    MATCH(p.title, p.content, p.excerpt) AGAINST (search_query IN NATURAL LANGUAGE MODE) AS relevance
  FROM posts p
  LEFT JOIN users u ON p.author_id = u.id
  WHERE p.status = 'publish'
    AND MATCH(p.title, p.content, p.excerpt) AGAINST (search_query IN NATURAL LANGUAGE MODE)
  ORDER BY relevance DESC, p.published_at DESC
  LIMIT limit_count OFFSET offset_count;
END //

-- Advanced search with filters
CREATE PROCEDURE `sp_search_posts_advanced`(
  IN search_query VARCHAR(500),
  IN category_ids VARCHAR(500),
  IN tag_ids VARCHAR(500),
  IN author_id_param BIGINT,
  IN date_from_param DATE,
  IN date_to_param DATE,
  IN limit_count INT,
  IN offset_count INT
)
BEGIN
  SELECT
    p.*,
    u.username AS author_username,
    MATCH(p.title, p.content, p.excerpt) AGAINST (search_query IN NATURAL LANGUAGE MODE) AS relevance
  FROM posts p
  LEFT JOIN users u ON p.author_id = u.id
  LEFT JOIN post_categories pc ON p.id = pc.post_id
  WHERE p.status = 'publish'
    AND MATCH(p.title, p.content, p.excerpt) AGAINST (search_query IN NATURAL LANGUAGE MODE)
    AND (category_ids IS NULL OR pc.category_id IN (SELECT value FROM JSON_TABLE(category_ids, '$[*]' COLUMNS(value INT PATH '$'))))
    AND (tag_ids IS NULL OR pc.category_id IN (SELECT value FROM JSON_TABLE(tag_ids, '$[*]' COLUMNS(value INT PATH '$'))))
    AND (author_id_param IS NULL OR p.author_id = author_id_param)
    AND (date_from_param IS NULL OR p.published_at >= date_from_param)
    AND (date_to_param IS NULL OR p.published_at <= date_to_param)
  GROUP BY p.id
  ORDER BY relevance DESC, p.published_at DESC
  LIMIT limit_count OFFSET offset_count;
END //

-- Get search suggestions
CREATE PROCEDURE `sp_search_suggestions`(
  IN search_query VARCHAR(500),
  IN limit_count INT
)
BEGIN
  -- Title suggestions
  SELECT
    'title' AS type,
    title AS suggestion,
    COUNT(*) AS count
  FROM posts
  WHERE status = 'publish'
    AND title LIKE CONCAT('%', search_query, '%')
  GROUP BY title
  ORDER BY count DESC
  LIMIT limit_count

  UNION

  -- Category suggestions
  SELECT
    'category' AS type,
    name AS suggestion,
    count AS count
  FROM categories
  WHERE type = 'category'
    AND name LIKE CONCAT('%', search_query, '%')
  ORDER BY count DESC
  LIMIT limit_count;
END //

DELIMITER ;

-- =====================================================
-- 5. Search Statistics Table
-- =====================================================

CREATE TABLE IF NOT EXISTS `search_queries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Query ID',
  `query` VARCHAR(500) NOT NULL COMMENT 'Search query',
  `results_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Number of results',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT 'User ID (if logged in)',
  `ip_address` VARCHAR(100) DEFAULT NULL COMMENT 'IP address',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT 'User agent',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Search time',
  PRIMARY KEY (`id`),
  KEY `idx_query` (`query`(255)),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_results_count` (`results_count`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Search Queries Log';

-- Aggregate search statistics
CREATE TABLE IF NOT EXISTS `search_stats` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Stat ID',
  `query` VARCHAR(500) NOT NULL COMMENT 'Search query',
  `search_count` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Total searches',
  `avg_results` DECIMAL(10,2) DEFAULT NULL COMMENT 'Average results',
  `last_searched_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Last searched',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'First searched',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_query` (`query`),
  KEY `idx_search_count` (`search_count` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Search Statistics';

-- =====================================================
-- 6. Triggers for Search Stats
-- =====================================================

DELIMITER //

-- Log search query and update stats
CREATE TRIGGER `tr_search_query_insert`
AFTER INSERT ON `search_queries`
FOR EACH ROW
BEGIN
  INSERT INTO search_stats (query, search_count, avg_results, last_searched_at)
  VALUES (NEW.query, 1, NEW.results_count, NEW.created_at)
  ON DUPLICATE KEY UPDATE
    search_count = search_count + 1,
    avg_results = (avg_results * (search_count - 1) + NEW.results_count) / search_count,
    last_searched_at = NEW.created_at;
END //

DELIMITER ;

-- =====================================================
-- 7. Scheduled Event for Search Stats Maintenance
-- =====================================================

DELIMITER //

-- Clean old search query logs (keep last 90 days)
CREATE EVENT IF NOT EXISTS `evt_cleanup_search_logs`
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
DO
BEGIN
  DELETE FROM search_queries
  WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

  -- Delete low-volume search stats
  DELETE FROM search_stats
  WHERE search_count < 2 AND last_searched_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
END //

DELIMITER ;

-- =====================================================
-- Complete
-- =====================================================
