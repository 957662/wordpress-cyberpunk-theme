-- ============================================
-- CyberPress Platform - 数据库初始化脚本
-- ============================================
-- 版本: 1.0.0
-- 创建时间: 2026-03-07
-- 描述: 创建所有必要的数据表、索引和初始数据
-- ============================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 用于全文搜索
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- 用于复合索引

-- ============================================
-- 用户相关表
-- ============================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    cover_url VARCHAR(500),
    website VARCHAR(255),
    location VARCHAR(100),
    birth_date DATE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_staff BOOLEAN DEFAULT FALSE,
    is_superuser BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 用户索引
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_is_active ON users(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================
-- 内容相关表
-- ============================================

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    icon VARCHAR(50),
    color VARCHAR(7), -- 十六进制颜色代码
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 分类索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    is_featured BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 标签索引
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_usage_count ON tags(usage_count DESC);
CREATE INDEX idx_tags_is_featured ON tags(is_featured);

-- 文章表
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    content_type VARCHAR(20) DEFAULT 'markdown', -- markdown, html, plain
    featured_image VARCHAR(500),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, published, archived
    post_type VARCHAR(20) DEFAULT 'post', -- post, page, portfolio
    is_featured BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    allow_comments BOOLEAN DEFAULT TRUE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 0, -- 预计阅读时间（分钟）
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 文章索引
CREATE INDEX idx_posts_slug ON posts(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_author_id ON posts(author_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_category_id ON posts(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_status ON posts(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_published_at ON posts(published_at DESC) WHERE deleted_at IS NULL AND status = 'published';
CREATE INDEX idx_posts_is_featured ON posts(is_featured) WHERE deleted_at IS NULL AND is_featured = TRUE;
CREATE INDEX idx_posts_view_count ON posts(view_count DESC) WHERE deleted_at IS NULL;

-- 全文搜索索引
CREATE INDEX idx_posts_title_trgm ON posts USING gin(title gin_trgm_ops) WHERE deleted_at IS NULL;
CREATE INDEX idx_posts_content_trgm ON posts USING gin(content gin_trgm_ops) WHERE deleted_at IS NULL;

-- 文章-标签关联表
CREATE TABLE IF NOT EXISTS post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- ============================================
-- 社交相关表
-- ============================================

-- 关注表
CREATE TABLE IF NOT EXISTS follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- 点赞表
CREATE TABLE IF NOT EXISTS likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL,
    target_type VARCHAR(20) NOT NULL, -- post, comment, portfolio
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);

-- 收藏表
CREATE TABLE IF NOT EXISTS bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL,
    target_type VARCHAR(20) NOT NULL, -- post, portfolio
    title VARCHAR(255),
    description TEXT,
    tags TEXT[], -- 用户自定义标签
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);

CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_target ON bookmarks(target_type, target_id);
CREATE INDEX idx_bookmarks_tags ON bookmarks USING GIN(tags);

-- ============================================
-- 评论相关表
-- ============================================

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, spam
    ip_address INET,
    user_agent TEXT,
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_comments_post_id ON comments(post_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_author_id ON comments(author_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_parent_id ON comments(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_status ON comments(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_created_at ON comments(created_at DESC) WHERE deleted_at IS NULL;

-- ============================================
-- 通知相关表
-- ============================================

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL, -- follow, like, comment, mention, system
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500),
    data JSONB, -- 额外数据
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_sender_id ON notifications(sender_id);
CREATE INDEX idx_notifications_type ON notifications(type);

-- ============================================
-- 阅读历史相关表
-- ============================================

-- 阅读历史表
CREATE TABLE IF NOT EXISTS reading_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    progress INTEGER DEFAULT 0, -- 阅读进度百分比
    is_completed BOOLEAN DEFAULT FALSE,
    last_position INTEGER DEFAULT 0, -- 最后阅读位置（字符数）
    reading_time INTEGER DEFAULT 0, -- 实际阅读时间（秒）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

CREATE INDEX idx_reading_history_user_id ON reading_history(user_id, updated_at DESC);
CREATE INDEX idx_reading_history_post_id ON reading_history(post_id);

-- 阅读列表表
CREATE TABLE IF NOT EXISTS reading_list (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    priority INTEGER DEFAULT 0, -- 优先级
    notes TEXT, -- 用户笔记
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

CREATE INDEX idx_reading_list_user_id ON reading_list(user_id, priority DESC, updated_at DESC);
CREATE INDEX idx_reading_list_post_id ON reading_list(post_id);

-- ============================================
-- 系统配置表
-- ============================================

-- 系统设置表
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    value_type VARCHAR(20) DEFAULT 'string', -- string, integer, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- 是否可以被前端访问
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_is_public ON settings(is_public);

-- ============================================
-- 初始数据
-- ============================================

-- 创建默认管理员用户（密码: admin123，需要在生产环境中修改）
INSERT INTO users (username, email, password_hash, full_name, is_staff, is_superuser, is_verified)
VALUES (
    'admin',
    'admin@cyberpress.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU9xKx1c/y4u', -- admin123
    'Administrator',
    TRUE,
    TRUE,
    TRUE
) ON CONFLICT (username) DO NOTHING;

-- 创建默认分类
INSERT INTO categories (name, slug, description, color, sort_order) VALUES
    ('技术', 'tech', '技术相关文章', '#00f0ff', 1),
    ('生活', 'life', '生活感悟', '#9d00ff', 2),
    ('作品', 'portfolio', '个人作品展示', '#ff0080', 3),
    ('随笔', 'essay', '随笔和杂谈', '#00ff88', 4)
ON CONFLICT (name) DO NOTHING;

-- 创建默认标签
INSERT INTO tags (name, slug, description, color) VALUES
    ('Next.js', 'nextjs', 'Next.js 框架相关', '#00f0ff'),
    ('TypeScript', 'typescript', 'TypeScript 语言', '#3178c6'),
    ('React', 'react', 'React 框架', '#61dafb'),
    ('FastAPI', 'fastapi', 'FastAPI 框架', '#009688'),
    ('Python', 'python', 'Python 语言', '#3776ab')
ON CONFLICT (name) DO NOTHING;

-- 创建系统设置
INSERT INTO settings (key, value, value_type, description, is_public) VALUES
    ('site_name', 'CyberPress Platform', 'string', '网站名称', TRUE),
    ('site_description', '基于 FastAPI + Next.js 的赛博朋克风格博客平台', 'string', '网站描述', TRUE),
    ('site_keywords', 'CyberPress,博客,Next.js,FastAPI', 'string', '网站关键词', TRUE),
    ('posts_per_page', '10', 'integer', '每页显示文章数量', FALSE),
    ('allow_registration', 'true', 'boolean', '是否允许用户注册', FALSE),
    ('require_email_verification', 'true', 'boolean', '是否需要邮箱验证', FALSE)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 创建视图
-- ============================================

-- 文章统计视图
CREATE OR REPLACE VIEW post_stats AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.view_count,
    p.like_count,
    p.comment_count,
    u.username AS author_name,
    u.avatar_url AS author_avatar,
    c.name AS category_name,
    COUNT(DISTINCT pt.tag_id) AS tag_count
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
WHERE p.deleted_at IS NULL
GROUP BY p.id, u.username, u.avatar_url, c.name;

-- 用户统计视图
CREATE OR REPLACE VIEW user_stats AS
SELECT
    u.id,
    u.username,
    u.full_name,
    u.avatar_url,
    u.is_verified,
    COUNT(DISTINCT p.id) AS post_count,
    COUNT(DISTINCT f1.follower_id) AS follower_count,
    COUNT(DISTINCT f2.following_id) AS following_count,
    SUM(p.view_count) AS total_views
FROM users u
LEFT JOIN posts p ON u.id = p.author_id AND p.deleted_at IS NULL
LEFT JOIN follows f1 ON u.id = f1.following_id
LEFT JOIN follows f2 ON u.id = f2.follower_id
WHERE u.deleted_at IS NULL
GROUP BY u.id;

-- ============================================
-- 创建触发器函数
-- ============================================

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为相关表创建更新时间戳触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 完成
-- ============================================

-- 输出初始化完成信息
DO $$
BEGIN
    RAISE NOTICE '====================================';
    RAISE NOTICE 'CyberPress Platform 数据库初始化完成！';
    RAISE NOTICE '====================================';
    RAISE NOTICE '已创建的表数量: %', (
        SELECT COUNT(*) FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
    );
    RAISE NOTICE '已创建的索引数量: %', (
        SELECT COUNT(*) FROM pg_indexes
        WHERE schemaname = 'public'
    );
    RAISE NOTICE '====================================';
END $$;
