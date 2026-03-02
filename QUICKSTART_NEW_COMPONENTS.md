# 🚀 新组件快速开始指南

## 📦 前置条件

确保已安装必要的依赖：

```bash
npm install framer-motion clsx tailwind-merge
```

## 🎨 组件使用示例

### 1. DataGrid - 数据表格

```tsx
import { DataGrid, Column } from '@/components/ui';

function MyTable() {
  const data = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '编辑' },
  ];

  const columns: Column<typeof data[0]>[] = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'name', title: '姓名', sortable: true },
    { key: 'email', title: '邮箱' },
    { key: 'role', title: '角色' },
  ];

  return (
    <DataGrid
      data={data}
      columns={columns}
      keyField="id"
      pageSize={10}
      sortable
      filterable
    />
  );
}
```

### 2. Stepper - 步骤条

```tsx
import { Stepper, StepContent, StepNavigation } from '@/components/ui';

function MyWizard() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: '1', title: '第一步', description: '填写信息' },
    { id: '2', title: '第二步', description: '确认信息' },
    { id: '3', title: '第三步', description: '完成' },
  ];

  return (
    <div>
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <StepContent show={currentStep === 0}>
        <div>第一步内容...</div>
      </StepContent>

      <StepContent show={currentStep === 1}>
        <div>第二步内容...</div>
      </StepContent>

      <StepNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={() => setCurrentStep(currentStep - 1)}
        onNext={() => setCurrentStep(currentStep + 1)}
      />
    </div>
  );
}
```

### 3. ProgressBar - 进度条

```tsx
import { ProgressBar, CircularProgress } from '@/components/ui';

function MyProgress() {
  return (
    <div>
      {/* 线性进度条 */}
      <ProgressBar value={65} variant="cyan" showLabel striped />

      {/* 圆形进度条 */}
      <CircularProgress value={80} variant="purple" size={150} />
    </div>
  );
}
```

### 4. Tabs - 标签页

```tsx
import { Tabs } from '@/components/ui';

function MyTabs() {
  return (
    <Tabs
      tabs={[
        {
          id: 'tab1',
          label: '概述',
          content: <div>概述内容</div>,
        },
        {
          id: 'tab2',
          label: '详情',
          content: <div>详情内容</div>,
        },
      ]}
      variant="enclosed"
    />
  );
}
```

### 5. Tooltip - 提示框

```tsx
import { Tooltip } from '@/components/ui';

function MyTooltip() {
  return (
    <Tooltip content="这是提示信息" placement="top">
      <button>悬停查看提示</button>
    </Tooltip>
  );
}
```

### 6. Drawer - 抽屉

```tsx
import { Drawer, DrawerHeader, DrawerBody, DrawerFooter } from '@/components/ui';

function MyDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>打开抽屉</button>

      <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DrawerHeader>
          <h3>标题</h3>
        </DrawerHeader>

        <DrawerBody>
          <p>内容...</p>
        </DrawerBody>

        <DrawerFooter>
          <button onClick={() => setIsOpen(false)}>关闭</button>
        </DrawerFooter>
      </Drawer>
    </>
  );
}
```

## 🪝 Hooks 使用示例

### useDebounce - 防抖

```tsx
import { useDebounce } from '@/hooks';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    // 使用防抖后的搜索词
    console.log('搜索:', debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  );
}
```

### useLocalStorage - 本地存储

```tsx
import { useLocalStorage } from '@/hooks';

function Preferences() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  const [language, setLanguage] = useLocalStorage('language', 'zh');

  return (
    <div>
      <button onClick={() => setTheme('light')}>浅色</button>
      <button onClick={() => setTheme('dark')}>深色</button>
      <p>当前主题: {theme}</p>
    </div>
  );
}
```

### useMediaQuery - 媒体查询

```tsx
import { useIsMobile } from '@/hooks';

function ResponsiveComponent() {
  const isMobile = useIsMobile();

  return (
    <div>
      {isMobile ? '移动端视图' : '桌面端视图'}
    </div>
  );
}
```

## 🛠️ 工具函数使用示例

### 数组工具

