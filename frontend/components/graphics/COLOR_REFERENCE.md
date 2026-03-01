# CyberPress 图形设计参考

本文档提供了 CyberPress 平台的完整设计规范和配色参考。

## 🎨 配色方案

### 主色调 - 赛博朋克霓虹色

```css
/* 深空色系 */
--cyber-dark: #0a0a0f      /* 深空黑 - 主背景 */
--cyber-darker: #050508    /* 更深的黑色 - 次背景 */
--cyber-muted: #1a1a2e     /* 深空蓝 - 卡片背景 */
--cyber-card: #16162a      /* 卡片背景 */
--cyber-border: #2a2a4a    /* 边框色 */

/* 霓虹色系 */
--cyber-cyan: #00f0ff      /* 霓虹青 - 主要强调色 */
--cyber-purple: #9d00ff    /* 赛博紫 - 次要强调色 */
--cyber-pink: #ff0080      /* 激光粉 - 点缀色 */
--cyber-green: #00ff88     /* 赛博绿 - 成功状态 */
--cyber-yellow: #f0ff00    /* 电压黄 - 警告状态 */
--cyber-orange: #ff8000    /* 等离子橙 - 注意状态 */
--cyber-red: #ff0040       /* 警告红 - 危险/错误 */
--cyber-blue: #0080ff      /* 电光蓝 - 信息状态 */
```

### 渐变配置

```css
/* 主渐变 */
gradient-primary: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)

/* 次渐变 */
gradient-secondary: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)

/* 暗色渐变 */
gradient-dark: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)

/* 彩虹渐变 */
gradient-cyber: linear-gradient(45deg, #00f0ff, #9d00ff, #ff0080, #f0ff00)

/* 矩阵渐变 */
gradient-matrix: linear-gradient(180deg, #000000 0%, #001a00 100%)

/* 霓虹渐变 */
gradient-neon: linear-gradient(90deg, #00f0ff, #ff0080, #f0ff00)
```

### 阴影配置

```css
/* 发光阴影 */
shadow-glow-cyan: 0 0 20px rgba(0, 240, 255, 0.5)
shadow-glow-purple: 0 0 20px rgba(157, 0, 255, 0.5)
shadow-glow-pink: 0 0 20px rgba(255, 0, 128, 0.5)
shadow-glow-green: 0 0 20px rgba(0, 255, 136, 0.5)
shadow-glow-yellow: 0 0 20px rgba(240, 255, 0, 0.5)

/* 卡片阴影 */
shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)

/* 对话框阴影 */
shadow-dialog: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)
```

## 🔤 字体系统

### 字体族

```css
/* 无衬线字体 - 正文 */
font-family-body: 'Inter', system-ui, -apple-system, sans-serif

/* 展示字体 - 标题 */
font-family-display: 'Orbitron', 'Rajdhani', sans-serif

/* 等宽字体 - 代码 */
font-family-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace
```

### 字体大小

```css
/* 标题 */
text-xs: 0.75rem      /* 12px */
text-sm: 0.875rem     /* 14px */
text-base: 1rem       /* 16px */
text-lg: 1.125rem     /* 18px */
text-xl: 1.25rem      /* 20px */
text-2xl: 1.5rem      /* 24px */
text-3xl: 1.875rem    /* 30px */
text-4xl: 2.25rem     /* 36px */
text-5xl: 3rem        /* 48px */
text-6xl: 3.75rem     /* 60px */
```

### 字重

```css
font-light: 300
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
font-extrabold: 800
```

## 📐 尺寸规范

### 间距系统

```css
/* 基础间距 */
spacing-0: 0
spacing-1: 0.25rem    /* 4px */
spacing-2: 0.5rem     /* 8px */
spacing-3: 0.75rem    /* 12px */
spacing-4: 1rem       /* 16px */
spacing-5: 1.25rem    /* 20px */
spacing-6: 1.5rem     /* 24px */
spacing-8: 2rem       /* 32px */
spacing-10: 2.5rem    /* 40px */
spacing-12: 3rem      /* 48px */
spacing-16: 4rem      /* 64px */
spacing-20: 5rem      /* 80px */
spacing-24: 6rem      /* 96px */
```

### 圆角

```css
rounded-none: 0
rounded-sm: 0.125rem   /* 2px */
rounded: 0.25rem       /* 4px */
rounded-md: 0.375rem   /* 6px */
rounded-lg: 0.5rem     /* 8px */
rounded-xl: 0.75rem    /* 12px */
rounded-2xl: 1rem      /* 16px */
rounded-3xl: 1.5rem    /* 24px */
rounded-full: 9999px
```

### 图标尺寸

```css
/* 标准 SVG 图标尺寸 */
icon-xs: 12px
icon-sm: 16px
icon-md: 20px
icon-lg: 24px     /* 默认 */
icon-xl: 32px
icon-2xl: 40px
icon-3xl: 48px
```

## 🎭 动画效果

### 标准动画

```css
/* 发光动画 */
@keyframes glow {
  0% {
    box-shadow: 0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 15px #00f0ff;
  }
  100% {
    box-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 30px #00f0ff;
  }
}

/* 浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* 脉冲动画 */
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

/* 故障动画 */
@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

/* 扫描动画 */
@keyframes scan {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
}

/* 打字机动画 */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink-caret {
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: #00f0ff;
  }
}
```

