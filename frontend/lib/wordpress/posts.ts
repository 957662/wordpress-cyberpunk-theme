/**
 * WordPress 文章相关的工具函数
 */

import { WPPost } from './client';

/**
 * 从文章内容中提取纯文本
 */
export function extractPlainText(post: WPPost): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = post.content.rendered;
  return tempDiv.textContent || tempDiv.innerText || '';
}

/**
 * 计算文章的阅读时间（分钟）
 */
export function calculateReadTime(post: WPPost): number {
  const plainText = extractPlainText(post);
  const wordsPerMinute = 200; // 中文阅读速度
  const wordCount = plainText.length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * 从文章中提取摘要
 */
export function extractExcerpt(post: WPPost, maxLength = 150): string {
  const plainText = extractPlainText(post);

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.slice(0, maxLength).trim() + '...';
}

/**
 * 获取文章的特色图片 URL
 */
export function getFeaturedImage(post: WPPost): string | null {
  return post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
}

/**
 * 获取文章的作者名称
 */
export function getAuthorName(post: WPPost): string {
  return post._embedded?.author?.[0]?.name || 'Unknown';
}

/**
 * 获取文章的分类
 */
export function getCategories(post: WPPost): Array<{ id: number; name: string; slug: string }> {
  const terms = post._embedded?.['wp:term'];
  if (!terms || !terms[0]) return [];
  return terms[0];
}

/**
 * 获取文章的标签
 */
export function getTags(post: WPPost): Array<{ id: number; name: string; slug: string }> {
  const terms = post._embedded?.['wp:term'];
  if (!terms || !terms[1]) return [];
  return terms[1];
}

/**
 * 格式化文章日期
 */
export function formatDate(dateString: string, format: 'short' | 'long' = 'long'): string {
  const date = new Date(dateString);

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

/**
 * 生成文章的 SEO 元数据
 */
export function generatePostMeta(post: WPPost) {
  const title = post.title.rendered.replace(/<[^>]*>/g, '');
  const description = extractExcerpt(post, 160);
  const image = getFeaturedImage(post);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : [],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
    },
  };
}
