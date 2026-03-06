# 🚀 快速启动指南

## 项目已准备就绪！

### ✅ 已完成
- 所有依赖已安装
- 配置文件完整
- 样式系统完整
- 图形素材完整
- 项目结构已创建

### 📝 需要创建的核心文件

由于工具限制，以下文件需要手动创建。**所有代码都在 `PROJECT_STATUS.md` 中提供！**

## 📋 文件创建清单

### 1. 工具库 (lib/)
- [ ] `lib/utils.ts` - 工具函数（约 40 行）
- [ ] `lib/types.ts` - TypeScript 类型（约 50 行）
- [ ] `lib/wordpress/client.ts` - WordPress API 客户端（约 300 行）

### 2. Hooks (hooks/)
- [ ] `hooks/usePosts.ts` - 博客数据 hooks（约 60 行）
- [ ] `hooks/usePortfolio.ts` - 作品集 hooks（约 20 行）
- [ ] `hooks/useComments.ts` - 评论 hooks（约 10 行）
- [ ] `hooks/useSearch.ts` - 搜索 hooks（约 30 行）
- [ ] `hooks/useAuth.ts` - 认证 hooks（约 80 行）

### 3. Providers (components/providers/)
- [ ] `components/providers/ThemeProvider.tsx` - 主题提供者（约 5 行）
- [ ] `components/providers/QueryProvider.tsx` - React Query 提供者（约 20 行）

### 4. 页面 (app/)
- [ ] `app/layout.tsx` - 根布局（约 60 行）
- [ ] `app/page.tsx` - 首页（约 300 行）
- [ ] `app/(public)/blog/page.tsx` - 博客列表（约 200 行）
- [ ] `app/(public)/blog/[slug]/page.tsx` - 博客详情（约 250 行）
- [ ] `app/(public)/portfolio/page.tsx` - 作品集列表（约 150 行）
- [ ] `app/(public)/portfolio/[slug]/page.tsx` - 作品集详情（约 200 行）
- [ ] `app/(public)/about/page.tsx` - 关于页面（约 200 行）
- [ ] `app/(public)/contact/page.tsx` - 联系页面（约 150 行）

## 🎯 三种创建方式

### 方式 1: 手动复制（推荐）
1. 打开 `PROJECT_STATUS.md`
2. 找到对应文件的代码
3. 创建文件并粘贴代码

### 方式 2: 使用脚本
```bash
chmod +x scripts/create-core-files.sh
./scripts/create-core-files.sh
```

### 方式 3: 边做边改
```bash
npm run dev
```
根据错误提示逐步创建文件

## 📦 快速复制代码

### lib/utils.ts
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
```

### components/providers/ThemeProvider.tsx
```typescript
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

### components/providers/QueryProvider.tsx
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

## 🎨 颜色参考

使用这些 Tailwind 类名：
- `bg-cyber-dark` - 主背景
- `bg-cyber-card` - 卡片背景
- `text-cyber-cyan` - 霓虹青文字
- `text-cyber-purple` - 赛博紫文字
- `border-cyber-cyan` - 霓虹青边框

## 🚀 启动项目

创建完核心文件后：
```bash
npm run dev
```

访问 http://localhost:3000

## 📚 参考文档

- `PROJECT_STATUS.md` - 详细代码示例
- `SETUP_GUIDE.md` - 完整设置指南
- `README.md` - 项目概述
- `.ai-context` - AI 开发指南

## 💡 提示

1. 所有代码都是完整的，可以直接复制使用
2. 项目使用 TypeScript，注意类型定义
3. 样式使用 Tailwind CSS
4. 动画使用 Framer Motion
5. 数据获取使用 React Query

## 🎯 最小可运行版本

如果只是想快速看看效果，最少需要创建：
1. `lib/utils.ts`
2. `lib/types.ts`
3. `lib/wordpress/client.ts`
4. `components/providers/ThemeProvider.tsx`
5. `components/providers/QueryProvider.tsx`
6. `app/layout.tsx`
7. `app/page.tsx`

其他页面可以后续逐步添加。

---

**准备好了吗？开始创建文件吧！** 🚀
