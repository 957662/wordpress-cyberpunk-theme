/**
 * HTTP 请求工具函数
 * 提供增强的 fetch 封装和请求处理
 */

interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  baseURL?: string;
  params?: Record<string, any>;
}

interface RequestResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

interface RequestError extends Error {
  status?: number;
  statusText?: string;
  response?: any;
}

/**
 * 创建 HTTP 客户端
 */
export class HTTPClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(options: { baseURL?: string; timeout?: number; headers?: Record<string, string> } = {}) {
    this.baseURL = options.baseURL || '';
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    this.timeout = options.timeout || 30000;
  }

  /**
   * 构建完整 URL
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      return queryString ? `${fullURL}?${queryString}` : fullURL;
    }

    return fullURL;
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<RequestResponse<T>> {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const error: RequestError = new Error(data?.message || response.statusText);
      error.status = response.status;
      error.statusText = response.statusText;
      error.response = data;
      throw error;
    }

    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
  }

  /**
   * 发送请求
   */
  async request<T>(url: string, options: RequestOptions = {}): Promise<RequestResponse<T>> {
    const {
      timeout = this.timeout,
      retries = 0,
      retryDelay = 1000,
      params,
      headers = {},
      ...fetchOptions
    } = options;

    const fullURL = this.buildURL(url, params);
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(fullURL, {
          ...fetchOptions,
          headers: requestHeaders,
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        // 如果是最后一次尝试或错误不可重试，直接抛出
        if (attempt === retries || !this.isRetryable(error)) {
          throw error;
        }

        // 等待后重试
        await this.delay(retryDelay * Math.pow(2, attempt));
      }
    }

    throw lastError!;
  }

  /**
   * 判断错误是否可重试
   */
  private isRetryable(error: any): boolean {
    if (error.name === 'AbortError') {
      return false; // 超时不重试
    }

    const status = (error as RequestError).status;
    return !status || status >= 500 || status === 429;
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * GET 请求
   */
  get<T>(url: string, options?: RequestOptions): Promise<RequestResponse<T>> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  /**
   * POST 请求
   */
  post<T>(url: string, data?: any, options?: RequestOptions): Promise<RequestResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT 请求
   */
  put<T>(url: string, data?: any, options?: RequestOptions): Promise<RequestResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * PATCH 请求
   */
  patch<T>(url: string, data?: any, options?: RequestOptions): Promise<RequestResponse<T>> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE 请求
   */
  delete<T>(url: string, options?: RequestOptions): Promise<RequestResponse<T>> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }

  /**
   * 上传文件
   */
  async upload<T>(
    url: string,
    file: File | Blob,
    options?: Omit<RequestOptions, 'body' | 'headers'>
  ): Promise<RequestResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {} // 让浏览器自动设置 Content-Type
    });
  }

  /**
   * 下载文件
   */
  async download(url: string, filename?: string, options?: RequestOptions): Promise<void> {
    const response = await this.request<Blob>(url, {
      ...options,
      headers: { Accept: '*/*' }
    });

    const blobUrl = URL.createObjectURL(response.data as Blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }
}

/**
 * 创建默认的 HTTP 客户端实例
 */
export const http = new HTTPClient();

/**
 * 简化的 GET 请求
 */
export async function get<T>(url: string, options?: RequestOptions): Promise<T> {
  const response = await http.get<T>(url, options);
  return response.data;
}

/**
 * 简化的 POST 请求
 */
export async function post<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  const response = await http.post<T>(url, data, options);
  return response.data;
}

/**
 * 简化的 PUT 请求
 */
export async function put<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  const response = await http.put<T>(url, data, options);
  return response.data;
}

/**
 * 简化的 PATCH 请求
 */
export async function patch<T>(url: string, data?: any, options?: RequestOptions): Promise<T> {
  const response = await http.patch<T>(url, data, options);
  return response.data;
}

/**
 * 简化的 DELETE 请求
 */
export async function del<T>(url: string, options?: RequestOptions): Promise<T> {
  const response = await http.delete<T>(url, options);
  return response.data;
}

/**
 * 并发请求
 */
export async function concurrent<T>(
  requests: Array<() => Promise<T>>,
  options?: { concurrency?: number }
): Promise<T[]> {
  const { concurrency = 5 } = options || {};
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const request of requests) {
    const promise = request().then(result => {
      results.push(result);
      executing.splice(executing.indexOf(promise), 1);
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * 批量请求（分组执行）
 */
export async function batch<T>(
  items: any[],
  requestFn: (item: any) => Promise<T>,
  batchSize: number = 10
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(requestFn));
    results.push(...batchResults);
  }

  return results;
}

/**
 * 请求缓存装饰器
 */
export function cached(ttl: number = 60000) {
  const cache = new Map<string, { data: any; expiry: number }>();

  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = JSON.stringify(args);
      const cached = cache.get(cacheKey);

      if (cached && cached.expiry > Date.now()) {
        return cached.data;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, {
        data: result,
        expiry: Date.now() + ttl
      });

      return result;
    };

    return descriptor;
  };
}

/**
 * 请求重试装饰器
 */
export function retry(maxRetries: number = 3, delay: number = 1000) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;

          if (attempt === maxRetries) {
            throw error;
          }

          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}

/**
 * 超时装饰器
 */
export function timeout(ms: number) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return Promise.race([
        originalMethod.apply(this, args),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), ms)
        )
      ]);
    };

    return descriptor;
  };
}
