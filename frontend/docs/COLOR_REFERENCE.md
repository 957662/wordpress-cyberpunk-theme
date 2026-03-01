# CyberPress Color System - 配色参考

## 🎨 赛博朋克配色方案

CyberPress 采用经典的赛博朋克配色系统，融合霓虹色彩与深色背景，营造未来科技感。

## 🌈 主色板

### 基础色系
```css
/* 深色背景 */
--cyber-dark:      #0a0a0f  /* 主背景 - 深空黑 */
--cyber-darker:    #050508  /* 次背景 - 更深黑 */
--cyber-black:     #000000  /* 纯黑 - 强调 */

/* 霓虹色 */
--cyber-cyan:      #00f0ff  /* 霓虹青 - 主要色 */
--cyber-purple:    #9d00ff  /* 赛博紫 - 次要色 */
--cyber-pink:      #ff0080  /* 激光粉 - 强调色 */
--cyber-yellow:    #f0ff00  /* 电压黄 - 警告色 */
--cyber-green:     #00ff88  /* 矩阵绿 - 成功色 */
--cyber-orange:    #ff6600  /* 火焰橙 - 提示色 */
```

### 中性色系
```css
--cyber-muted:     #1a1a2e  /* 弱化背景 */
--cyber-card:      #16162a  /* 卡片背景 */
--cyber-border:    #2a2a4a  /* 边框颜色 */
```

## 📊 颜色应用场景

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

## 🎭 渐变组合

### 品牌渐变
```css
/* 主品牌渐变 */
gradient-brand: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 三色渐变 */
gradient-tricolor: linear-gradient(90deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);

/* 垂直渐变 */
gradient-vertical: linear-gradient(180deg, #0a0a0f 0%, #16162a 100%);
```

### 功能渐变
```css
/* 成功渐变 */
gradient-success: linear-gradient(135deg, #00ff88 0%, #00f0ff 100%);

/* 警告渐变 */
gradient-warning: linear-gradient(135deg, #f0ff00 0%, #ff6600 100%);

/* 错误渐变 */
gradient-error: linear-gradient(135deg, #ff0080 0%, #ff6600 100%);
```

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

### 内发光
```css
/* 内部发光效果 */
box-shadow-cyber-inset:
  inset 0 0 30px rgba(0, 240, 255, 0.1);
```

## 🎪 特殊效果

### 扫描线背景
```css
background-scanlines:
  repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 240, 255, 0.03) 2px,
    rgba(0, 240, 255, 0.03) 4px
  );
```

### 网格背景
```css
background-cyber-grid:
  linear-gradient(
    transparent 0%,
    transparent 50%,
    rgba(0, 240, 255, 0.03) 50%,
    rgba(0, 240, 255, 0.03) 100%
  );
```

## 📱 语义化颜色

### 状态颜色
```css
/* 信息 */
color-info:       #00f0ff;
bg-info:          rgba(0, 240, 255, 0.1);
border-info:      #00f0ff;

/* 成功 */
color-success:    #00ff88;
bg-success:       rgba(0, 255, 136, 0.1);
border-success:   #00ff88;

/* 警告 */
color-warning:    #f0ff00;
bg-warning:       rgba(240, 255, 0, 0.1);
border-warning:   #f0ff00;

/* 错误 */
color-error:      #ff0080;
bg-error:         rgba(255, 0, 128, 0.1);
border-error:     #ff0080;
```

## 🎨 组件配色指南

### 按钮
```css
/* 主要按钮 */
btn-primary:
  bg: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);
  text: #ffffff;
  glow: 0 0 20px rgba(0, 240, 255, 0.5);

/* 次要按钮 */
btn-secondary:
  bg: transparent;
  border: 2px solid #00f0ff;
  text: #00f0ff;
  glow: 0 0 10px rgba(0, 240, 255, 0.3);

/* 危险按钮 */
btn-danger:
  bg: linear-gradient(135deg, #ff0080 0%, #ff6600 100%);
  text: #ffffff;
  glow: 0 0 20px rgba(255, 0, 128, 0.5);
```

### 卡片
```css
/* 基础卡片 */
card-base:
  bg: #16162a;
  border: 1px solid #2a2a4a;
  glow: inset 0 0 30px rgba(0, 240, 255, 0.05);

/* 悬浮卡片 */
card-hover:
  bg: #1a1a2e;
  border: 1px solid #00f0ff;
  glow: 0 0 20px rgba(0, 240, 255, 0.2);
```

### 表单
```css
/* 输入框 */
input-base:
  bg: #0a0a0f;
  border: 2px solid #2a2a4a;
  text: #ffffff;
  placeholder: #6a6a8a;

input-focus:
  border: 2px solid #00f0ff;
  glow: 0 0 10px rgba(0, 240, 255, 0.3);
```

## 🌓 深色模式优先

CyberPress 采用深色优先设计理念：
- **默认主题**: 深色模式
- **浅色变体**: 反转颜色（可选）
- **高对比度**: 确保可访问性

## 🎯 使用建议

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

## 📋 Tailwind 配置

所有颜色已集成到 Tailwind CSS：

```tsx
// 使用示例
<div className="bg-cyber-dark border border-cyber-cyan">
  <button className="bg-gradient-to-r from-cyber-cyan to-cyber-purple">
    Click Me
  </button>
</div>
```

---

**设计系统版本**: v1.0.0
**最后更新**: 2026-03-02
**设计团队**: CyberPress AI Design Team
