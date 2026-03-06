# CyberPress Color Palette v2.0
## 🎨 完整配色方案

**版本**: v2.0.0
**最后更新**: 2026-03-06
**设计团队**: CyberPress AI Design Team

---

## 📋 目录

1. [主色系](#主色系)
2. [中性色系](#中性色系)
3. [渐变组合](#渐变组合)
4. [发光效果](#发光效果)
5. [语义化颜色](#语义化颜色)
6. [组件配色](#组件配色)
7. [使用指南](#使用指南)
8. [Tailwind 配置](#tailwind-配置)

---

## 🌈 主色系

### 深色背景

| 颜色名称 | CSS 变量 | 色值 | 用途 | 示例 |
|---------|---------|------|------|------|
| 深空黑 | `--cyber-dark` | #0a0a0f | 主背景 | `<div class="bg-cyber-dark">` |
| 更深黑 | `--cyber-darker` | #050508 | 次背景 | `<div class="bg-cyber-darker">` |
| 纯黑 | `--cyber-black` | #000000 | 强调 | `<div class="bg-cyber-black">` |

### 霓虹色

| 颜色名称 | CSS 变量 | 色值 | 用途 | 示例 |
|---------|---------|------|------|------|
| 霓虹青 | `--cyber-cyan` | #00f0ff | 主要色 | `<span class="text-cyber-cyan">` |
| 赛博紫 | `--cyber-purple` | #9d00ff | 次要色 | `<span class="text-cyber-purple">` |
| 激光粉 | `--cyber-pink` | #ff0080 | 强调色 | `<span class="text-cyber-pink">` |
| 电压黄 | `--cyber-yellow` | #f0ff00 | 警告色 | `<span class="text-cyber-yellow">` |
| 矩阵绿 | `--cyber-green` | #00ff88 | 成功色 | `<span class="text-cyber-green">` |
| 火焰橙 | `--cyber-orange` | #ff6600 | 提示色 | `<span class="text-cyber-orange">` |

### 颜色可视化

```
深空黑 #0a0a0f  ████████████████████
更深黑 #050508  ████████████████████
纯黑   #000000  ████████████████████
霓虹青 #00f0ff  ████████████████████
赛博紫 #9d00ff  ████████████████████
激光粉 #ff0080  ████████████████████
电压黄 #f0ff00  ████████████████████
矩阵绿 #00ff88  ████████████████████
火焰橙 #ff6600  ████████████████████
```

---

## 🎭 中性色系

| 颜色名称 | CSS 变量 | 色值 | 用途 |
|---------|---------|------|------|
| 深空蓝 | `--cyber-muted` | #1a1a2e | 弱化背景 |
| 卡片色 | `--cyber-card` | #16162a | 卡片背景 |
| 边框色 | `--cyber-border` | #2a2a4a | 边框 |

### 中性色渐变

```
深空蓝 #1a1a2e  ████████████████████
卡片色 #16162a  ████████████████████
边框色 #2a2a4a  ████████████████████
```

---

## 🌊 渐变组合

### 品牌渐变

```css
/* 主品牌渐变 */
--gradient-brand: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 三色渐变 */
--gradient-tricolor: linear-gradient(90deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);

/* 垂直渐变 */
--gradient-vertical: linear-gradient(180deg, #0a0a0f 0%, #16162a 100%);

/* 对角渐变 */
--gradient-diagonal: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
```

### 功能渐变

```css
/* 成功渐变 */
--gradient-success: linear-gradient(135deg, #00ff88 0%, #00f0ff 100%);

/* 警告渐变 */
--gradient-warning: linear-gradient(135deg, #f0ff00 0%, #ff6600 100%);

/* 错误渐变 */
--gradient-error: linear-gradient(135deg, #ff0080 0%, #ff6600 100%);

/* 信息渐变 */
--gradient-info: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
```

### 渐变使用示例

```css
/* 按钮 */
.btn-primary {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
}

/* 文字渐变 */
.text-gradient {
  background: linear-gradient(90deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 背景 */
.hero-bg {
  background: linear-gradient(180deg, #0a0a0f 0%, #16162a 100%);
}
```

---

## ✨ 发光效果

### 霓虹发光

```css
/* 青色发光 */
--glow-cyan: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;

/* 紫色发光 */
--glow-purple: 0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff;

/* 粉色发光 */
--glow-pink: 0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 20px #ff0080;

/* 黄色发光 */
--glow-yellow: 0 0 5px #f0ff00, 0 0 10px #f0ff00, 0 0 20px #f0ff00;

/* 绿色发光 */
--glow-green: 0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 20px #00ff88;
```

### 内发光

```css
/* 内部发光 */
--glow-inset: inset 0 0 30px rgba(0, 240, 255, 0.1);
```

### 发光效果示例

```css
/* 发光按钮 */
.btn-glow {
  box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;
}

/* 发光文字 */
.text-glow {
  text-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;
}

/* 内发光卡片 */
.card-glow {
  box-shadow: inset 0 0 30px rgba(0, 240, 255, 0.1);
}
```

---

## 🎯 语义化颜色

### 状态颜色

```css
/* 信息 */
--color-info: #00f0ff;
--bg-info: rgba(0, 240, 255, 0.1);
--border-info: #00f0ff;

/* 成功 */
--color-success: #00ff88;
--bg-success: rgba(0, 255, 136, 0.1);
--border-success: #00ff88;

/* 警告 */
--color-warning: #f0ff00;
--bg-warning: rgba(240, 255, 0, 0.1);
--border-warning: #f0ff00;

/* 错误 */
--color-error: #ff0080;
--bg-error: rgba(255, 0, 128, 0.1);
--border-error: #ff0080;
```

### 语义化颜色使用

```css
/* 信息提示 */
.alert-info {
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid #00f0ff;
  color: #00f0ff;
}

/* 成功提示 */
.alert-success {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid #00ff88;
  color: #00ff88;
}

/* 警告提示 */
.alert-warning {
  background: rgba(240, 255, 0, 0.1);
  border: 1px solid #f0ff00;
  color: #f0ff00;
}

/* 错误提示 */
.alert-error {
  background: rgba(255, 0, 128, 0.1);
  border: 1px solid #ff0080;
  color: #ff0080;
}
```

---

## 🎨 组件配色

### 按钮

```css
/* 主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
  color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
}

/* 次要按钮 */
.btn-secondary {
  background: transparent;
  border: 2px solid #00f0ff;
  color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

/* 危险按钮 */
.btn-danger {
  background: linear-gradient(135deg, #ff0080 0%, #ff6600 100%);
  color: #ffffff;
  box-shadow: 0 0 20px rgba(255, 0, 128, 0.5);
}

/* 成功按钮 */
.btn-success {
  background: linear-gradient(135deg, #00ff88 0%, #00f0ff 100%);
  color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
}
```

### 卡片

```css
/* 基础卡片 */
.card {
  background: #16162a;
  border: 1px solid #2a2a4a;
  box-shadow: inset 0 0 30px rgba(0, 240, 255, 0.05);
}

/* 悬浮卡片 */
.card:hover {
  background: #1a1a2e;
  border: 1px solid #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
}

/* 高亮卡片 */
.card-highlight {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(157, 0, 255, 0.1) 100%);
  border: 1px solid #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
}
```

### 表单

```css
/* 输入框 */
.input {
  background: #0a0a0f;
  border: 2px solid #2a2a4a;
  color: #ffffff;
}

.input::placeholder {
  color: #6a6a8a;
}

.input:focus {
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  outline: none;
}

/* 文本域 */
.textarea {
  background: #0a0a0f;
  border: 2px solid #2a2a4a;
  color: #ffffff;
  resize: vertical;
}

.textarea:focus {
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  outline: none;
}
```

### 导航

```css
/* 导航栏 */
.navbar {
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #2a2a4a;
}

/* 导航链接 */
.nav-link {
  color: #ffffff;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #00f0ff;
}

.nav-link.active {
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}
```

---

## 📐 使用指南

### 配色比例

```
背景色:  70% (深色系)
主色:    15% (霓虹青)
辅助色:  10% (赛博紫、激光粉)
强调色:   5% (电压黄、矩阵绿)
```

### 最佳实践

1. **留白充足**: 深色背景需要更多留白
2. **发光节制**: 不要过度使用发光效果
3. **对比度**: 确保文本与背景对比度 ≥ 4.5:1
4. **渐变方向**: 统一使用 135deg 或 90deg
5. **颜色一致性**: 相同功能使用相同颜色

### 可访问性

```css
/* 高对比度文本 */
.text-high-contrast {
  color: #ffffff;
}

/* 中对比度文本 */
.text-medium-contrast {
  color: #e0e0e0;
}

/* 低对比度文本 */
.text-low-contrast {
  color: #a0a0a0;
}

/* 禁用文本 */
.text-disabled {
  color: #6a6a8a;
}
```

---

## 🎨 Tailwind 配置

### tailwind.config.js

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // 深色背景
        'cyber-dark': '#0a0a0f',
        'cyber-darker': '#050508',
        'cyber-black': '#000000',

        // 霓虹色
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-yellow': '#f0ff00',
        'cyber-green': '#00ff88',
        'cyber-orange': '#ff6600',

        // 中性色
        'cyber-muted': '#1a1a2e',
        'cyber-card': '#16162a',
        'cyber-border': '#2a2a4a',
      },
      boxShadow: {
        // 霓虹发光
        'neon-cyan': '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff',
        'neon-purple': '0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 20px #ff0080',
        'neon-yellow': '0 0 5px #f0ff00, 0 0 10px #f0ff00, 0 0 20px #f0ff00',
        'neon-green': '0 0 5px #00ff88, 0 0 10px #00ff88, 0 0 20px #00ff88',
      },
      backgroundImage: {
        // 渐变
        'gradient-brand': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'gradient-tricolor': 'linear-gradient(90deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
        'gradient-success': 'linear-gradient(135deg, #00ff88 0%, #00f0ff 100%)',
        'gradient-warning': 'linear-gradient(135deg, #f0ff00 0%, #ff6600 100%)',
        'gradient-error': 'linear-gradient(135deg, #ff0080 0%, #ff6600 100%)',
      },
    },
  },
}
```

### 使用示例

```tsx
// 颜色
<div className="bg-cyber-dark border border-cyber-cyan">
  <button className="bg-gradient-brand text-white shadow-neon-cyan">
    Click Me
  </button>
</div>

// 文字
<span className="text-cyber-cyan">Neon Text</span>
<span className="text-cyber-purple">Purple Text</span>
<span className="text-cyber-pink">Pink Text</span>

// 渐变背景
<div className="bg-gradient-brand">Brand Gradient</div>
<div className="bg-gradient-tricolor">Tricolor Gradient</div>
<div className="bg-gradient-success">Success Gradient</div>

// 发光效果
<button className="shadow-neon-cyan">Neon Button</button>
<button className="shadow-neon-purple">Purple Glow</button>
<button className="shadow-neon-pink">Pink Glow</button>
```

---

## 📊 颜色对比度

### 背景对比度

| 背景色 | 白色文本 | 灰色文本 | 对比度 |
|--------|---------|---------|--------|
| #0a0a0f | ✅ 15.8:1 | ✅ 9.5:1 | AAA |
| #16162a | ✅ 12.3:1 | ✅ 7.4:1 | AAA |
| #1a1a2e | ✅ 11.2:1 | ✅ 6.7:1 | AAA |

### 文本对比度

| 文本色 | 深色背景 | 对比度 |
|--------|---------|--------|
| #ffffff | #0a0a0f | ✅ 15.8:1 (AAA) |
| #e0e0e0 | #0a0a0f | ✅ 13.9:1 (AAA) |
| #a0a0a0 | #0a0a0f | ✅ 7.8:1 (AA) |
| #00f0ff | #0a0a0f | ✅ 8.2:1 (AA) |

---

## 🎯 颜色应用场景

### 主要应用

| 颜色 | 应用场景 | 使用频率 |
|------|---------|---------|
| **霓虹青** | 主要按钮、链接、图标、边框 | ★★★★★ |
| **赛博紫** | 次要按钮、渐变、装饰 | ★★★★☆ |
| **激光粉** | 强调元素、删除操作、收藏 | ★★★★☆ |
| **电压黄** | 警告、评级、高亮 | ★★★☆☆ |
| **矩阵绿** | 成功状态、确认 | ★★★☆☆ |

### 背景层级

```
Level 1: --cyber-dark (主背景)
Level 2: --cyber-darker (模态层、下拉)
Level 3: --cyber-card (卡片、面板)
Level 4: --cyber-muted (禁用状态)
```

---

## 📝 版本历史

### v2.0.0 (2026-03-06)

- 📝 完整配色方案文档
- 🎨 组件配色指南
- 🎨 Tailwind 配置示例
- 📊 颜色对比度表

### v1.0.0 (2026-03-02)

- 🎉 初始配色方案
- 🎨 基础颜色定义
- ✨ 发光效果

---

## 📞 联系方式

**设计团队**: CyberPress AI Design Team
**项目**: CyberPress Platform
**版本**: v2.0.0
**最后更新**: 2026-03-06

---

<div align="center">

**🎨 CyberPress Color Palette v2.0**

**Built with ❤️ by CyberPress AI Design Team**

**Powered by CyberPress Platform**

</div>
