# CyberPress 图形组件文档

## 📦 新增组件 (2026-03-03)

本文档介绍了 CyberPress 平台新增的图形组件，这些组件采用赛博朋克风格设计，为项目提供丰富的视觉元素。

---

## 🎖️ TechBadges - 徽章组件

### 导入
```tsx
import {
  TechBadge,
  StatusBadge,
  FeatureBadge,
  CountBadge,
  VersionBadge,
  CyberBadge
} from '@/components/graphics/TechBadges';
```

### 组件说明

#### 1. TechBadge - 基础徽章
通用科技感徽章，支持多种颜色变体和尺寸。

```tsx
<TechBadge
  label="NEW"
  variant="cyan"
  size="md"
  glow={true}
  animated={true}
  icon={<ZapIcon />}
/>
```

**Props:**
- `label`: 徽章文本
- `variant`: 颜色变体 (`'cyan' | 'purple' | 'pink' | 'green' | 'yellow' | 'red' | 'orange'`)
- `size`: 尺寸 (`'sm' | 'md' | 'lg'`)
- `glow`: 是否带发光效果
- `animated`: 是否带动画
- `icon`: 可选的图标元素

#### 2. StatusBadge - 状态徽章
显示在线/离线/错误等状态。

```tsx
<StatusBadge
  status="online"
  label="在线"
  showDot={true}
  size="md"
/>
```

**Props:**
- `status`: 状态类型 (`'online' | 'offline' | 'busy' | 'away' | 'error' | 'warning' | 'success'`)
- `label`: 自定义显示文本
- `showDot`: 是否显示状态点
- `size`: 尺寸

#### 3. FeatureBadge - 功能徽章
展示功能特色，包含图标和描述。

```tsx
<FeatureBadge
  icon={<ZapIcon />}
  label="快速"
  description="性能提升 300%"
  variant="cyan"
  direction="horizontal"
/>
```

**Props:**
- `icon`: React 节点
- `label`: 主要标签
- `description`: 描述文本
- `variant`: 颜色变体
- `direction`: 布局方向 (`'horizontal' | 'vertical'`)

#### 4. CountBadge - 计数徽章
用于显示通知计数等数字徽章。

```tsx
<CountBadge
  count={42}
  max={99}
  variant="red"
  showZero={false}
/>
```

**Props:**
- `count`: 计数数字
- `max`: 最大显示数字（超过显示 `99+`）
- `variant`: 颜色变体
- `showZero`: 是否显示零

#### 5. VersionBadge - 版本徽章
显示软件版本信息。

```tsx
<VersionBadge
  version="2.0.0"
  type="stable"
/>
```

**Props:**
- `version`: 版本号
- `type`: 版本类型 (`'alpha' | 'beta' | 'stable' | 'legacy'`)

#### 6. CyberBadge - 赛博徽章（高级）
带全息效果和动画的高级徽章。

```tsx
<CyberBadge
  label="CYBER"
  sublabel="PUNK"
  variant="cyan"
  holographic={true}
/>
```

**Props:**
- `label`: 主要文本
- `sublabel`: 副文本
- `variant`: 颜色变体
- `holographic`: 是否显示全息效果

---

## 🌌 AnimatedBackgrounds - 动画背景

### 导入
```tsx
import {
  MatrixRain,
  ParticleField,
  CyberWaves,
  NeonGrid,
  Starfield,
  GlitchBackground
} from '@/components/graphics/AnimatedBackgrounds';
```

### 组件说明

#### 1. MatrixRain - 矩阵雨
经典《黑客帝国》风格的数字雨效果。

```tsx
<MatrixRain
  color="#00ff00"
  fontSize={14}
  density={30}
  speed={5}
  className="w-full h-screen"
/>
```

**Props:**
- `color`: 雨滴颜色（默认 `#00ff00`）
- `fontSize`: 字体大小
- `density`: 雨滴密度
- `speed`: 动画速度 (1-10)

#### 2. ParticleField - 粒子场
带连线的动态粒子网络。

```tsx
<ParticleField
  particleCount={80}
  colors={['#00f0ff', '#9d00ff', '#ff0080']}
  particleSize={2}
  connectionDistance={120}
  velocity={0.5}
  speed={5}
/>
```

**Props:**
- `particleCount`: 粒子数量
- `colors`: 粒子颜色数组
- `particleSize`: 粒子大小
- `connectionDistance`: 连线距离阈值
- `velocity`: 粒子运动速度
- `speed`: 动画速度 (1-10)

