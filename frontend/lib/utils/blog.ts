/**
 * Blog Utilities
 * 博客工具函数
 */

/**
 * 计算文章阅读时间（分钟）
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * 格式化相对时间（如 "3天前"）
 */
export function formatRelativeTime(date: string | Date, locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const intervals = [
    { unit: 'year' as const, seconds: 31536000 },
    { unit: 'month' as const, seconds: 2592000 },
    { unit: 'day' as const, seconds: 86400 },
    { unit: 'hour' as const, seconds: 3600 },
    { unit: 'minute' as const, seconds: 60 },
  ];

  for (const { unit, seconds } of intervals) {
    const value = Math.floor(diffInSeconds / seconds);
    if (value >= 1) {
      return rtf.format(-value, unit);
    }
  }

  return rtf.format(-diffInSeconds, 'second');
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * 生成文章摘要
 */
export function generateExcerpt(content: string, maxLength = 150): string {
  // 移除 Markdown 标记
  const cleanContent = content
    .replace(/^#+\s+/gm, '') // 标题
    .replace(/\*\*/g, '') // 粗体
    .replace(/\*/g, '') // 斜体
    .replace(/`/g, '') // 代码
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 图片
    .replace(/\n+/g, ' ') // 换行
    .trim();

  return truncateText(cleanContent, maxLength);
}

/**
 * 从文章内容提取第一个图片 URL
 */
export function extractFirstImage(content: string): string | null {
  // Markdown 图片语法: ![alt](url)
  const markdownImageRegex = /!\[.*?\]\((.*?)\)/;
  const match = content.match(markdownImageRegex);
  if (match && match[1]) {
    return match[1];
  }

  // HTML img 标签
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/i;
  const htmlMatch = content.match(htmlImageRegex);
  if (htmlMatch && htmlMatch[1]) {
    return htmlMatch[1];
  }

  return null;
}

/**
 * 生成 SEO 友好的 slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 验证 slug 格式
 */
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}

/**
 * 从 URL 提取 slug
 */
export function extractSlugFromUrl(url: string): string {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
}

/**
 * 计算文章热度（基于浏览量、评论数等）
 */
export function calculatePostScore(
  views: number,
  comments: number,
  likes: number,
  publishedAt: string | Date
): number {
  const daysSincePublish = Math.floor(
    (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // 时间衰减因子
  const timeDecay = Math.max(0.1, 1 - daysSincePublish * 0.01);

  // 加权计算
  const score = (views * 1 + comments * 10 + likes * 5) * timeDecay;

  return Math.round(score);
}

/**
 * 获取文章分类颜色
 */
export function getCategoryColor(categoryName: string): string {
  const colorMap: Record<string, string> = {
    技术: '#00f0ff', // cyber-cyan
    design: '#00f0ff',
    设计: '#9d00ff', // cyber-purple
    教程: '#ff0080', // cyber-pink
    tutorial: '#ff0080',
    随笔: '#f0ff00', // cyber-yellow
    thoughts: '#f0ff00',
    公告: '#00ff9f', // cyber-green
    news: '#00ff9f',
  };

  return colorMap[categoryName] || '#00f0ff';
}

/**
 * 格式化文章元数据
 */
export interface PostMetadata {
  readingTime: number;
  formattedDate: string;
  relativeTime: string;
  excerpt: string;
  firstImage: string | null;
}

export function formatPostMetadata(
  content: string,
  date: string | Date
): PostMetadata {
  return {
    readingTime: calculateReadingTime(content),
    formattedDate: formatDate(date),
    relativeTime: formatRelativeTime(date),
    excerpt: generateExcerpt(content),
    firstImage: extractFirstImage(content),
  };
}

/**
 * 获取相关文章
 */
export interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  score: number;
}

export function getRelatedPosts(
  currentPostId: number,
  allPosts: Array<{
    id: number;
    title: string;
    slug: string;
    categories?: number[];
    tags?: number[];
  }>,
  currentPostCategories?: number[],
  currentPostTags?: number[],
  limit = 4
): RelatedPost[] {
  const scoredPosts = allPosts
    .filter((post) => post.id !== currentPostId)
    .map((post) => {
      let score = 0;

      // 分类匹配
      if (currentPostCategories && post.categories) {
        const commonCategories = currentPostCategories.filter((cat) =>
          post.categories?.includes(cat)
        );
        score += commonCategories.length * 10;
      }

      // 标签匹配
      if (currentPostTags && post.tags) {
        const commonTags = currentPostTags.filter((tag) => post.tags?.includes(tag));
        score += commonTags.length * 5;
      }

      // 标题相似度（简单的词匹配）
      const currentWords = currentPostId.toString().toLowerCase().split(/\s+/);
      const postWords = post.title.toLowerCase().split(/\s+/);
      const commonWords = currentWords.filter((word) => postWords.includes(word));
      score += commonWords.length * 2;

      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scoredPosts;
}

/**
 * 构建分页信息
 */
export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  pages: number[];
}

export function buildPagination(
  currentPage: number,
  totalPages: number,
  maxVisible = 5
): PaginationInfo {
  const pages: number[] = [];
  const halfVisible = Math.floor(maxVisible / 2);

  let startPage = Math.max(1, currentPage - halfVisible);
  let endPage = Math.min(totalPages, currentPage + halfVisible);

  if (currentPage <= halfVisible) {
    endPage = Math.min(totalPages, maxVisible);
  }

  if (currentPage + halfVisible >= totalPages) {
    startPage = Math.max(1, totalPages - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return {
    currentPage,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null,
    pages,
  };
}

/**
 * 清理和验证 URL
 */
export function cleanUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.href;
  } catch {
    return '';
  }
}

/**
 * 检查 URL 是否为外部链接
 */
export function isExternalUrl(url: string, baseUrl?: string): boolean {
  try {
    const urlObj = new URL(url, baseUrl);
    if (baseUrl) {
      const baseObj = new URL(baseUrl);
      return urlObj.origin !== baseObj.origin;
    }
    return urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:';
  } catch {
    return false;
  }
}

/**
 * 生成分享链接
 */
export function generateShareLinks(
  title: string,
  url: string,
  description?: string
): Record<string, string> {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`,
  };
}
