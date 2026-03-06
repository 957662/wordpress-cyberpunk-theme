-- =====================================================
-- CyberPress Platform - 种子数据
-- =====================================================
-- 用途：填充示例数据用于开发和测试
-- 使用：psql -U cyberpress_user -d cyberpress_db -f seeds.sql
-- =====================================================

-- =====================================================
-- 1. 创建测试用户
-- =====================================================

-- 普通用户
INSERT INTO users (username, email, password_hash, full_name, bio, is_active, is_verified) VALUES
('alice', 'alice@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc0i', 'Alice Chen', '前端开发工程师，热爱React和Next.js', true, true),
('bob', 'bob@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc0i', 'Bob Smith', '全栈开发者，专注于Python和JavaScript', true, true),
('charlie', 'charlie@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc0i', 'Charlie Wang', '数据库架构师，PostgreSQL专家', true, true),
('diana', 'diana@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc0i', 'Diana Prince', 'UI/UX设计师，追求极致用户体验', true, true),
('eve', 'eve@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEmc0i', 'Eve Johnson', 'DevOps工程师，自动化部署专家', true, true)
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- 2. 创建更多分类
-- =====================================================

INSERT INTO categories (name, slug, description, order_num) VALUES
('前端开发', 'frontend', '前端技术、框架和工具', 5),
('后端开发', 'backend', '后端技术、架构和API设计', 6),
('数据库', 'database', '数据库设计、优化和管理', 7),
('DevOps', 'devops', '持续集成、部署和运维', 8),
('UI/UX', 'ui-ux', '用户界面和体验设计', 9),
('移动开发', 'mobile', 'iOS和Android应用开发', 10),
('人工智能', 'ai', '机器学习和深度学习', 11),
('网络安全', 'security', '信息安全、渗透测试和防护', 12)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 3. 创建更多标签
-- =====================================================

INSERT INTO tags (name, slug) VALUES
('Vue.js', 'vuejs'),
('Angular', 'angular'),
('Node.js', 'nodejs'),
('Django', 'django'),
('Flask', 'flask'),
('FastAPI', 'fastapi'),
('MongoDB', 'mongodb'),
('Redis', 'redis'),
('Docker', 'docker'),
('Kubernetes', 'kubernetes'),
('AWS', 'aws'),
('Linux', 'linux'),
('Git', 'git'),
('CI/CD', 'cicd'),
('GraphQL', 'graphql'),
('REST API', 'rest-api'),
('TypeScript', 'typescript'),
('CSS', 'css'),
('HTML', 'html'),
('JSON', 'json'),
('XML', 'xml')
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 4. 创建示例文章
-- =====================================================

-- 获取用户ID以便使用
DO $$
DECLARE
    admin_id UUID;
    alice_id UUID;
    bob_id UUID;
    charlie_id UUID;
    tech_cat_id INT;
    life_cat_id INT;
    frontend_cat_id INT;
    backend_cat_id INT;
