# CyberPress 图形素材目录

> 完整的图形资源清单和索引

## 📊 资源统计

- **图标组件**: 100+
- **SVG 图案**: 15+
- **装饰元素**: 10+
- **背景素材**: 8+
- **Logo 变体**: 5+

---

## 🎯 图标组件 (Icons)

### 位置
`/frontend/components/icons/`

### 分类统计

| 分类 | 数量 | 说明 |
|------|------|------|
| 基础图标 | 16 | 搜索、菜单、箭头等 |
| 导航图标 | 6 | 首页、博客、作品集等 |
| 社交媒体 | 8 | GitHub、Twitter、Discord 等 |
| 内容图标 | 13 | 日历、标签、代码等 |
| 用户操作 | 13 | 编辑、删除、保存等 |
| 状态图标 | 7 | 在线、离线、同步等 |
| 文件媒体 | 8 | 文件、图片、视频等 |
| 系统安全 | 6 | 锁、盾、眼等 |
| 赛博科技 | 11 | CPU、数据库、网络等 |
| 装饰特效 | 12 | 火箭、奖杯、火焰等 |

### 详细清单

查看 [图标完整索引](../components/icons/ICON_COMPLETE_INDEX.md) 获取完整列表。

---

## 🌐 图案素材 (Patterns)

### 位置
`/frontend/public/patterns/`

### 基础图案

| 文件名 | 类型 | 颜色 | 用途 |
|--------|------|------|------|
| `grid.svg` | 网格 | 青色 | 技术背景 |
| `circuit.svg` | 电路 | 青紫 | 科技感 |
| `scanlines.svg` | 扫描线 | 青色 | 复古效果 |
| `noise.svg` | 噪点 | 灰色 | 纹理 |
| `hexagon.svg` | 六边形 | 青色 | 结构化 |
| `matrix.svg` | 矩阵 | 绿色 | 黑客风格 |
| `holographic.svg` | 全息 | 彩色 | 未来感 |
| `hex-grid.svg` | 六边网格 | 青色 | 蜂窝结构 |

### 新增赛博图案

| 文件名 | 类型 | 颜色 | 用途 |
|--------|------|------|------|
| `cyber-grid.svg` | 赛博网格 | 青色 | 网格背景 |
| `cyber-dots.svg` | 赛博点阵 | 紫色 | 点状纹理 |
| `cyber-waves.svg` | 赛博波浪 | 粉色 | 波浪效果 |
| `cyber-stars.svg` | 赛博星星 | 黄色 | 星空背景 |
| `cyber-circuit.svg` | 赛博电路 | 青紫 | 电路板 |
| `cyber-hex.svg` | 赛博六边 | 绿色 | 六边形 |

### 使用示例

```css
/* 使用图案作为背景 */
.patterned-bg {
  background-image: url('/patterns/cyber-grid.svg');
  background-repeat: repeat;
  background-size: 100px 100px;
}
```

---

## ✨ 装饰元素 (Decorations)

### 位置
`/frontend/public/decorations/`

### 可用装饰

| 文件名 | 类型 | 颜色 | 用途 |
|--------|------|------|------|
| `corner-bracket.svg` | 角括号 | 青色 | 边框装饰 |
| `divider-line.svg` | 分割线 | 青色 | 内容分割 |
| `loader-ring.svg` | 加载环 | 青色 | 加载动画 |
| `glow-line.svg` | 发光线 | 青色 | 分割线 |
| `corner-deco.svg` | 角落装饰 | 青紫 | 边框 |
| `tech-dots.svg` | 技术点阵 | 多色 | 背景 |
| `data-stream.svg` | 数据流 | 青色 | 动态效果 |

### 使用示例

```tsx
{/* 角落装饰 */}
<div className="relative p-8 bg-cyber-card">
  <img
    src="/decorations/corner-deco.svg"
    alt=""
    className="absolute top-0 left-0 w-12 h-12"
  />
  <div className="relative z-10">
    内容...
  </div>
</div>
```

---

## 🎨 背景素材 (Backgrounds)

### 位置
`/frontend/public/backgrounds/`

### 可用背景

| 文件名 | 类型 | 颜色 | 用途 |
|--------|------|------|------|
| `hero-bg.svg` | Hero 背景 | 渐变 | 首页 |
| `card-bg.svg` | 卡片背景 | 深色 | 卡片 |
| `loading-bg.svg` | 加载背景 | 渐变 | 加载页 |
| `404-bg.svg` | 404 背景 | 抽象 | 错误页 |

### 使用示例

```css
/* Hero 背景 */
.hero-section {
  background: url('/backgrounds/hero-bg.svg') center/cover;
}
```

---

## 🏷️ Logo 资源 (Branding)

### 位置
`/frontend/public/assets/logo/`

### Logo 变体

