-- ====================================================================
-- CyberPress Platform - PostgreSQL 数据库初始化脚本
-- ====================================================================
-- 创建时间: 2026-03-07
-- 架构师: AI Database Architect
-- 版本: 1.0.0
-- 数据库: PostgreSQL 15+
-- ====================================================================

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 用于模糊搜索
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- 用于复合索引
CREATE EXTENSION IF NOT EXISTS "btree_gist"; -- 用于范围查询

-- ====================================================================
-- 1. 用户表
-- ====================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    cover_url VARCHAR(500),
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(100),
    birth_date DATE,

    -- 状态字段
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('active', 'inactive', 'banned', 'pending')),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    phone VARCHAR(20),
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,

    -- 统计字段
    followers_count INTEGER NOT NULL DEFAULT 0,
    following_count INTEGER NOT NULL DEFAULT 0,
    posts_count INTEGER NOT NULL DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_status_created ON users(status, created_at DESC);
CREATE INDEX idx_users_status_followers ON users(status, followers_count DESC);
CREATE INDEX idx_users_username_trgm ON users USING gin(username gin_trgm_ops);
CREATE INDEX idx_users_bio_trgm ON users USING gin(bio gin_trgm_ops);

-- 添加注释
COMMENT ON TABLE users IS '用户主表';

-- 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 2. 用户资料表
-- ====================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 个人信息
    display_name VARCHAR(100),
    real_name VARCHAR(100),
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    birth_date DATE,

    -- 社交信息
    website VARCHAR(255),
    github VARCHAR(100),
    twitter VARCHAR(100),
    linkedin VARCHAR(100),

    -- 偏好设置
    language VARCHAR(10) NOT NULL DEFAULT 'zh-CN',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Shanghai',
    theme VARCHAR(10) NOT NULL DEFAULT 'auto'
        CHECK (theme IN ('light', 'dark', 'auto')),

    -- 隐私设置
    profile_visibility VARCHAR(20) NOT NULL DEFAULT 'public'
        CHECK (profile_visibility IN ('public', 'followers_only', 'private')),
    show_email BOOLEAN NOT NULL DEFAULT FALSE,
    show_location BOOLEAN NOT NULL DEFAULT FALSE,
    allow_messages BOOLEAN NOT NULL DEFAULT TRUE,

    -- 通知设置
    notification_preferences JSONB,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
COMMENT ON TABLE user_profiles IS '用户详细资料表';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 3. 关注关系表
-- ====================================================================

