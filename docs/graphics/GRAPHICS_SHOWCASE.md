# CyberPress Platform - 图形组件展示

本页面展示了 CyberPress 平台所有可用的图形组件和效果。

## 🎨 Logo 组件

### 基础 Logo
```tsx
import { Logo } from '@/components/ui/Logo';

// 主 Logo
<Logo variant="main" size={200} />

// 横版 Logo
<Logo variant="horizontal" size={120} />

// 图标 Logo
<Logo variant="icon" size={64} />

// 带动画的 Logo
<Logo variant="main" size={200} animated />
```

### Logo 变体
- `main` - 完整 Logo（六边形设计）
- `horizontal` - 横版 Logo（导航栏使用）
- `icon` - 图标 Logo（小尺寸使用）
- `square` - 方形 Logo（社交媒体头像）

## 🎯 图标组件

### 基础图标
```tsx
import { Icon } from '@/components/ui/Icon';

<Icon name="home" size={24} color="cyan" />
<Icon name="search" size={20} color="purple" animated />
```

### 预定义图标
```tsx
import {
  HomeIcon,
  SearchIcon,
  MenuIcon,
  BlogIcon,
  PortfolioIcon,
  AboutIcon,
  GitHubIcon,
  TwitterIcon,
  LinkedInIcon,
  EmailIcon,
  CalendarIcon,
  TagIcon,
  CodeIcon,
  TerminalIcon,
  SettingsIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
} from '@/components/ui/Icon';

<HomeIcon size={24} color="cyan" />
<SearchIcon size={20} color="purple" animated />
```

### 图标颜色选项
- `cyan` - 霓虹青
- `purple` - 赛博紫
- `pink` - 激光粉
- `yellow` - 电压黄
- `green` - 霓虹绿
- `orange` - 赛博橙

## ✨ 效果组件

### 霓虹文字 (NeonText)
```tsx
import { NeonText } from '@/components/effects/NeonText';

<NeonText color="cyan" size="lg">
  霓虹发光文字
</NeonText>

<NeonText color="purple" size="xl" flicker>
  闪烁效果
</NeonText>
```

### 发光容器 (CyberGlow)
```tsx
import { CyberGlow } from '@/components/effects/CyberGlow';

<CyberGlow color="cyan" intensity="high">
  发光内容
</CyberGlow>

<CyberGlow color="purple" intensity="medium" animated>
  动画发光效果
</CyberGlow>
```

### 全息卡片 (HolographicCard)
```tsx
import { HolographicCard } from '@/components/effects/HolographicCard';

<HolographicCard intensity="medium" hover>
  <h3>全息卡片标题</h3>
  <p>全息卡片内容，带有扫描线和全息背景效果</p>
</HolographicCard>
```

### 赛博卡片 (CyberCard)
```tsx
import { CyberCard } from '@/components/effects/CyberCard';

// 默认卡片
<CyberCard>
  <h3>默认卡片</h3>
  <p>卡片内容</p>
</CyberCard>

// 霓虹边框卡片
<CyberCard variant="neon" color="cyan" hover>
  <h3>霓虹卡片</h3>
  <p>带发光边框</p>
</CyberCard>

// 全息卡片
<CyberCard variant="holographic" color="purple" hover>
  <h3>全息卡片</h3>
  <p>带全息效果</p>
</CyberCard>

// 玻璃卡片
<CyberCard variant="glass" color="pink" hover>
  <h3>玻璃卡片</h3>
  <p>毛玻璃效果</p>
</CyberCard>

// 可点击卡片
<CyberCard variant="neon" color="cyan" clickable onClick={handleClick}>
  <h3>可点击卡片</h3>
</CyberCard>
```

### 赛博边框 (CyberBorder)
```tsx
import { CyberBorder } from '@/components/effects/CyberBorder';

// 简单边框
<CyberBorder variant="simple" color="cyan">
  边框内容
</CyberBorder>

// 角落边框
<CyberBorder variant="corner" color="purple">
  角落装饰边框
</CyberBorder>

// 动画边框
<CyberBorder variant="animated" color="pink">
  动画发光边框
</CyberBorder>

// 发光边框
<CyberBorder variant="glow" color="yellow">
  强发光边框
</CyberBorder>
```

### 赛博分割线 (CyberDivider)
```tsx
import { CyberDivider } from '@/components/effects/CyberDivider';

// 实线
<CyberDivider variant="line" color="cyan" />

// 虚线
<CyberDivider variant="dashed" color="purple" label="分隔标题" />

// 点线
<CyberDivider variant="dots" color="pink" />

// 渐变
<CyberDivider variant="gradient" color="yellow" label="渐变分隔" />

// 扫描线
<CyberDivider variant="scan" color="cyan" />
```

