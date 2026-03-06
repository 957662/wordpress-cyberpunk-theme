-- ===================================================================
-- CyberPress Platform - Complete Database Initialization Script
-- ===================================================================
-- 版本: 1.0.0
-- 描述: 完整的数据库初始化脚本，包含所有表、索引、触发器
-- 用法: psql -U cyberpress_user -d cyberpress_db -f 00-complete-schema.sql
-- ===================================================================

-- ===================================================================
-- 1. 扩展配置
-- ===================================================================
DO $$
BEGIN
    -- 全文搜索支持
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    CREATE EXTENSION IF NOT EXISTS "btree_gin";

    -- 中文分词支持（可选）
    -- CREATE EXTENSION IF NOT EXISTS "zhparser";
END $$;

-- ===================================================================
-- 2. 自定义函数
-- ===================================================================

-- 自动更新 updated_at 字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 生成唯一 slug 的函数
CREATE OR REPLACE FUNCTION generate_unique_slug(p_text TEXT, p_table TEXT, p_column TEXT DEFAULT 'slug')
RETURNS TEXT AS $$
DECLARE
    v_slug TEXT;
    v_counter INTEGER := 0;
    v_base_slug TEXT;
BEGIN
    -- 生成基础 slug
    v_base_slug := lower(trim(regexp_replace(p_text, '[^a-zA-Z0-9\s-]', '', 'g')));
    v_base_slug := regexp_replace(v_base_slug, '\s+', '-', 'g');
    v_base_slug := regexp_replace(v_base_slug, '-+', '-', 'g');
    v_base_slug := trim(both '-' from v_base_slug);

    v_slug := v_base_slug;

    -- 检查是否存在重复
    WHILE EXISTS (
        SELECT 1 FROM pg_tables
        WHERE tablename = p_table
    ) AND EXISTS (
        SELECT 1 FROM quote_ident(p_table)
        WHERE quote_ident(p_column) = v_slug
        LIMIT 1
    ) LOOP
        v_counter := v_counter + 1;
        v_slug := v_base_slug || '-' || v_counter;
    END LOOP;

    RETURN v_slug;
END;
$$ LANGUAGE plpgsql;

-- 计算阅读时间的函数
CREATE OR REPLACE FUNCTION calculate_reading_time(p_content TEXT)
RETURNS INTEGER AS $$
DECLARE
    v_word_count INTEGER;
    v_reading_time INTEGER;
BEGIN
    -- 计算字数（中英文混合）
    v_word_count := length(p_text) - length(regexp_replace(p_text, '[\w\s]', '', 'g'));

    -- 假设平均阅读速度为 200字/分钟
    v_reading_time := CEIL(v_word_count::FLOAT / 200.0);

    -- 最少1分钟
    RETURN GREATEST(v_reading_time, 1);
END;
$$ LANGUAGE plpgsql;

-- 更新文章统计信息的函数
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'comments' THEN
        IF TG_OP = 'INSERT' THEN
            -- 新评论，增加评论数
            UPDATE posts SET comment_count = comment_count + 1
            WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
            -- 删除评论，减少评论数
            UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0)
            WHERE id = OLD.post_id;
        END IF;
    ELSIF TG_TABLE_NAME = 'comment_likes' THEN
        IF TG_OP = 'INSERT' THEN
            -- 新点赞
            UPDATE comments SET like_count = like_count + 1
            WHERE id = NEW.comment_id;
        ELSIF TG_OP = 'DELETE' THEN
            -- 取消点赞
            UPDATE comments SET like_count = GREATEST(like_count - 1, 0)
            WHERE id = OLD.comment_id;
        END IF;
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ===================================================================
-- 3. 用户相关表
-- ===================================================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(255),
    role VARCHAR(50) DEFAULT 'subscriber' NOT NULL
        CHECK (role IN ('admin', 'editor', 'author', 'contributor', 'subscriber')),
    status VARCHAR(50) DEFAULT 'active' NOT NULL
        CHECK (status IN ('active', 'inactive', 'suspended', 'banned')),
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户会话表
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    refresh_token VARCHAR(500) UNIQUE,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户偏好设置表
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(50) DEFAULT 'dark'
        CHECK (theme IN ('light', 'dark', 'auto')),
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(100) DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    newsletter_subscribed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 4. 内容相关表
-- ===================================================================

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    icon VARCHAR(100),
    color VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章表
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'draft' NOT NULL
        CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
    comment_status VARCHAR(50) DEFAULT 'open' NOT NULL
        CHECK (comment_status IN ('open', 'closed')),
    published_at TIMESTAMP,
    scheduled_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

