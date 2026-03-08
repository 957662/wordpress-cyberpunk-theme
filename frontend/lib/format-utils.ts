/**
 * Format Utilities
 * 格式化工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(
  date: string | Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'zh-CN'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'long', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    },
  }[format] as Intl.DateTimeFormatOptions;

  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * 格式化相对时间（如：3小时前）
 */
export function formatRelativeTime(date: string | Date, locale: string = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (locale.startsWith('zh')) {
    if (diffSec < 60) return '刚刚';
    if (diffMin < 60) return `${diffMin}分钟前`;
    if (diffHour < 24) return `${diffHour}小时前`;
    if (diffDay < 30) return `${diffDay}天前`;
    if (diffMonth < 12) return `${diffMonth}个月前`;
    return `${diffYear}年前`;
  } else {
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    if (diffMonth < 12) return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
    return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
  }
}

/**
 * 格式化数字（添加千位分隔符）
 */
export function formatNumber(num: number, locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number, locale: string = 'zh-CN'): string {
  const units = locale.startsWith('zh')
    ? ['B', 'KB', 'MB', 'GB', 'TB']
    : ['B', 'KB', 'MB', 'GB', 'TB'];

  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * 格式化货币
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY',
  locale: string = 'zh-CN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(minutes: number, locale: string = 'zh-CN'): string {
  if (locale.startsWith('zh')) {
    if (minutes < 1) return '不到1分钟';
    if (minutes < 60) return `${Math.round(minutes)}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  } else {
    if (minutes < 1) return 'less than 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min read`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 高亮关键词
 */
export function highlightKeywords(text: string, keywords: string[], className: string = 'highlight'): string {
  let result = text;

  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    result = result.replace(regex, `<span class="${className}">$1</span>`);
  });

  return result;
}

/**
 * 格式化 SEO 标题
 */
export function formatSEOTitle(title: string, siteName: string = 'CyberPress'): string {
  return title.length > 60 ? `${title.slice(0, 57)}... - ${siteName}` : `${title} - ${siteName}`;
}

/**
 * 格式化 SEO 描述
 */
export function formatSEODescription(description: string, maxLength: number = 160): string {
  return truncateText(description, maxLength);
}

/**
 * 格式化 slug（URL 友好的字符串）
 */
export function formatSlug(text: string, locale: string = 'zh-CN'): string {
  let slug = text.toLowerCase().trim();

  // Remove special characters
  slug = slug.replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '');

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-');

  // Remove consecutive hyphens
  slug = slug.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '');

  return slug || 'untitled';
}

/**
 * 格式化作者信息
 */
export function formatAuthorName(author: { name?: string; username?: string } | string): string {
  if (typeof author === 'string') return author;
  return author.name || author.username || 'Anonymous';
}

/**
 * 格式化标签列表
 */
export function formatTags(tags: string[], maxDisplay: number = 5): string[] {
  return tags.slice(0, maxDisplay);
}

/**
 * 格式化分类路径
 */
export function formatCategoryPath(categories: string[]): string {
  return categories.join(' / ');
}

export default {
  formatDate,
  formatRelativeTime,
  formatNumber,
  formatFileSize,
  formatCurrency,
  formatPercentage,
  formatReadingTime,
  truncateText,
  highlightKeywords,
  formatSEOTitle,
  formatSEODescription,
  formatSlug,
  formatAuthorName,
  formatTags,
  formatCategoryPath,
};
