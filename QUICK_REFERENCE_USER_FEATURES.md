# 🚀 用户体验功能 - 快速参考

## 📦 快速导入

```typescript
import {
  // 进度条
  ReadingProgress,
  CircularReadingProgress,
  ReadingTimeProgress,
  
  // 字体调整
  FontSizeAdjuster,
  FontSizePreset,
  
  // 分享
  ShareButtons,
  FloatingShareButtons,
  ShareStats,
  
  // 收藏
  BookmarkButton,
  BookmarkList,
  
  // 打印
  PrintButton,
  PrintPreview,
  ArticlePrintToolbar,
} from '@/components/blog';
```

---

## ⚡ 常用用法

### 阅读进度条

```tsx
<ReadingProgress />
<ReadingProgress position="bottom" showPercentage />
<CircularReadingProgress size={80} />
```

### 字体调整

```tsx
<FontSizeAdjuster floating />
<FontSizeAdjuster minSize={14} maxSize={24} step={2} />
<FontSizePreset />
```

### 分享按钮

```tsx
<ShareButtons title="标题" url="URL" />
<ShareButtons platforms={['twitter', 'copy']} variant="pill" />
<FloatingShareButtons title="标题" position="left" />
```

### 收藏功能

```tsx
<BookmarkButton postId="123" title="标题" />
<BookmarkList />
```

### 打印功能

```tsx
<PrintButton />
<PrintButton variant="pill" />
<ArticlePrintToolbar title="文章标题" />
```

---

## 🎯 完整示例

```tsx
import {
  ReadingProgress,
  FontSizeAdjuster,
  ShareButtons,
  BookmarkButton,
  PrintButton,
} from '@/components/blog';

export default function ArticlePage({ post }) {
  return (
    <article>
      <ReadingProgress showPercentage />
      
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between mb-6">
          <FontSizeAdjuster />
          <div className="flex gap-2">
            <BookmarkButton postId={post.id} title={post.title} />
            <PrintButton />
          </div>
        </div>

        <div data-article-content>
          {/* 文章内容 */}
        </div>

        <ShareButtons title={post.title} />
      </div>
    </article>
  );
}
```

---

## 📖 详细文档

- **NEW_USER_FEATURES_GUIDE.md** - 完整使用指南
- **USER_EXPERIENCE_FEATURES_REPORT.md** - 功能报告
- **components/blog/** - 组件源码

---

## 🎨 样式变体

### 按钮样式

```tsx
variant="default"   // 默认边框样式
variant="minimal"   // 极简样式
variant="pill"      // 胶囊样式
```

### 按钮大小

```tsx
size="small"    // 小号
size="medium"   // 中号
size="large"    // 大号
```

### 位置选项

```tsx
position="top"              // 顶部
position="bottom"           // 底部
position="bottom-right"     // 右下角
position="left"             // 左侧浮动
```

---

## 🔧 常见配置

### 进度条颜色

```tsx
<ReadingProgress color="#00f0ff" />  // 霓虹青
<ReadingProgress color="#9d00ff" />  // 赛博紫
<ReadingProgress color="#ff0080" />  // 激光粉
```

### 字体范围

```tsx
<FontSizeAdjuster 
  minSize={14}      // 最小 14px
  maxSize={24}      // 最大 24px
  defaultSize={16}  // 默认 16px
  step={2}          // 每次调整 2px
/>
```

### 分享平台

```tsx
platforms={[
  'twitter',    // Twitter/X
  'facebook',   // Facebook
  'linkedin',   // LinkedIn
  'whatsapp',   // WhatsApp
  'email',      // Email
  'copy',       // 复制链接
]}
```

---

## 💾 数据存储

所有使用 localStorage 的组件都支持自定义键名：

```tsx
<BookmarkButton storageKey="my-bookmarks" />
<FontSizeAdjuster storageKey="my-font-size" />
```

---

## ✅ 注意事项

1. **文章内容** 必须使用 `data-article-content` 属性包裹，字体调整才会生效：

```tsx
<div data-article-content>
  {/* 文章内容 */}
</div>
```

2. **打印样式** 已在 `globals.css` 中自动导入。

3. **依赖** 确保已安装：

```bash
npm install framer-motion lucide-react react-hot-toast
```

---

## 🎁 额外功能

### 阅读时间显示

```tsx
<ReadingTimeProgress 
  wordCount={1500} 
  readingSpeed={200}  // 字/分钟
/>
```

### 收藏回调

```tsx
<BookmarkButton 
  onBookmarkChange={(isBookmarked) => {
    console.log('收藏状态:', isBookmarked);
  }}
/>
```

### 打印前/后回调

```tsx
<PrintButton 
  onBeforePrint={() => console.log('准备打印')}
  onAfterPrint={() => console.log('打印完成')}
/>
```

---

**快速参考版本**: 1.0.0  
**更新日期**: 2026-03-03
