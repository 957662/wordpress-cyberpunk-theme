# CyberPress 图形设计清单

> 项目完整的图形素材、图标和视觉资源清单

**更新日期：** 2026-03-03
**设计风格：** 赛博朋克 / Cyberpunk
**维护者：** AI 图形设计师

---

## 📦 图形组件库

### 1. Logo 组件 (`components/graphics/Logos.tsx`)

#### 可用 Logo 类型：

| 组件名 | 用途 | 尺寸 | 特点 |
|--------|------|------|------|
| `MainLogo` | 主 Logo | 200x60 | 完整 Logo，带文字和图标 |
| `SquareLogo` | 方形 Logo | 64x64 | 仅图标部分 |
| `FaviconLogo` | Favicon | 32x32 | 小图标版本 |
| `MinimalLogo` | 极简版 | 100x100 | 单色版本 |
| `TextLogo` | 文字版 | 可变 | 仅文字部分 |
| `WatermarkLogo` | 水印 | 200x60 | 半透明版本 |
| `AnimatedLogo` | 动画版 | 100x100 | 带脉冲效果 |

#### 使用示例：
```tsx
import { MainLogo, SquareLogo } from '@/components/graphics/Logos';

<MainLogo width={200} animated={true} />
<SquareLogo size={64} onClick={handleClick} />
```

---

### 2. SVG 图标库 (`components/graphics/SVGIcons.tsx`)

#### 图标分类：

##### 🧭 导航图标
- `HomeIcon` - 首页
- `MenuIcon` - 菜单
- `SearchIcon` - 搜索
- `BackIcon` - 返回
- `ForwardIcon` - 前进

##### 💻 开发图标
- `CodeIcon` - 代码
- `TerminalIcon` - 终端
- `DatabaseIcon` - 数据库
- `APIIcon` - API
- `CloudIcon` - 云端

##### 🎨 设计图标
- `PaletteIcon` - 调色板
- `BrushIcon` - 画笔
- `LayersIcon` - 图层
- `IconGridIcon` - 图标网格

##### 📱 社交图标
- `GitHubIcon` - GitHub
- `TwitterIcon` - Twitter
- `LinkedInIcon` - LinkedIn
- `DiscordIcon` - Discord

##### ⚙️ 功能图标
- `SettingsIcon` - 设置
- `UserIcon` - 用户
- `LockIcon` - 锁
- `BellIcon` - 通知
- `DownloadIcon` - 下载

#### 使用示例：
```tsx
import { HomeIcon, GitHubIcon, SettingsIcon } from '@/components/graphics/SVGIcons';

<HomeIcon size={24} className="text-cyber-cyan" glow={true} />
<GitHubIcon size={20} onClick={openGitHub} />
```

---

### 3. 插画组件 (`components/graphics/Illustrations.tsx`)

#### 可用插画：

| 组件名 | 尺寸 | 动画 | 描述 |
|--------|------|------|------|
| `CyberCityIllustration` | 400x300 | ✓ | 赛博城市夜景 |
| `CodeScreenIllustration` | 300x250 | - | 代码编辑器屏幕 |
| `NetworkIllustration` | 300x300 | ✓ | 网络节点连接 |
| `ServerRackIllustration` | 200x300 | ✓ | 服务器机架 |
| `CircuitBoardIllustration` | 300x300 | ✓ | 电路板图案 |
| `WorkspaceIllustration` | 350x250 | - | 开发工作空间 |

#### 使用示例：
```tsx
import { CyberCityIllustration, NetworkIllustration } from '@/components/graphics/Illustrations';

<CyberCityIllustration width={400} animated={true} />
<NetworkIllustration width={300} />
```

---

### 4. 装饰组件 (`components/graphics/Decorations.tsx`)

#### 装饰元素类型：

##### 🔲 边框装饰
- `CornerBracket` - 角标装饰（4个位置）
- `TechBorder` - 科技感边框
- `CyberBorder` - 完整霓虹边框

##### ➖ 分割线
- `DividerLine` - 分割线（4种样式）
  - `simple` - 简单线
  - `double` - 双线
  - `dashed` - 虚线
  - `tech` - 科技风

##### ⏳ 加载动画
- `LoadingRing` - 旋转加载环
- `PulseLoader` - 脉冲加载器
- `HexLoader` - 六边形加载器

##### 🎨 背景图案
- `PatternBackground` - 图案背景
  - `grid` - 网格
  - `dots` - 点阵
  - `hexagons` - 六边形
  - `circuit` - 电路

##### ✨ 特效装饰
- `Scanlines` - 扫描线效果
- `GlitchOverlay` - 故障效果覆盖
- `DataStream` - 数据流动画
- `HologramEffect` - 全息投影

#### 使用示例：
```tsx
import { CornerBracket, DividerLine, LoadingRing } from '@/components/graphics/Decorations';

<CornerBracket position="top-left" size={100} />
<DividerLine variant="tech" width="full" />
<LoadingRing size={80} />
```

---

## 🎨 配色方案

