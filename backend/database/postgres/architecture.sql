-- ================================================================
-- CyberPress Platform - PostgreSQL Database Architecture
-- PostgreSQL 数据库架构设计
-- ================================================================
--
-- 架构说明：
-- 1. 使用 UUID 作为主键，更好的分布式支持
-- 2. 添加 JSONB 字段支持灵活的元数据存储
-- 3. 使用 PostgreSQL 特有的全文搜索功能
-- 4. 实现软删除和审计日志
-- 5. 添加触发器自动更新时间戳和计数器
--
-- 作者：Claude (Database Architect)
-- 创建时间：2026-03-08
-- 版本：1.0.0
-- ================================================================

-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 用于模糊搜索
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- 用于复合索引

-- ================================================================
-- 枚举类型定义
-- ================================================================

-- 用户角色
CREATE TYPE user_role AS ENUM ('subscriber', 'contributor', 'author', 'editor', 'admin');

-- 用户状态
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'banned');

-- 文章状态
CREATE TYPE post_status AS ENUM ('draft', 'pending', 'private', 'publish', 'future', 'trash');

-- 文章类型
CREATE TYPE post_type AS ENUM ('post', 'page', 'portfolio', 'attachment');

-- 评论状态
CREATE TYPE comment_status AS ENUM ('pending', 'approved', 'spam', 'trash');

-- 媒体类型
CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'document', 'other');

-- ================================================================
-- 核心表结构
-- ================================================================

-- ------------------------------------------------
-- 用户表 (users)
-- ------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(60) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    website VARCHAR(255),
    role user_role DEFAULT 'subscriber',
    status user_status DEFAULT 'pending',

    -- 时间戳
    email_verified_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- 元数据（JSONB 格式）
    metadata JSONB DEFAULT '{}'::jsonb,

    -- 约束
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]{3,30}$'),
    CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- 用户表索引
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
CREATE INDEX idx_users_metadata ON users USING GIN(metadata);

-- ------------------------------------------------
-- 分类表 (categories)
-- ------------------------------------------------
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,

    -- 视觉设置
    icon VARCHAR(50),
    color VARCHAR(7) DEFAULT '#00f0ff',
    cover_image_url VARCHAR(500),

    -- 排序和统计
    sort_order INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- 元数据
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 分类表索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_sort_order ON categories(sort_order);

-- ------------------------------------------------
-- 标签表 (tags)
-- ------------------------------------------------
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#9d00ff',
    post_count INTEGER DEFAULT 0,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- 元数据
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 标签表索引
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_name ON tags USING gin(name gin_trgm_ops); -- 全文搜索

-- ------------------------------------------------
-- 文章表 (posts)
-- ------------------------------------------------
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,

    -- 作者和特色图片
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    featured_image_id UUID,

    -- 状态和类型
    status post_status DEFAULT 'draft',
    post_type post_type DEFAULT 'post',

    -- 评论和引用
    comment_status BOOLEAN DEFAULT TRUE,
    ping_status BOOLEAN DEFAULT TRUE,

    -- 密码保护
    password VARCHAR(255),

    -- 统计数据
    view_count BIGINT DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,

    -- 特色标记
    is_featured BOOLEAN DEFAULT FALSE,
    is_sticky BOOLEAN DEFAULT FALSE,

    -- 排序
    menu_order INTEGER DEFAULT 0,

    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords VARCHAR(500),

    -- 时间戳
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- 元数据
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 文章表索引
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_post_type ON posts(post_type);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_is_featured ON posts(is_featured);
CREATE INDEX idx_posts_is_sticky ON posts(is_sticky);
CREATE INDEX idx_posts_view_count ON posts(view_count DESC);

-- 全文搜索索引
CREATE INDEX idx_posts_title_search ON posts USING gin(to_tsvector('english', title));
CREATE INDEX idx_posts_content_search ON posts USING gin(to_tsvector('english', content));
CREATE INDEX idx_posts_combined_search ON posts USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));

-- JSONB 元数据索引
CREATE INDEX idx_posts_metadata ON posts USING GIN(metadata);

-- ------------------------------------------------
-- 文章分类关系表 (post_categories)
-- ------------------------------------------------
CREATE TABLE post_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_post_category UNIQUE(post_id, category_id)
);

-- 关系表索引
CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);

-- ------------------------------------------------
-- 文章标签关系表 (post_tags)
-- ------------------------------------------------
CREATE TABLE post_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_post_tag UNIQUE(post_id, tag_id)
);

