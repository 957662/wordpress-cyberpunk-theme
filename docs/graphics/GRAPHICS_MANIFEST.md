# CyberPress 图形资源清单

> 项目所有图形素材的完整索引和使用指南

## 📊 资源概览

| 类别 | 数量 | 用途 |
|------|------|------|
| SVG图标 | 100+ | 功能图标、导航、社交 |
| Logo组件 | 7个 | 品牌标识、站点标记 |
| 装饰元素 | 10个 | 边框、分割线、背景 |
| 插画组件 | 6个 | 场景展示、视觉装饰 |
| 特效组件 | 15个 | 动画效果、交互反馈 |

---

## 🗂️ 文件结构

```
frontend/components/graphics/
├── SVGIcons.tsx           # 基础SVG图标库
├── CyberIcons.tsx         # 赛博朋克风格图标
├── Logos.tsx              # Logo组件集合
├── Decorations.tsx        # 装饰元素
├── Illustrations.tsx      # 插画组件
├── IconLibrary.tsx        # 图标展示组件
├── Icon.tsx               # 图标基础组件
├── LogoDisplay.tsx        # Logo展示组件
├── Decoration.tsx         # 装饰基础组件
├── PatternBackground.tsx  # 图案背景
└── Illustration.tsx       # 插画基础组件
```

---

## 🎨 SVG图标库

### 文件: `SVGIcons.tsx`

**包含图标类型**:
- 导航图标 (Home, Search, Menu, Arrow等)
- 社交图标 (GitHub, Twitter, LinkedIn等)
- 功能图标 (Settings, User, Lock等)
- 状态图标 (Success, Error, Warning等)
- 文件图标 (File, Folder, Document等)
- 媒体图标 (Image, Video, Music等)

**使用示例**:
```tsx
import { HomeIcon, SearchIcon, GitHubIcon } from '@/components/graphics/SVGIcons';

<HomeIcon size={24} className="text-cyber-cyan" />
<SearchIcon size={24} glow />
<GitHubIcon size={32} />
```

**特色功能**:
- ✅ 可调节尺寸 (size prop)
- ✅ 发光效果 (glow prop)
- ✅ 自定义颜色 (className 或 color prop)
- ✅ 点击事件 (onClick prop)
- ✅ 渐变色填充
- ✅ 动画支持

---

## 🤖 赛博朋克图标

### 文件: `CyberIcons.tsx`

**包含图标**:
- `NeuralIcon` - 神经网络图标
- `QuantumIcon` - 量子核心图标
- `PlasmaIcon` - 等离子图标
- `DataFlowIcon` - 数据流图标
- `ChipIcon` - 芯片图标

**使用示例**:
```tsx
import { NeuralIcon, QuantumIcon } from '@/components/graphics/CyberIcons';

<NeuralIcon size={100} glow animated />
<QuantumIcon size={80} glow />
```

**特色**:
- ✅ 大尺寸设计 (80-200px)
- ✅ 内置动画效果
- ✅ 多层渐变色
- ✅ 发光滤镜效果
- ✅ 粒子动画

---

## 🏷️ Logo组件

### 文件: `Logos.tsx`

**可用Logo**:
1. **MainLogo** - 主Logo (带文字)
2. **SquareLogo** - 方形Logo (仅图标)
3. **FaviconLogo** - 网站图标 (32px)
4. **MinimalLogo** - 极简Logo (单色)
5. **TextLogo** - 文字Logo (仅文字)
6. **WatermarkLogo** - 水印Logo (半透明)
7. **AnimatedLogo** - 动画Logo (脉冲效果)

**使用示例**:
```tsx
import { MainLogo, SquareLogo, FaviconLogo } from '@/components/graphics/Logos';

// Header使用
<MainLogo width={200} animated />

// 卡片使用
<SquareLogo size={64} glow />

// Favicon
<FaviconLogo size={32} />

// 页脚水印
<WatermarkLogo width={300} />
```

**推荐尺寸**:
- Header Logo: 180-220px
- Footer Logo: 120-150px
- Card Logo: 48-64px
- Favicon: 32px
- 极简版: 100-150px

---

## ✨ 装饰元素

### 文件: `Decorations.tsx`

**可用装饰**:

