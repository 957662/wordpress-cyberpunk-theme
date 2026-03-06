# CyberPress Frontend

> 赛博朋克风格的现代化博客平台前端

## 🎉 项目状态

**✅ 基础设施完成 | ⚠️ 核心功能待实现**

- ✅ 所有依赖已安装
- ✅ 配置文件完整
- ✅ 样式系统完整
- ✅ 图形素材完整（50+ 图标）
- ⚠️ 需要创建 18 个核心文件（所有代码已提供！）

## 📚 文档导航

| 文档 | 说明 | 适合人群 |
|------|------|----------|
| [🎯 START_HERE.md](./START_HERE.md) | **从这里开始！** 快速启动指南 | 所有人 |
| [📊 PROJECT_STATUS.md](./PROJECT_STATUS.md) | 详细状态 + 完整代码示例 | 开发者 |
| [🌳 PROJECT_TREE.md](./PROJECT_TREE.md) | 可视化项目结构 | 所有 |
| [📋 SUMMARY.md](./SUMMARY.md) | 项目总结和统计 | 所有 |
| [🚀 SETUP_GUIDE.md](./SETUP_GUIDE.md) | 完整设置指南 | 开发者 |

## 🚀 快速开始（3 步）

### 1️⃣ 查看快速启动指南
```bash
cat START_HERE.md
```

### 2️⃣ 创建核心文件
所有代码都在 `PROJECT_STATUS.md` 中提供！

最少需要创建 7 个文件：
- `lib/utils.ts`
- `lib/types.ts`
- `lib/wordpress/client.ts`
- `components/providers/ThemeProvider.tsx`
- `components/providers/QueryProvider.tsx`
- `app/layout.tsx`
- `app/page.tsx`

### 3️⃣ 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

---

## 📦 原有内容

### 安装依赖

```bash
npm install
```

### 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件：

```env
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📦 项目结构

```
frontend/
├── app/                      # Next.js App Router
│   ├── (public)/            # 公开页面
│   │   ├── page.tsx         # 首页
│   │   ├── blog/            # 博客
│   │   ├── portfolio/       # 作品集
│   │   └── about/           # 关于
│   ├── layout.tsx           # 根布局
│   ├── error.tsx            # 错误页面
│   ├── loading.tsx          # 加载页面
│   └── not-found.tsx        # 404 页面
│
├── components/              # React 组件
│   ├── ui/                 # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   ├── layout/             # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── blog/               # 博客组件
│   ├── portfolio/          # 作品集组件
│   ├── effects/            # 特效组件
│   └── icons/              # 图标组件
│
├── lib/                    # 工具库
│   ├── wordpress/          # WordPress API
│   ├── utils/              # 工具函数
│   └── config/             # 配置
│
├── hooks/                  # 自定义 Hooks
├── store/                  # 状态管理
├── types/                  # TypeScript 类型
├── styles/                 # 全局样式
└── docs/                   # 文档
```

## 🎨 核心特性

### UI 组件库
- ✅ 30+ 可复用组件
- ✅ TypeScript 类型安全
- ✅ 响应式设计
- ✅ 赛博朋克主题

### 特效系统
- ✅ 故障艺术效果
- ✅ 霓虹发光边框
- ✅ 粒子背景动画
- ✅ 打字机效果

### 性能优化
- ✅ 代码分割
- ✅ 图片优化
- ✅ 懒加载
- ✅ 缓存策略

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.4
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion 11
- **状态**: Zustand 4.5
- **数据**: TanStack Query 5.28

## 📖 文档

- [架构文档](./docs/ARCHITECTURE.md)
- [开发指南](./docs/DEVELOPMENT.md)
- [项目蓝图](../PROJECT.md)

## 🎯 组件使用示例

### Button 组件

```tsx
import { Button } from '@/components/ui';

export default function Page() {
  return (
    <Button variant="primary" size="lg">
      点击我
    </Button>
  );
}
```

### Card 组件

```tsx
import { Card } from '@/components/ui';

export default function Page() {
  return (
    <Card variant="neon" glowColor="cyan">
      <h3>标题</h3>
      <p>内容</p>
    </Card>
  );
}
```

### GlitchText 效果

```tsx
import { GlitchText } from '@/components/effects';

export default function Page() {
  return (
    <GlitchText text="CYBERPRESS" speed="normal" />
  );
}
```

## 🔧 开发命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint

# 类型检查
npm run type-check
```

## 📝 提交规范

```
feat: 新功能
fix: 修复 bug
style: 代码格式
refactor: 重构
docs: 文档更新
test: 测试
chore: 构建/工具
```

## 🌈 主题定制

编辑 `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      cyber: {
        cyan: '#00f0ff',
        purple: '#9d00ff',
        pink: '#ff0080',
        // ...
      }
    }
  }
}
```

## 🚀 部署

### Vercel (推荐)

```bash
npm run build
vercel
```

### Docker

```bash
docker build -t cyberpress-frontend .
docker run -p 3000:3000 cyberpress-frontend
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Pull Request！

---

**开发者**: AI Development Team
**版本**: 0.1.0
**更新**: 2026-03-02
