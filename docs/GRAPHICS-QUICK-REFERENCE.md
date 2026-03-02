# CyberPress Graphics - 快速参考指南

## 🎯 快速开始

### 导入图形组件
```tsx
// 导入赛博朋克图标
import {
  NeuralNetworkIcon,
  QuantumCoreIcon,
  DataStreamDecoration
} from '@/components/graphics';

// 导入装饰元素
import {
  CornerBracket,
  DividerLine,
  LoadingRing,
  TechBorder
} from '@/components/graphics';
```

### 基础使用
```tsx
// 神经网络图标
<NeuralNetworkIcon size={100} glow={true} />

// 量子核心图标
<QuantumCoreIcon size={80} className="text-cyber-purple" />

// 数据流装饰
<DataStreamDecoration size={200} />

// 角标装饰
<CornerBracket position="top-left" size={80} />

// 科技分割线
<DividerLine variant="tech" />
```

---

## 📋 完整图标列表

### 赛博朋克图标 (新增)
| 组件 | 用途 | 尺寸 | 动画 |
|------|------|------|------|
| `NeuralNetworkIcon` | AI/机器学习 | 100px | 节点脉冲 |
| `QuantumCoreIcon` | 科技/计算 | 100px | 轨道旋转 |
| `DataStreamDecoration` | 数据传输 | 200x100px | 流动 |

### 装饰元素
| 组件 | 用途 | 变体 |
|------|------|------|
| `CornerBracket` | 角落装饰 | 4个位置 |
| `DividerLine` | 分割线 | simple/double/dashed/tech |
| `LoadingRing` | 加载动画 | - |
| `HexLoader` | 六边形加载 | - |
| `PulseLoader` | 脉冲加载 | - |
| `TechBorder` | 科技边框 | 可选圆角/发光 |
| `PatternBackground` | 图案背景 | grid/dots/hexagons/circuit |
| `Scanlines` | 扫描线效果 | - |
| `GlitchOverlay` | 故障效果 | - |

---

## 🎨 颜色参考

### Tailwind CSS 类名
```tsx
// 主要颜色
className="text-cyber-cyan"      // #00f0ff
className="text-cyber-purple"    // #9d00ff
className="text-cyber-pink"      // #ff0080
className="text-cyber-yellow"    // #f0ff00

// 灰度颜色
className="text-cyber-gray-100"  // #e0e0e0
className="text-cyber-gray-200"  // #a0a0b0
className="text-cyber-gray-300"  // #606070

// 背景颜色
className="bg-cyber-black"       // #0a0a0f
className="bg-cyber-dark"        // #12121a
```

### 阴影效果
```tsx
// 发光阴影
className="shadow-neon-cyan"     // 霓虹青发光
className="shadow-neon-purple"   // 赛博紫发光
className="shadow-neon-pink"     // 激光粉发光
```

---

## 🔧 组件 Props

### CyberIconProps
```tsx
interface CyberIconProps {
  size?: number;           // 图标尺寸 (默认: 100)
  className?: string;      // CSS 类名
  color?: string;          // 自定义颜色
  glow?: boolean;          // 发光效果 (默认: true)
}
```

### CornerBracketProps
```tsx
interface CornerBracketProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;           // 尺寸 (默认: 100)
  strokeWidth?: number;    // 线条粗细 (默认: 2)
  className?: string;
  color?: string;
}
```

### DividerLineProps
```tsx
interface DividerLineProps {
  variant?: 'simple' | 'double' | 'dashed' | 'tech';
  width?: number | 'full'; // 宽度 (默认: 'full')
  height?: number;         // 高度 (默认: 20)
  className?: string;
  color?: string;
}
```

### LoadingRingProps
```tsx
interface LoadingRingProps {
  size?: number;           // 尺寸 (默认: 80)
  strokeWidth?: number;    // 线条粗细 (默认: 3)
  className?: string;
  color?: string;
}
```

---

## 💡 使用场景

### 页面装饰
```tsx
<div className="relative p-8 border border-cyber-cyan/20 rounded-lg">
  <CornerBracket position="top-left" />
  <CornerBracket position="top-right" />
  <CornerBracket position="bottom-left" />
  <CornerBracket position="bottom-right" />

  <div className="text-center">
    <h2 className="text-2xl text-cyber-cyan">标题</h2>
    <DividerLine variant="tech" className="my-4" />
    <p className="text-cyber-gray-200">内容</p>
  </div>
</div>
```

