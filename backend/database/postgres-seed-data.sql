-- CyberPress Platform - PostgreSQL 初始数据
-- 版本: 1.0.0
-- 创建日期: 2026-03-03

-- ============================================
-- 插入管理员用户
-- ============================================
INSERT INTO users (username, email, password_hash, full_name, role, is_verified, is_active) VALUES
('admin', 'admin@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5Mx5WmWbQ7u2e', 'CyberPress Admin', 'admin', TRUE, TRUE),
('editor', 'editor@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5Mx5WmWbQ7u2e', 'Content Editor', 'editor', TRUE, TRUE),
('author', 'author@cyberpress.dev', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5Mx5WmWbQ7u2e', 'Content Author', 'author', TRUE, TRUE);

-- 注意：以上密码哈希对应的明文密码是 "password123"
-- 在生产环境中请使用强密码并通过应用程序生成哈希

-- ============================================
-- 插入分类
-- ============================================
INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('技术', 'tech', '技术文章和教程', 'Code', '#00f0ff', 1),
('设计', 'design', '设计和创意相关', 'Palette', '#9d00ff', 2),
('生活', 'life', '生活方式和个人感悟', 'Heart', '#ff0080', 3),
('项目', 'projects', '项目展示和案例', 'Rocket', '#00ff88', 4),
('资讯', 'news', '行业新闻和动态', 'Newspaper', '#f0ff00', 5);

-- ============================================
-- 插入标签
-- ============================================
INSERT INTO tags (name, slug) VALUES
('JavaScript', 'javascript'),
('TypeScript', 'typescript'),
('React', 'react'),
('Next.js', 'nextjs'),
('Python', 'python'),
('FastAPI', 'fastapi'),
('PostgreSQL', 'postgresql'),
('Tailwind CSS', 'tailwindcss'),
('Framer Motion', 'framermotion'),
('赛博朋克', 'cyberpunk'),
('UI/UX', 'uiux'),
('性能优化', 'performance'),
('数据库', 'database'),
('Web开发', 'webdev'),
('AI', 'ai');

-- ============================================
-- 插入示例文章
-- ============================================
INSERT INTO posts (title, slug, excerpt, content, author_id, category_id, status, post_type, featured, published_at) VALUES
(
    '欢迎来到 CyberPress Platform',
    'welcome-to-cyberpress-platform',
    '探索未来科技与赛博朋克美学的完美融合',
    '# 欢迎来到 CyberPress Platform

这是一个基于现代化技术栈构建的赛博朋克风格博客平台。

## 核心特性

- 🚀 Next.js 14 + TypeScript
- 🎨 赛博朋克设计系统
- 📱 完全响应式
- ⚡ 极致性能优化

## 技术栈

### 前端
- Next.js 14 (App Router)
- TypeScript 5.4
- Tailwind CSS 3.4
- Framer Motion

### 后端
- WordPress REST API
- FastAPI (Python)
- PostgreSQL

## 开始使用

探索我们的文档，了解如何使用这个平台构建你的作品！',
    1,
    1,
    'published',
    'post',
    TRUE,
    NOW()
),
(
    'Next.js 14 App Router 完全指南',
    'nextjs-14-app-router-complete-guide',
    '深入了解 Next.js 14 的 App Router 特性和最佳实践',
    '# Next.js 14 App Router 完全指南

## 什么是 App Router？

App Router 是 Next.js 13 引入的新路由系统，在 14 版本中更加成熟。

## 核心概念

### 1. 文件系统路由

```
app/
├── layout.tsx
├── page.tsx
└── blog/
    ├── page.tsx
    └── [slug]/
        └── page.tsx
```

### 2. 服务端组件

默认情况下，所有组件都是服务端组件，提供更好的性能。

### 3. 数据获取

使用 async/await 进行数据获取：

```typescript
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}
```

## 最佳实践

1. 合理使用服务端和客户端组件
2. 利用 Server Actions 处理表单
3. 使用 Streaming 提升加载体验',
    3,
    1,
    'published',
    'post',
    TRUE,
    NOW() - INTERVAL '2 days'
),
(
    '赛博朋克设计系统实战',
    'cyberpunk-design-system-practice',
    '如何构建一个令人惊叹的赛博朋克风格界面',
    '# 赛博朋克设计系统实战

## 色彩系统

赛博朋克风格的核心是高对比度的霓虹色彩：

### 主色调
- 深空黑: #0a0a0f
- 霓虹青: #00f0ff
- 赛博紫: #9d00ff
- 激光粉: #ff0080

## 视觉效果

### 1. 霓虹光晕

```css
.neon-text {
  text-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff;
}
```

### 2. 扫描线效果

```css
.scanlines::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
}
```

### 3. 故障艺术

使用 Framer Motion 创建故障效果：

```tsx
import { motion } from "framer-motion";

function GlitchText({ text }) {
  return (
    <motion.div
      animate={{
        x: [0, -2, 2, 0],
      }}
      transition={{
        duration: 0.1,
        repeat: Infinity,
      }}
    >
      {text}
    </motion.div>
  );
}
```

## 动画设计

流畅的动画是赛博朋克风格的关键：

1. **悬停效果** - 元素响应鼠标悬停
2. **页面过渡** - 丝滑的页面切换
3. **加载动画** - 吸引人的加载状态
4. **滚动视差** - 创造深度感

## 组件示例

查看我们的组件库，了解更多赛博朋克风格组件！',
    3,
    2,
    'published',
    'post',
    FALSE,
    NOW() - INTERVAL '5 days'
),
(
    'TypeScript 最佳实践',
    'typescript-best-practices',
    '提升 TypeScript 代码质量的实用技巧',
    '# TypeScript 最佳实践

## 类型定义

### 1. 使用接口 vs 类型

```typescript
// 接口 - 可扩展
interface User {
  id: number;
  name: string;
}

// 类型 - 不可扩展，但更灵活
type UserWithRoles = User & {
  roles: string[];
};
```

### 2. 泛型最佳实践

```typescript
// 良好的泛型命名
function identity<T>(value: T): T {
  return value;
}

// 带约束的泛型
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}
```

### 3. 工具类型

```typescript
// Partial - 使所有属性可选
type PartialUser = Partial<User>;

// Required - 使所有属性必需
type RequiredUser = Required<Partial<User>;

// Pick - 选择特定属性
type UserBasic = Pick<User, "id" | "name">;

// Omit - 排除特定属性
type UserWithoutPassword = Omit<User, "password">;
```

## 配置技巧

### 严格模式

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true
  }
}
```

## 结语

遵循这些最佳实践，让你的 TypeScript 代码更加健壮！',
    3,
    1,
    'published',
    'post',
    FALSE,
    NOW() - INTERVAL '7 days'
);

-- ============================================
-- 为文章分配标签
-- ============================================
INSERT INTO post_tags (post_id, tag_id) VALUES
-- 第一篇文章的标签
(1, 10), -- 赛博朋克
(1, 15),

-- 第二篇文章的标签
(2, 1), -- JavaScript
(2, 3), -- React
(2, 4), -- Next.js
(2, 13),

-- 第三篇文章的标签
(3, 10), -- 赛博朋克
(3, 11), -- UI/UX
(3, 8), -- Tailwind CSS
(3, 9), -- Framer Motion

-- 第四篇文章的标签
(4, 2), -- TypeScript
(4, 3), -- React
(4, 14); -- Web开发

-- ============================================
-- 插入示例评论
-- ============================================
INSERT INTO comments (post_id, user_id, author_name, author_email, content, status) VALUES
(1, 2, 'Content Editor', 'editor@cyberpress.dev', '欢迎！这个平台看起来很棒！', 'approved'),
(1, 3, 'Content Author', 'author@cyberpress.dev', '期待更多内容！', 'approved'),
(2, 2, 'Content Editor', 'editor@cyberpress.dev', '很详细的教程，对我很有帮助。', 'approved'),
(2, NULL, '访客用户', 'visitor@example.com', '请问有没有关于 Server Actions 的更多示例？', 'pending'),
(3, 3, 'Content Author', 'author@cyberpress.dev', '赛博朋克风格太酷了！', 'approved');

-- ============================================
-- 插入示例作品集
-- ============================================
INSERT INTO portfolios (title, slug, description, content, project_url, github_url, technologies, status, featured, sort_order) VALUES
(
    'CyberPress Platform',
    'cyberpress-platform',
    '赛博朋克风格的博客平台',
    '基于 Next.js 14 和 WordPress 构建的现代化博客平台',
    'https://cyberpress.dev',
    'https://github.com/cyberpress/platform',
    ARRAY['Next.js', 'TypeScript', 'WordPress', 'PostgreSQL', 'Tailwind CSS'],
    'active',
    TRUE,
    1
),
(
    'AI Chat Assistant',
    'ai-chat-assistant',
    '智能对话助手',
    '基于 GPT-4 的智能对话助手，支持多轮对话和上下文理解',
    'https://ai-chat.example.com',
    'https://github.com/example/ai-chat',
    ARRAY['Python', 'FastAPI', 'OpenAI', 'React', 'WebSocket'],
    'active',
    TRUE,
    2
),
(
    'Cyber Dashboard',
    'cyber-dashboard',
    '赛博朋克风格数据可视化仪表板',
    '实时数据监控和分析仪表板，采用赛博朋克设计风格',
    'https://dashboard.example.com',
    'https://github.com/example/cyber-dashboard',
    ARRAY['Vue.js', 'D3.js', 'Node.js', 'MongoDB', 'WebSocket'],
    'active',
    FALSE,
    3
);

-- ============================================
-- 插入示例媒体
-- ============================================
INSERT INTO media (filename, file_path, file_size, mime_type, width, height, alt_text, uploaded_by) VALUES
('logo.svg', '/uploads/logo.svg', 2048, 'image/svg+xml', 200, 200, 'CyberPress Logo', 1),
('hero-bg.jpg', '/uploads/hero-bg.jpg', 524288, 'image/jpeg', 1920, 1080, 'Hero background image', 1),
('avatar-default.jpg', '/uploads/avatar-default.jpg', 16384, 'image/jpeg', 200, 200, 'Default avatar image', 1);

-- ============================================
-- 插入示例通知
-- ============================================
INSERT INTO notifications (user_id, type, title, message, is_read) VALUES
(2, 'welcome', '欢迎来到 CyberPress', '感谢你加入我们的平台！开始创作你的内容吧。', FALSE),
(3, 'system', '新功能发布', '我们发布了新的编辑器功能，快来试试吧！', FALSE),
(3, 'comment', '新评论提醒', '你的文章收到了一条新评论。', FALSE);

-- ============================================
-- 插入示例用户设置
-- ============================================
INSERT INTO user_settings (user_id, key, value, value_type, category) VALUES
(2, 'email_notifications', 'true', 'boolean', 'notifications'),
(2, 'theme', 'cyber', 'string', 'appearance'),
(2, 'language', 'zh-CN', 'string', 'general'),
(3, 'email_notifications', 'false', 'boolean', 'notifications'),
(3, 'theme', 'cyber-dark', 'string', 'appearance'),
(3, 'language', 'zh-CN', 'string', 'general');

-- ============================================
-- 更新统计计数
-- ============================================
-- 更新分类的文章计数
UPDATE categories c SET post_count = (
    SELECT COUNT(*) FROM posts p WHERE p.category_id = c.id AND p.status = 'published'
);

-- 更新标签的文章计数
UPDATE tags t SET post_count = (
    SELECT COUNT(*) FROM post_tags pt WHERE pt.tag_id = t.id
);

-- ============================================
-- 创建视图（常用查询）
-- ============================================

-- 文章统计视图
CREATE OR REPLACE VIEW post_stats AS
SELECT
    p.id,
    p.title,
    p.view_count,
    p.like_count,
    p.comment_count,
    u.username as author_name,
    c.name as category_name,
    p.published_at
FROM posts p
LEFT JOIN users u ON p.author_id = u.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.status = 'published';

-- 用户活跃度视图
CREATE OR REPLACE VIEW user_activity AS
SELECT
    u.id,
    u.username,
    u.full_name,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT c.id) as comment_count,
    MAX(p.published_at) as last_post_date
FROM users u
LEFT JOIN posts p ON p.author_id = u.id AND p.status = 'published'
LEFT JOIN comments c ON c.user_id = u.id
GROUP BY u.id, u.username, u.full_name;

-- 热门标签视图
CREATE OR REPLACE VIEW popular_tags AS
SELECT
    t.id,
    t.name,
    t.slug,
    t.post_count,
    ROW_NUMBER() OVER (ORDER BY t.post_count DESC) as rank
FROM tags t
WHERE t.post_count > 0
ORDER BY t.post_count DESC;

-- ============================================
-- 初始化完成
-- ============================================

-- 显示统计信息
SELECT 'Users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Tags', COUNT(*) FROM tags
UNION ALL
SELECT 'Posts', COUNT(*) FROM posts
UNION ALL
SELECT 'Comments', COUNT(*) FROM comments
UNION ALL
SELECT 'Portfolios', COUNT(*) FROM portfolios
UNION ALL
SELECT 'Media', COUNT(*) FROM media
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;

-- 初始化完成消息
SELECT '✅ 数据库初始化完成！' as message,
       '默认管理员账号: admin / password123' as admin_info;
