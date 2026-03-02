/**
 * API 客户端
 * 统一的 HTTP 请求处理
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError
} from 'axios';

// 类型定义
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
  retry?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  code?: number;
}

export interface ApiError {
  message: string;
  code?: number;
  details?: any;
}

// API 客户端类
class ApiClient {
  private client: AxiosInstance;
  private retryCount: Map<string, number> = new Map();

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加认证令牌
        if (!config.skipAuth) {
          const token = this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // 添加请求 ID
        config.headers['X-Request-ID'] = this.generateRequestId();

        // 添加时间戳
        config.headers['X-Request-Time'] = Date.now().toString();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // 计算请求耗时
        const requestTime = response.config.headers['X-Request-Time'];
        if (requestTime) {
          const duration = Date.now() - parseInt(requestTime);
          response.metadata = { duration };
        }

        return response;
      },
      async (error: AxiosError) => {
        const config = error.config as RequestConfig;

        // 跳过错误处理
        if (config?.skipErrorHandler) {
          return Promise.reject(error);
        }

        // 处理特定错误
        if (error.response) {
          const status = error.response.status;

          // 401 未授权 - 尝试刷新令牌
          if (status === 401 && !config?.skipAuth) {
            return this.handleUnauthorized(error);
          }

          // 429 请求过多 - 重试
          if (status === 429 && config?.retry) {
            return this.handleRetry(error);
          }
        }

        // 处理网络错误
        if (!error.response && config?.retry) {
          return this.handleRetry(error);
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  /**
   * 获取认证令牌
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * 生成请求 ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 处理未授权错误
   */
  private async handleUnauthorized(error: AxiosError): Promise<any> {
    try {
      // 尝试刷新令牌
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.client.post('/auth/refresh', {
        refreshToken
      });

      const { token } = response.data;

      // 保存新令牌
      localStorage.setItem('auth_token', token);

      // 重试原请求
      if (error.config) {
        error.config.headers.Authorization = `Bearer ${token}`;
        return this.client.request(error.config);
      }
    } catch (refreshError) {
      // 刷新失败，清除令牌并跳转到登录页
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');

      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }

      return Promise.reject(refreshError);
    }
  }

  /**
   * 处理重试逻辑
   */
  private async handleRetry(error: AxiosError): Promise<any> {
    const config = error.config as RequestConfig;
    const requestId = config.headers['X-Request-ID'];

    // 获取当前重试次数
    const currentRetry = this.retryCount.get(requestId) || 0;
    const maxRetry = config.retry || 3;

    if (currentRetry >= maxRetry) {
      this.retryCount.delete(requestId);
      return Promise.reject(error);
    }

    // 更新重试次数
    this.retryCount.set(requestId, currentRetry + 1);

    // 等待后重试
    const delay = Math.pow(2, currentRetry) * 1000; // 指数退避
    await new Promise((resolve) => setTimeout(resolve, delay));

    return this.client.request(config);
  }

  /**
   * 标准化错误信息
   */
  private normalizeError(error: AxiosError): ApiError {
    if (error.response) {
      // 服务器返回错误响应
      const data = error.response.data as any;
      return {
        message: data?.message || '请求失败',
        code: error.response.status,
        details: data
      };
    } else if (error.request) {
      // 请求已发出但没有收到响应
      return {
        message: '网络错误，请检查您的网络连接',
        details: error.request
      };
    } else {
      // 请求配置错误
      return {
        message: error.message || '请求配置错误',
        details: error
      };
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  /**
   * 上传文件
   */
  async upload<T = any>(
    url: string,
    file: File | Blob,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers
      }
    });

    return response.data;
  }

  /**
   * 批量请求
   */
  async batch<T = any>(
    requests: Array<{ method: string; url: string; data?: any }>
  ): Promise<ApiResponse<T[]>> {
    const response = await this.client.post<ApiResponse<T[]>>('/batch', {
      requests
    });
    return response.data;
  }
}

// 创建默认客户端实例
const apiURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8000/api/v1'
    : '/api/v1');

export const apiClient = new ApiClient(apiURL);

// 导出类型
export type { RequestConfig, ApiResponse, ApiError };

/**
 * 使用 API Hook 的辅助函数
 */
export function createApiHook<T, P extends any[] = any[]>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string | ((...args: P) => string)
) {
  return async (...args: P): Promise<T> => {
    const finalUrl = typeof url === 'function' ? url(...args) : url;
    const config: RequestConfig = {};

    let response: ApiResponse<T>;

    switch (method) {
      case 'get':
        response = await apiClient.get<T>(finalUrl, config);
        break;
      case 'post':
        response = await apiClient.post<T>(finalUrl, args[0], config);
        break;
      case 'put':
        response = await apiClient.put<T>(finalUrl, args[0], config);
        break;
      case 'patch':
        response = await apiClient.patch<T>(finalUrl, args[0], config);
        break;
      case 'delete':
        response = await apiClient.delete<T>(finalUrl, config);
        break;
    }

    return response.data;
  };
}
