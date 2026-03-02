/**
 * String Utilities
 * 字符串处理工具集
 */

// ============================================
// 基础操作
// ============================================

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * 每个单词首字母大写（标题格式）
 */
export function titleize(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 驼峰命名转换
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * 帕斯卡命名转换（大驼峰）
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[a-z]/, (char) => char.toUpperCase());
}

/**
 * 蛇形命名转换
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[-\s]+/g, '_')
    .replace(/^_/, '')
    .toLowerCase();
}

/**
 * 短横线命名转换
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/[\s_]+/g, '-')
    .replace(/^-/, '')
    .toLowerCase();
}

/**
 * 常量命名转换（全大写 + 下划线）
 */
export function constantCase(str: string): string {
  return snakeCase(str).toUpperCase();
}

// ============================================
// 字符串转换
// ============================================

/**
 * 转换为句子格式（首字母大写，其他小写）
 */
export function sentenceCase(str: string): string {
  return capitalize(str);
}

/**
 * 转换为小写
 */
export function toLowerCase(str: string): string {
  return str.toLowerCase();
}

/**
 * 转换为大写
 */
export function toUpperCase(str: string): string {
  return str.toUpperCase();
}

/**
 * 大小写切换
 */
export function swapCase(str: string): string {
  return str
    .split('')
    .map((char) => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    })
    .join('');
}

// ============================================
// 截取和填充
// ============================================

/**
 * 截取字符串（添加省略号）
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * 截取单词
 */
export function truncateWords(str: string, count: number, suffix = '...'): string {
  if (!str) return '';
  const words = str.split(/\s+/);
  if (words.length <= count) return str;
  return words.slice(0, count).join(' ') + suffix;
}

/**
 * 左填充
 */
export function padLeft(str: string, length: number, char = ' '): string {
  return str.padStart(length, char);
}

/**
 * 右填充
 */
export function padRight(str: string, length: number, char = ' '): string {
  return str.padEnd(length, char);
}

/**
 * 两侧填充
 */
export function padBoth(str: string, length: number, char = ' '): string {
  const padLength = Math.max(0, length - str.length);
  const leftPad = Math.floor(padLength / 2);
  const rightPad = padLength - leftPad;
  return char.repeat(leftPad) + str + char.repeat(rightPad);
}

// ============================================
// 清理和修复
// ============================================

/**
 * 去除所有空格
 */
export function removeSpaces(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * 去除多余空格（合并多个空格为一个）
 */
export function collapseSpaces(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * 去除特殊字符
 */
export function removeSpecialChars(str: string): string {
  return str.replace(/[^a-zA-Z0-9\s]/g, '');
}

/**
 * 只保留字母和数字
 */
export function alphanumeric(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * 移除 HTML 标签
 */
export function stripTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * 转义 HTML
 */
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEntities[char]);
}

/**
 * 反转义 HTML
 */
export function unescapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#60;': '<',
    '&#62;': '>',
  };
  return str.replace(/&(amp|lt|gt|quot|#39|#x27|#x2F|#60|#62);/g, (match) => htmlEntities[match]);
}

// ============================================
// 查找和替换
// ============================================

/**
 * 替换所有（支持正则）
 */
export function replaceAll(str: string, search: string, replacement: string): string {
  return str.replace(new RegExp(search, 'g'), replacement);
}

/**
 * 替换从位置 n 开始的内容
 */
export function replaceAt(str: string, index: number, replacement: string): string {
  return str.substring(0, index) + replacement + str.substring(index + 1);
}

/**
 * 在指定位置插入字符串
 */
export function insertAt(str: string, index: number, insertion: string): string {
  return str.slice(0, index) + insertion + str.slice(index);
}

/**
 * 在所有元音前添加 "an" 或 "a"
 */
export function article(str: string): string {
  const vowels = /^[aeiou]/i;
  return vowels.test(str) ? 'an ' + str : 'a ' + str;
}

// ============================================
// 判断函数
// ============================================

/**
 * 是否为空（包括只有空格）
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * 是否包含指定子串
 */
export function includes(str: string, substring: string): boolean {
  return str.includes(substring);
}

/**
 * 是否以指定字符串开头
 */
export function startsWith(str: string, prefix: string): boolean {
  return str.startsWith(prefix);
}

/**
 * 是否以指定字符串结尾
 */
export function endsWith(str: string, suffix: string): boolean {
  return str.endsWith(suffix);
}

/**
 * 是否是回文
 */
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

/**
 * 是否是字母
 */
export function isAlpha(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * 是否是数字
 */
export function isNumeric(str: string): boolean {
  return /^[0-9]+$/.test(str);
}

/**
 * 是否是字母或数字
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * 是否是小写
 */
export function isLowerCase(str: string): boolean {
  return str === str.toLowerCase() && str !== str.toUpperCase();
}

/**
 * 是否是大写
 */
export function isUpperCase(str: string): boolean {
  return str === str.toUpperCase() && str !== str.toLowerCase();
}

// ============================================
// 字符串统计
// ============================================

/**
 * 获取字符串长度
 */
export function length(str: string): number {
  return str.length;
}

/**
 * 获取单词数
 */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * 统计子串出现次数
 */
export function countOccurrences(str: string, substring: string): number {
  const matches = str.match(new RegExp(substring, 'g'));
  return matches ? matches.length : 0;
}

/**
 * 获取字符频率
 */
export function charFrequency(str: string): Record<string, number> {
  const frequency: Record<string, number> = {};
  for (const char of str) {
    frequency[char] = (frequency[char] || 0) + 1;
  }
  return frequency;
}

// ============================================
// 字符串变换
// ============================================

/**
 * 反转字符串
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * 打乱字符串
 */
export function shuffle(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

/**
 * 重复字符串
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

/**
 * 生成随机字符串
 */
export function randomString(length: number, charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * 生成 UUID v4
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ============================================
// 高级操作
// ============================================

/**
 * 首字母缩写
 */
export function acronym(str: string): string {
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * 初始化（首字母）
 */
export function initials(str: string, separator = '. '): string {
  return str
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .join(separator);
}

/**
 * 转换为 URL slug
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
 * 转换为人类可读格式
 */
export function humanize(str: string): string {
  return str
    .replace(/[_-]/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());
}

/**
 * 计算字符串相似度（Levenshtein 距离）
 */
export function levenshtein(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * 高亮文本
 */
export function highlight(text: string, query: string, className = 'highlight'): string {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, `<span class="${className}">$1</span>`);
}

/**
 * 遮盖字符串（用于显示敏感信息）
 */
export function mask(str: string, visibleChars = 4, maskChar = '*'): string {
  if (!str || str.length <= visibleChars) return str;
  const visible = str.slice(-visibleChars);
  return maskChar.repeat(str.length - visibleChars) + visible;
}

/**
 * 转换为 Base64
 */
export function toBase64(str: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  return Buffer.from(str).toString('base64');
}

/**
 * 从 Base64 转换
 */
export function fromBase64(base64: string): string {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(escape(window.atob(base64)));
  }
  return Buffer.from(base64, 'base64').toString();
}
