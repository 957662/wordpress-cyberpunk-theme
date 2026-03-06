/**
 * 数据适配器 - 将 WordPress API 数据转换为标准 Post 格式
 */

import { Post } from '@/types';

/**
 * WordPress 响应格式
 */
export interface WordPressPost {
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
  meta: any[];
  categories: number[];
  tags: number[];
  _links: any;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details?: {
        width?: number;
        height?: number;
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls?: any;
    }>;
  };
}

/**
 * 将 WordPress 响应转换为标准 Post 格式
 */
export function adaptWordPressPost(wpPost: WordPressPost): Post {
  const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
  const terms = wpPost._embedded?.['wp:term'] || [];
  const categories = terms[0] || [];
  const tags = terms[1] || [];
  const author = wpPost._embedded?.author?.[0];

  return {
    id: wpPost.id.toString(),
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    content: wpPost.content.rendered,
    excerpt: wpPost.excerpt.rendered,
    coverImage: featuredMedia?.source_url || undefined,
    author: author
      ? {
          id: author.id.toString(),
          name: author.name,
          avatar: author.avatar_urls?.['96'] || author.avatar_urls?.['48'],
        }
      : undefined,
    category: categories[0]?.name,
    categories: wpPost.categories,
    tags: tags.map((tag) => tag.name),
    createdAt: wpPost.date,
    updatedAt: wpPost.modified,
    status: wpPost.status as any,
    featured: wpPost.sticky,
    sticky: wpPost.sticky,
  };
}

/**
 * 批量转换 WordPress 响应
 */
export function adaptWordPressPosts(wpPosts: WordPressPost[]): Post[] {
  return wpPosts.map(adaptWordPressPost);
}

/**
 * 检查数据是否为 WordPress 格式
 */
export function isWordPressPost(data: any): data is WordPressPost {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'number' &&
    data.title &&
    typeof data.title.rendered === 'string' &&
    data.content &&
    typeof data.content.rendered === 'string'
  );
}

/**
 * 检查数据是否为标准 Post 格式
 */
export function isStandardPost(data: any): data is Post {
  return (
    data &&
    typeof data === 'object' &&
    (typeof data.id === 'string' || typeof data.id === 'number') &&
    typeof data.title === 'string' &&
    typeof data.content === 'string'
  );
}

/**
 * 通用适配器 - 自动检测并转换数据格式
 */
export function adaptPost(data: any): Post {
  if (isStandardPost(data)) {
    return data;
  }

  if (isWordPressPost(data)) {
    return adaptWordPressPost(data);
  }

  // 如果都不是，尝试创建最小化 Post 对象
  return {
    id: data.id?.toString() || 'unknown',
    title: data.title || 'Untitled',
    slug: data.slug || data.id?.toString() || 'unknown',
    content: data.content || data.body || '',
    excerpt: data.excerpt || data.summary || '',
    author: data.author,
    category: data.category,
    tags: data.tags || [],
    createdAt: data.createdAt || data.date || data.publishedAt || new Date().toISOString(),
    updatedAt: data.updatedAt || data.modified || new Date().toISOString(),
  };
}

/**
 * 批量适配
 */
export function adaptPosts(data: any[]): Post[] {
  return data.map(adaptPost);
}
