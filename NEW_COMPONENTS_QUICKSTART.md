# 新组件快速使用指南

## 快速开始

### 1. 查看演示

启动开发服务器并访问演示页面：

```bash
cd frontend
npm run dev
```

然后在浏览器中打开：
```
http://localhost:3000/examples/new-components
```

### 2. 导入组件

所有组件都可以从 `@/components/ui` 导入：

```tsx
// 单个导入
import { CyberClock } from '@/components/ui';

// 批量导入
import {
  CyberClock,
  WeatherCard,
  MusicPlayer,
  TaskManager,
} from '@/components/ui';
```

## 组件速查表

### 🕐 CyberClock - 时钟

```tsx
// 数字时钟
<CyberClock variant="digital" size="md" theme="cyan" />

// 模拟时钟
<CyberClock variant="analog" size="lg" theme="purple" />

// 同时显示
<CyberClock variant="both" showDate={true} showDayOfWeek={true} />
```

**Props**:
- `variant`: 'digital' | 'analog' | 'both'
- `size`: 'sm' | 'md' | 'lg'
- `theme`: 'cyan' | 'purple' | 'pink' | 'yellow'
- `showSeconds`: boolean
- `showDate`: boolean
- `showDayOfWeek`: boolean

---

### 🔒 PasswordStrength - 密码强度

```tsx
const [password, setPassword] = useState('');

<PasswordStrength
  value={password}
  onChange={setPassword}
  minLength={8}
  showRequirements={true}
/>
```

**Props**:
- `value`: string (当前密码)
- `onChange`: (value: string) => void
- `minLength`: number (默认 8)
- `showRequirements`: boolean (默认 true)

---

### 🌤️ WeatherCard - 天气卡片

```tsx
<WeatherCard
  city="上海"
  temperature={28}
  weather="sunny"
  description="晴朗"
  humidity={65}
  windSpeed={12}
  size="md"
/>
```

**Props**:
- `city`: string
- `temperature`: number
- `weather`: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy'
- `description`?: string
- `humidity`?: number
- `windSpeed`?: number
- `size`: 'sm' | 'md' | 'lg'

---

### 🎵 MusicPlayer - 音乐播放器

```tsx
const tracks = [
  { id: '1', title: 'Song', artist: 'Artist', album: 'Album', duration: 245 },
  { id: '2', title: 'Song2', artist: 'Artist2', duration: 198 },
];

<MusicPlayer
  tracks={tracks}
  autoPlay={false}
  showPlaylist={true}
/>
```

**Props**:
- `tracks`: Track[]
- `autoPlay`?: boolean
- `showPlaylist`?: boolean

**Track 类型**:
```tsx
interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // 秒
  cover?: string;
}
```

---

### ✅ TaskManager - 任务管理器

```tsx
const [tasks, setTasks] = useState<Task[]>([
  {
    id: '1',
    title: '完成文档',
    description: '编写 API 文档',
    priority: 'high',
    completed: false,
    createdAt: new Date(),
  },
]);

<TaskManager
  initialTasks={tasks}
  showProgress={true}
  maxTasks={20}
/>
```

**Props**:
- `initialTasks`?: Task[]
- `showProgress`?: boolean
- `maxTasks`?: number

---

### 💻 CodePreview - 代码预览

```tsx
<CodePreview
  code={sourceCode}
  language="typescript"
  title="Component.tsx"
  showLineNumbers={true}
  showCopy={true}
  showPreview={false}
/>
```

**Props**:
- `code`: string
- `language`?: string
- `title`?: string
- `showLineNumbers`?: boolean
- `showCopy`?: boolean
- `showPreview`?: boolean
- `previewComponent`?: React.ReactNode

---

### 📊 DataTable - 数据表格

```tsx
const columns: Column<User>[] = [
  { key: 'name', title: '姓名', sortable: true },
  { key: 'email', title: '邮箱' },
  {
    key: 'status',
    title: '状态',
    render: (value) => (
      <span className={value === 'active' ? 'text-green' : 'text-red'}>
        {value}
      </span>
    ),
  },
];

<DataTable
  data={users}
  columns={columns}
  sortable={true}
  searchable={true}
  pageSize={10}
/>
```

