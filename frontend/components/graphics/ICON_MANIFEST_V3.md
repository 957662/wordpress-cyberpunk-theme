# CyberPress 图标清单 v3.0

> 📅 更新时间: 2026-03-03
> 🎨 设计风格: 赛博朋克 / 霓虹科技

---

## 📦 新增图形组件

### Logo 组件

#### CyberLogo
**文件**: `components/graphics/CyberLogo.tsx`

**功能**: CyberPress 主 Logo 组件，支持多种变体和动画

**Props**:
```typescript
interface CyberLogoProps {
  size?: number;              // Logo 尺寸 (默认: 200)
  variant?: 'gradient' | 'cyan' | 'purple' | 'pink' | 'monochrome';
  className?: string;
  animated?: boolean;
  showText?: boolean;
  text?: string;
}
```

**使用示例**:
```tsx
<CyberLogo size={200} variant="gradient" animated={true} />
<CyberLogo size={100} variant="cyan" showText={false} />
```

**特性**:
- ✨ 霓虹发光效果
- 🎨 5 种颜色变体
- 🔄 脉冲动画支持
- 📝 可选文字标签
- 🎯 响应式设计

---

### 科技图标组件

#### 1. CyberIcon - 赛博核心图标
**文件**: `components/graphics/CyberIcon.tsx`

**功能**: 六边形核心设计，代表赛博朋克主题

**Props**:
```typescript
interface CyberIconProps {
  size?: number;              // 图标尺寸 (默认: 48)
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'gradient';
  className?: string;
  animated?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}
```

**使用示例**:
```tsx
<CyberIcon size={48} variant="cyan" animated={true} intensity="medium" />
<CyberIcon size={64} variant="gradient" />
```

**特性**:
- 🔷 六边形核心设计
- 💫 可调节发光强度
- 🌈 渐变色彩支持
- ⚡ 动画效果

---

#### 2. QuantumIcon - 量子计算图标
**文件**: `components/graphics/QuantumIcon.tsx`

**功能**: 量子纠缠轨道效果，代表未来计算

**Props**:
```typescript
interface QuantumIconProps {
  size?: number;              // 图标尺寸 (默认: 64)
  variant?: 'cyan' | 'purple' | 'pink' | 'gradient';
  className?: string;
  animated?: boolean;
}
```

**使用示例**:
```tsx
<QuantumIcon size={64} variant="purple" animated={true} />
<QuantumIcon size={48} variant="cyan" />
```

**特性**:
- ⚛️ 量子轨道设计
- 🔄 旋转动画
- 💎 粒子运动效果
- 🌟 能量波纹

---

#### 3. NeuralIcon - 神经网络图标
**文件**: `components/graphics/NeuralIcon.tsx`

**功能**: AI/ML 主题，节点连接网络

**Props**:
```typescript
interface NeuralIconProps {
  size?: number;              // 图标尺寸 (默认: 56)
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
  animated?: boolean;
  nodeCount?: number;         // 节点数量 (默认: 7)
}
```

**使用示例**:
```tsx
<NeuralIcon size={56} variant="cyan" animated={true} nodeCount={7} />
<NeuralIcon size={40} variant="purple" nodeCount={5} />
```

**特性**:
- 🧠 神经网络节点
- ⚡ 数据流动画
- 🔗 动态连接
- 💫 脉冲效果

---

#### 4. DataStreamIcon - 数据流图标
**文件**: `components/graphics/DataStreamIcon.tsx`

**功能**: 数据传输主题，二进制装饰

**Props**:
```typescript
interface DataStreamIconProps {
  size?: number;              // 图标尺寸 (默认: 48)
  variant?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
  animated?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
}
```

**使用示例**:
```tsx
<DataStreamIcon size={48} variant="cyan" animated={true} speed="normal" />
<DataStreamIcon size={40} variant="green" speed="fast" />
```

**特性**:
- 📊 数据流通道
- 🔢 二进制装饰
- ⚡ 可调速度
- 💾 端口设计

---

### 插画组件

#### 1. HolographicCard - 全息卡片
**文件**: `components/graphics/illustrations/HolographicCard.tsx`

**功能**: 赛博朋克风格全息投影效果

