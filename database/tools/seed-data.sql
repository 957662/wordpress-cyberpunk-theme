-- =====================================================
-- CyberPress Platform - Seed Data
-- 种子数据
-- =====================================================
-- Author: AI Development Team
-- Created: 2026-03-07
-- Version: 1.0.0
-- =====================================================

-- =====================================================
-- 1. 测试用户
-- =====================================================

INSERT INTO users (username, email, password_hash, display_name, bio, role, status) VALUES
('cyberadmin', 'admin@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5DaNyQPaGy9Wq', 'CyberAdmin', '系统管理员', 'admin', 'active'),
('neon_writer', 'writer@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5DaNyQPaGy9Wq', 'Neon Writer', '热爱科技的写作者', 'author', 'active'),
('pixel_designer', 'designer@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5DaNyQPaGy9Wq', 'Pixel Designer', 'UI/UX设计师', 'author', 'active'),
('code_ninja', 'ninja@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5DaNyQPaGy9Wq', 'Code Ninja', '全栈开发工程师', 'author', 'active'),
('data_wizard', 'wizard@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5DaNyQPaGy9Wq', 'Data Wizard', '数据科学家', 'author', 'active');

-- =====================================================
-- 2. 额外分类
-- =====================================================

INSERT INTO categories (name, slug, description, color, icon, sort_order) VALUES
('人工智能', 'artificial-intelligence', 'AI和机器学习相关文章', '#ff0055', 'robot', 6),
('区块链', 'blockchain', '区块链和加密货币', '#f7931a', 'link', 7),
('游戏开发', 'game-development', '游戏开发和设计', '#9b59b6', 'gamepad', 8),
('移动开发', 'mobile-development', 'iOS和Android开发', '#3498db', 'smartphone', 9),
('云计算', 'cloud-computing', '云服务和DevOps', '#00d4aa', 'cloud', 10);

-- =====================================================
-- 3. 额外标签
-- =====================================================

INSERT INTO tags (name, slug, description, color) VALUES
('Python', 'python', 'Python编程语言', '#3776ab'),
('JavaScript', 'javascript', 'JavaScript编程语言', '#f7df1e'),
('Go', 'go', 'Go编程语言', '#00add8'),
('Rust', 'rust', 'Rust编程语言', '#000000'),
('Vue.js', 'vuejs', 'Vue.js框架', '#42b883'),
('Angular', 'angular', 'Angular框架', '#dd0031'),
('Django', 'django', 'Django框架', '#092e20'),
('FastAPI', 'fastapi', 'FastAPI框架', '#009688'),
('TensorFlow', 'tensorflow', 'TensorFlow框架', '#ff6f00'),
('PyTorch', 'pytorch', 'PyTorch框架', '#ee4c2c'),
('Kubernetes', 'kubernetes', 'Kubernetes容器编排', '#326ce5'),
('AWS', 'aws', 'Amazon Web Services', '#ff9900'),
('Azure', 'azure', 'Microsoft Azure', '#0089d6'),
('MongoDB', 'mongodb', 'MongoDB数据库', '#47a248'),
('Redis', 'redis', 'Redis缓存', '#dc382d');

-- =====================================================
-- 4. 示例文章
-- =====================================================

-- 获取用户ID
DO $$
DECLARE
    admin_id UUID;
    author_id UUID;
    tech_cat_id UUID;
    ai_cat_id UUID;
