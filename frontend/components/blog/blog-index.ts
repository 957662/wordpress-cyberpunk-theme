/**
 * Blog Components Index
 *
 * This file exports all blog-related components for easy importing.
 *
 * @example
 * ```tsx
 * import { BlogCard, BlogList, CommentSystem } from '@/components/blog';
 * ```
 */

// Core Components
export { BlogCard, BlogCardSkeleton } from './blog-card';
export type { BlogPost } from './blog-card';

export { BlogList, PaginatedBlogList } from './blog-list';

export {
  BlogPostLayout,
  PostHeader,
  PostContent,
  PostFooter,
} from './blog-post-layout';

// Feature Components
export { CodeHighlighter, extractCodeFromMarkdown } from './code-highlighter';
export { TableOfContents, useTableOfContents } from './table-of-contents';
export { CommentSystem } from './comment-system';
export { RelatedPosts, RelatedPostsSkeleton } from './related-posts';
export {
  ReadingProgress,
  ArticleReadingTime,
  TOCProgress,
} from './reading-progress';

// Search & Filter
export { SearchBar, SearchCommandPalette } from './search-bar';

// Social Components
export {
  SocialActions,
  FloatingActionBar,
  SharePopover,
} from './like-button';

// Types
export type {
  Comment,
  TocItem,
  SearchResult,
  RelatedPostsProps,
  CommentSystemProps,
  SearchBarProps,
  SocialActionsProps,
} from './types';

// Re-export commonly used sub-components
export { useState, useEffect } from 'react';
