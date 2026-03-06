# CyberPress Logo Variants Guide - Logo 变体使用指南

## 📋 Logo 总览

CyberPress Platform 提供了完整的 Logo 系统，包含多个变体以适应不同的使用场景。

---

## 🎨 Logo 变体清单

### 1. Main Logo (主Logo)
**文件**: `logo-main.svg`
**尺寸**: 200x60
**格式**: SVG
**用途**: 导航栏、页眉、主要品牌展示

**特点**:
- 六边形图标 + "CyberPress" 文字
- 霓虹青到赛博紫渐变
- 发光效果
- 完整品牌标识

**使用场景**:
```tsx
// 导航栏
<Image
  src="/logo-main.svg"
  alt="CyberPress"
  width={200}
  height={60}
  priority
/>
```

---

### 2. Icon Only (仅图标)
**文件**: `logo-icon.svg`
**尺寸**: 100x100
**格式**: SVG
**用途**: 应用图标、独立展示、favicon

**特点**:
- 纯六边形图标
- 无文字
- 科技感装饰线
- 适合小尺寸

**使用场景**:
```tsx
// PWA 图标
<Image
  src="/logo-icon.svg"
  alt="CyberPress"
  width={100}
  height={100}
/>
```

---

### 3. Square Logo (方形Logo)
**文件**: `logo-square.svg`
**尺寸**: 200x200
**格式**: SVG
**用途**: 社交媒体、应用商店、正方形展示

**特点**:
- 图标 + 文字组合
- 正方形布局
- 渐变背景
- 社交媒体友好

**使用场景**:
```tsx
// 社交媒体头像
<Image
  src="/logo-square.svg"
  alt="CyberPress"
  width={200}
  height={200}
/>
```

---

### 4. Favicon (网站图标)
**文件**: `logo-favicon.svg`
**尺寸**: 32x32
**格式**: SVG
**用途**: 浏览器标签页图标

**特点**:
- 简化版六边形
- 高对比度
- 小尺寸优化

**使用场景**:
```html
<!-- HTML Head -->
<link rel="icon" href="/logo-favicon.svg" type="image/svg+xml" />
```

---

### 5. Fallback Favicon (ICO格式)
**文件**: `favicon.ico`
**尺寸**: 多尺寸 (16, 32, 48)
**格式**: ICO
**用途**: 兼容旧版浏览器

**使用场景**:
```html
<!-- HTML Head -->
<link rel="icon" href="/favicon.ico" sizes="32x32" />
```

---

## 🎯 使用场景指南

### 网站头部 (Header)
```tsx
<Image
  src="/logo-main.svg"
  alt="CyberPress"
  width={200}
  height={60}
  priority
  className="hover:opacity-80 transition-opacity"
/>
```

### 移动端导航 (Mobile Nav)
```tsx
<Image
  src="/logo-icon.svg"
  alt="CyberPress"
  width={40}
  height={40}
/>
```

### 页脚 (Footer)
```tsx
<Image
  src="/logo-icon.svg"
  alt="CyberPress"
  width={60}
  height={60}
  className="opacity-60"
/>
```

### 加载页面 (Loading Screen)
```tsx
<div className="flex items-center justify-center">
  <Image
    src="/logo-icon.svg"
    alt="CyberPress"
    width={120}
    height={120}
    className="animate-pulse"
  />
</div>
```

### PWA 应用图标
```tsx
// manifest.json
{
  "icons": [
    {
      "src": "/logo-icon.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

---

## 🎨 颜色变体

### 深色背景 (Dark Background)
默认 Logo 专为深色背景优化：
```css
background: #0a0a0f;  /* 深空黑 */
```

### 浅色背景 (Light Background)
如需在浅色背景使用，添加反色滤镜：
```css
.logo-light {
  filter: invert(1) hue-rotate(180deg);
}
```

### 自定义颜色
通过 CSS 变量定制：
```css
.logo-custom {
  filter: brightness(0) saturate(100%) invert(42%) sepia(89%) saturate(3062%) hue-rotate(180deg) brightness(101%) contrast(101%);
}
```

---

## 📐 尺寸规范

### 标准尺寸
| 场景 | 宽度 | 高度 | 文件 |
|------|------|------|------|
| 导航栏 | 200px | 60px | logo-main.svg |
| 页眉 | 250px | 75px | logo-main.svg |
| 移动端 | 40px | 40px | logo-icon.svg |
| Footer | 60px | 60px | logo-icon.svg |
| 社交媒体 | 200px | 200px | logo-square.svg |
| Favicon | 32px | 32px | logo-favicon.svg |

### 响应式使用
```tsx
const logoSize = isMobile ? 150 : 200;

<Image
  src="/logo-main.svg"
  alt="CyberPress"
  width={logoSize}
  height={logoSize * 0.3}
