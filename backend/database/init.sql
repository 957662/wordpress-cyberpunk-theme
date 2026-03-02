-- ================================================================
-- CyberPress Platform - Database Initialization Data
-- 数据库初始化数据
-- ================================================================

USE cyberpress_db;

-- ================================================================
-- 示例用户数据
-- ================================================================

INSERT INTO users (username, email, password, display_name, bio, website, role, status) VALUES
('editor', 'editor@cyberpress.dev', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Editor', 'Content Editor', 'https://cyberpress.dev', 'editor', 'active'),
('author', 'author@cyberpress.dev', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Author', 'Content Author', 'https://cyberpress.dev', 'author', 'active'),
('subscriber', 'user@cyberpress.dev', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Subscriber', 'Regular User', NULL, 'subscriber', 'active');

-- ================================================================
-- 示例分类和标签
-- ================================================================

INSERT INTO categories (name, slug, description, parent_id, icon, color, sort_order) VALUES
('前端开发', 'frontend', '前端开发技术文章', 1, 'code', '#00f0ff', 1),
('后端开发', 'backend', '后端开发技术文章', 1, 'server', '#9d00ff', 2),
('数据库', 'database', '数据库相关文章', 1, 'database', '#ff0080', 3),
('用户体验', 'ux', '用户体验和交互设计', 2, 'palette', '#00ff88', 1),
('界面设计', 'ui', '界面设计相关', 2, 'layout', '#f0ff00', 2);

INSERT INTO tags (name, slug, description, color) VALUES
('Vue.js', 'vuejs', 'Vue.js 框架', '#42b883'),
('Angular', 'angular', 'Angular 框架', '#dd0031'),
('Node.js', 'nodejs', 'Node.js 运行时', '#339933'),
('Python', 'python', 'Python 编程语言', '#3776ab'),
('Docker', 'docker', 'Docker 容器化', '#2496ed'),
('Kubernetes', 'kubernetes', 'Kubernetes 容器编排', '#326ce5'),
('MongoDB', 'mongodb', 'MongoDB 数据库', '#47a248'),
('PostgreSQL', 'postgresql', 'PostgreSQL 数据库', '#336791'),
('Figma', 'figma', 'Figma 设计工具', '#f24e1e'),
('Sketch', 'sketch', 'Sketch 设计工具', '#f7b500');

-- ================================================================
-- 示例文章数据
-- ================================================================

INSERT INTO posts (
  title, slug, excerpt, content, author_id, status, post_type,
  is_featured, is_sticky, published_at
) VALUES

-- 技术文章
(
  '探索赛博朋克设计美学',
  'exploring-cyberpunk-aesthetics',
  '从《银翼杀手》到《赛博朋克2077》，深入解析赛博朋克风格的视觉元素与设计原则。',
  '# 探索赛博朋克设计美学

赛博朋克风格起源于80年代的科幻文学和电影，如《银翼杀手》和《神经漫游者》。

## 核心视觉元素

- **霓虹色彩**：青色、紫色、粉色的高饱和度色彩
- **黑暗背景**：深空黑、深蓝作为基调
- **故障效果**：数字干扰和信号失真
- **全息投影**：透明、发光的界面元素

## 设计原则

1. 高对比度：确保在暗色背景下的可读性
2. 发光效果：使用 box-shadow 和 text-shadow
3. 动态效果：动画和过渡增强科技感
4. 扫描线：模拟老式CRT显示器效果

## 实现技巧

```css
.neon-text {
  text-shadow: 
    0 0 5px #0ff,
    0 0 10px #0ff,
    0 0 20px #0ff;
}
```

赛博朋克设计不仅是视觉风格，更是一种对未来科技与人文冲突的思考。',
  1,
  'publish',
  'post',
  TRUE,
  TRUE,
  '2024-03-01 10:00:00'
),

(
  'Next.js 14 完全指南',
  'nextjs-14-complete-guide',
  'Server Components、App Router、Server Actions - 全面掌握 Next.js 14 的革命性特性。',
  '# Next.js 14 完全指南

Next.js 14 带来了许多令人兴奋的新特性，让我们一一探索。

## Server Components

服务端组件是 Next.js 的核心特性：

```tsx
// Server Component
async function BlogPost({ id }) {
  const post = await fetchPost(id);
  return <article>{post.content}</article>;
}
```

## App Router

新的路由系统提供更好的性能和开发体验：

- 并行路由
- 拦截路由
- 路由组

## Server Actions

直接从组件调用服务端逻辑：

```tsx
async function updateProfile(formData) {
  "use server";
  await db.users.update(formData);
}
```

## 性能优化

- 图片优化
- 字体优化
- 部分预渲染
- 流式渲染

Next.js 14 是现代 Web 开发的理想选择。',
  2,
  'publish',
  'post',
  TRUE,
  FALSE,
  '2024-02-28 14:00:00'
),

(
  'TypeScript 最佳实践',
  'typescript-best-practices',
  '掌握 TypeScript 的最佳实践，编写更安全、更易维护的代码。',
  '# TypeScript 最佳实践

TypeScript 让 JavaScript 开发更加安全。

## 类型定义

### 基础类型

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}
```

### 泛型

```typescript
function fetch<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json());
}
```

## 高级技巧

1. 使用 utility types
2. 类型守卫
3. 条件类型
4. 模板字面量类型

TypeScript 是大型项目的必备工具。',
  2,
  'publish',
  'post',
  FALSE,
  FALSE,
  '2024-02-25 09:00:00'
),

(
  'Tailwind CSS 实战技巧',
  'tailwind-css-practical-tips',
  '学习 Tailwind CSS 的实用技巧，提高开发效率。',
  '# Tailwind CSS 实战技巧

Tailwind CSS 是一个功能类优先的 CSS 框架。

## 核心概念

- 响应式设计
- 深色模式
- 自定义配置
- 组件提取

## 常用模式

```html
<div class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
  <!-- 内容 -->
</div>
```

## 性能优化

- PurgeCSS 清理未使用的样式
- JIT 模式
- CSS-in-JS

Tailwind 让样式开发更高效。',
  2,
  'publish',
  'post',
  FALSE,
  FALSE,
  '2024-02-20 16:00:00'
),

-- 设计文章
(
  '2024年设计趋势预测',
  'design-trends-2024',
  '探索2024年UI/UX设计的最新趋势。',
  '# 2024年设计趋势预测

设计趋势不断演变，2024年值得关注的方向：

## 1. AI辅助设计

- Midjourney
- DALL-E
- Stable Diffusion

## 2. 3D元素

- Spline
- Three.js
- 3D图标和插画

## 3. 微交互

- 动画反馈
- 手势操作
- 过渡效果

## 4. 可访问性

- WCAG 2.1
- 键盘导航
- 屏幕阅读器支持

设计趋势反映了技术和社会的发展。',
  3,
  'publish',
  'post',
  TRUE,
  FALSE,
  '2024-02-15 11:00:00'
),

(
  '色彩心理学在UI设计中的应用',
  'color-psychology-in-ui-design',
  '了解色彩如何影响用户体验和品牌认知。',
  '# 色彩心理学在UI设计中的应用

色彩是设计中最强大的工具之一。

## 色彩情感

- **红色**：热情、危险、紧急
- **蓝色**：信任、专业、冷静
- **绿色**：自然、健康、成长
- **黄色**：快乐、能量、警告
- **紫色**：神秘、创造、奢侈

## 配色原则

1. 60-30-10 法则
2. 对比度要求
3. 品牌一致性
4. 文化差异

色彩选择直接影响用户的行为和情感。',
  3,
  'publish',
  'post',
  FALSE,
  FALSE,
  '2024-02-10 13:00:00'
);

-- ================================================================
-- 文章分类和标签关联
-- ================================================================

-- 文章分类
INSERT INTO post_categories (post_id, category_id) VALUES
(1, 4), -- 探索赛博朋克设计美学 -> 用户体验
(2, 1), -- Next.js 14 完全指南 -> 前端开发
(3, 1), -- TypeScript 最佳实践 -> 前端开发
(4, 1), -- Tailwind CSS 实战技巧 -> 前端开发
(5, 5), -- 2024年设计趋势预测 -> 界面设计
(6, 4); -- 色彩心理学在UI设计中的应用 -> 用户体验

-- 文章标签
INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 12), (1, 13), -- 探索赛博朋克设计美学 -> Figma, Sketch
(2, 6), (2, 7), (2, 8), -- Next.js 14 -> React, Node.js, TypeScript
(3, 8), (3, 7), -- TypeScript 最佳实践 -> TypeScript, Node.js
(4, 6), (4, 12), -- Tailwind CSS 实战技巧 -> React, Figma
(5, 12), (5, 13), -- 2024年设计趋势预测 -> Figma, Sketch
(6, 12), (6, 13); -- 色彩心理学在UI设计中的应用 -> Figma, Sketch

-- ================================================================
-- 示例评论数据
-- ================================================================

INSERT INTO comments (
  post_id, author_name, author_email, content, approved, created_at
) VALUES
(
  1,
  'Tech Enthusiast',
  'tech@example.com',
  '这篇文章对赛博朋克风格的分析非常深入！特别喜欢对霓虹色彩使用的讲解。',
  '1',
  '2024-03-02 08:30:00'
),
(
  1,
  'Designer Pro',
  'designer@example.com',
  '有没有推荐的设计工具或资源来创建这种风格的界面？',
  '1',
  '2024-03-02 10:15:00'
),
(
  2,
  'Web Developer',
  'dev@example.com',
  'Next.js 14 的 Server Actions 真的很棒，大大简化了数据交互。',
  '1',
  '2024-03-01 15:20:00'
),
(
  2,
  'React Fan',
  'reactfan@example.com',
  '请问 Server Components 在生产环境的性能表现如何？',
  '1',
  '2024-03-01 18:45:00'
),
(
  5,
  'UX Researcher',
  'ux@example.com',
  'AI辅助设计确实是今年的热门话题，期待更多相关内容。',
  '1',
  '2024-02-16 09:00:00'
);

-- ================================================================
-- 示例媒体数据
-- ================================================================

INSERT INTO media (
  title, filename, url, mime_type, file_size, width, height, alt_text, uploader_id
) VALUES
(
  '赛博朋克城市',
  'cyberpunk-city.jpg',
  'https://images.cyberpress.dev/cyberpunk-city.jpg',
  'image/jpeg',
  524288,
  1920,
  1080,
  '赛博朋克风格的城市景观',
  1
),
(
  'Next.js Logo',
  'nextjs-logo.png',
  'https://images.cyberpress.dev/nextjs-logo.png',
  'image/png',
  16384,
  512,
  512,
  'Next.js 框架标志',
  1
),
(
  'TypeScript Logo',
  'typescript-logo.png',
  'https://images.cyberpress.dev/typescript-logo.png',
  'image/png',
  20480,
  512,
  512,
  'TypeScript 语言标志',
  1
);

-- ================================================================
-- 示例链接数据
-- ================================================================

INSERT INTO links (url, name, description, rel, owner_id) VALUES
('https://nextjs.org', 'Next.js', 'React 框架', 'friend', 1),
('https://typescriptlang.org', 'TypeScript', 'JavaScript 超集', 'friend', 1),
('https://tailwindcss.com', 'Tailwind CSS', 'CSS 框架', 'friend', 1),
('https://react.dev', 'React', 'JavaScript 库', 'friend', 1);

-- ================================================================
-- 更新计数
-- ================================================================

CALL update_category_counts();
CALL update_tag_counts();

-- ================================================================
-- 创建视图用于统计
-- ================================================================

CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users,
  (SELECT COUNT(*) FROM posts WHERE status = 'publish' AND deleted_at IS NULL) as published_posts,
  (SELECT COUNT(*) FROM posts WHERE status = 'draft') as draft_posts,
  (SELECT COUNT(*) FROM comments WHERE approved = '1' AND deleted_at IS NULL) as approved_comments,
  (SELECT COUNT(*) FROM comments WHERE approved = 'spam') as spam_comments,
  (SELECT SUM(view_count) FROM posts WHERE status = 'publish') as total_views;

SELECT * FROM dashboard_stats;
