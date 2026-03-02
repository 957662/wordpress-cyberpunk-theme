# 新创建的博客组件使用指南

## 📝 组件列表

本次创建了以下可用的博客组件：

### 1. ArticleList - 文章列表组件
**位置**: `frontend/components/blog/ArticleList.tsx`

**功能**:
- 标准文章列表展示
- 精简版文章列表（用于侧边栏）
- 支持响应式布局
- 显示文章元信息（作者、日期、阅读时间、分类等）

**使用示例**:
```tsx
import { ArticleList, ArticleListCompact } from '@/components/blog/ArticleList';

// 标准列表
<ArticleList posts={posts} className="space-y-6" />

// 精简列表
<ArticleListCompact posts={posts} className="space-y-3" />
```

---

### 2. ArticleCard - 文章卡片组件
**位置**: `frontend/components/blog/ArticleCard.tsx`

**功能**:
- 多种变体：default（默认）、featured（特色）、compact（紧凑）
- 支持点赞功能
- 悬停动画效果
- 响应式图片展示

**使用示例**:
```tsx
import { ArticleCard, ArticleCardGrid } from '@/components/blog/ArticleCard';

// 单个卡片
<ArticleCard post={post} variant="featured" />

// 卡片网格
<ArticleCardGrid posts={posts} />

// 紧凑版
<ArticleCard post={post} variant="compact" />
```

---

### 3. NewsletterSubscribe - Newsletter 订阅组件
**位置**: `frontend/components/blog/NewsletterSubscribe.tsx`

**功能**:
- 邮箱验证
- 三种变体：default、compact、inline
- 加载状态和错误处理
- 订阅者统计展示

**使用示例**:
```tsx
import { NewsletterSubscribe } from '@/components/blog/NewsletterSubscribe';

// 完整版
<NewsletterSubscribe variant="default" />

// 紧凑版
<NewsletterSubscribe variant="compact" />

// 内联版
<NewsletterSubscribe variant="inline" />
```

---

### 4. AISummary - AI 摘要组件
**位置**: `frontend/components/blog/AISummary.tsx`

**功能**:
- AI 自动生成文章摘要
- 关键点提取
- 复制功能
- 折叠/展开动画
- 内联版本可用

**使用示例**:
```tsx
import { AISummary, AISummaryInline } from '@/components/blog/AISummary';

// 完整版（可展开）
<AISummary content={postContent} />

// 内联版（直接显示）
<AISummaryInline content={postContent} />
```

---

### 5. ArticleRating - 文章评分组件
**位置**: `frontend/components/blog/ArticleRating.tsx`

**功能**:
- 星级评分（1-5星）
- 点赞/点踩功能
- 评分统计展示
- 分数分布图表
- 紧凑版本可用

**使用示例**:
```tsx
import { ArticleRating, ArticleRatingCompact } from '@/components/blog/ArticleRating';

// 完整版
<ArticleRating
  articleId={post.id}
  initialRating={4.5}
  initialLikes={100}
  initialDislikes={5}
/>

// 紧凑版
<ArticleRatingCompact
  articleId={post.id}
  initialRating={4.5}
/>
```

---

### 6. ReadingHistory - 阅读历史组件
**位置**: `frontend/components/blog/ReadingHistory.tsx`

**功能**:
- 本地存储阅读历史
- 阅读进度追踪
- 删除单个/清空全部
- 时间格式化显示
- Hook 集成

**使用示例**:
```tsx
import { ReadingHistory, ReadingHistoryInline, useReadingHistory } from '@/components/blog/ReadingHistory';

// 组件使用
<ReadingHistory maxItems={10} />
<ReadingHistoryInline maxItems={5} />

// Hook 使用
const { addToHistory } = useReadingHistory();
addToHistory(post, 75); // 75% 阅读进度
```

---

### 7. TrendingArticles - 热门文章组件
**位置**: `frontend/components/blog/TrendingArticles.tsx`

**功能**:
- 多时间范围（日/周/月/全部）
- 三种视图：trending、popular、latest
- 排行榜样式
- 趋势标识（上升/热门）
- 紧凑版本和排行榜版本

**使用示例**:
```tsx
import { TrendingArticles, TrendingArticlesCompact, TrendingArticlesLeaderboard } from '@/components/blog/TrendingArticles';

// 完整版
<TrendingArticles timeRange="week" maxItems={10} />

// 紧凑版
<TrendingArticlesCompact />

// 排行榜版
<TrendingArticlesLeaderboard />
```

---

### 8. ArticleSearch - 文章搜索组件
**位置**: `frontend/components/blog/ArticleSearch.tsx`

**功能**:
- 实时搜索
- 搜索历史记录
- 热门搜索推荐
- 结果预览
- 全屏搜索模式

**使用示例**:
```tsx
import { ArticleSearch, FullScreenSearch } from '@/components/blog/ArticleSearch';

// 标准搜索
<ArticleSearch
  placeholder="搜索文章..."
  onSearch={(query) => console.log(query)}
/>

// 全屏搜索
<FullScreenSearch onClose={() => setIsOpen(false)} />
```

