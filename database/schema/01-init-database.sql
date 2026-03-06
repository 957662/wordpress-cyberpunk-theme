-- ====================================================================
-- CyberPress Platform - 数据库初始化脚本
-- ====================================================================
-- 创建时间: 2026-03-07
-- 架构师: AI Database Architect
-- 版本: 1.0.0
-- 数据库: MySQL 8.0+ / MariaDB 10.6+
-- ====================================================================

-- 设置字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `cyberpress`
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `cyberpress`;

-- ====================================================================
-- 1. 用户表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `avatar_url` VARCHAR(500) NULL,
    `cover_url` VARCHAR(500) NULL,
    `bio` TEXT NULL,
    `website` VARCHAR(255) NULL,
    `location` VARCHAR(100) NULL,
    `birth_date` DATE NULL,

    -- 状态字段
    `status` ENUM('active', 'inactive', 'banned', 'pending') NOT NULL DEFAULT 'pending',
    `email_verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `phone` VARCHAR(20) NULL,
    `phone_verified` BOOLEAN NOT NULL DEFAULT FALSE,

    -- 统计字段
    `followers_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `following_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `posts_count` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    UNIQUE KEY `uk_email` (`email`),
    KEY `idx_status` (`status`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_status_created` (`status`, `created_at` DESC),
    KEY `idx_status_followers` (`status`, `followers_count` DESC),
    FULLTEXT KEY `ft_search` (`username`, `bio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='用户主表';

-- ====================================================================
-- 2. 用户资料表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `user_profiles` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,

    -- 个人信息
    `display_name` VARCHAR(100) NULL,
    `real_name` VARCHAR(100) NULL,
    `gender` ENUM('male', 'female', 'other', 'prefer_not_to_say') NULL,
    `birth_date` DATE NULL,

    -- 社交信息
    `website` VARCHAR(255) NULL,
    `github` VARCHAR(100) NULL,
    `twitter` VARCHAR(100) NULL,
    `linkedin` VARCHAR(100) NULL,

    -- 偏好设置
    `language` VARCHAR(10) NOT NULL DEFAULT 'zh-CN',
    `timezone` VARCHAR(50) NOT NULL DEFAULT 'Asia/Shanghai',
    `theme` ENUM('light', 'dark', 'auto') NOT NULL DEFAULT 'auto',

    -- 隐私设置
    `profile_visibility` ENUM('public', 'followers_only', 'private') NOT NULL DEFAULT 'public',
    `show_email` BOOLEAN NOT NULL DEFAULT FALSE,
    `show_location` BOOLEAN NOT NULL DEFAULT FALSE,
    `allow_messages` BOOLEAN NOT NULL DEFAULT TRUE,

    -- 通知设置
    `notification_preferences` JSON NULL,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_id` (`user_id`),
    KEY `idx_user_id` (`user_id`),
    CONSTRAINT `fk_user_profiles_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='用户详细资料表';

-- ====================================================================
-- 3. 关注关系表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `followers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `follower_id` BIGINT UNSIGNED NOT NULL COMMENT '关注者ID',
    `following_id` BIGINT UNSIGNED NOT NULL COMMENT '被关注者ID',

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_follow` (`follower_id`, `following_id`),
    KEY `idx_follower` (`follower_id`),
    KEY `idx_following` (`following_id`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_following_created` (`following_id`, `created_at` DESC),
    CONSTRAINT `chk_no_self_follow`
        CHECK (`follower_id` != `following_id`),
    CONSTRAINT `fk_followers_follower`
        FOREIGN KEY (`follower_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_followers_following`
        FOREIGN KEY (`following_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='用户关注关系表';

-- ====================================================================
-- 4. 分类表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    -- 层级关系
    `parent_id` BIGINT UNSIGNED NULL,
    `level` INT UNSIGNED NOT NULL DEFAULT 0,
    `path` VARCHAR(500) NULL,

    -- 媒体
    `icon` VARCHAR(100) NULL,
    `color` VARCHAR(20) NULL,
    `image` VARCHAR(500) NULL,

    -- 统计
    `post_count` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 显示设置
    `display_order` INT UNSIGNED NOT NULL DEFAULT 0,
    `is_visible` BOOLEAN NOT NULL DEFAULT TRUE,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_slug` (`slug`),
    KEY `idx_parent` (`parent_id`),
    KEY `idx_display_order` (`display_order`),
    CONSTRAINT `fk_categories_parent`
        FOREIGN KEY (`parent_id`)
        REFERENCES `categories`(`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章分类表';

-- ====================================================================
-- 5. 标签表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `tags` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `description` TEXT NULL,

    -- 样式
    `color` VARCHAR(20) NULL,
    `icon` VARCHAR(100) NULL,

    -- 统计
    `post_count` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 显示设置
    `display_order` INT UNSIGNED NOT NULL DEFAULT 0,
    `is_visible` BOOLEAN NOT NULL DEFAULT TRUE,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_name` (`name`),
    UNIQUE KEY `uk_slug` (`slug`),
    KEY `idx_post_count` (`post_count` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章标签表';

-- ====================================================================
-- 6. 文章表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `posts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `author_id` BIGINT UNSIGNED NOT NULL,

    -- 内容字段
    `title` VARCHAR(500) NOT NULL,
    `slug` VARCHAR(500) NOT NULL,
    `excerpt` TEXT NULL,
    `content` LONGTEXT NOT NULL,

    -- 媒体
    `featured_image` VARCHAR(500) NULL,
    `cover_image` VARCHAR(500) NULL,

    -- 分类和标签
    `category_id` BIGINT UNSIGNED NULL,
    `primary_tag_id` BIGINT UNSIGNED NULL,

    -- 状态字段
    `status` ENUM('draft', 'published', 'scheduled', 'archived') NOT NULL DEFAULT 'draft',
    `post_type` ENUM('post', 'page', 'custom') NOT NULL DEFAULT 'post',

    -- SEO
    `meta_title` VARCHAR(200) NULL,
    `meta_description` TEXT NULL,
    `meta_keywords` VARCHAR(500) NULL,

    -- 统计字段
    `view_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `like_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `comment_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `bookmark_count` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 阅读相关
    `reading_time` INT UNSIGNED NULL COMMENT '预估阅读时间（分钟）',
    `word_count` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 优先级和特色
    `is_featured` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_pinned` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_trending` BOOLEAN NOT NULL DEFAULT FALSE,
    `priority` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `published_at` TIMESTAMP NULL,
    `scheduled_at` TIMESTAMP NULL,
    `deleted_at` TIMESTAMP NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_slug` (`slug`),
    KEY `idx_author` (`author_id`),
    KEY `idx_category` (`category_id`),
    KEY `idx_published_at` (`published_at`),
    KEY `idx_status_published` (`status`, `published_at` DESC),
    KEY `idx_author_status` (`author_id`, `status`),
    KEY `idx_category_published` (`category_id`, `status`, `published_at` DESC),
    KEY `idx_featured` (`is_featured`, `status`, `published_at` DESC),
    KEY `idx_trending` (`is_trending`, `status`, `view_count` DESC),
    KEY `idx_performance` (`status`, `published_at`, `view_count` DESC),
    KEY `idx_covering` (`status`, `published_at`, `author_id`, `title`, `slug`, `excerpt`, `view_count`, `like_count`),
    FULLTEXT KEY `ft_content` (`title`, `content`, `excerpt`),
    CONSTRAINT `fk_posts_author`
        FOREIGN KEY (`author_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_posts_category`
        FOREIGN KEY (`category_id`)
        REFERENCES `categories`(`id`)
        ON DELETE SET NULL,
    CONSTRAINT `fk_posts_primary_tag`
        FOREIGN KEY (`primary_tag_id`)
        REFERENCES `tags`(`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章主表';

-- ====================================================================
-- 7. 文章-分类关联表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `post_categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_post_category` (`post_id`, `category_id`),
    KEY `idx_post` (`post_id`),
    KEY `idx_category` (`category_id`),
    CONSTRAINT `fk_post_categories_post`
        FOREIGN KEY (`post_id`)
        REFERENCES `posts`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_post_categories_category`
        FOREIGN KEY (`category_id`)
        REFERENCES `categories`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章-分类关联表（多对多）';

-- ====================================================================
-- 8. 文章-标签关联表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `post_tags` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `tag_id` BIGINT UNSIGNED NOT NULL,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_post_tag` (`post_id`, `tag_id`),
    KEY `idx_post` (`post_id`),
    KEY `idx_tag` (`tag_id`),
    CONSTRAINT `fk_post_tags_post`
        FOREIGN KEY (`post_id`)
        REFERENCES `posts`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_post_tags_tag`
        FOREIGN KEY (`tag_id`)
        REFERENCES `tags`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章-标签关联表（多对多）';

-- ====================================================================
-- 9. 评论表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `comments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `author_id` BIGINT UNSIGNED NOT NULL,

    -- 层级关系
    `parent_id` BIGINT UNSIGNED NULL,
    `thread_id` BIGINT UNSIGNED NULL COMMENT '顶层评论ID',

    -- 内容
    `content` TEXT NOT NULL,

    -- 状态
    `status` ENUM('pending', 'approved', 'rejected', 'spam') NOT NULL DEFAULT 'pending',

    -- 统计
    `like_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `reply_count` INT UNSIGNED NOT NULL DEFAULT 0,

    -- IP和User-Agent
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` TIMESTAMP NULL,

    PRIMARY KEY (`id`),
    KEY `idx_post` (`post_id`),
    KEY `idx_author` (`author_id`),
    KEY `idx_parent` (`parent_id`),
    KEY `idx_thread` (`thread_id`),
    KEY `idx_status` (`status`),
    KEY `idx_created_at` (`created_at`),
    KEY `idx_post_status` (`post_id`, `status`, `created_at` DESC),
    KEY `idx_post_thread` (`post_id`, `thread_id`, `created_at`),
    KEY `idx_performance` (`post_id`, `status`, `created_at`, `like_count` DESC),
    CONSTRAINT `fk_comments_post`
        FOREIGN KEY (`post_id`)
        REFERENCES `posts`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_comments_author`
        FOREIGN KEY (`author_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_comments_parent`
        FOREIGN KEY (`parent_id`)
        REFERENCES `comments`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章评论表';

-- ====================================================================
-- 10. 点赞表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `likes` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `target_id` BIGINT UNSIGNED NOT NULL COMMENT '目标ID（文章/评论）',
    `target_type` ENUM('post', 'comment') NOT NULL COMMENT '目标类型',

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_like` (`user_id`, `target_id`, `target_type`),
    KEY `idx_user` (`user_id`),
    KEY `idx_target` (`target_id`, `target_type`),
    KEY `idx_target_type` (`target_id`, `target_type`, `created_at` DESC),
    CONSTRAINT `fk_likes_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='点赞表';

-- ====================================================================
-- 11. 收藏夹表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `bookmark_folders` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `icon` VARCHAR(100) NULL,
    `color` VARCHAR(20) NULL,

    -- 显示设置
    `is_public` BOOLEAN NOT NULL DEFAULT FALSE,
    `display_order` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 统计
    `bookmark_count` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_display_order` (`display_order`),
    CONSTRAINT `fk_bookmark_folders_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='收藏夹表';

-- ====================================================================
-- 12. 收藏表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `bookmarks` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `folder_id` BIGINT UNSIGNED NULL,

    -- 备注
    `note` TEXT NULL,
    `tags` VARCHAR(500) NULL COMMENT '用户自定义标签',

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_bookmark` (`user_id`, `post_id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_post` (`post_id`),
    KEY `idx_folder` (`folder_id`),
    KEY `idx_created_at` (`created_at` DESC),
    KEY `idx_user_folder` (`user_id`, `folder_id`, `created_at` DESC),
    KEY `idx_user_created` (`user_id`, `created_at` DESC),
    CONSTRAINT `fk_bookmarks_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_bookmarks_post`
        FOREIGN KEY (`post_id`)
        REFERENCES `posts`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_bookmarks_folder`
        FOREIGN KEY (`folder_id`)
        REFERENCES `bookmark_folders`(`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='收藏表';

-- ====================================================================
-- 13. 阅读历史表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `reading_history` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `post_id` BIGINT UNSIGNED NOT NULL,

    -- 阅读进度
    `progress_percent` INT UNSIGNED NOT NULL DEFAULT 0,
    `scroll_position` INT UNSIGNED NOT NULL DEFAULT 0,
    `time_spent` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 状态
    `is_completed` BOOLEAN NOT NULL DEFAULT FALSE,
    `last_read_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `first_read_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- 阅读次数
    `read_count` INT UNSIGNED NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_reading` (`user_id`, `post_id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_post` (`post_id`),
    KEY `idx_last_read` (`last_read_at` DESC),
    KEY `idx_user_progress` (`user_id`, `is_completed`, `last_read_at` DESC),
    KEY `idx_user_completed` (`user_id`, `is_completed`),
    CONSTRAINT `fk_reading_history_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_reading_history_post`
        FOREIGN KEY (`post_id`)
        REFERENCES `posts`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='阅读历史表';

-- ====================================================================
-- 14. 阅读列表表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `reading_list` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `post_id` BIGINT UNSIGNED NOT NULL,

    -- 优先级
    `priority` INT UNSIGNED NOT NULL DEFAULT 0,

    -- 备注
    `note` TEXT NULL,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_reading_list` (`user_id`, `post_id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_priority` (`user_id`, `priority`),
    CONSTRAINT `fk_reading_list_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_reading_list_post`
        FOREIGN KEY (`post_id`)
        REFERENCES `posts`(`id`)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='阅读列表（稍后阅读）';

-- ====================================================================
-- 15. 通知表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '接收者ID',
    `sender_id` BIGINT UNSIGNED NULL COMMENT '发送者ID',

    -- 类型
    `type` ENUM(
        'follow', 'like', 'comment', 'mention',
        'reply', 'bookmark', 'system', 'welcome'
    ) NOT NULL,

    -- 内容
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NULL,

    -- 关联数据
    `target_id` BIGINT UNSIGNED NULL,
    `target_type` VARCHAR(50) NULL,

    -- 状态
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `read_at` TIMESTAMP NULL,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_sender` (`sender_id`),
    KEY `idx_type` (`type`),
    KEY `idx_created_at` (`created_at` DESC),
    KEY `idx_user_unread` (`user_id`, `is_read`, `created_at` DESC),
    KEY `idx_user_type` (`user_id`, `type`, `created_at` DESC),
    CONSTRAINT `fk_notifications_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_notifications_sender`
        FOREIGN KEY (`sender_id`)
        REFERENCES `users`(`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='用户通知表';

-- ====================================================================
-- 16. 文章浏览统计表（分区表）
-- ====================================================================

CREATE TABLE IF NOT EXISTS `post_views` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `post_id` BIGINT UNSIGNED NOT NULL,
    `user_id` BIGINT UNSIGNED NULL COMMENT '用户ID（游客为NULL）',

    -- 访问信息
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `referrer` VARCHAR(500) NULL,

    -- 会话信息
    `session_id` VARCHAR(100) NULL,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`, `created_at`),
    KEY `idx_post` (`post_id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_session` (`session_id`),
    KEY `idx_post_date` (`post_id`, `created_at` DESC),
    KEY `idx_created_at` (`created_at`),
    CONSTRAINT `fk_post_views_post`
        FOREIGN KEY (`post_id`)
        REFERENCES `posts`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_post_views_user`
        FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='文章浏览统计表'
PARTITION BY RANGE (YEAR(`created_at`)) (
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- ====================================================================
-- 17. 媒体文件表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `media` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uploader_id` BIGINT UNSIGNED NOT NULL,

    -- 文件信息
    `filename` VARCHAR(255) NOT NULL,
    `original_filename` VARCHAR(255) NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `file_size` BIGINT UNSIGNED NOT NULL,

    -- 存储路径
    `storage_path` VARCHAR(500) NOT NULL,
    `url` VARCHAR(500) NOT NULL,
    `thumbnail_url` VARCHAR(500) NULL,

    -- 媒体类型
    `media_type` ENUM('image', 'video', 'audio', 'document', 'other') NOT NULL,

    -- 图片特有字段
    `width` INT UNSIGNED NULL,
    `height` INT UNSIGNED NULL,
    `alt_text` VARCHAR(500) NULL,
    `caption` TEXT NULL,

    -- 关联
    `post_id` BIGINT UNSIGNED NULL,

    -- 状态
    `status` ENUM('uploading', 'processing', 'ready', 'error') NOT NULL DEFAULT 'uploading',

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    KEY `idx_uploader` (`uploader_id`),
    KEY `idx_post` (`post_id`),
    KEY `idx_type` (`media_type`),
    KEY `idx_status` (`status`),
    KEY `idx_uploader_type` (`uploader_id`, `media_type`, `created_at` DESC),
    KEY `idx_created_at` (`created_at` DESC),
    CONSTRAINT `fk_media_uploader`
        FOREIGN KEY (`uploader_id`)
        REFERENCES `users`(`id`)
        ON DELETE CASCADE,
    CONSTRAINT `fk_media_post`
        FOREIGN KEY (`post_id`)
        REFERENCES `posts`(`id`)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='媒体文件表';

-- ====================================================================
-- 18. 分析事件表
-- ====================================================================

CREATE TABLE IF NOT EXISTS `analytics_events` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    -- 会话信息
    `session_id` VARCHAR(100) NOT NULL,
    `user_id` BIGINT UNSIGNED NULL,

    -- 事件信息
    `event_type` VARCHAR(50) NOT NULL,
    `event_category` VARCHAR(50) NULL,
    `event_label` VARCHAR(200) NULL,

    -- 页面信息
    `page_url` VARCHAR(500) NULL,
    `page_title` VARCHAR(200) NULL,
    `referrer` VARCHAR(500) NULL,

    -- 设备信息
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    `device_type` ENUM('desktop', 'tablet', 'mobile', 'bot') NULL,
    `browser` VARCHAR(50) NULL,
    `os` VARCHAR(50) NULL,

    -- 自定义属性
    `properties` JSON NULL,

    -- 时间戳
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    KEY `idx_session` (`session_id`),
    KEY `idx_user` (`user_id`),
    KEY `idx_type` (`event_type`),
    KEY `idx_created_at` (`created_at` DESC),
    KEY `idx_session_type` (`session_id`, `event_type`, `created_at`),
    KEY `idx_user_type` (`user_id`, `event_type`, `created_at` DESC),
    KEY `idx_type_created` (`event_type`, `created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='分析事件表';

-- ====================================================================
-- 初始化数据
-- ====================================================================

-- 插入默认分类
INSERT INTO `categories` (`name`, `slug`, `description`, `icon`, `color`, `display_order`) VALUES
('技术教程', 'tech-tutorials', '编程和技术教程', 'Code', '#00f0ff', 1),
('设计灵感', 'design-inspiration', 'UI/UX 设计灵感', 'Palette', '#9d00ff', 2),
('生活随笔', 'life-essays', '生活感悟和随笔', 'Coffee', '#ff0080', 3),
('项目实战', 'projects', '实际项目案例', 'Rocket', '#00ff88', 4),
('资源分享', 'resources', '工具和资源分享', 'Package', '#f0ff00', 5);

-- 插入默认标签
INSERT INTO `tags` (`name`, `slug`, `color`, `display_order`) VALUES
('Next.js', 'nextjs', '#00f0ff', 1),
('TypeScript', 'typescript', '#3178c6', 2),
('Tailwind CSS', 'tailwindcss', '#38bdf8', 3),
('React', 'react', '#61dafb', 4),
('FastAPI', 'fastapi', '#009688', 5),
('Python', 'python', '#3776ab', 6),
('PostgreSQL', 'postgresql', '#336791', 7),
('Docker', 'docker', '#2496ed', 8),
('UI/UX', 'uiux', '#ff0080', 9),
('赛博朋克', 'cyberpunk', '#9d00ff', 10);

-- ====================================================================
-- 创建视图（用于常用查询）
-- ====================================================================

-- 文章统计视图
CREATE OR REPLACE VIEW `vw_post_stats` AS
SELECT
    p.id,
    p.title,
    p.author_id,
    u.username AS author_name,
    p.status,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.bookmark_count,
    p.created_at,
    p.published_at
FROM `posts` p
LEFT JOIN `users` u ON p.author_id = u.id;

-- 用户统计视图
CREATE OR REPLACE VIEW `vw_user_stats` AS
SELECT
    u.id,
    u.username,
    u.email,
    u.status,
    u.followers_count,
    u.following_count,
    u.posts_count,
    (SELECT COUNT(*) FROM `posts` WHERE author_id = u.id AND status = 'published') AS published_posts,
    u.created_at
FROM `users` u;

-- ====================================================================
-- 创建存储过程
-- ====================================================================

DELIMITER //

-- 更新文章统计（点赞数、评论数等）
CREATE PROCEDURE `sp_update_post_stats`(IN post_id_param BIGINT)
BEGIN
    UPDATE `posts` p
    SET
        p.like_count = (SELECT COUNT(*) FROM `likes` WHERE target_id = post_id_param AND target_type = 'post'),
        p.comment_count = (SELECT COUNT(*) FROM `comments` WHERE post_id = post_id_param AND status = 'approved'),
        p.bookmark_count = (SELECT COUNT(*) FROM `bookmarks` WHERE post_id = post_id_param)
    WHERE p.id = post_id_param;
END //

-- 更新用户统计（粉丝数、关注数、文章数）
CREATE PROCEDURE `sp_update_user_stats`(IN user_id_param BIGINT)
BEGIN
    UPDATE `users` u
    SET
        u.followers_count = (SELECT COUNT(*) FROM `followers` WHERE following_id = user_id_param),
        u.following_count = (SELECT COUNT(*) FROM `followers` WHERE follower_id = user_id_param),
        u.posts_count = (SELECT COUNT(*) FROM `posts` WHERE author_id = user_id_param AND status IN ('published', 'scheduled'))
    WHERE u.id = user_id_param;
END //

-- 记录文章浏览
CREATE PROCEDURE `sp_track_post_view`(
    IN post_id_param BIGINT,
    IN user_id_param BIGINT,
    IN ip_address_param VARCHAR(45),
    IN user_agent_param VARCHAR(500),
    IN session_id_param VARCHAR(100)
)
BEGIN
    -- 插入浏览记录
    INSERT INTO `post_views` (
        post_id, user_id, ip_address, user_agent, session_id
    ) VALUES (
        post_id_param, user_id_param, ip_address_param, user_agent_param, session_id_param
    );

    -- 更新文章浏览计数
    UPDATE `posts`
    SET view_count = view_count + 1
    WHERE id = post_id_param;
END //

DELIMITER ;

-- ====================================================================
-- 创建触发器
-- ====================================================================

DELIMITER //

-- 关注后更新用户统计
CREATE TRIGGER `tr_follow_update_stats`
AFTER INSERT ON `followers`
FOR EACH ROW
BEGIN
    -- 更新被关注者的粉丝数
    CALL sp_update_user_stats(NEW.following_id);
    -- 更新关注者的关注数
    CALL sp_update_user_stats(NEW.follower_id);
END //

-- 点赞后更新文章统计
CREATE TRIGGER `tr_like_update_post_stats`
AFTER INSERT ON `likes`
FOR EACH ROW
BEGIN
    IF NEW.target_type = 'post' THEN
        CALL sp_update_post_stats(NEW.target_id);
    END IF;
END //

-- 评论后更新文章统计
CREATE TRIGGER `tr_comment_update_post_stats`
AFTER INSERT ON `comments`
FOR EACH ROW
BEGIN
    CALL sp_update_post_stats(NEW.post_id);
END //

-- 取消点赞后更新文章统计
CREATE TRIGGER `tr_unlike_update_post_stats`
AFTER DELETE ON `likes`
FOR EACH ROW
BEGIN
    IF OLD.target_type = 'post' THEN
        CALL sp_update_post_stats(OLD.target_id);
    END IF;
END //

DELIMITER ;

-- ====================================================================
-- 完成初始化
-- ====================================================================

-- 显示所有创建的表
SHOW TABLES;

-- 显示数据库大小
SELECT
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'cyberpress'
ORDER BY (data_length + index_length) DESC;

-- ====================================================================
-- 初始化完成
-- ====================================================================
SELECT '✅ CyberPress Platform 数据库初始化完成！' AS message;
