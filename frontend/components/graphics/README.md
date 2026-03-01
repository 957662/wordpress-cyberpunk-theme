# CyberPress 图形组件库

一个基于内联 SVG 的赛博朋克风格图形组件库，为 CyberPress 平台提供完整的视觉设计支持。

## ✨ 特性

- 🎨 **赛博朋克风格** - 霓虹色彩、科技感设计
- 🧩 **内联 SVG** - 无需外部资源，可定制
- ⚡ **高性能** - 轻量级，按需导入
- 🎭 **动画效果** - 内置多种动画效果
- 🌙 **主题支持** - 完整的亮色/暗色主题
- 📱 **响应式** - 适配各种屏幕尺寸
- 🎯 **TypeScript** - 完整的类型定义

## 📦 内容

### 图标 (50+)
- 导航图标: 首页、博客、搜索、菜单等
- 社交图标: GitHub、Twitter、LinkedIn、Email 等
- UI 图标: 用户、设置、通知、评论等
- 操作图标: 编辑、删除、保存、下载等
- 状态图标: 检查、警告、错误、信息等
- 主题图标: 太阳、月亮
- 媒体图标: 图片、视频、代码、文件夹等
- 开发图标: 终端、数据库、服务器、云等

### Logo (7 种变体)
- Main Logo - 横向带文字
- Square Logo - 方形图标
- Favicon Logo - 小图标
- Minimal Logo - 单色版本
- Text Logo - 仅文字
- Watermark Logo - 半透明水印
- Animated Logo - 动画效果

### 装饰元素 (9 种)
- CornerBracket - 角标装饰
- DividerLine - 分割线 (4 种样式)
- LoadingRing - 加载环
- PulseLoader - 脉冲加载器
- HexLoader - 六边形加载器
- PatternBackground - 图案背景 (4 种样式)
- TechBorder - 科技感边框
- Scanlines - 扫描线效果
- GlitchOverlay - 故障效果

### 插画 (6 种场景)
- CyberCity - 赛博城市
- CodeScreen - 代码屏幕
- Network - 网络节点
- ServerRack - 服务器机架
- CircuitBoard - 电路板
- Workspace - 开发工作空间

## 🚀 快速开始

### 安装

确保已安装所需的依赖：

```bash
npm install react framer-motion
```

### 基本使用

```tsx
// 导入组件
import { HomeIcon, GitHubIcon, MainLogo, CornerBracket } from '@/components/graphics';

// 使用图标
<HomeIcon size={24} />
<GitHubIcon size={20} glow />

// 使用 Logo
<MainLogo width={200} />

// 使用装饰元素
<CornerBracket position="top-left" />
```

## 📖 文档

- [图标清单](./ICON_LIST.md) - 所有可用图标列表
- [配色参考](./COLOR_REFERENCE.md) - 完整的设计规范
- [使用示例](./EXAMPLES.tsx) - 实际代码示例

## 🎨 配色方案

### 主色调

```css
--cyber-dark: #0a0a0f      /* 深空黑 */
--cyber-cyan: #00f0ff      /* 霓虹青 */
--cyber-purple: #9d00ff    /* 赛博紫 */
--cyber-pink: #ff0080      /* 激光粉 */
--cyber-green: #00ff88     /* 赛博绿 */
--cyber-yellow: #f0ff00    /* 电压黄 */
```

### 渐变

```css
gradient-primary: linear-gradient(135deg, #00f0ff 0%, #9d00ff 100%)
gradient-secondary: linear-gradient(135deg, #ff0080 0%, #f0ff00 100%)
gradient-cyber: linear-gradient(45deg, #00f0ff, #9d00ff, #ff0080, #f0ff00)
```

## 💡 使用示例

### 导航栏

```tsx
import { MainLogo, HomeIcon, SearchIcon, GitHubIcon } from '@/components/graphics';

<nav className="flex items-center justify-between">
  <MainLogo width={150} />
  <div className="flex items-center gap-6">
    <a href="/" className="flex items-center gap-2">
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
import { CornerBracket, CodeIcon, HeartIcon } from '@/components/graphics';

<div className="relative p-6 bg-cyber-card rounded-lg">
  <CornerBracket position="top-left" />
  <CodeIcon size={32} color="#00f0ff" />
  <h3 className="text-xl font-bold">项目标题</h3>
  <button className="flex items-center gap-2">
    <HeartIcon size={18} />
    喜欢
  </button>
</div>
```

