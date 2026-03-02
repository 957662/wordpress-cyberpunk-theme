# 快速开始 - 新创建的组件

## 🎨 Home 组件使用指南

### HeroSection - 首页英雄区域

```tsx
import { HeroSection } from '@/components/home';

export default function Home() {
  return (
    <HeroSection
      title="探索赛博朋克世界"
      subtitle="未来已来，触手可及"
      description="融合前沿技术与创意设计"
      primaryCta={{ text: '开始探索', href: '/blog' }}
      secondaryCta={{ text: '查看作品', href: '/portfolio' }}
      showParticles={true}
    />
  );
}
```

### FeaturesSection - 功能特性展示

```tsx
import { FeaturesSection } from '@/components/home';

const features = [
  {
    icon: Code2,
    title: '现代化技术栈',
    description: 'Next.js 14 + TypeScript',
    color: 'cyan',
  },
  // ... 更多特性
];

<FeaturesSection
  title="核心特性"
  subtitle="打造现代化体验"
  features={features}
/>
```

### StatsSection - 统计数据展示

```tsx
import { StatsSection } from '@/components/home';

const stats = [
  {
    icon: FileText,
    value: 150,
    suffix: '+',
    label: '文章发布',
    color: 'cyan',
  },
  // ... 更多统计
];

<StatsSection stats={stats} />
```

## 🧭 Navigation 组件

### Breadcrumb - 面包屑导航

```tsx
import { Breadcrumb } from '@/components/navigation';

<Breadcrumb
  items={[
    { label: '博客', href: '/blog' },
    { label: '前端开发', href: '/blog?category=frontend' },
    { label: 'Next.js 14 指南' } // 当前页面
  ]}
/>
```

### Pagination - 分页导航

```tsx
import { Pagination } from '@/components/navigation';

<Pagination
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => console.log(page)}
  showFirstLast={true}
  maxVisiblePages={5}
/>
```

## 🎯 Common 组件

### Button - 按钮

```tsx
import { Button } from '@/components/common';

// 主要按钮
<Button variant="primary" size="lg">
  点击我
</Button>

// 次要按钮
<Button variant="secondary" icon={<Icon />}>
  带图标
</Button>

// 加载状态
<Button loading={true}>
  提交中...
</Button>
```

### Badge - 徽章

```tsx
import { Badge } from '@/components/common';

<Badge variant="success" dot>
  新功能
</Badge>

<Badge variant="warning" size="lg">
  重要
</Badge>
```

### Card - 卡片

```tsx
import { Card } from '@/components/common';

<Card hover glow variant="gradient">
  <h3>卡片标题</h3>
  <p>卡片内容</p>
</Card>
```

## 🎣 Custom Hooks

### useDebounce - 防抖

```tsx
import { useDebounce } from '@/hooks/custom';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  // 使用 debouncedSearch 进行搜索
}, [debouncedSearch]);
```

### useLocalStorage - 本地存储

```tsx
import { useLocalStorage } from '@/hooks/custom';

const [theme, setTheme] = useLocalStorage('theme', 'dark');
const [userPrefs, setUserPrefs] = useLocalStorage('prefs', {});
```

### useMediaQuery - 响应式检测

```tsx
import { useIsMobile, useIsDesktop } from '@/hooks/custom';

const isMobile = useIsMobile();
const isDesktop = useIsDesktop();

if (isMobile) {
  // 移动端布局
}
```

### useScroll - 滚动监听

```tsx
import { useScroll, useScrollDirection } from '@/hooks/custom';

const { x, y } = useScroll();
const direction = useScrollDirection();

useEffect(() => {
  console.log('滚动方向:', direction);
}, [direction]);
```

### useCopyToClipboard - 复制功能

```tsx
import { useCopyToClipboard } from '@/hooks/custom';

const [isCopied, copy] = useCopyToClipboard();

<button onClick={() => copy('复制的内容')}>
  {isCopied ? '已复制' : '复制'}
</button>
```

## 🎨 完整页面示例

```tsx
import { HeroSection, FeaturesSection, StatsSection } from '@/components/home';
import { Button, Card, Badge } from '@/components/common';
import { Pagination } from '@/components/navigation';
import { useLocalStorage, useIsMobile } from '@/hooks/custom';

export default function HomePage() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const isMobile = useIsMobile();

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} hover>
            <Badge variant="cyan">新功能</Badge>
            <h3>卡片 {i}</h3>
            <Button variant="primary" size="sm">
              了解更多
            </Button>
          </Card>
        ))}
      </div>
      
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={(p) => console.log(p)}
      />
    </div>
  );
}
```

## 🚀 快速集成到现有项目

1. **安装依赖**（如果还没安装）:
```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

2. **导入组件**:
```tsx
import { HeroSection } from '@/components/home';
import { Button } from '@/components/common';
import { useDebounce } from '@/hooks/custom';
```

3. **使用组件**:
```tsx
export default function Page() {
  return <HeroSection />;
}
```

## 📚 相关文档

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

**提示**: 所有组件都支持 TypeScript，提供完整的类型定义和 IntelliSense 支持！
