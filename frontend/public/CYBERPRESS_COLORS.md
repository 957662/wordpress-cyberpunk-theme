# CyberPress 配色参考手册

> 版本: 2.0.0
> 更新日期: 2026-03-03
> 设计风格: 赛博朋克

---

## 🎨 完整色板

### 主要霓虹色

#### 赛博青 (Cyber Cyan)
```
Hex: #00f0ff
RGB: rgb(0, 240, 255)
HSL: hsl(182, 100%, 50%)
```
**用途**:
- 主要强调色
- 链接文字
- 按钮
- 图标
- 边框装饰

**变体**:
| 名称 | Hex | 用途 |
|------|-----|------|
| 赛博青亮 | `#00f5ff` | 高亮 |
| 赛博青标准 | `#00f0ff` | 主要 |
| 赛博青暗 | `#00a0ff` | 次要 |
| 赛博青深 | `#0080aa` | 边框 |

**透明度变体**:
```css
/* 浅透明 */
rgba(0, 240, 255, 0.1)

/* 中透明 */
rgba(0, 240, 255, 0.3)

/* 重透明 */
rgba(0, 240, 255, 0.6)
```

---

#### 赛博紫 (Cyber Purple)
```
Hex: #9d00ff
RGB: rgb(157, 0, 255)
HSL: hsl(277, 100%, 50%)
```
**用途**:
- 次要强调色
- 渐变背景
- 装饰元素
- 特殊状态

**变体**:
| 名称 | Hex | 用途 |
|------|-----|------|
| 赛博紫亮 | `#bd66ff` | 高光 |
| 赛博紫标准 | `#9d00ff` | 主要 |
| 赛博紫暗 | `#6a00aa` | 阴影 |
| 赛博紫深 | `#4a0077` | 边框 |

---

#### 激光粉 (Laser Pink)
```
Hex: #ff0080
RGB: rgb(255, 0, 128)
HSL: hsl(330, 100%, 50%)
```
**用途**:
- 警告提示
- 特殊状态
- 装饰点缀
- 爱心/收藏

**变体**:
| 名称 | Hex | 用途 |
|------|-----|------|
| 激光粉亮 | `#ff66b3` | 高光 |
| 激光粉标准 | `#ff0080` | 主要 |
| 激光粉暗 | `#aa0056` | 阴影 |

---

#### 电压黄 (Voltage Yellow)
```
Hex: #f0ff00
RGB: rgb(240, 255, 0)
HSL: hsl(63, 100%, 50%)
```
**用途**:
- 高亮显示
- 通知提示
- 成功状态
- 数据流指示

**变体**:
| 名称 | Hex | 用途 |
|------|-----|------|
| 电压黄亮 | `#f9ff80` | 高光 |
| 电压黄标准 | `#f0ff00` | 主要 |
| 电压黄暗 | `#a3aa00` | 阴影 |

---

### 背景色系

#### 深空黑 (Deep Space)
```
主背景: #0a0a0f
RGB: rgb(10, 10, 15)
```

```
次背景: #050508
RGB: rgb(5, 5, 8)
```

```
纯黑: #000000
RGB: rgb(0, 0, 0)
```

```
卡片背景: #16162a
RGB: rgb(22, 22, 42)
```

```
静默背景: #1a1a2e
RGB: rgb(26, 26, 46)
```

---

### 功能色系

#### 成功绿 (Success Green)
```
主色: #00ff88
RGB: rgb(0, 255, 136)
HSL: hsl(153, 100%, 50%)
```
**变体**:
- 亮色: `#66ffbb`
- 暗色: `#00aa5a`

**用途**:
- 成功消息
- 在线状态
- 正确答案
- 完成状态

---

#### 警告橙 (Warning Orange)
```
主色: #ff6600
RGB: rgb(255, 102, 0)
HSL: hsl(24, 100%, 50%)
```
**变体**:
- 亮色: `#ff9966`
- 暗色: `#aa4400`

**用途**:
- 警告消息
- 待处理
- 注意事项
- 过期提醒

---

#### 错误红 (Error Red)
```
主色: #ff0040
RGB: rgb(255, 0, 64)
HSL: hsl(345, 100%, 50%)
```
**变体**:
- 亮色: `#ff6680`
- 暗色: `#aa002a`

**用途**:
- 错误消息
- 失败状态
- 删除操作
- 离线状态

---

### 中性色系

#### 文字色
```
主文字: #e0e0e0
RGB: rgb(224, 224, 224)
```
```
次文字: #a0a0b0
RGB: rgb(160, 160, 176)
```
```
禁用文字: #606070
RGB: rgb(96, 96, 112)
```
```
占位文字: #404050
RGB: rgb(64, 64, 80)
```

---

#### 边框色
```
主边框: #2a2a4a
RGB: rgb(42, 42, 74)
```
```
次边框: #3a3a5a
RGB: rgb(58, 58, 90)
```
```
暗边框: #1a1a2e
RGB: rgb(26, 26, 46)
```
```
亮边框: #4a4a6a
RGB: rgb(74, 74, 106)
```

---

## 🎭 渐变配方

### 线性渐变

#### 青紫渐变
```css
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
```

#### 青粉渐变
```css
background: linear-gradient(135deg, #00f0ff 0%, #ff0080 100%);
```

#### 紫粉渐变
```css
background: linear-gradient(135deg, #9d00ff 0%, #ff0080 100%);
```

#### 深色背景渐变
```css
background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
```

#### 对角渐变
```css
background: linear-gradient(45deg, #0a0a0f 0%, #16162a 100%);
```

