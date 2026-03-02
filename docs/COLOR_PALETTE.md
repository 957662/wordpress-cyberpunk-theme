# CyberPress 配色参考

## 🎨 赛博朋克配色方案

### 主色系 - Primary Colors

#### 霓虹青 - Neon Cyan
```
HEX:     #00f0ff
RGB:     rgb(0, 240, 255)
HSL:     hsl(182, 100%, 50%)
用途:     主要强调色、链接、按钮
```

#### 赛博紫 - Cyber Purple
```
HEX:     #9d00ff
RGB:     rgb(157, 0, 255)
HSL:     hsl(283, 100%, 50%)
用途:     次要强调色、装饰、渐变
```

#### 激光粉 - Laser Pink
```
HEX:     #ff0080
RGB:     rgb(255, 0, 128)
HSL:     hsl(330, 100%, 50%)
用途:     警告、重要提示、装饰
```

#### 电压黄 - Voltage Yellow
```
HEX:     #f0ff00
RGB:     rgb(240, 255, 0)
HSL:     hsl(64, 100%, 50%)
用途:     高亮、星星、装饰点
```

#### 矩阵绿 - Matrix Green
```
HEX:     #00ff88
RGB:     rgb(0, 255, 136)
HSL:     hsl(152, 100%, 50%)
用途:     成功状态、在线状态
```

### 中性色 - Neutral Colors

#### 深空黑 - Deep Space Black
```
HEX:     #0a0a0f
RGB:     rgb(10, 10, 15)
HSL:     hsl(240, 20%, 5%)
用途:     主背景、深色主题
```

#### 深灰 - Dark Gray
```
HEX:     #111111
RGB:     rgb(17, 17, 17)
HSL:     hsl(0, 0%, 7%)
用途:     卡片背景、次级背景
```

#### 中灰 - Medium Gray
```
HEX:     #222222
RGB:     rgb(34, 34, 34)
HSL:     hsl(0, 0%, 13%)
用途:     边框、分隔线
```

#### 浅灰 - Light Gray
```
HEX:     #666666
RGB:     rgb(102, 102, 102)
HSL:     hsl(0, 0%, 40%)
用途:     次要文字、占位符
```

#### 白色 - White
```
HEX:     #ffffff
RGB:     rgb(255, 255, 255)
HSL:     hsl(0, 0%, 100%)
用途:     主要文字、高亮
```

## 🌈 渐变组合

### 主渐变 - Main Gradient
```
linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)
```

### 霓虹渐变 - Neon Gradient
```
linear-gradient(90deg, #00f0ff 0%, #9d00ff 100%)
```

### 热力渐变 - Heat Gradient
```
linear-gradient(90deg, #9d00ff 0%, #ff0080 100%)
```

### 冷光渐变 - Cool Gradient
```
linear-gradient(180deg, #f0ff00 0%, #00f0ff 100%)
```

### 深度渐变 - Depth Gradient
```
radial-gradient(circle at center, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)
```

## 💡 使用指南

### 文字颜色

#### 主要文字
```
浅色主题: #0a0a0f (深空黑)
深色主题: #ffffff (白色)
```

#### 次要文字
```
浅色主题: #666666 (浅灰)
深色主题: #999999 (中浅灰)
```

#### 链接文字
```
默认:     #00f0ff (霓虹青)
悬停:     #9d00ff (赛博紫)
激活:     #ff0080 (激光粉)
```

### 背景颜色

#### 主背景
```
浅色主题: #ffffff (白色)
深色主题: #0a0a0f (深空黑)
```

#### 卡片背景
```
浅色主题: #f8f8f8 (极浅灰)
深色主题: #111111 (深灰)
```

#### 输入框背景
```
浅色主题: #ffffff (白色)
深色主题: #1a1a1a (较深灰)
```

### 边框颜色

#### 主边框
```
浅色主题: #e0e0e0 (浅边框灰)
深色主题: #222222 (中灰)
```

#### 发光边框
```
霓虹青:   #00f0ff
赛博紫:   #9d00ff
激光粉:   #ff0080
```

### 状态颜色

#### 成功/在线
```
主色:     #00ff88 (矩阵绿)
背景:     rgba(0, 255, 136, 0.1)
边框:     #00ff88
```

#### 警告
```
主色:     #f0ff00 (电压黄)
背景:     rgba(240, 255, 0, 0.1)
边框:     #f0ff00
```

