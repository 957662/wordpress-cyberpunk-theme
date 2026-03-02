# CyberPress 图形素材库 - v2.0 使用指南

**版本**: 2.0.0
**更新日期**: 2026-03-03
**设计师**: AI Graphics Designer

---

## 🎉 欢迎使用 CyberPress 图形素材库

这是一个专为赛博朋克风格设计的完整图形素材库，包含 **130+ 个组件**，涵盖图标、Logo、插画、背景图案等。

---

## 📦 快速开始

### 安装依赖（如果需要）

本项目使用以下依赖（已包含在主项目中）：

```json
{
  "react": "^18.2.0",
  "framer-motion": "^11.0.0"
}
```

### 导入使用

#### 方式一：从统一索引导入（推荐）✨

```tsx
// 导入所有需要的图形组件
import {
  // 图标
  HomeIcon,
  GitHubIcon,
  ShieldIcon,
  ZapIcon,
  RocketIcon,
  // Logo
  MainLogo,
  SquareLogo,
  // 装饰
  CornerBracket,
  DividerLine,
  // 背景
  CyberGridPattern,
  HexagonPattern,
  // 3D 图标
  Cube3DIcon,
  Sphere3DIcon,
  // 插画
  CyberCityIllustration,
  RobotIllustration,
  // 组合
  SocialIcons,
  TechStackIcons,
  FeatureIcons,
} from '@/components/graphics';
```

#### 方式二：从具体文件导入

```tsx
// 导入基础图标
import { HomeIcon, SearchIcon } from '@/components/graphics/SVGIcons';

// 导入补充图标
import { ShieldIcon, ZapIcon } from '@/components/graphics/AdditionalIcons';

// 导入 Logo
import { MainLogo, SquareLogo } from '@/components/graphics/Logos';

// 导入装饰元素
import { CornerBracket, DividerLine } from '@/components/graphics/Decorations';

// 导入背景图案
import { CyberGridPattern, HexagonPattern } from '@/components/graphics/BackgroundPatterns';

// 导入 3D 图标
import { Cube3DIcon, Sphere3DIcon } from '@/components/graphics/Icon3D';

// 导入插画
import { CyberCityIllustration } from '@/components/graphics/Illustrations';
import { RobotIllustration } from '@/components/graphics/AdditionalIllustrations';

// 导入图标组合
import { SocialIcons, TechStackIcons } from '@/components/graphics/IconSets';
```

---

## 🎯 组件分类速查

### 1️⃣ 基础图标 (50+)

**文件**: `SVGIcons.tsx`

```tsx
import { HomeIcon, BlogIcon, SearchIcon, GitHubIcon } from '@/components/graphics';

// 使用
<HomeIcon size={24} />
<BlogIcon size={24} glow />
<GitHubIcon size={32} color="#00f0ff" onClick={() => console.log('clicked')} />
```

**常用图标**:
- 导航: `HomeIcon`, `BlogIcon`, `PortfolioIcon`, `AboutIcon`
- 社交: `GitHubIcon`, `TwitterIcon`, `LinkedInIcon`, `EmailIcon`
- UI: `UserIcon`, `SettingsIcon`, `EditIcon`, `DeleteIcon`, `SaveIcon`
- 状态: `CheckIcon`, `WarningIcon`, `ErrorIcon`, `LoadingIcon`
- 媒体: `ImageIcon`, `VideoIcon`, `CodeIcon`, `FolderIcon`

### 2️⃣ 补充图标 (30)

**文件**: `AdditionalIcons.tsx`

```tsx
import { ShieldIcon, ZapIcon, RocketIcon, LightbulbIcon } from '@/components/graphics';

// 使用
<ShieldIcon size={32} />
<ZapIcon size={32} glow animated />
<RocketIcon size={48} color="#ff0080" />
```

**新增图标**:
- 安全: `ShieldIcon`, `ShieldLockIcon`
- 性能: `ZapIcon`, `FlameIcon`, `AccelerationIcon`
- 创新: `RocketIcon`, `LightbulbIcon`, `CrystalBallIcon`
- 数据: `DatabaseClusterIcon`, `ChartGrowthIcon`, `AnalyticsIcon`

### 3️⃣ Logo 组件 (7)

**文件**: `Logos.tsx`

```tsx
import { MainLogo, SquareLogo, AnimatedLogo } from '@/components/graphics';

// 使用
<MainLogo width={200} />
<SquareLogo size={64} animated />
<AnimatedLogo size={100} />
```

**Logo 类型**:
- `MainLogo` - 主 Logo（横向带文字）
- `SquareLogo` - 方形 Logo（仅图标）
- `FaviconLogo` - Favicon Logo
- `MinimalLogo` - 极简 Logo（单色）
- `TextLogo` - 文字 Logo
- `WatermarkLogo` - 水印 Logo
- `AnimatedLogo` - 动画 Logo

### 4️⃣ 装饰元素 (9)

**文件**: `Decorations.tsx`

```tsx
import { CornerBracket, DividerLine, LoadingRing } from '@/components/graphics';

// 使用
<CornerBracket position="top-left" size={100} />
<DividerLine variant="tech" />
<LoadingRing size={80} />
```

