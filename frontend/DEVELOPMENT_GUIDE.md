# CyberPress Platform - 开发指南

> 赛博朋克风格博客平台完整开发文档

## 📚 目录

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [核心功能](#核心功能)
- [开发规范](#开发规范)
- [部署指南](#部署指南)
- [常见问题](#常见问题)

## 🚀 快速开始

### 环境要求

- Node.js >= 18.17
- npm >= 9.0 或 pnpm >= 8.0
- Git >= 2.30

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/your-org/cyberpress-platform.git
cd cyberpress-platform/frontend

# 安装依赖
npm install
# 或
pnpm install
```

### 环境配置

创建 `.env.local` 文件：

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 功能开关
NEXT_PUBLIC_FEATURE_COMMENTS=true
NEXT_PUBLIC_FEATURE_SEARCH=true
NEXT_PUBLIC_FEATURE_NOTIFICATIONS=true

# 分析
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# PWA
NEXT_PUBLIC_PWA_ENABLED=true
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 📁 项目结构

```
frontend/
├── app/                      # Next.js App Router
│   ├── (public)/            # 公开页面
│   ├── (auth)/              # 认证页面
│   ├── (admin)/             # 管理后台
│   ├── api/                 # API 路由
│   ├── blog/                # 博客页面
│   └── layout.tsx           # 根布局
│
├── components/              # React 组件
│   ├── ui/                  # 基础 UI 组件
│   ├── blog/                # 博客相关组件
│   ├── layout/              # 布局组件
│   ├── effects/             # 特效组件
│   ├── forms/               # 表单组件
│   └── features/            # 功能组件
│
├── hooks/                   # 自定义 Hooks
│   ├── use-api.ts          # API 请求
│   ├── use-auth.ts         # 认证
│   ├── use-blog.ts         # 博客数据
│   └── ...
│
├── lib/                     # 工具库
│   ├── api/                # API 客户端
│   ├── utils/              # 工具函数
│   ├── validation/         # 验证函数
│   └── constants/          # 常量定义
│
├── services/                # 业务服务
│   ├── blog-service.ts     # 博客服务
│   ├── auth-service.ts     # 认证服务
│   └── ...
│
├── store/                   # 状态管理
│   ├── authStore.ts        # 认证状态
│   ├── blogStore.ts        # 博客状态
│   └── ...
│
├── types/                   # TypeScript 类型
│   ├── index.ts            # 全局类型
│   ├── blog.ts             # 博客类型
│   └── ...
│
├── styles/                  # 样式文件
│   ├── globals.css         # 全局样式
│   └── themes/             # 主题配置
│
└── config/                  # 配置文件
    ├── site.ts             # 站点配置
    └── navigation.ts       # 导航配置
```

## 🎯 核心功能

### 1. 博客系统

#### 文章列表

```tsx
import { ArticleGrid } from '@/components/blog/ArticleGrid';
import { useBlogPosts } from '@/hooks/use-blog';

function BlogPage() {
  const { posts, isLoading, error } = useBlogPosts();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return <ArticleGrid posts={posts} />;
}
```

#### 文章详情

```tsx
import { BlogDetail } from '@/components/blog/BlogDetail';

function PostPage({ params }: { params: { slug: string } }) {
  return <BlogDetail slug={params.slug} />;
}
```

### 2. 用户认证

```tsx
import { useAuth } from '@/hooks/use-auth';
import { LoginForm } from '@/components/auth/LoginForm';

function LoginPage() {
  const { login, isLoading } = useAuth();

  const handleSubmit = async (credentials) => {
    await login(credentials);
  };

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
```

### 3. 评论系统

```tsx
import { CommentSystem } from '@/components/blog/CommentSystem';

function PostComments({ postId }) {
  return (
    <CommentSystem
      postId={postId}
      enableMarkdown={true}
      enableNested={true}
    />
  );
}
```

### 4. 搜索功能

```tsx
import { SearchBar } from '@/components/search/SearchBar';

function Header() {
  return <SearchBar placeholder="搜索文章..." />;
}
```

### 5. 通知系统

```tsx
import { NotificationManager } from '@/components/notifications/NotificationManager';

function App() {
  return <NotificationManager />;
}
```

## 📝 开发规范

### 代码风格

```bash
# 格式化代码
npm run format

# 检查代码风格
npm run format:check

# Lint 检查
npm run lint

# 类型检查
npm run type-check
```

### 命名规范

- **组件**: PascalCase (`ArticleCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useBlogPosts.ts`)
- **工具函数**: camelCase (`formatDate.ts`)
- **常量**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **类型**: PascalCase (`BlogPost`, `UserProps`)

### 文件组织

```
components/blog/
├── ArticleCard.tsx        # 组件文件
├── ArticleCard.test.tsx   # 测试文件
├── index.ts              # 导出文件
└── types.ts              # 类型定义
```

### 注释规范

```tsx
/**
 * ArticleCard Component
 * 文章卡片组件 - 用于博客列表展示
 *
 * @param post - 文章数据
 * @param variant - 显示变体
 * @returns JSX Element
 */
export function ArticleCard({ post, variant }: ArticleCardProps) {
  // 组件实现
}
```

## 🎨 UI 组件使用

### 按钮

```tsx
import { CyberButton } from '@/components/ui/CyberButton';

<CyberButton variant="primary" size="lg">
  点击我
</CyberButton>
```

### 卡片

```tsx
import { Card } from '@/components/ui/Card';

<Card>
  <Card.Header>
    <Card.Title>标题</Card.Title>
  </Card.Header>
  <Card.Content>内容</Card.Content>
</Card>
```

### 表单

```tsx
import { Form, Input, Button } from '@/components/ui/form';

<Form onSubmit={handleSubmit}>
  <Input name="email" type="email" label="邮箱" required />
  <Input name="password" type="password" label="密码" required />
  <Button type="submit">提交</Button>
</Form>
```

## 🔧 配置说明

### 站点配置

`config/site.ts`:

```typescript
export const siteConfig = {
  name: 'CyberPress',
  url: 'https://cyberpress.dev',
  description: '赛博朋克博客平台',
  // ... 更多配置
};
```

### 主题配置

`tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
      },
    },
  },
};
```

## 🚀 部署指南

### 构建生产版本

```bash
npm run build
```

### 环境变量

确保设置了所有必需的环境变量：

```env
NEXT_PUBLIC_API_URL=https://api.cyberpress.dev
NEXT_PUBLIC_SITE_URL=https://cyberpress.dev
```

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### Docker 部署

```bash
# 构建镜像
docker build -t cyberpress-frontend .

# 运行容器
docker run -p 3000:3000 cyberpress-frontend
```

## 🧪 测试

```bash
# 运行单元测试
npm run test

# 运行测试并生成覆盖率
npm run test:ci

# 运行 E2E 测试
npm run test:e2e
```

## ❓ 常见问题

### Q: 如何添加新的页面？

在 `app/` 目录下创建新文件夹和 `page.tsx`：

```
app/
└── about/
    └── page.tsx
```

### Q: 如何自定义主题？

修改 `tailwind.config.ts` 和 `styles/globals.css`。

### Q: 如何添加新的 API 端点？

在 `app/api/` 目录下创建路由：

```
app/api/
└── users/
    └── route.ts
```

### Q: 如何优化性能？

- 使用 Image 组件优化图片
- 启用静态生成 (SSG)
- 使用动态导入 (Dynamic Import)
- 配置缓存策略

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

## 🤝 贡献

欢迎提交 Pull Request！

## 📄 许可证

MIT License
