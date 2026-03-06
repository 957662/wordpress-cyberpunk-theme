/**
 * 增强型 API 客户端
 * 提供统一的 API 调用接口，包含缓存、重试、错误处理等功能
 */

import { toast } from 'sonner';

export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelay?: number;
  enableCache?: boolean;
  cacheTimeout?: number;
  onError?: (error: ApiError) => void;
}

export interface ApiRequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheKey?: string;
}

export interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  success: boolean;
  message?: string;
}

/**
 * API 客户端类
 */
export class ApiClient {
  private config: Required<ApiClientConfig>;
  private cache: Map<string, { data: any; timestamp: number }>;

  constructor(config: ApiClientConfig = {}) {
    this.config = {
      baseURL: config.baseURL || '/api',
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      retries: config.retries || 3,
      retryDelay: config.retryDelay || 1000,
      enableCache: config.enableCache ?? true,
      cacheTimeout: config.cacheTimeout || 60000, // 1 分钟
      onError: config.onError || this.defaultErrorHandler,
    };
    this.cache = new Map();
  }

  /**
   * 默认错误处理器
   */
  private defaultErrorHandler(error: ApiError): void {
    console.error('API Error:', error);

    // 显示错误提示
    if (error.status === 401) {
      toast.error('请先登录');
    } else if (error.status === 403) {
      toast.error('没有权限');
    } else if (error.status === 404) {
      toast.error('请求的资源不存在');
    } else if (error.status === 500) {
      toast.error('服务器错误，请稍后再试');
    } else {
      toast.error(error.message || '请求失败');
    }
  }

  /**
   * 构建 URL
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = endpoint.startsWith('http')
      ? endpoint
      : `${this.config.baseURL}${endpoint}`;

    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * 获取缓存
   */
  private getCache(key: string): any | null {
    if (!this.config.enableCache) return null;

    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.config.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * 设置缓存
   */
  private setCache(key: string, data: any): void {
    if (!this.config.enableCache) return;

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * 清除缓存
   */
  public clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 创建请求超时 Promise
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('请求超时'));
      }, timeout);
    });
  }

  /**
   * 发送请求
   */
  private async fetchWithRetry(
    url: string,
    options: ApiRequestConfig,
    retries: number
  ): Promise<Response> {
    try {
      const response = await Promise.race([
        fetch(url, options),
        this.createTimeoutPromise(options.timeout || this.config.timeout),
      ]) as Response;

      if (!response.ok) {
        const error: ApiError = new Error(response.statusText);
        error.status = response.status;
        throw error;
      }

      return response;
    } catch (error) {
      // 如果还有重试次数且是网络错误或超时，则重试
      if (
        retries > 0 &&
        (error instanceof TypeError || error.message === '请求超时')
      ) {
        await new Promise(resolve =>
          setTimeout(resolve, this.config.retryDelay)
        );
        return this.fetchWithRetry(url, options, retries - 1);
      }

      throw error;
    }
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      data,
      status: response.status,
      headers: response.headers,
      success: response.ok,
      message: data?.message,
    };
  }

  /**
   * GET 请求
   */
  public async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const cacheKey = config?.cacheKey || this.buildUrl(endpoint, params);

    // 检查缓存
    if (config?.cache !== false) {
      const cached = this.getCache(cacheKey);
      if (cached) {
        return {
          data: cached,
          status: 200,
          headers: new Headers(),
          success: true,
        };
      }
    }

    const url = this.buildUrl(endpoint, params);
    const options: RequestInit = {
      method: 'GET',
      headers: this.config.headers,
      ...config,
    };

    try {
      const response = await this.fetchWithRetry(
        url,
        options,
        config?.retries ?? this.config.retries
      );

      const result = await this.handleResponse<T>(response);

      // 缓存成功响应
      if (result.success && config?.cache !== false) {
        this.setCache(cacheKey, result.data);
      }

      return result;
    } catch (error) {
      const apiError: ApiError = error as ApiError;
      this.config.onError(apiError);
      throw apiError;
    }
  }

  /**
   * POST 请求
   */
  public async post<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const options: RequestInit = {
      method: 'POST',
      headers: this.config.headers,
      body: JSON.stringify(data),
      ...config,
    };

    try {
      const response = await this.fetchWithRetry(
        url,
        options,
        config?.retries ?? this.config.retries
      );

      // POST 请求后清除相关缓存
      if (response.ok) {
        this.clearCache();
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      const apiError: ApiError = error as ApiError;
      this.config.onError(apiError);
      throw apiError;
    }
  }

  /**
   * PUT 请求
   */
  public async put<T>(
    endpoint: string,
    data?: any,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const options: RequestInit = {
      method: 'PUT',
      headers: this.config.headers,
      body: JSON.stringify(data),
      ...config,
    };

    try {
      const response = await this.fetchWithRetry(
        url,
        options,
        config?.retries ?? this.config.retries
      );

      // PUT 请求后清除相关缓存
      if (response.ok) {
        this.clearCache();
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      const apiError: ApiError = error as ApiError;
      this.config.onError(apiError);
      throw apiError;
    }
  }

  /**
   * DELETE 请求
   */
  public async delete<T>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const options: RequestInit = {
      method: 'DELETE',
      headers: this.config.headers,
      ...config,
    };

    try {
      const response = await this.fetchWithRetry(
        url,
        options,
        config?.retries ?? this.config.retries
      );

      // DELETE 请求后清除相关缓存
      if (response.ok) {
        this.clearCache();
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      const apiError: ApiError = error as ApiError;
      this.config.onError(apiError);
      throw apiError;
    }
  }

  /**
   * 文件上传
   */
  public async upload<T>(
    endpoint: string,
    file: File,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const formData = new FormData();
    formData.append('file', file);

    const options: RequestInit = {
      method: 'POST',
      headers: {
        // 不设置 Content-Type，让浏览器自动设置
        ...config?.headers,
      },
      body: formData,
      ...config,
    };

    try {
      const response = await this.fetchWithRetry(
        url,
        options,
        config?.retries ?? this.config.retries
      );

      return await this.handleResponse<T>(response);
    } catch (error) {
      const apiError: ApiError = error as ApiError;
      this.config.onError(apiError);
      throw apiError;
    }
  }
}

// 创建默认实例
export const apiClient = new ApiClient();

// 导出便捷方法
export const { get, post, put, delete: del, upload } = apiClient;
export const { clearCache } = apiClient;

export default apiClient;
