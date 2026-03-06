# CyberPress 图形素材快速指南

## 📁 目录结构

```
frontend/
├── public/
│   ├── logo.svg                    # 主 Logo
│   ├── logo-icon.svg               # Logo 图标
│   ├── logo-mark.svg               # Logo 标志
│   ├── favicon.ico                 # 网站图标
│   ├── patterns/                   # 背景图案
│   │   ├── grid.svg
│   │   ├── circuit.svg
│   │   ├── scanlines.svg
│   │   ├── noise.svg
│   │   └── hexagon.svg
│   ├── backgrounds/                # 背景图
│   │   ├── hero-bg.svg
│   │   ├── card-bg.svg
│   │   └── loading-bg.svg
│   └── icons/                      # SVG 图标（70+）
│       ├── navigation/             # 导航图标
│       ├── functional/             # 功能图标
│       ├── social/                 # 社交图标
│       └── status/                 # 状态图标
│
├── components/
│   └── icons/                      # 图标组件（70+）
│       ├── index.ts                # 统一导出
│       ├── NavigationIcons.tsx     # 导航图标
│       ├── FunctionalIcons.tsx     # 功能图标
│       ├── SocialIcons.tsx         # 社交图标
│       ├── StatusIcons.tsx         # 状态图标
│       └── CyberSpecialIcons.tsx   # 赛博特效图标
│
├── styles/
│   └── cyber-utilities.css         # 赛博朋克工具类
│
└── docs/
    ├── COLOR_REFERENCE.md          # 配色参考
    ├── ICON_MANIFEST_COMPLETE.md   # 完整图标清单
    └── COLOR_PALETTE.md            # 色板说明
```

---

## 🚀 快速开始

### 1. 使用图标

```tsx
// 导入图标
import { HomeIcon, SearchIcon, HeartIcon } from '@/components/icons';

// 使用图标
export default function MyPage() {
  return (
    <div>
      {/* 默认使用 */}
      <HomeIcon />

      {/* 自定义尺寸 */}
      <SearchIcon size={32} />

      {/* 自定义颜色 */}
      <HeartIcon size={24} className="text-cyber-pink" />

      {/* 添加发光效果 */}
      <StarIcon size={24} className="neon-glow-cyan" />
    </div>
  );
}
```

### 2. 使用 Logo

```tsx
import Image from 'next/image';

export default function Header() {
  return (
    <header>
      <Image
        src="/logo.svg"
        alt="CyberPress"
        width={200}
        height={60}
        className="hover:opacity-80 transition-opacity"
      />
    </header>
  );
}
```

### 3. 使用背景图案

```tsx
// 方式1: 使用 CSS 类
export default function MyComponent() {
  return (
    <div className="bg-cyber-black bg-grid-cyber">
      内容
    </div>
  );
}

// 方式2: 使用内联样式
export default function MyComponent() {
  return (
    <div style={{
      backgroundImage: "url('/patterns/circuit.svg')",
      backgroundSize: 'cover'
    }}>
      内容
    </div>
  );
}
```

### 4. 使用配色系统

```tsx
// Tailwind 类名
export default function MyButton() {
  return (
    <button className="
      px-6 py-3
      bg-gradient-neon
      text-cyber-black
      font-bold
      rounded
      hover:shadow-neon-cyan
      transition-all
    ">
      点击我
    </button>
  );
}
```

---

## 🎨 常用图标

### 导航图标

```tsx
import {
  HomeIcon,        // 首页
  BlogIcon,        // 博客
  PortfolioIcon,   // 作品
  AboutIcon,       // 关于
  SearchIcon,      // 搜索
  MenuIcon,        // 菜单
} from '@/components/icons';
```

### 功能图标

```tsx
import {
  UserIcon,        // 用户
  SettingsIcon,    // 设置
  EditIcon,        // 编辑
  DeleteIcon,      // 删除
  SaveIcon,        // 保存
  DownloadIcon,    // 下载
  UploadIcon,      // 上传
  ShareIcon,       // 分享
  BookmarkIcon,    // 书签
  HeartIcon,       // 喜欢
  StarIcon,        // 收藏
} from '@/components/icons';
```

### 社交图标

```tsx
import {
  GitHubIcon,      // GitHub
  TwitterIcon,     // Twitter
  LinkedInIcon,    // LinkedIn
  EmailIcon,       // Email
  DiscordIcon,     // Discord
  YouTubeIcon,     // YouTube
  RSSIcon,         // RSS
} from '@/components/icons';
```

### 状态图标

```tsx
import {
  LoadingIcon,     // 加载中
  CheckIcon,       // 成功
  CloseIcon,       // 关闭
  WarningIcon,     // 警告
  ErrorIcon,       // 错误
  InfoIcon,        // 信息
  OnlineIcon,      // 在线
  OfflineIcon,     // 离线
} from '@/components/icons';
```

---

## 🌈 配色系统

### 核心颜色

