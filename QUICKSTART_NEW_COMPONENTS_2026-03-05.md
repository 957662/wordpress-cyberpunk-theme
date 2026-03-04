# 🚀 新组件快速开始指南

> 本指南将帮助你快速使用新创建的组件和工具库

---

## 📦 安装依赖

所有新组件都依赖以下库（项目应该已经安装）：

```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

---

## 🎨 功能组件使用指南

### 1. 主题切换器 (ThemeSwitcher)

#### 基础使用
```typescript
import { ThemeSwitcher } from '@/components/features';

function Header() {
  return (
    <div className="flex items-center justify-between p-4">
      <h1>Logo</h1>
      <ThemeSwitcher showLabel />
    </div>
  );
}
```

#### 紧凑版本
```typescript
import { CompactThemeSwitcher } from '@/components/features';

function Toolbar() {
  return <CompactThemeSwitcher />;
}
```

#### 使用 Hook
```typescript
import { useTheme } from '@/components/features';

function Settings() {
  const { theme, setTheme, effectiveTheme } = useTheme();

  return (
    <div>
      <p>当前主题: {effectiveTheme}</p>
      <button onClick={() => setTheme('dark')}>切换到深色</button>
    </div>
  );
}
```

---

### 2. 命令面板 (CommandPalette)

#### 基础使用
```typescript
import { CommandPalette, Command } from '@/components/features';
import { useRouter } from 'next/navigation';

function App() {
  const router = useRouter();

  const commands: Command[] = [
    {
      id: 'home',
      label: '首页',
      description: '返回到首页',
      icon: Home,
      category: '导航',
      shortcut: ['⌘', 'H'],
      action: () => router.push('/'),
    },
    {
      id: 'settings',
      label: '设置',
      description: '打开设置页面',
      icon: Settings,
      category: '导航',
      action: () => router.push('/settings'),
    },
    // ... 更多命令
  ];

  return <CommandPalette commands={commands} />;
}
```

#### 使用 Hook
```typescript
import { useCommandPalette } from '@/components/features';

function Toolbar() {
  const { isOpen, open, close, toggle } = useCommandPalette();

  return (
    <button onClick={toggle}>
      {isOpen ? '关闭' : '打开'}命令面板
    </button>
  );
}
```

---

### 3. 消息提示 (Toast)

#### 基础使用
```typescript
import { toast } from '@/components/features';

function SaveButton() {
  const handleSave = async () => {
    try {
      await saveData();
      toast.success('保存成功！');
    } catch (error) {
      toast.error('保存失败', error.message);
    }
  };

  return <button onClick={handleSave}>保存</button>;
}
```

#### Promise 支持
```typescript
function Form() {
  const handleSubmit = () => {
    toast.promise(submitForm(formData), {
      loading: '提交中...',
      success: '提交成功',
      error: '提交失败',
    });
  };

  return <button onClick={handleSubmit}>提交</button>;
}
```

#### 使用 Hook
```typescript
import { useToast } from '@/components/features';

function Component() {
  const { toast } = useToast();

  const handleClick = () => {
    toast.info('这是一个提示');
  };

  return <button onClick={handleClick}>显示提示</button>;
}
```

---

### 4. 数据表格 (DataTable)

#### 基础使用
```typescript
import { DataTable } from '@/components/features';
import type { Column } from '@/components/features';

const columns: Column<User>[] = [
  {
    id: 'name',
    header: '姓名',
    accessor: 'name',
    sortable: true,
  },
  {
    id: 'email',
    header: '邮箱',
    accessor: 'email',
    sortable: true,
  },
  {
    id: 'status',
    header: '状态',
    accessor: 'status',
    cell: (value) => (
      <span className={`px-2 py-1 rounded ${
        value === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
      }`}>
        {value}
      </span>
    ),
  },
];

function UserTable() {
  const [users, setUsers] = useState([]);

  return (
    <DataTable
      data={users}
      columns={columns}
      keyField="id"
      searchable
      sortable
      selectable
      onSelectionChange={(selected) => console.log(selected)}
    />
  );
}
```

#### 带操作按钮
```typescript
const actions = [
  {
    label: '编辑',
    icon: Edit,
    onClick: (user) => router.push(`/users/${user.id}/edit`),
  },
  {
    label: '删除',
    icon: Trash,
    variant: 'danger',
    onClick: (user) => deleteUser(user.id),
  },
];

<DataTable data={users} columns={columns} keyField="id" actions={actions} />
```

---

### 5. 表单向导 (FormWizard)

#### 基础使用
```typescript
import { FormWizard } from '@/components/features';

const steps = [
  {
    id: 'basic',
    title: '基本信息',
    component: BasicInfoStep,
    validation: (data) => {
      if (!data.name) return false;
      if (!data.email) return false;
      return true;
    },
  },
  {
    id: 'details',
    title: '详细信息',
    component: DetailsStep,
  },
  {
    id: 'confirm',
    title: '确认信息',
    component: ConfirmStep,
  },
];

function RegistrationForm() {
  const handleSubmit = async (data) => {
    await registerUser(data);
  };

  return (
    <FormWizard
      steps={steps}
      onSubmit={handleSubmit}
      submitButtonText="完成注册"
    />
  );
}
```

---

### 6. 虚拟列表 (VirtualList)

#### 基础使用
```typescript
import { VirtualList } from '@/components/features';

function UserList({ users }) {
  return (
    <VirtualList
      items={users}
      itemHeight={80}
      renderItem={(user) => (
        <div className="p-4 border-b">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      )}
      keyExtractor={(user) => user.id}
      containerHeight={600}
    />
  );
}
```

#### 虚拟网格
```typescript
import { VirtualGrid } from '@/components/features';

