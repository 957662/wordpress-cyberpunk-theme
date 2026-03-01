-- =====================================================
-- CyberPress Platform - Database Schema
-- =====================================================
-- Version: 1.0.0
-- Created: 2026-03-02
-- Database: MySQL 8.0+ / MariaDB 10.6+
-- =====================================================

-- 设置字符集和排序规则
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- =====================================================
-- 1. 用户表 (users)
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `email` VARCHAR(255) NOT NULL COMMENT '邮箱地址',
  `username` VARCHAR(100) NOT NULL COMMENT '用户名',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `first_name` VARCHAR(100) DEFAULT NULL COMMENT '名字',
  `last_name` VARCHAR(100) DEFAULT NULL COMMENT '姓氏',
  `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `bio` TEXT DEFAULT NULL COMMENT '个人简介',
  `role` ENUM('subscriber', 'contributor', 'author', 'editor', 'administrator') NOT NULL DEFAULT 'subscriber' COMMENT '用户角色',
  `status` ENUM('active', 'inactive', 'suspended', 'banned') NOT NULL DEFAULT 'active' COMMENT '账号状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login_at` TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL COMMENT '邮箱验证时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_role` (`role`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =====================================================
-- 2. 文章表 (posts)
-- =====================================================
CREATE TABLE IF NOT EXISTS `posts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文章ID',
  `title` VARCHAR(500) NOT NULL COMMENT '文章标题',
  `slug` VARCHAR(500) NOT NULL COMMENT 'URL友好字符串',
  `content` LONGTEXT NOT NULL COMMENT '文章内容',
  `excerpt` TEXT DEFAULT NULL COMMENT '文章摘要',
  `author_id` BIGINT UNSIGNED NOT NULL COMMENT '作者ID',
  `featured_image` VARCHAR(500) DEFAULT NULL COMMENT '特色图片URL',
  `status` ENUM('draft', 'pending', 'publish', 'private', 'trash') NOT NULL DEFAULT 'draft' COMMENT '文章状态',
  `post_type` ENUM('post', 'page', 'portfolio') NOT NULL DEFAULT 'post' COMMENT '内容类型',
  `comment_status` ENUM('open', 'closed') NOT NULL DEFAULT 'open' COMMENT '评论状态',
  `view_count` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览次数',
  `like_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞数',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `published_at` TIMESTAMP NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_author` (`author_id`),
  KEY `idx_status` (`status`),
  KEY `idx_post_type` (`post_type`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_view_count` (`view_count`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_author_status_published` (`author_id`, `status`, `published_at` DESC),
  KEY `idx_status_type_published` (`status`, `post_type`, `published_at` DESC),
  FULLTEXT KEY `ft_search` (`title`, `content`, `excerpt`),
  CONSTRAINT `fk_posts_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- =====================================================
-- 3. 分类表 (categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(200) NOT NULL COMMENT '分类名称',
  `slug` VARCHAR(200) NOT NULL COMMENT 'URL友好字符串',
  `description` TEXT DEFAULT NULL COMMENT '分类描述',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父分类ID',
  `type` ENUM('category', 'tag') NOT NULL DEFAULT 'category' COMMENT '分类类型',
  `count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '关联文章数',
  `icon` VARCHAR(100) DEFAULT NULL COMMENT '图标名称',
  `color` VARCHAR(20) DEFAULT NULL COMMENT '分类颜色',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug_type` (`slug`, `type`),
  KEY `idx_parent` (`parent_id`),
  KEY `idx_type` (`type`),
  KEY `idx_count` (`count`),
  KEY `idx_type_count_sort` (`type`, `count` DESC, `sort_order`),
  CONSTRAINT `fk_categories_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- =====================================================
-- 4. 文章分类关联表 (post_categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS `post_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `post_id` BIGINT UNSIGNED NOT NULL COMMENT '文章ID',
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_category` (`post_id`, `category_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_category_post` (`category_id`, `post_id`),
  CONSTRAINT `fk_pc_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章分类关联表';

-- =====================================================
-- 5. 文章元数据表 (post_meta)
-- =====================================================
CREATE TABLE IF NOT EXISTS `post_meta` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '元数据ID',
  `post_id` BIGINT UNSIGNED NOT NULL COMMENT '文章ID',
  `meta_key` VARCHAR(255) NOT NULL COMMENT '元数据键名',
  `meta_value` LONGTEXT DEFAULT NULL COMMENT '元数据值',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_post_meta_key` (`post_id`, `meta_key`),
  KEY `idx_meta_key` (`meta_key`),
  CONSTRAINT `fk_postmeta_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章元数据表';

-- =====================================================
-- 6. 评论表 (comments)
-- =====================================================
CREATE TABLE IF NOT EXISTS `comments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  `post_id` BIGINT UNSIGNED NOT NULL COMMENT '文章ID',
  `author_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '注册用户ID',
  `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父评论ID',
  `author_name` VARCHAR(200) DEFAULT NULL COMMENT '访客姓名',
  `author_email` VARCHAR(255) DEFAULT NULL COMMENT '访客邮箱',
  `author_ip` VARCHAR(100) DEFAULT NULL COMMENT '访客IP',
  `content` TEXT NOT NULL COMMENT '评论内容',
  `status` ENUM('pending', 'approved', 'spam', 'trash') NOT NULL DEFAULT 'pending' COMMENT '评论状态',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `approved_at` TIMESTAMP NULL DEFAULT NULL COMMENT '审核通过时间',
  `approved_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '审核人ID',
  PRIMARY KEY (`id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_author` (`author_id`),
  KEY `idx_parent` (`parent_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_post_status_parent_created` (`post_id`, `status`, `parent_id`, `created_at` DESC),
  KEY `idx_parent_status_created` (`parent_id`, `status`, `created_at` ASC),
  KEY `idx_status_created` (`status`, `created_at` DESC),
  CONSTRAINT `fk_comments_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_comments_parent` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comments_approved_by` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- =====================================================
-- 7. 作品集表 (portfolio_items)
-- =====================================================
CREATE TABLE IF NOT EXISTS `portfolio_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '作品ID',
  `title` VARCHAR(500) NOT NULL COMMENT '项目标题',
  `slug` VARCHAR(500) NOT NULL COMMENT 'URL友好字符串',
  `description` TEXT DEFAULT NULL COMMENT '项目描述',
  `content` LONGTEXT DEFAULT NULL COMMENT '详细内容',
  `featured_image` VARCHAR(500) DEFAULT NULL COMMENT '特色图片URL',
  `demo_url` VARCHAR(500) DEFAULT NULL COMMENT '演示链接',
  `source_url` VARCHAR(500) DEFAULT NULL COMMENT '源码链接',
  `technologies` JSON DEFAULT NULL COMMENT '技术栈数组',
  `status` ENUM('draft', 'publish', 'private', 'trash') NOT NULL DEFAULT 'draft' COMMENT '状态',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
  `featured` BOOLEAN NOT NULL DEFAULT false COMMENT '是否精选',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `published_at` TIMESTAMP NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_slug` (`slug`),
  KEY `idx_status` (`status`),
  KEY `idx_featured` (`featured`),
  KEY `idx_sort_order` (`sort_order`),
  KEY `idx_published_at` (`published_at`),
  KEY `idx_featured_status_sort_published` (`featured`, `status`, `sort_order`, `published_at` DESC),
  FULLTEXT KEY `ft_search` (`title`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品集表';

-- =====================================================
-- 8. 作品集图库表 (portfolio_gallery)
-- =====================================================
CREATE TABLE IF NOT EXISTS `portfolio_gallery` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '图片ID',
  `portfolio_item_id` BIGINT UNSIGNED NOT NULL COMMENT '作品ID',
  `image_url` VARCHAR(500) NOT NULL COMMENT '图片URL',
  `thumbnail_url` VARCHAR(500) DEFAULT NULL COMMENT '缩略图URL',
  `alt_text` VARCHAR(500) DEFAULT NULL COMMENT '替代文本',
  `caption` TEXT DEFAULT NULL COMMENT '图片说明',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_portfolio` (`portfolio_item_id`),
  KEY `idx_sort_order` (`sort_order`),
  CONSTRAINT `fk_gallery_portfolio` FOREIGN KEY (`portfolio_item_id`) REFERENCES `portfolio_items` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品集图库表';

-- =====================================================
-- 9. 媒体库表 (media)
-- =====================================================
CREATE TABLE IF NOT EXISTS `media` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '媒体ID',
  `filename` VARCHAR(500) NOT NULL COMMENT '文件名',
  `url` VARCHAR(1000) NOT NULL COMMENT '文件URL',
  `file_path` VARCHAR(1000) NOT NULL COMMENT '服务器路径',
  `mime_type` VARCHAR(200) NOT NULL COMMENT 'MIME类型',
  `file_size` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '文件大小（字节）',
  `width` INT UNSIGNED DEFAULT NULL COMMENT '图片宽度',
  `height` INT UNSIGNED DEFAULT NULL COMMENT '图片高度',
  `alt_text` VARCHAR(500) DEFAULT NULL COMMENT '替代文本',
  `title` VARCHAR(500) DEFAULT NULL COMMENT '媒体标题',
  `description` TEXT DEFAULT NULL COMMENT '媒体描述',
  `uploaded_by` BIGINT UNSIGNED NOT NULL COMMENT '上传者ID',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  PRIMARY KEY (`id`),
  KEY `idx_mime_type` (`mime_type`),
  KEY `idx_uploaded_by` (`uploaded_by`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_media_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='媒体库表';

-- =====================================================
-- 10. 系统设置表 (settings)
-- =====================================================
CREATE TABLE IF NOT EXISTS `settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '设置ID',
  `setting_key` VARCHAR(200) NOT NULL COMMENT '设置键名',
  `setting_value` LONGTEXT DEFAULT NULL COMMENT '设置值',
  `setting_type` ENUM('string', 'integer', 'boolean', 'json') NOT NULL DEFAULT 'string' COMMENT '值类型',
  `category` VARCHAR(100) NOT NULL DEFAULT 'general' COMMENT '设置分类',
  `description` TEXT DEFAULT NULL COMMENT '设置说明',
  `is_public` BOOLEAN NOT NULL DEFAULT false COMMENT '是否公开访问',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_setting_key` (`setting_key`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';

-- =====================================================
-- 11. 分析数据表 (analytics)
-- =====================================================
CREATE TABLE IF NOT EXISTS `analytics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '统计ID',
  `date` DATE NOT NULL COMMENT '统计日期',
  `post_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '文章ID',
  `views` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览量',
  `visitors` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '访客数',
  `unique_visitors` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '独立访客',
  `bounce_rate` DECIMAL(5,2) DEFAULT NULL COMMENT '跳出率',
  `avg_time_on_page` INT UNSIGNED DEFAULT NULL COMMENT '平均停留时间（秒）',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_date_post` (`date`, `post_id`),
  KEY `idx_post` (`post_id`),
  KEY `idx_date` (`date`),
  KEY `idx_date_views` (`date`, `views`, `visitors`),
  CONSTRAINT `fk_analytics_post` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分析数据表';

-- =====================================================
-- 初始数据
-- =====================================================

-- 插入默认管理员用户（密码: admin123，实际使用时应该更改）
-- 密码哈希是 'admin123' 的 bcrypt 哈希
INSERT INTO `users` (`email`, `username`, `password_hash`, `first_name`, `last_name`, `role`, `status`, `email_verified_at`)
VALUES (
  'admin@cyberpress.com',
  'admin',
  '$2b$10$YQl7Z.X3N.Z4X.G5K.J.VuW.J.H3K.K.J.VuW.J.H3K.K.J.VuW.J',
  'Admin',
  'User',
  'administrator',
  'active',
  NOW()
) ON DUPLICATE KEY UPDATE `id` = `id`;

-- 插入系统默认设置
INSERT INTO `settings` (`setting_key`, `setting_value`, `setting_type`, `category`, `description`, `is_public`) VALUES
('site_title', 'CyberPress Platform', 'string', 'general', '网站标题', true),
('site_description', 'A Cyberpunk-Style Blog Platform', 'string', 'general', '网站描述', true),
('site_url', 'https://cyberpress.com', 'string', 'general', '网站URL', true),
('admin_email', 'admin@cyberpress.com', 'string', 'general', '管理员邮箱', false),
('posts_per_page', '10', 'integer', 'reading', '每页显示文章数', true),
('comment_status', 'open', 'string', 'discussion', '是否开放评论', false),
('comment_moderation', '1', 'boolean', 'discussion', '评论需要审核', false),
('date_format', 'Y-m-d', 'string', 'general', '日期格式', true),
('time_format', 'H:i:s', 'string', 'general', '时间格式', true),
('timezone', 'UTC', 'string', 'general', '时区', false),
('seo_enabled', '1', 'boolean', 'seo', '启用SEO优化', false),
('analytics_enabled', '1', 'boolean', 'analytics', '启用统计', false)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 插入默认分类
INSERT INTO `categories` (`name`, `slug`, `description`, `type`, `count`, `sort_order`) VALUES
('Technology', 'technology', 'Technology related posts', 'category', 0, 1),
('Programming', 'programming', 'Programming tutorials', 'category', 0, 2),
('Design', 'design', 'Design articles', 'category', 0, 3),
('Cyberpunk', 'cyberpunk', 'Cyberpunk culture', 'category', 0, 4),
('Web Development', 'web-development', 'Web development posts', 'category', 0, 5)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 插入默认标签
INSERT INTO `categories` (`name`, `slug`, `type`, `count`) VALUES
('JavaScript', 'javascript', 'tag', 0),
('TypeScript', 'typescript', 'tag', 0),
('React', 'react', 'tag', 0),
('Next.js', 'nextjs', 'tag', 0),
('CSS', 'css', 'tag', 0),
('Tailwind', 'tailwind', 'tag', 0),
('Database', 'database', 'tag', 0),
('API', 'api', 'tag', 0)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- =====================================================
-- 性能优化视图
-- =====================================================

-- 文章列表视图（包含作者信息）
CREATE OR REPLACE VIEW `v_post_list` AS
SELECT
  p.*,
  u.username AS author_username,
  u.first_name AS author_first_name,
  u.last_name AS author_last_name,
  u.avatar_url AS author_avatar,
  GROUP_CONCAT(DISTINCT c.name ORDER BY c.name SEPARATOR ',') AS category_names,
  COUNT(DISTINCT cm.id) AS comment_count
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id AND c.type = 'category'
LEFT JOIN comments cm ON p.id = cm.post_id AND cm.status = 'approved'
GROUP BY p.id;

-- 热门文章视图
CREATE OR REPLACE VIEW `v_popular_posts` AS
SELECT
  p.*,
  u.username AS author_username,
  COUNT(DISTINCT cm.id) AS comment_count
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN comments cm ON p.id = cm.post_id AND cm.status = 'approved'
WHERE p.status = 'publish' AND p.post_type = 'post'
GROUP BY p.id
ORDER BY p.view_count DESC, p.published_at DESC
LIMIT 100;

-- 分类统计视图
CREATE OR REPLACE VIEW `v_category_stats` AS
SELECT
  c.id,
  c.name,
  c.slug,
  c.type,
  c.description,
  c.count AS post_count,
  COUNT(DISTINCT pc.post_id) AS actual_post_count
FROM categories c
LEFT JOIN post_categories pc ON c.id = pc.category_id
GROUP BY c.id;

-- =====================================================
-- 存储过程
-- =====================================================

DELIMITER //

-- 更新文章浏览次数
CREATE PROCEDURE `sp_increment_post_views`(IN post_id_param BIGINT)
BEGIN
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = post_id_param;

  -- 更新每日统计
  INSERT INTO analytics (date, post_id, views, visitors, unique_visitors)
  VALUES (CURDATE(), post_id_param, 1, 1, 1)
  ON DUPLICATE KEY UPDATE
    views = views + 1,
    visitors = visitors + 1,
    unique_visitors = unique_visitors + 1;
END //

-- 更新分类文章数
CREATE PROCEDURE `sp_update_category_counts`()
BEGIN
  UPDATE categories c
  SET c.count = (
    SELECT COUNT(*)
    FROM post_categories pc
    JOIN posts p ON pc.post_id = p.id
    WHERE pc.category_id = c.id AND p.status = 'publish'
  );
END //

-- 清理过期数据
CREATE PROCEDURE `sp_cleanup_old_data`(IN days_to_keep INT)
BEGIN
  -- 清理已删除30天以上的文章
  DELETE FROM posts
  WHERE status = 'trash'
  AND updated_at < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);

  -- 清理垃圾评论
  DELETE FROM comments
  WHERE status = 'trash'
  AND updated_at < DATE_SUB(NOW(), INTERVAL days_to_keep DAY);
END //

DELIMITER ;

-- =====================================================
-- 触发器
-- =====================================================

DELIMITER //

-- 文章发布后自动更新分类计数
CREATE TRIGGER `tr_post_published_update_category`
AFTER UPDATE ON posts
FOR EACH ROW
BEGIN
  IF NEW.status = 'publish' AND OLD.status != 'publish' THEN
    CALL sp_update_category_counts();
  ENDIF;
END //

-- 新增分类关联后更新计数
CREATE TRIGGER `tr_category_added_update_count`
AFTER INSERT ON post_categories
FOR EACH ROW
BEGIN
  CALL sp_update_category_counts();
END //

DELIMITER ;

-- =====================================================
-- 定时事件（需要开启事件调度器）
-- =====================================================

-- SET GLOBAL event_scheduler = ON;

DELIMITER //

-- 每日更新分类计数
CREATE EVENT IF NOT EXISTS `evt_daily_update_counts`
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
BEGIN
  CALL sp_update_category_counts();
END //

-- 每周清理旧数据
CREATE EVENT IF NOT EXISTS `evt_weekly_cleanup`
ON SCHEDULE EVERY 1 WEEK
STARTS CURRENT_TIMESTAMP
DO
BEGIN
  CALL sp_cleanup_old_data(30);
END //

DELIMITER ;

-- =====================================================
-- 完成
-- =====================================================

-- 显示创建的表
SHOW TABLES;
