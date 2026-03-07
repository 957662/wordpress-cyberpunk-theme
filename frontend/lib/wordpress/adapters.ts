/**
 * WordPress Data Adapters
 *
 * Convert WordPress API responses to app-specific formats
 */

import type {
  WPPost,
  WPCategory,
  WPTag,
  WPUser,
  WPMedia,
} from '@/types/wordpress';
import type { BlogPost } from '@/types/models/blog';

// ============================================================================
// Post Adapter
// ============================================================================

export interface AdaptedPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
  modified: string;
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
  featuredMedia?: WPMedia;
  link: string;
  commentCount?: number;
  views?: number;
  readingTime?: number;
  isSticky?: boolean;
}

/**
 * Adapt WordPress post to app format
 */
export function adaptWpPost(wpPost: WPPost): AdaptedPost {
  // Extract embedded data if available
  const embedded = (wpPost as any)._embedded;
  
  // Get author data
  const authorData = embedded?.author?.[0] || wpPost.author_data;
  const author = {
    id: wpPost.author,
    name: authorData?.name || 'Unknown Author',
    avatar: authorData?.avatar_urls?.['96'] || authorData?.avatar_urls?.['48'],
  };

  // Get category data
  const categoryData = embedded?.['wp:term']?.filter((term: any) => 
    term.some((t: any) => t.taxonomy === 'category')
  ).flat() || wpPost.category_data || [];
  
  const categories = categoryData.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));

  // Get tag data
  const tagData = embedded?.['wp:term']?.filter((term: any) => 
    term.some((t: any) => t.taxonomy === 'post_tag')
  ).flat() || wpPost.tag_data || [];
  
  const tags = tagData.map((tag: any) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  }));

  // Get featured media
  const featuredMedia = embedded?.['wp:featuredmedia']?.[0] || wpPost.featured_image;
  const featuredImage = featuredMedia?.source_url || featuredMedia?.featured_image || featuredMedia?.medium_large || featuredMedia?.large;

  // Calculate reading time (average 200 words per minute)
  const plainText = wpPost.content?.rendered?.replace(/<[^>]*>/g, '') || '';
  const wordCount = plainText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: String(wpPost.id),
    title: wpPost.title?.rendered || wpPost.title?.raw || '',
    excerpt: wpPost.excerpt?.rendered || wpPost.excerpt?.raw || '',
    content: wpPost.content?.rendered || wpPost.content?.raw || '',
    slug: wpPost.slug,
    date: wpPost.date,
    modified: wpPost.modified,
    author,
    categories,
    tags,
    featuredImage,
    featuredMedia,
    link: wpPost.link,
    commentCount: 0, // Can be calculated from embedded comments
    views: 0,
    readingTime,
    isSticky: wpPost.sticky,
  };
}

/**
 * Adapt multiple WordPress posts
 */
export function adaptWpPosts(wpPosts: WPPost[]): AdaptedPost[] {
  return wpPosts.map(adaptWpPost);
}

// ============================================================================
// Category Adapter
// ============================================================================

export interface AdaptedCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  link: string;
}

export function adaptWpCategory(wpCategory: WPCategory): AdaptedCategory {
  return {
    id: wpCategory.id,
    name: wpCategory.name,
    slug: wpCategory.slug,
    description: wpCategory.description,
    count: wpCategory.count,
    link: wpCategory.link,
  };
}

export function adaptWpCategories(wpCategories: WPCategory[]): AdaptedCategory[] {
  return wpCategories.map(adaptWpCategory);
}

// ============================================================================
// Tag Adapter
// ============================================================================

export interface AdaptedTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  link: string;
}

export function adaptWpTag(wpTag: WPTag): AdaptedTag {
  return {
    id: wpTag.id,
    name: wpTag.name,
    slug: wpTag.slug,
    description: wpTag.description,
    count: wpTag.count,
    link: wpTag.link,
  };
}

export function adaptWpTags(wpTags: WPTag[]): AdaptedTag[] {
  return wpTags.map(adaptWpTag);
}

