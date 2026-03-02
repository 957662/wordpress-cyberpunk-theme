/**
 * Markdown 工具函数
 * 用于处理 Markdown 内容的转换、解析和优化
 */

import React from 'react';

/**
 * Markdown 选项
 */
export interface MarkdownOptions {
  /**
   * 是否启用代码高亮
   */
  highlightCode?: boolean;
  /**
   * 是否启用数学公式
   */
  math?: boolean;
  /**
   * 是否启用任务列表
   */
  taskLists?: boolean;
  /**
   * 是否启用 GFM (GitHub Flavored Markdown)
   */
  gfm?: boolean;
  /**
   * 是否启用自动链接
   */
  autolink?: boolean;
  /**
   * 是否启用表情符号
   */
  emoji?: boolean;
  /**
   * 是否启用下标和上标
   */
  subSup?: boolean;
  /**
   * 是否启用脚注
   */
  footnotes?: boolean;
  /**
   * 是否启用定义列表
   */
  deflist?: boolean;
  /**
   * 是否启用插入标记
   */
  insert?: boolean;
  /**
   * 是否启用标记
   */
  mark?: boolean;
  /**
   * 是否启用删除线
   */
  strikethrough?: boolean;
}

/**
 * 默认 Markdown 选项
 */
const defaultOptions: MarkdownOptions = {
  highlightCode: true,
  math: false,
  taskLists: true,
  gfm: true,
  autolink: true,
  emoji: true,
  subSup: false,
  footnotes: false,
  deflist: false,
  insert: false,
  mark: true,
  strikethrough: true,
};

/**
 * 提取 Markdown 中的标题
 */
export function extractHeadings(markdown: string): Array<{
  id: string;
  text: string;
  level: number;
}> {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = generateHeadingId(text);

    headings.push({ id, text, level });
  }

  return headings;
}

/**
 * 生成标题 ID
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * 提取 Markdown 中的代码块
 */
export function extractCodeBlocks(markdown: string): Array<{
  language: string;
  code: string;
  startIndex: number;
  endIndex: number;
}> {
  const codeBlocks: Array<{
    language: string;
    code: string;
    startIndex: number;
    endIndex: number;
  }> = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = match[1] || 'text';
    const code = match[2];
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;

    codeBlocks.push({ language, code, startIndex, endIndex });
  }

  return codeBlocks;
}

/**
 * 提取 Markdown 中的链接
 */
export function extractLinks(markdown: string): Array<{
  text: string;
  url: string;
  title?: string;
}> {
  const links: Array<{ text: string; url: string; title?: string }> = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)(?:\s+"([^"]+)")?\)/g;
  let match;

  while ((match = linkRegex.exec(markdown)) !== null) {
    const text = match[1];
    const url = match[2];
    const title = match[3];

    links.push({ text, url, title });
  }

  return links;
}

/**
 * 提取 Markdown 中的图片
 */
export function extractImages(markdown: string): Array<{
  alt: string;
  url: string;
  title?: string;
}> {
  const images: Array<{ alt: string; url: string; title?: string }> = [];
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]+)")?\)/g;
  let match;

  while ((match = imageRegex.exec(markdown)) !== null) {
    const alt = match[1];
    const url = match[2];
    const title = match[3];

    images.push({ alt, url, title });
  }

  return images;
}

/**
 * 提取 Markdown 中的表格
 */
export function extractTables(markdown: string): string[] {
  const tables: string[] = [];
  const tableRegex = /\|(.+)\|\n\|[-|\s:]+\|([\s\S]*?)\n(?=\||$)/g;
  let match;

  while ((match = tableRegex.exec(markdown)) !== null) {
    tables.push(match[0]);
  }

  return tables;
}

/**
 * 提取 Markdown 中的标签
 */
export function extractTags(markdown: string): string[] {
  const tags: Set<string> = new Set();
  const tagRegex = /#([a-zA-Z0-9\u4e00-\u9fa5_-]+)/g;
  let match;

  while ((match = tagRegex.exec(markdown)) !== null) {
    tags.add(match[1]);
  }

  return Array.from(tags);
}

/**
 * 提取 Markdown 中的摘要
 */
