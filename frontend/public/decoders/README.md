# CyberPress Decorators - 赛博装饰元素

## 📁 目录结构

```
frontend/public/decoders/
├── cyber-corner.svg           # 角落装饰
├── cyber-line.svg             # 装饰线条
├── cyber-hexagon.svg          # 六边形装饰
├── cyber-chip.svg             # 芯片装饰
├── cyber-target.svg           # 目标瞄准装饰
├── cyber-wave.svg             # 波形装饰
├── cyber-matrix.svg           # 矩阵数字装饰
├── cyber-divider.svg          # 分隔线
├── cyber-data-stream.svg      # 数据流装饰
└── cyber-circuit-board.svg    # 电路板装饰
```

## 🎨 使用指南

### 导入方式

```tsx
// 作为背景图片
<div style={{ backgroundImage: 'url(/decoders/cyber-corner.svg)' }} />

// 作为 Image 组件
<Image src="/decoders/cyber-line.svg" alt="装饰线" width={200} height={20} />

// 作为 SVG 直接嵌入（推荐用于可缩放场景）
import CyberCorner from '/decoders/cyber-corner.svg';
```

### 装饰元素说明

#### cyber-corner.svg - 角落装饰
**用途**: 卡片角落、区块边界装饰
**尺寸**: 100x100
**特点**: 渐变色、电路元素、装饰节点

```tsx
<div className="relative">
  <img src="/decoders/cyber-corner.svg" alt="" className="absolute top-0 left-0" />
  {/* 内容 */}
</div>
```

#### cyber-line.svg - 装饰线条
**用途**: 内容分隔、区块边界
**尺寸**: 200x20
**特点**: 渐变效果、节点装饰

```tsx
<hr className="border-0 bg-transparent" />
<img src="/decoders/cyber-line.svg" alt="" className="w-full" />
```

#### cyber-hexagon.svg - 六边形装饰
**用途**: 背景装饰、科技感元素
**尺寸**: 120x120
**特点**: 双层六边形、中心发光点

#### cyber-chip.svg - 芯片装饰
**用途**: 技术区块、开发者相关内容
**尺寸**: 100x100
**特点**: 完整芯片外观、引脚细节

#### cyber-target.svg - 目标瞄准
**用途**: 目标展示、焦点强调
**尺寸**: 100x100
**特点**: 同心圆、十字准星、角落标记

#### cyber-wave.svg - 波形装饰
**用途**: 数据展示、音频相关、动感效果
**尺寸**: 200x60
**特点**: 三色渐变、多层波形、网格装饰

#### cyber-matrix.svg - 矩阵数字
**用途**: 编程相关、技术背景
**尺寸**: 100x100
**特点**: 0/1 数字矩阵、渐变色

#### cyber-divider.svg - 分隔线
**用途**: 内容分隔、章节划分
**尺寸**: 400x40
**特点**: 箭头装饰、中心方块、渐变效果

```tsx
<div className="flex items-center justify-center my-8">
  <img src="/decoders/cyber-divider.svg" alt="" className="w-full max-w-2xl" />
</div>
```

#### cyber-data-stream.svg - 数据流
**用途**: 数据传输、网络相关
**尺寸**: 200x100
**特点**: 数据包、连接线、节点

#### cyber-circuit-board.svg - 电路板
**用途**: 技术背景、硬件相关
**尺寸**: 200x200
**特点**: 完整电路板、芯片、路径连接

## 🎯 CSS 集成示例

### 作为背景

```css
.cyber-card {
  position: relative;
  background: #16162a;
  border: 1px solid #2a2a4a;
}

.cyber-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-image: url('/decoders/cyber-corner.svg');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.6;
}
```

### 作为伪元素装饰

```css
.cyber-section::after {
  content: '';
  display: block;
  width: 100%;
  height: 40px;
  background-image: url('/decoders/cyber-divider.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin: 2rem 0;
}
```

## 🎨 Tailwind 集成

### 使用 background-image

```tsx
<div className="relative p-6 bg-cyber-card border border-cyber-border">
  <div
    className="absolute top-0 right-0 w-24 h-24 opacity-50"
    style={{ backgroundImage: 'url(/decoders/cyber-corner.svg)' }}
  />
  <h2>Section Title</h2>
  <p>Content here...</p>
</div>
```

### 使用 img 标签