---

### 径向渐变

#### 发光效果
```css
background: radial-gradient(circle, rgba(0, 240, 255, 0.2) 0%, transparent 70%);
```

#### 紫色光晕
```css
background: radial-gradient(circle, rgba(157, 0, 255, 0.15) 0%, transparent 60%);
```

#### 粉色光晕
```css
background: radial-gradient(circle, rgba(255, 0, 128, 0.1) 0%, transparent 50%);
```

---

### 多色渐变

#### 霓虹渐变
```css
background: linear-gradient(
  90deg,
  #00f0ff 0%,
  #9d00ff 33%,
  #ff0080 66%,
  #f0ff00 100%
);
```

#### 深空渐变
```css
background: linear-gradient(
  180deg,
  #0a0a0f 0%,
  #16162a 50%,
  #0a0a0f 100%
);
```

---

## ✨ 发光效果

### 霓虹发光

#### 青色发光
```css
/* 轻微发光 */
box-shadow: 0 0 5px rgba(0, 240, 255, 0.5);

/* 中等发光 */
box-shadow: 0 0 10px rgba(0, 240, 255, 0.7);

/* 强烈发光 */
box-shadow: 0 0 20px rgba(0, 240, 255, 0.8),
            0 0 40px rgba(0, 240, 255, 0.6);

/* 超强发光 */
box-shadow: 0 0 30px rgba(0, 240, 255, 0.9),
            0 0 60px rgba(0, 240, 255, 0.7),
            0 0 90px rgba(0, 240, 255, 0.5);
```

#### 紫色发光
```css
box-shadow: 0 0 20px rgba(157, 0, 255, 0.8);
```

#### 粉色发光
```css
box-shadow: 0 0 20px rgba(255, 0, 128, 0.8);
```

#### 黄色发光
```css
box-shadow: 0 0 20px rgba(240, 255, 0, 0.8);
```

---

### 文字发光

```css
/* 青色霓虹文字 */
.neon-text-cyan {
  color: #00f0ff;
  text-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    0 0 40px #00f0ff;
}

/* 紫色霓虹文字 */
.neon-text-purple {
  color: #9d00ff;
  text-shadow:
    0 0 5px #9d00ff,
    0 0 10px #9d00ff,
    0 0 20px #9d00ff;
}

/* 粉色霓虹文字 */
.neon-text-pink {
  color: #ff0080;
  text-shadow:
    0 0 5px #ff0080,
    0 0 10px #ff0080,
    0 0 20px #ff0080;
}
```

---

## 🎯 使用示例

### Tailwind 配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber': {
          'cyan': '#00f0ff',
          'purple': '#9d00ff',
          'pink': '#ff0080',
          'yellow': '#f0ff00',
          'dark': '#0a0a0f',
          'darker': '#050508',
          'card': '#16162a',
          'muted': '#1a1a2e',
        },
        'success': '#00ff88',
        'warning': '#ff6600',
        'error': '#ff0040',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.8)',
        'neon-purple': '0 0 20px rgba(157, 0, 255, 0.8)',
        'neon-pink': '0 0 20px rgba(255, 0, 128, 0.8)',
      },
    },
  },
}
```

### CSS 变量

```css
:root {
  /* 主要颜色 */
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
  --cyber-pink: #ff0080;
  --cyber-yellow: #f0ff00;

  /* 背景颜色 */
  --bg-primary: #0a0a0f;
  --bg-secondary: #050508;
  --bg-card: #16162a;
  --bg-muted: #1a1a2e;

  /* 功能颜色 */
  --color-success: #00ff88;
  --color-warning: #ff6600;
  --color-error: #ff0040;

  /* 文字颜色 */
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
  --text-disabled: #606070;

  /* 边框颜色 */
  --border-primary: #2a2a4a;
  --border-secondary: #3a3a5a;
}
```

### React 使用

```tsx
// 使用自定义颜色
<div className="bg-cyber-dark text-cyber-cyan border border-cyber-border">
  赛博朋克风格
</div>

// 使用发光效果
<div className="shadow-neon-cyan">
  霓虹发光
</div>

// 使用渐变
<div className="bg-gradient-to-r from-cyber-cyan to-cyber-purple">
  渐变背景
</div>
```

---

## 📋 色彩对比度

### WCAG AA 标准
| 前景色 | 背景色 | 对比度 | 等级 |
|--------|--------|--------|------|
| #00f0ff | #0a0a0f | 8.5:1 | AAA |
| #e0e0e0 | #0a0a0f | 14.1:1 | AAA |
| #a0a0b0 | #0a0a0f | 7.2:1 | AA |
| #00ff88 | #0a0a0f | 9.3:1 | AAA |

### 推荐组合
- **主文字**: `#e0e0e0` on `#0a0a0f`
- **次要文字**: `#a0a0b0` on `#0a0a0f`
- **链接文字**: `#00f0ff` on `#0a0a0f`
- **按钮文字**: `#0a0a0f` on `#00f0ff`

---

## 🎨 配色建议

### 深色模式优先
所有颜色都针对深色背景优化，避免在浅色背景上使用霓虹色。

### 适度使用
霓虹色效果强烈，应适度使用，避免视觉疲劳。

### 对比度
确保文字和背景有足够对比度（最小 4.5:1）。

### 一致性
在整个应用中保持颜色使用的一致性。

### 可访问性
为色盲用户提供额外的视觉提示（图标、纹理）。

---

**文档维护**: AI 图形设计师
**最后更新**: 2026-03-03
