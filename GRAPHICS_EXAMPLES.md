# CyberPress 图形组件使用示例

本文档展示如何在实际项目中使用 CyberPress 图形组件。

---

## 📦 安装与导入

### 基础导入

```tsx
// 导入所有图形组件
import {
  Icon,
  LogoDisplay,
  Illustration,
  PatternBackground,
  Decoration
} from '@/components/graphics';

// 导入常量
import { ICON_NAMES, ILLUSTRATION_NAMES, PATTERN_NAMES } from '@/components/graphics';
```

---

## 🎯 使用场景

### 1. 导航栏图标

```tsx
import { Icon } from '@/components/graphics';

export function Navigation() {
  return (
    <nav className="flex gap-6">
      <a href="/" className="flex items-center gap-2">
        <Icon name="home" size={20} />
        <span>首页</span>
      </a>

      <a href="/blog" className="flex items-center gap-2">
        <Icon name="blog" size={20} />
        <span>博客</span>
      </a>

      <a href="/portfolio" className="flex items-center gap-2">
        <Icon name="portfolio" size={20} />
        <span>作品集</span>
      </a>
    </nav>
  );
}
```

### 2. Logo 展示

```tsx
import { LogoDisplay } from '@/components/graphics';

export function Header() {
  return (
    <header className="flex items-center gap-4">
      <LogoDisplay
        variant="main"
        size={120}
        className="hover:scale-105 transition-transform"
      />
      <h1 className="text-2xl font-bold">CyberPress</h1>
    </header>
  );
}

// 小 Logo (页脚)
export function Footer() {
  return (
    <footer className="flex items-center gap-2">
      <LogoDisplay variant="favicon" size={32} />
      <span className="text-sm">© 2026 CyberPress</span>
    </footer>
  );
}
```

### 3. Hero 区域

```tsx
import { Illustration } from '@/components/graphics';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* 背景插画 */}
      <div className="absolute inset-0 z-0">
        <Illustration
          name="cyber-city"
          fill
          className="opacity-30"
        />
      </div>

      {/* 内容 */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold mb-4 text-glow-cyan">
          欢迎来到 CyberPress
        </h1>
        <p className="text-xl text-cyber-gray-200">
          赛博朋克风格的博客平台
        </p>
      </div>
    </section>
  );
}
```

### 4. 博客卡片

```tsx
import { Icon } from '@/components/graphics';

interface BlogCardProps {
  title: string;
  date: string;
  tags: string[];
  author: string;
}

export function BlogCard({ title, date, tags, author }: BlogCardProps) {
  return (
    <article className="bg-card border border-cyber-border rounded-lg p-6 hover:border-cyber-cyan transition-all">
      {/* 标题 */}
      <h3 className="text-xl font-bold text-cyber-cyan mb-3">
        {title}
      </h3>

      {/* 元信息 */}
      <div className="flex items-center gap-4 text-sm text-cyber-gray-200 mb-4">
        <div className="flex items-center gap-1">
          <Icon name="calendar" size={16} />
          <span>{date}</span>
        </div>

        <div className="flex items-center gap-1">
          <Icon name="user" size={16} />
          <span>{author}</span>
        </div>
      </div>

      {/* 标签 */}
      <div className="flex gap-2 flex-wrap">
        {tags.map(tag => (
          <span
            key={tag}
            className="flex items-center gap-1 text-xs bg-cyber-cyan/10 text-cyber-cyan px-2 py-1 rounded"
          >
            <Icon name="tag" size={12} />
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
```

### 5. 按钮图标

```tsx
import { Icon } from '@/components/graphics';

export function ButtonWithIcon() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-neon-gradient rounded hover:shadow-neon-cyan transition-all">
      <Icon name="edit" size={18} variant="action" />
      <span>编辑文章</span>
    </button>
  );
}

// 仅图标按钮
export function IconButton() {
  return (
    <button className="p-2 hover:bg-cyber-cyan/10 rounded transition-colors">
      <Icon
        name="settings"
        size={20}
        className="text-cyber-gray-200 hover:text-cyber-cyan"
      />
    </button>
  );
}
```

### 6. 社交链接

