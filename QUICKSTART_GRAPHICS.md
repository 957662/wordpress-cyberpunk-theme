# CyberPress 图形系统 - 快速开始指南

> 🎨 5 分钟上手赛博朋克风格图形系统

---

## 📦 安装

所有组件已内置在项目中，无需额外安装！

---

## 🚀 基础使用

### 1. 导入组件

```tsx
import {
  IconLoader,
  DecorativeCorner,
  CyberDivider,
  HexagonFrame,
  BackgroundPattern,
} from '@/components/graphics';
```

### 2. 使用图标

```tsx
// 加载社交图标
<IconLoader name="github" size={24} />
<IconLoader name="twitter" size={32} className="text-cyber-cyan" />

// 加载功能图标
<IconLoader name="search" size={20} />
<IconLoader name="menu" size={24} />
<IconLoader name="user" size={28} />
```

### 3. 添加装饰

```tsx
<div className="relative p-8 bg-cyber-dark rounded-lg">
  {/* 四角装饰 */}
  <DecorativeCorner position="top-left" variant="glow" />
  <DecorativeCorner position="top-right" variant="glow" />
  <DecorativeCorner position="bottom-left" variant="glow" />
  <DecorativeCorner position="bottom-right" variant="glow" />

  <h2>Cyberpunk Card</h2>
</div>
```

### 4. 添加分割线

```tsx
<CyberDivider variant="gradient" animated />
<CyberDivider variant="glow" color="cyan" animated />
<CyberDivider variant="dashed" color="purple" />
```

### 5. 创建内容框架

```tsx
<HexagonFrame size={200} variant="glow" color="cyan" animated>
  <div className="text-center">
    <IconLoader name="terminal" size={48} />
    <p className="text-cyber-cyan font-bold mt-2">CYBER</p>
  </div>
</HexagonFrame>
```

### 6. 添加背景图案

```tsx
<BackgroundPattern pattern="cyber-mesh" opacity={0.2}>
  <div className="p-8">
    <h2>Content with cyber mesh background</h2>
  </div>
</BackgroundPattern>
```

---

## 🎨 完整示例

```tsx
'use client';

import {
  IconLoader,
  DecorativeCorner,
  CyberDivider,
  HexagonFrame,
  BackgroundPattern,
} from '@/components/graphics';

export default function CyberCard() {
  return (
    <BackgroundPattern pattern="cyber-mesh" opacity={0.15}>
      <div className="relative max-w-md mx-auto p-8 bg-cyber-dark/50 rounded-lg border border-cyber-cyan/20">
        {/* 装饰角标 */}
        <DecorativeCorner position="top-left" variant="glow" />
        <DecorativeCorner position="top-right" variant="glow" />
        <DecorativeCorner position="bottom-left" variant="glow" />
        <DecorativeCorner position="bottom-right" variant="glow" />

        {/* 内容 */}
        <div className="relative z-10 text-center">
          {/* 图标 */}
          <IconLoader name="terminal" size={48} className="mx-auto mb-4" />

          {/* 标题 */}
          <h2 className="text-2xl font-bold text-cyber-cyan mb-2">
            CyberPress
          </h2>

          {/* 描述 */}
          <p className="text-cyber-gray-200 mb-6">
            赛博朋克风格博客平台
          </p>

          {/* 分割线 */}
          <CyberDivider variant="gradient" animated className="mb-6" />

          {/* 框架 */}
          <div className="flex justify-center">
            <HexagonFrame size={150} variant="glow" color="purple" animated>
              <div className="text-center">
                <IconLoader name="code" size={32} />
                <p className="text-cyber-purple font-bold mt-2">CODE</p>
              </div>
            </HexagonFrame>
          </div>
        </div>
      </div>
    </BackgroundPattern>
  );
}
```

---

## 📚 更多资源

- [组件详细文档](frontend/components/graphics/GRAPHICS_COMPONENTS.md)
- [图标清单](frontend/docs/ICON_MANIFEST.md)
- [工作总结](GRAPHICS_WORK_SUMMARY.md)

---

**版本**: v3.0.0 | **更新**: 2026-03-03
