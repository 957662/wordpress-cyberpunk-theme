# CyberPress 图形素材快速参考

> 🎨 **最后更新**: 2026-03-03
> 📦 **组件总数**: 70+
> 🎭 **风格**: 赛博朋克

---

## 🚀 快速开始

### 1. 导入组件

```tsx
// 方式一: 从主入口导入 (推荐)
import {
  HomeIcon,
  MainLogo,
  CornerBracket,
  CyberCityIllustration
} from '@/components/graphics';

// 方式二: 从具体文件导入
import { HomeIcon } from '@/components/graphics/SVGIcons';
import { MainLogo } from '@/components/graphics/Logos';
```

### 2. 基本使用

```tsx
// 图标
<HomeIcon size={24} />
<GitHubIcon size={20} glow />
<SearchIcon size={32} color="#00f0ff" />

// Logo
<MainLogo width={200} />
<SquareLogo size={64} animated />
<AnimatedLogo size={100} />

// 装饰元素
<CornerBracket position="top-left" />
<DividerLine variant="tech" />
<LoadingRing size={64} />

// 插画
<CyberCityIllustration width={400} animated />
```

---

## 📋 组件清单

### 🎯 图标 (50+)

| 分类 | 图标 | 组件名 |
|------|------|--------|
| **导航** | 🏠 首页 | `HomeIcon` |
| | 📝 博客 | `BlogIcon` |
| | 🖼️ 作品集 | `PortfolioIcon` |
| | 👤 关于 | `AboutIcon` |
| | 🔍 搜索 | `SearchIcon` |
| | ☰ 菜单 | `MenuIcon` |
| | ✕ 关闭 | `CloseIcon` |
| **社交** | 🐙 GitHub | `GitHubIcon` |
| | ✖️ Twitter | `TwitterIcon` |
| | 💼 LinkedIn | `LinkedInIcon` |
| | ✉️ Email | `EmailIcon` |
| | 📡 RSS | `RSSIcon` |
| **UI** | 👤 用户 | `UserIcon` |
| | ⚙️ 设置 | `SettingsIcon` |
| | 🔔 通知 | `BellIcon` |
| | 💬 评论 | `CommentIcon` |
| **操作** | ✏️ 编辑 | `EditIcon` |
| | 🗑️ 删除 | `DeleteIcon` |
| | 💾 保存 | `SaveIcon` |
| | 📋 复制 | `CopyIcon` |
| | ⬇️ 下载 | `DownloadIcon` |
| | ⬆️ 上传 | `UploadIcon` |
| **状态** | ✓ 成功 | `CheckIcon` |
| | ⚠️ 警告 | `WarningIcon` |
| | ✕ 错误 | `ErrorIcon` |
| | ℹ️ 信息 | `InfoIcon` |
| | 🔒 锁定 | `LockIcon` |
| | 🔓 解锁 | `UnlockIcon` |
| **主题** | ☀️ 太阳 | `SunIcon` |
| | 🌙 月亮 | `MoonIcon` |
| **媒体** | 🖼️ 图片 | `ImageIcon` |
| | 🎥 视频 | `VideoIcon` |
| | 💻 代码 | `CodeIcon` |
| | 📁 文件夹 | `FolderIcon` |
| | 🏷️ 标签 | `TagIcon` |
| | 📅 日历 | `CalendarIcon` |
| | 🕐 时钟 | `ClockIcon` |
| **开发** | ⌨️ 终端 | `TerminalIcon` |
| | 🗄️ 数据库 | `DatabaseIcon` |
| | 🖥️ 服务器 | `ServerIcon` |
| | ☁️ 云 | `CloudIcon` |
| **其他** | 🔗 外部链接 | `ExternalLinkIcon` |
| | ⭐ 星标 | `StarIcon` |
| | ❤️ 喜欢 | `HeartIcon` |
| | 📤 分享 | `ShareIcon` |
| | 🔍 筛选 | `FilterIcon` |
| | 📊 排序 | `SortIcon` |
| | ⬆️ 上箭头 | `ArrowUpIcon` |
| | ⬇️ 下箭头 | `ArrowDownIcon` |
| | ⬅️ 左箭头 | `ArrowLeftIcon` |
| | ➡️ 右箭头 | `ArrowRightIcon` |
| | 🔄 刷新 | `RefreshIcon` |

### 🎨 Logo (7 种)

| Logo | 组件名 | 用途 |
|------|--------|------|
| **主 Logo** | `MainLogo` | 页眉、导航 (200x60) |
| **方形 Logo** | `SquareLogo` | 卡片、头像 (64x64) |
| **Favicon** | `FaviconLogo` | 浏览器标签 (32x32) |
| **极简 Logo** | `MinimalLogo` | 单色场景 (自定义) |
| **文字 Logo** | `TextLogo` | 仅文字 (自定义宽度) |
| **水印 Logo** | `WatermarkLogo` | 页脚水印 (半透明) |
| **动画 Logo** | `AnimatedLogo` | 脉冲动画 (100x100) |

### 🖼️ 装饰元素 (9 种)

| 类型 | 组件名 | 变体 |
|------|--------|------|
| **角标** | `CornerBracket` | 4 个位置 |
| **分割线** | `DividerLine` | simple, double, dashed, tech |
| **加载环** | `LoadingRing` | 可自定义尺寸 |
| **脉冲加载** | `PulseLoader` | 呼吸动画 |
| **六边形加载** | `HexLoader` | 旋转动画 |
| **图案背景** | `PatternBackground` | grid, dots, hexagons, circuit |
| **科技边框** | `TechBorder` | 可选圆角/发光 |
| **扫描线** | `Scanlines` | CRT 效果 |
| **故障效果** | `GlitchOverlay` | Glitch 动画 |

