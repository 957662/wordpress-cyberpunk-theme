# CyberPress 图形系统使用指南

## 📋 目录
- [快速开始](#快速开始)
- [组件库](#组件库)
- [图标系统](#图标系统)
- [配色方案](#配色方案)
- [使用示例](#使用示例)
- [最佳实践](#最佳实践)

---

## 🚀 快速开始

### 安装依赖

```bash
npm install react framer-motion
```

### 基本导入

```tsx
// 导入图形组件
import {
  CyberPressLogo,
  CyberTechIcon,
  NeonButton,
  NeonCard,
  HolographicCard
} from '@/components/graphics';

// 导入图标
import { HomeIcon, SearchIcon, CpuIcon } from '@/components/icons';
```

---

## 🧩 组件库

### Logo 组件

```tsx
import { CyberPressLogo } from '@/components/graphics';

// 霓虹版本
<CyberPressLogo variant="neon" size={200} />

// 极简版本
<CyberPressLogo variant="minimal" size={150} />

// 动画版本
<CyberPressLogo variant="animated" size={200} />
```

### 按钮

```tsx
import { NeonButton } from '@/components/graphics';

<NeonButton variant="cyan" size="md" onClick={handleClick}>
  点击我
</NeonButton>

// 可用变体: cyan, purple, pink, yellow
// 可用尺寸: sm, md, lg
```

### 卡片

```tsx
import { NeonCard, HolographicCard } from '@/components/graphics';

// 霓虹卡片
<NeonCard variant="cyan" glow>
  <h3>标题</h3>
  <p>内容</p>
</NeonCard>

// 全息卡片
<HolographicCard hover>
  <h3>全息效果</h3>
  <p>内容</p>
</HolographicCard>
```

### 文本效果

```tsx
import { NeonText } from '@/components/graphics';

<NeonText variant="cyan" size="xl" intensity="high">
  霓虹文字
</NeonText>
```

### 发光容器

```tsx
import { CyberGlow } from '@/components/graphics';

<CyberGlow color="purple" intensity="medium">
  <div>发光内容</div>
</CyberGlow>
```

### 加载器

```tsx
import { CyberLoader } from '@/components/graphics';

<CyberLoader size={48} color="cyan" />
```

---

## 🎨 图标系统

### 基础图标

```tsx
import { HomeIcon, SearchIcon, UserIcon } from '@/components/icons';

<HomeIcon size={24} />
<SearchIcon size={24} variant="purple" />
<UserIcon size={32} variant="cyan" animated={true} />
```

### 赛博科技图标

```tsx
import { CyberTechIcon } from '@/components/graphics';

<CyberTechIcon name="cpu" size={48} animated />
<CyberTechIcon name="neural" size={48} animated />
<CyberTechIcon name="dataflow" size={48} animated />
```

### 可用图标类型

#### 导航图标
- HomeIcon, MenuIcon, ArrowIcon, ChevronIcon

#### 功能图标
- SearchIcon, EditIcon, TrashIcon, SaveIcon, DownloadIcon

#### 社交图标
- GitHubIcon, TwitterIcon, LinkedInIcon, EmailIcon

#### 技术图标
- CodeIcon, TerminalIcon, DatabaseIcon, ServerIcon

#### 赛博科技图标 (新增)
- cpu, neural, dataflow, grid, eye, shield

---

## 🌈 配色方案

### Tailwind 类名

```tsx
// 颜色类
className="text-cyber-cyan"
className="bg-cyber-dark"
className="border-cyber-purple"

// 发光效果
className="shadow-neon-cyan"
className="drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"

// 渐变背景
className="bg-gradient-neon"
className="bg-gradient-heat"
```

### CSS 变量

```css
color: var(--cyber-cyan);
background: var(--cyber-dark);
border-color: var(--cyber-purple);
```

---

## 💡 使用示例

### 导航栏

```tsx
import { CyberPressLogo, HomeIcon, SearchIcon, GitHubIcon } from '@/components/graphics';

<nav className="flex items-center justify-between p-4 bg-cyber-dark border-b border-cyber-gray">
  <CyberPressLogo variant="neon" size={150} />

  <div className="flex items-center gap-6">
    <a href="/" className="flex items-center gap-2 text-cyber-cyan hover:text-cyber-purple">
      <HomeIcon size={20} />
      <span>首页</span>
    </a>
    <SearchIcon size={20} className="text-cyber-gray-200 cursor-pointer hover:text-cyber-cyan" />
    <GitHubIcon size={20} className="text-cyber-gray-200 cursor-pointer hover:text-cyber-cyan" />
  </div>
</nav>
```

### 英雄区卡片

```tsx
import { NeonCard, NeonText, CyberTechIcon } from '@/components/graphics';

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
  <NeonCard variant="cyan" glow>
    <CyberTechIcon name="cpu" size={48} />
    <NeonText variant="cyan" size="lg" intensity="high">
      高性能
    </NeonText>
    <p className="text-cyber-gray-200 mt-2">
      基于 Next.js 14 构建，提供极致性能
    </p>
  </NeonCard>

  <NeonCard variant="purple" glow>
    <CyberTechIcon name="neural" size={48} />
    <NeonText variant="purple" size="lg" intensity="high">
      AI 驱动
    </NeonText>
    <p className="text-cyber-gray-200 mt-2">
      智能内容生成与推荐系统
    </p>
  </NeonCard>

  <NeonCard variant="pink" glow>
    <CyberTechIcon name="shield" size={48} />
    <NeonText variant="pink" size="lg" intensity="high">
      安全可靠
    </NeonText>
    <p className="text-cyber-gray-200 mt-2">
      企业级安全保障，数据加密存储
    </p>
  </NeonCard>
</div>
```

### 博客文章卡片

```tsx
import { HolographicCard, CalendarIcon, TagIcon, UserIcon } from '@/components/graphics';

<HolographicCard hover>
  <img src="/post-cover.jpg" alt="Cover" className="w-full h-48 object-cover rounded-lg mb-4" />

  <div className="flex items-center gap-4 text-sm text-cyber-gray-200 mb-2">
    <CalendarIcon size={16} />
    <span>2026-03-06</span>
    <UserIcon size={16} />
    <span>Admin</span>
  </div>

  <h3 className="text-xl font-bold text-cyber-cyan mb-2">
    文章标题
  </h3>

  <p className="text-cyber-gray-200 mb-4">
    文章摘要内容...
  </p>

  <div className="flex items-center gap-2">
    <TagIcon size={16} />
    <span className="text-sm text-cyber-purple">技术</span>
  </div>
</HolographicCard>
```

### 按钮组

```tsx
import { NeonButton } from '@/components/graphics';

<div className="flex gap-4">
  <NeonButton variant="cyan" size="md">
    主要操作
  </NeonButton>
  <NeonButton variant="purple" size="md">
    次要操作
  </NeonButton>
  <NeonButton variant="pink" size="md">
    危险操作
  </NeonButton>
</div>
```

---

## 🎯 最佳实践

### ✅ 推荐做法

1. **保持一致性**
   - 使用统一的配色方案
   - 保持图标大小一致
   - 遵循设计规范

2. **性能优化**
   - 使用 SVG 格式图标
   - 按需导入组件
   - 优化动画性能

3. **可访问性**
   - 添加适当的 alt 文本
   - 确保足够的对比度
   - 支持键盘导航

4. **响应式设计**
   - 使用相对单位
   - 适配移动端显示
   - 优化触摸目标大小

### ❌ 避免做法

1. 不要过度使用发光效果
2. 不要混用过多颜色
3. 不要忽略深色模式适配
4. 不要创建过小的可点击元素

---

## 📚 相关资源

- [完整配色参考](./COLOR_PALETTE_COMPLETE.md)
- [图标清单 v2.0](./ICON_MANIFEST_V2.md)
- [组件 API 文档](./COMPONENT_API.md)
- [设计原则](./DESIGN_PRINCIPLES.md)

---

**文档版本**: v2.0.0
**最后更新**: 2026-03-06
**维护者**: CyberPress 设计团队