**Props**:
```typescript
interface HolographicCardProps {
  width?: number;
  height?: number;
  variant?: 'cyber' | 'matrix' | 'neural' | 'quantum';
  className?: string;
  animated?: boolean;
}
```

**使用示例**:
```tsx
<HolographicCard width={400} height={300} variant="cyber" animated={true} />
<HolographicCard width={200} height={200} variant="matrix" />
```

**变体说明**:
- `cyber`: 六边形核心 + 扫描线
- `matrix`: 矩阵雨效果
- `neural`: 神经网络节点
- `quantum`: 量子轨道

**特性**:
- 📱 全息投影效果
- 🔲 扫描线覆盖
- 🎨 4 种主题变体
- ⚡ 动画支持

---

#### 2. CircuitBackground - 电路背景
**文件**: `components/graphics/illustrations/CircuitBackground.tsx`

**功能**: 科技感电路网络背景

**Props**:
```typescript
interface CircuitBackgroundProps {
  width?: number;
  height?: number;
  density?: 'low' | 'medium' | 'high';
  variant?: 'cyan' | 'purple' | 'pink';
  className?: string;
  animated?: boolean;
}
```

**使用示例**:
```tsx
<CircuitBackground width={800} height={600} density="medium" variant="cyan" animated={true} />
<CircuitBackground width={400} height={300} density="high" variant="purple" />
```

**特性**:
- 🔌 电路网络节点
- ⚡ 电流动画
- 🎛️ 可调密度
- 🌐 网格背景

---

### 装饰组件

#### NeonBorder - 霓虹边框
**文件**: `components/graphics/decorations/NeonBorder.tsx`

**功能**: 赛博朋克风格发光边框

**Props**:
```typescript
interface NeonBorderProps {
  width?: number;
  height?: number;
  variant?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green';
  className?: string;
  animated?: boolean;
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
}
```

**使用示例**:
```tsx
<NeonBorder width={300} height={200} variant="cyan" intensity="medium">
  <div>内容区域</div>
</NeonBorder>

<NeonBorder width={400} height={300} variant="purple" animated={true} intensity="high">
  <img src="..." alt="..." />
</NeonBorder>
```

**特性**:
- 💫 霓虹发光边框
- 🔲 角落装饰
- ⚡ 动画效果
- 🎯 可调强度
- 📦 内容容器

---

## 📊 组件对比表

| 组件 | 尺寸范围 | 动画 | 颜色变体 | 主要用途 |
|------|----------|------|----------|----------|
| CyberLogo | 100-400+ | ✅ | 5 | 品牌 Logo |
| CyberIcon | 24-128 | ✅ | 6 | 主题图标 |
| QuantumIcon | 32-128 | ✅ | 4 | 科技感图标 |
| NeuralIcon | 32-100 | ✅ | 4 | AI/ML 主题 |
| DataStreamIcon | 32-80 | ✅ | 4 | 数据传输 |
| HolographicCard | 200-800+ | ✅ | 4 | 背景插画 |
| CircuitBackground | 400-2000+ | ✅ | 3 | 页面背景 |
| NeonBorder | 自定义 | ✅ | 5 | 边框装饰 |

---

## 🎨 颜色变体说明

### 霓虹色系
```typescript
// 赛博青 - 主要强调色
cyan: '#00f0ff'

// 赛博紫 - 次要强调色
purple: '#9d00ff'

// 激光粉 - 特殊强调色
pink: '#ff0080'

// 电压黄 - 高亮色
yellow: '#f0ff00'

// 矩阵绿 - 数据流色
green: '#00ff88'

// 渐变 - 多色混合
gradient: ['#00f0ff', '#9d00ff', '#ff0080']
```

---

## ⚡ 动画效果

### 支持的动画类型

1. **脉冲动画** (`animate-pulse`)
   - 呼吸式缩放
   - 适用于: 图标、Logo、装饰点

2. **旋转动画** (`animate-spin-slow`)
   - 缓慢旋转
   - 适用于: 量子图标、轨道效果

3. **数据流动画**
   - 粒子沿路径运动
   - 适用于: 神经网络、数据流

