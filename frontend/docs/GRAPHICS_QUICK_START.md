# CyberPress Graphics - 快速开始指南

## 🚀 快速开始

### 安装依赖

CyberPress 图标库使用纯 TypeScript + SVG，无需额外依赖。

```bash
# 确保项目已安装 React 和 TypeScript
npm install react typescript
```

### 导入图标

```tsx
// 方式 1: 单个导入（推荐）
import { SearchIcon, BlogIcon, UserIcon } from '@/components/icons';

// 方式 2: 批量导入
import * as Icons from '@/components/icons';
```

### 基础使用

```tsx
import { SearchIcon } from '@/components/icons';

export default function MyComponent() {
  return (
    <div>
      {/* 默认使用 */}
      <SearchIcon />

      {/* 自定义尺寸 */}
      <SearchIcon size={32} />

      {/* 自定义颜色 */}
      <SearchIcon variant="purple" />

      {/* 自定义类名 */}
      <SearchIcon className="text-cyber-cyan" />

      {/* 启用动画 */}
      <SearchIcon animated={true} />
    </div>
  );
}
```

---

## 🎨 颜色变体

所有图标支持 5 种赛博朋克配色：

```tsx
import { HeartIcon } from '@/components/icons';

<HeartIcon variant="cyan" />    // 霓虹青 #00f0ff
<HeartIcon variant="purple" />  // 赛博紫 #9d00ff
<HeartIcon variant="pink" />    // 激光粉 #ff0080
<HeartIcon variant="yellow" />  // 电压黄 #f0ff00
<HeartIcon variant="green" />   // 矩阵绿 #00ff88
```

---

## 📐 尺寸规格

推荐使用标准尺寸：

```tsx
<SearchIcon size={16} />  // 小尺寸：按钮、列表
<SearchIcon size={20} />  // 中小尺寸：输入框
<SearchIcon size={24} />  // 标准尺寸（默认）
<SearchIcon size={32} />  // 大尺寸：标题、装饰
<SearchIcon size={48} />  // 超大尺寸：英雄区
<SearchIcon size={64} />  // 特大尺寸：背景装饰
```

---

## 💡 常用示例

### 1. 搜索框图标

```tsx
import { SearchIcon } from '@/components/icons';

export default function SearchBar() {
  return (
    <div className="relative">
      <SearchIcon
        size={20}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-cyan"
      />
      <input
        type="text"
        placeholder="搜索..."
        className="w-full pl-10 pr-4 py-2 bg-cyber-dark border border-cyber-cyan/30 rounded-lg focus:border-cyber-cyan"
      />
    </div>
  );
}
```

### 2. 按钮图标

```tsx
import { DownloadIcon } from '@/components/icons';

export default function DownloadButton() {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-neon-gradient text-cyber-black font-bold rounded-lg hover:shadow-neon-cyan transition-all">
      <DownloadIcon size={20} />
      <span>下载</span>
    </button>
  );
}
```

### 3. 导航菜单

```tsx
import { HomeIcon, BlogIcon, PortfolioIcon, UserIcon } from '@/components/icons';

export default function Navigation() {
  const navItems = [
    { icon: HomeIcon, label: '首页', href: '/' },
    { icon: BlogIcon, label: '博客', href: '/blog' },
    { icon: PortfolioIcon, label: '作品集', href: '/portfolio' },
    { icon: UserIcon, label: '关于', href: '/about' },
  ];

  return (
    <nav className="flex gap-6">
      {navItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple transition-colors"
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}
```

### 4. 卡片标题

```tsx
import { BlogIcon } from '@/components/icons';

export default function Card() {
  return (
    <div className="bg-cyber-card border border-cyber-cyan/20 rounded-lg p-6 hover:border-cyber-cyan hover:shadow-neon-cyan transition-all">
      <div className="flex items-center gap-3 mb-4">
        <BlogIcon size={32} variant="purple" />
        <h2 className="text-2xl font-bold text-glow-cyan">最新文章</h2>
      </div>
      {/* 内容 */}
    </div>
  );
}
```

### 5. 主题切换

