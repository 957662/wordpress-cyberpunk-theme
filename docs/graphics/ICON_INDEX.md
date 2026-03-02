# CyberPress 图标清单

> 完整的赛博朋克风格图标库索引

## 📚 目录

- [AI/科技图标](#ai科技图标)
- [导航图标](#导航图标)
- [功能图标](#功能图标)
- [社交图标](#社交图标)
- [媒体图标](#媒体图标)
- [文件图标](#文件图标)
- [状态图标](#状态图标)
- [Logo组件](#logo组件)
- [装饰元素](#装饰元素)
- [插画组件](#插画组件)

---

## 🤖 AI/科技图标

### NeuralIcon
**用途**: 神经网络、AI功能、机器学习

```tsx
import { NeuralIcon } from '@/components/graphics/CyberIcons';

<NeuralIcon size={32} glow />
```

**变体**:
- `size`: 16-128px
- `glow`: 发光效果
- `animated`: 脉冲动画

### QuantumIcon
**用途**: 量子计算、高级算法、核心技术

```tsx
import { QuantumIcon } from '@/components/graphics/CyberIcons';

<QuantumIcon size={32} glow animated />
```

### PlasmaIcon
**用途**: 能量系统、等离子技术、动力源

### DataFlowIcon
**用途**: 数据传输、API调用、信息流

### ChipIcon
**用途**: 处理器、硬件、嵌入式系统

### CodeIcon
**用途**: 代码编辑、开发、编程

### TerminalIcon
**用途**: 命令行、终端、控制台

### NeuralNetworkIcon
**用途**: 深度学习、神经网络可视化

```tsx
import { NeuralNetworkIcon } from '@/components/graphics/CyberIcons';

<NeuralNetworkIcon size={100} glow />
```

### QuantumCoreIcon
**用途**: 量子计算核心、高级处理

---

## 🧭 导航图标

### HomeIcon
**用途**: 首页、主页导航

### MenuIcon
**用途**: 菜单、导航栏切换

### CloseIcon
**用途**: 关闭、取消、返回

### ArrowUpIcon / ArrowDownIcon / ArrowLeftIcon / ArrowRightIcon
**用途**: 方向指示、翻页、导航

### ExternalLinkIcon
**用途**: 外部链接、新窗口打开

---

## ⚙️ 功能图标

### SearchIcon
**用途**: 搜索、查找、筛选

```tsx
import { SearchIcon } from '@/components/graphics/CyberIcons';

<SearchIcon size={24} className="text-cyber-cyan" />
```

### SettingsIcon
**用途**: 设置、配置、选项

### UserIcon
**用途**: 用户、个人资料、账户

### LockIcon
**用途**: 安全、加密、权限

### EditIcon
**用途**: 编辑、修改、更新

### CopyIcon
**用途**: 复制、克隆

### PasteIcon
**用途**: 粘贴、导入

### TrashIcon
**用途**: 删除、移除

### CheckIcon
**用途**: 确认、完成、选中

### PlusIcon / MinusIcon
**用途**: 添加、移除、展开/收起

### DownloadIcon / UploadIcon
**用途**: 下载、上传、导入/导出

### RefreshIcon
**用途**: 刷新、同步、更新

---

## 🌐 社交图标

### GitHubIcon
**用途**: GitHub链接、代码仓库

```tsx
import { GitHubIcon } from '@/components/graphics/CyberIcons';

<GitHubIcon size={24} glow />
```

### TwitterIcon
**用途**: Twitter/X 分享

### LinkedInIcon
**用途**: LinkedIn 职业社交

### EmailIcon
**用途**: 邮件联系、订阅

### RSSIcon
**用途**: RSS订阅、内容聚合

---

## 🎨 媒体图标

### ImageIcon
**用途**: 图片、相册、媒体库

### VideoIcon
**用途**: 视频、播放器

### MusicIcon
**用途**: 音乐、音频、播放列表

### MicIcon
**用途**: 麦克风、语音输入、录音

---

## 📁 文件图标

### FileIcon
**用途**: 文件、文档

### FolderIcon
**用途**: 文件夹、目录

### DocumentIcon
**用途**: 文档、内容、文章

---

## 💾 状态图标

### SuccessIcon
**用途**: 成功、完成、确认

### ErrorIcon
**用途**: 错误、失败、警告

### WarningIcon
**用途**: 警告、注意、提示

### InfoIcon
**用途**: 信息、帮助、说明

### LoadingRing / PulseLoader / HexLoader
**用途**: 加载中、处理中

---

## 🏷️ Logo组件

### MainLogo
**用途**: 主Logo（带文字）

```tsx
import { MainLogo } from '@/components/graphics/Logos';

<MainLogo width={200} animated />
```

### SquareLogo
**用途**: 方形Logo（仅图标）

```tsx
import { SquareLogo } from '@/components/graphics/Logos';

<SquareLogo size={64} glow />
```

### FaviconLogo
**用途**: 网站图标、小尺寸Logo

### MinimalLogo
**用途**: 极简Logo、单色版本

### TextLogo
**用途**: 文字Logo、品牌名

### WatermarkLogo
**用途**: 水印、背景装饰

### AnimatedLogo
**用途**: 动画Logo、脉冲效果

---

## ✨ 装饰元素

### CornerBracket
**用途**: 角落装饰、科技感边框

```tsx
import { CornerBracket } from '@/components/graphics/Decorations';

<CornerBracket position="top-left" size={100} />
```

**位置选项**:
- `top-left` / `top-right`
- `bottom-left` / `bottom-right`

### DividerLine
**用途**: 内容分割、章节分隔

```tsx
import { DividerLine } from '@/components/graphics/Decorations';

<DividerLine variant="tech" width="full" />
```

**变体**:
- `simple` - 简单线条
- `double` - 双线
- `dashed` - 虚线
- `tech` - 科技风格（推荐）

### PatternBackground
**用途**: 背景图案、纹理

```tsx
import { PatternBackground } from '@/components/graphics/Decorations';

<PatternBackground variant="grid" opacity={0.1} />
```

**图案类型**:
- `grid` - 网格
- `dots` - 点阵
- `hexagons` - 六边形
- `circuit` - 电路

### TechBorder
**用途**: 科技感边框、容器装饰

### Scanlines
**用途**: 扫描线效果、复古显示

### GlitchOverlay
**用途**: 故障效果、数字干扰

---

## 🎭 插画组件

### CyberCityIllustration
**用途**: 赛博城市背景、首页hero

```tsx
import { CyberCityIllustration } from '@/components/graphics/Illustrations';

<CyberCityIllustration width={400} animated />
```

### CodeScreenIllustration
**用途**: 开发场景、代码展示

### NetworkIllustration
**用途**: 网络拓扑、连接可视化

### ServerRackIllustration
**用途**: 服务器、数据中心、基础设施

### CircuitBoardIllustration
**用途**: 电路板、硬件、芯片设计

### WorkspaceIllustration
**用途**: 工作空间、开发环境

---

## 🎨 使用示例

### 基础图标使用
```tsx
import { SearchIcon, UserIcon, SettingsIcon } from '@/components/graphics/CyberIcons';

function Header() {
  return (
    <header className="flex items-center gap-4">
      <SearchIcon size={24} className="text-cyber-cyan" />
      <UserIcon size={24} className="text-cyber-purple" glow />
      <SettingsIcon size={24} animated />
    </header>
  );
}
```

### Logo组合使用
```tsx
import { MainLogo, GitHubIcon, TwitterIcon } from '@/components/graphics';

function Footer() {
  return (
    <footer>
      <MainLogo width={150} />
      <div className="flex gap-4">
        <GitHubIcon size={24} />
        <TwitterIcon size={24} />
      </div>
    </footer>
  );
}
```

### 装饰元素使用
```tsx
import { CornerBracket, DividerLine, Scanlines } from '@/components/graphics/Decorations';

function Card({ children }) {
  return (
    <div className="relative cyber-card">
      <CornerBracket position="top-left" />
      <CornerBracket position="bottom-right" />
      <Scanlines />
      {children}
    </div>
  );
}
```

### 插画使用
```tsx
import { CyberCityIllustration } from '@/components/graphics/Illustrations';

function Hero() {
  return (
    <section>
      <h1>Welcome to CyberPress</h1>
      <CyberCityIllustration width={600} animated />
    </section>
  );
}
```

---

## 📏 尺寸参考

| 类型 | 小尺寸 | 中尺寸 | 大尺寸 | 超大尺寸 |
|------|--------|--------|--------|----------|
| 图标 | 16-24px | 32-48px | 64px | 96-128px |
| Logo | 32px | 64-100px | 150-200px | 300px+ |
| 装饰 | 50px | 100px | 200px | 400px+ |
| 插画 | 200px | 300-400px | 600px | 800px+ |

---

## 🎯 推荐配置

### 导航栏图标
```tsx
<HomeIcon size={24} glow />
<SearchIcon size={24} />
<UserIcon size={24} className="text-cyber-cyan" />
```

### 按钮图标
```tsx
<SettingsIcon size={20} />
<RefreshIcon size={20} animated />
<DownloadIcon size={20} glow />
```

### 社交链接
```tsx
<GitHubIcon size={32} glow />
<TwitterIcon size={32} />
<LinkedInIcon size={32} />
```

### Logo使用
```tsx
// Header Logo
<MainLogo width={180} />

// Footer Logo
<MinimalLogo width={120} color="#00f0ff" />

// Favicon
<FaviconLogo size={32} />
```

---

## 🔧 自定义颜色

所有图标支持通过 `className` 或 `color` 属性自定义颜色：

```tsx
// 使用 Tailwind 类名
<SearchIcon size={24} className="text-cyber-cyan" />
<GitHubIcon size={32} className="text-white" />

// 使用内联样式
<Logo color="#00f0ff" />
```

---

## 📝 注意事项

1. **性能**: 动画图标会消耗更多资源，谨慎使用
2. **可访问性**: 为图标添加 `aria-label` 提高可访问性
3. **响应式**: 根据屏幕尺寸调整图标大小
4. **主题切换**: 使用 `currentColor` 自动适应主题变化

---

**最后更新**: 2026-03-03
**版本**: 1.0.0
