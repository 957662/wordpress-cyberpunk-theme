# CyberPress Graphics - 快速使用指南

**版本**: v2.1.0
**最后更新**: 2026-03-06

---

## 🚀 快速开始

### 1. 导入组件

```typescript
// 导入图标
import {
  QuantumCoreIcon,
  NeuralNetworkIcon,
  DataFlowIcon,
  CircuitBoardIcon,
  HolographicIcon,
} from '@/components/icons';

// 导入装饰元素
import {
  CornerAccent,
  TechBorder,
  SectionDivider,
  DataStreamDecoration,
  HoloDecoration,
} from '@/components/decorations';
```

### 2. 使用图标

```tsx
// 基础图标
<QuantumCoreIcon size={64} variant="cyan" />

// 带动画的图标
<NeuralNetworkIcon size={80} variant="purple" animated={true} />

// 自定义样式
<DataFlowIcon
  size={72}
  variant="pink"
  animated={true}
  className="text-cyber-cyan"
/>
```

### 3. 使用装饰元素

```tsx
// 角落装饰
<div className="relative">
  <CornerAccent position="all" size={20} variant="cyan" />
  <div>内容</div>
</div>

// 科技边框
<TechBorder variant="cyan" glow={true}>
  <div className="p-6">
    带发光边框的内容区域
  </div>
</TechBorder>

// 分隔线
<SectionDivider variant="purple" animated={true} />

// 数据流装饰
<DataStreamDecoration variant="cyan" animated={true} density="medium" />

// 全息装饰
<HoloDecoration size={100} variant="cyan" animated={true} type="ring" />
```

---

## 📋 所有可用组件

### 高级图标

| 组件 | 用途 | 特性 |
|------|------|------|
| `QuantumCoreIcon` | 量子核心 | 旋转轨道、节点装饰 |
| `NeuralNetworkIcon` | 神经网络 | 三层结构、脉冲动画 |
| `DataFlowIcon` | 数据流 | 双管道、流动动画 |
| `CircuitBoardIcon` | 电路板 | 电路布局、脉冲效果 |
| `HolographicIcon` | 全息投影 | 3D 立方体、扫描动画 |

### 装饰元素

| 组件 | 用途 | 特性 |
|------|------|------|
| `CornerAccent` | 角落装饰 | 四角/单角模式 |
| `TechBorder` | 科技边框 | 发光边框、内容容器 |
| `SectionDivider` | 分隔线 | 渐变线、中央装饰 |
| `DataStreamDecoration` | 数据流装饰 | 粒子流、数据包动画 |
| `HoloDecoration` | 全息装饰 | ring/grid/wave 三种类型 |

---

## 🎨 颜色变体

所有组件支持以下颜色：

```typescript
variant="cyan"    // 霓虹青 (#00f0ff) - 主要操作
variant="purple"  // 赛博紫 (#9d00ff) - 次要操作
variant="pink"    // 激光粉 (#ff0080) - 强调色
variant="yellow"  // 电压黄 (#f0ff00) - 警告色
variant="green"   // 矩阵绿 (#00ff88) - 成功色
```

---

## ⚡ 动画控制

所有组件支持动画开关：

```typescript
// 启用动画
<QuantumCoreIcon animated={true} />

// 禁用动画
<QuantumCoreIcon animated={false} />
```

---

## 📐 尺寸规格

### 图标尺寸

```typescript
// 小图标
<QuantumCoreIcon size={16} />   // 16px
<QuantumCoreIcon size={24} />   // 24px (默认)

// 中图标
<QuantumCoreIcon size={32} />   // 32px
<QuantumCoreIcon size={48} />   // 48px

// 大图标
<QuantumCoreIcon size={64} />   // 64px
<QuantumCoreIcon size={80} />   // 80px
<QuantumCoreIcon size={96} />   // 96px
```

### 装饰元素尺寸

```typescript
// 角落装饰
<CornerAccent size={20} />  // 20x20px

// 全息装饰
<HoloDecoration size={100} />  // 100x100px

// 边框和分隔线自动适应容器
```

---

## 💡 使用场景示例

### 1. AI 功能展示

```tsx
<div className="bg-cyber-card p-6 rounded-lg">
  <div className="flex items-center gap-4 mb-4">
    <QuantumCoreIcon size={48} variant="cyan" animated={true} />
    <h2 className="text-xl font-bold">AI 核心技术</h2>
  </div>
  <p className="text-cyber-muted">
    使用量子计算和神经网络驱动的智能系统
  </p>
</div>
```

### 2. 数据传输可视化

