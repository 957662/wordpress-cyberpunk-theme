# 🚀 快速开始指南 - Session 3 组件

> 本指南将帮助你快速使用本次创建的新组件和工具

---

## 📦 安装依赖

确保已安装所需的依赖：

```bash
npm install framer-motion date-fns axios lucide-react clsx
```

---

## 🎨 组件使用

### 1. ArticleMeta - 文章元数据

**基础用法**:

```tsx
import { ArticleMeta } from '@/components/blog';

<ArticleMeta
  date="2026-03-03"
  author={{ id: 1, name: "AI Developer" }}
  category={{ id: 1, name: "技术", slug: "tech" }}
  tags={[
    { id: 1, name: "React", slug: "react" }
  ]}
  readingTime={5}
  views={1000}
  likes={42}
/>
```

**完整用法**:

```tsx
<ArticleMeta
  date={post.date}
  author={{
    id: post.author.id,
    name: post.author.name,
    avatar: post.author.avatar_url
  }}
  category={{
    id: post.category.id,
    name: post.category.name,
    slug: post.category.slug
  }}
  tags={post.tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug
  }))}
  readingTime={post.readingTime}
  views={post.views}
  likes={post.likes}
  comments={post.comments_count}
  mode="full"
  showTags={true}
  showCategory={true}
/>
```

**三种模式**:

```tsx
// Full 模式 - 完整显示
<ArticleMeta {...props} mode="full" />

// Compact 模式 - 紧凑单行
<ArticleMeta {...props} mode="compact" />

// Minimal 模式 - 最小化
<ArticleMeta {...props} mode="minimal" />
```

---

### 2. Breadcrumb - 面包屑导航

**基础用法**:

```tsx
import { Breadcrumb } from '@/components/blog';

<Breadcrumb
  items={[
    { label: '首页', href: '/' },
    { label: '博客', href: '/blog' },
    { label: '文章标题', href: '/blog/post', current: true }
  ]}
/>
```

**完整用法**:

```tsx
<Breadcrumb
  items={[
    { label: '博客', href: '/blog' },
    { label: '分类', href: '/blog/category' },
    { label: '当前页', href: '/blog/post', current: true }
  ]}
  separator="arrow"
  position="top"
  showBack={true}
  className="mb-6"
/>
```

**带 SEO 优化**:

```tsx
import { BreadcrumbWithSchema } from '@/components/blog';

<BreadcrumbWithSchema
  items={breadcrumbItems}
  separator="arrow"
  showBack
/>
```

**自动生成面包屑**:

```tsx
import { useBreadcrumb } from '@/components/blog';

function PostPage() {
  const breadcrumbItems = useBreadcrumb('/blog/react-guide');
  return <Breadcrumb items={breadcrumbItems} />;
}
```

---

### 3. ArticleHeader - 文章头部

**Hero 模式** (全屏大图):

```tsx
<ArticleHeader
  title="文章标题"
  excerpt="文章摘要"
  featuredImage="/cover.jpg"
  author={{ id: 1, name: "作者" }}
  date="2026-03-03"
  category={{ id: 1, name: "技术", slug: "tech" }}
  readingTime={10}
  views={5000}
  featured={true}
  variant="hero"
/>
```

**Default 模式** (标准样式):

```tsx
<ArticleHeader
  title="文章标题"
  excerpt="文章摘要"
  featuredImage="/cover.jpg"
  author={{ id: 1, name: "作者", avatar: "/avatar.jpg" }}
  date="2026-03-03"
  modifiedDate="2026-03-04"
  category={{ id: 1, name: "技术", slug: "tech" }}
  readingTime={10}
  views={5000}
  status="published"
  variant="default"
/>
```

**Minimal 模式** (简洁样式):

```tsx
<ArticleHeader
  title="文章标题"
  author={{ id: 1, name: "作者" }}
  date="2026-03-03"
  readingTime={5}
  variant="minimal"
/>
```

---

### 4. ArticleFooter - 文章底部

**基础用法**:

