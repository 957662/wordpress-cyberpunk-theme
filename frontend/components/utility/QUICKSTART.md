# 🚀 实用工具组件快速开始

> CyberPress 实用工具组件库 - 5 分钟快速上手指南

## 📦 安装

组件已包含在项目中,无需额外安装。

## 🎯 快速使用

### 1. 导入组件

```tsx
// 从统一入口导入所有组件
import {
  StatCard,
  StatusBadge,
  NotificationCard,
  TagCloud,
  Timeline,
  CyberCard,
  Pagination,
  LoadingSpinner,
  EmptyState
} from '@/components/utility';
```

### 2. 基础示例

#### 统计卡片

```tsx
import { StatCard } from '@/components/utility';
import { TrendingUp } from 'lucide-react';

<StatCard
  title="总访问量"
  value="12,345"
  icon={TrendingUp}
  trend={{ value: 12.5, isPositive: true }}
  color="cyan"
/>
```

#### 状态徽章

```tsx
import { StatusBadge } from '@/components/utility';

<StatusBadge status="success" text="操作成功" />
<StatusBadge status="pending" text="处理中" variant="outline" />
```

#### 标签云

```tsx
import { TagCloud } from '@/components/utility';

const tags = [
  { id: '1', name: 'React', count: 45 },
  { id: '2', name: 'Vue', count: 38 },
  { id: '3', name: 'TypeScript', count: 32 }
];

<TagCloud
  tags={tags}
  selectable
  selectedTags={selectedTags}
  onTagClick={(id) => console.log(id)}
/>
```

#### 时间轴

```tsx
import { Timeline } from '@/components/utility';

const events = [
  {
    id: '1',
    title: '项目启动',
    description: '项目正式立项',
    timestamp: '2024-01-01',
    status: 'completed'
  },
  {
    id: '2',
    title: '开发阶段',
    description: '前后端开发进行中',
    timestamp: '2024-02-01',
    status: 'pending'
  }
];

<Timeline events={events} />
```

## 🎨 配色方案

所有组件支持统一的赛博朋克配色:

```tsx
// 可用颜色
color="cyan"    // 霓虹青 (默认)
color="purple"  // 赛博紫
color="pink"    // 激光粉
color="green"   // 赛博绿
color="yellow"  // 电压黄
```

## 📋 常用组件速查

| 组件 | 用途 | 导入 |
|------|------|------|
| `StatCard` | 数据统计卡片 | `from '@/components/utility'` |
| `StatusBadge` | 状态徽章 | `from '@/components/utility'` |
| `LoadingSpinner` | 加载动画 | `from '@/components/utility'` |
| `Pagination` | 分页导航 | `from '@/components/utility'` |
| `EmptyState` | 空状态 | `from '@/components/utility'` |
| `NotificationCard` | 通知卡片 | `from '@/components/utility'` |
| `TagCloud` | 标签云 | `from '@/components/utility'` |
| `Timeline` | 时间轴 | `from '@/components/utility'` |
| `CyberCard` | 赛博朋克卡片 | `from '@/components/utility'` |

## 💡 使用技巧

### 1. 响应式网格

```tsx
import { CardGrid } from '@/components/utility';

<CardGrid columns={3} gap="md">
  <StatCard title="指标1" value="100" />
  <StatCard title="指标2" value="200" />
  <StatCard title="指标3" value="300" />
</CardGrid>
```

### 2. 条件渲染

```tsx
{loading ? (
  <LoadingSpinner size="lg" text="加载中..." />
) : data.length === 0 ? (
  <EmptyState title="暂无数据" />
) : (
  <YourDataDisplay data={data} />
)}
```

### 3. 组合使用

```tsx
// 通知中心 + 分页
<div>
  <NotificationList notifications={notifications} />
  <Pagination
    currentPage={page}
    totalPages={totalPages}
    onPageChange={setPage}
  />
</div>
```

## 🔗 相关链接

- [完整文档](./README.md)
- [类型定义](../../../types/utility.types.ts)
- [在线示例](/examples/utility-showcase)

## ❓ 常见问题

### Q: 如何自定义样式?

A: 所有组件都支持 `className` prop:

```tsx
<CyberCard className="my-custom-class">
  内容
</CyberCard>
```

### Q: 如何处理事件?

A: 组件提供了回调函数:

```tsx
<TagCloud
  onTagClick={(tagId) => {
    console.log('Selected:', tagId);
  }}
/>
```

### Q: 支持哪些图标?

A: 使用 `lucide-react` 图标库:

```tsx
import { TrendingUp, Users, Activity } from 'lucide-react';

<StatCard icon={TrendingUp} />
```

---

## 📚 下一步

1. 查看 [完整文档](./README.md) 了解所有组件
2. 访问 [示例页面](/examples/utility-showcase) 查看实时演示
3. 阅读 [类型定义](../../../types/utility.types.ts) 了解 API

---

**需要帮助?** 查看 [项目文档](../../../../README.md) 或提交 Issue。