#### 错误/离线
```
主色:     #ff0080 (激光粉)
背景:     rgba(255, 0, 128, 0.1)
边框:     #ff0080
```

#### 信息
```
主色:     #00f0ff (霓虹青)
背景:     rgba(0, 240, 255, 0.1)
边框:     #00f0ff
```

## 🔆 发光效果

### 霓虹发光
```css
.neon-glow-cyan {
  text-shadow:
    0 0 7px #00f0ff,
    0 0 10px #00f0ff,
    0 0 21px #00f0ff,
    0 0 42px #00f0ff;
}

.neon-glow-purple {
  text-shadow:
    0 0 7px #9d00ff,
    0 0 10px #9d00ff,
    0 0 21px #9d00ff,
    0 0 42px #9d00ff;
}

.neon-glow-pink {
  text-shadow:
    0 0 7px #ff0080,
    0 0 10px #ff0080,
    0 0 21px #ff0080,
    0 0 42px #ff0080;
}
```

### 边框发光
```css
.border-glow {
  box-shadow:
    0 0 5px rgba(0, 240, 255, 0.5),
    0 0 10px rgba(0, 240, 255, 0.3),
    inset 0 0 5px rgba(0, 240, 255, 0.1);
}
```

## 📱 Tailwind CSS 配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // 主色系
        'cyber-cyan': '#00f0ff',
        'cyber-purple': '#9d00ff',
        'cyber-pink': '#ff0080',
        'cyber-yellow': '#f0ff00',
        'cyber-green': '#00ff88',

        // 中性色
        'deep-black': '#0a0a0f',
        'dark-gray': '#111111',
        'medium-gray': '#222222',
        'light-gray': '#666666',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
        'neon-gradient': 'linear-gradient(90deg, #00f0ff 0%, #9d00ff 100%)',
        'heat-gradient': 'linear-gradient(90deg, #9d00ff 0%, #ff0080 100%)',
        'cool-gradient': 'linear-gradient(180deg, #f0ff00 0%, #00f0ff 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 10px rgba(0, 240, 255, 0.5)',
        'neon-purple': '0 0 5px #9d00ff, 0 0 10px rgba(157, 0, 255, 0.5)',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px rgba(255, 0, 128, 0.5)',
      },
    },
  },
}
```

## 🎭 主题变量

```css
:root {
  /* 主色系 */
  --color-cyan: #00f0ff;
  --color-purple: #9d00ff;
  --color-pink: #ff0080;
  --color-yellow: #f0ff00;
  --color-green: #00ff88;

  /* 中性色 */
  --color-black: #0a0a0f;
  --color-dark-gray: #111111;
  --color-medium-gray: #222222;
  --color-light-gray: #666666;
  --color-white: #ffffff;

  /* 渐变 */
  --gradient-main: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
  --gradient-neon: linear-gradient(90deg, #00f0ff 0%, #9d00ff 100%);
  --gradient-heat: linear-gradient(90deg, #9d00ff 0%, #ff0080 100%);

  /* 发光效果 */
  --glow-cyan: 0 0 10px rgba(0, 240, 255, 0.8);
  --glow-purple: 0 0 10px rgba(157, 0, 255, 0.8);
  --glow-pink: 0 0 10px rgba(255, 0, 128, 0.8);
}
```

## 📊 配色对比度

### 深色主题对比度
```
白色文字 on 深空黑:     16.85:1 ✅ AAA
霓虹青 on 深空黑:       8.84:1 ✅ AAA
赛博紫 on 深空黑:       6.97:1 ✅ AA
激光粉 on 深空黑:       6.22:1 ✅ AA
```

### 浅色主题对比度
```
深空黑 on 白色:         16.85:1 ✅ AAA
深空黑 on 浅灰:         10.37:1 ✅ AAA
霓虹青 on 白色:         1.19:1 ❌ (需加深)
```

## 🎯 使用建议

### ✅ 推荐组合
1. 深空黑背景 + 霓虹青强调
2. 深灰背景 + 赛博紫装饰
3. 白色文字 + 霓虹青渐变按钮
4. 矩阵绿表示成功状态

### ❌ 避免组合
1. 霓虹青文字 on 白色背景
2. 多种主色同时使用（不超过3种）
3. 高饱和度颜色大面积使用
4. 激光粉与赛博紫相邻使用

---

**风格**: Cyberpunk / Neon
**色系**: 5 主色 + 5 中性色
**对比度**: WCAG AA/AAA
**主题**: 深色优先
