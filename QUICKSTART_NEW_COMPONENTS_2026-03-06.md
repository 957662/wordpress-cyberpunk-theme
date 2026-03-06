# 🚀 Quick Start Guide - New Components (2026-03-06)

## 📦 Installation

First, install the required dependencies:

```bash
cd frontend
npm install react-syntax-highlighter framer-motion
npm install --save-dev @types/react-syntax-highlighter
```

---

## 🎨 Component Usage Guide

### 1. Code Highlight Enhanced

Display code with syntax highlighting and multiple themes.

```tsx
import CodeHighlightEnhanced from '@/components/ui/enhanced/CodeHighlightEnhanced';

function CodeExample() {
  const code = `function hello() {
  console.log('Hello, World!');
}`;

  return (
    <CodeHighlightEnhanced
      code={code}
      language="typescript"
      theme="dark"
      showLineNumbers={true}
      startingLineNumber={1}
    />
  );
}
```

**Available Themes**: `light`, `dark`, `dracula`, `atom`

**Supported Languages**: `javascript`, `typescript`, `python`, `java`, `cpp`, `go`, `rust`, `sql`, etc.

---

### 2. Table of Contents Enhanced

Auto-generated table of contents with smooth scrolling.

```tsx
import TableOfContentsEnhanced from '@/components/ui/enhanced/TableOfContentsEnhanced';

function BlogPost({ content }) {
  return (
    <article className="prose">
      <TableOfContentsEnhanced
        content={content}
        stickToTop={true}
        offsetTop={80}
      />
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
```

---

### 3. Real-Time Search

Debounced search with recent searches and keyboard navigation.

```tsx
import RealTimeSearch from '@/components/ui/enhanced/RealTimeSearch';

function SearchBar() {
  const handleSearch = async (query: string) => {
    const response = await fetch(`/api/search?q=${query}`);
    const data = await response.json();
    return data.results;
  };

  return (
    <RealTimeSearch
      onSearch={handleSearch}
      placeholder="Search articles, pages, tags..."
      showRecentSearches={true}
      showSearchHistory={true}
      minChars={2}
    />
  );
}
```

---

### 4. Like Button

Animated like button with particle effects.

```tsx
import LikeButton from '@/components/ui/enhanced/LikeButton';

function PostActions({ post }) {
  const handleLike = async (postId: string, liked: boolean) => {
    await fetch(`/api/posts/${postId}/like`, {
      method: liked ? 'POST' : 'DELETE',
    });
  };

  return (
    <LikeButton
      postId={post.id}
      initialLikes={post.likes}
      isInitiallyLiked={post.isLiked}
      onLike={handleLike}
      variant="animated"
      size="md"
      showCount={true}
    />
  );
}
```

**Variants**: `default`, `minimal`, `animated`

---

### 5. Share Button

Multi-platform social media sharing.

```tsx
import ShareButton from '@/components/ui/enhanced/ShareButton';

function SharePost({ post }) {
  return (
    <ShareButton
      url={post.url}
      title={post.title}
      description={post.excerpt}
      platforms={['twitter', 'facebook', 'linkedin', 'copy']}
      variant="expanded"
      showCount={true}
    />
  );
}
```

**Platforms**: `twitter`, `facebook`, `linkedin`, `whatsapp`, `telegram`, `copy`

---

### 6. Bookmark Button Enhanced

Animated bookmark with sparkle effects.

```tsx
import BookmarkButtonEnhanced from '@/components/ui/enhanced/BookmarkButtonEnhanced';

function BookmarkPost({ post }) {
  const handleBookmark = async (postId: string, bookmarked: boolean) => {
    await fetch(`/api/posts/${postId}/bookmark`, {
      method: bookmarked ? 'POST' : 'DELETE',
    });
  };

  return (
    <BookmarkButtonEnhanced
      postId={post.id}
      initialBookmarked={post.isBookmarked}
      onBookmark={handleBookmark}
      variant="icon-only"
      size="lg"
    />
  );
}
```

**Variants**: `default`, `minimal`, `icon-only`

---

### 7. Optimized Image

Performance-optimized image with lazy loading.

```tsx
import OptimizedImage, { ImageGallery, Lightbox } from '@/components/ui/enhanced/OptimizedImage';

function ImageExample() {
  return (
    <>
      {/* Single Image */}
      <OptimizedImage
        src="/images/photo.jpg"
        alt="Description"
        width={800}
        height={600}
        quality={75}
        lazy={true}
        zoomOnHover={true}
      />

      {/* Image Gallery */}
      <ImageGallery
        images={[
          { src: '/img1.jpg', alt: 'Image 1' },
          { src: '/img2.jpg', alt: 'Image 2' },
          { src: '/img3.jpg', alt: 'Image 3' },
        ]}
        columns={3}
        gap={16}
      />
    </>
  );
}
```

---

## 🪝 Hook Usage Guide

### useInfiniteScrollEnhanced

Infinite scroll with caching and error handling.

