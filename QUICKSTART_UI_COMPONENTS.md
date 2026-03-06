# 🚀 新 UI 组件快速开始指南

**更新日期**: 2026-03-07

---

## 📦 已创建的组件

本次开发创建了 **6 个核心组件库**，共 **30+ 个组件**：

1. **Tooltip** - 提示组件
2. **Dropdown** - 下拉菜单组件
3. **Tabs** - 标签页组件
4. **Progress** - 进度条组件
5. **Skeleton** - 骨架屏组件
6. **Command Dialog** - 命令对话框组件

---

## 🎯 快速开始

### 1. 查看组件展示

```bash
# 启动开发服务器
npm run dev

# 访问展示页面
http://localhost:3000/examples/new-ui-components-2026
```

### 2. 导入组件

```tsx
// 导入需要的组件
import { Tooltip } from '@/components/ui/tooltip/Tooltip';
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem } from '@/components/ui/dropdown/Dropdown';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs/Tabs';
import { Progress, CircularProgress } from '@/components/ui/progress/Progress';
import { Skeleton, SkeletonCard } from '@/components/ui/skeleton/Skeleton';
import { CommandDialog, useCommandDialogShortcut } from '@/components/ui/command-dialog/CommandDialog';
```

---

## 💡 使用示例

### Tooltip 提示

```tsx
import { Tooltip, SimpleTooltip, IconTooltip } from '@/components/ui/tooltip/Tooltip';
import { Info } from 'lucide-react';

// 基础用法
<Tooltip content="这是一个提示" position="top">
  <button>悬停我</button>
</Tooltip>

// 简化用法
<SimpleTooltip title="快速提示">
  <span>内容</span>
</SimpleTooltip>

// 图标提示
<IconTooltip icon={<Info className="w-4 h-4" />} content="重要信息" />
```

### Dropdown 下拉菜单

```tsx
import { Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown/Dropdown';
import { Settings, User } from 'lucide-react';

// 基础用法
<Dropdown>
  <DropdownTrigger>
    <button>打开菜单</button>
  </DropdownTrigger>
  <DropdownContent>
    <DropdownItem icon={<Settings />}>设置</DropdownItem>
    <DropdownSeparator />
    <DropdownItem icon={<User />}>个人资料</DropdownItem>
  </DropdownContent>
</Dropdown>

// 简化用法
import { SimpleDropdown } from '@/components/ui/dropdown/Dropdown';

<SimpleDropdown
  trigger={<span>选择操作</span>}
  items={[
    { label: '编辑', onClick: () => alert('编辑') },
    { label: '删除', onClick: () => alert('删除') },
  ]}
/>
```

### Tabs 标签页

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs/Tabs';

// 基础用法
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">标签 1</TabsTrigger>
    <TabsTrigger value="tab2">标签 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    <div>内容 1</div>
  </TabsContent>
  <TabsContent value="tab2">
    <div>内容 2</div>
  </TabsContent>
</Tabs>

// 简化用法
import { SimpleTabs } from '@/components/ui/tabs/Tabs';

<SimpleTabs
  tabs={[
    { value: 'tab1', label: '标签 1', content: <div>内容 1</div> },
    { value: 'tab2', label: '标签 2', content: <div>内容 2</div> },
  ]}
/>
```

### Progress 进度条

```tsx
import { Progress, CircularProgress, StepProgress, LoadingProgress } from '@/components/ui/progress/Progress';

// 线性进度条
<Progress value={60} showPercentage variant="cyan" />
<Progress value={90} variant="purple" striped animated />

// 圆形进度条
<CircularProgress value={75} variant="cyan" />
<CircularProgress value={50} variant="purple" label="完成率" />

// 步骤进度
<StepProgress
  steps={[
    { id: '1', label: '步骤 1' },
    { id: '2', label: '步骤 2' },
    { id: '3', label: '步骤 3' },
  ]}
  currentStep={1}
/>

// 加载进度
<LoadingProgress label="正在处理..." />
```

### Skeleton 骨架屏

```tsx
import { Skeleton, SkeletonText, SkeletonCard, SkeletonBlogPost, SkeletonStats, LoadingState } from '@/components/ui/skeleton/Skeleton';

// 基础骨架屏
<Skeleton width="100%" height="20px" />

// 文本骨架屏
<SkeletonText lines={3} />

// 卡片骨架屏
<SkeletonCard showAvatar lines={4} />

// 博客文章骨架屏
<SkeletonBlogPost />

// 统计骨架屏
<SkeletonStats count={4} />

// 加载状态
<LoadingState type="card" count={3} />
```

### Command Dialog 命令对话框

```tsx
import { CommandDialog, CommandTrigger, useCommandDialogShortcut } from '@/components/ui/command-dialog/CommandDialog';
import { useState } from 'react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  // 启用快捷键 (Cmd/Ctrl + K)
  useCommandDialogShortcut(() => setIsOpen(true));

  return (
    <div>
      {/* 触发按钮 */}
      <CommandTrigger onOpen={() => setIsOpen(true)} label="命令面板" />

      {/* 命令对话框 */}
      <CommandDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        commands={[
          {
            id: 'new-post',
            label: '新建文章',
            description: '创建一篇新的博客文章',
            icon: <FileText className="w-4 h-4" />,
            action: () => console.log('创建文章'),
            shortcut: '⌘N',
            category: '内容',
          },
          {
            id: 'settings',
            label: '设置',
            description: '打开系统设置',
            icon: <Settings className="w-4 h-4" />,
            action: () => console.log('打开设置'),
            category: '系统',
          },
        ]}
      />
    </div>
  );
}
```

---

## 🎨 自定义样式

所有组件都支持通过 `className` prop 自定义样式：

```tsx
<Tooltip className="custom-tooltip" content="提示">
  <button>按钮</button>
