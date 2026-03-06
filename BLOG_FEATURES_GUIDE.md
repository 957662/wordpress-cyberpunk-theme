# 📝 Blog Features Usage Guide

Generated: 2026-03-06

This guide explains how to use all the newly created blog features in the CyberPress Platform.

---

## 🎯 Overview

The following components and utilities have been created to enhance the blog functionality:

### ✅ Created Files

1. **Core Components** (`/frontend/components/blog/`)
   - `code-highlighter.tsx` - Syntax highlighting for code blocks
   - `table-of-contents.tsx` - Automatic TOC generation
   - `comment-system.tsx` - Full commenting functionality
   - `related-posts.tsx` - Related posts recommendations
   - `reading-progress.tsx` - Reading progress indicators
   - `blog-post-layout.tsx` - Consistent blog post layout
   - `search-bar.tsx` - Advanced search with suggestions
   - `like-button.tsx` - Social interactions (like, bookmark, share)
   - `blog-card.tsx` - Multiple blog card variants
   - `blog-list.tsx` - Blog listing with filters
   - `blog-index.ts` - Central export file
   - `types.ts` - TypeScript type definitions

2. **Utilities** (`/frontend/lib/`)
   - `blog-utils.ts` - Helper functions for blog operations

3. **Hooks** (`/frontend/hooks/`)
   - `use-debounce.ts` - Already exists (verified)

---

## 📖 Usage Examples

### 1. Blog Post Page

```tsx
// app/blog/[slug]/page.tsx
import {
  BlogPostLayout,
  PostHeader,
  PostContent,
  PostFooter,
  CodeHighlighter,
  TableOfContents,
  CommentSystem,
  RelatedPosts,
  ReadingProgress,
  SocialActions,
} from '@/components/blog';

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  return (
    <>
      <ReadingProgress />

      <BlogPostLayout>
        <PostHeader
          title={post.title}
          excerpt={post.excerpt}
          coverImage={post.coverImage}
          author={post.author}
          publishedAt={post.publishedAt}
          readingTime={post.readingTime}
          category={post.category}
          tags={post.tags}
          views={post.views}
        />

        <PostContent>
          {post.content}
        </PostContent>

        <SocialActions
          postId={post.id}
          initialLikes={post.likes}
          initialComments={post.comments}
        />

        <PostFooter
          author={post.author}
          tags={post.tags}
        />
      </BlogPostLayout>

      <TableOfContents />

      <CommentSystem
        postId={post.id}
        initialComments={post.comments}
      />

      <RelatedPosts
        posts={allPosts}
        currentPostId={post.id}
      />
    </>
  );
}
```

### 2. Blog Listing Page

```tsx
// app/blog/page.tsx
import { BlogList, SearchBar } from '@/components/blog';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  return (
    <div className="container mx-auto py-8">
      <SearchBar placeholder="Search articles..." />

      <BlogList
        posts={posts}
        loading={isLoading}
      />
    </div>
  );
}
```

### 3. Using Blog Cards

```tsx
import { BlogCard } from '@/components/blog';

function FeaturedPosts() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <BlogCard post={post1} variant="featured" />
      <BlogCard post={post2} variant="default" />
      <BlogCard post={post3} variant="compact" />
    </div>
  );
}
```

### 4. Using Blog Utilities

```tsx
import {
  calculateReadingTime,
  generateExcerpt,
  generateTableOfContents,
  formatDateRelative,
} from '@/lib/blog-utils';

// Calculate reading time
const readingTime = calculateReadingTime(post.content);

// Generate excerpt
const excerpt = generateExcerpt(post.content, 160);

// Generate TOC
const toc = generateTableOfContents(post.content);

// Format date
const dateStr = formatDateRelative(post.publishedAt);
```

---

## 🎨 Component Features

### CodeHighlighter

- ✅ Syntax highlighting for 10+ languages
- ✅ Copy to clipboard functionality
- ✅ Line numbers support
- ✅ Custom themes (Prism.js)
- ✅ Neon glow effects

```tsx
<CodeHighlighter
  code={codeString}
  language="typescript"
  showLineNumbers={true}
/>
```

### TableOfContents

