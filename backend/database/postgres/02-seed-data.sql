-- ================================================================
-- CyberPress Platform - 种子数据脚本
-- 插入示例数据用于开发和测试
-- ================================================================
--
-- 功能：
-- 1. 创建测试用户
-- 2. 创建示例分类和标签
-- 3. 创建示例文章
-- 4. 创建示例评论
-- 5. 创建示例媒体
--
-- 使用方法：
-- psql -U cyberpress_user -d cyberpress_db -f 02-seed-data.sql
--
-- 作者：Claude (Database Architect)
-- 创建时间：2026-03-08
-- 版本：1.0.0
-- ================================================================

-- ================================================================
-- 第一步：插入测试用户
-- ================================================================

-- 注意：密码都是 'password123'
-- 实际生产环境应该使用强密码

INSERT INTO users (username, email, password_hash, display_name, bio, role, status) VALUES
-- 管理员
('admin', 'admin@cyberpress.dev', '$2b$10$YourHashedPasswordHere', 'CyberAdmin', '系统管理员', 'admin', 'active'),

-- 作者
('author1', 'author1@cyberpress.dev', '$2b$10$YourHashedPasswordHere', 'Tech Writer', '技术作者，专注于前端开发', 'author', 'active'),
('author2', 'author2@cyberpress.dev', '$2b$10$YourHashedPasswordHere', 'Code Artist', '全栈开发者，热爱开源', 'author', 'active'),
('author3', 'author3@cyberpress.dev', '$2b$10$YourHashedPasswordHere', 'Data Scientist', '数据科学家，AI研究员', 'author', 'active'),

-- 编辑
('editor1', 'editor1@cyberpress.dev', '$2b$10$YourHashedPasswordHere', 'Content Editor', '内容编辑', 'editor', 'active'),

-- 订阅者
('user1', 'user1@example.com', '$2b$10$YourHashedPasswordHere', 'Regular User', '普通用户', 'subscriber', 'active'),
('user2', 'user2@example.com', '$2b$10$YourHashedPasswordHere', 'Blog Reader', '博客读者', 'subscriber', 'active')
ON CONFLICT (username) DO NOTHING;

-- ================================================================
-- 第二步：插入分类
-- ================================================================

INSERT INTO categories (name, slug, description, icon, color, sort_order) VALUES
('前端开发', 'frontend', '前端开发相关技术文章', 'code', '#00f0ff', 1),
('后端开发', 'backend', '后端开发相关技术文章', 'server', '#9d00ff', 2),
('数据库', 'database', '数据库设计和优化', 'database', '#00ff88', 3),
('人工智能', 'ai', '人工智能和机器学习', 'brain', '#ff0080', 4),
('DevOps', 'devops', 'DevOps 和运维', 'settings', '#f0ff00', 5),
('设计', 'design', 'UI/UX 设计', 'palette', '#ff61f6', 6),
('移动开发', 'mobile', '移动应用开发', 'smartphone', '#00d4ff', 7),
('网络安全', 'security', '网络安全和防护', 'shield', '#ff4757', 8),
('职业发展', 'career', '程序员职业发展', 'trending-up', '#2ed573', 9),
('开源项目', 'opensource', '开源项目和贡献', 'github', '#6c5ce7', 10)
ON CONFLICT (slug) DO NOTHING;

-- 创建子分类（示例：前端开发的子分类）
DO $$
DECLARE
  parent_id UUID;
BEGIN
  SELECT id INTO parent_id FROM categories WHERE slug = 'frontend';

  INSERT INTO categories (name, slug, description, parent_id, icon, color, sort_order) VALUES
    ('React', 'react', 'React 框架相关', parent_id, 'atom', '#61dafb', 1),
    ('Vue.js', 'vue', 'Vue.js 框架相关', parent_id, 'hexagon', '#42b883', 2),
    ('Angular', 'angular', 'Angular 框架相关', parent_id, 'triangle', '#dd0031', 3),
    ('Next.js', 'nextjs', 'Next.js 框架相关', parent_id, 'n', '#000000', 4)
  ON CONFLICT (slug) DO NOTHING;
END
$$;

-- ================================================================
-- 第三步：插入标签
-- ================================================================