### 1. CornerBracket - 角标装饰
```tsx
<CornerBracket position="top-left" size={100} />
```
- 位置: top-left, top-right, bottom-left, bottom-right
- 用途: 卡片角落、科技感边框

### 2. DividerLine - 分割线
```tsx
<DividerLine variant="tech" width="full" />
```
- 变体: simple, double, dashed, tech
- 用途: 内容分隔、章节分割

### 3. LoadingRing - 加载环
```tsx
<LoadingRing size={80} />
```
- 用途: 加载状态、处理中

### 4. PulseLoader - 脉冲加载器
```tsx
<PulseLoader size={60} />
```

### 5. HexLoader - 六边形加载器
```tsx
<HexLoader size={80} />
```

### 6. PatternBackground - 图案背景
```tsx
<PatternBackground variant="grid" opacity={0.1} />
```
- 图案: grid, dots, hexagons, circuit
- 用途: 页面背景、纹理

### 7. TechBorder - 科技边框
```tsx
<TechBorder rounded glow />
```

### 8. Scanlines - 扫描线效果
```tsx
<Scanlines />
```

### 9. GlitchOverlay - 故障效果
```tsx
<GlitchOverlay />
```

---

## 🎭 插画组件

### 文件: `Illustrations.tsx`

**可用插画**:

### 1. CyberCityIllustration - 赛博城市
```tsx
<CyberCityIllustration width={400} animated />
```
- 用途: 首页Hero、背景装饰
- 特色: 动态窗户灯光、霓虹招牌

### 2. CodeScreenIllustration - 代码屏幕
```tsx
<CodeScreenIllustration width={300} />
```
- 用途: 开发场景、技术展示
- 特色: 语法高亮、闪烁光标

### 3. NetworkIllustration - 网络节点
```tsx
<NetworkIllustration width={300} animated />
```
- 用途: 网络拓扑、连接可视化
- 特色: 数据流动动画

### 4. ServerRackIllustration - 服务器机架
```tsx
<ServerRackIllustration width={200} animated />
```
- 用途: 数据中心、基础设施
- 特色: LED闪烁动画

### 5. CircuitBoardIllustration - 电路板
```tsx
<CircuitBoardIllustration width={300} animated />
```
- 用途: 硬件、芯片设计
- 特色: 数据流动、电路线条

### 6. WorkspaceIllustration - 工作空间
```tsx
<WorkspaceIllustration width={350} />
```
- 用途: 开发环境、办公场景
- 特色: 显示器、键盘、咖啡

---

## 🎯 特效组件

### 额外特效 (在 components/effects/)

**可用特效**:
- `GlitchText` - 故障文字效果
- `NeonBorder` - 霓虹边框
- `TypewriterText` - 打字机效果
- `ParticleBackground` - 粒子背景
- `HologramCard` - 全息卡片
- `CyberGrid` - 赛博网格
- `MatrixRain` - 矩阵雨
- `TextScramble` - 文字乱码
- `GlowOrb` - 发光球体
- `Scanlines` - 扫描线

**使用示例**:
```tsx
import { GlitchText, NeonBorder } from '@/components/effects';

<GlitchText text="HELLO WORLD" />
<NeonBorder color="#00f0ff" />
```

---

## 📐 尺寸指南

### 图标尺寸
| 用途 | 推荐尺寸 |
|------|----------|
| 按钮/导航 | 16-24px |
| 卡片图标 | 32-48px |
| 功能图标 | 24-32px |
| 社交图标 | 24-32px |
| 大图标 | 48-64px |

### Logo尺寸
| 用途 | 推荐尺寸 |
|------|----------|
| Header Logo | 180-220px |
| Footer Logo | 120-150px |
| Card Logo | 48-64px |
| Favicon | 32px |
| 水印 | 300-400px |

### 装饰尺寸
| 用途 | 推荐尺寸 |
|------|----------|
| 角标 | 80-120px |
| 分割线 | full / 固定宽度 |
| 背景图案 | 100% |
| 加载器 | 60-80px |

### 插画尺寸
| 用途 | 推荐尺寸 |
|------|----------|
| Hero插画 | 600-800px |
| 卡片插画 | 300-400px |
| 小插画 | 200-300px |
| 背景插画 | 100% |

---

## 🎨 配色方案

