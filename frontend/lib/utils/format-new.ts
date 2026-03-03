/**
 * Format Utilities
 * 格式化工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return '';

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化相对时间（如：2小时前）
 */
export function formatRelativeTime(date: string | Date, locale: string = 'en-US'): string {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffSecs < 60) {
    return rtf.format(-diffSecs, 'second');
  } else if (diffMins < 60) {
    return rtf.format(-diffMins, 'minute');
  } else if (diffHours < 24) {
    return rtf.format(-diffHours, 'hour');
  } else {
    return rtf.format(-diffDays, 'day');
  }
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(content: string, wordsPerMinute: number = 200): string {
  if (!content) return '0 min read';

  // 移除HTML标签
  const textContent = content.replace(/<[^>]*>/g, '');

  // 计算字数
  const words = textContent.trim().split(/\s+/).length;

  // 计算阅读时间
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} min read`;
}

/**
 * 格式化数字（如：1.2K, 1.5M）
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();

  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const suffixNum = Math.floor(('' + Math.floor(num)).length / 3);

  let shortValue: number;
  if (suffixNum === 0) {
    shortValue = num;
  } else {
    shortValue = parseFloat((suffixNum !== 0 ? num / Math.pow(1000, suffixNum) : num).toPrecision(3));
  }

  if (shortValue % 1 !== 0) {
    return shortValue.toFixed(1) + suffixes[suffixNum];
  }

  return shortValue + suffixes[suffixNum];
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text;

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 高亮搜索关键词
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!text || !searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-cyber-cyan/30 text-cyber-cyan">$1</mark>');
}

/**
 * 格式化作者信息
 */
export function formatAuthorName(author: any): string {
  if (!author) return 'Unknown Author';

  if (typeof author === 'string') return author;

  return author.name || author.username || 'Unknown Author';
}

/**
 * 格式化摘要
 */
export function formatExcerpt(excerpt: string, maxLength: number = 150): string {
  if (!excerpt) return '';

  // 移除HTML标签
  const textContent = excerpt.replace(/<[^>]*>/g, '');

  // 截断文本
  return truncateText(textContent, maxLength);
}

// 导出所有格式化函数
export default {
  formatDate,
  formatRelativeTime,
  formatReadingTime,
  formatNumber,
  truncateText,
  highlightSearchTerm,
  formatAuthorName,
  formatExcerpt,
};