BEGIN
    SELECT id INTO admin_id FROM users WHERE username = 'cyberadmin';
    SELECT id INTO author_id FROM users WHERE username = 'neon_writer';
    SELECT id INTO tech_cat_id FROM categories WHERE slug = 'tech';
    SELECT id INTO ai_cat_id FROM categories WHERE slug = 'artificial-intelligence';

    -- 插入示例文章
    INSERT INTO posts (author_id, title, slug, excerpt, content, status, post_type, published_at, is_featured) VALUES
    (admin_id,
     '欢迎来到 CyberPress Platform',
     'welcome-to-cyberpress-platform',
     '探索赛博朋克风格的博客平台，体验未来科技与文学的完美融合。',
     '# 欢迎来到 CyberPress Platform

这是一个基于 Next.js 和 PostgreSQL 构建的现代化博客平台，融合了赛博朋克美学设计和强大的技术架构。

## 主要特性

- 🚀 高性能架构
- 🎨 赛博朋克风格UI
- 📱 响应式设计
- 🔒 安全可靠
- ⚡ 快速加载

## 技术栈

- Next.js 15
- TypeScript
- PostgreSQL 15
- Docker

开始您的创作之旅吧！',
     'published',
     'post',
     CURRENT_TIMESTAMP - INTERVAL '7 days',
     TRUE),

    (author_id,
     '深度学习入门指南',
     'deep-learning-getting-started-guide',
     '从零开始学习深度学习的完整指南，涵盖理论基础和实践项目。',
     '# 深度学习入门指南

深度学习是人工智能的一个分支，它模仿人脑的工作方式来处理数据。

## 什么是深度学习？

深度学习是机器学习的一个子集，使用多层神经网络从数据中学习。

## 主要框架

- TensorFlow
- PyTorch
- Keras

## 学习路径

1. 数学基础
2. 编程基础
3. 深度学习理论
4. 实践项目',
     'published',
     'post',
     CURRENT_TIMESTAMP - INTERVAL '5 days',
     FALSE),

    (author_id,
     '2024年Web开发趋势',
     'web-development-trends-2024',
     '探索2024年最热门的Web开发技术和趋势。',
     '# 2024年Web开发趋势

## 前端技术

- Next.js 15
- React 19
- TypeScript 5.3
- Tailwind CSS 4

## 后端技术

- Node.js 22
- Go 1.22
- Rust 1.75

## 架构趋势

- 微前端
- Serverless
- 边缘计算',
     'published',
     'post',
     CURRENT_TIMESTAMP - INTERVAL '3 days',
     FALSE);

    -- 为文章添加分类和标签
    INSERT INTO post_categories (post_id, category_id, is_primary)
    SELECT p.id, tech_cat_id, TRUE
    FROM posts p
    WHERE p.slug = 'welcome-to-cyberpress-platform';

    INSERT INTO post_categories (post_id, category_id, is_primary)
    SELECT p.id, ai_cat_id, TRUE
    FROM posts p
    WHERE p.slug = 'deep-learning-getting-started-guide';

END $$;

-- =====================================================
-- 5. 示例评论
-- =====================================================

DO $$
DECLARE
    post_id UUID;
    user_id UUID;
BEGIN
    SELECT id INTO post_id FROM posts WHERE slug = 'welcome-to-cyberpress-platform' LIMIT 1;
    SELECT id INTO user_id FROM users WHERE username = 'pixel_designer' LIMIT 1;

    IF post_id IS NOT NULL AND user_id IS NOT NULL THEN
        INSERT INTO comments (post_id, author_id, author_name, author_email, content, status) VALUES
        (post_id, user_id, 'Pixel Designer', 'designer@cyberpress.dev', '太棒了！期待更多精彩内容。', 'approved'),

        (post_id, NULL, '匿名访客', 'guest@example.com', '设计非常酷炫！', 'approved');
    END IF;
END $$;

-- =====================================================
-- 6. 示例媒体
-- =====================================================

DO $$
DECLARE
    admin_id UUID;
BEGIN
    SELECT id INTO admin_id FROM users WHERE username = 'cyberadmin' LIMIT 1;

    IF admin_id IS NOT NULL THEN
        INSERT INTO media (uploader_id, file_name, file_path, file_url, file_size, mime_type, file_type, alt_text) VALUES
        (admin_id,
         'cyberpunk-city.jpg',
         '/uploads/2024/03/cyberpunk-city.jpg',
         'https://cdn.cyberpress.dev/uploads/2024/03/cyberpunk-city.jpg',
         2048576,
         'image/jpeg',
         'image',
         '赛博朋克城市夜景'),

        (admin_id,
         'neon-lights.jpg',
         '/uploads/2024/03/neon-lights.jpg',
         'https://cdn.cyberpress.dev/uploads/2024/03/neon-lights.jpg',
         1572864,
         'image/jpeg',
         'image',
         '霓虹灯光');
    END IF;
