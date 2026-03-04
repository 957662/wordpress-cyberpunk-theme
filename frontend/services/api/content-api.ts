/**
 * Content API Service
 * Handles all content-related API operations
 */

import { httpClient } from '../http-client';
import type {
  ApiResponse,
  PaginatedResponse,
  Pagination,
} from '../../types/api.types';

/**
 * Content types
 */
export interface Content {
  id: string;
  type: 'post' | 'page' | 'article';
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  author: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  featuredImage?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
  metadata?: Record<string, any>;
}

export interface ContentCreate {
  type: 'post' | 'page' | 'article';
  title: string;
  content: string;
  excerpt?: string;
  status?: 'draft' | 'published' | 'archived';
  categoryId?: string;
  tags?: string[];
  featuredImage?: string;
  metadata?: Record<string, any>;
}

export interface ContentUpdate extends Partial<ContentCreate> {
  id: string;
}

export interface ContentListParams extends Pagination {
  type?: 'post' | 'page' | 'article';
  status?: 'draft' | 'published' | 'archived';
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  search?: string;
  sortBy?: 'publishedAt' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Content API Service
 */
export const contentApi = {
  /**
   * Get content list
   */
  async list(params?: ContentListParams): Promise<PaginatedResponse<Content>> {
    const response = await httpClient.get<PaginatedResponse<Content>>('/api/v1/content', {
      params,
    });
    return response.data;
  },

  /**
   * Get content by ID
   */
  async getById(id: string): Promise<ApiResponse<Content>> {
    const response = await httpClient.get<ApiResponse<Content>>(`/api/v1/content/${id}`);
    return response.data;
  },

  /**
   * Get content by slug
   */
  async getBySlug(slug: string): Promise<ApiResponse<Content>> {
    const response = await httpClient.get<ApiResponse<Content>>(
      `/api/v1/content/slug/${slug}`
    );
    return response.data;
  },

  /**
   * Create content
   */
  async create(data: ContentCreate): Promise<ApiResponse<Content>> {
    const response = await httpClient.post<ApiResponse<Content>>(
      '/api/v1/content',
      data
    );
    return response.data;
  },

  /**
   * Update content
   */
  async update(data: ContentUpdate): Promise<ApiResponse<Content>> {
    const response = await httpClient.put<ApiResponse<Content>>(
      `/api/v1/content/${data.id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete content
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<ApiResponse<void>>(`/api/v1/content/${id}`);
    return response.data;
  },

  /**
   * Publish content
   */
  async publish(id: string): Promise<ApiResponse<Content>> {
    const response = await httpClient.post<ApiResponse<Content>>(
      `/api/v1/content/${id}/publish`
    );
    return response.data;
  },

  /**
   * Unpublish content
   */
  async unpublish(id: string): Promise<ApiResponse<Content>> {
    const response = await httpClient.post<ApiResponse<Content>>(
      `/api/v1/content/${id}/unpublish`
    );
    return response.data;
  },

  /**
   * Archive content
   */
  async archive(id: string): Promise<ApiResponse<Content>> {
    const response = await httpClient.post<ApiResponse<Content>>(
      `/api/v1/content/${id}/archive`
    );
    return response.data;
  },

  /**
   * Restore archived content
   */
  async restore(id: string): Promise<ApiResponse<Content>> {
    const response = await httpClient.post<ApiResponse<Content>>(
      `/api/v1/content/${id}/restore`
    );
    return response.data;
  },

  /**
   * Duplicate content
   */
  async duplicate(id: string): Promise<ApiResponse<Content>> {
    const response = await httpClient.post<ApiResponse<Content>>(
      `/api/v1/content/${id}/duplicate`
    );
    return response.data;
  },

  /**
   * Bulk delete content
   */
  async bulkDelete(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.post<ApiResponse<void>>('/api/v1/content/bulk-delete', {
      ids,
    });
    return response.data;
  },

  /**
   * Bulk publish content
   */
  async bulkPublish(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.post<ApiResponse<void>>('/api/v1/content/bulk-publish', {
      ids,
    });
    return response.data;
  },

  /**
   * Bulk archive content
   */
  async bulkArchive(ids: string[]): Promise<ApiResponse<void>> {
    const response = await httpClient.post<ApiResponse<void>>('/api/v1/content/bulk-archive', {
      ids,
    });
    return response.data;
  },

  /**
   * Search content
   */
  async search(query: string, params?: Omit<ContentListParams, 'search'>): Promise<PaginatedResponse<Content>> {
    const response = await httpClient.get<PaginatedResponse<Content>>('/api/v1/content/search', {
      params: { q: query, ...params },
    });
    return response.data;
  },

  /**
   * Get related content
   */
  async getRelated(id: string, limit: number = 5): Promise<ApiResponse<Content[]>> {
    const response = await httpClient.get<ApiResponse<Content[]>>(
      `/api/v1/content/${id}/related`,
      {
        params: { limit },
      }
    );
    return response.data;
  },

  /**
   * Get trending content
   */
  async getTrending(params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    limit?: number;
  }): Promise<ApiResponse<Content[]>> {
    const response = await httpClient.get<ApiResponse<Content[]>>('/api/v1/content/trending', {
      params,
    });
    return response.data;
  },

  /**
   * Get popular content
   */
  async getPopular(params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    limit?: number;
  }): Promise<ApiResponse<Content[]>> {
    const response = await httpClient.get<ApiResponse<Content[]>>('/api/v1/content/popular', {
      params,
    });
    return response.data;
  },

  /**
   * Get recent content
   */
  async getRecent(params?: {
    limit?: number;
  }): Promise<ApiResponse<Content[]>> {
    const response = await httpClient.get<ApiResponse<Content[]>>('/api/v1/content/recent', {
      params,
    });
    return response.data;
  },

  /**
   * Increment view count
   */
  async incrementViews(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.post<ApiResponse<void>>(
      `/api/v1/content/${id}/views`
    );
    return response.data;
  },

  /**
   * Get content stats
   */
  async getStats(id: string): Promise<ApiResponse<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>> {
    const response = await httpClient.get<ApiResponse<any>>(
      `/api/v1/content/${id}/stats`
    );
    return response.data;
  },

  /**
   * Get content analytics
   */
  async getAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    contentId?: string;
  }): Promise<ApiResponse<{
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    topContent: Content[];
    viewsByDay: Array<{ date: string; views: number }>;
  }>> {
    const response = await httpClient.get<ApiResponse<any>>('/api/v1/content/analytics', {
      params,
    });
    return response.data;
  },

  /**
   * Upload featured image
   */
  async uploadFeaturedImage(id: string, file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await httpClient.post<ApiResponse<{ url: string }>>(
      `/api/v1/content/${id}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Delete featured image
   */
  async deleteFeaturedImage(id: string): Promise<ApiResponse<void>> {
    const response = await httpClient.delete<ApiResponse<void>>(
      `/api/v1/content/${id}/image`
    );
    return response.data;
  },
};
