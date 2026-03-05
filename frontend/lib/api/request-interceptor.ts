/**
 * Request Interceptor
 * HTTP 请求拦截器 - 统一处理请求和响应
 * CyberPress Platform
 */

import { errorHandler, AppError, NetworkError, AuthError } from '@/lib/utils/error-handler-enhanced';

export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number;
}

export interface Response<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface Interceptor {
  onRequest?(config: RequestConfig): RequestConfig | Promise<RequestConfig>;
  onRequestError?(error: Error): void;
  onResponse?(response: Response): Response | Promise<Response>;
  onResponseError?(error: Error): void;
}

/**
 * 请求拦截器类
 */
export class RequestInterceptor {
  private interceptors: {
    request: Array<NonNullable<Interceptor['onRequest']>>;
    response: Array<NonNullable<Interceptor['onResponse']>>;
    requestError: Array<NonNullable<Interceptor['onRequestError']>>;
    responseError: Array<NonNullable<Interceptor['onResponseError']>>;
  } = {
    request: [],
    response: [],
    requestError: [],
    responseError: [],
  };

  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(config: {
    baseURL?: string;
    defaultHeaders?: Record<string, string>;
    defaultTimeout?: number;
  } = {}) {
    this.baseURL = config.baseURL ?? '';
    this.defaultHeaders = config.defaultHeaders ?? {
      'Content-Type': 'application/json',
    };
    this.defaultTimeout = config.defaultTimeout ?? 10000;
  }

  /**
   * 添加请求拦截器
   */
  useRequestInterceptor(interceptor: NonNullable<Interceptor['onRequest']>): () => void {
    this.interceptors.request.push(interceptor);
    return () => {
      const index = this.interceptors.request.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.request.splice(index, 1);
      }
    };
  }

  /**
   * 添加响应拦截器
   */
  useResponseInterceptor(interceptor: NonNullable<Interceptor['onResponse']>): () => void {
    this.interceptors.response.push(interceptor);
    return () => {
      const index = this.interceptors.response.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.response.splice(index, 1);
      }
    };
  }

  /**
   * 添加请求错误拦截器
   */
  useRequestErrorInterceptor(interceptor: NonNullable<Interceptor['onRequestError']>): () => void {
    this.interceptors.requestError.push(interceptor);
    return () => {
      const index = this.interceptors.requestError.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.requestError.splice(index, 1);
      }
    };
  }

  /**
   * 添加响应错误拦截器
   */
  useResponseErrorInterceptor(interceptor: NonNullable<Interceptor['onResponseError']>): () => void {
    this.interceptors.responseError.push(interceptor);
    return () => {
      const index = this.interceptors.responseError.indexOf(interceptor);
      if (index > -1) {
        this.interceptors.responseError.splice(index, 1);
      }
    };
  }

  /**
   * 发送请求
   */
  async request<T = any>(config: RequestConfig): Promise<Response<T>> {
    try {
      // 应用请求拦截器
      let finalConfig = { ...config };
      for (const interceptor of this.interceptors.request) {
        finalConfig = await interceptor(finalConfig);
      }

      // 构建完整URL
      const url = this.buildURL(finalConfig.url);

      // 检查缓存
      if (finalConfig.cache && finalConfig.method === 'GET') {
        const cached = this.getFromCache(url, finalConfig.cacheTTL);
        if (cached) {
          return cached as Response<T>;
        }
      }

      // 设置默认headers
      const headers = {
        ...this.defaultHeaders,
        ...finalConfig.headers,
      };

      // 设置超时
      const timeout = finalConfig.timeout ?? this.defaultTimeout;

      // 发送请求
      const response = await this.fetchWithTimeout(
        url,
        {
          method: finalConfig.method ?? 'GET',
          headers,
          body: finalConfig.body ? JSON.stringify(finalConfig.body) : undefined,
        },
        timeout
      );

      // 构建响应对象
      let result: Response<T> = {
        data: await response.json(),
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };

      // 应用响应拦截器
      for (const interceptor of this.interceptors.response) {
        result = await interceptor(result);
      }

      // 缓存GET请求
      if (finalConfig.cache && finalConfig.method === 'GET' && response.ok) {
        this.setToCache(url, result, finalConfig.cacheTTL);
      }

      // 检查响应状态
      if (!response.ok) {
        throw this.createErrorFromResponse(result);
      }

      return result;
    } catch (error) {
      // 处理请求错误
      for (const interceptor of this.interceptors.requestError) {
        interceptor(error as Error);
      }

      // 处理响应错误
      for (const interceptor of this.interceptors.responseError) {
        interceptor(error as Error);
      }

      // 重新抛出错误
      throw error;
    }
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'GET' });
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, body?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'body'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'POST', body });
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, body?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'body'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'PUT', body });
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' });
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, body?: any, config?: Omit<RequestConfig, 'url' | 'method' | 'body'>): Promise<Response<T>> {
    return this.request<T>({ ...config, url, method: 'PATCH', body });
  }

  /**
   * 构建完整URL
   */
  private buildURL(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return this.baseURL + url;
  }

  /**
   * 带超时的fetch
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        throw new NetworkError('Request timeout');
      }
      throw error;
    }
  }

  /**
   * 从响应创建错误
   */
  private createErrorFromResponse(response: Response): Error {
    const { data, status } = response;

    switch (status) {
      case 401:
        return new AuthError(data.message || 'Authentication failed');
      case 403:
        return new AppError(data.message || 'Forbidden', 'PERMISSION_DENIED', 403);
      case 404:
        return new AppError(data.message || 'Not found', 'NOT_FOUND', 404);
      case 422:
        return new AppError(data.message || 'Validation error', 'VALIDATION_ERROR', 422);
      case 500:
        return new AppError(data.message || 'Internal server error', 'SERVER_ERROR', 500);
      default:
        return new NetworkError(data.message || 'Network error', status);
    }
  }

  /**
   * 从缓存获取
   */
  private getFromCache(url: string, ttl?: number): Response | null {
    const cached = this.cache.get(url);
    if (!cached) {
      return null;
    }

    const now = Date.now();
    const cacheTTL = ttl ?? cached.ttl;

    if (now - cached.timestamp > cacheTTL) {
      this.cache.delete(url);
      return null;
    }

    return cached.data;
  }

  /**
   * 设置缓存
   */
  private setToCache(url: string, data: Response, ttl?: number): void {
    const cacheTTL = ttl ?? 300000; // 默认5分钟
    this.cache.set(url, {
      data,
      timestamp: Date.now(),
      ttl: cacheTTL,
    });
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 清理过期缓存
   */
  cleanupCache(): void {
    const now = Date.now();
    for (const [url, cached] of this.cache) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(url);
      }
    }
  }
}

/**
 * 创建默认的请求拦截器实例
 */
export const requestInterceptor = new RequestInterceptor({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  defaultTimeout: 10000,
});

/**
 * 添加认证token拦截器
 */
requestInterceptor.useRequestInterceptor(async (config) => {
  // 从localStorage获取token
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

/**
 * 添加请求日志拦截器
 */
if (process.env.NODE_ENV === 'development') {
  requestInterceptor.useRequestInterceptor((config) => {
    console.log('[Request]', config.method, config.url, config.body);
    return config;
  });

  requestInterceptor.useResponseInterceptor((response) => {
    console.log('[Response]', response.status, response.data);
    return response;
  });
}

/**
 * 添加错误处理拦截器
 */
requestInterceptor.useResponseErrorInterceptor((error) => {
  errorHandler.handleError(error, {
    action: 'http_request',
  });
  return error;
});

export default requestInterceptor;
