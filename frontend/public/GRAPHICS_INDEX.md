# CyberPress Platform - 图形资源快速索引

## 📁 文件结构

```
frontend/public/
├── 📄 logo-main.svg              # 主 Logo (512x512)
├── 📄 logo-square.svg            # 方形 Logo (512x512)
├── 📄 logo-favicon.svg           # 网站图标 (64x64)
├── 📄 og-image.svg               # 社交分享图 (1200x630)
├── 📄 sprite-icons.svg           # SVG Sprite 系统
│
├── 📁 icons/                     # 功能图标 (60+)
│   ├── navigation/
│   │   ├── home.svg
│   │   ├── blog.svg
│   │   ├── portfolio.svg
│   │   └── about.svg
│   ├── social/
│   │   ├── github.svg
│   │   ├── twitter.svg
│   │   ├── linkedin.svg
│   │   └── email.svg
│   ├── ui/
│   │   ├── search.svg
│   │   ├── menu.svg
│   │   ├── user.svg
│   │   └── settings.svg
│   └── actions/
│       ├── edit.svg
│       ├── delete.svg
│       ├── save.svg
│       └── share.svg
│
├── 📁 illustrations/             # 插画 (7+)
│   ├── cyber-city.svg           # 赛博城市 (800x400)
│   ├── developer-workspace.svg  # 开发工作区 (600x400)
│   ├── network-nodes.svg        # 网络节点 (600x400)
│   ├── server-rack.svg
│   ├── code-screen.svg
│   ├── circuit-board.svg
│   └── network-globe.svg
│
├── 📁 patterns/                  # 背景图案 (8+)
│   ├── grid.svg                 # 网格
│   ├── circuit.svg              # 电路
│   ├── scanlines.svg            # 扫描线
│   ├── noise.svg                # 噪点
│   ├── hexagon.svg              # 六边形
│   ├── matrix.svg               # 矩阵
│   ├── holographic.svg          # 全息
│   └── hex-grid.svg             # 六边形网格
│
├── 📁 backgrounds/               # 背景图片
│   ├── hero-bg.svg
│   ├── card-bg.svg
│   ├── loading-bg.svg
│   └── 404-bg.svg
│
└── 📁 decorations/               # 装饰元素
    ├── corner-bracket.svg       # 边框装饰
    ├── divider-line.svg         # 分隔线
    └── loader-ring.svg          # 加载动画
```

---

## 🎨 快速使用

### 图标
```tsx
<img src="/icons/home.svg" alt="Home" width="24" height="24" />
```

### Logo
```tsx
<img src="/logo-main.svg" alt="CyberPress" width="200" height="200" />
```

### 插画
```tsx
<img src="/illustrations/cyber-city.svg" alt="Cyber City" width="800" height="400" />
```

### 背景
```css
background-image: url('/patterns/grid.svg');
```

---

## 📊 统计

### 图形资源
- **Logo 变体**: 5 个
- **功能图标**: 105+ 个 (新增 10 个赛博朋克图标)
- **社交图标**: 10 个
- **插画**: 30+ 个
- **背景图案**: 8 个
- **装饰元素**: 6 个
- **总计**: 160+ 图形资源

### React 组件 (v3.0 新增)
- **IconLoader** - 动态图标加载器
- **DecorativeCorner** - 装饰性角标
- **CyberDivider** - 赛博分割线
- **HexagonFrame** - 六边形框架
- **BackgroundPattern** - 背景图案组件

### 新增内容 (2026-03-06)
- ✅ 10 个赛博朋克主题图标 (AI 与科技类 5个、数据与通信类 3个、赛博朋克主题类 2个)
- ✅ ai-brain.svg - AI 神经网络大脑
- ✅ neural-network.svg - 神经网络架构
- ✅ quantum-core.svg - 量子核心处理器
- ✅ microchip-tech.svg - 高科技微处理器
- ✅ robot-eye.svg - 赛博机器眼
- ✅ data-stream.svg - 数据流动画
- ✅ network-node.svg - 网络节点拓扑
- ✅ hologram-display.svg - 全息投影显示
- ✅ cyber-skull.svg - 赛博朋克头骨
- ✅ drone-tech.svg - 高科技无人机
- ✅ 完整图形素材指南

### 新增内容 (2026-03-03)
- ✅ 5 个 React 组件
- ✅ 3 个背景图案 (data-stream, holographic-grid, cyber-mesh)
- ✅ 3 个装饰元素
- ✅ 5 个社交图标
- ✅ 完整组件文档

---

