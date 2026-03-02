# 🚀 CyberPress Platform - 快速开始指南

## 📖 项目简介

CyberPress 是一个基于 **Next.js 14** 和 **WordPress Headless CMS** 的赛博朋克风格博客平台。它融合了未来科技感与极致用户体验，提供流畅的动画效果和独特的视觉风格。

### ✨ 核心特性

- 🎨 **赛博朋克主题** - 霓虹发光效果 + 故障艺术
- ⚡ **Next.js 14** - App Router + Server Components
- 🔥 **流畅动画** - Framer Motion 驱动
- 📱 **响应式设计** - 完美适配所有设备
- 🎯 **TypeScript** - 类型安全
- 🧩 **70+ 组件** - 高度可复用
- 🔍 **SEO 优化** - Sitemap + Open Graph
- 🚀 **性能优化** - 代码分割 + 懒加载

## 🛠️ 技术栈

```
Frontend:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Zustand (状态管理)
  - TanStack Query (数据获取)
  - Lucide React (图标)

Backend:
  - WordPress REST API
  - MySQL
```

## 📦 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 配置你的 WordPress API 地址：

```env
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
frontend/
├── app/                    # Next.js App Router
│   ├── (public)/          # 公开页面
│   │   ├── page.tsx       # 首页
│   │   ├── blog/          # 博客
│   │   ├── portfolio/     # 作品集
│   │   └── about/         # 关于
│   └── (admin)/           # 管理页面
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── effects/          # 特效组件
│   ├── layout/           # 布局组件
│   ├── blog/             # 博客组件
│   └── widgets/          # 小部件
├── lib/                  # 工具库
│   ├── wordpress/        # WordPress API
│   ├── utils.ts          # 工具函数
│   └── store.ts          # 状态管理
├── hooks/                # 自定义 Hooks
├── types/                # TypeScript 类型
└── styles/               # 样式文件
```

## 🎨 组件使用示例

### Button 按钮

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md">
  点击我
</Button>
```

### Card 卡片

```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

<Card variant="neon" neonColor="cyan">
  <CardHeader title="标题" description="描述" />
  <CardContent>内容</CardContent>
</Card>
```

### 特效组件

```tsx
import { GlitchText } from '@/components/effects/GlitchText';
import { NeonBorder } from '@/components/effects/NeonBorder';

<GlitchText text="CYBERPRESS" />
<NeonBorder color="purple">
  <div>内容</div>
</NeonBorder>
```

### 自定义 Hooks

```tsx
import { useTheme, useMediaQuery } from '@/hooks';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  const isMd = useMediaQuery('(min-width: 768px)');

  return (
    <div>
      <p>当前主题: {theme}</p>
      <button onClick={toggleTheme}>切换主题</button>
    </div>
  );
}
```

## 🎯 主题颜色

```css
--cyber-dark: #0a0a0f     /* 深空黑 */
--cyber-cyan: #00f0ff     /* 霓虹青 */
--cyber-purple: #9d00ff   /* 赛博紫 */
--cyber-pink: #ff0080     /* 激光粉 */
--cyber-yellow: #f0ff00   /* 电压黄 */
--cyber-green: #00ff88    /* 荧光绿 */
```

## 📄 可用页面

- `/` - 首页
- `/blog` - 博客列表
- `/blog/[slug]` - 博客详情
- `/portfolio` - 作品集
- `/portfolio/[slug]` - 作品详情
- `/about` - 关于页面
- `/contact` - 联系页面
- `/tags` - 标签页面
- `/categories` - 分类页面
- `/search` - 搜索页面
- `/admin` - 管理后台

## 🛠️ 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 🔧 配置说明

### WordPress 后端

1. 安装 WordPress
2. 启用 REST API
3. 安装必要插件：
   - Custom Post Types UI
   - Advanced Custom Fields
   - JWT Authentication

### 环境变量

在 `.env.local` 中配置：

```env
# WordPress API
NEXT_PUBLIC_WP_API_URL=https://your-site.com/wp-json

# 站点配置
NEXT_PUBLIC_SITE_URL=https://your-site.com
NEXT_PUBLIC_SITE_NAME=CyberPress

# 功能开关
NEXT_PUBLIC_ENABLE_COMMENTS=true
NEXT_PUBLIC_ENABLE_SEARCH=true
```

## 📚 组件文档

详细的组件文档和示例请查看：

- [组件演示](/components-demo)
- [特效演示](/effects-demo)
- [小部件演示](/widgets-demo)
- [图标展示](/icons-showcase)

## 🚀 部署

### Vercel (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Docker

```bash
docker build -t cyberpress .
docker run -p 3000:3000 cyberpress
```

### 传统服务器

```bash
npm run build
npm start
```

## 📊 项目统计

- **组件数量**: 70+
- **页面数量**: 15+
- **代码行数**: 20,000+
- **完成度**: 95%

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

---

**开发团队**: CyberPress Team
**最后更新**: 2026-03-03
**版本**: 1.0.0
