# CyberPress 图形素材清单 v3.0

> 完整的图形素材目录和使用指南
> 最后更新：2026-03-07
> 设计团队：CyberPress AI Design Team

---

## 📊 素材统计

| 类别 | 数量 | 格式 | 说明 |
|------|------|------|------|
| **SVG 图标** | 82 个 | SVG | 赛博朋克风格，含动画 |
| **Logo 组件** | 1 个 | React/TSX | 4 种变体 |
| **展示组件** | 1 个 | React/TSX | 图标画廊 |
| **文档** | 3 个 | Markdown | 完整文档 |
| **总文件数** | 87+ | - | 覆盖完整项目需求 |

---

## 🎨 SVG 图标清单

### 新增赛博朋克图标（2026-03-07）

#### 能量科技系列
1. **tech-flux.svg** - 能量流动核心
   - 尺寸：64x64
   - 配色：霓虹青 → 赛博紫 → 激光粉
   - 特效：脉冲动画 + 轨道粒子

2. **neural-mesh.svg** - 神经网络网格
   - 尺寸：64x64
   - 配色：霓虹青 + 赛博紫
   - 特效：数据流动画 + 脉冲节点

3. **crystal-data.svg** - 水晶数据存储
   - 尺寸：64x64
   - 配色：霓虹青 → 激光粉渐变
   - 特效：能量脉冲 + 发光核心

#### 视觉感知系列
4. **cyber-eye.svg** - 赛博电子眼
   - 尺寸：24x24
   - 配色：霓虹青 → 激光粉
   - 特效：扫描线动画 + 发光

5. **data-core.svg** - 数据核心
   - 尺寸：64x64
   - 配色：三色渐变
   - 特效：轨道旋转 + 中心脉冲

#### 量子科技系列
6. **synapse.svg** - 突触连接
   - 尺寸：64x64
   - 配色：霓虹青 + 赛博紫
   - 特效：信号传输 + 节点闪烁

7. **quantum-bit.svg** - 量子比特
   - 尺寸：64x64
   - 配色：三色系统
   - 特效：叠加态动画 + 纠缠粒子

### 现有赛博朋克图标（8 个）

| 文件名 | 描述 | 尺寸 | 主要颜色 |
|--------|------|------|---------|
| microchip.svg | 微芯片 | 64x64 | 霓虹青 |
| circuit-board.svg | 电路板 | 64x64 | 霓虹青 |
| neon-grid.svg | 霓虹网格 | 64x64 | 霓虹青→赛博紫 |
| hologram-display.svg | 全息显示器 | 64x64 | 霓虹青 |
| data-stream.svg | 数据流 | 64x64 | 霓虹青 |
| robot-eye.svg | 机械眼 | 24x24 | 霓虹青→激光粉 |
| quantum-core.svg | 量子核心 | 64x64 | 霓虹青→赛博紫 |
| neural-network.svg | 神经网络 | 64x64 | 霓虹青 |

### 基础图标（69 个）

分类包括：
- 导航类（5 个）
- 社交媒体（8 个）
- UI 元素（16 个）
- 操作类（10 个）
- 文件系统（4 个）
- 开发工具（12 个）
- 数据可视化（6 个）
- 其他功能（8 个）

---

## 🧩 React 组件

### 1. Logo 组件

**文件位置：** `frontend/components/graphics/Logo.tsx`

**功能特性：**
- ✅ 4 种变体（full, icon, text, minimal）
- ✅ 可配置尺寸
- ✅ 支持动画效果
- ✅ TypeScript 类型支持
- ✅ 响应式设计

**使用示例：**
```tsx
import { Logo } from '@/components/graphics/Logo';

// 完整版
<Logo variant="full" size={48} />

// 带动画
<Logo variant="full" size={64} animated={true} />

// 仅图标
<Logo variant="icon" size={32} />
```

**变体说明：**

| 变体 | 说明 | 包含内容 |
|------|------|---------|
| `full` | 完整版 | 图标 + 文字 |
| `icon` | 仅图标 | C 形六边形图标 |
| `text` | 仅文字 | CyberPress 文字 |
| `minimal` | 极简版 | 简化的 C 形图标 |

---

### 2. 图标展示组件