4. **发光动画**
   - 强度变化
   - 适用于: 霓虹边框、核心元素

5. **波纹动画**
   - 扩散效果
   - 适用于: 脉冲、能量传播

---

## 📏 尺寸指南

### 图标尺寸推荐
```
极小 (xs):  12-16px  - 按钮内图标
小   (sm):  16-20px  - 列表图标
中   (md):  24-32px  - 导航、卡片 (推荐)
大   (lg):  40-48px  - 标题图标
特大 (xl):  64-128px - 英雄区、展示
```

### 插画尺寸推荐
```
小:   200x200    - 卡片装饰
中:   400x300    - 内容区块
大:   800x600    - 页面背景
特大: 1200x800+  - 全屏背景
```

---

## 🎯 使用场景

### 1. 导航系统
```tsx
<CyberIcon size={24} variant="cyan" />
```

### 2. Hero 区域
```tsx
<CyberLogo size={300} variant="gradient" animated={true} />
<HolographicCard width={600} height={400} variant="cyber" animated={true} />
```

### 3. 功能卡片
```tsx
<NeuralIcon size={48} variant="purple" animated={true} />
<QuantumIcon size={64} variant="cyan" />
```

### 4. 背景装饰
```tsx
<CircuitBackground width={1920} height={1080} density="medium" variant="cyan" />
```

### 5. 内容边框
```tsx
<NeonBorder width="100%" height={400} variant="cyan" intensity="medium">
  {/* 内容 */}
</NeonBorder>
```

### 6. 数据可视化
```tsx
<DataStreamIcon size={64} variant="green" animated={true} speed="fast" />
<NeuralIcon size={80} variant="cyan" animated={true} nodeCount={10} />
```

---

## 🔧 配置与工具

### 导入方式

```typescript
// 单个导入
import { CyberLogo } from '@/components/graphics';

// 批量导入
import {
  CyberLogo,
  CyberIcon,
  QuantumIcon,
  NeuralIcon,
  DataStreamIcon
} from '@/components/graphics';

// 导入插画
import {
  HolographicCard,
  CircuitBackground
} from '@/components/graphics/illustrations';

// 导入装饰
import { NeonBorder } from '@/components/graphics/decorations';

// 导入配置
import {
  GRAPHICS_CONFIG,
  getColor,
  getGradient
} from '@/components/graphics/config';
```

### 使用 Tailwind 类名

```tsx
<div className="text-cyber-cyan bg-cyber-dark border-cyber-border">
  <CyberIcon size={24} variant="cyan" />
</div>
```

---

## 📈 性能优化建议

1. **动画控制**
   - 提供 `animated` 属性开关
   - 尊重用户系统设置（`prefers-reduced-motion`）

2. **尺寸优化**
   - 使用合适的尺寸，避免过大
   - 响应式调整移动端尺寸

3. **懒加载**
   - 大型插画使用懒加载
   - 非首屏图标延迟加载

4. **SVG 优化**
   - 移除不必要的元数据
   - 简化路径数据

---

## 🔄 版本历史

### v3.0 (2026-03-03)
- ✨ 新增 CyberLogo 组件
- ✨ 新增 4 个科技图标 (CyberIcon, QuantumIcon, NeuralIcon, DataStreamIcon)
- ✨ 新增 2 个插画组件 (HolographicCard, CircuitBackground)
- ✨ 新增 NeonBorder 装饰组件
- 📝 完整的 TypeScript 类型支持
- 📚 完善的使用文档

### v2.0 (2026-03-02)
- 🔧 优化现有图标组件
- 📝 更新图标清单
- 🎨 统一设计风格

### v1.0 (2026-03-01)
- 🎉 初始版本发布
- 📦 基础图标库

---

## 📚 相关文档

- [配色参考](./COLOR_REFERENCE.md) - 完整的配色方案
- [设计系统](../../../docs/DESIGN-SYSTEM.md) - 设计规范
- [图标清单 v2](../../docs/ICON_MANIFEST_V2.md) - 原有图标
- [配置文件](./config.ts) - 技术配置

---

**设计团队**: CyberPress AI Design Team
**许可证**: MIT
**最后更新**: 2026-03-03