## 🎯 核心颜色

```css
--cyber-cyan: #00f0ff;
--cyber-purple: #9d00ff;
--cyber-pink: #ff0080;
--cyber-yellow: #f0ff00;
--cyber-black: #0a0a0f;
```

---

## 🚀 快速开始

### React 组件使用

```tsx
import {
  IconLoader,
  DecorativeCorner,
  CyberDivider,
  HexagonFrame,
  BackgroundPattern,
} from '@/components/graphics';

// 动态图标
<IconLoader name="github" size={24} />

// 四角装饰
<DecorativeCorner position="top-left" variant="glow" />

// 分割线
<CyberDivider variant="gradient" animated />

// 六边形框架
<HexagonFrame size={200} variant="glow" animated>
  <Content />
</HexagonFrame>

// 背景图案
<BackgroundPattern pattern="cyber-mesh" opacity={0.3}>
  <Content />
</BackgroundPattern>
```

### 图标使用

```tsx
// 传统方式
<img src="/icons/home.svg" alt="Home" width="24" height="24" />

// 使用 IconLoader 组件
<IconLoader name="home" size={24} />
```

### 背景图案

```css
/* CSS 方式 */
.background-grid {
  background-image: url('/patterns/grid.svg');
  background-repeat: repeat;
}

/* React 组件方式 */
<BackgroundPattern pattern="cyber-mesh" opacity={0.3}>
  <div>Content</div>
</BackgroundPattern>
```

---

## 📚 文档导航

### 组件文档
- [组件使用手册](../components/graphics/GRAPHICS_COMPONENTS.md) - 新增组件详细说明
- [图标清单](../docs/ICON_MANIFEST.md) - 完整图标列表
- [配色参考](../docs/COLOR_REFERENCE.md) - 赛博朋克配色方案

### 资源文档
- [图形素材说明](README-GRAPHICS.md) - Logo 和图标使用
- [插画说明](illustrations/README.md) - 插画资源说明
- [背景图案说明](patterns/README.md) - 图案使用指南

### 项目文档
- [工作总结](../../GRAPHICS_WORK_SUMMARY.md) - 最新开发成果
- [图形系统总览](../GRAPHICS_SUMMARY.md) - 完整系统说明
- [组件演示](../components/examples/GraphicComponentsDemo) - 可视化演示

---

## 🆕 最新更新 (2026-03-06)

### 新增赛博朋克图标 (10个)
- ✅ **ai-brain.svg** - AI 神经网络大脑，带脉冲动画
- ✅ **neural-network.svg** - 神经网络架构，多层连接
- ✅ **quantum-core.svg** - 量子核心，旋转光环效果
- ✅ **microchip-tech.svg** - 微处理器，引脚与电路
- ✅ **robot-eye.svg** - 机器眼，扫描线动画
- ✅ **data-stream.svg** - 数据流，数据包传输
- ✅ **network-node.svg** - 网络节点，六边形拓扑
- ✅ **hologram-display.svg** - 全息显示，3D 投影
- ✅ **cyber-skull.svg** - 赛博头骨，发光眼睛
- ✅ **drone-tech.svg** - 无人机，旋转螺旋桨

### 设计特点
- ✅ 统一赛博朋克美学风格
- ✅ 原生 SVG 动画支持
- ✅ 霓虹发光效果
- ✅ 三色渐变系统
- ✅ 响应式设计

### 技术规范
- ✅ 24x24 viewBox 标准尺寸
- ✅ SMIL 动画集成
- ✅ 滤镜发光效果
- ✅ 可定制颜色方案

## 🆕 最新更新 (2026-03-03)

### 新增组件
- ✅ **IconLoader** - 从 public/icons 动态加载 SVG
- ✅ **DecorativeCorner** - 四角装饰，支持发光效果
- ✅ **CyberDivider** - 4种变体，支持动画
- ✅ **HexagonFrame** - 六边形框架，可包含内容
- ✅ **BackgroundPattern** - 8种背景图案组件

### 新增资源
- ✅ **社交图标**: Behance, Instagram, Discord, YouTube, Dribbble
- ✅ **背景图案**: data-stream, holographic-grid, cyber-mesh
- ✅ **装饰元素**: corner-accent, divider-line, hexagon-frame

### 技术特点
- ✅ TypeScript 完整类型支持
- ✅ 响应式设计
- ✅ 动画效果支持
- ✅ 可访问性友好
- ✅ 开箱即用

---

**查看完整文档**: [GRAPHICS_GUIDE.md](/GRAPHICS_GUIDE.md)
