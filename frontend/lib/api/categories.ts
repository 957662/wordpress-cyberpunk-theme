/**
 * Categories API
 * 分类相关 API 接口
 */

import { apiClient } from './client';
import type { Category, ApiResponse, PaginatedResponse } from '@/types';

/**
 * 获取所有分类
 */
export async function getCategories(params?: {
  page?: number;
  per_page?: number;
  hide_empty?: boolean;
  include?: number[];
  exclude?: number[];
  order?: 'asc' | 'desc';
  orderby?: 'id' | 'count' | 'name' | 'slug';
}): Promise<PaginatedResponse<Category>> {
  const response = await apiClient.get<Category[]>('/categories', {
    params: {
      page: params?.page || 1,
      per_page: params?.per_page || 100,
      hide_empty: params?.hide_empty !== false,
      ...params,
    },
  });

  // 获取总数
  const total = parseInt(response.headers['x-wp-total'] || '0', 10);
  const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

  return {
    data: response.data,
    total,
    totalPages,
    currentPage: params?.page || 1,
    pageSize: params?.per_page || 100,
  };
}

/**
 * 根据 ID 获取单个分类
 */
export async function getCategoryById(id: number): Promise<Category> {
  const response = await apiClient.get<Category>(`/categories/${id}`);
  return response.data;
}

/**
 * 根据 slug 获取分类
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await apiClient.get<Category[]>('/categories', {
      params: { slug },
    });
    return response.data[0] || null;
  } catch (error) {
    console.error('Error fetching category by slug:', error);
    return null;
  }
}

/**
 * 创建分类（需要认证）
 */
export async function createCategory(data: {
  name: string;
  slug?: string;
  description?: string;
  parent?: number;
}): Promise<Category> {
  const response = await apiClient.post<Category>('/categories', data);
  return response.data;
}

/**
 * 更新分类（需要认证）
 */
export async function updateCategory(
  id: number,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    parent?: number;
  }
): Promise<Category> {
  const response = await apiClient.put<Category>(`/categories/${id}`, data);
  return response.data;
}

/**
 * 删除分类（需要认证）
 */
export async function deleteCategory(id: number, force: boolean = false): Promise<void> {
  await apiClient.delete(`/categories/${id}`, {
    params: { force },
  });
}

/**
 * 获取热门分类（按文章数量排序）
 */
export async function getPopularCategories(limit: number = 10): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories', {
    params: {
      per_page: limit,
      hide_empty: true,
      orderby: 'count',
      order: 'desc',
    },
  });
  return response.data;
}

/**
 * 搜索分类
 */
export async function searchCategories(query: string, limit: number = 20): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories', {
    params: {
      search: query,
      per_page: limit,
    },
  });
  return response.data;
}

/**
 * 获取分类的子分类
 */
export async function getChildCategories(parentId: number): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories', {
    params: {
      parent: parentId,
      hide_empty: false,
    },
  });
  return response.data;
}

/**
 * 构建分类树结构
 */
export function buildCategoryTree(categories: Category[]): Category[] {
  const map = new Map<number, Category>();
  const roots: Category[] = [];

  // 创建映射
  categories.forEach(category => {
    map.set(category.id, { ...category, children: [] });
  });

  // 构建树
  categories.forEach(category => {
    const node = map.get(category.id)!;
    if (category.parent === 0) {
      roots.push(node);
    } else {
      const parent = map.get(category.parent);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      }
    }
  });

  return roots;
}
