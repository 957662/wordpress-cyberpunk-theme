-- =====================================================
-- Migration: 001_initial_schema
-- =====================================================
-- Version: 1.0.0
-- Created: 2026-03-02
-- Description: 初始化数据库架构
-- =====================================================

-- 创建迁移记录表
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` VARCHAR(255) NOT NULL,
  `batch` INT NOT NULL,
  `executed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 记录本次迁移
INSERT INTO `migrations` (`migration`, `batch`)
VALUES ('001_initial_schema', 1);

-- =====================================================
-- 以下是完整的数据库架构创建语句
-- =====================================================

-- 设置字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- =====================================================
-- 1. 用户表
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) DEFAULT NULL,
  `last_name` VARCHAR(100) DEFAULT NULL,
  `avatar_url` VARCHAR(500) DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `role` ENUM('subscriber', 'contributor', 'author', 'editor', 'administrator') NOT NULL DEFAULT 'subscriber',
  `status` ENUM('active', 'inactive', 'suspended', 'banned') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login_at` TIMESTAMP NULL DEFAULT NULL,
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. 文章表
-- =====================================================
CREATE TABLE IF NOT EXISTS `posts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `author_id` BIGINT UNSIGNED NOT NULL,
  `featured_image` VARCHAR(500) DEFAULT NULL,
  `status` ENUM('draft', 'pending', 'publish', 'private', 'trash') NOT NULL DEFAULT 'draft',
  `post_type` ENUM('post', 'page', 'portfolio') NOT NULL DEFAULT 'post',
  `comment_status` ENUM('open', 'closed') NOT NULL DEFAULT 'open',
  `view_count` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `like_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_author` (`author_id`),
  KEY `idx_status` (`status`),
  KEY `idx_post_type` (`post_type`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_view_count` (`view_count`),
  KEY `idx_created_at` (`created_at`),
  FULLTEXT KEY `ft_search` (`title`, `content`, `excerpt`),
  CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. 分类表
-- =====================================================
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `parent_id` BIGINT UNSIGNED DEFAULT NULL,
  `type` ENUM('category', 'tag') NOT NULL DEFAULT 'category',
  `count` INT UNSIGNED NOT NULL DEFAULT 0,
  `icon` VARCHAR(100) DEFAULT NULL,
  `color` VARCHAR(20) DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug_type` (`slug`, `type`),
  KEY `idx_parent` (`parent_id`),
  KEY `idx_type` (`type`),
  KEY `idx_count` (`count`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. 文章分类关联表
-- =====================================================
CREATE TABLE IF NOT EXISTS `post_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT UNSIGNED NOT NULL,
  `category_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_category` (`post_id`, `category_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_category_post` (`category_id`, `post_id`),
  CONSTRAINT `fk_pc_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. 文章元数据表
-- =====================================================
CREATE TABLE IF NOT EXISTS `post_meta` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT UNSIGNED NOT NULL,
  `meta_key` VARCHAR(255) NOT NULL,
  `meta_value` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_meta_key` (`post_id`, `meta_key`),
  KEY `idx_meta_key` (`meta_key`),
  CONSTRAINT `fk_postmeta_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. 评论表
-- =====================================================
CREATE TABLE IF NOT EXISTS `comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `post_id` BIGINT UNSIGNED NOT NULL,
  `author_id` BIGINT UNSIGNED DEFAULT NULL,
  `parent_id` BIGINT UNSIGNED DEFAULT NULL,
  `author_name` VARCHAR(200) DEFAULT NULL,
  `author_email` VARCHAR(255) DEFAULT NULL,
  `author_ip` VARCHAR(100) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `status` ENUM('pending', 'approved', 'spam', 'trash') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `approved_at` TIMESTAMP NULL DEFAULT NULL,
  `approved_by` BIGINT UNSIGNED DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_author` (`author_id`),
  KEY `idx_parent` (`parent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_comments_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_comments_parent` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. 作品集表
-- =====================================================
CREATE TABLE IF NOT EXISTS `portfolio_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(500) NOT NULL,
  `slug` VARCHAR(500) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `featured_image` VARCHAR(500) DEFAULT NULL,
  `demo_url` VARCHAR(500) DEFAULT NULL,
  `source_url` VARCHAR(500) DEFAULT NULL,
  `technologies` JSON DEFAULT NULL,
  `status` ENUM('draft', 'publish', 'private', 'trash') NOT NULL DEFAULT 'draft',
  `sort_order` INT NOT NULL DEFAULT 0,
  `featured` BOOLEAN NOT NULL DEFAULT false,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `published_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_status` (`status`),
  KEY `idx_featured` (`featured`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_published_at` (`published_at`),
  FULLTEXT KEY `ft_search` (`title`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. 作品集图库表
-- =====================================================
CREATE TABLE IF NOT EXISTS `portfolio_gallery` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `portfolio_item_id` BIGINT UNSIGNED NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `thumbnail_url` VARCHAR(500) DEFAULT NULL,
  `alt_text` VARCHAR(500) DEFAULT NULL,
  `caption` TEXT DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_portfolio` (`portfolio_item_id`),
  KEY `idx_sort_order` (`sort_order`),
  CONSTRAINT `fk_gallery_portfolio` FOREIGN KEY (`portfolio_item_id`) REFERENCES `portfolio_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. 媒体库表
-- =====================================================
CREATE TABLE IF NOT EXISTS `media` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(500) NOT NULL,
  `url` VARCHAR(1000) NOT NULL,
  `file_path` VARCHAR(1000) NOT NULL,
  `mime_type` VARCHAR(200) NOT NULL,
  `file_size` BIGINT UNSIGNED NOT NULL DEFAULT 0,
  `width` INT UNSIGNED DEFAULT NULL,
  `height` INT UNSIGNED DEFAULT NULL,
  `alt_text` VARCHAR(500) DEFAULT NULL,
  `title` VARCHAR(500) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `uploaded_by` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mime_type` (`mime_type`),
  KEY `idx_uploaded_by` (`uploaded_by`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_media_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. 系统设置表
-- =====================================================
CREATE TABLE IF NOT EXISTS `settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(200) NOT NULL,
  `setting_value` LONGTEXT DEFAULT NULL,
  `setting_type` ENUM('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string',
  `category` VARCHAR(100) NOT NULL DEFAULT 'general',
  `description` TEXT DEFAULT NULL,
  `is_public` BOOLEAN NOT NULL DEFAULT false,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_setting_key` (`setting_key`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. 分析数据表
-- =====================================================
CREATE TABLE IF NOT EXISTS `analytics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `date` DATE NOT NULL,
  `post_id` BIGINT UNSIGNED DEFAULT NULL,
  `views` INT UNSIGNED NOT NULL DEFAULT 0,
  `visitors` INT UNSIGNED NOT NULL DEFAULT 0,
  `unique_visitors` INT UNSIGNED NOT NULL DEFAULT 0,
  `bounce_rate` DECIMAL(5,2) DEFAULT NULL,
  `avg_time_on_page` INT UNSIGNED DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_date_post` (`date`, `post_id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_date` (`date`),
  CONSTRAINT `fk_analytics_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 初始数据
-- =====================================================

-- 默认管理员
INSERT INTO `users` (`email`, `username`, `password_hash`, `first_name`, `last_name`, `role`, `status`, `email_verified_at`)
VALUES ('admin@cyberpress.com', 'admin', '$2b$10$YQl7Z.X3N.Z4X.G5K.J.VuW.J.H3K.K.J.VuW.J.H3K.K.J.VuW.J', 'Admin', 'User', 'administrator', 'active', NOW());

-- 默认设置
INSERT INTO `settings` (`setting_key`, `setting_value`, `setting_type`, `category`, `description`, `is_public`) VALUES
('site_title', 'CyberPress Platform', 'string', 'general', '网站标题', true),
('site_description', 'A Cyberpunk-Style Blog Platform', 'string', 'general', '网站描述', true),
('posts_per_page', '10', 'integer', 'reading', '每页显示文章数', true);

-- 默认分类
INSERT INTO `categories` (`name`, `slug`, `type`, `count`) VALUES
('Technology', 'technology', 'category', 0),
('Programming', 'programming', 'category', 0),
('Design', 'design', 'category', 0);

-- =====================================================
-- 完成标记
-- =====================================================
SELECT 'Migration 001_initial_schema completed successfully!' AS message;