---

### 9. FollowButton - 关注按钮组件
**位置**: `frontend/components/blog/FollowButton.tsx`

**功能**:
- 关注/取消关注
- 关注者数量显示
- 三种变体：primary、outline、ghost
- 多种尺寸：sm、md、lg
- 下拉菜单版本

**使用示例**:
```tsx
import { FollowButton, FollowButtonCompact, FollowButtonWithMenu } from '@/components/blog/FollowButton';

// 标准版
<FollowButton
  userId={user.id}
  isFollowing={false}
  followerCount={1234}
  onFollowChange={(isFollowing) => console.log(isFollowing)}
/>

// 紧凑版
<FollowButtonCompact userId={user.id} />

// 带菜单版
<FollowButtonWithMenu userId={user.id} followerCount={1234} />
```

---

### 10. BookmarkManager - 书签管理组件
**位置**: `frontend/components/blog/BookmarkManager.tsx`

**功能**:
- 添加/移除书签
- 文件夹管理
- 标签系统
- 本地存储
- 快速收藏版本

**使用示例**:
```tsx
import { BookmarkManager, QuickBookmark } from '@/components/blog/BookmarkManager';

// 完整管理
<BookmarkManager
  postId={post.id}
  postTitle={post.title}
  postSlug={post.slug}
  postExcerpt={post.excerpt}
/>

// 快速收藏
<QuickBookmark
  postId={post.id}
  postTitle={post.title}
  postSlug={post.slug}
/>
```

---

## 🛠️ 工具函数

### debounce.ts
**位置**: `frontend/lib/utils/debounce.ts`

**功能**:
- `debounce` - 防抖函数
- `throttle` - 节流函数
- `rafThrottle` - RAF 节流（动画场景）

**使用示例**:
```tsx
import { debounce, throttle, rafThrottle } from '@/lib/utils/debounce';

// 防抖搜索
const debouncedSearch = debounce((query) => {
  console.log('搜索:', query);
}, 300);

// 节流滚动
const throttledScroll = throttle(() => {
  console.log('滚动中');
}, 100);

// RAF 节流动画
const rafThrottledAnim = rafThrottle(() => {
  console.log('动画帧');
});
```

---

## 📄 页面示例

### Author Page - 作者页面
**位置**: `frontend/app/author/[id]/page.tsx`

**功能**:
- 作者信息展示
- 社交链接
- 统计数据（文章数、关注者、浏览量）
- 文章列表
- 标签页切换（文章/关于/动态）
- 关注功能

**访问**: `/author/[id]`

---

## 🎨 样式系统

所有组件使用统一的赛博朋克风格：

### 颜色变量
- `--cyber-dark` - 深色背景
- `--cyber-darker` - 更深的背景
- `--cyber-cyan` - 主色调（青色）
- `--cyber-purple` - 辅助色（紫色）
- `--cyber-pink` - 强调色（粉色）
- `--cyber-border` - 边框颜色

### 工具类
- `cyber-card` - 卡片样式
- `cyber-button` - 按钮样式
- `text-glow-cyan` - 文字发光效果
- `shadow-neon-cyan` - 霓虹阴影

---

## 📦 类型定义

组件使用以下类型：

```typescript
// WordPress Post 类型
interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  date: string;
  author?: number;
  author_data?: {
    id: number;
    name: string;
    avatar?: string;
  };
  featured_media?: number | string;
  categories?: number[];
  categories_data?: Category[];
  tags?: number[];
  comment_count?: number;
  reading_time?: number;
}
```

---

## 🔌 API 集成

组件设计为与 WordPress REST API 配合使用：

```typescript
// 文章列表 API
GET /wp/v2/posts?per_page=12&page=1&_embed=true

// 搜索 API
GET /wp/v2/posts?search=关键词

// 分类过滤
GET /wp/v2/posts?categories=1,2,3

// 作者文章
GET /wp/v2/posts?author=1
```

---

## 🚀 快速开始

1. **安装依赖**:
```bash
npm install framer-motion lucide-react clsx tailwind-merge
```

2. **导入组件**:
```tsx
import { ArticleList } from '@/components/blog/ArticleList';
```

3. **使用组件**:
```tsx
<ArticleList posts={posts} />
```

---

## 📝 注意事项

1. **本地存储**: 阅读历史、书签等数据使用 `localStorage`，需要确保在客户端渲染
2. **API 调用**: 组件中的 API 调用是模拟的，实际使用需要替换为真实的 API 端点
3. **类型安全**: 所有组件都使用 TypeScript，确保类型正确
4. **响应式**: 所有组件都是响应式的，支持移动端
5. **动画**: 使用 Framer Motion，可以通过 `whileHover`、`whileTap` 等属性自定义

---

## 🎯 下一步

- 将模拟的 API 调用替换为真实的 WordPress REST API
- 添加更多主题变体
- 实现服务端渲染（SSR）支持
- 添加更多单元测试
- 优化性能和加载速度

---

**创建日期**: 2026-03-03
**版本**: 1.0.0
**作者**: Claude Code
