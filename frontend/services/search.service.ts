/**
 * Search Service
 * 搜索相关 API 服务
 */

import { apiClient } from './api-client';
import type { BlogPost } from '@/types/models';

// ============================================================================
// Types
// ============================================================================

export interface SearchResult {
  id: string;
  type: 'post' | 'page' | 'category' | 'tag' | 'author';
  title: string;
  excerpt?: string;
  url: string;
  category?: string;
  date?: string;
  author?: string;
  relevance?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

export interface SearchFilters {
  type?: SearchResult['type'][];
  category?: string[];
  dateFrom?: string;
  dateTo?: string;
  author?: string[];
}

export interface SearchOptions {
  query: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  sortBy?: 'relevance' | 'date' | 'title';
}

// ============================================================================
// Search Service
// ============================================================================

class SearchService {
  private readonly basePath = '/search';

  /**
   * 执行搜索
   */
  async search(options: SearchOptions): Promise<{
    results: SearchResult[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { query, filters, page = 1, limit = 20, sortBy = 'relevance' } = options;

    const response = await apiClient.post<{
      data: SearchResult[];
      meta: {
        total: number;
        page: number;
        totalPages: number;
      };
    }>(`${this.basePath}`, {
      query,
      filters,
      page,
      limit,
      sortBy,
    });

    return {
      results: response.data,
      total: response.meta.total,
      page: response.meta.page,
      totalPages: response.meta.totalPages,
    };
  }

  /**
   * 获取搜索建议
   */
  async getSuggestions(query: string): Promise<SearchSuggestion[]> {
    if (query.length < 2) return [];

    const response = await apiClient.get<{ data: SearchSuggestion[] }>(
      `${this.basePath}/suggestions`,
      {
        params: { q: query },
      }
    );

    return response.data;
  }

  /**
   * 获取热门搜索
   */
  async getTrending(): Promise<SearchSuggestion[]> {
    const response = await apiClient.get<{ data: SearchSuggestion[] }>(
      `${this.basePath}/trending`
    );

    return response.data;
  }

  /**
   * 获取搜索历史
   */
  async getHistory(limit = 10): Promise<SearchSuggestion[]> {
    const response = await apiClient.get<{ data: SearchSuggestion[] }>(
      `${this.basePath}/history`,
      {
        params: { limit },
      }
    );

    return response.data;
  }

  /**
   * 保存搜索到历史
   */
  async saveToHistory(query: string): Promise<void> {
    await apiClient.post(`${this.basePath}/history`, { query });
  }

  /**
   * 清除搜索历史
   */
  async clearHistory(): Promise<void> {
    await apiClient.delete(`${this.basePath}/history`);
  }

  /**
   * 删除特定搜索历史
   */
  async removeHistoryItem(query: string): Promise<void> {
    await apiClient.delete(`${this.basePath}/history/${encodeURIComponent(query)}`);
  }

  /**
   * 全文搜索文章
   */
  async searchPosts(
    query: string,
    options: {
      category?: string;
      tags?: string[];
      author?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{
    posts: BlogPost[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { category, tags, author, page = 1, limit = 20 } = options;

    const response = await apiClient.get<{
      data: BlogPost[];
      meta: {
        total: number;
        page: number;
        totalPages: number;
      };
    }>(`${this.basePath}/posts`, {
      params: {
        q: query,
        category,
        tags: tags?.join(','),
        author,
        page,
        limit,
      },
    });

    return {
      posts: response.data,
      total: response.meta.total,
      page: response.meta.page,
      totalPages: response.meta.totalPages,
    };
  }

  /**
   * 搜索标签
   */
  async searchTags(query: string, limit = 10): Promise<
    Array<{
      name: string;
      slug: string;
      count: number;
    }>
  > {
    const response = await apiClient.get<{ data: Array<{ name: string; slug: string; count: number }> } }>(
      `${this.basePath}/tags`,
      {
        params: { q: query, limit },
      }
    );

    return response.data;
  }

  /**
   * 搜索分类
   */
  async searchCategories(query: string, limit = 10): Promise<
    Array<{
      name: string;
      slug: string;
      count: number;
      color: string;
    }>
  > {
    const response = await apiClient.get<{
      data: Array<{
        name: string;
        slug: string;
        count: number;
        color: string;
      }>;
    }>(`${this.basePath}/categories`, {
      params: { q: query, limit },
    });

    return response.data;
  }

  /**
   * 搜索作者
   */
  async searchAuthors(query: string, limit = 10): Promise<
    Array<{
      id: number;
      username: string;
      displayName: string;
      avatar?: string;
      stats?: {
        posts: number;
        followers: number;
      };
    }>
  > {
    const response = await apiClient.get<{
      data: Array<{
        id: number;
        username: string;
        displayName: string;
        avatar?: string;
        stats?: {
          posts: number;
          followers: number;
        };
      }>;
    }>(`${this.basePath}/authors`, {
      params: { q: query, limit },
    });

    return response.data;
  }

  /**
   * 获取相关搜索
   */
  async getRelated(query: string, limit = 5): Promise<string[]> {
    const response = await apiClient.get<{ data: string[] }>(
      `${this.basePath}/related`,
      {
        params: { q: query, limit },
      }
    );

    return response.data;
  }
}

// 导出单例
export const searchService = new SearchService();