```tsx
<ArticleFooter
  prevArticle={{
    id: 1,
    title: "上一篇",
    slug: "previous-post"
  }}
  nextArticle={{
    id: 2,
    title: "下一篇",
    slug: "next-post"
  }}
  articleId={123}
  likes={42}
  comments={8}
  onLike={() => handleLike()}
  onBookmark={() => handleBookmark()}
/>
```

**完整用法**:

```tsx
<ArticleFooter
  prevArticle={{
    id: prev.id,
    title: prev.title.rendered,
    slug: prev.slug,
    excerpt: prev.excerpt.rendered
  }}
  nextArticle={{
    id: next.id,
    title: next.title.rendered,
    slug: next.slug,
    excerpt: next.excerpt.rendered
  }}
  articleId={post.id}
  showShare={true}
  showBookmark={true}
  showComments={true}
  likes={post.likes}
  comments={post.comments_count}
  isLiked={post.is_liked}
  isBookmarked={post.is_bookmarked}
  onLike={() => toggleLike(post.id)}
  onBookmark={() => toggleBookmark(post.id)}
  onShare={(platform) => handleShare(platform)}
  className="mt-12"
/>
```

**简化版本**:

```tsx
import { ArticleFooterMinimal } from '@/components/blog';

<ArticleFooterMinimal
  prevArticle={prev}
  nextArticle={next}
/>
```

---

## 🛠️ 工具函数使用

### SEO 工具

**生成 Meta 标签**:

```typescript
import { generateMetaTags } from '@/lib/utils/seo';

const metaTags = generateMetaTags({
  title: "文章标题",
  description: "文章描述",
  image: "/og-image.jpg",
  url: "https://example.com/post",
  keywords: ["React", "TypeScript", "Next.js"],
  author: "作者名",
  publishedTime: "2026-03-03T10:00:00Z",
  modifiedTime: "2026-03-04T10:00:00Z"
});
```

**生成结构化数据**:

```typescript
import { generateArticleJsonLd } from '@/lib/utils/seo';

const jsonLd = generateArticleJsonLd({
  title: "文章标题",
  description: "文章描述",
  image: "/og-image.jpg",
  url: "https://example.com/post",
  publishedTime: "2026-03-03T10:00:00Z",
  modifiedTime: "2026-03-04T10:00:00Z",
  author: {
    name: "作者名",
    url: "https://example.com/author"
  },
  publisher: {
    name: "网站名称",
    logo: "https://example.com/logo.png"
  }
});

// 在页面中使用
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
```

**生成面包屑结构化数据**:

```typescript
import { generateBreadcrumbJsonLd } from '@/lib/utils/seo';

const breadcrumbSchema = generateBreadcrumbJsonLd([
  { name: '首页', url: 'https://example.com' },
  { name: '博客', url: 'https://example.com/blog' },
  { name: '文章', url: 'https://example.com/post' }
]);
```

**其他 SEO 工具**:

```typescript
import {
  generateSlug,
  truncateText,
  generateCanonicalUrl,
  generateRobotsTxt
} from '@/lib/utils/seo';

// 生成 slug
const slug = generateSlug("文章标题 - 2026"); // "文章标题-2026"

// 截断文本
const excerpt = truncateText(longText, 160); // "长文本内容..."

// 生成规范链接
const canonical = generateCanonicalUrl("/blog/post", "https://example.com");

// 生成 robots.txt
const robots = generateRobotsTxt({
  allow: ['/'],
  disallow: ['/admin', '/api'],
  sitemap: 'https://example.com/sitemap.xml'
});
```

---

### Markdown 工具

**提取标题**:

```typescript
import { extractHeadings, generateHeadingId } from '@/lib/utils/markdown';

const headings = extractHeadings(markdownContent);
// [
//   { id: 'introduction', text: 'Introduction', level: 1 },
//   { id: 'getting-started', text: 'Getting Started', level: 2 }
// ]
```

**计算阅读时间**:

```typescript
import { calculateReadingTime } from '@/lib/utils/markdown';

const minutes = calculateReadingTime(markdownContent);
// 返回: 5 (分钟)
```