INSERT INTO tags (name, slug, description, color) VALUES
('JavaScript', 'javascript', 'JavaScript 编程语言', '#f7df1e'),
('TypeScript', 'typescript', 'TypeScript 编程语言', '#3178c6'),
('Python', 'python', 'Python 编程语言', '#3776ab'),
('Go', 'go', 'Go 编程语言', '#00ADD8'),
('Rust', 'rust', 'Rust 编程语言', '#000000'),
('Java', 'java', 'Java 编程语言', '#007396'),
('PostgreSQL', 'postgresql', 'PostgreSQL 数据库', '#336791'),
('MySQL', 'mysql', 'MySQL 数据库', '#4479A1'),
('MongoDB', 'mongodb', 'MongoDB 数据库', '#47A248'),
('Redis', 'redis', 'Redis 缓存', '#DC382D'),
('Docker', 'docker', 'Docker 容器技术', '#2496ED'),
('Kubernetes', 'kubernetes', 'Kubernetes 容器编排', '#326CE5'),
('Linux', 'linux', 'Linux 操作系统', '#FCC624'),
('Git', 'git', 'Git 版本控制', '#F05032'),
('API', 'api', 'API 设计和开发', '#6DB33F'),
('微服务', 'microservices', '微服务架构', '#FF6B6B'),
('性能优化', 'performance', '性能优化技巧', '#4ECDC4'),
('算法', 'algorithms', '算法和数据结构', '#9B59B6'),
('设计模式', 'design-patterns', '软件设计模式', '#3498DB'),
('测试', 'testing', '软件测试', '#E74C3C'),
('CI/CD', 'cicd', '持续集成和部署', '#1ABC9C')
ON CONFLICT (slug) DO NOTHING;

-- ================================================================
-- 第四步：插入示例文章
-- ================================================================

-- 获取用户ID以便关联
DO $$
DECLARE
  admin_id UUID;
  author1_id UUID;
  author2_id UUID;
  author3_id UUID;
  tech_cat_id UUID;
  ai_cat_id UUID;
  db_cat_id UUID;
  js_tag_id UUID;
  ts_tag_id UUID;
  react_tag_id UUID;
  pg_tag_id UUID;
  ai_tag_id UUID;

