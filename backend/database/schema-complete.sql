-- =====================================================
-- CyberPress Platform - 数据库设计 (PostgreSQL)
-- =====================================================
-- 版本: 1.0.0
-- 创建日期: 2026-03-07
-- 描述: 赛博朋克风格博客平台核心数据库架构
-- =====================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- 全文搜索

-- =====================================================
-- 1. 用户表 (users)
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    bio TEXT,
    website VARCHAR(255),
    location VARCHAR(100),
    role VARCHAR(20) DEFAULT 'subscriber' CHECK (role IN ('admin', 'editor', 'author', 'subscriber')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned', 'pending')),
    email_verified_at TIMESTAMP,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 全文搜索索引
CREATE INDEX idx_users_search ON users USING gin(
    to_tsvector('english', coalesce(username, '') || ' ' || coalesce(display_name, '') || ' ' || coalesce(bio, ''))
);

-- =====================================================
-- 2. 文章表 (posts)
-- =====================================================
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    content_html TEXT,
    featured_image VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'pending', 'private', 'trash')),
    post_type VARCHAR(20) DEFAULT 'post' CHECK (post_type IN ('post', 'page', 'portfolio')),
    comment_status VARCHAR(20) DEFAULT 'open' CHECK (comment_status IN ('open', 'closed')),
    ping_status VARCHAR(20) DEFAULT 'open',
    password VARCHAR(255),
    is_featured BOOLEAN DEFAULT false,
    is_sticky BOOLEAN DEFAULT false,
    view_count BIGINT DEFAULT 0,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 索引
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_post_type ON posts(post_type);
CREATE INDEX idx_posts_is_featured ON posts(is_featured);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_view_count ON posts(view_count DESC);
CREATE INDEX idx_posts_like_count ON posts(like_count DESC);

-- 全文搜索索引
CREATE INDEX idx_posts_search ON posts USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(content, ''))
);

-- GIN 索引用于快速查找
CREATE INDEX idx_posts_tags ON posts USING gin(to_tsvector('english', coalesce(content, '')));

-- =====================================================
-- 3. 分类表 (categories)
-- =====================================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    icon VARCHAR(50),
    color VARCHAR(7),  -- 十六进制颜色代码
    image VARCHAR(500),
    post_count INT DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- =====================================================
-- 4. 标签表 (tags)
-- =====================================================
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7),
    post_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_post_count ON tags(post_count DESC);

-- =====================================================
-- 5. 文章分类关联表 (post_categories)
-- =====================================================
CREATE TABLE post_categories (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, category_id)
);

-- 索引
CREATE INDEX idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX idx_post_categories_category_id ON post_categories(category_id);

-- =====================================================
-- 6. 文章标签关联表 (post_tags)
-- =====================================================
CREATE TABLE post_tags (
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id, tag_id)
);

-- 索引
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- =====================================================
-- 7. 评论表 (comments)
-- =====================================================
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    author_name VARCHAR(100),
    author_email VARCHAR(255),
    author_url VARCHAR(255),
    author_ip VARCHAR(45),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
    agent VARCHAR(255),
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- 索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- 全文搜索索引
CREATE INDEX idx_comments_search ON comments USING gin(
    to_tsvector('english', coalesce(content, ''))
);

-- =====================================================
-- 8. 点赞表 (likes)
-- =====================================================
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('post', 'comment', 'portfolio')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);

-- 索引
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_type, target_id);
CREATE INDEX idx_likes_created_at ON likes(created_at DESC);

-- =====================================================
-- 9. 收藏表 (bookmarks)
-- =====================================================
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    folder_name VARCHAR(50) DEFAULT 'default',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 索引
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_post_id ON bookmarks(post_id);
CREATE INDEX idx_bookmarks_folder ON bookmarks(user_id, folder_name);

-- =====================================================
-- 10. 关注表 (follows)
-- =====================================================
CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- 索引
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);

-- =====================================================
-- 11. 通知表 (notifications)
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('comment', 'like', 'follow', 'mention', 'system')),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    link VARCHAR(500),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- =====================================================
-- 12. 媒体表 (media)
-- =====================================================
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    dimensions VARCHAR(20),  -- widthxheight
    alt_text VARCHAR(255),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_media_user_id ON media(user_id);