### 动画时长

```css
duration-fast: 150ms
duration-normal: 300ms
duration-slow: 500ms
duration-slower: 1000ms
```

## 🖼️ Logo 规范

### Logo 变体

| 变体 | 用途 | 尺寸 |
|------|------|------|
| Main Logo | 页眉、页脚 | 200x60px |
| Square Logo | 缩略图、头像 | 64x64px - 200x200px |
| Favicon Logo | 浏览器标签 | 16x16px - 32x32px |
| Minimal Logo | 单色印刷 | 自定义 |
| Text Logo | 仅文字 | 自定义宽度 |
| Watermark Logo | 水印 | 自定义 |
| Animated Logo | 动画展示 | 100x100px+ |

### Logo 使用规则

1. **最小尺寸**: 保持 Logo 清晰可读
   - Main Logo: 最小 120px 宽
   - Square Logo: 最小 32px
   - Favicon: 最小 16px

2. **安全区域**: Logo 周围保持至少 20px 的空白

3. **背景要求**:
   - 深色背景: 使用标准版
   - 浅色背景: 使用反转色版本
   - 复杂背景: 使用带描边版本

## 🎨 图标使用规范

### 图标尺寸指南

| 位置 | 尺寸 |
|------|------|
| 导航菜单 | 24px |
| 按钮图标 | 16-20px |
| 列表图标 | 16-18px |
| 卡片图标 | 32-48px |
| 页面标题图标 | 48-64px |

### 图标状态

```css
/* 默认状态 */
icon-default: opacity 1

/* 悬停状态 */
icon-hover: opacity 0.8 + scale 1.05

/* 激活状态 */
icon-active: color #00f0ff + glow

/* 禁用状态 */
icon-disabled: opacity 0.3
```

## 📐 布局规范

### 容器尺寸

```css
/* 容器最大宽度 */
container-sm: 640px
container-md: 768px
container-lg: 1024px
container-xl: 1280px
container-2xl: 1536px
```

### 断点

```css
/* 响应式断点 */
breakpoint-sm: 640px
breakpoint-md: 768px
breakpoint-lg: 1024px
breakpoint-xl: 1280px
breakpoint-2xl: 1536px
```

## 🎭 视觉效果

### 滤镜效果

```css
/* 模糊效果 */
blur-sm: blur(4px)
blur-md: blur(8px)
blur-lg: blur(16px)
blur-xl: blur(24px)

/* 亮度效果 */
brightness-dim: brightness(0.8)
brightness-bright: brightness(1.2)

/* 对比度效果 */
contrast-high: contrast(1.2)
contrast-low: contrast(0.8)
```

### 背景图案

```css
/* 网格背景 */
bg-cyber-grid: linear-gradient(transparent 0%, transparent 50%, rgba(0, 240, 255, 0.03) 50%, rgba(0, 240, 255, 0.03) 100%)

/* 扫描线背景 */
bg-cyber-lines: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.03) 2px, rgba(0, 240, 255, 0.03) 4px)
```

## 🔧 实用工具

### Tailwind 配置

```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a0f',
          cyan: '#00f0ff',
          purple: '#9d00ff',
          pink: '#ff0080',
          // ... 其他颜色
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch': 'glitch 1s linear infinite',
      },
    },
  },
};
```

## 📱 响应式设计

### 移动端优先

```css
/* 基础样式 (移动端) */
.element {
  padding: 1rem;
  font-size: 1rem;
}

/* 平板 */
@media (min-width: 768px) {
  .element {
    padding: 1.5rem;
    font-size: 1.125rem;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .element {
    padding: 2rem;
    font-size: 1.25rem;
  }
}
```

## 🎯 最佳实践

### 1. 颜色使用

- ✅ **推荐**: 最多使用 3 种霓虹色作为强调色
- ❌ **避免**: 过度使用霓虹色导致视觉疲劳
- ✅ **推荐**: 保持大量深色背景区域
- ❌ **避免**: 大面积使用高饱和度颜色

### 2. 动画使用

- ✅ **推荐**: 使用 subtle 动画增强用户体验
- ❌ **避免**: 过度使用动画导致分心
- ✅ **推荐**: 提供禁用动画的选项
- ❌ **避免**: 动画时长超过 3 秒

### 3. 图标使用

- ✅ **推荐**: 保持图标风格一致
- ❌ **避免**: 混用不同风格的图标
- ✅ **推荐**: 添加适当的间距
- ❌ **避免**: 图标过小无法识别

### 4. 可访问性

- ✅ **推荐**: 保持足够的对比度 (WCAG AA: 4.5:1)
- ❌ **避免**: 纯颜色传达信息
- ✅ **推荐**: 提供键盘导航支持
- ❌ **避免**: 仅依赖视觉效果

## 📚 相关资源

- [图标清单](./ICON_LIST.md) - 完整的图标列表
- [组件文档](../../docs/) - UI 组件使用说明
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [Figma 设计文件](#) - 设计稿 (待添加)

## 🔄 版本历史

### v1.0.0 (2026-03-02)
- 初始设计规范发布
- 完整配色方案定义
- 动画效果库建立
- Logo 和图标使用规范
