/**
 * WordPress Helper Functions
 *
 * Utility functions for working with WordPress data
 */

import { extractPlainText, truncateText, formatDate, calculateReadingTime } from './adapters';

// ============================================================================
// Content Helpers
// ============================================================================

/**
 * Clean HTML content by removing unwanted tags
 */
export function cleanHtml(html: string, allowedTags: string[] = []): string {
  if (!html) return '';
  
  // Remove script tags
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove style tags
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  if (allowedTags.length === 0) {
    return extractPlainText(cleaned);
  }
  
  // Keep only allowed tags
  const allowedPattern = allowedTags.join('|');
  const tagRegex = new RegExp(`<(?!\/?(?:${allowedPattern})\b)[^>]+>`, 'gi');
  cleaned = cleaned.replace(tagRegex, '');
  
  return cleaned;
}

/**
 * Create excerpt from content
 */
export function createExcerpt(
  content: string,
  maxLength: number = 160,
  stripHtml: boolean = true
): string {
  let text = content;
  
  if (stripHtml) {
    text = extractPlainText(content);
  }
  
  return truncateText(text, maxLength);
}

/**
 * Format post title
 */
export function formatTitle(title: string, maxLength?: number): string {
  // Remove HTML tags
  const cleanTitle = extractPlainText(title);
  
  if (maxLength && cleanTitle.length > maxLength) {
    return truncateText(cleanTitle, maxLength);
  }
  
  return cleanTitle;
}

// ============================================================================
// URL Helpers
// ============================================================================

/**
 * Get post URL from slug
 */
export function getPostUrl(slug: string, baseUrl: string = '/blog'): string {
  return `${baseUrl}/${slug}`;
}

/**
 * Get category URL
 */
export function getCategoryUrl(slug: string, baseUrl: string = '/blog'): string {
  return `${baseUrl}/category/${slug}`;
}

/**
 * Get tag URL
 */
export function getTagUrl(slug: string, baseUrl: string = '/blog'): string {
  return `${baseUrl}/tag/${slug}`;
}

/**
 * Get author URL
 */
export function getAuthorUrl(authorSlug: string, baseUrl: string = '/blog'): string {
  return `${baseUrl}/author/${authorSlug}`;
}

// ============================================================================
// Image Helpers
// ============================================================================

/**
 * Get responsive image sizes
 */
export function getResponsiveSizes(media: any): string {
  const sizes: string[] = [];
  
  if (media.media_details?.sizes) {
    const { width, height } = media.media_details;
    
    if (width) {
      sizes.push(`(max-width: ${width}px) ${width}px`);
    }
    
    if (media.media_details.sizes.large) {
      sizes.push(`(max-width: ${media.media_details.sizes.large.width}px) ${media.media_details.sizes.large.width}px`);
    }
    
    if (media.media_details.sizes.medium_large) {
      sizes.push(`(max-width: ${media.media_details.sizes.medium_large.width}px) ${media.media_details.sizes.medium_large.width}px`);
    }
  }
  
  return sizes.join(', ') || '100vw';
}

/**
 * Get image srcset
 */
export function getSrcSet(media: any): string {
  if (!media.media_details?.sizes) {
    return media.source_url || '';
  }
  
  const sizes = [
    media.source_url,
    ...Object.values(media.media_details.sizes).map((size: any) => size.source_url)
  ];
  
  return sizes.join(', ');
}

// ============================================================================
// Schema.org Helpers
// ============================================================================

/**
 * Generate JSON-LD schema for blog post
 */
export function generateArticleSchema(post: any): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
  };
  
  return JSON.stringify(schema);
}

/**
 * Generate JSON-LD schema for blog
 */
export function generateBlogSchema(posts: any[]): string {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'CyberPress Blog',
    description: 'A cyberpunk-themed blog platform',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: post.link,
      datePublished: post.date,
    })),
  };
  
  return JSON.stringify(schema);
}

// ============================================================================
// SEO Helpers
// ============================================================================

