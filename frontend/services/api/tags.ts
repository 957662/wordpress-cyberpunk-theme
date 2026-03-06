/**
 * Tags API Service
 * 标签相关的 API 请求
 */

import { apiClient } from '../client';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  posts_count?: number;
  color?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface TagListResponse {
  data: Tag[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface TagCreate {
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface TagUpdate {
  name?: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export const tagsApi = {
  /**
   * 获取标签列表
   */
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    sort?: 'name' | 'popular';
  }): Promise<TagListResponse> => {
    const response = await apiClient.get('/tags', { params });
    return response.data;
  },

  /**
   * 获取单个标签
   */
  getById: async (id: number): Promise<Tag> => {
    const response = await apiClient.get(`/tags/${id}`);
    return response.data;
  },

  /**
   * 通过 slug 获取标签
   */
  getBySlug: async (slug: string): Promise<Tag> => {
    const response = await apiClient.get(`/tags/slug/${slug}`);
    return response.data;
  },

  /**
   * 获取热门标签
   */
  getPopular: async (limit?: number): Promise<Tag[]> => {
    const response = await apiClient.get('/tags/popular/list', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * 获取标签下的文章
   */
  getPosts: async (
    id: number,
    params?: { page?: number; per_page?: number }
  ): Promise<any> => {
    const response = await apiClient.get(`/tags/${id}/posts`, { params });
    return response.data;
  },

  /**
   * 创建标签 (需要管理员权限)
   */
  create: async (data: TagCreate): Promise<Tag> => {
    const response = await apiClient.post('/tags', data);
    return response.data;
  },

  /**
   * 更新标签 (需要管理员权限)
   */
  update: async (id: number, data: TagUpdate): Promise<Tag> => {
    const response = await apiClient.patch(`/tags/${id}`, data);
    return response.data;
  },

  /**
   * 删除标签 (需要管理员权限)
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tags/${id}`);
  },
};
