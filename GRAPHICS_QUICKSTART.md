# CyberPress 图形素材快速开始指南

> 🚀 5 分钟上手 CyberPress 图形库

---

## 📦 安装与导入

### 方式 1: 从 graphics 模块导入

```tsx
// 导入单个组件
import { CyberLogo } from '@/components/graphics';

// 导入多个组件
import {
  CyberLogo,
  CyberIcon,
  QuantumIcon,
  NeuralIcon,
  DataStreamIcon
} from '@/components/graphics';

// 导入插画
import {
  HolographicCard,
  CircuitBackground
} from '@/components/graphics/illustrations';

// 导入装饰
import { NeonBorder } from '@/components/graphics/decorations';

// 导入配置工具
import {
  getColor,
  getGradient,
  GRAPHICS_CONFIG
} from '@/components/graphics/config';
```

### 方式 2: 从子目录导入

```tsx
import { CyberLogo } from '@/components/graphics/CyberLogo';
import { CyberIcon } from '@/components/graphics/CyberIcon';
import { HolographicCard } from '@/components/graphics/illustrations/HolographicCard';
```

---

## 🎨 基础使用

### 1. 使用 Logo

```tsx
import { CyberLogo } from '@/components/graphics';

export default function Header() {
  return (
    <header>
      {/* 默认 Logo */}
      <CyberLogo />

      {/* 自定义尺寸 */}
      <CyberLogo size={150} />

      {/* 不同颜色变体 */}
      <CyberLogo variant="cyan" />
      <CyberLogo variant="purple" />
      <CyberLogo variant="gradient" />

      {/* 带动画 */}
      <CyberLogo animated={true} />

      {/* 只显示图标，不显示文字 */}
      <CyberLogo showText={false} />

      {/* 自定义文字 */}
      <CyberLogo text="MY BLOG" />
    </header>
  );
}
```

### 2. 使用图标

```tsx
import { CyberIcon, QuantumIcon, NeuralIcon } from '@/components/graphics';

export default function Features() {
  return (
    <div>
      {/* 赛博核心图标 */}
      <CyberIcon size={48} variant="cyan" />
      <CyberIcon size={64} variant="purple" animated={true} />
      <CyberIcon size={32} variant="gradient" intensity="high" />

      {/* 量子计算图标 */}
      <QuantumIcon size={64} variant="purple" animated={true} />
      <QuantumIcon size={48} variant="cyan" />

      {/* 神经网络图标 */}
      <NeuralIcon size={56} variant="cyan" animated={true} />
      <NeuralIcon size={40} variant="purple" nodeCount={5} />
    </div>
  );
}
```

### 3. 使用插画

```tsx
import { HolographicCard, CircuitBackground } from '@/components/graphics/illustrations';

export default function Hero() {
  return (
    <div className="relative">
      {/* 背景插画 */}
      <CircuitBackground
        width={1920}
        height={1080}
        density="medium"
        variant="cyan"
        animated={true}
      />

      {/* 全息卡片 */}
      <HolographicCard
        width={400}
        height={300}
        variant="cyber"
        animated={true}
      />
    </div>
  );
}
```

### 4. 使用装饰边框

```tsx
import { NeonBorder } from '@/components/graphics/decorations';

export default function Card() {
  return (
    <NeonBorder
      width={300}
      height={200}
      variant="cyan"
      intensity="medium"
      animated={true}
    >
      <div className="p-6">
        <h3>标题</h3>
        <p>内容区域</p>
      </div>
    </NeonBorder>
  );
}
```

---

## 🎯 实战示例

### 示例 1: 导航栏

```tsx
import { CyberLogo } from '@/components/graphics';
import { useState } from 'react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all ${isScrolled ? 'bg-cyber-dark/90 backdrop-blur' : ''}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <CyberLogo size={150} variant="gradient" showText={false} />

        {/* 导航链接 */}
        <ul className="flex gap-6">
          <li><a href="/" className="text-cyber-cyan hover:text-cyber-purple">首页</a></li>
          <li><a href="/blog" className="text-cyber-cyan hover:text-cyber-purple">博客</a></li>
          <li><a href="/portfolio" className="text-cyber-cyan hover:text-cyber-purple">作品集</a></li>
        </ul>
      </div>
    </nav>
  );
}
```

### 示例 2: 功能卡片

