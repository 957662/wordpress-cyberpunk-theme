# CyberPress - 扩展 Widget 组件文档

## 📦 新增 Widget 组件

本次更新为 CyberPress 添加了 5 个全新的 Widget 组件，丰富了侧边栏和内容区域的功能。

### 1. CalendarWidget - 日历组件

一个功能完整的日历组件，可显示当前日期并标记有文章发布的日期。

**特性：**
- ✅ 完整的日历视图
- ✅ 月份导航功能
- ✅ 文章发布日期标记
- ✅ 今日高亮显示
- ✅ 点击日期交互
- ✅ 快速返回今天
- ✅ 赛博朋克风格设计

**使用示例：**
```tsx
import { CalendarWidget } from '@/components/widgets';

function MyComponent() {
  const postDates = [
    new Date('2026-03-01'),
    new Date('2026-03-07'),
  ];

  return (
    <CalendarWidget
      postDates={postDates}
      showPostDates={true}
      onDateClick={(date) => console.log('点击日期:', date)}
    />
  );
}
```

**Props：**
- `currentDate?: Date` - 当前日期
- `postDates?: Date[]` - 有文章发布的日期数组
- `title?: string` - Widget 标题
- `showPostDates?: boolean` - 是否显示文章标记
- `onDateClick?: (date: Date) => void` - 点击日期回调

---

### 2. SocialLinksWidget - 社交链接组件

展示社交媒体和联系方式的链接组件，支持多种显示样式。

**特性：**
- ✅ 三种显示风格（网格/列表/仅图标）
- ✅ 支持多个社交平台
- ✅ 可自定义图标
- ✅ 悬停动画效果
- ✅ 描述文字显示
- ✅ 外部链接标识

**使用示例：**
```tsx
import { SocialLinksWidget } from '@/components/widgets';

const socialLinks = [
  {
    platform: 'github',
    url: 'https://github.com/username',
    name: 'GitHub',
    description: '查看我的开源项目'
  },
  {
    platform: 'twitter',
    url: 'https://twitter.com/username',
    name: 'Twitter',
    description: '关注我的最新动态'
  },
];

// 列表样式
<SocialLinksWidget
  links={socialLinks}
  variant="list"
  showDescription={true}
/>

// 网格样式
<SocialLinksWidget
  links={socialLinks}
  variant="grid"
  iconSize="md"
/>

// 仅图标样式
<SocialLinksWidget
  links={socialLinks}
  variant="icons"
/>
```

**Props：**
- `links: SocialLink[]` - 社交链接数组
- `title?: string` - Widget 标题
- `variant?: 'grid' | 'list' | 'icons'` - 显示风格
- `iconSize?: 'sm' | 'md' | 'lg'` - 图标大小
- `showDescription?: boolean` - 是否显示描述

**支持的平台：**
- `github` - GitHub
- `twitter` - Twitter
- `email` - 电子邮件
- `rss` - RSS 订阅
- `linkedin` - LinkedIn
- `youtube` - YouTube
- `instagram` - Instagram
- `twitch` - Twitch
- `custom` - 自定义（需提供 customIcon）

---

### 3. NewsletterWidget - 邮件订阅组件

完整的邮件订阅表单，包含验证和状态反馈。

**特性：**
- ✅ 邮箱格式验证
- ✅ 加载状态显示
- ✅ 成功/错误反馈
- ✅ 自定义 API 端点
- ✅ 防重复提交
- ✅ 隐私说明
- ✅ 霓虹按钮效果

**使用示例：**
```tsx
import { NewsletterWidget } from '@/components/widgets';

<NewsletterWidget
  title="订阅更新"
  description="获取最新的文章和资讯"
  placeholder="your@email.com"
  buttonText="订阅"
  successMessage="订阅成功！请检查您的邮箱。"
  onSubscribe={async (email) => {
    // 调用订阅 API
    await fetch('/api/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }}
/>
```

**Props：**
- `subscribeEndpoint?: string` - 订阅接口地址
- `title?: string` - Widget 标题
- `description?: string` - 描述文字
- `placeholder?: string` - 输入框占位符
- `buttonText?: string` - 按钮文字
- `successMessage?: string` - 成功消息
- `onSubscribe?: (email: string) => Promise<void>` - 订阅回调