// ============================================================================
// User Adapter
// ============================================================================

export interface AdaptedUser {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar?: string;
  link: string;
}

export function adaptWpUser(wpUser: WPUser): AdaptedUser {
  return {
    id: wpUser.id,
    name: wpUser.name,
    slug: wpUser.slug,
    description: wpUser.description,
    avatar: wpUser.avatar_urls?.['96'] || wpUser.avatar_urls?.['48'],
    link: wpUser.link,
  };
}

export function adaptWpUsers(wpUsers: WPUser[]): AdaptedUser[] {
  return wpUsers.map(adaptWpUser);
}

// ============================================================================
// Media Adapter
// ============================================================================

export interface AdaptedMedia {
  id: number;
  title: string;
  altText: string;
  caption: string;
  description: string;
  mimeType: string;
  mediaType: 'image' | 'file' | 'video' | 'audio';
  url: string;
  sizes: {
    thumbnail?: string;
    medium?: string;
    mediumLarge?: string;
    large?: string;
    full?: string;
  };
  width?: number;
  height?: number;
}

export function adaptWpMedia(wpMedia: WPMedia): AdaptedMedia {
  const sizes = wpMedia.media_details?.sizes || {};
  
  return {
    id: wpMedia.id,
    title: wpMedia.title?.rendered || '',
    altText: wpMedia.alt_text,
    caption: wpMedia.caption?.rendered || '',
    description: wpMedia.description?.rendered || '',
    mimeType: wpMedia.mime_type,
    mediaType: wpMedia.media_type,
    url: wpMedia.source_url,
    sizes: {
      thumbnail: sizes.thumbnail?.source_url,
      medium: sizes.medium?.source_url,
      mediumLarge: sizes['medium_large']?.source_url,
      large: sizes.large?.source_url,
      full: wpMedia.source_url,
    },
    width: wpMedia.media_details?.width,
    height: wpMedia.media_details?.height,
  };
}

export function adaptWpMediaList(wpMediaList: WPMedia[]): AdaptedMedia[] {
  return wpMediaList.map(adaptWpMedia);
}

// ============================================================================
// Generic Adapter
// ============================================================================

/**
 * Check if data is in WordPress format
 */
export function isWpPost(data: any): data is WPPost {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'number' &&
    data.title &&
    (data.title.rendered || data.title.raw) &&
    data.content &&
    (data.content.rendered || data.content.raw)
  );
}

/**
 * Adapt post data (auto-detects format)
 */
export function adaptPost(data: any): AdaptedPost {
  if (isWpPost(data)) {
    return adaptWpPost(data);
  }
  
  // Assume it's already in adapted format
  return data as AdaptedPost;
}

/**
 * Adapt posts array (auto-detects format)
 */
export function adaptPosts(posts: any[]): AdaptedPost[] {
  if (!posts || posts.length === 0) {
    return [];
  }

  // Check if first post is in WordPress format
  if (isWpPost(posts[0])) {
    return adaptWpPosts(posts);
  }

  // Assume posts are already adapted
  return posts as AdaptedPost[];
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Extract plain text from HTML content
 */
export function extractPlainText(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const plainText = extractPlainText(content);
  const wordCount = plainText.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Get featured image URL in desired size
 */
export function getFeaturedImageUrl(
  post: AdaptedPost | WPPost,
  size: 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'full' = 'large'
): string | undefined {
  if ('featuredMedia' in post && post.featuredMedia) {
    return post.featuredMedia.sizes?.[size] || post.featuredImage;
  }
  
  if ('featured_image' in post && typeof post.featured_image === 'object') {
    return post.featured_image?.[size as keyof typeof post.featured_image] as string;
  }
  
  if ('featured_image' in post && typeof post.featured_image === 'string') {
    return post.featured_image;
  }
  
  const wpPost = post as any;
  if (wpPost._embedded?.['wp:featuredmedia']?.[0]) {
    const media = wpPost._embedded['wp:featuredmedia'][0];
    return media.media_details?.sizes?.[size]?.source_url || media.source_url;
  }
  
  return undefined;
}