```tsx
<div className="my-8">
  <img
    src="/decoders/cyber-divider.svg"
    alt=""
    className="w-full max-w-3xl mx-auto"
  />
</div>
```

### 使用 Next.js Image 组件

```tsx
import Image from 'next/image';

<Image
  src="/decoders/cyber-hexagon.svg"
  alt="六边形装饰"
  width={120}
  height={120}
  className="opacity-30"
/>
```

## 🎭 动画效果

### 旋转动画

```css
@keyframes slow-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.cyber-hexagon-animated {
  animation: slow-spin 20s linear infinite;
}
```

### 发光脉冲

```css
@keyframes glow-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.cyber-target-animated {
  animation: glow-pulse 3s ease-in-out infinite;
}
```

### 数据流动画

```css
@keyframes data-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.cyber-data-animated {
  animation: data-flow 5s linear infinite;
}
```

## 🎯 使用场景

### 1. 卡片装饰

```tsx
<div className="cyber-card">
  <img src="/decoders/cyber-corner.svg" className="absolute top-0 left-0" />
  <img src="/decoders/cyber-corner.svg" className="absolute top-0 right-0 transform rotate-90" />
  <img src="/decoders/cyber-corner.svg" className="absolute bottom-0 right-0 transform rotate-180" />
  <img src="/decoders/cyber-corner.svg" className="absolute bottom-0 left-0 transform -rotate-90" />
  {/* 卡片内容 */}
</div>
```

### 2. 分隔线

```tsx
<div className="my-12">
  <img src="/decoders/cyber-divider.svg" alt="" className="w-full" />
</div>
```

### 3. 技术背景

```tsx
<div className="relative overflow-hidden">
  <img
    src="/decoders/cyber-circuit-board.svg"
    alt=""
    className="absolute inset-0 w-full h-full opacity-10"
  />
  <div className="relative z-10">
    {/* 内容 */}
  </div>
</div>
```

### 4. 数据展示

```tsx
<div className="flex items-center gap-4">
  <img src="/decoders/cyber-data-stream.svg" alt="" className="w-48" />
  <div>
    <h3>实时数据流</h3>
    <p>Data streaming in real-time</p>
  </div>
</div>
```

## 🎨 自定义颜色

如果你需要修改装饰元素的颜色，可以通过 CSS 滤镜：

```css
/* 改变颜色 */
.cyber-decorator-red {
  filter: hue-rotate(180deg);
}

.cyber-decorator-green {
  filter: hue-rotate(90deg);
}

/* 调整亮度 */
.cyber-decorator-bright {
  filter: brightness(1.5);
}

/* 调整透明度 */
.cyber-decorator-subtle {
  opacity: 0.3;
}
```

## 📊 性能优化

### 懒加载

```tsx
import Image from 'next/image';

<Image
  src="/decoders/cyber-chip.svg"
  alt=""
  loading="lazy"
  width={100}
  height={100}
/>
```

### 内联关键装饰

对于首屏可见的装饰元素，考虑内联 SVG：

```tsx
import CyberCornerInline from '@/components/decorators/CyberCornerInline';

<CyberCornerInline />
```

### 响应式尺寸

```tsx
<img
  src="/decoders/cyber-hexagon.svg"
  alt=""
  className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32"
/>
```

## 🔧 扩展指南

### 创建新装饰元素

1. **设计原则**:
   - 保持赛博朋克风格
   - 使用统一的配色方案
   - 添加发光效果
   - 保持可缩放性

2. **SVG 结构**:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="gradient">
      <!-- 渐变定义 -->
    </linearGradient>
    <filter id="glow">
      <!-- 发光滤镜 -->
    </filter>
  </defs>
  <g filter="url(#glow)">
    <!-- 图形内容 -->
  </g>
</svg>
```

3. **命名规范**:
   - 前缀: `cyber-`
   - 描述性名称: `corner`, `line`, `hexagon`
   - 文件扩展名: `.svg`

## 📋 检查清单

使用装饰元素前请确认：

- [ ] 文件路径正确
- [ ] 尺寸适配当前布局
- [ ] 颜色符合设计规范
- [ ] 响应式测试完成
- [ ] 性能影响评估
- [ ] 可访问性考虑（添加 aria-hidden）

## 🌐 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

**版本**: v1.0.0
**最后更新**: 2026-03-06
**维护者**: CyberPress AI Design Team
