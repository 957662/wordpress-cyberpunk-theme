# 图标快速开始指南

## 🚀 快速导入

### 方式 1: 从组件库导入

```tsx
// 单个导入
import { SearchIcon } from '@/components/icons';

// 多个导入
import { SearchIcon, GitHubIcon, MenuIcon } from '@/components/icons';

// 批量导入
import * as Icons from '@/components/icons';
```

### 方式 2: 直接使用 SVG

```tsx
// 使用 public 目录的 SVG
<Image src="/icons/search.svg" alt="Search" width={24} height={24} />

// 使用 SVG 精灵图
<svg className="icon">
  <use href="/sprite-complete.svg#icon-search"></use>
</svg>
```

---

## 📋 图标分类

### 导航图标 (Navigation)
```tsx
import {
  HomeIcon,
  BlogIcon,
  PortfolioIcon,
  SearchIcon,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from '@/components/icons';
```

### 社交图标 (Social)
```tsx
import {
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  DiscordIcon,
  YouTubeIcon,
  DribbbleIcon,
  EmailIcon,
  RSSIcon,
} from '@/components/icons';
```

### 功能图标 (Utility)
```tsx
import {
  CalendarIcon,
  TagIcon,
  CodeIcon,
  TerminalIcon,
  UserIcon,
  SettingsIcon,
  HeartIcon,
  CommentIcon,
  ShareIcon,
  CopyIcon,
  ExternalLink,
  CheckIcon,
  CloseIcon,
  WarningIcon,
  ErrorIcon,
  InfoIcon,
  StarIcon,
  FilterIcon,
  SortIcon,
} from '@/components/icons';
```

### 操作图标 (Action)
```tsx
import {
  MenuIcon,
  CloseIcon,
  EditIcon,
  TrashIcon,
  SaveIcon,
  RefreshIcon,
  LockIcon,
  UnlockIcon,
  EyeIcon,
  EyeOffIcon,
  BookmarkIcon,
  DownloadIcon,
  UploadIcon,
  FolderIcon,
  FileIcon,
} from '@/components/icons';
```

### 主题图标 (Theme)
```tsx
import {
  ThemeIcon,
  SunIcon,
  MoonIcon,
} from '@/components/icons';
```

### 媒体图标 (Media)
```tsx
import {
  CameraIcon,
  MusicIcon,
  VideoIcon,
  ImageIcon,
  MicIcon,
} from '@/components/icons';
```

### 赛博图标 (Cyber)
```tsx
import {
  CyberIcon,
  CpuIcon,
  ChipIcon,
  NetworkIcon,
  HologramIcon,
  DatabaseIcon,
} from '@/components/icons';
```

### 状态图标 (Status)
```tsx
import {
  OnlineIcon,
  OfflineIcon,
  SyncIcon,
  LoadingIcon,
  BellIcon,
} from '@/components/icons';
```

---

## 🎨 使用示例

### 基础使用

```tsx
import { SearchIcon } from '@/components/icons';

export default function SearchBar() {
  return (
    <div className="relative">
      <SearchIcon size={24} />
      <input type="text" placeholder="搜索..." />
    </div>
  );
}
```

### 带颜色的图标

```tsx
import { GitHubIcon, HeartIcon } from '@/components/icons';

export default function ColoredIcons() {
  return (
    <div className="flex gap-4">
      <GitHubIcon size={32} variant="cyan" />
      <HeartIcon size={32} variant="pink" />
      <StarIcon size={32} variant="yellow" />
    </div>
  );
}
```

### 动画图标

```tsx
import { LoadingIcon, SyncIcon } from '@/components/icons';

export default function AnimatedIcons() {
  return (
    <div className="flex gap-4">
      <LoadingIcon size={32} animated={true} />
      <SyncIcon size={32} animated={true} />
    </div>
  );
}
```

### 按钮中的图标

```tsx
import { DownloadIcon, GitHubIcon } from '@/components/icons';

export default function IconButtons() {
  return (
    <div className="flex gap-4">
      <button className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan text-cyber-black rounded">
        <DownloadIcon size={20} />
        <span>下载</span>
      </button>

      <button className="flex items-center gap-2 px-4 py-2 border border-cyber-purple text-cyber-purple rounded hover:bg-cyber-purple/10">
        <GitHubIcon size={20} />
        <span>GitHub</span>
      </button>
    </div>
  );
}
```

### 导航栏图标

```tsx
import { HomeIcon, BlogIcon, PortfolioIcon, MenuIcon } from '@/components/icons';
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-cyber-dark">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple">
          <HomeIcon size={24} />
          <span>首页</span>
        </Link>

        <Link href="/blog" className="flex items-center gap-2 text-cyber-gray-200 hover:text-cyber-cyan">
          <BlogIcon size={24} />
          <span>博客</span>
        </Link>

        <Link href="/portfolio" className="flex items-center gap-2 text-cyber-gray-200 hover:text-cyber-cyan">
          <PortfolioIcon size={24} />
          <span>作品集</span>
        </Link>
      </div>

      <button className="md:hidden">
        <MenuIcon size={24} />
      </button>
    </nav>
  );
}
```

### 卡片中的图标

