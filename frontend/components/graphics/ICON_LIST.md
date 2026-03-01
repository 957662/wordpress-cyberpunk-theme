# CyberPress 图标清单

本文档列出了所有可用的 SVG 图标及其使用方法。

## 导入方式

```tsx
// 导入所有图标
import {
  HomeIcon,
  GitHubIcon,
  SearchIcon,
  // ... 其他图标
} from '@/components/graphics/SVGIcons';

// 导入 Logo 组件
import {
  MainLogo,
  SquareLogo,
  FaviconLogo
} from '@/components/graphics/Logos';

// 导入装饰元素
import {
  CornerBracket,
  DividerLine,
  LoadingRing
} from '@/components/graphics/Decorations';

// 导入插画
import {
  CyberCityIllustration,
  CodeScreenIllustration
} from '@/components/graphics/Illustrations';
```

## 图标组件

### 导航图标

| 图标 | 组件名 | 描述 |
|------|--------|------|
| 🏠 | `HomeIcon` | 首页图标 - 霓虹六边形房子 |
| 📝 | `BlogIcon` | 博客图标 - 数字文档 |
| 🖼️ | `PortfolioIcon` | 作品集图标 - 网格画廊 |
| 👤 | `AboutIcon` | 关于图标 - 用户信息 |
| 🔍 | `SearchIcon` | 搜索图标 - 放大镜 |
| ☰ | `MenuIcon` | 菜单图标 - 汉堡菜单 |
| ✕ | `CloseIcon` | 关闭图标 - X |

### 社交媒体图标

| 图标 | 组件名 | 描述 |
|------|--------|------|
| 🐙 | `GitHubIcon` | GitHub 图标 |
| ✖️ | `TwitterIcon` | Twitter/X 图标 |
| 💼 | `LinkedInIcon` | LinkedIn 图标 |
| ✉️ | `EmailIcon` | Email 图标 |
| 📡 | `RSSIcon` | RSS 图标 |

### UI 图标

| 图标 | 组件名 | 描述 |
|------|--------|------|
| 👤 | `UserIcon` | 用户图标 |
| ⚙️ | `SettingsIcon` | 设置图标 |
| 🔔 | `BellIcon` | 通知铃铛图标 |
| 💬 | `CommentIcon` | 评论图标 |

### 操作图标

| 图标 | 组件名 | 描述 |
|------|--------|------|
| ✏️ | `EditIcon` | 编辑图标 |
| 🗑️ | `DeleteIcon` | 删除图标 |
| 💾 | `SaveIcon` | 保存图标 |
| 📋 | `CopyIcon` | 复制图标 |
| ⬇️ | `DownloadIcon` | 下载图标 |
| ⬆️ | `UploadIcon` | 上传图标 |

### 状态图标

| 图标 | 组件名 | 描述 |
|------|--------|------|
| ✓ | `CheckIcon` | 检查图标 |
| ⚠️ | `WarningIcon` | 警告图标 |
| ✕ | `ErrorIcon` | 错误/叉号图标 |
| ℹ️ | `InfoIcon` | 信息图标 |
| 🔒 | `LockIcon` | 锁定图标 |
| 🔓 | `UnlockIcon` | 解锁图标 |

### 主题图标

| 图标 | 组件名 | 描述 |
|------|--------|------|
| ☀️ | `SunIcon` | 太阳图标 - 亮色主题 |
| 🌙 | `MoonIcon` | 月亮图标 - 暗色主题 |

### 媒体图标

| 图标 | 组件名 | 描述 |
|------|--------|------|
| 🖼️ | `ImageIcon` | 图片图标 |
| 🎥 | `VideoIcon` | 视频图标 |
| 💻 | `CodeIcon` | 代码图标 |
| 📁 | `FolderIcon` | 文件夹图标 |
| 🏷️ | `TagIcon` | 标签图标 |
| 📅 | `CalendarIcon` | 日历图标 |
| 🕐 | `ClockIcon` | 时钟图标 |

### 开发图标

| 图标 | 组件名 | 描述 |
|------|--------|------|
| ⌨️ | `TerminalIcon` | 终端图标 |
| 🗄️ | `DatabaseIcon` | 数据库图标 |
| 🖥️ | `ServerIcon` | 服务器图标 |
| ☁️ | `CloudIcon` | 云图标 |

### 其他图标

| 图标 | 组件名 | 描述 |
|------|--------|------|
| 🔗 | `ExternalLinkIcon` | 外部链接图标 |
| ⭐ | `StarIcon` | 星标图标 |
| ❤️ | `HeartIcon` | 心形图标 |
| 📤 | `ShareIcon` | 分享图标 |
| 🔍 | `FilterIcon` | 过滤器图标 |
| 📊 | `SortIcon` | 排序图标 |
| ⬆️ | `ArrowUpIcon` | 箭头向上 |
| ⬇️ | `ArrowDownIcon` | 箭头向下 |
| ⬅️ | `ArrowLeftIcon` | 箭头向左 |
| ➡️ | `ArrowRightIcon` | 箭头向右 |
| 🔄 | `RefreshIcon` | 刷新图标 |

## Logo 组件

