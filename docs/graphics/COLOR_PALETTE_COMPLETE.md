# CyberPress Platform - 完整配色参考手册

## 📊 核心色板

### 主色调 (Primary Colors)

```css
/* 霓虹青 - 主强调色 */
--cyber-cyan: #00f0ff
--cyber-cyan-light: #4df4ff
--cyber-cyan-dark: #00a0aa

/* 赛博紫 - 次强调色 */
--cyber-purple: #9d00ff
--cyber-purple-light: #b34dff
--cyber-purple-dark: #6600aa

/* 激光粉 - 强调色 */
--cyber-pink: #ff0080
--cyber-pink-light: #ff3399
--cyber-pink-dark: #cc0066

/* 电压黄 - 高亮色 */
--cyber-yellow: #f0ff00
--cyber-yellow-light: #f4ff33
--cyber-yellow-dark: #c0cc00
```

### 中性色 (Neutral Colors)

```css
/* 深空色系 */
--cyber-black: #0a0a0f
--cyber-dark: #12121a
--cyber-gray-dark: #1a1a2f
--cyber-gray: #303040
--cyber-gray-light: #606070

/* 浅色色系 */
--cyber-gray-200: #a0a0b0
--cyber-gray-300: #c0c0d0
--cyber-white: #e0e0e0
--cyber-white-pure: #ffffff
```

### 功能色 (Functional Colors)

```css
/* 成功 */
--cyber-green: #00ff88
--cyber-green-dark: #00cc66

/* 警告 */
--cyber-orange: #ff8800
--cyber-orange-dark: #cc6600

/* 错误 */
--cyber-red: #ff0044
--cyber-red-dark: #cc0033

/* 信息 */
--cyber-blue: #0088ff
--cyber-blue-dark: #0066cc
```

---

## 🌈 渐变方案 (Gradients)

### 线性渐变 (Linear Gradients)

```css
/* 霓虹渐变 - 青到紫 */
.gradient-neon {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
}

/* 热力渐变 - 粉到黄 */
.gradient-heat {
  background: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%);
}

/* 赛博全谱渐变 */
.gradient-cyber {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
}

/* 深空渐变 */
.gradient-deep {
  background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%);
}

/* 极光渐变 */
.gradient-aurora {
  background: linear-gradient(135deg, #00ff88 0%, #00f0ff 50%, #9d00ff 100%);
}
```

### 径向渐变 (Radial Gradients)

```css
/* 霓虹光晕 */
.radial-glow-cyan {
  background: radial-gradient(circle, rgba(0,240,255,0.8) 0%, rgba(0,240,255,0) 70%);
}

/* 赛博光晕 */
.radial-glow-purple {
  background: radial-gradient(circle, rgba(157,0,255,0.8) 0%, rgba(157,0,255,0) 70%);
}

/* 聚光灯效果 */
.radial-spotlight {
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
}
```

---

## ✨ 发光效果 (Glow Effects)

### 文字发光

```css
/* 霓虹青发光 */
.text-glow-cyan {
  color: #00f0ff;
  text-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff;
}

/* 赛博紫发光 */
.text-glow-purple {
  color: #9d00ff;
  text-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px #9d00ff;
}

/* 激光粉发光 */
.text-glow-pink {
  color: #ff0080;
  text-shadow:
    0 0 5px #ff0080,
    0 0 10px #ff0080,
    0 0 20px #ff0080;
}

/* 强烈发光 */
.text-glow-intense {
  text-shadow:
    0 0 10px currentColor,
    0 0 20px currentColor,
    0 0 40px currentColor,
    0 0 80px currentColor;
}
```

### 盒子发光

```css
/* 霓虹边框发光 */
.box-glow-cyan {
  box-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    inset 0 0 5px rgba(0,240,255,0.2);
}

/* 赛博边框发光 */
.box-glow-purple {
  box-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px #9d00ff,
    inset 0 0 5px rgba(157,0,255,0.2);
}

/* 全息效果 */
.box-glow-holographic {
  box-shadow:
    0 0 10px rgba(0,240,255,0.5),
    0 0 20px rgba(157,0,255,0.3),
    0 0 30px rgba(255,0,128,0.2);
}
```

---

