# CyberPress 图形素材使用指南

> 完整的图形资源使用文档

## 📚 目录

- [素材类型](#素材类型)
- [图标使用](#图标使用)
- [图案使用](#图案使用)
- [装饰元素](#装饰元素)
- [背景效果](#背景效果)
- [Logo 使用](#logo-使用)
- [最佳实践](#最佳实践)

---

## 🎨 素材类型

CyberPress 提供以下类型的图形素材：

### 1. 图标 (Icons)
- **位置**: `/components/icons/`
- **格式**: React TypeScript 组件 + SVG
- **数量**: 100+
- **风格**: 赛博朋克 / 霓虹科技

### 2. 图案 (Patterns)
- **位置**: `/public/patterns/`
- **格式**: SVG
- **用途**: 背景纹理、装饰
- **风格**: 网格、点阵、波浪等

### 3. 装饰元素 (Decorations)
- **位置**: `/public/decorations/`
- **格式**: SVG
- **用途**: 页面装饰、分割线
- **风格**: 科技感、发光效果

### 4. 背景 (Backgrounds)
- **位置**: `/public/backgrounds/`
- **格式**: SVG
- **用途**: 页面背景、Hero 区域
- **风格**: 渐变、抽象

### 5. Logo (Branding)
- **位置**: `/public/assets/logo/`
- **格式**: SVG
- **变体**: 完整版、图标版、favicon

---

## 🎯 图标使用

### 导入方式

```tsx
// 方式1: 从统一入口导入（推荐）
import {
  SearchIcon,
  BlogIcon,
  TrophyIcon,
  RocketIcon
} from '@/components/icons';

// 方式2: 单独导入
import { SearchIcon } from '@/components/icons/SearchIcon';
```

### 基础用法

```tsx
// 默认使用
<SearchIcon />

// 自定义尺寸
<BlogIcon size={32} />

// 自定义颜色
<TrophyIcon size={24} variant="yellow" />

// 自定义类名
<SearchIcon className="text-cyber-cyan hover:text-cyber-purple" />

// 启用动画
<RocketIcon size={48} animated={true} />
```

### 颜色变体

所有图标支持 5 种赛博朋克配色：

```tsx
// 霓虹青（默认）
<Icon variant="cyan" />

// 赛博紫
<Icon variant="purple" />

// 激光粉
<Icon variant="pink" />

// 电压黄
<Icon variant="yellow" />

// 矩阵绿
<Icon variant="green" />
```

### 尺寸规格

```tsx
// 标准尺寸
<Icon size={16} />  // 小图标
<Icon size={20} />  // 中小图标
<Icon size={24} />  // 标准尺寸（默认）
<Icon size={32} />  // 大图标
<Icon size={48} />  // 超大图标
<Icon size={64} />  // 特大图标
```

### 动画效果

```tsx
// 脉冲动画
<LoadingIcon animated={true} />

// 弹跳动画
<RocketIcon animated={true} />

// 旋转动画
<SparkleIcon animated={true} />
```

### 实用示例

#### 按钮图标

```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-neon-gradient">
  <DownloadIcon size={20} variant="cyan" />
  <span>下载</span>
</button>
```

#### 导航菜单

```tsx
<nav className="flex gap-6">
  <a href="#" className="flex items-center gap-2">
    <HomeIcon size={20} variant="cyan" />
    <span>首页</span>
  </a>
  <a href="#" className="flex items-center gap-2">
    <BlogIcon size={20} variant="purple" />
    <span>博客</span>
  </a>
</nav>
```

#### 卡片标题

```tsx
<div className="flex items-center gap-3 mb-4">
  <TrophyIcon size={32} variant="yellow" />
  <h2 className="text-2xl font-bold">成就系统</h2>
</div>
```

#### 状态指示

```tsx
<div className="flex items-center gap-2">
  <OnlineIcon size={16} variant="green" animated={true} />
  <span>在线</span>
</div>
```

---

## 🌐 图案使用

### 可用图案

| 图案 | 文件 | 预览 | 用途 |
|------|------|------|------|
| 赛博网格 | `cyber-grid.svg` | ░░░ | 技术背景 |
| 赛博点阵 | `cyber-dots.svg` | ··· | 装饰纹理 |
| 赛博波浪 | `cyber-waves.svg` | ∼∼∼ | 动感效果 |
| 赛博星星 | `cyber-stars.svg` | ✦✦ | 星空效果 |
| 赛博电路 | `cyber-circuit.svg` | ⌬⌬ | 科技感 |
| 赛博六边形 | `cyber-hex.svg` | ⬡⬡ | 结构化 |

### 使用方式

#### CSS Background

```css
.hero-section {
  background-image: url('/patterns/cyber-grid.svg');
  background-repeat: repeat;
  background-size: 100px 100px;
}
```

#### Tailwind CSS

```tsx
<div className="bg-[url('/patterns/cyber-grid.svg')] bg-repeat">
  内容...
</div>
```

#### Inline SVG

```tsx
<img src="/patterns/cyber-grid.svg" alt="网格背景" className="absolute inset-0" />
```

### 实用示例

#### 页面背景

```css
.page-background {
  background-color: #0a0a0f;
  background-image:
    url('/patterns/cyber-grid.svg'),
    linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%);
  background-blend-mode: overlay;
}
```

#### 卡片纹理

```tsx
<div className="relative p-6 bg-cyber-card rounded-lg overflow-hidden">
  <div className="absolute inset-0 opacity-10">
    <img src="/patterns/cyber-circuit.svg" alt="" />
  </div>
  <div className="relative z-10">
    内容...
  </div>
</div>
```

---

## ✨ 装饰元素

### 可用装饰

| 装饰 | 文件 | 用途 |
|------|------|------|
| 发光线 | `glow-line.svg` | 分割线 |
| 角落装饰 | `corner-deco.svg` | 边框装饰 |
| 技术点阵 | `tech-dots.svg` | 背景 |
| 数据流 | `data-stream.svg` | 动态效果 |

### 使用方式

#### 分割线

```tsx
<div className="flex items-center gap-4 my-8">
  <img src="/decorations/glow-line.svg" alt="" className="flex-1" />
  <span className="text-cyber-cyan">SECTION</span>
  <img src="/decorations/glow-line.svg" alt="" className="flex-1" />
</div>
```

#### 角落装饰

```tsx
<div className="relative p-8 bg-cyber-card">
  <img
    src="/decorations/corner-deco.svg"
    alt=""
    className="absolute top-0 left-0"
  />
  内容...
</div>
```

---

## 🎨 背景效果

### Hero 区域背景

```css
.hero-bg {
  background:
    radial-gradient(ellipse at center, rgba(0, 240, 255, 0.1) 0%, transparent 70%),
    linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%),
    url('/patterns/cyber-grid.svg');
  background-size:
    100% 100%,
    100% 100%,
    100px 100px;
}
```

### 卡片背景

```css
.card-bg {
  background: linear-gradient(135deg, #16162a 0%, #1a1a2e 100%);
  border: 1px solid #2a2a4a;
  box-shadow:
    0 0 20px rgba(0, 240, 255, 0.1),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
}
```

---

## 🏷️ Logo 使用

### Logo 变体

| 变体 | 文件 | 尺寸 | 用途 |
|------|------|------|------|
| 完整 Logo | `cyberpress-logo.svg` | 200x50 | 导航栏 |
| 图标版 | `cyberpress-icon.svg` | 50x50 | Favicon |
| 方形版 | `cyberpress-square.svg` | 100x100 | 社交媒体 |

### 使用方式

```tsx
// 完整 Logo
<img src="/assets/logo/cyberpress-logo.svg" alt="CyberPress" />

// 图标版
<img src="/assets/logo/cyberpress-icon.svg" alt="CyberPress" width="50" />

// 组件方式
import { Logo } from '@/components/icons';
<Logo size={40} />
```

---

## 🎯 最佳实践

### ✅ 推荐

1. **统一尺寸**
   ```tsx
   // 使用标准尺寸
   <Icon size={24} />
   <Icon size={32} />
   <Icon size={48} />
   ```

2. **语义化颜色**
   ```tsx
   // 根据功能选择颜色
   <CheckIcon variant="green" />     // 成功
   <WarningIcon variant="yellow" />  // 警告
   <ErrorIcon variant="pink" />      // 错误
   <TrophyIcon variant="yellow" />   // 奖励
   ```

3. **可访问性**
   ```tsx
   // 添加 aria-label
   <SearchIcon aria-label="搜索" />
   ```

4. **性能优化**
   ```tsx
   // 按需导入
   import { SearchIcon } from '@/components/icons';
   ```

### ❌ 避免

1. **不规范尺寸**
   ```tsx
   // 避免
   <Icon size={27} />
   ```

2. **颜色冲突**
   ```tsx
   // 避免
   <ErrorIcon variant="green" />
   ```

3. **过度动画**
   ```tsx
   // 避免
   <div>
     <LoadingIcon animated={true} />
     <RocketIcon animated={true} />
     <SparkleIcon animated={true} />
   </div>
   ```

4. **全量导入**
   ```tsx
   // 避免
   import * as Icons from '@/components/icons';
   ```

---

## 📊 快速参考

### 常用图标组合

```tsx
// 导航栏
<HomeIcon />, <BlogIcon />, <PortfolioIcon />, <AboutIcon />

// 社交链接
<GitHubIcon />, <TwitterIcon />, <LinkedInIcon />, <DiscordIcon />

// 操作按钮
<DownloadIcon />, <ShareIcon />, <EditIcon />, <TrashIcon />

// 状态指示
<OnlineIcon />, <OfflineIcon />, <SyncIcon />, <LoadingIcon />

// 装饰元素
<TrophyIcon />, <MedalIcon />, <GiftIcon />, <RocketIcon />
```

### 常用颜色组合

```css
/* 主色调 */
--cyber-cyan: #00f0ff;
--cyber-purple: #9d00ff;

/* 渐变 */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 发光 */
box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
```

---

## 📚 相关文档

- [图标完整索引](../components/icons/ICON_COMPLETE_INDEX.md)
- [配色系统](../components/graphics/PALETTE_SYSTEM.md)
- [图标清单 v3.0](../docs/ICON_MANIFEST_V3.md)
- [配色参考](../docs/COLOR_REFERENCE.md)

---

**最后更新**: 2026-03-07
**版本**: 1.0.0
**设计团队**: CyberPress AI Design Team
