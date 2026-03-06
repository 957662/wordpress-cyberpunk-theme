/**
 * Blog Formatters
 * 博客数据格式化工具函数
 */

/**
 * 计算文章阅读时间（基于字数）
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  // 移除 HTML 标签
  const textContent = content.replace(/<[^>]*>/g, '');
  // 计算字数（中文按字符计算，英文按单词计算）
  const chineseChars = textContent.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishWords = textContent.match(/[a-zA-Z]+/g)?.length || 0;
  const totalWords = chineseChars + englishWords;

  return Math.ceil(totalWords / wordsPerMinute);
}

/**
 * 格式化文章摘要
 */
export function formatExcerpt(content: string, maxLength: number = 160): string {
  // 移除 HTML 标签
  const textContent = content.replace(/<[^>]*>/g, '');
  // 截断并添加省略号
  if (textContent.length <= maxLength) {
    return textContent;
  }
  return textContent.slice(0, maxLength).trim() + '...';
}

/**
 * 提取文章中的第一张图片
 */
export function extractFirstImage(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

/**
 * 提取文章中的所有图片
 */
export function extractAllImages(content: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    images.push(match[1]);
  }

  return images;
}

/**
 * 格式化分类 URL
 */
export function formatCategoryUrl(slug: string): string {
  return `/blog/category/${slug}`;
}

/**
 * 格式化标签 URL
 */
export function formatTagUrl(slug: string): string {
  return `/blog/tag/${slug}`;
}

/**
 * 格式化作者 URL
 */
export function formatAuthorUrl(username: string): string {
  return `/blog/author/${username}`;
}

/**
 * 生成文章分享 URL
 */
export function generateShareUrl(slug: string, baseUrl: string = ''): string {
  return `${baseUrl}/blog/${slug}`;
}

/**
 * 格式化文章 SEO 标题
 */
export function formatSEOTitle(title: string, siteName: string = ''): string {
  return siteName ? `${title} - ${siteName}` : title;
}

/**
 * 格式化文章 SEO 描述
 */
export function formatSEODescription(excerpt: string, maxLength: number = 160): string {
  return formatExcerpt(excerpt, maxLength);
}

/**
 * 生成文章关键词
 */
export function generateKeywords(
  title: string,
  tags: string[],
  category: string
): string[] {
  const keywords: string[] = [];

  // 从标题中提取关键词
  const titleWords = title.split(/\s+/).filter(word => word.length > 3);
  keywords.push(...titleWords.slice(0, 3));

  // 添加分类
  if (category) {
    keywords.push(category);
  }

  // 添加标签
  keywords.push(...tags);

  // 去重并返回
  return Array.from(new Set(keywords));
}