CREATE TABLE IF NOT EXISTS followers (
    id BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_followers_follower ON followers(follower_id);
CREATE INDEX idx_followers_following ON followers(following_id);
CREATE INDEX idx_followers_created_at ON followers(created_at DESC);
CREATE INDEX idx_followers_following_created ON followers(following_id, created_at DESC);
COMMENT ON TABLE followers IS '用户关注关系表';

-- ====================================================================
-- 4. 分类表
-- ====================================================================

CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,

    -- 层级关系
    parent_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    level INTEGER NOT NULL DEFAULT 0,
    path VARCHAR(500),

    -- 媒体
    icon VARCHAR(100),
    color VARCHAR(20),
    image VARCHAR(500),

    -- 统计
    post_count INTEGER NOT NULL DEFAULT 0,

    -- 显示设置
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_display_order ON categories(display_order);
CREATE INDEX idx_categories_slug_trgm ON categories USING gin(slug gin_trgm_ops);
COMMENT ON TABLE categories IS '文章分类表';

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 5. 标签表
-- ====================================================================

CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,

    -- 样式
    color VARCHAR(20),
    icon VARCHAR(100),

    -- 统计
    post_count INTEGER NOT NULL DEFAULT 0,

    -- 显示设置
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tags_post_count ON tags(post_count DESC);
CREATE INDEX idx_tags_name_trgm ON tags USING gin(name gin_trgm_ops);
COMMENT ON TABLE tags IS '文章标签表';

CREATE TRIGGER update_tags_updated_at
    BEFORE UPDATE ON tags
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 6. 文章表
-- ====================================================================

CREATE TABLE IF NOT EXISTS posts (
    id BIGSERIAL PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 内容字段
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,

    -- 媒体
    featured_image VARCHAR(500),
    cover_image VARCHAR(500),

    -- 分类和标签
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    primary_tag_id BIGINT REFERENCES tags(id) ON DELETE SET NULL,

    -- 状态字段
    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    post_type VARCHAR(20) NOT NULL DEFAULT 'post'
        CHECK (post_type IN ('post', 'page', 'custom')),

    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    meta_keywords VARCHAR(500),

    -- 统计字段
    view_count INTEGER NOT NULL DEFAULT 0,
    like_count INTEGER NOT NULL DEFAULT 0,
    comment_count INTEGER NOT NULL DEFAULT 0,
    bookmark_count INTEGER NOT NULL DEFAULT 0,

    -- 阅读相关
    reading_time INTEGER, -- 预估阅读时间（分钟）
    word_count INTEGER NOT NULL DEFAULT 0,

    -- 优先级和特色
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    is_trending BOOLEAN NOT NULL DEFAULT FALSE,
    priority INTEGER NOT NULL DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC);
CREATE INDEX idx_posts_author_status ON posts(author_id, status);
CREATE INDEX idx_posts_category_published ON posts(category_id, status, published_at DESC);
CREATE INDEX idx_posts_featured ON posts(is_featured, status, published_at DESC);
CREATE INDEX idx_posts_trending ON posts(is_trending, status, view_count DESC);
CREATE INDEX idx_posts_performance ON posts(status, published_at, view_count DESC);
CREATE INDEX idx_posts_covering ON posts(status, published_at DESC, author_id, title, slug, excerpt, view_count, like_count);

-- 全文搜索索引
CREATE INDEX idx_posts_title_trgm ON posts USING gin(title gin_trgm_ops);
CREATE INDEX idx_posts_content_trgm ON posts USING gin(content gin_trgm_ops);
CREATE INDEX idx_posts_excerpt_trgm ON posts USING gin(excerpt gin_trgm_ops);

-- 复合全文搜索索引
CREATE INDEX idx_posts_fulltext_trgm ON posts USING gin(
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(excerpt, ''))
);

COMMENT ON TABLE posts IS '文章主表';

CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 7. 文章-分类关联表
-- ====================================================================

CREATE TABLE IF NOT EXISTS post_categories (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (post_id, category_id)
);

CREATE INDEX idx_post_categories_post ON post_categories(post_id);
CREATE INDEX idx_post_categories_category ON post_categories(category_id);
COMMENT ON TABLE post_categories IS '文章-分类关联表（多对多）';

-- ====================================================================
-- 8. 文章-标签关联表
-- ====================================================================

CREATE TABLE IF NOT EXISTS post_tags (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (post_id, tag_id)
);

CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag ON post_tags(tag_id);
COMMENT ON TABLE post_tags IS '文章-标签关联表（多对多）';

-- ====================================================================
-- 9. 评论表
-- ====================================================================

CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 层级关系
    parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    thread_id BIGINT, -- 顶层评论ID

    -- 内容
    content TEXT NOT NULL,

    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),

    -- 统计
    like_count INTEGER NOT NULL DEFAULT 0,
    reply_count INTEGER NOT NULL DEFAULT 0,

    -- IP和User-Agent
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
CREATE INDEX idx_comments_thread ON comments(thread_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_post_status ON comments(post_id, status, created_at DESC);
CREATE INDEX idx_comments_post_thread ON comments(post_id, thread_id, created_at);
CREATE INDEX idx_comments_performance ON comments(post_id, status, created_at, like_count DESC);

COMMENT ON TABLE comments IS '文章评论表';

CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 10. 点赞表
-- ====================================================================

CREATE TABLE IF NOT EXISTS likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id BIGINT NOT NULL, -- 目标ID（文章/评论）
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment')),

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, target_id, target_type)
);

CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_id, target_type);
CREATE INDEX idx_likes_target_type ON likes(target_id, target_type, created_at DESC);
COMMENT ON TABLE likes IS '点赞表';

-- ====================================================================
-- 11. 收藏夹表
-- ====================================================================

