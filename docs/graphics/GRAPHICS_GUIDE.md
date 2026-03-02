# CyberPress Platform - 图形设计规范

## 📋 设计系统概览

CyberPress 平台采用统一的赛博朋克风格图形设计系统，确保所有视觉元素保持一致性。

## 🎨 设计原则

### 1. 赛博朋克美学
- **未来感**: 使用科技感的图形元素
- **霓虹效果**: 发光、渐变和高对比度
- **数字元素**: 电路板、网格、扫描线等
- **深色主题**: 深色背景配合亮色元素

### 2. 视觉层次
- **主要元素**: 使用霓虹青 (#00f0ff)
- **次要元素**: 使用赛博紫 (#9d00ff)
- **强调元素**: 使用激光粉 (#ff0080)
- **背景元素**: 使用深色系

### 3. 一致性
- **图标风格**: 统一的线条粗细和圆角
- **间距系统**: 使用 4px 基础网格
- **动画效果**: 标准化的过渡和缓动函数

## 🎨 图形元素分类

### 1. Logo 系统
详见 [LOGO_GUIDE.md](./LOGO_GUIDE.md)

### 2. 图标系统
详见 [ICONS.md](./ICONS.md)

### 3. 背景图案

#### 网格图案
```css
/* 细网格 */
background-image: url('/patterns/grid.svg');

/* 六边形网格 */
background-image: url('/patterns/hex-grid.svg');

/* 电路板 */
background-image: url('/patterns/circuit.svg');
```

#### 扫描线效果
```css
/* 扫描线叠加 */
background-image: url('/patterns/scanlines.svg');
pointer-events: none;
opacity: 0.05;
```

#### 噪点纹理
```css
/* 噪点叠加 */
background-image: url('/patterns/noise.svg');
opacity: 0.03;
mix-blend-mode: overlay;
```

#### 矩阵效果
```css
/* 矩阵雨背景 */
background-image: url('/patterns/matrix.svg');
```

#### 全息效果
```css
/* 全息纹理 */
background-image: url('/patterns/holographic.svg');
```

### 4. 装饰元素

#### 边框装饰
```tsx
// 角落括号
<Image src="/decorations/corner-bracket.svg" alt="" className="absolute" />

// 分割线
<Image src="/decorations/divider-line.svg" alt="" className="w-full" />
```

#### 加载动画
```tsx
// 加载环
<Image src="/decorations/loader-ring.svg" alt="Loading..." className="animate-spin" />
```

### 5. 插画系统

#### 技术插画
- `server-rack.svg` - 服务器机架
- `code-screen.svg` - 代码屏幕
- `circuit-board.svg` - 电路板
- `network-globe.svg` - 网络地球
- `cyber-city.svg` - 赛博城市
- `developer-workspace.svg` - 开发工作空间
- `network-nodes.svg` - 网络节点

### 6. 背景图形

#### Hero 背景
```tsx
// 首页大背景
<Image
  src="/backgrounds/hero-bg.svg"
  alt=""
  fill
  className="object-cover -z-10"
/>
```

#### 卡片背景
```tsx
// 卡片背景纹理
<div className="bg-[url('/backgrounds/card-bg.svg')] bg-cover">
  {/* 内容 */}
</div>
```

#### 加载背景
```tsx
// 加载页背景
<Image src="/backgrounds/loading-bg.svg" alt="" className="fixed inset-0" />
```

#### 404 背景
```tsx
// 错误页背景
<Image src="/backgrounds/404-bg.svg" alt="" fill />
```

## 🔧 实用组件

### 1. 发光边框组件
```tsx
interface NeonBorderProps {
  color?: 'cyan' | 'purple' | 'pink' | 'yellow';
  children: React.ReactNode;
}

export function NeonBorder({ color = 'cyan', children }: NeonBorderProps) {
  const colorMap = {
    cyan: 'border-cyber-cyan shadow-neon-cyan',
    purple: 'border-cyber-purple shadow-neon-purple',
    pink: 'border-cyber-pink shadow-neon-pink',
    yellow: 'border-cyber-yellow shadow-neon-yellow',
  };

  return (
    <div className={`border-2 ${colorMap[color]} p-1`}>
      {children}
    </div>
  );
}
```

### 2. 故障文字效果
```tsx
interface GlitchTextProps {
  text: string;
  color?: 'cyan' | 'purple' | 'pink';
}

export function GlitchText({ text, color = 'cyan' }: GlitchTextProps) {
  return (
    <span className="relative inline-block">
      <span className="relative z-10">{text}</span>
      <span
        className={`absolute inset-0 z-0 opacity-50 ${
          color === 'cyan' ? 'text-cyber-cyan' : ''
        }`}
        style={{
          animation: 'glitch 0.3s infinite',
        }}
      >
        {text}
      </span>
    </span>
  );
}
```

### 3. 全息卡片
```tsx
interface HolographicCardProps {
  children: React.ReactNode;
}

export function HolographicCard({ children }: HolographicCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-cyber-border bg-cyber-card">
      {/* 全息背景 */}
      <div className="absolute inset-0 bg-[url('/patterns/holographic.svg')] opacity-10" />
      {/* 内容 */}
      <div className="relative z-10 p-6">{children}</div>
      {/* 扫描线 */}
      <div className="absolute inset-0 bg-[url('/patterns/scanlines.svg')] opacity-5 pointer-events-none" />
    </div>
  );
}
```

## 🎬 动画规范

### 过渡时长
```css
/* 快速交互 */
transition-duration: 150ms;

/* 标准交互 */
transition-duration: 300ms;

/* 复杂动画 */
transition-duration: 500ms;

/* 缓慢动画 */
transition-duration: 1000ms;
```

### 缓动函数
```css
/* 优雅进入 */
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);

/* 快速退出 */
transition-timing-function: cubic-bezier(0, 0, 0.2, 1);

/* 弹跳效果 */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 常用动画组合
```tsx
// 悬停放大
className="hover:scale-105 transition-transform duration-300"

// 悬停发光
className="hover:shadow-neon-cyan transition-shadow duration-300"

// 淡入动画
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.5 }}

// 滑入动画
initial={{ y: 20, opacity: 0 }}
animate={{ y: 0, opacity: 1 }}
transition={{ duration: 0.5 }}
```

## 📐 尺寸规范

### 间距系统
使用 4px 基础单位：

```css
/* Tailwind 类 */
/* 4px */  p-1
/* 8px */  p-2
/* 12px */ p-3
/* 16px */ p-4
/* 24px */ p-6
/* 32px */ p-8
/* 48px */ p-12
/* 64px */ p-16
```

### 图标尺寸
```tsx
// 极小
w-3 h-3  // 12px

// 小
w-4 h-4  // 16px

// 标准
w-5 h-5  // 20px
w-6 h-6  // 24px

// 中等
w-8 h-8  // 32px

// 大
w-10 h-10  // 40px
w-12 h-12  // 48px

// 超大
w-16 h-16  // 64px
```

### 圆角规范
```css
/* 小圆角 */
rounded-sm   /* 2px */
rounded      /* 4px */
rounded-md   /* 6px */

/* 标准圆角 */
rounded-lg   /* 8px */
rounded-xl   /* 12px */

/* 大圆角 */
rounded-2xl  /* 16px */
rounded-3xl  /* 24px */

/* 完全圆角 */
rounded-full /* 50% */
```

## 🎨 视觉效果清单

### 发光效果
- [x] 霓虹青发光
- [x] 赛博紫发光
- [x] 激光粉发光
- [x] 电压黄发光

### 动画效果
- [x] 悬停放大
- [x] 发光脉冲
- [x] 故障效果
- [x] 扫描线
- [x] 粒子效果

### 图案纹理
- [x] 网格
- [x] 六边形
- [x] 电路板
- [x] 扫描线
- [x] 噪点
- [x] 矩阵
- [x] 全息

## 🔨 创建新图形

### SVG 模板
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <defs>
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <g filter="url(#neonGlow)">
    <!-- 图标路径 -->
  </g>
</svg>
```

### 设计流程
1. **草图**: 确定功能和风格
2. **矢量绘制**: 使用 24x24 网格
3. **应用效果**: 添加发光和渐变
4. **测试**: 在不同背景下验证
5. **导出**: 优化 SVG 代码

## 📦 资源文件结构

```
frontend/public/
├── assets/
│   └── logo/
│       ├── cyberpress-logo.svg
│       ├── cyberpress-favicon.svg
│       └── cyberpress-icon.svg
├── backgrounds/
│   ├── hero-bg.svg
│   ├── card-bg.svg
│   ├── loading-bg.svg
│   └── 404-bg.svg
├── decorations/
│   ├── corner-bracket.svg
│   ├── divider-line.svg
│   └── loader-ring.svg
├── icons/
│   ├── home.svg
│   ├── blog.svg
│   └── ...
├── illustrations/
│   ├── server-rack.svg
│   ├── code-screen.svg
│   └── ...
├── patterns/
│   ├── grid.svg
│   ├── circuit.svg
│   └── ...
├── logo.svg
├── logo-main.svg
├── logo-icon.svg
├── logo-square.svg
├── logo-favicon.svg
└── og-image.svg
```

## ✅ 质量检查清单

创建新图形时确保：
- [ ] SVG 代码已优化（无冗余）
- [ ] 视图框正确设置
- [ ] 颜色符合品牌规范
- [ ] 在深色背景上清晰可见
- [ ] 在最小尺寸下可识别
- [ ] 文件命名清晰
- [ ] 已添加到文档

## 🔗 相关文档

- [配色参考](./COLOR_PALETTE.md)
- [图标清单](./ICONS.md)
- [Logo 使用指南](./LOGO_GUIDE.md)

---

**最后更新**: 2026-03-03
**维护者**: CyberPress 设计团队
