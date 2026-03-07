/**
 * API 请求配置和工具函数
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // 服务器返回错误状态码
      const status = error.response.status;

      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            window.location.href = '/auth/login';
          }
          break;
        case 403:
          console.error('没有权限访问此资源');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error('请求失败:', error.message);
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('网络错误，请检查您的连接');
    } else {
      // 请求配置出错
      console.error('请求配置错误:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * 通用 API 请求函数
 */
export async function request<T = any>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
}

/**
 * GET 请求
 */
export async function get<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>({ ...config, method: 'GET', url });
}

/**
 * POST 请求
 */
export async function post<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>({ ...config, method: 'POST', url, data });
}

/**
 * PUT 请求
 */
export async function put<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>({ ...config, method: 'PUT', url, data });
}

/**
 * PATCH 请求
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>({ ...config, method: 'PATCH', url, data });
}

/**
 * DELETE 请求
 */
export async function del<T = any>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return request<T>({ ...config, method: 'DELETE', url });
}

/**
 * API 端点
 */
export const API_ENDPOINTS = {
  // 认证
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // 文章
  POSTS: {
    LIST: '/posts',
    DETAIL: (id: string) => `/posts/${id}`,
    FEATURED: '/posts/featured',
    SEARCH: '/posts/search',
  },

  // 分类
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
  },

  // 标签
  TAGS: {
    LIST: '/tags',
    DETAIL: (id: string) => `/tags/${id}`,
  },

  // 评论
  COMMENTS: {
    LIST: '/comments',
    CREATE: '/comments',
    DELETE: (id: string) => `/comments/${id}`,
    LIKE: (id: string) => `/comments/${id}/like`,
  },

  // 用户
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    BOOKMARKS: '/user/bookmarks',
  },

  // 媒体
  MEDIA: {
    LIST: '/media',
    UPLOAD: '/media/upload',
    DELETE: (id: string) => `/media/${id}`,
  },

  // 分析
  ANALYTICS: {
    PAGE_VIEW: '/analytics/page-view',
    EVENT: '/analytics/event',
  },
} as const;

/**
 * 分页参数接口
 */
export interface PaginationParams {
  page?: number;
  per_page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * 分页响应接口
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

/**
 * API 错误接口
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}
