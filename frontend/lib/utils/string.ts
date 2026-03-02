/**
 * 字符串处理工具
 */

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 转换为 kebab-case
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * 转换为 camelCase
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}

/**
 * 转换为 snake_case
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * 转换为 PascalCase
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

/**
 * 截断字符串
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

/**
 * 移除 HTML 标签
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
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
  return str.replace(/[&<>"']/g, char => htmlEntities[char]);
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
  };
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, entity => htmlEntities[entity]);
}

/**
 * 生成随机字符串
 */
export function randomString(length: number = 8): string {
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
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 计算字符串字节长度（中文算2字节）
 */
export function byteLength(str: string): number {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (charCode >= 0x4e00 && charCode <= 0x9fa5) {
      length += 2;
    } else {
      length += 1;
    }
  }
  return length;
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 高亮搜索关键词
 */
export function highlightKeywords(text: string, keywords: string[]): string {
  let highlighted = text;
  keywords.forEach(keyword => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark>$1</mark>');
  });
  return highlighted;
}

/**
 * 提取文本摘要
 */
export function extractSummary(text: string, maxLength: number = 200): string {
  const plainText = stripHtml(text);
  return truncate(plainText.trim(), maxLength);
}

/**
 * 格式化 URL slug
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
 * 判断是否为空字符串
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * 分割字符串为数组
 */
export function splitBy(str: string, separator: string | RegExp = ','): string[] {
  if (!str) return [];
  return str.split(separator).map(s => s.trim()).filter(Boolean);
}

/**
 * 连接数组为字符串
 */
export function joinBy(arr: string[], separator: string = ','): string {
  return arr.filter(Boolean).join(separator);
}

/**
 * 统计字符串中某字符的出现次数
 */
export function countOccurrences(str: string, char: string): number {
  const matches = str.match(new RegExp(char, 'g'));
  return matches ? matches.length : 0;
}

/**
 * 反转字符串
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * 判断是否为回文字符串
 */
export function isPalindrome(str: string): boolean {
  const reversed = reverse(str.toLowerCase().replace(/[^a-z0-9]/g, ''));
  return str.toLowerCase().replace(/[^a-z0-9]/g, '') === reversed;
}

/**
 * Base64 编码
 */
export function base64Encode(str: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  return Buffer.from(str).toString('base64');
}

/**
 * Base64 解码
 */
export function base64Decode(str: string): string {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(escape(window.atob(str)));
  }
  return Buffer.from(str, 'base64').toString();
}

/**
 * 简化文本（移除多余空格和换行）
 */
export function simplifyText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

/**
 * 获取字符串的首字母缩写
 */
export function getInitials(str: string, maxLength: number = 2): string {
  const words = str.trim().split(/\s+/);
  let initials = '';

  for (const word of words) {
    if (initials.length >= maxLength) break;
    initials += word.charAt(0).toUpperCase();
  }

  return initials;
}

/**
 * 遮盖敏感信息（如手机号、身份证）
 */
export function maskSensitive(str: string, visibleStart: number = 3, visibleEnd: number = 4): string {
  if (str.length <= visibleStart + visibleEnd) return str;
  const start = str.substring(0, visibleStart);
  const end = str.substring(str.length - visibleEnd);
  const middle = '*'.repeat(str.length - visibleStart - visibleEnd);
  return start + middle + end;
}
