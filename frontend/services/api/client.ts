/**
 * API 客户端基础配置
 * 提供统一的 HTTP 请求接口
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

// 请求超时时间
const REQUEST_TIMEOUT = 30000;

/**
 * 创建 axios 实例
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: `${API_BASE_URL}${API_VERSION}`,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * 请求拦截器
   * 自动添加认证 token
   */
  client.interceptors.request.use(
    (config) => {
      // 从 localStorage 获取 token
      const token = localStorage.getItem('access_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  /**
   * 响应拦截器
   * 处理通用错误和 token 刷新
   */
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      // 处理 401 未授权错误
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // 尝试刷新 token
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
              refresh_token: refreshToken,
            });

            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);

            // 重新发送原始请求
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
            }
            return apiClient.request(originalRequest);
          }
        } catch (refreshError) {
          // 刷新失败，清除 token 并跳转到登录页
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      }

      // 处理其他错误
      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * 导出 API 客户端实例
 */
export const apiClient = createApiClient();

/**
 * API 请求辅助函数
 */
export class ApiClient {
  /**
   * GET 请求
   */
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiClient.get<T>(url, config);
  }

  /**
   * POST 请求
   */
  static async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.post<T>(url, data, config);
  }

  /**
   * PUT 请求
   */
  static async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.put<T>(url, data, config);
  }

  /**
   * PATCH 请求
   */
  static async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return apiClient.patch<T>(url, data, config);
  }

  /**
   * DELETE 请求
   */
  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return apiClient.delete<T>(url, config);
  }

  /**
   * 文件上传
   */
  static async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.post<T>(url, formData, {
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
   * 文件下载
   */
  static async download(url: string, filename: string): Promise<void> {
    const response = await apiClient.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
}

export default ApiClient;

/**
 * API 错误类型
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 处理 API 错误
 */
export const handleApiError = (error: any): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error.response) {
    // 服务器返回错误响应
    const { status, data } = error.response;
    return new ApiError(
      data?.message || '请求失败',
      status,
      data?.code,
      data?.details
    );
  } else if (error.request) {
    // 请求已发送但没有收到响应
    return new ApiError('网络错误，请检查您的网络连接', 0);
  } else {
    // 请求配置错误
    return new ApiError(error.message || '未知错误', 0);
  }
};
