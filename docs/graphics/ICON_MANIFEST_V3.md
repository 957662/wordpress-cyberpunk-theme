# CyberPress 图标清单 v3.0

> 最后更新：2026-03-07
> 设计团队：CyberPress AI Design Team

## 📊 统计信息

- **总图标数**：82 个
- **基础图标**：69 个
- **新增赛博朋克图标**：13 个
- **文件格式**：SVG
- **设计风格**：赛博朋克/霓虹发光

---

## 🎨 赛博朋克图标系列（Cyberpunk Collection）

### 最新新增（New Additions - 2026-03-07）

| 图标名称 | 文件名 | 描述 | 主要颜色 |
|---------|--------|------|---------|
| **Tech Flux** | `tech-flux.svg` | 能量流动核心 | 霓虹青 → 赛博紫 → 激光粉 |
| **Neural Mesh** | `neural-mesh.svg` | 神经网络网格 | 霓虹青 + 赛博紫 |
| **Crystal Data** | `crystal-data.svg` | 水晶数据存储 | 霓虹青 → 激光粉渐变 |
| **Cyber Eye** | `cyber-eye.svg` | 赛博电子眼 | 霓虹青 → 激光粉 |
| **Data Core** | `data-core.svg` | 数据核心 | 霓虹青 → 赛博紫 → 激光粉 |
| **Synapse** | `synapse.svg` | 突触连接 | 霓虹青 + 赛博紫 |
| **Quantum Bit** | `quantum-bit.svg` | 量子比特 | 霓虹青 + 赛博紫 + 激光粉 |

### 现有赛博朋克图标

| 图标名称 | 文件名 | 描述 | 主要颜色 |
|---------|--------|------|---------|
| **Microchip** | `microchip.svg` | 微芯片 | 霓虹青 |
| **Circuit Board** | `circuit-board.svg` | 电路板 | 霓虹青 |
| **Neon Grid** | `neon-grid.svg` | 霓虹网格 | 霓虹青 → 赛博紫 |
| **Hologram Display** | `hologram-display.svg` | 全息显示器 | 霓虹青 |
| **Data Stream** | `data-stream.svg` | 数据流 | 霓虹青 |
| **Robot Eye** | `robot-eye.svg` | 机械眼 | 霓虹青 → 激光粉 |
| **Quantum Core** | `quantum-core.svg` | 量子核心 | 霓虹青 → 赛博紫 |
| **Neural Network** | `neural-network.svg` | 神经网络 | 霓虹青 |

---

## 🎯 功能图标分类

### 导航类（Navigation）- 5 个
```
home.svg
blog.svg
about.svg
portfolio.svg
search.svg
```

### 社交媒体类（Social Media）- 8 个
```
github.svg
twitter.svg
email.svg
linkedin.svg
rss.svg
```

### UI 元素类（UI Elements）- 16 个
```
calendar.svg
tag.svg
star.svg
user.svg
settings.svg
code.svg
terminal.svg
check.svg
alert.svg
shield.svg
lock.svg
unlock.svg
theme-toggle.svg
```

### 操作类（Actions）- 10 个
```
menu.svg
close.svg
loading.svg
external-link.svg
heart.svg
comment.svg
share.svg
copy.svg
filter.svg
```

### 文件系统类（Files）- 4 个
```
folder.svg
bookmark.svg
download.svg
upload.svg
```

### 开发工具类（Dev Tools）- 12 个
```
git-branch.svg
git-commit.svg
git-merge.svg
history.svg
chip.svg
bot.svg
bug.svg
bug-report.svg
terminal-code.svg
database-cyber.svg
brain-ai.svg
```

### 数据可视化类（Data Viz）- 6 个
```
bar-chart.svg
pie-chart.svg
trending-up.svg
activity.svg
database.svg
server.svg
```

---

## 🎨 配色方案

### 赛博朋克标准色（Cyberpunk Standard Colors）

```css
/* 主色调 */
--cyber-cyan: #00f0ff;      /* 霓虹青 - 主色 */
--cyber-purple: #9d00ff;    /* 赛博紫 - 辅助色 */
--cyber-pink: #ff0080;      /* 激光粉 - 强调色 */
--cyber-yellow: #f0ff00;    /* 电压黄 - 警告/提示 */
--cyber-green: #00ff88;     /* 矩阵绿 - 成功/状态 */

/* 中性色 */
--cyber-dark: #0a0a0f;      /* 深色背景 */
--cyber-muted: #1a1a2e;     /* 静音背景 */
```

### 渐变方案（Gradient Schemes）

```css
/* 主渐变 */
linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)

/* 强调渐变 */
linear-gradient(135deg, #ff0080 0%, #9d00ff 100%)

/* 能量渐变 */
linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)
```

---

## 📐 尺寸规格

### 标准尺寸（Standard Sizes）

```tsx
size={16}   // 超小：按钮内图标、状态指示
size={20}   // 小：输入框图标、工具栏
size={24}   // 标准：导航、卡片、列表（默认）
size={32}   // 大：标题图标、功能卡片
size={48}   // 超大：英雄区、特色区域
size={64}   // 特大：Logo、背景装饰
size={128}  // 巨大：插画、页面主视觉
```

### 使用场景建议

| 场景 | 推荐尺寸 | 使用变体 |
|------|---------|---------|
| 导航菜单 | 24px | cyan |
| 按钮图标 | 20px | 根据功能 |
| 卡片标题 | 32px | purple/pink |
| 英雄区 | 64px | cyan with glow |
| 背景装饰 | 128px+ | 低透明度 |

---

## ✨ 动画效果

### 内置动画类型

