# CyberPress Graphics Manifest - 图形素材完整清单

## 📋 概述

CyberPress 图形系统包含完整的赛博朋克风格视觉素材库，包括 Logo、图标、插画和图案背景。

**最后更新**: 2026-03-06
**版本**: v5.0.0

---

## 🎨 Logo 组件

### 主 Logo 系列
| 组件名称 | 用途 | 尺寸 | 文件 |
|---------|------|------|------|
| `MainLogo` | 导航栏、页眉、品牌展示 | 200x60 | `Logos.tsx` |
| `SquareLogo` | 应用图标、加载页、独立展示 | 100x100 | `Logos.tsx` |
| `FaviconLogo` | Favicon、PWA 图标、小尺寸 | 32x32 | `Logos.tsx` |
| `MinimalLogo` | 单色变体、水印 | 100x100 | `Logos.tsx` |
| `TextLogo` | 仅文字版本 | 自适应 | `Logos.tsx` |
| `WatermarkLogo` | 半透明水印 | 200x60 | `Logos.tsx` |
| `AnimatedLogo` | 动画效果（脉冲、渐变动画） | 100x100 | `Logos.tsx` |

### 使用示例
```tsx
import { MainLogo, SquareLogo, AnimatedLogo } from '@/components/graphics';

<MainLogo width={200} />
<SquareLogo size={64} animated />
<AnimatedLogo onClick={() => navigate('/')} />
```

---

## 🔷 赛博朋克特色图标

### 神经网络与 AI
| 图标名称 | 描述 | 组件 |
|---------|------|------|
| `NeuralNetworkIcon` | 神经网络可视化（多层节点） | `CyberIcons.tsx` |
| `QuantumCoreIcon` | 量子计算核心（轨道动画） | `CyberIcons.tsx` |
| `DataStreamDecoration` | 数据流动画（流动线条） | `CyberIcons.tsx` |

### 使用示例
```tsx
import { NeuralNetworkIcon, QuantumCoreIcon } from '@/components/graphics';

<NeuralNetworkIcon size={100} glow />
<QuantumCoreIcon size={80} className="text-cyber-cyan" />
```

---

## 📊 插画组件

### 状态插画
| 插画名称 | 用途 | 尺寸 | 组件 |
|---------|------|------|------|
| `HeroIllustration` | 主页英雄区域 | 400x300 | `Illustrations.tsx` |
| `ErrorIllustration` | 404 错误页面 | 300x250 | `Illustrations.tsx` |
| `LoadingIllustration` | 加载状态 | 200x150 | `Illustrations.tsx` |
| `EmptyIllustration` | 空状态 | 250x200 | `Illustrations.tsx` |
| `SuccessIllustration` | 成功状态 | 200x160 | `Illustrations.tsx` |

### 使用示例
```tsx
import { HeroIllustration, ErrorIllustration } from '@/components/graphics';

<HeroIllustration animated />
<ErrorIllustration className="error-page-illustration" />
```

---

## 🎯 图案背景组件

### 基础图案
| 图案名称 | 描述 | 组件 |
|---------|------|------|
| `GridPattern` | 赛博网格背景 | `PatternBackgrounds.tsx` |
| `CircuitPattern` | 电路板纹理 | `PatternBackgrounds.tsx` |
| `HexPattern` | 六边形蜂窝结构 | `PatternBackgrounds.tsx` |
| `DotPattern` | 科技点阵 | `PatternBackgrounds.tsx` |
| `ScanlinePattern` | CRT 扫描线效果 | `PatternBackgrounds.tsx` |
| `NoisePattern` | 数字噪声 | `PatternBackgrounds.tsx` |
| `PerspectiveGrid` | 渐变透视图 | `PatternBackgrounds.tsx` |

### 使用示例
```tsx
import { GridPattern, CircuitPattern } from '@/components/graphics';

<div className="relative">
  <GridPattern animated opacity={0.1} />
  {/* 内容 */}
</div>
```

---

## 🔧 基础 UI 图标

### 导航类
- `HomeIcon` - 首页
- `BlogIcon` - 博客
- `PortfolioIcon` - 作品集
- `AboutIcon` - 关于
- `MenuIcon` - 菜单
- `CloseIcon` - 关闭