```css
/* 主色 */
--cyber-cyan:      #00f0ff      /* 霓虹青 */
--cyber-purple:    #9d00ff      /* 赛博紫 */
--cyber-pink:      #ff0080      /* 激光粉 */
--cyber-yellow:    #f0ff00      /* 电压黄 */

/* 背景色 */
--cyber-dark:      #0a0a0f      /* 深空黑 */
--cyber-darker:    #050508      /* 更深黑 */
--cyber-card:      #16162a      /* 卡片背景 */

/* 文字色 */
--text-primary:    #e0e0e0      /* 主要文字 */
--text-secondary:  #a0a0b0      /* 次要文字 */
--text-muted:      #606070      /* 弱化文字 */
```

### Tailwind 类名

```tsx
// 颜色
<div className="bg-cyber-dark text-cyber-cyan">

// 渐变
<div className="bg-gradient-neon">

// 发光
<div className="neon-glow-cyan">

// 玻璃态
<div className="glass">
```

---

## ✨ 特殊效果

### 霓虹发光

```tsx
{/* 文字发光 */}
<h1 className="neon-glow-cyan">
  霓虹文字
</h1>

{/* 边框发光 */}
<div className="border-glow-cyan">
  发光边框
</div>

{/* 盒子发光 */}
<div className="box-glow-cyan">
  发光盒子
</div>
```

### 背景效果

```tsx
{/* 网格背景 */}
<div className="bg-grid-cyber">

{/* 扫描线 */}
<div className="bg-scanlines-cyan">

{/* 点阵 */}
<div className="bg-dots">

{/* 六边形 */}
<div className="bg-hexagon">
```

### 动画效果

```tsx
{/* 旋转 */}
<LoadingIcon className="animate-spin" />

{/* 脉冲 */}
<div className="animate-pulse">

{/* 霓虹脉冲 */}
<div className="animate-neon-pulse">

{/* 故障效果 */}
<div className="animate-glitch">
```

---

## 🎯 使用场景

### 导航栏

```tsx
export default function Navigation() {
  return (
    <nav className="flex items-center gap-6">
      <Link href="/" className="flex items-center gap-2">
        <HomeIcon size={20} className="text-cyber-cyan" />
        <span>首页</span>
      </Link>
      <Link href="/blog" className="flex items-center gap-2">
        <BlogIcon size={20} className="text-cyber-cyan" />
        <span>博客</span>
      </Link>
    </nav>
  );
}
```

### 文章卡片

```tsx
export default function ArticleCard() {
  return (
    <article className="cyber-card p-6 rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <CalendarIcon size={16} className="text-cyber-purple" />
        <span className="text-sm text-cyber-gray-300">2026-03-07</span>
        <TagIcon size={16} className="text-cyber-pink" />
        <span className="text-sm text-cyber-gray-300">技术</span>
      </div>

      <h2 className="text-xl font-bold text-cyber-cyan mb-2">
        文章标题
      </h2>

      <p className="text-cyber-gray-200 mb-4">
        文章摘要...
      </p>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2">
          <HeartIcon size={20} className="text-cyber-pink" />
          <span>喜欢</span>
        </button>
        <button className="flex items-center gap-2">
          <BookmarkIcon size={20} className="text-cyber-cyan" />
          <span>收藏</span>
        </button>
      </div>
    </article>
  );
}
```

### 按钮

```tsx
export default function Buttons() {
  return (
    <div className="flex gap-4">
      {/* 主要按钮 */}
      <button className="cyber-button">
        主要按钮
      </button>

      {/* 次要按钮 */}
      <button className="px-6 py-2 border-2 border-cyber-cyan text-cyber-cyan rounded hover:bg-cyber-cyan/10">
        次要按钮
      </button>

      {/* 危险按钮 */}
      <button className="px-6 py-2 bg-gradient-heat text-white rounded hover:shadow-neon-pink">
        危险按钮
      </button>
    </div>
  );
}
```

---

## 🔧 自定义配置

### 添加新图标

1. 创建 SVG 文件：
```bash
# 在 public/icons/ 目录下
touch my-icon.svg
```

2. 创建图标组件：
```tsx
// frontend/components/icons/MyIcon.tsx
export const MyIcon = ({ size = 24, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* SVG 内容 */}
    </svg>
  );
};
```

3. 导出图标：
```tsx
// frontend/components/icons/index.ts
export { MyIcon } from './MyIcon';
```

### 自定义颜色

1. 更新 Tailwind 配置：
```ts
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        'my-color': '#ff0000',
      },
    },
  },
};
```

2. 使用新颜色：
```tsx
<div className="text-my-color">自定义颜色</div>
```

---

## 📚 相关文档

- [完整图标清单](./ICON_MANIFEST_COMPLETE.md)
- [配色参考](./COLOR_REFERENCE.md)
- [色板说明](./COLOR_PALETTE.md)

---

**版本**: v1.2.0
**最后更新**: 2026-03-07
**维护者**: CyberPress AI Design Team
