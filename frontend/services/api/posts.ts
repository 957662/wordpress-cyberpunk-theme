/**
 * Posts API Service
 * 文章相关的 API 请求
 */

import { apiClient } from '../client';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: string;
  featured_image_url?: string;
  view_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export interface PostListResponse {
  data: Post[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PostCreate {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  category_id?: number;
  tags?: number[];
  featured_image_url?: string;
  status?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface PostUpdate {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  category_id?: number;
  tags?: number[];
  featured_image_url?: string;
  status?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export const postsApi = {
  /**
   * 获取文章列表
   */
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    category?: string;
    tag?: string;
    search?: string;
    status?: string;
    sort?: 'latest' | 'popular' | 'trending';
    author?: number;
  }): Promise<PostListResponse> => {
    const response = await apiClient.get('/posts', { params });
    return response.data;
  },

  /**
   * 获取单篇文章
   */
  getById: async (id: number): Promise<Post> => {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  /**
   * 通过 slug 获取文章
   */
  getBySlug: async (slug: string): Promise<Post> => {
    const response = await apiClient.get(`/posts/slug/${slug}`);
    return response.data;
  },

  /**
   * 获取相关文章
   */
  getRelated: async (id: number, limit?: number): Promise<Post[]> => {
    const response = await apiClient.get(`/posts/${id}/related`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * 获取趋势文章
   */
  getTrending: async (limit?: number): Promise<Post[]> => {
    const response = await apiClient.get('/posts/trending/list', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * 获取推荐文章
   */
  getRecommended: async (limit?: number): Promise<Post[]> => {
    const response = await apiClient.get('/posts/recommended/list', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * 创建文章
   */
  create: async (data: PostCreate): Promise<Post> => {
    const response = await apiClient.post('/posts', data);
    return response.data;
  },

  /**
   * 更新文章
   */
  update: async (id: number, data: PostUpdate): Promise<Post> => {
    const response = await apiClient.patch(`/posts/${id}`, data);
    return response.data;
  },

  /**
   * 删除文章
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}`);
  },

  /**
   * 点赞文章
   */
  like: async (id: number): Promise<void> => {
    await apiClient.post(`/posts/${id}/like`);
  },

  /**
   * 取消点赞文章
   */
  unlike: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}/like`);
  },

  /**
   * 收藏文章
   */
  bookmark: async (id: number): Promise<void> => {
    await apiClient.post(`/posts/${id}/bookmark`);
  },

  /**
   * 取消收藏文章
   */
  unbookmark: async (id: number): Promise<void> => {
    await apiClient.delete(`/posts/${id}/bookmark`);
  },
};
