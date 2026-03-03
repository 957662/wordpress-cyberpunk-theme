/**
 * CyberPress Platform - API 服务
 * 赛博朋克风格的 API 客户端
 */

import { useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * API 错误类
 */
export class CyberApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'CyberApiError';
  }
}

/**
 * 请求配置接口
 */
export interface CyberRequestConfig extends RequestInit {
  params?: Record<string, string | number>;
}

/**
 * API 响应接口
 */
export interface CyberApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * 赛博朋克风格的 API 客户端类
 */
class CyberApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * 获取认证令牌
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * 构建完整 URL
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number>): string {
    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    return url;
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<CyberApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      throw new CyberApiError(
        response.status,
        data.message || 'An error occurred',
        data
      );
    }

    return data;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    config: CyberRequestConfig = {}
  ): Promise<CyberApiResponse<T>> {
    const { params, headers = {}, ...restConfig } = config;

    const url = this.buildUrl(endpoint, params);
    const token = this.getAuthToken();

    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    };

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...restConfig,
        headers: requestHeaders,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof CyberApiError) {
        throw error;
      }
      throw new CyberApiError(0, 'Network error occurred');
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<CyberApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      params,
    });
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data?: any): Promise<CyberApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, data?: any): Promise<CyberApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T>(endpoint: string, data?: any): Promise<CyberApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string): Promise<CyberApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// 创建单例实例
const cyberApiClient = new CyberApiClient();

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 用户登录
   */
  login: (email: string, password: string) =>
    cyberApiClient.post<{ token: string; user: any }>('/auth/login', { email, password }),

  /**
   * 用户注册
   */
  register: (email: string, password: string, name: string) =>
    cyberApiClient.post<{ token: string; user: any }>('/auth/register', {
      email,
      password,
      name,
    }),

  /**
   * 刷新令牌
   */
  refreshToken: (token: string) =>
    cyberApiClient.post<{ token: string }>('/auth/refresh', { token }),

  /**
   * 登出
   */
  logout: () => cyberApiClient.post('/auth/logout'),

  /**
   * 获取当前用户
   */
  me: () => cyberApiClient.get<any>('/auth/me'),
};

/**
 * 文章相关 API
 */
export const postsApi = {
  /**
   * 获取文章列表
   */
  list: (params?: { page?: number; limit?: number; category?: string; tag?: string }) =>
    cyberApiClient.get<any[]>('/posts', params),

  /**
   * 获取单篇文章
   */
  get: (id: string | number) => cyberApiClient.get<any>(`/posts/${id}`),

  /**
   * 创建文章
   */
  create: (data: any) => cyberApiClient.post<any>('/posts', data),

  /**
   * 更新文章
   */
  update: (id: string | number, data: any) => cyberApiClient.put<any>(`/posts/${id}`, data),

  /**
   * 删除文章
   */
  delete: (id: string | number) => cyberApiClient.delete<any>(`/posts/${id}`),

  /**
   * 搜索文章
   */
  search: (query: string, params?: { page?: number; limit?: number }) =>
    cyberApiClient.get<any[]>('/posts/search', { q: query, ...params }),
};

/**
 * 分类相关 API
 */
export const categoriesApi = {
  /**
   * 获取分类列表
   */
  list: () => cyberApiClient.get<any[]>('/categories'),

  /**
   * 获取单个分类
   */
  get: (id: string | number) => cyberApiClient.get<any>(`/categories/${id}`),

  /**
   * 创建分类
   */
  create: (data: any) => cyberApiClient.post<any>('/categories', data),

  /**
   * 更新分类
   */
  update: (id: string | number, data: any) => cyberApiClient.put<any>(`/categories/${id}`, data),

  /**
   * 删除分类
   */
  delete: (id: string | number) => cyberApiClient.delete<any>(`/categories/${id}`),
};

/**
 * 标签相关 API
 */
export const tagsApi = {
  /**
   * 获取标签列表
   */
  list: () => cyberApiClient.get<any[]>('/tags'),

  /**
   * 获取单个标签
   */
  get: (id: string | number) => cyberApiClient.get<any>(`/tags/${id}`),

  /**
   * 创建标签
   */
  create: (data: any) => cyberApiClient.post<any>('/tags', data),

  /**
   * 更新标签
   */
  update: (id: string | number, data: any) => cyberApiClient.put<any>(`/tags/${id}`, data),

  /**
   * 删除标签
   */
  delete: (id: string | number) => cyberApiClient.delete<any>(`/tags/${id}`),
};

/**
 * 评论相关 API
 */
export const commentsApi = {
  /**
   * 获取评论列表
   */
  list: (postId: string | number, params?: { page?: number; limit?: number }) =>
    cyberApiClient.get<any[]>(`/posts/${postId}/comments`, params),

  /**
   * 创建评论
   */
  create: (postId: string | number, data: any) =>
    cyberApiClient.post<any>(`/posts/${postId}/comments`, data),

  /**
   * 删除评论
   */
  delete: (postId: string | number, commentId: string | number) =>
    cyberApiClient.delete<any>(`/posts/${postId}/comments/${commentId}`),
};

/**
 * 用户相关 API
 */
export const usersApi = {
  /**
   * 获取用户列表
   */
  list: (params?: { page?: number; limit?: number }) =>
    cyberApiClient.get<any[]>('/users', params),

  /**
   * 获取单个用户
   */
  get: (id: string | number) => cyberApiClient.get<any>(`/users/${id}`),

  /**
   * 更新用户
   */
  update: (id: string | number, data: any) => cyberApiClient.patch<any>(`/users/${id}`, data),

  /**
   * 删除用户
   */
  delete: (id: string | number) => cyberApiClient.delete<any>(`/users/${id}`),
};

/**
 * 搜索相关 API
 */
export const searchApi = {
  /**
   * 全局搜索
   */
  search: (query: string, params?: { type?: string; page?: number; limit?: number }) =>
    cyberApiClient.get<any[]>('/search', { q: query, ...params }),
};

/**
 * 健康检查 API
 */
export const healthApi = {
  /**
   * 检查 API 健康状态
   */
  check: () => cyberApiClient.get<{ status: string; timestamp: string }>('/health'),
};

/**
 * React Hook for API calls
 */
export function useCyberApi() {
  return {
    auth: authApi,
    posts: postsApi,
    categories: categoriesApi,
    tags: tagsApi,
    comments: commentsApi,
    users: usersApi,
    search: searchApi,
    health: healthApi,
  };
}

export default cyberApiClient;
