/**
 * String Utilities
 * 字符串工具函数
 */

/**
 * 生成随机字符串
 * @param length - 字符串长度
 * @param charset - 字符集（默认：字母+数字）
 * @returns 随机字符串
 */
export function randomString(length: number = 10, charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * 生成 UUID
 * @returns UUID 字符串
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 生成 Nano ID
 * @param length - ID 长度
 * @returns Nano ID
 */
export function generateNanoId(length: number = 21): string {
  const charset = 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZI';
  let result = '';
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length];
  }

  return result;
}

/**
 * 首字母大写
 * @param str - 字符串
 * @returns 首字母大写的字符串
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 驼峰命名转换
 * @param str - 字符串
 * @returns 驼峰命名字符串
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
    .replace(/^(.)/, (_, char) => char.toLowerCase());
}

/**
 * 帕斯卡命名转换
 * @param str - 字符串
 * @returns 帕斯卡命名字符串
 */
export function toPascalCase(str: string): string {
  return capitalize(toCamelCase(str));
}

/**
 * 蛇形命名转换
 * @param str - 字符串
 * @returns 蛇形命名字符串
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

/**
 * 短横线命名转换
 * @param str - 字符串
 * @returns 短横线命名字符串
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
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
 * 去除字符串中的 HTML 标签
 * @param html - HTML 字符串
 * @returns 纯文本
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

/**
 * 转义 HTML 特殊字符
 * @param str - 字符串
 * @returns 转义后的字符串
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * 反转义 HTML 特殊字符
 * @param str - 字符串
 * @returns 反转义后的字符串
 */
export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'"
  };
  return str.replace(/&(amp|lt|gt|quot|#039);/g, (entity) => map[entity]);
}

/**
 * 截断字符串
 * @param str - 字符串
 * @param maxLength - 最大长度
 * @param suffix - 后缀（默认：'...'）
 * @returns 截断后的字符串
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 截断单词
 * @param str - 字符串
 * @param maxWords - 最大单词数
 * @param suffix - 后缀
 * @returns 截断后的字符串
 */
export function truncateWords(str: string, maxWords: number, suffix: string = '...'): string {
  const words = str.split(' ');
  if (words.length <= maxWords) return str;
  return words.slice(0, maxWords).join(' ') + suffix;
}

/**
 * 去除字符串两端的空格
 * @param str - 字符串
 * @returns 去除空格后的字符串
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * 去除字符串中的所有空格
 * @param str - 字符串
 * @returns 去除空格后的字符串
 */
export function removeAllSpaces(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * 将字符串转换为 URL 友好的 slug
 * @param str - 字符串
 * @returns slug 字符串
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
 * 计算字符串的字节长度
 * @param str - 字符串
 * @returns 字节长度
 */
export function byteLength(str: string): number {
  return new Blob([str]).size;
}

/**
 * 格式化字符串（模板字符串替换）
 * @param template - 模板字符串
 * @param data - 数据对象
 * @returns 格式化后的字符串
 */
export function format(template: string, data: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] ?? '');
}

/**
 * 高亮关键词
 * @param text - 文本
 * @param keyword - 关键词
 * @param className - 高亮类名
 * @returns 高亮后的 HTML
 */
export function highlightKeyword(text: string, keyword: string, className: string = 'highlight'): string {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, `<span class="${className}">$1</span>`);
}

/**
 * 生成摘要
 * @param text - 文本
 * @param maxLength - 最大长度
 * @returns 摘要
 */
export function excerpt(text: string, maxLength: number = 200): string {
  // 先去除 HTML 标签
  const plainText = stripHtml(text);
  return truncate(plainText, maxLength);
}

/**
 * 重复字符串
 * @param str - 字符串
 * @param count - 重复次数
 * @returns 重复后的字符串
 */
export function repeat(str: string, count: number): string {
  return str.repeat(count);
}

/**
 * 填充字符串
 * @param str - 字符串
 * @param length - 目标长度
 * @param char - 填充字符
 * @param end - 是否在末尾填充（默认：false）
 * @returns 填充后的字符串
 */
export function pad(str: string, length: number, char: string = ' ', end: boolean = false): string {
  const padding = repeat(char, Math.max(0, length - str.length));
  return end ? str + padding : padding + str;
}

/**
 * 将字符串转换为标题格式
 * @param str - 字符串
 * @returns 标题格式字符串
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * 获取字符串中的所有数字
 * @param str - 字符串
 * @returns 数字数组
 */
export function extractNumbers(str: string): number[] {
  const matches = str.match(/\d+/g);
  return matches ? matches.map(Number) : [];
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
 * 判断字符串是否包含指定内容
 * @param str - 字符串
 * @param search - 搜索内容
 * @param caseSensitive - 是否区分大小写（默认：false）
 * @returns 是否包含
 */
export function includes(str: string, search: string, caseSensitive: boolean = false): boolean {
  if (caseSensitive) {
    return str.includes(search);
  }
  return str.toLowerCase().includes(search.toLowerCase());
}

/**
 * 替换所有匹配项
 * @param str - 字符串
 * @param search - 搜索内容
 * @param replacement - 替换内容
 * @returns 替换后的字符串
 */
export function replaceAll(str: string, search: string, replacement: string): string {
  return str.split(search).join(replacement);
}

/**
 * 统计字符串中的单词数
 * @param str - 字符串
 * @returns 单词数
 */
export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * 统计字符串中的字符数（排除空格）
 * @param str - 字符串
 * @returns 字符数
 */
export function countChars(str: string): number {
  return str.replace(/\s/g, '').length;
}

/**
 * 生成字符串的哈希值
 * @param str - 字符串
 * @returns 哈希值
 */
export function hash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

/**
 * 将字符串转换为 Base64
 * @param str - 字符串
 * @returns Base64 字符串
 */
export function toBase64(str: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(str).toString('base64');
  }
  return window.btoa(str);
}

/**
 * 从 Base64 解码字符串
 * @param base64 - Base64 字符串
 * @returns 解码后的字符串
 */
export function fromBase64(base64: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(base64, 'base64').toString();
  }
  return window.atob(base64);
}
