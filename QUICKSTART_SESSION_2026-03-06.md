# 组件使用指南 - 2026-03-06 Session

## 🚀 快速开始

本指南将帮助你快速使用本次创建的所有组件。

## 📦 组件列表

### 1. 搜索组件

#### SearchModal - 全局搜索模态框

**特性：**
- 支持文章、分类、标签搜索
- 键盘快捷键支持
- 搜索建议
- 热门搜索词
- 键盘导航

**使用示例：**
```tsx
'use client';

import { useState } from 'react';
import { SearchModal } from '@/components/search';

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        打开搜索
      </button>

      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialQuery=""
      />
    </>
  );
}
```

#### SearchTrigger - 搜索触发器

**特性：**
- 键盘快捷键（Cmd/Ctrl + K）
- 自动聚焦
- 快捷键提示

**使用示例：**
```tsx
'use client';

import { SearchTrigger } from '@/components/search';

export default function Header() {
  return (
    <header>
      <SearchTrigger />
    </header>
  );
}
```

---

### 2. 认证组件

#### AuthGuard - 认证守卫

**特性：**
- 保护需要登录的页面
- 自动重定向
- 自定义 fallback

**使用示例：**
```tsx
'use client';

import { AuthGuard } from '@/components/auth';

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div>仪表盘内容</div>
    </AuthGuard>
  );
}
```

#### LoginForm - 登录表单

**特性：**
- 表单验证
- 错误处理
- 密码显示/隐藏
- 记住我功能

**使用示例：**
```tsx
'use client';

import { LoginForm } from '@/components/auth';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm
        onSuccess={() => router.push('/dashboard')}
        onRegisterClick={() => router.push('/register')}
        onForgotPasswordClick={() => router.push('/forgot-password')}
      />
    </div>
  );
}
```

#### RegisterForm - 注册表单

**特性：**
- 实时表单验证
- 密码强度检测
- 确认密码匹配

**使用示例：**
```tsx
'use client';

import { RegisterForm } from '@/components/auth';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <RegisterForm
        onSuccess={() => router.push('/dashboard')}
        onLoginClick={() => router.push('/login')}
      />
    </div>
  );
}
```

---

### 3. UI 组件

#### LazyImage - 懒加载图片

**特性：**
- Intersection Observer API
- 骨架屏占位
- 模糊占位图支持
- 性能优化

**使用示例：**
```tsx
'use client';

import { LazyImage } from '@/components/ui';

export default function Gallery() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <LazyImage
        src="/images/photo1.jpg"
        alt="照片 1"
        width={400}
        height={300}
        placeholder="/images/placeholder.png"
        blurDataURL="data:image/jpeg;base64,..."
      />
    </div>
  );
}
```

#### ScrollToTop - 滚动到顶部

**特性：**
- 自动显示/隐藏
- 平滑滚动
- 动画效果

**使用示例：**
```tsx
'use client';

import { ScrollToTop } from '@/components/ui';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ScrollToTop threshold={300} />
    </>
  );
}
```

#### LoadingScreen - 加载屏幕

**特性：**
- 多种尺寸选项
- 全屏/内联模式
- 自定义文本

**使用示例：**
```tsx
'use client';

import { LoadingScreen } from '@/components/ui';

export default function LoadingPage() {
  return (
    <LoadingScreen
      size="lg"
      text="加载中..."
      fullscreen={true}
    />
  );
}
```

---

### 4. Hooks

#### useAuth - 认证 Hook

**特性：**
- 登录/注册/登出
- 用户状态管理
- Token 持久化

**使用示例：**
```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function UserProfile() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>加载中...</div>;

  return (
    <div>
      <h1>欢迎, {user?.username}</h1>
      <button onClick={logout}>登出</button>
    </div>
  );
}
```

#### useIntersectionObserver - 交叉观察器

**特性：**
- 懒加载支持
- 滚动动画触发
- 可配置阈值

