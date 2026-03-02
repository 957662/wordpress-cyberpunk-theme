/**
 * 文本处理工具函数
 * 提供各种文本格式化、处理和验证功能
 */

/**
 * 截断文本到指定长度
 * @param text - 要截断的文本
 * @param maxLength - 最大长度
 * @param suffix - 后缀（默认 "..."）
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 生成文本摘要
 * @param text - 原始文本
 * @param maxLength - 最大长度（默认 150）
 * @param sentences - 是否保留完整句子（默认 true）
 */
export function generateExcerpt(
  text: string,
  maxLength: number = 150,
  sentences: boolean = true
): string {
  // 移除 HTML 标签
  const cleanText = text.replace(/<[^>]*>/g, '').trim();

  if (cleanText.length <= maxLength) return cleanText;

  if (sentences) {
    // 尝试在句子边界处截断
    const sentenceEnd = cleanText.substring(0, maxLength).search(/[.!?。！？]([^a-z]|$)/);
    if (sentenceEnd > maxLength * 0.5) {
      return cleanText.substring(0, sentenceEnd + 1).trim();
    }
  }

  return truncateText(cleanText, maxLength);
}

/**
 * 计算预计阅读时间
 * @param content - 文章内容
 * @param wordsPerMinute - 每分钟阅读速度（默认 200）
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): {
  minutes: number;
  text: string;
  seconds?: number;
} {
  // 移除 HTML 标签和多余空白
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
  const wordCount = cleanContent.trim().split(/\s+/).length;

  // 中文字符按字符计算，英文按单词计算
  const chineseChars = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = wordCount - chineseChars;

  // 中文每分钟约 500 字，英文每分钟约 200 词
  const totalMinutes = Math.ceil(chineseChars / 500 + englishWords / wordsPerMinute);
  const minutes = Math.max(1, totalMinutes);

  let text = `${minutes} 分钟`;
  if (minutes < 1) {
    const seconds = Math.ceil(minutes * 60);
    text = `${seconds} 秒`;
    return { minutes: 0, text, seconds };
  }

  return { minutes, text };
}

/**
 * 格式化字数统计
 * @param content - 文章内容
 */
export function countWords(content: string): {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  chinese: number;
  english: number;
} {
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const words = cleanContent.trim().split(/\s+/).filter(w => w.length > 0).length;
  const characters = cleanContent.length;
  const charactersNoSpaces = cleanContent.replace(/\s/g, '').length;
  const chinese = (cleanContent.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = words - chinese;

  return { words, characters, charactersNoSpaces, chinese, english };
}

/**
 * 高亮搜索关键词
 * @param text - 原始文本
 * @param query - 搜索关键词
 * @param className - 高亮样式类名
 */
export function highlightKeywords(
  text: string,
  query: string,
  className: string = 'bg-cyber-cyan/20 text-cyber-cyan'
): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, `<mark class="${className}">$1</mark>`);
}

/**
 * 标题化文本（首字母大写）
 * @param text - 要转换的文本
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * 转换为 URL 友好的 slug
 * @param text - 要转换的文本
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除首尾连字符
}

/**
 * 从 slug 恢复标题
 * @param slug - URL slug
 */
export function slugToTitle(slug: string): string {
  return toTitleCase(slug.replace(/-/g, ' '));
}

/**
 * 提取文本中的所有链接
 * @param text - 包含链接的文本
 */
export function extractLinks(text: string): Array<{ url: string; text: string }> {
  const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([^<]+)<\/a>/gi;
  const links: Array<{ url: string; text: string }> = [];
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    links.push({ url: match[1], text: match[2] });
  }

  return links;
}

/**
 * 移除 Markdown 语法
 * @param text - Markdown 文本
 */
export function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, '') // 标题
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 粗体
    .replace(/\*([^*]+)\*/g, '$1') // 斜体
    .replace(/`([^`]+)`/g, '$1') // 行内代码
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // 图片
    .replace(/^\s*[-*+]\s+/gm, '') // 列表
    .replace(/^\s*\d+\.\s+/gm, '') // 有序列表
    .replace(/>/g, '') // 引用
    .trim();
}

/**
 * 生成文章的分段阅读索引
 * @param content - 文章内容
 * @param sectionCount - 分段数量
 */
export function generateSections(
  content: string,
  sectionCount: number = 5
): Array<{ title: string; index: number; percentage: number }> {
  // 提取标题作为分段点
  const headingRegex = /^(#{1,2})\s+(.+)$/gm;
  const headings: Array<{ level: number; title: string; index: number }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      title: match[2].trim(),
      index: match.index,
    });
  }

  if (headings.length === 0) return [];

  // 选择均匀分布的标题
  const step = Math.max(1, Math.floor(headings.length / sectionCount));
  const selectedHeadings = headings.filter((_, i) => i % step === 0);

  return selectedHeadings.map((h, i) => ({
    title: h.title,
    index: h.index,
    percentage: Math.round((i / (selectedHeadings.length - 1)) * 100),
  }));
}

/**
 * 检测文本语言
 * @param text - 要检测的文本
 */
export function detectLanguage(text: string): 'zh' | 'en' | 'mixed' {
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const total = chineseChars + englishWords;

  if (total === 0) return 'en';

  const chineseRatio = chineseChars / total;

  if (chineseRatio > 0.6) return 'zh';
  if (chineseRatio < 0.3) return 'en';
  return 'mixed';
}

/**
 * 文本相似度计算（用于相关文章推荐）
 * @param text1 - 文本1
 * @param text2 - 文本2
 */
export function calculateSimilarity(text1: string, text2: string): number {
  const cleanText1 = text1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  const cleanText2 = text2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);

  const set1 = new Set(cleanText1);
  const set2 = new Set(cleanText2);

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * 提取关键词
 * @param text - 文本内容
 * @param count - 提取数量
 */
export function extractKeywords(text: string, count: number = 10): string[] {
  // 移除 HTML 和常见停用词
  const cleanText = text
    .replace(/<[^>]*>/g, '')
    .toLowerCase();

  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    '的', '了', '是', '在', '和', '有', '我', '你', '他', '她', '它'
  ]);

  const words = cleanText
    .split(/[\s,.;:!?()""''【】《》、。，；：！？]+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // 统计词频
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  // 排序并返回前 N 个
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}

/**
 * 导出所有工具函数
 */
export default {
  truncateText,
  generateExcerpt,
  calculateReadingTime,
  countWords,
  highlightKeywords,
  toTitleCase,
  toSlug,
  slugToTitle,
  extractLinks,
  stripMarkdown,
  generateSections,
  detectLanguage,
  calculateSimilarity,
  extractKeywords,
};
