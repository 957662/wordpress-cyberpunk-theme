# CyberPress Platform - 配色参考

## 🎨 赛博朋克主题色板

### 核心颜色 (Core Colors)

```
┌─────────────────────────────────────────────────────────────┐
│  深空黑 (Deep Space Black)                                  │
│  HEX: #0a0a0f                                               │
│  RGB: rgb(10, 10, 15)                                       │
│  HSL: hsl(240, 20%, 5%)                                     │
│  用途: 主背景、深色模式基底                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  霓虹青 (Neon Cyan) - 主强调色                              │
│  HEX: #00f0ff                                               │
│  RGB: rgb(0, 240, 255)                                      │
│  HSL: hsl(182, 100%, 50%)                                   │
│  用途: 主要链接、按钮、发光效果                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  赛博紫 (Cyber Purple) - 次强调色                           │
│  HEX: #9d00ff                                               │
│  RGB: rgb(157, 0, 255)                                      │
│  HSL: hsl(277, 100%, 50%)                                   │
│  用途: 次要链接、渐变、装饰                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  激光粉 (Laser Pink) - 强调色                               │
│  HEX: #ff0080                                               │
│  RGB: rgb(255, 0, 128)                                      │
│  HSL: hsl(330, 100%, 50%)                                   │
│  用途: 警告、重要信息、渐变                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  电压黄 (Voltage Yellow) - 高亮色                           │
│  HEX: #f0ff00                                               │
│  RGB: rgb(240, 255, 0)                                      │
│  HSL: hsl(63, 100%, 50%)                                    │
│  用途: 高亮、评分、特殊标记                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌈 扩展色板 (Extended Palette)

### 渐变系列 (Gradients)

```css
/* 霓虹渐变 - 青到紫 */
.neon-gradient {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
}

/* 热力渐变 - 粉到黄 */
.heat-gradient {
  background: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%);
}

/* 赛博渐变 - 全光谱 */
.cyber-gradient {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
}

/* 深空渐变 */
.deep-gradient {
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%);
}
```

### 发光效果 (Glow Effects)

```css
/* 霓虹发光 */
.neon-glow-cyan {
  box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;
  text-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;
}

.neon-glow-purple {
  box-shadow: 0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff;
  text-shadow: 0 0 5px #9d00ff, 0 0 10px #9d00ff;
}

.neon-glow-pink {
  box-shadow: 0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 20px #ff0080;
  text-shadow: 0 0 5px #ff0080, 0 0 10px #ff0080;
}
```

---

## 🎭 文字颜色 (Typography Colors)

```css
/* 主要文字 */
.text-primary {
  color: #e0e0e0;
}

/* 次要文字 */
.text-secondary {
  color: #a0a0b0;
}

/* 禁用文字 */
.text-muted {
  color: #606070;
}

/* 强调文字 */
.text-accent {
  color: #00f0ff;
}
```

---

## 🖼️ 背景颜色 (Background Colors)

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
```

---

## 📊 Tailwind CSS 配置

在 `tailwind.config.ts` 中添加：

```typescript
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

        // 浅色变体
        'cyber-cyan-light': '#4df4ff',
        'cyber-purple-light': '#b34dff',

        // 深色变体
        'cyber-cyan-dark': '#00a0aa',
        'cyber-purple-dark': '#6600aa',

        // 灰度
        'cyber-gray-100': '#e0e0e0',
        'cyber-gray-200': '#a0a0b0',
        'cyber-gray-300': '#606070',
        'cyber-gray-400': '#303040',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 10px #00f0ff',
        'neon-purple': '0 0 5px #9d00ff, 0 0 10px #9d00ff',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px #ff0080',
        'neon-cyan-lg': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff',
        'neon-purple-lg': '0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 40px #9d00ff',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'heat-gradient': 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)',
        'cyber-gradient': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
        'deep-gradient': 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%)',
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
}
```

---

## 🎨 使用示例

### 按钮

```tsx
<button className="
  px-6 py-2
  bg-neon-gradient
  text-cyber-black
  font-bold
  rounded
  hover:shadow-neon-cyan
  transition-all
">
  点击我
</button>
```

### 卡片

```tsx
<div className="
  bg-card
  border border-cyber-cyan/20
  rounded-lg
  p-6
  hover:border-cyber-cyan
  hover:shadow-neon-cyan
  transition-all
">
  <h3 className="text-cyber-cyan neon-glow-cyan">标题</h3>
  <p className="text-cyber-gray-200">内容</p>
</div>
```

### 链接

```tsx
<a href="#" className="
  text-cyber-cyan
  hover:text-cyber-purple
  transition-colors
  neon-glow-cyan
">
  链接文字
</a>
```

---

## 🌙 深色/浅色模式

### 浅色模式变体

```css
/* 浅色模式背景 */
:root {
  --bg-primary: #f0f0f5;
  --bg-secondary: #e0e0e8;
  --text-primary: #1a1a2f;
  --text-secondary: #404050;
}

/* 深色模式背景 */
[data-theme="dark"] {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
}
```

---

## 📋 快速参考

| 用途 | 颜色 | CSS Class |
|------|------|-----------|
| 主背景 | `#0a0a0f` | `bg-cyber-black` |
| 卡片背景 | `#12121a` | `bg-cyber-dark` |
| 主要文字 | `#e0e0e0` | `text-cyber-gray-100` |
| 次要文字 | `#a0a0b0` | `text-cyber-gray-200` |
| 主链接/按钮 | `#00f0ff` | `text-cyber-cyan` |
| 次要链接 | `#9d00ff` | `text-cyber-purple` |
| 强调色 | `#ff0080` | `text-cyber-pink` |
| 高亮色 | `#f0ff00` | `text-cyber-yellow` |

---

## 🔧 实用工具类

```css
/* 发光文字 */
.text-glow-cyan {
  color: #00f0ff;
  text-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff;
}

/* 边框发光 */
.border-glow {
  border: 1px solid #00f0ff;
  box-shadow: 0 0 5px #00f0ff, inset 0 0 5px rgba(0, 240, 255, 0.1);
}

/* 扫描线效果 */
.scanlines::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  );
  pointer-events: none;
}
```

---

**创建时间**: 2026-03-02
**项目**: CyberPress Platform
**主题**: Cyberpunk Aesthetics
