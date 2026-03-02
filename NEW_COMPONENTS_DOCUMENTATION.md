# 新组件创建文档

## 概述

本文档记录了为 CyberPress Platform 创建的全新赛博朋克风格 UI 组件。所有组件均使用 TypeScript + React + Tailwind CSS + Framer Motion 构建，完全符合项目的设计规范。

## 创建日期

2026-03-03

## 组件列表

### 1. CyberClock - 赛博朋克时钟

**文件位置**: `frontend/components/ui/CyberClock.tsx`

**功能特性**:
- ✨ 数字时钟和模拟时钟两种显示模式
- 🎨 支持 4 种颜色主题（青色、紫色、粉色、黄色）
- 📅 可选显示日期、星期
- ⏱️ 秒针进度条动画
- 📱 三种尺寸规格（sm, md, lg）
- 🌟 霓虹灯发光效果

**使用示例**:
```tsx
import { CyberClock } from '@/components/ui';

<CyberClock
  variant="digital"
  size="md"
  theme="cyan"
  showSeconds={true}
  showDate={true}
/>
```

---

### 2. PasswordStrength - 密码强度检测

**文件位置**: `frontend/components/ui/PasswordStrength.tsx`

**功能特性**:
- 🔒 实时密码强度检测
- 📊 可视化强度进度条
- ✅ 密码要求检查列表
- 👁️ 显示/隐藏密码切换
- 🎯 智能建议和反馈
- 🎨 动态颜色变化（弱/中/强）

**使用示例**:
```tsx
import { PasswordStrength } from '@/components/ui';

<PasswordStrength
  value={password}
  onChange={setPassword}
  minLength={8}
  showRequirements={true}
/>
```

---

### 3. WeatherCard - 天气卡片

**文件位置**: `frontend/components/ui/WeatherCard.tsx`

**功能特性**:
- 🌤️ 6 种天气类型（晴、多云、雨、雪、雷暴、大风）
- 🌡️ 温度显示
- 💧 湿度和风速显示
- 🎭 动画背景效果
- 📏 三种尺寸规格
- 🌟 霓虹灯发光效果

**使用示例**:
```tsx
import { WeatherCard } from '@/components/ui';

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

---

### 4. MusicPlayer - 音乐播放器

**文件位置**: `frontend/components/ui/MusicPlayer.tsx`

**功能特性**:
- ▶️ 播放/暂停控制
- ⏮️⏭️ 上一曲/下一曲
- 📊 进度条拖动
- 🔊 音量控制和静音
- 🔁 重复和随机播放
- 📋 播放列表管理
- 🎨 专辑封面显示

**使用示例**:
```tsx
import { MusicPlayer } from '@/components/ui';

const tracks = [
  { id: '1', title: 'Song', artist: 'Artist', duration: 245 }
];

<MusicPlayer
  tracks={tracks}
  autoPlay={false}
  showPlaylist={true}
/>
```

---

### 5. TaskManager - 任务管理器

**文件位置**: `frontend/components/ui/TaskManager.tsx`

**功能特性**:
- ➕ 添加/删除任务
- ✅ 标记完成状态
- 🎯 优先级设置（高/中/低）
- 📊 进度统计
- 🔢 任务数量限制
- 💬 任务描述支持

**使用示例**:
```tsx
import { TaskManager } from '@/components/ui';

<TaskManager
  initialTasks={tasks}
  showProgress={true}
  maxTasks={20}
/>
```

---

### 6. CodePreview - 代码预览

**文件位置**: `frontend/components/ui/CodePreview.tsx`

**功能特性**:
- 🎨 语法高亮
- 🔢 行号显示
- 📋 一键复制
- 👁️ 代码预览模式
- 📏 可展开/折叠
- 📊 行数和字符统计

**使用示例**:
```tsx
import { CodePreview } from '@/components/ui';

<CodePreview
  code={sourceCode}
  language="typescript"
  title="Component.tsx"
  showLineNumbers={true}
  showCopy={true}
/>
```

---

### 7. DataTable - 数据表格

**文件位置**: `frontend/components/ui/DataTable.tsx`

**功能特性**:
- 📊 列排序
- 🔍 搜索筛选
- 📄 分页显示
- 🎨 自定义列渲染
- 👆 行点击事件
- 📱 响应式设计

**使用示例**:
```tsx
import { DataTable } from '@/components/ui';

const columns: Column<User>[] = [
  { key: 'name', title: '姓名', sortable: true },
  { key: 'email', title: '邮箱' },
];

<DataTable
  data={users}
  columns={columns}
  sortable={true}
  pageSize={10}
/>
```

---

### 8. NotificationToast - 通知提示

**文件位置**: `frontend/components/ui/NotificationToast.tsx`

**功能特性**:
- 🔔 4 种类型（成功、错误、警告、信息）
- 📍 6 种位置选项
- ⏱️ 自动关闭
- 📊 进度条动画
- ❌ 手动关闭
- 🎨 类型化颜色主题

**使用示例**:
```tsx
import { NotificationToast } from '@/components/ui';

const notifications = [
  { id: '1', type: 'success', title: '成功', message: '操作完成' }
];

<NotificationToast
  notifications={notifications}
  position="top-right"
  onClose={handleClose}
