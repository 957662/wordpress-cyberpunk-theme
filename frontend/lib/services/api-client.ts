/**
 * API Client Service
 * 赛博朋克风格的 HTTP 请求客户端
 */

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  baseURL?: string;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
}

export class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private interceptors: {
    request: Array<(config: RequestConfig) => RequestConfig | Promise<RequestConfig>>;
    response: Array<(response: ApiResponse) => ApiResponse | Promise<ApiResponse>>;
    error: Array<(error: ApiError) => ApiError | Promise<ApiError>>;
  };

  constructor(config: { baseURL?: string; timeout?: number; retries?: number } = {}) {
    this.baseURL = config.baseURL || '';
    this.defaultTimeout = config.timeout || 10000;
    this.defaultRetries = config.retries || 3;
    this.interceptors = {
      request: [],
      response: [],
      error: [],
    };
  }

  /**
   * 添加请求拦截器
   */
  useRequestInterceptor(
    interceptor: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  ) {
    this.interceptors.request.push(interceptor);
  }

  /**
   * 添加响应拦截器
   */
  useResponseInterceptor(
    interceptor: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>
  ) {
    this.interceptors.response.push(interceptor);
  }

  /**
   * 添加错误拦截器
   */
  useErrorInterceptor(
    interceptor: (error: ApiError) => ApiError | Promise<ApiError>
  ) {
    this.interceptors.error.push(interceptor);
  }

  /**
   * 构建完整 URL
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    if (!params) return fullURL;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${fullURL}?${queryString}` : fullURL;
  }

  /**
   * 带超时的 fetch
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestConfig,
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
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时');
      }
      throw error;
    }
  }

  /**
   * 带重试的请求
   */
  private async fetchWithRetry(
    url: string,
    options: RequestConfig,
    retries: number
  ): Promise<Response> {
    let lastError: Error | null = null;

    for (let i = 0; i <= retries; i++) {
      try {
        return await this.fetchWithTimeout(url, options, options.timeout || this.defaultTimeout);
      } catch (error) {
        lastError = error as Error;
        if (i < retries) {
          // 指数退避
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }

    throw lastError;
  }

  /**
   * 处理响应
   */
  private async handleResponse(response: Response): Promise<ApiResponse> {
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else if (contentType?.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    const apiResponse: ApiResponse = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };

    // 应用响应拦截器
    let processedResponse = apiResponse;
    for (const interceptor of this.interceptors.response) {
      processedResponse = await interceptor(processedResponse);
    }

    return processedResponse;
  }

  /**
   * 处理错误
   */
  private async handleError(error: any): Promise<never> {
    const apiError: ApiError = {
      message: error.message || '请求失败',
    };

    // 应用错误拦截器
    let processedError = apiError;
    for (const interceptor of this.interceptors.error) {
      processedError = await interceptor(processedError);
    }

    throw processedError;
  }

  /**
   * 核心请求方法
   */
  private async request(
    url: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse> {
    let requestConfig: RequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };

    // 应用请求拦截器
    for (const interceptor of this.interceptors.request) {
      requestConfig = await interceptor(requestConfig);
    }

    const fullURL = this.buildURL(url, config.params);

    try {
      const response = await this.fetchWithRetry(
        fullURL,
        requestConfig,
        config.retries ?? this.defaultRetries
      );

      if (!response.ok) {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }

      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * 上传文件
   */
  async upload<T = any>(url: string, file: File | Blob, config?: RequestConfig): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>(url, {
      ...config,
      method: 'POST',
      headers: {
        // 不设置 Content-Type，让浏览器自动设置
      },
      body: formData,
    });
  }

  /**
   * 下载文件
   */
  async download(url: string, filename?: string, config?: RequestConfig): Promise<void> {
    const response = await this.request(url, config);

    const blob = response.data as Blob;
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
  }
}

/**
 * 创建默认的 API 客户端实例
 */
export const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  retries: 3,
});

/**
 * 添加认证拦截器
 */
apiClient.useRequestInterceptor(async (config) => {
  // 从 localStorage 获取 token
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
 * 添加错误处理拦截器
 */
apiClient.useErrorInterceptor(async (error) => {
  // 处理 401 未授权
  if (error.status === 401) {
    // 清除 token 并跳转到登录页
    localStorage.removeItem('auth_token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  return error;
});