---

### 4. PopularPostsWidget - 热门文章组件

基于浏览量或评论数显示热门文章。

**特性：**
- ✅ 多种排序方式
- ✅ 排名徽章显示
- ✅ 统计数据展示
- ✅ 前三名特殊样式
- ✅ 动态图标
- ✅ 空状态处理

**使用示例：**
```tsx
import { PopularPostsWidget } from '@/components/widgets';

const posts = [
  {
    id: 1,
    title: { rendered: '文章标题' },
    slug: 'post-slug',
    views: 15234,
    comment_count: 42,
    date: '2026-03-01T10:00:00',
  },
  // ... 更多文章
];

// 按浏览量排序
<PopularPostsWidget
  posts={posts}
  sortBy="views"
  showRank={true}
  showStats={true}
/>

// 按评论数排序
<PopularPostsWidget
  posts={posts}
  sortBy="comments"
  count={5}
/>
```

**Props：**
- `posts: Post[]` - 文章列表
- `count?: number` - 显示数量（默认 5）
- `sortBy?: 'views' | 'comments' | 'recent'` - 排序方式
- `title?: string` - Widget 标题
- `showRank?: boolean` - 是否显示排名
- `showStats?: boolean` - 是否显示统计

---

### 5. RelatedPostsWidget - 相关文章组件

基于标签或分类推荐相关文章。

**特性：**
- ✅ 智能相关性计算
- ✅ 多种关联方式
- ✅ 标签/分类显示
- ✅ 摘要展示
- ✅ 降级处理（无相关文章时显示最新）
- ✅ 提示信息

**使用示例：**
```tsx
import { RelatedPostsWidget } from '@/components/widgets';

<RelatedPostsWidget
  currentPost={currentPost}
  allPosts={allPosts}
  count={5}
  relateBy="both" // 'tags' | 'categories' | 'both'
  showTaxonomy={true}
/>
```

**Props：**
- `currentPost: Post` - 当前文章
- `allPosts: Post[]` - 所有文章列表
- `count?: number` - 显示数量（默认 5）
- `relateBy?: 'tags' | 'categories' | 'both'` - 关联方式
- `title?: string` - Widget 标题
- `showTaxonomy?: boolean` - 是否显示标签/分类

---

## 🎯 设计特点

### 1. 赛博朋克主题
- 霓虹配色方案
- 发光效果和阴影
- 扫描线和故障效果

### 2. 完整动画
- Framer Motion 驱动
- 流畅的过渡效果
- 交互动画反馈

### 3. 类型安全
- 完整的 TypeScript 支持
- 类型导出
- IntelliSense 支持

### 4. 响应式设计
- 移动端友好
- 自适应布局
- 灵活的网格系统

---

## 📖 使用方法

### 基础导入

```typescript
// 导入所有 Widget
import {
  CalendarWidget,
  SocialLinksWidget,
  NewsletterWidget,
  PopularPostsWidget,
  RelatedPostsWidget,
} from '@/components/widgets';
```

### 类型导入

```typescript
// 导入类型
import type {
  CalendarWidgetProps,
  SocialLinksWidgetProps,
  SocialLink,
  SocialPlatform,
  NewsletterWidgetProps,
  PopularPostsWidgetProps,
  RelatedPostsWidgetProps,
} from '@/components/widgets';
```

---

## 🎨 自定义样式

所有 Widget 都支持通过 `className` prop 进行样式自定义：

```tsx
<CalendarWidget
  className="my-custom-class"
  // ... other props
/>
```

---

## 📱 演示页面

查看完整的组件演示：
```
/widgets-expanded
```

---

## 🔧 依赖项

这些 Widget 依赖于以下库：
- `framer-motion` - 动画
- `date-fns` - 日期处理
- `react` - React 框架
- `@/components/icons` - 图标组件
- `@/lib/utils` - 工具函数
- `@/types/wordpress` - WordPress 类型

---

## 🚀 下一步计划

- [ ] 添加更多社交平台支持
- [ ] 实现多语言支持
- [ ] 添加无障碍功能
- [ ] 性能优化
- [ ] 添加更多 Widget 类型

---

**版本**: 1.0.0
**更新日期**: 2026-03-07
**作者**: AI 开发团队
