-- ============================================================================
-- CyberPress Platform - PostgreSQL 数据库初始化脚本
-- ============================================================================
-- 功能：创建完整的数据库架构，包括所有表、索引、约束和触发器
-- 版本：1.0.0
-- 创建日期：2026-03-06
-- ============================================================================

-- 设置搜索路径
SET search_path TO public;

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 用于全文搜索
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- 用于复合索引
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- 用于查询性能分析

-- ============================================================================
-- 枚举类型定义
-- ============================================================================

-- 用户角色枚举
CREATE TYPE user_role AS ENUM ('admin', 'author', 'editor', 'subscriber');

-- 文章状态枚举
CREATE TYPE post_status AS ENUM ('draft', 'pending', 'publish', 'private', 'trash');

-- 文章类型枚举
CREATE TYPE post_type AS ENUM ('post', 'page', 'portfolio', 'attachment');

-- 评论状态枚举
CREATE TYPE comment_status AS ENUM ('approved', 'pending', 'spam', 'trash');

-- 订阅状态枚举
CREATE TYPE subscription_status AS ENUM ('active', 'unconfirmed', 'unsubscribed');

-- 通知类型枚举
CREATE TYPE notification_type AS ENUM ('comment', 'like', 'follow', 'system', 'mention');

-- 作品集状态枚举
CREATE TYPE portfolio_status AS ENUM ('completed', 'in-progress', 'planned', 'archived');

-- ============================================================================
-- 用户表 (users)
-- ============================================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    role user_role NOT NULL DEFAULT 'subscriber',
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 用户表索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- 用户表触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 分类表 (categories)
-- ============================================================================
CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    post_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 分类表索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- 分类表触发器
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 标签表 (tags)
-- ============================================================================
CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    post_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 标签表索引
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags(name);

-- 标签表触发器
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 文章表 (posts)
-- ============================================================================
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    content_html TEXT,
    featured_image VARCHAR(500),
    status post_status NOT NULL DEFAULT 'draft',
    post_type post_type NOT NULL DEFAULT 'post',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    allow_comments BOOLEAN NOT NULL DEFAULT TRUE,
    view_count INTEGER NOT NULL DEFAULT 0,
    like_count INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    meta JSONB DEFAULT '{}'::jsonb,
    published_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 文章表索引
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_is_featured ON posts(is_featured) WHERE is_featured = TRUE;

-- 全文搜索索引
CREATE INDEX idx_posts_content_search ON posts USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));

-- 文章表触发器
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 文章分类关联表 (post_categories)
-- ============================================================================
CREATE TABLE post_categories (
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, category_id)
);

-- 文章分类关联表索引
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);

-- ============================================================================
-- 文章标签关联表 (post_tags)
-- ============================================================================
CREATE TABLE post_tags (
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

-- 文章标签关联表索引
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- ============================================================================
-- 评论表 (comments)
-- ============================================================================
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    author_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100),
    author_email VARCHAR(255),
    author_ip INET,
    user_agent TEXT,
    content TEXT NOT NULL,
    status comment_status NOT NULL DEFAULT 'pending',
    like_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 评论表索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 评论表触发器
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 评论数量更新触发器
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
        UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
            UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
        ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
            UPDATE posts SET comment_count = comment_count - 1 WHERE id = NEW.post_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
        UPDATE posts SET comment_count = comment_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comment_count
    AFTER INSERT OR UPDATE OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- ============================================================================
-- 媒体表 (media)
-- ============================================================================
CREATE TABLE media (
    id BIGSERIAL PRIMARY KEY,
    uploader_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    url VARCHAR(500) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 媒体表索引
CREATE INDEX idx_media_uploader_id ON media(uploader_id);
CREATE INDEX idx_media_mime_type ON media(mime_type);
CREATE INDEX idx_media_created_at ON media(created_at DESC);

-- ============================================================================
-- 作品集表 (portfolios)
-- ============================================================================
CREATE TABLE portfolios (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image VARCHAR(500),
    status portfolio_status NOT NULL DEFAULT 'in-progress',
    technologies TEXT,
    links JSONB DEFAULT '{}'::jsonb,
    start_date DATE,
    end_date DATE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 作品集表索引
CREATE INDEX idx_portfolios_author_id ON portfolios(author_id);
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolios_status ON portfolios(status);
CREATE INDEX idx_portfolios_sort_order ON portfolios(sort_order);

-- 作品集表触发器
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 作品集标签关联表 (portfolio_tags)
-- ============================================================================
CREATE TABLE portfolio_tags (
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (portfolio_id, tag_id)
);

-- ============================================================================
-- 作品集媒体关联表 (portfolio_media)
-- ============================================================================
CREATE TABLE portfolio_media (
    portfolio_id BIGINT NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    media_id BIGINT NOT NULL REFERENCES media(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (portfolio_id, media_id)
);

-- ============================================================================
-- 订阅表 (subscribers)
-- ============================================================================
CREATE TABLE subscribers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    status subscription_status NOT NULL DEFAULT 'unconfirmed',
    confirmation_token VARCHAR(255),
    confirmed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 订阅表索引
CREATE INDEX idx_subscribers_email ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);

-- 订阅表触发器
CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 阅读历史表 (reading_history)
-- ============================================================================
CREATE TABLE reading_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    last_read_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 阅读历史表索引
CREATE INDEX idx_reading_history_user_id ON reading_history(user_id);
CREATE INDEX idx_reading_history_post_id ON reading_history(post_id);
CREATE INDEX idx_reading_history_last_read_at ON reading_history(last_read_at DESC);

-- 阅读历史表触发器
CREATE TRIGGER update_reading_history_updated_at BEFORE UPDATE ON reading_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 书签表 (bookmarks)
-- ============================================================================
CREATE TABLE bookmarks (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id)
);

-- 书签表索引
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);