```tsx
<div className="bg-cyber-card p-6 rounded-lg">
  <h3 className="text-lg font-bold mb-4">实时数据流</h3>
  <DataFlowIcon
    size={64}
    variant="cyan"
    animated={true}
    direction="right"
  />
  <div className="mt-4">
    <DataStreamDecoration
      variant="cyan"
      animated={true}
      density="high"
    />
  </div>
</div>
```

### 3. 内容区块装饰

```tsx
<TechBorder variant="purple" glow={true}>
  <div className="p-6">
    <h3 className="text-lg font-bold text-cyber-purple mb-2">
      高级功能
    </h3>
    <p className="text-cyber-muted">
      带发光边框的特殊内容区域
    </p>
  </div>
</TechBorder>
```

### 4. 页面分区分隔

```tsx
<div className="py-12">
  <SectionDivider variant="cyan" animated={true} />
</div>
```

### 5. 加载状态

```tsx
<div className="flex flex-col items-center gap-6">
  <HoloDecoration
    size={120}
    variant="cyan"
    animated={true}
    type="ring"
  />
  <p className="text-cyber-cyan">系统加载中...</p>
</div>
```

---

## 🔧 高级用法

### 响应式图标

```tsx
const [isMobile, setIsMobile] = useState(false);

<QuantumCoreIcon
  size={isMobile ? 48 : 80}
  variant="cyan"
  animated={true}
/>
```

### 颜色主题切换

```tsx
const [theme, setTheme] = useState<'cyan' | 'purple'>('cyan');

<NeuralNetworkIcon
  size={64}
  variant={theme}
  animated={true}
/>
```

### 条件动画

```tsx
<QuantumCoreIcon
  size={64}
  variant="cyan"
  animated={isLoading}
/>
```

### 自定义样式

```tsx
<QuantumCoreIcon
  size={64}
  variant="cyan"
  animated={true}
  className="hover:scale-110 transition-transform"
  style={{ filter: 'drop-shadow(0 0 10px #00f0ff)' }}
/>
```

---

## 📊 性能优化

### 按需导入

```typescript
// ✅ 推荐：按需导入
import { QuantumCoreIcon } from '@/components/icons';

// ❌ 避免：全量导入
import * as Icons from '@/components/icons';
```

### 条件渲染

```tsx
// 仅在需要时渲染动画
{showAnimation && (
  <QuantumCoreIcon animated={true} />
)}
```

### 懒加载

```tsx
const HeavyIcon = dynamic(
  () => import('@/components/icons/QuantumCoreIcon'),
  { loading: () => <LoadingIcon /> }
);
```

---

## 🎯 最佳实践

### ✅ 推荐做法

1. **使用语义化颜色**
```tsx
<CheckIcon variant="green" />     // 成功
<WarningIcon variant="yellow" />  // 警告
<ErrorIcon variant="pink" />      // 错误
```

2. **添加可访问性标签**
```tsx
<QuantumCoreIcon
  size={64}
  variant="cyan"
  aria-label="量子核心图标"
/>
```

3. **使用标准尺寸**
```tsx
<QuantumCoreIcon size={24} />   // 标准
<QuantumCoreIcon size={48} />   // 大号
```

### ❌ 避免做法

1. **不要使用不规范的尺寸**
```tsx
// ❌ 避免
<QuantumCoreIcon size={27} />

// ✅ 推荐
<QuantumCoreIcon size={24} />
```

2. **不要过度使用动画**
```tsx
// ❌ 避免：太多动画元素
<div>
  <QuantumCoreIcon animated={true} />
  <NeuralNetworkIcon animated={true} />
  <DataFlowIcon animated={true} />
</div>

// ✅ 推荐：控制动画数量
```

---

## 🌐 浏览器支持

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

## 📚 更多资源

### 文档
- [完整图形素材目录](./GRAPHICS_ASSETS_CATALOG.md)
- [图标清单 v3.0](./ICON_MANIFEST_V3.md)
- [配色参考](./COLOR_REFERENCE.md)

### 示例
- [图形素材展示组件](../components/graphics/GraphicsShowcase.tsx)
- [图标展示示例](../components/examples/IconShowcase.tsx)

---

## 💬 获取帮助

遇到问题？参考：

1. **类型定义**: 查看组件的 TypeScript 接口
2. **示例代码**: 查看 GraphicsShowcase 组件
3. **文档**: 查看相关文档

---

<div align="center">

**🎨 CyberPress Graphics Library v2.1**

**Built with ❤️ by CyberPress AI Design Team**

**Powered by CyberPress Platform**

**最后更新: 2026-03-06**

</div>