### 🎭 插画 (6 种)

| 插画 | 组件名 | 尺寸 | 动画 |
|------|--------|------|------|
| **赛博城市** | `CyberCityIllustration` | 400x300 | ✓ |
| **代码屏幕** | `CodeScreenIllustration` | 300x250 | - |
| **网络节点** | `NetworkIllustration` | 300x300 | ✓ |
| **服务器机架** | `ServerRackIllustration` | 200x300 | ✓ |
| **电路板** | `CircuitBoardIllustration` | 300x300 | ✓ |
| **工作空间** | `WorkspaceIllustration` | 350x250 | - |

---

## 🎨 配色方案

### 主色调

```css
--cyber-dark: #0a0a0f      /* 深空黑 - 背景 */
--cyber-cyan: #00f0ff      /* 霓虹青 - 主强调色 */
--cyber-purple: #9d00ff    /* 赛博紫 - 次强调色 */
--cyber-pink: #ff0080      /* 激光粉 - 点缀色 */
--cyber-green: #00ff88     /* 赛博绿 - 成功 */
--cyber-yellow: #f0ff00    /* 电压黄 - 警告 */
--cyber-orange: #ff6600    /* 等离子橙 - 注意 */
```

### 渐变

```css
/* 主渐变 */
gradient-primary: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)

/* 次渐变 */
gradient-secondary: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)

/* 赛博渐变 */
gradient-cyber: linear-gradient(45deg, #00f0ff, #9d00ff, #ff0080, #f0ff00)
```

### Tailwind 类名

```tsx
className="text-cyber-cyan"      // 霓虹青文字
className="bg-cyber-dark"        // 深空黑背景
className="border-cyber-purple"  // 赛博紫边框
```

---

## 💡 常用模式

### 导航栏

```tsx
<nav className="flex items-center justify-between p-4 bg-cyber-dark">
  <MainLogo width={150} />
  <div className="flex items-center gap-6">
    <a href="/" className="flex items-center gap-2 text-cyber-cyan">
      <HomeIcon size={20} />
      <span>首页</span>
    </a>
    <SearchIcon size={20} />
    <GitHubIcon size={20} />
  </div>
</nav>
```

### 卡片组件

```tsx
<div className="relative p-6 bg-cyber-card rounded-lg">
  <CornerBracket position="top-left" />
  <CodeIcon size={32} color="#00f0ff" />
  <h3 className="text-xl font-bold text-cyber-cyan">项目标题</h3>
  <p className="text-gray-400">项目描述...</p>
</div>
```

### 加载状态

```tsx
<div className="flex items-center justify-center">
  <LoadingRing size={64} />
  <p className="ml-4 text-gray-400">加载中...</p>
</div>
```

### 状态提示

```tsx
<div className="flex items-center gap-3 p-3 bg-cyber-green/10 border border-cyber-green/30 rounded">
  <CheckIcon size={20} color="#00ff88" />
  <span className="text-cyber-green">操作成功</span>
</div>
```

### 社交链接

```tsx
<div className="flex items-center gap-4">
  <a href="https://github.com" className="p-3 bg-cyber-card rounded hover:bg-cyber-muted transition">
    <GitHubIcon size={24} className="text-gray-400 hover:text-cyber-cyan" />
  </a>
  <TwitterIcon size={24} />
  <EmailIcon size={24} />
</div>
```

---

## 🔧 API 参考

### SVGIconProps

```tsx
interface SVGIconProps {
  size?: number;        // 图标尺寸 (默认: 24)
  className?: string;   // CSS 类名
  glow?: boolean;       // 发光效果 (默认: false)
  color?: string;       // 自定义颜色
  onClick?: () => void; // 点击事件
}
```

### LogoProps

```tsx
interface LogoProps {
  width?: number;       // 宽度
  height?: number;      // 高度 (可选)
  className?: string;   // CSS 类名
  animated?: boolean;   // 启用动画
  onClick?: () => void; // 点击事件
  color?: string;       // 自定义颜色
}
```

### DecorationProps

```tsx
interface DecorationProps {
  className?: string;   // CSS 类名
  color?: string;       // 自定义颜色
}
```

---

## 📊 使用统计

- **图标总数**: 50+
- **Logo 变体**: 7
- **装饰元素**: 9
- **插画场景**: 6
- **颜色主题**: 7 种
- **支持动画**: 15+
- **文件大小**: 每个组件 ~1-5KB (内联 SVG)

---

## 🌐 在线预览

访问 `/graphics-showcase` 查看完整的图形素材展示页面，包括：

- ✅ 所有图标的实时预览
- ✅ 尺寸和效果调节
- ✅ Logo 变体展示
- ✅ 装饰元素演示
- ✅ 插画组件预览
- ✅ 使用代码示例

---

## 📚 相关文档

- [图标清单](./ICON_LIST.md) - 详细的图标列表
- [配色参考](./COLOR_REFERENCE.md) - 完整设计规范
- [使用示例](./EXAMPLES.tsx) - 代码示例
- [README](./README.md) - 组件库说明

---

## 🤝 贡献

添加新图标时，请遵循：

1. 使用 `currentColor` 支持颜色继承
2. 保持 `viewBox="0 0 24 24"` (图标)
3. 添加 TypeScript 类型
4. 保持赛博朋克风格一致
5. 添加适当的动画效果

---

**Built with ❤️ by CyberPress Team**
