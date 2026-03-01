# CyberPress 图形素材总索引

## 📊 项目概览

CyberPress Platform 采用赛博朋克美学设计，包含完整的图形素材库，支持深色主题和未来科技感视觉效果。

---

## 🎨 设计系统

### 配色方案
- **文档位置**: `/docs/DESIGN-SYSTEM.md`
- **核心颜色**:
  - 深空黑 `#0a0a0f` - 主背景
  - 霓虹青 `#00f0ff` - 主要强调色
  - 赛博紫 `#9d00ff` - 次要强调色
  - 激光粉 `#ff0080` - 警告/特殊强调
  - 电压黄 `#f0ff00` - 高亮/成功状态

### 设计规范
- **字体**: Orbitron (标题), Inter (正文), JetBrains Mono (代码)
- **圆角**: 2px - 24px 系统
- **间距**: 基于 4px 基础单位
- **阴影**: 霓虹发光效果系统

---

## 🖼️ Logo 资源

### 主 Logo
- **文件**: `/frontend/public/logo-main.svg`
- **尺寸**: 400x120
- **用途**: 页面头部、导航栏、品牌展示

### 图标版 Logo
- **文件**: `/frontend/public/logo-favicon.svg`
- **尺寸**: 64x64
- **用途**: 浏览器标签、应用图标、小尺寸展示

### 方形 Logo
- **文件**: `/frontend/public/logo-square.svg`
- **尺寸**: 512x512
- **用途**: 社交媒体头像、PWA 图标、大型展示

### 使用方式
```tsx
<Image src="/logo-main.svg" alt="CyberPress" width={200} height={60} />
<Image src="/logo-favicon.svg" alt="CyberPress Icon" width={64} height={64} />
<Image src="/logo-square.svg" alt="CyberPress Square" width={512} height={512} />
```

---

## 🎯 图标库

### React 组件图标
**位置**: `/frontend/components/icons/`

#### 导航图标
- `MenuIcon` - 菜单/汉堡图标
- `ArrowIcon` - 箭头 (支持方向)
- `SearchIcon` - 搜索图标
- `HomeIcon` - 首页图标 (lucide-react)
- `ChevronDown/Up/Left/Right` - 方向箭头

#### 社交图标
- `GitHubIcon` - GitHub
- `TwitterIcon` - Twitter/X
- `LinkedinIcon` - LinkedIn
- `MailIcon` - 邮件
- `RssIcon` - RSS 订阅

#### 内容图标
- `BlogIcon` - 博客
- `PortfolioIcon` - 作品集
- `CodeIcon` - 代码
- `FileText` - 文件
- `ImageIcon` - 图片

#### UI 元素
- `CalendarIcon` - 日历
- `TagIcon` - 标签
- `StarIcon` - 星标/收藏
- `HeartIcon` - 点赞
- `UserIcon` - 用户
- `SettingsIcon` - 设置

#### 状态图标
- `CheckIcon` - 成功
- `CloseIcon` - 关闭
- `WarningIcon` - 警告
- `ErrorIcon` - 错误
- `InfoIcon` - 信息

#### 主题图标
- `ThemeIcon` - 主题切换
- `SunIcon` - 浅色模式
- `MoonIcon` - 深色模式

#### 操作图标
- `ShareIcon` - 分享
- `CopyIcon` - 复制
- `ExternalLink` - 外部链接
- `Download` - 下载
- `Upload` - 上传
- `RefreshCw` - 刷新

### 纯 SVG 图标
**位置**: `/frontend/public/icons/`

包含所有常用图标的纯 SVG 版本，可直接作为 `<img>` 引用或内联使用。

### 使用方式
```tsx
// React 组件
import { SearchIcon, GitHubIcon, MenuIcon } from '@/components/icons';

<SearchIcon size={24} className="text-cyber-cyan" />

// 纯 SVG
<Image src="/icons/search.svg" alt="Search" width={24} height={24} />

// Lucide React (推荐)
import { Search, Github, Menu } from 'lucide-react';
<Search className="w-6 h-6 text-cyber-cyan" />
```

---

## 🌈 背景图案

