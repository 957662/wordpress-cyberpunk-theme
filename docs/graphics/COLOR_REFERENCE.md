# CyberPress 配色参考

> 赛博朋克主题完整配色方案

## 📚 目录

- [主色调](#主色调)
- [辅助色](#辅助色)
- [渐变色](#渐变色)
- [功能色](#功能色)
- [灰度色](#灰度色)
- [使用指南](#使用指南)
- [配色示例](#配色示例)

---

## 🎨 主色调

### 深空黑
```css
--cyber-dark: #0a0a0f
```
**用途**: 主背景、深色底色

### 更深黑
```css
--cyber-darker: #050508
```
**用途**: 卡片背景、分层背景

### 靛蓝黑
```css
--cyber-muted: #1a1a2e
```
**用途**: 次级背景、容器背景

### 卡片黑
```css
--cyber-card: #16162a
```
**用途**: 卡片、面板、弹窗

---

## 💡 强调色

### 霓虹青
```css
--cyber-cyan: #00f0ff
```
**RGB**: rgb(0, 240, 255)
**用途**:
- 主强调色
- 链接、按钮
- 图标、高亮
- 边框发光

### 赛博紫
```css
--cyber-purple: #9d00ff
```
**RGB**: rgb(157, 0, 255)
**用途**:
- 次强调色
- 渐变效果
- 装饰元素
- 动画效果

### 激光粉
```css
--cyber-pink: #ff0080
```
**RGB**: rgb(255, 0, 128)
**用途**:
- 警告、注意
- 特殊标记
- 装饰点缀
- 社交链接

### 电压黄
```css
--cyber-yellow: #f0ff00
```
**RGB**: rgb(240, 255, 0)
**用途**:
- 提示信息
- 星级评分
- 亮点标记

### 霓虹绿
```css
--cyber-green: #00ff88
```
**RGB**: rgb(0, 255, 136)
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

## 🎨 配色示例

### 示例1: 导航栏
```css
.navbar {
  background: rgba(10, 10, 15, 0.9);
  border-bottom: 1px solid #2a2a4a;
  backdrop-filter: blur(10px);
}

.nav-link {
  color: #e0e0e0;
}

.nav-link:hover {
  color: #00f0ff;
  text-shadow: 0 0 10px #00f0ff;
}
```

### 示例2: Hero区域
```css
.hero {
  background: radial-gradient(
    ellipse at center,
    #1a1a2e 0%,
    #0a0a0f 100%
  );
}

.hero-title {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 240, 255, 0.5);
}
```

### 示例3: 卡片组件
```css
.card {
  background: linear-gradient(135deg, #16162a 0%, #1a1a2e 100%);
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #00f0ff;
  box-shadow:
    0 0 20px rgba(0, 240, 255, 0.2),
    0 10px 40px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
}
```

### 示例4: 按钮样式
```css
.cyber-button {
  background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%);
  border: 1px solid #00f0ff;
  color: #00f0ff;
  padding: 0.75rem 1.5rem;
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
    rgba(0, 240, 255, 0.2),
    transparent
  );
  transition: left 0.5s ease;
}

.cyber-button:hover::before {
  left: 100%;
}

.cyber-button:hover {
  background: #00f0ff;
  color: #0a0a0f;
  box-shadow: 0 0 20px #00f0ff;
}
```

### 示例5: 输入框
```css
.cyber-input {
  background: #0a0a0f;
  border: 1px solid #2a2a4a;
  color: #e0e0e0;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.cyber-input:focus {
  outline: none;
  border-color: #00f0ff;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.cyber-input::placeholder {
  color: #6a6a7a;
}
```

### 示例6: 代码块
```css
.code-block {
  background: #050508;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  padding: 1.5rem;
  overflow-x: auto;
}

.code-keyword { color: #ff0080; }
.code-function { color: #00f0ff; }
.code-string { color: #00ff88; }
.code-comment { color: #6a6a7a; }
.code-variable { color: #9d00ff; }
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

## 📱 Tailwind配置

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
      },
      boxShadow: {
        'neon-cyan': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(157, 0, 255, 0.5), 0 0 20px rgba(157, 0, 255, 0.3)',
        'neon-pink': '0 0 10px rgba(255, 0, 128, 0.5), 0 0 20px rgba(255, 0, 128, 0.3)',
      },
    },
  },
};
```

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

## 📊 配色速查表

| 颜色 | HEX | RGB | 用途 |
|------|-----|-----|------|
| 深空黑 | #0a0a0f | rgb(10,10,15) | 主背景 |
| 霓虹青 | #00f0ff | rgb(0,240,255) | 主强调色 |
| 赛博紫 | #9d00ff | rgb(157,0,255) | 次强调色 |
| 激光粉 | #ff0080 | rgb(255,0,128) | 警告色 |
| 霓虹绿 | #00ff88 | rgb(0,255,136) | 成功色 |
| 电压黄 | #f0ff00 | rgb(240,255,0) | 提示色 |

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