**文件位置：** `frontend/components/graphics/CyberIconGallery.tsx`

**功能特性：**
- ✅ 网格布局展示
- ✅ 分类过滤
- ✅ 点击放大查看
- ✅ 双击复制代码
- ✅ 配色方案显示
- ✅ 响应式列数

**使用示例：**
```tsx
import CyberIconGallery from '@/components/graphics/CyberIconGallery';

// 显示所有赛博朋克图标
<CyberIconGallery category="cyberpunk" columns={4} />

// 显示描述
<CyberIconGallery showDescription={true} />
```

---

### 3. Icon 组件（已存在）

**文件位置：** `frontend/components/graphics/Icon.tsx`

**功能特性：**
- ✅ 统一图标接口
- ✅ 支持发光效果
- ✅ 多种动画选项
- ✅ 颜色变体系统

---

## 📱 页面与路由

### 图标展示页面

**路由：** `/icons-showcase-v3`

**文件位置：** `frontend/app/icons-showcase-v3/page.tsx`

**页面内容：**
1. 英雄区 - Logo 和统计信息
2. 新增图标展示 - 7 个最新图标
3. Logo 变体展示 - 4 种样式
4. 配色方案展示 - 6 种标准色
5. 使用指南 - 代码示例
6. 页脚信息

---

## 📁 文件结构

```
cyberpress-platform/
├── frontend/
│   ├── public/
│   │   └── icons/
│   │       └── cyberpunk/              # 赛博朋克图标
│   │           ├── tech-flux.svg       # [新增] 能量流
│   │           ├── neural-mesh.svg     # [新增] 神经网格
│   │           ├── crystal-data.svg    # [新增] 水晶数据
│   │           ├── cyber-eye.svg       # [已存在] 赛博眼
│   │           ├── data-core.svg       # [已存在] 数据核心
│   │           ├── synapse.svg         # [已存在] 突触
│   │           ├── quantum-bit.svg     # [已存在] 量子比特
│   │           ├── microchip.svg
│   │           ├── circuit-board.svg
│   │           ├── neon-grid.svg
│   │           ├── hologram-display.svg
│   │           ├── data-stream.svg
│   │           ├── robot-eye.svg
│   │           ├── quantum-core.svg
│   │           └── neural-network.svg
│   ├── components/
│   │   └── graphics/
│   │       ├── Icon.tsx                # [已存在] 图标组件
│   │       ├── Logo.tsx                # [新增] Logo 组件
│   │       ├── LogoDisplay.tsx         # [已存在] Logo 展示
│   │       ├── Decoration.tsx          # [已存在] 装饰图形
│   │       ├── Illustration.tsx        # [已存在] 插画组件
│   │       ├── PatternBackground.tsx   # [已存在] 图案背景
│   │       └── CyberIconGallery.tsx    # [新增] 图标画廊
│   └── app/
│       └── icons-showcase-v3/          # [新增] 图标展示页面
│           └── page.tsx
└── docs/
    └── graphics/
        ├── ICON_MANIFEST_V3.md         # [新增] 图标清单
        ├── COLOR_REFERENCE.md          # [新增] 配色参考
        └── GRAPHICS_ASSETS_V3.md       # [新增] 本文档
```

---

## 🎨 配色系统

### 核心色板

```css
/* 主色调 */
--cyber-cyan: #00f0ff;      /* 霓虹青 - 主色 */
--cyber-purple: #9d00ff;    /* 赛博紫 - 辅助色 */
--cyber-pink: #ff0080;      /* 激光粉 - 强调色 */
--cyber-yellow: #f0ff00;    /* 电压黄 - 警告 */
--cyber-green: #00ff88;     /* 矩阵绿 - 成功 */

/* 中性色 */
--cyber-dark: #0a0a0f;      /* 深色背景 */
--cyber-muted: #1a1a2e;     /* 静音背景 */
```

### 渐变方案

```css
/* 主渐变 */
linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)

/* 能量渐变 */
linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%)

/* 赛博渐变 */
linear-gradient(135deg, #ff0080 0%, #9d00ff 100%)
```

### 发光效果

```css
/* 标准发光 */
filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.8));

/* 强烈发光 */
filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.9))
        drop-shadow(0 0 20px rgba(0, 240, 255, 0.7));
```