```tsx
import { CalendarIcon, TagIcon, UserIcon } from '@/components/icons';

export default function BlogCard({ post }) {
  return (
    <article className="p-6 bg-cyber-dark border border-cyber-cyan/20 rounded-lg hover:border-cyber-cyan hover:shadow-neon-cyan transition-all">
      <h2 className="text-xl font-bold text-cyber-cyan mb-4">{post.title}</h2>

      <div className="flex items-center gap-4 text-sm text-cyber-gray-300">
        <div className="flex items-center gap-1">
          <CalendarIcon size={16} />
          <span>{post.date}</span>
        </div>

        <div className="flex items-center gap-1">
          <UserIcon size={16} />
          <span>{post.author}</span>
        </div>

        <div className="flex items-center gap-1">
          <TagIcon size={16} />
          <span>{post.category}</span>
        </div>
      </div>
    </article>
  );
}
```

### 社交链接

```tsx
import { GitHubIcon, TwitterIcon, LinkedInIcon, EmailIcon } from '@/components/icons';

export default function SocialLinks() {
  const socials = [
    { icon: GitHubIcon, href: 'https://github.com', label: 'GitHub' },
    { icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
    { icon: LinkedInIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: EmailIcon, href: 'mailto:hello@example.com', label: 'Email' },
  ];

  return (
    <div className="flex gap-4">
      {socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          aria-label={social.label}
          className="p-2 text-cyber-cyan hover:text-cyber-purple hover:shadow-neon-cyan rounded transition-all"
        >
          <social.icon size={24} />
        </a>
      ))}
    </div>
  );
}
```

---

## 🎯 Tailwind 类名

### 尺寸类名
```tsx
// 自定义尺寸
<SearchIcon size={16} className="w-4 h-4" />
<SearchIcon size={20} className="w-5 h-5" />
<SearchIcon size={24} className="w-6 h-6" />
<SearchIcon size={32} className="w-8 h-8" />
<SearchIcon size={48} className="w-12 h-12" />
```

### 颜色类名
```tsx
// 使用 Tailwind 颜色
<SearchIcon className="text-cyber-cyan" />
<GitHubIcon className="text-cyber-purple" />
<HeartIcon className="text-cyber-pink" />
<StarIcon className="text-cyber-yellow" />
```

### 发光效果
```tsx
// 文字发光
<SearchIcon className="text-cyber-cyan drop-shadow-neon-cyan" />

// 组合效果
<GitHubIcon className="text-cyber-purple hover:text-cyber-cyan hover:shadow-neon-cyan transition-all" />
```

### 动画类名
```tsx
// 脉冲动画
<SyncIcon className="animate-neon-pulse" />

// 旋转动画
<LoadingIcon className="animate-spin" />

// 浮动动画
<CyberIcon className="animate-float" />
```

---

## 📱 响应式图标

```tsx
import { SearchIcon, MenuIcon } from '@/components/icons';

export default function ResponsiveIcons() {
  return (
    <div className="flex items-center gap-4">
      {/* 移动端小图标 */}
      <SearchIcon size={20} className="md:hidden" />

      {/* 桌面端大图标 */}
      <SearchIcon size={24} className="hidden md:block" />

      {/* 响应式尺寸 */}
      <MenuIcon size={window.innerWidth < 768 ? 20 : 24} />
    </div>
  );
}
```

---

## 🔧 自定义样式

### 自定义颜色

```tsx
import { GitHubIcon } from '@/components/icons';

export default function CustomStyledIcon() {
  return (
    <GitHubIcon
      size={32}
      className="text-[#4078c0] hover:text-[#58a6ff] transition-colors"
    />
  );
}
```

### 组合多个效果

```tsx
import { StarIcon } from '@/components/icons';

export default function CombinedEffects() {
  return (
    <StarIcon
      size={48}
      className="
        text-cyber-yellow
        hover:text-cyber-cyan
        hover:scale-110
        hover:shadow-neon-cyan-lg
        transition-all
        duration-300
        animate-neon-pulse
      "
    />
  );
}
```

---

## ♿ 可访问性

### 添加 aria-label

```tsx
<SearchIcon
  size={24}
  aria-label="搜索"
  role="img"
/>

<a href="https://github.com" aria-label="访问 GitHub">
  <GitHubIcon size={24} />
</a>
```

### 屏幕阅读器友好

```tsx
<button aria-label="关闭对话框">
  <CloseIcon size={24} aria-hidden="true" />
</button>
```

---

## 🎯 最佳实践

### ✅ 推荐

1. **使用标准尺寸**: 16, 20, 24, 32, 48, 64
2. **添加 aria-label**: 提升可访问性
3. **使用语义化颜色**: 成功用绿色，警告用黄色
4. **添加过渡效果**: 提升用户体验
5. **按需导入**: 优化包体积

```tsx
// ✅ 好的实践
<SearchIcon
  size={24}
  aria-label="搜索"
  className="text-cyber-cyan hover:text-cyber-purple transition-colors"
/>
```

### ❌ 避免

1. **使用不规范的尺寸**: 导致模糊或对齐问题
2. **过度使用动画**: 影响性能和用户体验
3. **忽略可访问性**: 屏幕阅读器无法识别
4. **颜色与语义不符**: 造成用户困惑
5. **全量导入**: 增加包体积

```tsx
// ❌ 不好的实践
<SearchIcon size={23} /> {/* 不规范尺寸 */}
<SearchIcon className="animate-spin animate-pulse animate-bounce" /> {/* 过度动画 */}
<GitHubIcon className="text-red-500" /> {/* 颜色与语义不符 */}
```

---

## 📚 更多资源

- [完整图标清单](../public/ICON_MANIFEST_V2.md)
- [配色参考](../public/COLOR_REFERENCE_V2.md)
- [Tailwind 配置](../tailwind.config.ts)
- [组件示例](../components/examples/)

---

**版本**: v2.0
**更新时间**: 2026-03-05
**维护者**: CyberPress AI Design Team