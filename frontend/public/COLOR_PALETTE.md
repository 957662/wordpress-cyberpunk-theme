# CyberPress Platform - 完整配色方案

## 🎨 核心色板 (Core Color Palette)

### 主色调 (Primary Colors)

```css
/* 霓虹青 - 主强调色 */
--cyber-cyan: #00f0ff;
--cyber-cyan-light: #4df4ff;
--cyber-cyan-dark: #00a0aa;

/* 赛博紫 - 次强调色 */
--cyber-purple: #9d00ff;
--cyber-purple-light: #b34dff;
--cyber-purple-dark: #6600aa;

/* 激光粉 - 强调色 */
--cyber-pink: #ff0080;
--cyber-pink-light: #ff3399;
--cyber-pink-dark: #cc0066;

/* 电压黄 - 高亮色 */
--cyber-yellow: #f0ff00;
--cyber-yellow-light: #f9ff33;
--cyber-yellow-dark: #c0cc00;
```

### 中性色 (Neutral Colors)

```css
/* 深空系列 */
--cyber-black: #0a0a0f;
--cyber-dark: #12121a;
--cyber-gray-dark: #1a1a2f;

/* 灰度系列 */
--cyber-gray-100: #e0e0e0;
--cyber-gray-200: #a0a0b0;
--cyber-gray-300: #606070;
--cyber-gray-400: #303040;
--cyber-gray-500: #202030;
```

### 功能色 (Functional Colors)

```css
/* 成功 */
--cyber-green: #00ff88;
--cyber-green-light: #33ffaa;
--cyber-green-dark: #00cc6a;

/* 警告 */
--cyber-orange: #ff8800;
--cyber-orange-light: #ffaa33;
--cyber-orange-dark: #cc6d00;

/* 错误 */
--cyber-red: #ff0044;
--cyber-red-light: #ff3366;
--cyber-red-dark: #cc0036;

/* 信息 */
--cyber-blue: #0088ff;
--cyber-blue-light: #33aaff;
--cyber-blue-dark: #006dcc;
```

---

## 🌈 渐变系统 (Gradient System)

### 线性渐变 (Linear Gradients)

```css
/* 霓虹渐变 - 青到紫 */
--gradient-neon: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 热力渐变 - 粉到黄 */
--gradient-heat: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%);

/* 赛博渐变 - 全光谱 */
--gradient-cyber: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);

/* 深空渐变 */
--gradient-deep: linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%);

/* 极光渐变 */
--gradient-aurora: linear-gradient(135deg, #00f0ff 0%, #00ff88 50%, #f0ff00 100%);
```

### 径向渐变 (Radial Gradients)

```css
/* 发光球 */
--gradient-glow-cyan: radial-gradient(circle, rgba(0, 240, 255, 0.8) 0%, rgba(0, 240, 255, 0) 70%);
--gradient-glow-purple: radial-gradient(circle, rgba(157, 0, 255, 0.8) 0%, rgba(157, 0, 255, 0) 70%);
--gradient-glow-pink: radial-gradient(circle, rgba(255, 0, 128, 0.8) 0%, rgba(255, 0, 128, 0) 70%);

/* 全息投影 */
--gradient-hologram: radial-gradient(ellipse at center, rgba(0, 240, 255, 0.3) 0%, rgba(157, 0, 255, 0.1) 50%, transparent 70%);
```

### 网格渐变 (Mesh Gradients)

```css
/* 赛博网格 */
--gradient-mesh-cyber:
  radial-gradient(at 40% 20%, rgba(0, 240, 255, 0.3) 0px, transparent 50%),
  radial-gradient(at 80% 0%, rgba(157, 0, 255, 0.2) 0px, transparent 50%),
  radial-gradient(at 0% 50%, rgba(255, 0, 128, 0.2) 0px, transparent 50%),
  radial-gradient(at 80% 50%, rgba(240, 255, 0, 0.1) 0px, transparent 50%),
  radial-gradient(at 0% 100%, rgba(0, 240, 255, 0.2) 0px, transparent 50%),
  radial-gradient(at 80% 100%, rgba(157, 0, 255, 0.1) 0px, transparent 50%);
```

---

## ✨ 发光效果 (Glow Effects)

### 文字发光 (Text Glow)

```css
/* 霓虹文字发光 */
.text-glow-cyan {
  color: #00f0ff;
  text-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    0 0 40px #00f0ff;
}

.text-glow-purple {
  color: #9d00ff;
  text-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px #9d00ff;
}

.text-glow-pink {
  color: #ff0080;
  text-shadow:
    0 0 5px #ff0080,
    0 0 10px #ff0080,
    0 0 20px #ff0080;
}
```

### 盒子发光 (Box Glow)

