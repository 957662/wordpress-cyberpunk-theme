# CyberPress Design System

赛博朋克风格设计系统指南

## 配色方案

### 主色调

```css
--cyber-dark: #0a0a0f      /* 主背景色 */
--cyber-darker: #050508    /* 更深的背景 */
--cyber-black: #000000     /* 纯黑 */
```

### 强调色

```css
--cyber-cyan: #00f0ff      /* 霓虹青 - 主强调色 */
--cyber-purple: #9d00ff    /* 赛博紫 - 次强调色 */
--cyber-pink: #ff0080      /* 激光粉 - 警告色 */
--cyber-yellow: #f0ff00    /* 霓虹黄 - 提示色 */
--cyber-green: #00ff88     /* 赛博绿 - 成功色 */
```

### 中性色

```css
--cyber-muted: #1a1a2e     /* 卡片背景 */
--cyber-card: #16162a      /* 更浅的卡片 */
--cyber-border: #2a2a4a    /* 边框颜色 */
```

## 排版

### 字体家族

```css
--font-display: 'Orbitron', sans-serif     /* 标题字体 */
--font-body: 'Inter', system-ui           /* 正文字体 */
--font-mono: 'JetBrains Mono', monospace  /* 代码字体 */
```

### 字体大小

```css
--text-xs: 0.75rem     /* 12px */
--text-sm: 0.875rem    /* 14px */
--text-base: 1rem      /* 16px */
--text-lg: 1.125rem    /* 18px */
--text-xl: 1.25rem     /* 20px */
--text-2xl: 1.5rem     /* 24px */
--text-3xl: 1.875rem   /* 30px */
--text-4xl: 2.25rem    /* 36px */
--text-5xl: 3rem       /* 48px */
--text-6xl: 3.75rem    /* 60px */
```

## 间距

### Spacing Scale

```css
--spacing-1: 0.25rem   /* 4px */
--spacing-2: 0.5rem    /* 8px */
--spacing-3: 0.75rem   /* 12px */
--spacing-4: 1rem      /* 16px */
--spacing-5: 1.25rem   /* 20px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
--spacing-10: 2.5rem   /* 40px */
--spacing-12: 3rem     /* 48px */
--spacing-16: 4rem     /* 64px */
--spacing-20: 5rem     /* 80px */
```

## 圆角

```css
--radius-sm: 0.25rem   /* 4px */
--radius-md: 0.5rem    /* 8px */
--radius-lg: 0.75rem   /* 12px */
--radius-xl: 1rem      /* 16px */
--radius-2xl: 1.5rem   /* 24px */
--radius-full: 9999px  /* 完全圆角 */
```

## 阴影

### 基础阴影

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
```

### 霓虹发光效果

```css
--shadow-neon-cyan:
  0 0 5px #00f0ff,
  0 0 10px #00f0ff,
  0 0 20px #00f0ff;

--shadow-neon-purple:
  0 0 5px #9d00ff,
  0 0 10px #9d00ff,
  0 0 20px #9d00ff;

--shadow-neon-pink:
  0 0 5px #ff0080,
  0 0 10px #ff0080,
  0 0 20px #ff0080;
```

## 动画

### 缓动函数

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### 持续时间

```css
--duration-fast: 150ms
--duration-base: 200ms
--duration-slow: 300ms
--duration-slower: 500ms
```

### 关键动画

```css
@keyframes glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

## 组件样式

### 按钮 (Button)

```tsx
<button className="cyber-button">
  Button Text
</button>
```

变体：
- `.cyber-button` - 基础样式
- `.cyber-button-primary` - 主要按钮
- `.cyber-button-secondary` - 次要按钮
- `.cyber-button-ghost` - 幽灵按钮

### 卡片 (Card)

```tsx
<div className="cyber-card">
  Card Content
</div>
```

特性：
- 悬停时边框发光
- 轻微上移动画
- 内边距 1.5rem
- 圆角 12px

### 输入框 (Input)

```tsx
<input
  className="cyber-input"
  placeholder="Enter text..."
/>
```

状态：
- 默认：边框 `--cyber-border`
- 聚焦：边框 `--cyber-cyan` + 发光效果
- 错误：边框 `--cyber-pink`

## 视觉效果

### 扫描线效果

```css
.scanlines::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 240, 255, 0.03) 2px,
    rgba(0, 240, 255, 0.03) 4px
  );
  pointer-events: none;
}
```

### 网格背景

```css
.cyber-grid {
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

### 故障效果 (Glitch)

```css
.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #00f0ff;
  clip: rect(24px, 550px, 90px, 0);
  animation: glitch-anim-2 3s infinite;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 #ff0080;
  clip: rect(85px, 550px, 140px, 0);
  animation: glitch-anim 2.5s infinite;
}
```

## 响应式断点

```css
--breakpoint-sm: 640px    /* Mobile */
--breakpoint-md: 768px    /* Tablet */
--breakpoint-lg: 1024px   /* Desktop */
--breakpoint-xl: 1280px   /* Wide */
--breakpoint-2xl: 1536px  /* Extra Wide */
```

## 使用指南

### 1. 颜色使用

优先使用 CSS 变量：

```tsx
<div className="bg-cyber-dark border-cyber-border">
  <h1 className="text-cyber-cyan">Title</h1>
  <p className="text-gray-400">Description</p>
</div>
```

### 2. 发光效果

为元素添加霓虹发光：

```tsx
<div className="shadow-neon-cyan">
  Glowing Content
</div>
```

### 3. 动画

使用 Tailwind 动画类：

```tsx
<motion.div
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
  className="animate-glow"
>
  Animated Content
</motion.div>
```

### 4. 渐变

使用赛博朋克风格渐变：

```tsx
<div className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
  Gradient Content
</div>
```

## 最佳实践

1. **颜色使用**
   - 主背景使用 `cyber-dark`
   - 强调使用 `cyber-cyan` 和 `cyber-purple`
   - 警告使用 `cyber-pink`

2. **排版**
   - 标题使用 `font-display`
   - 正文使用 `font-body`
   - 代码使用 `font-mono`

3. **间距**
   - 组件内间距使用 4 的倍数
   - 章节间距至少 `spacing-12`

4. **动画**
   - 悬停动画时长 200ms
   - 进入动画时长 300ms
   - 使用 `ease-out` 缓动

5. **可访问性**
   - 确保对比度 >= 4.5:1
   - 为交互元素提供焦点状态
   - 避免仅依赖颜色传达信息

## 资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [赛博朋克设计灵感](https://www.behance.net/search/projects?field=cyberpunk)