</Tooltip>

<Progress className="custom-progress" value={60} />
```

---

## 🔧 高级用法

### 受控组件

```tsx
// Tabs 受控模式
const [activeTab, setActiveTab] = useState('tab1');

<Tabs value={activeTab} onValueChange={setActiveTab}>
  <TabsList>
    <TabsTrigger value="tab1">标签 1</TabsTrigger>
    <TabsTrigger value="tab2">标签 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">内容 1</TabsContent>
  <TabsContent value="tab2">内容 2</TabsContent>
</Tabs>
```

### 异步操作

```tsx
// Dropdown 异步操作
<DropdownItem
  onClick={async () => {
    await fetchData();
    closeDropdown();
  }}
>
  加载数据
</DropdownItem>
```

### 动态命令

```tsx
// Command Dialog 动态命令
const commands = useMemo(() => [
  {
    id: 'search',
    label: `搜索 "${searchQuery}"`,
    action: () => performSearch(searchQuery),
    category: '搜索',
  },
  // ... 其他命令
], [searchQuery]);
```

---

## 📱 响应式设计

所有组件都支持响应式设计：

```tsx
// 自动适配移动端
<Dropdown align="start">  {/* 移动端: start, 桌面端: start */}
  <DropdownTrigger>菜单</DropdownTrigger>
  <DropdownContent>
    {/* 内容 */}
  </DropdownContent>
</Dropdown>

// 使用 Tailwind 响应式类
<Tabs className="w-full max-w-4xl mx-auto">
  {/* 内容 */}
</Tabs>
```

---

## ♿ 可访问性

所有组件都遵循 WCAG 2.1 AA 标准：

- ✅ 键盘导航支持
- ✅ ARIA 属性完整
- ✅ 屏幕阅读器友好
- ✅ 焦点管理

```tsx
// 自动处理可访问性
<Tabs>
  <TabsList role="tablist">
    <TabsTrigger role="tab" aria-selected="true">
      标签 1
    </TabsTrigger>
  </TabsList>
  <TabsContent role="tabpanel">
    内容
  </TabsContent>
</Tabs>
```

---

## 🎯 实际应用场景

### 博客文章页面

```tsx
function BlogPostPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div>
      {/* 骨架屏 */}
      {isLoading ? (
        <SkeletonBlogPost />
      ) : (
        <BlogPostContent />
      )}

      {/* 进度指示 */}
      <Progress value={readingProgress} showPercentage />
    </div>
  );
}
```

### 用户设置页面

```tsx
function SettingsPage() {
  return (
    <Tabs defaultValue="profile">
      <TabsList>
        <TabsTrigger value="profile">个人资料</TabsTrigger>
        <TabsTrigger value="account">账户</TabsTrigger>
        <TabsTrigger value="notifications">通知</TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        {/* 个人资料表单 */}
      </TabsContent>

      <TabsContent value="account">
        {/* 账户设置 */}
      </TabsContent>

      <TabsContent value="notifications">
        {/* 通知设置 */}
      </TabsContent>
    </Tabs>
  );
}
```

### 全局命令面板

```tsx
function App() {
  const [commandOpen, setCommandOpen] = useState(false);

  useCommandDialogShortcut(() => setCommandOpen(true));

  return (
    <>
      <Navbar>
        <CommandTrigger onOpen={() => setCommandOpen(true)} />
      </Navbar>

      <CommandDialog
        isOpen={commandOpen}
        onClose={() => setCommandOpen(false)}
        commands={allCommands}
      />
    </>
  );
}
```

---

## 🐛 常见问题

### Q: 如何自定义组件颜色？

A: 使用 Tailwind CSS 类名或 CSS 变量：

```tsx
<Tooltip className="!bg-red-500" content="自定义颜色">
  <button>按钮</button>
</Tooltip>
```

### Q: 如何禁用动画？

A: 大多数组件支持通过 props 控制：

```tsx
<Progress value={60} striped={false} animated={false} />
```

### Q: 如何处理大量命令？

A: 使用命令分类和搜索：

```tsx
const commands = [
  { id: '1', label: '命令 1', category: '文件' },
  { id: '2', label: '命令 2', category: '编辑' },
  // Command Dialog 会自动分组和搜索
];
```

---

## 📚 更多资源

- **展示页面**: `/examples/new-ui-components-2026`
- **完整文档**: `NEW_UI_COMPONENTS_REPORT_2026-03-07.md`
- **组件源码**: `/frontend/components/ui/`
- **TypeScript 类型**: 所有组件都有完整的类型定义

---

## 🎉 开始使用

现在你可以在项目中使用这些新组件了！

1. 查看 [展示页面](http://localhost:3000/examples/new-ui-components-2026) 了解所有组件
2. 阅读 [完整文档](./NEW_UI_COMPONENTS_REPORT_2026-03-07.md) 深入了解
3. 在你的项目中导入和使用这些组件
4. 根据需要自定义样式和行为

Happy coding! 🚀
