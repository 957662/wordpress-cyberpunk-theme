-- CyberPress Platform - 初始化数据脚本
-- 包含默认管理员、示例内容等

-- ============================================
-- 管理员账户
-- ============================================

-- 默认管理员：admin / password123 (请在生产环境中修改)
INSERT INTO users (username, email, password_hash, display_name, role, is_verified, email_verified_at) VALUES
('admin', 'admin@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc0i', 'Administrator', 'admin', TRUE, CURRENT_TIMESTAMP),
('editor', 'editor@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc0i', 'Editor', 'editor', TRUE, CURRENT_TIMESTAMP),
('author', 'author@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc0i', 'Author', 'author', TRUE, CURRENT_TIMESTAMP);

-- ============================================
-- 默认分类
-- ============================================

INSERT INTO categories (name, slug, description, sort_order) VALUES
('Technology', 'technology', 'Technology and programming articles', 1),
('Design', 'design', 'UI/UX and graphic design', 2),
('Development', 'development', 'Software development tutorials', 3),
('AI & Machine Learning', 'ai-machine-learning', 'Artificial intelligence and ML', 4),
('Cybersecurity', 'cybersecurity', 'Security best practices', 5),
('Web Development', 'web-development', 'Frontend and backend web dev', 6),
('Mobile Dev', 'mobile-development', 'iOS and Android development', 7),
('DevOps', 'devops', 'Infrastructure and operations', 8),
('Database', 'database', 'Database design and optimization', 9),
('Career', 'career', 'Career advice and growth', 10);

-- ============================================
-- 默认标签
-- ============================================

INSERT INTO tags (name, slug) VALUES
('JavaScript', 'javascript'),
('TypeScript', 'typescript'),
('Python', 'python'),
('React', 'react'),
('Next.js', 'nextjs'),
('Vue.js', 'vuejs'),
('Node.js', 'nodejs'),
('PostgreSQL', 'postgresql'),
('Docker', 'docker'),
('Kubernetes', 'kubernetes'),
('AWS', 'aws'),
('Linux', 'linux'),
('Git', 'git'),
('CI/CD', 'ci-cd'),
('Testing', 'testing'),
('Security', 'security'),
('Performance', 'performance'),
('API', 'api'),
('REST', 'rest'),
('GraphQL', 'graphql'),
('CSS', 'css'),
('TailwindCSS', 'tailwindcss'),
('UI/UX', 'ui-ux'),
('Architecture', 'architecture'),
('Best Practices', 'best-practices'),
('Tutorial', 'tutorial'),
('Tips', 'tips'),
('News', 'news'),
('Tools', 'tools');

-- ============================================
-- 示例文章
-- ============================================

INSERT INTO posts (
    author_id,
    title,
    slug,
    excerpt,
    content,
    status,
    post_type,
    is_featured,
    published_at
) VALUES
(1, 'Welcome to CyberPress Platform', 'welcome-to-cyberpress-platform',
'A next-generation blogging platform with cyberpunk aesthetics.',
'# Welcome to CyberPress

This is a cutting-edge blogging platform built with modern technologies.

## Features

- Modern UI with cyberpunk aesthetics
- WordPress REST API integration
- Real-time comments
- Advanced search
- And much more!

Stay tuned for amazing content.',
'publish', 'post', TRUE, CURRENT_TIMESTAMP),

(2, 'Getting Started with Next.js 14', 'getting-started-with-nextjs-14',
'A comprehensive guide to Next.js 14 App Router and its features.',
'# Getting Started with Next.js 14

Next.js 14 brings powerful new features to the table.

## App Router

The new App Router is built on React Server Components.

## Server Actions

Handle form submissions and data mutations seamlessly.',
'publish', 'post', TRUE, CURRENT_TIMESTAMP - INTERVAL '2 days'),

(3, 'PostgreSQL Best Practices', 'postgresql-best-practices',
'Learn how to design and optimize PostgreSQL databases.',
'# PostgreSQL Best Practices

Database optimization is crucial for application performance.

## Index Design

Create indexes strategically based on query patterns.

## Query Optimization

Use EXPLAIN ANALYZE to understand query performance.',
'publish', 'post', FALSE, CURRENT_TIMESTAMP - INTERVAL '5 days'),

(3, 'Building REST APIs with WordPress', 'building-rest-apis-with-wordpress',
'Leverage WordPress as a headless CMS for modern applications.',
'# WordPress REST API

WordPress can serve as a powerful headless CMS.

## Authentication

Use JWT tokens for secure API authentication.

## Custom Endpoints

Extend the API with custom endpoints for specific needs.',
'publish', 'post', FALSE, CURRENT_TIMESTAMP - INTERVAL '7 days'),

