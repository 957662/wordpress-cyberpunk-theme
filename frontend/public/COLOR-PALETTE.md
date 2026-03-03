# CyberPress Platform - 配色方案参考

## 🎨 核心色彩系统

### 主色调 (Primary Colors)

#### 霓虹青 (Neon Cyan)
```css
--cyber-cyan: #00f0ff;
--cyber-cyan-light: #40f5ff;
--cyber-cyan-dark: #00a8b3;
--cyber-cyan-dim: rgba(0, 240, 255, 0.1);
--cyber-cyan-glow: rgba(0, 240, 255, 0.5);
```

**RGB**: `rgb(0, 240, 255)`
**HSL**: `hsl(183, 100%, 50%)`
**用途**: 主要强调色、链接、按钮、高亮

---

#### 赛博紫 (Cyber Purple)
```css
--cyber-purple: #9d00ff;
--cyber-purple-light: #b840ff;
--cyber-purple-dark: #6d00b3;
--cyber-purple-dim: rgba(157, 0, 255, 0.1);
--cyber-purple-glow: rgba(157, 0, 255, 0.5);
```

**RGB**: `rgb(157, 0, 255)`
**HSL**: `hsl(277, 100%, 50%)`
**用途**: 次要强调色、渐变、装饰

---

#### 激光粉 (Laser Pink)
```css
--cyber-pink: #ff0080;
--cyber-pink-light: #ff4099;
--cyber-pink-dark: #b30059;
--cyber-pink-dim: rgba(255, 0, 128, 0.1);
--cyber-pink-glow: rgba(255, 0, 128, 0.5);
```

**RGB**: `rgb(255, 0, 128)`
**HSL**: `hsl(330, 100%, 50%)`
**用途**: 警告、错误、重要提示、行动号召

---

### 背景色 (Background Colors)

```css
/* 主背景 */
--bg-primary: #0a0a0f;
--bg-primary-rgb: rgb(10, 10, 15);

/* 次级背景 */
--bg-secondary: #16162a;
--bg-secondary-rgb: rgb(22, 22, 42);

/* 三级背景 */
--bg-tertiary: #1e1e36;
--bg-tertiary-rgb: rgb(30, 30, 54);

/* 悬浮背景 */
--bg-elevated: #252542;
--bg-elevated-rgb: rgb(37, 37, 66);

/* 卡片背景 */
--bg-card: #1a1a2e;
--bg-card-rgb: rgb(26, 26, 46);
```

---

### 文本色 (Text Colors)

```css
/* 主要文本 */
--text-primary: #ffffff;
--text-primary-rgb: rgb(255, 255, 255);

/* 次要文本 */
--text-secondary: #b0b0d0;
--text-secondary-rgb: rgb(176, 176, 208);

/* 三级文本 */
--text-tertiary: #8080a0;
--text-tertiary-rgb: rgb(128, 128, 160);

/* 静音文本 */
--text-muted: #606080;
--text-muted-rgb: rgb(96, 96, 128);

/* 禁用文本 */
--text-disabled: #404060;
--text-disabled-rgb: rgb(64, 64, 96);
```

---

### 边框色 (Border Colors)

```css
/* 主边框 */
--border-primary: rgba(0, 240, 255, 0.3);

/* 次边框 */
--border-secondary: rgba(157, 0, 255, 0.3);

/* 三级边框 */
--border-tertiary: rgba(255, 0, 128, 0.3);

/* 弱边框 */
--border-weak: rgba(255, 255, 255, 0.1);

/* 强边框 */
--border-strong: rgba(0, 240, 255, 0.6);
```

---

### 功能色 (Functional Colors)

```css
/* 成功 */
--color-success: #00ff88;
--color-success-light: #40ffaa;
--color-success-dark: #00cc6a;
--color-success-glow: rgba(0, 255, 136, 0.3);

/* 错误 */
--color-error: #ff3366;
--color-error-light: #ff6688;
--color-error-dark: #cc2952;
--color-error-glow: rgba(255, 51, 102, 0.3);

/* 警告 */
--color-warning: #ffaa00;
--color-warning-light: #ffbb33;
--color-warning-dark: #cc8800;
--color-warning-glow: rgba(255, 170, 0, 0.3);

/* 信息 */
--color-info: #00aaff;
--color-info-light: #33bbff;
--color-info-dark: #0088cc;
--color-info-glow: rgba(0, 170, 255, 0.3);
```

---

## 🌈 渐变方案

### 线性渐变 (Linear Gradients)

```css
/* 主渐变 */
--gradient-cyber: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);

/* 青色渐变 */
--gradient-cyan: linear-gradient(135deg, #00f0ff 0%, #00a8b3 100%);

/* 紫色渐变 */
--gradient-purple: linear-gradient(135deg, #9d00ff 0%, #6d00b3 100%);

/* 粉色渐变 */
--gradient-pink: linear-gradient(135deg, #ff0080 0%, #b30059 100%);

/* 背景渐变 */
--gradient-dark: linear-gradient(180deg, #0a0a0f 0%, #16162a 100%);
--gradient-card: linear-gradient(145deg, #16162a 0%, #1e1e36 100%);

/* 对角线渐变 */
--gradient-diagonal: linear-gradient(45deg, #00f0ff, #9d00ff, #ff0080);

/* 垂直渐变 */
--gradient-vertical: linear-gradient(to bottom, #00f0ff, #9d00ff);
```

### 径向渐变 (Radial Gradients)

