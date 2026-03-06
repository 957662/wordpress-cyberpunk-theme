/**
 * Blog Data Adapter
 * 将 WordPress API 数据转换为应用所需格式
 */

import type { WPPost, WPCategory, WPTag, WPUser, WPMedia } from '@/types/wordpress';
import type { ArticleCardProps } from '@/components/blog/ArticleCard';
import { calculateReadingTime } from '@/lib/utils';

/**
 * 文章数据接口
 */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: {
    name: string;
    avatar?: string;
    id?: number;
  };
  categories: Category[];
  tags: Tag[];
  publishedAt: string;
  modifiedAt?: string;
  readTime: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  status: 'publish' | 'draft' | 'pending';
  format: string;
  sticky: boolean;
  link?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  count?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count?: number;
}

export interface Author {
  id: number;
  name: string;
  slug: string;
  avatar?: string;
  description?: string;
  link?: string;
}

/**
 * 转换 WordPress 文章数据为应用格式
 */
export function adaptWPPostToBlogPost(
  wpPost: WPPost,
  author?: WPUser,
  categories?: WPCategory[],
  tags?: WPTag[],
  featuredMedia?: WPMedia
): BlogPost {
  // 提取纯文本标题
  const title = wpPost.title?.rendered || '';
  const excerpt = wpPost.excerpt?.rendered || '';
  const content = wpPost.content?.rendered || '';

  // 计算阅读时间
  const readTime = calculateReadingTime(content);

  // 构建分类数据
  const adaptedCategories: Category[] = (categories || []).map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    count: cat.count,
  }));

  // 构建标签数据
  const adaptedTags: Tag[] = (tags || []).map(tag => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description,
    count: tag.count,
  }));

  // 构建作者数据
  const adaptedAuthor: BlogPost['author'] = author
    ? {
        name: author.name,
        avatar: author.avatar_urls?.['96'] || author.avatar_urls?.['48'],
        id: author.id,
      }
    : {
        name: 'Unknown Author',
      };

  return {
    id: String(wpPost.id),
    title,
    slug: wpPost.slug,
    excerpt: excerpt.replace(/<[^>]*>/g, '').slice(0, 200),
    content,
    featuredImage: featuredMedia?.source_url,
    author: adaptedAuthor,
    categories: adaptedCategories,
    tags: adaptedTags,
    publishedAt: wpPost.date,
    modifiedAt: wpPost.modified,
    readTime,
    viewCount: 0, // 从 meta 或单独的 API 获取
    likeCount: 0, // 从 meta 或单独的 API 获取
    commentCount: 0, // 需要从评论 API 获取
    status: wpPost.status,
    format: wpPost.format,
    sticky: wpPost.sticky,
    link: wpPost.link,
  };
}

/**
 * 转换 WordPress 分类数据
 */
export function adaptWPCategory(category: WPCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    count: category.count,
  };
}

/**
 * 转换 WordPress 标签数据
 */
export function adaptWPTag(tag: WPTag): Tag {
  return {
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    description: tag.description,
    count: tag.count,
  };
}

/**
 * 转换 WordPress 用户数据
 */
export function adaptWPAuthor(user: WPUser): Author {
  return {
    id: user.id,
    name: user.name,
    slug: user.slug,
    avatar: user.avatar_urls?.['96'] || user.avatar_urls?.['48'],
    description: user.description,
    link: user.link,
  };
}

/**
 * 批量转换文章列表
 */
export function adaptWPPostList(
  posts: WPPost[],
  authors?: Map<number, WPUser>,
  categories?: Map<number, WPCategory[]>,
  tags?: Map<number, WPTag[]>,
  media?: Map<number, WPMedia>
): BlogPost[] {
  return posts.map(post => {
    const author = post.author ? authors?.get(post.author) : undefined;
    const postCategories = post.categories
      ? post.categories.map(id => categories?.get(id) || []).flat()
      : [];
    const postTags = post.tags
      ? post.tags.map(id => tags?.get(id) || []).flat()
      : [];
    const featuredMedia = post.featured_media ? media?.get(post.featured_media) : undefined;

    return adaptWPPostToBlogPost(post, author, postCategories, postTags, featuredMedia);
  });
}

/**
 * 转换为 ArticleCard props
 */
export function adaptToArticleCardProps(post: BlogPost): ArticleCardProps {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    author: post.author,
    categories: post.categories.map(cat => ({
      name: cat.name,
      slug: cat.slug,
      color: cat.color,
    })),
    tags: post.tags.map(tag => ({
      name: tag.name,
      slug: tag.slug,
    })),
    publishedAt: post.publishedAt,
    readTime: post.readTime,
    viewCount: post.viewCount,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
  };
}

/**
 * 批量转换为 ArticleCard props
 */
export function adaptToArticleCardPropsList(posts: BlogPost[]): ArticleCardProps[] {
  return posts.map(adaptToArticleCardProps);
}
