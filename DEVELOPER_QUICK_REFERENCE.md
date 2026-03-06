# 🚀 CyberPress Platform - Developer Quick Reference

> **快速开发参考指南** - 常用命令、配置和代码模式

---

## 📋 目录

- [快速开始](#快速开始)
- [常用命令](#常用命令)
- [项目结构](#项目结构)
- [关键配置](#关键配置)
- [常用代码模式](#常用代码模式)
- [API 调用](#api-调用)
- [组件开发](#组件开发)
- [样式指南](#样式指南)
- [性能优化](#性能优化)
- [调试技巧](#调试技巧)

---

## 🚀 快速开始

### 环境准备

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量
cp .env.example .env.local

# 3. 启动开发服务器
npm run dev
```

### 访问地址

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🛠️ 常用命令

### 前端开发

```bash
# 开发服务器
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run start

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format

# 运行测试
npm run test
npm run test:watch
npm run test:ui
```

### 后端开发

```bash
# 启动后端服务器
cd backend
uvicorn main:app --reload

# 运行测试
pytest tests/ -v

# 应用数据库迁移
alembic upgrade head

# 创建新迁移
alembic revision --autogenerate -m "description"
```

---

## 📁 项目结构

```
cyberpress-platform/
├── frontend/                    # Next.js 前端
│   ├── app/                    # App Router 页面
│   ├── components/             # React 组件
│   │   ├── blog/              # 博客组件
│   │   ├── ui/                # UI 基础组件
│   │   ├── forms/             # 表单组件
│   │   └── layout/            # 布局组件
│   ├── lib/                   # 工具库
│   │   ├── api/               # API 客户端
│   │   ├── config/            # 配置文件
│   │   └── utils/             # 工具函数
│   ├── hooks/                 # 自定义 Hooks
│   ├── services/              # 业务服务
│   ├── store/                 # 状态管理
│   └── types/                 # TypeScript 类型
│
├── backend/                    # FastAPI 后端
│   ├── app/
│   │   ├── api/               # API 路由
│   │   ├── models/            # 数据模型
│   │   ├── schemas/           # Pydantic 模型
│   │   ├── services/          # 业务逻辑
│   │   └── core/              # 核心配置
│   └── tests/                 # 测试文件
│
└── docker-compose.yml         # Docker 配置
```

---

## ⚙️ 关键配置

### 环境变量

```env
# .env.local
NEXT_PUBLIC_SITE_NAME=CyberPress
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_FEATURE_COMMENTS=true
```

### TypeScript 路径别名

```typescript
// tsconfig.json
{
  "paths": {
    "@/*": ["./*"],
    "@/components/*": ["./components/*"],
    "@/lib/*": ["./lib/*"],
    "@/hooks/*": ["./hooks/*"]
  }
}
```

---

## 💻 常用代码模式

### 组件导入

```typescript
// ✅ 推荐方式
import { Button } from '@/components/ui/button';
import { BlogCard } from '@/components/blog';
import { cn } from '@/lib/utils';
import { useBlogData } from '@/hooks/use-blog-data';

// ❌ 避免相对路径
import { Button } from '../../../components/ui/button';
```

### API 调用

```typescript
// 使用 API 客户端
import { apiClient } from '@/lib/api-client';

// GET 请求
const response = await apiClient.get('/posts');
const posts = response.data;

// POST 请求
const newPost = await apiClient.post('/posts', {
  title: 'New Post',
  content: 'Content here',
});

// 带参数
const posts = await apiClient.get('/posts', {
  params: { page: 1, limit: 10 }
});
```

### 状态管理

```typescript
// 使用 Zustand
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, login, logout } = useAuthStore();

  return (
    <button onClick={() => login(credentials)}>
      Login
    </button>
  );
}
```

### 表单处理

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // 处理提交
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  );
}
```

---

## 🎨 组件开发

### 基础组件结构

```typescript
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  title: string;
  variant?: 'default' | 'primary';
  className?: string;
}

export function MyComponent({
  title,
  variant = 'default',
  className
}: MyComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'p-4 rounded-lg',
        variant === 'primary' && 'bg-cyber-cyan',
        className
      )}
    >
      {title}
    </motion.div>
  );
}
```

### 使用主题颜色

```typescript
// 赛博朋克配色
const colors = {
  cyberDark: '#0a0a0f',      // 深空黑
  cyberCyan: '#00f0ff',      // 霓虹青
  cyberPurple: '#9d00ff',    // 赛博紫
  cyberPink: '#ff0080',      // 激光粉
  cyberGreen: '#00ff88',     // 矩阵绿
  cyberYellow: '#f0ff00',    // 电压黄
};

// Tailwind 类名
className="bg-cyber-dark text-cyber-cyan border-cyber-cyan/30"
```

---

## 🎯 API 调用

### React Query 集成

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 获取数据
function usePosts(page: number) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => apiClient.get(`/posts?page=${page}`),
  });
}

// 修改数据
function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => apiClient.post('/posts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
```

### 错误处理

```typescript
import { toast } from 'react-hot-toast';

try {
  const response = await apiClient.get('/posts');
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message || 'Request failed');
  }
  throw error;
}
```

---

## 🎨 样式指南

### Tailwind CSS 类名

```typescript
// 布局
className="flex items-center justify-between gap-4 p-6"

// 颜色和背景
className="bg-cyber-dark/50 backdrop-blur-sm border border-cyber-cyan/20"

// 响应式
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// 交互效果
className="hover:scale-105 transition-transform duration-300"
```

### 条件样式

```typescript
import { cn } from '@/lib/utils';

className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'primary' && 'primary-classes',
  customClassName
)}
```

---

## ⚡ 性能优化

### 懒加载

```typescript
// 组件懒加载
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <Loading /> }
);
```

### 图片优化

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
/>
```

### 代码分割

```typescript
// 路由级别代码分割（自动）
// app/dashboard/page.tsx

// 组件级别代码分割
const Chart = dynamic(() => import('@/components/Chart'), {
  ssr: false,
});
```

---

## 🐛 调试技巧

### React DevTools

```bash
# 安装 React DevTools 浏览器扩展
# https://react.devtools/
```

### Console 调试

```typescript
// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  console.log('Debug:', data);
}

// 性能测量
console.time('operation');
// ... code
console.timeEnd('operation');
```

### 错误边界

```typescript
'use client';

import { Component, ReactNode } from 'react';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

---

## 📚 更多资源

- [完整文档](./README.md)
- [API 文档](./API_DOCUMENTATION.md)
- [组件清单](./frontend/docs/ICON_MANIFEST.md)
- [设计系统](./frontend/docs/COLOR_REFERENCE.md)

---

**最后更新**: 2026-03-07
**版本**: v1.0.0
