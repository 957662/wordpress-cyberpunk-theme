/**
 * Format Utilities
 *
 * Common formatting functions for dates, numbers, strings, etc.
 */

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Format date to localized string
 *
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString('zh-CN', options);
}

/**
 * Format date to ISO string
 *
 * @param date - Date to format
 * @returns ISO date string
 */
export function toISODate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toISOString();
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 *
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 30) return `${diffDays}天前`;
  if (diffMonths < 12) return `${diffMonths}个月前`;
  return `${diffYears}年前`;
}

/**
 * Format date to short string (e.g., "2024-01-15")
 *
 * @param date - Date to format
 * @returns Short date string
 */
export function formatShortDate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * Format date to time string (e.g., "14:30")
 *
 * @param date - Date to format
 * @returns Time string
 */
export function formatTime(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * Format date to date and time string
 *
 * @param date - Date to format
 * @returns Date and time string
 */
export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return `${formatShortDate(d)} ${formatTime(d)}`;
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Format number with thousands separator
 *
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

/**
 * Format number as percentage
 *
 * @param num - Number to format (0-1)
 * @param decimals - Number of decimal places
 * @returns Percentage string
 */
export function formatPercentage(num: number, decimals: number = 2): string {
  return `${(num * 100).toFixed(decimals)}%`;
}

/**
 * Format number as currency
 *
 * @param num - Number to format
 * @param currency - Currency code (default: CNY)
 * @returns Currency string
 */
export function formatCurrency(num: number, currency: string = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(num);
}

/**
 * Format number with decimal places
 *
 * @param num - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export function formatDecimals(num: number, decimals: number = 2): string {
  return num.toFixed(decimals);
}

/**
 * Format file size
 *
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

/**
 * Format number as ordinal (1st, 2nd, 3rd, etc.)
 *
 * @param num - Number to format
 * @returns Ordinal string
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  const suffix = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
  return `${num}${suffix}`;
}

/**
 * Format number with SI prefix (k, M, G, etc.)
 *
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatSI(num: number): string {
  const prefixes = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  let absNum = Math.abs(num);
  let prefixIndex = 0;

  while (absNum >= 1000 && prefixIndex < prefixes.length - 1) {
    absNum /= 1000;
    prefixIndex++;
  }

  const formatted = (num < 0 ? -absNum : absNum).toFixed(
    prefixIndex === 0 ? 0 : 2
  );

  return `${formatted}${prefixes[prefixIndex]}`;
}

// ============================================================================
// String Formatting
// ============================================================================

/**
 * Capitalize first letter of string
 *
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize first letter of each word
 *
 * @param str - String to capitalize
 * @returns Title case string
 */
export function titleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert string to kebab-case
 *
 * @param str - String to convert
 * @returns kebab-case string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to snake_case
 *
 * @param str - String to convert
 * @returns snake_case string
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Convert string to camelCase
 *
 * @param str - String to convert
 * @returns camelCase string
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Convert string to PascalCase
 *
 * @param str - String to convert
 * @returns PascalCase string
 */
export function toPascalCase(str: string): string {
  return capitalize(toCamelCase(str));
}

/**
 * Truncate string to max length
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated string
 */
export function truncate(
  str: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Mask string (e.g., for phone numbers, credit cards)
 *
 * @param str - String to mask
 * @param visibleChars - Number of visible characters at start and end
 * @param maskChar - Mask character (default: '*')
 * @returns Masked string
 */
export function maskString(
  str: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string {
  if (str.length <= visibleChars * 2) return str;

  const start = str.slice(0, visibleChars);
  const end = str.slice(-visibleChars);
  const masked = maskChar.repeat(str.length - visibleChars * 2);

  return start + masked + end;
}

/**
 * Initials from name
 *
 * @param name - Full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// ============================================================================
// Phone Formatting
// ============================================================================

/**
 * Format Chinese phone number
 *
 * @param phone - Phone number
 * @returns Formatted phone number
 */
export function formatChinesePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 11) return phone;

  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
}

/**
 * Format international phone number
 *
 * @param phone - Phone number
 * @param countryCode - Country code
 * @returns Formatted phone number
 */
export function formatInternationalPhone(
  phone: string,
  countryCode: string = '+86'
): string {
  const cleaned = phone.replace(/\D/g, '');
  return `${countryCode} ${cleaned}`;
}

// ============================================================================
// URL Formatting
// ============================================================================

/**
 * Format URL with protocol
 *
 * @param url - URL to format
 * @param protocol - Protocol to add (default: 'https://')
 * @returns Formatted URL
 */
export function formatUrl(url: string, protocol: string = 'https://'): string {
  if (!url) return '';
  if (url.match(/^https?:\/\//)) return url;
  return `${protocol}${url}`;
}

/**
 * Get domain from URL
 *
 * @param url - URL
 * @returns Domain
 */
export function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

// ============================================================================
// Color Formatting
// ============================================================================

/**
 * Convert hex to RGB
 *
 * @param hex - Hex color code
 * @returns RGB object
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Convert RGB to hex
 *
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color code
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// ============================================================================
// Duration Formatting
// ============================================================================

/**
 * Format duration in seconds to readable string
 *
 * @param seconds - Duration in seconds
 * @returns Formatted duration string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * Format duration in milliseconds to readable string
 *
 * @param ms - Duration in milliseconds
 * @returns Formatted duration string
 */
export function formatDurationMs(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return formatDuration(ms / 1000);
}

// ============================================================================
// Address Formatting
// ============================================================================

/**
 * Format Chinese address
 *
 * @param address - Address object
 * @returns Formatted address string
 */
export function formatChineseAddress(address: {
  province?: string;
  city?: string;
  district?: string;
  detail?: string;
}): string {
  const parts = [
    address.province,
    address.city,
    address.district,
    address.detail,
  ].filter(Boolean);

  return parts.join('');
}

// ============================================================================
// Export all formatters
// ============================================================================

export const formatters = {
  date: formatDate,
  relativeTime: formatRelativeTime,
  shortDate: formatShortDate,
  time: formatTime,
  dateTime: formatDateTime,
  number: formatNumber,
  percentage: formatPercentage,
  currency: formatCurrency,
  decimals: formatDecimals,
  fileSize: formatFileSize,
  ordinal: formatOrdinal,
  si: formatSI,
  capitalize,
  titleCase,
  kebabCase: toKebabCase,
  snakeCase: toSnakeCase,
  camelCase: toCamelCase,
  pascalCase: toPascalCase,
  truncate,
  maskString,
  initials: getInitials,
  chinesePhone: formatChinesePhone,
  internationalPhone: formatInternationalPhone,
  url: formatUrl,
  domain: getDomain,
  hexToRgb,
  rgbToHex,
  duration: formatDuration,
  durationMs: formatDurationMs,
  chineseAddress: formatChineseAddress,
};

export default {
  formatDate,
  toISODate,
  formatRelativeTime,
  formatShortDate,
  formatTime,
  formatDateTime,
  formatNumber,
  formatPercentage,
  formatCurrency,
  formatDecimals,
  formatFileSize,
  formatOrdinal,
  formatSI,
  capitalize,
  titleCase,
  toKebabCase,
  toSnakeCase,
  toCamelCase,
  toPascalCase,
  truncate,
  maskString,
  getInitials,
  formatChinesePhone,
  formatInternationalPhone,
  formatUrl,
  getDomain,
  hexToRgb,
  rgbToHex,
  formatDuration,
  formatDurationMs,
  formatChineseAddress,
  formatters,
};
