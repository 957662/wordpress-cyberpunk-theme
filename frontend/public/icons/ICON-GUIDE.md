# CyberPress 图标使用指南

## 📦 新增赛博朋克风格图标

### 科技系列 (Tech Series)
| 图标 | 文件名 | 描述 | 用途 |
|------|--------|------|------|
| ⬡ | `tech-hexagon.svg` | 科技六边形 | 技术标签、分类 |
| 🔲 | `cyber-grid.svg` | 赛博网格 | 网格视图、布局 |
| 🕸️ | `neural-network.svg` | 神经网络 | AI、机器学习 |
| 👁️ | `cyber-eye.svg` | 赛博之眼 | 监控、分析 |
| 📊 | `data-stream.svg` | 数据流 | 数据传输、处理 |
| ⚡ | `circuit-pulse.svg` | 电路脉冲 | 能量、电源 |
| 💠 | `quantum-chip.svg` | 量子芯片 | 高级计算、量子 |
| 🖥️ | `holo-display.svg` | 全息显示 | AR/VR、投影 |
| 🔒 | `security-shield.svg` | 安全护盾 | 安全、加密 |
| 💀 | `cyber-skull.svg` | 赛博骷髅 | 骇客、暗网 |
| 👆 | `cursor-cyber.svg` | 赛博光标 | 点击、交互 |
| 🖥️ | `cpu-unit.svg` | CPU单元 | 处理器、计算 |
| 📟 | `memory-chip.svg` | 内存芯片 | 存储、内存 |
| 🌐 | `globe-network.svg` | 网络地球 | 网络、连接 |
| 💻 | `binary-code.svg` | 二进制代码 | 编程、代码 |

### 装饰系列 (Decorations)
| 元素 | 文件名 | 描述 | 用途 |
|------|--------|------|------|
| ✨ | `glow-line.svg` | 发光线 | 分隔线、装饰 |
| 🔲 | `corner-decor.svg` | 角落装饰 | 卡片装饰、边框 |
| ⬡ | `hex-pattern.svg` | 六边形图案 | 背景纹理 |

### 插画系列 (Illustrations)
| 插画 | 文件名 | 描述 | 用途 |
|------|--------|------|------|
| 🌃 | `cyber-landscape.svg` | 赛博城市景观 | 英雄区域、背景 |

## 🎨 使用方法

### 在 React 组件中使用

```tsx
import Image from 'next/image';

// 基础用法
<Image
  src="/icons/tech-hexagon.svg"
  alt="Tech Hexagon"
  width={24}
  height={24}
/>

// 带样式
<Image
  src="/icons/cyber-eye.svg"
  alt="Cyber Eye"
  width={48}
  height={48}
  className="hover:scale-110 transition-transform"
/>

// 作为背景
<div
  className="absolute inset-0 opacity-20"
  style={{
    backgroundImage: 'url("/patterns/hex-pattern.svg")',
  }}
/>
```

### 在 CSS 中使用

```css
/* 背景图案 */
.cyber-pattern {
  background-image: url('/patterns/hex-pattern.svg');
  background-repeat: repeat;
}

/* 装饰元素 */
.corner-accent {
  background-image: url('/decorations/corner-decor.svg');
  background-position: top left;
  background-repeat: no-repeat;
}

/* 发光效果分隔线 */
.glow-divider {
  background-image: url('/decorations/glow-line.svg');
  background-repeat: no-repeat;
  background-position: center;
  height: 4px;
}
```

### SVG 内联使用（适合动画）

```tsx
const CyberIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
    {/* SVG 内容 */}
  </svg>
);
```

## 🔧 自定义颜色

所有 SVG 图标都使用了 CSS 变量或直接颜色值。你可以通过修改 `stroke` 或 `fill` 属性来自定义颜色：

```svg
<!-- 修改颜色 -->
<circle cx="12" cy="12" r="5"
        stroke="#your-color"
        fill="your-fill-color"/>
```

## 🎬 动画支持

部分图标包含内置 SVG 动画：

- **脉冲效果**: `cyber-eye.svg`, `tech-hexagon.svg`
- **流动效果**: `data-stream.svg`
- **闪烁效果**: `circuit-pulse.svg`, `neural-network.svg`
- **扫描效果**: `holo-display.svg`

这些动画会自动播放，无需额外配置。

## 📐 尺寸建议

```tsx
// 小图标 (按钮、列表)
width={16} height={16}

// 标准图标 (导航、工具栏)
width={24} height={24}

// 大图标 (英雄区域、强调)
width={32} height={32}

// 超大图标 (插画、装饰)
width={48} height={48}
width={64} height={64}
```

## 🌈 颜色主题

所有图标都遵循赛博朋克配色方案：

- **主色**: `#00f0ff` (霓虹青)
- **次色**: `#9d00ff` (赛博紫)
- **强调色**: `#ff0080` (激光粉)

可以通过 CSS 变量全局修改：

```css
:root {
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
  --cyber-pink: #ff0080;
}
```

## 🚀 性能优化

1. **使用 Next.js Image 组件** - 自动优化
2. **SVG 内联** - 适合小图标和动画
3. **图标雪碧图** - 减少请求数量
4. **懒加载** - 大型插画延迟加载

## 📝 注意事项

- 所有图标都包含发光效果滤镜
- 部分图标有内置动画，会自动播放
- 建议在深色背景下使用以获得最佳效果
- 可以通过修改 `stroke-width` 调整线条粗细

---

**更新日期**: 2026-03-03
**版本**: v1.0.0