/**
 * Blog Data Adapter
 *
 * Adapts different data sources (WordPress, API, etc.) to a unified format
 */

import type { BlogPost, BlogCardProps } from '@/types/blog-components';
import type { WordPressPost } from '@/types/wordpress';

/**
 * Convert WordPress post to BlogPost format
 */
export function adaptWordPressPost(post: WordPressPost): BlogPost {
  return {
    id: String(post.id),
    title: post.title.rendered,
    slug: post.slug,
    excerpt: post.excerpt.rendered,
    content: post.content.rendered,
    date: post.date,
    modified: post.modified,
    status: post.status,
    link: post.link,
    author: {
      id: post.author,
      name: post._embedded?.author?.[0]?.name || 'Unknown',
      url: post._embedded?.author?.[0]?.link,
      avatar: post._embedded?.author?.[0]?.avatar_urls?.['96'],
    },
    categories: post._embedded?.['wp:term']?.filter(
      (term: any) => term[0]?.taxonomy === 'category'
    ).map((term: any) => ({
      id: term[0].id,
      name: term[0].name,
      slug: term[0].slug,
      link: term[0].link,
    })) || [],
    tags: post._embedded?.['wp:term']?.filter(
      (term: any) => term[0]?.taxonomy === 'post_tag'
    ).map((term: any) => ({
      id: term[0].id,
      name: term[0].name,
      slug: term[0].slug,
      link: term[0].link,
    })) || [],
    featured_media: {
      id: post.featured_media,
      url: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      alt_text: post._embedded?.['wp:featuredmedia']?.[0]?.alt_text,
      caption: post._embedded?.['wp:featuredmedia']?.[0]?.caption?.rendered,
    },
    comment_count: 0, // Would need separate fetch
    view_count: 0, // Custom field
    like_count: 0, // Custom field
  };
}

/**
 * Convert WordPress posts to BlogCard props
 */
export function adaptWordPressPostsToCards(posts: WordPressPost[]): BlogCardProps[] {
  return posts.map(adaptWordPressPost).map((post) => ({
    post,
    showAuthor: true,
    showDate: true,
    showCategories: true,
    showReadingTime: true,
    showExcerpt: true,
  }));
}

/**
 * Get featured image URL from WordPress post
 */
export function getFeaturedImageUrl(post: WordPressPost, size: 'full' | 'medium' | 'thumbnail' = 'medium'): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;

  return media.media_details?.sizes?.[size]?.source_url || media.source_url || null;
}

/**
 * Get author from WordPress post
 */
export function getAuthor(post: WordPressPost) {
  return post._embedded?.author?.[0];
}

/**
 * Get categories from WordPress post
 */
export function getCategories(post: WordPressPost) {
  const terms = post._embedded?.['wp:term'] || [];
  return terms
    .flat()
    .filter((term: any) => term?.taxonomy === 'category')
    .map((term: any) => ({
      id: term.id,
      name: term.name,
      slug: term.slug,
      link: term.link,
    }));
}

/**
 * Get tags from WordPress post
 */
export function getTags(post: WordPressPost) {
  const terms = post._embedded?.['wp:term'] || [];
  return terms
    .flat()
    .filter((term: any) => term?.taxonomy === 'post_tag')
    .map((term: any) => ({
      id: term.id,
      name: term.name,
      slug: term.slug,
      link: term.link,
    }));
}

/**
 * Calculate reading time for post content
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Count words
  const words = text.trim().split(/\s+/).length;
  // Calculate reading time
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Extract plain text excerpt from HTML content
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  // Truncate
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
