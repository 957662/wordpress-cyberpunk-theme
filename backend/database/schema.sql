-- ================================================================
-- CyberPress Platform - Database Schema
-- 数据库架构
-- ================================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS cyberpress_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cyberpress_db;

-- ================================================================
-- 用户表
-- ================================================================
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(60) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) DEFAULT NULL,
  avatar_url VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  website VARCHAR(255) DEFAULT NULL,
  role ENUM('subscriber', 'contributor', 'author', 'editor', 'admin') DEFAULT 'subscriber',
  status ENUM('active', 'inactive', 'pending', 'banned') DEFAULT 'pending',
  email_verified_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 分类表
-- ================================================================
CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  parent_id BIGINT UNSIGNED DEFAULT NULL,
  icon VARCHAR(50) DEFAULT NULL,
  color VARCHAR(7) DEFAULT '#00f0ff',
  sort_order INT DEFAULT 0,
  post_count INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 标签表
-- ================================================================
CREATE TABLE tags (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  color VARCHAR(7) DEFAULT '#9d00ff',
  post_count INT UNSIGNED DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 文章表
-- ================================================================
CREATE TABLE posts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT DEFAULT NULL,
  content LONGTEXT NOT NULL,
  author_id BIGINT UNSIGNED NOT NULL,
  featured_image_id BIGINT UNSIGNED DEFAULT NULL,
  status ENUM('draft', 'pending', 'private', 'publish', 'future', 'trash') DEFAULT 'draft',
  post_type ENUM('post', 'page', 'portfolio', 'attachment') DEFAULT 'post',
  comment_status ENUM('open', 'closed') DEFAULT 'open',
  ping_status ENUM('open', 'closed') DEFAULT 'open',
  password VARCHAR(255) DEFAULT NULL,
  view_count BIGINT UNSIGNED DEFAULT 0,
  like_count INT UNSIGNED DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_sticky BOOLEAN DEFAULT FALSE,
  menu_order INT DEFAULT 0,
  published_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_slug (slug),
  INDEX idx_author_id (author_id),
  INDEX idx_status (status),
  INDEX idx_post_type (post_type),
  INDEX idx_published_at (published_at),
  INDEX idx_is_featured (is_featured),
  INDEX idx_is_sticky (is_sticky),
  FULLTEXT INDEX ft_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 文章分类关系表
-- ================================================================
CREATE TABLE post_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_category (post_id, category_id),
  INDEX idx_post_id (post_id),
  INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 文章标签关系表
-- ================================================================
CREATE TABLE post_tags (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT UNSIGNED NOT NULL,
  tag_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_tag (post_id, tag_id),
  INDEX idx_post_id (post_id),
  INDEX idx_tag_id (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 评论表
-- ================================================================
CREATE TABLE comments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT UNSIGNED NOT NULL,
  author_id BIGINT UNSIGNED DEFAULT NULL,
  parent_id BIGINT UNSIGNED DEFAULT NULL,
  author_name VARCHAR(100) DEFAULT NULL,
  author_email VARCHAR(100) DEFAULT NULL,
  author_url VARCHAR(255) DEFAULT NULL,
  author_ip VARCHAR(45) DEFAULT NULL,
  content TEXT NOT NULL,
  karma INT DEFAULT 0,
  approved ENUM('0', '1', 'spam', 'trash') DEFAULT '1',
  agent VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL DEFAULT NULL,
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_author_id (author_id),
  INDEX idx_parent_id (parent_id),
  INDEX idx_approved (approved),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 媒体表
-- ================================================================
CREATE TABLE media (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) DEFAULT NULL,
  filename VARCHAR(255) NOT NULL,
  url VARCHAR(512) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size BIGINT UNSIGNED NOT NULL,
  width INT UNSIGNED DEFAULT NULL,
  height INT UNSIGNED DEFAULT NULL,
  alt_text VARCHAR(255) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  caption TEXT DEFAULT NULL,
  uploader_id BIGINT UNSIGNED NOT NULL,
  post_id BIGINT UNSIGNED DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL,
  INDEX idx_post_id (post_id),
  INDEX idx_uploader_id (uploader_id),
  INDEX idx_mime_type (mime_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 选项表
-- ================================================================
CREATE TABLE options (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  option_name VARCHAR(191) NOT NULL UNIQUE,
  option_value LONGTEXT NOT NULL,
  autoload BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_option_name (option_name),
  INDEX idx_autoload (autoload)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 用户元数据表
-- ================================================================
CREATE TABLE user_meta (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  meta_key VARCHAR(255) NOT NULL,
  meta_value LONGTEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_meta (user_id, meta_key),
  INDEX idx_user_id (user_id),
  INDEX idx_meta_key (meta_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 文章元数据表
-- ================================================================
CREATE TABLE post_meta (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id BIGINT UNSIGNED NOT NULL,
  meta_key VARCHAR(255) NOT NULL,
  meta_value LONGTEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_post_meta (post_id, meta_key),
  INDEX idx_post_id (post_id),
  INDEX idx_meta_key (meta_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 链接表
-- ================================================================
CREATE TABLE links (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  target ENUM('_blank', '_self', '_top', '_parent') DEFAULT '_blank',
  visible BOOLEAN DEFAULT TRUE,
  rating INT DEFAULT 0,
  rel VARCHAR(255) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  owner_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_visible (visible),
  INDEX idx_owner_id (owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 术语表（通用分类系统）
-- ================================================================
CREATE TABLE terms (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL UNIQUE,
  term_group BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_term_group (term_group)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 术语分类表
-- ================================================================
CREATE TABLE term_taxonomy (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  term_id BIGINT UNSIGNED NOT NULL,
  taxonomy VARCHAR(32) NOT NULL,
  description LONGTEXT DEFAULT NULL,
  parent_id BIGINT UNSIGNED DEFAULT NULL,
  count BIGINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE,
  UNIQUE KEY unique_term_taxonomy (term_id, taxonomy),
  INDEX idx_taxonomy (taxonomy)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 术语关系表
-- ================================================================
CREATE TABLE term_relationships (
  object_id BIGINT UNSIGNED NOT NULL,
  term_taxonomy_id BIGINT UNSIGNED NOT NULL,
  term_order INT DEFAULT 0,
  PRIMARY KEY (object_id, term_taxonomy_id),
  
  FOREIGN KEY (term_taxonomy_id) REFERENCES term_taxonomy(id) ON DELETE CASCADE,
  INDEX idx_term_taxonomy_id (term_taxonomy_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================
-- 插入默认数据
-- ================================================================

-- 默认选项
INSERT INTO options (option_name, option_value) VALUES
('site_name', 'CyberPress Platform'),
('site_description', '赛博朋克风格的博客平台'),
('site_url', 'https://cyberpress.dev'),
('admin_email', 'admin@cyberpress.dev'),
('users_can_register', '1'),
('posts_per_page', '10'),
('date_format', 'Y-m-d'),
('time_format', 'H:i:s'),
('timezone', 'Asia/Shanghai'),
('comment_moderation', '1');

-- 默认管理员用户 (密码: admin123)
INSERT INTO users (username, email, password, display_name, role, status) VALUES
('admin', 'admin@cyberpress.dev', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin', 'active');

-- 默认分类
INSERT INTO categories (name, slug, description, color) VALUES
('技术', 'tech', '技术相关文章', '#00f0ff'),
('设计', 'design', '设计相关文章', '#9d00ff'),
('生活', 'life', '生活随笔', '#ff0080'),
('教程', 'tutorial', '教程和指南', '#00ff88');

-- 默认标签
INSERT INTO tags (name, slug, color) VALUES
('JavaScript', 'javascript', '#f7df1e'),
('TypeScript', 'typescript', '#3178c6'),
('React', 'react', '#61dafb'),
('Next.js', 'nextjs', '#000000'),
('CSS', 'css', '#264de4'),
('UI/UX', 'ui-ux', '#ff61f6');

-- ================================================================
-- 创建视图
-- ================================================================

-- 文章统计视图
CREATE OR REPLACE VIEW post_stats AS
SELECT 
  p.id,
  p.title,
  p.slug,
  p.status,
  p.view_count,
  p.like_count,
  COUNT(DISTINCT c.id) as comment_count,
  u.username as author_name,
  u.display_name as author_display_name,
  p.published_at,
  p.created_at
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN comments c ON p.id = c.post_id AND c.approved = '1'
WHERE p.deleted_at IS NULL
GROUP BY p.id;

-- 热门文章视图
CREATE OR REPLACE VIEW popular_posts AS
SELECT 
  p.id,
  p.title,
  p.slug,
  p.view_count,
  p.like_count,
  COUNT(DISTINCT c.id) as comment_count,
  (p.view_count + p.like_count * 2 + COUNT(DISTINCT c.id) * 3) as popularity_score
FROM posts p
LEFT JOIN comments c ON p.id = c.post_id AND c.approved = '1'
WHERE p.status = 'publish' AND p.deleted_at IS NULL
GROUP BY p.id
ORDER BY popularity_score DESC;

-- ================================================================
-- 创建存储过程
-- ================================================================

DELIMITER //

-- 更新文章分类计数
CREATE PROCEDURE update_category_counts()
BEGIN
  UPDATE categories c
  SET post_count = (
    SELECT COUNT(*)
    FROM post_categories pc
    JOIN posts p ON pc.post_id = p.id
    WHERE pc.category_id = c.id AND p.status = 'publish' AND p.deleted_at IS NULL
  );
END //

-- 更新标签计数
CREATE PROCEDURE update_tag_counts()
BEGIN
  UPDATE tags t
  SET post_count = (
    SELECT COUNT(*)
    FROM post_tags pt
    JOIN posts p ON pt.post_id = p.id
    WHERE pt.tag_id = t.id AND p.status = 'publish' AND p.deleted_at IS NULL
  );
END //

-- 增加文章浏览量
CREATE PROCEDURE increment_post_views(IN post_id_param BIGINT)
BEGIN
  UPDATE posts 
  SET view_count = view_count + 1
  WHERE id = post_id_param;
END //

DELIMITER ;

-- ================================================================
-- 创建触发器
-- ================================================================

DELIMITER //

-- 插入文章后更新分类计数
CREATE TRIGGER after_post_insert_update_categories
AFTER INSERT ON post_categories
FOR EACH ROW
BEGIN
  CALL update_category_counts();
END //

-- 删除文章后更新分类计数
CREATE TRIGGER after_post_delete_update_categories
AFTER DELETE ON post_categories
FOR EACH ROW
BEGIN
  CALL update_category_counts();
END //

-- 插入文章后更新标签计数
CREATE TRIGGER after_post_tag_insert_update_tags
AFTER INSERT ON post_tags
FOR EACH ROW
BEGIN
  CALL update_tag_counts();
END //

-- 删除文章后更新标签计数
CREATE TRIGGER after_post_tag_delete_update_tags
AFTER DELETE ON post_tags
FOR EACH ROW
BEGIN
  CALL update_tag_counts();
END //

DELIMITER ;
