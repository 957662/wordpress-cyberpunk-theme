# CyberPress Platform - 图形素材库

## 📁 目录结构

```
frontend/public/graphics/
├── logo-main.svg           # 主 Logo（完整版）
├── logo-icon.svg           # 图标版 Logo
├── logo-square.svg         # 方形 Logo
├── icons/
│   ├── cyber-icons.svg     # 功能图标集合
│   └── social-icons.svg    # 社交媒体图标
├── decorations/
│   ├── cyber-pattern.svg   # 赛博朋克背景图案
│   └── scanlines.svg       # 扫描线效果
└── illustrations/
    ├── blog-hero.svg       # 博客页面插图
    ├── portfolio-hero.svg  # 作品集页面插图
    └── contact-hero.svg    # 联系页面插图
```

## 🎨 配色方案

### 主色调
- **霓虹青** `#00f0ff` - 主要强调色
- **赛博紫** `#9d00ff` - 次要强调色
- **激光粉** `#ff0080` - 警告/强调
- **赛博黄** `#f0ff00` - 高亮
- **赛博绿** `#00ff88` - 成功状态

### 背景色
- **深色背景** `#0a0a0f` - 主背景
- **更深背景** `#050508` - 次背景
- **卡片背景** `#16162a` - 卡片/面板
- **柔和背景** `#1a1a2e` - 次级卡片

### 边框色
- **边框色** `#2a2a4a` - 默认边框
- **边框高亮** `#3a3a6a` - 悬停边框

## 🎯 使用方法

### Logo 使用

```tsx
// 主 Logo
<Image src="/graphics/logo-main.svg" alt="CyberPress" width={400} height={120} />

// 图标版 Logo
<Image src="/graphics/logo-icon.svg" alt="CP" width={100} height={100} />

// 方形 Logo
<Image src="/graphics/logo-square.svg" alt="CyberPress" width={200} height={200} />
```

### SVG 组件内联使用

```tsx
import CyberPattern from '@/public/graphics/decorations/cyber-pattern.svg';

// 直接作为组件使用
<CyberPattern className="w-full h-full" />
```

### 背景图案使用

```css
/* 在 CSS 中引用 */
.cyber-bg {
  background-image: url('/graphics/decorations/cyber-pattern.svg');
  background-size: cover;
}
```

## 🎨 设计规范

### Logo 变体
1. **主 Logo** - 用于网站头部、首页 Hero 区
2. **图标 Logo** - 用于 Favicon、小尺寸显示
3. **方形 Logo** - 用于社交媒体分享、卡片

### 图标系统
- **功能图标** - 导航、操作按钮
- **社交媒体图标** - 社交链接
- 所有图标支持发光效果
- 统一 24x24 基础网格

### 装饰元素
- **背景图案** - 用于页面背景
- **扫描线** - 用于 CRT 效果
- 所有装饰采用低不透明度（0.1-0.3）

### 插画
- **Hero 插画** - 用于页面顶部
- 统一 800x400 尺寸
- 包含动画效果

## ✨ 特效说明

### 发光效果
所有图形都应用了 SVG 滤镜发光：

```xml
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
  <feMerge>
    <feMergeNode in="coloredBlur"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

### 渐变效果
使用线性渐变创建赛博朋克风格：

```xml
<linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%" style="stop-color:#00f0ff"/>
  <stop offset="100%" style="stop-color:#9d00ff"/>
</linearGradient>
```

### 动画效果
部分图形包含 SVG 动画：

```xml
<animateTransform
  attributeName="transform"
  type="rotate"
  from="0" to="360"
  dur="20s"
  repeatCount="indefinite"
/>
```

## 📝 注意事项

1. **尺寸调整** - SVG 可以任意缩放而不失真
2. **颜色定制** - 可以通过 CSS `currentColor` 覆盖颜色
3. **性能优化** - 复杂动画建议在使用时才加载
4. **浏览器兼容** - SVG 效果支持所有现代浏览器

## 🔧 自定义颜色

如需修改图标颜色，可以使用 CSS：

```css
.custom-icon {
  color: #your-color;
  filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.6));
}
```

## 📦 相关文件

- `/frontend/styles/globals.css` - 全局样式定义
- `/frontend/components/graphics/` - React 组件封装
- `/frontend/tailwind.config.js` - Tailwind 颜色配置
