# 实用工具组件 - 快速代码片段

快速复制使用的代码片段集合。

## 📅 CyberCalendar - 日历组件

### 基础使用

```tsx
import { CyberCalendar } from '@/components/utils';
import { useState } from 'react';

export default function Page() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <CyberCalendar
      selectedDate={selectedDate}
      onDateSelect={setSelectedDate}
    />
  );
}
```

### 带限制的日历

```tsx
import { CyberCalendar } from '@/components/utils';

export default function Page() {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 3);

  return (
    <CyberCalendar
      minDate={today}
      maxDate={maxDate}
      onDateSelect={(date) => console.log('Selected:', date)}
    />
  );
}
```

### 高亮特定日期

```tsx
import { CyberCalendar } from '@/components/utils';

export default function EventCalendar() {
  const eventDates = [
    new Date(2026, 2, 15),
    new Date(2026, 2, 20),
    new Date(2026, 2, 25),
  ];

  return (
    <CyberCalendar
      highlightedDates={eventDates}
      onDateSelect={(date) => {
        const hasEvent = eventDates.some(
          d => d.toDateString() === date.toDateString()
        );
        if (hasEvent) {
          console.log('Event date selected!');
        }
      }}
    />
  );
}
```

---

## ⏱️ ReadingTimeEstimator - 阅读时间

### 文章页面使用

```tsx
import { ReadingTimeEstimator } from '@/components/utils';

interface BlogPostProps {
  title: string;
  content: string;
}

export default function BlogPost({ title, content }) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* 阅读时间和进度 */}
      <ReadingTimeEstimator
        content={content}
        className="mb-8 sticky top-4 z-10"
      />

      {/* 文章内容 */}
      <h1 className="text-4xl font-bold mb-8">{title}</h1>
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
```

### 自定义阅读速度

```tsx
import { ReadingTimeEstimator } from '@/components/utils';

export default function TechnicalDoc({ content }) {
  return (
    <ReadingTimeEstimator
      content={content}
      wordsPerMinute={150} // 技术文档，较慢的阅读速度
      showProgress={true}
    />
  );
}
```

### 仅显示时间

```tsx
import { calculateReadingTime } from '@/components/utils';

export default function PostMeta({ content }) {
  const { text: readingTime } = calculateReadingTime(content);

  return (
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <span>📖 {readingTime}</span>
      <span>•</span>
      <span>{content.split(/\s+/).length} 字</span>
    </div>
  );
}
```

---

## 📤 SocialShareFloating - 社交分享

### 基础使用

```tsx
import { SocialShareFloating } from '@/components/utils';

export default function BlogPost({ title, content }) {
  return (
    <article>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />

      {/* 右下角浮动分享按钮 */}
      <SocialShareFloating title={title} />
    </article>
  );
}
```

### 自定义平台

```tsx
import { SocialShareFloating } from '@/components/utils';

export default function ChineseBlogPost({ title }) {
  return (
    <SocialShareFloating
      title={title}
      platforms={['weibo', 'wechat', 'copy']}
      position="left"
    />
  );
}
```

### 静态分享按钮（嵌入内容）

```tsx
import { SocialShareButtons } from '@/components/utils';

export default function BlogPostFooter({ title }) {
  return (
    <footer className="mt-12 pt-8 border-t border-gray-200">
      <h3>分享这篇文章</h3>
      <SocialShareButtons
        title={title}
        className="justify-center mt-4"
      />
    </footer>
  );
}
```

### 自定义 URL

```tsx
import { SocialShareFloating } from '@/components/utils';

export default function ProductPage({ productName, productId }) {
  const shareUrl = `https://myapp.com/products/${productId}`;

  return (
    <SocialShareFloating
      title={productName}
      url={shareUrl}
      description={`查看 ${productName} - 超值优惠！`}
    />
  );
}
```

---

## 📑 ArticleTableOfContents - 文章目录

### 基础使用

```tsx
import { ArticleTableOfContents } from '@/components/utils';