```tsx
import { Icon } from '@/components/graphics';

export function SocialLinks() {
  const socials = [
    { name: 'github', url: 'https://github.com' },
    { name: 'twitter', url: 'https://twitter.com' },
    { name: 'linkedin', url: 'https://linkedin.com' },
    { name: 'email', url: 'mailto:hello@cyberpress.com' },
  ];

  return (
    <div className="flex gap-4">
      {socials.map(social => (
        <a
          key={social.name}
          href={social.url}
          className="p-2 bg-card border border-cyber-border rounded hover:border-cyber-cyan hover:shadow-neon-cyan transition-all"
          aria-label={social.name}
        >
          <Icon name={social.name as any} size={20} variant="social" />
        </a>
      ))}
    </div>
  );
}
```

### 7. 背景图案

```tsx
import { PatternBackground } from '@/components/graphics';

export function SectionWithPattern() {
  return (
    <PatternBackground name="circuit" opacity={0.05}>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            我们的服务
          </h2>
          {/* 内容 */}
        </div>
      </section>
    </PatternBackground>
  );
}

// 固定背景
export function HeroWithFixedPattern() {
  return (
    <PatternBackground name="matrix" opacity={0.03} fixed>
      <section className="min-h-screen flex items-center justify-center">
        {/* Hero 内容 */}
      </section>
    </PatternBackground>
  );
}
```

### 8. 装饰元素

```tsx
import { Decoration } from '@/components/graphics';

export function DecoratedCard() {
  return (
    <div className="relative bg-card border border-cyber-border rounded-lg p-8">
      {/* 角落装饰 */}
      <Decoration type="corner-bracket" position="top-left" />
      <Decoration type="corner-bracket" position="top-right" />
      <Decoration type="corner-bracket" position="bottom-left" />
      <Decoration type="corner-bracket" position="bottom-right" />

      {/* 内容 */}
      <h3 className="text-xl font-bold">特色功能</h3>
      <p className="text-cyber-gray-200 mt-2">
        赛博朋克风格的现代化博客平台
      </p>
    </div>
  );
}

// 分隔线
export function Divider() {
  return (
    <div className="my-12 flex items-center justify-center">
      <Decoration type="divider" className="w-full max-w-md" />
    </div>
  );
}
```

### 9. 加载状态

```tsx
import { Decoration } from '@/components/graphics';

export function LoadingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Decoration type="loader" />
      <p className="mt-4 text-cyber-cyan animate-pulse">
        加载中...
      </p>
    </div>
  );
}

// 按钮加载状态
export function LoadingButton() {
  return (
    <button disabled className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/20 rounded">
      <Decoration type="loader" width={20} height={20} />
      <span>提交中...</span>
    </button>
  );
}
```

### 10. 技术栈展示

```tsx
import { Icon } from '@/components/graphics';

export function TechStack() {
  const tech = [
    { name: 'Next.js', icon: 'code', color: 'text-white' },
    { name: 'TypeScript', icon: 'terminal', color: 'text-blue-500' },
    { name: 'Tailwind', icon: 'zap', color: 'text-cyan-400' },
    { name: 'WordPress', icon: 'server', color: 'text-blue-600' },
  ];

  return (
    <div className="flex gap-6 flex-wrap">
      {tech.map(item => (
        <div key={item.name} className="flex items-center gap-2">
          <Icon
            name={item.icon as any}
            size={24}
            className={item.color}
          />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎨 高级用法

### 条件渲染

```tsx
import { Icon } from '@/components/graphics';