```css
/* 霓虹边框发光 */
.box-glow-cyan {
  box-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px rgba(0, 240, 255, 0.5),
    inset 0 0 10px rgba(0, 240, 255, 0.1);
}

.box-glow-purple {
  box-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px rgba(157, 0, 255, 0.5),
    inset 0 0 10px rgba(157, 0, 255, 0.1);
}

.box-glow-pink {
  box-shadow:
    0 0 5px #ff0080,
    0 0 10px #ff0080,
    0 0 20px rgba(255, 0, 128, 0.5),
    inset 0 0 10px rgba(255, 0, 128, 0.1);
}
```

---

## 🎭 文字颜色 (Typography Colors)

### 标题 (Headings)

```css
/* H1 - 主标题 */
.text-h1 {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.text-h1-gradient {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* H2 - 次标题 */
.text-h2 {
  color: #e0e0e0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* H3 - 三级标题 */
.text-h3 {
  color: #a0a0b0;
  font-size: 1.5rem;
  font-weight: 600;
}
```

### 正文 (Body Text)

```css
/* 主要文字 */
.text-primary {
  color: #e0e0e0;
  font-size: 1rem;
  line-height: 1.6;
}

/* 次要文字 */
.text-secondary {
  color: #a0a0b0;
  font-size: 0.875rem;
  line-height: 1.5;
}

/* 禁用文字 */
.text-muted {
  color: #606070;
  font-size: 0.875rem;
}

/* 强调文字 */
.text-accent {
  color: #00f0ff;
  font-weight: 600;
}

/* 链接文字 */
.text-link {
  color: #00f0ff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.text-link:hover {
  color: #9d00ff;
  text-shadow: 0 0 10px #9d00ff;
}
```

---

## 🖼️ 背景颜色 (Background Colors)

### 纯色背景 (Solid Backgrounds)

```css
/* 主背景 */
.bg-primary {
  background-color: #0a0a0f;
}

/* 次背景 */
.bg-secondary {
  background-color: #12121a;
}

/* 卡片背景 */
.bg-card {
  background-color: rgba(18, 18, 26, 0.8);
  backdrop-filter: blur(10px);
}

/* 悬浮背景 */
.bg-hover {
  background-color: rgba(0, 240, 255, 0.1);
}

/* 选中背景 */
.bg-selected {
  background-color: rgba(157, 0, 255, 0.2);
}
```

### 图案背景 (Pattern Backgrounds)

```css
/* 网格背景 */
.bg-grid {
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* 电路背景 */
.bg-circuit {
  background-image:
    radial-gradient(circle at 25px 25px, rgba(0, 240, 255, 0.1) 2px, transparent 0);
  background-size: 50px 50px;
}

/* 扫描线背景 */
.bg-scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
}

/* 噪点背景 */
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
}
```

---

## 🎨 Tailwind CSS 配置

### 扩展配置 (Extended Configuration)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 核心颜色
        'cyber-black': '#0a0a0f',
        'cyber-dark': '#12121a',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-yellow': '#f0ff00',
        'cyber-green': '#00ff88',
        'cyber-orange': '#ff8800',
        'cyber-red': '#ff0044',
        'cyber-blue': '#0088ff',

        // 浅色变体
        'cyber-cyan-light': '#4df4ff',
        'cyber-purple-light': '#b34dff',
        'cyber-pink-light': '#ff3399',

        // 深色变体
        'cyber-cyan-dark': '#00a0aa',
        'cyber-purple-dark': '#6600aa',
        'cyber-pink-dark': '#cc0066',

        // 灰度
        'cyber-gray-100': '#e0e0e0',
        'cyber-gray-200': '#a0a0b0',
        'cyber-gray-300': '#606070',
        'cyber-gray-400': '#303040',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'gradient-heat': 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
        'gradient-deep': 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 10px #00f0ff',
        'neon-purple': '0 0 5px #9d00ff, 0 0 10px #9d00ff',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px #ff0080',
        'neon-cyan-lg': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff',
        'neon-purple-lg': '0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 40px #9d00ff',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'glow': {
          '0%': { filter: 'brightness(1) drop-shadow(0 0 5px currentColor)' },
          '100%': { filter: 'brightness(1.2) drop-shadow(0 0 20px currentColor)' },
        },
      },
    },
  },
}
```

---

## 🎯 使用示例

### 按钮样式 (Button Styles)

```tsx
/* 主要按钮 */
<button className="
  px-6 py-3
  bg-gradient-neon
  text-cyber-black
  font-bold
  rounded-lg
  hover:shadow-neon-cyan-lg
  transition-all
  duration-300
">
  主要操作
</button>

/* 次要按钮 */
<button className="
  px-6 py-3
  border-2 border-cyber-cyan
  text-cyber-cyan
  font-semibold
  rounded-lg
  hover:bg-cyber-cyan/10
  transition-all
  duration-300
">
  次要操作
</button>

/* 强调按钮 */
<button className="
  px-6 py-3
  bg-cyber-pink
  text-white
  font-bold
  rounded-lg
  hover:shadow-neon-pink-lg
  transition-all
  duration-300
">
  强调操作
