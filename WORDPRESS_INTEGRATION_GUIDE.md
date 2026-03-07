# WordPress Integration Guide

Complete guide for integrating WordPress REST API with CyberPress Platform.

## Table of Contents

- [Setup](#setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Components](#components)
- [Hooks](#hooks)
- [Adapters](#adapters)
- [Helpers](#helpers)
- [Examples](#examples)

## Setup

### 1. Install Dependencies

```bash
npm install @tanstack/react-query
```

### 2. Configure Environment Variables

Copy `.env.wordpress.example` to `.env.local`:

```bash
cp .env.wordpress.example .env.local
```

Edit `.env.local` and configure your WordPress site URL:

```env
NEXT_PUBLIC_WORDPRESS_URL=https://your-site.com
```

### 3. Enable WordPress REST API

Make sure your WordPress site has the REST API enabled (it is by default in WordPress 4.7+).

Test your API endpoint:
```
https://your-site.com/wp-json/wp/v2/posts
```

## Configuration

The WordPress integration is configured in `frontend/lib/wordpress/config.ts`:

```typescript
const config = {
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
  apiVersion: process.env.NEXT_PUBLIC_WORDPRESS_API_VERSION,
  timeout: 10000,
  enableCache: true,
  cacheTimeout: 300000,
  enableEmbed: true,
};
```

## Usage

### Basic Example

```typescript
import { usePosts } from '@/hooks/use-wordpress';

function MyComponent() {
  const { data: posts, isLoading, error } = usePosts();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title.rendered}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
        </div>
      ))}
    </div>
  );
}
```

### With Parameters

```typescript
const { data: posts } = usePosts({
  per_page: 10,
  page: 1,
  categories: [1, 2, 3],
  order: 'desc',
  orderby: 'date',
});
```

## Components

### BlogGrid

Display posts in a grid layout:

```typescript
import { BlogGrid } from '@/components/blog/BlogGrid';

<BlogGrid
  posts={posts}
  columns={{
    sm: 1,
    md: 2,
    lg: 3,
  }}
  gap={6}
/>
```

### BlogList

Display posts in a list layout:

```typescript
import { BlogList } from '@/components/blog/BlogList';

<BlogList
  posts={posts}
  variant="default"
  showDivider
/>
```

### BlogCardAdaptive

Automatically adapts to WordPress or custom post format:

```typescript
import { BlogCardAdaptive } from '@/components/blog/BlogCardAdaptive';

<BlogCardAdaptive
  post={wpPost}
  variant="default"
  showExcerpt
  showAuthor
  showDate
  showReadingTime
/>
```

## Hooks

### usePosts

Fetch posts with optional filters:

```typescript
const { data, isLoading, error } = usePosts(params, options);
```

**Parameters:**
- `page?: number` - Page number
- `per_page?: number` - Posts per page
- `search?: string` - Search query
- `categories?: number[]` - Category IDs
- `tags?: number[]` - Tag IDs
- `author?: number` - Author ID
- `order?: 'asc' | 'desc'` - Sort order
- `orderby?: 'date' | 'title' | 'modified'` - Sort by
- `sticky?: boolean` - Sticky posts only

### usePost

Fetch a single post:

```typescript
const { data: post } = usePost(postId);
```

### useCategories

Fetch categories:

```typescript
const { data: categories } = useCategories();
```

### useTags

Fetch tags:

```typescript
const { data: tags } = useTags();
```

### usePostComments

Fetch comments for a post:

```typescript
const { data: comments } = usePostComments(postId);
```

### useSearch

Search content:

```typescript
const { data: results } = useSearch(query);
```

## Adapters

WordPress data adapters transform WordPress API responses into app-friendly formats.

### adaptWpPost

Convert WordPress post to app format:

```typescript
import { adaptWpPost } from '@/lib/wordpress/adapters';

const adaptedPost = adaptWpPost(wpPost);
```

**Adapted Post Structure:**
```typescript
{
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  featuredImage?: string;
  readingTime: number;
  isSticky: boolean;
}
```

### adaptPosts

Convert multiple posts:

```typescript
const adaptedPosts = adaptPosts(wpPosts);
```

## Helpers

Utility functions for working with WordPress data.

### cleanHtml

Clean HTML content:

```typescript
import { cleanHtml } from '@/lib/wordpress/helpers';

const cleaned = cleanHtml(htmlContent, ['p', 'a', 'strong', 'em']);
```

### createExcerpt

Create excerpt from content:

```typescript
const excerpt = createExcerpt(content, 160);
```

### formatDate

Format date for display:

```typescript
const formatted = formatDate(post.date, 'en-US');
```

### calculateReadingTime

Calculate reading time:

```typescript
const readingTime = calculateReadingTime(post.content, 200);
```

### getPaginationInfo

Get pagination information:

```typescript
const pagination = getPaginationInfo(page, perPage, totalItems);
// Returns: { currentPage, perPage, totalItems, totalPages, hasNextPage, hasPreviousPage }
```

## Examples

### Complete Blog Page

```typescript
'use client';

import { usePosts, useCategories } from '@/hooks/use-wordpress';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { CategoryFilter } from '@/components/blog/CategoryFilter';
import { Pagination } from '@/components/blog/Pagination';

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: categories = [] } = useCategories();
  const { data: posts = [], isLoading } = usePosts({
    page,
    per_page: 12,
    categories: selectedCategory ? [parseInt(selectedCategory)] : undefined,
  });

  return (
    <div>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <BlogGrid posts={posts} />
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(posts.length / 12)}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
```

### Post Detail Page

```typescript
'use client';

import { usePost, usePostComments } from '@/hooks/use-wordpress';
import { adaptPost } from '@/lib/wordpress/adapters';
import { ArticleHeader } from '@/components/blog/ArticleHeader';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { CommentSystem } from '@/components/blog/CommentSystem';

export default function PostPage({ params }) {
  const { data: post, isLoading } = usePost(params.slug);
  const { data: comments = [] } = usePostComments(post?.id);

  if (isLoading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  const adaptedPost = adaptPost(post);

  return (
    <article>
      <ArticleHeader {...adaptedPost} />
      <ArticleContent content={adaptedPost.content} />
      <CommentSystem
        postId={adaptedPost.id}
        comments={comments}
      />
    </article>
  );
}
```

### Category Page

```typescript
'use client';

import { usePostsByCategory, useCategory } from '@/hooks/use-wordpress';
import { BlogList } from '@/components/blog/BlogList';

export default function CategoryPage({ params }) {
  const { data: category } = useCategory(params.slug);
  const { data: posts } = usePostsByCategory(category?.id);

  return (
    <div>
      <h1>{category?.name}</h1>
      <p>{category?.description}</p>
      <BlogList posts={posts} />
    </div>
  );
}
```

### Search Page

```typescript
'use client';

import { useState } from 'react';
import { useSearch } from '@/hooks/use-wordpress';
import { BlogSearch } from '@/components/blog/BlogSearch';
import { BlogGrid } from '@/components/blog/BlogGrid';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { data: results, isLoading } = useSearch(query);

  return (
    <div>
      <BlogSearch
        value={query}
        onChange={setQuery}
        placeholder="Search posts..."
      />

      {isLoading ? (
        <div>Searching...</div>
      ) : (
        <BlogGrid posts={results} />
      )}
    </div>
  );
}
```

## Caching

The WordPress client includes built-in caching to reduce API calls:

```typescript
import { useWpCache } from '@/hooks/use-wordpress';

function MyComponent() {
  const { clearPostsCache, clearAllCache, prefetchPost } = useWpCache();

  // Clear posts cache
  const handleRefresh = () => {
    clearPostsCache();
  };

  // Prefetch a post
  const handlePrefetch = (postId) => {
    prefetchPost(postId);
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

## Error Handling

All hooks include error handling:

```typescript
const { data, isLoading, error } = usePosts();

if (isLoading) {
  return <LoadingSpinner />;
}

if (error) {
  return (
    <EmptyState
      type="error"
      title="Failed to Load Posts"
      description={error.message}
      action={{ label: 'Retry', onClick: () => window.location.reload() }}
    />
  );
}

return <BlogGrid posts={data} />;
```

## TypeScript Support

Full TypeScript support with strict typing:

```typescript
import type { WPPost, AdaptedPost } from '@/lib/wordpress';

function processPost(post: WPPost): AdaptedPost {
  return adaptWpPost(post);
}
```

## Best Practices

1. **Always check loading and error states**
2. **Use pagination for large datasets**
3. **Enable caching to reduce API calls**
4. **Use adapters for consistent data format**
5. **Implement error boundaries**
6. **Optimize images with WordPress media sizes**
7. **Use semantic HTML for SEO**
8. **Implement proper caching strategies**

## Troubleshooting

### API Not Responding

- Check your WordPress site URL
- Verify WordPress REST API is enabled
- Check CORS settings if using different domains

### Missing Embedded Data

- Make sure `_embed` parameter is enabled
- Check WordPress REST API permissions

### Caching Issues

- Clear cache with `useWpCache()` hook
- Adjust cache timeout in config

### TypeScript Errors

- Make sure all types are properly imported
- Check for type mismatches between WordPress and app formats

## Additional Resources

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Next.js Documentation](https://nextjs.org/docs)

## Support

For issues and questions:
- Check the project documentation
- Review the examples
- Open an issue on GitHub

---

**Last Updated:** 2026-03-07
**Version:** 1.0.0
