/**
 * Tags API
 * 标签相关 API 接口
 */

import { apiClient } from './client';
import type { Tag, ApiResponse, PaginatedResponse } from '@/types';

/**
 * 获取所有标签
 */
export async function getTags(params?: {
  page?: number;
  per_page?: number;
  hide_empty?: boolean;
  include?: number[];
  exclude?: number[];
  order?: 'asc' | 'desc';
  orderby?: 'id' | 'count' | 'name' | 'slug';
}): Promise<PaginatedResponse<Tag>> {
  const response = await apiClient.get<Tag[]>('/tags', {
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
 * 根据 ID 获取单个标签
 */
export async function getTagById(id: number): Promise<Tag> {
  const response = await apiClient.get<Tag>(`/tags/${id}`);
  return response.data;
}

/**
 * 根据 slug 获取标签
 */
export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const response = await apiClient.get<Tag[]>('/tags', {
      params: { slug },
    });
    return response.data[0] || null;
  } catch (error) {
    console.error('Error fetching tag by slug:', error);
    return null;
  }
}

/**
 * 创建标签（需要认证）
 */
export async function createTag(data: {
  name: string;
  slug?: string;
  description?: string;
}): Promise<Tag> {
  const response = await apiClient.post<Tag>('/tags', data);
  return response.data;
}

/**
 * 更新标签（需要认证）
 */
export async function updateTag(
  id: number,
  data: {
    name?: string;
    slug?: string;
    description?: string;
  }
): Promise<Tag> {
  const response = await apiClient.put<Tag>(`/tags/${id}`, data);
  return response.data;
}

/**
 * 删除标签（需要认证）
 */
export async function deleteTag(id: number, force: boolean = false): Promise<void> {
  await apiClient.delete(`/tags/${id}`, {
    params: { force },
  });
}

/**
 * 获取热门标签（按文章数量排序）
 */
export async function getPopularTags(limit: number = 20): Promise<Tag[]> {
  const response = await apiClient.get<Tag[]>('/tags', {
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
 * 搜索标签
 */
export async function searchTags(query: string, limit: number = 20): Promise<Tag[]> {
  const response = await apiClient.get<Tag[]>('/tags', {
    params: {
      search: query,
      per_page: limit,
    },
  });
  return response.data;
}

/**
 * 获取随机标签
 */
export async function getRandomTags(limit: number = 10): Promise<Tag[]> {
  const response = await apiClient.get<Tag[]>('/tags', {
    params: {
      per_page: limit,
      hide_empty: true,
      orderby: 'count',
    },
  });

  // 随机打乱
  return response.data.sort(() => Math.random() - 0.5);
}

/**
 * 根据文章 ID 获取标签
 */
export async function getTagsByPostId(postId: number): Promise<Tag[]> {
  const response = await apiClient.get<Tag[]>(`/posts/${postId}/tags`);
  return response.data;
}
