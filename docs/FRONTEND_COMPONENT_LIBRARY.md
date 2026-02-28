# 🎨 Cyberpunk Theme - 前端组件库设计

> **组件库版本**: 1.0.0
> **设计风格**: Cyberpunk / Neon
> **技术栈**: SCSS + Vanilla JS
> **设计师**: Claude Sonnet 4.6
> **创建日期**: 2026-03-01

---

## 📐 一、设计系统

### 1.1 颜色系统

#### 主色调

```scss
// === Neon 颜色 ===
$neon-cyan: #00f0ff;
$neon-magenta: #ff00ff;
$neon-yellow: #f0ff00;
$neon-green: #00ff88;
$neon-pink: #ff0080;

// === 背景色 ===
$bg-dark: #0a0a0f;
$bg-darker: #050508;
$bg-card: #12121a;
$bg-input: #0f0f15;

// === 文本色 ===
$text-primary: #e0e0e0;
$text-secondary: #a0a0b0;
$text-muted: #707080;
$text-disabled: #404050;

// === 边框色 ===
$border-default: rgba(0, 240, 255, 0.3);
$border-hover: rgba(0, 240, 255, 0.6);
$border-active: $neon-cyan;

// === 功能色 ===
$color-success: #00ff88;
$color-warning: #ffaa00;
$color-error: #ff0055;
$color-info: #00f0ff;
```

#### CSS 变量映射

```css
:root {
  --color-neon-cyan: #{$neon-cyan};
  --color-neon-magenta: #{$neon-magenta};
  --color-bg-dark: #{$bg-dark};
  --color-text-primary: #{$text-primary};
  --border-glow: rgba(0, 240, 255, 0.5);
  --magenta-glow: rgba(255, 0, 255, 0.5);
}
```

### 1.2 字体系统

```scss
// === 字体族 ===
$font-family-mono: 'Courier New', 'Monaco', monospace;
$font-family-sans: 'Orbitron', 'Segoe UI', sans-serif;

// === 字体大小 ===
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
$font-size-3xl: 2rem;      // 32px
$font-size-4xl: 2.5rem;    // 40px

// === 字重 ===
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
$font-weight-black: 900;

// === 行高 ===
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
```

### 1.3 间距系统

```scss
// === 间距比例（8px 基准）===
$spacing-0: 0;
$spacing-1: 0.5rem;   // 8px
$spacing-2: 1rem;     // 16px
$spacing-3: 1.5rem;   // 24px
$spacing-4: 2rem;     // 32px
$spacing-5: 2.5rem;   // 40px
$spacing-6: 3rem;     // 48px
$spacing-8: 4rem;     // 64px
```

### 1.4 阴影系统

```scss
// === Neon 阴影 ===
$shadow-neon-cyan:
  0 0 10px var(--color-neon-cyan),
  0 0 20px rgba(0, 240, 255, 0.3),
  0 0 40px rgba(0, 240, 255, 0.1);

$shadow-neon-magenta:
  0 0 10px var(--color-neon-magenta),
  0 0 20px rgba(255, 0, 255, 0.3),
  0 0 40px rgba(255, 0, 255, 0.1);

// === 卡片阴影 ===
$shadow-card-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
$shadow-card-md: 0 4px 16px rgba(0, 0, 0, 0.4);
$shadow-card-lg: 0 8px 32px rgba(0, 0, 0, 0.5);

// === 内阴影 ===
$shadow-inset: inset 0 0 20px rgba(0, 240, 255, 0.1);
```

### 1.5 圆角系统

```scss
$radius-none: 0;
$radius-sm: 2px;
$radius-base: 4px;
$radius-md: 8px;
$radius-lg: 12px;
$radius-xl: 16px;
$radius-full: 9999px;
```

### 1.6 动画系统

```scss
// === 缓动函数 ===
$ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
$ease-in-out: cubic-bezier(0.645, 0.045, 0.355, 1);
$ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

// === 动画时长 ===
$duration-fast: 150ms;
$duration-base: 300ms;
$duration-slow: 500ms;
$duration-slower: 1000ms;

// === 过渡 ===
$transition-base: all $duration-base $ease-out;
$transition-fade: opacity $duration-base $ease-out;
$transition-slide: transform $duration-base $ease-out;
```

---

## 🧩 二、基础组件

### 2.1 Button（按钮）

#### 变体