-- ============================================================================
-- 点赞表 (likes)
-- ============================================================================
CREATE TABLE likes (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id)
);

-- 点赞表索引
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_created_at ON likes(created_at DESC);

-- 点赞数量更新触发器
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_like_count
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- ============================================================================
-- 关注表 (follows)
-- ============================================================================
CREATE TABLE follows (
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- 关注表索引
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_follows_created_at ON follows(created_at DESC);

-- ============================================================================
-- 通知表 (notifications)
-- ============================================================================
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 通知表索引
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- 未读通知索引（部分索引）
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC)
    WHERE is_read = FALSE;

-- ============================================================================
-- 搜索日志表 (search_logs)
-- ============================================================================
CREATE TABLE search_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    query VARCHAR(255) NOT NULL,
    results_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 搜索日志表索引
CREATE INDEX idx_search_logs_user_id ON search_logs(user_id);
CREATE INDEX idx_search_logs_query ON search_logs USING gin(to_tsvector('english', query));
CREATE INDEX idx_search_logs_created_at ON search_logs(created_at DESC);

-- ============================================================================
-- 分析数据表 (analytics)
-- ============================================================================
CREATE TABLE analytics (
    id BIGSERIAL PRIMARY KEY,
    date DATE NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    value BIGINT NOT NULL DEFAULT 0,
    dimensions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, metric_type, post_id, dimensions)
);

-- 分析数据表索引
CREATE INDEX idx_analytics_date ON analytics(date DESC);
CREATE INDEX idx_analytics_metric_type ON analytics(metric_type);
CREATE INDEX idx_analytics_post_id ON analytics(post_id);

-- ============================================================================
-- 初始化管理员用户
-- ============================================================================

-- 插入默认管理员用户
-- 密码: admin123 (需要在生产环境中修改)
INSERT INTO users (username, email, password_hash, display_name, role, is_verified) VALUES
('admin', 'admin@cyberpress.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzW5qJlJFu', 'Administrator', 'admin', TRUE);

-- ============================================================================
-- 初始化默认分类
-- ============================================================================

INSERT INTO categories (name, slug, description, sort_order) VALUES
('Technology', 'technology', 'Technology related posts', 1),
('Programming', 'programming', 'Programming tutorials and tips', 2),
('Design', 'design', 'Design articles and inspiration', 3),
('Cyberpunk', 'cyberpunk', 'Cyberpunk culture and aesthetics', 4);

-- ============================================================================
-- 初始化默认标签
-- ============================================================================

INSERT INTO tags (name, slug) VALUES
('JavaScript', 'javascript'),
('Python', 'python'),
('React', 'react'),
('Next.js', 'nextjs'),
('PostgreSQL', 'postgresql'),
('FastAPI', 'fastapi'),
('Cyberpunk', 'cyberpunk'),
('Neon', 'neon');

-- ============================================================================
-- 授予权限
-- ============================================================================

-- 创建只读用户（可选）
-- CREATE ROLE cyberpress_readonly WITH LOGIN PASSWORD 'readonly_password';
-- GRANT CONNECT ON DATABASE cyberpress TO cyberpress_readonly;
-- GRANT USAGE ON SCHEMA public TO cyberpress_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyberpress_readonly;

-- 创建应用用户
-- CREATE ROLE cyberpress_app WITH LOGIN PASSWORD 'app_password';
-- GRANT CONNECT ON DATABASE cyberpress TO cyberpress_app;
-- GRANT USAGE ON SCHEMA public TO cyberpress_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cyberpress_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cyberpress_app;

-- ============================================================================
-- 数据库初始化完成
-- ============================================================================

-- 输出初始化完成信息
DO $$
BEGIN
    RAISE NOTICE '===========================================';
    RAISE NOTICE 'CyberPress Platform 数据库初始化完成！';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '已创建表数: 17';
    RAISE NOTICE '已创建索引数: 50+';
    RAISE NOTICE '已创建触发器数: 10';
    RAISE NOTICE '默认管理员: admin / admin123';
    RAISE NOTICE '===========================================';
END $$;
