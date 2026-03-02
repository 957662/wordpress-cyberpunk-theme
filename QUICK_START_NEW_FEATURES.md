# 🚀 新功能快速上手指南

> 2026-03-03 新增功能使用指南

## 📚 目录

1. [文本处理工具](#文本处理工具)
2. [社交分享组件](#社交分享组件)
3. [系列文章导航](#系列文章导航)
4. [SEO 优化工具](#seo-优化工具)
5. [WordPress API 客户端](#wordpress-api-客户端)

---

## 文本处理工具

### 📖 计算阅读时间

```typescript
import { calculateReadingTime } from '@/lib/utils/text-utils';

const { minutes, text } = calculateReadingTime(articleContent);
console.log(text); // "5 分钟"
```

### 📝 生成文章摘要

```typescript
import { generateExcerpt } from '@/lib/utils/text-utils';

// 自动在句子边界截断
const excerpt = generateExcerpt(content, 150);
// 保留完整句子，最多 150 字符
```

### 🔑 提取关键词

```typescript
import { extractKeywords } from '@/lib/utils/text-utils';

const keywords = extractKeywords(articleContent, 10);
// 返回前 10 个关键词: ['react', 'hooks', 'javascript', ...]
```

### 🎯 高亮搜索词

```typescript
import { highlightKeywords } from '@/lib/utils/text-utils';

const highlighted = highlightKeywords(
  articleContent,
  'React Hooks',
  'bg-cyber-cyan/20 text-cyber-cyan'
);
// 返回带 <mark> 标签的 HTML
```

---

## 社交分享组件

### 🎯 基础分享按钮

```typescript
import { SocialShare } from '@/components/blog/SocialShare';

<SocialShare
  title="文章标题"
  url="https://example.com/blog/post"
  description="文章描述"
  tags={['react', 'nextjs']}
  direction="horizontal"
  size="md"
/>
```

### 🎈 浮动分享栏

```typescript
import { FloatingShare } from '@/components/blog/SocialShare';

<FloatingShare
  title={post.title}
  url={post.url}
  position="left"
/>
```

### 📧 分享卡片

```typescript
import { ShareCard } from '@/components/blog/SocialShare';

<ShareCard
  title={post.title}
  url={post.url}
  description={post.excerpt}
/>
```

---

## 系列文章导航

### 📚 完整系列导航

```typescript
import { SeriesNavigation } from '@/components/blog/SeriesNavigation';

<SeriesNavigation
  title="Next.js 完全指南"
  description="从零开始学习 Next.js 14"
  articles={[
    { slug: 'intro', title: '简介', order: 1, description: '...' },
    { slug: 'routing', title: '路由系统', order: 2, description: '...' },
    { slug: 'ssr', title: '服务端渲染', order: 3, description: '...' },
  ]}
  currentSlug="routing"
/>
```

### ⬅️➡️ 简化导航

```typescript
import { SimpleSeriesNav } from '@/components/blog/SeriesNavigation';

<SimpleSeriesNav
  prevArticle={{ slug: 'intro', title: '简介' }}
  nextArticle={{ slug: 'ssr', title: '服务端渲染' }}
/>
```

### 📊 进度条

```typescript
import { SeriesProgress } from '@/components/blog/SeriesNavigation';

<SeriesProgress
  current={3}
  total={10}
  color="cyan"
  showPercentage
/>
```

---

## SEO 优化工具

### 🏷️ 生成页面元数据

```typescript
import { generatePageMeta } from '@/lib/seo/seo-utils';

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  return generatePageMeta({
    title: post.title,
    description: post.excerpt,
    type: 'article',
    publishDate: post.date,
    modifiedDate: post.modified,
    author: post.author.name,
    keywords: post.tags,
  });
}
```

### 📋 生成结构化数据

```typescript
import { generateStructuredData } from '@/lib/seo/seo-utils';

const structuredData = generateStructuredData('Article', {
  title: post.title,
  description: post.excerpt,
  publishDate: post.date,
  author: post.author.name,
  slug: post.slug,
});

// 在页面中使用
<script type="application/ld+json">
  {JSON.stringify(structuredData)}
</script>
```

### 🔍 SEO 检查

```typescript
import { checkSeo } from '@/lib/seo/seo-utils';

const seoIssues = checkSeo({
  title: post.title,
  description: post.excerpt,
  content: post.content,
  keywords: post.tags,
  images: post.images,
});

// 检查结果示例
[
  { passed: true, message: "标题长度合适 (45 字符)", severity: "info" },
  { passed: false, message: "描述过短 (80/120-160 字符)", severity: "warning" },
]
```

### 🔗 生成 Canonical URL

```typescript
import { generateCanonicalUrl } from '@/lib/seo/seo-utils';

const canonical = generateCanonicalUrl('/blog/post-slug', 'zh-CN');
// "https://cyberpress.dev/blog/post-slug"
```

---

## WordPress API 客户端

### 📝 获取文章列表

```typescript
import { wpApi } from '@/lib/wordpress/wp-client-enhanced';

// 基础查询
const posts = await wpApi.posts.list({
  page: 1,
  per_page: 10,
  orderby: 'date',
  order: 'desc',
});

// 高级查询
const filteredPosts = await wpApi.posts.list({
  categories: [5, 6],
  tags: [10],
  author: 1,
  search: 'react',
  status: 'publish',
});
```

### 📄 获取单篇文章

```typescript
// 根据 ID
const post = await wpApi.posts.get(123);

// 根据 slug
const posts = await wpApi.posts.getBySlug('post-slug');
const post = posts[0];
```

### 🏷️ 获取分类和标签

```typescript
// 获取所有分类
const categories = await wpApi.categories.list({
  hide_empty: true,
});

// 获取特定分类
const category = await wpApi.categories.get(5);

// 获取标签
const tags = await wpApi.tags.list({
  hide_empty: true,
});
```

### 📤 创建/更新文章

```typescript
// 创建文章
const newPost = await wpApi.posts.create({
  title: '新文章标题',
  content: '文章内容',
  excerpt: '摘要',
  status: 'draft',
  categories: [5],
  tags: [10, 11],
});

// 更新文章
const updated = await wpApi.posts.update(123, {
  title: '更新后的标题',
  content: '更新后的内容',
  status: 'publish',
});
```

### 🖼️ 上传媒体

```typescript
// 上传图片
const media = await wpApi.media.upload(file, {
  title: '图片标题',
  alt_text: '替代文本',
  caption: '说明文字',
});

// 获取媒体信息
const mediaInfo = await wpApi.media.get(media.id);
```

### 🔍 搜索

```typescript
// 全局搜索
const results = await wpApi.search.search('react hooks', {
  type: ['post', 'page'],
  per_page: 20,
});
```

### 💾 使用缓存

```typescript
// 带缓存的请求
const posts = await wpApi.cached(
  'posts-page-1',
  () => wpApi.posts.list({ page: 1 }),
  false // forceRefresh
);

// 清除缓存
wpApi.cache.clear();
```

### 🔄 批量请求

```typescript
// 并发请求多个接口
const [posts, categories, tags] = await wpApi.batch([
  () => wpApi.posts.list({ per_page: 5 }),
  () => wpApi.categories.list(),
  () => wpApi.tags.list(),
]);
```

---

## 🎯 实际应用示例

### 完整的文章详情页

```typescript
// app/blog/[slug]/page.tsx
import { wpApi } from '@/lib/wordpress/wp-client-enhanced';
import { calculateReadingTime, generateExcerpt } from '@/lib/utils/text-utils';
import { generatePageMeta, generateStructuredData } from '@/lib/seo/seo-utils';
import { SocialShare, SeriesNavigation } from '@/components/blog/SocialShare';
import { ReadingProgress } from '@/components/blog/ReadingProgress';

// 1. 生成元数据
export async function generateMetadata({ params }) {
  const [posts] = await wpApi.batch([
    () => wpApi.posts.getBySlug(params.slug),
  ]);

  const post = posts[0];

  return generatePageMeta({
    title: post.title,
    description: post.excerpt,
    type: 'article',
    publishDate: post.date,
    author: post.author?.name,
  });
}

// 2. 页面组件
export default async function BlogPostPage({ params }) {
  const [posts, categories] = await wpApi.batch([
    () => wpApi.posts.getBySlug(params.slug),
    () => wpApi.categories.list(),
  ]);

  const post = posts[0];
  const readingTime = calculateReadingTime(post.content);

  return (
    <article className="max-w-4xl mx-auto">
      {/* 阅读进度 */}
      <ReadingProgress position="top" color="cyan" showPercentage />

      {/* 文章头部 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-gray-400">
          <span>📅 {new Date(post.date).toLocaleDateString()}</span>
          <span>📖 {readingTime.text}</span>
          <span>👁️ {post.view_count || 0} 阅读</span>
        </div>

        {/* 分类和标签 */}
        <div className="flex gap-2 mt-4">
          {post.categories.map(catId => {
            const cat = categories.find(c => c.id === catId);
            return cat ? (
              <span key={cat.id} className="px-3 py-1 bg-cyber-cyan/10 text-cyber-cyan rounded-full text-sm">
                {cat.name}
              </span>
            ) : null;
          })}
        </div>
      </header>

      {/* 文章内容 */}
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 分享 */}
      <div className="mt-12">
        <SocialShare
          title={post.title}
          url={`/blog/${post.slug}`}
          description={post.excerpt}
          tags={post.tags}
        />
      </div>

      {/* 系列导航 */}
      {post.series && (
        <div className="mt-12">
          <SeriesNavigation
            title={post.series.title}
            description={post.series.description}
            articles={post.series.articles}
            currentSlug={post.slug}
          />
        </div>
      )}
    </article>
  );
}
```

### 博客列表页

```typescript
// app/blog/page.tsx
import { wpApi } from '@/lib/wordpress/wp-client-enhanced';
import { calculateReadingTime } from '@/lib/utils/text-utils';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await wpApi.posts.list({
    page: 1,
    per_page: 12,
    status: 'publish',
  });

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => {
        const { minutes } = calculateReadingTime(post.content);

        return (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <article className="cyber-card p-6">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>

              {post.excerpt && (
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span>{minutes} 分钟</span>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}
```

---

## 💡 最佳实践

### 1. 错误处理

```typescript
try {
  const posts = await wpApi.posts.list();
} catch (error) {
  console.error('获取文章失败:', error);
  // 显示错误提示
}
```

### 2. 性能优化

```typescript
// 使用缓存
const posts = await wpApi.cached('posts-home', () =>
  wpApi.posts.list({ per_page: 10 })
);

// 批量请求
const [posts, categories, tags] = await wpApi.batch([
  () => wpApi.posts.list(),
  () => wpApi.categories.list(),
  () => wpApi.tags.list(),
]);
```

### 3. TypeScript 类型

```typescript
import type { PageMeta } from '@/lib/seo/seo-utils';

const meta: PageMeta = {
  title: '文章标题',
  description: '文章描述',
  type: 'article',
};
```

---

## 📚 更多资源

- [完整 API 文档](./SESSION_2026_03_03_NEW_FILES_REPORT.md)
- [项目 README](./README.md)
- [组件文档](./CREATED_COMPONENTS.md)

---

**创建时间**: 2026-03-03
**技术栈**: Next.js 14 + TypeScript + Tailwind CSS

🚀 **开始使用这些强大的新功能吧！**