</button>
```

### 卡片样式 (Card Styles)

```tsx
<div className="
  bg-card
  border border-cyber-cyan/20
  rounded-xl
  p-6
  hover:border-cyber-cyan
  hover:shadow-neon-cyan
  transition-all
  duration-300
">
  <h3 className="text-h2 text-glow-cyan mb-4">标题</h3>
  <p className="text-primary">内容</p>
</div>
```

### 输入框样式 (Input Styles)

```tsx
<input
  type="text"
  className="
    w-full
    bg-cyber-dark
    border border-cyber-gray-400
    rounded-lg
    px-4 py-3
    text-cyber-gray-100
    placeholder:text-cyber-gray-300
    focus:border-cyber-cyan
    focus:shadow-neon-cyan
    outline-none
    transition-all
    duration-300
  "
  placeholder="输入内容..."
/>
```

---

## 🌓 深色/浅色模式 (Dark/Light Mode)

### 浅色模式变体 (Light Mode)

```css
:root {
  /* 背景色 */
  --bg-primary: #f0f0f5;
  --bg-secondary: #e0e0e8;
  --bg-card: rgba(255, 255, 255, 0.9);

  /* 文字色 */
  --text-primary: #1a1a2f;
  --text-secondary: #404050;
  --text-muted: #808090;

  /* 强调色保持不变 */
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
  --cyber-pink: #ff0080;
}
```

### 深色模式 (Dark Mode)

```css
[data-theme="dark"] {
  /* 背景色 */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: rgba(18, 18, 26, 0.8);

  /* 文字色 */
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
  --text-muted: #606070;

  /* 强调色 */
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
  --cyber-pink: #ff0080;
}
```

---

## 📋 快速参考 (Quick Reference)

| 用途 | 颜色值 | Tailwind Class |
|------|--------|----------------|
| 主背景 | `#0a0a0f` | `bg-cyber-black` |
| 卡片背景 | `#12121a` | `bg-cyber-dark` |
| 主要文字 | `#e0e0e0` | `text-cyber-gray-100` |
| 次要文字 | `#a0a0b0` | `text-cyber-gray-200` |
| 主链接/按钮 | `#00f0ff` | `text-cyber-cyan` |
| 次要链接 | `#9d00ff` | `text-cyber-purple` |
| 强调色 | `#ff0080` | `text-cyber-pink` |
| 高亮色 | `#f0ff00` | `text-cyber-yellow` |
| 成功色 | `#00ff88` | `text-cyber-green` |
| 警告色 | `#ff8800` | `text-cyber-orange` |
| 错误色 | `#ff0044` | `text-cyber-red` |

---

## 🔧 实用工具类 (Utility Classes)

### 发光效果 (Glow Utilities)

```css
/* 文字发光 */
.text-glow-cyan { @apply text-cyber-cyan; text-shadow: 0 0 10px #00f0ff; }
.text-glow-purple { @apply text-cyber-purple; text-shadow: 0 0 10px #9d00ff; }
.text-glow-pink { @apply text-cyber-pink; text-shadow: 0 0 10px #ff0080; }

/* 边框发光 */
.border-glow-cyan { @apply border-cyber-cyan; box-shadow: 0 0 10px #00f0ff, inset 0 0 10px rgba(0, 240, 255, 0.1); }
.border-glow-purple { @apply border-cyber-purple; box-shadow: 0 0 10px #9d00ff, inset 0 0 10px rgba(157, 0, 255, 0.1); }

/* 渐变文字 */
.text-gradient-neon {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 动画效果 (Animation Utilities)

```css
/* 霓虹脉冲 */
@keyframes neon-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* 故障效果 */
@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}

/* 扫描效果 */
@keyframes scan {
  0% { top: 0; }
  100% { top: 100%; }
}
```

---

## 🎨 设计建议 (Design Guidelines)

### 配色原则

1. **60-30-10 法则**
   - 60% 主色调（深色背景）
   - 30% 次要色（灰色系）
   - 10% 强调色（霓虹色）

2. **对比度要求**
   - 文字与背景对比度 ≥ 4.5:1
   - 大文字对比度 ≥ 3:1
   - 交互元素对比度 ≥ 3:1

3. **颜色使用**
   - 主要操作：霓虹青 (#00f0ff)
   - 次要操作：赛博紫 (#9d00ff)
   - 危险操作：激光粉 (#ff0080)
   - 成功状态：赛博绿 (#00ff88)

### 视觉层次

```tsx
/* 层级 1 - 最高优先级 */
<h1 className="text-h1 text-glow-cyan">主标题</h1>

/* 层级 2 - 次要信息 */
<h2 className="text-h2 text-cyber-cyan">副标题</h2>

/* 层级 3 - 常规内容 */
<p className="text-primary">正文内容</p>

/* 层级 4 - 辅助信息 */
<span className="text-secondary">辅助文字</span>
```

---

**版本**: v2.0.0
**最后更新**: 2026-03-07
**维护者**: CyberPress AI Design Team
**主题**: Cyberpunk Aesthetics