/**
 * Generate meta description from content
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  return createExcerpt(content, maxLength);
}

/**
 * Generate Open Graph metadata
 */
export function generateOpenGraph(post: any) {
  return {
    'og:title': post.title,
    'og:description': post.excerpt,
    'og:image': post.featuredImage,
    'og:type': 'article',
    'og:url': post.link,
    'article:published_time': post.date,
    'article:modified_time': post.modified,
    'article:author': post.author.name,
  };
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterCard(post: any) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': post.title,
    'twitter:description': post.excerpt,
    'twitter:image': post.featuredImage,
  };
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Check if post is valid
 */
export function isValidPost(post: any): boolean {
  return !!(
    post &&
    (post.id || post.slug) &&
    post.title &&
    (post.title.rendered || post.title.raw || typeof post.title === 'string')
  );
}

/**
 * Filter valid posts from array
 */
export function filterValidPosts(posts: any[]): any[] {
  return posts.filter(isValidPost);
}

/**
 * Deduplicate posts by ID
 */
export function deduplicatePosts(posts: any[]): any[] {
  const seen = new Set();
  return posts.filter(post => {
    const id = post.id || post.slug;
    if (seen.has(id)) {
      return false;
    }
    seen.add(id);
    return true;
  });
}

// ============================================================================
// Sorting Helpers
// ============================================================================

/**
 * Sort posts by date
 */
export function sortPostsByDate(posts: any[], order: 'asc' | 'desc' = 'desc'): any[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

/**
 * Sort posts by title
 */
export function sortPostsByTitle(posts: any[], order: 'asc' | 'desc' = 'asc'): any[] {
  return [...posts].sort((a, b) => {
    const titleA = (a.title?.rendered || a.title || '').toLowerCase();
    const titleB = (b.title?.rendered || b.title || '').toLowerCase();
    return order === 'asc' 
      ? titleA.localeCompare(titleB)
      : titleB.localeCompare(titleA);
  });
}

/**
 * Sort posts by comment count
 */
export function sortPostsByComments(posts: any[], order: 'asc' | 'desc' = 'desc'): any[] {
  return [...posts].sort((a, b) => {
    const commentsA = a.comment_count || 0;
    const commentsB = b.comment_count || 0;
    return order === 'asc' ? commentsA - commentsB : commentsB - commentsA;
  });
}

// ============================================================================
// Pagination Helpers
// ============================================================================

/**
 * Paginate array of items
 */
export function paginateItems<T>(items: T[], page: number, perPage: number): T[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return items.slice(start, end);
}

/**
 * Calculate total pages
 */
export function getTotalPages(totalItems: number, perPage: number): number {
  return Math.ceil(totalItems / perPage);
}

/**
 * Get pagination info
 */
export function getPaginationInfo(page: number, perPage: number, totalItems: number) {
  return {
    currentPage: page,
    perPage,
    totalItems,
    totalPages: getTotalPages(totalItems, perPage),
    hasNextPage: page < getTotalPages(totalItems, perPage),
    hasPreviousPage: page > 1,
  };
}

// ============================================================================
// Search Helpers
// ============================================================================

/**
 * Highlight search term in text
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * Escape special regex characters
 */
export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================================
// Export all helpers
// ============================================================================

export default {
  cleanHtml,
  createExcerpt,
  formatTitle,
  getPostUrl,
  getCategoryUrl,
  getTagUrl,
  getAuthorUrl,
  getResponsiveSizes,
  getSrcSet,
  generateArticleSchema,
  generateBlogSchema,
  generateMetaDescription,
  generateOpenGraph,
  generateTwitterCard,
  isValidPost,
  filterValidPosts,
  deduplicatePosts,
  sortPostsByDate,
  sortPostsByTitle,
  sortPostsByComments,
  paginateItems,
  getTotalPages,
  getPaginationInfo,
  highlightSearchTerm,
  escapeRegex,
  extractPlainText,
  truncateText,
  formatDate,
  calculateReadingTime,
};
