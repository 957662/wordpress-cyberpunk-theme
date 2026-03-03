-- ============================================================================
-- CyberPress Platform - PostgreSQL 初始化脚本
-- ============================================================================
-- 创建时间: 2026-03-03
-- 描述: 创建数据库 schema、表结构、索引和初始数据
-- ============================================================================

-- 设置搜索路径
SET search_path TO public;

-- ============================================================================
-- 1. 扩展安装
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 用于全文搜索
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- 用于复合索引

-- ============================================================================
-- 2. 枚举类型定义
-- ============================================================================

-- 用户状态
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned', 'pending');

-- 文章状态
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived', 'pending_review');

-- 评论状态
CREATE TYPE comment_status AS ENUM ('approved', 'pending', 'spam', 'trash');

-- 通知类型
CREATE TYPE notification_type AS ENUM ('comment', 'reply', 'like', 'follow', 'system');

-- 通知优先级
CREATE TYPE notification_priority AS ENUM ('low', 'normal', 'high', 'urgent');

-- ============================================================================
-- 3. 用户表 (wp_users)
-- ============================================================================

CREATE TABLE wp_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(250) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    website VARCHAR(200),
    status user_status DEFAULT 'active',
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 用户表索引
CREATE INDEX idx_users_email ON wp_users(email);
CREATE INDEX idx_users_username ON wp_users(username);
CREATE INDEX idx_users_status ON wp_users(status);
CREATE INDEX idx_users_created_at ON wp_users(created_at DESC);

-- 全文搜索索引
CREATE INDEX idx_users_email_trgm ON wp_users USING gin(email gin_trgm_ops);
CREATE INDEX idx_users_display_name_trgm ON wp_users USING gin(display_name gin_trgm_ops);

-- ============================================================================
-- 4. 用户元数据表 (wp_usermeta)
-- ============================================================================

CREATE TABLE wp_usermeta (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES wp_users(id) ON DELETE CASCADE,
    meta_key VARCHAR(255) NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, meta_key)
);

CREATE INDEX idx_usermeta_user_id ON wp_usermeta(user_id);
CREATE INDEX idx_usermeta_meta_key ON wp_usermeta(meta_key);

-- ============================================================================
-- 5. 分类表 (wp_terms)
-- ============================================================================