| 组件名 | 描述 | 默认尺寸 |
|--------|------|----------|
| `MainLogo` | 主 Logo - 横向带文字 | 200x60 |
| `SquareLogo` | 方形 Logo - 仅图标 | 64x64 |
| `FaviconLogo` | Favicon Logo - 小图标 | 32x32 |
| `MinimalLogo` | 极简 Logo - 单色版本 | 100x100 |
| `TextLogo` | 文字 Logo - 仅文字 | 自定义宽度 |
| `WatermarkLogo` | 水印 Logo - 半透明 | 200x60 |
| `AnimatedLogo` | 动画 Logo - 带脉冲效果 | 100x100 |

## 装饰元素组件

| 组件名 | 描述 | 用途 |
|--------|------|------|
| `CornerBracket` | 角标装饰 | 科技感角落标记 |
| `DividerLine` | 分割线装饰 | 内容分隔 |
| `LoadingRing` | 加载环 | 页面加载状态 |
| `PulseLoader` | 脉冲加载器 | 加载动画 |
| `HexLoader` | 六边形加载器 | 加载动画 |
| `PatternBackground` | 图案背景 | 背景装饰 |
| `TechBorder` | 科技感边框 | 卡片/容器边框 |
| `Scanlines` | 扫描线效果 | CRT 屏幕效果 |
| `GlitchOverlay` | 故障效果装饰 | 故障艺术效果 |

## 插画组件

| 组件名 | 描述 | 默认尺寸 |
|--------|------|----------|
| `CyberCityIllustration` | 赛博城市插画 | 400x300 |
| `CodeScreenIllustration` | 代码屏幕插画 | 300x250 |
| `NetworkIllustration` | 网络节点插画 | 300x300 |
| `ServerRackIllustration` | 服务器机架插画 | 200x300 |
| `CircuitBoardIllustration` | 电路板插画 | 300x300 |
| `WorkspaceIllustration` | 开发工作空间插画 | 350x250 |

## 使用示例

### 基本使用

```tsx
import { HomeIcon, GitHubIcon, SearchIcon } from '@/components/graphics/SVGIcons';

function MyComponent() {
  return (
    <div>
      {/* 默认大小 */}
      <HomeIcon />

      {/* 自定义大小 */}
      <GitHubIcon size={32} />

      {/* 自定义颜色 */}
      <SearchIcon size={24} color="#00f0ff" />

      {/* 发光效果 */}
      <HomeIcon size={24} glow />

      {/* 点击事件 */}
      <GitHubIcon size={24} onClick={() => console.log('clicked')} />
    </div>
  );
}
```

### Logo 使用

```tsx
import { MainLogo, SquareLogo, AnimatedLogo } from '@/components/graphics/Logos';

function Header() {
  return (
    <div>
      {/* 主 Logo */}
      <MainLogo width={200} />

      {/* 方形 Logo */}
      <SquareLogo size={64} />

      {/* 动画 Logo */}
      <AnimatedLogo size={100} />

      {/* 点击跳转 */}
      <MainLogo width={150} onClick={() => router.push('/')} />
    </div>
  );
}
```

### 装饰元素使用

```tsx
import { CornerBracket, DividerLine, TechBorder } from '@/components/graphics/Decorations';

function Card() {
  return (
    <div className="relative">
      {/* 角标装饰 */}
      <CornerBracket position="top-left" />
      <CornerBracket position="bottom-right" />

      {/* 分割线 */}
      <DividerLine variant="tech" />

      {/* 科技感边框 */}
      <TechBorder rounded glow />
    </div>
  );
}
```

### 插画使用

```tsx
import { CyberCityIllustration, CodeScreenIllustration } from '@/components/graphics/Illustrations';

function LandingPage() {
  return (
    <div>
      {/* 城市插画 */}
      <CyberCityIllustration width={600} animated />

      {/* 代码屏幕 */}
      <CodeScreenIllustration width={400} />
    </div>
  );
}
```

## 颜色主题

所有图标和图形都支持赛博朋克主题配色：

- `#00f0ff` - 霓虹青 (主要强调色)
- `#9d00ff` - 赛博紫 (次要强调色)
- `#ff0080` - 激光粉 (点缀色)
- `#00ff88` - 赛博绿 (成功状态)
- `#f0ff00` - 电压黄 (警告状态)
- `#0a0a0f` - 深空黑 (背景色)
- `#1a1a2e` - 深空蓝 (次背景色)

## 动画效果

部分组件支持动画效果：

- `animated` - 启用发光/渐变动画
- `glow` - 启用发光效果
- 内置 SMIL 动画 (部分插画)

## TypeScript 类型支持

所有组件都有完整的 TypeScript 类型定义：

```tsx
import type { SVGIconProps, LogoProps } from '@/components/graphics';

// SVGIconProps - 所有图标的基础属性
// LogoProps - Logo 组件属性
```

## 性能优化建议

1. **图标复用**: 图标组件是内联 SVG，可以重复使用而不会增加网络请求
2. **懒加载插画**: 大型插画组件建议使用懒加载
3. **动画控制**: 使用 `animated` 属性按需启用动画
4. **颜色自定义**: 使用 CSS 自定义属性统一管理颜色

## 贡献

添加新图标时，请遵循以下规范：

1. 使用 `currentColor` 以支持颜色继承
2. 保持 `viewBox="0 0 24 24"` (图标)
3. 添加完整的 TypeScript 类型
4. 保持赛博朋克风格一致
5. 添加适当的动画效果

## 更新日志

### v1.0.0 (2026-03-02)
- 初始版本发布
- 50+ SVG 图标
- 7 种 Logo 变体
- 9 种装饰元素
- 6 种插画场景
