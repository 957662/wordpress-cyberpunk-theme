# 🎉 新增用户体验功能 - 快速指南

本文档介绍新增的用户体验功能组件及其使用方法。

---

## 📦 新增组件概览

| 组件 | 功能 | 文件位置 |
|------|------|----------|
| `ReadingProgress` | 阅读进度条 | `components/blog/ReadingProgress.tsx` |
| `CircularReadingProgress` | 圆形进度指示器 | `components/blog/ReadingProgress.tsx` |
| `ReadingTimeProgress` | 阅读时间和进度 | `components/blog/ReadingProgress.tsx` |
| `FontSizeAdjuster` | 字体大小调整器 | `components/blog/FontSizeAdjuster.tsx` |
| `FontSizePreset` | 字体预设选择器 | `components/blog/FontSizeAdjuster.tsx` |
| `ShareButtons` | 分享按钮组 | `components/blog/ShareButtons.tsx` |
| `FloatingShareButtons` | 浮动分享按钮 | `components/blog/ShareButtons.tsx` |
| `BookmarkButton` | 收藏按钮 | `components/blog/BookmarkButton.tsx` |
| `BookmarkList` | 收藏列表 | `components/blog/BookmarkButton.tsx` |
| `PrintButton` | 打印按钮 | `components/blog/PrintButton.tsx` |
| `ArticlePrintToolbar` | 打印工具栏 | `components/blog/PrintButton.tsx` |

---

## 🚀 快速开始

### 1. 安装依赖

确保已安装以下依赖：

```bash
npm install framer-motion lucide-react react-hot-toast
```

### 2. 导入组件

```typescript
import {
  ReadingProgress,
  FontSizeAdjuster,
  ShareButtons,
  BookmarkButton,
  PrintButton,
} from '@/components/blog';
```

### 3. 在文章页面中使用

```tsx
export default function BlogPostPage({ post }) {
  return (
    <article>
      {/* 阅读进度条 */}
      <ReadingProgress position="top" showPercentage />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 工具栏 */}
        <div className="flex items-center justify-between mb-6">
          <FontSizeAdjuster floating />
          <div className="flex gap-2">
            <BookmarkButton postId={post.id} title={post.title} />
            <PrintButton />
          </div>
        </div>

        {/* 文章内容 */}
        <div data-article-content>
          <BlogDetail post={post} />
        </div>

        {/* 分享 */}
        <div className="mt-12">
          <ShareButtons title={post.title} url={post.url} />
        </div>
      </div>
    </article>
  );
}
```

---

## 📖 详细使用指南

### 阅读进度条

#### 基础用法

```tsx
import { ReadingProgress } from '@/components/blog';

<ReadingProgress />
```

#### 进阶配置

```tsx
<ReadingProgress
  position="bottom"        // 位置: 'top' | 'bottom'
  height={4}               // 进度条高度（像素）
  color="#9d00ff"          // 颜色
  showPercentage={true}    // 显示百分比
/>
```

#### 圆形进度指示器

```tsx
import { CircularReadingProgress } from '@/components/blog';

<CircularReadingProgress
  size={80}                          // 大小
  strokeWidth={5}                    // 线宽
  color="#00f0ff"                    // 颜色
  position="bottom-right"            // 位置
  showText={true}                    // 显示百分比
/>
```

---

### 字体大小调整器

#### 浮动按钮样式

```tsx
import { FontSizeAdjuster } from '@/components/blog';

<FontSizeAdjuster
  minSize={14}           // 最小字号
  maxSize={24}           // 最大字号
  defaultSize={16}       // 默认字号
  step={2}               // 调整步长
  floating={true}        // 浮动按钮
/>
```

#### 内联样式

```tsx
<FontSizeAdjuster
  floating={false}       // 内联显示
  className="mb-4"
/>
```

#### 预设选择器

```tsx
import { FontSizePreset } from '@/components/blog';

<FontSizePreset
  presets={[
    { label: '小', size: 14 },
    { label: '中', size: 16 },
    { label: '大', size: 18 },
    { label: '特大', size: 20 },
  ]}
  defaultIndex={1}
/>
```

---

### 分享按钮

#### 基础分享

```tsx
import { ShareButtons } from '@/components/blog';

<ShareButtons
  title="文章标题"
  url="https://example.com/post"
  description="文章描述"
/>
```

#### 自定义平台

```tsx
<ShareButtons
  title="文章标题"
  platforms={['twitter', 'facebook', 'copy']}
  variant="pill"           // 'default' | 'minimal' | 'pill' | 'icon-only'
  size="large"             // 'small' | 'medium' | 'large'
  showLabels={true}
/>
```

#### 浮动分享按钮

```tsx
import { FloatingShareButtons } from '@/components/blog';

<FloatingShareButtons
  title="文章标题"
  position="left"          // 'left' | 'right'
  bottomOffset={120}
  autoHide={true}
/>
```

---

### 收藏功能

#### 收藏按钮

