# 📝 Blog System Guide

完整的博客系统使用指南

## 🎯 概述

CyberPress 平台的博客系统提供了完整的文章管理、分类、标签、搜索等功能。

## 📦 组件

### 核心组件

#### BlogGrid
网格布局的文章列表

```tsx
import { BlogGrid } from '@/components/blog';

<BlogGrid
  posts={posts}
  loading={false}
  currentPage={1}
  totalPages={5}
  totalItems={50}
  columns={3}
  onPageChange={(page) => console.log(page)}
/>
```

#### BlogList
列表布局的文章列表

```tsx
import { BlogList } from '@/components/blog';

<BlogList
  posts={posts}
  loading={false}
  currentPage={1}
  totalPages={5}
  totalItems={50}
  pageSize={10}
  onPageChange={(page) => console.log(page)}
/>
```

#### ArticleCard
单篇文章卡片

```tsx
import { ArticleCard } from '@/components/blog';

<ArticleCard
  post={post}
  variant="grid"
  showExcerpt={true}
  showAuthor={true}
  showReadingTime={true}
/>
```

#### BlogHero
博客页面头部

```tsx
import { BlogHero } from '@/components/blog';

<BlogHero
  title="Welcome to Our Blog"
  description="Latest news and updates"
  className="border-b border-cyan-500/30"
/>
```

#### BlogSidebar
博客侧边栏

```tsx
import { BlogSidebar } from '@/components/blog';

<BlogSidebar className="sticky top-8" />
```

#### BlogFilters
博客过滤器

```tsx
import { BlogFilters } from '@/components/blog';

<BlogFilters
  currentCategory="tech"
  currentTag="react"
  searchQuery="next.js"
  currentSort="latest"
/>
```

## 🪝 Hooks

### useBlogPosts
获取文章列表

```tsx
import { useBlogPosts } from '@/hooks/blog';

function BlogPage() {
  const { data, isLoading, error } = useBlogPosts({
    params: {
      page: 1,
      perPage: 10,
      category: 'tech',
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return <BlogGrid {...data} />;
}
```

### useBlogPost
获取单篇文章

```tsx
import { useBlogPost } from '@/hooks/blog';

function PostPage({ slug }) {
  const { data, isLoading, error } = useBlogPost(slug);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return <ArticleDetail post={data} />;
}
```

### useBlogCategories
获取分类列表

```tsx
import { useBlogCategories } from '@/hooks/blog';

function CategoryList() {
  const { data: categories } = useBlogCategories();

  return (
    <ul>
      {categories?.map(cat => (
        <li key={cat.id}>{cat.name}</li>
      ))}
    </ul>
  );
}
```

### useBlogTags
获取标签列表

```tsx
import { useBlogTags, usePopularTags } from '@/hooks/blog';

function TagCloud() {
  const { data: tags } = usePopularTags(20);

  return (
    <div className="flex flex-wrap gap-2">
      {tags?.map(tag => (
        <span key={tag.id}>{tag.name}</span>
      ))}
    </div>
  );
}
```

### useBlogSearch
搜索文章

```tsx
import { useBlogSearch } from '@/hooks/blog';

function SearchBar() {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useBlogSearch({ q: query });

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## 🔧 工具函数

### 格式化函数

```typescript
import {
  calculateReadingTime,
  formatExcerpt,
  extractFirstImage,
  formatSEOTitle,
  generateKeywords,
} from '@/lib/utils/blog/formatters';

// 计算阅读时间
const readTime = calculateReadingTime(content); // 返回分钟数

// 格式化摘要
const excerpt = formatExcerpt(content, 160); // 160字符

// 提取首图
const image = extractFirstImage(content);

// SEO 标题
const seoTitle = formatSEOTitle(title, 'My Site');

// 生成关键词
const keywords = generateKeywords(title, tags, category);
```

### 验证函数

```typescript
import {
  validateTitle,
  validateContent,
  validateExcerpt,
  validatePostSlug,
} from '@/lib/utils/blog/validators';

// 验证标题
const { valid, error } = validateTitle('My Post Title');

// 验证内容
const { valid, error } = validateContent(content);

// 验证 slug
const { valid, error } = validatePostSlug('my-post-slug');
```

### 辅助函数

```typescript
import {
  filterPosts,
  sortPosts,
  paginatePosts,
  getRelatedPosts,
  getPopularPosts,
} from '@/lib/utils/blog/helpers';

