/**
 * String Utilities
 *
 * Helper functions for string manipulation
 */

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Generate slug from string
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
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Extract plain text from HTML
 */
export function extractText(html: string, maxLength?: number): string {
  const text = stripHtml(html).trim();
  return maxLength ? truncate(text, maxLength) : text;
}

/**
 * Count words in string
 */
export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count characters in string (excluding spaces)
 */
export function countChars(str: string): number {
  return str.replace(/\s/g, '').length;
}

/**
 * Generate random string
 */
export function randomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Highlight search terms in text
 */
export function highlightTerms(text: string, terms: string[], className: string = 'bg-yellow-200'): string {
  let result = text;
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    result = result.replace(regex, `<mark class="${className}">$1</mark>`);
  });
  return result;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format file size
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
 * Check if string is email
 */
export function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
}

/**
 * Check if string is URL
 */
export function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Pad string to specified length
 */
export function padString(str: string, length: number, padChar: string = '0', padStart: boolean = true): string {
  const pad = padChar.repeat(Math.max(0, length - str.length));
  return padStart ? pad + str : str + pad;
}

/**
 * Remove duplicates from array of strings
 */
export function uniqueStrings(strings: string[]): string[] {
  return Array.from(new Set(strings));
}

/**
 * Sort strings alphabetically
 */
export function sortStrings(strings: string[], locale: string = 'zh-CN'): string[] {
  return strings.sort((a, b) => a.localeCompare(b, locale));
}

/**
 * Join strings with proper grammar
 */
export function joinStrings(strings: string[], separator: string = ', ', lastSeparator: string = ' and '): string {
  if (strings.length === 0) return '';
  if (strings.length === 1) return strings[0];
  if (strings.length === 2) return strings.join(lastSeparator);
  return strings.slice(0, -1).join(separator) + lastSeparator + strings[strings.length - 1];
}