CREATE TABLE IF NOT EXISTS bookmark_folders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(20),

    -- 显示设置
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,

    -- 统计
    bookmark_count INTEGER NOT NULL DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookmark_folders_user ON bookmark_folders(user_id);
CREATE INDEX idx_bookmark_folders_display_order ON bookmark_folders(display_order);
COMMENT ON TABLE bookmark_folders IS '收藏夹表';

CREATE TRIGGER update_bookmark_folders_updated_at
    BEFORE UPDATE ON bookmark_folders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 12. 收藏表
-- ====================================================================

CREATE TABLE IF NOT EXISTS bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    folder_id BIGINT REFERENCES bookmark_folders(id) ON DELETE SET NULL,

    -- 备注
    note TEXT,
    tags VARCHAR(500), -- 用户自定义标签

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, post_id)
);

CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_post ON bookmarks(post_id);
CREATE INDEX idx_bookmarks_folder ON bookmarks(folder_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
CREATE INDEX idx_bookmarks_user_folder ON bookmarks(user_id, folder_id, created_at DESC);
CREATE INDEX idx_bookmarks_user_created ON bookmarks(user_id, created_at DESC);
COMMENT ON TABLE bookmarks IS '收藏表';

CREATE TRIGGER update_bookmarks_updated_at
    BEFORE UPDATE ON bookmarks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 13. 阅读历史表
-- ====================================================================

CREATE TABLE IF NOT EXISTS reading_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

    -- 阅读进度
    progress_percent INTEGER NOT NULL DEFAULT 0,
    scroll_position INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL DEFAULT 0,

    -- 状态
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    first_read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- 阅读次数
    read_count INTEGER NOT NULL DEFAULT 1,

    UNIQUE (user_id, post_id)
);

CREATE INDEX idx_reading_history_user ON reading_history(user_id);
CREATE INDEX idx_reading_history_post ON reading_history(post_id);
CREATE INDEX idx_reading_history_last_read ON reading_history(last_read_at DESC);
CREATE INDEX idx_reading_history_user_progress ON reading_history(user_id, is_completed, last_read_at DESC);
CREATE INDEX idx_reading_history_user_completed ON reading_history(user_id, is_completed);
COMMENT ON TABLE reading_history IS '阅读历史表';

-- ====================================================================
-- 14. 阅读列表表
-- ====================================================================

CREATE TABLE IF NOT EXISTS reading_list (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,

    -- 优先级
    priority INTEGER NOT NULL DEFAULT 0,

    -- 备注
    note TEXT,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    UNIQUE (user_id, post_id)
);

CREATE INDEX idx_reading_list_user ON reading_list(user_id);
CREATE INDEX idx_reading_list_priority ON reading_list(user_id, priority);
COMMENT ON TABLE reading_list IS '阅读列表（稍后阅读）';