**Props**:
- `data`: T[]
- `columns`: Column<T>[]
- `sortable`?: boolean
- `searchable`?: boolean
- `pageSize`?: number
- `onRowClick`?: (record: T, index: number) => void

---

### 🔔 NotificationToast - 通知提示

```tsx
const [notifications, setNotifications] = useState<Notification[]>([
  {
    id: '1',
    type: 'success',
    title: '成功',
    message: '操作已完成',
    duration: 5000,
  },
]);

<NotificationToast
  notifications={notifications}
  position="top-right"
  onClose={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
/>
```

**Props**:
- `notifications`: Notification[]
- `position`?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
- `onClose`?: (id: string) => void

**Notification 类型**:
```tsx
interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number; // 毫秒，0 表示不自动关闭
}
```

---

### ⭐ RatingComponent - 评分

```tsx
const [rating, setRating] = useState(4.5);

<RatingComponent
  value={rating}
  maxValue={5}
  type="star"
  readonly={false}
  onChange={setRating}
/>
```

**Props**:
- `value`: number
- `maxValue`?: number (默认 5)
- `type`?: 'star' | 'number' | 'emoji' | 'thumbs'
- `readonly`?: boolean
- `size`?: 'sm' | 'md' | 'lg'
- `showValue`?: boolean
- `onChange`?: (value: number) => void

---

### 📋 StepProgress - 步骤进度

```tsx
const steps = [
  { id: '1', title: '注册', description: '创建账户' },
  { id: '2', title: '验证', description: '验证邮箱' },
  { id: '3', title: '完成', description: '准备就绪' },
];

<StepProgress
  steps={steps}
  currentStep={1}
  completedSteps={[0]}
  variant="horizontal"
  size="md"
  clickable={true}
  onStepClick={(index) => console.log(index)}
/>
```

**Props**:
- `steps`: Step[]
- `currentStep`: number
- `completedSteps`?: number[]
- `variant`?: 'horizontal' | 'vertical'
- `size`?: 'sm' | 'md' | 'lg'
- `clickable`?: boolean
- `onStepClick`?: (stepIndex: number) => void

---

## 完整示例

### 创建一个功能丰富的页面

```tsx
'use client';

import { useState } from 'react';
import {
  CyberClock,
  WeatherCard,
  MusicPlayer,
  TaskManager,
  RatingComponent,
} from '@/components/ui';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: '完成项目文档',
      priority: 'high' as const,
      completed: false,
      createdAt: new Date(),
    },
  ]);

  const [rating, setRating] = useState(4);

  const tracks = [
    { id: '1', title: 'Neon Dreams', artist: 'Cyber', duration: 245 },
  ];

  return (
    <div className="min-h-screen bg-cyber-dark p-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 */}
          <div className="space-y-6">
            <CyberClock variant="digital" theme="cyan" />
            <WeatherCard city="上海" temperature={28} weather="sunny" />
          </div>

          {/* 中间 */}
          <div>
            <MusicPlayer tracks={tracks} />
          </div>

          {/* 右侧 */}
          <div className="space-y-6">
            <TaskManager initialTasks={tasks} />
            <div className="p-4 bg-cyber-card rounded-lg">
              <h3 className="text-white mb-2">评分</h3>
              <RatingComponent
                value={rating}
                type="star"
                onChange={setRating}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 常见问题

### Q: 如何自定义组件样式？

A: 所有组件都支持 `className` 属性：

```tsx
<CyberClock className="my-custom-clock" />
```

### Q: 组件支持 TypeScript 吗？

A: 是的，所有组件都有完整的类型定义：

```tsx
import type { CyberClockProps } from '@/components/ui';
```

### Q: 如何禁用动画？

A: 可以通过修改组件的 `motion` 属性或使用 CSS：

```css
.no-animation * {
  animation: none !important;
}
```

### Q: 组件支持服务端渲染吗？

A: 大部分组件支持，但某些交互组件需要使用 `'use client'` 指令。

---

## 更多资源

- 📖 完整文档: `NEW_COMPONENTS_DOCUMENTATION.md`
- 🎨 演示页面: `/examples/new-components`
- 💻 源代码: `frontend/components/ui/`

---

## 更新日志

- **2026-03-03**: 创建 10 个新组件
- 共计 2543 行代码
- 完整的 TypeScript 类型支持
- 赛博朋克风格设计
