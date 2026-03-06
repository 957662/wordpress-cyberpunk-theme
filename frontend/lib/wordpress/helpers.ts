/**
 * WordPress 数据适配器和辅助函数
 * 将 WordPress API 数据转换为应用内部格式
 */

import type {
  WPPost,
  WPCategory,
  WPTag,
  WPComment,
  WPUser,
  WPEmbedded,
} from '@/types/api';
import type { BlogPost, Category, Tag, Author, Comment } from '@/types/models';
import { formatDate } from '@/lib/utils';

// ============================================
// Post Adapter
// ============================================

export interface PostAdapter {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  category: string | null;
  categories: number[];
  tags: number[];
  author: string;
  authorId: number;
  authorAvatar?: string;
  date: string;
  modifiedDate?: string;
  readingTime: number;
  views?: number;
  likes?: number;
  commentCount?: number;
  status: 'publish' | 'draft' | 'pending' | 'private';
  type: 'post' | 'page';
}

/**
 * 将 WordPress Post 转换为应用内部格式
 */
export function adaptWPPost(post: WPPost): PostAdapter {
  // 提取嵌入数据
  const embedded = post._embedded as WPEmbedded | undefined;

  // 获取作者信息
  const authorData = embedded?.author?.[0];
  const author = authorData?.name || 'Unknown';
  const authorId = authorData?.id || 0;
  const authorAvatar = authorData?.avatar_urls?.['24'];

  // 获取特色图片
  const featuredMedia = embedded?.['wp:featuredmedia']?.[0];
  const featuredImage = featuredMedia?.source_url || featuredMedia?.media_details?.sizes?.full?.source_url || null;

  // 获取分类
  const categories = post.categories || [];
  const categoryNames = embedded?.['wp:term']?.[0];
  const category = categoryNames?.[0]?.name || null;

  // 获取标签
  const tags = post.tags || [];

  // 获取评论数
  const commentCount = embedded?.replies?.[0]?.length || 0;

  // 计算阅读时间（基于内容长度）
  const contentText = post.content?.rendered?.replace(/<[^>]*>/g, '') || '';
  const wordCount = contentText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return {
    id: String(post.id),
    title: post.title?.rendered || '',
    slug: post.slug,
    excerpt: post.excerpt?.rendered || null,
    content: post.content?.rendered || '',
    featuredImage,
    category,
    categories,
    tags,
    author,
    authorId,
    authorAvatar,
    date: post.date,
    modifiedDate: post.modified,
    readingTime,
    views: undefined, // 需要从其他API获取
    likes: undefined, // 需要从其他API获取
    commentCount,
    status: post.status,
    type: post.type,
  };
}

/**
 * 批量转换文章列表
 */
export function adaptWPPosts(posts: WPPost[]): PostAdapter[] {
  return posts.map(adaptWPPost);
}

// ============================================
// Category Adapter
// ============================================

export interface CategoryAdapter {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
}

/**
 * 转换分类数据
 */
export function adaptWPCategory(category: WPCategory): CategoryAdapter {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || '',
    count: category.count,
    parent: category.parent,
  };
}

export function adaptWPCategories(categories: WPCategory[]): CategoryAdapter[] {
  return categories.map(adaptWPCategory);
}

// ============================================
// Tag Adapter
// ============================================

export interface TagAdapter {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

/**
 * 转换标签数据
 */
export function adaptWPTag(tag: WPTag): TagAdapter {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description || '',
    count: tag.count,
  };
}

export function adaptWPTags(tags: WPTag[]): TagAdapter[] {
  return tags.map(adaptWPTag);
}

// ============================================
// Author Adapter
// ============================================

export interface AuthorAdapter {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar: string;
  url?: string;
}

/**
 * 转换作者数据
 */
export function adaptWPAuthor(user: WPUser): AuthorAdapter {
  return {
    id: user.id,
    name: user.name,
    slug: user.slug,
    description: user.description || '',
    avatar: user.avatar_urls?.['96'] || user.avatar_urls?.['24'] || '',
    url: user.url,
  };
}

// ============================================
// Comment Adapter
// ============================================

