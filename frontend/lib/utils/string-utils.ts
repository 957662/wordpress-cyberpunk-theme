/**
 * String Utilities
 * Common string manipulation functions
 */

/**
 * Truncate text to a specified length
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix = '...'
): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert to title case
 */
export const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Convert to slug format
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
 * Generate a random string
 */
export const randomString = (length = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a unique ID
 */
export const generateId = (prefix = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Remove all HTML tags from a string
 */
export const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

/**
 * Count words in a string
 */
export const countWords = (str: string): number => {
  return str.trim().split(/\s+/).filter((word) => word.length > 0).length;
};

/**
 * Count characters in a string
 */
export const countCharacters = (str: string, includeSpaces = true): number => {
  return includeSpaces ? str.length : str.replace(/\s/g, '').length;
};

/**
 * Extract initials from a name
 */
export const getInitials = (name: string, maxLength = 2): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, maxLength);
};

/**
 * Highlight text with search term
 */
export const highlightText = (
  text: string,
  searchTerm: string,
  highlightClass = 'highlight'
): string => {
  if (!searchTerm) return text;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
};

/**
 * Escape special regex characters
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Check if string is a valid JSON
 */
export const isValidJson = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Pretty print JSON
 */
export const prettyJson = (obj: any, indent = 2): string => {
  return JSON.stringify(obj, null, indent);
};

/**
 * Convert bytes to human readable format
 */
export const bytesToSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format currency
 */
export const formatCurrency = (
  amount: number,
  currency = 'CNY',
  locale = 'zh-CN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Abbreviate large numbers
 */
export const abbreviateNumber = (num: number): string => {
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
};

/**
 * Mask email address
 */
export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (username.length <= 2) {
    return email;
  }
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

/**
 * Mask phone number
 */
export const maskPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) {
    return phone;
  }
  const visibleStart = digits.substring(0, 3);
  const visibleEnd = digits.substring(digits.length - 4);
  const maskedLength = digits.length - 7;
  return `${visibleStart}${'*'.repeat(maskedLength)}${visibleEnd}`;
};

/**
 * Reverse a string
 */
export const reverseString = (str: string): string => {
  return str.split('').reverse().join('');
};

/**
 * Check if string is palindrome
 */
export const isPalindrome = (str: string): boolean => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverseString(cleaned);
};

/**
 * Pad string with characters
 */
export const padString = (
  str: string,
  length: number,
  char = '0',
  padStart = true
): string => {
  const padding = char.repeat(Math.max(0, length - str.length));
  return padStart ? padding + str : str + padding;
};

/**
 * Remove duplicates from array of strings
 */
export const uniqueStrings = (strings: string[]): string[] => {
  return Array.from(new Set(strings));
};

/**
 * Sort strings alphabetically
 */
export const sortStrings = (strings: string[], ascending = true): string[] => {
  return [...strings].sort((a, b) => {
    const comparison = a.localeCompare(b);
    return ascending ? comparison : -comparison;
  });
};

/**
 * Filter strings by pattern
 */
export const filterByPattern = (strings: string[], pattern: RegExp): string[] => {
  return strings.filter((str) => pattern.test(str));
};