END $$;

-- =====================================================
-- 7. 示例作品集
-- =====================================================

DO $$
DECLARE
    author_id UUID;
BEGIN
    SELECT id INTO author_id FROM users WHERE username = 'code_ninja' LIMIT 1;

    IF author_id IS NOT NULL THEN
        INSERT INTO portfolios (author_id, title, slug, description, content, project_url, github_url, technologies, status, is_featured) VALUES
        (author_id,
         'AI 图像识别系统',
         'ai-image-recognition-system',
         '基于深度学习的图像识别系统',
         '# AI 图像识别系统

一个基于卷积神经网络（CNN）的图像识别系统，可以识别1000多种物体。

## 技术栈

- Python
- TensorFlow
- Flask API
- React Frontend

## 准确率

测试集准确率达到98.5%。',
         'https://demo.ai-recognition.dev',
         'https://github.com/codeninja/ai-recognition',
         '["Python", "TensorFlow", "Flask", "React"]'::jsonb,
         'published',
         TRUE);
    END IF;
END $$;

-- =====================================================
-- 8. 示例页面
-- =====================================================

DO $$
DECLARE
    admin_id UUID;
BEGIN
    SELECT id INTO admin_id FROM users WHERE username = 'cyberadmin' LIMIT 1;

    IF admin_id IS NOT NULL THEN
        INSERT INTO pages (author_id, title, slug, content, status, template) VALUES
        (admin_id,
         '关于我们',
         'about',
         '# 关于 CyberPress

我们是一个致力于打造现代化博客平台的团队。

## 使命

让每个人都能轻松创建和分享优质内容。

## 愿景

成为最受开发者欢迎的博客平台。',
         'published',
         'default'),

        (admin_id,
         '隐私政策',
         'privacy-policy',
         '# 隐私政策

我们非常重视您的隐私。

## 数据收集

我们只收集必要的信息来提供更好的服务。

## 数据使用

您的数据仅用于改善用户体验，绝不向第三方出售。',
         'published',
         'default');
    END IF;
END $$;

-- =====================================================
-- 9. 示例通知
-- =====================================================

DO $$
DECLARE
    user_id UUID;
BEGIN
    SELECT id INTO user_id FROM users WHERE username = 'cyberadmin' LIMIT 1;

    IF user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, type, title, content, link_url, is_read) VALUES
        (user_id,
         'welcome',
         '欢迎来到 CyberPress！',
         '感谢您注册 CyberPress Platform。开始您的创作之旅吧！',
         '/getting-started',
         FALSE),

        (user_id,
         'system',
         '系统更新通知',
         '系统已更新到最新版本，享受新功能带来的便利。',
         '/changelog',
         FALSE);
    END IF;
END $$;

-- =====================================================
-- 10. 示例系统设置
-- =====================================================

INSERT INTO settings (key, value, value_type, category, description, is_public) VALUES
('site_name', 'CyberPress Platform', 'string', 'general', '网站名称', true),
('site_description', '探索赛博朋克风格的未来博客', 'string', 'general', '网站描述', true),
('posts_per_page', '10', 'number', 'general', '每页文章数', true),
('allow_comments', 'true', 'boolean', 'comments', '允许评论', true),
('allow_registrations', 'true', 'boolean', 'users', '允许注册', true),
('maintenance_mode', 'false', 'boolean', 'general', '维护模式', false),
('max_upload_size', '10485760', 'number', 'media', '最大上传大小（字节）', false),
('supported_image_formats', '["jpg", "jpeg", "png", "gif", "webp"]'::jsonb::text, 'json', 'media', '支持的图片格式', false);

-- =====================================================
-- 种子数据插入完成
-- =====================================================

-- 显示统计信息
SELECT 'Users:' as type, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Tags', COUNT(*) FROM tags
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts
UNION ALL
SELECT 'Comments', COUNT(*) FROM comments
UNION ALL
SELECT 'Media', COUNT(*) FROM media
UNION ALL
SELECT 'Portfolios', COUNT(*) FROM portfolios
UNION ALL
SELECT 'Pages', COUNT(*) FROM pages
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
ORDER BY count DESC;