**使用示例：**
```tsx
'use client';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { motion } from 'framer-motion';

export default function AnimatedSection() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isIntersecting ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      当这个元素进入视口时会显示动画
    </motion.div>
  );
}
```

---

### 5. 工具函数

#### 性能优化工具

**使用示例：**
```tsx
import {
  debounce,
  throttle,
  preloadImage,
  copyToClipboard,
  performanceUtils,
} from '@/lib/utils/performance-helpers';

// 防抖
const handleSearch = debounce((query: string) => {
  console.log('搜索:', query);
}, 300);

// 节流
const handleScroll = throttle(() => {
  console.log('滚动位置:', window.scrollY);
}, 100);

// 预加载图片
preloadImage('/images/large-image.jpg').then(() => {
  console.log('图片已加载');
});

// 复制到剪贴板
copyToClipboard('要复制的文本').then((success) => {
  if (success) {
    console.log('复制成功');
  }
});

// 性能监测
performanceUtils.mark('component-start');
// ... 组件代码
performanceUtils.mark('component-end');
const duration = performanceUtils.measure('component', 'component-start', 'component-end');
console.log('组件渲染耗时:', duration, 'ms');
```

---

## 🔧 配置指南

### 1. 环境变量

在 `.env.local` 中配置：

```env
# WordPress API
NEXT_PUBLIC_WP_API_URL=https://your-wordpress-site.com/wp-json

# 认证
NEXT_PUBLIC_AUTH_TOKEN_SECRET=your-secret-key

# 性能优化
NEXT_PUBLIC_IMAGE_QUALITY=75
```

### 2. Tailwind 配置

确保 `tailwind.config.ts` 包含赛博朋克主题：

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
      },
    },
  },
};

export default config;
```

### 3. TypeScript 类型

所有组件都包含完整的 TypeScript 类型定义，无需额外配置。

---

## 📚 完整示例

### 带搜索和认证的博客页面

```tsx
'use client';

import { useState } from 'react';
import { SearchTrigger } from '@/components/search';
import { AuthGuard } from '@/components/auth';
import { useAuth } from '@/hooks/useAuth';
import { ScrollToTop } from '@/components/ui';

export default function BlogPage() {
  const { user } = useAuth();

  return (
    <>
      {/* 头部 */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">博客</h1>
          <SearchTrigger />
        </div>
      </header>

      {/* 主内容 */}
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-8">最新文章</h2>

          <AuthGuard requireAuth={false}>
            {/* 文章列表 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 文章卡片 */}
            </div>
          </AuthGuard>
        </div>
      </main>

      {/* 滚动到顶部 */}
      <ScrollToTop />
    </>
  );
}
```

---

## 🎯 最佳实践

### 1. 性能优化

- 使用 `LazyImage` 优化图片加载
- 使用 `debounce` 和 `throttle` 优化事件处理
- 使用 `useIntersectionObserver` 实现懒加载

### 2. 用户体验

- 搜索使用键盘快捷键（Cmd/Ctrl + K）
- 表单提供实时验证
- 加载状态使用 `LoadingScreen`

### 3. 安全性

- 所有表单都有验证
- 认证使用 token
- 敏感操作需要二次确认

---

## 🐛 故障排除

### 问题：组件导入失败

**解决方案：**
确保路径别名配置正确，检查 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*", "./frontend/*"]
    }
  }
}
```

### 问题：样式不生效

**解决方案：**
确保 Tailwind CSS 已正确配置，重启开发服务器：

```bash
cd frontend
npm run dev
```

### 问题：认证不工作

**解决方案：**
检查环境变量配置，确保 API 端点正确。

---

## 📞 支持

如有问题，请查看：
- [项目文档](./PROJECT_SETUP.md)
- [TODO.md](./TODO.md)
- [组件总结](./SESSION_2026-03-06_FILE_CREATION.md)

---

**最后更新**: 2026-03-06
**版本**: 1.0.0
