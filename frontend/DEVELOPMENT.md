# CyberPress Frontend - 开发文档

## 🚀 快速开始

### 环境要求
- Node.js >= 18.17
- npm >= 9.0
- WordPress 后端实例

### 安装依赖

```bash
npm install
```

### 环境配置

复制 `.env.example` 到 `.env.local` 并配置：

```bash
cp .env.example .env.local
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
│   ├── (admin)/             # 管理页面
│   ├── api/                 # API 路由
│   └── layout.tsx           # 根布局
│
├── components/              # React 组件
│   ├── ui/                  # 基础 UI 组件
│   ├── layout/              # 布局组件
│   ├── blog/                # 博客组件
│   ├── effects/             # 特效组件
│   └── widgets/             # 小部件
│
├── lib/                     # 工具库
│   ├── config/              # 配置文件
│   ├── constants/           # 常量
│   ├── hooks/               # 自定义 Hooks
│   ├── services/            # 服务层
│   ├── utils/               # 工具函数
│   ├── validators/          # 验证器
│   └── wordpress/           # WordPress API
│
├── hooks/                   # 自定义 Hooks（公开）
├── store/                   # 状态管理
├── types/                   # TypeScript 类型
├── public/                  # 静态资源
└── styles/                  # 全局样式
```

## 🎨 设计系统

### 颜色
- 深空黑: `#0a0a0f`
- 霓虹青: `#00f0ff`
- 赛博紫: `#9d00ff`
- 激光粉: `#ff0080`
- 电压黄: `#f0ff00`
- 赛博绿: `#00ff88`

### 字体
- 正文: `Inter`
- 标题: `Orbitron`
- 代码: `JetBrains Mono`

### 间距
- 基础单位: 0.25rem (4px)
- 常用间距: 0.5rem, 1rem, 1.5rem, 2rem, 3rem

## 🔧 开发指南

### 组件开发

1. 在对应目录创建组件文件
2. 使用 TypeScript 定义 props
3. 添加 Framer Motion 动画
4. 导出从 `index.ts`

示例：
```tsx
// components/ui/MyComponent.tsx
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export default function MyComponent({
  className,
  children,
}: MyComponentProps) {
  return (
    <motion.div
      className={cn('base-styles', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
```

### API 集成

使用 WordPress 服务：

```tsx
import { wordpressService } from '@/lib/services/wordpress';

// 获取文章
const posts = await wordpressService.getPosts({
  per_page: 10,
  page: 1,
});

// 获取单个文章
const post = await wordpressService.getPostById(123);
```

### 状态管理

使用 Zustand：

```tsx
import { useStore } from '@/store/myStore';

function MyComponent() {
  const { data, setData } = useStore();
  // ...
}
```

### 自定义 Hooks

```tsx
import { useCustomHook } from '@/hooks/useCustomHook';

function MyComponent() {
  const { value, loading } = useCustomHook();
  // ...
}
```

## 🎯 最佳实践

### TypeScript
- 始终定义 props 类型
- 避免使用 `any`
- 使用类型断言谨慎

### 性能优化
- 使用 `dynamic` 导入大组件
- 图片使用 Next.js Image 组件
- 实现虚拟滚动处理长列表
- 使用 `useMemo` 和 `useCallback`

### 可访问性
- 添加 ARIA 属性
- 键盘导航支持
- 语义化 HTML
- 颜色对比度检查

### 代码规范
- ESLint: `npm run lint`
- Prettier: `npm run format`
- 类型检查: `npm run type-check`

## 📦 构建部署

### 构建
```bash
npm run build
```

### 本地预览
```bash
npm run start
```

### 环境变量
确保生产环境设置所有必要的环境变量

## 🔍 调试

### React DevTools
安装浏览器扩展进行调试

### Network Tab
检查 API 请求和响应

### Console Logs
使用 `console.log` 调试（生产环境移除）

## 📚 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

## 🐛 常见问题

### 样式不生效
- 检查 Tailwind 类名
- 清理 `.next` 缓存
- 重启开发服务器

### API 请求失败
- 检查 WordPress 后端是否运行
- 验证环境变量配置
- 检查 CORS 设置

### 类型错误
- 运行 `npm run type-check`
- 更新类型定义
- 检查导入路径

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License
