-- =====================================================
-- CyberPress Platform - Complete PostgreSQL Database Schema
-- 赛博朋克风格博客平台 - 完整数据库架构
-- =====================================================
-- Author: AI Database Architect
-- Created: 2026-03-07
-- Version: 1.0.0
-- Database: PostgreSQL 15+
-- =====================================================

-- =====================================================
-- 1. 启用扩展
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 2. 枚举类型定义
-- =====================================================

-- 用户角色
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'author', 'subscriber');

-- 用户状态
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'banned', 'pending');

-- 文章状态
CREATE TYPE post_status AS ENUM ('draft', 'published', 'private', 'trash', 'scheduled');

-- 文章类型
CREATE TYPE post_type AS ENUM ('post', 'portfolio', 'page');

-- 评论状态
CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'spam', 'trash');

-- 媒体类型
CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'document', 'other');

-- 通知类型
CREATE TYPE notification_type AS ENUM (
    'comment', 'like', 'follow', 'mention',
    'reply', 'system', 'welcome'
);

-- 审计动作
CREATE TYPE audit_action AS ENUM (
    'create', 'update', 'delete', 'login',
    'logout', 'view', 'export', 'import'
);

-- =====================================================
-- 3. 核心表
-- =====================================================

-- 3.1 用户表
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100),
    bio             TEXT,
    avatar_url      VARCHAR(500),
    website_url     VARCHAR(500),
    location        VARCHAR(100),
    birth_date      DATE,
    role            user_role DEFAULT 'author',
    status          user_status DEFAULT 'active',
    email_verified_at TIMESTAMP,
    last_login_at   TIMESTAMP,
    login_count     INTEGER DEFAULT 0,
    metadata        JSONB DEFAULT '{}'::jsonb,
    preferences     JSONB DEFAULT '{"theme":"dark","language":"zh-CN","email_notifications":true}'::jsonb,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.2 分类表
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
    icon        VARCHAR(50),
    color       VARCHAR(7),
    cover_image VARCHAR(500),
    sort_order  INTEGER DEFAULT 0,
    post_count  INTEGER DEFAULT 0,
    metadata    JSONB DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.3 标签表
CREATE TABLE tags (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(50) NOT NULL,
    slug        VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color       VARCHAR(7),
    icon        VARCHAR(50),
    usage_count INTEGER DEFAULT 0,
    metadata    JSONB DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.4 文章表
CREATE TABLE posts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    excerpt             TEXT,
    content             TEXT NOT NULL,
    content_html        TEXT,
    featured_image_url  VARCHAR(500),
    status              post_status DEFAULT 'draft',
    post_type           post_type DEFAULT 'post',
    comment_status      VARCHAR(20) DEFAULT 'open' CHECK (comment_status IN ('open', 'closed')),
    ping_status         VARCHAR(20) DEFAULT 'open',
    password            VARCHAR(255),
    view_count          INTEGER DEFAULT 0,
    like_count          INTEGER DEFAULT 0,
    comment_count       INTEGER DEFAULT 0,
    is_featured         BOOLEAN DEFAULT FALSE,
    is_sticky           BOOLEAN DEFAULT FALSE,
    is_sponsored        BOOLEAN DEFAULT FALSE,
    reading_time        INTEGER DEFAULT 0, -- 预估阅读时间（分钟）
    published_at        TIMESTAMP,
    scheduled_at        TIMESTAMP,
    metadata            JSONB DEFAULT '{}'::jsonb,
    seo_data            JSONB DEFAULT '{"title":"","description":"","keywords":[]}'::jsonb,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.5 分类关系表
CREATE TABLE post_categories (
    post_id       UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    category_id   UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    is_primary    BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, category_id)
);