/>
```

---

### 9. RatingComponent - 评分组件

**文件位置**: `frontend/components/ui/RatingComponent.tsx`

**功能特性**:
- ⭐ 星级评分（支持半星）
- 🔢 数字评分
- 😊 表情符号评分
- 👍 点赞评分
- 📏 三种尺寸规格
- ✏️ 可编辑/只读模式

**使用示例**:
```tsx
import { RatingComponent } from '@/components/ui';

<RatingComponent
  value={4.5}
  maxValue={5}
  type="star"
  readonly={false}
  onChange={setRating}
/>
```

---

### 10. StepProgress - 步骤进度条

**文件位置**: `frontend/components/ui/StepProgress.tsx`

**功能特性**:
- 📐 水平和垂直布局
- 👆 可点击步骤
- ✅ 完成状态指示
- 🎯 当前步骤高亮
- 🎨 自定义图标
- 📏 三种尺寸规格

**使用示例**:
```tsx
import { StepProgress } from '@/components/ui';

const steps = [
  { id: '1', title: '注册' },
  { id: '2', title: '验证' },
  { id: '3', title: '完成' },
];

<StepProgress
  steps={steps}
  currentStep={1}
  completedSteps={[0]}
  variant="horizontal"
/>
```

---

## 演示页面

### 新组件展示页

**路径**: `frontend/app/examples/new-components/page.tsx`

**路由**: `/examples/new-components`

这个页面展示了所有新创建的组件，包含实时交互演示。

访问方式：
```bash
# 开发环境
npm run dev

# 浏览器访问
http://localhost:3000/examples/new-components
```

---

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.4
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion 11.0
- **图标**: Lucide React 0.363
- **工具**: clsx, tailwind-merge

---

## 设计规范

### 颜色主题

```typescript
colors: {
  cyber: {
    dark: '#0a0a0f',      // 深色背景
    cyan: '#00f0ff',      // 青色主题
    purple: '#9d00ff',    // 紫色主题
    pink: '#ff0080',      // 粉色主题
    yellow: '#f0ff00',    // 黄色主题
    green: '#00ff88',     // 绿色主题
    // ... 更多颜色
  }
}
```

### 动画效果

- `glow` - 霓虹灯发光
- `flicker` - 闪烁效果
- `scan` - 扫描线
- `float` - 悬浮动画
- `pulse-glow` - 脉冲发光

### 组件规范

1. **TypeScript**: 所有组件都有完整的类型定义
2. **可访问性**: 支持键盘导航和屏幕阅读器
3. **响应式**: 适配各种屏幕尺寸
4. **主题化**: 支持多种颜色主题
5. **动画**: 使用 Framer Motion 实现流畅动画

---

## 导出索引

所有组件已添加到 `frontend/components/ui/index.ts`：

```typescript
// 可以从主入口导入
import {
  CyberClock,
  PasswordStrength,
  WeatherCard,
  MusicPlayer,
  TaskManager,
  CodePreview,
  DataTable,
  NotificationToast,
  RatingComponent,
  StepProgress,
} from '@/components/ui';
```

---

## 文件结构

```
frontend/
├── components/
│   └── ui/
│       ├── CyberClock.tsx           # 赛博时钟
│       ├── PasswordStrength.tsx     # 密码强度
│       ├── WeatherCard.tsx          # 天气卡片
│       ├── MusicPlayer.tsx          # 音乐播放器
│       ├── TaskManager.tsx          # 任务管理器
│       ├── CodePreview.tsx          # 代码预览
│       ├── DataTable.tsx            # 数据表格
│       ├── NotificationToast.tsx    # 通知提示
│       ├── RatingComponent.tsx      # 评分组件
│       ├── StepProgress.tsx         # 步骤进度条
│       └── index.ts                 # 导出索引
└── app/
    └── examples/
        └── new-components/
            └── page.tsx             # 演示页面
```

---

## 使用建议

### 1. 在页面中使用

```tsx
// app/page.tsx
import { CyberClock, WeatherCard } from '@/components/ui';

export default function HomePage() {
  return (
    <div>
      <CyberClock variant="digital" theme="cyan" />
      <WeatherCard city="上海" temperature={28} weather="sunny" />
    </div>
  );
}
```

### 2. 组合使用

```tsx
import { TaskManager, MusicPlayer } from '@/components/ui';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <TaskManager initialTasks={tasks} />
      <MusicPlayer tracks={tracks} />
    </div>
  );
}
```

### 3. 自定义样式

所有组件都支持 `className` 属性，可以自定义样式：

```tsx
<CyberClock
  className="my-custom-class"
  theme="purple"
/>
```

---

## 测试清单

- [x] 组件正常渲染
- [x] TypeScript 类型检查通过
- [x] 响应式设计正常
- [x] 动画效果流畅
- [x] 所有交互功能正常
- [x] 无控制台错误

---

## 下一步计划

1. 添加单元测试
2. 添加 Storybook 文档
3. 性能优化
4. 添加更多主题变体
5. 国际化支持

---

## 贡献者

- 创建日期: 2026-03-03
- 框架版本: Next.js 14.2.0
- TypeScript 版本: 5.4.0

---

## 许可证

MIT License - CyberPress Platform
