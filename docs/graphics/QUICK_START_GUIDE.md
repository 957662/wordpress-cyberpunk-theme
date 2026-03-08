# CyberPress 图标库 - 快速开始指南

欢迎使用 CyberPress 图标库！本指南将帮助您快速上手使用我们的赛博朋克风格图标系统。

## 📦 安装

图标库已集成到项目中，无需额外安装。

## 🚀 快速导入

### 方式一：从主入口导入

```tsx
// 导入基础图标
import {
  HomeIcon,
  SearchIcon,
  MenuIcon,
  GitHubIcon,
  SettingsIcon
} from '@/components/icons';

// 导入动画图标
import {
  PulsingIcon,
  GlowingIcon,
  FloatingIcon
} from '@/components/icons';

// 导入显示组件
import {
  IconGrid,
  IconGallery,
  IconToolbar
} from '@/components/icons';

// 导入响应式组件
import {
  ResponsiveIcon,
  AdaptiveIcon,
  ThemedIcon
} from '@/components/icons';

// 导入可访问性组件
import {
  AccessibleIcon,
  IconWithTooltip,
  KeyboardNavigableIcon
} from '@/components/icons';
```

### 方式二：直接导入组件

```tsx
// 导入特定组件
import { HomeIcon } from '@/components/icons/HomeIcon';
import { PulsingIcon } from '@/components/icons/animated/PulsingIcon';
import { IconGrid } from '@/components/icons/display/IconGrid';
```

## 💡 基础用法

### 1. 使用基础图标

```tsx
import { HomeIcon, SearchIcon, GitHubIcon } from '@/components/icons';

export default function Navigation() {
  return (
    <nav className="flex items-center gap-6">
      {/* 首页图标 */}
      <HomeIcon size={24} variant="cyan" />

      {/* 搜索图标 */}
      <SearchIcon size={24} variant="purple" />

      {/* GitHub 图标 */}
      <GitHubIcon size={24} variant="cyan" className="hover:text-cyber-cyan" />
    </nav>
  );
}
```

### 2. 使用动画图标

```tsx
import { PulsingIcon, GlowingIcon, GlitchIcon } from '@/components/icons';

export default function AnimatedIcons() {
  return (
    <div className="flex items-center gap-6">
      {/* 脉冲效果 */}
      <PulsingIcon size={32} speed="medium" intensity="high">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      </PulsingIcon>

      {/* 发光效果 */}
      <GlowingIcon size={32} intensity="high" pulse>
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" />
      </GlowingIcon>

      {/* 故障效果 */}
      <GlitchIcon size={32} frequency="medium" intensity="medium">
        <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="2" />
      </GlitchIcon>
    </div>
  );
}
```

### 3. 使用显示组件

```tsx
import { IconGrid, IconGallery } from '@/components/icons';
import { HomeIcon, SearchIcon, SettingsIcon } from '@/components/icons';

export default function IconDisplay() {
  const icons = [
    <HomeIcon size={24} variant="cyan" />,
    <SearchIcon size={24} variant="purple" />,
    <SettingsIcon size={24} variant="pink" />
  ];

  return (
    <div>
      {/* 网格展示 */}
      <IconGrid
        icons={icons}
        columns={3}
        gap="medium"
        showLabels
        labels={["首页", "搜索", "设置"]}
      />

      {/* 分类展示 */}
      <IconGallery
        categories={[
          {
            name: "导航",
            icons: [<HomeIcon size={24} />, <SearchIcon size={24} />]
          },
          {
            name: "工具",
            icons: [<SettingsIcon size={24} />]
          }
        ]}
      />
    </div>
  );
}
```

### 4. 使用响应式图标

```tsx
import { ResponsiveIcon, AdaptiveIcon } from '@/components/icons';

export default function ResponsiveExample() {
  return (
    <div>
      {/* 断点响应式 */}
      <ResponsiveIcon
        sizeMobile={16}
        sizeTablet={20}
        sizeDesktop={24}
        sizeWide={32}
        variant="cyan"
      >
        <YourIconContent />
      </ResponsiveIcon>

      {/* 自适应图标 */}
      <AdaptiveIcon minSize={16} maxSize={48}>
        <YourIconContent />
      </AdaptiveIcon>
    </div>
  );
}
```

