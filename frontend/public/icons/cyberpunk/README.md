# 赛博朋克图标系列

> Cyberpunk Icon Collection - 赛博朋克风格专用图标

## 📦 图标列表

### 🔮 核心图标
- `glitch-art.svg` - 故障艺术图标
- `matrix-code.svg` - 矩阵代码图标
- `cyber-shield.svg` - 赛博盾牌
- `hologram-icon.svg` - 全息图标
- `data-pulse.svg` - 数据脉冲

### 🤖 现有图标
- `microchip.svg` - 微芯片
- `circuit-board.svg` - 电路板
- `neon-grid.svg` - 霓虹网格
- `hologram-display.svg` - 全息显示
- `data-stream.svg` - 数据流
- `robot-eye.svg` - 机械眼
- `quantum-core.svg` - 量子核心
- `neural-network.svg` - 神经网络

---

## 🎨 设计特征

### 视觉元素
- ✅ 霓虹渐变色彩
- ✅ 电路纹理装饰
- ✅ 全息投影效果
- ✅ 故障艺术风格
- ✅ 矩阵代码元素

### 颜色方案
```css
/* 主色渐变 */
linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)

/* 三色渐变 */
linear-gradient(90deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)

/* 单色发光 */
box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff
```

---

## 🚀 使用方法

### 直接导入
```tsx
import Image from 'next/image';

<Image
  src="/icons/cyberpunk/glitch-art.svg"
  alt="Glitch Art"
  width={24}
  height={24}
/>
```

### 作为组件使用
```tsx
// 创建组件
import GlitchArtIcon from '/icons/cyberpunk/glitch-art.svg';

export default function Component() {
  return (
    <GlitchArtIcon className="w-6 h-6 text-cyber-cyan" />
  );
}
```

### 自定义样式
```tsx
<Image
  src="/icons/cyberpunk/cyber-shield.svg"
  alt="Cyber Shield"
  width={48}
  height={48}
  style={{
    filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.8))',
    animation: 'pulse 2s infinite'
  }}
/>
```

---

## 🎯 应用场景

### 页面装饰
```tsx
<div className="relative">
  <h1 className="text-4xl font-bold">标题</h1>
  <Image
    src="/icons/cyberpunk/glitch-art.svg"
    alt=""
    className="absolute -right-8 -top-4 w-16 h-16 opacity-20"
    width={64}
    height={64}
  />
</div>
```

### 功能图标
```tsx
<button className="flex items-center gap-2">
  <Image
    src="/icons/cyberpunk/matrix-code.svg"
    alt="Code"
    width={20}
    height={20}
    className="text-cyber-cyan"
  />
  <span>查看代码</span>
</button>
```

### 状态指示
```tsx
<div className="flex items-center gap-2">
  <div className="relative">
    <Image
      src="/icons/cyberpunk/quantum-core.svg"
      alt="Processing"
      width={24}
      height={24}
      className="animate-spin"
    />
  </div>
  <span className="text-sm">处理中...</span>
</div>
```

---

## ✨ 动画效果

### 旋转动画
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

### 脉冲动画
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### 故障动画
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
  animation: glitch 0.3s infinite;
}
```

---

## 🎨 颜色变体

### 青色主题
```tsx
<Image
  src="/icons/cyberpunk/hologram-icon.svg"
  alt=""
  style={{ filter: 'brightness(0) saturate(100%) invert(70%) sepia(100%) saturate(500%) hue-rotate(130deg)' }}
/>
```

### 紫色主题
```tsx
<Image
  src="/icons/cyberpunk/neural-network.svg"
  alt=""
  style={{ filter: 'brightness(0) saturate(100%) invert(40%) sepia(100%) saturate(500%) hue-rotate(220deg)' }}
/>
```

### 粉色主题
```tsx
<Image
  src="/icons/cyberpunk/data-pulse.svg"
  alt=""
  style={{ filter: 'brightness(0) saturate(100%) invert(50%) sepia(100%) saturate(500%) hue-rotate(300deg)' }}
/>
```

---

## 📐 尺寸变体

```tsx
// 小尺寸
<Image src="/icons/cyberpunk/glitch-art.svg" width={16} height={16} />

// 标准
<Image src="/icons/cyberpunk/glitch-art.svg" width={24} height={24} />

// 大尺寸
<Image src="/icons/cyberpunk/glitch-art.svg" width={32} height={32} />

// 超大
<Image src="/icons/cyberpunk/glitch-art.svg" width={48} height={48} />

// 装饰性
<Image src="/icons/cyberpunk/glitch-art.svg" width={64} height={64} />
```

---

## 🌐 组合使用

### 图标组
```tsx
<div className="flex gap-4">
  <Image src="/icons/cyberpunk/microchip.svg" width={32} height={32} />
  <Image src="/icons/cyberpunk/circuit-board.svg" width={32} height={32} />
  <Image src="/icons/cyberpunk/quantum-core.svg" width={32} height={32} />
</div>
```

### 装饰背景
```tsx
<div className="relative overflow-hidden">
  <Image
    src="/icons/cyberpunk/neon-grid.svg"
    alt=""
    fill
    className="opacity-10 object-cover"
  />
  <div className="relative z-10">
    {/* 内容 */}
  </div>
</div>
```

---

## 📝 最佳实践

1. **性能优化**: 使用 `priority` 属性预加载重要图标
2. **可访问性**: 始终添加有意义的 `alt` 文本
3. **响应式**: 使用 `sizes` 属性优化加载
4. **动画**: 适度使用动画效果，避免过度
5. **颜色**: 保持配色一致性

---

## 🔄 更新日志

### v1.0.0 (2026-03-07)
- ✨ 新增 5 个赛博朋克图标
- ✨ 完整的使用文档
- ✨ 动画效果示例
- ✨ 颜色变体方案

---

**维护者**: CyberPress AI Design Team
**风格**: Cyberpunk / Sci-Fi
**年份**: 2026