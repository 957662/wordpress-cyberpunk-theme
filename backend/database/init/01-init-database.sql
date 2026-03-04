-- ============================================================================
-- CyberPress Platform - Database Initialization Script
-- PostgreSQL Database Schema v1.0
-- ============================================================================
-- 说明: 完整的数据库初始化脚本（创建所有表、索引、触发器）
-- 作者: CyberPress Team
-- 创建日期: 2026-03-05
-- 用法: psql -U postgres -d cyberpress_platform -f 01-init-database.sql
-- ============================================================================

-- 设置客户端编码
SET client_encoding = 'UTF8';

-- 设置搜索路径
SET search_path TO public, pg_catalog;

-- ============================================================================
-- 1. 创建扩展
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 用于全文搜索和模糊匹配
CREATE EXTENSION IF NOT EXISTS "btree_gin";  -- 用于复合索引
CREATE EXTENSION IF NOT EXISTS "btree_gist";  -- 用于范围查询

-- ============================================================================
-- 2. 创建触发器函数
-- ============================================================================

-- 自动更新 updated_at 字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 更新评论数的触发器函数
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 更新分类文章数的触发器函数
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories SET post_count = GREATEST(post_count - 1, 0) WHERE id = OLD.category_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 更新标签文章数的触发器函数
CREATE OR REPLACE FUNCTION update_tag_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET post_count = post_count + 1 WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET post_count = GREATEST(post_count - 1, 0) WHERE id = OLD.tag_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. 创建核心表（按依赖顺序）
-- ============================================================================

-- 注意：这里只创建表结构，详细定义在 schema 文件中
-- 这个脚本用于一次性初始化整个数据库

-- ============================================================================
-- 4. 创建用户系统表
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'subscriber',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT check_role CHECK (role IN ('admin', 'editor', 'author', 'subscriber', 'guest')),
    CONSTRAINT check_status CHECK (status IN ('active', 'inactive', 'suspended', 'banned'))
);

CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    display_name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(20),
    birth_date DATE,
    website VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(50),
    social_links JSONB DEFAULT '{}',
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_profile FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'zh-CN',
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    notification_email_frequency VARCHAR(50) DEFAULT 'daily',
    profile_visibility VARCHAR(50) DEFAULT 'public',
    show_email BOOLEAN DEFAULT false,
    show_birth_date BOOLEAN DEFAULT false,
    allow_messages_from VARCHAR(50) DEFAULT 'everyone',
    content_language VARCHAR(10) DEFAULT 'all',
    content_categories JSONB DEFAULT '[]',
    custom_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_settings FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- 5. 创建内容管理表
-- ============================================================================

CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20),
    meta_title VARCHAR(500),
    meta_description TEXT,
    icon VARCHAR(100),
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,
    post_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20),
    icon VARCHAR(100),
    post_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    post_type VARCHAR(50) NOT NULL DEFAULT 'post',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    password VARCHAR(255),
    featured BOOLEAN DEFAULT false,
    featured_order INT DEFAULT 0,
    meta_title VARCHAR(500),
    meta_description TEXT,
    meta_keywords VARCHAR(500),
    comment_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    reading_time INT,
    difficulty_level VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_post_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT check_post_type CHECK (post_type IN ('post', 'page', 'portfolio', 'project')),
    CONSTRAINT check_post_status CHECK (status IN ('draft', 'publish', 'pending', 'private', 'trash'))
);

