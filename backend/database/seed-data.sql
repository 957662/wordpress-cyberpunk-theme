-- CyberPress Platform - 初始化种子数据
-- 用于创建系统基础数据

-- ============================================
-- 创建管理员用户
-- ============================================
-- 密码: admin123 (bcrypt)
INSERT INTO users (username, email, password_hash, display_name, bio, role, status, is_verified)
VALUES (
    'admin',
    'admin@cyberpress.dev',
    '$2a$10$Y3L8w3vK0ZX8qE9ZF5M/FuVLz6JzXQXGZRjNzCjYWvLKTZN0dJKy6',
    'CyberPress 管理员',
    '系统管理员，负责平台运营和维护',
    'admin',
    'active',
    true
) ON CONFLICT (username) DO NOTHING;

-- ============================================
-- 创建默认分类
-- ============================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
    ('技术教程', 'tech-tutorials', '编程和技术相关的教程文章', 1),
    ('产品思考', 'product-thinking', '关于产品设计和思考的文章', 2),
    ('生活随笔', 'life-essays', '日常生活和随笔记录', 3),
    ('开源项目', 'open-source', '开源项目相关的内容', 4),
    ('行业动态', 'industry-news', '行业新闻和动态', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 创建默认标签
-- ============================================
INSERT INTO tags (name, slug, description) VALUES
    ('React', 'react', 'React 框架相关'),
    ('Next.js', 'nextjs', 'Next.js 框架相关'),
    ('TypeScript', 'typescript', 'TypeScript 语言相关'),
    ('Node.js', 'nodejs', 'Node.js 运行时相关'),
    ('PostgreSQL', 'postgresql', 'PostgreSQL 数据库相关'),
    ('Docker', 'docker', 'Docker 容器技术相关'),
    ('DevOps', 'devops', 'DevOps 运维实践'),
    ('UI/UX', 'ui-ux', '用户界面和体验设计'),
    ('人工智能', 'artificial-intelligence', 'AI 技术相关'),
    ('前端开发', 'frontend', '前端开发技术'),
    ('后端开发', 'backend', '后端开发技术'),
    ('数据库', 'database', '数据库相关技术'),
    ('性能优化', 'performance', '性能优化实践'),
    ('安全', 'security', '网络安全相关'),
    ('架构设计', 'architecture', '软件架构设计')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 创建系统配置数据（可选）
-- ============================================
-- 这可以存储在 settings 表中，如果有的话
-- 这里作为示例展示如何创建系统配置

-- ============================================
-- 创建示例文章（草稿状态）
-- ============================================
INSERT INTO posts (
    author_id,
    title,
    slug,
    excerpt,
    content,
    content_html,
    status,
    post_type,
    is_featured,
    allow_comments
)
SELECT
    u.id,
    '欢迎使用 CyberPress',
    'welcome-to-cyberpress',
    'CyberPress 是一个基于 Next.js 和 PostgreSQL 构建的现代化博客平台。',
    E'# 欢迎使用 CyberPress\n\nCyberPress 是一个功能强大的博客平台，支持：\n\n- 📝 Markdown 编辑\n- 🏷️ 分类和标签管理\n- 💬 评论系统\n- 🔍 全文搜索\n- 📱 响应式设计\n- 🌙 深色模式\n\n开始您的写作之旅吧！',
    E'<h1>欢迎使用 CyberPress</h1>\n<p>CyberPress 是一个功能强大的博客平台...</p>',
    'draft',
    'post',
    true,
    true
FROM users u
WHERE u.username = 'admin'
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 创建示例页面
-- ============================================
INSERT INTO posts (
    author_id,
    title,
    slug,
    excerpt,
    content,
    content_html,
    status,
    post_type,
    allow_comments
)
SELECT
    u.id,
    '关于我们',
    'about-us',
    '了解 CyberPress 平台',
    E'# 关于 CyberPress\n\nCyberPress 是一个现代化的博客平台，致力于为开发者提供最佳的写作和阅读体验。',
    E'<h1>关于 CyberPress</h1>\n<p>CyberPress 是一个现代化的博客平台...</p>',
    'publish',
    'page',
    false
FROM users u
WHERE u.username = 'admin'
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 输出完成信息
-- ============================================
DO $$
BEGIN
    RAISE NOTICE '===========================================';
    RAISE NOTICE '种子数据创建完成';
    RAISE NOTICE '===========================================';
    RAISE NOTICE '默认管理员账号:';
    RAISE NOTICE '  用户名: admin';
    RAISE NOTICE '  密码: admin123';
    RAISE NOTICE '===========================================';
END $$;
