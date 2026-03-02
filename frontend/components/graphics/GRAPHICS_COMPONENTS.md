# CyberPress 图形组件文档

## 📦 组件库概览

CyberPress 图形组件库提供了一系列赛博朋克风格的 React 组件，用于构建现代化的 UI 界面。

---

## 🎨 新增组件 (2026-03-03)

### IconLoader - 动态图标加载器

从 `public/icons` 目录动态加载 SVG 图标。

**Props:**
- `name: string` - 图标名称（不含扩展名）
- `size?: number` - 图标尺寸（默认 24）
- `className?: string` - 自定义类名
- `ariaLabel?: string` - 无障碍标签

**使用示例:**
```tsx
import { IconLoader } from '@/components/graphics';

<IconLoader name="github" size={24} />
<IconLoader name="twitter" size={32} className="text-cyber-cyan" />
```

---

### DecorativeCorner - 装饰性角标

用于卡片、区块的四角装饰。

**Props:**
- `position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'` - 位置
- `size?: number` - 尺寸（默认 100）
- `variant?: 'default' | 'glow' | 'minimal'` - 变体
- `className?: string` - 自定义类名

**使用示例:**
```tsx
import { DecorativeCorner } from '@/components/graphics';

<DecorativeCorner position="top-left" />
<DecorativeCorner position="bottom-right" variant="glow" />
```

---

### CyberDivider - 赛博分割线

赛博朋克风格的分割线组件。

**Props:**
- `width?: number` - 宽度（默认 400）
- `thickness?: number` - 线条粗细（默认 2）
- `variant?: 'gradient' | 'dashed' | 'dotted' | 'glow'` - 变体
- `color?: 'cyan' | 'purple' | 'pink' | 'multi'` - 颜色
- `animated?: boolean` - 是否动画
- `className?: string` - 自定义类名

**使用示例:**
```tsx
import { CyberDivider } from '@/components/graphics';

<CyberDivider />
<CyberDivider variant="glow" color="cyan" animated />
<CyberDivider width={400} thickness={2} />
```

---

### HexagonFrame - 六边形框架

用于展示内容或作为装饰边框。

**Props:**
- `size?: number` - 尺寸（默认 200）
- `children?: React.ReactNode` - 子元素
- `variant?: 'default' | 'filled' | 'outlined' | 'glow'` - 变体
- `color?: 'cyan' | 'purple' | 'pink' | 'multi'` - 颜色
- `animated?: boolean` - 是否动画
- `className?: string` - 自定义类名

**使用示例:**
```tsx
import { HexagonFrame } from '@/components/graphics';

<HexagonFrame size={200}>
  <span>Content</span>
</HexagonFrame>

<HexagonFrame variant="glow" animated />
```

---

### BackgroundPattern - 背景图案

为容器添加赛博朋克风格的背景图案。

**Props:**
- `pattern: 'grid' | 'scanlines' | 'circuit' | 'hexagon' | 'noise' | 'data-stream' | 'holographic-grid' | 'cyber-mesh'` - 图案类型
- `opacity?: number` - 不透明度（默认 0.3）
- `animated?: boolean` - 是否动画（暂未实现）
- `className?: string` - 自定义类名
- `children?: React.ReactNode` - 子元素

**使用示例:**
```tsx
import { BackgroundPattern } from '@/components/graphics';

<BackgroundPattern pattern="grid" opacity={0.3}>
  <div>Content with grid background</div>
</BackgroundPattern>

<BackgroundPattern pattern="holographic-grid">
  <section>Holographic section</section>
</BackgroundPattern>
```

---

## 📋 背景图案类型

### 可用图案

| 图案名称 | 描述 | 使用场景 |
|---------|------|---------|
| `grid` | 网格图案 | 技术背景、数据展示 |
| `scanlines` | 扫描线 | 复古显示器效果 |
| `circuit` | 电路板 | 科技主题 |
| `hexagon` | 六边形 | 蜂窝结构、模块化 |
| `noise` | 噪点 | 纹理背景 |
| `data-stream` | 数据流 | 数据传输、加载 |
| `holographic-grid` | 全息网格 | 未来科技感 |
| `cyber-mesh` | 赛博网格 | 复杂网络、连接 |

---

## 🎯 使用指南

### 完整示例

```tsx
import {
  DecorativeCorner,
  CyberDivider,
  HexagonFrame,
  BackgroundPattern,
} from '@/components/graphics';

export default function CyberSection() {
  return (
    <BackgroundPattern pattern="cyber-mesh" opacity={0.2}>
      <div className="relative p-8 bg-cyber-dark/50 rounded-lg border border-cyber-cyan/20">
        {/* 角标装饰 */}
        <DecorativeCorner position="top-left" variant="glow" />
        <DecorativeCorner position="bottom-right" variant="glow" />

        {/* 内容 */}
        <h2 className="text-cyber-cyan text-2xl font-bold mb-4">
          Cyberpunk Section
        </h2>

        {/* 分割线 */}
        <CyberDivider variant="gradient" animated />

        {/* 六边形框架 */}
        <div className="mt-6 flex justify-center">
          <HexagonFrame size={150} variant="glow" color="cyan" animated>
            <span className="text-cyber-cyan">CYBER</span>
          </HexagonFrame>
        </div>
      </div>
    </BackgroundPattern>
  );
}
```

---

## 🎨 配色方案

所有组件支持以下赛博朋克颜色：

```css
霓虹青: #00f0ff  (主要色)
赛博紫: #9d00ff  (次要色)
激光粉: #ff0080  (强调色)
矩阵绿: #00ff88  (成功色)
电压黄: #f0ff00  (警告色)
```

---

## 📐 尺寸规格

推荐使用的尺寸值：

```tsx
// 图标尺寸
const iconSizes = [16, 20, 24, 32, 40, 48];

// 角标尺寸
const cornerSizes = [50, 75, 100, 150];

// 六边形尺寸
const hexagonSizes = [100, 150, 200, 300];

// 分割线粗细
const dividerThickness = [1, 2, 3];
```

---

## 🔄 动画效果

支持动画的组件：

1. **DecorativeCorner** - `variant="glow"` 时支持脉冲动画
2. **CyberDivider** - `animated={true}` 时支持多种动画效果
3. **HexagonFrame** - `animated={true}` 时支持旋转和脉冲动画

---

## 🌐 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ 移动端浏览器

---

## 📦 相关资源

- [图标清单](../../../docs/ICON_MANIFEST.md)
- [配色参考](../../../docs/COLOR_REFERENCE.md)
- [图形素材说明](../../../public/README-GRAPHICS.md)
- [插画说明](../../../public/illustrations/README.md)

---

**版本**: v3.0.0
**更新时间**: 2026-03-03
**维护团队**: CyberPress AI Design Team
