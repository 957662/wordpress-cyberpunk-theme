/**
 * Data Adapter Utility
 * 数据适配器 - 将 WordPress API 数据转换为标准格式
 */

import type { BlogPost } from '@/types/models/blog';

/**
 * WordPress API 响应格式
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
        width: number;
        height: number;
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
      avatar_urls?: {
        '24': string;
        '48': string;
        '96': string;
      };
    }>;
  };
}

/**
 * 将 WordPress 帖子转换为标准 BlogPost 格式
 */
export function adaptWordPressPost(wpPost: WordPressPost): BlogPost {
  const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
  const terms = wpPost._embedded?.['wp:term'] || [];
  const authorData = wpPost._embedded?.author?.[0];

  // 提取分类（通常是 taxonomy 为 'category' 的项）
  const categories = terms.find(
    (termArray) => termArray.length > 0 && termArray[0].taxonomy === 'category'
  ) || [];

  // 提取标签（通常是 taxonomy 为 'post_tag' 的项）
  const tags = terms.find(
    (termArray) => termArray.length > 0 && termArray[0].taxonomy === 'post_tag'
  ) || [];

  const category = categories[0];
  const postTags = tags.slice(0, 5);

  return {
    id: String(wpPost.id),
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    excerpt: wpPost.excerpt.rendered
      ? wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim()
      : undefined,
    content: wpPost.content.rendered,
    featuredImage: featuredMedia?.source_url || undefined,
    author: authorData
      ? {
          id: String(authorData.id),
          name: authorData.name,
          avatar: authorData.avatar_urls?.['96'],
        }
      : undefined,
    category: category
      ? {
          id: String(category.id),
          name: category.name,
          slug: category.slug,
        }
      : undefined,
    tags: postTags.map((tag) => ({
      id: String(tag.id),
      name: tag.name,
      slug: tag.slug,
    })),
    publishedAt: wpPost.date,
    readingTime: calculateReadingTime(wpPost.content.rendered),
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    status: wpPost.status === 'publish' ? 'published' : 'draft',
    createdAt: wpPost.date,
    updatedAt: wpPost.modified,
  };
}

/**
 * 适配帖子数据（自动检测格式）
 */
export function adaptPost(post: any): BlogPost {
  // 检查是否是 WordPress 格式
  if (isWordPressPost(post)) {
    return adaptWordPressPost(post);
  }

  // 检查是否已经是标准格式
  if (isStandardPost(post)) {
    return post as BlogPost;
  }

  // 尝试从对象中提取数据
  return {
    id: String(post.id || post._id),
    title: post.title || post.title?.rendered || 'Untitled',
    slug: post.slug || '',
    excerpt: post.excerpt || post.summary,
    content: post.content || post.body || post.description || '',
    featuredImage: post.featuredImage || post.coverImage || post.image,
    author: post.author
      ? {
          id: String(post.author.id || post.author._id),
          name: post.author.name || post.author.username || 'Unknown',
          avatar: post.author.avatar || post.author.profileImage,
        }
      : undefined,
    category: post.category
      ? {
          id: String(post.category.id || post.category._id),
          name: post.category.name,
          slug: post.category.slug,
        }
      : undefined,
    tags: Array.isArray(post.tags)
      ? post.tags.map((tag: any) => ({
          id: String(tag.id || tag._id),
          name: tag.name,
          slug: tag.slug || tag.name?.toLowerCase().replace(/\s+/g, '-'),
        }))
      : [],
    publishedAt: post.publishedAt || post.date || post.created_at,
    readingTime: post.readingTime || calculateReadingTime(post.content || ''),
    viewCount: post.viewCount || post.views || 0,
    likeCount: post.likeCount || post.likes || 0,
    commentCount: post.commentCount || post.comments || 0,
    status: post.status || 'published',
    createdAt: post.createdAt || post.created_at || post.date,
    updatedAt: post.updatedAt || post.updated_at || post.modified,
  };
}

/**
 * 批量适配帖子
 */
export function adaptPosts(posts: any[]): BlogPost[] {
  return posts.map(adaptPost);
}

/**
 * 判断是否为 WordPress 帖子格式
 */
function isWordPressPost(post: any): boolean {
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
 * 判断是否为标准帖子格式
 */
function isStandardPost(post: any): boolean {
  return (
    post &&
    typeof post === 'object' &&
    typeof post.title === 'string' &&
    typeof post.slug === 'string' &&
    typeof post.content === 'string'
  );
}

/**
 * 计算阅读时间（分钟）
 */
function calculateReadingTime(content: string): number {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, '');
  // 计算字数（中文按字符，英文按单词）
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  // 平均阅读速度：中文 400字/分钟，英文 200词/分钟
  const readingTime = Math.ceil((chineseChars / 400 + englishWords / 200) * 10) / 10;
  return Math.max(1, readingTime);
}

/**
 * 提取纯文本摘要
 */
export function extractExcerpt(htmlContent: string, maxLength: number = 150): string {
  // 移除 HTML 标签
  const text = htmlContent.replace(/<[^>]*>/g, '');
  // 截断到指定长度
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength).trim() + '...';
}