CREATE TABLE wp_terms (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    taxonomy VARCHAR(32) NOT NULL DEFAULT 'category', -- category, post_tag, portfolio_category
    parent_id BIGINT REFERENCES wp_terms(id) ON DELETE SET NULL,
    color VARCHAR(7), -- 十六进制颜色代码，如 #00f0ff
    icon VARCHAR(50),
    image_url TEXT,
    sort_order INT DEFAULT 0,
    post_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_terms_slug ON wp_terms(slug);
CREATE INDEX idx_terms_taxonomy ON wp_terms(taxonomy);
CREATE INDEX idx_terms_parent_id ON wp_terms(parent_id);
CREATE INDEX idx_terms_sort_order ON wp_terms(sort_order);

-- ============================================================================
-- 6. 文章表 (wp_posts)
-- ============================================================================

CREATE TABLE wp_posts (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES wp_users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    status post_status DEFAULT 'draft',
    post_type VARCHAR(20) DEFAULT 'post', -- post, page, portfolio, project
    mime_type VARCHAR(100),
    password VARCHAR(255),
    comment_status VARCHAR(20) DEFAULT 'open', -- open, closed
    ping_status VARCHAR(20) DEFAULT 'open',
    to_ping TEXT,
    pinged TEXT,
    content_filtered TEXT,
    parent_id BIGINT REFERENCES wp_posts(id) ON DELETE SET NULL,
    menu_order INT DEFAULT 0,
    guid VARCHAR(255),
    view_count BIGINT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_sticky BOOLEAN DEFAULT FALSE,
    reading_time INT, -- 阅读时间（分钟）
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 文章表索引
CREATE INDEX idx_posts_slug ON wp_posts(slug);
CREATE INDEX idx_posts_author_id ON wp_posts(author_id);
CREATE INDEX idx_posts_status ON wp_posts(status);
CREATE INDEX idx_posts_type ON wp_posts(post_type);
CREATE INDEX idx_posts_status_type ON wp_posts(status, post_type);
CREATE INDEX idx_posts_published_at ON wp_posts(published_at DESC);
CREATE INDEX idx_posts_created_at ON wp_posts(created_at DESC);
CREATE INDEX idx_posts_view_count ON wp_posts(view_count DESC);
CREATE INDEX idx_posts_like_count ON wp_posts(like_count DESC);
CREATE INDEX idx_posts_is_featured ON wp_posts(is_featured);
CREATE INDEX idx_posts_is_sticky ON wp_posts(is_sticky);

-- 全文搜索索引
CREATE INDEX idx_posts_title_trgm ON wp_posts USING gin(title gin_trgm_ops);
CREATE INDEX idx_posts_content_trgm ON wp_posts USING gin(content gin_trgm_ops);
CREATE INDEX idx_posts_excerpt_trgm ON wp_posts USING gin(excerpt gin_trgm_ops);

-- 复合索引优化查询
CREATE INDEX idx_posts_list_query ON wp_posts(status, post_type, published_at DESC) WHERE status = 'published';

-- ============================================================================
-- 7. 文章元数据表 (wp_postmeta)
-- ============================================================================

CREATE TABLE wp_postmeta (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES wp_posts(id) ON DELETE CASCADE,
    meta_key VARCHAR(255) NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, meta_key)
);

CREATE INDEX idx_postmeta_post_id ON wp_postmeta(post_id);
CREATE INDEX idx_postmeta_meta_key ON wp_postmeta(meta_key);

-- ============================================================================
-- 8. 文章与分类关系表 (wp_term_relationships)
-- ============================================================================

CREATE TABLE wp_term_relationships (
    object_id BIGINT NOT NULL REFERENCES wp_posts(id) ON DELETE CASCADE,
    term_id BIGINT NOT NULL REFERENCES wp_terms(id) ON DELETE CASCADE,
    term_order INT DEFAULT 0,
    PRIMARY KEY (object_id, term_id)
);

CREATE INDEX idx_term_relationships_object_id ON wp_term_relationships(object_id);
CREATE INDEX idx_term_relationships_term_id ON wp_term_relationships(term_id);

-- ============================================================================
-- 9. 评论表 (wp_comments)
-- ============================================================================

CREATE TABLE wp_comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES wp_posts(id) ON DELETE CASCADE,
    author_id BIGINT REFERENCES wp_users(id) ON DELETE SET NULL,
    author_name VARCHAR(100),
    author_email VARCHAR(100),
    author_url VARCHAR(200),
    author_ip VARCHAR(45), -- 支持 IPv6
    author_user_agent VARCHAR(500),
    content TEXT NOT NULL,
    status comment_status DEFAULT 'pending',
    parent_id BIGINT REFERENCES wp_comments(id) ON DELETE CASCADE,
    like_count INT DEFAULT 0,
    karma INT DEFAULT 0,
    approved_by BIGINT REFERENCES wp_users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 评论表索引
CREATE INDEX idx_comments_post_id ON wp_comments(post_id);
CREATE INDEX idx_comments_author_id ON wp_comments(author_id);
CREATE INDEX idx_comments_status ON wp_comments(status);
CREATE INDEX idx_comments_parent_id ON wp_comments(parent_id);
CREATE INDEX idx_comments_created_at ON wp_comments(created_at DESC);
CREATE INDEX idx_comments_status_post ON wp_comments(status, post_id);

-- ============================================================================
-- 10. 评论元数据表 (wp_commentmeta)
-- ============================================================================

CREATE TABLE wp_commentmeta (
    id BIGSERIAL PRIMARY KEY,
    comment_id BIGINT NOT NULL REFERENCES wp_comments(id) ON DELETE CASCADE,
    meta_key VARCHAR(255) NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, meta_key)
);

