/**
 * WordPress 数据适配器
 * 将 WordPress API 响应转换为应用程序使用的格式
 */

import { WPArticle, WPCategory, WPTag } from './client';
import type { BlogPost } from '@/types/models';

/**
 * 将 WordPress 文章转换为 BlogPost 格式
 */
export function adaptWPPostToBlogPost(wpPost: WPArticle): BlogPost {
  // 提取特色图片 URL
  const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || undefined;
  
  // 提取作者信息
  const author = wpPost._embedded?.author?.[0]?.name || undefined;
  
  // 提取分类
  const categories = wpPost._embedded?.['wp:term']?.[0] || [];
  const category = categories.length > 0 ? categories[0].name : undefined;
  
  // 提取标签
  const tags = wpPost._embedded?.['wp:term']?.[1] || [];
  const tagList = tags.map((tag: any) => tag.name);
  
  // 计算阅读时间（基于内容长度）
  const contentLength = wpPost.content.rendered.replace(/<[^>]*>/g, '').length;
  const readingTime = Math.max(1, Math.ceil(contentLength / 200)); // 假设每分钟 200 字

  return {
    id: wpPost.id.toString(),
    title: wpPost.title.rendered.replace(/<[^>]*>/g, ''), // 移除 HTML 标签
    slug: wpPost.slug,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, ''), // 移除 HTML 标签
    content: wpPost.content.rendered,
    date: wpPost.date,
    modified: wpPost.modified,
    author,
    featuredImage,
    category,
    tags: tagList,
    readingTime,
    status: wpPost.status,
    link: wpPost.link,
  };
}

/**
 * 批量转换 WordPress 文章
 */
export function adaptWPPostsToBlogPosts(wpPosts: WPArticle[]): BlogPost[] {
  return wpPosts.map(adaptWPPostToBlogPost);
}

/**
 * 转换 WordPress 分类
 */
export function adaptWPCategory(category: WPCategory): string {
  return category.name;
}

/**
 * 批量转换 WordPress 分类
 */
export function adaptWPCategories(categories: WPCategory[]): string[] {
  return categories.map(adaptWPCategory);
}

/**
 * 转换 WordPress 标签
 */
export function adaptWPTag(tag: WPTag): string {
  return tag.name;
}

/**
 * 批量转换 WordPress 标签
 */
export function adaptWPTags(tags: WPTag[]): string[] {
  return tags.map(adaptWPTag);
}

/**
 * 提取文章摘要（限制长度）
 */
export function truncateExcerpt(text: string, maxLength = 150): string {
  const cleanText = text.replace(/<[^>]*>/g, ''); // 移除 HTML 标签
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  return cleanText.slice(0, maxLength).trim() + '...';
}

/**
 * 获取文章的第一张图片
 */
export function extractFirstImage(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : undefined;
}

/**
 * 计算文章的字数
 */
export function calculateWordCount(content: string): number {
  const cleanContent = content.replace(/<[^>]*>/g, '').trim();
  const words = cleanContent.split(/\s+/);
  return words.filter(word => word.length > 0).length;
}

/**
 * 计算阅读时间（基于字数）
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  const wordCount = calculateWordCount(content);
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
