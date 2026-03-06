/**
 * 基础 API 客户端
 * 提供统一的 HTTP 请求接口
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { AppError, NetworkError, handleError } from '../errors';

// API 配置
const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: string;
  meta?: {
    total?: number;
    page?: number;
    perPage?: number;
    totalPages?: number;
  };
}

// 请求配置
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
}

/**
 * 基础 API 客户端类
 */
class BaseApiClient {
  private client: AxiosInstance;

  constructor(config: typeof API_CONFIG = API_CONFIG) {
    this.client = axios.create(config);

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => this.requestInterceptor(config),
      (error) => this.requestErrorHandler(error)
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => this.responseInterceptor(response),
      (error) => this.responseErrorHandler(error)
    );
  }

  /**
   * 请求拦截器
   */
  private requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig {
    // 添加认证 token
    const token = this.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }

  /**
   * 请求错误处理
   */
  private requestErrorHandler(error: any): Promise<never> {
    console.error('Request error:', error);
    return Promise.reject(error);
  }

  /**
   * 响应拦截器
   */
  private responseInterceptor<T>(response: AxiosResponse<ApiResponse<T>>): ApiResponse<T> {
    return response.data;
  }

  /**
   * 响应错误处理
   */
  private responseErrorHandler(error: AxiosError<any>): Promise<never> {
    const appError = this.transformError(error);
    return Promise.reject(appError);
  }

  /**
   * 转换错误
   */
  private transformError(error: AxiosError<any>): AppError {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          return new AppError(data?.message || '请求参数错误', 'BAD_REQUEST', 400, data);
        case 401:
          return new AppError(data?.message || '未授权', 'UNAUTHORIZED', 401, data);
        case 403:
          return new AppError(data?.message || '禁止访问', 'FORBIDDEN', 403, data);
        case 404:
          return new AppError(data?.message || '资源未找到', 'NOT_FOUND', 404, data);
        case 422:
          return new AppError(data?.message || '数据验证失败', 'VALIDATION_ERROR', 422, data);
        case 500:
          return new AppError(data?.message || '服务器错误', 'SERVER_ERROR', 500, data);
        default:
          return new AppError(data?.message || '请求失败', 'UNKNOWN_ERROR', status, data);
      }
    }

    if (error.request) {
      return new NetworkError('网络错误，请检查您的网络连接');
    }

    return new AppError(error.message, 'UNKNOWN_ERROR', 500);
  }

  /**
   * 获取 token
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * GET 请求
   */
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.get(url, config);
  }

  /**
   * POST 请求
   */
  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.post(url, data, config);
  }

  /**
   * PUT 请求
   */
  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.put(url, data, config);
  }

  /**
   * PATCH 请求
   */
  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.patch(url, data, config);
  }

  /**
   * DELETE 请求
   */
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.client.delete(url, config);
  }

  /**
   * 文件上传
   */
  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  /**
   * 批量请求
   */
  async batch<T>(
    requests: Array<() => Promise<ApiResponse<T>>>
  ): Promise<ApiResponse<T>[]> {
    return Promise.all(requests.map(req => req()));
  }
}

// 创建默认实例
export const apiClient = new BaseApiClient();

export default BaseApiClient;