**装饰类型**:
- `CornerBracket` - 角标装饰
- `DividerLine` - 分割线（simple/double/dashed/tech）
- `LoadingRing` - 加载环
- `PulseLoader` - 脉冲加载器
- `HexLoader` - 六边形加载器
- `TechBorder` - 科技感边框
- `Scanlines` - 扫描线效果
- `GlitchOverlay` - 故障效果

### 5️⃣ 背景图案 (12)

**文件**: `BackgroundPatterns.tsx`

```tsx
import { CyberGridPattern, HexagonPattern, MatrixPattern } from '@/components/graphics';

// 使用
<CyberGridPattern opacity={0.1} />
<HexagonPattern color="#00f0ff" animated />
<MatrixPattern opacity={0.15} />
```

**图案类型**:
- 网格: `CyberGridPattern`, `DotMatrixPattern`
- 多边形: `HexagonPattern`, `HoneycombPattern`, `TrianglePattern`, `DiamondPattern`
- 电路: `CircuitPattern`
- 特效: `WavePattern`, `RadialPattern`, `MatrixPattern`, `HologramPattern`

### 6️⃣ 3D 图标 (6)

**文件**: `Icon3D.tsx`

```tsx
import { Cube3DIcon, Sphere3DIcon, Pyramid3DIcon } from '@/components/graphics';

// 使用
<Cube3DIcon size={64} animated />
<Sphere3DIcon size={48} color="#ff0080" />
<Pyramid3DIcon size={56} />
```

**3D 类型**:
- `Cube3DIcon` - 3D 立方体
- `Pyramid3DIcon` - 3D 金字塔
- `Sphere3DIcon` - 3D 球体
- `Cylinder3DIcon` - 3D 圆柱体
- `Torus3DIcon` - 3D 圆环
- `Cone3DIcon` - 3D 锥体

### 7️⃣ 插画组件 (10)

**基础插画** (Illustrations.tsx):
- `CyberCityIllustration` - 赛博城市
- `CodeScreenIllustration` - 代码屏幕
- `NetworkIllustration` - 网络节点
- `ServerRackIllustration` - 服务器机架
- `CircuitBoardIllustration` - 电路板
- `WorkspaceIllustration` - 工作空间

**补充插画** (AdditionalIllustrations.tsx):
- `RobotIllustration` - 机器人
- `SpaceIllustration` - 太空探索
- `NeuralNetworkIllustration` - AI 神经网络
- `DataCenterIllustration` - 数据中心

```tsx
import { CyberCityIllustration, RobotIllustration } from '@/components/graphics';

// 使用
<CyberCityIllustration width={600} animated />
<RobotIllustration width={400} />
```

### 8️⃣ 图标组合 (6)

**文件**: `IconSets.tsx`

```tsx
import { SocialIcons, TechStackIcons, FeatureIcons } from '@/components/graphics';

// 使用
<SocialIcons variant="circle" size={32} />
<TechStackIcons layout="grid" columns={4} />
<FeatureIcons layout="grid" animated />
```

**组合类型**:
- `SocialIcons` - 社交媒体图标（GitHub, Twitter, LinkedIn, Email, RSS）
- `TechStackIcons` - 技术栈图标（Next.js, React, TypeScript 等）
- `FeatureIcons` - 功能特性图标（安全、性能、创新、智能）
- `NavigationIcons` - 导航图标
- `ActionButtons` - 操作按钮
- `StatusBadges` - 状态徽章

---

## 🎨 通用 Props

### 图标 Props (SVGIconProps)

```tsx
interface SVGIconProps {
  size?: number;        // 图标尺寸（默认 24）
  className?: string;   // 额外的 CSS 类名
  glow?: boolean;       // 发光效果
  color?: string;       // 自定义颜色
  onClick?: () => void; // 点击事件
}
```

### Logo Props (LogoProps)

```tsx
interface LogoProps {
  width?: number;       // 宽度
  height?: number;      // 高度（可选）
  className?: string;   // CSS 类名
  animated?: boolean;   // 动画效果
  onClick?: () => void; // 点击事件
  color?: string;       // 自定义颜色
}
```

### 插画 Props (IllustrationProps)

```tsx
interface IllustrationProps {
  width?: number;       // 宽度
  height?: number;      // 高度（可选）
  className?: string;   // CSS 类名
  animated?: boolean;   // 动画效果
  color?: string;       // 自定义颜色
}
```

---

## 💡 使用示例

### 示例 1: 页面头部

```tsx
import { MainLogo, SearchIcon, GitHubIcon, ThemeSwitcher } from '@/components/graphics';

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-cyber-dark border-b border-cyber-border">
      <MainLogo width={180} onClick={() => router.push('/')} />

      <nav className="flex items-center gap-6">
        <SearchIcon size={24} className="text-cyber-cyan cursor-pointer hover:text-glow-cyan" />
        <GitHubIcon size={24} className="cursor-pointer hover:scale-110 transition-transform" />
      </nav>
    </header>
  );
}
```

