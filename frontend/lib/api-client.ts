/**
 * API Client - 统一的 API 请求客户端
 * 基于 axios 封装，支持请求拦截、响应拦截、错误处理等
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import toast from 'react-hot-toast';

// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  meta?: {
    page?: number;
    per_page?: number;
    total?: number;
    total_pages?: number;
  };
}

// 请求配置
export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加认证令牌
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }

        // 添加时间戳防止缓存
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now(),
          };
        }

        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error: AxiosError<ApiResponse>) => {
        return this.handleError(error);
      }
    );
  }

  // 错误处理
  private handleError(error: AxiosError<ApiResponse>): Promise<never> {
    const { response, request, message } = error;

    if (response) {
      // 服务器返回错误响应
      const { status, data } = response;
      const errorMessage = data?.message || this.getErrorMessage(status);

      // 显示错误提示
      if (status !== 401) {
        toast.error(errorMessage);
      }

      // 处理特定状态码
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转登录
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('没有权限访问此资源');
          break;
        case 404:
          toast.error('请求的资源不存在');
          break;
        case 500:
          toast.error('服务器内部错误，请稍后重试');
          break;
      }

      return Promise.reject({
        status,
        message: errorMessage,
        data: data?.data,
      } as ApiError);
    } else if (request) {
      // 请求已发送但没有收到响应
      toast.error('网络连接失败，请检查网络设置');
      return Promise.reject({
        status: 0,
        message: '网络连接失败',
      } as ApiError);
    } else {
      // 请求配置错误
      toast.error(message || '请求配置错误');
      return Promise.reject({
        status: -1,
        message: message || '请求配置错误',
      } as ApiError);
    }
  }

  // 获取错误消息
  private getErrorMessage(status: number): string {
    const errorMessages: Record<number, string> = {
      400: '请求参数错误',
      401: '未授权，请先登录',
      403: '没有权限访问',
      404: '资源不存在',
      405: '请求方法不允许',
      409: '资源冲突',
      422: '数据验证失败',
      429: '请求过于频繁，请稍后重试',
      500: '服务器内部错误',
      502: '网关错误',
      503: '服务暂时不可用',
      504: '网关超时',
    };

    return errorMessages[status] || '请求失败，请稍后重试';
  }

  // 设置 Token
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // 获取 Token
  getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  // 清除 Token
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // GET 请求
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.get(url, config);
  }

  // POST 请求
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.post(url, data, config);
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.put(url, data, config);
  }

  // PATCH 请求
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.patch(url, data, config);
  }

  // DELETE 请求
  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.instance.delete(url, config);
  }

  // 文件上传
  async upload<T = any>(
    url: string,
    file: File | FormData,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    }

    return this.instance.post(url, formData, {
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

  // 批量请求
  async batch<T = any>(
    requests: Array<() => Promise<ApiResponse<T>>>
  ): Promise<ApiResponse<T>[]> {
    return Promise.all(requests.map((req) => req()));
  }

  // 取消请求
  createCancelToken() {
    return axios.CancelToken.source();
  }
}

// API 错误类型
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}

// 创建默认实例
const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
);

// 导出实例和类
export default apiClient;
export { ApiClient };

// 便捷的 API 方法导出
export const api = {
  get: <T = any>(url: string, config?: RequestConfig) => apiClient.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    apiClient.post<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    apiClient.put<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    apiClient.patch<T>(url, data, config),
  delete: <T = any>(url: string, config?: RequestConfig) =>
    apiClient.delete<T>(url, config),
  upload: <T = any>(
    url: string,
    file: File | FormData,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ) => apiClient.upload<T>(url, file, onProgress, config),
};

/**
 * 使用示例:
 *
 * import { api } from '@/lib/api-client';
 *
 * // GET 请求
 * const response = await api.get('/posts', {
 *   params: { page: 1, per_page: 10 }
 * });
 *
 * // POST 请求
 * const response = await api.post('/posts', {
 *   title: '新文章',
 *   content: '文章内容'
 * });
 *
 * // 文件上传
 * const response = await api.upload('/upload', file, (progress) => {
 *   console.log('上传进度:', progress);
 * });
 */
