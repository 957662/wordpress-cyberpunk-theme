# CyberPress Design Tokens

## 🎨 颜色系统 - Color System

### 主色 - Primary Colors
```css
--color-cyan-50: #e0ffff;
--color-cyan-100: #b3ffff;
--color-cyan-200: #80ffff;
--color-cyan-300: #4dffff;
--color-cyan-400: #1affff;
--color-cyan-500: #00f0ff;  /* 主色 */
--color-cyan-600: #00c0cc;
--color-cyan-700: #009099;
--color-cyan-800: #006066;
--color-cyan-900: #003033;
```

### 紫色系 - Purple Palette
```css
--color-purple-50: #f3e0ff;
--color-purple-100: #e0b3ff;
--color-purple-200: #cc80ff;
--color-purple-300: #b94dff;
--color-purple-400: #a61aff;
--color-purple-500: #9d00ff;  /* 主色 */
--color-purple-600: #7d00cc;
--color-purple-700: #5e0099;
--color-purple-800: #3f0066;
--color-purple-900: #200033;
```

### 粉色系 - Pink Palette
```css
--color-pink-50: #ffe0f0;
--color-pink-100: #ffb3d9;
--color-pink-200: #ff80c2;
--color-pink-300: #ff4dab;
--color-pink-400: #ff1a94;
--color-pink-500: #ff0080;  /* 主色 */
--color-pink-600: #cc0066;
--color-pink-700: #99004d;
--color-pink-800: #660033;
--color-pink-900: #33001a;
```

### 黄色系 - Yellow Palette
```css
--color-yellow-50: #ffffe0;
--color-yellow-100: #ffffb3;
--color-yellow-200: #ffff80;
--color-yellow-300: #ffff4d;
--color-yellow-400: #ffff1a;
--color-yellow-500: #f0ff00;  /* 主色 */
--color-yellow-600: #c0cc00;
--color-yellow-700: #909900;
--color-yellow-800: #606600;
--color-yellow-900: #303300;
```

### 绿色系 - Green Palette
```css
--color-green-50: #e0fff0;
--color-green-100: #b3ffdb;
--color-green-200: #80ffc6;
--color-green-300: #4dffB2;
--color-green-400: #1aff9d;
--color-green-500: #00ff88;  /* 主色 */
--color-green-600: #00cc6d;
--color-green-700: #009952;
--color-green-800: #006637;
--color-green-900: #00331c;
```

### 中性色 - Neutral Colors
```css
--color-black: #0a0a0f;
--color-gray-900: #1a1a1f;
--color-gray-800: #222228;
--color-gray-700: #2d2d35;
--color-gray-600: #3d3d47;
--color-gray-500: #666666;
--color-gray-400: #999999;
--color-gray-300: #cccccc;
--color-gray-200: #e0e0e0;
--color-gray-100: #f0f0f0;
--color-white: #ffffff;
```

### 渐变 - Gradients
```css
--gradient-primary: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
--gradient-secondary: linear-gradient(135deg, #9d00ff 0%, #ff0080 100%);
--gradient-tertiary: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%);
--gradient-cool: linear-gradient(135deg, #00f0ff 0%, #00ff88 100%);
--gradient-warm: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%);
--gradient-full: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
--gradient-radial: radial-gradient(circle, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
```

## 📐 间距系统 - Spacing System

```css
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

## 🔤 字体系统 - Typography System

### 字体家族 - Font Families
```css
--font-display: 'Orbitron', 'Impact', sans-serif;
--font-heading: 'Orbitron', 'Arial', sans-serif;
--font-body: 'Inter', 'Helvetica Neue', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

### 字体大小 - Font Sizes
```css
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */
--text-7xl: 4.5rem;     /* 72px */
```

### 字重 - Font Weights
```css
--font-thin: 100;
--font-extralight: 200;
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### 行高 - Line Heights
```css
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## 🎯 圆角系统 - Border Radius

```css
--radius-none: 0;
--radius-sm: 0.125rem;    /* 2px */
--radius-base: 0.25rem;   /* 4px */
--radius-md: 0.375rem;    /* 6px */
--radius-lg: 0.5rem;      /* 8px */
--radius-xl: 0.75rem;     /* 12px */
--radius-2xl: 1rem;       /* 16px */
--radius-3xl: 1.5rem;     /* 24px */
--radius-full: 9999px;
```

## 🌟 阴影系统 - Shadow System

```css
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-base: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* 霓虹发光效果 */
--glow-cyan-sm: 0 0 5px rgba(0, 240, 255, 0.5);
--glow-cyan-md: 0 0 10px rgba(0, 240, 255, 0.6), 0 0 20px rgba(0, 240, 255, 0.4);
--glow-cyan-lg: 0 0 15px rgba(0, 240, 255, 0.7), 0 0 30px rgba(0, 240, 255, 0.5);

--glow-purple-sm: 0 0 5px rgba(157, 0, 255, 0.5);
--glow-purple-md: 0 0 10px rgba(157, 0, 255, 0.6), 0 0 20px rgba(157, 0, 255, 0.4);
--glow-purple-lg: 0 0 15px rgba(157, 0, 255, 0.7), 0 0 30px rgba(157, 0, 255, 0.5);

--glow-pink-sm: 0 0 5px rgba(255, 0, 128, 0.5);
--glow-pink-md: 0 0 10px rgba(255, 0, 128, 0.6), 0 0 20px rgba(255, 0, 128, 0.4);
--glow-pink-lg: 0 0 15px rgba(255, 0, 128, 0.7), 0 0 30px rgba(255, 0, 128, 0.5);
```

## ⚡ 动画系统 - Animation System

### 动画时长 - Duration
```css
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

### 缓动函数 - Easing
```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-cyber: cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* 弹性效果 */
```

### 动画预设 - Presets
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes glow {
  0%, 100% {
    filter: drop-shadow(0 0 5px currentColor);
  }
  50% {
    filter: drop-shadow(0 0 20px currentColor);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}
```

## 🖼️ Z-Index 系统 - Z-Index Scale

```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-notification: 1080;
```

## 🎭 断点系统 - Breakpoints

```css
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

## 📱 容器系统 - Container System

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

## 🧩 组件特定 - Component Specific

### 按钮 - Buttons
```css
--btn-padding-y: var(--space-2);
--btn-padding-x: var(--space-4);
--btn-font-size: var(--text-base);
--btn-border-radius: var(--radius-lg);
--btn-transition: all var(--duration-200) var(--ease-in-out);
```

### 输入框 - Inputs
```css
--input-padding-y: var(--space-2);
--input-padding-x: var(--space-3);
--input-font-size: var(--text-base);
--input-border-radius: var(--radius-md);
--input-border-color: var(--color-gray-700);
--input-focus-border-color: var(--color-cyan-500);
```

### 卡片 - Cards
```css
--card-padding: var(--space-6);
--card-border-radius: var(--radius-xl);
--card-background: var(--color-gray-900);
--card-border-color: var(--color-gray-800);
```

---

**维护者**: CyberPress Design Team
**最后更新**: 2026-03-03
**版本**: v2.0