- ✅ Auto-generates from headings
- ✅ Tracks active section on scroll
- ✅ Smooth scroll to section
- ✅ Reading progress indicator
- ✅ Collapsible sidebar

```tsx
<TableOfContents />
```

### CommentSystem

- ✅ Nested replies
- ✅ Real-time updates
- ✅ Markdown support
- ✅ User avatars
- ✅ Like/delete comments

```tsx
<CommentSystem
  postId={post.id}
  initialComments={comments}
/>
```

### RelatedPosts

- ✅ AI-powered recommendations
- ✅ Multiple layout variants
- ✅ Cover images
- ✅ Meta information
- ✅ Skeleton loaders

```tsx
<RelatedPosts
  posts={allPosts}
  currentPostId={post.id}
/>
```

### SearchBar

- ✅ Real-time search
- ✅ Search suggestions
- ✅ Search history
- ✅ Trending searches
- ✅ Keyboard shortcuts (⌘K)

```tsx
<SearchBar
  placeholder="Search articles..."
  onSearch={(query) => console.log(query)}
/>
```

### BlogCard Variants

1. **default** - Standard vertical card
2. **featured** - Large featured card
3. **compact** - Minimal compact card
4. **horizontal** - Horizontal layout card

```tsx
<BlogCard post={post} variant="featured" />
```

---

## 🔧 Configuration

### Prism.js Languages

Supported languages in CodeHighlighter:
- TypeScript
- JavaScript
- Python
- Bash
- CSS
- JSON
- Markdown
- JSX/TSX
- HTML
- Java
- C++
- C#
- Go
- Rust
- PHP
- Ruby
- SQL

### Color Scheme

All components use the cyberpunk theme:
- `--cyber-dark` - Background
- `--cyber-cyan` - Primary accent
- `--cyber-purple` - Secondary accent
- `--cyber-pink` - Tertiary accent

---

## 📦 API Integration

The components are designed to work with your FastAPI backend. Here's the API structure:

```typescript
// Blog Posts API
GET    /api/posts              // List all posts
GET    /api/posts/:id          // Get single post
POST   /api/posts              // Create post
PUT    /api/posts/:id          // Update post
DELETE /api/posts/:id          // Delete post

// Comments API
GET    /api/posts/:id/comments // Get comments
POST   /api/posts/:id/comments // Create comment
DELETE /api/comments/:id       // Delete comment

// Social API
POST   /api/posts/:id/like     // Like/unlike post
POST   /api/posts/:id/bookmark // Bookmark post
POST   /api/posts/:id/share    // Share post

// Search API
GET    /api/search?q=query     // Search posts
```

---

## 🎯 Next Steps

### To Complete Integration:

1. **Add Prism.js Dependencies**
   ```bash
   npm install prismjs @types/prismjs
   ```

2. **Update Global Styles**
   Add Prism.js theme import to your global CSS:
   ```css
   @import 'prismjs/themes/prism-tomorrow.css';
   ```

3. **Create API Service**
   Create `/frontend/services/blog-api.ts` to connect to your backend

4. **Add Toast Notifications**
   Ensure the `useToast` hook is available for feedback messages

5. **Test Components**
   - Run `npm run dev`
   - Navigate to `/blog`
   - Test each component

---

## 📝 Notes

- All components use `client` directive for Next.js 14 App Router
- TypeScript strict mode enabled
- Framer Motion for animations
- Lucide React for icons
- Fully responsive design

---

## 🐛 Troubleshooting

### Import Errors

If you get import errors, make sure to:

1. Check that the `blog` directory exists in `/frontend/components/`
2. Verify the `blog-index.ts` file exists
3. Update the main components index file

### Missing Styles

If components look unstyled:

1. Verify Tailwind CSS is configured
2. Check that cyberpunk theme colors are defined
3. Ensure `globals.css` imports are correct

### Type Errors

If TypeScript errors occur:

1. Install missing type packages: `npm install -D @types/prismjs`
2. Check that `types.ts` is in the blog components directory
3. Run `npm run type-check` to see all errors

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Prism.js](https://prismjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Generated by AI Development Team**
**Date: 2026-03-06**
