# CyberPress 实用工具组件使用指南

本文档介绍了 CyberPress 平台中新增的实用工具组件，包括赛博朋克日历、阅读时间估算器、社交分享浮窗和文章目录导航。

## 📦 组件列表

### 1. CyberCalendar - 赛博朋克日历

一个功能丰富的日历组件，支持日期选择、高亮显示、日期范围限制等功能。

#### 功能特性

- ✅ 日期选择和回调
- ✅ 高亮显示特定日期
- ✅ 限制日期范围（最小/最大日期）
- ✅ 今天日期自动标记
- ✅ 月份切换动画
- ✅ 赛博朋克风格设计
- ✅ 完整的 TypeScript 类型支持

#### 基础用法

```tsx
import { CyberCalendar } from '@/components/utils';

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  return (
    <CyberCalendar
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
    />
  );
}
```

#### 高级用法

```tsx
import { CyberCalendar } from '@/components/utils';

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // 高亮日期
  const highlightedDates = [
    new Date(2026, 2, 15),
    new Date(2026, 2, 20),
    new Date(2026, 2, 25),
  ];

  return (
    <CyberCalendar
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
      highlightedDates={highlightedDates}
      minDate={new Date(2026, 0, 1)}
      maxDate={new Date(2026, 11, 31)}
      className="max-w-md"
    />
  );
}
```

#### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `selectedDate` | `Date \| undefined` | 否 | `undefined` | 当前选中的日期 |
| `onDateSelect` | `(date: Date) => void` | 否 | - | 日期选择回调 |
| `minDate` | `Date` | 否 | - | 最小可选日期 |
| `maxDate` | `Date` | 否 | - | 最大可选日期 |
| `highlightedDates` | `Date[]` | 否 | `[]` | 需要高亮的日期数组 |
| `className` | `string` | 否 | `''` | 自定义样式类名 |

---

### 2. ReadingTimeEstimator - 阅读时间估算器

智能计算文章阅读时间，支持中英文混合内容，实时显示滚动进度。

#### 功能特性

- ✅ 智能计算阅读时间（中文按字符，英文按单词）
- ✅ 实时滚动进度显示
- ✅ 剩余阅读时间估算
- ✅ 字数统计
- ✅ 进度条可视化
- ✅ 赛博朋克风格设计

#### 基础用法

```tsx
import { ReadingTimeEstimator } from '@/components/utils';

function BlogPost({ content }) {
  return (
    <div>
      <ReadingTimeEstimator content={content} />
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```

#### 高级用法

```tsx
import { ReadingTimeEstimator } from '@/components/utils';

function BlogPost({ content }) {
  return (
    <div>
      <ReadingTimeEstimator
        content={content}
        wordsPerMinute={200}
        showProgress={true}
        className="mb-6"
      />
      <article dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```

#### 便捷函数

```tsx
import { calculateReadingTime } from '@/components/utils';

// 计算阅读时间
const { minutes, seconds, text } = calculateReadingTime(content);
console.log(`阅读时间: ${text}`);
```

#### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `content` | `string` | 是 | - | 文章内容（支持 HTML） |
| `wordsPerMinute` | `number` | 否 | `200` | 每分钟阅读字数 |
| `showProgress` | `boolean` | 否 | `true` | 是否显示进度条 |
| `className` | `string` | 否 | `''` | 自定义样式类名 |

---

### 3. SocialShareFloating - 社交分享浮窗

浮动式社交分享按钮，支持多个主流社交平台一键分享。

#### 功能特性

- ✅ 支持多个社交平台
- ✅ 一键复制链接
- ✅ 原生分享（移动端）
- ✅ 浮动按钮设计
- ✅ 发光动画效果
- ✅ 左右位置可选

#### 基础用法

```tsx
import { SocialShareFloating } from '@/components/utils';

function BlogPost({ title, content }) {
  return (
    <article>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />

      {/* 社交分享浮窗 */}
      <SocialShareFloating
        title={title}
        description="文章摘要"
      />
    </article>
  );
}
```

#### 高级用法

```tsx
import { SocialShareFloating } from '@/components/utils';

function BlogPost({ title, content }) {
  return (
    <article>
      <SocialShareFloating
        title={title}
        url="https://example.com/post"
        description="文章描述"
        position="left"
        platforms={['twitter', 'facebook', 'linkedin', 'weibo', 'copy']}
        className="z-50"
      />
    </article>
  );
}
```

#### 静态分享按钮

```tsx
import { SocialShareButtons } from '@/components/utils';

function BlogPostFooter({ title }) {
  return (
    <div className="mt-8 pt-8 border-t">
      <SocialShareButtons
        title={title}
        description="分享这篇文章"
        className="justify-center"
      />
    </div>
  );
}
```

#### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `title` | `string` | 是 | - | 分享标题 |
| `url` | `string` | 否 | 当前 URL | 分享链接 |
| `description` | `string` | 否 | `''` | 分享描述 |
| `position` | `'left' \| 'right'` | 否 | `'left'` | 浮动按钮位置 |
| `platforms` | `array` | 否 | `['twitter', 'facebook', 'linkedin', 'copy']` | 显示的平台 |
| `className` | `string` | 否 | `''` | 自定义样式类名 |

#### 支持的平台

- `twitter` - Twitter/X
- `facebook` - Facebook
- `linkedin` - LinkedIn
- `whatsapp` - WhatsApp
- `weibo` - 新浪微博
- `wechat` - 微信（显示二维码）
- `copy` - 复制链接

---

### 4. ArticleTableOfContents - 文章目录导航

自动生成文章目录，支持多级标题，随滚动自动高亮当前章节。

#### 功能特性

- ✅ 自动提取标题（h2, h3, h4）
- ✅ 滚动自动高亮
- ✅ 平滑滚动定位
- ✅ 多级标题缩进
- ✅ 响应式设计
- ✅ 桌面端固定 / 移动端抽屉

#### 基础用法

```tsx
import { ArticleTableOfContents } from '@/components/utils';

function BlogPost({ content }) {
  return (
    <div className="relative">
      <ArticleTableOfContents content={content} />

      <article dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```

#### 高级用法

```tsx
import { ArticleTableOfContents } from '@/components/utils';

function BlogPost({ content }) {
  return (
    <div className="relative">
      <ArticleTableOfContents
        content={content}
        position="left"
        offset={120}
        className="top-32"
      />

      <article dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```

#### 使用 Hook

```tsx
import { useTableOfContents } from '@/components/utils';

function BlogPost() {
  const headings = useTableOfContents();

  return (
    <nav>
      {headings.map(heading => (
        <a key={heading.id} href={`#${heading.id}`}>
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
```

#### Props

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `content` | `string` | 是 | - | 文章内容（HTML） |
| `position` | `'left' \| 'right'` | 否 | `'right'` | 目录位置 |
| `offset` | `number` | 否 | `100` | 滚动偏移量（px） |
| `className` | `string` | 否 | `''` | 自定义样式类名 |

---

## 🎨 完整示例

查看完整示例：`/utils-demo` 页面

```bash
npm run dev
# 访问 http://localhost:3000/utils-demo
```

## 📝 最佳实践

### 1. 日历组件

```tsx
// 适用于：预约系统、日期选择器、活动日历
<CyberCalendar
  selectedDate={appointmentDate}
  onDateSelect={handleDateSelect}
  minDate={new Date()} // 不能选择过去的日期
  highlightedDates={availableDates} // 高亮可用日期
/>
```

### 2. 阅读时间估算器

```tsx
// 适用于：博客文章、长文档、教程内容
<div className="sticky top-4 z-10">
  <ReadingTimeEstimator
    content={articleContent}
    showProgress={true}
  />
</div>
```

### 3. 社交分享

```tsx
// 适用于：所有可分享的内容页面
<SocialShareFloating
  title={pageTitle}
  description={pageDescription}
  position="right" // 根据页面布局选择
/>
```

### 4. 文章目录

```tsx
// 适用于：长文章、文档、教程
// 确保文章内容包含 h2, h3, h4 标题
<div className="relative">
  <ArticleTableOfContents content={content} />
  <article className="prose-cyber">{content}</article>
</div>
```

## 🎯 TypeScript 支持

所有组件都提供完整的 TypeScript 类型定义：

```tsx
import type {
  CyberCalendarProps,
  ReadingTimeEstimatorProps,
  SocialShareFloatingProps,
  ArticleTableOfContentsProps,
  TableOfContentsItem,
} from '@/components/utils';
```

## 🔧 自定义样式

所有组件都支持通过 `className` prop 自定义样式：

```tsx
<CyberCalendar className="my-custom-class" />
```

组件使用了 Tailwind CSS 的赛博朋克主题，确保与整体设计风格一致。

## 📱 响应式设计

所有组件都完全响应式：

- **桌面端**：完整功能展示
- **平板端**：适配布局调整
- **移动端**：优化触摸交互

## 🚀 性能优化

- 使用 `useMemo` 优化计算
- 使用 `useCallback` 避免不必要的重渲染
- 滚动事件使用 passive 监听器
- 动画使用 CSS transforms

## 📄 License

MIT License - 随 CyberPress 项目一起使用。

---

**需要帮助？** 查看项目文档或提交 Issue。