export function extractExcerpt(markdown: string, maxLength: number = 200): string {
  // 移除代码块
  let cleaned = markdown.replace(/```[\s\S]*?```/g, '');
  // 移除图片
  cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  // 移除标题标记
  cleaned = cleaned.replace(/^#+\s+/gm, '');
  // 移除链接但保留文本
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // 移除加粗和斜体
  cleaned = cleaned.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');
  // 移除多余的空白
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return cleaned.slice(0, maxLength - 3).trim() + '...';
}

/**
 * 计算 Markdown 内容的阅读时间
 */
export function calculateReadingTime(
  markdown: string,
  wordsPerMinute: number = 200,
  codeWordsPerMinute: number = 50
): number {
  // 移除代码块
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, '');
  const codeBlocks = markdown.match(/```[\s\S]*?```/g) || [];

  // 计算普通文本字数
  const textWords = withoutCode.trim().split(/\s+/).length;

  // 计算代码块字数
  const codeWords = codeBlocks.reduce((total, block) => {
    const code = block.replace(/```\w*\n?/g, '').trim();
    return total + code.split(/\s+/).length;
  }, 0);

  // 计算时间（分钟）
  const textTime = textWords / wordsPerMinute;
  const codeTime = codeWords / codeWordsPerMinute;

  return Math.ceil(textTime + codeTime);
}

/**
 * 验证 Markdown 语法
 */
export function validateMarkdown(markdown: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查未闭合的代码块
  const codeBlockCount = (markdown.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    errors.push('存在未闭合的代码块');
  }

  // 检查未闭合的链接
  const unclosedLinks = markdown.match(/\[[^\]]*\](?!\()/g) || [];
  if (unclosedLinks.length > 0) {
    warnings.push(`存在 ${unclosedLinks.length} 个未闭合的链接`);
  }

  // 检查未闭合的图片
  const unclosedImages = markdown.match(/!\[[^\]]*\](?!\()/g) || [];
  if (unclosedImages.length > 0) {
    warnings.push(`存在 ${unclosedImages.length} 个未闭合的图片`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * 清理 Markdown 内容
 */
export function cleanMarkdown(markdown: string): string {
  let cleaned = markdown;

  // 移除多余的空行
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // 移除行尾空格
  cleaned = cleaned.replace(/[ \t]+$/gm, '');

  // 确保列表项之间有空行
  cleaned = cleaned.replace(/^([*-] .+)\n(?=[*-] )/gm, '$1\n\n');

  // 确保标题前后有空行
  cleaned = cleaned.replace(/(?<!\n\n)(^(#{1,6}) .+$)/gm, '\n\n$1');
  cleaned = cleaned.replace(/(^(#{1,6}) .+$)(?!\n\n)/gm, '$1\n\n');

  return cleaned.trim();
}

/**
 * 转换 Markdown 为纯文本
 */
export function markdownToPlainText(markdown: string): string {
  let text = markdown;

  // 移除代码块
  text = text.replace(/```[\s\S]*?```/g, '');
  // 移除行内代码
  text = text.replace(/`([^`]+)`/g, '$1');
  // 移除图片
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '');
  // 移除链接但保留文本
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // 移除标题标记
  text = text.replace(/^#+\s+/gm, '');
  // 移除加粗和斜体
  text = text.replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1');
  // 移除删除线
  text = text.replace(/~~([^~]+)~~/g, '$1');
  // 移除水平线
  text = text.replace(/^[-*_]{3,}\s*$/gm, '');
  // 移除引用标记
  text = text.replace(/^>\s+/gm, '');
  // 移除列表标记
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');

  return text.trim();
}

/**
 * 检测 Markdown 内容中的语言
 */
export function detectLanguage(markdown: string): string[] {
  const languages: Set<string> = new Set();
  const languageRegex = /```(\w+)/g;
  let match;

  while ((match = languageRegex.exec(markdown)) !== null) {
    languages.add(match[1]);
  }

  return Array.from(languages);
}

/**
 * 统计 Markdown 内容
 */
export function getMarkdownStats(markdown: string): {
  characters: number;
  words: number;
  lines: number;
  paragraphs: number;
  headings: number;
  links: number;
  images: number;
  codeBlocks: number;
  tables: number;
} {
  const lines = markdown.split('\n');
  const paragraphs = lines.filter(line => line.trim()).length;
  const headings = (markdown.match(/^#{1,6}\s+/gm) || []).length;
  const links = (markdown.match(/\[([^\]]+)\]\([^)]+\)/g) || []).length;
  const images = (markdown.match(/!\[([^\]]*)\]\([^)]+\)/g) || []).length;
  const codeBlocks = (markdown.match(/```[\s\S]*?```/g) || []).length;
  const tables = (markdown.match(/\|.*\|/g) || []).length / 3;

  const plainText = markdownToPlainText(markdown);
  const characters = plainText.length;
  const words = plainText.split(/\s+/).filter(word => word.length > 0).length;

  return {
    characters,
    words,
    lines: lines.length,
    paragraphs,
    headings,
    links,
    images,
    codeBlocks,
    tables: Math.floor(tables),
  };
}

/**
 * 生成 Markdown 预览
 */
export function generateMarkdownPreview(
  markdown: string,
  maxLines: number = 10
): string {
  const lines = markdown.split('\n');
  const previewLines: string[] = [];

  for (const line of lines) {
    if (previewLines.length >= maxLines) {
      break;
    }

    // 跳过空行
    if (!line.trim()) {
      continue;
    }

    // 移除代码块
    if (line.startsWith('```')) {
      continue;
    }

    previewLines.push(line);
  }

  return previewLines.join('\n');
}

/**
 * 高亮 Markdown 中的语法元素
 */
export function highlightMarkdownSyntax(markdown: string): string {
  let highlighted = markdown;

  // 高亮标题
  highlighted = highlighted.replace(/^(#{1,6})\s+(.+)$/gm, '<span class="heading">$1 $2</span>');

  // 高亮加粗
  highlighted = highlighted.replace(/\*\*([^*]+)\*\*/g, '<span class="bold">**$1**</span>');

  // 高亮斜体
  highlighted = highlighted.replace(/\*([^*]+)\*/g, '<span class="italic">*$1*</span>');

  // 高亮代码
  highlighted = highlighted.replace(/`([^`]+)`/g, '<span class="code">`$1`</span>');

  // 高亮链接
  highlighted = highlighted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="link">[$1]($2)</span>');

  return highlighted;
}

export default {
  extractHeadings,
  generateHeadingId,
  extractCodeBlocks,
  extractLinks,
  extractImages,
  extractTables,
  extractTags,
  extractExcerpt,
  calculateReadingTime,
  validateMarkdown,
  cleanMarkdown,
  markdownToPlainText,
  detectLanguage,
  getMarkdownStats,
  generateMarkdownPreview,
  highlightMarkdownSyntax,
};