#### 3. CyberWaves - 赛博波浪
多层波浪动画，带发光效果。

```tsx
<CyberWaves
  colors={['#00f0ff', '#9d00ff', '#ff0080']}
  waveCount={3}
  amplitude={50}
  frequency={0.01}
  speed={5}
/>
```

**Props:**
- `colors`: 波浪颜色数组
- `waveCount`: 波浪层数
- `amplitude`: 波浪振幅
- `frequency`: 波浪频率
- `speed`: 动画速度 (1-10)

#### 4. NeonGrid - 霓虹网格
3D 透视网格动画。

```tsx
<NeonGrid
  color="#00f0ff"
  gridSize={40}
  perspective={500}
  speed={5}
/>
```

**Props:**
- `color`: 网格颜色
- `gridSize`: 网格单元大小
- `perspective`: 透视强度
- `speed`: 动画速度 (1-10)

#### 5. Starfield - 星空穿越
星空穿越效果。

```tsx
<Starfield
  starCount={200}
  colors={['#ffffff', '#00f0ff', '#9d00ff']}
  starSpeed={2}
  speed={5}
/>
```

**Props:**
- `starCount`: 星星数量
- `colors`: 星星颜色数组
- `starSpeed`: 星星移动速度
- `speed`: 动画速度 (1-10)

#### 6. GlitchBackground - 故障效果
赛博朋克故障效果背景。

```tsx
<GlitchBackground
  intensity={5}
  primaryColor="#00f0ff"
  secondaryColor="#ff0080"
  speed={5}
/>
```

**Props:**
- `intensity`: 故障强度
- `primaryColor`: 主色调
- `secondaryColor`: 次色调
- `speed`: 动画速度 (1-10)

---

## 📊 DataVizIcons - 数据可视化图标

### 导入
```tsx
import {
  ChartIcon,
  ProgressRingIcon,
  GaugeIcon,
  PulseIcon,
  WaveformIcon,
  DataStreamIcon
} from '@/components/graphics/DataVizIcons';
```

### 组件说明

#### 1. ChartIcon - 通用图表
支持多种图表类型的图标。

```tsx
<ChartIcon
  type="line"
  value={75}
  variant="cyan"
  size={48}
  animated={true}
/>
```

**Props:**
- `type`: 图表类型 (`'line' | 'bar' | 'pie' | 'area'`)
- `value`: 数据值 (0-100)
- `variant`: 颜色变体 (`'cyan' | 'purple' | 'pink' | 'green'`)
- `size`: 图标尺寸
- `animated`: 是否带动画

#### 2. ProgressRingIcon - 进度环
环形进度指示器。

```tsx
<ProgressRingIcon
  progress={75}
  strokeWidth={4}
  variant="cyan"
  size={48}
  animated={true}
/>
```

**Props:**
- `progress`: 进度值 (0-100)
- `strokeWidth`: 环的粗细
- `variant`: 颜色变体
- `size`: 图标尺寸
- `animated`: 是否带动画

#### 3. GaugeIcon - 仪表盘
半圆形仪表盘图标。

```tsx
<GaugeIcon
  value={75}
  min={0}
  max={100}
  variant="cyan"
  size={48}
  animated={true}
/>
```

**Props:**
- `value`: 当前值
- `min`: 最小值
- `max`: 最大值
- `variant`: 颜色变体
- `size`: 图标尺寸
- `animated`: 是否带动画

#### 4. PulseIcon - 脉冲动画
脉冲波纹效果图标。

```tsx
<PulseIcon
  intensity="medium"
  variant="cyan"
  size={48}
  animated={true}
/>
```

**Props:**
- `intensity`: 脉冲强度 (`'low' | 'medium' | 'high'`)
- `variant`: 颜色变体
- `size`: 图标尺寸
- `animated`: 是否带动画

#### 5. WaveformIcon - 波形显示
音频/信号波形显示。

```tsx
<WaveformIcon
  type="sine"
  amplitude={10}
  frequency={3}
  variant="cyan"
  size={48}
  animated={true}
/>
```

**Props:**
- `type`: 波形类型 (`'sine' | 'square' | 'sawtooth' | 'random'`)
- `amplitude`: 振幅
- `frequency`: 频率
- `variant`: 颜色变体
- `size`: 图标尺寸
- `animated`: 是否带动画

