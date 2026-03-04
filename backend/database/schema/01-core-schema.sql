-- ============================================================================
-- CyberPress Platform - Core Schema
-- PostgreSQL Database Schema v1.0
-- ============================================================================
-- 说明: 核心业务表结构（用户、文章、分类、标签、媒体）
-- 作者: CyberPress Team
-- 创建日期: 2026-03-05
-- ============================================================================

-- 设置搜索路径
SET search_path TO public, pg_catalog;

-- 启用 UUID 扩展（如果需要）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 用于全文搜索

-- ============================================================================
-- 1. 用户系统表
-- ============================================================================

-- 用户主表
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'subscriber',
    status VARCHAR(50) NOT NULL DEFAULT 'active',

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- 认证相关
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_login_ip INET,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,

    -- 限制
    CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT check_role CHECK (role IN ('admin', 'editor', 'author', 'subscriber', 'guest')),
    CONSTRAINT check_status CHECK (status IN ('active', 'inactive', 'suspended', 'banned'))
);

-- 用户资料表（一对一）
CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,

    -- 基本信息
    display_name VARCHAR(255),
    bio TEXT,
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),

    -- 个人信息
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    gender VARCHAR(20),
    birth_date DATE,

    -- 联系方式
    website VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(50),

    -- 社交链接（JSON格式）
    social_links JSONB DEFAULT '{}',

    -- 统计信息
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    posts_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_profile FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- 用户设置表（一对一）
CREATE TABLE IF NOT EXISTS user_settings (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,

    -- 显示设置
    theme VARCHAR(20) DEFAULT 'dark',
    language VARCHAR(10) DEFAULT 'zh-CN',
    timezone VARCHAR(50) DEFAULT 'Asia/Shanghai',

    -- 通知设置
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    notification_email_frequency VARCHAR(50) DEFAULT 'daily',

    -- 隐私设置
    profile_visibility VARCHAR(50) DEFAULT 'public',
    show_email BOOLEAN DEFAULT false,
    show_birth_date BOOLEAN DEFAULT false,
    allow_messages_from VARCHAR(50) DEFAULT 'everyone',

    -- 内容偏好
    content_language VARCHAR(10) DEFAULT 'all',
    content_categories JSONB DEFAULT '[]',

    -- 其他设置
    custom_settings JSONB DEFAULT '{}',

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_settings FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 2. 内容管理表
-- ============================================================================

-- 文章主表
CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,

    -- 内容信息
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,

    -- 内容类型和状态
    post_type VARCHAR(50) NOT NULL DEFAULT 'post',
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    password VARCHAR(255),

    -- 特色内容
    featured BOOLEAN DEFAULT false,
    featured_order INT DEFAULT 0,

    -- SEO
    meta_title VARCHAR(500),
    meta_description TEXT,
    meta_keywords VARCHAR(500),

    -- 统计信息
    comment_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,

    -- 阅读设置
    reading_time INT,  -- 预估阅读时间（分钟）
    difficulty_level VARCHAR(50),  -- 难度级别

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- 限制
    CONSTRAINT fk_post_author FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT check_post_type CHECK (post_type IN ('post', 'page', 'portfolio', 'project')),
    CONSTRAINT check_post_status CHECK (status IN ('draft', 'publish', 'pending', 'private', 'trash'))
);

-- 文章元数据表（一对多）
CREATE TABLE IF NOT EXISTS post_meta (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    meta_key VARCHAR(255) NOT NULL,
    meta_value TEXT,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_post_meta FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE
);

-- 分类表（树形结构）
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT,

    -- 基本信息
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20),  -- 分类颜色（用于UI显示）

    -- SEO
    meta_title VARCHAR(500),
    meta_description TEXT,

    -- 显示设置
    icon VARCHAR(100),
    image_url VARCHAR(500),
    display_order INT DEFAULT 0,

    -- 统计
    post_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_category_parent FOREIGN KEY (parent_id)
        REFERENCES categories(id)
        ON DELETE SET NULL
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,

    -- 基本信息
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,

    -- 显示设置
    color VARCHAR(20),  -- 标签颜色
    icon VARCHAR(100),

    -- 统计
    post_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 文章分类关联表（多对多）
CREATE TABLE IF NOT EXISTS post_categories (
    post_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (post_id, category_id),
    CONSTRAINT fk_pc_post FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pc_category FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);