### 社交媒体
- `GitHubIcon` - GitHub
- `TwitterIcon` - Twitter/X
- `LinkedInIcon` - LinkedIn
- `EmailIcon` - 邮件
- `RSSIcon` - RSS 订阅
- `DiscordIcon` - Discord
- `YouTubeIcon` - YouTube
- `DribbbleIcon` - Dribbble

### 操作类
- `SearchIcon` - 搜索
- `EditIcon` - 编辑
- `DeleteIcon` - 删除
- `SaveIcon` - 保存
- `CopyIcon` - 复制
- `DownloadIcon` - 下载
- `UploadIcon` - 上传
- `ShareIcon` - 分享
- `FilterIcon` - 筛选
- `SortIcon` - 排序

### 状态类
- `CheckIcon` - 成功/勾选
- `WarningIcon` - 警告
- `ErrorIcon` - 错误
- `InfoIcon` - 信息
- `LockIcon` - 锁定
- `UnlockIcon` - 解锁

### 主题类
- `SunIcon` - 亮色主题
- `MoonIcon` - 暗色主题
- `ThemeToggleIcon` - 主题切换

### 媒体类
- `ImageIcon` - 图片
- `VideoIcon` - 视频
- `CodeIcon` - 代码
- `FolderIcon` - 文件夹
- `TagIcon` - 标签
- `CalendarIcon` - 日历
- `ClockIcon` - 时间

### 开发工具
- `TerminalIcon` - 终端
- `DatabaseIcon` - 数据库
- `ServerIcon` - 服务器
- `CloudIcon` - 云服务
- `ShieldIcon` - 安全
- `GitBranchIcon` - Git 分支

### 导航箭头
- `ArrowUpIcon` - 上箭头
- `ArrowDownIcon` - 下箭头
- `ArrowLeftIcon` - 左箭头
- `ArrowRightIcon` - 右箭头
- `ExternalLinkIcon` - 外部链接

### 其他
- `StarIcon` - 星星/收藏
- `HeartIcon` - 喜欢
- `RefreshIcon` - 刷新
- `UserIcon` - 用户
- `SettingsIcon` - 设置
- `BellIcon` - 通知
- `CommentIcon` - 评论

---

## 🎨 配色方案

### 主色板
```css
--cyber-cyan:      #00f0ff  /* 霓虹青 - 主要色 */
--cyber-purple:    #9d00ff  /* 赛博紫 - 次要色 */
--cyber-pink:      #ff0080  /* 激光粉 - 强调色 */
--cyber-yellow:    #f0ff00  /* 电压黄 - 警告色 */
--cyber-green:     #00ff88  /* 矩阵绿 - 成功色 */
--cyber-orange:    #ff6600  /* 火焰橙 - 提示色 */
```

### 背景色
```css
--cyber-dark:      #0a0a0f  /* 主背景 */
--cyber-darker:    #050508  /* 次背景 */
--cyber-muted:     #1a1a2e  /* 弱化背景 */
--cyber-card:      #16162a  /* 卡片背景 */
```

### 渐变组合
```css
/* 品牌渐变 */
gradient-brand: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 三色渐变 */
gradient-tricolor: linear-gradient(90deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
```

---

## ✨ 特效与动画

### 内置动画
- **脉冲动画** - 呼吸效果
- **旋转动画** - 持续旋转
- **发光效果** - 霓虹发光
- **故障效果** - 数字故障
- **扫描线** - CRT 效果
- **数据流** - 流动线条

### 使用示例
```tsx
// Logo 动画
<AnimatedLogo />

// 图标发光
<SearchIcon glow />

// 图案动画
<GridPattern animated />
```

---

## 📐 尺寸规格

### Logo 尺寸
- **MainLogo**: 200x60px (可缩放)
- **SquareLogo**: 100x100px (可缩放)
- **FaviconLogo**: 32x32px (可缩放)

### 图标尺寸
- **默认**: 24x24px
- **小**: 16x16px
- **中**: 32x32px
- **大**: 48x48px
- **特大**: 64x64px

### 插画尺寸
- **Hero**: 400x300px
- **Error**: 300x250px
- **Loading**: 200x150px
- **Empty**: 250x200px
- **Success**: 200x160px

---

## 🎯 使用指南

