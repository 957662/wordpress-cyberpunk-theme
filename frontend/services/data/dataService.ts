/**
 * CyberPress Platform - Data Service
 * 数据服务层 - 统一的数据获取和缓存管理
 */

import { QueryFunction, useQuery, UseQueryOptions, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

// ==================== 通用类型 ====================

export type QueryKey = readonly unknown[];

export interface ServiceResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ServiceError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// ==================== 基础服务类 ====================

export class DataService {
  /**
   * 通用的数据获取方法
   */
  static async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await apiClient.get<T>(endpoint, options);
      return { data: response.data };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * 分页数据获取
   */
  static async fetchPaginated<T>(
    endpoint: string,
    page: number = 1,
    pageSize: number = 10,
    params?: Record<string, any>
  ): Promise<ServiceResponse<T[]>> {
    try {
      const response = await apiClient.get<T[]>(endpoint, {
        params: {
          page,
          per_page: pageSize,
          ...params,
        },
      });

      const total = parseInt(response.headers['x-wp-total'] || '0', 10);
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

      return {
        data: response.data,
        meta: {
          total,
          page,
          pageSize,
          totalPages,
        },
      };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * POST 请求
   */
  static async post<T>(
    endpoint: string,
    data: any,
    options?: RequestInit
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await apiClient.post<T>(endpoint, data, options);
      return { data: response.data };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * PUT 请求
   */
  static async put<T>(
    endpoint: string,
    data: any,
    options?: RequestInit
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await apiClient.put<T>(endpoint, data, options);
      return { data: response.data };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * DELETE 请求
   */
  static async delete<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ServiceResponse<T>> {
    try {
      const response = await apiClient.delete<T>(endpoint, options);
      return { data: response.data };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * 错误处理
   */
  static handleError(error: any): ServiceError {
    if (error.response) {
      // HTTP 错误响应
      return {
        message: error.response.data?.message || '请求失败',
        code: error.response.data?.code,
        status: error.response.status,
        details: error.response.data,
      };
    } else if (error.request) {
      // 请求已发出但没有响应
      return {
        message: '网络连接失败，请检查您的网络',
        code: 'NETWORK_ERROR',
      };
    } else {
      // 其他错误
      return {
        message: error.message || '发生未知错误',
        code: 'UNKNOWN_ERROR',
      };
    }
  }

  /**
   * 生成查询键
   */
  static buildQueryKey(...parts: unknown[]): QueryKey {
    return parts;
  }
}

// ==================== 文章服务 ====================

export class PostService extends DataService {
  private static readonly BASE_URL = '/wp/v2/posts';

  /**
   * 获取文章列表
   */
  static async getPosts(params?: {
    page?: number;
    perPage?: number;
    category?: number;
    tag?: number;
    search?: string;
    author?: number;
    status?: string;
    orderBy?: 'date' | 'title' | 'relevance';
    order?: 'asc' | 'desc';
    sticky?: boolean;
    featured?: boolean;
  }) {
    return this.fetchPaginated(
      this.BASE_URL,
      params?.page || 1,
      params?.perPage || 10,
      params
    );
  }

  /**
   * 根据 slug 获取文章
   */
  static async getPostBySlug(slug: string) {
    return this.fetch(`${this.BASE_URL}?slug=${slug}&_embed`);
  }

  /**
   * 根据 ID 获取文章
   */
  static async getPostById(id: number) {
    return this.fetch(`${this.BASE_URL}/${id}?_embed`);
  }

  /**
   * 获取相关文章
   */
  static async getRelatedPosts(postId: number, limit: number = 4) {
    return this.fetch(`${this.BASE_URL}/${postId}/related?per_page=${limit}`);
  }

  /**
   * 搜索文章
   */
  static async searchPosts(keyword: string, page: number = 1, perPage: number = 10) {
    return this.fetchPaginated('/wp/v2/search', page, perPage, {
      search: keyword,
      subtype: 'post',
      _embed: true,
    });
  }
}

// ==================== 分类服务 ====================

export class CategoryService extends DataService {
  private static readonly BASE_URL = '/wp/v2/categories';

  /**
   * 获取所有分类
   */
  static async getCategories(params?: {
    perPage?: number;
    hideEmpty?: boolean;
  }) {
    return this.fetch(this.BASE_URL, {
      params: { per_page: params?.perPage || 100, hide_empty: params?.hideEmpty ?? true },
    });
  }

  /**
   * 根据 slug 获取分类
   */
  static async getCategoryBySlug(slug: string) {
    return this.fetch(`${this.BASE_URL}?slug=${slug}`);
  }

  /**
   * 根据 ID 获取分类
   */
  static async getCategoryById(id: number) {
    return this.fetch(`${this.BASE_URL}/${id}`);
  }
}

// ==================== 标签服务 ====================

export class TagService extends DataService {
  private static readonly BASE_URL = '/wp/v2/tags';

  /**
   * 获取所有标签
   */
  static async getTags(params?: {
    perPage?: number;
    hideEmpty?: boolean;
  }) {
    return this.fetch(this.BASE_URL, {
      params: { per_page: params?.perPage || 100, hide_empty: params?.hideEmpty ?? true },
    });
  }

  /**
   * 根据 slug 获取标签
   */
  static async getTagBySlug(slug: string) {
    return this.fetch(`${this.BASE_URL}?slug=${slug}`);
  }

  /**
   * 获取热门标签
   */
  static async getPopularTags(limit: number = 20) {
    return this.fetch(`${this.BASE_URL}?orderby=count&order=desc&per_page=${limit}`);
  }
}

// ==================== 评论服务 ====================

export class CommentService extends DataService {
  private static readonly BASE_URL = '/wp/v2/comments';

  /**
   * 获取文章评论
   */
  static async getComments(postId: number, params?: {
    page?: number;
    perPage?: number;
    order?: 'asc' | 'desc';
  }) {
    return this.fetchPaginated(
      this.BASE_URL,
      params?.page || 1,
      params?.perPage || 50,
      {
        post: postId,
        order: params?.order || 'asc',
      }
    );
  }

  /**
   * 提交评论
   */
  static async createComment(data: {
    postId: number;
    content: string;
    author: string;
    authorEmail: string;
    authorUrl?: string;
    parent?: number;
  }) {
    return this.post(this.BASE_URL, {
      post: data.postId,
      content: data.content,
      author_name: data.author,
      author_email: data.authorEmail,
      author_url: data.authorUrl,
      parent: data.parent,
    });
  }
}

// ==================== 媒体服务 ====================

export class MediaService extends DataService {
  private static readonly BASE_URL = '/wp/v2/media';

  /**
   * 获取媒体详情
   */
  static async getMedia(id: number) {
    return this.fetch(`${this.BASE_URL}/${id}`);
  }

  /**
   * 上传媒体
   */
  static async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.post(this.BASE_URL, formData, {
      headers: {
        'Content-Disposition': `attachment; filename="${file.name}"`,
      },
    });
  }
}

// ==================== 用户服务 ====================

export class UserService extends DataService {
  private static readonly BASE_URL = '/wp/v2/users';

  /**
   * 获取用户信息
   */
  static async getUser(id: number) {
    return this.fetch(`${this.BASE_URL}/${id}`);
  }

  /**
   * 更新用户信息
   */
  static async updateUser(id: number, data: any) {
    return this.put(`${this.BASE_URL}/${id}`, data);
  }

  /**
   * 获取当前用户
   */
  static async getCurrentUser() {
    return this.fetch(`${this.BASE_URL}/me`);
  }
}

// ==================== 搜索服务 ====================

export class SearchService extends DataService {
  /**
   * 全局搜索
   */
  static async search(query: string, params?: {
    page?: number;
    perPage?: number;
    type?: 'post' | 'page' | 'attachment' | 'all';
  }) {
    return this.fetchPaginated(
      '/wp/v2/search',
      params?.page || 1,
      params?.perPage || 10,
      {
        search: query,
        subtype: params?.type,
        _embed: true,
      }
    );
  }
}

// ==================== Hooks ====================

/**
 * 通用的 useQuery hook
 */
export function useServiceQuery<T>(
  queryKey: QueryKey,
  queryFn: QueryFunction<ServiceResponse<T>>,
  options?: Omit<UseQueryOptions<ServiceResponse<T>, ServiceError>, 'queryKey' | 'queryFn'>
) {
  return useQuery<ServiceResponse<T>, ServiceError>({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 分钟
    retry: 1,
    ...options,
  });
}

/**
 * 通用的 useMutation hook
 */
export function useServiceMutation<T, V = any>(
  mutationFn: (variables: V) => Promise<ServiceResponse<T>>,
  options?: Omit<UseMutationOptions<ServiceResponse<T>, ServiceError, V>, 'mutationFn'>
) {
  return useMutation<ServiceResponse<T>, ServiceError, V>({
    mutationFn,
    ...options,
  });
}

// ==================== 便捷 Hooks ====================

/**
 * 获取文章列表
 */
export function usePosts(params?: Parameters<typeof PostService.getPosts>[0]) {
  return useServiceQuery(
    ['posts', params],
    () => PostService.getPosts(params),
    {
      enabled: !!params,
    }
  );
}

/**
 * 获取单篇文章
 */
export function usePost(slug: string) {
  return useServiceQuery(
    ['post', slug],
    () => PostService.getPostBySlug(slug),
    {
      enabled: !!slug,
    }
  );
}

/**
 * 获取分类列表
 */
export function useCategories() {
  return useServiceQuery(
    ['categories'],
    () => CategoryService.getCategories(),
    {
      staleTime: 60 * 60 * 1000, // 1 小时
    }
  );
}

/**
 * 获取标签列表
 */
export function useTags() {
  return useServiceQuery(
    ['tags'],
    () => TagService.getTags(),
    {
      staleTime: 60 * 60 * 1000, // 1 小时
    }
  );
}

/**
 * 获取评论
 */
export function useComments(postId: number) {
  return useServiceQuery(
    ['comments', postId],
    () => CommentService.getComments(postId),
    {
      enabled: !!postId,
    }
  );
}

/**
 * 搜索
 */
export function useSearch(query: string, enabled?: boolean) {
  return useServiceQuery(
    ['search', query],
    () => SearchService.search(query),
    {
      enabled: enabled && query.length > 2,
    }
  );
}
