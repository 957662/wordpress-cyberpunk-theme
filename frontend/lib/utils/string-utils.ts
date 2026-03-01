/**
 * String Utilities
 * 字符串处理工具函数
 */

/**
 * 生成随机字符串
 * @param length - 字符串长度
 * @param charset - 字符集
 * @returns 随机字符串
 */
export function randomString(length: number = 10, charset?: string): string {
  const defaultCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const chars = charset || defaultCharset;
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * 生成 UUID v4
 * @returns UUID 字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 生成 NanoID
 * @param size - ID 大小
 * @returns NanoID 字符串
 */
export function generateNanoID(size: number = 21): string {
  const chars = 'ModuleSymbhasOwnPr0123456789ABCDEFGHNRVfgctiUvzKqYTJkLxpZXIjQW';
  let result = '';

  for (let i = 0; i < size; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

/**
 * 首字母大写
 * @param str - 字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * 驼峰命名转短横线命名
 * @param str - 驼峰命名字符串
 * @returns 短横线命名字符串
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * 驼峰命名转蛇形命名
 * @param str - 驼峰命名字符串
 * @returns 蛇形命名字符串
 */
export function camelToSnake(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

/**
 * 短横线命名转驼峰命名
 * @param str - 短横线命名字符串
 * @returns 驼峰命名字符串
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * 蛇形命名转驼峰命名
 * @param str - 蛇形命名字符串
 * @returns 驼峰命名字符串
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * HTML 转义
 * @param str - 字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    '/': '&#x2F;',
  };

  return str.replace(/[&<>"'/]/g, (char) => htmlEntities[char]);
}

/**
 * HTML 反转义
 * @param str - 字符串
 * @returns 反转义后的字符串
 */
export function unescapeHtml(str: string): string {
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&#x2F;': '/',
  };

  return str.replace(/&(amp|lt|gt|quot|#039|#x2F);/g, (entity) => htmlEntities[entity]);
}

/**
 * 生成 URL 友好的 Slug
 * @param str - 字符串
 * @returns Slug 字符串
 */
export function generateSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 截断字符串
 * @param str - 字符串
 * @param length - 最大长度
 * @param suffix - 后缀（默认为 '...'）
 * @returns 截断后的字符串
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * 截断单词（在单词边界处截断）
 * @param str - 字符串
 * @param length - 最大长度
 * @param suffix - 后缀
 * @returns 截断后的字符串
 */
export function truncateWords(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;

  const truncated = str.slice(0, length);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace === -1) return truncated + suffix;
  return truncated.slice(0, lastSpace) + suffix;
}

/**
 * 移除字符串中的 HTML 标签
 * @param str - HTML 字符串
 * @returns 纯文本字符串
 */
export function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * 高亮搜索关键词
 * @param text - 文本
 * @param keyword - 关键词
 * @param highlightClass - 高亮类名
 * @returns 带 HTML 高亮的字符串
 */
export function highlightKeyword(text: string, keyword: string, highlightClass: string = 'highlight'): string {
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}

/**
 * 字符串脱敏
 * @param str - 字符串
 * @param visibleStart - 开头可见字符数
 * @param visibleEnd - 结尾可见字符数
 * @param maskChar - 掩码字符
 * @returns 脱敏后的字符串
 */
export function maskString(
  str: string,
  visibleStart: number = 2,
  visibleEnd: number = 2,
  maskChar: string = '*'
): string {
  if (str.length <= visibleStart + visibleEnd) return str;

  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const masked = maskChar.repeat(str.length - visibleStart - visibleEnd);

  return start + masked + end;
}

/**
 * 手机号脱敏
 * @param phone - 手机号
 * @returns 脱敏后的手机号
 */
export function maskPhone(phone: string): string {
  return maskString(phone, 3, 4);
}

/**
 * 邮箱脱敏
 * @param email - 邮箱
 * @returns 脱敏后的邮箱
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  const maskedUsername = username.length > 2
    ? username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
    : username;

  return `${maskedUsername}@${domain}`;
}

/**
 * 身份证号脱敏
 * @param idCard - 身份证号
 * @returns 脱敏后的身份证号
 */
export function maskIdCard(idCard: string): string {
  return maskString(idCard, 6, 4);
}

/**
 * Base64 编码
 * @param str - 字符串
 * @returns Base64 编码后的字符串
 */
export function base64Encode(str: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(unescape(encodeURIComponent(str)));
  }
  return Buffer.from(str).toString('base64');
}

/**
 * Base64 解码
 * @param str - Base64 编码的字符串
 * @returns 解码后的字符串
 */
export function base64Decode(str: string): string {
  if (typeof window !== 'undefined') {
    return decodeURIComponent(escape(window.atob(str)));
  }
  return Buffer.from(str, 'base64').toString();
}

/**
 * 判断字符串是否为空
 * @param str - 字符串
 * @returns 是否为空
 */
export function isEmpty(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * 判断字符串是否为空白
 * @param str - 字符串
 * @returns 是否为空白
 */
export function isBlank(str: string | null | undefined): boolean {
  return !str || /^\s*$/.test(str);
}

/**
 * 反转字符串
 * @param str - 字符串
 * @returns 反转后的字符串
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * 统计单词数
 * @param str - 字符串
 * @returns 单词数
 */
export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * 统计字符数（不包含空格）
 * @param str - 字符串
 * @returns 字符数
 */
export function countChars(str: string): number {
  return str.replace(/\s/g, '').length;
}

/**
 * 计算字符串字节长度
 * @param str - 字符串
 * @returns 字节长度
 */
export function byteLength(str: string): number {
  if (typeof window !== 'undefined') {
    return new Blob([str]).size;
  }
  return Buffer.byteLength(str, 'utf8');
}

/**
 * 字符串重复
 * @param str - 字符串
 * @param count - 重复次数
 * @returns 重复后的字符串
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

/**
 * 填充字符串（左侧）
 * @param str - 字符串
 * @param length - 目标长度
 * @param char - 填充字符
 * @returns 填充后的字符串
 */
export function padLeft(str: string, length: number, char: string = ' '): string {
  return str.padStart(length, char);
}

/**
 * 填充字符串（右侧）
 * @param str - 字符串
 * @param length - 目标长度
 * @param char - 填充字符
 * @returns 填充后的字符串
 */
export function padRight(str: string, length: number, char: string = ' '): string {
  return str.padEnd(length, char);
}

/**
 * 移除字符串中的所有空格
 * @param str - 字符串
 * @returns 移除空格后的字符串
 */
export function removeSpaces(str: string): string {
  return str.replace(/\s/g, '');
}

/**
 * 移除字符串中的多余空格
 * @param str - 字符串
 * @returns 移除多余空格后的字符串
 */
export function removeExtraSpaces(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * 比较两个字符串（忽略大小写）
 * @param str1 - 字符串1
 * @param str2 - 字符串2
 * @returns 是否相等
 */
export function equalsIgnoreCase(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase();
}

/**
 * 判断字符串是否包含子串（忽略大小写）
 * @param str - 字符串
 * @param search - 搜索内容
 * @returns 是否包含
 */
export function containsIgnoreCase(str: string, search: string): boolean {
  return str.toLowerCase().includes(search.toLowerCase());
}

/**
 * 判断字符串是否以指定内容开头（忽略大小写）
 * @param str - 字符串
 * @param prefix - 前缀
 * @returns 是否以指定内容开头
 */
export function startsWithIgnoreCase(str: string, prefix: string): boolean {
  return str.toLowerCase().startsWith(prefix.toLowerCase());
}

/**
 * 判断字符串是否以指定内容结尾（忽略大小写）
 * @param str - 字符串
 * @param suffix - 后缀
 * @returns 是否以指定内容结尾
 */
export function endsWithIgnoreCase(str: string, suffix: string): boolean {
  return str.toLowerCase().endsWith(suffix.toLowerCase());
}

/**
 * 替换所有出现的子串
 * @param str - 字符串
 * @param search - 搜索内容
 * @param replacement - 替换内容
 * @returns 替换后的字符串
 */
export function replaceAll(str: string, search: string, replacement: string): string {
  return str.split(search).join(replacement);
}

/**
 * 获取字符串中的数字
 * @param str - 字符串
 * @returns 数字数组
 */
export function extractNumbers(str: string): number[] {
  const matches = str.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

/**
 * 获取字符串中的第一个数字
 * @param str - 字符串
 * @returns 第一个数字或 null
 */
export function extractFirstNumber(str: string): number | null {
  const match = str.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

/**
 * 将字符串转换为标题格式（每个单词首字母大写）
 * @param str - 字符串
 * @returns 标题格式的字符串
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 初始化缩写词
 * @param str - 字符串
 * @returns 缩写词
 */
export function initials(str: string): string {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * 颜色格式转换（HEX 转 RGB）
 * @param hex - HEX 颜色值
 * @returns RGB 对象
 */
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

/**
 * 颜色格式转换（RGB 转 HEX）
 * @param r - 红色值
 * @param g - 绿色值
 * @param b - 蓝色值
 * @returns HEX 颜色值
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
