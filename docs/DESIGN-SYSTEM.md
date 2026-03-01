# CyberPress 设计系统文档

## 配色方案

### 主色调

#### 赛博青 (Cyber Cyan)
- **色值**: `#00f0ff`
- **RGB**: `rgb(0, 240, 255)`
- **HSL**: `hsl(182, 100%, 50%)`
- **用途**: 主要强调色、链接、按钮
- **变体**:
  - 浅色: `#00a0ff`
  - 暗色: `#0080aa`
  - 透明度: `rgba(0, 240, 255, 0.1)`

#### 赛博紫 (Cyber Purple)
- **色值**: `#9d00ff`
- **RGB**: `rgb(157, 0, 255)`
- **HSL**: `hsl(277, 100%, 50%)`
- **用途**: 次要强调色、渐变、装饰
- **变体**:
  - 浅色: `#bd66ff`
  - 暗色: `#6a00aa`

#### 激光粉 (Laser Pink)
- **色值**: `#ff0080`
- **RGB**: `rgb(255, 0, 128)`
- **HSL**: `hsl(330, 100%, 50%)`
- **用途**: 警告、特殊状态、装饰
- **变体**:
  - 浅色: `#ff66b3`
  - 暗色: `#aa0056`

#### 电压黄 (Voltage Yellow)
- **色值**: `#f0ff00`
- **RGB**: `rgb(240, 255, 0)`
- **HSL**: `hsl(63, 100%, 50%)`
- **用途**: 高亮、通知、成功状态
- **变体**:
  - 浅色: `#f9ff80`
  - 暗色: `#a3aa00`

### 背景色

#### 深空黑 (Deep Space Black)
- **主背景**: `#0a0a0f`
- **次背景**: `#050508`
- **纯黑**: `#000000`
- **卡片背景**: `#16162a`
- **静默背景**: `#1a1a2e`

### 中性色

#### 边框和分割线
- **主边框**: `#2a2a4a`
- **次边框**: `#3a3a5a`
- **暗边框**: `#1a1a2e`

#### 文字
- **主文字**: `#e0e0e0`
- **次文字**: `#a0a0b0`
- **禁用文字**: `#606070`

### 功能色

#### 成功色
- **主色**: `#00ff88`
- **变体**:
  - 浅色: `#66ffbb`
  - 暗色: `#00aa5a`

#### 警告色
- **主色**: `#ff6600`
- **变体**:
  - 浅色: `#ff9966`
  - 暗色: `#aa4400`

#### 错误色
- **主色**: `#ff0040`
- **变体**:
  - 浅色: `#ff6680`
  - 暗色: `#aa002a`

## 字体系统

### 字体家族

#### 无衬线字体 (主要)
- **名称**: Inter
- **用途**: 正文、UI 文本
- **回退**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

#### 等宽字体 (代码)
- **名称**: JetBrains Mono / Fira Code
- **用途**: 代码块、数据展示
- **回退**: `'Courier New', monospace`

#### 展示字体 (标题)
- **名称**: Orbitron
- **用途**: 大标题、Logo
- **回退**: `Arial, sans-serif`

### 字体大小

| 名称 | 大小 | 用途 |
|------|------|------|
| xs | 0.75rem (12px) | 小标签、注脚 |
| sm | 0.875rem (14px) | 辅助文本 |
| base | 1rem (16px) | 正文 |
| lg | 1.125rem (18px) | 副标题 |
| xl | 1.25rem (20px) | 小标题 |
| 2xl | 1.5rem (24px) | 标题 |
| 3xl | 1.875rem (30px) | 大标题 |
| 4xl | 2.25rem (36px) | 页面标题 |
| 5xl | 3rem (48px) | 特大标题 |
| 6xl | 3.75rem (60px) | 展示标题 |

### 字重

| 名称 | 值 | 用途 |
|------|------|------|
| light | 300 | 细体文字 |
| normal | 400 | 正文 |
| medium | 500 | 强调文字 |
| semibold | 600 | 小标题 |
| bold | 700 | 标题 |
| extrabold | 800 | 特殊强调 |

## 间距系统

基于 **4px 基础单位**的间距系统：

| 名称 | 值 | 用途 |
|------|------|------|
| 0 | 0 | 无间距 |
| 1 | 0.25rem (4px) | 极小间距 |
| 2 | 0.5rem (8px) | 小间距 |
| 3 | 0.75rem (12px) | 中小间距 |
| 4 | 1rem (16px) | 基础间距 |
| 5 | 1.25rem (20px) | 中大间距 |
| 6 | 1.5rem (24px) | 大间距 |
| 8 | 2rem (32px) | 更大间距 |
| 10 | 2.5rem (40px) | 超大间距 |
| 12 | 3rem (48px) | 特大间距 |
| 16 | 4rem (64px) | 章节间距 |
| 20 | 5rem (80px) | 页面区块间距 |

## 圆角系统

