# CyberPress Pattern Library - 背景图案库

## 📁 目录结构

```
frontend/public/
├── patterns/
│   ├── grid.svg          # 网格图案
│   ├── scanlines.svg     # 扫描线图案
│   ├── circuit.svg       # 电路图案
│   ├── hexagon.svg       # 六边形图案
│   └── noise.svg         # 噪点图案
├── backgrounds/
│   ├── hero-bg.svg       # 英雄区背景
│   ├── card-bg.svg       # 卡片背景
│   └── loading-bg.svg    # 加载背景
└── README-GRAPHICS.md    # 图形素材总览
```

## 🎨 图案说明

### 1. Grid Pattern (网格图案)
**文件**: `patterns/grid.svg`
**用途**: 页面背景、装饰性网格
**特点**: 经典赛博朋克网格 + 角标装饰

**使用示例**:
```css
.hero-section {
  background-image: url('/patterns/grid.svg');
  background-repeat: repeat;
}
```

### 2. Scanlines Pattern (扫描线图案)
**文件**: `patterns/scanlines.svg`
**用途**: 复古 CRT 效果、视频覆盖
**特点**: 水平扫描线 + 低透明度

**使用示例**:
```css
.video-overlay {
  background-image: url('/patterns/scanlines.svg');
  background-repeat: repeat;
  pointer-events: none;
}
```

### 3. Circuit Pattern (电路图案)
**文件**: `patterns/circuit.svg`
**用途**: 科技感装饰、页脚背景
**特点**: 电路路径 + 节点装饰

**使用示例**:
```css
.footer {
  background-image: url('/patterns/circuit.svg');
  background-repeat: repeat;
}
```

### 4. Hexagon Pattern (六边形图案)
**文件**: `patterns/hexagon.svg`
**用途**: 蜂窝结构、科技背景
**特点**: 六边形网格 + 卫星节点

**使用示例**:
```css
.tech-section {
  background-image: url('/patterns/hexagon.svg');
  background-repeat: repeat;
}
```

### 5. Noise Pattern (噪点图案)
**文件**: `patterns/noise.svg`
**用途**: 纹理叠加、质感增强
**特点**: 分形噪点 + 微妙透明

**使用示例**:
```css
.texture-overlay {
  background-image: url('/patterns/noise.svg');
  background-repeat: repeat;
  mix-blend-mode: overlay;
}
```

## 🌌 背景说明

### 1. Hero Background (英雄区背景)
**文件**: `backgrounds/hero-bg.svg`
**尺寸**: 1920x1080
**用途**: 首页英雄区、大型展示区
**特点**:
- 渐变发光球体（带动画）
- 网格叠加
- 电路装饰线
- 浮动粒子
- 暗角效果

**使用示例**:
```tsx
<section className="relative h-screen">
  <Image
    src="/backgrounds/hero-bg.svg"
    alt="Hero Background"
    fill
    className="object-cover"
    priority
  />
  <div className="relative z-10">
    {/* 内容 */}
  </div>
</section>
```

### 2. Card Background (卡片背景)
**文件**: `backgrounds/card-bg.svg`
**尺寸**: 400x300
**用途**: 博客卡片、作品集卡片
**特点**:
- 渐变背景
- 角标装饰
- 顶部强调线
- 电路点缀

**使用示例**:
```tsx
<div className="bg-[url('/backgrounds/card-bg.svg')] bg-cover p-6 rounded-lg">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### 3. Loading Background (加载背景)
**文件**: `backgrounds/loading-bg.svg`
**尺寸**: 100x100
**用途**: 加载动画、等待状态
**特点**:
- 旋转环动画
- 渐变颜色循环
- 中心脉冲
- 轨道粒子

**使用示例**:
```tsx
<div className="flex items-center justify-center">
  <Image
    src="/backgrounds/loading-bg.svg"
    alt="Loading"
    width={100}
    height={100}
    className="animate-spin"
  />
</div>
```

## 🎯 使用建议

### 性能优化
```tsx
// 非首屏背景使用低优先级
<Image
  src="/patterns/grid.svg"
  alt="Grid Pattern"
  fill
  className="object-cover"
  priority={false} // 延迟加载
/>

// 首屏背景使用高优先级
<Image
  src="/backgrounds/hero-bg.svg"
  alt="Hero Background"
  fill
  className="object-cover"
  priority={true} // 立即加载
/>
```

### CSS 组合使用
```css
/* 多图案叠加 */
.cyber-background {
  background-color: #0a0a0f;
  background-image:
    url('/patterns/grid.svg'),
    url('/patterns/noise.svg');
  background-blend-mode: normal, overlay;
}

/* 渐变 + 图案 */
.gradient-with-pattern {
  background:
    linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(157, 0, 255, 0.1) 100%),
    url('/patterns/circuit.svg');
}
```

### 响应式使用
```css
/* 移动端简化背景 */
@media (max-width: 768px) {
  .hero-section {
    background-image: none;
    background-color: #0a0a0f;
  }
}

/* 桌面端完整背景 */
@media (min-width: 769px) {
  .hero-section {
    background-image: url('/backgrounds/hero-bg.svg');
  }
}
```

## 🔧 自定义修改

### 调整透明度
```svg
<!-- 在 SVG 文件中修改 opacity 属性 -->
<rect opacity="0.1" /> <!-- 降低透明度 -->
<rect opacity="0.3" /> <!-- 提高透明度 -->
```

### 修改颜色
```svg
<!-- 替换颜色值 -->
<stop stop-color="#00f0ff" /> <!-- 霓虹青 -->
<stop stop-color="#ff0000" /> <!-- 改为红色 -->
```

### 调整动画速度
```svg
<!-- 修改 dur 属性 -->
<animate dur="1s" />  <!-- 1秒 -->
<animate dur="3s" />  <!-- 3秒（更慢） -->
```

## 📋 最佳实践

1. **文件大小**: 所有 SVG 已优化，文件大小 < 50KB
2. **缓存策略**: 背景文件会被浏览器缓存
3. **渐进增强**: 先显示纯色，再加载图案
4. **可访问性**: 背景不应影响文本可读性
5. **性能监控**: 使用 Lighthouse 检查性能影响

## 🌐 浏览器支持

- ✅ SVG 基本功能: 所有现代浏览器
- ✅ SVG 动画: IE11+ (除 SMIL 动画)
- ✅ CSS 背景: 所有现代浏览器
- ⚠️ SVG 滤镜: 部分移动浏览器性能较差

---

**版本**: v1.0.0
**最后更新**: 2026-03-02
**设计团队**: CyberPress AI Design Team