```scss
.cyber-button {
  // 基础样式
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-2;
  padding: $spacing-2 $spacing-4;
  font-family: $font-family-mono;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 2px solid transparent;
  border-radius: $radius-base;
  cursor: pointer;
  transition: $transition-base;
  position: relative;
  overflow: hidden;

  // Neon 闪光效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 240, 255, 0.2),
      transparent
    );
    transition: left $duration-slow $ease-out;
    z-index: -1;
  }

  &:hover::before {
    left: 100%;
  }

  // === 变体 ===

  // Primary (Neon Cyan)
  &--primary {
    background: transparent;
    border-color: $neon-cyan;
    color: $neon-cyan;
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);

    &:hover {
      background: $neon-cyan;
      color: $bg-dark;
      box-shadow: $shadow-neon-cyan;
      transform: translateY(-2px);
    }
  }

  // Secondary (Neon Magenta)
  &--secondary {
    background: transparent;
    border-color: $neon-magenta;
    color: $neon-magenta;
    box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);

    &:hover {
      background: $neon-magenta;
      color: $bg-dark;
      box-shadow: $shadow-neon-magenta;
      transform: translateY(-2px);
    }
  }

  // Ghost (透明背景)
  &--ghost {
    background: transparent;
    border-color: $border-default;
    color: $text-primary;

    &:hover {
      border-color: $neon-cyan;
      color: $neon-cyan;
    }
  }

  // Sizes
  &--sm {
    padding: $spacing-1 $spacing-3;
    font-size: $font-size-xs;
  }

  &--lg {
    padding: $spacing-3 $spacing-6;
    font-size: $font-size-base;
  }

  // 状态
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(1);
  }

  &--loading {
    pointer-events: none;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid $bg-dark;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

#### 使用示例

```html
<!-- Primary Button -->
<button class="cyber-button cyber-button--primary">
  <i class="fas fa-rocket"></i>
  <span>Launch</span>
</button>

<!-- Secondary Button -->
<button class="cyber-button cyber-button--secondary">
  <i class="fas fa-bolt"></i>
  <span>Boost</span>
</button>

<!-- Loading Button -->
<button class="cyber-button cyber-button--primary cyber-button--loading">
  <span>Processing</span>