CREATE INDEX idx_media_mime_type ON media(mime_type);
CREATE INDEX idx_media_created_at ON media(created_at DESC);

-- =====================================================
-- 13. 阅读进度表 (reading_progress)
-- =====================================================
CREATE TABLE reading_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    progress DECIMAL(5,2) DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    last_position INT DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- 索引
CREATE INDEX idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX idx_reading_progress_post_id ON reading_progress(post_id);
CREATE INDEX idx_reading_progress_is_completed ON reading_progress(is_completed);

-- =====================================================
-- 14. 作品集表 (portfolio)
-- =====================================================
CREATE TABLE portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    content TEXT,
    featured_image VARCHAR(500),
    gallery TEXT[],  -- 图片数组
    technologies VARCHAR(50)[],  -- 技术栈数组
    project_url VARCHAR(255),
    github_url VARCHAR(255),
    demo_url VARCHAR(255),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'private')),
    sort_order INT DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    like_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_portfolio_author_id ON portfolio(author_id);
CREATE INDEX idx_portfolio_slug ON portfolio(slug);
CREATE INDEX idx_portfolio_status ON portfolio(status);
CREATE INDEX idx_portfolio_sort_order ON portfolio(sort_order);

-- 全文搜索索引
CREATE INDEX idx_portfolio_search ON portfolio USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- =====================================================
-- 15. 邮件订阅表 (newsletter_subscribers)
-- =====================================================
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced')),
    confirmation_token VARCHAR(255),
    unsubscribe_token VARCHAR(255),
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    unsubscribed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);

-- =====================================================
-- 16. 系统设置表 (settings)
-- =====================================================
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(20) DEFAULT 'string' CHECK (type IN ('string', 'integer', 'boolean', 'json')),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_settings_key ON settings(key);

-- =====================================================
-- 17. 搜索历史表 (search_history)
-- =====================================================
CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    query VARCHAR(255) NOT NULL,
    results_count INT DEFAULT 0,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_query ON search_history USING gin(to_tsvector('english', query));
CREATE INDEX idx_search_history_created_at ON search_history(created_at DESC);

-- =====================================================
-- 18. 活动日志表 (activity_logs)
-- =====================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- JSONB 索引用于快速查询元数据
CREATE INDEX idx_activity_logs_metadata ON activity_logs USING gin(metadata);

-- =====================================================
-- 触发器 (Triggers)
-- =====================================================

-- 更新 updated_at 字段的触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要的表添加 updated_at 触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 视图 (Views)
-- =====================================================

-- 文章统计视图
CREATE VIEW post_stats AS
SELECT
    p.id,
    p.title,
    p.author_id,
    u.username AS author_name,
    p.status,
    p.view_count,
    p.like_count,
    p.comment_count,
    COUNT(DISTINCT pc.category_id) AS category_count,
    COUNT(DISTINCT pt.tag_id) AS tag_count,
    p.published_at
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN post_tags pt ON p.id = pt.post_id
GROUP BY p.id, u.username;

-- 用户统计视图
CREATE VIEW user_stats AS
SELECT
    u.id,
    u.username,
    u.display_name,
    u.role,
    COUNT(DISTINCT p.id) AS post_count,
    COUNT(DISTINCT c.id) AS comment_count,
    COUNT(DISTINCT l.id) AS like_count,
    SUM(p.view_count) AS total_views
FROM users u
LEFT JOIN posts p ON u.id = p.author_id
LEFT JOIN comments c ON u.id = c.author_id
LEFT JOIN likes l ON u.id = l.user_id
GROUP BY u.id;

-- =====================================================
-- 初始数据 (Seed Data)
-- =====================================================

-- 创建默认管理员用户（密码: admin123，需要在应用层加密）
INSERT INTO users (username, email, password_hash, display_name, role, status) VALUES
('admin', 'admin@cyberpress.com', '$2b$10$placeholder_hash_will_be_replaced', 'CyberPress Admin', 'admin', 'active'),
('editor', 'editor@cyberpress.com', '$2b$10$placeholder_hash_will_be_replaced', 'Content Editor', 'editor', 'active'),
('author', 'author@cyberpress.com', '$2b$10$placeholder_hash_will_be_replaced', 'Content Author', 'author', 'active');