**提取摘要**:

```typescript
import { extractExcerpt } from '@/lib/utils/markdown';

const excerpt = extractExcerpt(markdownContent, 200);
// 返回: "文章摘要内容..."
```

**提取代码块**:

```typescript
import { extractCodeBlocks } from '@/lib/utils/markdown';

const codeBlocks = extractCodeBlocks(markdownContent);
// [
//   { language: 'typescript', code: '...', startIndex: 0, endIndex: 100 }
// ]
```

**验证 Markdown**:

```typescript
import { validateMarkdown } from '@/lib/utils/markdown';

const validation = validateMarkdown(markdownContent);
if (!validation.isValid) {
  console.error('Errors:', validation.errors);
  console.warn('Warnings:', validation.warnings);
}
```

**内容统计**:

```typescript
import { getMarkdownStats } from '@/lib/utils/markdown';

const stats = getMarkdownStats(markdownContent);
// {
//   characters: 5000,
//   words: 800,
//   lines: 100,
//   paragraphs: 50,
//   headings: 10,
//   links: 20,
//   images: 5,
//   codeBlocks: 3,
//   tables: 2
// }
```

---

## 🌐 WordPress 服务使用

### 初始化服务

```typescript
import wordpressService from '@/lib/services/wordpress-service';

// 如果需要认证
wordpressService.setAuthToken('your-jwt-token');
```

### 获取文章

```typescript
// 获取文章列表
const { data: posts, total, totalPages } = await wordpressService.getPosts({
  page: 1,
  per_page: 10,
  _embed: true, // 嵌入作者和特色图片
  categories: [1, 2],
  tags: [3],
  orderby: 'date',
  order: 'desc'
});

// 获取单篇文章
const post = await wordpressService.getPost(123);

// 根据 slug 获取文章
const post = await wordpressService.getPostBySlug('post-slug');
```

### 搜索文章

```typescript
const results = await wordpressService.searchPosts('React', {
  per_page: 20,
  categories: [1]
});
```

### 分类和标签

```typescript
// 获取分类
const { data: categories } = await wordpressService.getCategories({
  hide_empty: true
});

// 获取标签
const { data: tags } = await wordpressService.getTags({
  hide_empty: true,
  per_page: 50
});
```

### 互动功能

```typescript
// 点赞文章
await wordpressService.likePost(123);

// 取消点赞
await wordpressService.unlikePost(123);

// 获取点赞数
const { data: likes } = await wordpressService.getPostLikes(123);

// 添加书签
await wordpressService.addBookmark(123);

// 移除书签
await wordpressService.removeBookmark(123);

// 获取书签列表
const { data: bookmarks } = await wordpressService.getBookmarks();
```

### 阅读列表

```typescript
// 添加到阅读列表
await wordpressService.addToReadingList(123);

// 更新阅读进度
await wordpressService.updateReadingProgress(123, 75); // 75%

// 获取阅读列表
const { data: readingList } = await wordpressService.getReadingList();
```

### 评论功能

```typescript
// 获取评论
const { data: comments } = await wordpressService.getComments(123);

// 创建评论
await wordpressService.createComment({
  post: 123,
  author_name: "评论者",
  author_email: "email@example.com",
  content: "评论内容",
  parent: 0 // 父评论 ID，0 为顶级评论
});
```

### 其他功能

```typescript
// 获取相关文章
const related = await wordpressService.getRelatedPosts(123, 5);

// 获取热门文章
const popular = await wordpressService.getPopularPosts(10, 'week');

// 订阅邮件
await wordpressService.subscribeNewsletter('email@example.com');

// 提交联系表单
await wordpressService.submitContactForm({
  name: "姓名",
  email: "email@example.com",
  subject: "主题",
  message: "消息内容"
});

// 获取统计信息
const stats = await wordpressService.getStats();
```

---

## 📝 完整示例

### 博客文章页面

