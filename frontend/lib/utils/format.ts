/**
 * Format Utility Functions
 * 格式化工具函数
 */

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, locale: string = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '';
  }

  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  // 今天
  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes <= 1 ? '刚刚' : `${minutes}分钟前`;
    }
    return `${hours}小时前`;
  }

  // 昨天
  if (days === 1) {
    return '昨天';
  }

  // 本周
  if (days < 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[d.getDay()];
  }

  // 本年
  if (d.getFullYear() === now.getFullYear()) {
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }

  // 其他
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/**
 * 格式化完整日期
 */
export function formatFullDate(date: string | Date, locale: string = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 30) {
    return `${days}天前`;
  } else if (months < 12) {
    return `${months}个月前`;
  } else {
    return `${years}年前`;
  }
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(num: number, locale: string = 'zh-CN'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return '少于1分钟';
  } else if (minutes < 60) {
    return `${Math.floor(minutes)}分钟`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  }
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 移除 HTML 标签
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * 转义 HTML
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * 生成 slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 高亮搜索关键词
 */
export function highlightSearchTerm(text: string, searchTerm: string): string {
  if (!searchTerm) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
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