-- 文章标签关联表（多对多）
CREATE TABLE IF NOT EXISTS post_tags (
    post_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_pt_post FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_pt_tag FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 3. 媒体管理表
-- ============================================================================

CREATE TABLE IF NOT EXISTS media (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL,

    -- 文件信息
    title VARCHAR(500),
    filename VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    file_size BIGINT NOT NULL,  -- 字节

    -- 文件类型
    mime_type VARCHAR(100) NOT NULL,
    file_type VARCHAR(50),  -- image, video, audio, document, other

    -- 媒体专用
    width INT,  -- 图片/视频宽度
    height INT,  -- 图片/视频高度
    duration INT,  -- 视频/音频时长（秒）

    -- 替代文本
    alt_text VARCHAR(500),
    caption TEXT,
    description TEXT,

    -- 缩略图
    thumbnail_url VARCHAR(1000),
    medium_url VARCHAR(1000),
    large_url VARCHAR(1000),

    -- SEO
    meta_title VARCHAR(500),
    meta_description TEXT,

    -- 使用统计
    post_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_media_author FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 4. 评论系统表
-- ============================================================================

CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    author_id BIGINT,
    parent_id BIGINT,  -- 父评论ID，用于嵌套回复

    -- 评论内容
    content TEXT NOT NULL,

    -- 评论者信息（如果是游客评论）
    author_name VARCHAR(255),
    author_email VARCHAR(255),
    author_url VARCHAR(255),
    author_ip INET,

    -- 评论状态
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    type VARCHAR(50) DEFAULT 'comment',

    -- 统计
    like_count INT DEFAULT 0,
    reply_count INT DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    CONSTRAINT fk_comment_post FOREIGN KEY (post_id)
        REFERENCES posts(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_comment_author FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_comment_parent FOREIGN KEY (parent_id)
        REFERENCES comments(id)
        ON DELETE CASCADE,
    CONSTRAINT check_comment_status CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
    CONSTRAINT check_comment_type CHECK (type IN ('comment', 'pingback', 'trackback'))
);

-- 评论点赞表
CREATE TABLE IF NOT EXISTS comment_likes (
    id BIGSERIAL PRIMARY KEY,
    comment_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(comment_id, user_id),
    CONSTRAINT fk_comment_like_comment FOREIGN KEY (comment_id)
        REFERENCES comments(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_comment_like_user FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================================
-- 创建核心索引
-- ============================================================================

-- 用户表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 文章表索引
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_type ON posts(post_type);
CREATE INDEX idx_posts_featured ON posts(featured, status, created_at DESC);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_view_count ON posts(view_count DESC);
CREATE INDEX idx_posts_like_count ON posts(like_count DESC);

-- 分类和标签索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_tags_slug ON tags(slug);

-- 评论表索引
CREATE INDEX idx_comments_post_id ON comments(post_id, created_at DESC);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);

-- 媒体表索引
CREATE INDEX idx_media_author_id ON media(author_id);
CREATE INDEX idx_media_file_type ON media(file_type);
CREATE INDEX idx_media_mime_type ON media(mime_type);

-- ============================================================================
-- 创建全文搜索索引
-- ============================================================================

-- 文章标题和内容全文搜索
CREATE INDEX idx_posts_fulltext ON posts USING gin(to_tsvector('english', title || ' ' || content));

-- 用户名和显示名全文搜索
CREATE INDEX idx_users_fulltext ON users USING gin(to_tsvector('english', username || ' ' || email));

-- 标签全文搜索
CREATE INDEX idx_tags_fulltext ON tags USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- ============================================================================
-- 创建触发器函数
-- ============================================================================

-- 自动更新 updated_at 字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为需要的表添加触发器
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

-- ============================================================================
-- 完成
-- ============================================================================

-- 添加表注释
COMMENT ON TABLE users IS '用户主表';
COMMENT ON TABLE user_profiles IS '用户资料表';
COMMENT ON TABLE user_settings IS '用户设置表';
COMMENT ON TABLE posts IS '文章主表';
COMMENT ON TABLE post_meta IS '文章元数据表';
COMMENT ON TABLE categories IS '分类表';
COMMENT ON TABLE tags IS '标签表';
COMMENT ON TABLE post_categories IS '文章分类关联表';
COMMENT ON TABLE post_tags IS '文章标签关联表';
COMMENT ON TABLE media IS '媒体文件表';
COMMENT ON TABLE comments IS '评论表';
COMMENT ON TABLE comment_likes IS '评论点赞表';

-- 核心表结构创建完成