-- 创建默认分类
INSERT INTO categories (name, slug, description, color) VALUES
('Technology', 'technology', 'Technology related posts', '#00f0ff'),
('Design', 'design', 'Design related posts', '#9d00ff'),
('Development', 'development', 'Development tutorials', '#ff0080'),
('Cybersecurity', 'cybersecurity', 'Cybersecurity articles', '#00ff88'),
('AI & Machine Learning', 'ai-ml', 'AI and ML content', '#f0ff00');

-- 创建默认标签
INSERT INTO tags (name, slug, color) VALUES
('JavaScript', 'javascript', '#f7df1e'),
('TypeScript', 'typescript', '#3178c6'),
('React', 'react', '#61dafb'),
('Next.js', 'nextjs', '#000000'),
('Cyberpunk', 'cyberpunk', '#00f0ff'),
('PostgreSQL', 'postgresql', '#336791'),
('UI/UX', 'uiux', '#ff61f6');

-- 插入系统设置
INSERT INTO settings (key, value, type, description) VALUES
('site_title', 'CyberPress', 'string', 'Site title'),
('site_description', 'A Cyberpunk Style Blog Platform', 'string', 'Site description'),
('posts_per_page', '10', 'integer', 'Number of posts per page'),
('allow_comments', 'true', 'boolean', 'Allow comments on posts'),
('allow_registrations', 'true', 'boolean', 'Allow user registrations'),
('maintenance_mode', 'false', 'boolean', 'Maintenance mode');

-- =====================================================
-- 性能优化建议
-- =====================================================

-- 1. 定期清理已删除数据
-- DELETE FROM comments WHERE deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '30 days';

-- 2. 优化表统计信息
-- ANALYZE users, posts, comments, categories, tags;

-- 3. 重建索引（如果性能下降）
-- REINDEX TABLE posts;
-- REINDEX TABLE comments;

-- 4. 定期清理搜索历史
-- DELETE FROM search_history WHERE created_at < NOW() - INTERVAL '90 days';

-- =====================================================
-- 权限设置 (根据实际需求调整)
-- =====================================================

-- 创建只读用户（用于备份和报告）
-- CREATE USER cyberpress_readonly WITH PASSWORD 'secure_password';
-- GRANT CONNECT ON DATABASE cyberpress TO cyberpress_readonly;
-- GRANT USAGE ON SCHEMA public TO cyberpress_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO cyberpress_readonly;

-- 创建应用用户（用于应用连接）
-- CREATE USER cyberpress_app WITH PASSWORD 'secure_password';
-- GRANT CONNECT ON DATABASE cyberpress TO cyberpress_app;
-- GRANT USAGE ON SCHEMA public TO cyberpress_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO cyberpress_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO cyberpress_app;

-- =====================================================
-- 备注和文档
-- =====================================================

/*
表说明:
1. users - 用户账户信息
2. posts - 文章/页面内容
3. categories - 分类系统
4. tags - 标签系统
5. post_categories - 文章与分类多对多关系
6. post_tags - 文章与标签多对多关系
7. comments - 评论系统
8. likes - 点赞系统
9. bookmarks - 收藏系统
10. follows - 用户关注关系
11. notifications - 通知系统
12. media - 媒体文件管理
13. reading_progress - 阅读进度追踪
14. portfolio - 作品集项目管理
15. newsletter_subscribers - 邮件订阅
16. settings - 系统配置
17. search_history - 搜索历史
18. activity_logs - 活动日志

性能特性:
- 使用 UUID 作为主键，避免 ID 冲突
- 全文搜索支持 (pg_trgm 扩展)
- 优化的索引策略
- 视图用于常用查询
- 触发器自动更新时间戳
- JSONB 支持灵活的数据结构

扩展性:
- 支持软删除 (deleted_at)
- 支持多语言扩展
- 支持自定义字段 (通过 metadata JSONB)
- 支持分片和分区
*/