| 名称 | 值 | 用途 |
|------|------|------|
| none | 0 | 无圆角 |
| sm | 0.125rem (2px) | 小圆角 |
| base | 0.25rem (4px) | 基础圆角 |
| md | 0.375rem (6px) | 中等圆角 |
| lg | 0.5rem (8px) | 大圆角 |
| xl | 0.75rem (12px) | 超大圆角 |
| 2xl | 1rem (16px) | 特大圆角 |
| 3xl | 1.5rem (24px) | 卡片圆角 |
| full | 9999px | 完全圆角（圆形/胶囊） |

## 阴影效果

### 霓虹阴影
```css
/* 霓虹青 */
box-shadow: 0 0 5px #00f0ff, 0 0 20px #00f0ff;

/* 霓虹紫 */
box-shadow: 0 0 5px #9d00ff, 0 0 20px #9d00ff;

/* 霓虹粉 */
box-shadow: 0 0 5px #ff0080, 0 0 20px #ff0080;

/* 霓虹黄 */
box-shadow: 0 0 5px #f0ff00, 0 0 20px #f0ff00;
```

### 基础阴影
```css
/* 小阴影 */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);

/* 中阴影 */
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);

/* 大阴影 */
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5);

/* 内阴影 */
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
```

## 动画效果

### 预设动画

#### glow (发光)
```css
animation: glow 2s ease-in-out infinite alternate;
```

#### flicker (闪烁)
```css
animation: flicker 0.15s infinite;
```

#### scan (扫描)
```css
animation: scan 8s linear infinite;
```

#### float (悬浮)
```css
animation: float 6s ease-in-out infinite;
```

#### pulse-glow (脉冲发光)
```css
animation: pulse-glow 2s ease-in-out infinite;
```

#### glitch (故障)
```css
animation: glitch 1s linear infinite;
```

### 过渡时间

| 名称 | 时间 | 用途 |
|------|------|------|
| fast | 150ms | 快速交互 |
| base | 200ms | 基础过渡 |
| normal | 300ms | 标准过渡 |
| slow | 500ms | 慢速过渡 |
| slower | 700ms | 更慢过渡 |

## 渐变方案

### 线性渐变
```css
/* 青色渐变 */
background: linear-gradient(135deg, #00f0ff, #00a0ff);

/* 紫粉渐变 */
background: linear-gradient(135deg, #9d00ff, #ff0080);

/* 深色背景渐变 */
background: linear-gradient(180deg, #0a0a0f, #050508);
```

### 径向渐变
```css
/* 发光效果 */
background: radial-gradient(circle, rgba(0,240,255,0.2) 0%, transparent 70%);
```

## 断点系统

| 名称 | 宽度 | 设备 |
|------|------|------|
| sm | 640px | 手机横屏 |
| md | 768px | 平板竖屏 |
| lg | 1024px | 平板横屏/小笔记本 |
| xl | 1280px | 桌面 |
| 2xl | 1536px | 大屏幕 |

## Z-index 层级

| 值 | 用途 |
|-----|------|
| 0 | 默认 |
| 10 | 下拉菜单 |
| 20 | 固定导航 |
| 30 | 模态框背景 |
| 40 | 模态框内容 |
| 50 | 通知/Toast |
| 100 | 最高层级 |

## 组件状态

### 按钮状态
- **默认**: 正常显示
- **hover**: 轻微发光 + 颜色变化
- **active**: 按下效果
- **focus**: 聚焦边框
- **disabled**: 降低不透明度 + 禁用光标

### 输入框状态
- **默认**: 正常边框
- **focus**: 霓虹边框 + 发光
- **error**: 红色边框
- **success**: 绿色边框
- **disabled**: 灰色背景

## 特效指南

### 霓虹文字
```css
.neon-text {
  color: #00f0ff;
  text-shadow:
    0 0 5px #00f0ff,
    0 0 10px #00f0ff,
    0 0 20px #00f0ff,
    0 0 40px #00f0ff;
}
```

### 全息卡片
```css
.holographic-card {
  background: linear-gradient(135deg,
    rgba(0,240,255,0.1),
    rgba(157,0,255,0.1));
  border: 1px solid rgba(0,240,255,0.3);
  box-shadow: 0 0 20px rgba(0,240,255,0.2);
}
```

### 扫描线效果
```css
.scanlines::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 240, 255, 0.03) 2px,
    rgba(0, 240, 255, 0.03) 4px
  );
  pointer-events: none;
}
```

## 使用指南

### Tailwind 配置
所有颜色已在 `tailwind.config.ts` 中配置，可直接使用：
```tsx
<div className="bg-cyber-dark text-cyber-cyan border-cyber-border">
  赛博朋克风格
</div>
```

### 动画类
```tsx
<div className="animate-glow">发光元素</div>
<div className="animate-float">悬浮元素</div>
<div className="animate-glitch">故障效果</div>
```

### 阴影类
```tsx
<div className="shadow-neon-cyan">霓虹青阴影</div>
<div className="shadow-neon-purple">霓虹紫阴影</div>
```