```tsx
import { CyberIcon, QuantumIcon, NeuralIcon, DataStreamIcon } from '@/components/graphics';

const features = [
  {
    icon: <CyberIcon size={48} variant="cyan" />,
    title: '赛博朋克设计',
    description: '未来感十足的视觉体验'
  },
  {
    icon: <QuantumIcon size={48} variant="purple" animated={true} />,
    title: '量子性能',
    description: '超快响应速度'
  },
  {
    icon: <NeuralIcon size={48} variant="pink" animated={true} />,
    title: '智能推荐',
    description: 'AI 驱动的内容推荐'
  },
  {
    icon: <DataStreamIcon size={48} variant="green" animated={true} speed="fast" />,
    title: '实时数据',
    description: '毫秒级数据同步'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-cyber-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-cyber-cyan">
          核心特性
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-cyber-card border border-cyber-border rounded-lg p-6 hover:border-cyber-cyan transition-all"
            >
              <div className="mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-cyber-cyan">
                {feature.title}
              </h3>
              <p className="text-cyber-text-secondary">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 示例 3: Hero 区域

```tsx
import { CyberLogo, HolographicCard, CircuitBackground } from '@/components/graphics';
import { NeonBorder } from '@/components/graphics/decorations';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景插画 */}
      <CircuitBackground
        width={1920}
        height={1080}
        density="medium"
        variant="cyan"
        animated={true}
        className="absolute inset-0"
      />

      {/* 内容 */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <CyberLogo
          size={300}
          variant="gradient"
          animated={true}
          className="mx-auto mb-8"
        />

        {/* 标题 */}
        <h1 className="text-6xl font-bold mb-6 text-cyber-cyan">
          欢迎来到 CyberPress
        </h1>

        {/* 副标题 */}
        <p className="text-xl text-cyber-text-secondary mb-8">
          赛博朋克风格的现代化博客平台
        </p>

        {/* CTA 按钮 */}
        <NeonBorder
          width={200}
          height={60}
          variant="purple"
          intensity="medium"
          animated={true}
          className="mx-auto cursor-pointer"
        >
          <button className="text-lg font-semibold text-cyber-cyan">
            开始探索
          </button>
        </NeonBorder>
      </div>
    </section>
  );
}
```

### 示例 4: 博客卡片

```tsx
import { NeuralIcon } from '@/components/graphics';
import { NeonBorder } from '@/components/graphics/decorations';

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export default function BlogCard({ title, excerpt, date, category }: BlogCardProps) {
  return (
    <NeonBorder
      width="100%"
      height="auto"
      variant="cyan"
      intensity="low"
      className="group cursor-pointer"
    >
      <div className="p-6">
        {/* 分类图标 */}
        <div className="mb-4 flex justify-center">
          <NeuralIcon size={40} variant="cyan" animated={true} />
        </div>

        {/* 分类标签 */}
        <span className="inline-block px-3 py-1 bg-cyber-cyan/20 text-cyber-cyan text-sm rounded-full mb-3">
          {category}
        </span>

        {/* 标题 */}
        <h3 className="text-xl font-bold mb-2 text-cyber-cyan group-hover:text-cyber-purple transition-colors">
          {title}
        </h3>

        {/* 摘要 */}
        <p className="text-cyber-text-secondary mb-4">
          {excerpt}
        </p>

        {/* 日期 */}
        <div className="text-sm text-cyber-text-muted">
          {date}
        </div>
      </div>
    </NeonBorder>
  );
}
```

### 示例 5: 加载动画

```tsx
import { DataStreamIcon } from '@/components/graphics';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 100));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-cyber-dark flex flex-col items-center justify-center z-50">
      {/* 数据流图标 */}
      <DataStreamIcon
        size={80}
        variant="cyan"
        animated={true}
        speed="fast"
        className="mb-8"
      />

      {/* 加载文本 */}
      <p className="text-cyber-cyan text-xl mb-4">
        正在初始化系统...
      </p>

      {/* 进度条 */}
      <div className="w-64 h-2 bg-cyber-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 进度百分比 */}
      <p className="text-cyber-text-secondary mt-2">
        {progress}%
      </p>
    </div>
  );
}
```

---

## 🎨 样式定制

### 使用 Tailwind 类名

```tsx
<CyberIcon
  size={48}
  variant="cyan"
  className="hover:scale-110 transition-transform"
/>

<NeuralIcon
  size={64}
  variant="purple"
  className="animate-pulse"
/>
```

### 使用内联样式

```tsx
<CyberLogo
  size={200}
  style={{
    filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.5))',
    transform: 'rotate(5deg)'
  }}
/>
```

### 使用 CSS 变量

```tsx
<div style={{
  '--cyber-primary': '#00f0ff',
  '--cyber-secondary': '#9d00ff'
} as React.CSSProperties}>
  <CyberIcon size={48} variant="cyan" />
</div>
```

---

## ⚡ 性能优化

### 懒加载大型插画

```tsx
import { lazy, Suspense } from 'react';

const CircuitBackground = lazy(() =>
  import('@/components/graphics/illustrations/CircuitBackground')
);

export default function Hero() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CircuitBackground width={1920} height={1080} />
    </Suspense>
  );
}
```

### 条件渲染动画

```tsx
import { useState, useEffect } from 'react';

export default function MyComponent() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <CyberIcon
      size={48}
      variant="cyan"
      animated={!prefersReducedMotion}
    />
  );
}
```

---

## 🔧 常见问题

### Q: 如何更改图标颜色？
A: 使用 `variant` 属性选择预定义颜色，或通过 `className` 添加自定义颜色类。

```tsx
<CyberIcon variant="cyan" />
<CyberIcon className="text-blue-500" />
```

### Q: 如何禁用动画？
A: 设置 `animated={false}` 或检查用户的运动偏好。

```tsx
<CyberIcon animated={false} />
```

### Q: 如何自定义尺寸？
A: 使用 `size` 属性或通过 `className` 使用 Tailwind 的尺寸类。

```tsx
<CyberIcon size={64} />
<CyberIcon className="w-16 h-16" />
```

### Q: 如何在背景中使用插画？
A: 使用绝对定位和 `z-index`。

```tsx
<div className="relative">
  <CircuitBackground className="absolute inset-0 -z-10" />
  <div className="relative z-10">内容</div>
</div>
```

---

## 📚 更多资源

- [完整图标清单](./frontend/components/graphics/ICON_MANIFEST_V3.md)
- [配色参考](./frontend/components/graphics/COLOR_REFERENCE.md)
- [设计系统](./docs/DESIGN-SYSTEM.md)
- [组件文档](./docs/COMPONENTS.md)

---

**快速开始，探索赛博朋克风格的无限可能！** 🚀

---

*最后更新: 2026-03-03*