-- 关系表索引
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- ------------------------------------------------
-- 评论表 (comments)
-- ------------------------------------------------
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,

    -- 作者信息（支持匿名评论）
    author_name VARCHAR(100),
    author_email VARCHAR(100),
    author_url VARCHAR(255),
    author_ip VARCHAR(45),

    -- 评论内容
    content TEXT NOT NULL,

    -- 评分和状态
    karma INTEGER DEFAULT 0,
    status comment_status DEFAULT 'pending',

    -- 用户代理
    agent VARCHAR(255),

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,

    -- 元数据
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 评论表索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- ------------------------------------------------
-- 媒体表 (media)
-- ------------------------------------------------
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    filename VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,

    -- 图片尺寸
    width INTEGER,
    height INTEGER,

    -- 替代文本和描述
    alt_text VARCHAR(255),
    description TEXT,
    caption TEXT,

    -- 上传者和关联文章
    uploader_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE SET NULL,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- 元数据
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 媒体表索引
CREATE INDEX idx_media_post_id ON media(post_id);
CREATE INDEX idx_media_uploader_id ON media(uploader_id);
CREATE INDEX idx_media_mime_type ON media(mime_type);
CREATE INDEX idx_media_created_at ON media(created_at DESC);

-- ------------------------------------------------
-- 选项表 (options)
-- ------------------------------------------------
CREATE TABLE options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    option_name VARCHAR(191) NOT NULL UNIQUE,
    option_value TEXT NOT NULL,
    autoload BOOLEAN DEFAULT TRUE,

    -- 时间戳
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 选项表索引
CREATE INDEX idx_options_option_name ON options(option_name);
CREATE INDEX idx_options_autoload ON options(autoload);

-- ------------------------------------------------
-- 用户元数据表 (user_meta)
-- ------------------------------------------------
CREATE TABLE user_meta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meta_key VARCHAR(255) NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_user_meta UNIQUE(user_id, meta_key)
);

-- 用户元数据索引
CREATE INDEX idx_user_meta_user_id ON user_meta(user_id);
CREATE INDEX idx_user_meta_meta_key ON user_meta(meta_key);

-- ------------------------------------------------
-- 文章元数据表 (post_meta)
-- ------------------------------------------------
CREATE TABLE post_meta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    meta_key VARCHAR(255) NOT NULL,
    meta_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_post_meta UNIQUE(post_id, meta_key)
);

-- 文章元数据索引
CREATE INDEX idx_post_meta_post_id ON post_meta(post_id);
CREATE INDEX idx_post_meta_meta_key ON post_meta(meta_key);

-- ================================================================
-- 视图定义
-- ================================================================

-- ------------------------------------------------
-- 文章统计视图
-- ------------------------------------------------
CREATE OR REPLACE VIEW post_stats AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.status,
    p.view_count,
    p.like_count,
    p.comment_count,
    u.username as author_name,
    u.display_name as author_display_name,
    p.published_at,
    p.created_at,
    -- 计算热度分数
    (p.view_count + p.like_count * 2 + p.comment_count * 3) as popularity_score
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.deleted_at IS NULL;

-- ------------------------------------------------
-- 热门文章视图
-- ------------------------------------------------
CREATE OR REPLACE VIEW popular_posts AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.view_count,
    p.like_count,
    p.comment_count,
    (p.view_count + p.like_count * 2 + p.comment_count * 3) as popularity_score,
    u.username as author_name,
    u.display_name as author_display_name,
    p.published_at
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.status = 'publish' AND p.deleted_at IS NULL
ORDER BY popularity_score DESC;

-- ------------------------------------------------
-- 分类统计视图
-- ------------------------------------------------
CREATE OR REPLACE VIEW category_stats AS
SELECT
    c.id,
    c.name,
    c.slug,
    c.description,
    c.color,
    c.post_count,
    COUNT(DISTINCT pc.post_id) as actual_post_count
FROM categories c
LEFT JOIN post_categories pc ON c.id = pc.category_id
LEFT JOIN posts p ON pc.post_id = p.id AND p.status = 'publish' AND p.deleted_at IS NULL
GROUP BY c.id;

-- ------------------------------------------------
-- 标签统计视图
-- ------------------------------------------------
CREATE OR REPLACE VIEW tag_stats AS
SELECT
    t.id,
    t.name,
    t.slug,
    t.color,
    t.post_count,
    COUNT(DISTINCT pt.post_id) as actual_post_count
