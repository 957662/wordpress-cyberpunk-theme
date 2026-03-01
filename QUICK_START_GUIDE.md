# 新组件快速使用指南

## 🚀 快速开始

所有新组件都已创建并导出，可以直接在你的项目中使用。

## 📦 导入方式

### 方式1: 从索引文件导入 (推荐)
```tsx
// UI组件
import { VirtualList, CommandPalette, ThemeToggle } from '@/components/ui';

// 特效组件
import { LiquidButton, TrailCursor, CircuitBackground } from '@/components/effects';

// 布局组件
import { MasonryGrid, SplitView, Stack } from '@/components/layout';

// 自定义Hooks
import { useDebounce, useLocalStorage } from '@/components/hooks';
```

### 方式2: 直接导入
```tsx
import VirtualList from '@/components/ui/VirtualList';
import { useDebounce } from '@/components/hooks/useDebounce';
```

## 🎯 常用组件示例

### 1. VirtualList (虚拟滚动)
适用于大数据列表，只渲染可见项，性能极佳。

```tsx
import { VirtualList } from '@/components/ui';

function MyList() {
  const items = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
  }));

  return (
    <VirtualList
      items={items}
      itemHeight={60}
      renderItem={(item) => (
        <div className="p-4 border-b">{item.name}</div>
      )}
      containerHeight={500}
    />
  );
}
```

### 2. CommandPalette (命令面板)
类似 VS Code 的命令面板，支持键盘快捷键。

```tsx
import { CommandPalette } from '@/components/ui';

function MyApp() {
  const commands = [
    {
      id: 'new-post',
      label: '新建文章',
      description: '创建一篇新的博客文章',
      icon: '📝',
      action: () => console.log('Creating post...'),
    },
    {
      id: 'settings',
      label: '设置',
      description: '打开设置页面',
      icon: '⚙️',
      action: () => console.log('Opening settings...'),
    },
  ];

  return <CommandPalette commands={commands} />;
}
// 使用快捷键: ⌘K (Mac) 或 Ctrl+K (Windows)
```

### 3. ThemeToggle (主题切换)
支持多种赛博朋克主题。

```tsx
import { ThemeToggle } from '@/components/theme';

function MyApp() {
  const [theme, setTheme] = useState<Theme>('dark');

  return (
    <ThemeToggle
      currentTheme={theme}
      onThemeChange={setTheme}
    />
  );
}
```

### 4. MasonryGrid (瀑布流)
Pinterest 风格的瀑布流布局。

```tsx
import { MasonryGrid } from '@/components/layout';

function Gallery() {
  const items = [
    <img src="image1.jpg" alt="" />,
    <img src="image2.jpg" alt="" />,
    <img src="image3.jpg" alt="" />,
  ];

  return (
    <MasonryGrid columnCount={3} gap={16}>
      {items}
    </MasonryGrid>
  );
}
```

### 5. SearchInput (智能搜索)
带历史记录的搜索框。

```tsx
import { SearchInput } from '@/components/ui';

function MySearch() {
  const handleSearch = (query: string) => {
    console.log('Searching:', query);
  };

  return (
    <SearchInput
      onSearch={handleSearch}
      placeholder="搜索文章..."
      showHistory={true}
    />
  );
}
```

### 6. LiquidButton (液体按钮)
带波纹效果的炫酷按钮。

```tsx
import { LiquidButton } from '@/components/effects';

function MyButton() {
  return (
    <LiquidButton
      variant="cyan"
      onClick={() => console.log('Clicked!')}
    >
      点击我
    </LiquidButton>
  );
}
```

### 7. FileDropZone (文件上传)
拖放式文件上传组件。

```tsx
import { FileDropZone } from '@/components/ui';

function FileUpload() {
  const handleFilesDrop = (files: File[]) => {
    console.log('Dropped files:', files);
  };

  return (
    <FileDropZone
      onFilesDrop={handleFilesDrop}
      accept="image/*"
      multiple={true}
      maxSize={10 * 1024 * 1024} // 10MB
    />
  );
}
```

## 🪝 自定义Hooks

### useDebounce (防抖)
```tsx
import { useDebounce } from '@/components/hooks';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    // 只在停止输入500ms后执行
    search(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### useLocalStorage (本地存储)
```tsx
import { useLocalStorage } from '@/components/hooks';

function ThemeSelector() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'dark');

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
}
```

### useMediaQuery (媒体查询)
```tsx
import { useMediaQuery } from '@/components/hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile ? <MobileView /> : <DesktopView />;
}
```

## 🎨 特效组件

### CircuitBackground (电路背景)
```tsx
import { CircuitBackground } from '@/components/effects';

function CyberPage() {
  return (
    <div className="relative">
      <CircuitBackground nodeCount={30} />
      <div className="relative z-10">
        {/* 页面内容 */}
      </div>
    </div>
  );
}
```

### ShimmerEffect (微光效果)
```tsx
import { ShimmerEffect } from '@/components/effects';

function ShimmerCard() {
  return (
    <ShimmerEffect shimmerColor="rgba(0, 240, 255, 0.3)">
      <div className="p-6 bg-gray-900 rounded-xl">
        <h3>悬停查看效果</h3>
      </div>
    </ShimmerEffect>
  );
}
```

## 📱 布局组件

### SplitView (分屏视图)
```tsx
import { SplitView } from '@/components/layout';

function CodeEditor() {
  return (
    <SplitView
      left={<div>代码编辑器</div>}
      right={<div>预览</div>}
      direction="horizontal"
      initialSplit={50}
    />
  );
}
```

### Stack (堆叠布局)
```tsx
import { Stack } from '@/components/layout';

function MyStack() {
  return (
    <Stack spacing={16} direction="vertical" align="start">
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </Stack>
  );
}
```

## 🔑 完整组件列表

### UI组件 (15个)
- VirtualList - 虚拟滚动
- Swipeable - 滑动手势
- ContextMenu - 右键菜单
- CommandPalette - 命令面板
- NotificationBell - 通知铃铛
- Marquee - 跑马灯
- EllipsisText - 文本省略
- ScrollProgress - 滚动进度
- RatingStars - 星级评分
- ToggleSwitch - 切换开关
- DonutChart - 环形图
- StatCard - 统计卡片
- UserCard - 用户卡片
- ActivityFeed - 活动动态
- SearchInput - 智能搜索
- Confetti - 庆祝特效
- FileDropZone - 文件上传
- EmojiPicker - 表情选择

### 特效组件 (6个)
- LiquidButton - 液体按钮
- TrailCursor - 光标拖尾
- WarpText - 扭曲文字
- ShimmerEffect - 微光效果
- CircuitBackground - 电路背景
- TableOfContents - 目录导航

### 布局组件 (5个)
- MasonryGrid - 瀑布流
- StickyHeader - 粘性头部
- SplitView - 分屏视图
- Stack - 堆叠布局
- Grid - 网格布局

### 自定义Hooks (8个)
- useDebounce - 防抖
- useThrottle - 节流
- useIntersectionObserver - 交叉观察
- useLocalStorage - 本地存储
- useMediaQuery - 媒体查询
- useClickOutside - 外部点击
- useKeyboardShortcut - 键盘快捷键
- useCopyToClipboard - 剪贴板

## 💡 提示

1. 所有组件都是TypeScript类型安全的
2. 支持响应式设计
3. 遵循赛博朋克设计规范
4. 使用Framer Motion实现流畅动画
5. 所有组件支持自定义className

## 📚 更多信息

查看完整文档: `NEW_COMPONENTS_CREATION_REPORT_2026-03-02.md`

---

**祝开发愉快！🚀**
