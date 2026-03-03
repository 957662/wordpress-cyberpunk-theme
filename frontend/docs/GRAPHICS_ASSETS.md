# CyberPress Platform - 图形素材清单

> 📅 创建时间: 2026-03-03
> 🎨 设计团队: CyberPress AI Design Team
> 📦 版本: v3.0

## 📋 目录

1. [Logo 系统](#logo-系统)
2. [图标库](#图标库)
3. [插画库](#插画库)
4. [装饰元素](#装饰元素)
5. [背景图案](#背景图案)
6. [配色方案](#配色方案)

---

## 🎯 Logo 系统

### 可用 Logo 变体

| 组件名 | 尺寸 | 用途 | 路径 |
|--------|------|------|------|
| `MainLogo` | 200x60 | 页头、首页横幅 | `/components/graphics/Logos.tsx` |
| `SquareLogo` | 64x64 | Favicon、图标 | `/components/graphics/Logos.tsx` |
| `FaviconLogo` | 32x32 | 浏览器标签页图标 | `/components/graphics/Logos.tsx` |
| `MinimalLogo` | 100x100 | 简洁场景 | `/components/graphics/Logos.tsx` |
| `TextLogo` | 自适应宽 | 文字仅用 | `/components/graphics/Logos.tsx` |
| `WatermarkLogo` | 200x60 | 水印、背景 | `/components/graphics/Logos.tsx` |
| `AnimatedLogo` | 100x100 | 加载动画 | `/components/graphics/Logos.tsx` |

### 静态 Logo 文件

| 文件 | 尺寸 | 用途 | 路径 |
|------|------|------|------|
| `logo.svg` | 原始 | 主 Logo | `/public/logo.svg` |
| `logo-main.svg` | 原始 | 主 Logo | `/public/logo-main.svg` |
| `logo-square.svg` | 原始 | 方形 Logo | `/public/logo-square.svg` |
| `logo-icon.svg` | 原始 | 图标版 | `/public/logo-icon.svg` |
| `logo-mark.svg` | 原始 | 标志 | `/public/logo-mark.svg` |
| `logo-favicon.svg` | 32x32 | Favicon | `/public/logo-favicon.svg` |
| `favicon.ico` | 32x32 | 浏览器图标 | `/public/favicon.ico` |

### Logo 使用示例

```tsx
import { MainLogo, SquareLogo, AnimatedLogo } from '@/components/graphics/Logos';

// 页头使用
<MainLogo width={200} />

// 图标使用
<SquareLogo size={64} animated={true} />

// 加载动画
<AnimatedLogo width={100} />

// 水印使用
<WatermarkLogo width={300} opacity={0.1} />
```

---

## 🎨 图标库

### 导航图标 (Navigation Icons)

| 图标 | 组件名 | 尺寸 | 变体 |
|------|--------|------|------|
| 🏠 首页 | `HomeIcon` | 24px | cyan, purple, pink |
| 📝 博客 | `BlogIcon` | 24px | cyan, purple, pink |
| 💼 作品集 | `PortfolioIcon` | 24px | cyan, purple, pink |
| 🔍 搜索 | `SearchIcon` | 24px | cyan, purple, pink |
| ➡️ 箭头右 | `ArrowRightIcon` | 24px | cyan, purple, pink |
| ⬅️ 箭头左 | `ArrowLeftIcon` | 24px | cyan, purple, pink |
| ⬆️ 箭头上 | `ChevronUpIcon` | 24px | cyan, purple, pink |
| ⬇️ 箭头下 | `ChevronDownIcon` | 24px | cyan, purple, pink |

### 社交媒体图标 (Social Media Icons)

| 图标 | 组件名 | 尺寸 | 用途 |
|------|--------|------|------|
| 🐙 GitHub | `GitHubIcon` | 24px | 代码仓库链接 |
| 🐦 Twitter | `TwitterIcon` | 24px | 社交媒体分享 |
| 💬 Discord | `DiscordIcon` | 24px | 社区交流 |
| 📺 YouTube | `YouTubeIcon` | 24px | 视频内容 |
| 🎨 Dribbble | `DribbbleIcon` | 24px | 设计作品 |
| 💼 LinkedIn | `LinkedInIcon` | 24px | 职业社交 |
| 📧 Email | `EmailIcon` | 24px | 邮件联系 |
| 📡 RSS | `RSSIcon` | 24px | 订阅源 |

### UI 元素图标 (UI Element Icons)

| 图标 | 组件名 | 尺寸 | 用途 |
|------|--------|------|------|
| 📅 日期 | `CalendarIcon` | 20px | 文章发布日期 |
| 🏷️ 标签 | `TagIcon` | 20px | 文章标签 |
| ⭐ 收藏 | `StarIcon` | 20px | 收藏文章 |
| 👤 用户 | `UserIcon` | 20px | 用户信息 |
| ⚙️ 设置 | `SettingsIcon` | 20px | 设置页面 |
| 💻 代码 | `CodeIcon` | 20px | 代码块 |
| 💻 终端 | `TerminalIcon` | 24px | 命令行 |
| ✓ 勾选 | `CheckIcon` | 20px | 成功状态 |
| ⚠️ 警告 | `WarningIcon` | 20px | 警告提示 |
| ❌ 错误 | `ErrorIcon` | 20px | 错误提示 |
| ℹ️ 信息 | `InfoIcon` | 20px | 信息提示 |
| 🔒 锁定 | `LockIcon` | 20px | 权限控制 |
| 🔓 解锁 | `UnlockIcon` | 20px | 权限开放 |
| 👁️ 查看 | `EyeIcon` | 20px | 显示内容 |
| 👁️‍🗨️ 隐藏 | `EyeOffIcon` | 20px | 隐藏内容 |
| 🔐 安全锁 | `ShieldLockIcon` | 24px | 安全验证 |

### 操作图标 (Action Icons)

| 图标 | 组件名 | 尺寸 | 用途 |
|------|--------|------|------|
| ☰ 菜单 | `MenuIcon` | 24px | 移动端菜单 |
| ✕ 关闭 | `CloseIcon` | 24px | 关闭弹窗 |
| ⏳ 加载 | `LoadingIcon` | 24px | 加载状态 |
| 🔗 外链 | `ExternalLinkIcon` | 20px | 外部链接 |
| ❤️ 点赞 | `HeartIcon` | 20px | 文章点赞 |
| 💬 评论 | `CommentIcon` | 20px | 文章评论 |
| 🔗 分享 | `ShareIcon` | 20px | 分享文章 |
| 📋 复制 | `CopyIcon` | 20px | 复制内容 |
| 🔍 筛选 | `FilterIcon` | 20px | 内容筛选 |
| 🔀 排序 | `SortIcon` | 20px | 内容排序 |
| 📥 下载 | `DownloadIcon` | 20px | 下载文件 |
| 📤 上传 | `UploadIcon` | 20px | 上传文件 |
| ✏️ 编辑 | `EditIcon` | 20px | 编辑内容 |
| 🗑️ 删除 | `TrashIcon` | 20px | 删除内容 |
| 💾 保存 | `SaveIcon` | 20px | 保存更改 |
| 🔄 刷新 | `RefreshIcon` | 20px | 刷新内容 |
| 🔖 书签 | `BookmarkIcon` | 20px | 添加书签 |

### 赛博科技图标 (Cyber Tech Icons)

| 图标 | 组件名 | 尺寸 | 动画 |
|------|--------|------|------|
| 🤖 赛博 | `CyberIcon` | 32px | 可选 |
| ⚡ CPU | `CpuIcon` | 32px | 可选 |
| 💾 数据库 | `DatabaseIcon` | 24px | 可选 |
| 🌐 网络 | `NetworkIcon` | 32px | 可选 |
| 🔮 全息 | `HologramIcon` | 32px | 可选 |
| 🎯 芯片 | `ChipIcon` | 32px | 可选 |
| 📁 文件 | `FileIcon` | 20px | - |
| 📦 压缩包 | `ArchiveIcon` | 20px | - |
| 📡 在线 | `OnlineIcon` | 16px | 脉冲 |
| 💤 离线 | `OfflineIcon` | 16px | - |
| 🔄 同步 | `SyncIcon` | 20px | 旋转 |
| 🌍 地球 | `GlobeIcon` | 24px | - |
| ⚡ 闪电 | `ZapIcon` | 20px | - |

### 状态图标 (Status Icons)

| 图标 | 组件名 | 尺寸 | 颜色 |
|------|--------|------|------|
| 🟢 在线 | `OnlineIcon` | 12px | green |
| 🔴 离线 | `OfflineIcon` | 12px | gray |
| 🟡 同步中 | `SyncIcon` | 16px | yellow |
| 🔒 锁定 | `LockIcon` | 16px | cyan |
| 🔓 解锁 | `UnlockIcon` | 16px | purple |

### 图标颜色变体

```tsx
// 所有图标支持以下颜色变体
variant="cyan"    // 霓虹青 #00f0ff (默认)
variant="purple"  // 赛博紫 #9d00ff
variant="pink"    // 激光粉 #ff0080
variant="yellow"  // 电压黄 #f0ff00
variant="green"   // 矩阵绿 #00ff88
```

### 图标使用示例

```tsx
import { SearchIcon, GitHubIcon, CpuIcon } from '@/components/icons';

// 基础用法
<SearchIcon size={24} />

// 颜色变体
<GitHubIcon size={32} variant="purple" />

// 带动画
<CpuIcon size={48} variant="cyan" animated={true} />

// 自定义样式
<SearchIcon
  size={24}
  variant="cyan"
  className="hover:text-cyber-purple transition"
/>
```

---

## 🖼️ 插画库

### 可用插画组件

| 插画 | 组件名 | 尺寸 | 动画 | 用途 |
|------|--------|------|------|------|
| 🌃 赛博城市 | `CyberCityIllustration` | 400x300 | 可选 | 首页背景 |
| 💻 代码屏幕 | `CodeScreenIllustration` | 300x250 | 固定 | 技术文章 |
| 🌐 网络节点 | `NetworkIllustration` | 300x300 | 默认 | 技术架构 |
| 🖥️ 服务器 | `ServerRackIllustration` | 200x300 | 默认 | 基础设施 |
| 📡 电路板 | `CircuitBoardIllustration` | 300x300 | 默认 | 硬件相关 |
| 🖥️ 工作空间 | `WorkspaceIllustration` | 350x250 | 固定 | 开发环境 |

### 插画使用示例

```tsx
import { CyberCityIllustration, CodeScreenIllustration } from '@/components/graphics/Illustrations';

// 带动画的城市场景
<CyberCityIllustration width={400} animated={true} />

// 静态代码屏幕
<CodeScreenIllustration width={300} />

// 自定义颜色
<NetworkIllustration width={300} color="#00f0ff" />
```

### 静态插画文件

| 文件 | 路径 |
|------|------|
| `cyber-city.svg` | `/public/illustrations/` |
| `code-screen.svg` | `/public/illustrations/` |
| `network-nodes.svg` | `/public/illustrations/` |
| `server-rack.svg` | `/public/illustrations/` |
| `circuit-board.svg` | `/public/illustrations/` |
| `developer-workspace.svg` | `/public/illustrations/` |
| `network-globe.svg` | `/public/illustrations/` |

---

## 🎭 装饰元素

### 可用装饰组件

| 装饰 | 组件名 | 用途 |
|------|--------|------|
| 📐 角标 | `CornerBracket` | 卡片装饰 |
| ➖ 分隔线 | `DividerLine` | 内容分隔 |
| ⭕ 加载环 | `LoaderRing` | 加载状态 |

### 静态装饰文件

| 文件 | 路径 |
|------|------|
| `corner-bracket.svg` | `/public/decorations/` |
| `divider-line.svg` | `/public/decorations/` |
| `loader-ring.svg` | `/public/decorations/` |

---

## 🌐 背景图案

### 可用背景文件

| 图案 | 路径 | 用途 |
|------|------|------|
| 网格 | `/public/patterns/grid.svg` | 科技感背景 |
| 电路 | `/public/patterns/circuit.svg` | 电路板效果 |
| 扫描线 | `/public/patterns/scanlines.svg` | 复古效果 |
| 噪点 | `/public/patterns/noise.svg` | 纹理叠加 |
| 六边形 | `/public/patterns/hexagon.svg` | 几何图案 |
| 矩阵 | `/public/patterns/matrix.svg` | 代码雨效果 |
| 全息 | `/public/patterns/holographic.svg` | 全息效果 |
| 六边形网格 | `/public/patterns/hex-grid.svg` | 蜂窝效果 |

### 背景文件

| 文件 | 路径 | 用途 |
|------|------|------|
| 首页背景 | `/public/backgrounds/hero-bg.svg` | 首页横幅 |
| 卡片背景 | `/public/backgrounds/card-bg.svg` | 卡片底纹 |
| 加载背景 | `/public/backgrounds/loading-bg.svg` | 加载页 |
| 404背景 | `/public/backgrounds/404-bg.svg` | 错误页 |

### 背景使用示例

```css
/* CSS 中使用 */
.hero-section {
  background-image: url('/public/patterns/grid.svg');
  background-blend-mode: overlay;
}

/* 或使用 Tailwind */
<div className="bg-[url('/public/patterns/circuit.svg')]">
  内容
</div>
```

---

## 🎨 配色方案

### 核心颜色

```
深空黑 (Deep Space Black)
HEX: #0a0a0f
RGB: rgb(10, 10, 15)
用途: 主背景

霓虹青 (Neon Cyan)
HEX: #00f0ff
RGB: rgb(0, 240, 255)
用途: 主强调色

赛博紫 (Cyber Purple)
HEX: #9d00ff
RGB: rgb(157, 0, 255)
用途: 次强调色

激光粉 (Laser Pink)
HEX: #ff0080
RGB: rgb(255, 0, 128)
用途: 强调色

电压黄 (Voltage Yellow)
HEX: #f0ff00
RGB: rgb(240, 255, 0)
用途: 高亮色

矩阵绿 (Matrix Green)
HEX: #00ff88
RGB: rgb(0, 255, 136)
用途: 成功状态
```

### 渐变方案

```css
/* 霓虹渐变 */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 热力渐变 */
background: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%);

/* 赛博渐变 */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
```

---

## 📊 统计信息

### 图形资源总览

- **Logo 变体**: 7 个组件 + 7 个静态文件
- **图标总数**: 80+ 个组件
- **插画总数**: 6 个组件 + 7 个静态文件
- **装饰元素**: 3 个组件 + 3 个静态文件
- **背景图案**: 8 个图案文件
- **背景文件**: 4 个背景文件

### 文件大小

- **SVG 文件总大小**: ~500 KB
- **平均单个 SVG**: ~5 KB
- **优化后**: 所有 SVG 已优化，无冗余代码

---

## 🔧 使用指南

### 在 React 组件中使用

```tsx
// 导入 Logo
import { MainLogo, SquareLogo } from '@/components/graphics/Logos';

// 导入图标
import { SearchIcon, GitHubIcon, CpuIcon } from '@/components/icons';

// 导入插画
import { CyberCityIllustration, CodeScreenIllustration } from '@/components/graphics/Illustrations';

// 使用
function MyComponent() {
  return (
    <div>
      <MainLogo width={200} />
      <SearchIcon size={24} variant="cyan" />
      <CyberCityIllustration width={400} animated={true} />
    </div>
  );
}
```

### 在 CSS 中使用

```css
/* 使用背景图案 */
.my-section {
  background-image: url('/patterns/grid.svg');
  background-size: cover;
}

/* 使用发光效果 */
.my-text {
  color: #00f0ff;
  text-shadow: 0 0 10px #00f0ff, 0 0 20px #00f0ff;
}
```

---

## 📝 更新日志

### v3.0 (2026-03-03)
- ✅ 更新完整图形素材清单
- ✅ 添加所有组件使用示例
- ✅ 整理静态文件路径
- ✅ 补充配色方案说明

### v2.0 (2026-03-02)
- ✅ 新增 20+ 赛博科技图标
- ✅ 新增 6 个插画组件
- ✅ 优化 SVG 文件结构
- ✅ 添加动画支持

### v1.0 (2026-03-01)
- ✅ 初始版本发布
- ✅ 基础 Logo 系统
- ✅ 核心导航图标
- ✅ 基础插画库

---

## 🔗 相关文档

- [图标使用指南](./ICON_USAGE_GUIDE.md)
- [配色参考](../public/COLOR_PALETTE.md)
- [组件文档](../components/graphics/README.md)

---

**创建时间**: 2026-03-03
**设计团队**: CyberPress AI Design Team
**项目**: CyberPress Platform
**主题**: Cyberpunk Aesthetics