### 5. 使用主题图标

```tsx
import { ThemedIcon, ThemeToggleIcon } from '@/components/icons';

export default function ThemeExample() {
  return (
    <div>
      {/* 主题感知图标 */}
      <ThemedIcon
        lightColor="#0066ff"
        darkColor="#00f0ff"
        transition
      >
        <YourIconContent />
      </ThemedIcon>

      {/* 主题切换按钮 */}
      <ThemeToggleIcon
        onToggle={(isDark) => console.log('Theme:', isDark ? 'dark' : 'light')}
      />
    </div>
  );
}
```

### 6. 使用可访问性组件

```tsx
import { AccessibleIcon, IconWithTooltip } from '@/components/icons';

export default function AccessibilityExample() {
  return (
    <div>
      {/* 带 ARIA 标签的图标 */}
      <AccessibleIcon
        ariaLabel="搜索"
        description="打开搜索对话框"
        size={24}
      >
        <YourIconContent />
      </AccessibleIcon>

      {/* 带工具提示的图标 */}
      <IconWithTooltip
        tooltip="点击搜索"
        position="top"
        delay={500}
      >
        <YourIconContent />
      </IconWithTooltip>
    </div>
  );
}
```

## 🎨 配色选项

所有图标支持以下赛博朋克配色：

```tsx
import { HomeIcon } from '@/components/icons';

// 霓虹青（默认）
<HomeIcon size={24} variant="cyan" />

// 赛博紫
<HomeIcon size={24} variant="purple" />

// 激光粉
<HomeIcon size={24} variant="pink" />

// 电压黄
<HomeIcon size={24} variant="yellow" />

// 矩阵绿
<HomeIcon size={24} variant="green" />
```

## 📐 尺寸选项

推荐的图标尺寸：

```tsx
// 极小 - 12px
<Icon size={12} />

// 小 - 16px
<Icon size={16} />

// 中小 - 20px
<Icon size={20} />

// 标准 - 24px（默认）
<Icon size={24} />

// 大 - 32px
<Icon size={32} />

// 超大 - 48px
<Icon size={48} />

// 特大 - 64px
<Icon size={64} />
```

## 🎭 常见用例

### 导航栏

```tsx
import { HomeIcon, BlogIcon, PortfolioIcon, SearchIcon } from '@/components/icons';

export function Navigation() {
  return (
    <nav className="flex items-center gap-6">
      <a href="/" className="flex items-center gap-2 hover:text-cyber-cyan">
        <HomeIcon size={20} variant="cyan" />
        <span>首页</span>
      </a>
      <a href="/blog" className="flex items-center gap-2 hover:text-cyber-purple">
        <BlogIcon size={20} variant="purple" />
        <span>博客</span>
      </a>
      <a href="/portfolio" className="flex items-center gap-2 hover:text-cyber-pink">
        <PortfolioIcon size={20} variant="pink" />
        <span>作品集</span>
      </a>
      <SearchIcon size={20} variant="cyan" />
    </nav>
  );
}
```

### 社交链接

```tsx
import { GitHubIcon, TwitterIcon, LinkedInIcon, EmailIcon } from '@/components/icons';

export function SocialLinks() {
  const socials = [
    { icon: <GitHubIcon size={24} variant="cyan" />, href: "https://github.com" },
    { icon: <TwitterIcon size={24} variant="cyan" />, href: "https://twitter.com" },
    { icon: <LinkedInIcon size={24} variant="cyan" />, href: "https://linkedin.com" },
    { icon: <EmailIcon size={24} variant="yellow" />, href: "mailto:hello@example.com" }
  ];

  return (
    <div className="flex gap-4">
      {socials.map((social, index) => (
        <a
          key={index}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
```

### 按钮图标

