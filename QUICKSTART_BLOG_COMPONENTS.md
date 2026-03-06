# 博客组件系统 - 快速开始指南

## 🎯 5分钟快速上手

### 1. 使用统一组件（推荐）

```tsx
// app/blog/page.tsx
import { BlogListUnified } from '@/components/blog';

export default function BlogPage() {
  const posts = [
    {
      id: '1',
      title: '我的第一篇文章',
      slug: 'my-first-post',
      excerpt: '这是一篇精彩的文章...',
      author: { id: '1', name: '张三' },
      categories: [{ id: '1', name: '技术' }],
      tags: [],
      publishedAt: '2024-03-06',
      readTime: 5,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <BlogListUnified
        posts={posts}
        variant="default"
        columns={3}
        showFeatured
        featuredCount={1}
      />
    </div>
  );
}
```

### 2. 支持 WordPress API 数据

```tsx
// WordPress API 格式自动适配
const wpPosts = await fetch('https://your-site.com/wp-json/wp/v2/posts?_embed')
  .then(res => res.json());

// 无需手动转换，直接使用
<BlogListUnified posts={wpPosts} />
```

### 3. 不同布局样式

```tsx
// 杂志风格（特色 + 网格）
<BlogListUnified posts={posts} variant="magazine" />

// 时间线风格
<BlogListUnified posts={posts} variant="timeline" />

// 紧凑列表
<BlogListUnified posts={posts} variant="compact" columns={2} />

// 标准网格
<BlogListUnified posts={posts} variant="default" columns={3} />
```

### 4. 单个卡片使用

```tsx
import { BlogCardUnified } from '@/components/blog';

// 4 种卡片变体
<BlogCardUnified post={post} variant="default" />
<BlogCardUnified post={post} variant="compact" />
<BlogCardUnified post={post} variant="featured" />
<BlogCardUnified post={post} variant="minimal" />
```

---

## 📦 完整功能列表

### 支持的数据格式

✅ WordPress API 格式 (`title.rendered`)
✅ 自定义格式 (`title`)
✅ 混合格式
✅ 自动数据适配

### 布局变体

✅ **default** - 标准网格布局
✅ **compact** - 紧凑列表布局
✅ **magazine** - 杂志风格布局
✅ **timeline** - 时间线布局

### 卡片变体

✅ **default** - 完整卡片
✅ **compact** - 紧凑卡片
✅ **featured** - 特色大卡片
✅ **minimal** - 最小列表项

### 显示选项

✅ showFeatured - 显示特色文章
✅ showStats - 显示统计信息
✅ showAuthor - 显示作者
✅ showDate - 显示日期
✅ showReadTime - 显示阅读时间
✅ showExcerpt - 显示摘要
✅ showCategories - 显示分类
✅ showTags - 显示标签
✅ showPagination - 显示分页

---

## 🔧 常见问题快速解决

### Q: 导入路径报错？

```tsx
// ❌ 不要使用
import { cn } from '@/lib/utils/cn';

// ✅ 使用这个
import { cn } from '@/lib/utils';
```

### Q: 数据不显示？

```tsx
// 方法 1: 让组件自动适配
<BlogCardUnified post={yourData} />

// 方法 2: 使用适配器
import { adaptWordPressPost } from '@/lib/blog/adapters';
const blogPost = adaptWordPressPost(yourData);
```

### Q: TypeScript 类型错误？

```tsx
// 确保导入类型
import type { BlogPost } from '@/types/blog';

// 或使用适配器自动推断
const post = adaptWordPressPost(wpPost);
```

---

## 📚 更多资源

- **完整文档**: `frontend/components/blog/README.md`
- **使用示例**: `/examples/blog-usage-example`
- **完成报告**: `BLOG_COMPONENTS_UNIFICATION_REPORT.md`
- **修复脚本**: `frontend/scripts/fix-blog-imports.sh`

---

## 🚀 下一步

1. ✅ 查看使用示例页面
2. ✅ 阅读完整文档
3. ✅ 在你的项目中使用
4. ✅ 如有问题查看 FAQ

---

**开始使用吧！** 🎉
