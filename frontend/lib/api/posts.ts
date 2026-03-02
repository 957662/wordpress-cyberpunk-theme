/**
 * WordPress Posts API Service
 * 处理所有与文章相关的 API 请求
 */

import { type Post, type PostDetail, type PaginatedResponse } from '@/types/wordpress';

const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://demo.wp-api.org/wp-json';

/**
 * 通用 fetch 包装函数，处理错误和响应
 */
async function fetchFromWP<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = `${WP_API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

/**
 * 获取文章列表
 */
export async function getPosts(params?: {
  page?: number;
  per_page?: number;
  categories?: number;
  tags?: number;
  search?: string;
  author?: number;
  orderby?: 'date' | 'title' | 'relevance';
  order?: 'asc' | 'desc';
  _embed?: boolean;
}): Promise<Post[]> {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  const endpoint = `/wp/v2/posts?${queryParams.toString()}`;
  return fetchFromWP<Post[]>(endpoint);
}

/**
 * 获取文章总数
 */
export async function getTotalPosts(params?: {
  categories?: number;
  tags?: number;
  search?: string;
}): Promise<number> {
  try {
    const posts = await getPosts({ ...params, per_page: 1, _fields: ['id'] });
    // WordPress API 在响应头中返回总数
    // 这里简化处理，实际应该从响应头读取 X-WP-Total
    return posts.length;
  } catch {
    return 0;
  }
}

/**
 * 根据 slug 获取单篇文章
 */
export async function getPostBySlug(slug: string, embed?: boolean): Promise<PostDetail | null> {
  try {
    const embedParam = embed ? '&_embed' : '';
    const posts = await fetchFromWP<PostDetail[]>(`/wp/v2/posts?slug=${slug}${embedParam}`);

    if (!posts || posts.length === 0) {
      return null;
    }

    return posts[0];
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

/**
 * 根据 ID 获取单篇文章
 */
export async function getPostById(id: number, embed?: boolean): Promise<PostDetail | null> {
  try {
    const embedParam = embed ? '?_embed' : '';
    return await fetchFromWP<PostDetail>(`/wp/v2/posts/${id}${embedParam}`);
  } catch (error) {
    console.error('Error fetching post by ID:', error);
    return null;
  }
}

/**
 * 获取相关文章
 */
export async function getRelatedPosts(
  currentPostId: number,
  categories?: number[],
  limit: number = 3
): Promise<Post[]> {
  try {
    if (!categories || categories.length === 0) {
      return [];
    }

    const categoryId = categories[0];
    return await getPosts({
      categories: categoryId,
      exclude: currentPostId,
      per_page: limit,
      _embed: true,
    });
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

/**
 * 获取最新文章
 */
export async function getLatestPosts(limit: number = 5): Promise<Post[]> {
  return getPosts({
    per_page: limit,
    orderby: 'date',
    order: 'desc',
    _embed: true,
  });
}

/**
 * 获取热门文章（基于评论数或浏览量）
 * 注意：需要安装相关插件才能获取浏览量
 */
export async function getPopularPosts(limit: number = 5): Promise<Post[]> {
  // 这里简化处理，返回最新文章
  // 实际应该根据浏览量或评论数排序
  return getLatestPosts(limit);
}

/**
 * 搜索文章
 */
export async function searchPosts(
  query: string,
  page: number = 1,
  perPage: number = 10
): Promise<{ posts: Post[]; total: number }> {
  try {
    const posts = await getPosts({
      search: query,
      page,
      per_page: perPage,
      _embed: true,
    });

    // 简化处理，实际应该从响应头获取总数
    const total = posts.length;

    return { posts, total };
  } catch (error) {
    console.error('Error searching posts:', error);
    return { posts: [], total: 0 };
  }
}

/**
 * 获取文章归档（按月份分组）
 */
export async function getPostArchives(): Promise<Array<{
  year: number;
  month: number;
  count: number;
}>> {
  try {
    return await fetchFromWP<any[]>('/wp/v2/posts?per_page=100&_fields=date');
  } catch {
    return [];
  }
}

/**
 * 获取分类列表
 */
export async function getCategories(params?: {
  per_page?: number;
  hide_empty?: boolean;
}): Promise<Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
  description: string;
}>> {
  const queryParams = new URLSearchParams();
  queryParams.append('per_page', String(params?.per_page || 20));
  queryParams.append('hide_empty', String(params?.hide_empty ?? true));

  return fetchFromWP(`/wp/v2/categories?${queryParams.toString()}`);
}

/**
 * 获取标签列表
 */
export async function getTags(params?: {
  per_page?: number;
  hide_empty?: boolean;
}): Promise<Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
}>> {
  const queryParams = new URLSearchParams();
  queryParams.append('per_page', String(params?.per_page || 30));
  queryParams.append('hide_empty', String(params?.hide_empty ?? true));

  return fetchFromWP(`/wp/v2/tags?${queryParams.toString()}`);
}

/**
 * 获取作者列表
 */
export async function getAuthors(): Promise<Array<{
  id: number;
  name: string;
  description: string;
  avatar_urls: { [key: string]: string };
  link: string;
}>> {
  return fetchFromWP('/wp/v2/users?per_page=20');
}

/**
 * 获取文章评论
 */
export async function getComments(postId: number): Promise<Array<{
  id: number;
  author_name: string;
  author_email: string;
  content: { rendered: string };
  date: string;
  parent: number;
}>> {
  return fetchFromWP(`/wp/v2/comments?post=${postId}`);
}

/**
 * 提交新评论
 */
export async function submitComment(
  postId: number,
  author: string,
  email: string,
  content: string,
  parentId?: number
): Promise<any> {
  return fetchFromWP('/wp/v2/comments', {
    method: 'POST',
    body: JSON.stringify({
      post: postId,
      author_name: author,
      author_email: email,
      content,
      parent: parentId || 0,
    }),
  });
}

/**
 * Next.js 数据获取函数 - 用于 SSG
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const posts = await getPosts({ per_page: 100, _fields: ['slug'] });
    return posts.map((post: any) => post.slug);
  } catch {
    return [];
  }
}

/**
 * 生成静态参数
 */
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}