// 过滤文章
const filtered = filterPosts(posts, {
  category: 'tech',
  tag: 'react',
});

// 排序文章
const sorted = sortPosts(posts, 'popularity', 'desc');

// 分页
const { posts: pagePosts, totalPages } = paginatePosts(posts, 1, 10);

// 相关文章
const related = getRelatedPosts(currentPost, allPosts, 4);

// 热门文章
const popular = getPopularPosts(posts, 10);
```

## 🌐 API 客户端

### Posts API

```typescript
import {
  getPosts,
  getPostBySlug,
  getRelatedPosts,
  searchPosts,
  getFeaturedPosts,
} from '@/lib/api/blog/posts';

// 获取文章列表
const { posts, total, page } = await getPosts({
  page: 1,
  perPage: 10,
  category: 'tech',
});

// 获取单篇文章
const post = await getPostBySlug('my-post-slug');

// 获取相关文章
const related = await getRelatedPosts('my-post-slug', 4);

// 搜索文章
const results = await searchPosts('react hooks', {
  page: 1,
  perPage: 10,
});

// 获取精选文章
const featured = await getFeaturedPosts(10);
```

### Taxonomy API

```typescript
import {
  getCategories,
  getCategory,
  getTags,
  getPopularTags,
} from '@/lib/api/blog/taxonomy';

// 获取所有分类
const categories = await getCategories();

// 获取单个分类
const category = await getCategory('tech');

// 获取所有标签
const tags = await getTags();

// 获取热门标签
const popularTags = await getPopularTags(20);
```

## 📄 页面示例

### 博客列表页

```tsx
// app/blog/page.tsx
import { BlogGrid, BlogHero, BlogSidebar } from '@/components/blog';
import { useBlogPosts } from '@/hooks/blog';

export default function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; tag?: string; page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);

  const { data, isLoading } = useBlogPosts({
    params: {
      page,
      category: searchParams.category,
      tag: searchParams.tag,
    },
  });

  return (
    <main>
      <BlogHero title="Blog" description="Our latest posts" />
      <div className="container">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <BlogGrid {...data} loading={isLoading} />
          </div>
          <aside>
            <BlogSidebar />
          </aside>
        </div>
      </div>
    </main>
  );
}
```

### 文章详情页

```tsx
// app/blog/[slug]/page.tsx
import { useBlogPost } from '@/hooks/blog';
import { ArticleDetail } from '@/components/blog';

export default function PostPage({ params }: { params: { slug: string } }) {
  const { data: post, isLoading } = useBlogPost(params.slug);

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return <ArticleDetail post={post} />;
}
```

### 分类页

```tsx
// app/blog/category/[slug]/page.tsx
import { useBlogCategory } from '@/hooks/blog';
import { BlogGrid } from '@/components/blog';

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: category } = useBlogCategory(params.slug);
  const { data: postsData } = useBlogPosts({
    params: { category: params.slug },
  });

  return (
    <main>
      <BlogHero title={category?.name} description={category?.description} />
      <BlogGrid {...postsData} />
    </main>
  );
}
```

## 🎨 样式定制

### 主题颜色

```css
/* globals.css */
:root {
  --blog-accent: #00f0ff;
  --blog-bg: #0a0a0f;
  --blog-text: #ffffff;
  --blog-muted: #6b7280;
}
```

### 组件样式

```tsx
<BlogGrid
  posts={posts}
  className="gap-8"
/>

<ArticleCard
  post={post}
  className="hover:shadow-cyan-500/20"
/>
```

## 📊 性能优化

1. **数据缓存**: 使用 React Query 的 staleTime 和 cacheTime
2. **图片优化**: 使用 Next.js Image 组件
3. **代码分割**: 使用动态导入
4. **分页**: 合理设置每页文章数量
5. **搜索防抖**: 使用 useDebounce hook

## 🔍 SEO 优化

```tsx
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}
```

## 🚀 最佳实践

1. **类型安全**: 始终使用 TypeScript 类型
2. **错误处理**: 妥善处理加载和错误状态
3. **响应式**: 确保所有组件在移动端正常工作
4. **可访问性**: 使用语义化 HTML 和 ARIA 属性
5. **性能**: 使用 React.memo 和 useMemo 优化
6. **测试**: 编写单元测试和集成测试

## 📚 相关资源

- [Next.js 文档](https://nextjs.org/docs)
- [React Query 文档](https://tanstack.com/query/latest)
- [Framer Motion 文档](https://www.framer.com/motion/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
