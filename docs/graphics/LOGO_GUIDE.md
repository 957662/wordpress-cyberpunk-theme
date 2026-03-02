# CyberPress Platform - Logo 使用指南

## 📋 Logo 概览

CyberPress 平台拥有完整的 Logo 系统，适用于不同场景和尺寸需求。

## 🎨 Logo 变体

### 1. 主 Logo (Main Logo)
**文件**: `logo-main.svg`

- **尺寸**: 200x200px
- **格式**: SVG
- **用途**: 品牌主页、关于页面、页脚
- **特点**: 六边形设计，中心 C 字母，霓虹发光效果

### 2. 横版 Logo (Horizontal Logo)
**文件**: `logo.svg`

- **尺寸**: 200x60px
- **格式**: SVG
- **用途**: 导航栏、页眉、横幅
- **特点**: 横向文字布局，带装饰元素

### 3. 图标 Logo (Icon Logo)
**文件**: `logo-icon.svg`

- **尺寸**: 200x200px
- **格式**: SVG
- **用途**: 应用图标、Favicon、小尺寸显示
- **特点**: 简化的六边形图标

### 4. 方形 Logo (Square Logo)
**文件**: `logo-square.svg`

- **尺寸**: 200x200px
- **格式**: SVG
- **用途**: 社交媒体头像、应用图标
- **特点**: 正方形比例，适合头像

### 5. Favicon
**文件**: `logo-favicon.svg`

- **尺寸**: 32x32px
- **格式**: SVG
- **用途**: 浏览器标签页图标
- **特点**: 极简设计，小尺寸清晰

### 6. OG Image
**文件**: `og-image.svg`

- **尺寸**: 1200x630px
- **格式**: SVG
- **用途**: 社交媒体分享预览
- **特点**: 包含完整品牌信息和视觉效果

## 🎯 使用场景

### 导航栏
```tsx
import Image from 'next/image';

function Navbar() {
  return (
    <nav className="flex items-center gap-4">
      <Image
        src="/logo.svg"
        alt="CyberPress Logo"
        width={120}
        height={36}
        className="h-9 w-auto"
      />
      {/* 导航链接 */}
    </nav>
  );
}
```

### 页脚
```tsx
function Footer() {
  return (
    <footer className="text-center">
      <Image
        src="/logo-main.svg"
        alt="CyberPress Logo"
        width={80}
        height={80}
        className="mx-auto mb-4"
      />
      <p className="text-cyber-cyan">CYBERPRESS</p>
    </footer>
  );
}
```

### Favicon 设置
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  icons: {
    icon: '/logo-favicon.svg',
    apple: '/logo-favicon.svg',
  },
};
```

### OG Image 设置
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'CyberPress Platform',
      },
    ],
  },
};
```

## 📐 尺寸规范

### 最小尺寸
- **Favicon**: 16x16px (最低), 32x32px (推荐)
- **应用图标**: 48x48px
- **小图标**: 64x64px

### 标准尺寸
- **小**: 100-150px
- **中**: 150-250px
- **大**: 250-400px

### 大尺寸
- **横幅**: 400-600px 宽度
- **Hero**: 600-800px 宽度
- **印刷**: 800px 以上

## 🎨 颜色变体

### 深色背景（默认）
```tsx
// 在深色背景上使用原始颜色
<Image src="/logo.svg" alt="Logo" className="brightness-100" />
```

### 浅色背景
```tsx
// 在浅色背景上增加对比度
<Image src="/logo.svg" alt="Logo" className="brightness-75 contrast-125" />
```

### 单色版本
如需单色版本，可以通过 CSS 滤镜实现：

```tsx
// 纯青色
<Image src="/logo.svg" alt="Logo" className="filter saturate-0 brightness-200 hue-rotate-180" />

// 纯紫色
<Image src="/logo.svg" alt="Logo" className="filter saturate-0 brightness-150 hue-rotate-90" />
```

## 🔧 技术实现

### Next.js Image 组件
```tsx
import Image from 'next/image';

// 基础使用
<Image
  src="/logo-main.svg"
  alt="CyberPress"
  width={200}
  height={200}
  priority // 首屏加载
/>

// 响应式
<Image
  src="/logo.svg"
  alt="CyberPress"
  width={200}
  height={60}
  className="w-24 md:w-32 lg:w-40 h-auto"
/>
```

### 直接 SVG 使用
```tsx
function LogoInline() {
  return (
    <svg viewBox="0 0 200 200" className="w-12 h-12">
      {/* SVG 内容 */}
    </svg>
  );
}
```

### CSS 背景
```css
.logo-bg {
  background-image: url('/logo-main.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
```

## 📱 响应式使用

### 移动端
```tsx
<Image
  src="/logo-icon.svg"
  alt="CyberPress"
  width={40}
  height={40}
  className="md:hidden"
/>
```

### 平板/桌面
```tsx
<Image
  src="/logo.svg"
  alt="CyberPress"
  width={120}
  height={36}
  className="hidden md:block"
/>
```

## ⚠️ 使用注意事项

### DO - 推荐 ✅
- 使用 SVG 格式以保持清晰度
- 保持适当的留白空间
- 在深色背景上使用
- 确保最小尺寸要求
- 添加 `alt` 属性

### DON'T - 避免 ❌
- 不要拉伸或扭曲 Logo
- 不要改变 Logo 的颜色（除非使用官方变体）
- 不要在过于复杂的背景上使用
- 不要添加额外的效果或装饰
- 不要遮挡 Logo 任何部分

## 🔗 安全区域

Logo 周围应保留至少 **Logo 高度的 25%** 作为安全区域：

```
┌────────────────────┐
│  ← 安全区域 →      │
│   ┌──────────┐    │
│   │          │    │
│   │   Logo   │    │
│   │          │    │
│   └──────────┘    │
│  ← 安全区域 →      │
└────────────────────┘
```

## 🎯 动画效果

### 悬停效果
```tsx
<Image
  src="/logo.svg"
  alt="CyberPress"
  className="transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]"
/>
```

### 加载动画
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  <Image src="/logo-main.svg" alt="CyberPress" />
</motion.div>
```

## 📦 导出格式

虽然项目使用 SVG，但某些场景可能需要其他格式：

### PNG
- **用途**: 不支持 SVG 的平台
- **尺寸**: 导出 2x 和 3x 版本
- **背景**: 透明背景

### ICO
- **用途**: Windows Favicon
- **尺寸**: 16x16, 32x32, 48x48

### WebP
- **用途**: 优化加载
- **优势**: 文件小，质量好

## 🔍 质量检查

使用 Logo 前检查：
- ✅ 尺寸是否正确
- ✅ 颜色是否准确
- ✅ 对比度是否足够
- ✅ 安全区域是否保留
- ✅ 文件大小是否合理

---

**最后更新**: 2026-03-03
**维护者**: CyberPress 设计团队
