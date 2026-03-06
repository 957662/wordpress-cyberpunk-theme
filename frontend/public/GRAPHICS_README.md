# CyberPress 图形素材包

> 赛博朋克风格矢量图形素材库

**版本**: v1.0.0
**最后更新**: 2026-03-07
**维护者**: CyberPress AI Design Team

---

## 📦 素材清单

### ✅ 已创建素材

#### 🎨 Logo 系列 (6 个)
- ✅ `logo.svg` - 主 Logo (200x60)
- ✅ `logo-icon.svg` - Logo 图标 (100x100)
- ✅ `logo-mark.svg` - Logo 标志 (50x50)
- ✅ `logo-square.svg` - 方形 Logo (200x200)
- ✅ `logo-main.svg` - 主 Logo 大尺寸 (300x100)
- ✅ `logo-favicon.svg` - 浏览器图标 (32x32)

#### 🤖 赛博朋克图标 (5 个新增)
- ✅ `glitch-art.svg` - 故障艺术图标
- ✅ `matrix-code.svg` - 矩阵代码图标
- ✅ `cyber-shield.svg` - 赛博盾牌
- ✅ `hologram-icon.svg` - 全息图标
- ✅ `data-pulse.svg` - 数据脉冲

#### 🖼️ 插画系列 (3 个)
- ✅ `hero-decoration.svg` - 英雄区装饰 (400x400)
- ✅ `error-404.svg` - 404 错误页 (400x300)
- ✅ `loading-spinner.svg` - 加载动画 (100x100)

#### 🎯 基础图标 (70+ 个)
位置：`/frontend/public/icons/`

- ✅ 导航图标 (12 个)
- ✅ 功能图标 (25 个)
- ✅ 社交图标 (8 个)
- ✅ 状态图标 (12 个)
- ✅ 技术图标 (10 个)

#### 🎨 装饰图案 (5 个)
位置：`/frontend/public/patterns/`

- ✅ `grid.svg` - 网格
- ✅ `circuit.svg` - 电路
- ✅ `scanlines.svg` - 扫描线
- ✅ `noise.svg` - 噪点
- ✅ `hexagon.svg` - 六边形

#### 🖼️ 背景素材 (3 个)
位置：`/frontend/public/backgrounds/`

- ✅ `hero-bg.svg` - 英雄区背景
- ✅ `card-bg.svg` - 卡片背景
- ✅ `loading-bg.svg` - 加载背景

---

## 📐 图标组件

### React 组件示例
- ✅ `IconLibrary.tsx` - 图标库展示页面
- ✅ `SVGGraphicsGallery.tsx` - SVG 图形素材库展示页面

位置：`/frontend/components/icons/examples/`

---

## 🎨 配色方案

### 主色调
```css
--cyber-dark: #0a0a0f      /* 深空黑 */
--cyber-cyan: #00f0ff      /* 霓虹青 */
--cyber-purple: #9d00ff    /* 赛博紫 */
--cyber-pink: #ff0080      /* 激光粉 */
```

### 辅助色
```css
--cyber-green: #00ff88     /* 矩阵绿 */
--cyber-yellow: #f0ff00    /* 电压黄 */
--cyber-orange: #ff6600    /* 火焰橙 */
```

---

## 📝 文档

### 已创建文档
- ✅ `GRAPHICS_INDEX.md` - 图形素材索引
- ✅ `ICON_COMPONENT_GUIDE.md` - 图标组件使用指南
- ✅ `COLOR_REFERENCE.md` - 配色参考
- ✅ `README-GRAPHICS.md` - 图形素材说明

---

## 🚀 快速开始

### 使用 Logo
```tsx
import Image from 'next/image';

<Image src="/logo.svg" alt="CyberPress" width={200} height={60} />
```

### 使用图标组件
```tsx
import { HomeIcon, SearchIcon } from '@/components/icons';

<HomeIcon size={24} />
<SearchIcon size={24} className="text-cyber-cyan" />
```

