/**
 * Blog Helper Functions
 *
 * Utility functions for blog-related operations
 */

import { BlogPost, Category, Tag } from '@/types/models/blog';

// ============================================================================
// Text Processing
// ============================================================================

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, '').trim();
}

/**
 * Extract plain text excerpt from HTML content
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Calculate estimated reading time
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const text = stripHtml(content);
  const wordCount = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Get blog post URL
 */
export function getPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

/**
 * Get category URL
 */
export function getCategoryUrl(slug: string): string {
  return `/blog?category=${slug}`;
}

/**
 * Get tag URL
 */
export function getTagUrl(slug: string): string {
  return `/blog?tag=${slug}`;
}

/**
 * Get author URL
 */
export function getAuthorUrl(authorId: number | string): string {
  return `/author/${authorId}`;
}

// ============================================================================
// Post Filtering and Sorting
// ============================================================================

/**
 * Filter posts by category
 */
export function filterByCategory(posts: BlogPost[], categoryId: number | string): BlogPost[] {
  return posts.filter(post => 
    post.category?.id.toString() === categoryId.toString()
  );
}

/**
 * Filter posts by tag
 */
export function filterByTag(posts: BlogPost[], tagId: number | string): BlogPost[] {
  return posts.filter(post =>
    post.tags?.some(tag => tag.id.toString() === tagId.toString())
  );
}

/**
 * Filter posts by author
 */
export function filterByAuthor(posts: BlogPost[], authorId: number | string): BlogPost[] {
  return posts.filter(post =>
    post.author?.id.toString() === authorId.toString()
  );
}

/**
 * Search posts by query
 */
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase();
  return posts.filter(post =>
    post.title.toLowerCase().includes(lowerQuery) ||
    post.excerpt?.toLowerCase().includes(lowerQuery) ||
    post.content?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Sort posts by date
 */
export function sortByDate(posts: BlogPost[], order: 'asc' | 'desc' = 'desc'): BlogPost[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Sort posts by views
 */
export function sortByViews(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
}

/**
 * Sort posts by likes
 */
export function sortByLikes(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(posts: BlogPost[], limit: number = 3): BlogPost[] {
  return posts.slice(0, limit);
}

/**
 * Get popular posts (by views)
 */
export function getPopularPosts(posts: BlogPost[], limit: number = 5): BlogPost[] {
  return sortByViews(posts).slice(0, limit);
}

/**
 * Get recent posts
 */
export function getRecentPosts(posts: BlogPost[], limit: number = 5): BlogPost[] {
  return sortByDate(posts).slice(0, limit);
}

// ============================================================================
// Related Posts
// ============================================================================

/**
 * Get related posts by category
 */
export function getRelatedByCategory(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit: number = 3
): BlogPost[] {
  if (!currentPost.category) return [];
  
  return posts
    .filter(post => 
      post.id !== currentPost.id &&
      post.category?.id === currentPost.category?.id
    )
    .slice(0, limit);
}

/**
 * Get related posts by tags
 */
export function getRelatedByTags(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit: number = 3
): BlogPost[] {
  if (!currentPost.tags || currentPost.tags.length === 0) return [];

  const currentTagIds = new Set(currentPost.tags.map(tag => tag.id));

  return posts
    .filter(post => {
      if (post.id === currentPost.id) return false;
      if (!post.tags || post.tags.length === 0) return false;
      
      return post.tags.some(tag => currentTagIds.has(tag.id));
    })
    .slice(0, limit);
}

/**
 * Get related posts (combined algorithm)
 */
export function getRelatedPosts(
  posts: BlogPost[],
  currentPost: BlogPost,
  limit: number = 4
): BlogPost[] {
  // Get related by category
  const byCategory = getRelatedByCategory(posts, currentPost, Math.ceil(limit / 2));
  
  // Get related by tags
  const byTags = getRelatedByTags(posts, currentPost, Math.ceil(limit / 2));

  // Combine and remove duplicates
  const combined = [...byCategory];
  const seenIds = new Set(byCategory.map(p => p.id));

  for (const post of byTags) {
    if (!seenIds.has(post.id) && combined.length < limit) {
      combined.push(post);
      seenIds.add(post.id);
    }
  }

  return combined;
}

// ============================================================================
// Category and Tag Helpers
// ============================================================================

/**
 * Get category by slug
 */
export function getCategoryBySlug(categories: Category[], slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug);
}

/**
 * Get tag by slug
 */
export function getTagBySlug(tags: Tag[], slug: string): Tag | undefined {
  return tags.find(tag => tag.slug === slug);
}

/**
 * Sort categories by count
 */
export function sortCategoriesByCount(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => b.count - a.count);
}

/**
 * Sort tags by count
 */
export function sortTagsByCount(tags: Tag[]): Tag[] {
  return [...tags].sort((a, b) => b.count - a.count);
}

/**
 * Get popular categories
 */
export function getPopularCategories(categories: Category[], limit: number = 10): Category[] {
  return sortCategoriesByCount(categories).slice(0, limit);
}

/**
 * Get popular tags
 */
export function getPopularTags(tags: Tag[], limit: number = 20): Tag[] {
  return sortTagsByCount(tags).slice(0, limit);
}

// ============================================================================
// Statistics
// ============================================================================

/**
 * Get total posts count
 */
export function getTotalPosts(posts: BlogPost[]): number {
  return posts.length;
}

/**
 * Get total views across all posts
 */
export function getTotalViews(posts: BlogPost[]): number {
  return posts.reduce((sum, post) => sum + (post.views || 0), 0);
}

/**
 * Get average reading time
 */
export function getAverageReadingTime(posts: BlogPost[]): number {
  if (posts.length === 0) return 0;
  const total = posts.reduce((sum, post) => sum + (post.readingTime || 0), 0);
  return Math.round(total / posts.length);
}

/**
 * Get post count by category
 */
export function getPostCountByCategory(posts: BlogPost[]): Map<number, number> {
  const counts = new Map<number, number>();
  
  posts.forEach(post => {
    if (post.category) {
      const current = counts.get(post.category.id) || 0;
      counts.set(post.category.id, current + 1);
    }
  });
  
  return counts;
}

/**
 * Get post count by tag
 */
export function getPostCountByTag(posts: BlogPost[]): Map<number, number> {
  const counts = new Map<number, number>();
  
  posts.forEach(post => {
    post.tags?.forEach(tag => {
      const current = counts.get(tag.id) || 0;
      counts.set(tag.id, current + 1);
    });
  });
  
  return counts;
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Check if post is published
 */
export function isPostPublished(post: BlogPost): boolean {
  return post.status === 'published';
}

/**
 * Check if post has featured image
 */
export function hasFeaturedImage(post: BlogPost): boolean {
  return !!post.featuredImage;
}

/**
 * Check if post has excerpt
 */
export function hasExcerpt(post: BlogPost): boolean {
  return !!post.excerpt && post.excerpt.length > 0;
}

/**
 * Get post slug from URL
 */
export function getSlugFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}