---

## 🚀 使用指南

### 快速开始

1. **使用图标**
```tsx
import { Icon } from '@/components/graphics/Icon';

<Icon name="tech-flux" size={24} glow={true} />
```

2. **使用 Logo**
```tsx
import { Logo } from '@/components/graphics/Logo';

<Logo variant="full" size={48} animated={true} />
```

3. **图标画廊**
```tsx
import CyberIconGallery from '@/components/graphics/CyberIconGallery';

<CyberIconGallery category="cyberpunk" columns={4} />
```

### 尺寸推荐

| 场景 | 推荐尺寸 | 使用变体 |
|------|---------|---------|
| 导航菜单 | 24px | cyan |
| 按钮图标 | 20px | 根据功能 |
| 卡片标题 | 32px | purple/pink |
| 英雄区 | 64px | cyan with glow |
| 背景装饰 | 128px+ | 低透明度 |

---

## 📊 图标分类索引

### 按功能分类

#### 🔌 能量与动力
- tech-flux - 能量流动核心
- data-core - 数据核心

#### 🧠 神经与智能
- neural-mesh - 神经网络网格
- synapse - 突触连接
- neural-network - 神经网络

#### 👁️ 视觉与感知
- cyber-eye - 赛博电子眼
- robot-eye - 机械眼

#### 💎 存储与数据
- crystal-data - 水晶数据存储

#### ⚛️ 量子科技
- quantum-bit - 量子比特
- quantum-core - 量子核心

#### 🔧 硬件与电路
- microchip - 微芯片
- circuit-board - 电路板

#### 🌐 网格与空间
- neon-grid - 霓虹网格
- hologram-display - 全息显示器
- data-stream - 数据流

### 按颜色分类

#### 🔵 青色系（Cyan）
- tech-flux
- neural-mesh
- crystal-data
- cyber-eye
- data-core
- synapse
- quantum-bit
- microchip
- circuit-board
- neon-grid
- hologram-display
- data-stream
- robot-eye
- quantum-core
- neural-network

#### 🟣 紫色系（Purple）
- tech-flux
- neural-mesh
- data-core
- synapse
- quantum-bit
- neon-grid
- quantum-core

#### 🔴 粉色系（Pink）
- tech-flux
- crystal-data
- cyber-eye
- data-core
- quantum-bit
- robot-eye

---

## 📝 版本历史

### v3.0 (2026-03-07)
- ✨ 新增 7 个赛博朋克图标
- 🎨 创建 Logo 组件（4 种变体）
- 🖼️ 创建图标展示组件
- 📄 完善文档系统
- 🌐 创建图标展示页面

### v2.0 (2026-03-02)
- ✨ 引入赛博朋克图标系列
- 🎨 添加发光效果
- ⚡ SVG 原生动画

### v1.0 (2026-02-20)
- 🎉 基础图标系统

---

## 🎯 设计原则

### 视觉风格
- **赛博朋克美学** - 霓虹发光、暗色背景
- **科技未来感** - 电路纹路、量子元素
- **动态交互** - 原生 SVG 动画
- **高对比度** - 确保可读性

### 技术标准
- **SVG 格式** - 矢量图形，无损缩放
- **响应式** - 适配所有设备
- **性能优化** - 最小文件大小
- **可访问性** - 支持屏幕阅读器

---

## 📚 相关文档

1. **[图标清单 v3.0](./ICON_MANIFEST_V3.md)** - 详细的图标列表
2. **[配色参考](./COLOR_REFERENCE.md)** - 完整配色方案
3. **[组件文档](../components/README.md)** - 组件使用指南

---

## 🔗 快速链接

- **图标展示页：** `/icons-showcase-v3`
- **组件目录：** `frontend/components/graphics/`
- **图标目录：** `frontend/public/icons/cyberpunk/`
- **文档目录：** `docs/graphics/`

---

## 👥 团队信息

**设计团队：** CyberPress AI Design Team
**项目名称：** CyberPress Platform
**版本：** v3.0
**最后更新：** 2026-03-07
**许可证：** MIT

---

## 📞 支持与反馈

如有问题或建议，请联系设计团队或提交 Issue。

---

**感谢使用 CyberPress 图形素材库！** 🎨✨