```tsx
import { DownloadIcon, HeartIcon, ShareIcon } from '@/components/icons';

export function ActionButtons() {
  return (
    <div className="flex gap-3">
      <button className="flex items-center gap-2 px-4 py-2 bg-cyber-cyan/20 hover:bg-cyber-cyan/30 rounded-lg">
        <DownloadIcon size={18} variant="cyan" />
        <span>下载</span>
      </button>

      <button className="flex items-center gap-2 px-4 py-2 bg-cyber-pink/20 hover:bg-cyber-pink/30 rounded-lg">
        <HeartIcon size={18} variant="pink" />
        <span>喜欢</span>
      </button>

      <button className="flex items-center gap-2 px-4 py-2 bg-cyber-purple/20 hover:bg-cyber-purple/30 rounded-lg">
        <ShareIcon size={18} variant="purple" />
        <span>分享</span>
      </button>
    </div>
  );
}
```

### 加载状态

```tsx
import { LoadingIcon, PulsingIcon } from '@/components/icons';

export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* 基础加载图标 */}
      <LoadingIcon size={48} variant="cyan" animated />

      {/* 脉冲加载 */}
      <PulsingIcon size={48} speed="medium" intensity="high">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      </PulsingIcon>

      <p className="text-cyber-gray-400">加载中...</p>
    </div>
  );
}
```

### 主题切换

```tsx
import { ThemeToggleIcon } from '@/components/icons';

export function ThemeSwitcher() {
  const handleThemeToggle = (isDark: boolean) => {
    // 更新主题逻辑
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  return (
    <ThemeToggleIcon
      size={24}
      onToggle={handleThemeToggle}
    />
  );
}
```

## 🔧 自定义样式

### 使用 Tailwind 类

```tsx
import { SearchIcon } from '@/components/icons';

<SearchIcon
  size={24}
  className="text-cyber-cyan hover:text-cyber-purple transition-colors duration-200"
/>
```

### 使用内联样式

```tsx
import { HomeIcon } from '@/components/icons';

<HomeIcon
  size={24}
  color="#00f0ff"
  style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))' }}
/>
```

### 使用 CSS 变量

```tsx
import { SettingsIcon } from '@/components/icons';

<SettingsIcon
  size={24}
  style={{ color: 'var(--cyber-purple)' }}
/>
```

## 📚 更多资源

- [完整图标清单](./ICONS.md) - 查看所有可用图标
- [配色参考](./COLOR_PALETTE.md) - 完整的配色方案
- [API 文档](./GRAPHICS_USAGE_GUIDE.md) - 详细的 API 说明
- [最佳实践](./GRAPHICS_GUIDE.md) - 设计和使用建议

## 🆘 常见问题

### Q: 如何自定义图标颜色？
A: 使用 `variant` 属性或 `color` 属性：
```tsx
<Icon variant="cyan" />
<Icon color="#00f0ff" />
```

### Q: 如何添加发光效果？
A: 使用 Tailwind 阴阴类或发光组件：
```tsx
<Icon className="drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]" />
<GlowingIcon intensity="high">...</GlowingIcon>
```

### Q: 如何实现响应式图标？
A: 使用响应式组件：
```tsx
<ResponsiveIcon sizeMobile={16} sizeDesktop={24}>...</ResponsiveIcon>
```

### Q: 如何添加动画？
A: 使用动画组件或 Tailwind 动画类：
```tsx
<PulsingIcon speed="medium">...</PulsingIcon>
<Icon className="animate-pulse" />
```

### Q: 如何确保可访问性？
A: 使用可访问性组件或添加 ARIA 标签：
```tsx
<AccessibleIcon ariaLabel="搜索">...</AccessibleIcon>
<Icon aria-label="搜索" role="button" />
```

## 🎉 开始使用

现在您已经了解了基础知识，可以开始使用 CyberPress 图标库了！

如需更多帮助，请查看：
- [完整文档](./README.md)
- [示例代码](./GRAPHICS-EXAMPLES.tsx)
- [GitHub Issues](https://github.com/cyberpress/platform/issues)

---

**版本**: v3.0.0
**更新时间**: 2026-03-08
**维护者**: CyberPress 设计团队

🚀 **Happy Coding!**
