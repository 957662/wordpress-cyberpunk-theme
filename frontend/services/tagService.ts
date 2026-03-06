/**
 * Tag Service - 标签服务
 * 处理标签相关的API调用
 */

import { http } from '@/lib/utils/http';

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface TagStats {
  tag_id: number;
  posts_count: number;
  published_count: number;
  recent_count: number;
}

export interface TagWithWeight extends Tag {
  count: number;
  weight: number;
}

export interface TagListResponse {
  items: Tag[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateTagData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateTagData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

/**
 * 获取标签列表
 */
export async function getTags(params?: {
  skip?: number;
  limit?: number;
  search?: string;
  sort_by?: 'name' | 'posts_count' | 'created' | 'popular';
}): Promise<TagListResponse> {
  return http.get('/tags', { params });
}

/**
 * 获取热门标签
 */
export async function getPopularTags(params?: {
  limit?: number;
  days?: number;
}): Promise<Tag[]> {
  return http.get('/tags/popular', { params });
}

/**
 * 获取标签云
 */
export async function getTagCloud(params?: {
  min_posts?: number;
  limit?: number;
}): Promise<TagWithWeight[]> {
  return http.get('/tags/cloud', { params });
}

/**
 * 获取单个标签
 */
export async function getTag(tagId: number): Promise<Tag> {
  return http.get(`/tags/${tagId}`);
}

/**
 * 获取标签统计信息
 */
export async function getTagStats(tagId: number): Promise<TagStats> {
  return http.get(`/tags/${tagId}/stats`);
}

/**
 * 获取相关标签
 */
export async function getRelatedTags(tagId: number, params?: {
  limit?: number;
}): Promise<Tag[]> {
  return http.get(`/tags/${tagId}/related`, { params });
}

/**
 * 创建标签
 */
export async function createTag(data: CreateTagData): Promise<Tag> {
  return http.post('/tags', data);
}

/**
 * 更新标签
 */
export async function updateTag(tagId: number, data: UpdateTagData): Promise<Tag> {
  return http.put(`/tags/${tagId}`, data);
}

/**
 * 删除标签
 */
export async function deleteTag(tagId: number): Promise<void> {
  return http.delete(`/tags/${tagId}`);
}

/**
 * 合并标签
 */
export async function mergeTags(sourceId: number, targetId: number): Promise<{ message: string }> {
  return http.post('/tags/merge', null, {
    params: { source_id: sourceId, target_id: targetId }
  });
}

/**
 * 通过 slug 获取标签
 */
export async function getTagBySlug(slug: string): Promise<Tag> {
  return http.get(`/tags/slug/${slug}`);
}

/**
 * 搜索标签
 */
export async function searchTags(query: string, limit?: number): Promise<Tag[]> {
  return getTags({
    search: query,
    limit: limit || 20
  }).then(response => response.items);
}

/**
 * 获取多个标签的统计信息
 */
export async function getMultipleTagStats(tagIds: number[]): Promise<TagStats[]> {
  const promises = tagIds.map(id => getTagStats(id));
  return Promise.all(promises);
}

/**
 * 获取标签的建议颜色
 */
export function getSuggestedColor(tagName: string): string {
  const colors = [
    '#00f0ff', // cyan
    '#9d00ff', // purple
    '#ff0080', // pink
    '#00ff88', // green
    '#f0ff00', // yellow
    '#ff6b00', // orange
    '#0066ff', // blue
    '#ff0066', // red
  ];

  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * 批量创建标签
 */
export async function bulkCreateTags(names: string[]): Promise<Tag[]> {
  const promises = names.map(name =>
    createTag({
      name,
      color: getSuggestedColor(name)
    })
  );

  return Promise.all(promises);
}

/**
 * 标签服务类
 */
export class TagService {
  private baseUrl: string;

  constructor(baseUrl: string = '/tags') {
    this.baseUrl = baseUrl;
  }

  async getTags(params?: {
    skip?: number;
    limit?: number;
    search?: string;
    sort_by?: string;
  }): Promise<TagListResponse> {
    return http.get(this.baseUrl, { params });
  }

  async getPopularTags(limit: number = 20, days: number = 30): Promise<Tag[]> {
    return http.get(`${this.baseUrl}/popular`, { params: { limit, days } });
  }

  async getTagCloud(minPosts: number = 1, limit: number = 50): Promise<TagWithWeight[]> {
    return http.get(`${this.baseUrl}/cloud`, { params: { min_posts: minPosts, limit } });
  }

  async getTag(tagId: number): Promise<Tag> {
    return http.get(`${this.baseUrl}/${tagId}`);
  }

  async getTagStats(tagId: number): Promise<TagStats> {
    return http.get(`${this.baseUrl}/${tagId}/stats`);
  }

  async getRelatedTags(tagId: number, limit: number = 10): Promise<Tag[]> {
    return http.get(`${this.baseUrl}/${tagId}/related`, { params: { limit } });
  }

  async createTag(data: CreateTagData): Promise<Tag> {
    return http.post(this.baseUrl, data);
  }

  async updateTag(tagId: number, data: UpdateTagData): Promise<Tag> {
    return http.put(`${this.baseUrl}/${tagId}`, data);
  }

  async deleteTag(tagId: number): Promise<void> {
    return http.delete(`${this.baseUrl}/${tagId}`);
  }

  async mergeTags(sourceId: number, targetId: number): Promise<{ message: string }> {
    return http.post(`${this.baseUrl}/merge`, null, {
      params: { source_id: sourceId, target_id: targetId }
    });
  }

  // 批量操作
  async bulkDelete(tagIds: number[]): Promise<void> {
    const promises = tagIds.map(id => this.deleteTag(id));
    await Promise.all(promises);
  }

  async getTagWithStats(tagId: number): Promise<Tag & { stats: TagStats }> {
    const [tag, stats] = await Promise.all([
      this.getTag(tagId),
      this.getTagStats(tagId)
    ]);

    return { ...tag, stats };
  }

  // 缓存相关
  private cache = new Map<string, { data: any; expiry: number }>();

  async getCachedTags(cacheKey: string = 'tags', ttl: number = 60000): Promise<Tag[]> {
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }

    const response = await this.getTags({ limit: 100 });
    this.cache.set(cacheKey, {
      data: response.items,
      expiry: Date.now() + ttl
    });

    return response.items;
  }

  clearCache(cacheKey?: string): void {
    if (cacheKey) {
      this.cache.delete(cacheKey);
    } else {
      this.cache.clear();
    }
  }
}

// 导出默认实例
export const tagService = new TagService();

/**
 * React Hook for Tags
 */
import { useEffect, useState } from 'react';

export function useTags(params?: {
  skip?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
}) {
  const [data, setData] = useState<TagListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await getTags(params);
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [JSON.stringify(params)]);

  return { data, loading, error };
}

export function useTag(tagId: number) {
  const [data, setData] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTag = async () => {
      try {
        setLoading(true);
        const response = await getTag(tagId);
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTag();
  }, [tagId]);

  return { data, loading, error };
}

export function usePopularTags(limit: number = 20, days: number = 30) {
  const [data, setData] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await getPopularTags({ limit, days });
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [limit, days]);

  return { data, loading, error };
}

export function useTagCloud(minPosts: number = 1, limit: number = 50) {
  const [data, setData] = useState<TagWithWeight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCloud = async () => {
      try {
        setLoading(true);
        const response = await getTagCloud({ min_posts: minPosts, limit });
        setData(response);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCloud();
  }, [minPosts, limit]);

  return { data, loading, error };
}
