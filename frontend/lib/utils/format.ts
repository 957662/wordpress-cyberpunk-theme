/**
 * CyberPress Platform - Format Utilities
 * 格式化工具函数
 */

import { format, formatDistanceToNow, differenceInDays, differenceInHours } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期
 * 
 * @param date - 日期对象或字符串
 * @param formatStr - 格式字符串
 * @returns 格式化后的日期字符串
 * 
 * @example
 * formatDate(new Date(), 'yyyy-MM-dd') // '2024-03-03'
 * formatDate('2024-03-03', 'yyyy年MM月dd日') // '2024年03月03日'
 */
export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr, { locale: zhCN });
}

/**
 * 格式化相对时间
 * 
 * @param date - 日期对象或字符串
 * @returns 相对时间字符串
 * 
 * @example
 * formatRelativeTime(new Date()) // '刚刚'
 * formatRelativeTime('2024-03-01') // '2天前'
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const days = differenceInDays(now, dateObj);
  
  if (days === 0) {
    const hours = differenceInHours(now, dateObj);
    if (hours === 0) {
      return '刚刚';
    }
    return `${hours}小时前`;
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: zhCN });
  }
}

/**
 * 格式化阅读时间
 * 
 * @param content - 文章内容
 * @param wordsPerMinute - 每分钟阅读字数（默认300）
 * @returns 阅读时间（分钟）
 * 
 * @example
 * formatReadTime('这是一篇文章...') // 3
 */
export function formatReadTime(content: string, wordsPerMinute: number = 300): number {
  // 中文按字符数计算，英文按单词数计算
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  
  const totalWords = chineseChars + englishWords;
  const minutes = Math.ceil(totalWords / wordsPerMinute);
  
  return Math.max(1, minutes);
}

/**
 * 格式化文件大小
 * 
 * @param bytes - 字节数
 * @returns 格式化后的文件大小
 * 
 * @example
 * formatFileSize(1024) // '1 KB'
 * formatFileSize(1048576) // '1 MB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 格式化数字
 * 
 * @param num - 数字
 * @returns 格式化后的数字字符串
 * 
 * @example
 * formatNumber(1000) // '1K'
 * formatNumber(1000000) // '1M'
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * 格式化金额
 * 
 * @param amount - 金额
 * @param currency - 货币符号（默认¥）
 * @returns 格式化后的金额字符串
 * 
 * @example
 * formatCurrency(1234.56) // '¥1,234.56'
 */
export function formatCurrency(amount: number, currency: string = '¥'): string {
  return currency + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 截断文本
 * 
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @param suffix - 后缀（默认...）
 * @returns 截断后的文本
 * 
 * @example
 * truncateText('这是一段很长的文本...', 10) // '这是一段很长的...'
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
}

/**
 * 高亮搜索关键词
 * 
 * @param text - 原始文本
 * @param keyword - 关键词
 * @param className - 高亮类名
 * @returns 高亮后的 HTML 字符串
 * 
 * @example
 * highlightText('这是一篇文章', '文章', 'highlight')
 * // '这是一篇<span class="highlight">文章</span>'
 */
export function highlightText(
  text: string,
  keyword: string,
  className: string = 'highlight'
): string {
  if (!keyword.trim()) return text;
  
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, `<span class="${className}">$1</span>`);
}

/**
 * 格式化 URL slug
 * 
 * @param text - 原始文本
 * @returns 格式化后的 slug
 * 
 * @example
 * slugify('Hello World!') // 'hello-world'
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // 替换空格为 -
    .replace(/[^\w\-]+/g, '') // 移除非单词字符
    .replace(/\-\-+/g, '-') // 替换多个 - 为单个 -
    .replace(/^-+/, '') // 去除开头的 -
    .replace(/-+$/, ''); // 去除结尾的 -
}

/**
 * 首字母大写
 * 
 * @param text - 原始文本
 * @returns 首字母大写后的文本
 * 
 * @example
 * capitalize('hello') // 'Hello'
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * 移除 HTML 标签
 * 
 * @param html - HTML 字符串
 * @returns 纯文本
 * 
 * @example
 * stripHtml('<p>Hello <strong>World</strong></p>') // 'Hello World'
 */
export function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