### 示例 2: 功能卡片

```tsx
import { ShieldIcon, ZapIcon, RocketIcon } from '@/components/graphics';

export function FeatureCard() {
  const features = [
    { icon: ShieldIcon, title: '安全可靠', description: '企业级安全保障', color: '#00f0ff' },
    { icon: ZapIcon, title: '极速性能', description: '毫秒级响应速度', color: '#ff0080' },
    { icon: RocketIcon, title: '持续创新', description: '引领技术前沿', color: '#9d00ff' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div key={index} className="cyber-card p-6">
          <feature.icon size={48} color={feature.color} glow className="mb-4" />
          <h3 className="text-xl font-bold text-cyber-cyan mb-2">{feature.title}</h3>
          <p className="text-gray-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### 示例 3: 背景图案

```tsx
import { CyberGridPattern, HexagonPattern } from '@/components/graphics';

export function PageWithBackground() {
  return (
    <div className="relative min-h-screen">
      {/* 背景图案 */}
      <div className="absolute inset-0 -z-10">
        <CyberGridPattern opacity={0.05} />
      </div>

      {/* 内容 */}
      <main className="relative z-10">
        {/* 你的页面内容 */}
      </main>
    </div>
  );
}
```

### 示例 4: 加载动画

```tsx
import { LoadingRing, PulseLoader, HexLoader } from '@/components/graphics';

export function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingRing size={100} />
        <p className="mt-4 text-cyber-cyan">加载中...</p>
      </div>
    </div>
  );
}
```

### 示例 5: 社交链接

```tsx
import { SocialIcons } from '@/components/graphics';

export function Footer() {
  return (
    <footer className="bg-cyber-dark border-t border-cyber-border py-8">
      <div className="container mx-auto text-center">
        <SocialIcons variant="circle" size={32} />
        <p className="mt-4 text-gray-400">© 2026 CyberPress. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

### 示例 6: 3D 图标展示

```tsx
import { Cube3DIcon, Sphere3DIcon, Pyramid3DIcon } from '@/components/graphics';

export function IconShowcase() {
  return (
    <div className="flex gap-8 justify-center items-center py-12">
      <Cube3DIcon size={80} animated />
      <Sphere3DIcon size={80} color="#ff0080" />
      <Pyramid3DIcon size={80} color="#00ff88" />
    </div>
  );
}
```

---

## 🎨 配色方案

所有图形组件使用统一的赛博朋克配色：

```css
/* 主色调 */
--cyber-cyan: #00f0ff;     /* 霓虹青 - 主要强调色 */
--cyber-purple: #9d00ff;   /* 赛博紫 - 次要强调色 */
--cyber-pink: #ff0080;     /* 激光粉 - 点缀色 */
--cyber-green: #00ff88;    /* 赛博绿 - 成功状态 */
--cyber-yellow: #f0ff00;   /* 电压黄 - 警告状态 */

/* 背景色 */
--cyber-dark: #0a0a0f;     /* 深空黑 - 主背景 */
--cyber-darker: #050508;   /* 更深的黑色 */
--cyber-muted: #1a1a2e;    /* 深空蓝 - 卡片背景 */
--cyber-card: #16162a;     /* 卡片背景 */
--cyber-border: #2a2a4a;   /* 边框色 */
```

---

## ⚡ 动画效果

### SMIL 动画（SVG 原生）

通过 `animated` prop 启用：

```tsx
<AnimatedLogo size={100} animated />
<NeuralNetworkIllustration width={500} animated />
```

### CSS 动画

使用 Tailwind CSS 动画类：

```tsx
<div className="animate-spin">
  <LoadingRing />
</div>

<div className="animate-pulse">
  <PulseLoader />
</div>
```

### Framer Motion

结合 Framer Motion 使用：

```tsx
import { motion } from 'framer-motion';
import { HomeIcon } from '@/components/graphics';

<motion.div
  initial={{ opacity: 0, scale: 0.5 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
>
  <HomeIcon size={48} />
</motion.div>
```

---

## 📚 相关文档

- **[完整索引](./ICON_INDEX.md)** - 所有组件的完整列表
- **[更新日志](./GRAPHICS_UPDATE.md)** - v2.0 更新记录
- **[颜色参考](./COLOR_REFERENCE.md)** - 配色方案详情
- **[图标清单](./ICON_LIST.md)** - 图标使用说明

---

## 🤝 贡献指南

添加新图标时，请遵循以下规范：

1. ✅ 使用 `currentColor` 以支持颜色继承
2. ✅ 保持 `viewBox="0 0 24 24"` (图标)
3. ✅ 添加完整的 TypeScript 类型
4. ✅ 保持赛博朋克风格一致
5. ✅ 添加适当的动画效果
6. ✅ 更新索引文件

---

## 📄 许可证

MIT License - 随意使用和修改

---

**设计师**: AI Graphics Designer
**项目**: CyberPress Platform
**版本**: 2.0.0
**最后更新**: 2026-03-03

🎉 享受使用 CyberPress 图形素材库！
