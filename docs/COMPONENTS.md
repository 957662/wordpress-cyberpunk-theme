# 🧩 组件使用指南

本文档介绍 CyberPress Platform 中所有可用的 UI 组件及其使用方法。

---

## 📦 目录

- [基础组件](#基础组件)
- [表单组件](#表单组件)
- [布局组件](#布局组件)
- [反馈组件](#反馈组件)
- [展示组件](#展示组件)
- [特效组件](#特效组件)

---

## 基础组件

### Button 按钮

多功能的按钮组件，支持多种变体和尺寸。

#### 导入

```tsx
import { Button } from '@/components/ui/Button';
```

#### 基础用法

```tsx
<Button>默认按钮</Button>
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="danger">危险按钮</Button>
```

#### 不同尺寸

```tsx
<Button size="sm">小按钮</Button>
<Button size="md">默认按钮</Button>
<Button size="lg">大按钮</Button>
```

#### 结合图标

```tsx
import { ArrowRight } from 'lucide-react';

<Button>
  <span>查看详情</span>
  <ArrowRight className="w-4 h-4 ml-2" />
</Button>
```

#### API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' | 'primary' | 按钮变体 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 按钮尺寸 |
| disabled | boolean | false | 是否禁用 |
| onClick | () => void | - | 点击事件 |

---

### Card 卡片

卡片组件，支持多种视觉效果。

#### 导入

```tsx
import { Card } from '@/components/ui/Card';
```

#### 基础用法

```tsx
<Card>
  <h3>卡片标题</h3>
  <p>卡片内容</p>
</Card>
```

#### 不同变体

```tsx
<Card variant="default">默认卡片</Card>
<Card variant="glass">玻璃卡片</Card>
<Card variant="hologram">全息卡片</Card>
<Card variant="neon">霓虹卡片</Card>
```

#### 悬停效果

```tsx
<Card hover>
  <h3>可交互卡片</h3>
  <p>鼠标悬停时会上浮</p>
</Card>
```

#### API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'default' \| 'glass' \| 'hologram' \| 'neon' | 'default' | 卡片变体 |
| hover | boolean | false | 是否有悬停效果 |
| onClick | () => void | - | 点击事件 |

---

### Badge 徽章

用于显示状态或标签的徽章组件。

#### 导入

```tsx
import { Badge } from '@/components/ui/Badge';
```

#### 基础用法

```tsx
<Badge>默认</Badge>
<Badge variant="primary">主要</Badge>
<Badge variant="secondary">次要</Badge>
<Badge variant="success">成功</Badge>
<Badge variant="warning">警告</Badge>
<Badge variant="danger">危险</Badge>
```

#### 不同尺寸

```tsx
<Badge size="sm">小徽章</Badge>
<Badge size="md">默认徽章</Badge>
<Badge size="lg">大徽章</Badge>
```

---

## 表单组件

### Input 输入框

文本输入框组件。

#### 导入

```tsx
import { Input } from '@/components/ui/Input';
```

#### 基础用法

```tsx
<Input placeholder="请输入内容" />
```

#### 带标签

```tsx
<Input label="用户名" placeholder="请输入用户名" />
```

#### 错误状态

```tsx
<Input
  label="邮箱"
  type="email"
  error="请输入有效的邮箱地址"
/>
```

#### API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| label | string | - | 输入框标签 |
| error | string | - | 错误提示信息 |
| type | string | 'text' | 输入类型 |
| placeholder | string | - | 占位文本 |
| value | string | - | 输入值 |
| onChange | (e: ChangeEvent) => void | - | 变化事件 |

---

### SearchBar 搜索栏

带防抖功能的搜索栏组件。

#### 导入

```tsx
import { SearchBar } from '@/components/ui/SearchBar';
```

#### 基础用法

```tsx
<SearchBar onSearch={(query) => console.log(query)} />
```

#### 自定义占位符

```tsx
<SearchBar
  placeholder="搜索文章..."
  onSearch={handleSearch}
/>
```

---

## 布局组件

### Header 导航栏

响应式网站头部导航。

#### 导入

```tsx
import { Header } from '@/components/layout/Header';
```

#### 使用方法

在根布局中使用:

```tsx
// app/layout.tsx
import { Header } from '@/components/layout/Header';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

#### 导航配置

编辑 `components/layout/Header.tsx` 中的 `navItems` 数组:

```tsx
const navItems = [
  { name: '首页', href: '/', icon: Home },
  { name: '博客', href: '/blog', icon: BookOpen },
  // 添加更多导航项
];
```

---

### Footer 页脚

网站页脚组件。

#### 导入

```tsx
import { Footer } from '@/components/layout/Footer';
```

#### 使用方法

```tsx
<Footer />
```

---

## 反馈组件

### LoadingSpinner 加载动画

加载状态指示器。

#### 导入

```tsx
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
```

#### 基础用法

```tsx
<LoadingSpinner />
<LoadingSpinner size="lg" color="purple" />
```

#### 全屏遮罩

```tsx
<LoadingOverlay message="加载中..." />
```

#### API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | 'sm' \| 'md' \| 'lg' | 'md' | 尺寸 |
| color | 'cyan' \| 'purple' \| 'pink' | 'cyan' | 颜色 |
| message | string | '加载中...' | 提示信息 (仅 Overlay) |

---

### Alert 警告提示

用于显示重要信息。

#### 导入

```tsx
import { Alert } from '@/components/ui/Alert';
```

#### 基础用法

```tsx
<Alert variant="info">这是一条信息</Alert>
<Alert variant="success">操作成功</Alert>
<Alert variant="warning">警告信息</Alert>
<Alert variant="danger">错误信息</Alert>
```

---

## 展示组件

### BlogCard 博客卡片

文章卡片展示组件。

#### 导入

```tsx
import { BlogCard } from '@/components/blog/BlogCard';
```

#### 基础用法

```tsx
import type { WPPost } from '@/lib/wordpress/client';

function BlogList({ posts }: { posts: WPPost[] }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {posts.map((post, index) => (
        <BlogCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}
```

#### API

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| post | WPPost | - | 文章数据 |
| variant | 'default' \| 'compact' \| 'featured' | 'default' | 显示变体 |
| index | number | 0 | 索引（用于动画延迟） |

---

## 特效组件

### GlitchText 故障文字

赛博朋克风格的故障文字效果。

#### 导入

```tsx
import { GlitchText } from '@/components/effects/GlitchText';
```

#### 基础用法

```tsx
<GlitchText text="CYBERPRESS" />
```

#### 自定义样式

```tsx
<GlitchText
  text="自定义文字"
  className="text-4xl font-bold"
/>
```

---

## 🎨 样式指南

### 颜色类

```tsx
// 文字颜色
<span className="text-cyber-cyan">霓虹青</span>
<span className="text-cyber-purple">赛博紫</span>
<span className="text-cyber-pink">激光粉</span>

// 背景颜色
<div className="bg-cyber-dark">深空黑背景</div>
<div className="bg-cyber-card">卡片背景</div>

// 边框颜色
<div className="border-cyber-cyan">青色边框</div>
<div className="border-cyber-purple">紫色边框</div>
```

### 发光效果

```tsx
// 文字发光
<h1 className="text-glow-cyan">发光标题</h1>

// 边框发光
<div className="border-glow-cyan">发光边框</div>
```

### 动画类

```tsx
// 悬停效果
<div className="hover:scale-105 hover:rotate-3">变换</div>

// 过渡动画
<div className="transition-all duration-300">平滑过渡</div>
```

---

## 💡 使用技巧

### 1. 组合组件

```tsx
<Card hover>
  <div className="p-6">
    <Badge variant="primary" size="sm">新</Badge>
    <h3 className="mt-2">卡片标题</h3>
    <p className="text-gray-400 mt-2">卡片内容</p>
    <Button className="mt-4" size="sm">
      查看详情
    </Button>
  </div>
</Card>
```

### 2. 响应式布局

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>
```

### 3. 添加动画

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <Card>带动画的卡片</Card>
</motion.div>
```

---

## 📚 更多资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Lucide 图标库](https://lucide.dev/)

---

<div align="center">

**Happy Coding! 🎨**

</div>