### 赛博按钮 (CyberButton)
```tsx
import { CyberButton } from '@/components/effects/CyberButton';

// 主按钮
<CyberButton variant="primary" color="cyan">
  主按钮
</CyberButton>

// 次按钮
<CyberButton variant="secondary" color="purple">
  次按钮
</CyberButton>

// 轮廓按钮
<CyberButton variant="outline" color="pink">
  轮廓按钮
</CyberButton>

// 幽灵按钮
<CyberButton variant="ghost" color="yellow">
  幽灵按钮
</CyberButton>

// 带图标
<CyberButton
  variant="primary"
  color="cyan"
  icon={<Icon name="arrow-right" />}
  iconPosition="right"
>
  下一步
</CyberButton>

// 全宽按钮
<CyberButton variant="primary" color="cyan" fullWidth>
  全宽按钮
</CyberButton>
```

### 赛博徽章 (CyberBadge)
```tsx
import { CyberBadge } from '@/components/effects/CyberBadge';

// 实心徽章
<CyberBadge variant="solid" color="cyan">
  新功能
</CyberBadge>

// 轮廓徽章
<CyberBadge variant="outline" color="purple">
  Beta
</CyberBadge>

// 发光徽章
<CyberBadge variant="glow" color="pink">
  热门
</CyberBadge>

// 带状态点
<CyberBadge variant="solid" color="green" dot pulse>
  在线
</CyberBadge>

// 不同尺寸
<CyberBadge size="sm">小徽章</CyberBadge>
<CyberBadge size="md">中徽章</CyberBadge>
<CyberBadge size="lg">大徽章</CyberBadge>
```

## 🎨 组合示例

### 博客卡片
```tsx
<CyberCard variant="neon" color="cyan" hover clickable>
  <div className="relative h-48 bg-cyber-darker rounded-lg mb-4 overflow-hidden">
    <div className="absolute inset-0 bg-[url('/patterns/circuit.svg')] opacity-20" />
  </div>
  <div className="flex gap-2 mb-3">
    <CyberBadge variant="solid" color="cyan" size="sm">技术</CyberBadge>
    <CyberBadge variant="outline" color="purple" size="sm">教程</CyberBadge>
  </div>
  <h3 className="text-xl font-bold mb-2 text-cyber-cyan">
    <NeonText color="cyan">文章标题</NeonText>
  </h3>
  <p className="text-gray-400 mb-4">文章摘要内容...</p>
  <div className="flex items-center gap-4 text-sm text-gray-500">
    <CalendarIcon size={16} color="cyan" />
    <span>2024年3月3日</span>
    <TagIcon size={16} color="purple" />
    <span>5 标签</span>
  </div>
</CyberCard>
```

### 功能展示区
```tsx
<div className="grid md:grid-cols-3 gap-6">
  {[
    { icon: 'code', title: '现代技术栈', color: 'cyan' },
    { icon: 'zap', title: '流畅动画', color: 'purple' },
    { icon: 'globe', title: '全球部署', color: 'pink' },
  ].map((item, i) => (
    <CyberCard key={i} variant="holographic" color={item.color} hover>
      <div className="flex flex-col items-center text-center">
        <Icon name={item.icon} size={48} color={item.color} />
        <h3 className="text-xl font-bold mt-4 mb-2">
          <NeonText color={item.color}>{item.title}</NeonText>
        </h3>
        <p className="text-gray-400">功能描述内容</p>
      </div>
    </CyberCard>
  ))}
</div>
```

### Hero 区域
```tsx
<div className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* 背景效果 */}
  <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20" />
  <div className="absolute inset-0 bg-gradient-to-b from-cyber-dark to-cyber-darker" />

  {/* 内容 */}
  <div className="relative z-10 text-center">
    <Logo variant="main" size={200} animated />
    <h1 className="text-6xl font-bold mt-8">
      <NeonText color="cyan">CYBER</NeonText>
      <NeonText color="purple">PRESS</NeonText>
    </h1>
    <p className="text-xl text-gray-400 mt-4">
      赛博朋克风格的博客平台
    </p>
    <div className="flex gap-4 mt-8 justify-center">
      <CyberButton variant="primary" color="cyan" size="lg">
        开始探索
      </CyberButton>
      <CyberButton variant="outline" color="purple" size="lg">
        了解更多
      </CyberButton>
    </div>
  </div>
</div>
```

## 🎭 动画效果

所有组件都支持悬停和点击动画：

```tsx
// 悬停放大
<motion.div whileHover={{ scale: 1.05 }} />

// 悬停发光
<motion.div whileHover={{ boxShadow: '0 0 30px rgba(0, 240, 255, 0.5)' }} />

// 点击缩放
<motion.div whileTap={{ scale: 0.95 }} />

// 自定义动画
<motion.div
  animate={{
    scale: [1, 1.1, 1],
    opacity: [0.5, 1, 0.5],
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
  }}
/>
```

## 📐 响应式使用

所有组件都支持响应式设计：

```tsx
// 响应式 Logo
<Logo
  variant="horizontal"
  size={120}
  className="w-24 md:w-32 lg:w-40"
/>

// 响应式图标
<Icon
  name="home"
  size={24}
  className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8"
/>

// 响应式卡片
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <CyberCard>...</CyberCard>
</div>
```

---

**最后更新**: 2026-03-03
**维护者**: CyberPress 设计团队