function ImageGallery({ images }) {
  return (
    <VirtualGrid
      items={images}
      renderItem={(image) => (
        <img src={image.url} alt={image.title} />
      )}
      keyExtractor={(image) => image.id}
      itemHeight={300}
      columns={4}
    />
  );
}
```

---

### 7. 无限滚动 (InfiniteScroll)

#### 基础使用
```typescript
import { InfiniteScroll, useInfiniteScroll } from '@/components/features';

function PostList() {
  const { data, loading, hasMore, loadMore } = useInfiniteScroll({
    fetchData: async (page) => {
      const res = await fetch(`/api/posts?page=${page}`);
      return res.json();
    },
    initialPage: 1,
    pageSize: 20,
  });

  return (
    <InfiniteScroll
      hasMore={hasMore}
      loadMore={loadMore}
      loading={loading}
      endMessage="没有更多了"
    >
      {data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </InfiniteScroll>
  );
}
```

---

### 8. 文件上传 (FileUpload)

#### 基础使用
```typescript
import { FileUpload } from '@/components/features';

function UploadForm() {
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <FileUpload
      accept="image/*"
      multiple
      maxSize={5 * 1024 * 1024}
      maxFiles={10}
      autoUpload
      onUpload={handleUpload}
    />
  );
}
```

---

## 🔧 工具库使用指南

### 1. 事件发射器 (EventEmitter)

#### 基础使用
```typescript
import { eventBus } from '@/services/event-emitter';

// 监听事件
const unsubscribe = eventBus.on('user:login', (user) => {
  console.log('用户登录:', user);
});

// 发射事件
eventBus.emit('user:login', { id: 1, name: 'John' });

// 取消监听
unsubscribe();
```

#### 使用 Hook
```typescript
import { useEvent } from '@/services/event-emitter';

function UserProfile() {
  useEvent('user:update', (user) => {
    console.log('用户信息更新:', user);
  });

  return <div>用户信息</div>;
}
```

---

### 2. 错误追踪 (ErrorTracking)

#### 基础使用
```typescript
import { errorTracking } from '@/lib/error-tracking';

// 捕获错误
try {
  await riskyOperation();
} catch (error) {
  errorTracking.captureError(error, {
    component: 'UserProfile',
    action: 'save',
  });
}

// 获取统计
const stats = errorTracking.getStats();
console.log('错误统计:', stats);
```

#### 使用 ErrorBoundary
```typescript
import { ErrorBoundary } from '@/lib/error-tracking';

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('应用错误:', error, errorInfo);
      }}
    >
      <YourApp />
    </ErrorBoundary>
  );
}
```

---

### 3. 请求管理器 (RequestManager)

#### 基础使用
```typescript
import { request } from '@/lib/request-manager';

// GET 请求
const data = await request.get('/api/users', {
  cache: true, // 启用缓存
});

// POST 请求
const result = await request.post('/api/users', {
  name: 'John',
  email: 'john@example.com',
});

// 带重试
await request.get('/api/data', {
  retries: 5,
  retryDelay: 2000,
});
```

---

### 4. 日期时间工具 (DateTime)

#### 基础使用
```typescript
import {
  formatDate,
  formatRelativeTime,
  getCountdown,
  DateTime
} from '@/lib/datetime';

// 格式化日期
const formatted = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
// 输出: 2026-03-05 14:30:00

// 相对时间
const relative = formatRelativeTime(new Date());
// 输出: 刚刚, 5分钟前, 2小时前...

// 倒计时
const countdown = getCountdown(new Date('2026-12-31'));
console.log(`${countdown.days}天 ${countdown.hours}小时`);

// DateTime 类
const now = DateTime.now();
const nextWeek = now.add(7, 'days');
const formatted = nextWeek.format('YYYY-MM-DD');
```

---

### 5. 状态管理 (State)

#### 基础使用
```typescript
import { usePersistedState, useGlobalState } from '@/lib/state';

// 持久化到 localStorage
function Settings() {
  const [theme, setTheme] = usePersistedState('theme', 'dark');

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      切换主题
    </button>
  );
}

// 暂存到 sessionStorage
function Form() {
  const [formData, setFormData] = useGlobalState('form-data', {
    name: '',
    email: '',
  });

  return (
    <input
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    />
  );
}
```

---

## 🎯 最佳实践

### 1. 组件组合
```typescript
function Dashboard() {
  return (
    <div>
      <Header>
        <ThemeSwitcher />
      </Header>

      <main>
        <DataTable data={data} columns={columns} />
      </main>

      <CommandPalette commands={commands} />

      <ToastContainer />
    </div>
  );
}
```

### 2. 错误处理
```typescript
function Component() {
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      await riskyOperation();
      toast.success('操作成功');
    } catch (error) {
      errorTracking.captureError(error);
      toast.error('操作失败');
    }
  };

  return <button onClick={handleClick}>执行</button>;
}
```

### 3. 性能优化
```typescript
// 使用虚拟列表处理大数据
<VirtualList
  items={largeData}
  itemHeight={60}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
/>

// 使用请求缓存
const data = await request.get('/api/data', { cache: true });
```

---

## 📚 更多资源

- 查看完整文档: `FILES_CREATED_SESSION_2026-03-05_FINAL.md`
- 查看组件源码: `frontend/components/features/`
- 查看工具库源码: `frontend/lib/` 和 `frontend/services/`

---

## 💡 提示

1. **TypeScript 支持**: 所有组件都有完整的类型定义
2. **赛博朋克风格**: 自动使用项目的设计系统
3. **响应式设计**: 所有组件都支持移动端
4. **性能优化**: 使用虚拟滚动和请求缓存
5. **错误处理**: 完善的错误捕获和提示

---

**祝开发愉快！** 🚀
