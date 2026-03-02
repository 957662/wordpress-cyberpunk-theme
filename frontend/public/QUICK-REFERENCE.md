# 🎨 CyberPress 图形资源快速参考

## 🚀 快速开始

### 使用图标
```tsx
// 方法1: 直接使用 SVG
<Image src="/icons/cyber-github.svg" width={24} height={24} alt="GitHub" />

// 方法2: 使用组件
import { CyberIcon } from '@/components/graphics';
<CyberIcon name="github" size={24} glow={true} />
```

### 使用背景
```css
/* CSS 方式 */
background: url('/patterns/cyber-grid.svg');

/* 组件方式 */
<CyberBackground pattern="grid" opacity={0.3} />
```

---

## 🎨 常用图标

### 社交媒体
- `cyber-github.svg` - GitHub
- `cyber-twitter.svg` - Twitter/X
- `cyber-linkedin.svg` - LinkedIn
- `cyber-email.svg` - Email
- `cyber-rss.svg` - RSS

### 导航
- `home.svg` - 首页
- `blog.svg` - 博客
- `portfolio.svg` - 作品集
- `about.svg` - 关于
- `search.svg` - 搜索
- `menu.svg` - 菜单

### 操作
- `cyber-edit.svg` - 编辑
- `cyber-trash.svg` - 删除
- `cyber-download.svg` - 下载
- `cyber-upload.svg` - 上传
- `cyber-copy.svg` - 复制
- `cyber-refresh.svg` - 刷新

### 状态
- `cyber-check.svg` - 成功
- `cyber-alert.svg` - 警告
- `cyber-close.svg` - 关闭
- `cyber-lock.svg` - 锁定
- `cyber-unlock.svg` - 解锁

### 技术
- `cyber-cpu.svg` - CPU
- `cyber-terminal.svg` - 终端
- `cyber-database.svg` - 数据库
- `cyber-code.svg` - 代码
- `cyber-git-branch.svg` - Git

---

## 🌈 颜色主题

```css
--neon-cyan:      #00f0ff;
--cyber-purple:   #9d00ff;
--laser-pink:     #ff0080;
--voltage-yellow: #f0ff00;
--deep-black:     #0a0a0f;
```

---

## 📐 常用尺寸

```css
/* 图标 */
16px  - 小图标
24px  - 标准图标
32px  - 中等图标
48px  - 大图标
64px  - 超大图标

/* Logo */
64px  - 小 Logo
128px - 中 Logo
200px - 大 Logo
```

---

## ✨ 动画效果

```css
.animate-pulse   /* 脉冲 */
.animate-spin    /* 旋转 */
.animate-bounce  /* 弹跳 */
```

---

## 🎯 组件 Props

### CyberIcon
```tsx
interface CyberIconProps {
  name: string;           // 图标名称
  size?: number;          // 尺寸 (默认: 24)
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  glow?: boolean;         // 发光效果
  animation?: 'none' | 'pulse' | 'spin' | 'bounce';
  className?: string;
}
```

### CyberLogo
```tsx
interface CyberLogoProps {
  variant?: 'full' | 'icon' | 'icon-only' | 'favicon';
  size?: number;
  glow?: boolean;
  animation?: 'none' | 'pulse' | 'spin';
}
```

### CyberBackground
```tsx
interface CyberBackgroundProps {
  pattern?: 'grid' | 'hexgrid' | 'circuit' | 'matrix' | 'scanlines';
  opacity?: number;
  fixed?: boolean;
  animated?: boolean;
}
```

### CyberIllustration
```tsx
interface CyberIllustrationProps {
  name: 'server' | 'network' | 'coding' | 'shield';
  width?: number;
  height?: number;
  animated?: boolean;
}
```

---

## 📁 文件路径

```
/icons/cyber-*.svg              # 图标
/assets/logo/cyberpress-*.svg   # Logo
/illustrations/cyber-*.svg      # 插画
/patterns/cyber-*.svg           # 背景
/decorations/cyber-*.svg        # 装饰
```

---

## 🔧 常用代码片段

### 发光按钮
```tsx
<button className="cyber-button">
  <CyberIcon name="rocket" size={20} glow={true} />
  Launch
</button>
```

### 赛博卡片
```tsx
<div className="cyber-card">
  <CyberDecoration type="corner" position="top-left" />
  <h3>Cyber Card</h3>
</div>
```

### 全息背景
```tsx
<div className="relative">
  <CyberBackground pattern="holographic" opacity={0.3} />
  <Content />
</div>
```

---

## 📚 完整文档

- [ICONS-CATALOG.md](./ICONS-CATALOG.md) - 图标目录
- [GRAPHICS-GUIDE.md](./GRAPHICS-GUIDE.md) - 设计指南
- [DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md) - 设计系统

---

**版本**: 1.0.0 | **更新**: 2026-03-03
