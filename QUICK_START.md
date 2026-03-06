# CyberPress Platform - 快速开始指南

## 📋 项目概述

CyberPress 是一个基于 **Next.js 14 + WordPress** 的赛博朋克风格博客平台，具有完整的组件库和精美的视觉效果。

**当前状态**: ✅ 可运行（核心功能已完成 95%）

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看效果

### 3. 访问测试页面

访问 http://localhost:3000/test 查看所有组件的演示

---

## 📁 关键文件说明

### 配置文件
- `tailwind.config.ts` - Tailwind CSS 配置（赛博朋克配色）
- `next.config.js` - Next.js 配置
- `tsconfig.json` - TypeScript 配置
- `package.json` - 项目依赖

### 主要目录
- `app/` - Next.js 14 App Router 页面
- `components/` - React 组件库
- `lib/` - 工具函数和配置
- `styles/` - 全局样式
- `public/` - 静态资源

---

## 🎨 可用组件

### UI 组件
```tsx
import { Button, Card, Input, SearchBar } from '@/components/ui';
import { CyberButton } from '@/components/ui';

// 使用示例
<Button variant="primary">点击我</Button>
<CyberButton variant="primary" size="lg">赛博按钮</CyberButton>
```

### 博客组件
```tsx
import { ArticleCard, BlogList, BlogGrid } from '@/components/blog';

<ArticleCard {...postData} />
```

### 特效组件
```tsx
import { GlitchText, ParticleBackground, NeonBorder } from '@/components/effects';

<GlitchText text="赛博朋克" />
```

---

## 🔧 环境变量

创建 `.env.local` 文件：

```env
# 站点配置
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# WordPress API
NEXT_PUBLIC_WORDPRESS_URL=http://localhost:8080
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/wp-json

# 社交媒体（可选）
NEXT_PUBLIC_SOCIAL_GITHUB=https://github.com/yourusername
NEXT_PUBLIC_SOCIAL_TWITTER=https://twitter.com/yourusername

# 分析工具（可选）
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

---

## 📊 可用页面

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | 网站首页 |
| 测试页 | `/test` | 组件测试页面 |
| 博客列表 | `/blog` | 文章列表 |
| 博客详情 | `/blog/[slug]` | 文章详情页 |
| 作品集 | `/portfolio` | 项目展示 |
| 关于 | `/about` | 关于页面 |
| 联系 | `/contact` | 联系表单 |
| 登录 | `/login` | 用户登录 |
| 管理后台 | `/admin/dashboard` | 后台管理 |

---

## 🎯 核心功能

### ✅ 已实现
- 完整的赛博朋克设计系统
- 130+ 可复用组件
- 响应式布局
- 动画效果（Framer Motion）
- 深色模式
- PWA 支持
- TypeScript 类型安全

### 🔄 待集成
- WordPress REST API 连接
- 用户认证系统
- 评论功能
- 搜索功能
- RSS 订阅

---

## 🧪 测试

```bash
# 运行测试
npm run test

# 测试覆盖率
npm run test:ci

# E2E 测试
npm run test:e2e
```

---

## 🏗️ 构建生产版本

```bash
# 构建
npm run build

# 启动生产服务器
npm start
```

---

## 🐛 常见问题

### 1. 端口被占用
```bash
# 使用其他端口启动
PORT=3001 npm run dev
```

### 2. 依赖安装失败
```bash
# 清除缓存重试
rm -rf node_modules package-lock.json
npm install
```

### 3. 类型错误
```bash
# 重新生成类型
npm run type-check
```

---

## 📚 更多文档

- [项目状态报告](./PROJECT_STATUS.md)
- [组件文档](./frontend/docs/)
- [配色参考](./frontend/docs/COLOR_REFERENCE.md)
- [图标清单](./frontend/docs/ICON_MANIFEST.md)

---

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

MIT License

---

**开发团队**: CyberPress AI Development Team 🤖
**最后更新**: 2026-03-06