-- ====================================================================
-- 15. 通知表
-- ====================================================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_id BIGINT REFERENCES users(id) ON DELETE SET NULL,

    -- 类型
    type VARCHAR(20) NOT NULL CHECK (type IN (
        'follow', 'like', 'comment', 'mention',
        'reply', 'bookmark', 'system', 'welcome'
    )),

    -- 内容
    title VARCHAR(200) NOT NULL,
    content TEXT,

    -- 关联数据
    target_id BIGINT,
    target_type VARCHAR(50),

    -- 状态
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_sender ON notifications(sender_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_user_type ON notifications(user_id, type, created_at DESC);
CREATE INDEX idx_notifications_covering ON notifications(user_id, is_read, created_at DESC, id, type, title, content);
COMMENT ON TABLE notifications IS '用户通知表';

-- ====================================================================
-- 16. 文章浏览统计表（分区表）
-- ====================================================================

CREATE TABLE IF NOT EXISTS post_views (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,

    -- 访问信息
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    referrer VARCHAR(500),

    -- 会话信息
    session_id VARCHAR(100),

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- 创建分区
CREATE TABLE post_views_2023 PARTITION OF post_views
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');

CREATE TABLE post_views_2024 PARTITION OF post_views
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE post_views_2025 PARTITION OF post_views
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE post_views_2026 PARTITION OF post_views
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');

CREATE TABLE post_views_future PARTITION OF post_views
    DEFAULT;

-- 创建索引
CREATE INDEX idx_post_views_post ON post_views(post_id);
CREATE INDEX idx_post_views_user ON post_views(user_id);
CREATE INDEX idx_post_views_session ON post_views(session_id);
CREATE INDEX idx_post_views_post_date ON post_views(post_id, created_at DESC);
CREATE INDEX idx_post_views_created_at ON post_views(created_at);

COMMENT ON TABLE post_views IS '文章浏览统计表（分区表）';

-- ====================================================================
-- 17. 媒体文件表
-- ====================================================================

CREATE TABLE IF NOT EXISTS media (
    id BIGSERIAL PRIMARY KEY,
    uploader_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- 文件信息
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,

    -- 存储路径
    storage_path VARCHAR(500) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),

    -- 媒体类型
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video', 'audio', 'document', 'other')),

    -- 图片特有字段
    width INTEGER,
    height INTEGER,
    alt_text VARCHAR(500),
    caption TEXT,

    -- 关联
    post_id BIGINT REFERENCES posts(id) ON DELETE SET NULL,

    -- 状态
    status VARCHAR(20) NOT NULL DEFAULT 'uploading'
        CHECK (status IN ('uploading', 'processing', 'ready', 'error')),

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_uploader ON media(uploader_id);
CREATE INDEX idx_media_post ON media(post_id);
CREATE INDEX idx_media_type ON media(media_type);
CREATE INDEX idx_media_status ON media(status);
CREATE INDEX idx_media_uploader_type ON media(uploader_id, media_type, created_at DESC);
CREATE INDEX idx_media_created_at ON media(created_at DESC);
COMMENT ON TABLE media IS '媒体文件表';

CREATE TRIGGER update_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- 18. 分析事件表
-- ====================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,

    -- 会话信息
    session_id VARCHAR(100) NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,

    -- 事件信息
    event_type VARCHAR(50) NOT NULL,
    event_category VARCHAR(50),
    event_label VARCHAR(200),

    -- 页面信息
    page_url VARCHAR(500),
    page_title VARCHAR(200),
    referrer VARCHAR(500),

    -- 设备信息
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'tablet', 'mobile', 'bot')),
    browser VARCHAR(50),
    os VARCHAR(50),

    -- 自定义属性
    properties JSONB,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session_type ON analytics_events(session_id, event_type, created_at);
CREATE INDEX idx_analytics_events_user_type ON analytics_events(user_id, event_type, created_at DESC);
CREATE INDEX idx_analytics_events_type_created ON analytics_events(event_type, created_at DESC);
CREATE INDEX idx_analytics_events_properties ON analytics_events USING gin(properties);
COMMENT ON TABLE analytics_events IS '分析事件表';

-- ====================================================================
-- 初始化数据
-- ====================================================================

-- 插入默认分类
INSERT INTO categories (name, slug, description, icon, color, display_order) VALUES
('技术教程', 'tech-tutorials', '编程和技术教程', 'Code', '#00f0ff', 1),
('设计灵感', 'design-inspiration', 'UI/UX 设计灵感', 'Palette', '#9d00ff', 2),
('生活随笔', 'life-essays', '生活感悟和随笔', 'Coffee', '#ff0080', 3),
('项目实战', 'projects', '实际项目案例', 'Rocket', '#00ff88', 4),
('资源分享', 'resources', '工具和资源分享', 'Package', '#f0ff00', 5)
ON CONFLICT (slug) DO NOTHING;

-- 插入默认标签
INSERT INTO tags (name, slug, color, display_order) VALUES
('Next.js', 'nextjs', '#00f0ff', 1),
('TypeScript', 'typescript', '#3178c6', 2),
('Tailwind CSS', 'tailwindcss', '#38bdf8', 3),
('React', 'react', '#61dafb', 4),
('FastAPI', 'fastapi', '#009688', 5),
('Python', 'python', '#3776ab', 6),
('PostgreSQL', 'postgresql', '#336791', 7),
('Docker', 'docker', '#2496ed', 8),
('UI/UX', 'uiux', '#ff0080', 9),
('赛博朋克', 'cyberpunk', '#9d00ff', 10)
ON CONFLICT (name) DO NOTHING;