export function StatusIndicator({ status }: { status: 'online' | 'offline' | 'loading' }) {
  const statusConfig = {
    online: { icon: 'check', color: 'text-green-400', label: '在线' },
    offline: { icon: 'close', color: 'text-red-400', label: '离线' },
    loading: { icon: 'alert', color: 'text-yellow-400', label: '连接中' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <Icon
        name={config.icon as any}
        size={16}
        className={config.color}
        glow
      />
      <span className={config.color}>{config.label}</span>
    </div>
  );
}
```

### 动态图标

```tsx
import { Icon, ICON_NAMES } from '@/components/graphics';

export function DynamicButton({ action }: { action: 'edit' | 'delete' | 'save' }) {
  const buttonConfig = {
    edit: { icon: ICON_NAMES.EDIT, label: '编辑', variant: 'action' as const },
    delete: { icon: ICON_NAMES.TRASH, label: '删除', variant: 'status' as const },
    save: { icon: ICON_NAMES.SAVE, label: '保存', variant: 'default' as const },
  };

  const config = buttonConfig[action];

  return (
    <button className="flex items-center gap-2">
      <Icon name={config.icon} size={18} variant={config.variant} />
      <span>{config.label}</span>
    </button>
  );
}
```

### 图标动画

```tsx
import { Icon } from '@/components/graphics';

export function AnimatedIcons() {
  return (
    <div className="flex gap-4">
      {/* 脉冲动画 */}
      <Icon name="bell" size={24} animation="pulse" />

      {/* 旋转动画 (加载) */}
      <Icon name="refresh" size={24} animation="spin" />

      {/* 弹跳动画 (提示) */}
      <Icon name="alert" size={24} animation="bounce" />
    </div>
  );
}
```

---

## 🎯 最佳实践

### 1. 尺寸规范

```tsx
// 标准尺寸
const iconSizes = {
  xs: 16,  // 内联文本
  sm: 20,  // 小按钮
  md: 24,  // 标准图标 (默认)
  lg: 32,  // 大按钮
  xl: 48,  // 特色图标
};
```

### 2. 颜色使用

```tsx
// 语义化颜色
const iconColors = {
  primary: 'text-cyber-cyan',
  secondary: 'text-cyber-purple',
  accent: 'text-cyber-pink',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};
```

### 3. 无障碍访问

```tsx
// 添加 aria-label
<Icon name="github" size={24} />

// 按钮
<button aria-label="打开设置">
  <Icon name="settings" size={20} />
</button>

// 链接
<a href="/rss" aria-label="RSS 订阅">
  <Icon name="rss" size={20} />
</a>
```

### 4. 性能优化

```tsx
// 首屏 Logo 优先加载
<LogoDisplay variant="main" size={200} priority />

// 非首屏插画延迟加载
<Illustration name="cyber-city" loading="lazy" />

// 使用 Next.js Image 优化
<Image
  src="/icons/home.svg"
  alt="Home"
  width={24}
  height={24}
  // 自动优化
/>
```

---

## 📚 完整示例

```tsx
import {
  Icon,
  LogoDisplay,
  Illustration,
  PatternBackground,
  Decoration
} from '@/components/graphics';

export function HomePage() {
  return (
    <main>
      {/* Hero 区域 */}
      <PatternBackground name="grid" opacity={0.03}>
        <section className="relative min-h-screen">
          <Illustration name="cyber-city" fill className="opacity-20" />

          <div className="relative z-10 container mx-auto px-4">
            <LogoDisplay variant="main" size={200} animated />

            <h1 className="text-6xl font-bold text-center my-8">
              CyberPress Platform
            </h1>

            <div className="flex justify-center gap-4">
              <button className="flex items-center gap-2 bg-neon-gradient px-6 py-3 rounded">
                <Icon name="blog" size={20} />
                <span>浏览博客</span>
              </button>

              <button className="flex items-center gap-2 border border-cyber-cyan px-6 py-3 rounded hover:bg-cyber-cyan/10">
                <Icon name="github" size={20} variant="social" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
        </section>
      </PatternBackground>

      {/* 特性区域 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'zap', title: '快速性能', desc: '基于 Next.js 14' },
              { icon: 'shield', title: '安全可靠', desc: '企业级安全' },
              { icon: 'terminal', title: '开发者友好', desc: '完整的 API' },
            ].map((item, i) => (
              <div key={i} className="relative bg-card border border-cyber-border rounded-lg p-6 hover:border-cyber-cyan transition-all">
                <Decoration type="corner-bracket" position="top-left" />
                <Icon name={item.icon as any} size={32} className="text-cyber-cyan mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-cyber-gray-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 分隔线 */}
      <Divider />

      {/* 技术栈 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">技术栈</h2>
          <TechStack />
        </div>
      </section>
    </main>
  );
}
```

---

**更多示例**: 查看 `/examples/graphics` 目录
**文档**: [GRAPHICS_GUIDE.md](/GRAPHICS_GUIDE.md)
