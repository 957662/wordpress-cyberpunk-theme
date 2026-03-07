/**
 * Blog Data Adapter
 *
 * 将 WordPress 数据转换为应用所需的格式
 */

import { Post, Category, Tag, Comment, User, Media } from './wordpress-api';

// ============================================================================
// Type Definitions
// ============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  categories: BlogCategory[];
  tags: BlogTag[];
  date: string;
  modifiedDate: string;
  link: string;
  commentCount?: number;
  views?: number;
  readingTime?: number;
  sticky?: boolean;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  link: string;
}

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  count: number;
  link: string;
}

export interface BlogComment {
  id: number;
  postId: number;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  date: string;
  parent: number;
  status: string;
}

export interface BlogAuthor {
  id: number;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  link: string;
}

// ============================================================================
// Post Adapters
// ============================================================================

export function adaptPost(wpPost: Post): BlogPost {
  return {
    id: String(wpPost.id),
    title: wpPost.title.rendered,
    slug: wpPost.slug,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
    content: wpPost.content.rendered,
    featuredImage: wpPost.featured_media ? String(wpPost.featured_media) : undefined,
    author: {
      id: wpPost.author,
      name: 'Author', // 需要从用户数据获取
    },
    categories: wpPost.categories.map(id => ({
      id,
      name: '', // 需要从分类数据获取
      slug: '',
      description: '',
      count: 0,
      link: '',
    })),
    tags: wpPost.tags.map(id => ({
      id,
      name: '', // 需要从标签数据获取
      slug: '',
      count: 0,
      link: '',
    })),
    date: wpPost.date,
    modifiedDate: wpPost.modified,
    link: wpPost.link,
    sticky: wpPost.sticky,
  };
}

export function adaptPosts(wpPosts: Post[]): BlogPost[] {
  return wpPosts.map(adaptPost);
}

export function adaptPostWithRelated(
  wpPost: Post,
  categories: Category[],
  tags: Tag[],
  users: User[]
): BlogPost {
  const post = adaptPost(wpPost);

  // 填充分类信息
  post.categories = wpPost.categories
    .map(catId => categories.find(c => c.id === catId))
    .filter((c): c is Category => c !== undefined)
    .map(adaptCategory);

  // 填充标签信息
  post.tags = wpPost.tags
    .map(tagId => tags.find(t => t.id === tagId))
    .filter((t): t is Tag => t !== undefined)
    .map(adaptTag);

  // 填充作者信息
  const author = users.find(u => u.id === wpPost.author);
  if (author) {
    post.author = adaptAuthor(author);
  }

  return post;
}

// ============================================================================
// Category Adapters
// ============================================================================

export function adaptCategory(wpCategory: Category): BlogCategory {
  return {
    id: wpCategory.id,
    name: wpCategory.name,
    slug: wpCategory.slug,
    description: wpCategory.description,
    count: wpCategory.count,
    link: wpCategory.link,
  };
}

export function adaptCategories(wpCategories: Category[]): BlogCategory[] {
  return wpCategories.map(adaptCategory);
}

// ============================================================================
// Tag Adapters
// ============================================================================

export function adaptTag(wpTag: Tag): BlogTag {
  return {
    id: wpTag.id,
    name: wpTag.name,
    slug: wpTag.slug,
    count: wpTag.count,
    link: wpTag.link,
  };
}

export function adaptTags(wpTags: Tag[]): BlogTag[] {
  return wpTags.map(adaptTag);
}

// ============================================================================
// Comment Adapters
// ============================================================================

export function adaptComment(wpComment: Comment): BlogComment {
  return {
    id: wpComment.id,
    postId: wpComment.post,
    author: {
      name: wpComment.author_name,
      avatar: wpComment.author_avatar_urls?.['24'],
      url: wpComment.author_url,
    },
    content: wpComment.content.rendered,
    date: wpComment.date,
    parent: wpComment.parent,
    status: wpComment.status,
  };
}

export function adaptComments(wpComments: Comment[]): BlogComment[] {
  return wpComments.map(adaptComment);
}

// ============================================================================
// Author Adapters
// ============================================================================

export function adaptAuthor(wpUser: User): BlogAuthor {
  return {
    id: wpUser.id,
    name: wpUser.name,
    slug: wpUser.slug,
    description: wpUser.description,
    avatar: wpUser.avatar_urls?.['96'],
    link: wpUser.link,
  };
}

export function adaptAuthors(wpUsers: User[]): BlogAuthor[] {
  return wpUsers.map(adaptAuthor);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * 计算阅读时间（分钟）
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>/g, '').trim();
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * 格式化日期
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 7) return `${diffDays}天前`;
  return formatDate(dateString);
}

/**
 * 提取摘要
 */
export function extractExcerpt(content: string, maxLength = 200): string {
  const text = content.replace(/<[^>]*>/g, '').trim();
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * 获取特色图片 URL
 */
export function getFeaturedImageUrl(mediaId: string | number, mediaItems: Media[]): string {
  const id = typeof mediaId === 'string' ? parseInt(mediaId) : mediaId;
  const media = mediaItems.find(m => m.id === id);
  return media?.source_url || '/placeholder-image.jpg';
}

// ============================================================================
// Batch Adapters
// ============================================================================

/**
 * 批量适配文章（包含相关数据）
 */
export function adaptPostsWithRelated(
  wpPosts: Post[],
  categories: Category[],
  tags: Tag[],
  users: User[]
): BlogPost[] {
  return wpPosts.map(post =>
    adaptPostWithRelated(post, categories, tags, users)
  );
}

/**
 * 从文章列表中提取所有分类和标签 ID
 */
export function extractTaxonomyIds(posts: Post[]): {
  categoryIds: number[];
  tagIds: number[];
  authorIds: number[];
  mediaIds: number[];
} {
  const categoryIds = new Set<number>();
  const tagIds = new Set<number>();
  const authorIds = new Set<number>();
  const mediaIds = new Set<number>();

  posts.forEach(post => {
    post.categories.forEach(id => categoryIds.add(id));
    post.tags.forEach(id => tagIds.add(id));
    authorIds.add(post.author);
    if (post.featured_media) {
      mediaIds.add(post.featured_media);
    }
  });

  return {
    categoryIds: Array.from(categoryIds),
    tagIds: Array.from(tagIds),
    authorIds: Array.from(authorIds),
    mediaIds: Array.from(mediaIds),
  };
}

export default {
  adaptPost,
  adaptPosts,
  adaptPostWithRelated,
  adaptPostsWithRelated,
  adaptCategory,
  adaptCategories,
  adaptTag,
  adaptTags,
  adaptComment,
  adaptComments,
  adaptAuthor,
  adaptAuthors,
  calculateReadingTime,
  formatDate,
  formatRelativeTime,
  extractExcerpt,
  getFeaturedImageUrl,
  extractTaxonomyIds,
};
