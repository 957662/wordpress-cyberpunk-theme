# CyberPress 动画指南

本文档提供了 CyberPress 平台中使用的动画效果的完整指南。

## 📖 目录

- [动画类型](#动画类型)
- [CSS 动画](#css-动画)
- [SVG 动画](#svg-动画)
- [Framer Motion 动画](#framer-motion-动画)
- [性能优化](#性能优化)
- [最佳实践](#最佳实践)

## 🎭 动画类型

CyberPress 平台支持以下几种动画类型：

1. **CSS 动画** - 使用 CSS @keyframes
2. **SVG 动画** - 使用 SMIL 或 CSS 操作 SVG
3. **Framer Motion** - React 动画库
4. **CSS Transitions** - 简单的状态转换

## 🎨 CSS 动画

### 发光效果

```css
@keyframes glow {
  0% {
    box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;
  }
  50% {
    box-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff;
  }
  100% {
    box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;
  }
}

/* 使用 */
.animated-glow {
  animation: glow 2s ease-in-out infinite;
}
```

### 浮动效果

```css
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 使用 */
.animated-float {
  animation: float 6s ease-in-out infinite;
}
```

### 脉冲效果

```css
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* 使用 */
.animated-pulse {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

### 故障效果

```css
@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

/* 使用 */
.animated-glitch {
  animation: glitch 1s linear infinite;
}
```

### 扫描效果

```css
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

/* 使用 */
.animated-scan {
  animation: scan 3s linear infinite;
}
```

### 打字机效果

```css
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: #00f0ff;
  }
}

/* 使用 */
.typewriter {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #00f0ff;
  animation:
    typing 3.5s steps(40, end),
    blink-caret 0.75s step-end infinite;
}
```

### 渐变动画

```css
@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 使用 */
.animated-gradient {
  background: linear-gradient(45deg, #00f0ff, #9d00ff, #ff0080, #f0ff00);
  background-size: 300% 300%;
  animation: gradient-shift 5s ease infinite;
}
```

## 🖼️ SVG 动画

### 使用 SMIL 动画

```tsx
<svg viewBox="0 0 100 100">
  {/* 脉冲圆圈 */}
  <circle cx="50" cy="50" r="20" fill="#00f0ff">
    <animate
      attributeName="r"
      values="20;30;20"
      dur="2s"
      repeatCount="indefinite"
    />
    <animate
      attributeName="opacity"
      values="1;0.5;1"
      dur="2s"
      repeatCount="indefinite"
    />
  </circle>

  {/* 旋转图标 */}
  <g transform-origin="50 50">
    <path d="..." stroke="#9d00ff">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 50 50"
        to="360 50 50"
        dur="10s"
        repeatCount="indefinite"
      />
    </path>
  </g>

  {/* 路径动画 */}
  <circle r="3" fill="#ff0080">
    <animateMotion
      dur="3s"
      repeatCount="indefinite"
      path="M10,50 Q25,25 40,50 T70,50"
    />
  </circle>
</svg>
```

### 使用 CSS 操作 SVG

```tsx
<svg className="animate-spin">
  {/* 内容会自动旋转 */}
</svg>

<svg className="animate-pulse">
  {/* 内容会自动脉冲 */}
</svg>
```

## 🚀 Framer Motion 动画

### 基础动画

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  内容
</motion.div>
```

### 悬停效果

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  按钮
</motion.button>
```

### 滚动动画

```tsx
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
  variants={{
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 100 }
  }}
>
  滚动时显示的内容
</motion.div>
```

### 列表动画

```tsx
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence>
  {items.map(item => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.3 }}
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

### 手势动画

```tsx
<motion.div
  drag
  dragConstraints={{ left: 0, right: 300, top: 0, bottom: 300 }}
  whileDrag={{ scale: 1.1 }}
>
  拖动我
</motion.div>
```

## ⚡ 性能优化

### 使用 transform 和 opacity

```css
/* ✅ 好的做法 - 使用 GPU 加速 */
.animated {
  transform: translateY(10px);
  opacity: 0.5;
}

/* ❌ 避免 - 会触发重排 */
.animated {
  top: 10px;
  width: 100px;
}
```

### 使用 will-change

```css
.animated {
  will-change: transform, opacity;
}
```

### 避免布局抖动

```tsx
// ✅ 好的做法
const [isOpen, setIsOpen] = useState(false);

<motion.div
  animate={{ height: isOpen ? 'auto' : 0 }}
  transition={{ duration: 0.3 }}
>
  内容
</motion.div>

// ❌ 避免
<div style={{ display: isOpen ? 'block' : 'none' }}>
  内容
</div>
```

### 使用 requestAnimationFrame

```tsx
const animate = () => {
  // 动画逻辑
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
```

## 🎯 最佳实践

### 1. 动画时长

```css
/* 快速交互 */
duration-fast: 150ms

/* 标准过渡 */
duration-normal: 300ms

/* 复杂动画 */
duration-slow: 500ms

/* 特殊效果 */
duration-slower: 1000ms
```

### 2. 缓动函数

```css
/* 标准缓动 */
ease: cubic-bezier(0.4, 0, 0.2, 1)

/* 入场动画 */
ease-in: cubic-bezier(0.4, 0, 1, 1)

/* 出场动画 */
ease-out: cubic-bezier(0, 0, 0.2, 1)

/* 赛博朋克风格 */
ease-cyber: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### 3. 减少动画使用

```tsx
// 检测用户是否偏好减少动画
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 根据用户偏好调整动画
<motion.div
  animate={prefersReducedMotion ? {} : { opacity: 1 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
>
  内容
</motion.div>
```

### 4. 延迟加载动画组件

```tsx
import dynamic from 'next/dynamic';

const AnimatedComponent = dynamic(
  () => import('./AnimatedComponent'),
  { ssr: false }
);
```

### 5. 使用 CSS 变量

```css
:root {
  --animation-duration: 0.3s;
  --animation-timing: cubic-bezier(0.4, 0, 0.2, 1);
}

.animated {
  animation: fadeIn var(--animation-duration) var(--animation-timing);
}
```

## 📚 参考资源

- [Framer Motion 文档](https://www.framer.com/motion/)
- [CSS 动画指南](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Web 动画 API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [性能优化指南](https://web.dev/animations-guide/)

## 🔄 更新日志

### v1.0.0 (2026-03-02)
- 初始动画指南发布
- CSS 动画库建立
- SVG 动画示例
- Framer Motion 最佳实践
