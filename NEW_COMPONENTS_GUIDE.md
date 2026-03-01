# CyberPress Platform - 新组件使用指南

本文档介绍新创建的组件的使用方法和最佳实践。

---

## 📖 目录

1. [布局组件](#布局组件)
2. [博客组件](#博客组件)
3. [特效组件](#特效组件)
4. [作品集组件](#作品集组件)
5. [认证组件](#认证组件)
6. [管理后台组件](#管理后台组件)
7. [自定义 Hooks](#自定义-hooks)
8. [工具函数](#工具函数)

---

## 布局组件

### Navbar - 导航栏

响应式导航栏组件，支持桌面端和移动端。

```tsx
import { Navbar } from '@/components/layout';

<Navbar />
```

**特性**:
- 自动高亮当前路由
- 暗色/亮色主题切换
- 移动端汉堡菜单
- 社交媒体链接
- 平滑滚动

---

## 博客组件

### PostCard - 文章卡片

```tsx
import { PostCard } from '@/components/blog';

<PostCard
  id="1"
  slug="hello-world"
  title="欢迎来到 CyberPress"
  excerpt="这是文章摘要..."
  date="2026-03-02"
  readTime="5 分钟"
  category="公告"
  tags={['Next.js', 'React']}
  author={{ name: '作者名' }}
  views={1000}
  likes={50}
/>
```

**Props**:
- `variant`: `'default' | 'featured' | 'compact'`
- `featuredImage`: 特色图片 URL
- `className`: 自定义类名

### PostGrid - 文章网格

```tsx
import { PostGrid } from '@/components/blog';

<PostGrid
  posts={posts}
  layout="grid"
  columns={3}
  featured
  gap={6}
/>
```

**Props**:
- `layout`: `'grid' | 'masonry' | 'list'`
- `columns`: `1 | 2 | 3 | 4`
- `featured`: 首篇文章是否为特色
- `filter`: 标签筛选

### CommentSystem - 评论系统

```tsx
import { CommentSystem } from '@/components/blog';

<CommentSystem
  postId="123"
  comments={comments}
/>
```

**Props**:
- `comments`: 评论数组
- `className`: 自定义类名

### TagList - 标签列表

```tsx
import { TagList, TagCloud } from '@/components/blog';

// 标准列表
<TagList
  tags={['React', 'Next.js', 'TypeScript']}
  selectedTag="React"
  variant="default"
/>

// 标签云
<TagCloud
  tags={['React', 'Next.js', 'TypeScript']}
  selectedTag="React"
/>
```

**Props**:
- `variant`: `'default' | 'pill' | 'cloud'`
- `selectedTag`: 当前选中的标签

### CategoryList - 分类列表

```tsx
import { CategoryList } from '@/components/blog';

<CategoryList
  categories={[
    { name: '技术', slug: 'tech', count: 10 },
    { name: '设计', slug: 'design', count: 5 },
  ]}
  selectedCategory="tech"
  variant="grid"
/>
```

**Props**:
- `variant`: `'list' | 'grid' | 'inline'`
- `selectedCategory`: 当前选中的分类

---

## 特效组件

### GlitchText - 故障文字

```tsx
import { GlitchText } from '@/components/effects';

<GlitchText
  text="HELLO WORLD"
  intensity="medium"
  colors={['#00f0ff', '#9d00ff', '#ff0080']}
  onHover
/>
```

**Props**:
- `intensity`: `'low' | 'medium' | 'high'`
- `speed`: 动画速度（毫秒）
- `onHover`: 悬停时触发

### NeonBorder - 霓虹边框

```tsx
import { NeonBorder } from '@/components/effects';

<NeonBorder
  color="cyan"
  intensity="medium"
  animated
  glow
>
  <div>内容</div>
</NeonBorder>
```

**Props**:
- `color`: `'cyan' | 'purple' | 'pink' | 'yellow' | 'green'`
- `intensity`: `'low' | 'medium' | 'high'`
- `animated`: 是否动画
- `glow`: 是否发光

### ScanLines - 扫描线

```tsx
import { ScanLines, CRTScreen } from '@/components/effects';

// 独立使用
<ScanLines opacity={0.1} speed={8} />

// CRT 屏幕
<CRTScreen>
  <div>内容</div>
</CRTScreen>
```

**Props**:
- `opacity`: 透明度 (0-1)
- `speed`: 扫描速度（秒）
- `color`: 线条颜色

### MatrixRain - 数字雨

```tsx
import { MatrixRain } from '@/components/effects';

<MatrixRain
  color="#00f0ff"
  fontSize={14}
  speed={50}
/>
```

**Props**:
- `color`: 字符颜色
- `fontSize`: 字体大小
- `speed`: 下落速度

### ParticleSystem - 粒子系统

```tsx
import { ParticleSystem } from '@/components/effects';

<ParticleSystem
  count={50}
  colors={['#00f0ff', '#9d00ff']}
  connectionDistance={150}
  mouseInteraction
/>
```

**Props**:
- `count`: 粒子数量
- `colors`: 粒子颜色数组
- `connectionDistance`: 连线距离
- `mouseInteraction`: 鼠标交互

---

## 作品集组件

### ProjectCard - 项目卡片

```tsx
import { ProjectCard } from '@/components/portfolio';

<ProjectCard
  id="1"
  slug="my-project"
  title="我的项目"
  description="项目描述..."
  tags={['React', 'Next.js']}
  links={{
    demo: 'https://demo.example.com',
    github: 'https://github.com/user/repo',
  }}
  stars={100}
  forks={20}
  status="completed"
/>
```

**Props**:
- `status`: `'completed' | 'in-progress' | 'planned'`
- `featured`: 特色项目

### ProjectGrid - 项目网格

```tsx
import { ProjectGrid } from '@/components/portfolio';

<ProjectGrid
  projects={projects}
  layout="grid"
  columns={3}
  filter="react"
/>
```

**Props**:
- `layout`: `'grid' | 'masonry'`
- `columns`: `1 | 2 | 3 | 4`
- `filter`: 标签筛选

---

## 认证组件

### LoginForm - 登录表单

```tsx
import { LoginForm } from '@/components/auth';

<LoginForm
  onSuccess={() => router.push('/admin')}
  onError={(error) => console.error(error)}
/>
```

**Props**:
- `onSuccess`: 登录成功回调
- `onError`: 登录失败回调

---

## 管理后台组件

### DashboardLayout - 管理后台布局

```tsx
import { DashboardLayout } from '@/components/admin';

<DashboardLayout>
  <div>页面内容</div>
</DashboardLayout>
```

### StatsCard - 统计卡片

```tsx
import { StatsCard } from '@/components/admin';
import { FileText } from 'lucide-react';

<StatsCard
  title="总文章数"
  value="128"
  change={12}
  icon={FileText}
  trend="up"
/>
```

**Props**:
- `trend`: `'up' | 'down' | 'neutral'`
- `change`: 变化百分比

---

## 自定义 Hooks

### useInView - 视口检测

```tsx
import { useInView } from '@/components';

const { ref, isInView, hasEnteredView } = useInView({
  threshold: 0.5,
  triggerOnce: true,
});

<div ref={ref}>
  {isInView && '内容已进入视口'}
</div>
```

### useKeyboard - 键盘快捷键

```tsx
import { useKeyboard, useEscape } from '@/components';

useKeyboard([
  {
    key: 'k',
    ctrlKey: true,
    handler: () => console.log('Ctrl+K'),
  },
]);

useEscape(() => console.log('Escape pressed'));
```

---

## 工具函数

### Markdown - Markdown 渲染

```tsx
import { Markdown } from '@/lib/utils';

<Markdown content="# Hello World" className="prose" />
```

**特性**:
- 语法高亮
- GFM 支持
- 自定义样式

---

## 🎨 样式类名

### 卡片样式
```tsx
<div className="cyber-card">默认卡片</div>
<div className="cyber-card featured">特色卡片</div>
```

### 发光文字
```tsx
<h1 className="text-glow-cyan">青色发光</h1>
<h1 className="text-glow-purple">紫色发光</h1>
<h1 className="text-glow-pink">粉色发光</h1>
```

### 动画
```tsx
<div className="animate-glow">发光动画</div>
<div className="animate-float">浮动动画</div>
<div className="animate-scan">扫描动画</div>
```

---

## 📝 最佳实践

### 1. 组件组合

```tsx
// ✅ 推荐：使用组件组合
<PostGrid posts={posts} />

// ❌ 避免：手动渲染
{posts.map(post => <PostCard key={post.id} {...post} />)}
```

### 2. 类型安全

```tsx
// ✅ 推荐：使用导出的类型
import type { PostCardProps } from '@/components/blog';

const post: PostCardProps = { ... };
```

### 3. 性能优化

```tsx
// ✅ 推荐：使用骨架屏
<PostSkeleton count={6} />

// ✅ 推荐：延迟加载
const { ref, isInView } = useInView({ triggerOnce: true });
```

### 4. 无障碍访问

```tsx
// ✅ 推荐：添加 ARIA 属性
<button aria-label="关闭菜单">
  <X />
</button>
```

---

## 🔧 故障排除

### 问题：动画卡顿

**解决方案**:
```tsx
// 使用 will-change
<div style={{ willChange: 'transform, opacity' }}>
```

### 问题：样式不生效

**解决方案**:
```tsx
// 使用 cn() 合并类名
import { cn } from '@/lib/utils';

<div className={cn('base-class', conditional && 'conditional-class')} />
```

---

## 📚 更多资源

- [项目 README](./README.md)
- [开发指南](./DEVELOPMENT.md)
- [组件文档](./COMPONENTS.md)
- [API 文档](./docs/API.md)

---

**最后更新**: 2026-03-02
**版本**: 1.0.0
