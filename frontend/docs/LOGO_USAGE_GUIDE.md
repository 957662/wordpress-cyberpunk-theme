# CyberPress Logo 使用指南

> 📅 创建时间: 2026-03-03
> 🎨 设计团队: CyberPress AI Design Team
> 📦 版本: v3.0

## 📋 目录

1. [Logo 系统概述](#logo-系统概述)
2. [Logo 变体](#logo-变体)
3. [使用场景](#使用场景)
4. [尺寸规范](#尺寸规范)
5. [颜色方案](#颜色方案)
6. [动画效果](#动画效果)
7. [最佳实践](#最佳实践)
8. [文件下载](#文件下载)

---

## 🎯 Logo 系统概述

### 设计理念

CyberPress Logo 采用赛博朋克美学设计，融合了以下元素：

- **六边形** - 科技感和未来感
- **电路纹理** - 数字化和连接性
- **霓虹渐变** - 赛博朋克经典色彩
- **几何对称** - 平衡与秩序

### 核心元素

```
┌─────────────────────────────────┐
│                                 │
│     ╭─────╮                    │
│    ╭╯     ╰╮   CYBER          │
│   ╭╯   ●   ╰╮  PRESS          │
│  ╭╯    │    ╰╮  │             │
│  ╰╮         ╭╯  │             │
│   ╰╮_______╭╯   ▼             │
│     ╰─────╯                    │
│                                 │
│  六边形图标 + 文字标识           │
└─────────────────────────────────┘
```

---

## 📦 Logo 变体

### 1. MainLogo (主 Logo)

**用途**: 页头、首页横幅、品牌展示

```tsx
import { MainLogo } from '@/components/graphics/Logos';

<MainLogo width={200} />
```

**规格**:
- 默认尺寸: 200x60px
- 宽高比: 10:3
- 包含图标和文字
- 支持响应式缩放

**示例**:
```tsx
// 标准用法
<MainLogo width={200} />

// 响应式用法
<MainLogo width={200} className="hidden md:block" />
<MainLogo width={150} className="md:hidden" />

// 点击跳转首页
<MainLogo width={200} onClick={() => router.push('/')} />
```

### 2. SquareLogo (方形 Logo)

**用途**: Favicon、应用图标、社交媒体头像

```tsx
import { SquareLogo } from '@/components/graphics/Logos';

<SquareLogo size={64} />
```

**规格**:
- 默认尺寸: 64x64px
- 宽高比: 1:1
- 仅包含图标部分
- 更多装饰细节

**示例**:
```tsx
// Favicon 大小
<SquareLogo size={32} />

// 头像大小
<SquareLogo size={64} />

// 大图标
<SquareLogo size={128} animated={true} />
```

### 3. FaviconLogo (Favicon)

**用途**: 浏览器标签页图标、书签图标

```tsx
import { FaviconLogo } from '@/components/graphics/Logos';

<FaviconLogo size={32} />
```

**规格**:
- 标准尺寸: 32x32px
- 宽高比: 1:1
- 简化设计
- 小尺寸清晰可见

**示例**:
```tsx
// 浏览器标签页
<link rel="icon" href="/logo-favicon.svg" />

// React 组件
<FaviconLogo size={32} />
```

### 4. MinimalLogo (极简 Logo)

**用途**: 简洁场景、单色打印、水印

```tsx
import { MinimalLogo } from '@/components/graphics/Logos';

<MinimalLogo width={100} />
```

**规格**:
- 默认尺寸: 100x100px
- 宽高比: 1:1
- 单色设计
- 可自定义颜色

**示例**:
```tsx
// 默认霓虹青
<MinimalLogo width={100} />

// 自定义颜色
<MinimalLogo width={100} color="#ffffff" />

// 半透明水印
<MinimalLogo width={200} className="opacity-10" />
```

### 5. TextLogo (文字 Logo)

**用途**: 仅需要文字的场景、配合其他图标使用

```tsx
import { TextLogo } from '@/components/graphics/Logos';

<TextLogo fontSize={24} />
```

**规格**:
- 自适应宽度
- 高度基于字体大小
- 仅包含文字
- 无图标元素

**示例**:
```tsx
// 标准大小
<TextLogo fontSize={24} />

// 大标题
<TextLogo fontSize={48} animated={true} />

// 自定义颜色
<TextLogo fontSize={32} color="#00f0ff" />
```

### 6. WatermarkLogo (水印 Logo)

**用途**: 页面背景、幻灯片水印、版权标识

```tsx
import { WatermarkLogo } from '@/components/graphics/Logos';

<WatermarkLogo width={300} />
```

**规格**:
- 默认尺寸: 200x60px
- 宽高比: 10:3
- 半透明设计
- 固定透明度

**示例**:
```tsx
// 页面背景水印
<div className="relative">
  <WatermarkLogo
    width={400}
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
  />
  <main>内容</main>
</div>
```

### 7. AnimatedLogo (动画 Logo)

**用途**: 加载页面、启动画面、动态展示

```tsx
import { AnimatedLogo } from '@/components/graphics/Logos';

<AnimatedLogo width={100} />
```

**规格**:
- 默认尺寸: 100x100px
- 宽高比: 1:1
- 内置 SVG 动画
- 自动播放

**动画效果**:
- 颜色渐变循环
- 脉冲呼吸效果
- 外圈扩散动画

**示例**:
```tsx
// 加载页面
<div className="flex items-center justify-center min-h-screen">
  <AnimatedLogo width={150} />
  <p className="ml-4">加载中...</p>
</div>
```

---

## 🎯 使用场景

### 网站页头

```tsx
import { MainLogo } from '@/components/graphics/Logos';

function Header() {
  return (
    <header className="bg-cyber-dark border-b border-cyber-border">
      <div className="container mx-auto px-4 py-4">
        <Link href="/">
          <MainLogo width={180} />
        </Link>
      </div>
    </header>
  );
}
```

### 移动端导航

```tsx
import { SquareLogo } from '@/components/graphics/Logos';

function MobileNav() {
  return (
    <nav className="md:hidden">
      <Link href="/">
        <SquareLogo size={40} />
      </Link>
    </nav>
  );
}
```

### 页脚

```tsx
import { MinimalLogo } from '@/components/graphics/Logos';

function Footer() {
  return (
    <footer className="bg-cyber-darker py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-4">
          <MinimalLogo width={120} color="#e0e0e0" />
        </div>
        <p className="text-center text-sm text-cyber-gray-200">
          © 2026 CyberPress Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

### 加载页面

```tsx
import { AnimatedLogo } from '@/components/graphics/Logos';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-cyber-dark flex items-center justify-center">
      <div className="text-center">
        <AnimatedLogo width={120} />
        <p className="mt-4 text-cyber-cyan animate-pulse">加载中...</p>
      </div>
    </div>
  );
}
```

### Favicon 设置

```tsx
// app/layout.tsx
export const metadata = {
  icons: {
    icon: '/logo-favicon.svg',
    apple: '/logo-icon.svg',
  },
};
```

### 社交媒体分享

```tsx
import { SquareLogo } from '@/components/graphics/Logos';

function SocialShare() {
  return (
    <div className="flex items-center gap-4 p-4 bg-cyber-card rounded-lg">
      <SquareLogo size={48} />
      <div>
        <h3 className="font-bold">CyberPress</h3>
        <p className="text-sm text-cyber-gray-200">赛博朋克风格博客平台</p>
      </div>
    </div>
  );
}
```

---

## 📐 尺寸规范

### 推荐尺寸

| 场景 | Logo 变体 | 尺寸 | 备注 |
|------|-----------|------|------|
| 网站页头 | MainLogo | 150-200px | 标准宽度 |
| 移动端页头 | SquareLogo | 40-48px | 紧凑显示 |
| Favicon | FaviconLogo | 32x32px | 浏览器图标 |
| iOS 图标 | SquareLogo | 180x180px | 应用图标 |
| Android 图标 | SquareLogo | 192x192px | 应用图标 |
| 社交头像 | SquareLogo | 400x400px | 高清头像 |
| 打印文档 | MinimalLogo | 100-150px | 单色打印 |
| 幻灯片 | MainLogo | 300-400px | 大屏幕 |
| 水印 | WatermarkLogo | 200-400px | 半透明 |

### 响应式尺寸

```tsx
// 桌面端
<MainLogo width={200} className="hidden lg:block" />

// 平板端
<MainLogo width={160} className="hidden md:block lg:hidden" />

// 移动端
<SquareLogo size={40} className="md:hidden" />
```

---

## 🎨 颜色方案

### 默认配色

Logo 使用赛博朋克主题的霓虹渐变：

```
霓虹青 → 赛博紫 → 激光粉
#00f0ff → #9d00ff → #ff0080
```

### 单色变体

```tsx
// 白色版本（深色背景）
<MinimalLogo width={100} color="#ffffff" />

// 黑色版本（浅色背景）
<MinimalLogo width={100} color="#0a0a0f" />

// 自定义颜色
<MinimalLogo width={100} color="#your-color" />
```

### 背景适配

| 背景色 | 推荐 Logo 变体 | 颜色设置 |
|--------|---------------|----------|
| 深色 (#0a0a0f) | MainLogo / SquareLogo | 默认 |
| 浅色 (#f0f0f5) | MinimalLogo | color="#0a0a0f" |
| 渐变背景 | SquareLogo (animated) | 默认 |
| 图片背景 | WatermarkLogo | 默认 |

---

## ⚡ 动画效果

### 启用动画

```tsx
// 所有 Logo 都支持 animated 属性
<MainLogo width={200} animated={true} />
<SquareLogo size={64} animated={true} />
<TextLogo fontSize={32} animated={true} />
```

### 动画类型

1. **发光脉冲** - 主 Logo 和方形 Logo
2. **颜色渐变** - 动画 Logo
3. **呼吸效果** - 文字 Logo
4. **旋转脉冲** - 方形 Logo

### 性能考虑

```tsx
// 仅在需要时启用动画
<MainLogo width={200} animated={isHovered} />

// 使用 CSS 减少重绘
<MainLogo
  width={200}
  className="will-change-transform"
  animated={true}
/>
```

---

## ✅ 最佳实践

### ✅ 推荐做法

```tsx
// 1. 使用语义化的 alt 文本
<img src="/logo.svg" alt="CyberPress Logo" />

// 2. 响应式尺寸
<MainLogo width={200} className="w-full max-w-[200px]" />

// 3. 保持最小尺寸
<SquareLogo size={32} className="min-w-[32px]" />

// 4. 添加过渡效果
<MainLogo
  width={200}
  className="transition-opacity hover:opacity-80"
/>

// 5. 使用链接包裹
<Link href="/">
  <MainLogo width={200} />
</Link>
```

### ❌ 避免的做法

```tsx
// 1. 不要拉伸变形
<MainLogo width={200} height={100} />  // ❌

// 2. 不要使用过小尺寸
<SquareLogo size={16} />  // ❌ 太小

// 3. 不要过度使用动画
<MainLogo animated={true} />  // ❌ 页头不需要动画

// 4. 不要忽略可访问性
<MainLogo />  // ❌ 缺少 alt

// 5. 不要随意修改宽高比
<SquareLogo width={100} height={50} />  // ❌
```

---

## 📥 文件下载

### 静态文件

所有静态 Logo 文件位于 `/public/` 目录：

```
public/
├── logo.svg              # 主 Logo
├── logo-main.svg         # 完整 Logo
├── logo-square.svg       # 方形 Logo
├── logo-icon.svg         # 图标版
├── logo-mark.svg         # 标志
└── logo-favicon.svg      # Favicon
```

### 文件格式

| 格式 | 用途 | 优点 | 缺点 |
|------|------|------|------|
| SVG | Web、打印 | 矢量、可缩放 | 文件较大 |
| PNG | 兼容性 | 广泛支持 | 不可缩放 |
| ICO | Windows Favicon | 系统原生 | 旧格式 |
| WebP | 现代 Web | 高压缩 | 兼容性 |

### 导出设置

```tsx
// SVG 优化
// 使用 SVGO 或类似工具优化
svgo logo.svg -o logo-optimized.svg

// PNG 导出
// 2x 分辨率用于 Retina 屏幕
// 1x 分辨率用于标准屏幕

// Favicon 生成
// 使用在线工具生成多尺寸 ICO
// https://favicon.io/
```

---

## 🔧 高级用法

### Logo 组合

```tsx
function LogoWithText() {
  return (
    <div className="flex items-center gap-4">
      <SquareLogo size={48} />
      <div>
        <TextLogo fontSize={24} />
        <p className="text-xs text-cyber-gray-200">PLATFORM</p>
      </div>
    </div>
  );
}
```

### 悬停效果

```tsx
function HoverLogo() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <MainLogo
        width={200}
        animated={isHovered}
        className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-80'}`}
      />
    </Link>
  );
}
```

### 主题切换

```tsx
function ThemedLogo({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <MinimalLogo
      width={150}
      color={theme === 'dark' ? '#ffffff' : '#0a0a0f'}
    />
  );
}
```

---

## 🌐 国际化

### 多语言 Logo 文字

```tsx
function LocalizedLogo({ locale }: { locale: string }) {
  const translations = {
    en: { main: 'CYBER', sub: 'PRESS' },
    zh: { main: '赛博', sub: '科技' },
    ja: { main: 'サイバー', sub: 'プレス' },
  };

  const { main, sub } = translations[locale as keyof typeof translations];

  return (
    <svg width={200} height={60} viewBox="0 0 200 60">
      <text x="60" y="32" fontSize="20" fill="url(#gradient)">
        {main}
      </text>
      <text x="60" y="50" fontSize="14" fill="#00f0ff">
        {sub}
      </text>
    </svg>
  );
}
```

---

## 📚 相关资源

- [完整图形素材清单](./GRAPHICS_ASSETS.md)
- [图标使用指南](./ICON_USAGE_GUIDE.md)
- [配色参考](../public/COLOR_PALETTE.md)
- [品牌指南](./BRAND_GUIDELINES.md)

---

## 🐛 故障排除

### Logo 不显示

```tsx
// 检查导入路径
import { MainLogo } from '@/components/graphics/Logos';  // ✅
import { MainLogo } from './graphics/Logos';  // ❌

// 检查文件存在
// 确保 /public/logo.svg 存在
```

### 尺寸不正确

```tsx
// 使用 width 而不是 width/height
<MainLogo width={200} />  // ✅
<MainLogo width={200} height={100} />  // ❌

// SquareLogo 使用 size
<SquareLogo size={64} />  // ✅
<SquareLogo width={64} />  // ❌
```

### 动画不生效

```tsx
// 确保 animated 属性为 true
<MainLogo width={200} animated={true} />  // ✅
<MainLogo width={200} animated="true" />  // ❌ 字符串

// 检查浏览器支持
// SVG 动画需要现代浏览器
```

---

**创建时间**: 2026-03-03
**设计团队**: CyberPress AI Design Team
**项目**: CyberPress Platform
**主题**: Cyberpunk Aesthetics
