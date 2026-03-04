# CyberPress Platform - 前端快速开始指南

## 📦 项目概述

CyberPress 是一个基于 Next.js 14 和 WordPress REST API 的赛博朋克风格博客平台。

### 核心技术栈

- **框架**: Next.js 14.2 (App Router)
- **语言**: TypeScript 5.4
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion 11.0
- **状态管理**: Zustand + TanStack Query
- **CMS**: WordPress (Headless)

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 2. 环境变量配置

复制 `.env.example` 到 `.env.local`:

```bash
cp .env.example .env.local
```

配置以下环境变量：

```env
# WordPress API
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 功能开关
NEXT_PUBLIC_FEATURE_COMMENTS=true
NEXT_PUBLIC_FEATURE_NEWSLETTER=true
NEXT_PUBLIC_FEATURE_PWA=false

# 分析（可选）
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看网站。

## 📁 项目结构

```
frontend/
├── app/                      # Next.js App Router 页面
│   ├── (public)/            # 公开页面组
│   ├── (admin)/             # 管理页面组
│   ├── api/                 # API 路由
│   ├── blog/                # 博客页面
│   ├── portfolio/           # 作品集页面
│   └── layout.tsx           # 根布局
│
├── components/               # React 组件
│   ├── ui/                  # 基础 UI 组件
│   ├── layout/              # 布局组件
│   ├── blog/                # 博客组件
│   ├── effects/             # 特效组件
│   ├── forms/               # 表单组件
│   └── index.ts             # 组件导出
│
├── lib/                     # 工具库
│   ├── api/                 # API 客户端
│   ├── utils/               # 工具函数
│   ├── hooks/               # 自定义 Hooks
│   ├── services/            # 业务服务
│   └── constants/           # 常量定义
│
├── providers/               # Context Providers
│   ├── AppProvider.tsx      # 应用上下文
│   └── QueryProvider.tsx    # React Query Provider
│
├── types/                   # TypeScript 类型定义
│   ├── blog.types.ts        # 博客类型
│   ├── api.types.ts         # API 类型
│   └── index.ts             # 类型导出
│
├── public/                  # 静态资源
│   ├── images/              # 图片
│   ├── icons/               # 图标
│   └── fonts/               # 字体文件
│
└── styles/                  # 样式文件
    ├── globals.css          # 全局样式
    └── tailwind.css         # Tailwind 配置
```

## 🎨 设计系统

### 颜色主题

```css
/* 主色调 */
--cyber-dark: #0a0a0f      /* 深空黑 */
--cyber-cyan: #00f0ff      /* 霓虹青 */
--cyber-purple: #9d00ff    /* 赛博紫 */
--cyber-pink: #ff0080      /* 激光粉 */
--cyber-yellow: #f0ff00    /* 电压黄 */
```

### 组件使用示例

#### 按钮组件

```tsx
import { CyberButton } from '@/components/ui';

<CyberButton variant="primary" color="cyan">
  点击我
</CyberButton>

<CyberButton variant="outline" color="purple" size="lg">
  大按钮
</CyberButton>
```

#### 卡片组件

```tsx
import { Card } from '@/components/ui';

<Card className="p-6">
  <h3>标题</h3>
  <p>内容</p>
</Card>
```

#### 表单组件

```tsx
import { Input, Textarea, Select } from '@/components/ui';

<Input placeholder="请输入..." />
<Textarea rows={4} />
<Select options={options} />
```

## 🔧 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器

# 构建
npm run build           # 生产环境构建
npm start               # 启动生产服务器

# 代码检查
npm run lint            # ESLint 检查
npm run type-check      # TypeScript 类型检查

# 格式化
npm run format          # Prettier 格式化
```

## 📝 开发指南

### 创建新页面

在 `app/` 目录下创建新文件：

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return <div>About Page</div>;
}
```

### 创建新组件

在 `components/` 目录下创建组件：

```tsx
// components/ui/MyComponent.tsx
export function MyComponent({ children }) {
  return <div className="cyber-card">{children}</div>;
}
```

### 使用 API 获取数据

```tsx
import { usePosts } from '@/services/data/dataService';

export default function BlogPage() {
  const { data, isLoading, error } = usePosts({ page: 1, perPage: 10 });

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>错误: {error.message}</div>;

  return (
    <div>
      {data?.data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
```

### 使用自定义 Hooks

```tsx
import { useDebounce, useLocalStorage } from '@/hooks';

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [history, setHistory] = useLocalStorage('search-history', []);

  // 使用 debouncedQuery 进行搜索
}
```

## 🎯 性能优化

### 图片优化

```tsx
import Image from 'next/image';

<Image
  src="/images/avatar.jpg"
  alt="Avatar"
  width={200}
  height={200}
  priority  // 首屏图片
/>
```

### 代码分割

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>加载中...</div>,
  ssr: false,  // 仅客户端渲染
});
```

### 缓存策略

```tsx
// 使用 React Query 缓存
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 5 * 60 * 1000,  // 5 分钟
  cacheTime: 10 * 60 * 1000,  // 10 分钟
});
```

## 🐛 调试技巧

### React DevTools

安装 [React DevTools](https://react.devtools/) 浏览器扩展。

### Redux DevTools

如果使用 Zustand，安装 [Redux DevTools](https://github.com/zustandjs/zustand#redux-devtools)。

### Network 面板

使用浏览器开发者工具的 Network 面板查看 API 请求。

### Console Logging

```tsx
console.log('Debug info:', data);
console.table(posts);
```

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [WordPress REST API 手册](https://developer.wordpress.org/rest-api/)

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 💬 获取帮助

- 📧 邮箱: support@
- 💬 讨论: [GitHub Discussions](https://github.com/cyberpress-platform/discussions)
- 🐛 问题反馈: [GitHub Issues](https://github.com/cyberpress-platform/issues)

---

**Happy Coding! 🚀**
