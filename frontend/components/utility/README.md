# 实用工具组件库

CyberPress 平台的实用工具组件集合,提供了一系列开箱即用的高质量组件。

## 📦 组件列表

### 1. 加载组件 (LoadingSpinner)

多种样式的加载动画组件。

**组件:**
- `LoadingSpinner` - 标准旋转加载器
- `DotLoader` - 点阵加载动画
- `PulseLoader` - 脉冲加载动画
- `GlitchLoader` - 故障风加载器
- `SkeletonCard` - 骨架屏卡片
- `ProgressBar` - 进度条

**示例:**
```tsx
import { LoadingSpinner, ProgressBar } from '@/components/utility';

// 基础用法
<LoadingSpinner size="lg" color="cyan" text="加载中..." />

// 进度条
<ProgressBar progress={75} color="cyan" />
```

### 2. 空状态组件 (EmptyState)

用于展示空数据状态的组件。

**组件:**
- `EmptyState` - 标准空状态
- `EmptyStateMini` - 迷你空状态
- `EmptyStateInline` - 内联空状态

**示例:**
```tsx
<EmptyState
  title="暂无文章"
  description="还没有发布任何文章"
  action={{
    label: '创建文章',
    onClick: () => {},
    variant: 'primary'
  }}
/>
```

### 3. 错误边界 (ErrorBoundary)

捕获和处理 React 组件错误。

**示例:**
```tsx
import { ErrorBoundary } from '@/components/utility';

<ErrorBoundary
  onError={(error, errorInfo) => {
    console.error('Error caught:', error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### 4. 分页组件 (Pagination)

灵活的分页导航组件。

**组件:**
- `Pagination` - 完整分页器
- `SimplePagination` - 简化分页器
- `LoadMoreButton` - 加载更多按钮

**示例:**
```tsx
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  showFirstLast={true}
  maxVisiblePages={7}
/>
```

### 5. 统计卡片 (StatCard)

展示统计数据的信息卡片。

**组件:**
- `StatCard` - 标准统计卡片
- `StatCardMini` - 迷你统计卡片
- `StatCardGrid` - 统计卡片网格

**示例:**
```tsx
<StatCard
  title="总访问量"
  value="12,345"
  icon={TrendingUp}
  trend={{ value: 12.5, isPositive: true }}
  color="cyan"
/>
```

### 6. 状态徽章 (StatusBadge)

展示状态的徽章组件。

**组件:**
- `StatusBadge` - 状态徽章
- `StatusDot` - 状态点
- `StatusBadgeGroup` - 徽章组
- `ProgressBadge` - 进度徽章

**示例:**
```tsx
<StatusBadge status="success" text="成功" size="md" variant="solid" />
<StatusBadge status="pending" text="处理中" size="sm" variant="outline" />
```

### 7. 通知卡片 (NotificationCard)

展示通知信息的卡片组件。

**组件:**
- `NotificationCard` - 通知卡片
- `NotificationList` - 通知列表
- `NotificationSummary` - 通知摘要

**示例:**
```tsx
<NotificationCard
  type="comment"
  title="新评论"
  message="张三 评论了你的文章"
  time="2分钟前"
  read={false}
  onRead={() => {}}
/>
```

### 8. 搜索栏 (SearchBarAdvanced)

高级搜索组件,支持建议和筛选。

**组件:**
- `SearchBarAdvanced` - 高级搜索栏
- `QuickSearch` - 快速搜索框

**示例:**
```tsx
<SearchBarAdvanced
  onSearch={handleSearch}
  suggestions={suggestions}
  recentSearches={recentSearches}
  showFilters={true}
  filters={filterConfig}
  onFilterChange={handleFilterChange}
/>
```

### 9. 标签云 (TagCloud)

展示标签的云状组件。

**组件:**
- `TagCloud` - 标签云
- `TagSelector` - 标签选择器

**示例:**
```tsx
<TagCloud
  tags={tags}
  variant="default"
  size="md"
  selectable={true}
  selectedTags={selectedTags}
  onTagClick={handleTagClick}
  sortBy="count"
/>
```

### 10. 时间轴 (Timeline)

展示事件序列的时间轴组件。

**组件:**
- `Timeline` - 标准时间轴
- `TimelineMini` - 迷你时间轴
- `ProgressTimeline` - 进度时间轴

**示例:**
```tsx
<Timeline
  events={timelineEvents}
  variant="vertical"
  showDate={true}
/>
```

### 11. 卡片组件 (CardGrid)

多种样式的卡片容器组件。

**组件:**
- `CardGrid` - 卡片网格
- `CyberCard` - 赛博朋克卡片
- `GlassCard` - 玻璃态卡片
- `HolographicCard` - 全息卡片
- `CollapsibleCard` - 可折叠卡片
- `AnimatedStatGrid` - 动画统计网格

**示例:**
```tsx
<CyberCard variant="glow" hover={true}>
  <h3>卡片标题</h3>
  <p>卡片内容</p>
</CyberCard>
```

## 🎨 样式主题

所有组件支持赛博朋克配色方案:

- `cyan` - 霓虹青 (默认)
- `purple` - 赛博紫
- `pink` - 激光粉
- `green` - 赛博绿
- `yellow` - 电压黄

## 📖 使用示例

### 完整示例页面

查看 `/app/examples/utility-showcase/page.tsx` 获取所有组件的使用示例。

### 基础用法

```tsx
import {
  StatCard,
  StatusBadge,
  NotificationCard,
  TagCloud,
  Timeline,
  CyberCard
} from '@/components/utility';

export default function MyPage() {
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <StatCard
        title="总用户数"
        value="1,234"
        trend={{ value: 12.5, isPositive: true }}
        color="cyan"
      />

      {/* 状态徽章 */}
      <StatusBadge status="success" text="操作成功" />

      {/* 标签云 */}
      <TagCloud tags={tags} selectable />
    </div>
  );
}
```

## 🎯 组件特性

- ✅ **TypeScript 支持** - 完整的类型定义
- ✅ **响应式设计** - 适配各种屏幕尺寸
- ✅ **赛博朋克风格** - 独特的视觉效果
- ✅ **可定制** - 灵活的配置选项
- ✅ **可访问性** - 遵循 WCAG 标准
- ✅ **动画效果** - 流畅的过渡动画

## 🔧 开发指南

### 添加新组件

1. 在 `components/utility/` 创建组件文件
2. 导出组件并添加类型定义
3. 在 `index.ts` 中添加导出
4. 在示例页面中添加演示

### 组件规范

- 使用 TypeScript 定义 Props 类型
- 支持赛博朋克配色方案
- 添加 `className` prop 支持自定义样式
- 使用 `cn()` 工具函数合并类名
- 添加适当的动画效果

## 📚 相关资源

- [设计系统](../../../docs/COLOR_REFERENCE.md)
- [组件库](../../ui/README.md)
- [类型定义](../../../types/utility.types.ts)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

---

**最后更新:** 2026-03-06
**维护者:** AI Development Team
