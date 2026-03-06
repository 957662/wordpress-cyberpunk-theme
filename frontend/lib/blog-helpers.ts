/**
 * 博客辅助工具函数
 * 提供各种博客相关的实用功能
 */

import { cn, formatDistanceToNow } from '@/lib/utils';

/**
 * 计算文章阅读时间
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]+>/g, '');

  // 统计中文字符和英文单词
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0;

  // 计算总时间（中文按字符，英文按单词）
  const totalMinutes = (chineseChars / 500 + englishWords / wordsPerMinute);

  return Math.ceil(totalMinutes);
}

/**
 * 提取文章摘要
 */
export function extractExcerpt(content: string, maxLength: number = 200): string {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]+>/g, '');

  // 截断文本
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength).trim() + '...';
}

/**
 * 提取文章中的第一张图片
 */
export function extractFirstImage(content: string): string | null {
  const imgRegex = /<img[^>]+src="([^">]+)"/i;
  const match = content.match(imgRegex);
  return match ? match[1] : null;
}

/**
 * 提取文章中的所有图片
 */
export function extractAllImages(content: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/gi;
  const matches = [...content.matchAll(imgRegex)];
  return matches.map(match => match[1]);
}

/**
 * 格式化日期为相对时间
 */
export function formatDateRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date));
}

/**
 * 格式化日期为完整格式
 */
export function formatDateFull(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化日期为短格式
 */
export function formatDateShort(date: string | Date): string {
  return new Date(date).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 生成文章 URL
 */
export function generatePostUrl(slug: string): string {
  return `/blog/${slug}`;
}

/**
 * 生成分类 URL
 */
export function generateCategoryUrl(slug: string): string {
  return `/blog/category/${slug}`;
}

/**
 * 生成标签 URL
 */
export function generateTagUrl(slug: string): string {
  return `/blog/tag/${slug}`;
}

/**
 * 生成作者 URL
 */
export function generateAuthorUrl(authorId: number): string {
  return `/blog/author/${authorId}`;
}

/**
 * 格式化数字（用于显示浏览量、点赞数等）
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

/**
 * 生成 SEO 友好的文章标题
 */
export function generateSEOTitle(title: string, siteName: string): string {
  return `${title} | ${siteName}`;
}

/**
 * 生成 SEO 描述
 */
export function generateSEODescription(content: string, maxLength: number = 160): string {
  const excerpt = extractExcerpt(content, maxLength);
  return excerpt.replace(/\.\.\.$/, '');
}

/**
 * 生成文章结构化数据（JSON-LD）
 */
export function generateArticleStructuredData(post: {
  title: string;
  excerpt: string;
  date: string;
  author: {
    name: string;
  };
  image?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    image: post.image,
    url: post.url,
  };
}

/**
 * 验证文章内容
 */
export function validatePostContent(content: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push('文章内容不能为空');
  }

  if (content.length < 50) {
    errors.push('文章内容太短，至少需要 50 个字符');
  }

  // 检查是否包含图片
  if (!content.includes('<img')) {
    errors.push('建议添加至少一张图片');
  }

  // 检查是否包含标题
  if (!content.includes('<h2>') && !content.includes('<h3>')) {
    errors.push('建议添加小标题以提高可读性');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * 清理文章内容（移除不安全的 HTML）
 */
export function sanitizeHTML(html: string): string {
  // 基本的 HTML 清理，生产环境建议使用 DOMPurify
  const dangerousTags = ['<script', '<iframe', '<object', '<embed'];
  let cleaned = html;

  dangerousTags.forEach(tag => {
    const regex = new RegExp(tag, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  return cleaned;
}

/**
 * 生成文章摘要（智能截取）
 */
export function generateSmartExcerpt(content: string, maxLength: number = 200): string {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]+>/g, '').trim();

  // 如果文本够短，直接返回
  if (text.length <= maxLength) {
    return text;
  }

  // 尝试在句子边界截取
  const sentenceEndings = ['.', '。', '!', '！', '?', '？'];
  let cutIndex = maxLength;

  for (let i = maxLength - 1; i >= maxLength - 50; i--) {
    if (sentenceEndings.includes(text[i])) {
      cutIndex = i + 1;
      break;
    }
  }

  return text.slice(0, cutIndex).trim() + '...';
}

/**
 * 计算文章字数统计
 */
export function getWordCount(content: string): {
  totalWords: number;
  chineseChars: number;
  englishWords: number;
  readingTime: number;
} {
  const text = content.replace(/<[^>]+>/g, '');
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const totalWords = chineseChars + englishWords;
  const readingTime = calculateReadingTime(content);

  return {
    totalWords,
    chineseChars,
    englishWords,
    readingTime,
  };
}

/**
 * 高亮搜索关键词
 */
export function highlightSearchTerms(text: string, searchTerms: string): string {
  if (!searchTerms.trim()) {
    return text;
  }

  const terms = searchTerms.split(/\s+/).filter(Boolean);
  let highlighted = text;

  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark class="bg-cyber-cyan/30 text-white">$1</mark>');
  });

  return highlighted;
}

/**
 * 生成分享链接
 */
export function generateShareLinks(url: string, title: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  };
}

/**
 * 验证 URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * 延迟执行（用于动画和加载效果）
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 批量处理（用于大量数据）
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }

  return results;
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
