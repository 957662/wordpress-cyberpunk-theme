# 🚀 统一博客组件 - 快速参考

**版本**: 1.0.0 | **更新**: 2026-03-06

---

## ⚡ 快速导入

```tsx
import {
  ArticleCardUnified,
  BlogListUnified,
  BlogGridUnified,
} from '@/components/blog';
```

---

## 📦 组件速查

### ArticleCardUnified

```tsx
<ArticleCardUnified
  post={post}
  variant="default"        // default | compact | featured | minimal
  showExcerpt={true}       // 显示摘要
  showMeta={true}          // 显示元信息
  showStats={false}        // 显示统计
  showAuthor={true}        // 显示作者
  showCategory={true}      // 显示分类
  showTags={false}         // 显示标签
/>
```

### BlogListUnified

```tsx
<BlogListUnified
  posts={posts}
  layout="grid"            // list | grid
  columns={3}              // 1 | 2 | 3
  loading={false}
  hasMore={true}
  onLoadMore={handleLoadMore}
  emptyMessage="暂无文章"
/>
```

### BlogGridUnified

```tsx
<BlogGridUnified
  posts={posts}
  columns={3}              // 2 | 3 | 4
  gap="md"                 // sm | md | lg
  cardVariant="compact"    // default | compact | featured | minimal
  showLoadMore={true}
  hasMore={true}
  onLoadMore={handleLoadMore}
/>
```

---

## 🔧 数据格式

### 自动适配（推荐）

```tsx
// WordPress API 格式
const wpPost = {
  id: 123,
  title: { rendered: "标题" },
  _embedded: { ... }
};

// 标准 Post 格式
const post = {
  id: "123",
  title: "标题",
  author: { ... }
};

// 两种都支持！
<ArticleCardUnified post={wpPost />  // ✅ 自动适配
<ArticleCardUnified post={post />   // ✅ 直接使用
```

### 手动适配

```tsx
import { adaptPost, adaptPosts } from '@/lib/utils/adapters';

const post = adaptPost(rawData);
const posts = adaptPosts(rawDataArray);
```

---

## 🎨 常用模式

### 基础列表

```tsx
<BlogListUnified
  posts={posts}
  layout="list"
/>
```

### 网格布局

```tsx
<BlogListUnified
  posts={posts}
  layout="grid"
  columns={3}
/>
```

### 无限滚动

```tsx
<BlogListUnified
  posts={posts}
  hasMore={true}
  onLoadMore={loadMore}
/>
```

### 带搜索和过滤

```tsx
const [search, setSearch] = useState('');
const filtered = posts.filter(p =>
  p.title.toLowerCase().includes(search.toLowerCase())
);

<BlogListUnified posts={filtered} />
```

---

## 📄 示例页面

访问: `http://localhost:3000/blog-unified`

```bash
cd frontend
npm run dev
```

---

## 📚 文档

| 文档 | 路径 |
|------|------|
| 完整指南 | `BLOG_UNIFIED_GUIDE.md` |
| 创建摘要 | `CREATED_FILES_UNIFIED_BLOG.md` |
| 总结报告 | `UNIFIED_BLOG_FINAL_SUMMARY.md` |

---

## 🎯 常见问题

**Q: 如何使用 WordPress 数据？**
A: 直接传入，组件会自动适配！

**Q: 如何切换布局？**
A: 使用 `layout` 属性：`"list"` 或 `"grid"`

**Q: 如何自定义样式？**
A: 使用 `className` 属性

**Q: 如何处理错误？**
A: 传入 `error` 和 `emptyMessage` 属性

---

<div align="center">

**Happy Coding! 🚀**

</div>
