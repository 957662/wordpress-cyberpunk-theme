# CyberPress Graphics Components - 使用示例

本文档展示如何使用 CyberPress 图形组件库。

---

## 🚀 快速开始

### 1. 导入组件

```tsx
import {
  CyberIcon,
  CyberLogo,
  DecoratedCard,
  CyberDivider,
  TechBadge,
  CyberIllustration,
} from '@/components/graphics';
```

---

## 📌 基础用法

### CyberIcon - 图标组件

```tsx
// 基础用法
<CyberIcon name="home" size={24} />

// 不同颜色变体
<CyberIcon name="github" size={32} variant="cyan" />
<CyberIcon name="twitter" size={32} variant="purple" />
<CyberIcon name="heart" size={32} variant="pink" />

// 带发光效果
<CyberIcon name="star" size={24} glow />

// 旋转动画（用于加载）
<CyberIcon name="loading" size={24} spin />

// 自定义类名
<CyberIcon name="search" size={24} className="text-cyber-cyan" />
```

---

### CyberLogo - Logo 组件

```tsx
// 主 Logo
<CyberLogo type="main" width={200} height={200} />

// Logo 图标
<CyberLogo type="icon" width={100} height={100} />

// 带发光效果
<CyberLogo type="main" width={200} height={200} glow />
```

---

### DecoratedCard - 装饰卡片

```tsx
// 基础卡片
<DecoratedCard title="Featured Post">
  <p>Card content goes here...</p>
</DecoratedCard>

// 不同发光颜色
<DecoratedCard title="Cyan Glow" glow="cyan">
  <p>Cyber cyan glow effect</p>
</DecoratedCard>

<DecoratedCard title="Purple Glow" glow="purple">
  <p>Cyber purple glow effect</p>
</DecoratedCard>

<DecoratedCard title="Pink Glow" glow="pink">
  <p>Cyber pink glow effect</p>
</DecoratedCard>

// 可点击卡片
<DecoratedCard
  title="Clickable Card"
  onClick={() => console.log('clicked')}
>
  <p>Click me!</p>
</DecoratedCard>

// 无角标装饰
<DecoratedCard
  title="Simple Card"
  showCorners={false}
>
  <p>Without corner decorations</p>
</DecoratedCard>
```

---

### CyberDivider - 分隔线

```tsx
<CyberDivider />

// 自定义间距
<CyberDivider className="my-12" />
```

---

### TechBadge - 技术标签

```tsx
// 基础用法
<TechBadge label="React" />
<TechBadge label="TypeScript" />
<TechBadge label="Next.js" />

// 带图标
import { Atom, Code2, Zap } from 'lucide-react';

<TechBadge label="React" icon={<Atom size={14} />} variant="cyan" />
<TechBadge label="TypeScript" icon={<Code2 size={14} />} variant="purple" />
<TechBadge label="Fast" icon={<Zap size={14} />} variant="yellow" />

// 不同颜色
<TechBadge label="New" variant="cyan" />
<TechBadge label="Popular" variant="purple" />
<TechBadge label="Hot" variant="pink" />
<TechBadge label="Featured" variant="yellow" />
<TechBadge label="Stable" variant="green" />
```

---

### CyberIllustration - 插画

```tsx
// 404 页面
<CyberIllustration type="404" width={400} height={300} priority />

// 空状态
<CyberIllustration type="empty" width={300} height={225} />

// 服务器维护
<CyberIllustration type="maintenance" width={400} height={300} />

// 访问拒绝
<CyberIllustration type="denied" width={400} height={300} />

// 成功状态
<CyberIllustration type="success" width={300} height={225} />

// 无搜索结果
<CyberIllustration type="no-results" width={400} height={300} />
```

---

## 🎨 实际应用示例

### 博客卡片

```tsx
function BlogCard({ post }) {
  return (
    <DecoratedCard
      title={post.title}
      glow="cyan"
      onClick={() => router.push(`/blog/${post.slug}`)}
    >
      <p className="text-cyber-gray-200 mb-4">{post.excerpt}</p>
      <div className="flex items-center gap-4 text-sm text-cyber-gray-300">
        <span className="flex items-center gap-2">
          <CyberIcon name="calendar" size={16} />
          {post.date}
        </span>
        <span className="flex items-center gap-2">
          <CyberIcon name="tag" size={16} />
          {post.category}
        </span>
      </div>
    </DecoratedCard>
  );
}
```