</button>
```

### 2.2 Card（卡片）

#### 样式

```scss
.cyber-card {
  background: $bg-card;
  border: 1px solid $border-default;
  border-radius: $radius-md;
  padding: $spacing-4;
  position: relative;
  overflow: hidden;
  transition: $transition-base;

  // 顶部渐变条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(
      90deg,
      $neon-cyan,
      $neon-magenta,
      $neon-cyan
    );
    background-size: 200% 100%;
    animation: gradientMove 3s linear infinite;
  }

  &:hover {
    border-color: $neon-cyan;
    box-shadow: $shadow-neon-cyan;
    transform: translateY(-4px);
  }

  // Header
  &__header {
    margin-bottom: $spacing-3;
    padding-bottom: $spacing-3;
    border-bottom: 1px solid rgba(0, 240, 255, 0.1);

    h3 {
      margin: 0;
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      color: $neon-cyan;
      text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
    }
  }

  // Body
  &__body {
    color: $text-primary;
    line-height: $line-height-relaxed;

    p {
      margin-bottom: $spacing-3;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  // Footer
  &__footer {
    margin-top: $spacing-4;
    padding-top: $spacing-3;
    border-top: 1px solid rgba(0, 240, 255, 0.1);
    display: flex;
    gap: $spacing-2;
  }

  // 变体
  &--neon {
    border-color: $neon-magenta;
    box-shadow: $shadow-neon-magenta;

    &::before {
      background: linear-gradient(
        90deg,
        $neon-magenta,
        $neon-cyan,
        $neon-magenta
      );
    }
  }

  &--glass {
    background: rgba(18, 18, 26, 0.8);
    backdrop-filter: blur(10px);
    border-color: rgba(0, 240, 255, 0.2);
  }
}
```

#### 使用示例

```html
<div class="cyber-card">
  <div class="cyber-card__header">
    <h3>System Status</h3>
  </div>
  <div class="cyber-card__body">
    <p>All systems operational. Running at 100% efficiency.</p>
  </div>
  <div class="cyber-card__footer">
    <button class="cyber-button cyber-button--sm">Details</button>
    <button class="cyber-button cyber-button--ghost cyber-button--sm">Dismiss</button>
  </div>
</div>
```

### 2.3 Input（输入框）

#### 样式

```scss
.cyber-input {
  width: 100%;
  padding: $spacing-2 $spacing-3;
  font-family: $font-family-mono;
  font-size: $font-size-base;
  background: $bg-input;
  border: 1px solid $border-default;
  border-radius: $radius-base;
  color: $text-primary;
  transition: $transition-base;

  &::placeholder {
    color: $text-muted;
  }

  &:focus {
    outline: none;
    border-color: $neon-cyan;
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.3), inset 0 0 10px rgba(0, 240, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: $bg-darker;
  }

  // 状态
  &--error {
    border-color: $color-error;
    box-shadow: 0 0 10px rgba(255, 0, 85, 0.3);

    &:focus {
      box-shadow: 0 0 10px rgba(255, 0, 85, 0.3), inset 0 0 10px rgba(255, 0, 85, 0.1);
    }
  }

  &--success {
    border-color: $color-success;
    box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
  }

  // 尺寸
  &--sm {
    padding: $spacing-1 $spacing-2;
    font-size: $font-size-sm;
  }

  &--lg {
    padding: $spacing-3 $spacing-4;
    font-size: $font-size-lg;
  }
}

// Input Group
.cyber-input-group {
  position: relative;
  display: flex;
  align-items: center;

  &__icon {
    position: absolute;
    left: $spacing-3;
    color: $text-muted;
    pointer-events: none;
  }

  .cyber-input {
    padding-left: $spacing-10;

    &--with-icon {
      padding-left: $spacing-10;
    }
  }
}
```

#### 使用示例

```html
<!-- Basic Input -->
<input
  type="text"
  class="cyber-input"
  placeholder="Enter your data..."
/>

<!-- Input with Icon -->
<div class="cyber-input-group">
  <i class="fas fa-search cyber-input-group__icon"></i>
  <input
    type="text"
    class="cyber-input cyber-input--with-icon"
    placeholder="Search..."
  />
</div>

<!-- Error State -->
<input
  type="text"
  class="cyber-input cyber-input--error"
  value="Invalid input"
/>
```

### 2.4 Badge（徽章）

#### 样式

```scss
.cyber-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-1;
  padding: $spacing-1 $spacing-2;
  font-family: $font-family-mono;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: $radius-full;
  border: 1px solid;

  // 变体
  &--cyan {
    background: rgba(0, 240, 255, 0.1);
    border-color: $neon-cyan;
    color: $neon-cyan;
    box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  }

  &--magenta {
    background: rgba(255, 0, 255, 0.1);
    border-color: $neon-magenta;
    color: $neon-magenta;
    box-shadow: 0 0 10px rgba(255, 0, 255, 0.3);
  }

  &--success {
    background: rgba(0, 255, 136, 0.1);
    border-color: $color-success;
    color: $color-success;
  }

  &--warning {
    background: rgba(255, 170, 0, 0.1);
    border-color: $color-warning;
    color: $color-warning;
  }

  &--error {
    background: rgba(255, 0, 85, 0.1);
    border-color: $color-error;
    color: $color-error;
  }

  // Pulse 动画
  &--pulse {
    animation: badgePulse 2s ease-in-out infinite;
  }
}

@keyframes badgePulse {
  0%, 100% {
    box-shadow: 0 0 5px currentColor;
  }
  50% {
    box-shadow: 0 0 20px currentColor, 0 0 30px currentColor;
  }
}
```

#### 使用示例

```html
<span class="cyber-badge cyber-badge--cyan">New</span>
<span class="cyber-badge cyber-badge--magenta">Updated</span>
<span class="cyber-badge cyber-badge--success">Online</span>
<span class="cyber-badge cyber-badge--error cyber-badge--pulse">
  <i class="fas fa-circle"></i>
  Live
