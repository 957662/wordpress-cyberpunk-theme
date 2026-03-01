# CyberPress 图标使用指南

## 📚 目录

1. [快速开始](#快速开始)
2. [基础用法](#基础用法)
3. [高级用法](#高级用法)
4. [实战示例](#实战示例)
5. [最佳实践](#最佳实践)
6. [常见问题](#常见问题)

---

## 🚀 快速开始

### 安装

图标组件已包含在项目中，无需额外安装。

### 导入

```tsx
// 从统一入口导入所有图标
import {
  SearchIcon,
  BlogIcon,
  GitHubIcon,
  CpuIcon,
} from '@/components/icons';

// 或者单独导入
import { SearchIcon } from '@/components/icons/SearchIcon';
```

### 基础使用

```tsx
export default function Page() {
  return (
    <div>
      <SearchIcon size={24} />
      <BlogIcon size={32} variant="purple" />
      <CpuIcon size={48} variant="cyan" animated={true} />
    </div>
  );
}
```

---

## 📖 基础用法

### Props 接口

所有图标组件都支持以下属性：

```typescript
interface IconProps {
  size?: number;              // 图标尺寸 (默认: 24)
  variant?: ColorVariant;     // 颜色变体 (默认: cyan)
  className?: string;         // 自定义 CSS 类名
  animated?: boolean;         // 是否启用动画 (默认: false)
}

type ColorVariant = 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
```

### 尺寸控制

```tsx
// 小图标
<SearchIcon size={16} />

// 标准尺寸 (默认)
<SearchIcon size={24} />

// 大图标
<SearchIcon size={32} />

// 超大图标
<CpuIcon size={64} variant="cyan" />
```

### 颜色变体

```tsx
// 霓虹青 (默认)
<SearchIcon variant="cyan" />

// 赛博紫
<BlogIcon variant="purple" />

// 激光粉
<HeartIcon variant="pink" />

// 电压黄
<StarIcon variant="yellow" />

// 矩阵绿 (仅部分图标支持)
<OnlineIcon variant="green" />
```

### 自定义样式

```tsx
// 使用 Tailwind 类名
<SearchIcon className="text-cyber-cyan hover:text-cyber-purple transition" />

// 使用自定义 CSS
<SearchIcon className="my-custom-icon" />
```

### 动画效果

```tsx
// 启用脉冲动画
<CpuIcon size={48} variant="cyan" animated={true} />

// 启用旋转动画
<SyncIcon size={24} variant="purple" animated={true} />

// 组合动画和自定义类名
<LoadingIcon
  size={32}
  variant="pink"
  animated={true}
  className="animate-spin"
/>
```

---

## 🎯 高级用法

### 组合使用

```tsx
// 按钮与图标组合
<button className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/10 border border-cyber-cyan rounded hover:bg-cyber-cyan/20 transition">
  <DownloadIcon size={20} variant="cyan" />
  <span>下载文件</span>
</button>

// 链接与图标组合
<a href="#" className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple transition">
  <ExternalLinkIcon size={16} />
  <span>查看更多</span>
</a>
```

### 条件渲染

```tsx
// 根据状态显示不同图标
{status === 'online' ? (
  <OnlineIcon size={16} variant="green" />
) : (
  <OfflineIcon size={16} variant="pink" />
)}

// 根据类型显示不同图标
{type === 'blog' && <BlogIcon variant="purple" />}
{type === 'portfolio' && <PortfolioIcon variant="pink" />}
{type === 'about' && <UserIcon variant="cyan" />}
```

### 动态属性

```tsx
// 动态颜色
function Icon({ variant }: { variant: ColorVariant }) {
  return <StarIcon size={24} variant={variant} />;
}

// 动态尺寸
function ResponsiveIcon() {
  const [size] = useState(32);
  return <SearchIcon size={size} />;
}
```

### 作为装饰元素

```tsx
// 背景装饰
<div className="relative">
  <CpuIcon
    size={256}
    variant="cyan"
    className="absolute opacity-5 -right-20 -top-20"
  />
  <div className="relative z-10">
    <h1>核心内容</h1>
  </div>
</div>

// 边框装饰
<div className="relative p-6 border border-cyber-cyan/30 rounded-lg">
  <div className="absolute top-0 left-0 -mt-2 -ml-2">
    <ZapIcon size={16} variant="cyan" />
  </div>
  <div className="absolute top-0 right-0 -mt-2 -mr-2">
    <ZapIcon size={16} variant="cyan" />
  </div>
  <div className="absolute bottom-0 left-0 -mb-2 -ml-2">
    <ZapIcon size={16} variant="cyan" />
  </div>
  <div className="absolute bottom-0 right-0 -mb-2 -mr-2">
    <ZapIcon size={16} variant="cyan" />
  </div>
  <div className="content">
    装饰性边框内容
  </div>
</div>
```

---

## 💼 实战示例

### 1. 导航栏

```tsx
'use client';

import Link from 'next/link';
import { HomeIcon, BlogIcon, PortfolioIcon, UserIcon } from '@/components/icons';

export function Navigation() {
  const navItems = [
    { href: '/', icon: HomeIcon, label: '首页' },
    { href: '/blog', icon: BlogIcon, label: '博客' },
    { href: '/portfolio', icon: PortfolioIcon, label: '作品集' },
    { href: '/about', icon: UserIcon, label: '关于' },
  ];

  return (
    <nav className="flex items-center gap-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 text-cyber-gray-200 hover:text-cyber-cyan transition"
          >
            <Icon size={20} variant="cyan" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

### 2. 社交链接

```tsx
'use client';

import { GitHubIcon, TwitterIcon, DiscordIcon, YouTubeIcon } from '@/components/icons';

const socialLinks = [
  { href: 'https://github.com', icon: GitHubIcon, name: 'GitHub', variant: 'cyan' as const },
  { href: 'https://twitter.com', icon: TwitterIcon, name: 'Twitter', variant: 'purple' as const },
  { href: 'https://discord.com', icon: DiscordIcon, name: 'Discord', variant: 'purple' as const },
  { href: 'https://youtube.com', icon: YouTubeIcon, name: 'YouTube', variant: 'pink' as const },
];

export function SocialLinks() {
  return (
    <div className="flex gap-4">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-cyber-card border border-cyber-border rounded hover:border-cyber-cyan hover:shadow-neon-cyan transition"
            aria-label={link.name}
          >
            <Icon size={24} variant={link.variant} />
          </a>
        );
      })}
    </div>
  );
}
```

### 3. 状态指示器

```tsx
'use client';

import { OnlineIcon, OfflineIcon, SyncIcon } from '@/components/icons';

type SystemStatus = 'online' | 'offline' | 'syncing';

export function StatusIndicator({ status }: { status: SystemStatus }) {
  const statusConfig = {
    online: {
      icon: OnlineIcon,
      variant: 'green' as const,
      text: '系统在线',
      className: 'text-cyber-green',
    },
    offline: {
      icon: OfflineIcon,
      variant: 'pink' as const,
      text: '连接断开',
      className: 'text-cyber-pink',
    },
    syncing: {
      icon: SyncIcon,
      variant: 'cyan' as const,
      text: '同步中...',
      className: 'text-cyber-cyan',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 ${config.className}`}>
      <Icon size={16} variant={config.variant} animated={status === 'syncing'} />
      <span className="text-sm">{config.text}</span>
    </div>
  );
}
```

### 4. 文件列表

```tsx
'use client';

import { FileIcon, ArchiveIcon, FolderIcon } from '@/components/icons';
import type { FileIconProps } from '@/components/icons/FileIcon';

type FileType = 'file' | 'archive' | 'folder';

interface FileItem {
  name: string;
  type: FileType;
  size?: string;
}

const fileIcons = {
  file: FileIcon,
  archive: ArchiveIcon,
  folder: FolderIcon,
};

export function FileList({ files }: { files: FileItem[] }) {
  return (
    <ul className="space-y-2">
      {files.map((file, index) => {
        const Icon = fileIcons[file.type];
        return (
          <li
            key={index}
            className="flex items-center gap-3 p-3 bg-cyber-card border border-cyber-border rounded hover:border-cyber-cyan transition cursor-pointer"
          >
            <Icon size={20} variant="cyan" />
            <span className="flex-1 text-cyber-gray-100">{file.name}</span>
            {file.size && (
              <span className="text-sm text-cyber-gray-300">{file.size}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
```

### 5. 操作按钮组

```tsx
'use client';

import { ShareIcon, CopyIcon, DownloadIcon, HeartIcon } from '@/components/icons';

export function ActionButtons() {
  const actions = [
    { icon: ShareIcon, label: '分享', variant: 'cyan' as const, onClick: () => console.log('分享') },
    { icon: CopyIcon, label: '复制', variant: 'purple' as const, onClick: () => console.log('复制') },
    { icon: DownloadIcon, label: '下载', variant: 'pink' as const, onClick: () => console.log('下载') },
    { icon: HeartIcon, label: '点赞', variant: 'yellow' as const, onClick: () => console.log('点赞') },
  ];

  return (
    <div className="flex gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex items-center gap-2 px-3 py-2 bg-cyber-card border border-cyber-border rounded hover:bg-cyber-${action.variant}/10 hover:border-cyber-${action.variant} transition"
            title={action.label}
          >
            <Icon size={16} variant={action.variant} />
          </button>
        );
      })}
    </div>
  );
}
```

### 6. 搜索框

```tsx
'use client';

import { useState } from 'react';
import { SearchIcon } from '@/components/icons';

export function SearchBox() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      <SearchIcon
        size={20}
        variant="cyan"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-gray-300"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索..."
        className="w-full pl-10 pr-4 py-2 bg-cyber-card border border-cyber-border rounded focus:border-cyber-cyan focus:outline-none focus:shadow-neon-cyan transition text-cyber-gray-100 placeholder:text-cyber-gray-400"
      />
    </div>
  );
}
```

### 7. 科技风格装饰

```tsx
'use client';

import { CpuIcon, ChipIcon, ZapIcon } from '@/components/icons';

export function TechDecoration() {
  return (
    <div className="relative min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* 背景装饰 */}
      <CpuIcon
        size={512}
        variant="cyan"
        className="absolute opacity-[0.03] -right-40 -top-40"
      />
      <ChipIcon
        size={256}
        variant="purple"
        className="absolute opacity-[0.05] -left-20 -bottom-20"
      />

      {/* 内容 */}
      <div className="relative z-10 text-center space-y-6">
        <div className="flex justify-center gap-4">
          <ZapIcon size={32} variant="cyan" animated={true} />
          <ZapIcon size={32} variant="purple" animated={true} />
          <ZapIcon size={32} variant="pink" animated={true} />
        </div>
        <h1 className="text-5xl font-display font-bold text-cyber-cyan">
          CYBERPUNK
        </h1>
        <p className="text-xl text-cyber-gray-200">
          未来的科技风格
        </p>
      </div>
    </div>
  );
}
```

---

## 🌟 最佳实践

### 1. 尺寸选择

```tsx
// ✅ 推荐：使用标准尺寸
<SearchIcon size={16} />  // 小尺寸：按钮、列表
<SearchIcon size={24} />  // 标准尺寸：导航、卡片
<SearchIcon size={32} />  // 大尺寸：标题、装饰
<SearchIcon size={48} />  // 超大尺寸：英雄区、背景

// ❌ 避免：使用不规范的尺寸
<SearchIcon size={23} />  // 不标准
<SearchIcon size={27} />  // 难以对齐
```

### 2. 颜色选择

```tsx
// ✅ 推荐：根据语义选择颜色
<OnlineIcon variant="green" />      // 在线状态
<OfflineIcon variant="pink" />      // 离线状态
<WarningIcon variant="yellow" />    // 警告
<ErrorIcon variant="pink" />        // 错误

// ✅ 推荐：根据主题选择颜色
<CpuIcon variant="cyan" />          // 科技主题
<HeartIcon variant="pink" />        // 爱心主题
<StarIcon variant="yellow" />       // 评分主题

// ❌ 避免：颜色与语义不符
<OnlineIcon variant="pink" />       // 误导用户
<WarningIcon variant="green" />     // 混淆语义
```

### 3. 动画使用

```tsx
// ✅ 推荐：适度使用动画
<LoadingIcon animated={true} />           // 加载状态
<SyncIcon animated={true} />              // 同步中
<OnlineIcon animated={true} />            // 在线指示

// ❌ 避免：过度使用动画
<SearchIcon animated={true} />            // 干扰用户
<HomeIcon animated={true} />              // 分散注意力
```

### 4. 可访问性

```tsx
// ✅ 推荐：添加可访问性属性
<button aria-label="搜索">
  <SearchIcon size={20} />
</button>

<a href="#" aria-label="查看 GitHub 仓库">
  <GitHubIcon size={24} />
</a>

// ✅ 推荐：为装饰性图标添加 aria-hidden
<div aria-hidden="true">
  <CpuIcon size={64} variant="cyan" />
</div>
```

### 5. 性能优化

```tsx
// ✅ 推荐：按需导入
import { SearchIcon } from '@/components/icons/SearchIcon';

// ✅ 推荐：合理使用动态导入
const HeavyIcon = dynamic(() => import('@/components/icons/HeavyIcon'), {
  loading: () => <LoadingIcon size={24} />,
});

// ❌ 避免：导入所有图标
import * as Icons from '@/components/icons';
```

---

## ❓ 常见问题

### Q: 如何自定义图标颜色？

```tsx
// 方法1：使用 variant
<SearchIcon variant="cyan" />

// 方法2：使用 className
<SearchIcon className="text-blue-500" />

// 方法3：使用内联样式
<SearchIcon style={{ color: '#00f0ff' }} />
```

### Q: 如何创建自定义动画？

```tsx
// 在 tailwind.config.ts 中添加自定义动画
animation: {
  'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
},
keyframes: {
  'glow-pulse': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.5' },
  },
}

// 使用自定义动画
<SearchIcon className="animate-glow-pulse" />
```

### Q: 如何在项目中添加新图标？

```tsx
// 1. 创建新图标组件
// frontend/components/icons/MyIcon.tsx
interface MyIconProps {
  size?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow';
  className?: string;
  animated?: boolean;
}

export const MyIcon: React.FC<MyIconProps> = ({
  size = 24,
  variant = 'cyan',
  className = '',
  animated = false,
}) => {
  // 图标实现
  return <svg>...</svg>;
};

// 2. 在 index.ts 中导出
export { MyIcon } from './MyIcon';
export type { MyIconProps } from './MyIcon';

// 3. 使用新图标
import { MyIcon } from '@/components/icons';
<MyIcon size={24} variant="cyan" />
```

### Q: 图标在不同主题下的表现？

```tsx
// 图标使用 currentColor，会自动适应主题
<div className="dark">
  <SearchIcon className="text-cyber-cyan" />  // 深色模式
</div>

<div className="light">
  <SearchIcon className="text-blue-600" />    // 浅色模式
</div>
```

### Q: 如何处理图标的加载状态？

```tsx
'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';

const DynamicIcon = dynamic(
  () => import('@/components/icons/HeavyIcon'),
  {
    loading: () => <LoadingIcon size={24} variant="cyan" />,
  }
);

export function IconWithLoader() {
  const [loaded, setLoaded] = useState(false);

  return (
    <Suspense fallback={<LoadingIcon size={24} variant="cyan" />}>
      <DynamicIcon size={48} variant="purple" />
    </Suspense>
  );
}
```

---

**版本**: v2.0
**更新时间**: 2026-03-02
**设计团队**: CyberPress AI Design Team
