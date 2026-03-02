# CyberPress Platform - 配色参考

## 🎨 核心配色方案

CyberPress 采用赛博朋克风格配色系统，以深色背景配合高饱和度的霓虹色彩。

## 🌈 主色调 (Primary Colors)

### 深色系背景
| 颜色名称 | Hex 代码 | RGB | 用途 |
|---------|---------|-----|------|
| 深空黑 | `#0a0a0f` | rgb(10, 10, 15) | 主背景 |
| 更深黑 | `#050508` | rgb(5, 5, 8) | 次背景 |
| 纯黑 | `#000000` | rgb(0, 0, 0) | 强对比背景 |

### 霓虹色系
| 颜色名称 | Hex 代码 | RGB | 用途 |
|---------|---------|-----|------|
| 霓虹青 | `#00f0ff` | rgb(0, 240, 255) | 主强调色、链接、主按钮 |
| 赛博紫 | `#9d00ff` | rgb(157, 0, 255) | 次强调色、渐变 |
| 激光粉 | `#ff0080` | rgb(255, 0, 128) | 特殊强调、警告 |
| 电压黄 | `#f0ff00` | rgb(240, 255, 0) | 高亮、成功状态 |
| 霓虹绿 | `#00ff88` | rgb(0, 255, 136) | 成功、完成状态 |
| 赛博橙 | `#ff6600` | rgb(255, 102, 0) | 警告、注意 |

### 中性色系
| 颜色名称 | Hex 代码 | RGB | 用途 |
|---------|---------|-----|------|
| 静音紫 | `#1a1a2e` | rgb(26, 26, 46) | 卡片背景 |
| 卡片色 | `#16162a` | rgb(22, 22, 42) | 次卡片背景 |
| 边框色 | `#2a2a4a` | rgb(42, 42, 74) | 边框、分割线 |

## 🎭 语义色 (Semantic Colors)

### 状态色
| 用途 | 颜色 | Hex 代码 |
|-----|------|---------|
| 成功 | 霓虹绿 | `#00ff88` |
| 信息 | 霓虹青 | `#00f0ff` |
| 警告 | 电压黄 | `#f0ff00` |
| 错误 | 激光粉 | `#ff0080` |
| 禁用 | 灰色 | `#4a4a6a` |

## ✨ 渐变色 (Gradients)

### 主渐变
```css
/* 霓虹渐变 - 从青到粉 */
linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)

/* 全霓虹渐变 - 包含黄色 */
linear-gradient(135deg, #00f0ff 0%, #9d00ff 33%, #ff0080 66%, #f0ff00 100%)

/* 赛博渐变 */
linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)

/* 深空渐变 */
linear-gradient(180deg, #16162a 0%, #0a0a0f 100%)
```

### 文字渐变
```css
/* 青紫渐变文字 */
background: linear-gradient(90deg, #00f0ff, #9d00ff);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

## 💫 发光效果 (Glow Effects)

### 霓虹发光
```css
/* 青色发光 */
box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;

/* 紫色发光 */
box-shadow: 0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff;

/* 粉色发光 */
box-shadow: 0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 20px #ff0080;

/* 黄色发光 */
box-shadow: 0 0 5px #f0ff00, 0 0 10px #f0ff00, 0 0 20px #f0ff00;
```

### 文字发光
```css
/* 青色文字发光 */
text-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff;

/* 紫色文字发光 */
text-shadow: 0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff;

/* 粉色文字发光 */
text-shadow: 0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 20px #ff0080;
```

## 🎨 Tailwind CSS 配置

项目中已配置的 Tailwind 颜色类：

```tsx
// 背景色
bg-cyber-dark      // #0a0a0f
bg-cyber-darker    // #050508
bg-cyber-black     // #000000
bg-cyber-muted     // #1a1a2e
bg-cyber-card      // #16162a

// 文字色
text-cyber-cyan    // #00f0ff
text-cyber-purple  // #9d00ff
text-cyber-pink    // #ff0080
text-cyber-yellow  // #f0ff00
text-cyber-green   // #00ff88
text-cyber-orange  // #ff6600

// 边框色
border-cyber-border  // #2a2a4a

// 发光阴影
shadow-neon-cyan
shadow-neon-purple
shadow-neon-pink
shadow-neon-yellow
shadow-glow-cyan
shadow-glow-purple
shadow-glow-pink
shadow-glow-yellow
```

## 📱 配色应用场景

### 导航栏
```tsx
<nav className="bg-cyber-darker/80 backdrop-blur-md border-b border-cyber-border">
  {/* 内容 */}
</nav>
```

### 卡片
```tsx
<div className="bg-cyber-card border border-cyber-border hover:border-cyber-cyan transition-all">
  {/* 内容 */}
</div>
```

### 按钮
```tsx
<button className="bg-cyber-cyan text-cyber-dark hover:shadow-neon-cyan">
  主按钮
</button>

<button className="border border-cyber-purple text-cyber-purple hover:bg-cyber-purple hover:text-cyber-dark">
  次按钮
</button>
```

### 链接
```tsx
<a className="text-cyber-cyan hover:text-cyber-pink hover:shadow-neon-pink">
  链接文本
</a>
```

## 🎭 配色组合建议

### 高对比度组合
- 背景: `#0a0a0f`
- 文字: `#e0e0e0`
- 强调: `#00f0ff`

### 柔和赛博朋克
- 背景: `#1a1a2e`
- 文字: `#c0c0d0`
- 强调: `#9d00ff`

### 强烈赛博朋克
- 背景: `#050508`
- 文字: `#ffffff`
- 强调: `#ff0080`

### 渐变组合
- 主色: `#00f0ff` → `#9d00ff`
- 背景: `#0a0a0f` → `#16162a`
- 强调: `#ff0080` → `#f0ff00`

## 🌓 深浅模式切换

虽然 CyberPress 主要使用深色模式，但也支持浅色模式：

### 深色模式（默认）
```css
--cyber-dark: #0a0a0f;
--cyber-cyan: #00f0ff;
--cyber-purple: #9d00ff;
```

### 浅色模式
```css
--cyber-light: #f0f0f5;
--cyber-cyan-dark: #00a0aa;
--cyber-purple-dark: #6600aa;
```

## 📐 配色最佳实践

1. **使用 60-30-10 法则**
   - 60% 主色（深色背景）
   - 30% 次色（中性色）
   - 10% 强调色（霓虹色）

2. **确保可访问性**
   - 文字与背景对比度至少 4.5:1
   - 链接和按钮有明显的视觉反馈

3. **发光效果适度使用**
   - 不要过度使用发光效果
   - 主要用于强调和交互元素

4. **保持一致性**
   - 同类元素使用相同颜色
   - 建立颜色使用规范并遵循

## 🔗 CSS 变量

项目在 `globals.css` 中定义的 CSS 变量：

```css
:root {
  --cyber-dark: #0a0a0f;
  --cyber-darker: #050508;
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
  --cyber-pink: #ff0080;
  --cyber-yellow: #f0ff00;
  --cyber-green: #00ff88;
  --cyber-muted: #1a1a2e;
  --cyber-card: #16162a;
  --cyber-border: #2a2a4a;
}
```

---

**最后更新**: 2026-03-03
**维护者**: CyberPress 设计团队