| 文件名 | 尺寸 | 格式 | 用途 |
|--------|------|------|------|
| `cyberpress-logo.svg` | 200x50 | SVG | 导航栏 |
| `cyberpress-icon.svg` | 50x50 | SVG | Favicon |
| `cyberpress-favicon.svg` | 32x32 | SVG | 浏览器标签 |
| `cyberpress-square.svg` | 100x100 | SVG | 社交媒体 |

### 根目录 Logo

| 文件名 | 说明 |
|--------|------|
| `logo.svg` | 主 Logo |
| `logo-icon.svg` | 图标版 |
| `logo-mark.svg` | 标志版 |
| `logo-square.svg` | 方形版 |
| `logo-favicon.svg` | Favicon |
| `logo-main.svg` | 主要版 |
| `og-image.svg` | Open Graph |

### 使用示例

```tsx
{/* 完整 Logo */}
<img src="/assets/logo/cyberpress-logo.svg" alt="CyberPress" />

{/* 图标版 */}
<img src="/assets/logo/cyberpress-icon.svg" alt="CyberPress" width="50" />

{/* 组件方式 */}
import { Logo } from '@/components/icons';
<Logo size={40} className="text-cyber-cyan" />
```

---

## 🖼️ 插画素材 (Illustrations)

### 位置
`/frontend/public/illustrations/`

### 可用插画

| 文件名 | 主题 | 风格 | 用途 |
|--------|------|------|------|
| `server-rack.svg` | 服务器 | 科技 | 技术页面 |
| `code-screen.svg` | 代码屏幕 | 编程 | 开发者 |
| `circuit-board.svg` | 电路板 | 电子 | 硬件 |
| `network-globe.svg` | 网络地球 | 网络 | 全球化 |
| `cyber-city.svg` | 赛博城市 | 未来 | Hero 区 |
| `developer-workspace.svg` | 开发工作台 | 工作 | 关于页 |
| `network-nodes.svg` | 网络节点 | 数据 | 数据中心 |

### 使用示例

```tsx
{/* 使用插画 */}
<div className="flex items-center justify-center">
  <img
    src="/illustrations/cyber-city.svg"
    alt="Cyber City"
    className="w-full max-w-2xl"
  />
</div>
```

---

## 🎨 颜色系统

### 主色调

```css
--cyber-dark: #0a0a0f;      /* 深空黑 */
--cyber-cyan: #00f0ff;      /* 霓虹青 */
--cyber-purple: #9d00ff;    /* 赛博紫 */
--cyber-pink: #ff0080;      /* 激光粉 */
--cyber-yellow: #f0ff00;    /* 电压黄 */
--cyber-green: #00ff88;     /* 霓虹绿 */
```

### 渐变色

```css
/* 主渐变 */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 三色渐变 */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
```

详细配色参考：[配色系统](../components/graphics/PALETTE_SYSTEM.md)

---

## 📐 尺寸规格

### 图标尺寸

| 类名 | 像素 | 使用场景 |
|------|------|----------|
| `xs` | 12px | 极小图标 |
| `sm` | 16px | 小图标 |
| `md` | 20px | 中等图标 |
| `lg` | 24px | 标准尺寸（默认） |
| `xl` | 32px | 大图标 |
| `2xl` | 40px | 超大图标 |
| `3xl` | 48px | 特大图标 |
| `4xl` | 64px | 巨型图标 |

### Logo 尺寸

| 用途 | 尺寸 |
|------|------|
| 导航栏 | 40-50px |
| 页脚 | 30-40px |
| Favicon | 32x32px |
| 社交媒体 | 100x100px |

---

## 💡 使用技巧

### 1. 图标组合

```tsx
{/* 按钮图标 */}
<button className="flex items-center gap-2">
  <DownloadIcon size={20} />
  <span>下载</span>
</button>
```

### 2. 图案叠加

```css
/* 图案 + 渐变 */
.complex-bg {
  background:
    url('/patterns/cyber-grid.svg'),
    linear-gradient(135deg, #16162a 0%, #0a0a0f 100%);
  background-blend-mode: overlay;
}
```

### 3. 装饰定位

```tsx
{/* 绝对定位装饰 */}
<div className="relative">
  <img src="/decorations/corner-deco.svg" className="absolute top-0 left-0" />
  <div className="relative z-10">内容</div>
</div>
```

---

## 📚 快速链接

- [图标使用指南](GRAPHICS_USAGE_GUIDE.md)
- [图标完整索引](../components/icons/ICON_COMPLETE_INDEX.md)
- [配色系统](../components/graphics/PALETTE_SYSTEM.md)
- [图标清单 v3.0](../docs/ICON_MANIFEST_V3.md)

---

**最后更新**: 2026-03-07
**版本**: 1.0.0
**设计团队**: CyberPress AI Design Team
