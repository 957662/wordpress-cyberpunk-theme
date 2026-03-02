# CyberPress Platform - 快速参考指南

## 🚀 快速开始

### 安装与运行
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 复制环境变量
cp .env.local.example .env.local

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 核心目录结构

```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── (public)/          # 公开路由组
│   │   ├── page.tsx       # 首页
│   │   ├── blog/          # 博客
│   │   ├── portfolio/     # 作品集
│   │   └── showcase/      # 展示页面
│   ├── (admin)/           # 管理路由组
│   └── api/               # API 路由
│
├── components/            # React 组件
│   ├── ui/               # 基础 UI 组件
│   ├── layout/           # 布局组件
│   ├── blog/             # 博客组件
│   └── effects/          # 动画效果
│
├── lib/                  # 工具库
│   ├── api/             # API 客户端
│   ├── config/          # 配置文件
│   ├── constants/       # 常量
│   ├── utils/           # 工具函数
│   └── wordpress/       # WordPress 集成
│
├── hooks/               # 自定义 Hooks
├── styles/              # 样式文件
├── types/               # TypeScript 类型
└── store/               # 状态管理
```

## 🎨 赛博朋克样式

### 颜色系统
```css
/* 主色调 */
--cyber-dark: #0a0a0f
--cyber-cyan: #00f0ff
--cyber-purple: #9d00ff
--cyber-pink: #ff0080

/* 使用示例 */
<div className="bg-cyber-dark text-cyber-cyan border border-cyber-cyan/30">
```

### 发光效果
```tsx
{/* 文字发光 */}
<h1 className="text-glow-cyan">发光标题</h1>

{/* 边框发光 */}
<div className="border-glow-cyan">发光边框</div>
```

### 组件样式
```tsx
{/* 赛博按钮 */}
<button className="cyber-button">点击我</button>

{/* 赛博卡片 */}
<div className="cyber-card">卡片内容</div>
```

## 🎬 动画效果

### Framer Motion 基础
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  内容
</motion.div>
```

### 预设动画
```tsx
import { slideUp, scaleIn, staggerContainer } from '@/lib/config/animations';

<motion.div variants={slideUp} initial="hidden" animate="visible">
  内容
</motion.div>
```

### 悬停效果
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  可交互元素
</motion.div>
```

## 🔧 常用 Hooks

### 数据获取
```tsx
import { usePosts } from '@/hooks/usePosts';
import { useWordPressPosts } from '@/hooks/useWordPressPosts';

const { data, isLoading, error } = usePosts();
const { posts, loading } = useWordPressPosts({ page: 1 });
```

### 响应式
```tsx
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const { isMd, isLg } = useBreakpoints();
const isMobile = useMediaQuery('(max-width: 768px)');
```

### 本地存储
```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage';

const [theme, setTheme] = useLocalStorage('theme', 'dark');
```

### 滚动
```tsx
import { useScroll } from '@/hooks/useScroll';
import { useScrollDirection } from '@/hooks/useScrollDirection';

const { scrollY } = useScroll();
const { scrollDirection, isScrollingUp } = useScrollDirection();
```

## 🛠️ 工具函数

### 日期处理
```tsx
import { formatDate, formatRelativeTime } from '@/lib/utils/date';

formatDate(new Date(), 'yyyy-MM-dd');
formatRelativeTime(post.date); // "3天前"
```

### 数字处理
```tsx
import { formatNumber, formatFileSize } from '@/lib/utils/number';

formatNumber(1234567); // "1,234,567"
formatFileSize(1024 * 1024); // "1 MB"
```

### 字符串处理
```tsx
import { excerpt, slugify } from '@/lib/utils/string';

excerpt(htmlContent, 160); // 提取摘要
slugify('Hello World'); // "hello-world"
```

### 类名合并
```tsx
import { cn } from '@/lib/utils/cn';

cn('px-4 py-2', isActive && 'bg-cyber-cyan', 'hover:scale-105');
```

## 📡 API 调用

### WordPress API
```tsx
import { getPosts, getPostBySlug } from '@/lib/api/posts';

// 获取文章列表
const posts = await getPosts({ page: 1, per_page: 10 });

// 获取单篇文章
const post = await getPostBySlug('post-slug');
```

### 通用 API 客户端
```tsx
import { apiClient } from '@/lib/api/client';

const { data } = await apiClient.get('/endpoint');
await apiClient.post('/endpoint', { data });
```

