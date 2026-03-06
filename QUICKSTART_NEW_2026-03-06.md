# 快速开始指南 - 新组件使用

本文档提供新创建组件的快速使用指南。

## 📦 目录

1. [骨架屏组件](#骨架屏组件)
2. [反馈组件](#反馈组件)
3. [图表组件](#图表组件)
4. [导航组件](#导航组件)
5. [输入组件](#输入组件)
6. [布局组件](#布局组件)
7. [自定义 Hooks](#自定义-hooks)
8. [工具函数](#工具函数)

---

## 骨架屏组件

### SkeletonCard
用于卡片加载时的占位符。

```tsx
import { SkeletonCard } from '@/components/skeleton';

<SkeletonCard
  showAvatar
  showTitle
  lines={3}
  className="w-full"
/>
```

**Props**:
- `showAvatar?: boolean` - 显示头像占位符
- `showTitle?: boolean` - 显示标题占位符
- `lines?: number` - 文本行数（默认 3）

### SkeletonList
用于列表加载时的占位符。

```tsx
import { SkeletonList } from '@/components/skeleton';

<SkeletonList items={5} showAvatar />
```

**Props**:
- `items?: number` - 列表项数量（默认 5）
- `showAvatar?: boolean` - 显示头像占位符

### SkeletonTable
用于表格加载时的占位符。

```tsx
import { SkeletonTable } from '@/components/skeleton';

<SkeletonTable
  rows={5}
  columns={4}
  showHeader
/>
```

**Props**:
- `rows?: number` - 行数（默认 5）
- `columns?: number` - 列数（默认 4）
- `showHeader?: boolean` - 显示表头

---

## 反馈组件

### EmptyState
显示空状态（无数据、无结果等）。

```tsx
import { EmptyState } from '@/components/feedback';

<EmptyState
  type="no-data"
  title="暂无数据"
  description="还没有任何内容"
  actionLabel="创建"
  onAction={() => console.log('创建')}
/>
```

**类型**: `'no-data' | 'no-results' | 'no-messages' | 'error'`

### ConfirmDialog
确认对话框。

```tsx
import { ConfirmDialog } from '@/components/feedback';

<ConfirmDialog
  open={isOpen}
  title="确认删除"
  message="此操作不可撤销"
  type="danger"
  confirmLabel="删除"
  cancelLabel="取消"
  onConfirm={() => handleDelete()}
  onCancel={() => setIsOpen(false)}
/>
```

**类型**: `'warning' | 'info' | 'success' | 'danger'`

### NotificationBanner
通知横幅。

```tsx
import { NotificationBanner } from '@/components/feedback';

<NotificationBanner
  type="info"
  title="系统通知"
  message="系统将在今晚维护"
  dismissible
  onDismiss={() => {}}
/>
```

### ProgressSteps
进度步骤显示。

```tsx
import { ProgressSteps } from '@/components/feedback';

<ProgressSteps
  steps={[
    { id: '1', label: '第一步' },
    { id: '2', label: '第二步' },
    { id: '3', label: '第三步' },
  ]}
  currentStep={1}
  onStepClick={(index) => console.log(index)}
/>
```

---

## 图表组件

### StatCard
统计卡片，显示数据和趋势。

```tsx
import { StatCard } from '@/components/charts';

<StatCard
  title="总访问量"
  value="12,345"
  change={15}
  changeLabel="vs 上月"
  trend="up"
  icon={<Eye className="w-5 h-5" />}
/>
```

**Props**:
- `title: string` - 标题
- `value: string | number` - 值
- `change?: number` - 变化百分比
- `trend?: 'up' | 'down' | 'neutral'` - 趋势

### ProgressBar
进度条。

```tsx
import { ProgressBar } from '@/components/charts';

<ProgressBar
  value={75}
  max={100}
  label="完成进度"
  showPercentage
  color="cyan"
  size="md"
/>
```

**颜色**: `'cyan' | 'green' | 'yellow' | 'red' | 'purple' | 'blue'`

### MetricCard
指标卡片。

```tsx
import { MetricCard } from '@/components/charts';

<MetricCard
  type="views"
  label="浏览量"
  value={12345}
  previousValue={10000}
  period="vs 上月"
  onClick={() => {}}
/>
```

**类型**: `'views' | 'likes' | 'comments' | 'shares' | 'users' | 'custom'`

### MiniChart
迷你趋势图。

```tsx
import { MiniChart } from '@/components/charts';

<MiniChart
  data={[10, 20, 15, 30, 25, 40]}
  type="line"
  color="#06b6d4"
  height={40}
/>
```

---

## 导航组件

### BreadcrumbNav
面包屑导航。

```tsx
import { BreadcrumbNav } from '@/components/navigation';

<BreadcrumbNav
  items={[
    { label: '首页', href: '/' },
    { label: '博客', href: '/blog' },
    { label: '文章详情' },
  ]}
  showHome
/>
```

### SideNav
侧边导航。

```tsx
import { SideNav } from '@/components/navigation';
import { Home, Settings, User } from 'lucide-react';

<SideNav
  collapsible
  items={[
    {
      label: '首页',
      href: '/',
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: '设置',
      icon: <Settings className="w-5 h-5" />,
      children: [
        { label: '个人资料', href: '/settings/profile' },
        { label: '账户', href: '/settings/account' },
      ],
    },
  ]}
/>
```

### TabNav
标签页导航。

```tsx
import { TabNav } from '@/components/navigation';

<TabNav
  tabs={[
    { id: '1', label: '标签1' },
    { id: '2', label: '标签2', badge: 5 },
    { id: '3', label: '标签3' },
  ]}
  activeTab="1"
  onTabChange={(id) => setActiveTab(id)}
  variant="pills"
/>
```

**变体**: `'default' | 'pills' | 'underlined'`

### PaginationNav
分页导航。

```tsx
import { PaginationNav } from '@/components/navigation';

<PaginationNav
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setPage(page)}
  showFirstLast
  showPrevNext
  maxVisiblePages={5}
/>
```

---

## 输入组件

### InputGroup
输入组，包装表单字段。

```tsx
import { InputGroup } from '@/components/input';

<InputGroup
  label="用户名"
  description="请输入您的用户名"
  error={errors.username}
  required
>
  <input type="text" />
</InputGroup>
```

### SearchInputAdvanced
高级搜索输入框。

```tsx
import { SearchInputAdvanced } from '@/components/input';

<SearchInputAdvanced
  value={searchTerm}
  onChange={setSearchTerm}
  onSearch={handleSearch}
  suggestions={[
    { id: '1', text: 'React', type: 'suggestion' },
    { id: '2', text: 'Vue', type: 'suggestion' },
  ]}
  recentSearches={['JavaScript', 'TypeScript']}
  clearable
  debounceMs={300}
/>
```

### NumberInput
数字输入框，带增减控制。

```tsx
import { NumberInput } from '@/components/input';

<NumberInput
  value={quantity}
  onChange={setQuantity}
  min={1}
  max={100}
  step={1}
  precision={0}
  showControls
  prefix="¥"
/>
```

### TagInput
标签输入组件。

```tsx
import { TagInput } from '@/components/input';

<TagInput
  tags={tags}
  onChange={setTags}
  placeholder="输入标签..."
  maxTags={10}
  delimiter={['Enter', ',']}
  validateTag={(tag) => tag.length >= 2}
/>
```

---

## 布局组件

### SplitPane
可调整大小的分栏面板。

```tsx
import { SplitPane } from '@/components/layout';

<SplitPane
  direction="horizontal"
  defaultSize={50}
  minSize={20}
  maxSize={80}
  showHandle
>
  <div>左侧内容</div>
  <div>右侧内容</div>
</SplitPane>
```

### AspectRatio
保持宽高比的容器。

```tsx
import { AspectRatio } from '@/components/layout';

<AspectRatio ratio="video">
  <img src="/image.jpg" alt="" />
</AspectRatio>
```

**比例**: `number | 'square' | 'video' | 'portrait' | 'landscape'`

### MasonryGrid
瀑布流布局。

```tsx
import { MasonryGrid } from '@/components/layout';

<MasonryGrid
  columns="responsive"
  minColumnWidth={300}
  gap={16}
>
  {items.map(item => (
    <div key={item.id}>{item.content}</div>
  ))}
</MasonryGrid>
```

### StickyContainer
粘性容器。

```tsx
import { StickyContainer } from '@/components/layout';

<StickyContainer offset={80}>
  <div>粘性内容</div>
  <div>滚动内容</div>
</StickyContainer>
```

---

## 自定义 Hooks

### useIntersectionObserver
检测元素是否进入视口。

```tsx
import { useIntersectionObserver } from '@/hooks';

function MyComponent() {
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div ref={ref}>
      {isIntersecting ? '可见' : '不可见'}
    </div>
  );
}
```

### useMediaQuery
监听媒体查询变化。

```tsx
import { useMediaQuery } from '@/hooks';

function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return <div>{isMobile ? '移动端' : '桌面端'}</div>;
}
```

### useScrollLock
锁定/解锁页面滚动。

```tsx
import { useScrollLock } from '@/hooks';

function Modal({ isOpen }) {
  useScrollLock(isOpen);
  return <div>模态框内容</div>;
}
```

### useLocalStorage
同步 localStorage。

```tsx
import { useLocalStorage } from '@/hooks';

function App() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'dark');

  return (
    <button onClick={() => setTheme('light')}>
      设置主题
    </button>
  );
}
```

### useDebounce
防抖处理。

```tsx
import { useDebounce } from '@/hooks';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedValue = useDebounce(searchTerm, 500);

  useEffect(() => {
    // 使用 debouncedValue 进行搜索
  }, [debouncedValue]);

  return <input onChange={(e) => setSearchTerm(e.target.value)} />;
}
```

---

## 工具函数

### 格式化函数

```tsx
import {
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  truncateText,
} from '@/lib/utils';

formatNumber(12345.67);          // "12,345.67"
formatCurrency(1234.56);         // "¥1,234.56"
formatDate(new Date(), 'long');  // "2026年03月06日"
formatRelativeTime(new Date());  // "刚刚"
truncateText('很长的文本', 10);   // "很长的文..."
```

### 验证函数

```tsx
import {
  isValidEmail,
  isValidPhone,
  checkPasswordStrength,
  isValidUrl,
} from '@/lib/utils';

isValidEmail('test@example.com');      // true
isValidPhone('13800138000');           // true
checkPasswordStrength('password123');  // { score: 3, level: 'medium' }
isValidUrl('https://example.com');     // true
```

### DOM 函数

```tsx
import {
  copyToClipboard,
  scrollToElement,
  downloadFile,
  isFullScreen,
} from '@/lib/utils';

await copyToClipboard('复制的文本');
scrollToElement(element, 80);
downloadFile('内容', 'file.txt');
```

### 数组函数

```tsx
import {
  unique,
  groupBy,
  chunk,
  shuffle,
  sortBy,
} from '@/lib/utils';

unique([1, 2, 2, 3]);                    // [1, 2, 3]
groupBy([{id: 1, type: 'a'}], 'type');   // { a: [...] }
chunk([1, 2, 3, 4], 2);                  // [[1, 2], [3, 4]]
shuffle([1, 2, 3]);                      // [3, 1, 2]
sortBy([{id: 1}, {id: 2}], 'id');       // 按id排序
```

### 对象函数

```tsx
import {
  deepClone,
  deepMerge,
  get,
  set,
  pick,
  omit,
} from '@/lib/utils';

const cloned = deepClone(obj);
const merged = deepMerge(obj1, obj2);
const value = get(obj, 'user.profile.name');
set(obj, 'user.age', 25);
const picked = pick(obj, ['id', 'name']);
const omitted = omit(obj, ['password']);
```

---

## 💡 提示

1. **导入路径**: 所有组件都可以从 `@/components/xxx` 导入
2. **类型安全**: 所有组件都有完整的 TypeScript 类型定义
3. **样式定制**: 使用 `className` prop 可以自定义样式
4. **性能优化**: 大部分组件已经做过性能优化

---

## 📚 更多文档

- 完整 API 文档: 查看各组件源码的 JSDoc 注释
- 示例代码: 参考 `app/examples` 目录下的示例页面
- 设计规范: 查看 `PROJECT_STRUCTURE.md`

---

**更新时间**: 2026-03-06
**版本**: 1.0.0
