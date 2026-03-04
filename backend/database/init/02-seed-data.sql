-- ============================================================================
-- CyberPress Platform - Seed Data Script
-- PostgreSQL Database Schema v1.0
-- ============================================================================
-- 说明: 插入示例数据用于测试和开发
-- 作者: CyberPress Team
-- 创建日期: 2026-03-05
-- 用法: psql -U postgres -d cyberpress_platform -f 02-seed-data.sql
-- ============================================================================

-- 设置客户端编码
SET client_encoding = 'UTF8';

-- 设置搜索路径
SET search_path TO public, pg_catalog;

-- ============================================================================
-- 1. 创建测试用户
-- ============================================================================

-- 禁用触发器以提高批量插入性能
SET session_replication_role = replica;

-- 插入测试用户
INSERT INTO users (email, username, password_hash, role, status, email_verified_at, last_login_at)
VALUES
    ('editor@cyberpress.com', 'editor', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc8i', 'editor', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('author1@cyberpress.com', 'author_one', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc8i', 'author', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('author2@cyberpress.com', 'author_two', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc8i', 'author', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('user1@cyberpress.com', 'user_one', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc8i', 'subscriber', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('user2@cyberpress.com', 'user_two', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc8i', 'subscriber', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('test@cyberpress.com', 'test_user', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc8i', 'subscriber', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 为测试用户创建资料
INSERT INTO user_profiles (user_id, display_name, bio, avatar_url, website, location, followers_count, following_count, posts_count)
SELECT
    id,
    CASE
        WHEN username = 'editor' THEN 'Chief Editor'
        WHEN username = 'author_one' THEN 'Tech Writer'
        WHEN username = 'author_two' THEN 'Design Enthusiast'
        WHEN username = 'user_one' THEN 'Regular User'
        WHEN username = 'user_two' THEN 'Community Member'
        WHEN username = 'test_user' THEN 'Test Account'
        ELSE username
    END,
    CASE
        WHEN username = 'editor' THEN 'Managing editor and content strategist'
        WHEN username = 'author_one' THEN 'Passionate about technology and innovation'
        WHEN username = 'author_two' THEN 'Designer and creative thinker'
        ELSE 'Just a regular user enjoying the platform'
    END,
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || username,
    CASE
        WHEN username IN ('editor', 'author_one') THEN 'https://example.com'
        ELSE NULL
    END,
    CASE
        WHEN username = 'editor' THEN 'Shanghai, China'
        WHEN username = 'author_one' THEN 'Beijing, China'
        WHEN username = 'author_two' THEN 'Shenzhen, China'
        ELSE NULL
    END,
    CASE
        WHEN username = 'editor' THEN 150
        WHEN username = 'author_one' THEN 89
        WHEN username = 'author_two' THEN 67
        ELSE FLOOR(RANDOM() * 50)
    END,
    CASE
        WHEN username = 'editor' THEN 45
        WHEN username = 'author_one' THEN 78
        WHEN username = 'author_two' THEN 56
        ELSE FLOOR(RANDOM() * 30)
    END,
    0
FROM users
WHERE username IN ('editor', 'author_one', 'author_two', 'user_one', 'user_two', 'test_user')
ON CONFLICT (user_id) DO NOTHING;

-- 为测试用户创建设置
INSERT INTO user_settings (user_id, theme, language, timezone, email_notifications, push_notifications)
SELECT
    id,
    CASE
        WHEN username = 'editor' THEN 'light'
        ELSE 'dark'
    END,
    'zh-CN',
    'Asia/Shanghai',
    true,
    true
FROM users
WHERE username IN ('editor', 'author_one', 'author_two', 'user_one', 'user_two', 'test_user')
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- 2. 创建更多分类和标签
-- ============================================================================

-- 插入更多分类
INSERT INTO categories (name, slug, description, color, icon, display_order)
VALUES
    ('Programming', 'programming', 'Programming languages and coding tutorials', '#00f0ff', 'code', 5),
    ('AI & Machine Learning', 'ai-machine-learning', 'Artificial Intelligence and ML articles', '#9d00ff', 'brain', 6),
    ('Cybersecurity', 'cybersecurity', 'Security best practices and news', '#ff0080', 'shield', 7),
    ('Mobile Development', 'mobile-development', 'iOS and Android development', '#00ff88', 'smartphone', 8),
    ('DevOps', 'devops', 'DevOps practices and tools', '#ff8800', 'server', 9),
    ('Cloud Computing', 'cloud-computing', 'Cloud services and architecture', '#0088ff', 'cloud', 10)
ON CONFLICT (slug) DO NOTHING;

-- 插入更多标签
INSERT INTO tags (name, slug, description, color)
VALUES
    ('JavaScript', 'javascript', 'JavaScript programming language', '#f7df1e'),
    ('Python', 'python', 'Python programming language', '#3776ab'),
    ('React', 'react', 'React JavaScript library', '#61dafb'),
    ('Next.js', 'nextjs', 'Next.js React framework', '#000000'),
    ('TypeScript', 'typescript', 'TypeScript programming language', '#3178c6'),
    ('Node.js', 'nodejs', 'Node.js runtime', '#339933'),
    ('PostgreSQL', 'postgresql', 'PostgreSQL database', '#336791'),
    ('Docker', 'docker', 'Docker containerization', '#2496ed'),
    ('Kubernetes', 'kubernetes', 'Kubernetes orchestration', '#326ce5'),
    ('GraphQL', 'graphql', 'GraphQL query language', '#e10098'),
    ('REST API', 'rest-api', 'RESTful API design', '#000000'),
    ('Microservices', 'microservices', 'Microservices architecture', '#000000'),
    ('Git', 'git', 'Git version control', '#f05032'),
    ('Linux', 'linux', 'Linux operating system', '#fcc624'),
    ('Security', 'security', 'Cybersecurity practices', '#ff0080')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. 创建示例文章
-- ============================================================================

-- 获取用户ID用于关联
DO $$
DECLARE
    v_admin_id BIGINT;
    v_editor_id BIGINT;
    v_author1_id BIGINT;
    v_author2_id BIGINT;
BEGIN
    SELECT id INTO v_admin_id FROM users WHERE username = 'admin';
    SELECT id INTO v_editor_id FROM users WHERE username = 'editor';
    SELECT id INTO v_author1_id FROM users WHERE username = 'author_one';
    SELECT id INTO v_author2_id FROM users WHERE username = 'author_two';

    -- 插入示例文章
    INSERT INTO posts (
        author_id, title, slug, content, excerpt,
        post_type, status, featured, featured_order,
        view_count, like_count, share_count, reading_time,
        published_at
    )
    VALUES
        -- 管理员的特色文章
        (v_admin_id,
         'Welcome to CyberPress Platform',
         'welcome-to-cyberpress-platform',
         '# Welcome to CyberPress Platform

This is an exciting new platform for tech enthusiasts, developers, and designers.

## Features

- Modern, responsive design
- Fast and secure
- Built with Next.js and PostgreSQL
- Cyberpunk-inspired UI

## Getting Started

Create an account and start sharing your thoughts with the community!

```javascript
console.log("Hello, CyberPress!");
```',
         'Welcome to our new platform built for the tech community.',
         'post',
         'publish',
         true,
         1,
         1520,
         89,
         23,
         5,
         CURRENT_TIMESTAMP - INTERVAL '7 days'
        ),

        -- 编辑的文章
        (v_editor_id,
         'The Future of Web Development in 2026',
         'future-of-web-development-2026',
         '# The Future of Web Development in 2026

Web development is evolving rapidly. Here are the trends to watch:

## 1. AI-Powered Development

Artificial intelligence is changing how we write code. Tools like GitHub Copilot are just the beginning.

## 2. Edge Computing

Running code closer to users means faster load times and better experiences.

## 3. WebAssembly

WebAssembly enables high-performance applications in the browser.

## Conclusion

The future is bright for web developers who embrace these changes.',
         'Exploring the latest trends in web development and what to expect in 2026.',
         'post',
         'publish',
         true,
         2,
         2340,
         156,
         45,
         8,
         CURRENT_TIMESTAMP - INTERVAL '5 days'
        ),

        -- 作者1的文章
        (v_author1_id,
         'Getting Started with Next.js 15',
         'getting-started-with-nextjs-15',
         '# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements.

## Installation

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

## New Features

- Improved performance
- Better TypeScript support
- Enhanced server components

## Conclusion

Next.js continues to be the best choice for React applications.',
         'A comprehensive guide to getting started with the latest version of Next.js.',
         'post',
         'publish',
         false,
         0,
         1876,
         92,
         34,
         6,
         CURRENT_TIMESTAMP - INTERVAL '3 days'
        ),

        (v_author1_id,
         'Building REST APIs with PostgreSQL',
         'building-rest-apis-with-postgresql',
         '# Building REST APIs with PostgreSQL

PostgreSQL is a powerful database for building APIs.

## Setting Up

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);
```

## Best Practices

- Use prepared statements
- Implement proper indexing
- Validate all inputs

## Security

Always use parameterized queries and implement proper authentication.',
         'Learn how to build secure and scalable REST APIs using PostgreSQL.',
         'post',
         'publish',
         false,
         0,
         1543,
         78,
         28,
         7,
         CURRENT_TIMESTAMP - INTERVAL '2 days'
        ),

        -- 作者2的文章
        (v_author2_id,
         'Modern UI Design Principles',
         'modern-ui-design-principles',
         '# Modern UI Design Principles

Great design is about more than aesthetics. It''s about creating intuitive experiences.

## Key Principles

1. **Consistency**: Use consistent colors, fonts, and spacing
2. **Accessibility**: Design for all users
3. **Performance**: Fast loading times are crucial
4. **Mobile-First**: Design for mobile first

## Color Theory

Understanding color psychology helps create better user experiences.

- Blue: Trust and professionalism
- Red: Energy and urgency
- Green: Growth and harmony',
         'Essential design principles for creating modern, user-friendly interfaces.',
         'post',
         'publish',
         true,
         3,
         2109,
         134,
         52,
         6,
         CURRENT_TIMESTAMP - INTERVAL '4 days'
        ),

        (v_author2_id,
         'Creating Accessible Web Applications',
         'creating-accessible-web-applications',
         '# Creating Accessible Web Applications

Accessibility is not optional - it''s essential.

## ARIA Labels

```html
<button aria-label="Close dialog">×</button>
```

## Keyboard Navigation

Ensure all interactive elements are keyboard accessible.

## Color Contrast

Meet WCAG AA standards for color contrast.

## Testing

Use screen readers and accessibility tools to test your applications.',
         'A guide to building web applications that are accessible to everyone.',
         'post',
         'publish',
         false,
         0,
         1234,
         67,
         21,
         5,
         CURRENT_TIMESTAMP - INTERVAL '1 day'
        ),

        -- 草稿文章
        (v_author1_id,
         'Advanced PostgreSQL Techniques',
         'advanced-postgresql-techniques',
         '# Advanced PostgreSQL Techniques

Coming soon...',
         'Learn advanced PostgreSQL features and optimization techniques.',
         'post',
         'draft',
         false,
         0,
         0,
         0,
         0,
         NULL,
         NULL
        ),

        (v_author2_id,
         'Design Systems in 2026',
         'design-systems-2026',
         '# Design Systems in 2026

Work in progress...',
         'Exploring modern design system architectures.',
         'post',
         'draft',
         false,
         0,
         0,
         0,
         0,
         NULL,
         NULL
        );

END $$;

-- ============================================================================
-- 4. 关联文章分类和标签
-- ============================================================================

-- 为文章分配分类
INSERT INTO post_categories (post_id, category_id)
SELECT
    p.id,
    c.id
FROM posts p
JOIN (
    VALUES
        ('welcome-to-cyberpress-platform', 'technology'),
        ('future-of-web-development-2026', 'programming'),
        ('getting-started-with-nextjs-15', 'programming'),
        ('building-rest-apis-with-postgresql', 'programming'),
        ('modern-ui-design-principles', 'design'),
        ('creating-accessible-web-applications', 'design')
) AS v(slug, category_slug)
ON p.slug = v.slug
JOIN categories c ON c.slug = v.category_slug
WHERE p.status = 'publish'
ON CONFLICT (post_id, category_id) DO NOTHING;

-- 为文章分配标签
INSERT INTO post_tags (post_id, tag_id)
SELECT
    p.id,
    t.id
FROM posts p
JOIN (
    VALUES
        ('welcome-to-cyberpress-platform', ARRAY['nextjs', 'web-development']),
        ('future-of-web-development-2026', ARRAY['web-development', 'javascript', 'rest-api']),
        ('getting-started-with-nextjs-15', ARRAY['nextjs', 'react', 'javascript', 'typescript']),
        ('building-rest-apis-with-postgresql', ARRAY['postgresql', 'rest-api', 'nodejs', 'security']),
        ('modern-ui-design-principles', ARRAY['ui-ux', 'design']),
        ('creating-accessible-web-applications', ARRAY['ui-ux', 'accessibility', 'web-development'])
) AS v(slug, tag_slugs)
ON p.slug = v.slug
JOIN tags t ON t.slug = ANY(v.tag_slugs)
WHERE p.status = 'publish'
ON CONFLICT (post_id, tag_id) DO NOTHING;

-- ============================================================================
-- 5. 创建示例评论
-- ============================================================================

INSERT INTO comments (
    post_id, author_id, content, status,
    like_count, created_at
)
SELECT
    p.id,
    u.id,
    CASE
        WHEN u.username = 'user_one' THEN 'Great article! Very informative and well-written.'
        WHEN u.username = 'user_two' THEN 'Thanks for sharing this. I learned a lot!'
        WHEN u.username = 'test_user' THEN 'This is exactly what I was looking for.'
        ELSE 'Interesting perspective!'
    END,
    'approved',
    FLOOR(RANDOM() * 20),
    p.published_at + (FLOOR(RANDOM() * 5) || ' days')::INTERVAL
FROM posts p
CROSS JOIN users u
WHERE p.status = 'publish'
AND u.username IN ('user_one', 'user_two', 'test_user')
AND p.published_at IS NOT NULL
AND (p.slug = 'welcome-to-cyberpress-platform' OR p.slug = 'future-of-web-development-2026' OR p.slug = 'getting-started-with-nextjs-15')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. 创建关注关系
-- ============================================================================

-- 让用户互相关注
INSERT INTO user_follows (follower_id, following_id, status)
SELECT
    u1.id AS follower_id,
    u2.id AS following_id,
    'active'
FROM users u1
CROSS JOIN users u2
WHERE u1.id != u2.id
AND u1.username IN ('user_one', 'user_two', 'test_user')
AND u2.username IN ('editor', 'author_one', 'author_two')
AND NOT EXISTS (
    SELECT 1 FROM user_follows uf
    WHERE uf.follower_id = u1.id AND uf.following_id = u2.id
)
ON CONFLICT (follower_id, following_id) DO NOTHING;

-- 更新用户关注数
UPDATE user_profiles
SET followers_count = (
    SELECT COUNT(*) FROM user_follows WHERE following_id = user_profiles.user_id AND status = 'active'
),
following_count = (
    SELECT COUNT(*) FROM user_follows WHERE follower_id = user_profiles.user_id AND status = 'active'
)
WHERE user_id IN (SELECT id FROM users WHERE username IN ('editor', 'author_one', 'author_two', 'user_one', 'user_two', 'test_user'));

-- ============================================================================
-- 7. 创建示例媒体
-- ============================================================================

INSERT INTO media (
    author_id, title, filename, file_path, file_url,
    file_size, mime_type, file_type,
    alt_text, post_count
)
SELECT
    u.id,
    CASE
        WHEN u.username = 'author_one' THEN 'Code Editor Screenshot'
        WHEN u.username = 'author_two' THEN 'UI Design Mockup'
        ELSE 'Featured Image'
    END,
    CASE
        WHEN u.username = 'author_one' THEN 'code-editor.png'
        WHEN u.username = 'author_two' THEN 'ui-design.png'
        ELSE 'featured-image.jpg'
    END,
    CASE
        WHEN u.username = 'author_one' THEN '/uploads/code-editor.png'
        WHEN u.username = 'author_two' THEN '/uploads/ui-design.png'
        ELSE '/uploads/featured-image.jpg'
    END,
    CASE
        WHEN u.username = 'author_one' THEN 'https://cdn.cyberpress.com/code-editor.png'
        WHEN u.username = 'author_two' THEN 'https://cdn.cyberpress.com/ui-design.png'
        ELSE 'https://cdn.cyberpress.com/featured-image.jpg'
    END,
    FLOOR(RANDOM() * 1000000) + 100000,
    CASE
        WHEN u.username = 'author_one' THEN 'image/png'
        WHEN u.username = 'author_two' THEN 'image/png'
        ELSE 'image/jpeg'
    END,
    'image',
    CASE
        WHEN u.username = 'author_one' THEN 'Screenshot of a code editor'
        WHEN u.username = 'author_two' THEN 'UI design mockup'
        ELSE 'Featured article image'
    END,
    0
FROM users u
WHERE u.username IN ('admin', 'editor', 'author_one', 'author_two')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. 创建通知
-- ============================================================================

-- 为新关注创建通知
INSERT INTO notifications (
    user_id, sender_id, type, title, message,
    is_read, created_at
)
SELECT
    uf.following_id AS user_id,
    uf.follower_id AS sender_id,
    'follow',
    'New Follower',
    (SELECT display_name FROM user_profiles WHERE user_id = uf.follower_id) || ' started following you',
    false,
    CURRENT_TIMESTAMP - (FLOOR(RANDOM() * 10) || ' days')::INTERVAL
FROM user_follows uf
WHERE uf.status = 'active'
AND uf.created_at > CURRENT_TIMESTAMP - INTERVAL '30 days'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 9. 重新启用触发器
-- ============================================================================

SET session_replication_role = DEFAULT;

-- ============================================================================
-- 10. 更新统计
-- ============================================================================

-- 更新分类文章数
UPDATE categories SET post_count = (
    SELECT COUNT(*) FROM post_categories WHERE category_id = categories.id
);

-- 更新标签文章数
UPDATE tags SET post_count = (
    SELECT COUNT(*) FROM post_tags WHERE tag_id = tags.id
);

-- 更新用户文章数
UPDATE user_profiles SET posts_count = (
    SELECT COUNT(*) FROM posts WHERE author_id = user_profiles.user_id AND status = 'publish'
);

-- ============================================================================
-- 完成
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '==========================================';
    RAISE NOTICE '示例数据插入完成！';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '创建的测试账户：';
    RAISE NOTICE '  admin@cyberpress.com (密码: admin123)';
    RAISE NOTICE '  editor@cyberpress.com (密码: admin123)';
    RAISE NOTICE '  author1@cyberpress.com (密码: admin123)';
    RAISE NOTICE '  author2@cyberpress.com (密码: admin123)';
    RAISE NOTICE '  user1@cyberpress.com (密码: admin123)';
    RAISE NOTICE '  user2@cyberpress.com (密码: admin123)';
    RAISE NOTICE '  test@cyberpress.com (密码: admin123)';
    RAISE NOTICE '==========================================';
    RAISE NOTICE '示例数据统计：';
    RAISE NOTICE '  用户: %',
        (SELECT COUNT(*) FROM users);
    RAISE NOTICE '  文章: %',
        (SELECT COUNT(*) FROM posts WHERE status = 'publish');
    RAISE NOTICE '  评论: %',
        (SELECT COUNT(*) FROM comments WHERE status = 'approved');
    RAISE NOTICE '  分类: %',
        (SELECT COUNT(*) FROM categories);
    RAISE NOTICE '  标签: %',
        (SELECT COUNT(*) FROM tags);
    RAISE NOTICE '==========================================';
END $$;
