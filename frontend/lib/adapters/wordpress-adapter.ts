/**
 * WordPress 数据适配器
 * 将 WordPress API 数据转换为组件所需的格式
 */

import { WPPost, WPCategory, WPTag, WPAuthor, WPComment } from '@/lib/wordpress-api-enhanced';
import { ArticleCardProps } from '@/components/blog/ArticleCard';
import { BlogCardProps } from '@/components/blog/BlogCard';

// =====================================================
// Post 适配器
// =====================================================

export interface AdaptedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
    id: number;
  };
  categories: Array<{
    name: string;
    slug: string;
    id: number;
    color?: string;
  }>;
  tags?: Array<{
    name: string;
    slug: string;
    id: number;
  }>;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  sticky?: boolean;
  status: string;
}

/**
 * 将 WordPress Post 转换为适配器格式
 */
export function adaptPost(wpPost: WPPost): AdaptedPost {
  // 计算阅读时间
  const wordCount = wpPost.content?.rendered?.split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  // 提取特色图片
  const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url?;

  // 提取作者信息
  const author = wpPost._embedded?.['wp:author']?.[0];
  const authorName = author?.name || '未知作者';
  const authorAvatar = author?.avatar_urls?.['96'];

  // 提取分类
  const categories = (wpPost._embedded?.['wp:term']?.[0] || [])
    .filter((term: any) => term.taxonomy === 'category')
    .map((cat: WPCategory) => ({
      name: cat.name,
      slug: cat.slug,
      id: cat.id,
      color: cat.meta?.['color'] || undefined,
    }));

  // 提取标签
  const tags = (wpPost._embedded?.['wp:term']?.[1] || [])
    .filter((term: any) => term.taxonomy === 'post_tag')
    .map((tag: WPTag) => ({
      name: tag.name,
      slug: tag.slug,
      id: tag.id,
    }));

  return {
    id: String(wpPost.id),
    title: wpPost.title?.rendered?.replace(/<[^>]*>/g, '') || '',
    slug: wpPost.slug,
    excerpt: wpPost.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
    content: wpPost.content?.rendered || '',
    featuredImage,
    author: {
      name: authorName,
      avatar: authorAvatar,
      id: author?.id || 0,
    },
    categories,
    tags,
    publishedAt: wpPost.date || '',
    updatedAt: wpPost.modified || '',
    readTime,
    viewCount: wpPost.meta?.['view_count'] || 0,
    likeCount: wpPost.meta?.['like_count'] || 0,
    commentCount: wpPost.meta?.['comment_count'] || 0,
    sticky: wpPost.sticky || false,
    status: wpPost.status,
  };
}

/**
 * 批量转换 WordPress Posts
 */
export function adaptPosts(wpPosts: WPPost[]): AdaptedPost[] {
  return wpPosts.map(adaptPost);
}

// =====================================================
// ArticleCard 适配器
// =====================================================

/**
 * 将 WordPress Post 转换为 ArticleCard 格式
 */
export function postToArticleCard(wpPost: WPPost, index: number = 0): ArticleCardProps {
  const adapted = adaptPost(wpPost);

  return {
    id: adapted.id,
    title: adapted.title,
    slug: adapted.slug,
    excerpt: adapted.excerpt,
    featuredImage: adapted.featuredImage,
    author: {
      name: adapted.author.name,
      avatar: adapted.author.avatar,
    },
    categories: adapted.categories,
    tags: adapted.tags,
    publishedAt: adapted.publishedAt,
    readTime: adapted.readTime,
    viewCount: adapted.viewCount,
    likeCount: adapted.likeCount,
    commentCount: adapted.commentCount,
    index,
  };
}

/**
 * 批量转换为 ArticleCard 格式
 */
export function postsToArticleCards(wpPosts: WPPost[]): ArticleCardProps[] {
  return wpPosts.map((post, index) => postToArticleCard(post, index));
}

// =====================================================
// BlogCard 适配器
// =====================================================

/**
 * 将 WordPress Post 转换为 BlogCard 格式
 */