export interface CommentAdapter {
  id: number;
  postId: number;
  parentId: number;
  author: string;
  authorEmail?: string;
  authorUrl?: string;
  authorAvatar?: string;
  content: string;
  date: string;
  status: string;
  type?: string;
  replies?: CommentAdapter[];
}

/**
 * 转换评论数据
 */
export function adaptWPComment(comment: WPComment, embedded?: WPEmbedded): CommentAdapter {
  const authorAvatar = embedded?.author?.[0]?.avatar_urls?.['24'];

  return {
    id: comment.id,
    postId: comment.post,
    parentId: comment.parent || 0,
    author: comment.author_name,
    authorEmail: comment.author_email,
    authorUrl: comment.author_url,
    authorAvatar,
    content: comment.content?.rendered || '',
    date: comment.date,
    status: comment.status,
    type: comment.type,
  };
}

/**
 * 构建评论树（将嵌套评论转换为树形结构）
 */
export function buildCommentTree(comments: CommentAdapter[]): CommentAdapter[] {
  const commentMap = new Map<number, CommentAdapter>();
  const rootComments: CommentAdapter[] = [];

  // 第一遍：创建映射
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  // 第二遍：构建树
  comments.forEach(comment => {
    const adaptedComment = commentMap.get(comment.id)!;

    if (comment.parentId === 0) {
      rootComments.push(adaptedComment);
    } else {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(adaptedComment);
      }
    }
  });

  return rootComments;
}

// ============================================
// Utility Functions
// ============================================

/**
 * 格式化文章日期
 */
export function formatPostDate(date: string, format: 'short' | 'long' | 'relative' = 'long'): string {
  switch (format) {
    case 'short':
      return formatDate(date, 'yyyy-MM-dd');
    case 'long':
      return formatDate(date, 'yyyy年MM月dd日');
    case 'relative':
      return getRelativeTime(date);
    default:
      return formatDate(date);
  }
}

/**
 * 获取相对时间
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    年: 31536000,
    月: 2592000,
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
 * 截取文本
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 清理 HTML 标签
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * 从 URL 提取图片尺寸
 */
export function getImageUrl(
  imageUrl: string | null | undefined,
  size: 'thumbnail' | 'medium' | 'large' | 'full' = 'medium'
): string | null {
  if (!imageUrl) return null;

  // WordPress 图片 URL 尺寸模式
  const sizePatterns: Record<string, RegExp> = {
    thumbnail: /-\d+x\d+(\.\w+)$/,
    medium: /-\d+x\d+(\.\w+)$/,
    large: /-\d+x\d+(\.\w+)$/,
    full: /-\d+x\d+(\.\w+)$/,
  };

  // 如果 URL 已经包含尺寸，尝试替换
  const pattern = sizePatterns[size];
  if (pattern.test(imageUrl)) {
    // 这里简化处理，实际需要从 WordPress media API 获取正确的尺寸 URL
    return imageUrl;
  }

  return imageUrl;
}

/**
 * 获取文章摘要
 */
export function getExcerpt(content: string, maxLength = 160): string {
  const text = stripHtml(content);
  return truncateText(text, maxLength);
}

/**
 * 验证 slug
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

/**
 * 构建文章 URL
 */
export function buildPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

/**
 * 构建分类 URL
 */
export function buildCategoryUrl(slug: string): string {
  return `/blog?category=${encodeURIComponent(slug)}`;
}

/**
 * 构建标签 URL
 */
export function buildTagUrl(slug: string): string {
  return `/blog?tag=${encodeURIComponent(slug)}`;
}

/**
 * 构建作者 URL
 */
export function buildAuthorUrl(authorId: number): string {
  return `/author/${authorId}`;
}

// 默认导出
const WPHelpers = {
  adaptWPPost,
  adaptWPPosts,
  adaptWPCategory,
  adaptWPCategories,
  adaptWPTag,
  adaptWPTags,
  adaptWPAuthor,
  adaptWPComment,
  buildCommentTree,
  formatPostDate,
  getRelativeTime,
  truncateText,
  stripHtml,
  getImageUrl,
  getExcerpt,
  isValidSlug,
  buildPostUrl,
  buildCategoryUrl,
  buildTagUrl,
  buildAuthorUrl,
};

export default WPHelpers;