### 快速开始
```tsx
// 1. 导入所需组件
import { MainLogo, HomeIcon, GridPattern } from '@/components/graphics';

// 2. 使用组件
export default function Page() {
  return (
    <div className="relative min-h-screen bg-cyber-dark">
      {/* 背景图案 */}
      <GridPattern animated opacity={0.1} />

      {/* 导航栏 */}
      <nav className="flex items-center gap-4">
        <MainLogo width={150} />
        <HomeIcon size={24} className="text-cyber-cyan" />
      </nav>

      {/* 内容 */}
    </div>
  );
}
```

### 自定义样式
```tsx
// 自定义颜色
<MainLogo color="#ff0080" />

// 自定义类名
<SearchIcon className="text-cyber-cyan hover:text-cyber-purple" />

// 点击事件
<GitHubIcon onClick={() => open('https://github.com')} />

// 禁用发光
<NeuralNetworkIcon glow={false} />
```

---

## 📦 组件属性

### LogoProps
```typescript
interface LogoProps {
  width?: number;          // 宽度
  height?: number;         // 高度
  className?: string;      // CSS 类名
  animated?: boolean;      // 是否动画
  onClick?: () => void;    // 点击事件
  color?: string;          // 自定义颜色
}
```

### SVGIconProps
```typescript
interface SVGIconProps {
  size?: number;           // 图标尺寸
  className?: string;      // CSS 类名
  glow?: boolean;          // 发光效果
  color?: string;          // 自定义颜色
  onClick?: () => void;    // 点击事件
}
```

### IllustrationProps
```typescript
interface IllustrationProps {
  width?: number;          // 宽度
  height?: number;         // 高度
  className?: string;      // CSS 类名
  animated?: boolean;      // 是否动画
}
```

### PatternProps
```typescript
interface PatternProps {
  className?: string;      // CSS 类名
  animated?: boolean;      // 是否动画
  color?: string;          // 自定义颜色
  opacity?: number;        // 透明度
}
```

---

## 🚀 高级用法

### 动态图标
```tsx
import { DynamicIcon } from '@/components/graphics';

<DynamicIcon name="home" size={24} variant="cyan" />
```

### 图标组
```tsx
import { IconGroup } from '@/components/graphics';

<IconGroup
  icons={['github', 'twitter', 'linkedin']}
  size={24}
  gap={8}
/>
```

### 响应式图标
```tsx
import { ResponsiveIcon } from '@/components/graphics';

<ResponsiveIcon
  icon={HomeIcon}
  sizes={{ mobile: 20, tablet: 24, desktop: 28 }}
/>
```

---

## 📋 检查清单

使用图形组件前请确认：
- [ ] 导入路径正确
- [ ] 尺寸适配当前布局
- [ ] 颜色符合设计规范
- [ ] 可访问性（添加 aria-label）
- [ ] 响应式测试
- [ ] 动画性能检查
- [ ] 浏览器兼容性

---

## 🌐 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

---

## 📚 相关文档

- [配色参考](./COLOR_REFERENCE.md)
- [图标使用指南](../public/README-GRAPHICS.md)
- [Tailwind 配置](../tailwind.config.ts)

---

## 📞 技术支持

**设计团队**: CyberPress AI Design Team
**版本**: v5.0.0
**最后更新**: 2026-03-06

---

## 🔄 更新日志

### v5.0.0 (2026-03-06)
- ✨ 新增插画组件库（5个状态插画）
- ✨ 新增图案背景组件（7种背景图案）
- ✨ 新增赛博朋克特色图标（3个动画图标）
- 📝 完善文档和使用示例
- 🎨 优化配色系统

### v4.0.0 (2026-03-05)
- ✨ 新增 CyberPressLogo 组件
- ✨ 新增 TechIconSet 图标集
- ✨ 新增 CyberIllustrations 插画库
- ✨ 新增 PatternLibrary 图案库
- 🎨 新增配色方案系统

### v3.0.0 (2026-03-04)
- ✨ 新增动画图标系统
- ✨ 新增响应式图标
- ✨ 新增主题感知图标
- ♿ 新增可访问性图标

### v2.0.0 (2026-03-03)
- ✨ 新增 3D 图标
- ✨ 新增补充图标集
- ✨ 新增背景图案库
- ✨ 新增补充插画

### v1.0.0 (2026-03-02)
- 🎉 初始发布
- ✨ 基础图标库
- ✨ Logo 组件
- ✨ 装饰元素
