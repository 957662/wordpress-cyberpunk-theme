-- ============================================================================
-- CyberPress Platform - 种子数据脚本
-- ============================================================================
-- 功能: 插入测试数据和初始配置数据
-- 版本: 1.0.0
-- 日期: 2026-03-03
-- ============================================================================

-- ============================================================================
-- 1. 用户数据
-- ============================================================================

-- 测试用户（除管理员外）
INSERT INTO users (id, username, email, password_hash, full_name, bio, avatar_url, website_url, role, status, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'editor',
  'editor@cyberpress.dev',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU9bK8fk.5qW', -- password: editor123
  'Editor User',
  'Content editor and curator',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=editor',
  'https://cyberpress.dev',
  'editor',
  'active',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'author',
  'author@cyberpress.dev',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU9bK8fk.5qW', -- password: author123
  'Author User',
  'Tech writer and blogger',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=author',
  'https://author.cyberpress.dev',
  'author',
  'active',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'subscriber',
  'subscriber@cyberpress.dev',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU9bK8fk.5qW', -- password: subscriber123
  'Subscriber User',
  'Tech enthusiast',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=subscriber',
  NULL,
  'subscriber',
  'active',
  NOW(),
  NOW()
)
ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- 2. 分类数据
-- ============================================================================

INSERT INTO categories (id, name, slug, description, meta_title, meta_description, parent_id, display_order, icon, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  '人工智能',
  'artificial-intelligence',
  'AI、机器学习、深度学习相关文章',
  '人工智能 - CyberPress',
  '探索人工智能、机器学习和深度学习的最新技术趋势和实践',
  NULL,
  1,
  '🤖',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Web 开发',
  'web-development',
  '前端、后端、全栈开发技术',
  'Web 开发 - CyberPress',
  '涵盖前端、后端、全栈开发的最新技术和最佳实践',
  NULL,
  2,
  '💻',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '移动开发',
  'mobile-development',
  'iOS、Android、跨平台开发',
  '移动开发 - CyberPress',
  'iOS、Android 和跨平台移动应用开发技术分享',
  NULL,
  3,
  '📱',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '云计算',
  'cloud-computing',
  '云服务、容器化、微服务架构',
  '云计算 - CyberPress',
  '云计算、容器化、微服务架构的实践和经验',
  NULL,
  4,
  '☁️',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '数据库',
  'database',
  'SQL、NoSQL、数据库设计和优化',
  '数据库 - CyberPress',
  '关系型和非关系型数据库的设计、优化和管理',
  NULL,
  5,
  '🗄️',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '网络安全',
  'cybersecurity',
  '安全实践、漏洞分析、防护策略',
  '网络安全 - CyberPress',
  '网络安全最佳实践、漏洞分析和防护策略',
  NULL,
  6,
  '🔒',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'DevOps',
  'devops',
  'CI/CD、自动化、监控和运维',
  'DevOps - CyberPress',
  '持续集成、持续部署、自动化和监控运维',
  NULL,
  7,
  '⚙️',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '区块链',
  'blockchain',
  '区块链技术、加密货币、Web3',
  '区块链 - CyberPress',
  '区块链技术、智能合约、加密货币和 Web3 开发',
  NULL,
  8,
  '⛓️',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 3. 标签数据
-- ============================================================================

INSERT INTO tags (id, name, slug, description, color, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  'React',
  'react',
  'React.js 相关文章',
  '#61DAFB',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Next.js',
  'nextjs',
  'Next.js 框架相关',
  '#000000',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'TypeScript',
  'typescript',
  'TypeScript 编程语言',
  '#3178C6',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Python',
  'python',
  'Python 编程语言',
  '#3776AB',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'FastAPI',
  'fastapi',
  'FastAPI 框架',
  '#009688',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'PostgreSQL',
  'postgresql',
  'PostgreSQL 数据库',
  '#336791',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Docker',
  'docker',
  'Docker 容器技术',
  '#2496ED',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'Kubernetes',
  'kubernetes',
  'Kubernetes 编排',
  '#326CE5',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '机器学习',
  'machine-learning',
  '机器学习算法和应用',
  '#FF6F00',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '深度学习',
  'deep-learning',
  '深度学习和神经网络',
  '#9C27B0',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  'GPT',
  'gpt',
  'GPT 和大语言模型',
  '#10A37F',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '安全',
  'security',
  '网络安全相关',
  '#F44336',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 4. 示例文章
-- ============================================================================

-- 获取管理员 ID（假设是第一个用户）
DO $$
DECLARE
  admin_id UUID;
  editor_id UUID;
  category_ai UUID;
  category_web UUID;
  tag_nextjs UUID;
  tag_react UUID;
  tag_ai UUID;
BEGIN
  -- 获取用户 ID
  SELECT id INTO admin_id FROM users WHERE username = 'admin' LIMIT 1;
  SELECT id INTO editor_id FROM users WHERE username = 'editor' LIMIT 1;

  -- 获取分类 ID
  SELECT id INTO category_ai FROM categories WHERE slug = 'artificial-intelligence' LIMIT 1;
  SELECT id INTO category_web FROM categories WHERE slug = 'web-development' LIMIT 1;

  -- 获取标签 ID
  SELECT id INTO tag_nextjs FROM tags WHERE slug = 'nextjs' LIMIT 1;
  SELECT id INTO tag_react FROM tags WHERE slug = 'react' LIMIT 1;
  SELECT id INTO tag_ai FROM tags WHERE slug = 'machine-learning' LIMIT 1;

  -- 插入示例文章
  INSERT INTO posts (
    id,
    title,
    slug,
    excerpt,
    content,
    featured_image,
    author_id,
    category_id,
    status,
    post_type,
    comment_status,
    featured,
    sticky,
    view_count,
    like_count,
    meta_title,
    meta_description,
    meta_keywords,
    published_at,
    created_at,
    updated_at
  ) VALUES
  (
    gen_random_uuid(),
    'Next.js 14 App Router 完全指南',
    'nextjs-14-app-router-complete-guide',
    '深入了解 Next.js 14 App Router 的核心概念、最佳实践和性能优化技巧',
    '# Next.js 14 App Router 完全指南

Next.js 14 引入了全新的 App Router，基于 React Server Components 构建，提供了强大的性能优化和开发体验提升。

## 核心特性

- **服务端组件**: 默认使用，减少客户端 JavaScript
- **流式渲染**: 渐进式页面加载，提升感知性能
- **路由组**: 更灵活的路由组织方式
- **并行路由**: 实现复杂的布局模式
- **拦截路由**: 优雅的模态框和抽屉实现

## 最佳实践

1. 合理使用服务端和客户端组件
2. 优化数据获取策略
3. 利用 Server Actions 减少客户端代码
4. 实施适当的缓存策略

...',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=630&fit=crop',
    admin_id,
    category_web,
    'published',
    'post',
    'open',
    true,
    false,
    1250,
    87,
    'Next.js 14 App Router 完全指南 | CyberPress',
    '深入了解 Next.js 14 App Router 的核心概念、最佳实践和性能优化技巧',
    'nextjs, app router, react, server components',
    NOW() - INTERVAL '7 days',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '2026 年 AI 开发趋势预测',
    'ai-development-trends-2026',
    '探索 2026 年人工智能开发的最新趋势，从多模态 AI 到边缘计算',
    '# 2026 年 AI 开发趋势预测

随着人工智能技术的飞速发展，2026 年将迎来更多突破性的进展。本文将深入分析即将到来的 AI 开发趋势。

## 多模态 AI 的崛起

多模态 AI 系统能够同时理解和生成文本、图像、音频、视频等多种数据形式。GPT-4V 和 Gemini 的发布标志着这一领域的重大突破。

## 边缘 AI 计算

随着硬件性能的提升，越来越多的 AI 推理将在边缘设备上进行，这将带来：
- 更低的延迟
- 更好的隐私保护
- 离线工作能力

## AI Agent 框架

自主 AI Agent 将在 2026 年成为主流...',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
    editor_id,
    category_ai,
    'published',
    'post',
    'open',
    true,
    true,
    980,
    65,
    '2026 年 AI 开发趋势预测 | CyberPress',
    '探索 2026 年人工智能开发的最新趋势，从多模态 AI 到边缘计算',
    'ai, machine learning, trends, 2026',
    NOW() - INTERVAL '3 days',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    '赛博朋克 UI 设计实战',
    'cyberpunk-ui-design-tutorial',
    '学习如何创建具有未来感、霓虹美学的赛博朋克风格用户界面',
    '# 赛博朋克 UI 设计实战

赛博朋克风格以其独特的霓虹美学、未来科技感和反乌托邦氛围而著称。本文将带你从零开始创建赛博朋克风格的 UI。

## 配色方案

赛博朋克风格的核心是高对比度的霓虹色彩：
- **霓虹青**: #00F0FF
- **赛博紫**: #9D00FF
- **激光粉**: #FF0080
- **深空黑**: #0A0A0F

## 视觉效果

1. **故障效果 (Glitch)**: 模拟数字信号干扰
2. **扫描线**: 复古 CRT 显示器效果
3. **全息投影**: 3D 悬浮和透明效果
4. **霓虹发光**: 高强度的边缘发光...',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop',
    admin_id,
    category_web,
    'published',
    'post',
    'open',
    false,
    false,
    756,
    43,
    '赛博朋克 UI 设计实战 | CyberPress',
    '学习如何创建具有未来感、霓虹美学的赛博朋克风格用户界面',
    'cyberpunk, ui design, tutorial',
    NOW() - INTERVAL '14 days',
    NOW(),
    NOW()
  );

  -- 为文章添加标签关联
  INSERT INTO post_tags (post_id, tag_id)
  SELECT p.id, t.id
  FROM posts p
  CROSS JOIN tags t
  WHERE p.slug = 'nextjs-14-app-router-complete-guide'
    AND t.slug IN ('nextjs', 'react', 'typescript')
  ON CONFLICT DO NOTHING;

  INSERT INTO post_tags (post_id, tag_id)
  SELECT p.id, t.id
  FROM posts p
  CROSS JOIN tags t
  WHERE p.slug = 'ai-development-trends-2026'
    AND t.slug IN ('gpt', 'machine-learning', 'deep-learning')
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================================================
-- 5. 站点选项
-- ============================================================================

INSERT INTO site_options (option_name, option_value, autoload) VALUES
('site_title', 'CyberPress Platform', true),
('site_description', '探索技术的未来边界', true),
('site_url', 'https://cyberpress.dev', true),
('posts_per_page', '10', true),
('date_format', 'Y-m-d', true),
('time_format', 'H:i:s', true),
('timezone', 'Asia/Shanghai', true),
('language', 'zh-CN', true),
('allow_comments', 'true', true),
('comment_moderation', 'true', true),
('users_can_register', 'false', true),
('default_role', 'subscriber', true),
('enable_smtp', 'false', false),
('smtp_host', '', false),
('smtp_port', '587', false),
('smtp_username', '', false),
('enable_analytics', 'true', true),
('analytics_id', 'G-XXXXXXXXXX', true),
('enable_captcha', 'false', true),
('captcha_site_key', '', false),
('maintenance_mode', 'false', true)
ON CONFLICT (option_name) DO NOTHING;

-- ============================================================================
-- 6. 菜单数据
-- ============================================================================

-- 创建主菜单
INSERT INTO menus (id, name, slug, description, location, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  '主导航',
  'main-menu',
  '网站主导航菜单',
  'main',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- 创建页脚菜单
INSERT INTO menus (id, name, slug, description, location, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  '页脚导航',
  'footer-menu',
  '页脚链接菜单',
  'footer',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 7. 侧边栏小部件
-- ============================================================================

INSERT INTO widgets (id, name, type, sidebar, position, config, created_at, updated_at) VALUES
(
  gen_random_uuid(),
  '搜索',
  'search',
  'sidebar-main',
  1,
  '{"title": "搜索", "placeholder": "搜索文章..."}',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '最新文章',
  'recent-posts',
  'sidebar-main',
  2,
  '{"title": "最新文章", "count": 5}',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '分类',
  'categories',
  'sidebar-main',
  3,
  '{"title": "分类", "show_count": true}',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  '标签云',
  'tag-cloud',
  'sidebar-main',
  4,
  '{"title": "标签云", "count": 20}',
  NOW(),
  NOW()
)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- 完成
-- ============================================================================

-- 输出统计信息
DO $$
DECLARE
  user_count INT;
  category_count INT;
  tag_count INT;
  post_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users;
  SELECT COUNT(*) INTO category_count FROM categories;
  SELECT COUNT(*) INTO tag_count FROM tags;
  SELECT COUNT(*) INTO post_count FROM posts WHERE status = 'published';

  RAISE NOTICE '=== 种子数据插入完成 ===';
  RAISE NOTICE '用户数: %', user_count;
  RAISE NOTICE '分类数: %', category_count;
  RAISE NOTICE '标签数: %', tag_count;
  RAISE NOTICE '已发布文章数: %', post_count;
  RAISE NOTICE '========================';
END $$;

-- ============================================================================
-- 说明
-- ============================================================================
--
-- 测试账户:
-- - 管理员: admin / admin123
-- - 编辑: editor / editor123
-- - 作者: author / author123
-- - 订阅者: subscriber / subscriber123
--
-- 注意:
-- 1. 所有密码都是示例哈希，生产环境请使用强密码
-- 2. 文章内容是示例内容，可以根据需要修改
-- 3. 图片 URL 来自 Unsplash，可以替换为自己的图片
-- 4. UUID 自动生成，确保每次运行都唯一
--
-- ============================================================================