</span>
```

### 2.5 Progress Bar（进度条）

#### 样式

```scss
.cyber-progress {
  width: 100%;
  height: 8px;
  background: $bg-darker;
  border: 1px solid $border-default;
  border-radius: $radius-full;
  overflow: hidden;
  position: relative;

  &__bar {
    height: 100%;
    background: linear-gradient(90deg, $neon-cyan, $neon-magenta);
    border-radius: $radius-full;
    transition: width $duration-slow $ease-out;
    position: relative;

    // Neon 发光
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.3),
        transparent
      );
      animation: shimmer 2s infinite;
    }
  }

  &--striped &__bar {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.1) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.1) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
    animation: progressStripes 1s linear infinite;
  }

  &--indeterminate &__bar {
    width: 50% !important;
    animation: progressIndeterminate 2s ease-in-out infinite;
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes progressStripes {
  0% { background-position: 1rem 0; }
  100% { background-position: 0 0; }
}

@keyframes progressIndeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
```

#### 使用示例

```html
<!-- Basic Progress -->
<div class="cyber-progress">
  <div class="cyber-progress__bar" style="width: 75%"></div>
</div>

<!-- Striped Progress -->
<div class="cyber-progress cyber-progress--striped">
  <div class="cyber-progress__bar" style="width: 50%"></div>
</div>

<!-- Indeterminate Progress -->
<div class="cyber-progress cyber-progress--indeterminate">
  <div class="cyber-progress__bar"></div>
</div>
```

---

## 🎨 三、高级组件

### 3.1 Neon Text（霓虹文字）

#### 样式

```scss
.neon-text {
  color: $neon-cyan;
  text-shadow:
    0 0 5px $neon-cyan,
    0 0 10px $neon-cyan,
    0 0 20px $neon-cyan,
    0 0 40px $neon-cyan,
    0 0 80px $neon-cyan;
  animation: neonFlicker 3s infinite;

  &--magenta {
    color: $neon-magenta;
    text-shadow:
      0 0 5px $neon-magenta,
      0 0 10px $neon-magenta,
      0 0 20px $neon-magenta,
      0 0 40px $neon-magenta;
  }

  &--yellow {
    color: $neon-yellow;
    text-shadow:
      0 0 5px $neon-yellow,
      0 0 10px $neon-yellow,
      0 0 20px $neon-yellow;
  }
}

@keyframes neonFlicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    opacity: 1;
  }
  20%, 24%, 55% {
    opacity: 0.8;
  }
}
```

#### 使用示例

```html
<h1 class="neon-text">Cyberpunk Theme</h1>
<h2 class="neon-text neon-text--magenta">Neon Dreams</h2>
<p class="neon-text neon-text--yellow">Warning System</p>
```

### 3.2 Glitch Effect（故障效果）

#### 样式

```scss
.glitch {
  position: relative;
  animation: glitch 2s infinite;

  &::before,
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &::before {
    left: 2px;
    text-shadow: -1px 0 $neon-cyan;
    clip-path: inset(0 0 0 0);
    animation: glitchTop 2s infinite linear alternate-reverse;
  }

  &::after {
    left: -2px;
    text-shadow: -1px 0 $neon-magenta;
    clip-path: inset(0 0 0 0);
    animation: glitchBottom 2s infinite linear alternate-reverse;
  }
}

@keyframes glitch {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-2px, 2px);
  }
  94% {
    transform: translate(2px, -2px);
  }
  96% {
    transform: translate(-2px, -2px);
  }
  98% {
    transform: translate(2px, 2px);
  }
}

@keyframes glitchTop {
  0%, 90%, 100% {
    clip-path: inset(0 0 95% 0);
  }
  25% {
    clip-path: inset(20% 0 60% 0);
  }
  50% {
    clip-path: inset(40% 0 40% 0);
  }
  75% {
    clip-path: inset(60% 0 20% 0);
  }
}

@keyframes glitchBottom {
  0%, 90%, 100% {
    clip-path: inset(95% 0 0 0);
  }
  25% {
    clip-path: inset(60% 0 20% 0);
  }
  50% {
    clip-path: inset(40% 0 40% 0);
  }
  75% {
    clip-path: inset(20% 0 60% 0);
  }
}
```

#### 使用示例

```html
<h1 class="glitch" data-text="SYSTEM ERROR">SYSTEM ERROR</h1>
<p class="glitch" data-text="Loading...">Loading...</p>
```

### 3.3 Scanline Overlay（扫描线覆盖）

#### 样式

```scss
.scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15),
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  animation: scanlines 8s linear infinite;

  &--disabled {
    display: none;
  }
}

@keyframes scanlines {
  0% { transform: translateY(0); }
  100% { transform: translateY(10px); }
}
```

#### 使用示例

```html
<div class="scanlines"></div>