(1, 'Cyberpunk Design Trends 2024', 'cyberpunk-design-trends-2024',
'Explore the latest cyberpunk design trends and aesthetics.',
'# Cyberpunk Design Trends

Cyberpunk aesthetics continue to influence modern web design.

## Neon Colors

Vibrant neon colors against dark backgrounds create striking contrasts.

## Glitch Effects

Intentional digital glitches add character to the design.',
'publish', 'post', FALSE, CURRENT_TIMESTAMP - INTERVAL '10 days');

-- 关联分类和标签
INSERT INTO post_categories (post_id, category_id) VALUES
(1, 3), (2, 6), (2, 1), (3, 9), (4, 6), (5, 2);

INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 1), (2, 4), (2, 5), (3, 8), (4, 6), (5, 23);

-- ============================================
-- 示例评论
-- ============================================

INSERT INTO comments (
    post_id,
    author_id,
    author_name,
    author_email,
    content,
    status
) VALUES
(1, 2, 'Editor', 'editor@cyberpress.dev', 'Great article! Looking forward to more content.', 'approved'),
(1, 3, 'Author', 'author@cyberpress.dev', 'The platform looks amazing!', 'approved'),
(2, 1, 'Admin', 'admin@cyberpress.dev', 'Excellent overview of Next.js 14 features.', 'approved'),
(2, 3, 'Author', 'author@cyberpress.dev', 'Server Actions are a game changer!', 'approved'),
(3, 2, 'Editor', 'editor@cyberpress.dev', 'Very helpful database tips.', 'approved');

-- ============================================
-- 示例作品集
-- ============================================

INSERT INTO portfolios (
    author_id,
    title,
    slug,
    description,
    content,
    status,
    technologies,
    is_featured,
    sort_order
) VALUES
(1, 'CyberPress Platform', 'cyberpress-platform',
'A modern blogging platform with cyberpunk aesthetics',
'# CyberPress Platform

Built with Next.js 14 and WordPress REST API.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- WordPress REST API
- PostgreSQL',
'completed', ARRAY['Next.js', 'TypeScript', 'TailwindCSS', 'WordPress', 'PostgreSQL'], TRUE, 1),

(2, 'E-Commerce Dashboard', 'ecommerce-dashboard',
'A comprehensive admin dashboard for e-commerce',
'# E-Commerce Dashboard

Real-time analytics and order management.

## Features

- Real-time data visualization
- Order management
- Inventory tracking
- Customer analytics',
'completed', ARRAY['React', 'TypeScript', 'D3.js', 'Node.js'], TRUE, 2),

(3, 'AI Content Generator', 'ai-content-generator',
'AI-powered content generation tool',
'# AI Content Generator

Leverage GPT models for content creation.

## Features

- Multiple AI models
- Custom prompts
- Content templates
- SEO optimization',
'in-progress', ARRAY['Python', 'FastAPI', 'OpenAI', 'React'], FALSE, 3);

-- ============================================
-- 系统配置（存储在 meta 表中）
-- ============================================

-- 创建系统配置表（如果不存在）
CREATE TABLE IF NOT EXISTS settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO settings (key, value, description) VALUES
('site.title', '"CyberPress Platform"', '网站标题'),
('site.description', '"A next-generation blogging platform"', '网站描述'),
('site.keywords', '["blog", "tech", "programming", "cyberpunk"]', '网站关键词'),
('site.logo', '"/logo.png"', '网站Logo'),
('site.icon', '"/favicon.ico"', '网站图标'),

('seo.title_template', '"%s | CyberPress"', '标题模板'),
('seo.description_length', '160', '描述长度限制'),

('comments.auto_approve', 'false', '自动审核评论'),
('comments.require_email', 'true', '评论需要邮箱'),
('comments.allow_guest', 'true', '允许访客评论'),

('pagination.posts_per_page', '10', '每页文章数'),
('pagination.portfolios_per_page', '12', '每页作品数'),

('upload.max_file_size', '10485760', '最大文件上传大小(10MB)'),
('upload.allowed_types', '["image/jpeg", "image/png", "image/gif", "image/webp"]', '允许的文件类型'),

('security.session_lifetime', '604800', '会话生命周期(7天)'),
('security.max_login_attempts', '5', '最大登录尝试次数'),
('security.lockout_duration', '900', '账户锁定时长(15分钟)'),

('analytics.enabled', 'true', '启用分析'),
('analytics.retention_days', '90', '数据保留天数'),

('cache.enabled', 'true', '启用缓存'),
('cache.ttl', '3600', '缓存TTL(1小时)');

-- ============================================
-- 默认通知模板
-- ============================================

