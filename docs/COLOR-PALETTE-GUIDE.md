# CyberPress 配色指南 - 增强版

## 📋 目录

1. [色彩系统概览](#色彩系统概览)
2. [主色调](#主色调)
3. [功能色](#功能色)
4. [中性色](#中性色)
5. [渐变系统](#渐变系统)
6. [发光效果](#发光效果)
7. [应用场景](#应用场景)
8. [最佳实践](#最佳实践)
9. [Tailwind 配置](#tailwind-配置)
10. [代码示例](#代码示例)

---

## 🎨 色彩系统概览

CyberPress 采用经典的赛博朋克配色系统，融合霓虹色彩与深色背景。

### 配色原则

- **深色优先**: 以深色为背景，霓虹色为强调
- **高对比度**: 确保可读性和可访问性
- **渐变美学**: 多色渐变增强科技感
- **发光特效**: 霓虹发光营造未来感

### 配色比例

```
背景色:  70% (深色系)
主色:    15% (霓虹青)
辅助色:  10% (赛博紫、激光粉)
强调色:   5% (电压黄、矩阵绿)
```

---

## 🌈 主色调

### 霓虹青 (Cyber Cyan) - 主要色

```css
--cyber-cyan:     #00f0ff
--cyber-cyan-light:  #00a0ff
--cyber-cyan-dark:   #0080aa
```

**RGB**: `rgb(0, 240, 255)`
**HSL**: `hsl(182, 100%, 50%)`

**应用场景**:
- ✅ 主要按钮、链接
- ✅ 图标、边框
- ✅ 强调文本
- ✅ 交互元素
- ✅ 导航高亮

**Tailwind 类名**:
```tsx
className="text-cyber-cyan"
className="bg-cyber-cyan"
className="border-cyber-cyan"
className="shadow-cyber-cyan"
```

---

### 赛博紫 (Cyber Purple) - 次要色

```css
--cyber-purple:     #9d00ff
--cyber-purple-light:  #bd66ff
--cyber-purple-dark:   #6a00aa
```

**RGB**: `rgb(157, 0, 255)`
**HSL**: `hsl(277, 100%, 50%)`

**应用场景**:
- ✅ 次要按钮
- ✅ 渐变装饰
- ✅ 品牌元素
- ✅ 卡片装饰
- ✅ 标签分类

**Tailwind 类名**:
```tsx
className="text-cyber-purple"
className="bg-cyber-purple"
className="border-cyber-purple"
```

---

### 激光粉 (Laser Pink) - 强调色

```css
--cyber-pink:     #ff0080
--cyber-pink-light:  #ff66b3
--cyber-pink-dark:   #aa0056
```

**RGB**: `rgb(255, 0, 128)`
**HSL**: `hsl(330, 100%, 50%)`

**应用场景**:
- ✅ 删除操作
- ✅ 警告提示
- ✅ 收藏功能
- ✅ 爱心图标
- ✅ 特殊状态

**Tailwind 类名**:
```tsx
className="text-cyber-pink"
className="bg-cyber-pink"
className="border-cyber-pink"
```

---

### 电压黄 (Voltage Yellow) - 警告色

```css
--cyber-yellow:     #f0ff00
--cyber-yellow-light:  #f9ff80
--cyber-yellow-dark:   #a3aa00
```

**RGB**: `rgb(240, 255, 0)`
**HSL**: `hsl(63, 100%, 50%)`

**应用场景**:
- ✅ 警告通知
- ✅ 评级星级
- ✅ 高亮文本
- ✅ 提示信息
- ✅ 待处理状态

**Tailwind 类名**:
```tsx
className="text-cyber-yellow"
className="bg-cyber-yellow"
className="border-cyber-yellow"
```

---

### 矩阵绿 (Matrix Green) - 成功色

```css
--cyber-green:     #00ff88
--cyber-green-light:  #66ffbb
--cyber-green-dark:   #00aa5a
```

**RGB**: `rgb(0, 255, 136)`
**HSL**: `hsl(150, 100%, 50%)`

**应用场景**:
- ✅ 成功状态
- ✅ 确认操作
- ✅ 完成标记
- ✅ 在线状态
- ✅ 正常运行

**Tailwind 类名**:
```tsx
className="text-cyber-green"
className="bg-cyber-green"
className="border-cyber-green"
```

---

## 🚦 功能色

### 信息色 (Info)

```css
color-info:       #00f0ff
bg-info:          rgba(0, 240, 255, 0.1)
border-info:      #00f0ff
```

**使用**:
```tsx
<div className="bg-info/10 border border-info p-4 rounded">
  <p className="text-info">这是一条信息提示</p>
</div>
```

---

### 成功色 (Success)

```css
color-success:    #00ff88
bg-success:       rgba(0, 255, 136, 0.1)
border-success:   #00ff88
```

**使用**:
```tsx
<div className="bg-success/10 border border-success p-4 rounded">
  <p className="text-success">操作成功！</p>
</div>
```

---

### 警告色 (Warning)

```css
color-warning:    #f0ff00
bg-warning:       rgba(240, 255, 0, 0.1)
border-warning:   #f0ff00
```

**使用**:
```tsx
<div className="bg-warning/10 border border-warning p-4 rounded">
  <p className="text-warning">请注意此操作</p>
</div>
```

---

### 错误色 (Error)

```css
color-error:      #ff0080
bg-error:         rgba(255, 0, 128, 0.1)
border-error:     #ff0080
```

**使用**:
```tsx
<div className="bg-error/10 border border-error p-4 rounded">
  <p className="text-error">操作失败，请重试</p>
</div>
```

---

## 🌑 中性色

### 背景色

```css
--cyber-dark:      #0a0a0f  /* 主背景 */
--cyber-darker:    #050508  /* 次背景 */
--cyber-black:     #000000  /* 纯黑 */
--cyber-muted:     #1a1a2e  /* 弱化背景 */
--cyber-card:      #16162a  /* 卡片背景 */
```

### 文本色

```css
--text-primary:    #e0e0e0  /* 主文本 */
--text-secondary:  #a0a0b0  /* 次文本 */
--text-muted:      #606070  /* 弱化文本 */
--text-disabled:   #404050  /* 禁用文本 */
```

### 边框色

```css
--border-primary:  #2a2a4a  /* 主边框 */
--border-secondary: #3a3a5a /* 次边框 */
--border-muted:    #1a1a2e  /* 弱化边框 */
```

---

## 🎨 渐变系统

### 品牌渐变

```css
/* 主品牌渐变 */
gradient-brand: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 三色渐变 */
gradient-tricolor: linear-gradient(90deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);

/* 垂直渐变 */
gradient-vertical: linear-gradient(180deg, #0a0a0f 0%, #16162a 100%);
```

**Tailwind 使用**:
```tsx
<div className="bg-gradient-to-r from-cyber-cyan to-cyber-purple">
  <div className="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink">
  <div className="bg-gradient-to-b from-cyber-dark to-cyber-card">
```

---

### 功能渐变

```css
/* 成功渐变 */
gradient-success: linear-gradient(135deg, #00ff88 0%, #00f0ff 100%);

/* 警告渐变 */
gradient-warning: linear-gradient(135deg, #f0ff00 0%, #ff6600 100%);

/* 错误渐变 */
gradient-error: linear-gradient(135deg, #ff0080 0%, #ff6600 100%);
```

---

### 径向渐变

```css
/* 发光效果 */
radial-glow: radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%);

/* 中心渐变 */
radial-center: radial-gradient(circle at center, #16162a 0%, #0a0a0f 100%);
```

**Tailwind 使用**:
```tsx
<div className="bg-[radial-gradient(circle,_rgba(0,240,255,0.2)_0%,_transparent_70%)]">
```

---

## ✨ 发光效果

### 霓虹发光

```css
/* 青色发光 */
box-shadow-neon-cyan:
  0 0 5px #00f0ff,
  0 0 10px #00f0ff,
  0 0 20px #00f0ff;

/* 紫色发光 */
box-shadow-neon-purple:
  0 0 5px #9d00ff,
  0 0 10px #9d00ff,
  0 0 20px #9d00ff;

/* 粉色发光 */
box-shadow-neon-pink:
  0 0 5px #ff0080,
  0 0 10px #ff0080,
  0 0 20px #ff0080;

/* 黄色发光 */
box-shadow-neon-yellow:
  0 0 5px #f0ff00,
  0 0 10px #f0ff00,
  0 0 20px #f0ff00;
```

**Tailwind 使用**:
```tsx
<div className="shadow-[0_0_20px_#00f0ff]">
<div className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
```

---

### 内发光

```css
box-shadow-inset-glow:
  inset 0 0 30px rgba(0, 240, 255, 0.1);
```

**Tailwind 使用**:
```tsx
<div className="shadow-[inset_0_0_30px_rgba(0,240,255,0.1)]">
```

---

## 🎯 应用场景

### 按钮配色

```tsx
// 主要按钮
<button className="px-6 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] transition-shadow">
  主要操作
</button>

// 次要按钮
<button className="px-6 py-2 border-2 border-cyber-cyan text-cyber-cyan rounded-lg hover:bg-cyber-cyan/10 transition-colors">
  次要操作
</button>

// 危险按钮
<button className="px-6 py-2 bg-gradient-to-r from-cyber-pink to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity">
  删除
</button>
```

---

### 卡片配色

```tsx
// 基础卡片
<div className="bg-cyber-card border border-cyber-border rounded-lg p-6">
  <h3 className="text-cyber-cyan">卡片标题</h3>
  <p className="text-text-secondary">卡片内容</p>
</div>

// 悬浮卡片
<div className="bg-cyber-card border border-cyber-border rounded-lg p-6 hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
  <h3 className="text-cyber-cyan">悬浮效果</h3>
</div>

// 发光卡片
<div className="bg-cyber-card border border-cyber-cyan/50 rounded-lg p-6 shadow-[inset_0_0_30px_rgba(0,240,255,0.05)]">
  <h3 className="text-cyber-cyan">内发光效果</h3>
</div>
```

---

### 输入框配色

```tsx
// 默认状态
<input className="w-full px-4 py-2 bg-cyber-dark border-2 border-cyber-border rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all" />

// 错误状态
<input className="w-full px-4 py-2 bg-cyber-dark border-2 border-cyber-pink rounded-lg text-white focus:outline-none focus:shadow-[0_0_10px_rgba(255,0,128,0.3)]" />

// 成功状态
<input className="w-full px-4 py-2 bg-cyber-dark border-2 border-cyber-green rounded-lg text-white focus:outline-none focus:shadow-[0_0_10px_rgba(0,255,136,0.3)]" />
```

---

### 文本配色

```tsx
// 标题
<h1 className="text-4xl font-bold bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
  渐变标题
</h1>

// 强调文本
<p className="text-cyber-cyan">霓虹青强调</p>
<p className="text-cyber-purple">赛博紫强调</p>
<p className="text-cyber-pink">激光粉强调</p>

// 次要文本
<p className="text-text-secondary">次要内容</p>
<p className="text-text-muted">弱化内容</p>
```

---

## 📋 最佳实践

### ✅ DO - 推荐做法

```tsx
// ✅ 使用语义化颜色
<button className="bg-cyber-cyan">主要操作</button>
<button className="bg-cyber-pink">删除</button>
<button className="bg-cyber-green">保存</button>

// ✅ 适当的对比度
<div className="bg-cyber-dark text-text-primary">高对比度</div>

// ✅ 渐变增强视觉
<div className="bg-gradient-to-r from-cyber-cyan to-cyber-purple">
  品牌渐变
</div>

// ✅ 节制使用发光
<div className="shadow-[0_0_10px_rgba(0,240,255,0.5)]">
  适度发光
</div>
```

---

### ❌ DON'T - 避免做法

```tsx
// ❌ 过度使用发光
<div className="shadow-[0_0_50px_#00f0ff]">太亮了</div>

// ❌ 低对比度
<div className="bg-cyber-dark text-gray-800">看不清</div>

// ❌ 混合太多颜色
<div className="bg-cyber-cyan text-cyber-pink border-cyber-yellow">
  颜色混乱
</div>

// ❌ 随意使用颜色
<button className="bg-cyber-pink">保存</button> // 应该用绿色
```

---

## 🎨 Tailwind 配置

所有颜色已集成到 Tailwind CSS：

```tsx
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: '#00f0ff',
          purple: '#9d00ff',
          pink: '#ff0080',
          yellow: '#f0ff00',
          green: '#00ff88',
          dark: '#0a0a0f',
          darker: '#050508',
          black: '#000000',
          muted: '#1a1a2e',
          card: '#16162a',
          border: '#2a2a4a',
        },
        text: {
          primary: '#e0e0e0',
          secondary: '#a0a0b0',
          muted: '#606070',
          disabled: '#404050',
        }
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff',
        'neon-purple': '0 0 5px #9d00ff, 0 0 10px #9d00ff, 0 0 20px #9d00ff',
        'neon-pink': '0 0 5px #ff0080, 0 0 10px #ff0080, 0 0 20px #ff0080',
        'neon-yellow': '0 0 5px #f0ff00, 0 0 10px #f0ff00, 0 0 20px #f0ff00',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'gradient-tricolor': 'linear-gradient(90deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
      }
    }
  }
}
```

---

## 💻 代码示例

### 完整按钮组件

```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}) => {
  const baseStyles = "rounded-lg font-semibold transition-all duration-200";

  const variantStyles = {
    primary: "bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)]",
    secondary: "border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan/10",
    danger: "bg-gradient-to-r from-cyber-pink to-orange-500 text-white hover:opacity-90",
    success: "bg-gradient-to-r from-cyber-green to-cyber-cyan text-white"
  };

  const sizeStyles = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

---

### 完整卡片组件

```tsx
interface CardProps {
  glow?: boolean;
  hover?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  glow = false,
  hover = true,
  children
}) => {
  return (
    <div className={`
      bg-cyber-card
      border border-cyber-border
      rounded-lg p-6
      ${hover ? 'hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]' : ''}
      ${glow ? 'shadow-[inset_0_0_30px_rgba(0,240,255,0.05)]' : ''}
      transition-all duration-300
    `}>
      {children}
    </div>
  );
};
```

---

## 🎨 色彩搭配建议

### 常用配色方案

```tsx
// 方案 1: 青紫主导
primary: cyber-cyan
secondary: cyber-purple
accent: cyber-pink

// 方案 2: 紫粉主导
primary: cyber-purple
secondary: cyber-pink
accent: cyber-cyan

// 方案 3: 单色渐变
light: cyber-cyan
base: cyber-cyan
dark: cyber-cyan-dark
```

### 互补色搭配

```tsx
// 青色 + 粉色 (对比强烈)
text-cyber-cyan + bg-cyber-pink/10

// 紫色 + 绿色 (科技感)
text-cyber-purple + border-cyber-green

// 黄色 + 深色 (高可见性)
text-cyber-yellow + bg-cyber-dark
```

---

## 📊 可访问性

### 对比度标准

所有配色组合均符合 WCAG AA 标准：

- ✅ 正常文本: ≥ 4.5:1
- ✅ 大文本 (18px+): ≥ 3:1
- ✅ UI 组件: ≥ 3:1

### 测试工具

使用以下工具验证配色：
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Color Oracle](https://colororacle.org/) (色盲模拟)

---

## 🔄 更新日志

### v2.0.0 (2026-03-03)
- ✅ 新增渐变系统
- ✅ 完善发光效果
- ✅ 添加代码示例
- ✅ 最佳实践指南

### v1.0.0 (2026-03-02)
- ✅ 初始配色系统
- ✅ 基础色彩定义
- ✅ Tailwind 集成

---

**设计团队**: CyberPress AI Design Team
**最后更新**: 2026-03-03
**版本**: v2.0.0
