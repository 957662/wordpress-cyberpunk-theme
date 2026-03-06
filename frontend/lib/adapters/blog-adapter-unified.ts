/**
 * 统一的博客数据适配器
 * 用于将 WordPress API 响应转换为应用内部使用的类型
 */

import { WPArticle } from '@/lib/wordpress/client';
import { BlogCardData, BlogPost } from '@/types/blog';
import { Post } from '@/types/models';

/**
 * WordPress 文章转换为 BlogCardData
 */
export function wpArticleToBlogCardData(wpPost: WPArticle): BlogCardData {
  const featuredMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
  const categories = wpPost._embedded?.['wp:term']?.[0] || [];
  const author = wpPost._embedded?.author?.[0];
  const tags = wpPost._embedded?.['wp:term']?.[1] || [];

  // 计算阅读时间（平均每分钟 200 字）
  const wordCount = wpPost.content.rendered.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    id: wpPost.id.toString(),
    title: wpPost.title.rendered,
    excerpt: wpPost.excerpt.rendered.replace(/<[^>]*>/g, '').trim(),
    content: wpPost.content.rendered,
    coverImage: featuredMedia?.source_url,
    category: categories[0]?.name,
    categories: categories.map(cat => ({
      id: cat.id.toString(),
      name: cat.name,
      slug: cat.slug,
    })),
    tags: tags.map(tag => tag.name),
    author: author ? {
      name: author.name,
      avatar: author.avatar_urls?.['48'] || author.avatar_urls?.['24'],
      slug: author.slug,
    } : undefined,
    publishedAt: wpPost.date,
    createdAt: wpPost.date,
    readingTime,
    slug: wpPost.slug,
    featured: wpPost.sticky,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
  };
}

/**
 * WordPress 文章数组转换为 BlogCardData 数组
 */
export function wpArticlesToBlogCardDataArray(wpPosts: WPArticle[]): BlogCardData[] {
  return wpPosts.map(wpArticleToBlogCardData);
}

/**
 * Post (models.ts) 转换为 BlogCardData
 */
export function postToBlogCardData(post: Post): BlogCardData {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || '',
    content: post.content,
    coverImage: post.cover_image,
    category: post.category?.name,
    categories: post.category ? [{
      id: post.category.id,
      name: post.category.name,
      slug: post.category.slug,
    }] : [],
    tags: post.tags?.map(tag => tag.name) || [],
    author: {
      name: post.author.username,
      avatar: post.author.avatar,
      slug: post.author.username,
    },
    publishedAt: post.published_at || post.created_at,
    createdAt: post.created_at,
    readingTime: post.reading_time,
    slug: post.slug,
    featured: post.featured,
    viewCount: post.view_count,
    likeCount: post.like_count,
    commentCount: post.comment_count,
  };
}

/**
 * Post 数组转换为 BlogCardData 数组
 */
export function postsToBlogCardDataArray(posts: Post[]): BlogCardData[] {
  return posts.map(postToBlogCardData);
}

/**
 * BlogCardData 转换为 WordPress 文章格式（用于提交）
 */
export function blogCardDataToWPArticle(data: BlogCardData): Partial<WPArticle> {
  return {
    title: { rendered: data.title },
    content: { rendered: data.content || '', protected: false },
    excerpt: { rendered: data.excerpt || '', protected: false },
    slug: data.slug,
    sticky: data.featured || false,
  };
}

/**
 * 合并 WordPress 数据和本地数据（用于显示用户交互状态）
 */
export function mergeWithUserData(
  baseData: BlogCardData,
  userData: {
    isLiked?: boolean;
    isBookmarked?: boolean;
    viewCount?: number;
    likeCount?: number;
    commentCount?: number;
  }
): BlogCardData {
  return {
    ...baseData,
    isLiked: userData.isLiked,
    isBookmarked: userData.isBookmarked,
    viewCount: userData.viewCount ?? baseData.viewCount,
    likeCount: userData.likeCount ?? baseData.likeCount,
    commentCount: userData.commentCount ?? baseData.commentCount,
  };
}

/**
 * 批量转换并合并用户数据
 */
export function convertAndMergeUserData(
  wpPosts: WPArticle[],
  userInteractions: Map<string, { isLiked?: boolean; isBookmarked?: boolean }>
): BlogCardData[] {
  return wpPosts.map(wpPost => {
    const baseData = wpArticleToBlogCardData(wpPost);
    const interaction = userInteractions.get(baseData.id);
    
    if (interaction) {
      return mergeWithUserData(baseData, interaction);
    }
    
    return baseData;
  });
}