BEGIN
  -- 获取用户ID
  SELECT id INTO admin_id FROM users WHERE username = 'admin';
  SELECT id INTO author1_id FROM users WHERE username = 'author1';
  SELECT id INTO author2_id FROM users WHERE username = 'author2';
  SELECT id INTO author3_id FROM users WHERE username = 'author3';

  -- 获取分类ID
  SELECT id INTO tech_cat_id FROM categories WHERE slug = 'frontend';
  SELECT id INTO ai_cat_id FROM categories WHERE slug = 'ai';
  SELECT id INTO db_cat_id FROM categories WHERE slug = 'database';

  -- 获取标签ID
  SELECT id INTO js_tag_id FROM tags WHERE slug = 'javascript';
  SELECT id INTO ts_tag_id FROM tags WHERE slug = 'typescript';
  SELECT id INTO react_tag_id FROM tags WHERE slug = 'react';
  SELECT id INTO pg_tag_id FROM tags WHERE slug = 'postgresql';
  SELECT id INTO ai_tag_id FROM tags WHERE slug = 'ai';

  -- 插入示例文章
  INSERT INTO posts (
    title, slug, excerpt, content, author_id, status, post_type,
    is_featured, is_sticky, published_at
  ) VALUES
  -- 文章1
  ('Next.js 14 完全指南', 'nextjs-14-complete-guide',
  'Next.js 14 带来了许多新特性，包括 Server Actions、改进的 App Router 等。本文将详细介绍这些新特性。',
  '# Next.js 14 完全指南

Next.js 14 是一个重大更新，带来了许多令人兴奋的新特性。

## 主要新特性

### 1. Server Actions
Server Actions 允许你在服务器上直接运行函数，无需创建 API 路由。

```typescript
async function createPost(formData: FormData) {
  "use server"
  const post = await db.posts.create({
    title: formData.get("title"),
  })
}
```

### 2. 改进的 App Router
App Router 现在更加稳定和强大。

### 3. Turbopack
Turbopack 现在更加稳定，可以作为 Webpack 的替代品。

## 总结

Next.js 14 是一个值得升级的版本。',
  author1_id, 'publish', 'post', true, true,
  NOW() - INTERVAL '30 days'),

  -- 文章2
  ('TypeScript 最佳实践', 'typescript-best-practices',
  'TypeScript 是 JavaScript 的超集，提供了静态类型检查。本文分享一些 TypeScript 最佳实践。',
  '# TypeScript 最佳实践

TypeScript 可以帮助我们在开发阶段发现错误。

## 1. 使用严格模式

在 `tsconfig.json` 中启用严格模式：

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## 2. 避免 any 类型

尽量使用具体的类型而不是 `any`。

## 3. 使用类型推断

TypeScript 可以自动推断类型，不需要到处显式声明。

## 总结

遵循这些最佳实践可以让你的 TypeScript 代码更加健壮。',
  author1_id, 'publish', 'post', true, false,
  NOW() - INTERVAL '25 days'),

  -- 文章3
  ('PostgreSQL 性能优化技巧', 'postgresql-performance-tips',
  'PostgreSQL 是一个强大的关系数据库。本文分享一些性能优化技巧。',
  '# PostgreSQL 性能优化技巧

PostgreSQL 是一个功能强大的开源关系数据库。

## 1. 使用适当的索引

索引可以大大提升查询性能：

```sql
CREATE INDEX idx_posts_author_id ON posts(author_id);
```

## 2. 使用 EXPLAIN ANALYZE

分析查询性能：

```sql
EXPLAIN ANALYZE SELECT * FROM posts WHERE author_id = ''xxx'';
```

## 3. 定期 VACUUM

定期清理死元组：

```sql
VACUUM ANALYZE posts;
```

## 总结

合理的优化可以让你的 PostgreSQL 数据库性能大幅提升。',
  author2_id, 'publish', 'post', false, false,
  NOW() - INTERVAL '20 days'),

  -- 文章4
  ('React Server Components 深度解析', 'react-server-components-deep-dive',
  'React Server Components 是 React 的新特性，允许你在服务器上渲染组件。',
  '# React Server Components 深度解析

React Server Components (RSC) 是 React 团队引入的新特性。

## 什么是 Server Components？

Server Components 是在服务器上渲染的组件，可以访问服务器资源。

## 优势

1. 减少客户端 Bundle 大小
2. 直接访问数据库和文件系统
3. 更好的性能

## 示例

```tsx
// Server Component
async function BlogPost({ id }: { id: string }) {
  const post = await db.posts.findUnique({ where: { id } })
  return <article>{post.content}</article>
}
```

## 总结

Server Components 是 React 的未来，值得深入学习。',
  author1_id, 'publish', 'post', true, false,
  NOW() - INTERVAL '15 days'),

  -- 文章5
  ('AI 驱动的代码审查', 'ai-powered-code-review',
  'AI 可以帮助自动化代码审查流程，提高代码质量。',
  '# AI 驱动的代码审查

AI 技术正在改变我们的开发方式。

## AI 代码审查的优势

1. **快速反馈**：AI 可以即时提供反馈
2. **一致性**：AI 应用规则始终一致
3. **学习能力**：AI 可以从历史数据中学习

## 工具推荐

- GitHub Copilot
- CodeGeeX
- Tabnine

## 最佳实践

1. 结合人工审查
2. 持续训练模型
3. 保护敏感信息

## 总结

AI 是代码审查的强大辅助工具，但不能完全替代人工审查。',
  author3_id, 'publish', 'post', false, false,
  NOW() - INTERVAL '10 days'),

  -- 文章6（草稿）
  ('Docker 容器化实践', 'docker-containerization-practice',
  'Docker 可以帮助你容器化应用程序，简化部署流程。',
  '# Docker 容器化实践

Docker 是一个开源的容器化平台。

## 基础概念

- 镜像 (Image)
- 容器 (Container)
- 仓库 (Registry)

## Dockerfile 最佳实践

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```

## 总结

Docker 可以大大简化部署流程。',
  author2_id, 'draft', 'post', false, false,
  NULL)
  ON CONFLICT (slug) DO NOTHING;

  -- 为文章添加分类和标签
  -- 获取刚插入的文章ID（这里简化处理，实际应该使用 RETURNING 子句）

  -- 假设我们获取到了文章ID，现在添加关联关系
  -- 文章1: Next.js 14 (frontend 分类, react 和 nextjs 标签)
  INSERT INTO post_categories (post_id, category_id)
  SELECT p.id, c.id
  FROM posts p, categories c
  WHERE p.slug = 'nextjs-14-complete-guide' AND c.slug = 'frontend'
  ON CONFLICT (post_id, category_id) DO NOTHING;

  -- 文章2: TypeScript (frontend 分类, typescript 标签)
  INSERT INTO post_categories (post_id, category_id)
  SELECT p.id, c.id
  FROM posts p, categories c
  WHERE p.slug = 'typescript-best-practices' AND c.slug = 'frontend'
  ON CONFLICT (post_id, category_id) DO NOTHING;

  -- 文章3: PostgreSQL (database 分类, postgresql 标签)
  INSERT INTO post_categories (post_id, category_id)
  SELECT p.id, c.id
  FROM posts p, categories c
  WHERE p.slug = 'postgresql-performance-tips' AND c.slug = 'database'
  ON CONFLICT (post_id, category_id) DO NOTHING;

  -- 为文章添加标签
  INSERT INTO post_tags (post_id, tag_id)
  SELECT p.id, t.id
  FROM posts p, tags t
  WHERE p.slug = 'nextjs-14-complete-guide' AND t.slug IN ('react', 'nextjs')
  ON CONFLICT (post_id, tag_id) DO NOTHING;

  INSERT INTO post_tags (post_id, tag_id)
  SELECT p.id, t.id
  FROM posts p, tags t
  WHERE p.slug = 'typescript-best-practices' AND t.slug = 'typescript'
  ON CONFLICT (post_id, tag_id) DO NOTHING;

  INSERT INTO post_tags (post_id, tag_id)
  SELECT p.id, t.id
  FROM posts p, tags t
  WHERE p.slug = 'postgresql-performance-tips' AND t.slug = 'postgresql'
  ON CONFLICT (post_id, tag_id) DO NOTHING;
END
$$;

-- ================================================================
-- 第五步：插入示例评论
-- ================================================================

DO $$
DECLARE
  post1_id UUID;
  user1_id UUID;
  user2_id UUID;
BEGIN
  SELECT id INTO post1_id FROM posts WHERE slug = 'nextjs-14-complete-guide';
  SELECT id INTO user1_id FROM users WHERE username = 'user1';
  SELECT id INTO user2_id FROM users WHERE username = 'user2';

  IF post1_id IS NOT NULL THEN
    -- 插入评论
    INSERT INTO comments (post_id, author_id, content, status, created_at) VALUES
    (post1_id, user1_id, '非常详细的文章！学到了很多。', 'approved', NOW() - INTERVAL '28 days'),
    (post1_id, user2_id, 'Server Actions 真的很方便，已经在项目里使用了。', 'approved', NOW() - INTERVAL '27 days'),
    (post1_id, user1_id, '期待更多关于 Turbopack 的内容。', 'approved', NOW() - INTERVAL '26 days'),
    (post1_id, NULL, '请问升级到 Next.js 14 有什么需要注意的吗？', 'pending', NOW() - INTERVAL '25 days')
    ON CONFLICT DO NOTHING;

    -- 插入回复
    INSERT INTO comments (post_id, author_id, parent_id, content, status, created_at)
    SELECT
      c.post_id,
      (SELECT id FROM users WHERE username = 'admin'),
      c.id,
      '升级前建议先查看官方迁移指南，大部分改动是兼容的。',
      'approved',
      NOW() - INTERVAL '24 days'
    FROM comments c
    WHERE c.content = '请问升级到 Next.js 14 有什么需要注意的吗？'
    ON CONFLICT DO NOTHING;
  END IF;
END
$$;

-- ================================================================
-- 第六步：插入示例媒体
-- ================================================================

DO $$
DECLARE
  author1_id UUID;
BEGIN
  SELECT id INTO author1_id FROM users WHERE username = 'author1';

  INSERT INTO media (
    title, filename, url, mime_type, file_size, width, height,
    alt_text, uploader_id, created_at
  ) VALUES
  ('Next.js Logo', 'nextjs-logo.png', 'https://cdn.cyberpress.dev/media/nextjs-logo.png',
   'image/png', 25600, 512, 512, 'Next.js Logo', author1_id, NOW() - INTERVAL '30 days'),

  ('TypeScript Logo', 'typescript-logo.png', 'https://cdn.cyberpress.dev/media/typescript-logo.png',
   'image/png', 32800, 512, 512, 'TypeScript Logo', author1_id, NOW() - INTERVAL '25 days'),

  ('PostgreSQL Logo', 'postgresql-logo.png', 'https://cdn.cyberpress.dev/media/postgresql-logo.png',
   'image/png', 41600, 512, 512, 'PostgreSQL Logo', author1_id, NOW() - INTERVAL '20 days'),

  ('代码示例截图', 'code-screenshot.png', 'https://cdn.cyberpress.dev/media/code-screenshot.png',
   'image/png', 128500, 1920, 1080, '代码示例截图', author1_id, NOW() - INTERVAL '15 days')
  ON CONFLICT DO NOTHING;
END
$$;

-- ================================================================
-- 第七步：插入系统配置
-- ================================================================

INSERT INTO options (option_name, option_value, autoload) VALUES
('site_name', 'CyberPress Platform', true),
('site_description', '赛博朋克风格的博客平台，专注于技术分享', true),
('site_url', 'https://cyberpress.dev', true),
('admin_email', 'admin@cyberpress.dev', true),
('users_can_register', 'true', true),
('posts_per_page', '10', true),
('date_format', 'YYYY-MM-DD', true),
('time_format', 'HH24:MI:SS', true),
('timezone', 'Asia/Shanghai', true),
('comment_moderation', 'false', true),
('theme', 'cyberpunk', false),
('disqus_shortname', '', false),
('google_analytics_id', '', false),
('twitter_handle', '@cyberpress', false),
('github_url', 'https://github.com/cyberpress', false)
ON CONFLICT (option_name) DO UPDATE SET option_value = EXCLUDED.option_value;

-- ================================================================
-- 第八步：更新统计数据
-- ================================================================

-- 更新文章浏览量（模拟）
UPDATE posts SET view_count = FLOOR(RANDOM() * 10000) WHERE status = 'publish';
UPDATE posts SET like_count = FLOOR(RANDOM() * 500) WHERE status = 'publish';

-- ================================================================
-- 完成
-- ================================================================

DO $$
BEGIN
  RAISE NOTICE '================================================================';
  RAISE NOTICE '种子数据插入完成！';
  RAISE NOTICE '================================================================';
  RAISE NOTICE '';
  RAISE NOTICE '已创建的数据:';
  RAISE NOTICE '  - 7 个测试用户 (admin, author1-3, editor1, user1-2)';
  RAISE NOTICE '  - 14 个分类';
  RAISE NOTICE '  - 20 个标签';
  RAISE NOTICE '  - 6 篇文章 (5篇已发布，1篇草稿)';
  RAISE NOTICE '  - 多条评论和回复';
  RAISE NOTICE '  - 4 个媒体文件';
  RAISE NOTICE '  - 系统配置选项';
  RAISE NOTICE '';
  RAISE NOTICE '测试账号:';
  RAISE NOTICE '  管理员: admin / password123';
  RAISE NOTICE '  作者: author1 / password123';
  RAISE NOTICE '  用户: user1 / password123';
  RAISE NOTICE '';
  RAISE NOTICE '================================================================';
END
$$;

-- 显示统计信息
SELECT
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'categories', COUNT(*) FROM categories
UNION ALL
SELECT 'tags', COUNT(*) FROM tags
UNION ALL
SELECT 'posts', COUNT(*) FROM posts
UNION ALL
SELECT 'comments', COUNT(*) FROM comments
UNION ALL
SELECT 'media', COUNT(*) FROM media
ORDER BY count DESC;