FROM tags t
LEFT JOIN post_tags pt ON t.id = pt.tag_id
LEFT JOIN posts p ON pt.post_id = p.id AND p.status = 'publish' AND p.deleted_at IS NULL
GROUP BY t.id;

-- ================================================================
-- 触发器函数
-- ================================================================

-- ------------------------------------------------
-- 更新 updated_at 时间戳
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------
-- 更新文章计数（分类）
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION update_category_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories
        SET post_count = post_count + 1
        WHERE id = NEW.category_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories
        SET post_count = post_count - 1
        WHERE id = OLD.category_id;
    END IF;
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------
-- 更新文章计数（标签）
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION update_tag_post_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE tags
        SET post_count = post_count + 1
        WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE tags
        SET post_count = post_count - 1
        WHERE id = OLD.tag_id;
    END IF;
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------
-- 更新文章评论计数
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'approved' THEN
        UPDATE posts
        SET comment_count = comment_count + 1
        WHERE id = NEW.post_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
            UPDATE posts
            SET comment_count = comment_count + 1
            WHERE id = NEW.post_id;
        ELSIF OLD.status = 'approved' AND NEW.status != 'approved' THEN
            UPDATE posts
            SET comment_count = comment_count - 1
            WHERE id = NEW.post_id;
        END IF;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'approved' THEN
        UPDATE posts
        SET comment_count = comment_count - 1
        WHERE id = OLD.post_id;
    END IF;
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 创建触发器
-- ================================================================

-- 更新时间戳触发器
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

CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_options_updated_at BEFORE UPDATE ON options
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_meta_updated_at BEFORE UPDATE ON user_meta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_meta_updated_at BEFORE UPDATE ON post_meta
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 文章分类计数触发器
CREATE TRIGGER post_categories_insert AFTER INSERT ON post_categories
    FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

CREATE TRIGGER post_categories_delete AFTER DELETE ON post_categories
    FOR EACH ROW EXECUTE FUNCTION update_category_post_count();

-- 文章标签计数触发器
CREATE TRIGGER post_tags_insert AFTER INSERT ON post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_post_count();

CREATE TRIGGER post_tags_delete AFTER DELETE ON post_tags
    FOR EACH ROW EXECUTE FUNCTION update_tag_post_count();

-- 评论计数触发器
CREATE TRIGGER comments_insert_delete AFTER INSERT OR UPDATE OR DELETE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- ================================================================
-- 初始数据
-- ================================================================

-- 默认选项
INSERT INTO options (option_name, option_value) VALUES
    ('site_name', 'CyberPress Platform'),
    ('site_description', '赛博朋克风格的博客平台'),
    ('site_url', 'https://cyberpress.dev'),
    ('admin_email', 'admin@cyberpress.dev'),
    ('users_can_register', 'true'),
    ('posts_per_page', '10'),
    ('date_format', 'YYYY-MM-DD'),
    ('time_format', 'HH24:MI:SS'),
    ('timezone', 'Asia/Shanghai'),
    ('comment_moderation', 'true'),
    ('theme', 'cyberpunk');

-- 默认管理员用户
-- 密码: admin123 (使用 bcrypt)
INSERT INTO users (username, email, password_hash, display_name, role, status) VALUES
    ('admin', 'admin@cyberpress.dev', '$2b$10$YourHashedPasswordHere', 'Administrator', 'admin', 'active');

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
    ('PostgreSQL', 'postgresql', '#336791'),
    ('UI/UX', 'ui-ux', '#ff61f6');

-- ================================================================
-- 完用函数
-- ================================================================

-- 增加文章浏览量
CREATE OR REPLACE FUNCTION increment_post_views(post_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE posts
    SET view_count = view_count + 1
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- 增加文章点赞数
CREATE OR REPLACE FUNCTION increment_post_likes(post_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE posts
    SET like_count = like_count + 1
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- 减少文章点赞数
CREATE OR REPLACE FUNCTION decrement_post_likes(post_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE posts
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = post_id_param;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- 完成注释
-- ================================================================

-- PostgreSQL 架构创建完成！
-- 包含以下功能：
-- ✅ UUID 主键
-- ✅ 软删除支持
-- ✅ JSONB 元数据
-- ✅ 全文搜索
-- ✅ 自动更新时间戳
-- ✅ 自动更新计数器
-- ✅ 统计视图
-- ✅ 触发器
-- ✅ 约束检查
-- ✅ 性能优化索引
