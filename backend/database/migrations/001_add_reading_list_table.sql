-- =====================================================
-- Migration: Add Reading List Table
-- Version: 001
-- Created: 2026-03-03
-- Description: Add reading list and bookmarks functionality
-- =====================================================

-- =====================================================
-- 1. Reading List Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `reading_list` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Reading list ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'User ID',
  `post_id` BIGINT UNSIGNED NOT NULL COMMENT 'Post ID',
  `progress` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Reading progress (0-100)',
  `completed` BOOLEAN NOT NULL DEFAULT false COMMENT 'Is completed',
  `notes` TEXT DEFAULT NULL COMMENT 'User notes',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Added to list',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_completed` (`completed`),
  KEY `idx_progress` (`progress`),
  CONSTRAINT `fk_reading_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reading_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Reading List';

-- =====================================================
-- 2. Bookmarks Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `bookmarks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Bookmark ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT 'User ID',
  `post_id` BIGINT UNSIGNED NOT NULL COMMENT 'Post ID',
  `notes` TEXT DEFAULT NULL COMMENT 'Bookmark notes',
  `tags` JSON DEFAULT NULL COMMENT 'User tags',
  `is_public` BOOLEAN NOT NULL DEFAULT false COMMENT 'Is public bookmark',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Bookmarked at',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last updated',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_public` (`is_public`),
  CONSTRAINT `fk_bookmark_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bookmark_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bookmarks';

-- =====================================================
-- 3. Series Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `series` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Series ID',
  `name` VARCHAR(200) NOT NULL COMMENT 'Series name',
  `slug` VARCHAR(200) NOT NULL COMMENT 'URL slug',
  `description` TEXT DEFAULT NULL COMMENT 'Series description',
  `cover_image` VARCHAR(500) DEFAULT NULL COMMENT 'Series cover image',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'Sort order',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_sort_order` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Post Series';

-- =====================================================
-- 4. Series Posts Relation Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `series_posts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Relation ID',
  `series_id` BIGINT UNSIGNED NOT NULL COMMENT 'Series ID',
  `post_id` BIGINT UNSIGNED NOT NULL COMMENT 'Post ID',
  `part_number` INT NOT NULL COMMENT 'Part number in series',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Added at',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_series_post` (`series_id`, `post_id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_part_number` (`part_number`),
  CONSTRAINT `fk_series_series` FOREIGN KEY (`series_id`) REFERENCES `series` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_series_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Series Posts Relation';

-- =====================================================
-- 5. Newsletter Subscriptions Table
-- =====================================================
CREATE TABLE IF NOT EXISTS `newsletter_subscriptions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Subscription ID',
  `email` VARCHAR(255) NOT NULL COMMENT 'Subscriber email',
  `name` VARCHAR(200) DEFAULT NULL COMMENT 'Subscriber name',
  `status` ENUM('pending', 'active', 'unsubscribed', 'bounced') NOT NULL DEFAULT 'pending' COMMENT 'Subscription status',
  `token` VARCHAR(64) DEFAULT NULL COMMENT 'Verification token',
  `subscribed_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Subscribed at',
  `unsubscribed_at` TIMESTAMP NULL DEFAULT NULL COMMENT 'Unsubscribed at',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Created at',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Updated at',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_status` (`status`),
  KEY `idx_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Newsletter Subscriptions';

-- =====================================================
-- Indexes for performance
-- =====================================================

-- Composite index for reading list stats
CREATE INDEX `idx_reading_user_completed_updated` ON `reading_list` (`user_id`, `completed`, `updated_at` DESC);

-- Composite index for bookmarks with public filter
CREATE INDEX `idx_bookmarks_user_public_created` ON `bookmarks` (`user_id`, `is_public`, `created_at` DESC);

-- Index for series posts ordered by part number
CREATE INDEX `idx_series_posts_series_part` ON `series_posts` (`series_id`, `part_number`);

-- =====================================================
-- Views
-- =====================================================

-- Reading list with post details
CREATE OR REPLACE VIEW `v_reading_list` AS
SELECT
  rl.id,
  rl.user_id,
  rl.post_id,
  rl.progress,
  rl.completed,
  rl.notes,
  rl.created_at AS added_at,
  rl.updated_at,
  p.title,
  p.slug,
  p.excerpt,
  p.featured_image,
  p.author_id,
  u.username AS author_name,
  GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ',') AS categories,
  TIMESTAMPDIFF(MINUTE, rl.created_at, rl.updated_at) AS reading_time_minutes
FROM reading_list rl
LEFT JOIN posts p ON rl.post_id = p.id
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id AND c.type = 'category'
GROUP BY rl.id;

-- Public bookmarks view
CREATE OR REPLACE VIEW `v_public_bookmarks` AS
SELECT
  b.id,
  b.user_id,
  b.post_id,
  b.notes,
  b.tags,
  b.created_at AS bookmarked_at,
  u.username,
  u.avatar_url,
  p.title,
  p.slug,
  p.excerpt,
  p.featured_image
FROM bookmarks b
INNER JOIN users u ON b.user_id = u.id
INNER JOIN posts p ON b.post_id = p.id
WHERE b.is_public = true
ORDER BY b.created_at DESC;

-- =====================================================
-- Stored Procedures
-- =====================================================

DELIMITER //

-- Update reading progress
CREATE PROCEDURE `sp_update_reading_progress`(
  IN user_id_param BIGINT,
  IN post_id_param BIGINT,
  IN progress_param INT
)
BEGIN
  INSERT INTO reading_list (user_id, post_id, progress, completed)
  VALUES (user_id_param, post_id_param, progress_param, progress_param >= 100)
  ON DUPLICATE KEY UPDATE
    progress = progress_param,
    completed = progress_param >= 100,
    updated_at = CURRENT_TIMESTAMP;
END //

-- Get user reading statistics
CREATE PROCEDURE `sp_user_reading_stats`(IN user_id_param BIGINT)
BEGIN
  SELECT
    COUNT(*) AS total_articles,
    SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) AS completed_articles,
    SUM(CASE WHEN completed = false THEN 1 ELSE 0 END) AS in_progress_articles,
    AVG(progress) AS avg_progress,
    SUM(CASE WHEN completed = true THEN 1 ELSE 0 END) / COUNT(*) * 100 AS completion_rate
  FROM reading_list
  WHERE user_id = user_id_param;
END //

DELIMITER ;

-- =====================================================
-- Triggers
-- =====================================================

DELIMITER //

-- Update series post count when post is added
CREATE TRIGGER `tr_series_post_added`
AFTER INSERT ON `series_posts`
FOR EACH ROW
BEGIN
  UPDATE series
  SET series.updated_at = CURRENT_TIMESTAMP
  WHERE id = NEW.series_id;
END //

DELIMITER ;

-- =====================================================
-- Complete
-- =====================================================
