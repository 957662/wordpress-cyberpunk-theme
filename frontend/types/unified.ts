/**
 * 统一类型定义
 * 解决不同来源的类型冲突
 */

import type { BlogPost as WordPressBlogPost } from '@/types/models/blog';
import type { BlogPost as AdapterBlogPost } from '@/lib/adapters/blog-adapter';

/**
 * 统一的博客文章类型
 * 整合所有来源的博客文章字段
 */
export interface UnifiedBlogPost {
  // 基础字段
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;

  // 作者信息
  author: {
    id?: number;
    name: string;
    avatar?: string;
    slug?: string;
    bio?: string;
    website?: string;
  };

  // 分类和标签
  category?: {
    id?: number;
    name: string;
    slug: string;
    color?: string;
  };
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
    description?: string;
    count?: number;
  }>;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
    count?: number;
  }>;

  // 媒体
  featuredImage?: string;

  // 时间
  publishedAt: string;
  modifiedAt?: string;
  date?: string;

  // 统计
  views?: number;
  likes?: number;
  comments?: number;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;

  // 阅读相关
  readingTime?: number;
  readTime?: number;

  // 状态
  status: 'draft' | 'publish' | 'private' | 'pending';
  format?: string;
  sticky?: boolean;

  // 链接
  link?: string;
}

/**
 * 统一的评论类型
 */
export interface UnifiedComment {
  id: number;
  postId: number;
  author: {
    name: string;
    email?: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  parentId?: number;
  status: 'approved' | 'pending' | 'spam';
  replies?: UnifiedComment[];
}

/**
 * 统一的用户类型
 */
export interface UnifiedUser {
  id: number;
  name: string;
  slug: string;
  email?: string;
  avatar?: string;
  bio?: string;
  website?: string;
  role?: 'admin' | 'editor' | 'author' | 'subscriber';
}

/**
 * 统一的分页类型
 */
export interface UnifiedPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * 统一的 API 响应类型
 */
export interface UnifiedApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  pagination?: UnifiedPagination;
}

/**
 * 统一的搜索结果类型
 */
export interface UnifiedSearchResult {
  posts: UnifiedBlogPost[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 类型守卫
 */
export function isUnifiedBlogPost(obj: any): obj is UnifiedBlogPost {
  return (
    obj &&
    typeof obj === 'object' &&
    (typeof obj.id === 'string' || typeof obj.id === 'number') &&
    typeof obj.title === 'string' &&
    typeof obj.slug === 'string' &&
    typeof obj.content === 'string'
  );
}

/**
 * 转换为统一类型
 */
export function toUnifiedBlogPost(post: WordPressBlogPost | AdapterBlogPost | any): UnifiedBlogPost {
  // 如果已经是统一类型
  if (isUnifiedBlogPost(post)) {
    return post;
  }

  // 转换逻辑
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content || '',
    author: {
      id: post.author?.id,
      name: post.author?.name || '未知作者',
      avatar: post.author?.avatar,
      slug: post.author?.slug,
      bio: post.author?.bio,
      website: post.author?.website,
    },
    category: post.category,
    categories: post.categories || [],
    tags: post.tags || [],
    featuredImage: post.featuredImage,
    publishedAt: post.publishedAt || post.date || new Date().toISOString(),
    modifiedAt: post.modifiedAt || post.updatedAt,
    views: post.views || post.viewCount || 0,
    likes: post.likes || post.likeCount || 0,
    comments: post.comments || post.commentCount || 0,
    readingTime: post.readingTime || post.readTime || 0,
    status: post.status || 'publish',
    format: post.format,
    sticky: post.sticky || false,
    link: post.link,
  };
}

/**
 * 批量转换
 */
export function toUnifiedBlogPostList(posts: any[]): UnifiedBlogPost[] {
  return posts.map(post => toUnifiedBlogPost(post));
}

/**
 * 导出所有类型
 */
export type {
  UnifiedBlogPost as BlogPost,
  UnifiedComment as Comment,
  UnifiedUser as User,
  UnifiedPagination as Pagination,
  UnifiedApiResponse as ApiResponse,
  UnifiedSearchResult as SearchResult,
};