### 加载状态
```tsx
<div className="flex flex-col items-center gap-4">
  <LoadingRing size={60} />
  <p className="text-cyber-cyan">加载中...</p>
</div>
```

### 背景图案
```tsx
<div className="relative min-h-screen">
  <div className="absolute inset-0 opacity-10">
    <PatternBackground variant="grid" />
  </div>
  <div className="relative z-10">
    {/* 内容 */}
  </div>
</div>
```

### AI 功能展示
```tsx
<div className="bg-cyber-dark rounded-lg p-8">
  <h3 className="text-xl text-cyber-cyan mb-4">AI 驱动</h3>
  <div className="flex justify-center">
    <NeuralNetworkIcon size={200} glow={true} />
  </div>
  <p className="text-center text-cyber-gray-200 mt-4">
    智能神经网络分析
  </p>
</div>
```

---

## 🎬 动画示例

### 自定义动画速度
```tsx
// 慢速旋转 (20s)
<div className="animate-[spin_20s_linear_infinite]">
  <TechRing />
</div>

// 快速脉冲 (1s)
<div className="animate-[pulse_1s_ease-in-out_infinite]">
  <NeuralNetworkIcon />
</div>
```

### 悬停效果
```tsx
<NeuralNetworkIcon
  size={100}
  className="transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]"
/>
```

### 组合动画
```tsx
<div className="relative">
  <div className="animate-spin">
    <QuantumCoreIcon size={150} />
  </div>
  <div className="absolute inset-0 animate-pulse">
    <NeuralNetworkIcon size={150} />
  </div>
</div>
```

---

## 📱 响应式使用

### 自适应尺寸
```tsx
<div className="w-full max-w-md mx-auto">
  <NeuralNetworkIcon size="100%" className="w-full h-auto" />
</div>
```

### 断点控制
```tsx
<NeuralNetworkIcon
  size={isMobile ? 80 : isTablet ? 120 : 200}
/>
```

---

## 🎯 最佳实践

### 1. 性能优化
```tsx
// ✅ 好：使用 CSS 动画
<NeuralNetworkIcon className="animate-spin" />

// ❌ 差：使用 JavaScript 动画
const [rotation, setRotation] = useState(0);
// 避免 JS 更新动画
```

### 2. 可访问性
```tsx
<NeuralNetworkIcon
  aria-label="神经网络图标"
  role="img"
/>
```

### 3. 主题适配
```tsx
<NeuralNetworkIcon
  className="dark:text-cyber-cyan light:text-cyber-purple"
/>
```

### 4. 错误处理
```tsx
{isValid && (
  <NeuralNetworkIcon size={100} />
)}
```

---

## 🔍 调试技巧

### 检查 SVG 渲染
```tsx
<NeuralNetworkIcon
  size={100}
  style={{ border: '1px solid red' }} // 调试边界
/>
```

### 查看动画状态
```tsx
<div className="animate-spin" data-testid="rotating-icon">
  <QuantumCoreIcon />
</div>
```

### 性能监控
```tsx
useEffect(() => {
  const start = performance.now();
  // 渲染图标
  const end = performance.now();
  console.log(`渲染时间: ${end - start}ms`);
}, []);
```

---

## 📚 相关文档

- [完整交付清单](./GRAPHICS-DELIVERABLES.md)
- [设计系统](./DESIGN-SYSTEM.md)
- [图标目录](./ICON-CATALOG.md)
- [组件文档](../frontend/docs/ARCHITECTURE.md)

---

## 🆘 常见问题

### Q: 图标颜色不显示？
A: 确保使用了 `currentColor` 或指定颜色类名：
```tsx
<NeuralNetworkIcon className="text-cyber-cyan" />
```

### Q: 动画不流畅？
A: 检查是否有性能问题，考虑使用 `will-change`：
```tsx
className="will-change-transform animate-spin"
```

### Q: SVG 尺寸不对？
A: 使用 `viewBox` 和容器控制：
```tsx
<div className="w-32 h-32">
  <NeuralNetworkIcon className="w-full h-full" />
</div>
```

### Q: 发光效果太强？
A: 调整透明度或关闭 `glow`：
```tsx
<NeuralNetworkIcon glow={false} />
```

---

**快速参考 v1.0** | 更新日期: 2026-03-03
