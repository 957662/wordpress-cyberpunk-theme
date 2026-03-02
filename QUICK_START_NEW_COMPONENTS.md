# 🚀 新组件快速开始指南

**创建日期**: 2026-03-03

本指南帮助你快速开始使用本次创建的新组件。

---

## 📦 安装

确保所有依赖已安装：

```bash
cd frontend
npm install
```

---

## 🎨 博客组件

### ArticleTimeline - 文章时间轴

展示文章的时间轴视图，支持垂直和水平布局。

```tsx
import { ArticleTimeline } from '@/components/blog';

function MyPage() {
  const articles = [
    {
      id: '1',
      title: '文章标题',
      excerpt: '文章摘要...',
      date: '2026-03-01',
      category: '前端开发',
      tags: ['React', 'Next.js'],
      views: 1000,
      likes: 50,
      readTime: 10,
    },
  ];

  return (
    <ArticleTimeline
      articles={articles}
      variant="vertical"
      showStats
      showTags
      onArticleClick={(article) => console.log(article)}
    />
  );
}
```

**Props**:
- `variant`: 'vertical' | 'horizontal' - 布局方式
- `showStats`: boolean - 显示统计信息
- `showTags`: boolean - 显示标签
- `onArticleClick`: (article) => void - 点击回调

---

### FeaturedArticles - 精选文章轮播

自动播放的精选文章轮播组件。

```tsx
import { FeaturedArticles } from '@/components/blog';

function HomePage() {
  const featured = [
    {
      id: '1',
      title: '精选文章',
      excerpt: '文章摘要...',
      image: '/cover.jpg',
      category: '技术',
      author: { name: '作者名', avatar: '/avatar.jpg' },
      publishedAt: '2026-03-01',
      views: 5000,
      readTime: 15,
      featured: true,
      badge: '热门',
    },
  ];

  return (
    <FeaturedArticles
      articles={featured}
      autoPlay
      autoPlayInterval={5000}
      aspectRatio="16:9"
    />
  );
}
```

---

## 💫 特效组件

### CyberHoloCard - 全息卡片

具有3D鼠标跟随效果的全息卡片。

```tsx
import { CyberHoloCard } from '@/components/effects';

function MyCard() {
  return (
    <CyberHoloCard
      intensity={1}
      glowColor="#00f0ff"
      holographic
      scanlines
    >
      <h3>卡片标题</h3>
      <p>卡片内容</p>
    </CyberHoloCard>
  );
}
```

**效果选项**:
- `intensity`: 3D效果强度 (0-2)
- `glowColor`: 发光颜色
- `holographic`: 全息渐变效果
- `scanlines`: 扫描线效果
- `glitch`: 故障效果

---

## 🔔 通用组件

### NotificationToast - 通知系统

全局通知系统，支持多种类型。

```tsx
import { useNotifications, NotificationToast } from '@/components/common';

function App() {
  const { notifications, success, error, warning, info, removeNotification } = useNotifications();

  const handleSuccess = () => {
    success('操作成功', '数据已保存');
  };

  return (
    <>
      <button onClick={handleSuccess}>显示通知</button>
      <NotificationToast
        notifications={notifications}
        onRemove={removeNotification}
        position="top-right"
      />
    </>
  );
}
```

**通知类型**:
- `success` - 成功（绿色）
- `error` - 错误（粉色）
- `warning` - 警告（黄色）
- `info` - 信息（青色）

---

### CyberModal - 模态框

赛博朋克风格的模态框组件。

```tsx
import { CyberModal } from '@/components/common';

function MyPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CyberModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="模态框标题"
      size="lg"
      variant="cyber"
    >
      <p>模态框内容</p>
    </CyberModal>
  );
}
```

**变体**:
- `default` - 默认样式
- `cyber` - 赛博朋克（青色）
- `holo` - 全息（紫色）
- `glitch` - 故障（粉色）

**尺寸**:
- `sm`, `md`, `lg`, `xl`, `full`

---

### UserOnlineStatus - 在线状态

显示用户在线状态的组件。