## 🎯 常见模式

### 客户端组件
```tsx
'use client';

import { useState } from 'react';

export function MyComponent() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

### 服务器组件
```tsx
import { getPosts } from '@/lib/api/posts';

export default async function Page() {
  const posts = await getPosts();
  return <div>{posts.map(/* ... */)}</div>;
}
```

### 数据获取
```tsx
// 服务器端
export default async function Page() {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return <div>{data}</div>;
}

// 客户端
'use client';
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['data'],
  queryFn: () => fetch('/api/data').then(r => r.json()),
});
```

### 表单处理
```tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export function Form() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('name')} />
      <input {...register('email')} />
      <button type="submit">提交</button>
    </form>
  );
}
```

## 🎨 组件示例

### 卡片组件
```tsx
import { CyberCard } from '@/components/ui/CyberCard';

<CyberCard variant="cyan" holographic>
  <h3>标题</h3>
  <p>内容</p>
</CyberCard>
```

### 按钮组件
```tsx
import { CyberButton } from '@/components/ui/CyberButton';

<CyberButton variant="purple" size="lg" onClick={handleClick}>
  点击我
</CyberButton>
```

### 加载动画
```tsx
import { CyberLoader } from '@/components/ui/CyberLoader';

<CyberLoader type="cyber" size="md" variant="cyan" />
```

### 进度条
```tsx
import { ProgressBar } from '@/components/ui/ProgressBar';

<ProgressBar value={75} max={100} variant="cyan" showLabel />
```

## 🌐 路由

### 链接导航
```tsx
import Link from 'next/link';

<Link href="/blog">博客</Link>
<Link href={`/blog/${post.slug}`}>文章详情</Link>
```

### 动态路由
```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  return <div>{post.content}</div>;
}
```

### 路由常量
```tsx
import { routes } from '@/lib/constants/routes';

<Link href={routes.blog}>博客</Link>
<Link href={routes.blogPost('slug')}>文章</Link>
```

## 🎭 状态管理

### Zustand Store
```tsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// 使用
function Component() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

## 📱 响应式设计

### Tailwind 断点
```tsx
<div className="px-4 md:px-8 lg:px-12">
  响应式内边距
</div>
```

### 条件渲染
```tsx
const { isMd } = useBreakpoints();

{isMd ? <DesktopNav /> : <MobileNav />}
```

## 🔍 搜索与筛选

### 文章搜索
```tsx
import { useSearch } from '@/hooks/useSearch';

const { query, setQuery, results } = useSearch();
```

### 分类筛选
```tsx
const [category, setCategory] = useState<number | null>(null);
const posts = usePosts({ categories: category || undefined });
```

## 📊 性能优化

### 图片优化
```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="描述"
  width={800}
  height={600}
  priority // 首屏图片
/>
```

### 代码分割
```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <CyberLoader />,
});
```

### 缓存策略
```tsx
// 服务器组件缓存
const data = await fetch(url, { next: { revalidate: 60 } });

// 客户端缓存
const { data } = useQuery({
  queryKey: ['posts'],
  queryFn: fetchPosts,
  staleTime: 60000,
});
```

## 🐛 调试

### 错误边界
```tsx
'use client';
import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component {
  // ...
}
```

### 控制台日志
```tsx
import { logger } from '@/lib/utils/logger';

logger.info('信息');
logger.error('错误');
logger.warn('警告');
```

## 📝 类型定义

### 常用类型
```tsx
import type { Post, Category, Tag } from '@/types/wordpress';
import type { ApiResponse, PaginatedResponse } from '@/types';

const post: Post = { /* ... */ };
const response: ApiResponse<Post> = { /* ... */ };
```

## 🚀 部署

### 环境变量
确保在生产环境设置以下变量：
```bash
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-site.com/wp-json
NEXT_PUBLIC_SITE_URL=https://your-site.com
```

### 构建
```bash
npm run build
```

### 部署平台
- **Vercel**: 推荐，零配置
- **Netlify**: 支持
- **Docker**: 使用 docker-compose.yml

## 📚 更多资源

### 官方文档
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

### 项目文档
- `README.md` - 项目概览
- `CREATION_COMPLETE_2026_03_03.md` - 完成报告
- `QUICK_REFERENCE_GUIDE.md` - 本文档

---

**更新时间**: 2026-03-03
**版本**: 1.0.0
