/**
 * Blog Posts API
 * 博客文章 API 客户端
 */

import type { BlogPost, BlogPostFull, BlogSearchParams } from '@/types/blog';

interface PostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

/**
 * 获取文章列表
 */
export async function getPosts(params?: BlogSearchParams): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.q) searchParams.append('search', params.q);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.tag) searchParams.append('tag', params.tag);
  if (params?.author) searchParams.append('author', params.author);
  if (params?.dateFrom) searchParams.append('date_from', params.dateFrom);
  if (params?.dateTo) searchParams.append('date_to', params.dateTo);
  if (params?.sortBy) searchParams.append('order_by', params.sortBy);
  if (params?.order) searchParams.append('order', params.order);
  if (params?.page) searchParams.append('page', String(params.page));
  if (params?.perPage) searchParams.append('per_page', String(params.perPage));

  const response = await fetch(
    `/api/blog/posts?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  return response.json();
}

/**
 * 根据 slug 获取单篇文章
 */
export async function getPostBySlug(slug: string): Promise<BlogPostFull> {
  const response = await fetch(`/api/blog/posts/${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  return response.json();
}

/**
 * 根据 ID 获取单篇文章
 */
export async function getPostById(id: string): Promise<BlogPostFull> {
  const response = await fetch(`/api/blog/posts/id/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }

  return response.json();
}

/**
 * 获取相关文章
 */
export async function getRelatedPosts(
  slug: string,
  limit: number = 4
): Promise<BlogPost[]> {
  const response = await fetch(
    `/api/blog/posts/${slug}/related?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch related posts');
  }

  return response.json();
}

/**
 * 搜索文章
 */
export async function searchPosts(
  query: string,
  options?: {
    category?: string;
    tag?: string;
    page?: number;
    perPage?: number;
  }
): Promise<PostsResponse> {
  const params = new URLSearchParams();

  params.append('q', query);
  if (options?.category) params.append('category', options.category);
  if (options?.tag) params.append('tag', options.tag);
  if (options?.page) params.append('page', String(options.page));
  if (options?.perPage) params.append('per_page', String(options.perPage));

  const response = await fetch(`/api/blog/search?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to search posts');
  }

  return response.json();
}

/**
 * 获取精选文章
 */
export async function getFeaturedPosts(limit: number = 10): Promise<BlogPost[]> {
  const response = await fetch(
    `/api/blog/posts/featured?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch featured posts');
  }

  return response.json();
}

/**
 * 获取热门文章
 */
export async function getPopularPosts(limit: number = 10): Promise<BlogPost[]> {
  const response = await fetch(
    `/api/blog/posts/popular?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch popular posts');
  }

  return response.json();
}

/**
 * 获取最新文章
 */
export async function getLatestPosts(limit: number = 10): Promise<BlogPost[]> {
  const response = await fetch(
    `/api/blog/posts/latest?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch latest posts');
  }

  return response.json();
}
