/**
 * API 基础服务
 * 处理所有 API 请求的通用逻辑
 */

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiService {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(
    baseURL: string = process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: number = 10000,
    retries: number = 3
  ) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
    this.defaultRetries = retries;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    let lastError: Error | null = null;

    for (let i = 0; i <= retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new ApiError(
            data.message || `HTTP ${response.status}`,
            response.status,
            data
          );
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;

        // 如果是 AbortError（超时）或网络错误，且还有重试次数，则重试
        if (
          i < retries &&
          (error instanceof TypeError ||
            error instanceof DOMException ||
            (error instanceof ApiError && error.status >= 500))
        ) {
          // 指数退避
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, i) * 1000)
          );
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT 请求
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * 文件上传
   */
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options?: Omit<RequestOptions, 'headers'>
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout * 3, // 上传超时时间更长
      ...fetchOptions
    } = options || {};

    return this.request<T>(endpoint, {
      ...fetchOptions,
      method: 'POST',
      body: formData,
      timeout,
      headers: {}, // 让浏览器自动设置 Content-Type
    });
  }

  /**
   * 批量请求
   */
  async batch<T>(
    requests: Array<{ endpoint: string; options?: RequestOptions }>
  ): Promise<T[]> {
    return Promise.all(
      requests.map(({ endpoint, options }) =>
        this.request<T>(endpoint, options)
      )
    );
  }
}

// 创建默认实例
export const apiService = new ApiService();

// 导出类和错误
export { ApiService, ApiError };
export default apiService;