### 主色调
```css
--cyber-dark: #0a0a0f      /* 深空黑 - 主背景 */
--cyber-cyan: #00f0ff      /* 霓虹青 - 主强调色 */
--cyber-purple: #9d00ff    /* 赛博紫 - 次强调色 */
--cyber-pink: #ff0080      /* 激光粉 - 警告色 */
--cyber-green: #00ff88     /* 霓虹绿 - 成功色 */
--cyber-yellow: #f0ff00    /* 电压黄 - 提示色 */
```

### 渐变色
```css
/* 主渐变 */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%);

/* 三色渐变 */
background: linear-gradient(135deg, #00f0ff 0%, #9d00ff 50%, #ff0080 100%);
```

---

## 💡 使用场景示例

### 场景1: 导航栏
```tsx
import { MainLogo, SearchIcon, UserIcon } from '@/components/graphics';

function Header() {
  return (
    <header className="flex items-center justify-between">
      <MainLogo width={180} />
      <nav className="flex gap-4">
        <SearchIcon size={24} className="text-cyber-cyan" />
        <UserIcon size={24} className="text-cyber-purple" />
      </nav>
    </header>
  );
}
```

### 场景2: 卡片组件
```tsx
import { CornerBracket, DividerLine } from '@/components/graphics/Decorations';

function Card({ children }) {
  return (
    <div className="relative cyber-card">
      <CornerBracket position="top-left" size={80} />
      <CornerBracket position="bottom-right" size={80} />
      {children}
    </div>
  );
}
```

### 场景3: Hero区域
```tsx
import { CyberCityIllustration } from '@/components/graphics/Illustrations';

function Hero() {
  return (
    <section className="relative">
      <h1 className="text-glow-cyan">Welcome to CyberPress</h1>
      <CyberCityIllustration width={600} animated />
    </section>
  );
}
```

### 场景4: 加载状态
```tsx
import { LoadingRing, PulseLoader } from '@/components/graphics/Decorations';

function Loading() {
  return (
    <div className="flex items-center justify-center">
      <LoadingRing size={80} />
    </div>
  );
}
```

### 场景5: 社交链接
```tsx
import { GitHubIcon, TwitterIcon, LinkedInIcon } from '@/components/graphics/SVGIcons';

function SocialLinks() {
  return (
    <div className="flex gap-4">
      <GitHubIcon size={32} glow />
      <TwitterIcon size={32} glow />
      <LinkedInIcon size={32} glow />
    </div>
  );
}
```

---

## 🔧 自定义样式

### 修改颜色
```tsx
// 使用Tailwind类名
<Icon size={24} className="text-cyber-cyan" />

// 使用内联样式
<Icon size={24} style={{ color: '#00f0ff' }} />

// 使用color prop
<Icon size={24} color="#00f0ff" />
```

### 启用发光效果
```tsx
<Icon size={24} glow />
<Logo width={200} glow />
```

### 启用动画
```tsx
<Icon size={24} animated />
<Logo width={200} animated />
<Illustration width={400} animated />
```

---

## 📝 最佳实践

### 1. 性能优化
- 动画图标谨慎使用，避免过度消耗资源
- 大尺寸插画考虑懒加载
- 使用SVG格式保持文件小体积

### 2. 可访问性
- 为图标添加 `aria-label` 属性
- 确保颜色对比度符合WCAG标准
- 提供替代文本

### 3. 响应式设计
- 根据屏幕尺寸调整图标大小
- 移动端使用较小尺寸
- 保持视觉层次清晰

### 4. 主题适配
- 使用 `currentColor` 自动适应主题
- 避免硬编码颜色值
- 支持深色/浅色模式切换

---

## 📚 相关文档

- [图标详细索引](./ICON_INDEX.md) - 所有图标的完整列表
- [配色参考](./COLOR_REFERENCE.md) - 详细的配色方案
- [组件文档](../../README.md) - 组件使用指南

---

## 🔄 更新日志

### v1.0.0 (2026-03-03)
- ✅ 初始化图形库
- ✅ 100+ SVG图标
- ✅ 7个Logo组件
- ✅ 10个装饰元素
- ✅ 6个插画组件
- ✅ 完整配色方案
- ✅ 详细文档

---

**最后更新**: 2026-03-03
**维护者**: CyberPress Team
**许可证**: MIT
