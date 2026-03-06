/**
 * 文章处理工具函数
 */

import { DOMParser } from 'prosemirror-model';
import { Schema, Node as ProseMirrorNode } from 'prosemirror-model';

/**
 * 从 HTML 内容中提取纯文本
 */
export function extractTextFromHTML(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * 计算文章字数
 */
export function countWords(content: string): number {
  // 移除 HTML 标签
  const textContent = content.replace(/<[^>]*>/g, '');
  // 移除多余空格和换行
  const cleanText = textContent.trim().replace(/\s+/g, ' ');

  // 分别计算英文单词和中文字符
  const englishWords = (cleanText.match(/[a-zA-Z]+/g) || []).length;
  const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;

  return englishWords + chineseChars;
}

/**
 * 计算预估阅读时间(分钟)
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200,
  imageCount: number = 0
): number {
  const wordCount = countWords(content);
  const readingTime = wordCount / wordsPerMinute;
  const imageTime = imageCount * 0.2; // 每张图片增加 12 秒

  return Math.ceil(readingTime + imageTime);
}

/**
 * 格式化阅读时间
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '少于 1 分钟';
  if (minutes < 60) return `${minutes} 分钟`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes > 0
    ? `${hours} 小时 ${remainingMinutes} 分钟`
    : `${hours} 小时`;
}

/**
 * 从内容中提取标题生成目录
 */
export interface TableOfContentItem {
  id: string;
  text: string;
  level: number;
}

export function extractTableOfContents(
  content: string,
  minLevel: number = 2,
  maxLevel: number = 3
): TableOfContentItem[] {
  const headings: TableOfContentItem[] = [];
  const regex = new RegExp(
    `<h([${minLevel}-${maxLevel}])[^>]*id="([^"]*)"[^>]*>(.*?)</h\\1>`,
    'gi'
  );

  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, ''); // 移除标题内的 HTML 标签

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * 为内容中的标题添加 ID (如果没有的话)
 */
export function ensureHeadingIds(content: string): string {
  return content.replace(/<h([1-6])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, text) => {
    // 检查是否已有 ID
    const idMatch = attrs.match(/id="([^"]*)"/);
    if (idMatch) {
      return match;
    }

    // 生成 ID
    const plainText = text.replace(/<[^>]*>/g, '');
    const id = plainText
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');

    return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
  });
}

/**
 * 从内容中提取图片 URL
 */
export function extractImages(content: string): string[] {
  const imgRegex = /<img[^>]*src="([^"]*)"[^>]*>/gi;
  const images: string[] = [];
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    images.push(match[1]);
  }

  return images;
}

/**
 * 从内容中提取代码块
 */
export interface CodeBlock {
  language: string;
  code: string;
}

export function extractCodeBlocks(content: string): CodeBlock[] {
  const codeBlocks: CodeBlock[] = [];
  const regex =
    /<pre[^>]*class="[^"]*language-([^"]*)"[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const language = match[1];
    const code = match[2].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

    codeBlocks.push({ language, code });
  }

  return codeBlocks;
}

/**
 * 从内容中提取摘要
 */
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // 移除 HTML 标签
  const textContent = content.replace(/<[^>]*>/g, '');
  // 移除多余空格
  const cleanText = textContent.trim().replace(/\s+/g, ' ');

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return cleanText.slice(0, maxLength).trim() + '...';
}

/**
 * 格式化数字
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 生成文章 slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 验证 slug 格式
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * 从 URL 中提取域名
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
}

/**
 * 检查是否为外部链接
 */
export function isExternalLink(url: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const urlObj = new URL(url);
    return urlObj.hostname !== window.location.hostname;
  } catch {
    return false;
  }
}

/**
 * 为外部链接添加 target="_blank"
 */
export function addExternalLinkAttributes(html: string): string {
  return html.replace(
    /<a\s+(?:[^>]*?\s+)?href=(["'])(https?:\/\/[^"']*)\1([^>]*)>/gi,
    (match, quote, url, attrs) => {
      // 检查是否已有 target 属性
      if (attrs.includes('target=')) {
        return match;
      }

      // 添加 target 和 rel 属性
      return `<a href="${url}"${attrs} target="_blank" rel="noopener noreferrer">`;
    }
  );
}

/**
 * 清理 HTML 内容
 */
export function sanitizeHTML(html: string): string {
  // 移除危险的标签和属性
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '') // 移除事件处理器
    .replace(/javascript:[^"']*/gi, ''); // 移除 javascript: 协议
}

/**
 * 高亮搜索关键词
 */
export function highlightKeywords(text: string, keywords: string[]): string {
  if (keywords.length === 0) return text;

  const pattern = new RegExp(`(${keywords.join('|')})`, 'gi');
  return text.replace(pattern, '<mark class="bg-cyber-cyan/20 text-cyber-cyan">$1</mark>');
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