-- ====================================================================
-- 创建视图
-- ====================================================================

-- 文章统计视图
CREATE OR REPLACE VIEW vw_post_stats AS
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
FROM posts p
LEFT JOIN users u ON p.author_id = u.id;

-- 用户统计视图
CREATE OR REPLACE VIEW vw_user_stats AS
SELECT
    u.id,
    u.username,
    u.email,
    u.status,
    u.followers_count,
    u.following_count,
    u.posts_count,
    (SELECT COUNT(*) FROM posts WHERE author_id = u.id AND status = 'published') AS published_posts,
    u.created_at
FROM users u;

-- ====================================================================
-- 创建函数
-- ====================================================================

-- 更新文章统计
CREATE OR REPLACE FUNCTION sp_update_post_stats(post_id_param BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE posts
    SET
        like_count = (SELECT COUNT(*) FROM likes WHERE target_id = post_id_param AND target_type = 'post'),
        comment_count = (SELECT COUNT(*) FROM comments WHERE post_id = post_id_param AND status = 'approved'),
        bookmark_count = (SELECT COUNT(*) FROM bookmarks WHERE post_id = post_id_param)
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- 更新用户统计
CREATE OR REPLACE FUNCTION sp_update_user_stats(user_id_param BIGINT)
RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET
        followers_count = (SELECT COUNT(*) FROM followers WHERE following_id = user_id_param),
        following_count = (SELECT COUNT(*) FROM followers WHERE follower_id = user_id_param),
        posts_count = (SELECT COUNT(*) FROM posts WHERE author_id = user_id_param AND status IN ('published', 'scheduled'))
    WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- 记录文章浏览
CREATE OR REPLACE FUNCTION sp_track_post_view(
    post_id_param BIGINT,
    user_id_param BIGINT,
    ip_address_param VARCHAR(45),
    user_agent_param VARCHAR(500),
    session_id_param VARCHAR(100)
)
RETURNS VOID AS $$
BEGIN
    -- 插入浏览记录
    INSERT INTO post_views (post_id, user_id, ip_address, user_agent, session_id)
    VALUES (post_id_param, user_id_param, ip_address_param, user_agent_param, session_id_param);

    -- 更新文章浏览计数
    UPDATE posts
    SET view_count = view_count + 1
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================
-- 创建触发器
-- ====================================================================

-- 关注后更新用户统计
CREATE OR REPLACE FUNCTION tr_follow_update_stats_func()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM sp_update_user_stats(NEW.following_id);
    PERFORM sp_update_user_stats(NEW.follower_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_follow_update_stats
    AFTER INSERT ON followers
    FOR EACH ROW
    EXECUTE FUNCTION tr_follow_update_stats_func();

-- 点赞后更新文章统计
CREATE OR REPLACE FUNCTION tr_like_update_post_stats_func()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.target_type = 'post' THEN
        PERFORM sp_update_post_stats(NEW.target_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_like_update_post_stats
    AFTER INSERT ON likes
    FOR EACH ROW
    EXECUTE FUNCTION tr_like_update_post_stats_func();

-- 评论后更新文章统计
CREATE OR REPLACE FUNCTION tr_comment_update_post_stats_func()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM sp_update_post_stats(NEW.post_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_comment_update_post_stats
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION tr_comment_update_post_stats_func();

-- 取消点赞后更新文章统计
CREATE OR REPLACE FUNCTION tr_unlike_update_post_stats_func()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.target_type = 'post' THEN
        PERFORM sp_update_post_stats(OLD.target_id);
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_unlike_update_post_stats
    AFTER DELETE ON likes
    FOR EACH ROW
    EXECUTE FUNCTION tr_unlike_update_post_stats_func();

-- ====================================================================
-- 完成初始化
-- ====================================================================

-- 显示所有创建的表
\dt

-- 显示数据库大小
SELECT
    tablename AS "Table",
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS "Size"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ====================================================================
-- 初始化完成
-- ====================================================================

SELECT '✅ CyberPress Platform PostgreSQL 数据库初始化完成！' AS message;