### 网格图案
**文件**: `/frontend/public/patterns/grid.svg`
- **用途**: 卡片背景、装饰边框
- **特点**: 赛博朋克风格网格 + 霓虹青色

### 电路图案
**文件**: `/frontend/public/patterns/circuit.svg`
- **用途**: 科技感装饰
- **特点**: 电路板线条设计

### 扫描线
**文件**: `/frontend/public/patterns/scanlines.svg`
- **用途**: CRT 显示器效果
- **特点**: 水平扫描线

### 噪点纹理
**文件**: `/frontend/public/patterns/noise.svg`
- **用途**: 纹理叠加
- **特点**: 随机噪点

### 六边形图案
**文件**: `/frontend/public/patterns/hexagon.svg`
- **用途**: 蜂窝状装饰
- **特点**: 六边形网格

### Matrix 雨效果
**文件**: `/frontend/public/patterns/matrix.svg`
- **用途**: 代码雨背景
- **特点**: Matrix 风格的数字雨

### 全息图案
**文件**: `/frontend/public/patterns/holographic.svg`
- **用途**: 全息投影效果
- **特点**: 彩虹渐变六边形

### 使用方式
```css
.hero-section {
  background-image: url('/patterns/grid.svg');
  background-repeat: repeat;
}

.card {
  background-image: url('/patterns/circuit.svg');
  background-blend-mode: overlay;
}
```

---

## 🎬 背景与特效

### 英雄区域背景
**文件**: `/frontend/public/backgrounds/hero-bg.svg`
- **尺寸**: 1920x1080
- **用途**: 首页 Hero 区域
- **效果**: 发光球体、网格、电路线条、浮动粒子

### 404 错误页背景
**文件**: `/frontend/public/backgrounds/404-bg.svg`
- **尺寸**: 1920x1080
- **用途**: 404 错误页面
- **效果**: 故障艺术、色差、噪点、扫描线

### 加载动画背景
**文件**: `/frontend/public/backgrounds/loading-bg.svg`
- **尺寸**: 400x400
- **用途**: 加载动画
- **效果**: 旋转圆环、轨道粒子、脉冲核心

### 卡片背景
**文件**: `/frontend/public/backgrounds/card-bg.svg`
- **用途**: 卡片组件默认背景
- **效果**: 微妙的渐变和纹理

### 使用方式
```tsx
// Hero 背景
<div className="relative h-screen">
  <Image
    src="/backgrounds/hero-bg.svg"
    alt="Hero Background"
    fill
    className="object-cover"
  />
  <div className="relative z-10">{/* 内容 */}</div>
</div>

// 加载动画
<Image src="/backgrounds/loading-bg.svg" alt="Loading" width={400} height={400} />
```

---

## ✨ 特效组件

### 发光效果
```css
.neon-glow-cyan {
  box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;
  text-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;
}
```

### 故障效果
```css
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

.animate-glitch {
  animation: glitch 0.3s ease-in-out infinite;
}
```

### 全息效果
```css
.holographic {
  background: linear-gradient(135deg,
    rgba(0,240,255,0.1),
    rgba(157,0,255,0.1),
    rgba(255,0,128,0.1));
  border: 1px solid rgba(0,240,255,0.3);
  box-shadow: 0 0 20px rgba(0,240,255,0.2);
}
```

### 扫描线效果
```css
.scanlines::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 240, 255, 0.03) 2px,
    rgba(0, 240, 255, 0.03) 4px
  );
  pointer-events: none;
}
```

---

## 📱 响应式设计

### 断点系统
- `sm`: 640px - 手机横屏
- `md`: 768px - 平板竖屏
- `lg`: 1024px - 平板横屏
- `xl`: 1280px - 桌面
- `2xl`: 1536px - 大屏幕

### 图标尺寸指南
| 环境 | 尺寸 |
|------|------|
| 内联小图标 | 14-16px |
| 标准图标 | 18-20px |
| 导航图标 | 24px |
| 功能展示 | 32-48px |
| 首页展示 | 64px+ |

---

## 🎭 动画系统

### 内置动画类
- `animate-glow` - 发光脉冲
- `animate-flicker` - 闪烁
- `animate-scan` - 扫描线
- `animate-float` - 悬浮
- `animate-pulse-glow` - 脉冲发光
- `animate-glitch` - 故障效果
- `animate-fade-in` - 淡入
- `animate-slide-up` - 上滑
- `animate-slide-down` - 下滑
- `animate-scale-in` - 缩放进入