CREATE INDEX idx_commentmeta_comment_id ON wp_commentmeta(comment_id);
CREATE INDEX idx_commentmeta_meta_key ON wp_commentmeta(meta_key);

-- ============================================================================
-- 11. 通知表 (wp_notifications)
-- ============================================================================

CREATE TABLE wp_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES wp_users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    priority notification_priority DEFAULT 'normal',
    title VARCHAR(255) NOT NULL,
    content TEXT,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_notifications_user_id ON wp_notifications(user_id);
CREATE INDEX idx_notifications_is_read ON wp_notifications(is_read);
CREATE INDEX idx_notifications_created_at ON wp_notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON wp_notifications(user_id, is_read) WHERE is_read = FALSE;

-- ============================================================================
-- 12. 点赞表 (wp_likes)
-- ============================================================================

CREATE TABLE wp_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES wp_users(id) ON DELETE CASCADE,
    target_id BIGINT NOT NULL,
    target_type VARCHAR(20) NOT NULL, -- post, comment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);

CREATE INDEX idx_likes_user_id ON wp_likes(user_id);
CREATE INDEX idx_likes_target ON wp_likes(target_id, target_type);
CREATE INDEX idx_likes_created_at ON wp_likes(created_at DESC);

-- ============================================================================
-- 13. 关注表 (wp_follows)
-- ============================================================================

