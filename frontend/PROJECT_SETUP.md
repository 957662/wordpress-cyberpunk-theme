# CyberPress Platform - 项目设置指南

## 📋 项目概览

CyberPress Platform 是一个基于 Next.js 14 构建的赛博朋克风格博客平台，采用现代化的技术栈和设计理念。

## 🚀 快速开始

### 前置要求

确保你已经安装了以下软件：

- Node.js >= 18.17.0
- npm >= 9.0.0 或 yarn >= 1.22.0 或 pnpm >= 8.0.0
- Git

### 1. 克隆项目

```bash
git clone <repository-url>
cd cyberpress-platform/frontend
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 3. 环境配置

复制 `.env.example` 文件创建 `.env.local`：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置必要的环境变量：

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json

# 站点配置
NEXT_PUBLIC_SITE_NAME=CyberPress Platform
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 功能开关
NEXT_PUBLIC_ENABLE_COMMENTS=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_NEWSLETTER=true
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
frontend/
├── app/                      # Next.js App Router
│   ├── (admin)/             # 管理后台路由组
│   ├── blog/                # 博客相关页面
│   ├── portfolio/           # 作品集页面
│   └── ...
├── components/              # React 组件
│   ├── ui/                  # UI 基础组件
│   ├── blog/                # 博客专用组件
│   ├── effects/             # 特效组件
│   ├── layout/              # 布局组件
│   └── ...
├── lib/                     # 工具库和服务
│   ├── api/                 # API 客户端
│   ├── hooks/               # 自定义 Hooks
│   ├── utils/               # 工具函数
│   ├── config/              # 配置文件
│   ├── helpers/             # 辅助函数
│   └── services/            # 业务服务
├── types/                   # TypeScript 类型定义
├── styles/                  # 全局样式
├── public/                  # 静态资源
│   ├── icons/               # 图标资源
│   ├── images/              # 图片资源
│   ├── patterns/            # 背景图案
│   └── manifest.json        # PWA 配置
├── .env.example             # 环境变量示例
├── next.config.js           # Next.js 配置
├── tailwind.config.ts       # Tailwind CSS 配置
├── tsconfig.json            # TypeScript 配置
└── package.json             # 项目依赖
```

## 🛠️ 开发指南

### 代码规范

项目使用 ESLint 和 Prettier 进行代码检查和格式化：

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

### 类型检查

```bash
npm run type-check
```

### 测试

```bash
# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage

# UI 测试模式
npm run test:ui
```

### 构建生产版本

```bash
# 构建
npm run build

# 预览生产版本
npm run start
```

## 🎨 自定义主题

### 修改颜色

编辑 `tailwind.config.ts` 文件：

```typescript
theme: {
  extend: {
    colors: {
      cyber: {
        dark: '#0a0a0f',      // 深色背景
        cyan: '#00f0ff',      // 青色主色
        purple: '#9d00ff',    // 紫色辅助色
        pink: '#ff0080',      // 粉色强调色
        // ... 更多颜色
      }
    }
  }
}
```

### 修改字体

在 `app/layout.tsx` 中配置：

```typescript
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });
```

### 添加新的动画效果

在 `tailwind.config.ts` 中添加：

```typescript
animation: {
  'my-animation': 'myAnimation 1s ease-in-out',
},
keyframes: {
  myAnimation: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
  },
}
```

## 🔧 常见问题

### 端口冲突

如果 3000 端口被占用，可以指定其他端口：

```bash
npm run dev -- -p 3001
```

### 样式不生效

确保重启开发服务器：

```bash
# 停止服务器 (Ctrl+C)
npm run dev
```

### 类型错误

清除 TypeScript 缓存：

```bash
rm -rf .next
npm run dev
```

## 📱 PWA 功能

项目支持渐进式 Web 应用功能：

- 离线可用
- 添加到主屏幕
- 推送通知

PWA 配置位于 `public/manifest.json`。

## 🔐 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | API 服务地址 | `/api` |
| `NEXT_PUBLIC_WORDPRESS_API_URL` | WordPress API 地址 | - |
| `NEXT_PUBLIC_SITE_NAME` | 站点名称 | `CyberPress Platform` |
| `NEXT_PUBLIC_SITE_URL` | 站点 URL | `http://localhost:3000` |
| `NEXT_PUBLIC_ENABLE_COMMENTS` | 是否启用评论 | `true` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | 是否启用分析 | `true` |

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](../LICENSE) 文件