```tsx
import { useInfiniteScrollEnhanced } from '@/hooks/useInfiniteScrollEnhanced';

function PostList() {
  const { data, isLoading, hasMore, observerTarget, reset } = useInfiniteScrollEnhanced(
    async (page) => {
      const response = await fetch(`/api/posts?page=${page}`);
      const data = await response.json();
      return {
        data: data.posts,
        hasMore: data.hasMore,
        total: data.total,
      };
    },
    {
      threshold: 200,
      rootMargin: '200px',
      enabled: true,
      initialPage: 1,
    }
  );

  return (
    <div>
      {data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {isLoading && <div>Loading...</div>}
      
      <div ref={observerTarget} />
      
      {!hasMore && <div>No more posts</div>}
      
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

---

## 🛠️ Utility Usage Guide

### Performance Utils

```tsx
import {
  debounce,
  throttle,
  memoize,
  isInViewport,
  scrollToElement,
  formatBytes,
  calculateReadingTime
} from '@/lib/utils/performance-enhanced';

// Debounce function calls
const debouncedSearch = debounce((query) => {
  console.log('Searching:', query);
}, 300);

// Throttle scroll events
const throttledScroll = throttle(() => {
  console.log('Scrolled');
}, 100);

// Memoize expensive calculations
const expensiveCalc = memoize((n) => {
  return n * n; // Cache results
});

// Check if element is visible
if (isInViewport(element)) {
  console.log('Element is visible');
}

// Smooth scroll to element
scrollToElement('section-id', 80, 'smooth');

// Format file size
console.log(formatBytes(1024)); // "1 KB"

// Calculate reading time
console.log(calculateReadingTime(text)); // 5 minutes
```

---

### Search Service

```tsx
import { searchService, useSearch } from '@/lib/services/searchService';

// Using the service directly
async function performSearch(query: string) {
  const results = await searchService.search(query, {
    limit: 10,
    types: ['post', 'page'],
    categories: ['tech', 'news'],
  });
  
  return results;
}

// Using the React hook
function SearchComponent() {
  const { search, results, isLoading, error } = useSearch({
    limit: 10,
    types: ['post'],
  });

  return (
    <input
      type="text"
      onChange={(e) => search(e.target.value)}
      placeholder="Search..."
    />
  );
}

// Get recent searches
const recent = searchService.getRecentSearches(5);

// Save search
searchService.saveRecentSearch('React tutorial');

// Clear history
searchService.clearRecentSearches();
```

---

## 📄 Page Usage

### Profile Page

The profile page is automatically available at `/profile`.

**Features**:
- Edit profile information
- Upload avatar
- View stats (posts, followers, following, likes)
- Activity log
- Account settings

**Required Props**: None (uses authentication context)

---

## 🎯 Complete Example

Here's a complete example using multiple components:

```tsx
import CodeHighlightEnhanced from '@/components/ui/enhanced/CodeHighlightEnhanced';
import TableOfContentsEnhanced from '@/components/ui/enhanced/TableOfContentsEnhanced';
import LikeButton from '@/components/ui/enhanced/LikeButton';
import ShareButton from '@/components/ui/enhanced/ShareButton';
import BookmarkButtonEnhanced from '@/components/ui/enhanced/BookmarkButtonEnhanced';

export default function BlogPostPage({ post }) {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      {/* Table of Contents */}
      <TableOfContentsEnhanced content={post.content} />
      
      {/* Content */}
      <div className="prose mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
      
      {/* Code Example */}
      <CodeHighlightEnhanced
        code={post.codeExample}
        language="typescript"
        theme="dark"
      />
      
      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <LikeButton
          postId={post.id}
          initialLikes={post.likes}
          onLike={handleLike}
          variant="animated"
        />
        
        <BookmarkButtonEnhanced
          postId={post.id}
          initialBookmarked={post.isBookmarked}
          onBookmark={handleBookmark}
          variant="icon-only"
        />
        
        <ShareButton
          url={post.url}
          title={post.title}
          description={post.excerpt}
          variant="default"
        />
      </div>
    </article>
  );
}
```

---

## 🔧 Configuration

### Theme Configuration

The components use the cyberpunk theme. Make sure your Tailwind config includes:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'cyber-primary': '#00f0ff',
        'cyber-secondary': '#9d00ff',
        'cyber-accent': '#ff0080',
        'cyber-dark': '#0a0a0f',
      },
    },
  },
};
```

---

## 🐛 Troubleshooting

### Import Errors

If you encounter import errors, make sure:
1. All dependencies are installed
2. TypeScript paths are configured correctly in `tsconfig.json`
3. Files exist in the correct locations

### Type Errors

If you see TypeScript errors:
1. Run `npm install --save-dev @types/react-syntax-highlighter`
2. Restart your TypeScript server
3. Check that all imports are correct

### Performance Issues

If components feel slow:
1. Use `lazy` prop on images
2. Enable `debounce` on search
3. Use `memo` for expensive components
4. Check browser console for warnings

---

## 📚 Additional Resources

- [Project Documentation](./README.md)
- [Component API Reference](./COMPONENTS.md)
- [Development Guide](./DEVELOPMENT.md)
- [Testing Guide](./TESTING.md)

---

## 🎉 Tips

1. **Code Highlighting**: Use appropriate language for best syntax highlighting
2. **Table of Contents**: Works best with properly structured HTML headings
3. **Search**: Implement backend API for production use
4. **Social Buttons**: Customize platforms array to match your needs
5. **Performance**: Use lazy loading for images in long lists

---

**Created**: 2026-03-06
**Version**: 1.0.0
**Status**: ✅ Ready to Use
