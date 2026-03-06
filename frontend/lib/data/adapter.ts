/**
 * Data Adapter for Blog Posts
 *
 * This file provides adapter functions to convert between different data formats:
 * - WordPress API format (with rendered fields)
 * - Unified BlogPost format (used in components)
 */

import type { BlogPost } from '@/types/models/blog';

// ============================================================================
// WordPress API Types
// ============================================================================

export interface WordPressPostRaw {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  categories: number[];
  tags: number[];
  _links?: any;
  _embedded?: {
    author?: Array<{
      id: number;
      name: string;
      slug: string;
      avatar_urls?: {
        '96'?: string;
      };
    }>;
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text?: string;
      media_details?: {
        sizes?: {
          full?: { source_url: string };
          large?: { source_url: string };
          medium?: { source_url: string };
        };
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

// ============================================================================
// Adapter Functions
// ============================================================================

/**
 * Convert WordPress post to BlogPost format
 */
export function adaptWordPressPost(wpPost: WordPressPostRaw): BlogPost {
  // Extract embedded data
  const author = wpPost._embedded?.author?.[0];
  const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
  const terms = wpPost._embedded?.['wp:term'] || [];

  // Extract categories (taxonomy: 'category')
  const categories = terms[0] || [];
  const category = categories.length > 0 ? {
    id: categories[0].id,
    name: categories[0].name,
    slug: categories[0].slug,
  } : undefined;

  // Extract tags (taxonomy: 'post_tag')
  const tags = (terms[1] || []).map((tag: any) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
  }));

  // Extract featured image
  const featuredImage = featuredMedia?.source_url;

  // Strip HTML from excerpt
  const excerpt = wpPost.excerpt.rendered.replace(/<[^>]*>?/gm, '').trim();

  // Calculate reading time
  const contentText = wpPost.content.rendered.replace(/<[^>]*>?/gm, '').trim();
  const wordCount = contentText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    excerpt,
    content: wpPost.content.rendered,
    author: {
      id: wpPost.author,
      name: author?.name || 'Unknown Author',
      avatar: author?.avatar_urls?.['96'],
    },
    category,
    tags,
    featuredImage,
    publishedAt: wpPost.date,
    updatedAt: wpPost.modified,
    status: wpPost.status === 'publish' ? 'published' : wpPost.status as any,
    views: 0,
    likes: 0,
    comments: 0,
    readingTime,
  };
}

/**
 * Convert array of WordPress posts to BlogPost format
 */
export function adaptWordPressPosts(wpPosts: WordPressPostRaw[]): BlogPost[] {
  return wpPosts.map(adaptWordPressPost);
}

/**
 * Check if a post is in WordPress format
 */
export function isWordPressPost(post: any): post is WordPressPostRaw {
  return (
    post &&
    typeof post === 'object' &&
    typeof post.title === 'object' &&
    typeof post.title.rendered === 'string' &&
    typeof post.content === 'object' &&
    typeof post.content.rendered === 'string'
  );
}

/**
 * Adapt a single post (detects format automatically)
 */
export function adaptPost(post: any): BlogPost {
  if (isWordPressPost(post)) {
    return adaptWordPressPost(post);
  }

  // Assume it's already in BlogPost format
  return post as BlogPost;
}

/**
 * Adapt array of posts (detects format automatically)
 */
export function adaptPosts(posts: any[]): BlogPost[] {
  if (posts.length === 0) return [];

  // Check if first post is in WordPress format
  if (isWordPressPost(posts[0])) {
    return adaptWordPressPosts(posts);
  }

  // Assume they're already in BlogPost format
  return posts as BlogPost[];
}
