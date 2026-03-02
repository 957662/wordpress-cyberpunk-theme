# CyberPress Platform - 组件文档

## UI 组件库

### 基础组件

#### Button
按钮组件，支持多种变体和尺寸。

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="md" isLoading={false}>
  点击我
</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `loadingText`: string
- `leftIcon`: React.ReactNode
- `rightIcon`: React.ReactNode
- `fullWidth`: boolean

#### Card
卡片组件，用于内容分组。

```tsx
import { Card } from '@/components/ui/Card';

<Card className="p-6">
  <CardHeader>标题</CardHeader>
  <CardContent>内容</CardContent>
</Card>
```

#### Input
输入框组件。

```tsx
import { Input } from '@/components/ui/Input';

<Input
  type="text"
  placeholder="请输入..."
  label="用户名"
  error="错误信息"
/>
```

### 特效组件

#### GlitchText
故障文字效果。

```tsx
import { GlitchText } from '@/components/effects/GlitchText';

<GlitchText text="CYBERPRESS" speed="normal" />
```

**Props:**
- `text`: string - 显示文本
- `className`: string
- `speed`: 'slow' | 'normal' | 'fast'

#### TypewriterText
打字机效果。

```tsx
import { TypewriterText } from '@/components/effects/TypewriterText';

<TypewriterText
  texts={['文本1', '文本2', '文本3']}
  speed={50}
  cursor={true}
/>
```

**Props:**
- `texts`: string[] - 文本数组
- `speed`: number - 打字速度（毫秒）
- `delay`: number - 初始延迟
- `cursor`: boolean - 显示光标
- `onComplete`: () => void

#### ParticleBackground
粒子背景效果。

```tsx
import { ParticleBackground } from '@/components/effects/ParticleBackground';

<ParticleBackground count={50} color="cyan" speed="normal" />
```

**Props:**
- `count`: number - 粒子数量
- `color`: 'cyan' | 'purple' | 'pink'
- `speed`: 'slow' | 'normal' | 'fast'

### 功能组件

#### CyberGrid
赛博网格背景。

```tsx
import { CyberGrid } from '@/components/features';

<CyberGrid color="cyan" density="medium" animation={true} />
```

#### DataStream
数据流动画。

```tsx
import { DataStream } from '@/components/features';

<DataStream direction="down" speed={2} density={20} color="cyan" />
```

#### HexagonGrid
六边形网格。

```tsx
import { HexagonGrid } from '@/components/features';

<HexagonGrid size={30} gap={2} interactive={true} />
```

#### CircuitBoard
电路板效果。

```tsx
import { CircuitBoard } from '@/components/features';

<CircuitBoard density="medium" animation={true} />
```

## 布局组件

### Header
网站头部导航。

```tsx
import { Header } from '@/components/layout/Header';

<Header />
```

### Footer
网站页脚。

```tsx
import { Footer } from '@/components/layout/Footer';

<Footer />
```

## 图标组件

所有图标从 `@/components/icons` 导入。

```tsx
import {
  Logo,
  MenuIcon,
  SearchIcon,
  GitHubIcon,
  TwitterIcon,
} from '@/components/icons';

<Logo className="w-8 h-8" />
<MenuIcon className="w-6 h-6" />
```

## 样式系统

### 颜色

```tsx
// 赛博朋克配色
bg-cyber-dark      // #0a0a0f
bg-cyber-cyan      // #00f0ff
bg-cyber-purple    // #9d00ff
bg-cyber-pink      // #ff0080
bg-cyber-yellow    // #f0ff00
bg-cyber-green     // #00ff88
```

### 工具类

```tsx
// 霓虹发光
text-glow-cyan
border-glow-purple

// 扫描线
scanlines

// 故障效果
glitch
```

### 动画

```tsx
// Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

## 主题定制

### 修改颜色

编辑 `tailwind.config.ts`:

```ts
colors: {
  cyber: {
    dark: '#0a0a0f',
    cyan: '#00f0ff',
    // ...
  }
}
```

### 修改动画

编辑 `globals.css`:

```css
@keyframes custom-animation {
  /* 动画定义 */
}
```

## 最佳实践

### 组件开发

1. 使用 TypeScript 定义 Props 接口
2. 添加 `'use client'` 指令（如果需要客户端交互）
3. 使用 `cn` 工具函数合并类名
4. 支持常用的 Props（className, children 等）

### 性能优化

1. 使用 `dynamic` 导入重型组件
2. 添加 `loading` 和 `suspense` 边界
3. 使用 React.memo 避免不必要的重渲染
4. 优化图片加载（使用 Next.js Image 组件）

### 可访问性

1. 添加适当的 ARIA 属性
2. 确保键盘导航可用
3. 提供足够的颜色对比度
4. 添加 focus 状态样式

---

**最后更新**: 2026-03-03
**维护者**: CyberPress Team
