import { Post, Category, Tag, Author } from '@/types';
import { WPPost, WPTerm, WPAuthor } from './api';

/**
 * 将 WordPress API 返回的文章转换为应用使用的 Post 格式
 */
export function transformPost(wpPost: WPPost): Post {
  const author = wpPost._embedded?.author?.[0];
  const terms = wpPost._embedded?.['wp:term'] || [];
  const categories = terms[0] || [];
  const tags = terms[1] || [];
  const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];

  return {
    id: wpPost.id,
    title: wpPost.title.rendered,
    content: wpPost.content.rendered,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150),
    date: wpPost.date,
    modified: wpPost.modified,
    slug: wpPost.slug,
    author: {
      id: wpPost.author,
      name: author?.name || 'Unknown',
      avatar: author?.avatar_urls?.['96'],
    },
    categories: categories.map(transformCategory),
    tags: tags.map(transformTag),
    featuredImage: featuredMedia?.source_url,
    link: wpPost.link,
  };
}

/**
 * 将 WordPress 分类转换为应用格式
 */
export function transformCategory(wpCategory: WPTerm): Category {
  return {
    id: wpCategory.id,
    name: wpCategory.name,
    slug: wpCategory.slug,
    description: wpCategory.description,
    count: wpCategory.count,
    link: wpCategory.link,
  };
}

/**
 * 将 WordPress 标签转换为应用格式
 */
export function transformTag(wpTag: WPTerm): Tag {
  return {
    id: wpTag.id,
    name: wpTag.name,
    slug: wpTag.slug,
    description: wpTag.description,
    count: wpTag.count,
    link: wpTag.link,
  };
}

/**
 * 将 WordPress 作者转换为应用格式
 */
export function transformAuthor(wpAuthor: WPAuthor): Author {
  return {
    id: wpAuthor.id,
    name: wpAuthor.name,
    slug: wpAuthor.name.toLowerCase().replace(/\s+/g, '-'),
    description: wpAuthor.description,
    avatar: wpAuthor.avatar_urls?.['96'],
    url: wpAuthor.url,
  };
}

/**
 * 批量转换文章列表
 */
export function transformPosts(wpPosts: WPPost[]): Post[] {
  return wpPosts.map(transformPost);
}

/**
 * 批量转换分类列表
 */
export function transformCategories(wpCategories: WPTerm[]): Category[] {
  return wpCategories.map(transformCategory);
}

/**
 * 批量转换标签列表
 */
export function transformTags(wpTags: WPTerm[]): Tag[] {
  return wpTags.map(transformTag);
}

/**
 * 提取文章的纯文本内容
 */
export function extractPlainText(content: string): string {
  return content.replace(/<[^>]*>/g, '').trim();
}

/**
 * 提取文章摘要（如果没有提供 excerpt）
 */
export function extractExcerpt(content: string, maxLength = 150): string {
  const text = extractPlainText(content);
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

/**
 * 从内容中提取第一张图片
 */
export function extractFirstImage(content: string): string | null {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : null;
}

/**
 * 获取文章的阅读时间（分钟）
 */
export function getReadingTime(content: string): number {
  const text = extractPlainText(content);
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string, format: 'full' | 'short' | 'relative' = 'full'): string {
  const date = new Date(dateString);

  if (format === 'relative') {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 30) return `${diffDays} 天前`;

    return date.toLocaleDateString('zh-CN');
  }

  if (format === 'short') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
