/**
 * 博客相关工具函数
 * 提供博客文章处理、格式化、验证等功能
 */

import { Post, Category, Tag } from '@/types';

/**
 * 格式化文章摘要
 * @param content 文章内容
 * @param maxLength 最大长度
 * @returns 格式化后的摘要
 */
export function formatExcerpt(content: string, maxLength: number = 200): string {
  if (!content) return '';

  // 移除 HTML 标签
  const text = content.replace(/<[^>]*>/g, '').trim();

  // 截断文本
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trim() + '...';
}

/**
 * 计算阅读时间
 * @param content 文章内容
 * @param wordsPerMinute 每分钟阅读字数
 * @returns 阅读时间（分钟）
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  if (!content) return 0;

  // 移除 HTML 标签和空白字符
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
  const wordCount = text.trim().split(' ').length;

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * 格式化文章发布时间
 * @param date 发布日期
 * @returns 相对时间字符串
 */
export function formatPublishDate(date: string | Date): string {
  const now = new Date();
  const publishDate = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((now.getTime() - publishDate.getTime()) / 1000);

  const intervals = {
    年: 31536000,
    个月: 2592000,
    周: 604800,
    天: 86400,
    小时: 3600,
    分钟: 60,
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval}${unit}前`;
    }
  }

  return '刚刚';
}

/**
 * 生成文章URL
 * @param slug 文章slug
 * @returns 文章URL
 */
export function getPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

/**
 * 生成分类URL
 * @param slug 分类slug
 * @returns 分类URL
 */
export function getCategoryUrl(slug: string): string {
  return `/blog/category/${slug}`;
}

/**
 * 生成标签URL
 * @param slug 标签slug
 * @returns 标签URL
 */
export function getTagUrl(slug: string): string {
  return `/blog/tag/${slug}`;
}

/**
 * 提取文章中的图片
 * @param content 文章内容
 * @returns 图片URL数组
 */
export function extractImages(content: string): string[] {
  if (!content) return [];

  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1]) {
      images.push(match[1]);
    }
  }

  return images;
}

/**
 * 提取文章的第一张图片作为封面
 * @param content 文章内容
 * @returns 图片URL或null
 */
export function extractFeaturedImage(content: string): string | null {
  const images = extractImages(content);
  return images.length > 0 ? images[0] : null;
}

/**
 * 验证文章数据
 * @param post 文章对象
 * @returns 验证结果
 */
export function validatePost(post: Partial<Post>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!post.title || post.title.trim().length === 0) {
    errors.push('文章标题不能为空');
  }

  if (!post.content || post.content.trim().length === 0) {
    errors.push('文章内容不能为空');
  }

  if (!post.slug || post.slug.trim().length === 0) {
    errors.push('文章slug不能为空');
  }

  if (post.excerpt && post.excerpt.length > 500) {
    errors.push('文章摘要不能超过500字符');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 生成文章slug
 * @param title 文章标题
 * @returns slug字符串
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * 过滤已发布的文章
 * @param posts 文章数组
 * @returns 已发布的文章
 */
export function filterPublishedPosts(posts: Post[]): Post[] {
  return posts.filter(post => post.status === 'published');
}

/**
 * 按日期排序文章
 * @param posts 文章数组
 * @param order 排序顺序
 * @returns 排序后的文章
 */
export function sortPostsByDate(
  posts: Post[],
  order: 'desc' | 'asc' = 'desc'
): Post[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * 按浏览量排序文章
 * @param posts 文章数组
 * @returns 排序后的文章
 */
export function sortPostsByViews(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
}

/**
 * 获取相关文章
 * @param post 当前文章
 * @param allPosts 所有文章
 * @param limit 返回数量
 * @returns 相关文章列表
 */
export function getRelatedPosts(
  post: Post,
  allPosts: Post[],
  limit: number = 4
): Post[] {
  // 排除当前文章
  const otherPosts = allPosts.filter(p => p.id !== post.id);

  // 计算相关度分数
  const scoredPosts = otherPosts.map(p => ({
    post: p,
    score: calculateRelevanceScore(post, p),
  }));

  // 按分数排序并返回前N篇
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * 计算两篇文章的相关度分数
 */
function calculateRelevanceScore(post1: Post, post2: Post): number {
  let score = 0;

  // 相同分类
  if (post1.category?.id === post2.category?.id) {
    score += 10;
  }

  // 相同标签
  const commonTags = post1.tags?.filter(tag1 =>
    post2.tags?.some(tag2 => tag1.id === tag2.id)
  );
  score += (commonTags?.length || 0) * 5;

  // 相同作者
  if (post1.author?.id === post2.author?.id) {
    score += 3;
  }

  return score;
}

/**
 * 搜索文章
 * @param posts 文章数组
 * @param query 搜索关键词
 * @returns 匹配的文章
 */
export function searchPosts(posts: Post[], query: string): Post[] {
  if (!query.trim()) return posts;

  const lowerQuery = query.toLowerCase();

  return posts.filter(post => {
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt?.toLowerCase().includes(lowerQuery) ||
      post.content?.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * 按分类筛选文章
 * @param posts 文章数组
 * @param categorySlug 分类slug
 * @returns 筛选后的文章
 */
export function filterByCategory(posts: Post[], categorySlug: string): Post[] {
  return posts.filter(post => post.category?.slug === categorySlug);
}

/**
 * 按标签筛选文章
 * @param posts 文章数组
 * @param tagSlug 标签slug
 * @returns 筛选后的文章
 */
export function filterByTag(posts: Post[], tagSlug: string): Post[] {
  return posts.filter(post =>
    post.tags?.some(tag => tag.slug === tagSlug)
  );
}

/**
 * 分页文章
 * @param posts 文章数组
 * @param page 当前页码
 * @param perPage 每页数量
 * @returns 分页结果
 */
export function paginatePosts(
  posts: Post[],
  page: number = 1,
  perPage: number = 10
): {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
} {
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  return {
    posts: posts.slice(startIndex, endIndex),
    totalPages,
    currentPage,
    totalPosts,
  };
}

/**
 * 获取文章统计信息
 * @param posts 文章数组
 * @returns 统计信息
 */
export function getPostsStats(posts: Post[]): {
  total: number;
  published: number;
  draft: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
} {
  return {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0),
    totalLikes: posts.reduce((sum, p) => sum + (p.likes || 0), 0),
    totalComments: posts.reduce((sum, p) => sum + (p.commentCount || 0), 0),
  };
}

/**
 * 格式化文章元数据
 * @param post 文章对象
 * @returns 格式化后的元数据
 */
export function formatPostMeta(post: Post): {
  title: string;
  description: string;
  image: string | null;
  author: string;
  publishedTime: string;
  modifiedTime?: string;
} {
  return {
    title: post.title,
    description: post.excerpt || formatExcerpt(post.content, 160),
    image: post.featuredImage || extractFeaturedImage(post.content),
    author: post.author?.name || '匿名作者',
    publishedTime: post.publishedAt || post.createdAt,
    modifiedTime: post.updatedAt,
  };
}
