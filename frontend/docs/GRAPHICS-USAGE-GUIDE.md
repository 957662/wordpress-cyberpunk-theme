# CyberPress Graphics Usage Guide
## 图形素材使用指南

---

## 📚 目录

1. [快速开始](#快速开始)
2. [图标使用](#图标使用)
3. [Logo 组件](#logo-组件)
4. [插画素材](#插画素材)
5. [背景图案](#背景图案)
6. [装饰元素](#装饰元素)
7. [动画效果](#动画效果)
8. [最佳实践](#最佳实践)

---

## 🚀 快速开始

### 安装依赖

```bash
# Lucide React 图标库（已集成）
npm install lucide-react

# 或者使用你喜欢的包管理器
yarn add lucide-react
pnpm add lucide-react
```

### 导入图标

```tsx
// 方式1: 从统一导出导入
import {
  Home,
  Search,
  Github,
  NotificationIcon,
  ThemeToggleIcon
} from '@/components/icons';

// 方式2: 直接从 Lucide 导入
import { Home, Search } from 'lucide-react';

// 方式3: 导入自定义图标
import {
  NotificationIcon,
  ThemeToggleIcon
} from '@/components/icons/CyberIcons';
```

---

## 🎯 图标使用

### 基础用法

```tsx
import { Home } from '@/components/icons';

export default function Component() {
  return (
    <Home className="w-6 h-6 text-cyber-cyan" />
  );
}
```

### 尺寸控制

```tsx
// 使用 size 属性
<Home size={24} />

// 使用 Tailwind 类
<Home className="w-8 h-8" />
<Home className="w-12 h-12" />

// 像素值
<Home style={{ width: '32px', height: '32px' }} />
```

### 颜色自定义

```tsx
// Tailwind 类
<Home className="text-cyber-cyan" />
<Home className="text-cyber-purple" />
<Home className="text-cyber-pink" />

// 内联样式
<Home style={{ color: '#00f0ff' }} />

// 使用 CSS 变量
<Home style={{ color: 'var(--color-cyber-cyan)' }} />
```

### 自定义赛博图标

```tsx
import {
  NotificationIcon,
  ThemeToggleIcon,
  BrainAIIcon,
  DatabaseCyberIcon
} from '@/components/icons/CyberIcons';

// 这些图标内置了 SVG 滤镜发光效果
<NotificationIcon size={24} className="text-cyber-cyan" />
<ThemeToggleIcon size={20} className="text-cyber-purple" />
<BrainAIIcon size={32} className="text-cyber-pink" />
<DatabaseCyberIcon size={28} className="text-cyber-yellow" />
```

---

## 🏢 Logo 组件

### 基础用法

```tsx
import { Logo } from '@/components/icons';

export default function Header() {
  return (
    <Logo size={200} variant="main" />
  );
}
```

### Logo 变体

```tsx
// 主 Logo
<Logo size={200} variant="main" />

// 方形 Logo
<Logo size={64} variant="square" />

// 图标
<Logo size={32} variant="icon" />
```

### 带样式

```tsx
<Logo
  size={200}
  variant="main"
  className="hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]"
/>
```

---

## 🖼️ 插画素材

### Next.js Image 组件

```tsx
import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative h-[500px]">
      <Image
        src="/illustrations/cyberpunk-logo-full.svg"
        alt="CyberPress Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
```

### 固定尺寸

```tsx
<Image
  src="/illustrations/server-cyber.svg"
  alt="Server"
  width={400}
  height={300}
  className="rounded-lg"
/>

<Image
  src="/illustrations/code-editor.svg"
  alt="Code Editor"
  width={500}
  height={350}
/>
```

### 特性展示

```tsx
export default function Features() {
  const illustrations = [
    { src: '/illustrations/server-cyber.svg', title: 'High Performance' },
    { src: '/illustrations/code-editor.svg', title: 'Modern Development' },
    { src: '/illustrations/holographic-data.svg', title: 'Data Analytics' },
    { src: '/illustrations/network-nodes-cyber.svg', title: 'Connected World' },
  ];

  return (
    <div className="grid grid-cols-2 gap-8">
      {illustrations.map((ill) => (
        <div key={ill.title} className="space-y-4">
          <Image
            src={ill.src}
            alt={ill.title}
            width={400}
            height={300}
            className="rounded-lg border border-cyber-border hover:border-cyber-cyan transition-colors"
          />
          <h3 className="text-lg text-cyber-primary">{ill.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

---

## 🌄 背景图案

### CSS 类

```css
/* globals.css 或你的样式文件 */
.hero-bg {
  background-image: url('/backgrounds/circuit-pattern.svg');
  background-size: cover;
  background-position: center;
}

.card-bg {
  background-image: url('/backgrounds/card-bg.svg');
  background-size: cover;
}

.matrix-bg {
  background-image: url('/backgrounds/matrix-code.svg');
  background-size: 400px 600px;
  background-repeat: repeat;
}
```

### Tailwind 类

```tsx
<div className="absolute inset-0 bg-[url('/backgrounds/circuit-pattern.svg')] bg-cover opacity-20" />

<div className="bg-[url('/backgrounds/card-bg.svg')] bg-cover rounded-lg" />
```

### 动态背景

```tsx
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src="/backgrounds/circuit-pattern.svg"
        alt=""
        fill
        className="object-cover opacity-10 animate-pulse"
      />
    </div>
  );
}
```

---

## 🔲 装饰元素

### 角落装饰

```tsx
import Image from 'next/image';

export function CardWithCorners() {
  return (
    <div className="relative p-6 bg-cyber-card border border-cyber-border rounded-lg">
      {/* Corner decorations */}
      <Image
        src="/decorations/tech-corner.svg"
        alt=""
        width={100}
        height={100}
        className="absolute top-0 left-0"
      />
      <Image
        src="/decorations/tech-corner.svg"
        alt=""
        width={100}
        height={100}
        className="absolute top-0 right-0 rotate-90"
      />
      <Image
        src="/decorations/tech-corner.svg"
        alt=""
        width={100}
        height={100}
        className="absolute bottom-0 left-0 -rotate-90"
      />
      <Image
        src="/decorations/tech-corner.svg"
        alt=""
        width={100}
        height={100}
        className="absolute bottom-0 right-0 rotate-180"
      />

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl text-cyber-cyan mb-2">Card Title</h3>
        <p className="text-cyber-primary">Card content goes here...</p>
      </div>
    </div>
  );
}
```

### 分割线

```tsx
export function SectionDivider() {
  return (
    <div className="my-12 flex items-center justify-center">
      <Image
        src="/decorations/holo-line.svg"
        alt=""
        width={400}
        height={10}
        className="w-full max-w-md"
      />
    </div>
  );
}
```

---

## 💫 动画效果

### Tailwind 动画类

```tsx
// Pulse
<Home className="w-6 h-6 text-cyber-cyan animate-pulse" />

// Spin (loading)
<LoadingIcon className="w-8 h-8 text-cyber-cyan animate-spin" />

// Bounce
<Star className="w-6 h-6 text-cyber-yellow animate-bounce" />

// Ping (notification)
<div className="relative">
  <Bell className="w-6 h-6" />
  <span className="absolute top-0 right-0 w-3 h-3 bg-cyber-pink rounded-full animate-ping" />
</div>
```

### 自定义动画

```tsx
// 组件内联动画
<BrainAIIcon
  size={48}
  className="text-cyber-cyan"
  style={{
    animation: 'glow 2s ease-in-out infinite alternate',
  }}
/>

// CSS 文件
/*
@keyframes glow {
  from {
    filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.5));
  }
  to {
    filter: drop-shadow(0 0 20px rgba(0, 240, 255, 0.8));
  }
}
*/
```

### Hover 效果

```tsx
// Scale
<Home className="w-6 h-6 hover:scale-110 transition-transform" />

// Color change
<Github className="w-6 h-6 text-cyber-secondary hover:text-cyber-cyan transition-colors" />

// Glow
<Search className="w-6 h-6 hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all" />

// Rotate
<Settings className="w-6 h-6 hover:rotate-90 transition-transform duration-300" />
```

---

## ✅ 最佳实践

### 性能优化

```tsx
// ✅ 好: 使用优化的组件
import { Home } from '@/components/icons';
<Home className="w-6 h-6" />

// ❌ 不好: 直接使用内联 SVG
<svg>...</svg>

// ✅ 好: 使用 Next.js Image 加载大图
import Image from 'next/image';
<Image src="/illustrations/..." width={400} height={300} />

// ❌ 不好: 使用普通 img 标签
<img src="/illustrations/..." width={400} height={300} />
```

### 无障碍

```tsx
// ✅ 添加 aria-label
<button aria-label="Search">
  <Search className="w-6 h-6" />
</button>

// ✅ 装饰性图标隐藏
<Search aria-hidden="true" />

// ✅ 语义化 HTML
<button>
  <Search aria-hidden="true" />
  <span className="sr-only">Search</span>
</button>
```

### 主题支持

```tsx
// ✅ 使用 CSS 变量
<Home className="w-6 h-6" style={{ color: 'var(--color-text-primary)' }} />

// ✅ Tailwind 主题类
<Home className="w-6 h-6 dark:text-cyber-cyan light:text-cyber-dark" />

// ✅ 条件类名
<Home className={cn(
  "w-6 h-6",
  theme === 'dark' ? "text-cyber-cyan" : "text-cyber-dark"
)} />
```

### 尺寸规范

```tsx
// ✅ 使用标准尺寸
const sizes = {
  xs: 16,
  sm: 20,
  base: 24,
  lg: 32,
  xl: 48,
  '2xl': 64,
};

<Home size={sizes.base} />

// ❌ 避免任意尺寸
<Home size={27} />  // ❌
```

---

## 📋 快速参考

### 常用图标

```tsx
// Navigation
import { Home, Search, Menu, Settings } from '@/components/icons';

// Social
import { Github, Twitter, Linkedin, Mail } from '@/components/icons';

// Actions
import { Edit, Trash, Save, Share, Download } from '@/components/icons';

// Tech
import { Code, Terminal, Database, Server, Cpu } from '@/components/icons';

// Custom
import {
  NotificationIcon,
  ThemeToggleIcon,
  BrainAIIcon,
  DatabaseCyberIcon
} from '@/components/icons/CyberIcons';
```

### 常用颜色

```tsx
// Tailwind classes
"text-cyber-cyan"      // #00f0ff
"text-cyber-purple"    // #9d00ff
"text-cyber-pink"      // #ff0080
"text-cyber-yellow"    // #f0ff00
"text-success"         // #00ff88
"text-warning"         // #ff6600
"text-error"           // #ff0040
```

### 常用尺寸

```tsx
// Tailwind classes
"w-4 h-4"    // 16px
"w-5 h-5"    // 20px
"w-6 h-6"    // 24px (base)
"w-8 h-8"    // 32px
"w-12 h-12"  // 48px
```

---

**文档版本**: 2.0.0
**最后更新**: 2026-03-03
**维护者**: CyberPress Design Team
