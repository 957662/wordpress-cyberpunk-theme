/**
 * String Helper Functions
 * 字符串辅助函数集合
 */

/**
 * Truncate text to specified length
 * 截断文本到指定长度
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 * 首字母大写
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * 转换为标题格式
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate slug from string
 * 生成 URL 友好的 slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Remove HTML tags from string
 * 移除 HTML 标签
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Extract text from HTML
 * 从 HTML 中提取纯文本
 */
export function extractText(html: string, maxLength = 200): string {
  const text = stripHtml(html).trim();
  return truncate(text, maxLength);
}

/**
 * Pluralize word based on count
 * 根据数量复数化单词
 */
export function pluralize(word: string, count: number): string {
  return count === 1 ? word : `${word}s`;
}

/**
 * Format number with suffix (K, M, B)
 * 格式化数字带后缀
 */
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Generate random string
 * 生成随机字符串
 */
export function randomString(length = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate unique ID
 * 生成唯一 ID
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Highlight search term in text
 * 高亮搜索关键词
 */
export function highlightTerm(text: string, term: string): string {
  if (!term) return text;

  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark class="bg-cyber-cyan/30 text-cyber-cyan">$1</mark>');
}

/**
 * Count words in text
 * 统计字数
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Count characters (with and without spaces)
 * 统计字符数
 */
export function countCharacters(text: string, includeSpaces = true): number {
  return includeSpaces ? text.length : text.replace(/\s/g, '').length;
}

/**
 * Get reading time in minutes
 * 计算阅读时间（分钟）
 */
export function getReadingTime(text: string, wordsPerMinute = 200): number {
  const words = countWords(text);
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Escape HTML special characters
 * 转义 HTML 特殊字符
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Mask email address
 * 隐藏邮箱地址
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (username.length <= 2) return email;

  const visibleChars = Math.ceil(username.length / 3);
  const maskedUsername =
    username.slice(0, visibleChars) + '*'.repeat(username.length - visibleChars * 2) + username.slice(-visibleChars);

  return `${maskedUsername}@${domain}`;
}

/**
 * Mask credit card number
 * 隐藏信用卡号
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cardNumber;

  return '*'.repeat(cleaned.length - 4) + cleaned.slice(-4);
}

/**
 * Validate email format
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate URL format
 * 验证 URL 格式
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
 * Format file size
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
 * Initials from name
 * 从姓名提取首字母
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Normalize whitespace
 * 标准化空白字符
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Reverse string
 * 反转字符串
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Check if string is palindrome
 * 检查是否为回文
 */
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverse(cleaned);
}

/**
 * Abbreviate string
 * 缩写字符串
 */
export function abbreviate(str: string, length = 3): string {
  if (str.length <= length) return str.toUpperCase();

  const words = str.split(' ');
  if (words.length > 1) {
    return words.map(word => word.charAt(0).toUpperCase()).join('');
  }

  return str.slice(0, length).toUpperCase();
}

/**
 * Convert to base64
 * 转换为 Base64
 */
export function toBase64(str: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  return Buffer.from(str).toString('base64');
}

/**
 * Convert from base64
 * 从 Base64 转换
 */
export function fromBase64(base64: string): string {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(escape(window.atob(base64)));
  }
  return Buffer.from(base64, 'base64').toString();
}
