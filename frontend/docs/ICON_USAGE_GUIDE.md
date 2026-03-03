# CyberPress 图标使用指南

> 📅 创建时间: 2026-03-03
> 🎨 设计团队: CyberPress AI Design Team
> 📦 版本: v3.0

## 📋 目录

1. [快速开始](#快速开始)
2. [基础用法](#基础用法)
3. [颜色变体](#颜色变体)
4. [尺寸规范](#尺寸规范)
5. [动画效果](#动画效果)
6. [最佳实践](#最佳实践)
7. [常见场景](#常见场景)
8. [性能优化](#性能优化)

---

## 🚀 快速开始

### 安装依赖

```bash
# 确保已安装 lucide-react (可选，用于额外图标)
npm install lucide-react
```

### 导入图标

```tsx
// 从图标库导入
import { SearchIcon, GitHubIcon, CpuIcon } from '@/components/icons';

// 从图形库导入
import { MainLogo, SquareLogo } from '@/components/graphics/Logos';
import { CyberCityIllustration } from '@/components/graphics/Illustrations';
import { CornerBracket, DividerLine } from '@/components/graphics/Decorations';
```

---

## 📖 基础用法

### 最简单的使用方式

```tsx
import { SearchIcon } from '@/components/icons';

function MyComponent() {
  return <SearchIcon />;
}
```

### 自定义尺寸

```tsx
// 设置具体像素值
<SearchIcon size={32} />

// 使用预设尺寸
<SearchIcon size="small" />   // 16px
<SearchIcon size="medium" />  // 24px (默认)
<SearchIcon size="large" />   // 32px
<SearchIcon size="xlarge" />  // 48px
```

### 添加类名

```tsx
<SearchIcon className="text-cyber-cyan hover:text-cyber-purple" />
```

### 自定义颜色

```tsx
// 使用 color 属性
<SearchIcon color="#ff0080" />

// 使用 CSS 类
<SearchIcon className="text-cyber-pink" />
```

---

## 🎨 颜色变体

### 内置颜色

所有图标都支持赛博朋克主题的 5 种颜色：

```tsx
// 霓虹青 (默认)
<SearchIcon variant="cyan" />

// 赛博紫
<SearchIcon variant="purple" />

// 激光粉
<SearchIcon variant="pink" />

// 电压黄
<SearchIcon variant="yellow" />

// 矩阵绿
<SearchIcon variant="green" />
```

### 颜色含义指南

| 颜色 | HEX | 语义 | 使用场景 |
|------|-----|------|----------|
| 霓虹青 | `#00f0ff` | 主要操作 | 主按钮、链接、导航 |
| 赛博紫 | `#9d00ff` | 次要操作 | 次要链接、装饰元素 |
| 激光粉 | `#ff0080` | 警告/强调 | 警告信息、删除操作 |
| 电压黄 | `#f0ff00` | 高亮/成功 | 成功状态、评分星级 |
| 矩阵绿 | `#00ff88` | 成功/在线 | 成功提示、在线状态 |

---

## 📐 尺寸规范

### 标准尺寸

```tsx
// 超小尺寸 - 用于紧凑空间
<Icon size={12} />

// 小尺寸 - 用于按钮、列表项
<Icon size={16} />

// 中小尺寸 - 用于输入框、标签
<Icon size={20} />

// 标准尺寸 - 导航、卡片 (默认)
<Icon size={24} />

// 大尺寸 - 标题、装饰
<Icon size={32} />

// 超大尺寸 - 英雄区、特色展示
<Icon size={48} />

// 特大尺寸 - 页面装饰
<Icon size={64} />
```

### 使用场景参考

| 场景 | 推荐尺寸 | 示例 |
|------|----------|------|
| 按钮图标 | 16-20px | `<Button><Icon size={16} /></Button>` |
| 导航图标 | 20-24px | `<Nav><Icon size={24} /></Nav>` |
| 列表图标 | 16-20px | `<ListItem><Icon size={18} /></ListItem>` |
| 卡片图标 | 24-32px | `<Card><Icon size={28} /></Card>` |
| 页面装饰 | 48-64px | `<Hero><Icon size={64} /></Hero>` |

---

## ⚡ 动画效果

### 启用动画

```tsx
import { CpuIcon, SyncIcon } from '@/components/icons';

// 脉冲动画 - 呼吸效果
<CpuIcon size={32} animated={true} />

// 旋转动画 - 用于刷新、加载
<SyncIcon size={24} animated={true} />
```

### 自定义动画类

```tsx
// 使用 Tailwind 动画类
<Icon className="animate-spin" />        // 持续旋转
<Icon className="animate-pulse" />       // 脉冲
<Icon className="animate-bounce" />      // 弹跳
<Icon className="animate-ping" />        // 声波扩散
```

### SVG 内部动画

某些图标（如 AnimatedLogo）内置了 SVG 动画：

```tsx
import { AnimatedLogo } from '@/components/graphics/Logos';

<AnimatedLogo width={100} />
// 自动播放颜色渐变和脉冲动画
```

---

## 🎯 最佳实践

### ✅ 推荐做法

```tsx
// 1. 使用语义化的 aria-label
<SearchIcon size={24} aria-label="搜索" />

// 2. 按需导入图标
import { SearchIcon } from '@/components/icons/SearchIcon';

// 3. 使用标准尺寸
<Icon size={24} />

// 4. 根据语义选择颜色
<CheckIcon variant="green" />   // 成功
<WarningIcon variant="yellow" /> // 警告
<ErrorIcon variant="pink" />     // 错误

// 5. 组合图标和文字
<button className="flex items-center gap-2">
  <DownloadIcon size={20} />
  <span>下载</span>
</button>
```

### ❌ 避免的做法

```tsx
// 1. 不要使用不规范的尺寸
<Icon size={23} />  // ❌

// 2. 不要全量导入所有图标
import * as Icons from '@/components/icons';  // ❌

// 3. 不要滥用动画
<Icon animated={true} />  // ❌ 只在需要时使用

// 4. 不要忘记可访问性
<Icon />  // ❌ 缺少 aria-label

// 5. 不要颜色与语义不符
<CheckIcon variant="pink" />  // ❌ 成功不应该用警告色
```

---

## 💼 常见场景

### 导航菜单

```tsx
import { HomeIcon, BlogIcon, PortfolioIcon } from '@/components/icons';

function Navigation() {
  return (
    <nav className="flex gap-6">
      <a href="/" className="flex items-center gap-2">
        <HomeIcon size={20} variant="cyan" />
        <span>首页</span>
      </a>
      <a href="/blog" className="flex items-center gap-2">
        <BlogIcon size={20} variant="purple" />
        <span>博客</span>
      </a>
      <a href="/portfolio" className="flex items-center gap-2">
        <PortfolioIcon size={20} variant="pink" />
        <span>作品集</span>
      </a>
    </nav>
  );
}
```

### 按钮组

```tsx
import { DownloadIcon, ShareIcon, BookmarkIcon } from '@/components/icons';

function ActionButtons() {
  return (
    <div className="flex gap-3">
      <button className="btn btn-primary">
        <DownloadIcon size={18} />
        下载
      </button>
      <button className="btn btn-secondary">
        <ShareIcon size={18} />
        分享
      </button>
      <button className="btn btn-ghost">
        <BookmarkIcon size={18} />
      </button>
    </div>
  );
}
```

### 状态指示

```tsx
import { OnlineIcon, OfflineIcon, SyncIcon } from '@/components/icons';

function StatusIndicator({ status }: { status: 'online' | 'offline' | 'syncing' }) {
  return (
    <div className="flex items-center gap-2">
      {status === 'online' && (
        <>
          <OnlineIcon size={16} variant="green" animated={true} />
          <span className="text-sm">在线</span>
        </>
      )}
      {status === 'offline' && (
        <>
          <OfflineIcon size={16} variant="pink" />
          <span className="text-sm">离线</span>
        </>
      )}
      {status === 'syncing' && (
        <>
          <SyncIcon size={16} variant="yellow" animated={true} />
          <span className="text-sm">同步中</span>
        </>
      )}
    </div>
  );
}
```

### 社交链接

```tsx
import { GitHubIcon, TwitterIcon, LinkedInIcon } from '@/components/icons';

function SocialLinks() {
  return (
    <div className="flex gap-4">
      <a href="https://github.com" aria-label="GitHub">
        <GitHubIcon size={24} className="hover:text-cyber-purple transition" />
      </a>
      <a href="https://twitter.com" aria-label="Twitter">
        <TwitterIcon size={24} className="hover:text-cyber-pink transition" />
      </a>
      <a href="https://linkedin.com" aria-label="LinkedIn">
        <LinkedInIcon size={24} className="hover:text-cyber-cyan transition" />
      </a>
    </div>
  );
}
```

### 装饰元素

```tsx
import { CornerBracket, DividerLine } from '@/components/graphics/Decorations';

function DecoratedCard() {
  return (
    <div className="relative p-6 bg-cyber-card rounded-lg">
      <CornerBracket position="top-left" variant="cyan" />
      <CornerBracket position="top-right" variant="purple" />
      <CornerBracket position="bottom-left" variant="pink" />
      <CornerBracket position="bottom-right" variant="yellow" />

      <h2 className="text-xl mb-4">标题</h2>
      <p>内容...</p>

      <DividerLine variant="tech" className="my-4" />
    </div>
  );
}
```

---

## ⚡ 性能优化

### 按需导入

```tsx
// ✅ 推荐 - 按需导入
import { SearchIcon } from '@/components/icons/SearchIcon';

// ❌ 避免 - 全量导入
import * as Icons from '@/components/icons';
```

### SVG 精简

所有图标已经过优化：
- 移除冗余代码
- 使用 `currentColor` 减少颜色定义
- 压缩路径数据

### 使用 SVG Sprite (未来优化)

```tsx
// 计划中的功能
import { Icon } from '@/components/icons/IconSprite';

<Icon name="search" size={24} />
```

---

## 🎨 自定义样式

### 创建自定义图标样式

```css
/* custom-icons.css */
.icon-glow {
  filter: drop-shadow(0 0 5px currentColor);
}

.icon-spin-slow {
  animation: spin 3s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### 使用自定义样式

```tsx
<Icon className="icon-glow icon-spin-slow" />
```

---

## 📱 响应式图标

```tsx
function ResponsiveIcon() {
  return (
    <>
      {/* 移动端 - 小图标 */}
      <Icon size={20} className="md:hidden" />

      {/* 平板 - 中图标 */}
      <Icon size={24} className="hidden md:block lg:hidden" />

      {/* 桌面 - 大图标 */}
      <Icon size={32} className="hidden lg:block" />
    </>
  );
}
```

---

## 🔧 高级用法

### 条件渲染图标

```tsx
function StatusIcon({ status }: { status: string }) {
  const iconMap = {
    success: <CheckIcon variant="green" size={20} />,
    warning: <WarningIcon variant="yellow" size={20} />,
    error: <ErrorIcon variant="pink" size={20} />,
  };

  return iconMap[status as keyof typeof iconMap] || <InfoIcon size={20} />;
}
```

### 动态图标大小

```tsx
function DynamicIcon({ level }: { level: 1 | 2 | 3 }) {
  const sizeMap = { 1: 16, 2: 24, 3: 32 };
  return <StarIcon size={sizeMap[level]} />;
}
```

### 图标组合

```tsx
function IconWithBadge() {
  return (
    <div className="relative">
      <BellIcon size={24} />
      <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-pink rounded-full" />
    </div>
  );
}
```

---

## 🌐 国际化

### 多语言图标标签

```tsx
function IconWithI18N() {
  const t = useTranslation();

  return (
    <SearchIcon
      size={24}
      aria-label={t('icons.search')}
    />
  );
}
```

---

## 📚 相关资源

- [完整图标清单](./GRAPHICS_ASSETS.md)
- [配色参考](../public/COLOR_PALETTE.md)
- [组件文档](../components/graphics/README.md)
- [Tailwind CSS 图标](https://heroicons.com/)

---

## 🐛 故障排除

### 图标不显示

```tsx
// 检查导入路径
import { SearchIcon } from '@/components/icons';  // ✅
import { SearchIcon } from './components/icons';  // ❌

// 检查组件名称
<SearchIcon />   // ✅
<searchIcon />   // ❌
<search icon />  // ❌
```

### 颜色不生效

```tsx
// 使用 variant 而不是 color
<Icon variant="cyan" />   // ✅
<Icon color="cyan" />     // ❌

// 或使用 className
<Icon className="text-cyber-cyan" />  // ✅
```

### 尺寸不正确

```tsx
// 使用 number 而不是 string
<Icon size={24} />   // ✅
<Icon size="24" />   // ❌

// 使用预设尺寸
<Icon size="medium" />  // ✅
<Icon size="24px" />    // ❌
```

---

**创建时间**: 2026-03-03
**设计团队**: CyberPress AI Design Team
**项目**: CyberPress Platform
**主题**: Cyberpunk Aesthetics