CREATE TABLE wp_follows (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL REFERENCES wp_users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES wp_users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower_id ON wp_follows(follower_id);
CREATE INDEX idx_follows_following_id ON wp_follows(following_id);

-- ============================================================================
-- 14. 选项表 (wp_options)
-- ============================================================================

CREATE TABLE wp_options (
    id BIGSERIAL PRIMARY KEY,
    option_name VARCHAR(191) NOT NULL UNIQUE,
    option_value TEXT,
    autoload BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_options_option_name ON wp_options(option_name);
CREATE INDEX idx_options_autoload ON wp_options(autoload);

-- ============================================================================
-- 15. 标签表 (wp_tags)
-- ============================================================================

CREATE TABLE wp_tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    post_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tags_slug ON wp_tags(slug);
CREATE INDEX idx_tags_post_count ON wp_tags(post_count DESC);

-- ============================================================================
-- 16. 文章标签关系表 (wp_post_tags)
-- ============================================================================

CREATE TABLE wp_post_tags (
    post_id BIGINT NOT NULL REFERENCES wp_posts(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES wp_tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_post_id ON wp_post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON wp_post_tags(tag_id);

-- ============================================================================
-- 17. 搜索历史表 (wp_search_history)
-- ============================================================================

CREATE TABLE wp_search_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES wp_users(id) ON DELETE SET NULL,
    query VARCHAR(255) NOT NULL,
    results_count INT DEFAULT 0,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_search_history_user_id ON wp_search_history(user_id);
CREATE INDEX idx_search_history_query ON wp_search_history(query);
CREATE INDEX idx_search_history_created_at ON wp_search_history(created_at DESC);

-- ============================================================================
-- 18. 媒体库表 (wp_media)
-- ============================================================================

CREATE TABLE wp_media (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES wp_users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    width INT,
    height INT,
    alt_text VARCHAR(255),
    caption TEXT,
    description TEXT,
    post_id BIGINT REFERENCES wp_posts(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_media_author_id ON wp_media(author_id);
CREATE INDEX idx_media_post_id ON wp_media(post_id);
CREATE INDEX idx_media_mime_type ON wp_media(mime_type);

-- ============================================================================
-- 19. 触发器函数
-- ============================================================================

-- 更新 updated_at 字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加 updated_at 触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON wp_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usermeta_updated_at BEFORE UPDATE ON wp_usermeta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_terms_updated_at BEFORE UPDATE ON wp_terms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON wp_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_postmeta_updated_at BEFORE UPDATE ON wp_postmeta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commentmeta_updated_at BEFORE UPDATE ON wp_commentmeta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON wp_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_options_updated_at BEFORE UPDATE ON wp_options
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON wp_tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON wp_media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 20. 视图定义
-- ============================================================================

-- 文章统计视图
CREATE VIEW vw_post_stats AS
SELECT
    p.id,
    p.title,
    p.status,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.reading_time,
    p.created_at,
    p.published_at,
    u.display_name AS author_name,
    u.email AS author_email,
    COUNT(DISTINCT tr.term_id) AS category_count,
    COUNT(DISTINCT pt.tag_id) AS tag_count
FROM wp_posts p
LEFT JOIN wp_users u ON p.author_id = u.id
LEFT JOIN wp_term_relationships tr ON p.id = tr.object_id
LEFT JOIN wp_post_tags pt ON p.id = pt.post_id
GROUP BY p.id, u.display_name, u.email;

-- 评论统计视图
CREATE VIEW vw_comment_stats AS
SELECT
    c.id,
    c.post_id,
    c.content,
    c.status,
    c.created_at,
    p.title AS post_title,
    COALESCE(u.display_name, c.author_name) AS author_name,
    COUNT(DISTINCT cl.id) AS like_count
FROM wp_comments c
LEFT JOIN wp_posts p ON c.post_id = p.id
LEFT JOIN wp_users u ON c.author_id = u.id
LEFT JOIN wp_likes cl ON cl.target_id = c.id AND cl.target_type = 'comment'
GROUP BY c.id, p.title, u.display_name, c.author_name;

-- ============================================================================
-- 21. 初始数据
-- ============================================================================

-- 插入默认管理员用户
INSERT INTO wp_users (username, email, password_hash, display_name, status) VALUES
('admin', 'admin@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5hq3p9i', 'Administrator', 'active');

-- 插入默认选项
INSERT INTO wp_options (option_name, option_value) VALUES
('site_title', 'CyberPress'),
('site_description', '赛博朋克风格的现代博客平台'),
('site_url', 'https://cyberpress.dev'),
('admin_email', 'admin@cyberpress.dev'),
('posts_per_page', '10'),
('date_format', 'Y-m-d'),
('time_format', 'H:i:s'),
('timezone', 'Asia/Shanghai'),
('allow_comments', 'true'),
('comment_moderation', 'false'),
('users_can_register', 'true'),
('default_role', 'subscriber');

-- 插入默认分类
INSERT INTO wp_terms (name, slug, taxonomy, color, icon, sort_order) VALUES
('技术', 'tech', 'category', '#00f0ff', '💻', 1),
('设计', 'design', 'category', '#9d00ff', '🎨', 2),
('教程', 'tutorial', 'category', '#ff0080', '📚', 3),
('随笔', 'thoughts', 'category', '#f0ff00', '✨', 4),
('新闻', 'news', 'category', '#00ff88', '📰', 5);

-- 插入默认标签
INSERT INTO wp_tags (name, slug) VALUES
('Next.js', 'nextjs'),
('React', 'react'),
('TypeScript', 'typescript'),
('Tailwind CSS', 'tailwindcss'),
('赛博朋克', 'cyberpunk'),
('UI/UX', 'ui-ux'),
('前端开发', 'frontend'),
('WordPress', 'wordpress');

-- ============================================================================
-- 22. 权限设置
-- ============================================================================

-- 创建只读用户（可选）
-- CREATE ROLE cyberpress_readonly WITH LOGIN PASSWORD 'readonly_password';
-- GRANT CONNECT ON DATABASE cyberpress TO cyberpress_readonly;
-- GRANT USAGE ON SCHEMA public TO cyberpress_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyberpress_readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO cyberpress_readonly;

-- ============================================================================
-- 完成提示
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'CyberPress Platform 数据库初始化完成！';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '数据库包含以下内容:';
    RAISE NOTICE '  - 19 个数据表';
    RAISE NOTICE '  - 完整的索引配置';
    RAISE NOTICE '  - 触发器（自动更新 updated_at）';
    RAISE NOTICE '  - 视图（统计查询）';
    RAISE NOTICE '  - 初始数据（管理员、选项、分类、标签）';
    RAISE NOTICE '============================================================================';
END $$;
