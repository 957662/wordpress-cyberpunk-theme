# CyberPress Frontend - 快速启动指南

## 🚀 项目概述

CyberPress 是一个赛博朋克风格的现代化博客平台，基于 Next.js 14 构建。

### 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: Zustand
- **数据获取**: TanStack Query
- **表单**: React Hook Form + Zod
- **通知**: React Hot Toast

## 📦 安装

```bash
# 克隆项目
git clone https://github.com/your-username/cyberpress-platform.git
cd cyberpress-platform/frontend

# 安装依赖
npm install
# 或
yarn install
# 或
pnpm install
```

## 🔧 配置

### 环境变量

创建 `.env.local` 文件：

```env
# API 配置
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 分析（可选）
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_GA_ID=

# 功能开关
NEXT_PUBLIC_FEATURE_COMMENTS=true
NEXT_PUBLIC_FEATURE_SEARCH=true
```

## 🏃 运行

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm run start

# 类型检查
npm run type-check

# 代码检查
npm run lint
```

访问 http://localhost:3000

## 📁 项目结构

```
frontend/
├── app/                    # Next.js App Router
│   ├── (public)/          # 公开页面
│   ├── (admin)/           # 管理页面
│   ├── api/               # API 路由
│   └── layout.tsx         # 根布局
├── components/            # React 组件
│   ├── ui/               # UI 基础组件
│   ├── layout/           # 布局组件
│   ├── forms/            # 表单组件
│   ├── effects/          # 特效组件
│   ├── blog/             # 博客组件
│   └── graphics/         # 图形组件
├── lib/                  # 工具库
│   ├── services/         # API 服务
│   ├── utils/            # 工具函数
│   ├── hooks/            # 自定义 Hooks
│   ├── schemas/          # 验证 Schemas
│   ├── i18n/             # 国际化
│   └── middleware/       # 中间件
├── hooks/                # 自定义 Hooks
├── types/                # TypeScript 类型
├── store/                # 状态管理
└── public/               # 静态资源
```

## 🎨 主题定制

### 颜色配置

编辑 `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      'neon-cyan': '#00f0ff',
      'cyber-purple': '#9d00ff',
      'laser-pink': '#ff0080',
      'voltage-yellow': '#f0ff00',
    },
  },
}
```

### 组件使用

```tsx
import { CyberButton } from '@/components/ui/CyberButton';
import { GlitchEffect } from '@/components/effects/GlitchEffect';

export default function Page() {
  return (
    <div>
      <GlitchEffect trigger="hover">
        <CyberButton>点击我</CyberButton>
      </GlitchEffect>
    </div>
  );
}
```

## 🌍 国际化

```tsx
import { useTranslation } from '@/hooks/useTranslation';

export default function Component() {
  const { t, locale, setLocale } = useTranslation();

  return (
    <div>
      <h1>{t('common.welcome')}</h1>
      <button onClick={() => setLocale('en-US')}>English</button>
      <button onClick={() => setLocale('zh-CN')}>中文</button>
    </div>
  );
}
```

## 🔌 API 服务

```tsx
import { apiService } from '@/lib/services/api-service';

// GET 请求
const data = await apiService.get('/posts');

// POST 请求
const result = await apiService.post('/posts', { title: 'Hello' });

// 文件上传
const file = await apiService.upload('/upload', fileObject, (progress) => {
  console.log(`${progress}% uploaded`);
});
```

## 🧪 测试

```bash
# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# 测试 UI
npm run test:ui
```

## 📝 代码规范

### 命名约定

- **组件**: PascalCase (如 `PostCard.tsx`)
- **工具函数**: camelCase (如 `formatDate.ts`)
- **Hooks**: camelCase with `use` 前缀 (如 `useAuth.ts`)
- **常量**: UPPER_SNAKE_CASE (如 `API_URL`)
- **类型**: PascalCase (如 `UserData`)

### Git 提交

```bash
feat: 添加新功能
fix: 修复 bug
style: 代码格式调整
refactor: 代码重构
docs: 文档更新
test: 测试相关
chore: 构建/工具相关
```

## 🚢 部署

### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Docker

```bash
# 构建镜像
docker build -t cyberpress-frontend .

# 运行容器
docker run -p 3000:3000 cyberpress-frontend
```

## 📚 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Zustand 文档](https://github.com/pmndrs/zustand)

## 🆘 常见问题

### 端口被占用

```bash
# 使用其他端口
npm run dev -- -p 3001
```

### 依赖安装失败

```bash
# 清除缓存
rm -rf node_modules package-lock.json
npm install
```

### 类型错误

```bash
# 重新生成类型
npm run type-check
```

## 📄 许可证

MIT License

---

**祝你开发愉快！** 🎉
