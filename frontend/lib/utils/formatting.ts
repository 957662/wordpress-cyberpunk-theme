/**
 * Formatting Utility Functions
 * Helper functions for formatting data
 */

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'zh-CN'
): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  }[format];

  return dateObj.toLocaleDateString(locale, options);
}

/**
 * Format time
 */
export function formatTime(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' = 'medium',
  locale: string = 'zh-CN'
): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    short: { hour: '2-digit', minute: '2-digit' },
    medium: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    long: { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' },
  }[format];

  return dateObj.toLocaleTimeString(locale, options);
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: Date | string | number,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'zh-CN'
): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  const dateStr = formatDate(dateObj, format, locale);
  const timeStr = formatTime(dateObj, format, locale);
  return `${dateStr} ${timeStr}`;
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'zh-CN'
): string {
  const dateObj = typeof date === 'object' ? date : new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return rtf.format(-interval, unit as Intl.RelativeTimeFormatUnit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Format duration (e.g., "2h 30m")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(' ');
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
}

/**
 * Format credit card number
 */
export function formatCreditCard(number: string): string {
  const cleaned = number.replace(/\D/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalize each word
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Convert to title case
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert to camel case
 */
export function toCamelCase(text: string): string {
  return text
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Convert to kebab case
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert to snake case
 */
export function toSnakeCase(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Format initials
 */
export function getInitials(name: string, maxLength: number = 2): string {
  const parts = name.trim().split(/\s+/);
  let initials = '';

  if (parts.length >= maxLength) {
    initials = parts.slice(0, maxLength).map((part) => part[0]).join('');
  } else {
    initials = name.slice(0, maxLength).toUpperCase();
  }

  return initials.toUpperCase();
}

/**
 * Mask sensitive data (e.g., email, phone)
 */
export function maskSensitiveData(
  data: string,
  visibleChars: number = 4,
  maskChar: string = '*'
): string {
  if (data.length <= visibleChars) return data;

  const visibleStart = data.slice(0, Math.ceil(visibleChars / 2));
  const visibleEnd = data.slice(-Math.floor(visibleChars / 2));
  const maskedLength = data.length - visibleChars;

  return visibleStart + maskChar.repeat(maskedLength) + visibleEnd;
}

/**
 * Format list (e.g., "A, B, and C")
 */
export function formatList(items: string[], conjunction: string = 'and'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(` ${conjunction} `);

  return `${items.slice(0, -1).join(', ')}, ${conjunction} ${items[items.length - 1]}`;
}

/**
 * Format ordinal number (e.g., "1st", "2nd", "3rd")
 */
export function formatOrdinal(num: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}

/**
 * Format bytes per second
 */
export function formatBytesPerSecond(bytes: number): string {
  return formatFileSize(bytes) + '/s';
}

/**
 * Format number with suffix (e.g., 1K, 1M, 1B)
 */
export function formatNumberWithSuffix(num: number): string {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = (Math.log10(Math.abs(num)) / 3) | 0;

  if (tier === 0) return num.toString();

  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;

  return scaled.toFixed(1) + suffix;
}

/**
 * Color formatting
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
