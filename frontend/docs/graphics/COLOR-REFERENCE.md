# CyberPress 配色参考

> 赛博朋克风格配色方案和使用指南

## 📋 目录

- [品牌色](#品牌色)
- [功能色](#功能色)
- [中性色](#中性色)
- [渐变色](#渐变色)
- [发光效果](#发光效果)
- [使用指南](#使用指南)

---

## 品牌色

### 主色调 - 青色 (Cyan)

```css
/* 基础色值 */
--cyber-cyan: #00f0ff;
--cyber-cyan-light: #7ff8ff;
--cyber-cyan-dark: #00a8b3;
--cyber-cyan-dim: rgba(0, 240, 255, 0.1);
```

**使用场景**:
- 主按钮
- 链接
- 高亮文本
- 图标强调

```tsx
<Button variant="primary" className="bg-cyber-cyan">
  确认
</Button>

<span className="text-cyber-cyan">重要文本</span>
```

---

### 次要色 - 紫色 (Purple)

```css
/* 基础色值 */
--cyber-purple: #9d00ff;
--cyber-purple-light: #c47fff;
--cyber-purple-dark: #6a00ad;
--cyber-purple-dim: rgba(157, 0, 255, 0.1);
```

**使用场景**:
- 次要按钮
- 渐变装饰
- 悬停状态
- 辅助元素

```tsx
<Button variant="secondary" className="bg-cyber-purple">
  取消
</Button>
```

---

### 强调色 - 粉色 (Pink)

```css
/* 基础色值 */
--cyber-pink: #ff0080;
--cyber-pink-light: #ff66b3;
--cyber-pink-dark: #b30059;
--cyber-pink-dim: rgba(255, 0, 128, 0.1);
```

**使用场景**:
- 警告提示
- 重要通知
- 特殊标记
- 爱心/收藏

```tsx
<Alert variant="warning" className="border-cyber-pink">
  重要提示
</Alert>
```

---

## 功能色

### 成功 - 绿色

```css
--cyber-green: #00ff88;
--cyber-green-dark: #00b359;
```

```tsx
<CheckIcon className="text-cyber-green" />
<div className="text-cyber-green">操作成功</div>
```

---

### 错误 - 红色

```css
--cyber-red: #ff3366;
--cyber-red-dark: #b32447;
```

```tsx
<ErrorIcon className="text-cyber-red" />
<div className="text-cyber-red">操作失败</div>
```

---

### 警告 - 黄色

```css
--cyber-yellow: #ffcc00;
--cyber-yellow-dark: #b38f00;
```

```tsx
<WarningIcon className="text-cyber-yellow" />
<div className="text-cyber-yellow">请注意</div>
```

---

### 信息 - 蓝色

```css
--cyber-blue: #0099ff;
--cyber-blue-dark: #006cb3;
```

```tsx
<InfoIcon className="text-cyber-blue" />
<div className="text-cyber-blue">提示信息</div>
```

---

## 中性色

### 深色背景

```css
--bg-primary: #0a0e27;
--bg-secondary: #141b3d;
--bg-tertiary: #1e2754;
--bg-elevated: #252f66;
```

### 浅色背景

```css
--bg-light: #f0f4ff;
--bg-lighter: #f8faff;
--bg-white: #ffffff;
```

### 文本颜色

```css
--text-primary: #ffffff;
--text-secondary: #b3b8d1;
--text-tertiary: #6b7280;
--text-muted: #4b5563;
```

### 边框颜色

```css
--border-light: rgba(255, 255, 255, 0.1);
--border-medium: rgba(255, 255, 255, 0.2);
--border-heavy: rgba(255, 255, 255, 0.3);
```

---

## 渐变色

### 主要渐变

```css
/* 青色到紫色 */
--gradient-primary: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 紫色到粉色 */
--gradient-secondary: linear-gradient(135deg, #9d00ff 0%, #ff0080 100%);

/* 全彩渐变 */
--gradient-full: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
```

**使用示例**:

```tsx
<div className="bg-gradient-primary">
  <h1>标题文本</h1>
</div>

<span className="bg-gradient-to-r from-cyber-cyan to-cyber-purple bg-clip-text text-transparent">
  渐变文字
</span>
```

---

### 背景渐变

```css
/* 深空渐变 */
--gradient-deep: linear-gradient(180deg, #0a0e27 0%, #141b3d 100%);

/* 极光渐变 */
--gradient-aurora: linear-gradient(45deg,
  rgba(0, 240, 255, 0.1) 0%,
  rgba(157, 0, 255, 0.1) 50%,
  rgba(255, 0, 128, 0.1) 100%
);

/* 网格渐变 */
--gradient-grid: linear-gradient(90deg,
  rgba(0, 240, 255, 0.05) 1px,
  transparent 1px
),
linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px);
```

---

## 发光效果

### 霓虹发光

```css
/* 青色发光 */
.glow-cyan {
  box-shadow:
    0 0 10px rgba(0, 240, 255, 0.5),
    0 0 20px rgba(0, 240, 255, 0.3),
    0 0 30px rgba(0, 240, 255, 0.2);
}

/* 紫色发光 */
.glow-purple {
  box-shadow:
    0 0 10px rgba(157, 0, 255, 0.5),
    0 0 20px rgba(157, 0, 255, 0.3),
    0 0 30px rgba(157, 0, 255, 0.2);
}

/* 粉色发光 */
.glow-pink {
  box-shadow:
    0 0 10px rgba(255, 0, 128, 0.5),
    0 0 20px rgba(255, 0, 128, 0.3),
    0 0 30px rgba(255, 0, 128, 0.2);
}
```

**使用示例**:

```tsx
<button className="glow-cyan bg-cyber-cyan text-white px-6 py-2 rounded">
  霓虹按钮
</button>
```

---

### 文字发光

```css
/* 强烈发光 */
.text-glow-strong {
  text-shadow:
    0 0 10px currentColor,
    0 0 20px currentColor,
    0 0 30px currentColor;
}

/* 轻微发光 */
.text-glow-subtle {
  text-shadow: 0 0 10px currentColor;
}
```

---

## 使用指南

### 颜色对比度

确保文字和背景有足够的对比度：

```tsx
// ✅ 良好对比度
<div className="bg-cyber-cyan text-white">高对比度</div>
<div className="bg-bg-primary text-cyber-cyan">深色主题</div>

// ❌ 对比度不足
<div className="bg-cyber-cyan text-cyber-purple">对比度太低</div>
```

### 主题切换

```tsx
// 使用 next-themes
import { useTheme } from 'next-themes';

function ThemedComponent() {
  const { theme } = useTheme();

  return (
    <div className={
      theme === 'dark'
        ? 'bg-bg-primary text-white'
        : 'bg-bg-white text-text-primary'
    }>
      主题内容
    </div>
  );
}
```

### 颜色工具类

```tsx
// 背景色
<div className="bg-cyber-cyan">背景</div>
<div className="bg-cyber-cyan/20">半透明背景</div>

// 文字颜色
<div className="text-cyber-purple">文字</div>
<div className="text-cyber-pink/80">半透明文字</div>

// 边框颜色
<div className="border border-cyber-cyan">边框</div>
<div className="border-cyber-purple/30">半透明边框</div>

// 渐变
<div className="bg-gradient-to-r from-cyber-cyan to-cyber-purple">
  渐变背景
</div>
```

### 动态颜色

```tsx
// 根据状态改变颜色
function StatusBadge({ status }: { status: 'success' | 'error' | 'warning' }) {
  const colors = {
    success: 'bg-cyber-green',
    error: 'bg-cyber-red',
    warning: 'bg-cyber-yellow'
  };

  return <span className={`${colors[status]} px-2 py-1 rounded`}>{status}</span>;
}
```

---

## Tailwind 配置

在 `tailwind.config.ts` 中扩展颜色：

```typescript
export default {
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: {
            DEFAULT: '#00f0ff',
            light: '#7ff8ff',
            dark: '#00a8b3',
            dim: 'rgba(0, 240, 255, 0.1)',
          },
          purple: {
            DEFAULT: '#9d00ff',
            light: '#c47fff',
            dark: '#6a00ad',
            dim: 'rgba(157, 0, 255, 0.1)',
          },
          pink: {
            DEFAULT: '#ff0080',
            light: '#ff66b3',
            dark: '#b30059',
            dim: 'rgba(255, 0, 128, 0.1)',
          },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #9d00ff 0%, #ff0080 100%)',
        'gradient-full': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)',
      },
    },
  },
};
```

---

## 颜色组合示例

### 1. 经典赛博朋克

```tsx
<div className="bg-bg-primary text-white">
  <h1 className="text-cyber-cyan">标题</h1>
  <p className="text-text-secondary">正文</p>
  <button className="bg-cyber-purple hover:bg-cyber-pink">按钮</button>
</div>
```

### 2. 霓虹发光

```tsx
<div className="glow-cyan bg-cyber-cyan/10 border border-cyber-cyan">
  <span className="text-cyber-cyan text-glow-subtle">发光文本</span>
</div>
```

### 3. 渐变卡片

```tsx
<div className="bg-gradient-full p-6 rounded-lg">
  <h2 className="text-white">渐变标题</h2>
  <p className="text-white/80">描述文本</p>
</div>
```

### 4. 深空主题

```tsx
<div className="bg-gradient-deep">
  <div className="border border-cyber-cyan/20 rounded-lg p-4">
    <h3 className="text-cyber-cyan">深空卡片</h3>
  </div>
</div>
```

---

## 可访问性

### 确保可读性

```tsx
// WCAG AA 标准 - 至少 4.5:1
<div className="bg-white text-gray-900">对比度良好</div>
<div className="bg-cyber-cyan text-white">对比度良好</div>

// 避免低对比度
<div className="bg-cyber-cyan text-cyber-cyan/50">对比度不足</div>
```

### 焦点状态

```tsx
<button className="focus:ring-2 focus:ring-cyber-cyan">
  可聚焦按钮
</button>
```

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
**维护者**: Design Team
