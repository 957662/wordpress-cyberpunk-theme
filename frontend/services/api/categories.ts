/**
 * Categories API Service
 * 分类相关的 API 请求
 */

import { apiClient } from '../client';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  posts_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  data: Category[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CategoryCreate {
  name: string;
  slug?: string;
  description?: string;
}

export interface CategoryUpdate {
  name?: string;
  slug?: string;
  description?: string;
}

export const categoriesApi = {
  /**
   * 获取分类列表
   */
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<CategoryListResponse> => {
    const response = await apiClient.get('/categories', { params });
    return response.data;
  },

  /**
   * 获取单个分类
   */
  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  /**
   * 通过 slug 获取分类
   */
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data;
  },

  /**
   * 获取分类下的文章
   */
  getPosts: async (
    id: number,
    params?: { page?: number; per_page?: number }
  ): Promise<any> => {
    const response = await apiClient.get(`/categories/${id}/posts`, { params });
    return response.data;
  },

  /**
   * 创建分类 (需要管理员权限)
   */
  create: async (data: CategoryCreate): Promise<Category> => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  /**
   * 更新分类 (需要管理员权限)
   */
  update: async (id: number, data: CategoryUpdate): Promise<Category> => {
    const response = await apiClient.patch(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * 删除分类 (需要管理员权限)
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },
};