<!-- 可通过JS动态禁用 -->
<script>
document.querySelector('.scanlines').classList.add('scanlines--disabled')
</script>
```

---

## 📱 四、布局组件

### 4.1 Container（容器）

```scss
.cyber-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 $spacing-4;

  &--fluid {
    max-width: none;
  }

  &--sm {
    max-width: 640px;
  }

  &--md {
    max-width: 768px;
  }

  &--lg {
    max-width: 1024px;
  }

  &--xl {
    max-width: 1280px;
  }
}
```

### 4.2 Grid（网格系统）

```scss
.cyber-grid {
  display: grid;
  gap: $spacing-4;

  &--2 {
    grid-template-columns: repeat(2, 1fr);
  }

  &--3 {
    grid-template-columns: repeat(3, 1fr);
  }

  &--4 {
    grid-template-columns: repeat(4, 1fr);
  }

  // 响应式
  @media (max-width: 768px) {
    &--2,
    &--3,
    &--4 {
      grid-template-columns: 1fr;
    }
  }
}
```

---

## 🎯 五、JavaScript 组件

### 5.1 通知系统（Notifications）

```javascript
// assets/js/components/Notification.js
export class Notification {
  static show(type, message, duration = 3000) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    }

    const notification = document.createElement('div')
    notification.className = `cyber-notification cyber-notification--${type}`
    notification.innerHTML = `
      <i class="fas ${icons[type]} cyber-notification__icon"></i>
      <span class="cyber-notification__message">${message}</span>
      <button class="cyber-notification__close">&times;</button>
    `

    document.body.appendChild(notification)

    // Auto remove
    setTimeout(() => {
      this.hide(notification)
    }, duration)

    // Close button
    notification
      .querySelector('.cyber-notification__close')
      .addEventListener('click', () => this.hide(notification))

    return notification
  }

  static hide(notification) {
    notification.style.opacity = '0'
    setTimeout(() => notification.remove(), 300)
  }
}
```

### 5.2 模态框（Modal）

```javascript
// assets/js/components/Modal.js
export class Modal {
  constructor(options) {
    this.title = options.title
    this.content = options.content
    this.onConfirm = options.onConfirm
    this.onCancel = options.onCancel
  }

  show() {
    this.modal = document.createElement('div')
    this.modal.className = 'cyber-modal'
    this.modal.innerHTML = `
      <div class="cyber-modal__overlay">
        <div class="cyber-modal__dialog">
          <div class="cyber-modal__header">
            <h3>${this.title}</h3>
            <button class="cyber-modal__close">&times;</button>
          </div>
          <div class="cyber-modal__body">
            ${this.content}
          </div>
          <div class="cyber-modal__footer">
            <button class="cyber-button cyber-button--ghost" data-action="cancel">Cancel</button>
            <button class="cyber-button cyber-button--primary" data-action="confirm">Confirm</button>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(this.modal)
    this.bindEvents()
  }

  bindEvents() {
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal.querySelector('.cyber-modal__overlay')) {
        this.hide()
      }
    })

    this.modal.querySelector('.cyber-modal__close').addEventListener('click', () => this.hide())

    this.modal.querySelector('[data-action="cancel"]').addEventListener('click', () => {
      this.onCancel?.()
      this.hide()
    })

    this.modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
      this.onConfirm?.()
      this.hide()
    })
  }

  hide() {
    this.modal.style.opacity = '0'
    setTimeout(() => this.modal.remove(), 300)
  }
}
```

---

## 📖 六、使用指南

### 6.1 快速开始

```scss
// 在你的 SCSS 文件中导入
@import 'components/buttons';
@import 'components/cards';
@import 'components/inputs';
```

```javascript
// 在你的 JavaScript 文件中导入
import { Notification } from './components/Notification'
import { Modal } from './components/Modal'

// 使用组件
Notification.show('success', 'Operation completed!')
```

### 6.2 自定义主题

```scss
// 覆盖默认变量
$neon-cyan: #00ff88;
$neon-magenta: #ff0080;

// 导入组件库
@import 'components/all';
```

---

## 🎉 七、总结

本组件库提供了完整的赛博朋克风格 UI 组件系统，包括：

- ✅ 5+ 基础组件
- ✅ 3+ 高级效果组件
- ✅ 2+ 布局组件
- ✅ 2+ JavaScript 组件
- ✅ 完整的设计系统
- ✅ 响应式支持
- ✅ 暗色主题优化

**开始使用，打造你的赛博朋克风格网站吧！** 🚀