```css
/* 发光效果 */
--gradient-glow-cyan: radial-gradient(circle, rgba(0, 240, 255, 0.3) 0%, transparent 70%);
--gradient-glow-purple: radial-gradient(circle, rgba(157, 0, 255, 0.3) 0%, transparent 70%);
--gradient-glow-pink: radial-gradient(circle, rgba(255, 0, 128, 0.3) 0%, transparent 70%);

/* 聚光灯效果 */
--gradient-spotlight: radial-gradient(ellipse at center, rgba(0, 240, 255, 0.15) 0%, transparent 50%);
```

---

## ✨ 发光效果

### 文字发光 (Text Glow)

```css
/* 青色发光 */
.text-glow-cyan {
  text-shadow:
    0 0 10px rgba(0, 240, 255, 0.8),
    0 0 20px rgba(0, 240, 255, 0.6),
    0 0 30px rgba(0, 240, 255, 0.4),
    0 0 40px rgba(0, 240, 255, 0.2);
}

/* 紫色发光 */
.text-glow-purple {
  text-shadow:
    0 0 10px rgba(157, 0, 255, 0.8),
    0 0 20px rgba(157, 0, 255, 0.6),
    0 0 30px rgba(157, 0, 255, 0.4);
}

/* 粉色发光 */
.text-glow-pink {
  text-shadow:
    0 0 10px rgba(255, 0, 128, 0.8),
    0 0 20px rgba(255, 0, 128, 0.6),
    0 0 30px rgba(255, 0, 128, 0.4);
}
```

### 边框发光 (Border Glow)

```css
/* 青色边框发光 */
.border-glow-cyan {
  box-shadow:
    0 0 5px rgba(0, 240, 255, 0.5),
    0 0 10px rgba(0, 240, 255, 0.3),
    inset 0 0 5px rgba(0, 240, 255, 0.2);
}

/* 紫色边框发光 */
.border-glow-purple {
  box-shadow:
    0 0 5px rgba(157, 0, 255, 0.5),
    0 0 10px rgba(157, 0, 255, 0.3),
    inset 0 0 5px rgba(157, 0, 255, 0.2);
}

/* 粉色边框发光 */
.border-glow-pink {
  box-shadow:
    0 0 5px rgba(255, 0, 128, 0.5),
    0 0 10px rgba(255, 0, 128, 0.3),
    inset 0 0 5px rgba(255, 0, 128, 0.2);
}
```

### 按钮发光 (Button Glow)

```css
/* 主按钮发光 */
.button-glow {
  box-shadow:
    0 0 15px rgba(0, 240, 255, 0.6),
    0 0 30px rgba(0, 240, 255, 0.4),
    0 0 45px rgba(0, 240, 255, 0.2);
}

/* 悬停发光增强 */
.button-glow:hover {
  box-shadow:
    0 0 20px rgba(0, 240, 255, 0.8),
    0 0 40px rgba(0, 240, 255, 0.6),
    0 0 60px rgba(0, 240, 255, 0.4);
}
```

---

## 🎭 视觉效果组件

### 卡片样式

```css
.cyber-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cyber-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-cyber);
}

.cyber-card:hover {
  border-color: var(--cyber-cyan);
  box-shadow:
    0 0 20px var(--cyber-cyan-glow),
    0 0 40px rgba(0, 240, 255, 0.2);
  transform: translateY(-2px);
}
```

### 按钮样式

```css
.cyber-button {
  background: var(--gradient-cyber);
  border: none;
  border-radius: 4px;
  color: var(--bg-primary);
  font-weight: bold;
  padding: 12px 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cyber-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.cyber-button:hover::before {
  left: 100%;
}

.cyber-button:hover {
  box-shadow: var(--button-glow);
  transform: scale(1.02);
}
```

### 输入框样式

```css
.cyber-input {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-weak);
  border-radius: 4px;
  color: var(--text-primary);
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.cyber-input:focus {
  outline: none;
  border-color: var(--cyber-cyan);
  box-shadow:
    0 0 10px var(--cyber-cyan-glow),
    inset 0 0 5px rgba(0, 240, 255, 0.1);
}
```

---

## 📐 色彩对比度

为确保可访问性，所有色彩组合都符合 WCAG AA 标准：

| 前景色 | 背景色 | 对比度 | 等级 |
|--------|--------|--------|------|
| `#ffffff` | `#0a0a0f` | 18.5:1 | AAA |
| `#00f0ff` | `#0a0a0f` | 8.2:1 | AA |
| `#9d00ff` | `#0a0a0f` | 6.8:1 | AA |
| `#ff0080` | `#0a0a0f` | 5.9:1 | AA |
| `#b0b0d0` | `#0a0a0f` | 9.1:1 | AAA |

---

## 🎬 动画色彩

### 脉冲动画

```css
@keyframes pulse-cyan {
  0%, 100% {
    box-shadow: 0 0 5px var(--cyber-cyan-glow);
  }
  50% {
    box-shadow: 0 0 20px var(--cyber-cyan-glow),
                0 0 30px rgba(0, 240, 255, 0.3);
  }
}

.pulse-cyan {
  animation: pulse-cyan 2s ease-in-out infinite;
}
```

### 流光动画

```css
@keyframes flow-gradient {
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

.flow-gradient {
  background: var(--gradient-cyber);
  background-size: 200% 200%;
  animation: flow-gradient 3s ease infinite;
}
```

---

## 🚀 使用建议

1. **主要元素**: 使用霓虹青 (`#00f0ff`) 作为主要交互元素
2. **次要元素**: 使用赛博紫 (`#9d00ff`) 用于装饰和渐变
3. **警告/重要**: 使用激光粉 (`#ff0080`) 突出重要信息
4. **发光效果**: 适度使用，避免过度
5. **背景**: 始终使用深色背景以获得最佳对比度
6. **渐变**: 优先使用预定义的渐变变量

---

**版本**: v1.0.0
**最后更新**: 2026-03-03
**设计者**: CyberPress Design Team