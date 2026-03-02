# 🚀 新组件快速开始指南

## 📦 快速导入

### 方式一：从统一入口导入（推荐）

```tsx
// UI 组件
import {
  LoadingSpinner,
  ProgressBar,
  CircularProgressBar,
  Badge,
  StatusBadge,
  CountBadge,
  Tabs,
  VerticalTabs,
  Modal,
  ConfirmDialog,
  Tooltip,
  QuickTip
} from '@/components/ui';

// Blog 组件
import { BlogCard } from '@/components/blog';

// Hooks
import {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useLocalStorage,
  useClickOutside,
  useScroll,
  useScrollDirection
} from '@/hooks';

// 工具函数
import {
  cn,
  formatDate,
  calculateReadingTime,
  truncateText,
  debounce,
  throttle,
  generateId,
  deepClone,
  formatNumber,
  copyToClipboard,
  downloadFile
} from '@/lib/utils';
```

### 方式二：按需导入

```tsx
// 只导入需要的组件
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useIsMobile } from '@/hooks/useMediaQuery';
```

---

## 🎯 常见使用场景

### 1️⃣ 页面加载状态

```tsx
import { useState, useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui';

function MyPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => setLoading(false), 2000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner variant="cyber" size="lg" text="加载中..." />
      </div>
    );
  }

  return <div>页面内容</div>;
}
```

### 2️⃣ 文件上传进度

```tsx
import { useState } from 'react';
import { ProgressBar } from '@/components/ui';

function FileUpload() {
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    // 模拟上传
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div>
      <button onClick={handleUpload}>开始上传</button>
      <ProgressBar value={progress} variant="gradient" showPercentage />
    </div>
  );
}
```

### 3️⃣ 文章状态徽章

```tsx
import { Badge, StatusBadge } from '@/components/ui';

function ArticleStatus() {
  return (
    <div className="flex gap-2">
      <StatusBadge status="online" />
      <Badge variant="success">已发布</Badge>
      <Badge variant="primary">技术</Badge>
      <Badge variant="warning">草稿</Badge>
    </div>
  );
}
```

### 4️⃣ 选项卡切换内容

```tsx
import { Tabs } from '@/components/ui';

function TabExample() {
  const tabs = [
    {
      id: 'overview',
      label: '概述',
      content: <div>概述内容</div>
    },
    {
      id: 'features',
      label: '功能',
      content: <div>功能列表</div>
    },
    {
      id: 'settings',
      label: '设置',
      content: <div>设置选项</div>
    }
  ];

  return <Tabs tabs={tabs} defaultTab="overview" />;
}
```

### 5️⃣ 确认对话框

```tsx
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ui';

function DeleteButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = () => {
    // 执行删除操作
    console.log('已删除');
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>删除</button>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="确认删除"
        message="此操作不可撤销，确定要删除吗？"
      />
    </>
  );
}
```

### 6️⃣ 响应式布局

```tsx
import { useIsMobile } from '@/hooks';

function ResponsiveLayout() {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "grid",
      isMobile ? "grid-cols-1" : "grid-cols-3"
    )}>
      {/* 响应式内容 */}
    </div>
  );
}
```

### 7️⃣ 博客文章卡片

```tsx
import { BlogCard } from '@/components/blog';

function BlogList() {
  const post = {
    id: 1,
    title: '文章标题',
    excerpt: '文章摘要...',
    slug: 'article-slug',
    date: '2026-03-03',
    author: { name: '作者名' },
    categories: [{ id: 1, name: '技术', slug: 'tech' }],
    readingTime: 5
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <BlogCard post={post} variant="featured" />
      <BlogCard post={post} variant="horizontal" />
      <BlogCard post={post} variant="compact" />
    </div>
  );
}
```

### 8️⃣ 本地存储管理

```tsx
import { useLocalStorage } from '@/hooks';

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      当前主题: {theme}
    </button>
  );
}
```

### 9️⃣ 点击外部关闭下拉菜单

```tsx
import { useState } from 'react';
import { useClickOutside } from '@/hooks';

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>菜单</button>
      {isOpen && (
        <div className="absolute top-full mt-2 bg-gray-800 rounded-lg">
          <div className="p-2">菜单项 1</div>
          <div className="p-2">菜单项 2</div>
        </div>
      )}
    </div>
  );
}
```

### 🔟 滚动监听

