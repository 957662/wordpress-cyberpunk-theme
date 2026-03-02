/**
 * CyberPress Platform - Text Formatters
 * 文本格式化工具
 */

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert to title case
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Convert to slug
 */
export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Remove HTML tags
 */
export const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Strip HTML and truncate
 */
export const stripHtmlAndTruncate = (html: string, maxLength: number): string => {
  const text = stripHtml(html);
  return truncateText(text, maxLength);
};

/**
 * Count words
 */
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).length;
};

/**
 * Count characters
 */
export const countCharacters = (text: string, spaces: boolean = true): number => {
  if (!spaces) {
    return text.replace(/\s/g, '').length;
  }
  return text.length;
};

/**
 * Calculate reading time
 */
export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  const words = countWords(text);
  return Math.ceil(words / wordsPerMinute);
};

/**
 * Format reading time
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return '少于1分钟';
  if (minutes < 60) return `${minutes}分钟`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
};

/**
 * Pluralize
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) return singular;
  return plural || singular + 's';
};

/**
 * Format number with K, M, B suffixes
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
  return (num / 1000000000).toFixed(1) + 'B';
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format date relative to now
 */
export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`;
  return `${Math.floor(diffInSeconds / 31536000)}年前`;
};

/**
 * Format date to locale string
 */
export const formatDate = (
  date: Date | string,
  locale: string = 'zh-CN',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  return new Date(date).toLocaleDateString(locale, options);
};

/**
 * Format date and time
 */
export const formatDateTime = (
  date: Date | string,
  locale: string = 'zh-CN'
): string => {
  return new Date(date).toLocaleString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format time
 */
export const formatTime = (date: Date | string, locale: string = 'zh-CN'): string => {
  return new Date(date).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Highlight search terms
 */
export const highlightTerms = (text: string, searchTerms: string[]): string => {
  let highlighted = text;
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });
  return highlighted;
};

/**
 * Extract excerpt
 */
export const extractExcerpt = (content: string, maxLength: number = 200): string => {
  const text = stripHtml(content);
  return truncateText(text, maxLength);
};

/**
 * Normalize whitespace
 */
export const normalizeWhitespace = (text: string): string => {
  return text.replace(/\s+/g, ' ').trim();
};

/**
 * Escape HTML
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

/**
 * Unescape HTML
 */
export const unescapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };
  return text.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, m => map[m]);
};

/**
 * Convert markdown to plain text
 */
export const markdownToPlainText = (markdown: string): string => {
  return markdown
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*/g, '') // Remove bold
    .replace(/\*/g, '') // Remove italic
    .replace(/`/g, '') // Remove code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images but keep alt
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
};

/**
 * Generate excerpt from markdown
 */
export const extractMarkdownExcerpt = (markdown: string, maxLength: number = 200): string => {
  const text = markdownToPlainText(markdown);
  return truncateText(text, maxLength);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Mask email for privacy
 */
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

/**
 * Mask phone number
 */
export const maskPhone = (phone: string): string => {
  if (phone.length < 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
};

/**
 * Generate initials from name
 */
export const generateInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

/**
 * Convert newlines to <br>
 */
export const nl2br = (text: string): string => {
  return text.replace(/\n/g, '<br>');
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9\-._]/gi, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Get file extension
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Check if file is image
 */
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'];
  const ext = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(ext);
};

export default {
  truncateText,
  capitalize,
  toTitleCase,
  toSlug,
  stripHtml,
  stripHtmlAndTruncate,
  countWords,
  countCharacters,
  calculateReadingTime,
  formatReadingTime,
  pluralize,
  formatNumber,
  formatFileSize,
  formatRelativeTime,
  formatDate,
  formatDateTime,
  formatTime,
  highlightTerms,
  extractExcerpt,
  normalizeWhitespace,
  escapeHtml,
  unescapeHtml,
  markdownToPlainText,
  extractMarkdownExcerpt,
  isValidEmail,
  isValidUrl,
  maskEmail,
  maskPhone,
  generateInitials,
  nl2br,
  sanitizeFilename,
  getFileExtension,
  isImageFile,
};