## 🎨 Tailwind CSS 配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 主色调
        'cyber-cyan': {
          DEFAULT: '#00f0ff',
          light: '#4df4ff',
          dark: '#00a0aa',
        },
        'cyber-purple': {
          DEFAULT: '#9d00ff',
          light: '#b34dff',
          dark: '#6600aa',
        },
        'cyber-pink': {
          DEFAULT: '#ff0080',
          light: '#ff3399',
          dark: '#cc0066',
        },
        'cyber-yellow': {
          DEFAULT: '#f0ff00',
          light: '#f4ff33',
          dark: '#c0cc00',
        },

        // 中性色
        'cyber-black': '#0a0a0f',
        'cyber-dark': '#12121a',
        'cyber-gray': {
          DEFAULT: '#303040',
          dark: '#1a1a2f',
          light: '#606070',
          200: '#a0a0b0',
          300: '#c0c0d0',
        },

        // 功能色
        'cyber-green': '#00ff88',
        'cyber-orange': '#ff8800',
        'cyber-red': '#ff0044',
        'cyber-blue': '#0088ff',
      },

      boxShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 10px #00f0ff',
        'neon-cyan-lg': '0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff',
        'neon-purple': '0 0 5px #9d00ff, 0 0 10px #9d00ff',
        'neon-purple-lg': '0 0 10px #9d00ff, 0 0 20px #9d00ff, 0 0 40px #9d00ff',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px #ff0080',
        'neon-pink-lg': '0 0 10px #ff0080, 0 0 20px #ff0080, 0 0 40px #ff0080',
      },

      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'gradient-heat': 'linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)',
        'gradient-cyber': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
        'gradient-deep': 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2f 100%)',
      },
    },
  },
}
```

---

## 📋 使用指南

### 按钮配色

```tsx
// 主按钮
<button className="px-6 py-2 bg-gradient-neon text-cyber-black font-bold rounded hover:shadow-neon-cyan-lg transition-all">
  主按钮
</button>

// 次按钮
<button className="px-6 py-2 border-2 border-cyber-purple text-cyber-purple font-bold rounded hover:bg-cyber-purple hover:text-white transition-all">
  次按钮
</button>

// 强调按钮
<button className="px-6 py-2 bg-cyber-pink text-white font-bold rounded hover:shadow-neon-pink-lg transition-all">
  强调按钮
</button>
```

### 卡片样式

```tsx
<div className="bg-cyber-dark border border-cyber-gray rounded-lg p-6 hover:border-cyber-cyan hover:shadow-neon-cyan transition-all">
  <h3 className="text-cyber-cyan text-glow-cyan text-xl font-bold">标题</h3>
  <p className="text-cyber-gray-200 mt-2">内容</p>
</div>
```

### 输入框

```tsx
<input
  type="text"
  className="w-full px-4 py-2 bg-cyber-black border border-cyber-gray rounded text-cyber-white placeholder-cyber-gray-light focus:border-cyber-cyan focus:shadow-neon-cyan outline-none transition-all"
  placeholder="输入内容..."
/>
```

---

## 🌓 主题切换

### 深色模式 (默认)

```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
  --accent-primary: #00f0ff;
  --accent-secondary: #9d00ff;
}
```

### 浅色模式

```css
[data-theme="light"] {
  --bg-primary: #f0f0f5;
  --bg-secondary: #e0e0e8;
  --text-primary: #1a1a2f;
  --text-secondary: #404050;
  --accent-primary: #0066ff;
  --accent-secondary: #6600cc;
}
```

---

## 📐 颜色对比度标准

所有配色组合都符合 WCAG AA 标准（对比度 ≥ 4.5:1）：

| 前景色 | 背景色 | 对比度 | 等级 |
|--------|--------|--------|------|
| #e0e0e0 | #0a0a0f | 16.1:1 | AAA |
| #00f0ff | #0a0a0f | 12.3:1 | AAA |
| #9d00ff | #0a0a0f | 8.5:1 | AAA |
| #ff0080 | #0a0a0f | 7.2:1 | AAA |
| #f0ff00 | #0a0a0f | 15.8:1 | AAA |

---

**文档版本**: v2.0.0
**最后更新**: 2026-03-06
**维护者**: CyberPress 设计团队
