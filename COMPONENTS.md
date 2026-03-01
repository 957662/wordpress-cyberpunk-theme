# CyberPress 组件库文档

## 📦 组件总览

CyberPress 平台提供了完整的赛博朋克风格组件库，分为以下几个类别：

### 🎨 特效组件 (Effects)
- `GlitchText` - 故障文字效果
- `NeonBorder` - 霓虹发光边框
- `TypewriterText` - 打字机效果
- `ParticleBackground` - 粒子背景
- `HologramCard` - 3D 全息卡片
- `MatrixRain` - Matrix 代码雨
- `CyberGrid` - 赛博网格背景
- `Scanlines` - CRT 扫描线效果
- `GlowOrb` - 发光球体
- `TextScramble` - 文字乱码解密

### 🧩 Widget 组件
- `Widget` - Widget 基础组件
- `RecentPostsWidget` - 最新文章 Widget
- `TagCloudWidget` - 标签云 Widget
- `CategoryWidget` - 分类 Widget
- `SearchWidget` - 搜索 Widget
- `AuthorWidget` - 作者信息 Widget

### 🎛️ UI 组件
- `Button` - 按钮
- `Card` - 卡片
- `Input` - 输入框
- `Badge` - 徽章
- `Modal` - 模态框
- `Avatar` - 头像
- `Dropdown` - 下拉菜单
- `Tabs` - 标签页
- `Divider` - 分割线
- `Chip` - 芯片标签
- `Progress` - 进度条
- `CircularProgress` - 圆形进度条
- `Timeline` - 时间线
- `Accordion` - 手风琴
- `Rating` - 评分组件
- `Carousel` - 轮播图
- `Skeleton` - 骨架屏
- `Table` - 表格
- `CodeBlock` - 代码块
- `Toast` - 提示框
- `Tooltip` - 工具提示

## 🚀 快速开始

### 导入组件

```typescript
// 导入 UI 组件
import { Button, Card, Avatar } from '@/components/ui';

// 导入特效组件
import { GlitchText, NeonBorder } from '@/components/effects';

// 导入 Widget 组件
import { RecentPostsWidget, TagCloudWidget } from '@/components/widgets';
```

### 基础使用

#### Button 按钮

```tsx
import { Button } from '@/components/ui';

export default function Example() {
  return (
    <Button variant="primary" size="md">
      点击我
    </Button>
  );
}
```

#### Card 卡片

```tsx
import { Card } from '@/components/ui';

export default function Example() {
  return (
    <Card className="p-6">
      <h3>卡片标题</h3>
      <p>卡片内容</p>
    </Card>
  );
}
```

#### Avatar 头像

```tsx
import { Avatar } from '@/components/ui';

export default function Example() {
  return (
    <div>
      <Avatar src="/avatar.jpg" alt="用户头像" size="lg" bordered />
      <Avatar initials="AB" size="md" online />
    </div>
  );
}
```

#### GlitchText 故障文字

```tsx
import { GlitchText } from '@/components/effects';

export default function Example() {
  return <GlitchText text="CYBERPRESS" />;
}
```

#### RecentPostsWidget 最新文章

```tsx
import { RecentPostsWidget } from '@/components/widgets';

export default function Example() {
  const posts = [
    {
      id: 1,
      title: { rendered: '文章标题' },
      slug: 'post-slug',
      date: '2024-01-01',
    },
  ];

  return <RecentPostsWidget posts={posts} count={5} showDate />;
}
```

## 🎨 主题定制

### 颜色系统

所有组件支持以下赛博朋克主题色：

- `cyan` - 霓虹青 (#00f0ff)
- `purple` - 赛博紫 (#9d00ff)
- `pink` - 激光粉 (#ff0080)
- `yellow` - 电压黄 (#f0ff00)
- `green` - 赛博绿 (#00ff88)
- `orange` - 橙色 (#ff6600)

### 使用示例

```tsx
<Button color="purple">紫色按钮</Button>
<NeonBorder color="pink">粉色边框</NeonBorder>
<Progress color="cyan" value={75} />
```

## 📐 组件尺寸

大多数组件支持以下尺寸：

- `sm` - 小号
- `md` - 中号（默认）
- `lg` - 大号
- `xl` - 超大号

### 使用示例

```tsx
<Button size="sm">小按钮</Button>
<Button size="lg">大按钮</Button>
<Avatar size="xl" />
```

## 🎭 组件变体

组件通常支持多种变体样式：

```tsx
<Button variant="primary">主要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
```

## 🎬 动画效果

所有组件使用 Framer Motion 实现流畅动画：

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  内容
</motion.div>
```

## 🔧 TypeScript 支持

所有组件都有完整的 TypeScript 类型定义：

```typescript
import type { ButtonProps, CardProps } from '@/components/ui';
```

## 📱 响应式设计

所有组件完全响应式，支持移动端和桌面端：

```tsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>...</Card>
</div>
```

## 🌐 演示页面

访问以下页面查看组件演示：

- `/widgets-demo` - Widget 组件演示
- `/effects-demo` - 特效组件演示
- `/components-demo` - UI 组件演示

## 📖 最佳实践

### 1. 组件组合

```tsx
<Card className="p-6">
  <GlitchText text="标题" />
  <Divider />
  <p>内容</p>
</Card>
```

### 2. 条件渲染

```tsx
{isLoading ? (
  <Skeleton />
) : (
  <Card>{data}</Card>
)}
```

### 3. 错误处理

```tsx
{error ? (
  <div className="text-cyber-pink">加载失败</div>
) : (
  <Children />
)}
```

## 🎯 性能优化

### 懒加载组件

```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
});
```

### 图片优化

```tsx
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="描述"
  width={800}
  height={600}
  priority
/>
```

## 🔗 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

## 📝 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 30+ UI 组件
- 10+ 特效组件
- 6+ Widget 组件
- 完整 TypeScript 支持

---

**开发者**: CyberPress Team
**许可证**: MIT