```tsx
// app/blog/[slug]/page.tsx
import { ArticleHeader, ArticleMeta, ArticleFooter } from '@/components/blog';
import { BreadcrumbWithSchema } from '@/components/blog';
import wordpressService from '@/lib/services/wordpress-service';
import { extractHeadings, calculateReadingTime } from '@/lib/utils/markdown';

export default async function PostPage({ params }) {
  const post = await wordpressService.getPostBySlug(params.slug);
  const headings = extractHeadings(post.content.rendered);
  const readingTime = calculateReadingTime(post.content.rendered);

  const breadcrumbItems = [
    { name: '首页', url: process.env.NEXT_PUBLIC_SITE_URL },
    { name: '博客', url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog` },
    { name: post.title.rendered, url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${params.slug}` }
  ];

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {/* 面包屑 */}
      <BreadcrumbWithSchema items={breadcrumbItems} />

      {/* 文章头部 */}
      <ArticleHeader
        title={post.title.rendered}
        excerpt={post.excerpt.rendered}
        featuredImage={post._embedded?.['wp:featuredmedia']?.[0]?.source_url}
        author={{
          id: post.author,
          name: post._embedded?.author?.[0]?.name,
          avatar: post._embedded?.author?.[0]?.avatar_urls?.['96']
        }}
        date={post.date}
        category={{
          id: post.categories[0],
          name: post._embedded?.['wp:term']?.[0]?.[0]?.name,
          slug: post._embedded?.['wp:term']?.[0]?.[0]?.slug
        }}
        readingTime={readingTime}
        variant="default"
      />

      {/* 文章内容 */}
      <div
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        className="prose prose-cyber max-w-none mt-12"
      />

      {/* 文章底部 */}
      <ArticleFooter
        articleId={post.id}
        likes={post.meta?.likes || 0}
        comments={post.meta?.comments_count || 0}
        onLike={async () => await wordpressService.likePost(post.id)}
        onBookmark={async () => await wordpressService.addBookmark(post.id)}
      />
    </article>
  );
}
```

---

## 🎯 最佳实践

### 1. 组件组合

```tsx
// 推荐的组合方式
<article>
  <Breadcrumb {...breadcrumbProps} />
  <ArticleHeader {...headerProps} />
  <ArticleMeta {...metaProps} mode="compact" />
  <div className="content">{content}</div>
  <ArticleFooter {...footerProps} />
</article>
```

### 2. 数据获取

```tsx
// 使用服务端组件获取数据
async function BlogPage() {
  const posts = await wordpressService.getPosts({ per_page: 10 });
  return <BlogList posts={posts.data} />;
}

// 使用客户端组件进行交互
'use client';
function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    await wordpressService.likePost(postId);
    setLiked(true);
  };

  return <button onClick={handleLike}>点赞</button>;
}
```

### 3. 错误处理

```tsx
// 添加错误边界
try {
  const post = await wordpressService.getPost(id);
  return <ArticleDetail post={post} />;
} catch (error) {
  return <ErrorMessage error={error} />;
}
```

### 4. 性能优化

```tsx
// 使用动态导入
import dynamic from 'next/dynamic';

const ArticleFooter = dynamic(
  () => import('@/components/blog').then(mod => mod.ArticleFooter),
  { ssr: false }
);
```

---

## 📚 相关文档

- [完整创建报告](./CREATION_REPORT_2026_03_03_SESSION3.md)
- [项目 README](./README.md)
- [开发进度](./DEVELOPMENT_PROGRESS.md)

---

## ❓ 常见问题

**Q: 如何自定义样式？**

A: 所有组件都支持 `className` prop，可以传入自定义类名。

**Q: 如何处理认证？**

A: 使用 `wordpressService.setAuthToken(token)` 设置认证令牌。

**Q: 如何添加新的社交平台？**

A: 在 `ArticleFooter` 组件中添加新的平台按钮和处理函数。

**Q: 如何优化加载性能？**

A: 使用 Next.js 的图片优化、动态导入和代码分割功能。

---

**创建时间**: 2026-03-03
**版本**: 1.0.0
**状态**: ✅ 可用于生产环境