```tsx
import { UserOnlineStatus } from '@/components/common';

function UserProfile() {
  return (
    <UserOnlineStatus
      userId="user-123"
      showCount
      showTooltip
      variant="badge"
      size="md"
    />
  );
}
```

**变体**:
- `dot` - 圆点
- `badge` - 徽章
- `text` - 文本

---

## 🔍 搜索组件

### RealTimeSearch - 实时搜索

带搜索历史和热门搜索的实时搜索组件。

```tsx
import { RealTimeSearch } from '@/components/search';

function SearchBar() {
  const handleSearch = async (query: string) => {
    // 实现搜索逻辑
    const results = await api.search(query);
    return results;
  };

  return (
    <RealTimeSearch
      placeholder="搜索文章、作品、标签..."
      onSearch={handleSearch}
      debounceMs={300}
      maxResults={8}
      showRecent
      showTrending
      recentSearches={['React', 'Next.js']}
      trendingSearches={['TypeScript', 'Tailwind']}
    />
  );
}
```

**特性**:
- 防抖搜索（可配置延迟）
- 键盘导航（上下箭头、回车、ESC）
- 搜索历史保存
- 多类型结果展示

---

## 🛠️ 工具函数

### 验证器

使用 Zod 进行数据验证。

```tsx
import { validatePost, extractErrors } from '@/lib/validators';

function createPost(data: unknown) {
  const result = validatePost(data);
  
  if (!result.success) {
    const errors = extractErrors(result);
    console.error(errors);
    return;
  }
  
  // 使用验证后的数据
  console.log(result.data);
}
```

**可用的验证器**:
- `validatePost` - 文章验证
- `validateComment` - 评论验证
- `validateCategory` - 分类验证
- `validateTag` - 标签验证
- `validateContactForm` - 联系表单验证
- `validateNewsletter` - 邮件订阅验证
- `validateSearchQuery` - 搜索查询验证
- `validateUserSettings` - 用户设置验证

---

### 格式化器

文本和日期格式化工具。

```tsx
import {
  formatReadingTime,
  truncateText,
  formatRelativeTime,
  formatDate,
  formatNumber,
  maskEmail
} from '@/lib/formatters';

// 格式化阅读时间
const time = formatReadingTime(15); // "15分钟"

// 截断文本
const excerpt = truncateText(content, 200); // "..."

// 相对时间
const relative = formatRelativeTime(new Date()); // "刚刚"

// 日期格式化
const date = formatDate(new Date()); // "2026年3月3日"

// 数字格式化
const num = formatNumber(1500); // "1.5K"

// 邮箱脱敏
const masked = maskEmail('user@example.com'); // "u***@example.com"
```

---

## 📄 页面

### 阅读清单页面

完整的阅读清单管理页面。

路径: `/reading-list`

功能:
- 阅读统计
- 筛选（全部/未读/已完成）
- 网格/列表视图
- 删除功能

```tsx
// 使用 hooks
import { useReadingHistory, useBookmark } from '@/hooks';

const { history, addToHistory, removeFromHistory } = useReadingHistory();
const { bookmarks, addBookmark, removeBookmark } = useBookmark();
```

---

## 🎨 样式定制

所有组件使用赛博朋克配色方案：

```css
/* 主要颜色 */
--cyber-dark: #0a0a0f;
--cyber-cyan: #00f0ff;
--cyber-purple: #9d00ff;
--cyber-pink: #ff0080;
--cyber-green: #00ff88;
--cyber-yellow: #f0ff00;
--cyber-gray: #6b7280;
```

---

## 📚 更多资源

- [完整创建报告](./CREATION_REPORT_2026_03_03_SESSION2.md)
- [项目README](./README.md)
- [组件文档](./COMPONENTS.md)

---

## ✅ 快速检查清单

使用新组件前，确保：

- [ ] 已安装所有依赖
- [ ] 导入路径正确（使用 @ 别名）
- [ ] TypeScript 配置正确
- [ ] Tailwind CSS 已配置
- [ ] Framer Motion 已安装

---

**开始构建你的赛博朋克博客吧！** 🚀
