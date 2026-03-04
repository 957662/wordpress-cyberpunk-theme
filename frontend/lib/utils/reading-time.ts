import { READING_TIME } from '@/lib/constants';

/**
 * 计算文章的阅读时间（分钟）
 * @param content 文章内容（HTML 或纯文本）
 * @param imageCount 图片数量
 */
export function calculateReadingTime(
  content: string,
  imageCount: number = 0
): number {
  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, '');

  // 计算字数（中文按字符计算，英文按单词计算）
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  const totalWords = chineseChars + englishWords;

  // 基础阅读时间
  const readingTime = totalWords / READING_TIME.WORDS_PER_MINUTE;

  // 加上图片的额外时间
  const imageTime = imageCount * READING_TIME.MIN_IMAGE_TIME;

  // 总时间（向上取整）
  return Math.ceil(readingTime + imageTime);
}

/**
 * 计算文章的字数
 * @param content 文章内容（HTML 或纯文本）
 */
export function countWords(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
}

/**
 * 格式化阅读时间为友好的显示格式
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return '1 分钟';
  if (minutes < 60) return `${Math.round(minutes)} 分钟`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `${hours} 小时`;
  return `${hours} 小时 ${remainingMinutes} 分钟`;
}