### 加载状态

```tsx
import { LoadingRing } from '@/components/graphics';

<div className="flex items-center justify-center">
  <LoadingRing size={64} />
</div>
```

## 🔧 API 文档

### SVGIconProps

所有图标组件都支持以下属性：

```tsx
interface SVGIconProps {
  size?: number;        // 图标尺寸 (默认: 24)
  className?: string;   // 额外的 CSS 类名
  glow?: boolean;       // 发光效果 (默认: false)
  color?: string;       // 自定义颜色
  onClick?: () => void; // 点击事件
}
```

### LogoProps

Logo 组件支持的属性：

```tsx
interface LogoProps {
  width?: number;       // 宽度
  height?: number;      // 高度 (可选)
  className?: string;   // 额外的 CSS 类名
  animated?: boolean;   // 启用动画 (默认: false)
  onClick?: () => void; // 点击事件
  color?: string;       // 自定义颜色
}
```

### DecorationProps

装饰元素基础属性：

```tsx
interface DecorationProps {
  className?: string;   // 额外的 CSS 类名
  color?: string;       // 自定义颜色
}
```

## 🎯 最佳实践

### 1. 尺寸选择

```tsx
// 导航菜单
<HomeIcon size={24} />

// 按钮图标
<SearchIcon size={20} />

// 卡片图标
<CodeIcon size={32} />

// 页面图标
<TerminalIcon size={48} />
```

### 2. 颜色使用

```tsx
// 使用默认颜色
<HomeIcon size={24} />

// 自定义颜色
<HomeIcon size={24} color="#00f0ff" />

// 使用 Tailwind 类
<HomeIcon size={24} className="text-cyber-cyan" />
```

### 3. 发光效果

```tsx
// 启用发光
<HomeIcon size={24} glow />

// 使用 Tailwind
<HomeIcon size={24} className="drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
```

### 4. 交互状态

```tsx
// 悬停效果
<GitHubIcon
  size={24}
  className="text-gray-400 hover:text-cyber-cyan transition-colors cursor-pointer"
/>

// 点击事件
<HomeIcon size={24} onClick={() => router.push('/')} />
```

## 🌙 主题支持

所有组件都支持通过 CSS 变量进行主题定制：

```css
/* 暗色主题 (默认) */
:root {
  --cyber-dark: #0a0a0f;
  --cyber-cyan: #00f0ff;
  --cyber-purple: #9d00ff;
}

/* 亮色主题 */
[data-theme="light"] {
  --cyber-dark: #ffffff;
  --cyber-cyan: #0066ff;
  --cyber-purple: #6600cc;
}
```

## 📁 项目结构

```
components/graphics/
├── SVGIcons.tsx           # SVG 图标组件
├── Logos.tsx              # Logo 组件
├── Decorations.tsx        # 装饰元素组件
├── Illustrations.tsx      # 插画组件
├── index.ts               # 统一导出
├── ICON_LIST.md           # 图标清单
├── COLOR_REFERENCE.md     # 配色参考
├── EXAMPLES.tsx           # 使用示例
└── README.md              # 本文件
```

## 🤝 贡献指南

欢迎贡献新的图标和组件！请遵循以下规范：

### 新增图标

1. 保持 `viewBox="0 0 24 24"`
2. 使用 `currentColor` 支持颜色继承
3. 添加完整的 TypeScript 类型
4. 保持赛博朋克风格一致

### 代码风格

```tsx
// ✅ 推荐
export const MyIcon: React.FC<SVGIconProps> = ({
  size = 24,
  className = '',
  color
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    style={{ color }}
  >
    <path
      d="..."
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
```

## 📝 更新日志

### v1.0.0 (2026-03-02)
- 🎉 初始版本发布
- ✨ 50+ SVG 图标
- 🎨 7 种 Logo 变体
- 🖼️ 9 种装饰元素
- 🌆 6 种插画场景
- 📚 完整的文档和示例

## 📄 许可证

MIT License - 详见项目根目录的 LICENSE 文件

## 🔗 相关链接

- [主项目](../../README.md)
- [组件文档](../../docs/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js](https://nextjs.org/)

---

<div align="center">

**Built with ❤️ by CyberPress Team**

</div>
