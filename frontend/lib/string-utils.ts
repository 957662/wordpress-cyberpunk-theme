/**
 * String Utility Library
 * Comprehensive string manipulation and validation functions
 */

/**
 * Generate random string
 */
export const randomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * Generate random alphanumeric string
 */
export const randomAlphanumeric = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * Generate random numeric string
 */
export const randomNumeric = (length: number = 10): string => {
  const chars = '0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
};

/**
 * Generate UUID v4
 */
export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
};

/**
 * Generate slug from string
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Remove HTML tags from string
 */
export const stripHtml = (html: string): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  return tmp.textContent || tmp.innerText || '';
};

/**
 * Escape HTML special characters
 */
export const escapeHtml = (str: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return str.replace(/[&<>"']/g, (char) => map[char]);
};

/**
 * Unescape HTML special characters
 */
export const unescapeHtml = (str: string): string => {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  };

  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, (char) => map[char]);
};

/**
 * Count words in string
 */
export const countWords = (str: string): number => {
  const trimmed = str.trim();

  if (trimmed === '') return 0;

  return trimmed.split(/\s+/).length;
};

/**
 * Count characters in string
 */
export const countChars = (str: string, includeSpaces: boolean = true): number => {
  return includeSpaces ? str.length : str.replace(/\s/g, '').length;
};

/**
 * Reverse string
 */
export const reverse = (str: string): string => {
  return str.split('').reverse().join('');
};

/**
 * Shuffle string characters
 */
export const shuffle = (str: string): string => {
  const arr = str.split('');

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.join('');
};

/**
 * Pad string on left
 */
export const padLeft = (str: string, length: number, char: string = ' '): string => {
  const padding = Math.max(0, length - str.length);

  return char.repeat(padding).slice(0, padding) + str;
};

/**
 * Pad string on right
 */
export const padRight = (str: string, length: number, char: string = ' '): string => {
  const padding = Math.max(0, length - str.length);

  return str + char.repeat(padding).slice(0, padding);
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (str: string, maxLength: number, suffix: string = '...'): string => {
  if (str.length <= maxLength) return str;

  return str.slice(0, maxLength - suffix.length) + suffix;
};

/**
 * Truncate words
 */
export const truncateWords = (str: string, maxWords: number, suffix: string = '...'): string => {
  const words = str.split(/\s+/);

  if (words.length <= maxWords) return str;

  return words.slice(0, maxWords).join(' ') + suffix;
};

/**
 * Highlight text
 */
export const highlight = (str: string, query: string, className: string = 'highlight'): string => {
  if (!query) return str;

  const regex = new RegExp(`(${query})`, 'gi');

  return str.replace(regex, `<mark class="${className}">$1</mark>`);
};

/**
 * Extract numbers from string
 */
export const extractNumbers = (str: string): number[] => {
  const matches = str.match(/-?\d+(\.\d+)?/g);

  return matches ? matches.map(Number) : [];
};

/**
 * Extract emails from string
 */
export const extractEmails = (str: string): string[] => {
  const regex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const matches = str.match(regex);

  return matches || [];
};

/**
 * Extract URLs from string
 */
export const extractUrls = (str: string): string[] => {
  const regex = /(https?:\/\/[^\s]+)/g;
  const matches = str.match(regex);

  return matches || [];
};

/**
 * Convert string to URL-friendly format
 */
export const urlify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Check if string is palindrome
 */
export const isPalindrome = (str: string): boolean => {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  return cleaned === reverse(cleaned);
};

/**
 * Find most common word
 */
export const mostCommonWord = (str: string, minLength: number = 1): string | null => {
  const words = str.toLowerCase().split(/\s+/);
  const frequency: Record<string, number> = {};

  words.forEach((word) => {
    if (word.length >= minLength) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  let maxWord = null;
  let maxCount = 0;

  Object.entries(frequency).forEach(([word, count]) => {
    if (count > maxCount) {
      maxWord = word;
      maxCount = count;
    }
  });

  return maxWord;
};

/**
 * Remove duplicate words
 */
export const removeDuplicateWords = (str: string): string => {
  const words = str.split(/\s+/);
  const unique = [...new Set(words)];

  return unique.join(' ');
};

/**
 * Remove all whitespace
 */
export const removeWhitespace = (str: string): string => {
  return str.replace(/\s/g, '');
};

/**
 * Remove extra whitespace
 */
export const removeExtraWhitespace = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim();
};

/**
 * Swap case
 */
export const swapCase = (str: string): string => {
  return str
    .split('')
    .map((char) => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    })
    .join('');
};

/**
 * Alternating case
 */
export const alternatingCase = (str: string): string => {
  return str
    .split('')
    .map((char, index) => {
      return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
    })
    .join('');
};

/**
 * Convert to leet speak
 */
export const leetSpeak = (str: string): string => {
  const map: Record<string, string> = {
    a: '4',
    e: '3',
    i: '1',
    o: '0',
    s: '5',
    t: '7',
    l: '1',
    b: '8',
    g: '9',
    z: '2'
  };

  return str
    .toLowerCase()
    .split('')
    .map((char) => map[char] || char)
    .join('');
};

/**
 * Binary to string
 */
export const binaryToString = (binary: string): string => {
  return binary
    .split(/\s+/)
    .map((byte) => String.fromCharCode(parseInt(byte, 2)))
    .join('');
};

/**
 * String to binary
 */
export const stringToBinary = (str: string): string => {
  return str
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
};

/**
 * Base64 encode
 */
export const base64Encode = (str: string): string => {
  return typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);
};

/**
 * Base64 decode
 */
export const base64Decode = (str: string): string => {
  return typeof window === 'undefined'
    ? Buffer.from(str, 'base64').toString()
    : window.atob(str);
};

/**
 * Calculate similarity between two strings (Levenshtein distance)
 */
export const similarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const costs: number[] = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }

  return (longer.length - costs[shorter.length]) / longer.length;
};

export default {
  randomString,
  randomAlphanumeric,
  randomNumeric,
  uuid,
  slugify,
  stripHtml,
  escapeHtml,
  unescapeHtml,
  countWords,
  countChars,
  reverse,
  shuffle,
  padLeft,
  padRight,
  truncate,
  truncateWords,
  highlight,
  extractNumbers,
  extractEmails,
  extractUrls,
  urlify,
  isPalindrome,
  mostCommonWord,
  removeDuplicateWords,
  removeWhitespace,
  removeExtraWhitespace,
  swapCase,
  alternatingCase,
  leetSpeak,
  binaryToString,
  stringToBinary,
  base64Encode,
  base64Decode,
  similarity
};