-- 3.6 标签关系表
CREATE TABLE post_tags (
    post_id       UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id        UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

-- 3.7 评论表
CREATE TABLE comments (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id       UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    parent_id     UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_name   VARCHAR(100),
    author_email  VARCHAR(255),
    author_url    VARCHAR(500),
    author_ip     VARCHAR(45),
    content       TEXT NOT NULL,
    content_html  TEXT,
    status        comment_status DEFAULT 'pending',
    agent         VARCHAR(255),
    like_count    INTEGER DEFAULT 0,
    metadata      JSONB DEFAULT '{}'::jsonb,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.8 媒体库表
CREATE TABLE media (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uploader_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name       VARCHAR(255) NOT NULL,
    file_path       VARCHAR(500) NOT NULL,
    file_url        VARCHAR(500) NOT NULL,
    file_size       BIGINT,
    mime_type       VARCHAR(100),
    file_type       media_type DEFAULT 'other',
    width           INTEGER,
    height          INTEGER,
    duration        INTEGER, -- 视频时长（秒）
    alt_text        VARCHAR(255),
    caption         TEXT,
    description     TEXT,
    thumbnail_url   VARCHAR(500),
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.9 作品集表
CREATE TABLE portfolios (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    description         TEXT,
    content             TEXT NOT NULL,
    content_html        TEXT,
    project_url         VARCHAR(500),
    github_url          VARCHAR(500),
    demo_url            VARCHAR(500),
    featured_image_url  VARCHAR(500),
    gallery             JSONB DEFAULT '[]'::jsonb,
    technologies        JSONB DEFAULT '[]'::jsonb,
    start_date          DATE,
    end_date            DATE,
    status              post_status DEFAULT 'draft',
    sort_order          INTEGER DEFAULT 0,
    is_featured         BOOLEAN DEFAULT FALSE,
    view_count          INTEGER DEFAULT 0,
    like_count          INTEGER DEFAULT 0,
    metadata            JSONB DEFAULT '{}'::jsonb,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3.10 页面表
CREATE TABLE pages (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    content             TEXT NOT NULL,
    content_html        TEXT,
    featured_image_url  VARCHAR(500),
    template            VARCHAR(50) DEFAULT 'default',
    status              post_status DEFAULT 'draft',
    parent_id           UUID REFERENCES pages(id) ON DELETE SET NULL,
    sort_order          INTEGER DEFAULT 0,
    view_count          INTEGER DEFAULT 0,
    metadata            JSONB DEFAULT '{}'::jsonb,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. 社交功能表
-- =====================================================

-- 4.1 点赞表
CREATE TABLE likes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment', 'portfolio')),
    target_id   UUID NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_type, target_id)
);

-- 4.2 收藏表
CREATE TABLE bookmarks (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    folder      VARCHAR(50) DEFAULT 'default',
    notes       TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 4.3 关注表
CREATE TABLE follows (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- 4.4 通知表
CREATE TABLE notifications (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        notification_type NOT NULL,
    title       VARCHAR(255) NOT NULL,
    content     TEXT,
    link_url    VARCHAR(500),
    is_read     BOOLEAN DEFAULT FALSE,
    metadata    JSONB DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4.5 阅读进度表
CREATE TABLE reading_progress (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id          UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    is_read          BOOLEAN DEFAULT FALSE,
    is_favorite      BOOLEAN DEFAULT FALSE,
    notes            TEXT,
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
    last_position    INTEGER DEFAULT 0, -- 最后阅读位置（段落ID或字数）
    read_time        INTEGER DEFAULT 0, -- 阅读时长（秒）
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- =====================================================
-- 5. 系统功能表
-- =====================================================

-- 5.1 视图统计表
CREATE TABLE analytics (
    id              BIGSERIAL PRIMARY KEY,
    post_id         UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id      VARCHAR(255),
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(255),
    referrer        VARCHAR(500),
    page_url        VARCHAR(500),
    duration_seconds INTEGER,
    event_type      VARCHAR(50) DEFAULT 'view', -- view, click, scroll, etc.
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.2 搜索日志表
CREATE TABLE search_logs (
    id            BIGSERIAL PRIMARY KEY,
    query         TEXT NOT NULL,
    results_count INTEGER DEFAULT 0,
    clicked_ids   JSONB DEFAULT '[]'::jsonb,
    user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
    ip_address    VARCHAR(45),
    user_agent    VARCHAR(255),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.3 审计日志表
CREATE TABLE audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      audit_action NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   UUID NOT NULL,
    old_values  JSONB,
    new_values  JSONB,
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(255),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.4 系统设置表
CREATE TABLE settings (
    id          BIGSERIAL PRIMARY KEY,
    key         VARCHAR(100) UNIQUE NOT NULL,
    value       TEXT,
    value_type  VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    category    VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_public   BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5.5 迁移历史表
CREATE TABLE schema_migrations (
    id          BIGSERIAL PRIMARY KEY,
    version     VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    applied_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 6. 索引创建
-- =====================================================

-- 6.1 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- 6.2 文章表索引
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_post_type ON posts(post_type);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_is_featured ON posts(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_posts_is_sticky ON posts(is_sticky) WHERE is_sticky = TRUE;
CREATE INDEX idx_posts_view_count ON posts(view_count DESC);
CREATE INDEX idx_posts_like_count ON posts(like_count DESC);
CREATE INDEX idx_posts_comment_count ON posts(comment_count DESC);

-- 6.3 全文搜索索引
CREATE INDEX idx_posts_title_gin ON posts USING gin(to_tsvector('english', title));
CREATE INDEX idx_posts_content_gin ON posts USING gin(to_tsvector('english', content));
CREATE INDEX idx_posts_excerpt_gin ON posts USING gin(to_tsvector('english', excerpt));

-- 6.4 JSONB 索引
CREATE INDEX idx_posts_metadata_gin ON posts USING gin(metadata);
CREATE INDEX idx_posts_seo_gin ON posts USING gin(seo_data);
CREATE INDEX idx_users_preferences_gin ON users USING gin(preferences);
CREATE INDEX idx_users_metadata_gin ON users USING gin(metadata);

-- 6.5 评论表索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 6.6 分类和标签索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);

-- 6.7 媒体表索引
CREATE INDEX idx_media_uploader_id ON media(uploader_id);
CREATE INDEX idx_media_file_type ON media(file_type);
CREATE INDEX idx_media_mime_type ON media(mime_type);
CREATE INDEX idx_media_created_at ON media(created_at DESC);

-- 6.8 社交功能索引
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_post_id ON reading_progress(post_id);
CREATE INDEX idx_reading_progress_is_favorite ON reading_progress(is_favorite) WHERE is_favorite = TRUE;

-- 6.9 系统功能索引
CREATE INDEX idx_analytics_post_id ON analytics(post_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_search_logs_query_gin ON search_logs USING gin(to_tsvector('english', query));
CREATE INDEX idx_search_logs_created_at ON search_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);

-- =====================================================
-- 7. 触发器函数
-- =====================================================

-- 7.1 自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7.2 更新文章计数
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories SET post_count = post_count + 1 WHERE id = NEW.category_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories SET post_count = post_count - 1 WHERE id = OLD.category_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7.3 更新标签使用计数
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags SET usage_count = usage_count + 1 WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags SET usage_count = usage_count - 1 WHERE id = OLD.tag_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7.4 更新文章点赞数
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.target_type = 'post' THEN
        UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.target_id;
    ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'post' THEN
        UPDATE posts SET like_count = like_count - 1 WHERE id = OLD.target_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7.5 更新评论点赞数
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.target_type = 'comment' THEN
        UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.target_id;
    ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'comment' THEN
        UPDATE comments SET like_count = like_count - 1 WHERE id = OLD.target_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7.6 创建审计日志
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    user_id UUID;
BEGIN
    -- 获取当前用户 ID（从应用层传入）
    user_id := NULL; -- 需要从应用层设置

    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, new_values)
        VALUES ('create', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_values, new_values)
        VALUES ('update', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (action, entity_type, entity_id, old_values)
        VALUES ('delete', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. 应用触发器
-- =====================================================

-- updated_at 触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON portfolios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookmarks_updated_at BEFORE UPDATE ON bookmarks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reading_progress_updated_at BEFORE UPDATE ON reading_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 计数更新触发器
CREATE TRIGGER trigger_update_category_post_count
    AFTER INSERT OR DELETE ON post_categories
    FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

CREATE TRIGGER trigger_update_tag_usage_count
    AFTER INSERT OR DELETE ON post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_usage_count();

CREATE TRIGGER trigger_update_post_like_count
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

CREATE TRIGGER trigger_update_comment_like_count
    AFTER INSERT OR DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_comment_like_count();

-- 审计日志触发器（可选，根据需要启用）
-- CREATE TRIGGER trigger_audit_posts AFTER INSERT OR UPDATE OR DELETE ON posts FOR EACH ROW EXECUTE FUNCTION create_audit_log();
-- CREATE TRIGGER trigger_audit_users AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- =====================================================
-- 9. 视图创建
-- =====================================================

-- 9.1 文章统计视图
CREATE OR REPLACE VIEW post_stats AS
SELECT
    p.id,
    p.title,
    p.author_id,
    u.username AS author_name,
    u.avatar_url AS author_avatar,
    p.status,
    p.view_count,
    p.like_count,
    p.comment_count,
    COUNT(DISTINCT c.id) AS actual_comment_count,
    COUNT(DISTINCT pc.category_id) AS category_count,
    COUNT(DISTINCT pt.tag_id) AS tag_count,
    p.published_at,
    p.created_at
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN comments c ON p.id = c.post_id AND c.status = 'approved'
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN post_tags pt ON p.id = pt.post_id
GROUP BY p.id, u.username, u.avatar_url;

-- 9.2 热门文章视图
CREATE OR REPLACE VIEW popular_posts AS
SELECT
    p.*,
    u.username AS author_name,
    u.avatar_url AS author_avatar,
    COALESCE(SUM(a.duration_seconds), 0) AS total_read_time
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN analytics a ON p.id = a.post_id
WHERE p.status = 'published'
GROUP BY p.id, u.username, u.avatar_url
ORDER BY p.view_count DESC, p.published_at DESC;

-- 9.3 用户统计视图
CREATE OR REPLACE VIEW user_stats AS
SELECT
    u.id,
    u.username,
    u.display_name,
    u.avatar_url,
    COUNT(DISTINCT p.id) AS post_count,
    COUNT(DISTINCT c.id) AS comment_count,
    COUNT(DISTINCT f.following_id) AS following_count,
    COUNT(DISTINCT f2.follower_id) AS follower_count,
    COUNT(DISTINCT l.id) AS likes_given,
    u.created_at
FROM users u
LEFT JOIN posts p ON u.id = p.author_id AND p.status = 'published'
LEFT JOIN comments c ON u.id = c.author_id AND c.status = 'approved'
LEFT JOIN follows f ON u.id = f.follower_id
LEFT JOIN follows f2 ON u.id = f2.following_id
LEFT JOIN likes l ON u.id = l.user_id
GROUP BY u.id;

-- 9.4 分类统计视图
CREATE OR REPLACE VIEW category_stats AS
SELECT
    c.id,
    c.name,
    c.slug,
    c.color,
    c.parent_id,
    p.name AS parent_name,
    COUNT(DISTINCT pc.post_id) AS post_count,
    c.created_at
FROM categories c
LEFT JOIN categories p ON c.parent_id = p.id
LEFT JOIN post_categories pc ON c.id = pc.category_id
GROUP BY c.id, p.name;

-- 9.5 标签云视图
CREATE OR REPLACE VIEW tag_cloud AS
SELECT
    t.id,
    t.name,
    t.slug,
    t.color,
    t.usage_count,
    COUNT(DISTINCT pc.post_id) AS actual_post_count
FROM tags t
LEFT JOIN post_tags pt ON t.id = pt.tag_id
LEFT JOIN post_categories pc ON pt.post_id = pc.post_id
GROUP BY t.id
ORDER BY t.usage_count DESC;

-- =====================================================
-- 10. 初始数据插入
-- =====================================================

-- 10.1 插入系统设置
INSERT INTO settings (key, value, value_type, category, description, is_public) VALUES
('site_name', 'CyberPress Platform', 'string', 'general', '网站名称', true),
('site_description', 'A cyberpunk-style blogging platform', 'string', 'general', '网站描述', true),
('site_url', 'https://cyberpress.dev', 'string', 'general', '网站URL', true),
('posts_per_page', '10', 'number', 'general', '每页文章数', true),
('allow_comments', 'true', 'boolean', 'comments', '允许评论', true),
('comment_moderation', 'true', 'boolean', 'comments', '评论审核', false),
('allow_registrations', 'true', 'boolean', 'users', '允许注册', true),
('default_user_role', 'author', 'string', 'users', '默认用户角色', false);

-- 10.2 插入默认管理员用户
-- 密码: admin123 (使用 bcrypt)
INSERT INTO users (id, username, email, password_hash, display_name, role, status) VALUES
('00000000-0000-0000-0000-000000000001', 'admin', 'admin@cyberpress.dev',
 '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5DaNyQPaGy9Wq',
 'CyberAdmin', 'admin', 'active');

-- 10.3 插入默认分类
INSERT INTO categories (name, slug, description, color, sort_order) VALUES
('技术', 'tech', '技术文章和教程', '#00f0ff', 1),
('设计', 'design', '设计和UI/UX', '#9d00ff', 2),
('开发', 'development', '开发和编程', '#ff0080', 3),
('随笔', 'thoughts', '个人思考和感悟', '#00ff88', 4),
('赛博朋克', 'cyberpunk', '赛博朋克文化和艺术', '#ff0055', 5);

-- 10.4 插入默认标签
INSERT INTO tags (name, slug, color) VALUES
('Next.js', 'nextjs', '#000000'),
('TypeScript', 'typescript', '#3178c6'),
('PostgreSQL', 'postgresql', '#336791'),
('Docker', 'docker', '#2496ed'),
('React', 'react', '#61dafb'),
('Node.js', 'nodejs', '#339933'),
('GraphQL', 'graphql', '#e10098'),
('Cyberpunk', 'cyberpunk', '#00f0ff'),
('UI/UX', 'uiux', '#ff61f6'),
('DevOps', 'devops', '#326ce5');

-- 10.5 记录初始迁移
INSERT INTO schema_migrations (version, description) VALUES
('001_initial_schema', 'Initial database schema with all core tables');

-- =====================================================
-- 11. 性能优化函数
-- =====================================================

-- 11.1 文章搜索函数（全文搜索）
CREATE OR REPLACE FUNCTION search_posts(
    search_query TEXT,
    post_status_param post_status DEFAULT 'published',
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(255),
    excerpt TEXT,
    author_name VARCHAR(50),
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.title,
        p.excerpt,
        u.username AS author_name,
        ts_rank(to_tsvector('english', p.title || ' ' || p.content), plainto_tsquery('english', search_query)) AS rank
    FROM posts p
    JOIN users u ON p.author_id = u.id
    WHERE p.status = post_status_param
    AND to_tsvector('english', p.title || ' ' || p.content) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC, p.published_at DESC
    LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- 11.2 获取用户仪表盘统计
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_id_param UUID)
RETURNS TABLE (
    post_count BIGINT,
    comment_count BIGINT,
    view_count BIGINT,
    like_count BIGINT,
    follower_count BIGINT,
    following_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM posts WHERE author_id = user_id_param AND status = 'published'),
        (SELECT COUNT(*) FROM comments WHERE author_id = user_id_param AND status = 'approved'),
        (SELECT COALESCE(SUM(view_count), 0) FROM posts WHERE author_id = user_id_param),
        (SELECT COALESCE(SUM(like_count), 0) FROM posts WHERE author_id = user_id_param),
        (SELECT COUNT(*) FROM follows WHERE following_id = user_id_param),
        (SELECT COUNT(*) FROM follows WHERE follower_id = user_id_param);
END;
$$ LANGUAGE plpgsql;

-- 11.3 更新浏览量
CREATE OR REPLACE FUNCTION increment_post_views(post_id_param UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE posts SET view_count = view_count + 1 WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 数据库架构创建完成
-- =====================================================
