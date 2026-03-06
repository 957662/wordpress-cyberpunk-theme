/**
 * 字符串处理工具函数
 */

/**
 * 截取字符串摘要
 */
export function extractExcerpt(html: string, maxLength: number = 150): string {
  // 移除 HTML 标签
  const text = html.replace(/<[^>]*>/g, '');

  // 截取指定长度
  let excerpt = text.substring(0, maxLength);

  // 如果文本被截断，添加省略号
  if (text.length > maxLength) {
    excerpt += '...';
  }

  return excerpt;
}

/**
 * 截断文本
 */
export function truncate(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 首字母大写
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * 标题格式化（每个单词首字母大写）
 */
export function titleize(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * 驼峰命名转换
 */
export function camelCase(text: string): string {
  return text
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

/**
 * 蛇形命名转换
 */
export function snakeCase(text: string): string {
  return text
    .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    .replace(/^_/, '')
    .replace(/[-\s]+/g, '_');
}

/**
 * 短横线命名转换
 */
export function kebabCase(text: string): string {
  return text
    .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    .replace(/^-/, '')
    .replace(/[\s_]+/g, '-');
}

/**
 * 帕斯卡命名转换
 */
export function pascalCase(text: string): string {
  return capitalize(camelCase(text));
}

/**
 * 移除字符串中的 HTML 标签
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * 移除字符串中的特殊字符
 */
export function stripSpecialChars(text: string): string {
  return text.replace(/[^\w\s]/gi, '');
}

/**
 * 转义 HTML 特殊字符
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '`': '&#096;',
  };

  return text.replace(/[&<>"'`]/g, char => map[char]);
}

/**
 * 反转义 HTML 特殊字符
 */
export function unescapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#096;': '`',
  };

  return text.replace(/&(amp|lt|gt|quot|#039|#096);/g, match => map[match]);
}

/**
 * 生成随机字符串
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
 * 生成 UUID
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, char => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/**
 * 计算字符串的字节长度
 */
export function byteLength(text: string): number {
  let length = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    if (char < 0x80) {
      length += 1;
    } else if (char < 0x800) {
      length += 2;
    } else if (char < 0xd800 || char >= 0xe000) {
      length += 3;
    } else {
      i++;
      length += 4;
    }
  }

  return length;
}

/**
 * 计算字符串的字数（中文+英文）
 */
export function countWords(text: string): number {
  // 移除 HTML 标签
  const cleanText = stripHtml(text);

  // 计算中文字符
  const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;

  // 计算英文单词
  const englishWords = (cleanText.match(/[a-zA-Z]+/g) || []).length;

  return chineseChars + englishWords;
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

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * 格式化数字（添加千位分隔符）
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 格式化货币
 */
export function formatCurrency(amount: number, currency: string = 'CNY'): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 格式化百分比
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 移除字符串中的空格
 */
export function removeSpaces(text: string): string {
  return text.replace(/\s+/g, '');
}

/**
 * 压缩多个空格为一个
 */
export function compressSpaces(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * 反转字符串
 */
export function reverse(text: string): string {
  return text.split('').reverse().join('');
}

/**
 * 检查字符串是否为回文
 */
export function isPalindrome(text: string): boolean {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === reverse(clean);
}

/**
 * 重复字符串
 */
export function repeat(text: string, times: number): string {
  return text.repeat(times);
}

/**
 * 填充字符串到指定长度
 */
export function pad(text: string, length: number, char: string = ' ', align: 'left' | 'right' | 'center' = 'left'): string {
  if (text.length >= length) {
    return text;
  }

  const padding = char.repeat(length - text.length);

  switch (align) {
    case 'left':
      return text + padding;
    case 'right':
      return padding + text;
    case 'center':
      const half = Math.floor(padding.length / 2);
      return padding.slice(0, half) + text + padding.slice(half);
    default:
      return text + padding;
  }
}

/**
 * 将字符串转换为 URL 友好的格式
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 检查字符串是否包含子字符串（不区分大小写）
 */
export function includesIgnoreCase(text: string, search: string): boolean {
  return text.toLowerCase().includes(search.toLowerCase());
}

/**
 * 检查字符串是否以子字符串开头（不区分大小写）
 */
export function startsWithIgnoreCase(text: string, search: string): boolean {
  return text.toLowerCase().startsWith(search.toLowerCase());
}

/**
 * 检查字符串是否以子字符串结尾（不区分大小写）
 */
export function endsWithIgnoreCase(text: string, search: string): boolean {
  return text.toLowerCase().endsWith(search.toLowerCase());
}

/**
 * 替换所有出现的子字符串（不区分大小写）
 */
export function replaceAllIgnoreCase(text: string, search: string, replacement: string): string {
  const regex = new RegExp(search, 'gi');
  return text.replace(regex, replacement);
}

/**
 * 从字符串中提取数字
 */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d+(\.\d+)?/g);
  return matches ? matches.map(Number) : [];
}

/**
 * 检查字符串是否为数字
 */
export function isNumeric(text: string): boolean {
  return !isNaN(parseFloat(text)) && isFinite(Number(text));
}

/**
 * 将字符串转换为 Base64
 */
export function toBase64(text: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(text).toString('base64');
  }
  return window.btoa(text);
}

/**
 * 从 Base64 解码字符串
 */
export function fromBase64(base64: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(base64, 'base64').toString();
  }
  return window.atob(base64);
}

/**
 * 初音化字符串（首字母大写）
 */
export function initial(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase();
}

/**
 * 获取字符串的缩写
 */
export function initials(text: string, separator: string = ' '): string {
  return text
    .split(separator)
    .map(word => initial(word))
    .join('');
}

/**
 * 将字符串转换为单词数组
 */
export function words(text: string): string[] {
  return text.match(/\w+/g) || [];
}

/**
 * 计算字符串的哈希值
 */
export function hash(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * 遮蔽字符串（用于敏感信息）
 */
export function mask(text: string, visibleChars: number = 4, maskChar: string = '*'): string {
  if (text.length <= visibleChars) {
    return text;
  }

  const start = text.substring(0, visibleChars);
  const end = text.substring(text.length - visibleChars);
  const masked = maskChar.repeat(text.length - visibleChars * 2);

  return `${start}${masked}${end}`;
}

/**
 * 清理文本（移除多余的空格和换行）
 */
export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

/**
 * 格式化 JSON 字符串
 */
export function formatJson(json: string, indent: number = 2): string {
  try {
    const obj = JSON.parse(json);
    return JSON.stringify(obj, null, indent);
  } catch {
    return json;
  }
}

/**
 * 压缩 JSON 字符串
 */
export function minifyJson(json: string): string {
  try {
    const obj = JSON.parse(json);
    return JSON.stringify(obj);
  } catch {
    return json;
  }
}

/**
 * 截取字符串（支持中文）
 */
export function substringChinese(text: string, start: number, end?: number): string {
  let result = '';
  let charIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);

    // 判断是否为中文字符
    const isChinese = char >= 0x4e00 && char <= 0x9fa5;

    if (charIndex >= start && (!end || charIndex < end)) {
      result += text[i];
    }

    charIndex += isChinese ? 2 : 1;
  }

  return result;
}

/**
 * 分割字符串（支持中文）
 */
export function splitChinese(text: string, separator: string | RegExp = ' '): string[] {
  return text.split(separator);
}
