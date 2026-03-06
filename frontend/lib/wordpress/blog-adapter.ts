/**
 * WordPress 博客数据适配器
 * 将 WordPress API 数据转换为前端组件所需的格式
 */

import type { Post, Category, Tag, Author } from './types';

export interface BlogCardData {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  author: {
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
  readingTime: number;
  viewCount?: number;
  commentCount?: number;
  likeCount?: number;
}

/**
 * 将 WordPress Post 转换为 BlogCardData
 */
export function adaptPostToBlogCard(
  post: Post,
  author?: Author,
  categories?: Category[],
  tags?: Tag[],
  featuredMediaUrl?: string
): BlogCardData {
  // 计算阅读时间（基于内容长度）
  const contentText = post.content.rendered.replace(/<[^>]*>/g, '');
  const wordCount = contentText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: post.id.toString(),
    title: post.title.rendered,
    slug: post.slug,
    excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
    content: post.content.rendered,
    featuredImage: featuredMediaUrl,
    publishedAt: post.date,
    updatedAt: post.modified,
    author: {
      name: author?.name || 'Unknown Author',
      avatar: author?.avatar_urls?.['96'],
    },
    categories: (categories || []).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })),
    tags: (tags || []).map(tag => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
    })),
    readingTime,
    viewCount: 0, // WordPress REST API 不默认提供视图数
    commentCount: 0, // 需要从评论 API 获取
    likeCount: 0, // 需要从自定义字段或插件获取
  };
}

/**
 * 批量转换文章列表
 */
export function adaptPostsToBlogCards(
  posts: Post[],
  authors: Map<number, Author>,
  categories: Map<number, Category>,
  tags: Map<number, Tag>,
  featuredMediaUrls: Map<number, string>
): BlogCardData[] {
  return posts.map(post => {
    const author = authors.get(post.author);
    const postCategories = (post.categories || [])
      .map(catId => categories.get(catId))
      .filter(Boolean) as Category[];
    const postTags = (post.tags || [])
      .map(tagId => tags.get(tagId))
      .filter(Boolean) as Tag[];
    const featuredImage = featuredMediaUrls.get(post.featured_media);

    return adaptPostToBlogCard(post, author, postCategories, postTags, featuredImage);
  });
}

/**
 * 获取文章 URL
 */
export function getPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

/**
 * 获取分类 URL
 */
export function getCategoryUrl(slug: string): string {
  return `/blog/category/${slug}`;
}

/**
 * 获取标签 URL
 */
export function getTagUrl(slug: string): string {
  return `/blog/tag/${slug}`;
}

/**
 * 获取作者 URL
 */
export function getAuthorUrl(authorId: number): string {
  return `/blog/author/${authorId}`;
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string, locale: string = 'zh-CN'): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(dateString: string, locale: string = 'zh-CN'): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(dateString, locale);
  }

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (days > 0) return rtf.format(-days, 'day');
  if (hours > 0) return rtf.format(-hours, 'hour');
  if (minutes > 0) return rtf.format(-minutes, 'minute');
  return rtf.format(-seconds, 'second');
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  const plainText = text.replace(/<[^>]*>/g, '');
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
}

/**
 * 计算阅读时间
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const plainText = content.replace(/<[^>]*>/g, '');
  const wordCount = plainText.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