-- 文章元数据表
CREATE TABLE IF NOT EXISTS post_meta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    meta_key VARCHAR(255) NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, meta_key)
);

-- ===================================================================
-- 5. 社交相关表
-- ===================================================================

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_url VARCHAR(500),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL
        CHECK (status IN ('pending', 'approved', 'rejected', 'spam')),
    ip_address INET,
    user_agent TEXT,
    like_count INTEGER DEFAULT 0,
    depth INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 评论点赞表
CREATE TABLE IF NOT EXISTS comment_likes (
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id, user_id)
);

-- ===================================================================
-- 6. 系统相关表
-- ===================================================================

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 活动日志表
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 页面浏览表
CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    path VARCHAR(500) NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    ip_address INET,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 媒体文件表
CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(500) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size BIGINT NOT NULL,
    width INTEGER,
    height INTEGER,
    url TEXT NOT NULL,
    alt_text VARCHAR(500),
    caption TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 邮件订阅表
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' NOT NULL
        CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced')),
    confirm_token VARCHAR(255) UNIQUE,
    unsubscribe_token VARCHAR(255) UNIQUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    confirmed_at TIMESTAMP
);

-- 系统设置表
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'string' NOT NULL
        CHECK (type IN ('string', 'number', 'boolean', 'json')),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================================================
-- 5. 索引创建
-- ===================================================================

-- 用户表索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_name_email ON users USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(email, ''))
);

-- 用户会话索引
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(user_id, expires_at)
WHERE expires_at > CURRENT_TIMESTAMP;

-- 分类表索引
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- 标签表索引
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
CREATE INDEX IF NOT EXISTS idx_tags_post_count ON tags(post_count DESC);

-- 文章表索引
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status, published_at DESC)
WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count DESC)
WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC)
WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- 全文搜索索引（重要）
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, ''))
);

CREATE INDEX IF NOT EXISTS idx_posts_search_weighted ON posts USING gin(
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
);

-- 评论表索引
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- 通知表索引
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read, created_at DESC)
WHERE read = FALSE;