export function postToBlogCard(wpPost: WPPost): BlogCardProps {
  const adapted = adaptPost(wpPost);

  return {
    id: adapted.id,
    title: adapted.title,
    slug: adapted.slug,
    excerpt: adapted.excerpt,
    featuredImage: adapted.featuredImage,
    author: adapted.author.name,
    date: adapted.publishedAt,
    readTime: adapted.readTime,
    category: adapted.categories[0]?.name || '未分类',
    categorySlug: adapted.categories[0]?.slug || 'uncategorized',
  };
}

/**
 * 批量转换为 BlogCard 格式
 */
export function postsToBlogCards(wpPosts: WPPost[]): BlogCardProps[] {
  return wpPosts.map(postToBlogCard);
}

// =====================================================
// Category 适配器
// =====================================================

export interface AdaptedCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  color?: string;
  parentId: number;
}

export function adaptCategory(wpCategory: WPCategory): AdaptedCategory {
  return {
    id: wpCategory.id,
    name: wpCategory.name,
    slug: wpCategory.slug,
    description: wpCategory.description || '',
    count: wpCategory.count,
    color: wpCategory.meta?.['color'] || undefined,
    parentId: wpCategory.parent || 0,
  };
}

export function adaptCategories(wpCategories: WPCategory[]): AdaptedCategory[] {
  return wpCategories.map(adaptCategory);
}

// =====================================================
// Tag 适配器
// =====================================================

export interface AdaptedTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export function adaptTag(wpTag: WPTag): AdaptedTag {
  return {
    id: wpTag.id,
    name: wpTag.name,
    slug: wpTag.slug,
    description: wpTag.description || '',
    count: wpTag.count,
  };
}

export function adaptTags(wpTags: WPTag[]): AdaptedTag[] {
  return wpTags.map(adaptTag);
}

// =====================================================
// Author 适配器
// =====================================================

export interface AdaptedAuthor {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar?: string;
  url?: string;
  postCount: number;
}

export function adaptAuthor(wpAuthor: WPAuthor): AdaptedAuthor {
  return {
    id: wpAuthor.id,
    name: wpAuthor.name,
    slug: wpAuthor.slug,
    description: wpAuthor.description || '',
    avatar: wpAuthor.avatar_urls?.['96'],
    url: wpAuthor.link,
    postCount: wpAuthor.meta?.['post_count'] || 0,
  };
}

export function adaptAuthors(wpAuthors: WPAuthor[]): AdaptedAuthor[] {
  return wpAuthors.map(adaptAuthor);
}

// =====================================================
// Comment 适配器
// =====================================================

export interface AdaptedComment {
  id: number;
  postId: number;
  parent: number;
  author: {
    name: string;
    avatar?: string;
    url?: string;
  };
  content: string;
  date: string;
  status: string;
  replies?: AdaptedComment[];
}

export function adaptComment(wpComment: WPComment): AdaptedComment {
  return {
    id: wpComment.id,
    postId: wpComment.post,
    parent: wpComment.parent || 0,
    author: {
      name: wpComment.author_name,
      avatar: wpComment.author_avatar_urls?.['96'],
      url: wpComment.author_url,
    },
    content: wpComment.content?.rendered?.replace(/<[^>]*>/g, '') || '',
    date: wpComment.date,
    status: wpComment.status,
  };
}

export function adaptComments(wpComments: WPComment[]): AdaptedComment[] {
  const comments = wpComments.map(adaptComment);

  // 构建评论树
  const commentMap = new Map<number, AdaptedComment>();
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  const rootComments: AdaptedComment[] = [];
  commentMap.forEach(comment => {
    if (comment.parent === 0) {
      rootComments.push(comment);
    } else {
      const parent = commentMap.get(comment.parent);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(comment);
      }
    }
  });

  return rootComments;
}

// =====================================================
// 分页适配器
// =====================================================

export interface AdaptedPagination {
  current: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function adaptPagination(
  currentPage: number,
  totalPages: number,
  totalItems: number
): AdaptedPagination {
  return {
    current: currentPage,
    total: totalItems,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
}

// =====================================================
// 默认导出
// =====================================================

export default {
  adaptPost,
  adaptPosts,
  postToArticleCard,
  postsToArticleCards,
  postToBlogCard,
  postsToBlogCards,
  adaptCategory,
  adaptCategories,
  adaptTag,
  adaptTags,
  adaptAuthor,
  adaptAuthors,
  adaptComment,
  adaptComments,
  adaptPagination,
};