BEGIN
    -- 获取用户ID
    SELECT id INTO admin_id FROM users WHERE username = 'admin';
    SELECT id INTO alice_id FROM users WHERE username = 'alice';
    SELECT id INTO bob_id FROM users WHERE username = 'bob';
    SELECT id INTO charlie_id FROM users WHERE username = 'charlie';

    -- 获取分类ID
    SELECT id INTO tech_cat_id FROM categories WHERE slug = 'tech';
    SELECT id INTO life_cat_id FROM categories WHERE slug = 'life';
    SELECT id INTO frontend_cat_id FROM categories WHERE slug = 'frontend';
    SELECT id INTO backend_cat_id FROM categories WHERE slug = 'backend';

    -- 插入文章
    INSERT INTO posts (id, title, slug, content, excerpt, author_id, category_id, status, is_featured, allow_comments, published_at) VALUES
    (
        uuid_generate_v4(),
        'Next.js 14 App Router 完全指南',
        'nextjs-14-app-router-complete-guide',
        '# Next.js 14 App Router 完全指南

Next.js 14 引入了全新的 App Router，带来了许多令人兴奋的新特性和改进。

## 主要特性

### 1. React Server Components
App Router 默认使用 Server Components，可以显著提升性能。

### 2. 简化的路由
基于文件系统的路由更加直观和强大。

### 3. 内置布局和模板
轻松实现复杂的页面布局。

## 快速开始

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

## 结语

Next.js 14 是一个重要的版本升级，值得学习和使用。',
        'Next.js 14 的 App Router 带来了许多新特性，包括 Server Components、简化的路由和内置布局系统。本文将带你了解这些特性。',
        admin_id,
        tech_cat_id,
        'published',
        true,
        true,
        NOW() - INTERVAL '5 days'
    ),
    (
        uuid_generate_v4(),
        '赛博朋克设计系统实践',
        'cyberpunk-design-system-practice',
        '# 赛博朋克设计系统实践

赛博朋克风格以其独特的视觉语言在现代Web设计中越来越受欢迎。

## 核心元素

### 颜色
- 深空黑背景
- 霓虹青色
- 赛博紫色
- 激光粉色

### 特效
- 故障效果（Glitch）
- 扫描线
- 全息投影
- 霓虹光晕

## 实现技巧

使用 CSS 和 Tailwind 可以轻松实现赛博朋克风格。

```css
.neon-text {
  text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
}
```',
        '探索赛博朋克设计风格的核心元素和实现技巧，打造独特的视觉体验。',
        alice_id,
        frontend_cat_id,
        'published',
        true,
        true,
        NOW() - INTERVAL '3 days'
    ),
    (
        uuid_generate_v4(),
        'PostgreSQL 高级查询技巧',
        'postgresql-advanced-query-techniques',
        '# PostgreSQL 高级查询技巧

PostgreSQL 是一个功能强大的关系型数据库。

## 窗口函数

窗口函数可以执行复杂的聚合计算。

```sql
SELECT
  name,
  salary,
  RANK() OVER (ORDER BY salary DESC) as rank
FROM employees;
```

## CTE（公用表表达式）

CTE 可以使复杂查询更易读。

```sql
WITH ranked_users AS (
  SELECT *, ROW_NUMBER() OVER (ORDER BY created_at) as rn
  FROM users
)
SELECT * FROM ranked_users WHERE rn <= 10;
```',
        '深入探讨 PostgreSQL 的高级查询技巧，包括窗口函数、CTE 和性能优化。',
        charlie_id,
        backend_cat_id,
        'published',
        false,
        true,
        NOW() - INTERVAL '7 days'
    ),
    (
        uuid_generate_v4(),
        'Docker 容器化最佳实践',
        'docker-containerization-best-practices',
        '# Docker 容器化最佳实践

Docker 已经成为现代应用部署的标准。

## Dockerfile 优化

### 多阶段构建
```dockerfile
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "start"]
```

## 安全最佳实践

- 使用非 root 用户运行容器
- 扫描镜像漏洞
- 限制容器资源',
        '学习 Docker 容器化的最佳实践，包括镜像优化、安全配置和多阶段构建。',
        eve_id,
        devops_cat_id,
        'published',
        false,
        true,
        NOW() - INTERVAL '2 days'
    ),
    (
        uuid_generate_v4(),
        'TypeScript 类型系统深度解析',
        'typescript-type-system-deep-dive',
        '# TypeScript 类型系统深度解析

TypeScript 的类型系统是其最强大的特性之一。

## 高级类型

### 泛型
```typescript
function identity<T>(arg: T): T {
  return arg;
}
```

### 条件类型
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
```

## 实用工具类型

- Partial<T>
- Required<T>
- Pick<T, K>
- Omit<T, K>',
        '深入了解 TypeScript 的类型系统，掌握泛型、条件类型和工具类型。',
        bob_id,
        frontend_cat_id,
        'published',
        false,
        true,
        NOW() - INTERVAL '1 day'
    );

END $$;

-- =====================================================
-- 5. 为文章添加标签
-- =====================================================

INSERT INTO post_tags (post_id, tag_id)
SELECT p.id, t.id
FROM posts p
CROSS JOIN tags t
WHERE t.slug IN (
  'javascript', 'nextjs', 'react', 'typescript',
  'python', 'django', 'fastapi', 'postgresql',
  'docker', 'kubernetes', 'aws', 'linux'
)
AND RANDOM() < 0.3  -- 随机选择约30%的组合
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. 创建示例评论
-- =====================================================

DO $$
DECLARE
    post_id_val UUID;
    alice_id UUID;
    bob_id UUID;
BEGIN
    SELECT id INTO alice_id FROM users WHERE username = 'alice';
    SELECT id INTO bob_id FROM users WHERE username = 'bob';

    -- 获取第一篇文章
    SELECT id INTO post_id_val FROM posts ORDER BY created_at DESC LIMIT 1;

    IF post_id_val IS NOT NULL THEN
        INSERT INTO comments (id, post_id, author_id, content, status, created_at) VALUES
        (
            uuid_generate_v4(),
            post_id_val,
            alice_id,
            '这篇文章写得太好了！对我帮助很大。',
            'approved',
            NOW() - INTERVAL '4 days'
        ),
        (
            uuid_generate_v4(),
            post_id_val,
            bob_id,
            '感谢分享，期待更多优质内容。',
            'approved',
            NOW() - INTERVAL '3 days'
        ),
        (
            uuid_generate_v4(),
            post_id_val,
            NULL,
            '能否详细介绍一下 Server Components 的使用场景？',
            'approved',
            NOW() - INTERVAL '2 days'
        );
    END IF;

END $$;

-- =====================================================
-- 7. 创建一些关注关系
-- =====================================================

INSERT INTO follows (follower_id, following_id)
SELECT u1.id, u2.id
FROM users u1
CROSS JOIN users u2
WHERE u1.id != u2.id
AND RANDOM() < 0.2  -- 20%的概率创建关注关系
ON CONFLICT (follower_id, following_id) DO NOTHING;

-- =====================================================
-- 8. 创建一些点赞
-- =====================================================

INSERT INTO likes (user_id, target_id, target_type)
SELECT u.id, p.id, 'post'
FROM users u
CROSS JOIN posts p
WHERE RANDOM() < 0.3  -- 30%的用户给文章点赞
ON CONFLICT (user_id, target_id, target_type) DO NOTHING;

-- =====================================================
-- 9. 创建一些收藏
-- =====================================================

INSERT INTO bookmarks (user_id, post_id)
SELECT u.id, p.id
FROM users u
CROSS JOIN posts p
WHERE RANDOM() < 0.2  -- 20%的用户收藏文章
ON CONFLICT (user_id, post_id) DO NOTHING;

-- =====================================================
-- 10. 创建一些通知
-- =====================================================

DO $$
BEGIN
    -- 创建点赞通知
    INSERT INTO notifications (user_id, type, title, content, actor_id, target_id, target_type)
    SELECT
        p.author_id,
        'like',
        '你的文章收到了新的点赞',
        CONCAT(u.username, ' 赞了你的文章「', p.title, '」'),
        l.user_id,
        p.id,
        'post'
    FROM likes l
    JOIN posts p ON l.target_id = p.id
    JOIN users u ON l.user_id = u.id
    WHERE l.target_type = 'post'
    AND RANDOM() < 0.5
    LIMIT 10
    ON CONFLICT DO NOTHING;

    -- 创建评论通知
    INSERT INTO notifications (user_id, type, title, content, actor_id, target_id, target_type)
    SELECT
        p.author_id,
        'comment',
        '你的文章收到了新的评论',
        CONCAT(COALESCE(c.author_name, u.username), ' 评论了你的文章「', p.title, '」'),
        c.author_id,
        p.id,
        'post'
    FROM comments c
    JOIN posts p ON c.post_id = p.id
    LEFT JOIN users u ON c.author_id = u.id
    WHERE c.status = 'approved'
    AND RANDOM() < 0.5
    LIMIT 10
    ON CONFLICT DO NOTHING;

    -- 创建关注通知
    INSERT INTO notifications (user_id, type, title, content, actor_id, target_type)
    SELECT
        f.following_id,
        'follow',
        '你有新的关注者',
        CONCAT(u_follower.username, ' 关注了你'),
        f.follower_id,
        'user'
    FROM follows f
    JOIN users u_follower ON f.follower_id = u_follower.id
    WHERE RANDOM() < 0.5
    LIMIT 10
    ON CONFLICT DO NOTHING;

END $$;

-- =====================================================
-- 完成种子数据填充
-- =====================================================

-- 显示统计信息
SELECT 'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'tags', COUNT(*) FROM tags
UNION ALL
SELECT 'posts', COUNT(*) FROM posts
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'likes', COUNT(*) FROM likes
UNION ALL
SELECT 'bookmarks', COUNT(*) FROM bookmarks
UNION ALL
SELECT 'follows', COUNT(*) FROM follows
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;
