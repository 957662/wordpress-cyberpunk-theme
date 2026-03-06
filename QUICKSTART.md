# CyberPress Platform - 快速启动指南

## 🚀 5分钟快速开始

### 前置要求
- Node.js 18+
- npm 或 yarn
- WordPress 实例（可选，用于后端）

### 第一步：安装依赖

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 或使用 yarn
yarn install
```

### 第二步：配置环境变量

创建 `frontend/.env.local` 文件：

```env
# WordPress API 地址（如果使用本地 WordPress）
NEXT_PUBLIC_WP_API_URL=http://localhost:8080/wp-json

# 网站地址
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 分析 ID（可选）
NEXT_PUBLIC_GA_ID=
```

### 第三步：启动开发服务器

```bash
# 开发模式
npm run dev

# 或使用 yarn
yarn dev
```

访问 http://localhost:3000

## 📦 完整安装步骤

### 1. 克隆项目（如果需要）

```bash
git clone <repository-url>
cd cyberpress-platform
```

### 2. 安装所有依赖

```bash
cd frontend
npm install
```

### 3. 配置 Tailwind CSS

Tailwind CSS 已经配置完成，无需额外设置。

### 4. 启动开发服务器

```bash
npm run dev
```

## 🎯 开发工作流

### 创建新页面

```bash
# 1. 创建页面文件
touch frontend/app/my-page/page.tsx

# 2. 编辑页面
export default function MyPage() {
  return <div>My Page</div>;
}

# 3. 访问页面
# http://localhost:3000/my-page
```

### 创建新组件

```bash
# 1. 创建组件文件
touch frontend/components/ui/MyComponent.tsx

# 2. 编辑组件
export function MyComponent() {
  return <div>My Component</div>;
}

# 3. 在页面中使用
import { MyComponent } from '@/components/ui';

export default function MyPage() {
  return <MyComponent />;
}
```

### 添加样式

```tsx
// 使用 Tailwind CSS 类
<div className="bg-cyber-dark text-cyber-cyan">
  内容
</div>

// 或使用 CSS 模块
import styles from './MyComponent.module.css';

<div className={styles.container}>
  内容
</div>
```

## 🔧 常用命令

### 开发
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run format       # 代码格式化
```

### 测试
```bash
npm test            # 运行测试
npm run test:watch  # 监视模式
npm run test:ui     # 测试 UI
```

### 类型检查
```bash
npm run type-check  # TypeScript 类型检查
```

## 🐛 故障排除

### 问题 1: 端口已被占用

```bash
# 使用不同端口启动
PORT=3001 npm run dev
```

### 问题 2: 模块未找到

```bash
# 清除缓存并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题 3: TypeScript 错误

```bash
# 重新生成类型
npm run type-check
```

### 问题 4: 样式未生效

```bash
# 重新构建 Tailwind CSS
npm run build
```

## 📚 项目结构导航

### 主要目录
- `app/` - Next.js 页面
- `components/` - React 组件
- `lib/` - 工具函数和库
- `styles/` - 全局样式
- `public/` - 静态资源

### 关键文件
- `app/layout.tsx` - 根布局
- `app/page.tsx` - 首页
- `next.config.js` - Next.js 配置
- `tailwind.config.js` - Tailwind 配置
- `tsconfig.json` - TypeScript 配置

## 🎨 设计系统快速参考

### 颜色类名
```tsx
// 背景色
className="bg-cyber-dark"        // 深色背景
className="bg-cyber-card"        // 卡片背景
className="bg-cyber-cyan"        // 霓虹青

// 文字色
className="text-white"           // 白色文字
className="text-cyber-cyan"      // 霓虹青文字
className="text-gray-400"        // 灰色文字

// 边框色
className="border-cyber-border"  // 边框
className="border-cyber-cyan"    // 霓虹青边框
```

### 效果类名
```tsx
// 发光效果
className="shadow-neon-cyan"     // 霓虹青发光
className="shadow-neon-purple"   // 霓虹紫发光

// 文字效果
className="text-glow-cyan"       // 文字发光

// 其他效果
className="scanlines"            // 扫描线
className="glitch"               // 故障效果
```

### 组件使用
```tsx
// 按钮
import { CyberButton } from '@/components/ui';

<CyberButton variant="primary" size="lg">
  点击我
</CyberButton>

// 卡片
import { Card } from '@/components/ui';

<Card variant="neon">
  <h3>标题</h3>
  <p>内容</p>
</Card>

// 输入框
import { CyberInput } from '@/components/ui';

<CyberInput
  label="用户名"
  placeholder="输入用户名"
  variant="cyan"
/>
```

## 🔄 开发循环

### 1. 创建功能分支
```bash
git checkout -b feature/my-feature
```

### 2. 进行开发
```bash
npm run dev
# 在浏览器中测试更改
```

### 3. 提交更改
```bash
git add .
git commit -m "feat: add my feature"
```

### 4. 推送到远程
```bash
git push origin feature/my-feature
```

### 5. 创建 Pull Request
在 GitHub/GitLab 上创建 PR

## 📖 学习资源

### 官方文档
- [Next.js 文档](https://nextjs.org/docs)
- [React 文档](https://react.dev)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

### 视频教程
- [Next.js 快速开始](https://nextjs.org/learn)
- [Tailwind CSS 课程](https://tailwindcss.com/course)
- [Framer Motion 教程](https://www.framer.com/motion/guide/)

### 社区
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Tailwind CSS GitHub](https://github.com/tailwindlabs/tailwindcss)
- [Stack Overflow](https://stackoverflow.com)

## 💡 最佳实践

### 1. 组件开发
- 使用函数式组件
- 使用 TypeScript 类型
- 保持组件小而专注
- 使用 props 接口

### 2. 状态管理
- 使用 React Hooks
- 考虑使用 Zustand 全局状态
- 使用 React Query 管理服务器状态

### 3. 性能优化
- 使用动态导入
- 优化图片
- 使用 React.memo
- 代码分割

### 4. 代码质量
- 使用 ESLint
- 使用 Prettier
- 编写测试
- 代码审查

## 🆘 获取帮助

### 文档
- 查看 [PROJECT_SETUP.md](./PROJECT_SETUP.md)
- 查看 [TODO.md](./TODO.md)

### 问题报告
在 GitHub 上创建 Issue

### 讨论
加入我们的 Discord/Slack 频道

---

**祝你开发愉快！** 🎉

**最后更新**: 2026-03-06
**版本**: v1.0.0