-- 活动日志索引
CREATE INDEX IF NOT EXISTS idx_activity_user_id ON activity_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_log(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON activity_log(created_at DESC);

-- 页面浏览索引
CREATE INDEX IF NOT EXISTS idx_page_views_post_id ON page_views(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path, created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views USING brin(created_at);

-- 媒体文件索引
CREATE INDEX IF NOT EXISTS idx_media_files_mime_type ON media_files(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by, created_at DESC);

-- 邮件订阅索引
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);

-- ===================================================================
-- 6. 触发器设置
-- ===================================================================

-- 自动更新 updated_at 触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_meta_updated_at BEFORE UPDATE ON post_meta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 更新统计信息的触发器
CREATE TRIGGER update_comment_stats AFTER INSERT OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_stats();

CREATE TRIGGER update_comment_like_stats AFTER INSERT OR DELETE ON comment_likes
    FOR EACH ROW EXECUTE FUNCTION update_post_stats();

-- ===================================================================
-- 7. 初始数据
-- ===================================================================

-- 插入系统设置
INSERT INTO settings (key, value, description, type) VALUES
    ('site_title', 'CyberPress', '网站标题', 'string'),
    ('site_description', 'A modern cyberpunk blogging platform', '网站描述', 'string'),
    ('site_language', 'en', '默认语言', 'string'),
    ('site_timezone', 'UTC', '默认时区', 'string'),
    ('posts_per_page', '10', '每页文章数', 'number'),
    ('comments_enabled', 'true', '启用评论', 'boolean'),
    ('newsletter_enabled', 'true', '启用邮件订阅', 'boolean'),
    ('registration_enabled', 'true', '启用用户注册', 'boolean'),
    ('max_upload_size', '10485760', '最大上传大小（字节）', 'number'),
    ('allowed_file_types', 'jpg,jpeg,png,gif,web,pdf', '允许的文件类型', 'string')
ON CONFLICT (key) DO NOTHING;

-- 插入默认分类
INSERT INTO categories (name, slug, description, sort_order) VALUES
    ('Technology', 'technology', 'Technology related posts', 1),
    ('Programming', 'programming', 'Programming tutorials', 2),
    ('Web Development', 'web-development', 'Web development articles', 3),
    ('Design', 'design', 'Design related content', 4),
    ('AI & Machine Learning', 'ai-machine-learning', 'AI and ML articles', 5)
ON CONFLICT (slug) DO NOTHING;

-- 插入默认标签
INSERT INTO tags (name, slug) VALUES
    ('React', 'react'),
    ('Next.js', 'nextjs'),
    ('TypeScript', 'typescript'),
    ('JavaScript', 'javascript'),
    ('Python', 'python'),
    ('Docker', 'docker'),
    ('PostgreSQL', 'postgresql'),
    ('FastAPI', 'fastapi'),
    ('Cyberpunk', 'cyberpunk')
ON CONFLICT (slug) DO NOTHING;

-- ===================================================================
-- 8. 视图创建
-- ===================================================================

-- 文章统计视图
CREATE OR REPLACE VIEW post_stats_view AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.status,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.created_at,
    p.published_at,
    u.name as author_name,
    u.email as author_email,
    c.name as category_name,
    c.slug as category_slug,
    ARRAY_AGG(DISTINCT t.name) as tags
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id, u.name, u.email, c.name, c.slug;

-- 用户统计视图
CREATE OR REPLACE VIEW user_stats_view AS
SELECT
    u.id,
    u.name,
    u.email,
    u.role,
    u.status,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT com.id) as comment_count,
    SUM(p.view_count) as total_views
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
LEFT JOIN comments com ON u.id = com.author_id
GROUP BY u.id;

-- 热门文章视图
CREATE OR REPLACE VIEW popular_posts_view AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.featured_image,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.published_at,
    u.name as author_name,
    c.name as category_name
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published'
    AND p.published_at IS NOT NULL
ORDER BY
    (p.view_count * 1.0 + p.like_count * 2.0 + p.comment_count * 3.0) DESC;

-- ===================================================================
-- 9. 完成消息
-- ===================================================================

DO $$
BEGIN
    RAISE NOTICE '===================================================================';
    RAISE NOTICE 'CyberPress Platform - Database Initialization Complete';
    RAISE NOTICE '===================================================================';
    RAISE NOTICE '数据库初始化完成！';
    RAISE NOTICE '';
    RAISE NOTICE '创建的表数量: %', (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE');
    RAISE NOTICE '创建的索引数量: %', (SELECT count(*) FROM pg_indexes WHERE schemaname = 'public');
    RAISE NOTICE '创建的视图数量: %', (SELECT count(*) FROM information_schema.views WHERE table_schema = 'public');
    RAISE NOTICE '创建的函数数量: %', (SELECT count(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace);
    RAISE NOTICE '';
    RAISE NOTICE '默认管理员账户:';
    RAISE NOTICE '  Email: admin@cyberpress.dev';
    RAISE NOTICE '  Password: admin123 (请在首次登录后修改)';
    RAISE NOTICE '';
    RAISE NOTICE '===================================================================';
END $$;