```tsx
import { SunIcon, MoonIcon } from '@/components/icons';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-cyber-cyan/10 transition-colors"
    >
      {theme === 'dark' ? (
        <SunIcon size={24} variant="yellow" />
      ) : (
        <MoonIcon size={24} variant="purple" />
      )}
    </button>
  );
}
```

### 6. 加载状态

```tsx
import { LoadingIcon } from '@/components/icons';

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingIcon size={48} variant="cyan" animated={true} />
    </div>
  );
}
```

### 7. 社交链接

```tsx
import { GitHubIcon, TwitterIcon, LinkedInIcon } from '@/components/icons';

export default function SocialLinks() {
  const socials = [
    { icon: GitHubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
    { icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <div className="flex gap-4">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-cyber-dark border border-cyber-cyan/30 hover:border-cyber-cyan hover:shadow-neon-cyan transition-all"
          aria-label={social.label}
        >
          <social.icon size={24} />
        </a>
      ))}
    </div>
  );
}
```

### 8. 状态图标

```tsx
import { CheckIcon, WarningIcon, ErrorIcon } from '@/components/icons';

export default function StatusMessages() {
  return (
    <div className="space-y-4">
      {/* 成功状态 */}
      <div className="flex items-center gap-2 text-cyber-green">
        <CheckIcon size={20} variant="green" />
        <span>操作成功！</span>
      </div>

      {/* 警告状态 */}
      <div className="flex items-center gap-2 text-cyber-yellow">
        <WarningIcon size={20} variant="yellow" />
        <span>请注意检查输入。</span>
      </div>

      {/* 错误状态 */}
      <div className="flex items-center gap-2 text-cyber-pink">
        <ErrorIcon size={20} variant="pink" />
        <span>发生错误，请重试。</span>
      </div>
    </div>
  );
}
```

---

## 🎯 特殊图标用法

### ArrowIcon - 方向控制

```tsx
import { ArrowIcon } from '@/components/icons';

<ArrowIcon direction="up" />
<ArrowIcon direction="down" />
<ArrowIcon direction="left" />
<ArrowIcon direction="right" />
```

### HeartIcon - 填充模式

```tsx
import { HeartIcon } from '@/components/icons';

<HeartIcon filled={false} />  // 轮廓模式
<HeartIcon filled={true} />   // 填充模式
```

### ThemeIcon - 主题模式

```tsx
import { ThemeIcon } from '@/components/icons';

<ThemeIcon mode="light" />
<ThemeIcon mode="dark" />
```

---

## 🖼️ 使用 SVG 文件

### 装饰元素

```tsx
// 直接使用 SVG 文件
import CyberCorner from '@/decorations/cyber-corner.svg';

export default function DecoratedCard() {
  return (
    <div className="relative bg-cyber-card p-8">
      <CyberCorner className="absolute top-0 left-0" />
      <CyberCorner className="absolute top-0 right-0 transform rotate-90" />
      <CyberCorner className="absolute bottom-0 left-0 transform -rotate-90" />
      <CyberCorner className="absolute bottom-0 right-0 transform rotate-180" />
      {/* 内容 */}
    </div>
  );
}
```

### Logo 使用

```tsx
import Image from 'next/image';

export default function Header() {
  return (
    <Image
      src="/logos/cyberpress-icon.svg"
      alt="CyberPress"
      width={200}
      height={200}
    />
  );
}
```

---

## 🎨 Tailwind 配置

确保你的 `tailwind.config.ts` 包含赛博朋克配色：

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0a0a0f',
        'cyber-dark': '#12121a',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-yellow': '#f0ff00',
        'cyber-green': '#00ff88',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 10px #00f0ff',
        'neon-purple': '0 0 5px #9d00ff, 0 0 10px #9d00ff',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px #ff0080',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
      },
    },
  },
};
```

---

## ♿ 可访问性

为图标添加标签：

```tsx
<SearchIcon aria-label="搜索" />
<CloseIcon aria-label="关闭对话框" />
```

---

## 📚 更多资源

- [完整图标清单](./ICON_MANIFEST_V3.md)
- [配色参考](./COLOR_REFERENCE.md)
- [交付清单](./GRAPHICS_DELIVERABLES.md)
- [更新日志](../GRAPHICS_CHANGELOG_V3.md)

---

**快速开始指南** v3.0.0 | 最后更新: 2026-03-05