```tsx
import { useScroll, useScrollDirection } from '@/hooks';
import { useState, useEffect } from 'react';

function ScrollHeader() {
  const { y } = useScroll();
  const direction = useScrollDirection();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(direction !== 'down' || y < 100);
  }, [direction, y]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 transition-transform',
      !visible && '-translate-y-full'
    )}>
      头部内容
    </header>
  );
}
```

---

## 🎨 样式定制

### 使用 Tailwind 类名

```tsx
import { cn } from '@/lib/utils';

function CustomStyledButton() {
  return (
    <button className={cn(
      'px-4 py-2 rounded-lg transition-all',
      'bg-gradient-to-r from-cyan-500 to-blue-500',
      'hover:shadow-lg hover:shadow-cyan-500/30',
      'hover:scale-105 active:scale-95'
    )}>
      自定义按钮
    </button>
  );
}
```

### 动态样式

```tsx
function DynamicBadge({ status }: { status: 'success' | 'error' }) {
  const variant = status === 'success' ? 'success' : 'error';
  return <Badge variant={variant}>{status}</Badge>;
}
```

---

## 📱 响应式设计

### 断点使用

```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks';

function ResponsiveComponent() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();

  return (
    <div>
      {isMobile && <div>移动端布局</div>}
      {isTablet && <div>平板布局</div>}
      {isDesktop && <div>桌面端布局</div>}
    </div>
  );
}
```

---

## 🔧 工具函数使用

### 日期格式化

```tsx
import { formatDate } from '@/lib/utils';

function PostDate({ date }: { date: string }) {
  return <time>{formatDate(date, 'yyyy年MM月dd日')}</time>;
}
```

### 防抖搜索

```tsx
import { useState } from 'react';
import { debounce } from '@/lib/utils';

function SearchInput() {
  const [query, setQuery] = useState('');

  const handleSearch = debounce((value: string) => {
    // 执行搜索
    console.log('搜索:', value);
  }, 300);

  return (
    <input
      type="text"
      onChange={(e) => {
        setQuery(e.target.value);
        handleSearch(e.target.value);
      }}
      placeholder="搜索..."
    />
  );
}
```

### 复制到剪贴板

```tsx
import { copyToClipboard } from '@/lib/utils';

async function handleCopy(text: string) {
  const success = await copyToClipboard(text);
  if (success) {
    alert('复制成功！');
  }
}
```

---

## 🎬 动画效果

所有组件都内置了 Framer Motion 动画，无需额外配置即可获得流畅效果。

```tsx
import { motion } from 'framer-motion';

function AnimatedList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-3 bg-gray-800 rounded"
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}
```

---

## 🚀 最佳实践

### 1. 组件拆分

```tsx
// ❌ 不好：一个组件做太多事
function BigComponent() {
  // 500 行代码
}

// ✅ 好：拆分为小组件
function ParentComponent() {
  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  );
}
```

### 2. 类型安全

```tsx
// ✅ 使用 TypeScript 类型
import type { BlogCardProps } from '@/components/blog';

function MyBlogCard({ post }: BlogCardProps) {
  return <BlogCard post={post} />;
}
```

### 3. 性能优化

```tsx
import { memo, useMemo, useCallback } from 'react';

// 使用 memo 避免不必要的重渲染
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  // 使用 useMemo 缓存计算结果
  const processed = useMemo(() => processData(data), [data]);
  
  // 使用 useCallback 缓存函数
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <div onClick={handleClick}>{processed}</div>;
});
```

---

## 📚 更多示例

查看 `frontend/app/page.tsx` 获取完整的使用示例。

---

## ❓ 常见问题

### Q: 如何自定义组件样式？

A: 使用 `className` prop 传入自定义类名：

```tsx
<Badge className="bg-custom-color text-custom-text">自定义徽章</Badge>
```

### Q: 组件支持 TypeScript 吗？

A: 是的，所有组件都包含完整的 TypeScript 类型定义。

### Q: 如何禁用动画？

A: 大多数组件支持 `animated` prop：

```tsx
<LoadingSpinner animated={false} />
```

---

## 🔗 相关链接

- [完整文档](./NEW_COMPONENTS_SUMMARY.md)
- [项目 README](./README.md)
- [开发指南](./CONTRIBUTING.md)

---

**开始使用这些组件，快速构建你的应用吧！** 🎉