#### 6. DataStreamIcon - 数据流
数据流动画图标。

```tsx
<DataStreamIcon
  direction="right"
  dotCount={5}
  variant="cyan"
  size={48}
  animated={true}
/>
```

**Props:**
- `direction`: 流向 (`'left' | 'right' | 'up' | 'down'`)
- `dotCount`: 数据点数量
- `variant`: 颜色变体
- `size`: 图标尺寸
- `animated`: 是否带动画

---

## 🎨 颜色变体参考

所有组件使用统一的颜色系统：

| 变体 | 颜色值 | 用途 |
|------|--------|------|
| `cyan` | `#00f0ff` | 主要操作、信息 |
| `purple` | `#9d00ff` | 次要操作、品牌 |
| `pink` | `#ff0080` | 强调、删除 |
| `green` | `#00ff88` | 成功、确认 |
| `yellow` | `#f0ff00` | 警告、收藏 |
| `red` | `#ff0040` | 危险、错误 |
| `orange` | `#ff8000` | 注意、测试 |

---

## 📐 尺寸参考

### 徽章尺寸
- `sm`: 小号 (px-2 py-0.5 text-xs)
- `md`: 中号 (px-3 py-1 text-sm) - 默认
- `lg`: 大号 (px-4 py-1.5 text-base)

### 图标尺寸
- 默认: 48px
- 推荐范围: 24px - 96px

---

## 🎭 使用示例

### 示例 1: 状态卡片
```tsx
<div className="flex items-center gap-3">
  <StatusBadge status="online" />
  <TechBadge label="ACTIVE" variant="green" />
</div>
```

### 示例 2: 数据展示
```tsx
<div className="flex items-center gap-4">
  <ChartIcon type="bar" value={75} variant="purple" />
  <ProgressRingIcon progress={75} variant="cyan" />
  <GaugeIcon value={75} variant="pink" />
</div>
```

### 示例 3: 功能展示
```tsx
<div className="grid grid-cols-3 gap-4">
  <FeatureBadge
    icon={<ZapIcon />}
    label="快速"
    description="性能提升"
    variant="cyan"
  />
  <FeatureBadge
    icon={<ShieldIcon />}
    label="安全"
    description="端到端加密"
    variant="green"
  />
  <FeatureBadge
    icon={<SparklesIcon />}
    label="智能"
    description="AI 驱动"
    variant="purple"
  />
</div>
```

### 示例 4: 动画背景
```tsx
<div className="relative w-full h-screen">
  <MatrixRain className="absolute inset-0" />
  <div className="relative z-10">
    <h1>Welcome to CyberPress</h1>
  </div>
</div>
```

---

## ⚡ 性能建议

### 动画背景组件
1. **限制使用范围**: 动画背景会消耗较多性能，建议仅在需要的页面使用
2. **调整粒子数量**: 根据设备性能调整 `particleCount`、`starCount` 等参数
3. **使用 CSS 优化**: 添加 `will-change` 和 `transform` 属性优化渲染
4. **检测运动偏好**: 使用 `prefers-reduced-motion` 禁用动画

### 徽章组件
1. **避免过度使用**: 不要在同一个页面使用过多发光效果
2. **合理使用动画**: 仅在需要吸引注意力的场景使用动画
3. **选择合适尺寸**: 根据内容选择合适的尺寸变体

### 数据可视化图标
1. **静态优于动态**: 如果不需要展示变化，使用静态图表
2. **控制动画时长**: 动画时长建议在 1-2 秒之间
3. **提供加载状态**: 数据加载时显示占位符

---

## 🔄 更新日志

### v1.0.0 (2026-03-03)
- ✅ 新增 TechBadges 组件包 (6 个组件)
- ✅ 新增 AnimatedBackgrounds 组件包 (6 个组件)
- ✅ 新增 DataVizIcons 组件包 (6 个组件)
- ✅ 完整的 TypeScript 类型支持
- ✅ 统一的颜色变体系统
- ✅ 详细的文档和使用示例

---

## 📚 相关资源

- [主图形组件索引](./index.ts)
- [设计系统参考](./COLOR_REFERENCE.md)
- [图标清单](../docs/ICON_MANIFEST.md)
- [项目 README](../../README.md)

---

**创建者**: CyberPress AI Design Team
**最后更新**: 2026-03-03
**版本**: 1.0.0