### 过渡时间
- `fast`: 150ms - 快速交互
- `base`: 200ms - 基础过渡
- `normal`: 300ms - 标准过渡
- `slow`: 500ms - 慢速过渡
- `slower`: 700ms - 更慢过渡

---

## 📦 文件结构

```
frontend/public/
├── logo-main.svg              # 主 Logo
├── logo-favicon.svg           # 图标版 Logo
├── logo-square.svg            # 方形 Logo
├── favicon.ico                # Favicon
│
├── patterns/                  # 背景图案
│   ├── grid.svg              # 网格
│   ├── circuit.svg           # 电路
│   ├── scanlines.svg         # 扫描线
│   ├── noise.svg             # 噪点
│   ├── hexagon.svg           # 六边形
│   ├── matrix.svg            # Matrix 雨
│   └── holographic.svg       # 全息效果
│
├── backgrounds/               # 背景图像
│   ├── hero-bg.svg           # 英雄区背景
│   ├── 404-bg.svg            # 404 页面背景
│   ├── loading-bg.svg        # 加载背景
│   └── card-bg.svg           # 卡片背景
│
└── icons/                     # 纯 SVG 图标 (70+)

frontend/components/icons/     # React 图标组件
├── index.ts                   # 统一导出
├── icons-export.ts            # Lucide 导出
├── Logo.tsx                   # Logo 组件
├── IconSprite.tsx             # 图标精灵
└── [30+ 图标组件]

docs/
├── DESIGN-SYSTEM.md           # 设计系统文档
├── ICON-CATALOG.md            # 图标清单
└── GRAPHICS-INDEX.md          # 本文档
```

---

## 🔧 开发指南

### 添加新图标

1. **创建 React 组件**
```tsx
// components/icons/NewIcon.tsx
interface NewIconProps {
  size?: number;
  className?: string;
}

export const NewIcon = ({ size = 24, className = '' }: NewIconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* SVG 内容 */}
    </svg>
  );
};
```

2. **更新导出**
```tsx
// components/icons/index.ts
export { NewIcon } from './NewIcon';
export type { NewIconProps } from './NewIcon';
```

3. **创建 SVG 版本** (可选)
```bash
# 在 public/icons/ 创建对应 SVG 文件
```

### 添加新背景图案

1. 创建 SVG 文件在 `/public/patterns/`
2. 使用 CSS 或 Tailwind 引用
3. 在设计文档中记录用途

---

## 🎨 最佳实践

### 性能优化
- ✅ 优先使用 Lucide React 图标 (tree-shakeable)
- ✅ SVG 格式确保可缩放
- ✅ 内联 SVG 避免额外请求
- ✅ 使用 CSS 动画而非 JavaScript
- ✅ 懒加载大型背景图

### 可访问性
- ✅ 所有图标添加 `aria-label`
- ✅ 使用语义化 HTML
- ✅ 确保颜色对比度符合 WCAG
- ✅ 提供纯文本替代

### 响应式设计
- ✅ 使用相对单位 (rem, em)
- ✅ 图标尺寸响应式调整
- ✅ 移动端优化触摸目标
- ✅ 断点测试所有设备

---

## 📚 参考文档

- [设计系统](./DESIGN-SYSTEM.md) - 完整的设计规范
- [图标清单](./ICON-CATALOG.md) - 图标使用指南
- [Tailwind 配置](../frontend/tailwind.config.ts) - 样式配置
- [项目蓝图](./PROJECT.md) - 项目规划

---

## 🔄 更新日志

### v1.0.0 (2026-03-02)
- ✅ 完整的 Logo 系统
- ✅ 30+ React 图标组件
- ✅ 70+ 纯 SVG 图标
- ✅ 7+ 背景图案
- ✅ 4+ 特效背景
- ✅ 完整设计系统文档
- ✅ 赛博朋克配色方案
- ✅ 动画和特效系统

---

**维护者**: CyberPress AI Design Team
**最后更新**: 2026-03-02
**版本**: v1.0.0
