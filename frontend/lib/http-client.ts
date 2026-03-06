/**
 * HTTP Client
 * HTTP 请求客户端
 *
 * 封装 fetch API，提供统一的请求处理、错误处理和拦截器
 */

import { AuthStore } from '@/store/authStore';

export interface HttpClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

export class HttpClientError extends Error {
  constructor(
    public message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'HttpClientError';
  }
}

export class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
    this.timeout = config.timeout || 30000;
  }

  /**
   * 构建完整的 URL
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseURL}${endpoint}`;

    if (!params) {
      return url;
    }

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
   * 获取认证令牌
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return AuthStore.getToken();
    }
    return null;
  }

  /**
   * 构建请求头
   */
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers = { ...this.defaultHeaders };

    // 添加认证令牌
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return {
      ...headers,
      ...customHeaders,
    };
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // 处理 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    // 解析 JSON
    const data = await response.json().catch(() => null);

    // 处理错误状态
    if (!response.ok) {
      throw new HttpClientError(
        data?.detail || data?.message || '请求失败',
        response.status,
        data
      );
    }

    return data as T;
  }

  /**
   * 发送请求
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint, config.params);
    const headers = this.buildHeaders(config.headers);

    // 请求配置
    const requestConfig: RequestInit = {
      method,
      headers,
    };

    // 添加请求体
    if (data && method !== 'GET') {
      if (data instanceof FormData) {
        // FormData 不需要设置 Content-Type，浏览器会自动设置
        delete headers['Content-Type'];
        requestConfig.body = data;
      } else {
        requestConfig.body = JSON.stringify(data);
      }
    }

    // 超时处理
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || this.timeout);
    requestConfig.signal = controller.signal;

    try {
      const response = await fetch(url, requestConfig);
      clearTimeout(timeoutId);

      // 处理认证失败
      if (response.status === 401) {
        // 尝试刷新令牌
        const refreshToken = AuthStore.getRefreshToken();
        if (refreshToken) {
          try {
            // 这里可以添加刷新令牌的逻辑
            // 暂时简单处理：清除本地令牌并跳转登录
            if (typeof window !== 'undefined') {
              AuthStore.logout();
              window.location.href = '/login';
            }
          } catch (error) {
            console.error('刷新令牌失败:', error);
          }
        }
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      // 处理超时
      if (error instanceof Error && error.name === 'AbortError') {
        throw new HttpClientError('请求超时', 408);
      }

      // 处理网络错误
      if (error instanceof TypeError) {
        throw new HttpClientError('网络错误，请检查您的网络连接', 0);
      }

      throw error;
    }
  }

  /**
   * GET 请求
   */
  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  /**
   * POST 请求
   */
  post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', endpoint, data, config);
  }

  /**
   * PUT 请求
   */
  put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  /**
   * PATCH 请求
   */
  patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, config);
  }

  /**
   * DELETE 请求
   */
  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

// 导出单例实例
export const httpClient = new HttpClient();