```tsx
import { unique, groupBy, sortBy } from '@/lib/utils/array';

const data = [
  { id: 1, category: 'A', name: 'Item 1' },
  { id: 2, category: 'B', name: 'Item 2' },
  { id: 3, category: 'A', name: 'Item 3' },
];

// 去重
const uniqueData = unique(data);

// 分组
const grouped = groupBy(data, 'category');

// 排序
const sorted = sortBy(data, 'name', 'asc');
```

### 日期工具

```tsx
import { formatDate, relativeTime } from '@/lib/utils/date';

const now = new Date();

// 格式化日期
const formatted = formatDate(now, 'yyyy-MM-dd HH:mm:ss');

// 相对时间
const relative = relativeTime('2026-03-01');
// 返回: "2天前"
```

### 字符串工具

```tsx
import { slugify, truncate, isValidEmail } from '@/lib/utils/string';

// 生成 slug
const slug = slugify('Hello World!');
// 返回: "hello-world"

// 截断文本
const short = truncate('This is a long text', 10);
// 返回: "This is a..."

// 验证邮箱
const valid = isValidEmail('user@example.com');
// 返回: true
```

## 🎯 服务使用示例

### 通知服务

```tsx
import { notification } from '@/lib/services/NotificationService';

function MyComponent() {
  const showSuccess = () => {
    notification.success('成功', '操作已完成！');
  };

  const showError = () => {
    notification.error('错误', '操作失败，请重试');
  };

  return (
    <div>
      <button onClick={showSuccess}>显示成功通知</button>
      <button onClick={showError}>显示错误通知</button>
    </div>
  );
}
```

### 分析服务

```tsx
import { analytics } from '@/lib/services/AnalyticsService';

// 初始化
analytics.initialize({ debug: true });

// 跟踪页面浏览
analytics.trackPageView({
  path: '/dashboard',
  title: '仪表盘',
});

// 跟踪事件
analytics.trackEvent({
  category: 'button',
  action: 'click',
  label: 'submit',
});

// 跟踪错误
analytics.trackError(new Error('Something went wrong'));
```

## 🎨 样式自定义

所有组件都支持 `className` prop，可以自定义样式：

```tsx
<DataGrid
  className="my-custom-class"
  // 其他 props
/>

<ProgressBar
  className="w-full"
  variant="cyan"
  color="#00ff00"
/>
```

## 📱 响应式设计

组件支持多种尺寸配置：

```tsx
<Stepper size="sm" />  {/* 小尺寸 */}
<Stepper size="md" />  {/* 中尺寸 */}
<Stepper size="lg" />  {/* 大尺寸 */}

<ProgressBar size="sm" />
<ProgressBar size="md" />
<ProgressBar size="lg" />
```

## 🔧 高级用法

### 自定义渲染

```tsx
const columns = [
  {
    key: 'status',
    title: '状态',
    render: (value, row) => (
      <span className={`px-2 py-1 rounded ${
        value === 'online' ? 'bg-green-500' : 'bg-gray-500'
      }`}>
        {value}
      </span>
    ),
  },
];
```

### 事件处理

```tsx
<DataGrid
  onRowClick={(row, index) => {
    console.log('点击行:', row);
  }}
  onSort={(key, direction) => {
    console.log('排序:', key, direction);
  }}
/>
```

## 🎓 最佳实践

1. **类型安全**: 始终为组件提供正确的类型
   ```tsx
   const columns: Column<MyDataType>[] = [...];
   ```

2. **性能优化**: 使用 `useMemo` 和 `useCallback`
   ```tsx
   const columns = useMemo(() => [...], [deps]);
   ```

3. **错误处理**: 添加适当的错误边界
   ```tsx
   <ErrorBoundary>
     <MyComponent />
   </ErrorBoundary>
   ```

4. **可访问性**: 为交互元素添加适当的 ARIA 属性
   ```tsx
   <button aria-label="关闭" onClick={onClose}>
     <X />
   </button>
   ```

## 📚 查看更多

- 访问 `/components-demo` 查看所有组件的交互式演示
- 查看 `NEW_COMPONENTS_CREATED.md` 了解所有组件详情
- 查看组件源码了解实现细节

## 🆘 获取帮助

如果遇到问题：
1. 检查组件的 Props 类型定义
2. 查看演示页面的使用示例
3. 阅读组件内的 JSDoc 注释
4. 查看控制台的错误信息

---

**开始使用这些强大的组件，构建出色的应用吧！** 🚀