### 使用 SVG 图形
```tsx
<Image src="/illustrations/hero-decoration.svg" alt="Hero" fill />
```

### 使用背景图案
```tsx
<div
  className="bg-cyber-dark"
  style={{
    backgroundImage: "url('/patterns/grid.svg')",
    backgroundRepeat: 'repeat',
  }}
>
  {/* 内容 */}
</div>
```

---

## 🎯 设计规范

### 视觉特征
- ✅ **赛博朋克风格**: 霓虹发光、科技线条
- ✅ **渐变应用**: 多色渐变增强层次
- ✅ **电路元素**: 节点、连接线装饰
- ✅ **一致性强**: 统一的设计语言

### 尺寸规范
```css
/* 图标尺寸 */
Mobile:  20px (导航), 16px (列表)
Desktop: 24px (标准), 32px (强调), 48px (展示)

/* Logo 尺寸 */
Small:   50x50 (favicon)
Medium:  100x100 (icon)
Large:   200x60 (main)
XL:      300x100 (hero)
```

---

## ✨ 特效支持

### 发光效果
```css
.neon-glow-cyan {
  box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;
}
```

### 扫描线
```css
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 240, 255, 0.03) 2px,
    rgba(0, 240, 255, 0.03) 4px
  );
}
```

---

## 📱 响应式设计

### 断点
```css
/* 移动端 */
@media (max-width: 768px) {
  .icon { size: 20px; }
}

/* 桌面端 */
@media (min-width: 769px) {
  .icon { size: 24px; }
}
```

---

## 🌐 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

## 📋 检查清单

使用图标前请确认：
- [ ] 导入路径正确
- [ ] 尺寸适配当前布局
- [ ] 颜色符合设计规范
- [ ] 添加了 aria-label（可访问性）
- [ ] 响应式测试通过
- [ ] 动画性能良好
- [ ] 浏览器兼容性测试

---

## 🛠️ 自定义扩展

### 添加新图标
```tsx
// 1. 创建新图标组件
// frontend/components/icons/NewIcon.tsx
export const NewIcon = ({ size = 24, className = '' }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      {/* SVG 内容 */}
    </svg>
  );
};

// 2. 导出图标
// frontend/components/icons/index.ts
export { NewIcon } from './NewIcon';
```

### 添加新 SVG 图形
```tsx
// 1. 将 SVG 文件放到 public 目录
// public/new-graphic.svg

// 2. 使用 Image 组件
<Image src="/new-graphic.svg" alt="New Graphic" width={200} height={200} />
```

---

## 📞 技术支持

### 相关文档
- [图标使用指南](../docs/ICON_COMPONENT_GUIDE.md)
- [图形素材索引](../docs/GRAPHICS_INDEX.md)
- [配色参考](../docs/COLOR_REFERENCE.md)
- [图标清单](../docs/ICON_MANIFEST_COMPLETE.md)

### 常见问题

**Q: 如何改变图标颜色？**
A: 使用 `className` 传入 Tailwind 颜色类名：
```tsx
<HomeIcon className="text-cyber-cyan" />
```

**Q: 如何添加发光效果？**
A: 使用自定义 CSS 类或 Tailwind 扩展：
```tsx
<HomeIcon className="shadow-neon-cyan" />
```

**Q: 图标支持动画吗？**
A: 支持！使用 Tailwind 动画类：
```tsx
<LoadingIcon className="animate-spin" />
```

---

## 🎉 更新日志

### v1.0.0 (2026-03-07)
- ✨ 初始版本发布
- ✨ Logo 系列 (6 个)
- ✨ 赛博朋克图标 (5 个)
- ✨ 插画系列 (3 个)
- ✨ 图标组件示例 (2 个)
- 📝 完整文档

---

## 📄 许可证

MIT License

---

**设计团队**: CyberPress AI Design Team
**项目**: CyberPress Platform
**风格**: 赛博朋克 / Cyberpunk
**年份**: 2026

---

<div align="center">

**Built with ❤️ by AI Design Team**

**Powered by SVG + React**

</div>