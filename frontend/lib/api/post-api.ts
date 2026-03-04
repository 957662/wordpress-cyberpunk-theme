/**
 * Post API Service
 * 文章相关 API 服务
 */

import { apiClient } from './api-client';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  author: {
    id: string;
    username: string;
    avatar?: string;
  };
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface CreatePostDto {
  title: string;
  content: string;
  excerpt?: string;
  categoryId?: string;
  tagIds?: string[];
  featuredImage?: string;
  status?: 'draft' | 'published';
}

export interface UpdatePostDto {
  title?: string;
  content?: string;
  excerpt?: string;
  categoryId?: string;
  tagIds?: string[];
  featuredImage?: string;
  status?: 'draft' | 'published' | 'archived';
}

export interface PostQuery {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  status?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}

export const postApi = {
  /**
   * 获取文章列表
   */
  getPosts: async (query: PostQuery = {}): Promise<{ posts: Post[]; total: number }> => {
    const response = await apiClient.get('/api/posts', { params: query });
    return response.data;
  },

  /**
   * 获取文章详情
   */
  getPostBySlug: async (slug: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/api/posts/${slug}`);
    return response.data;
  },

  /**
   * 获取文章详情（通过ID）
   */
  getPostById: async (id: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/api/posts/id/${id}`);
    return response.data;
  },

  /**
   * 创建文章
   */
  createPost: async (data: CreatePostDto): Promise<Post> => {
    const response = await apiClient.post<Post>('/api/posts', data);
    return response.data;
  },

  /**
   * 更新文章
   */
  updatePost: async (id: string, data: UpdatePostDto): Promise<Post> => {
    const response = await apiClient.patch<Post>(`/api/posts/${id}`, data);
    return response.data;
  },

  /**
   * 删除文章
   */
  deletePost: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/posts/${id}`);
  },

  /**
   * 点赞文章
   */
  likePost: async (id: string): Promise<void> => {
    await apiClient.post(`/api/posts/${id}/like`);
  },

  /**
   * 取消点赞文章
   */
  unlikePost: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/posts/${id}/like`);
  },

  /**
   * 书签文章
   */
  bookmarkPost: async (id: string): Promise<void> => {
    await apiClient.post(`/api/posts/${id}/bookmark`);
  },

  /**
   * 取消书签文章
   */
  unbookmarkPost: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/posts/${id}/bookmark`);
  },

  /**
   * 获取相关文章
   */
  getRelatedPosts: async (id: string, limit = 5): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>(`/api/posts/${id}/related`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * 搜索文章
   */
  searchPosts: async (query: string, limit = 10): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/api/posts/search', {
      params: { q: query, limit },
    });
    return response.data;
  },
};

export default postApi;