### 主色调
```css
--cyber-cyan: #00f0ff    /* 霓虹青 */
--cyber-purple: #9d00ff  /* 赛博紫 */
--cyber-pink: #ff0080    /* 激光粉 */
--cyber-yellow: #f0ff00  /* 电压黄 */
--cyber-green: #00ff88   /* 矩阵绿 */
```

### 背景色
```css
--cyber-dark: #0a0a0f    /* 主背景 */
--cyber-darker: #050508  /* 深背景 */
--cyber-card: #16162a    /* 卡片 */
--cyber-muted: #1a1a2e   /* 柔和 */
```

### 使用比例
- **青色 (60%)** - 主要交互
- **紫色 (30%)** - 次要元素
- **粉色 (10%)** - 强调标记

---

## 🎭 动画效果

### 内置动画类
```css
/* Tailwind 动画 */
animate-glow        /* 发光脉冲 */
animate-flicker     /* 闪烁 */
animate-scan        /* 扫描 */
animate-float       /* 浮动 */
animate-glitch      /* 故障 */
```

### SVG 动画
- 颜色循环
- 路径动画
- 透明度变化
- 旋转效果

---

## 📐 设计规范

### 尺寸规范
- **Logo**: 32px - 200px
- **图标**: 16px - 48px
- **插画**: 200px - 400px
- **装饰**: 根据容器自适应

### 圆角规范
- **卡片**: 12px
- **按钮**: 6px
- **输入框**: 8px
- **对话框**: 16px

### 间距规范
- **XS**: 4px
- **SM**: 8px
- **MD**: 16px
- **LG**: 24px
- **XL**: 32px

---

## 🔧 图标使用指南

### 基础用法
```tsx
import { IconName } from '@/components/graphics/SVGIcons';

<IconName size={24} className="text-cyber-cyan" />
```

### 带发光效果
```tsx
<IconName size={32} glow={true} />
```

### 可点击
```tsx
<IconName size={20} onClick={handleClick} className="cursor-pointer" />
```

### 自定义颜色
```tsx
<IconName size={24} color="#customColor" />
```

---

## 🎨 Logo 使用指南

### 导航栏 Logo
```tsx
<MainLogo width={150} />
```

### 页脚 Logo
```tsx
<WatermarkLogo width={200} />
```

### Favicon
```tsx
<FaviconLogo size={32} />
```

### 动画 Logo（加载页）
```tsx
<AnimatedLogo size={100} />
```

---

## 🖼️ 插画使用场景

### 404 页面
```tsx
<CyberCityIllustration width={400} />
```

### 加载页面
```tsx
<NetworkIllustration width={300} animated={true} />
```

### 博客头图
```tsx
<CodeScreenIllustration width={300} />
```

### 关于页面
```tsx
<WorkspaceIllustration width={350} />
```

---

## ✨ 特效组件应用

### 英雄区域
```tsx
<>
  <HologramEffect width={150} animated={true} />
  <DataStream width={200} animated={true} />
</>
```

### 卡片装饰
```tsx
<div className="relative">
  <CornerBracket position="top-left" />
  <CornerBracket position="bottom-right" />
  {/* 卡片内容 */}
</div>
```

### 分隔区域
```tsx
<DividerLine variant="tech" width="full" />
```

### 加载状态
```tsx
<LoadingRing size={80} />
<PulseLoader size={60} />
```

---

## 📦 图形组件索引

### 组件文件位置
```
frontend/components/graphics/
├── SVGIcons.tsx        # SVG 图标库
├── Logos.tsx          # Logo 组件
├── Illustrations.tsx   # 插画组件
├── Decorations.tsx    # 装饰组件
├── Icon.tsx           # 图标包装器
├── LogoDisplay.tsx    # Logo 展示
├── Decoration.tsx     # 装饰包装
├── PatternBackground.tsx # 图案背景
└── Illustration.tsx   # 插画包装
```

---

## 🎯 最佳实践

### 1. 性能优化
- 使用 SVG 而非图片
- 内联关键图形
- 懒加载大型插画

### 2. 可访问性
- 添加 `aria-label`
- 确保颜色对比度
- 提供文本替代

### 3. 一致性
- 使用预定义尺寸
- 遵循配色方案
- 保持动画流畅

### 4. 响应式
- 图标自适应
- 插画缩放
- 断点调整

---

## 📝 待办事项

### 新增图标
- [ ] AI/ML 相关图标
- [ ] 区块链图标
- [ ] 更多社交平台

### 新增插画
- [ ] 团队协作场景
- [ ] 数据可视化
- [ ] 移动设备场景

### 优化项
- [ ] 图标懒加载
- [ ] SVG 精简优化
- [ ] 动画性能优化

---

## 🔗 相关资源

- [项目文档](./PROJECT.md)
- [Tailwind 配置](../frontend/tailwind.config.ts)
- [全局样式](../frontend/styles/globals.css)

---

**维护者备注：**
所有图形组件均使用内联 SVG 实现，支持完全自定义颜色、尺寸和动画效果。建议优先使用预定义组件以保持设计一致性。
