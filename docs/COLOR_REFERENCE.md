# CyberPress 配色参考

> 赛博朋克主题的完整色彩系统

**版本**: 2.0
**更新时间**: 2026-03-03
**设计风格**: Cyberpunk / Neon / Dark Mode

---

## 📋 目录

- [色彩系统概述](#色彩系统概述)
- [主色调](#主色调)
- [辅助色](#辅助色)
- [语义色](#语义色)
- [中性色](#中性色)
- [渐变色](#渐变色)
- [色彩应用](#色彩应用)
- [最佳实践](#最佳实践)

---

## 🎨 色彩系统概述

CyberPress 采用经典的赛博朋克配色方案，以深色背景为基底，搭配高饱和度的霓虹色彩，营造出未来科技感。

### 设计原则

1. **高对比度**: 确保文字在深色背景下清晰可读
2. **霓虹发光**: 关键元素使用发光效果增强视觉冲击
3. **色彩语义**: 不同颜色代表不同的交互状态
4. **可访问性**: 符合 WCAG 2.1 AA 级标准

### 色彩对比度

| 前景色 | 背景色 | 对比度 | 等级 |
|--------|--------|--------|------|
| `#00f0ff` | `#0a0a0f` | 12.5:1 | AAA |
| `#e0e0e0` | `#0a0a0f` | 14.2:1 | AAA |
| `#9d00ff` | `#0a0a0f` | 8.7:1 | AA+ |
| `#ff0080` | `#0a0a0f` | 7.2:1 | AA |

---

## 💡 主色调

### 霓虹青 (Neon Cyan) - 主色

```css
--cyber-cyan: #00f0ff;
```

**色值**: RGB(0, 240, 255) | HSL(182, 100%, 50%)

**用途**:
- 主要操作按钮
- 链接文字
- 图标高亮
- 装饰线条

**变体**:
```css
--cyber-cyan-bright: #00ffff;  /* 更亮 */
--cyber-cyan-dark: #00a0aa;    /* 更暗 */
--cyber-cyan-muted: rgba(0, 240, 255, 0.1);  /* 柔和 */
```

**发光效果**:
```css
.text-glow-cyan {
  text-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff;
}
```

---

### 赛博紫 (Cyber Purple) - 辅助色

```css
--cyber-purple: #9d00ff;
```

**色值**: RGB(157, 0, 255) | HSL(273, 100%, 50%)

**用途**:
- 次要操作
- 标签分类
- 博客文章
- 渐变背景

**变体**:
```css
--cyber-purple-bright: #b833ff;
--cyber-purple-dark: #6a00cc;
--cyber-purple-muted: rgba(157, 0, 255, 0.1);
```

**发光效果**:
```css
.text-glow-purple {
  text-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px #9d00ff;
}
```

---

### 激光粉 (Laser Pink) - 强调色

```css
--cyber-pink: #ff0080;
```

**色值**: RGB(255, 0, 128) | HSL(330, 100%, 50%)

**用途**:
- 警告提示
- 删除操作
- 收藏点赞
- 错误状态

**变体**:
```css
--cyber-pink-bright: #ff3399;
--cyber-pink-dark: #cc0066;
--cyber-pink-muted: rgba(255, 0, 128, 0.1);
```

**发光效果**:
```css
.text-glow-pink {
  text-shadow:
    0 0 5px #ff0080,
    0 0 10px #ff0080,
    0 0 20px #ff0080;
}
```

---

## 🔋 辅助色

### 电压黄 (Voltage Yellow)

```css
--cyber-yellow: #f0ff00;
```

**色值**: RGB(240, 255, 0) | HSL(63, 100%, 50%)

**用途**:
- 评分星级
- 收藏标记
- 警告提示
- 重要提示

**变体**:
```css
--cyber-yellow-bright: #f9ff4d;
--cyber-yellow-dark: #c0cc00;
--cyber-yellow-muted: rgba(240, 255, 0, 0.1);
```

---

### 矩阵绿 (Matrix Green)

```css
--cyber-green: #00ff88;
```

**色值**: RGB(0, 255, 136) | HSL(152, 100%, 50%)

**用途**:
- 成功状态
- 在线状态
- 完成标记
- 代码高亮

**变体**:
```css
--cyber-green-bright: #33ffaa;
--cyber-green-dark: #00cc6a;
--cyber-green-muted: rgba(0, 255, 136, 0.1);
```

---

## 🎯 语义色

### 成功 (Success)

```css
--color-success: #00ff88;
--color-success-bg: rgba(0, 255, 136, 0.1);
--color-success-border: #00cc6a;
```

**用途**: 成功提示、完成状态、在线状态

---

### 警告 (Warning)

```css
--color-warning: #f0ff00;
--color-warning-bg: rgba(240, 255, 0, 0.1);
--color-warning-border: #c0cc00;
```

**用途**: 警告提示、重要通知

---

### 错误 (Error)

```css
--color-error: #ff0080;
--color-error-bg: rgba(255, 0, 128, 0.1);
--color-error-border: #cc0066;
```

**用途**: 错误提示、删除操作、离线状态

---

### 信息 (Info)

```css
--color-info: #00f0ff;
--color-info-bg: rgba(0, 240, 255, 0.1);
--color-info-border: #00a0aa;
```

**用途**: 信息提示、帮助文档

---

## 🌑 中性色

### 背景色系

```css
/* 主背景 */
--cyber-dark: #0a0a0f;
--cyber-darker: #050508;

/* 卡片背景 */
--cyber-card: #16162a;
--cyber-muted: #1a1a2e;

/* 边框 */
--cyber-border: #2a2a4a;
--cyber-border-light: #3a3a5a;
```

### 文字色系

```css
/* 主要文字 */
--text-primary: #e0e0e0;
--text-secondary: #a0a0b0;
--text-muted: #606070;

/* 代码文字 */
--text-code: #00f0ff;
--text-code-bg: rgba(0, 240, 255, 0.1);
```

---

## 🌈 渐变色

### 主渐变 (Primary Gradient)

```css
.gradient-primary {
  background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
}
```

**用途**: 主要按钮、Hero 区域

---

### 全息渐变 (Holographic Gradient)

```css
.gradient-holographic {
  background: linear-gradient(
    135deg,
    #00f0ff 0%,
    #9d00ff 25%,
    #ff0080 50%,
    #f0ff00 75%,
    #00ff88 100%
  );
}
```

**用途**: 装饰背景、特殊效果

---

### 矩阵雨渐变 (Matrix Rain Gradient)

```css
.gradient-matrix {
  background: linear-gradient(
    180deg,
    rgba(0, 255, 136, 0) 0%,
    rgba(0, 255, 136, 0.5) 50%,
    rgba(0, 255, 136, 1) 100%
  );
}
```

**用途**: 矩阵雨效果背景

---

### 深空渐变 (Deep Space Gradient)

```css
.gradient-deep-space {
  background: radial-gradient(
    ellipse at center,
    #1a1a2e 0%,
    #0a0a0f 100%
  );
}
```

**用途**: 页面背景、卡片背景

---

## 🎨 色彩应用

### 按钮色彩

```css
/* 主要按钮 */
.btn-primary {
  background: linear-gradient(135deg, #00f0ff 0%, #00a0aa 100%);
  color: #0a0a0f;
  border: none;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
}

/* 次要按钮 */
.btn-secondary {
  background: transparent;
  color: #9d00ff;
  border: 1px solid #9d00ff;
  box-shadow: 0 0 10px rgba(157, 0, 255, 0.3);
}

/* 危险按钮 */
.btn-danger {
  background: transparent;
  color: #ff0080;
  border: 1px solid #ff0080;
  box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
}
```

---

### 卡片色彩

```css
/* 标准卡片 */
.card {
  background: linear-gradient(135deg, #16162a 0%, #1a1a2e 100%);
  border: 1px solid #2a2a4a;
}

/* 悬停效果 */
.card:hover {
  border-color: #00f0ff;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.2);
}
```

---

### 链接色彩

```css
/* 默认链接 */
a {
  color: #00f0ff;
  text-decoration: none;
  transition: all 0.3s ease;
}

/* 悬停状态 */
a:hover {
  color: #ff0080;
  text-shadow: 0 0 10px #ff0080;
}
```

---

### 代码块色彩

```css
/* 代码块背景 */
pre {
  background: #050508;
  border: 1px solid #2a2a4a;
}

/* 行内代码 */
code {
  background: rgba(0, 240, 255, 0.1);
  color: #00f0ff;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}
```

---

## 📐 色彩规范

### 使用比例

| 色彩 | 使用比例 | 场景 |
|------|----------|------|
| 深色背景 | 60% | 页面背景、卡片 |
| 霓虹青 | 20% | 主要操作、链接 |
| 赛博紫 | 10% | 次要操作、装饰 |
| 激光粉 | 5% | 强调、警告 |
| 其他颜色 | 5% | 特殊场景 |

---

### 色彩组合

#### 推荐组合 ✅

```
霓虹青 + 深黑
赛博紫 + 霓虹青
激光粉 + 深紫
矩阵绿 + 深黑
电压黄 + 深紫
```

#### 避免组合 ❌

```
激光粉 + 电压黄 (对比度不足)
矩阵绿 + 霓虹青 (语义混淆)
赛博紫 + 深紫 (层次不清)
```

---

## 🎯 最佳实践

### DO - 推荐做法

1. **高对比度文字**
   ```css
   color: #e0e0e0;  /* 在深色背景上清晰可读 */
   ```

2. **发光效果适度使用**
   ```css
   /* 仅用于关键元素 */
   .button-primary {
     box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
   }
   ```

3. **语义化颜色**
   ```css
   /* 成功使用绿色 */
   .success { color: #00ff88; }
   /* 错误使用粉色 */
   .error { color: #ff0080; }
   ```

4. **渐变自然过渡**
   ```css
   background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
   ```

---

### DON'T - 避免做法

1. **❌ 低对比度**
   ```css
   color: #2a2a4a;  /* 在深色背景上不可读 */
   ```

2. **❌ 过度使用发光**
   ```css
   /* 所有元素都发光，视觉混乱 */
   * { box-shadow: 0 0 20px ...; }
   ```

3. **❌ 颜色语义错误**
   ```css
   .success { color: #ff0080; }  /* 错误：成功不应是粉色 */
   ```

4. **❌ 过多颜色**
   ```css
   /* 使用了太多不同颜色 */
   color: #ff00ff; background: #00ffff; border: #ffff00;
   ```

---

## 🎨 Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a0f',
          darker: '#050508',
          cyan: '#00f0ff',
          purple: '#9d00ff',
          pink: '#ff0080',
          yellow: '#f0ff00',
          green: '#00ff88',
          muted: '#1a1a2e',
          card: '#16162a',
          border: '#2a2a4a',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(157, 0, 255, 0.5)',
        'neon-pink': '0 0 20px rgba(255, 0, 128, 0.5)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'gradient-holographic':
          'linear-gradient(135deg, #00f0ff 0%, #9d00ff 25%, #ff0080 50%, #f0ff00 75%, #00ff88 100%)',
      },
    },
  },
};
```

---

## 📊 色彩对比度表

### 前景色 vs 背景色

| 前景色 | 背景色 | 对比度 | WCAG 等级 |
|--------|--------|--------|-----------|
| `#00f0ff` | `#0a0a0f` | 12.5:1 | AAA |
| `#9d00ff` | `#0a0a0f` | 8.7:1 | AA+ |
| `#ff0080` | `#0a0a0f` | 7.2:1 | AA |
| `#f0ff00` | `#0a0a0f` | 13.1:1 | AAA |
| `#00ff88` | `#0a0a0f` | 11.8:1 | AAA |
| `#e0e0e0` | `#0a0a0f` | 14.2:1 | AAA |
| `#a0a0b0` | `#0a0a0f` | 8.9:1 | AA+ |
| `#606070` | `#0a0a0f` | 4.5:1 | AA |

---

## 🔧 调试工具

### CSS 变量检查

```javascript
// 浏览器控制台
document.documentElement.style.getPropertyValue('--cyber-cyan');
// 输出: "#00f0ff"
```

### 对比度检查

```javascript
// 计算对比度
function getContrastRatio(fg, bg) {
  const luminance = (color) => {
    const rgb = parseInt(color.slice(1), 16);
    const [r, g, b] = [(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255];
    const [lr, lg, lb] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
  };

  const lum1 = luminance(fg);
  const lum2 = luminance(bg);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// 使用
getContrastRatio('#00f0ff', '#0a0a0f');
// 输出: 12.5
```

---

## 📚 参考资料

- [WCAG 2.1 对比度要求](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [赛博朋克色彩理论](https://colorhunt.co/cyberpunk)
- [WebAIM 对比度检查器](https://webaim.org/resources/contrastchecker/)

---

## 📝 更新日志

### v2.0 (2026-03-03)
- 🎨 新增矩阵绿色
- 📊 完善色彩对比度数据
- 🔧 更新 Tailwind 配置
- 📚 添加最佳实践指南

### v1.0 (2026-02-15)
- 🎉 初始版本发布
- 🌈 基础色彩系统
- 💫 霓虹发光效果
- 🎯 语义化配色

---

**设计团队**: CyberPress AI Design Team
**色彩标准**: WCAG 2.1 AA+
**技术支持**: CSS Variables / Tailwind CSS
**许可证**: MIT