```tsx
// 脉冲动画 - 用于状态指示、加载
animation="pulse"

// 旋转动画 - 用于加载、同步
animation="spin"

// 弹跳动画 - 用于提示、通知
animation="bounce"
```

### SVG 原生动画

所有赛博朋克图标都包含 SVG 原生动画：

- **发光脉冲** - 中心点呼吸效果
- **轨道旋转** - 外圈元素旋转
- **数据流动** - 粒子沿路径移动
- **相位变化** - 透明度周期变化

---

## 🚀 使用示例

### 基础用法

```tsx
import { Icon } from '@/components/graphics/Icon';

// 默认使用
<Icon name="tech-flux" size={24} />

// 带发光效果
<Icon name="neural-mesh" size={32} glow={true} />

// 带动画
<Icon name="crystal-data" size={48} animation="pulse" />
```

### Logo 组件

```tsx
import { Logo } from '@/components/graphics/Logo';

// 完整 Logo（图标 + 文字）
<Logo variant="full" size={48} />

// 仅图标
<Logo variant="icon" size={32} />

// 仅文字
<Logo variant="text" size={48} />

// 极简版
<Logo variant="minimal" size={24} />

// 带动画
<Logo variant="full" size={64} animated={true} />
```

### 组合使用

```tsx
// 导航栏
<div className="flex items-center gap-2">
  <Logo variant="icon" size={32} />
  <span className="text-xl font-bold">CyberPress</span>
</div>

// 功能卡片
<div className="card">
  <Icon name="tech-flux" size={48} glow={true} />
  <h3>能量流</h3>
  <p>实时数据流动可视化</p>
</div>

// 按钮组
<button className="btn-primary">
  <Icon name="crystal-data" size={20} />
  <span>数据存储</span>
</button>
```

---

## 📁 文件结构

```
frontend/
├── public/
│   └── icons/
│       ├── cyberpunk/          # 赛博朋克图标（13个）
│       │   ├── tech-flux.svg
│       │   ├── neural-mesh.svg
│       │   ├── crystal-data.svg
│       │   ├── cyber-eye.svg
│       │   ├── data-core.svg
│       │   ├── synapse.svg
│       │   ├── quantum-bit.svg
│       │   ├── microchip.svg
│       │   ├── circuit-board.svg
│       │   ├── neon-grid.svg
│       │   ├── hologram-display.svg
│       │   ├── data-stream.svg
│       │   ├── robot-eye.svg
│       │   ├── quantum-core.svg
│       │   └── neural-network.svg
│       ├── home.svg
│       ├── blog.svg
│       └── ... (其他基础图标)
├── components/
│   └── graphics/
│       ├── Icon.tsx           # 图标组件
│       ├── Logo.tsx           # Logo 组件
│       ├── Decoration.tsx     # 装饰图形
│       ├── Illustration.tsx   # 插画组件
│       └── PatternBackground.tsx  # 图案背景
└── docs/
    └── graphics/
        ├── ICON_MANIFEST_V3.md  # 本文档
        ├── COLOR_REFERENCE.md   # 配色参考
        └── DESIGN_GUIDELINES.md # 设计规范
```

---

## 🔧 技术规格

### SVG 规范

- **ViewBox**: 64x64 或 24x24
- **Stroke Width**: 1-3px
- **滤镜**: 高斯模糊（stdDeviation: 1.5-2.5）
- **动画**: SVG SMIL 动画
- **优化**: 已压缩，移除冗余代码

### 响应式支持

- 完全响应式设计
- 支持所有现代浏览器
- 优化的文件大小
- 高清屏幕支持

---

## 📝 添加新图标指南

### 1. 创建 SVG 文件

在 `frontend/public/icons/cyberpunk/` 创建新图标：

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <!-- 定义渐变和滤镜 -->
    <linearGradient id="my-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00f0ff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9d00ff;stop-opacity:1" />
    </linearGradient>
    <filter id="my-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- 图标内容 -->
  <!-- 使用赛博朋克配色和发光效果 -->
</svg>
```

### 2. 使用图标

```tsx
<Icon name="my-new-icon" size={24} glow={true} />
```

### 3. 更新文档

在本文档中添加图标信息到相应分类。

---

## 🎯 最佳实践

### ✅ 推荐做法

- 使用标准尺寸（16, 20, 24, 32, 48, 64）
- 根据功能选择合适的颜色
- 为交互元素添加适当的动画
- 使用 `aria-label` 提升可访问性
- 保持一致的视觉风格

### ❌ 避免做法

- 混合使用不同风格的图标
- 过度使用发光效果
- 不必要的动画效果
- 忽略可访问性
- 随意修改配色方案

---

## 📚 相关文档

- [配色参考](./COLOR_REFERENCE.md) - 完整的赛博朋克配色方案
- [设计规范](./DESIGN_GUIDELINES.md) - 视觉设计指南
- [组件使用指南](../components/README.md) - 组件库文档
- [动画指南](./ANIMATION_GUIDE.md) - 动画效果说明

---

## 📄 版本历史

### v3.0 (2026-03-07)
- ✨ 新增 7 个赛博朋克图标
- 🎨 优化现有图标动画效果
- 📝 更新图标清单文档
- 🔧 改进 SVG 代码结构

### v2.0 (2026-03-02)
- ✨ 新增赛博朋克图标系列
- 🎨 引入发光效果
- ⚡ 添加 SVG 原生动画

### v1.0 (2026-02-20)
- 🎉 初始版本
- 📦 69 个基础图标

---

**维护者**: CyberPress Design Team
**许可证**: MIT
**项目**: CyberPress Platform