```tsx
import { BookmarkButton } from '@/components/blog';

<BookmarkButton
  postId="123"
  title="文章标题"
  url="/blog/post-123"
  thumbnail="/images/thumb.jpg"
  excerpt="文章摘要..."
  variant="pill"
  onBookmarkChange={(isBookmarked) => {
    console.log('收藏状态:', isBookmarked);
  }}
/>
```

#### 收藏列表

```tsx
import { BookmarkList } from '@/components/blog';

<BookmarkList
  emptyMessage="还没有收藏任何文章"
  onRemove={(postId) => {
    console.log('删除收藏:', postId);
  }}
/>
```

---

### 打印功能

#### 打印按钮

```tsx
import { PrintButton } from '@/components/blog';

<PrintButton
  variant="pill"
  size="medium"
  onBeforePrint={() => {
    console.log('准备打印...');
  }}
  onAfterPrint={() => {
    console.log('打印完成');
  }}
/>
```

#### 文章打印工具栏

```tsx
import { ArticlePrintToolbar } from '@/components/blog';

<ArticlePrintToolbar
  title="文章标题"
  showPrint={true}
  showFontSize={true}
  showDate={true}
/>
```

---

## 🎨 样式定制

### 修改打印样式

编辑 `styles/print.css` 文件来自定义打印样式：

```css
@media print {
  body {
    font-size: 12pt;
    font-family: 'Georgia', serif;
  }

  h1 {
    font-size: 24pt;
    color: #000;
  }
}
```

### 修改组件样式

所有组件都支持 `className` 属性：

```tsx
<ReadingProgress className="my-custom-class" />
<ShareButtons className="flex-wrap gap-4" />
```

---

## 📝 完整示例

### 文章详情页

```tsx
import {
  ReadingProgress,
  FontSizeAdjuster,
  ShareButtons,
  BookmarkButton,
  PrintButton,
  ArticlePrintToolbar,
} from '@/components/blog';

export default function ArticlePage({ post }) {
  return (
    <article className="min-h-screen">
      {/* 进度条 */}
      <ReadingProgress showPercentage />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 打印工具栏 */}
        <ArticlePrintToolbar title={post.title} />

        {/* 控制面板 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b">
          <FontSizeAdjuster floating={false} />
          <div className="flex gap-2">
            <BookmarkButton
              postId={post.id}
              title={post.title}
              url={post.url}
              variant="pill"
            />
            <PrintButton variant="pill" />
          </div>
        </div>

        {/* 文章内容 */}
        <div data-article-content>
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* 分享 */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-bold mb-4">分享这篇文章</h3>
          <ShareButtons
            title={post.title}
            url={post.url}
            description={post.excerpt}
            variant="pill"
          />
        </div>
      </div>

      {/* 浮动分享 */}
      <FloatingShareButtons
        title={post.title}
        url={post.url}
        position="left"
      />
    </article>
  );
}
```

---

## 🔧 配置选项

### 全局配置

在 `.env.local` 中配置：

```env
# 默认字体大小
NEXT_PUBLIC_DEFAULT_FONT_SIZE=16

# 阅读速度（字/分钟）
NEXT_PUBLIC_READING_SPEED=200

# 收藏存储键
NEXT_PUBLIC_BOOKMARKS_KEY=cyberpress-bookmarks
```

### 主题颜色

修改 `tailwind.config.ts` 中的颜色：

```typescript
theme: {
  extend: {
    colors: {
      'cyber-cyan': '#00f0ff',
      'cyber-purple': '#9d00ff',
      'cyber-pink': '#ff0080',
    },
  },
}
```

---

## 💡 最佳实践

### 1. 性能优化

```tsx
// 使用 useMemo 缓存计算
const shareUrl = useMemo(() => {
  return typeof window !== 'undefined' 
    ? window.location.href 
    : '';
}, []);

// 使用 useCallback 避免重复创建函数
const handleBookmark = useCallback((isBookmarked) => {
  // 处理收藏
}, []);
```

### 2. 可访问性

```tsx
// 添加 aria 标签
<button aria-label="调整字体大小">
  <FontSizeAdjuster />
</button>

// 键盘导航
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
```

### 3. 数据持久化

所有使用 localStorage 的组件都支持自定义 `storageKey`：

```tsx
<BookmarkButton
  storageKey="my-custom-bookmarks"
/>
```

---

## 🐛 故障排除

### 问题：字体调整器不生效

**解决方案**：确保文章内容包裹在 `data-article-content` 属性中：

```tsx
<div data-article-content>
  {/* 文章内容 */}
</div>
```

### 问题：打印样式不生效

**解决方案**：确保在 `globals.css` 中导入打印样式：

```css
@import '@/styles/print.css';
```

### 问题：收藏数据丢失

**解决方案**：检查浏览器是否允许 localStorage，或者使用服务器端存储。

---

## 📚 相关资源

- [Framer Motion 文档](https://www.framer.com/motion/)
- [Lucide React 图标](https://lucide.dev/)
- [React Hot Toast](https://react-hot-toast.com/)
- [Next.js 打印样式指南](https://nextjs.org/docs/app/building-your-application/styling/css-modules)

---

**创建日期**: 2026-03-03  
**版本**: 1.0.0  
**作者**: AI Development Team
