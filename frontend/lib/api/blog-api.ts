/**
 * 博客 API 服务
 * 统一的博客数据获取接口
 */

import { wpClient } from '@/lib/wordpress';
import type { Post, Category, Tag, Author } from '@/lib/wordpress/types';
import {
  adaptPostToBlogCard,
  adaptPostsToBlogCards,
  type BlogCardData,
} from '@/lib/wordpress/blog-adapter';

export interface BlogListParams {
  page?: number;
  perPage?: number;
  category?: number;
  tag?: number;
  search?: string;
  author?: number;
  orderBy?: 'date' | 'title' | 'relevance';
  order?: 'asc' | 'desc';
}

export interface BlogListResponse {
  posts: BlogCardData[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * 获取博客列表
 */
export async function getBlogList(
  params: BlogListParams = {}
): Promise<BlogListResponse> {
  const { page = 1, perPage = 10, ...apiParams } = params;

  // 获取文章
  const posts = await wpClient.getPosts({
    page,
    perPage,
    ...apiParams,
  });

  // 获取相关数据
  const authorIds = [...new Set(posts.map(post => post.author))];
  const categoryIds = [...new Set(posts.flatMap(post => post.categories || []))];
  const tagIds = [...new Set(posts.flatMap(post => post.tags || []))];
  const mediaIds = [...new Set(posts.map(post => post.featured_media).filter(Boolean))];

  // 并行获取所有相关数据
  const [authors, categories, tags, mediaList] = await Promise.all([
    Promise.all(authorIds.map(id => wpClient.getAuthor(id).catch(() => null))),
    Promise.all(categoryIds.map(id => wpClient.getCategory(id).catch(() => null))),
    Promise.all(tagIds.map(id => wpClient.getTag(id).catch(() => null))),
    Promise.all(mediaIds.map(id => wpClient.getMedia(id).catch(() => null))),
  ]);

  // 创建 Map 以便快速查找
  const authorMap = new Map(
    authors.filter(Boolean).map((author: Author) => [author.id, author])
  );
  const categoryMap = new Map(
    categories.filter(Boolean).map((cat: Category) => [cat.id, cat])
  );
  const tagMap = new Map(
    tags.filter(Boolean).map((tag: Tag) => [tag.id, tag])
  );
  const mediaMap = new Map(
    mediaList.filter(Boolean).map((media: any) => [media.id, media.source_url])
  );

  // 适配数据
  const blogCards = adaptPostsToBlogCards(posts, authorMap, categoryMap, tagMap, mediaMap);

  // 获取总数
  const total = await wpClient.getTotalPosts();
  const totalPages = Math.ceil(total / perPage);

  return {
    posts: blogCards,
    total,
    totalPages,
    currentPage: page,
  };
}

/**
 * 获取博客详情
 */
export async function getBlogPost(slug: string): Promise<BlogCardData | null> {
  try {
    const post = await wpClient.getPostBySlug(slug);
    if (!post) return null;

    // 获取相关数据
    const [author, categories, tags, featuredMedia] = await Promise.all([
      wpClient.getAuthor(post.author).catch(() => null),
      Promise.all(
        (post.categories || []).map(id =>
          wpClient.getCategory(id).catch(() => null)
        )
      ),
      Promise.all(
        (post.tags || []).map(id =>
          wpClient.getTag(id).catch(() => null)
        )
      ),
      post.featured_media
        ? wpClient.getMedia(post.featured_media).catch(() => null)
        : Promise.resolve(null),
    ]);

    return adaptPostToBlogCard(
      post,
      author || undefined,
      categories.filter(Boolean),
      tags.filter(Boolean),
      featuredMedia?.source_url
    );
  } catch (error) {
    console.error('Failed to get blog post:', error);
    return null;
  }
}

/**
 * 获取分类列表
 */
export async function getCategories() {
  return wpClient.getCategories({ hideEmpty: true });
}

/**
 * 获取标签列表
 */
export async function getTags() {
  return wpClient.getTags({ hideEmpty: true });
}

/**
 * 搜索博客
 */
export async function searchBlog(query: string, params: Omit<BlogListParams, 'search'> = {}) {
  return getBlogList({ ...params, search: query });
}

/**
 * 获取相关文章
 */
export async function getRelatedPosts(
  postId: number,
  categoryIds: number[],
  limit: number = 4
): Promise<BlogCardData[]> {
  // 获取同分类的其他文章
  const posts = await wpClient.getPosts({
    perPage: limit + 1, // 多取一个以防包含当前文章
    category: categoryIds[0],
  });

  // 过滤掉当前文章
  const relatedPosts = posts.filter(post => post.id !== postId).slice(0, limit);

  // 简单适配（不获取完整的相关数据以提高性能）
  return relatedPosts.map(post =>
    adaptPostToBlogCard(post)
  );
}

/**
 * 获取最新文章
 */
export async function getLatestPosts(limit: number = 5): Promise<BlogCardData[]> {
  const posts = await wpClient.getPosts({
    perPage: limit,
    orderBy: 'date',
    order: 'desc',
  });

  return posts.map(post => adaptPostToBlogCard(post));
}

/**
 * 获取热门文章（基于评论数，这里简化为最新文章）
 */
export async function getPopularPosts(limit: number = 5): Promise<BlogCardData[]> {
  // WordPress REST API 不直接提供热门文章
  // 这里返回最新文章作为占位符
  // 实际项目中应该使用自定义端点或插件
  return getLatestPosts(limit);
}
