# CyberPress 配色系统完整参考

> 赛博朋克主题完整配色方案 v2.0

## 📚 目录

- [主色调](#主色调)
- [强调色](#强调色)
- [渐变色](#渐变色)
- [功能色](#功能色)
- [灰度色](#灰度色)
- [使用指南](#使用指南)
- [Tailwind 配置](#tailwind-配置)
- [CSS 变量](#css-变量)

---

## 🎨 主色调

### 深空黑
```css
--cyber-dark: #0a0a0f
```
**RGB**: rgb(10, 10, 15)
**用途**: 主背景、深色底色

### 更深黑
```css
--cyber-darker: #050508
```
**RGB**: rgb(5, 5, 8)
**用途**: 卡片背景、分层背景

### 靛蓝黑
```css
--cyber-muted: #1a1a2e
```
**RGB**: rgb(26, 26, 46)
**用途**: 次级背景、容器背景

### 卡片黑
```css
--cyber-card: #16162a
```
**RGB**: rgb(22, 22, 42)
**用途**: 卡片、面板、弹窗

---

## 💡 强调色

### 霓虹青 (Cyan)
```css
--cyber-cyan: #00f0ff
```
**RGB**: rgb(0, 240, 255)
**HSL**: hsl(183, 100%, 50%)
**用途**:
- 主强调色
- 链接、按钮
- 图标、高亮
- 边框发光

### 赛博紫 (Purple)
```css
--cyber-purple: #9d00ff
```
**RGB**: rgb(157, 0, 255)
**HSL**: hsl(273, 100%, 50%)
**用途**:
- 次强调色
- 渐变效果
- 装饰元素
- 动画效果

### 激光粉 (Pink)
```css
--cyber-pink: #ff0080
```
**RGB**: rgb(255, 0, 128)
**HSL**: hsl(330, 100%, 50%)
**用途**:
- 警告、注意
- 特殊标记
- 装饰点缀
- 社交链接

### 电压黄 (Yellow)
```css
--cyber-yellow: #f0ff00
```
**RGB**: rgb(240, 255, 0)
**HSL**: hsl(64, 100%, 50%)
**用途**:
- 提示信息
- 星级评分
- 亮点标记

### 霓虹绿 (Green)
```css
--cyber-green: #00ff88
```
**RGB**: rgb(0, 255, 136)
**HSL**: hsl(158, 100%, 50%)
**用途**:
- 成功状态
- 在线状态
- 代码高亮

---

## 🌈 渐变色

### 主渐变
```css
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
```
**用途**: 按钮、卡片、背景

### 三色渐变
```css
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
```
**用途**: Hero区域、特色区块

### 深色渐变
```css
background: linear-gradient(135deg, #1a1a2e 0%, #0a0a0f 100%);
```
**用途**: 卡片、面板背景

### 垂直渐变
```css
background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%);
```
**用途**: 页面背景、分段背景

### 对角渐变
```css
background: linear-gradient(45deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
```
**用途**: 装饰性背景

### 径向渐变
```css
background: radial-gradient(circle at center, #1a1a2e 0%, #0a0a0f 100%);
```
**用途**: 聚光灯效果

---

## 🔔 功能色

### 成功
```css
--cyber-success: #00ff88
```
**用途**: 成功消息、确认状态

### 警告
```css
--cyber-warning: #f0ff00
```
**用途**: 警告提示、注意事项

### 错误
```css
--cyber-error: #ff0080
```
**用途**: 错误消息、删除操作

### 信息
```css
--cyber-info: #00f0ff
```
**用途**: 信息提示、帮助说明

---

## 🌫️ 灰度色

```css
--cyber-gray-50:  #f8f9fa
--cyber-gray-100: #f1f3f5
--cyber-gray-200: #e9ecef
--cyber-gray-300: #dee2e6
--cyber-gray-400: #ced4da
--cyber-gray-500: #adb5bd
--cyber-gray-600: #868e96
--cyber-gray-700: #495057
--cyber-gray-800: #343a40
--cyber-gray-900: #212529
```

**用途**:
- 文字层级
- 边框线条
- 禁用状态
- 分割线

---

## 📐 边框色

```css
--cyber-border: #2a2a4a
```
**用途**: 边框、分割线、轮廓

---

## 🎯 使用指南

### 文字颜色

**主文字**
```css
color: #e0e0e0;
```

**次要文字**
```css
color: #a0a0b0;
```

**禁用文字**
```css
color: #6a6a7a;
```

**链接文字**
```css
color: #00f0ff;
```

**链接悬停**
```css
color: #ff0080;
text-shadow: 0 0 10px #ff0080;
```

### 背景颜色

**页面背景**
```css
background-color: #0a0a0f;
```

**卡片背景**
```css
background: linear-gradient(135deg, #16162a 0%, #1a1a2e 100%);
```

**输入框背景**
```css
background-color: #0a0a0f;
border-color: #2a2a4a;
```

### 按钮颜色

**主按钮**
```css
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
color: #0a0a0f;
box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
```

**次要按钮**
```css
background: transparent;
border-color: #00f0ff;
color: #00f0ff;
```

**危险按钮**
```css
background: #ff0080;
color: #0a0a0f;
box-shadow: 0 0 20px rgba(255, 0, 128, 0.3);
```

### 发光效果

**霓虹发光**
```css
text-shadow:
  0 0 5px #00f0ff,
  0 0 10px #00f0ff,
  0 0 20px #00f0ff;
```

**边框发光**
```css
box-shadow:
  0 0 5px #00f0ff,
  0 0 10px rgba(0, 240, 255, 0.5),
  inset 0 0 5px rgba(0, 240, 255, 0.1);
```

---

## 🎨 Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0a0f',
        'cyber-darker': '#050508',
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-yellow': '#f0ff00',
        'cyber-green': '#00ff88',
        'cyber-muted': '#1a1a2e',
        'cyber-card': '#16162a',
        'cyber-border': '#2a2a4a',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'cyber-gradient-dark': 'linear-gradient(135deg, #16162a 0%, #0a0a0f 100%)',
        'cyber-gradient-3': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(157, 0, 255, 0.5), 0 0 20px rgba(157, 0, 255, 0.3)',
        'neon-pink': '0 0 10px rgba(255, 0, 128, 0.5), 0 0 20px rgba(255, 0, 128, 0.3)',
        'neon-yellow': '0 0 10px rgba(240, 255, 0, 0.5), 0 0 20px rgba(240, 255, 0, 0.3)',
        'neon-green': '0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)',
      },
    },
  },
};
```

---

## 🎨 CSS 变量

### 全局定义

```css
:root {
  /* 主色调 */
  --cyber-dark: #0a0a0f;
  --cyber-darker: #050508;
  --cyber-muted: #1a1a2e;
  --cyber-card: #16162a;

  /* 强调色 */
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
  --cyber-pink: #ff0080;
  --cyber-yellow: #f0ff00;
  --cyber-green: #00ff88;

  /* 功能色 */
  --cyber-success: #00ff88;
  --cyber-warning: #f0ff00;
  --cyber-error: #ff0080;
  --cyber-info: #00f0ff;

  /* 边框色 */
  --cyber-border: #2a2a4a;

  /* 文字色 */
  --cyber-text-primary: #e0e0e0;
  --cyber-text-secondary: #a0a0b0;
  --cyber-text-disabled: #6a6a7a;

  /* 渐变 */
  --cyber-gradient: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
  --cyber-gradient-3: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
  --cyber-gradient-dark: linear-gradient(135deg, #16162a 0%, #0a0a0f 100%);
}
```

### 使用示例

```css
.button {
  background: var(--cyber-gradient);
  color: var(--cyber-dark);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
}

.card {
  background: var(--cyber-card);
  border: 1px solid var(--cyber-border);
}

.text {
  color: var(--cyber-text-primary);
}
```

---

## 🎭 主题切换

### 深色模式（默认）
```css
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #16162a;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
  --accent: #00f0ff;
}
```

### 浅色模式
```css
[data-theme="light"] {
  --bg-primary: #f8f9fa;
  --bg-secondary: #ffffff;
  --text-primary: #212529;
  --text-secondary: #495057;
  --accent: #0066cc;
}
```

### 霓虹模式
```css
[data-theme="neon"] {
  --bg-primary: #000000;
  --bg-secondary: #0a0a0f;
  --text-primary: #ffffff;
  --text-secondary: #00f0ff;
  --accent: #ff00ff;
}
```

---

## 📊 配色速查表

| 颜色 | HEX | RGB | HSL | 用途 |
|------|-----|-----|-----|------|
| 深空黑 | #0a0a0f | rgb(10,10,15) | hsl(240, 20%, 5%) | 主背景 |
| 霓虹青 | #00f0ff | rgb(0,240,255) | hsl(183, 100%, 50%) | 主强调色 |
| 赛博紫 | #9d00ff | rgb(157,0,255) | hsl(273, 100%, 50%) | 次强调色 |
| 激光粉 | #ff0080 | rgb(255,0,128) | hsl(330, 100%, 50%) | 警告色 |
| 霓虹绿 | #00ff88 | rgb(0,255,136) | hsl(158, 100%, 50%) | 成功色 |
| 电压黄 | #f0ff00 | rgb(240,255,0) | hsl(64, 100%, 50%) | 提示色 |

---

## 🎨 使用技巧

### 1. 对比度
- 确保文字与背景有足够对比度（至少4.5:1）
- 使用浅色文字（#e0e0e0）在深色背景上
- 避免使用过暗的颜色作为文字

### 2. 发光效果
- 适度使用发光效果，不要过度
- 发光效果适合用于交互元素（按钮、链接）
- 避免在大面积使用发光

### 3. 渐变使用
- 渐变应自然过渡
- 使用相邻色系创建和谐渐变
- 避免使用过多颜色

### 4. 色彩层次
- 使用主色调突出重点
- 使用辅助色补充细节
- 保留足够的空白空间

### 5. 可访问性
- 不仅依赖颜色传达信息
- 为色盲用户提供替代方案
- 确保焦点状态清晰可见

---

**最后更新**: 2026-03-07
**版本**: 2.0.0
**设计团队**: CyberPress AI Design Team