export default function LongArticle({ content }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ArticleTableOfContents content={content} />

      <article
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
```

### 左侧目录

```tsx
import { ArticleTableOfContents } from '@/components/utils';

export default function Documentation({ content }) {
  return (
    <div className="flex gap-8">
      <aside className="w-64 flex-shrink-0">
        <ArticleTableOfContents
          content={content}
          position="left"
          offset={80}
        />
      </aside>

      <main className="flex-1">
        <article dangerouslySetInnerHTML={{ __html: content }} />
      </main>
    </div>
  );
}
```

### 使用 Hook 自定义目录

```tsx
import { useTableOfContents } from '@/components/utils';
import { useEffect } from 'react';

export default function CustomTOC() {
  const headings = useTableOfContents();

  useEffect(() => {
    console.log('Found headings:', headings);
  }, [headings]);

  return (
    <nav className="space-y-2">
      {headings.map((heading) => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          className={`block ${
            heading.level === 2 ? 'text-lg' : 'text-base ml-4'
          }`}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}
```

---

## 🎯 组合使用示例

### 完整的博客文章页面

```tsx
import {
  ArticleTableOfContents,
  ReadingTimeEstimator,
  SocialShareFloating,
  SocialShareButtons,
} from '@/components/utils';
import { ClockIcon, CalendarIcon } from '@/components/icons';

interface BlogPostProps {
  title: string;
  content: string;
  publishedAt: Date;
  author: string;
}

export default function BlogPost({
  title,
  content,
  publishedAt,
  author,
}: BlogPostProps) {
  return (
    <article className="min-h-screen bg-cyber-dark">
      {/* 社交分享浮窗 */}
      <SocialShareFloating title={title} />

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 文章头部 */}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <CalendarIcon className="w-4 h-4" />
            <time>{publishedAt.toLocaleDateString()}</time>
            <span>•</span>
            <span>{author}</span>
          </div>

          <h1 className="text-5xl font-bold mb-6">{title}</h1>

          {/* 阅读时间 */}
          <ReadingTimeEstimator content={content} />
        </header>

        {/* 目录（用于长文章） */}
        {content.length > 5000 && (
          <div className="mb-8">
            <ArticleTableOfContents content={content} />
          </div>
        )}

        {/* 文章内容 */}
        <div
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* 文章底部 */}
        <footer className="mt-12 pt-8 border-t border-cyber-border">
          {/* 静态分享按钮 */}
          <SocialShareButtons
            title={title}
            className="justify-center"
          />

          {/* 作者信息 */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              感谢阅读！如果这篇文章对你有帮助，欢迎分享给更多人。
            </p>
          </div>
        </footer>
      </div>
    </article>
  );
}
```

### 事件页面（带日历）

```tsx
import { CyberCalendar, SocialShareButtons } from '@/components/utils';
import { useState } from 'react';

export default function EventPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [registeredDates, setRegisteredDates] = useState<Date[]>([]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // 检查是否已注册
    const isRegistered = registeredDates.some(
      d => d.toDateString() === date.toDateString()
    );
    if (!isRegistered) {
      // 注册事件
      console.log('Registering for:', date);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">活动日历</h1>

      <CyberCalendar
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        highlightedDates={registeredDates}
        minDate={new Date()}
      />

      {selectedDate && (
        <div className="mt-8 cyber-card">
          <h2 className="text-xl font-bold mb-4">
            {selectedDate.toLocaleDateString('zh-CN', {
              month: 'long',
              day: 'numeric',
            })}
          </h2>
          <SocialShareButtons
            title={`参加活动 - ${selectedDate.toLocaleDateString()}`}
            className="justify-start"
          />
        </div>
      )}
    </div>
  );
}
```

---

## 💡 最佳实践提示

### 1. 性能优化

```tsx
// 对于大型文章，使用 memo 避免不必要的重渲染
import { memo } from 'react';

const ArticleContent = memo(({ content }: { content: string }) => (
  <article dangerouslySetInnerHTML={{ __html: content }} />
));
```

### 2. 错误处理

```tsx
// 安全处理 HTML 内容
import DOMPurify from 'dompurify';

export default function SafeContent({ rawHtml }: { rawHtml: string }) {
  const clean = DOMPurify.sanitize(rawHtml);

  return (
    <article dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
```

### 3. 响应式布局

```tsx
// 在移动端隐藏目录
import { ArticleTableOfContents } from '@/components/utils';

export default function ResponsiveArticle({ content }) {
  return (
    <div className="lg:hidden">
      {/* 移动端：不显示固定目录 */}
      <ArticleTableOfContents content={content} />
    </div>
  );
}
```

---

**需要更多示例？** 查看 `/utils-demo` 页面获取完整演示。