CREATE TABLE IF NOT EXISTS notification_templates (
    id BIGSERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE,
    title_template TEXT NOT NULL,
    content_template TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notification_templates (type, title_template, content_template) VALUES
('comment', 'New Comment on {{post_title}}', '<p>{{author_name}} commented:</p><blockquote>{{comment_content}}</blockquote>'),
('comment_reply', 'Reply to Your Comment', '<p>{{author_name}} replied to your comment:</p><blockquote>{{comment_content}}</blockquote>'),
('like', '{{liker_name}} liked your post', '<p>Your post "{{post_title}}" received a new like!</p>'),
('follow', 'New Follower', '<p>{{follower_name}} started following you!</p>'),
('mention', 'You were mentioned', '<p>{{author_name}} mentioned you in a comment:</p><blockquote>{{comment_content}}</blockquote>'),
('post_published', 'New Post Published', '<p>{{author_name}} published a new post: "{{post_title}}"</p>');

-- ============================================
-- 权限角色配置
-- ============================================

CREATE TABLE IF NOT EXISTS role_permissions (
    role VARCHAR(50) PRIMARY KEY,
    permissions JSONB NOT NULL DEFAULT '[]',
    description TEXT
);

INSERT INTO role_permissions (role, permissions, description) VALUES
('admin', '["*"]', 'Full administrative access'),
('editor', '["posts.create", "posts.edit", "posts.delete", "posts.publish", "comments.moderate", "media.upload", "media.manage"]', 'Can manage all content'),
('author', '["posts.create", "posts.edit.own", "posts.delete.own", "media.upload"]', 'Can create and manage own posts'),
('contributor', '["posts.create", "posts.edit.own"]', 'Can create posts but cannot publish'),
('subscriber', '["comments.create", "posts.read"]', 'Basic user permissions');

-- ============================================
-- 创建数据库视图用于常用查询
-- ============================================

-- 文章详情视图（包含作者、分类、标签）
CREATE OR REPLACE VIEW v_post_details AS
SELECT
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    p.content,
    p.featured_image,
    p.status,
    p.view_count,
    p.like_count,
    p.comment_count,
    p.published_at,
    p.created_at,
    p.updated_at,
    u.id as author_id,
    u.username as author_username,
    u.display_name as author_name,
    u.avatar_url as author_avatar,
    ARRAY_AGG(DISTINCT jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug))
        FILTER (WHERE c.id IS NOT NULL) as categories,
    ARRAY_AGG(DISTINCT jsonb_build_object('id', t.id, 'name', t.name, 'slug', t.slug))
        FILTER (WHERE t.id IS NOT NULL) as tags
FROM posts p
JOIN users u ON p.author_id = u.id
LEFT JOIN post_categories pc ON p.id = pc.post_id
LEFT JOIN categories c ON pc.category_id = c.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
GROUP BY p.id, u.id;

-- 评论详情视图（包含回复）
CREATE OR REPLACE VIEW v_comment_threads AS
WITH RECURSIVE comment_tree AS (
    -- 基础评论
    SELECT
        c.id,
        c.post_id,
        c.parent_id,
        c.author_id,
        c.author_name,
        c.author_email,
        c.content,
        c.status,
        c.like_count,
        c.created_at,
        u.avatar_url,
        0 as depth,
        ARRAY[c.id] as path
    FROM comments c
    LEFT JOIN users u ON c.author_id = u.id
    WHERE c.parent_id IS NULL

    UNION ALL

    -- 回复
    SELECT
        c.id,
        c.post_id,
        c.parent_id,
        c.author_id,
        c.author_name,
        c.author_email,
        c.content,
        c.status,
        c.like_count,
        c.created_at,
        u.avatar_url,
        ct.depth + 1,
        ct.path || c.id
    FROM comments c
    JOIN comment_tree ct ON c.parent_id = ct.id
    LEFT JOIN users u ON c.author_id = u.id
)
SELECT * FROM comment_tree ORDER BY path;

-- ============================================
-- 初始化完成
-- ============================================

-- 创建初始化标记
CREATE TABLE IF NOT EXISTS system_info (
    key VARCHAR(50) PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO system_info (key, value, updated_at) VALUES
('version', '1.0.0', CURRENT_TIMESTAMP),
('initialized_at', CURRENT_TIMESTAMP::TEXT, CURRENT_TIMESTAMP)
ON CONFLICT (key) DO NOTHING;

-- 输出初始化信息
DO $$
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'CyberPress Platform Initialized!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Default Admin: admin / password123';
    RAISE NOTICE 'Default Editor: editor / password123';
    RAISE NOTICE 'Default Author: author / password123';
    RAISE NOTICE '========================================';
    RAISE NOTICE '⚠️  IMPORTANT: Change default passwords!';
    RAISE NOTICE '========================================';
END $$;