CREATE TABLE IF NOT EXISTS post_meta (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    meta_key VARCHAR(255) NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_post_meta FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_categories (
    post_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, category_id),
    CONSTRAINT fk_pc_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_pc_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS post_tags (
    post_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_pt_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_pt_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ============================================================================
-- 6. 创建媒体表
-- ============================================================================

CREATE TABLE IF NOT EXISTS media (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,
    title VARCHAR(500),
    filename VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(50),
    width INT,
    height INT,
    duration INT,
    alt_text VARCHAR(500),
    caption TEXT,
    description TEXT,
    thumbnail_url VARCHAR(1000),
    medium_url VARCHAR(1000),
    large_url VARCHAR(1000),
    meta_title VARCHAR(500),
    meta_description TEXT,
    post_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_media_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- 7. 创建评论表
-- ============================================================================

CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    author_id BIGINT,
    parent_id BIGINT,
    content TEXT NOT NULL,
    author_name VARCHAR(255),
    author_email VARCHAR(255),
    author_url VARCHAR(255),
    author_ip INET,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    type VARCHAR(50) DEFAULT 'comment',
    like_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_comment_parent FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT check_comment_status CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
    CONSTRAINT check_comment_type CHECK (type IN ('comment', 'pingback', 'trackback'))
);

CREATE TABLE IF NOT EXISTS comment_likes (
    id BIGSERIAL PRIMARY KEY,
    comment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(comment_id, user_id),
    CONSTRAINT fk_comment_like_comment FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_like_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- 8. 创建基本索引
-- ============================================================================

-- 用户索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);

-- 文章索引
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_featured ON posts(featured, status, published_at DESC);

-- 分类和标签索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_tags_slug ON tags(slug);

-- 评论索引
CREATE INDEX idx_comments_post_id ON comments(post_id, created_at DESC);
CREATE INDEX idx_comments_status ON comments(status);

-- ============================================================================
-- 9. 创建触发器
-- ============================================================================

-- 自动更新 updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_post_meta_updated_at
    BEFORE UPDATE ON post_meta
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 评论数自动更新
CREATE TRIGGER trigger_comments_count
    AFTER INSERT OR DELETE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_post_comment_count();

-- 分类文章数自动更新
CREATE TRIGGER trigger_category_post_count
    AFTER INSERT OR DELETE ON post_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_category_post_count();

-- 标签文章数自动更新
CREATE TRIGGER trigger_tag_post_count
    AFTER INSERT OR DELETE ON post_tags
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_post_count();

-- ============================================================================
-- 10. 创建全文搜索索引
-- ============================================================================

-- 文章全文搜索
CREATE INDEX idx_posts_fulltext ON posts USING gin(to_tsvector('english', title || ' ' || content));

-- 用户全文搜索
CREATE INDEX idx_users_fulltext ON users USING gin(to_tsvector('english', username || ' ' || email));

-- 标签全文搜索
CREATE INDEX idx_tags_fulltext ON tags USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============================================================================
-- 11. 插入初始数据
-- ============================================================================

-- 创建默认管理员用户（密码: admin123，生产环境必须修改！）
INSERT INTO users (email, username, password_hash, role, status)
VALUES (
    'admin@cyberpress.com',
    'admin',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc8i',  -- admin123
    'admin',
    'active'
) ON CONFLICT (email) DO NOTHING;

-- 为管理员创建资料
INSERT INTO user_profiles (user_id, display_name, bio)
SELECT id, 'Administrator', 'System Administrator'
FROM users
WHERE username = 'admin'
ON CONFLICT (user_id) DO NOTHING;

-- 创建默认分类
INSERT INTO categories (name, slug, description, display_order)
VALUES
    ('Technology', 'technology', 'Technology related articles', 1),
    ('Design', 'design', 'Design and creativity articles', 2),
    ('Business', 'business', 'Business and entrepreneurship', 3),
    ('Lifestyle', 'lifestyle', 'Lifestyle and personal development', 4)
ON CONFLICT (slug) DO NOTHING;

-- 创建默认标签
INSERT INTO tags (name, slug, description)
VALUES
    ('Programming', 'programming', 'Programming and coding'),
    ('Web Development', 'web-development', 'Web development articles'),
    ('UI/UX', 'ui-ux', 'User interface and experience design'),
    ('Productivity', 'productivity', 'Productivity tips and tricks')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 12. 创建视图（用于统计）
-- ============================================================================

-- 用户统计视图
CREATE OR REPLACE VIEW user_stats_view AS
SELECT
    u.id,
    u.username,
    u.email,
    u.role,
    u.status,
    u.created_at,
    up.display_name,
    up.followers_count,
    up.following_count,
    up.posts_count,
    COUNT(DISTINCT p.id) AS total_posts,
    COUNT(DISTINCT c.id) AS total_comments
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN posts p ON u.id = p.author_id AND p.deleted_at IS NULL
LEFT JOIN comments c ON u.id = c.author_id AND c.deleted_at IS NULL
GROUP BY u.id, u.username, u.email, u.role, u.status, u.created_at, up.display_name, up.followers_count, up.following_count, up.posts_count;

-- 文章统计视图
CREATE OR REPLACE VIEW post_stats_view AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.status,
    p.post_type,
    p.author_id,
    u.username AS author_username,
    p.created_at,
    p.published_at,
    p.view_count,
    p.like_count,
    p.comment_count,
    COUNT(DISTINCT pc.category_id) AS category_count,
    COUNT(DISTINCT pt.tag_id) AS tag_count
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN post_tags pt ON p.id = pt.post_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, p.title, p.slug, p.status, p.post_type, p.author_id, u.username, p.created_at, p.published_at, p.view_count, p.like_count, p.comment_count;

-- ============================================================================
-- 13. 创建维护函数
-- ============================================================================

-- 清理软删除数据（超过30天）
CREATE OR REPLACE FUNCTION cleanup_deleted_data()
RETURNS INT AS $$
DECLARE
    deleted_count INT;
BEGIN
    -- 删除超过30天的软删除文章
    DELETE FROM posts
    WHERE deleted_at < CURRENT_DATE - INTERVAL '30 days';

    GET DIAGNOSTICS deleted_count = ROW_COUNT;

    -- 删除超过30天的软删除评论
    DELETE FROM comments
    WHERE deleted_at < CURRENT_DATE - INTERVAL '30 days';

    -- 删除超过30天的软删除媒体
    DELETE FROM media
    WHERE deleted_at < CURRENT_DATE - INTERVAL '30 days';

    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 优化表（VACUUM ANALYZE）
CREATE OR REPLACE FUNCTION optimize_tables()
RETURNS VOID AS $$
BEGIN
    -- 分析所有表
    ANALYZE users;
    ANALYZE posts;
    ANALYZE comments;
    ANALYZE categories;
    ANALYZE tags;
    ANALYZE media;
    ANALYZE user_profiles;
    ANALYZE user_settings;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 14. 设置数据库参数
-- ============================================================================

-- 设置默认搜索路径
ALTER DATABASE cyberpress_platform SET search_path TO public, pg_catalog;

-- 设置时区
ALTER DATABASE cyberpress_platform SET timezone TO 'Asia/Shanghai';

-- ============================================================================
-- 15. 授予权限（如果需要）
-- ============================================================================

-- 创建应用用户（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_user WHERE usename = 'cyberpress_app') THEN
        CREATE ROLE cyberpress_app WITH LOGIN PASSWORD 'change_me_in_production';
    END IF;
END
$$;

-- 授予应用用户必要的权限
GRANT CONNECT ON DATABASE cyberpress_platform TO cyberpress_app;
GRANT USAGE ON SCHEMA public TO cyberpress_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cyberpress_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cyberpress_app;

-- 确保未来创建的表也有这些权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO cyberpress_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO cyberpress_app;

-- ============================================================================
-- 完成
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE '数据库初始化完成！';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '默认管理员账户：';
    RAISE NOTICE '  Email: admin@cyberpress.com';
    RAISE NOTICE '  Password: admin123';
    RAISE NOTICE '  警告：生产环境必须修改默认密码！';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '下一步：';
    RAISE NOTICE '  1. 修改默认管理员密码';
    RAISE NOTICE '  2. 运行 02-social-schema.sql 创建社交功能表';
    RAISE NOTICE '  3. 运行 03-analytics-schema.sql 创建分析功能表';
    RAISE NOTICE '  4. 运行 04-auth-schema.sql 创建认证授权表';
    RAISE NOTICE '  5. 运行 performance-indexes.sql 创建性能索引';
    RAISE NOTICE '==========================================';
END $$;