/>
```

---

## ⚡ 性能优化

### Next.js 优化
```tsx
// 优先加载关键 Logo
<Image
  src="/logo-main.svg"
  alt="CyberPress"
  width={200}
  height={60}
  priority  // 关键资源优先加载
/>

// 懒加载非关键 Logo
<Image
  src="/logo-icon.svg"
  alt="CyberPress"
  width={100}
  height={100}
  loading="lazy"
/>
```

### SVG 优化
- ✅ 使用 `viewBox` 而非固定尺寸
- ✅ 移除不必要的元数据
- ✅ 简化路径数据
- ✅ 使用 `currentColor` 允许颜色定制

---

## 🎭 动画效果

### 悬停效果
```css
.logo-hover {
  transition: all 0.3s ease;
}

.logo-hover:hover {
  filter: drop-shadow(0 0 10px #00f0ff);
  transform: scale(1.02);
}
```

### 加载动画
```tsx
<div className="flex items-center justify-center min-h-screen">
  <Image
    src="/logo-icon.svg"
    alt="CyberPress"
    width={80}
    height={80}
    className="animate-bounce"
  />
</div>
```

### 发光动画
```css
@keyframes logo-glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px #00f0ff);
  }
  50% {
    filter: drop-shadow(0 0 20px #00f0ff) drop-shadow(0 0 30px #9d00ff);
  }
}

.logo-glow {
  animation: logo-glow 3s ease-in-out infinite;
}
```

---

## 📱 平台特定要求

### iOS Web App
```html
<link rel="apple-touch-icon" href="/logo-icon.svg" />
```

### Android Chrome
```html
<link rel="icon" href="/logo-icon.svg" sizes="192x192" />
```

### Windows Pinned Site
```html
<meta name="msapplication-TileImage" content="/logo-icon.svg" />
```

### Open Graph (社交媒体分享)
```tsx
// layout.tsx
export const metadata = {
  openGraph: {
    images: [
      {
        url: '/logo-square.svg',
        width: 200,
        height: 200,
      },
    ],
  },
};
```

---

## 🔧 高级定制

### CSS 滤镜组合
```css
/* 变暗 */
.logo-darken { filter: brightness(0.7); }

/* 变亮 */
.logo-lighten { filter: brightness(1.3); }

/* 反色 */
.logo-invert { filter: invert(1); }

/* 灰度 */
.logo-grayscale { filter: grayscale(1); }

/* 怀旧 */
.logo-sepia { filter: sepia(1); }

/* 模糊 */
.logo-blur { filter: blur(2px); }
```

### 组件封装
```tsx
// components/Logo.tsx
interface LogoProps {
  variant?: 'main' | 'icon' | 'square';
  size?: number;
  className?: string;
}

export const Logo = ({ variant = 'main', size = 200, className = '' }: LogoProps) => {
  const src = `/logo-${variant}.svg`;
  const height = variant === 'main' ? size * 0.3 : size;

  return (
    <Image
      src={src}
      alt="CyberPress"
      width={size}
      height={height}
      className={className}
    />
  );
};
```

---

## 📋 检查清单

使用 Logo 前请确认：
- [ ] 选择正确的变体（main/icon/square）
- [ ] 尺寸适配当前布局
- [ ] 添加描述性 alt 文本
- [ ] 考虑响应式需求
- [ ] 优化加载性能
- [ ] 测试深色/浅色模式
- [ ] 添加适当的动画效果
- [ ] 确保可访问性

---

## 🚀 最佳实践

### ✅ 推荐做法
1. **一致性**: 在整个网站使用相同的 Logo 变体
2. **性能**: 使用 `priority` 加载关键 Logo
3. **可访问性**: 始终提供 `alt` 文本
4. **响应式**: 根据屏幕尺寸调整 Logo 大小
5. **品牌**: 保持足够的留白空间

### ❌ 避免做法
1. 不要拉伸或扭曲 Logo
2. 不要修改 Logo 的颜色（除非必要）
3. 不要使用过大的尺寸
4. 不要在 Logo 周围添加太多装饰
5. 不要在深色和浅色背景混用相同变体

---

## 📚 相关资源

- [图形素材总览](./GRAPHICS_GUIDE.md)
- [配色参考](./COLOR_REFERENCE.md)
- [图标清单](./ICON_MANIFEST.md)
- [图标快速参考](./ICON_QUICK_REFERENCE.md)

---

## 🔄 版本历史

### v1.0 (2026-03-02)
- ✅ 初始 Logo 系统
- ✅ 5 个基本变体
- ✅ 完整的 SVG 优化

### v1.1 (2026-03-06)
- ✅ 添加使用指南
- ✅ 动画效果示例
- ✅ 组件封装示例

---

**维护者**: CyberPress AI Design Team
**最后更新**: 2026-03-06
**主题**: Cyberpunk / Sci-Fi
