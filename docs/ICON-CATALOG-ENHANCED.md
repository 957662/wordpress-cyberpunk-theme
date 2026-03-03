# CyberPress 图标完整目录 - 增强版

## 📋 目录

1. [基础图标](#基础图标)
2. [导航图标](#导航图标)
3. [操作图标](#操作图标)
4. [社交图标](#社交图标)
5. [内容图标](#内容图标)
6. [状态图标](#状态图标)
7. [特效图标](#特效图标) ⭐ 新增
8. [使用指南](#使用指南)
9. [定制选项](#定制选项)

---

## 🎯 基础图标

### LogoIcon
项目 Logo 图标，多种变体

```tsx
import { LogoIcon } from '@/components/icons';

<LogoIcon variant="main" size={200} />
<LogoIcon variant="icon" size={64} />
<LogoIcon variant="mark" size={32} />
```

**变体**: `main` | `icon` | `mark` | `text` | `minimal`
**尺寸**: 32-200px
**颜色**: 渐变 (青→紫→粉)

---

## 🧭 导航图标

### HomeIcon
首页图标，带六边形装饰

```tsx
<HomeIcon size={24} className="text-cyber-cyan" />
```

**用途**: 导航栏、面包屑、返回首页

### MenuIcon
菜单图标，支持开关状态

```tsx
<MenuIcon size={24} isOpen={false} />  {/* 汉堡包 */}
<MenuIcon size={24} isOpen={true} />   {/* 关闭X */}
```

**动画**: 平滑过渡动画

### ArrowIcon
箭头图标，四个方向

```tsx
<ArrowIcon size={20} direction="up" />
<ArrowIcon size={20} direction="down" />
<ArrowIcon size={20} direction="left" />
<ArrowIcon size={20} direction="right" />
```

**颜色变体**: cyan | purple | pink | yellow

### ChevronIcon
V形箭头，用于折叠/展开

```tsx
<ChevronDownIcon size={20} />
<ChevronUpIcon size={20} />
<ChevronLeftIcon size={20} />
<ChevronRightIcon size={20} />
```

---

## ⚡ 操作图标

### SearchIcon
搜索图标，放大镜样式

```tsx
<SearchIcon size={20} glow={true} />
```

**特效**: 发光效果可选

### FilterIcon
筛选图标，漏斗样式

```tsx
<FilterIcon size={18} />
```

**用途**: 筛选面板、分类选择

### SortIcon
排序图标，支持升降序

```tsx
<SortIcon size={18} direction="asc" />
<SortIcon size={18} direction="desc" />
```

### ShareIcon
分享图标，网络连接样式

```tsx
<ShareIcon size={20} />
```

### CopyIcon
复制图标，双文档样式

```tsx
<CopyIcon size={18} />
```

### DownloadIcon / UploadIcon
下载/上传图标

```tsx
<DownloadIcon size={20} />
<UploadIcon size={20} />
```

### EditIcon / TrashIcon
编辑/删除图标

```tsx
<EditIcon size={18} />
<TrashIcon size={18} variant="danger" />
```

### RefreshIcon / SaveIcon
刷新/保存图标

```tsx
<RefreshIcon size={20} animated={true} />  {/* 旋转动画 */}
<SaveIcon size={20} />
```

---

## 🌐 社交图标

### GitHubIcon
GitHub 图标

```tsx
<GitHubIcon size={24} filled={false} />
<GitHubIcon size={24} filled={true} />
```

**变体**: 轮廓 | 填充

### TwitterIcon / YouTubeIcon / LinkedInIcon
社交媒体图标

```tsx
<TwitterIcon size={24} />
<YouTubeIcon size={24} />
<LinkedInIcon size={24} />
```

### DiscordIcon / DribbbleIcon
社区和设计平台

```tsx
<DiscordIcon size={24} />
<DribbbleIcon size={24} />
```

---

## 📄 内容图标

### BlogIcon
博客图标，文档样式

```tsx
<BlogIcon size={24} variant="cyan" />
<BlogIcon size={24} variant="purple" />
```

**颜色**: 5种霓虹色可选

### PortfolioIcon
作品集图标，网格样式

```tsx
<PortfolioIcon size={24} />
```

### CodeIcon
代码图标，编程符号

```tsx
<CodeIcon size={20} />
```

### FileIcon / FolderIcon
文件/文件夹图标

```tsx
<FileIcon size={20} />
<FolderIcon size={20} />
```

### CalendarIcon
日历图标

```tsx
<CalendarIcon size={16} />
```

### TagIcon
标签图标

```tsx
<TagIcon size={16} />
```

---

## 📊 状态图标

### HeartIcon
心形图标，收藏功能

```tsx
<HeartIcon size={20} filled={false} />
<HeartIcon size={20} filled={true} variant="pink" />
```

### StarIcon
星星图标，评分功能

```tsx
<StarIcon size={20} filled={false} />
<StarIcon size={20} filled={true} variant="yellow" />
```

### CheckIcon
勾选图标，成功状态

```tsx
<CheckIcon size={20} />
```

### InfoIcon / WarningIcon / ErrorIcon
信息/警告/错误图标

```tsx
<InfoIcon size={20} variant="cyan" />
<WarningIcon size={20} variant="yellow" />
<ErrorIcon size={20} variant="pink" />
```

### BookmarkIcon
书签图标

```tsx
<BookmarkIcon size={20} filled={false} />
<BookmarkIcon size={20} filled={true} />
```

---

## ⭐ 特效图标 (NEW!)

### HologramIcon
全息投影图标，带扫描动画

```tsx
import { HologramIcon } from '@/components/icons/SpecialEffectsIcons';

<HologramIcon size={48} animated={true} />
<HologramIcon size={64} animated={false} />
```

**特效**:
- 扫描线动画
- 渐变色彩
- 发光效果
- 装饰点

**用途**: 加载状态、数据处理、AI功能

### GlitchIcon
故障艺术图标，RGB分离效果

```tsx
<GlitchIcon size={48} animated={true} />
```

**特效**:
- RGB色彩分离
- 抖动动画
- 故障条纹
- 颜色循环

**用途**: 错误页面、404、特殊状态

### MatrixIcon
矩阵雨图标，代码下落效果

```tsx
<MatrixIcon size={48} animated={true} />
```

**特效**:
- 字符下落动画
- 渐变透明度
- 等宽字体
- 黑色背景

**用途**: 数据处理、编程相关、终端

### DataFlowIcon
数据流动图标，显示传输

```tsx
<DataFlowIcon size={48} animated={true} />
```

**特效**:
- 数据包动画
- 节点连接
- 渐变连线
- 多色节点

**用途**: 数据同步、API调用、网络请求

### NeuralNetworkIcon
神经网络图标，AI连接效果

```tsx
<NeuralNetworkIcon size={48} animated={true} />
```

**特效**:
- 多节点连接
- 信号传输
- 中心脉冲
- 多色节点

**用途**: AI功能、机器学习、智能推荐

### EnergyCoreIcon
能量核心图标，脉冲效果

```tsx
<EnergyCoreIcon size={48} animated={true} />
```

**特效**:
- 脉冲光环
- 能量束
- 中心光点
- 多层波纹

**用途**: 性能指标、能量级别、系统状态

---

## 🎨 使用指南

### 基础导入

```tsx
// 基础图标
import { HomeIcon, SearchIcon, MenuIcon } from '@/components/icons';

// 特效图标
import { HologramIcon, GlitchIcon, MatrixIcon } from '@/components/icons/SpecialEffectsIcons';

// Logo
import { LogoIcon } from '@/components/icons';

// 社交图标
import { GitHubIcon, TwitterIcon } from '@/components/icons';
```

### 尺寸规格

```tsx
// 超小 (12-16px)
<SearchIcon size={14} />

// 小 (18-20px)
<MenuIcon size={18} />

// 中 (24px) - 默认
<HomeIcon size={24} />

// 大 (32-48px)
<LogoIcon size={32} />

// 超大 (64px+)
<HologramIcon size={64} />
```

### 颜色变体

```tsx
// 使用 Tailwind 类名
<IconName className="text-cyber-cyan" />
<IconName className="text-cyber-purple" />
<IconName className="text-cyber-pink" />
<IconName className="text-cyber-yellow" />
<IconName className="text-cyber-green" />

// 使用 variant 属性
<HeartIcon variant="pink" />
<StarIcon variant="yellow" />
<BlogIcon variant="purple" />
```

### 动画效果

```tsx
// 内置动画
<RefreshIcon size={24} animated={true} />
<LoadingIcon size={32} animated={true} />

// Tailwind 动画类
<IconName className="animate-spin" />
<IconName className="animate-pulse" />
<IconName className="animate-bounce" />

// 自定义动画
<IconName className="transition-transform duration-200 hover:scale-110" />
```

### 发光效果

```tsx
// 使用 glow 属性
<SearchIcon size={24} glow={true} />

// 使用 Tailwind 类
<IconName className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />

// 组合效果
<HologramIcon size={48} animated={true} glow={true} />
```

### 交互效果

```tsx
// 悬停变色
<IconName className="text-cyber-cyan hover:text-cyber-purple transition-colors" />

// 悬停放大
<IconName className="transition-transform duration-200 hover:scale-125" />

// 悬停发光
<IconName className="hover:drop-shadow-[0_0_12px_rgba(0,240,255,1)] transition-all" />
```

---

## 🎯 定制选项

### 组合使用

```tsx
// 图标 + 文字
<div className="flex items-center gap-2">
  <CalendarIcon size={16} className="text-cyber-cyan" />
  <span>2024-03-02</span>
</div>

// 图标按钮
<button className="p-2 rounded hover:bg-cyber-muted transition-colors">
  <ThemeIcon size={20} />
</button>

// 图标徽章
<div className="relative">
  <BellIcon size={24} />
  <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyber-pink rounded-full text-xs flex items-center justify-center">
    3
  </span>
</div>
```

### 响应式图标

```tsx
// 根据断点调整大小
<IconName size="md:24 lg:32" />

// 移动端隐藏
<IconName className="hidden md:block" size={24} />
```

### 可访问性

```tsx
// 添加 ARIA 标签
<SearchIcon size={20} aria-label="搜索" role="img" />

// 屏幕阅读器隐藏
<button>
  <SearchIcon size={20} aria-hidden="true" />
  <span className="sr-only">搜索</span>
</button>
```

---

## 📦 导出清单

### 基础图标 (50+)
- HomeIcon, LogoIcon, MenuIcon
- ArrowIcon, ChevronIcon系列
- SearchIcon, FilterIcon, SortIcon
- ShareIcon, CopyIcon, DownloadIcon, UploadIcon
- EditIcon, TrashIcon, RefreshIcon, SaveIcon
- GitHubIcon, TwitterIcon, YouTubeIcon, LinkedInIcon
- DiscordIcon, DribbbleIcon
- BlogIcon, PortfolioIcon, CodeIcon
- FileIcon, FolderIcon, CalendarIcon, TagIcon
- HeartIcon, StarIcon, CheckIcon
- InfoIcon, WarningIcon, ErrorIcon
- BookmarkIcon, CommentIcon
- UserIcon, SettingsIcon, ThemeIcon
- LockIcon, UnlockIcon, EyeIcon, EyeOffIcon
- BellIcon, EmailIcon, VideoIcon, MicIcon
- RSSIcon, ExternalLinkIcon, CloseIcon

### 特效图标 (6) ⭐ 新增
- HologramIcon - 全息投影
- GlitchIcon - 故障效果
- MatrixIcon - 矩阵雨
- DataFlowIcon - 数据流动
- NeuralNetworkIcon - 神经网络
- EnergyCoreIcon - 能量核心

### Logo 变体 (6)
- MainLogo - 主Logo
- SquareLogo - 方形Logo
- FaviconLogo - 图标
- MinimalLogo - 极简
- TextLogo - 文字
- WatermarkLogo - 水印

---

## 🔄 更新日志

### v2.0.0 (2026-03-03)
- ✅ 新增 6 个特效图标
- ✅ 支持动画效果
- ✅ 增强发光效果
- ✅ 完善文档

### v1.0.0 (2026-03-02)
- ✅ 初始图标库
- ✅ 50+ 基础图标
- ✅ 6 个 Logo 变体
- ✅ 5 种颜色变体

---

## 📞 相关资源

- [配色参考](/frontend/docs/COLOR_REFERENCE.md)
- [设计系统](/docs/DESIGN-SYSTEM.md)
- [图标展示](/frontend/components/examples/IconShowcase.tsx)

---

**设计团队**: CyberPress AI Design Team
**最后更新**: 2026-03-03
**版本**: v2.0.0