---

### 作品集项目

```tsx
function PortfolioItem({ project }) {
  return (
    <DecoratedCard title={project.name} glow="purple">
      <p className="mb-4">{project.description}</p>

      {/* 技术标签 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tech.map((tech) => (
          <TechBadge key={tech} label={tech} variant="purple" />
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-2">
        <button className="cyber-button">View Demo</button>
        <button className="cyber-button">Source Code</button>
      </div>
    </DecoratedCard>
  );
}
```

---

### 技术技能展示

```tsx
function SkillsSection() {
  const skills = [
    { name: 'React', icon: <Atom size={14} />, level: 90 },
    { name: 'TypeScript', icon: <Code2 size={14} />, level: 85 },
    { name: 'Next.js', icon: <Zap size={14} />, level: 80 },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-glow-cyan mb-6">Skills</h2>

      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-2">
              <TechBadge
                label={skill.name}
                icon={skill.icon}
                variant="cyan"
              />
              <span className="text-cyber-cyan">{skill.level}%</span>
            </div>

            {/* 进度条 */}
            <div className="w-full h-2 bg-cyber-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

### 404 页面

```tsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <CyberIllustration type="404" width={400} height={300} priority />

      <h1 className="text-6xl font-bold text-glow-cyan mt-8 text-cyber-cyan">
        404
      </h1>

      <p className="text-cyber-gray-200 mt-4 text-lg">
        The page you're looking for doesn't exist.
      </p>

      <div className="flex gap-4 mt-8">
        <button className="cyber-button">Go Home</button>
        <button className="cyber-button">Contact Support</button>
      </div>
    </div>
  );
}
```

---

### 搜索结果为空

```tsx
function EmptySearchResults({ query }) {
  return (
    <div className="flex flex-col items-center text-center py-12">
      <CyberIllustration type="no-results" width={400} height={300} />

      <h2 className="text-2xl font-bold text-cyber-cyan mt-6">
        No results found
      </h2>

      <p className="text-cyber-gray-200 mt-2">
        We couldn't find anything matching "{query}"
      </p>

      <p className="text-cyber-gray-300 mt-4">
        Try different keywords or clear the filters
      </p>
    </div>
  );
}
```

---

### 社交链接

```tsx
function SocialLinks() {
  const socials = [
    { name: 'GitHub', icon: 'github', url: 'https://github.com' },
    { name: 'Twitter', icon: 'twitter', url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: 'linkedin', url: 'https://linkedin.com' },
    { name: 'Discord', icon: 'discord', url: 'https://discord.com' },
  ];

  return (
    <div className="flex gap-4">
      {socials.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg border border-cyber-cyan/30 hover:border-cyber-cyan hover:shadow-neon-cyan transition-all"
        >
          <CyberIcon name={social.icon} size={24} glow />
        </a>
      ))}
    </div>
  );
}
```

---

## 🎯 最佳实践

### 1. 响应式尺寸

```tsx
<CyberLogo
  type="main"
  width={150}
  height={150}
  className="w-[120px] h-[120px] md:w-[150px] md:h-[150px]"
/>
```

### 2. 可访问性

```tsx
<CyberIcon name="home" aria-label="Go to home page" />
<TechBadge label="React" aria-label="Technology: React" />
```

### 3. 性能优化

```tsx
// 首页插画使用 priority
<CyberIllustration type="404" priority />

// 其他插画使用默认懒加载
<CyberIllustration type="empty" />
```

### 4. 组合使用

```tsx
<DecoratedCard
  title={
    <div className="flex items-center gap-2">
      <CyberIcon name="star" size={20} />
      Featured Post
    </div>
  }
  glow="cyan"
>
  <p>Content...</p>
  <div className="flex flex-wrap gap-2 mt-4">
    <TechBadge label="React" variant="cyan" />
    <TechBadge label="TypeScript" variant="purple" />
  </div>
</DecoratedCard>
```

---

## 📚 更多资源

- [图标清单](/public/ICON_MANIFEST.md)
- [配色参考](/public/COLOR_PALETTE.md)
- [装饰元素](/public/decorations/README.md)
- [插画说明](/public/illustrations/README.md)

---

**最后更新**: 2026-03-03
**版本**: v1.0
