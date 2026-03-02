import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * 增强型 API 客户端
 * 支持请求缓存、重试、超时控制等功能
 */

interface RequestCache {
  data: any;
  timestamp: number;
  expires: number;
}

interface RequestOptions extends AxiosRequestConfig {
  cache?: boolean;
  cacheDuration?: number; // 缓存时长（毫秒）
  retry?: number; // 重试次数
  retryDelay?: number; // 重试延迟（毫秒）
  timeout?: number; // 超时时间（毫秒）
}

class EnhancedApiClient {
  private client: AxiosInstance;
  private cache: Map<string, RequestCache>;
  private pendingRequests: Map<string, Promise<any>>;

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    });

    this.cache = new Map();
    this.pendingRequests = new Map();

    this.setupInterceptors();
  }

  /**
   * 设置请求和响应拦截器
   */
  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加认证 token
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加请求 ID
        config.metadata = {
          ...config.metadata,
          requestId: this.generateRequestId(),
          startTime: Date.now(),
        };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        // 计算请求耗时
        const endTime = Date.now();
        const startTime = response.config.metadata?.startTime || endTime;
        const duration = endTime - startTime;

        // 记录日志
        this.logRequest(response.config, duration, true);

        return response;
      },
      async (error: AxiosError) => {
        const endTime = Date.now();
        const startTime = error.config?.metadata?.startTime || endTime;
        const duration = endTime - startTime;

        // 记录错误日志
        this.logRequest(error.config, duration, false, error);

        // 处理 401 未授权错误
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
        }

        // 处理重试
        if (this.shouldRetry(error)) {
          return this.retryRequest(error);
        }

        return Promise.reject(this.transformError(error));
      }
    );
  }

  /**
   * 获取认证 token
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  /**
   * 生成请求 ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 记录请求日志
   */
  private logRequest(
    config: any,
    duration: number,
    success: boolean,
    error?: any
  ) {
    if (process.env.NODE_ENV === 'development') {
      const log = {
        method: config?.method?.toUpperCase(),
        url: config?.url,
        duration: `${duration}ms`,
        success,
        status: error?.response?.status || (success ? 200 : 'FAILED'),
      };

      console.log('[API Request]', log);
    }
  }

  /**
   * 处理未授权错误
   */
  private async handleUnauthorized() {
    // 清除 token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }

    // 跳转到登录页
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: AxiosError): boolean {
    const config = error.config as any;
    const retryCount = config?.__retryCount || 0;
    const maxRetries = config?.retry || 3;

    // 只对网络错误或 5xx 错误重试
    const shouldRetry =
      (!error.response && error.code !== 'ECONNABORTED') ||
      (error.response?.status && error.response.status >= 500);

    return shouldRetry && retryCount < maxRetries;
  }

  /**
   * 重试请求
   */
  private async retryRequest(error: AxiosError): Promise<any> {
    const config = error.config as any;
    config.__retryCount = (config.__retryCount || 0) + 1;

    const delay = config.retryDelay || 1000;
    await new Promise((resolve) => setTimeout(resolve, delay * config.__retryCount));

    return this.client(config);
  }

  /**
   * 转换错误信息
   */
  private transformError(error: AxiosError): Error {
    if (error.response) {
      // 服务器返回错误响应
      const data = error.response.data as any;
      const message = data?.message || data?.error || '请求失败';
      const enhancedError = new Error(message) as any;
      enhancedError.status = error.response.status;
      enhancedError.code = error.code;
      enhancedError.data = data;
      return enhancedError;
    } else if (error.request) {
      // 请求已发出但没有收到响应
      return new Error('网络错误，请检查网络连接');
    } else {
      // 请求配置错误
      return new Error(error.message || '请求配置错误');
    }
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(url: string, params?: any): string {
    return `${url}_${JSON.stringify(params || {})}`;
  }

  /**
   * 获取缓存数据
   */
  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now > cached.expires) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * 设置缓存
   */
  private setCache(key: string, data: any, duration: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + duration,
    });
  }

  /**
   * 发送 GET 请求
   */
  public async get<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    const {
      cache = false,
      cacheDuration = 60000, // 默认缓存 1 分钟
      params,
      ...restOptions
    } = options;

    const cacheKey = this.getCacheKey(url, params);

    // 检查缓存
    if (cache && options.method !== 'post') {
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // 检查是否有相同的请求正在进行
    const pendingKey = `${cacheKey}_${Date.now()}`;
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // 发送请求
    const requestPromise = this.client
      .get<T>(url, { ...restOptions, params })
      .then((response) => {
        const data = response.data;

        // 设置缓存
        if (cache && options.method !== 'post') {
          this.setCache(cacheKey, data, cacheDuration);
        }

        return data;
      })
      .finally(() => {
        this.pendingRequests.delete(cacheKey);
      });

    this.pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }

  /**
   * 发送 POST 请求
   */
  public async post<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.client.post<T>(url, data, options).then((response) => response.data);
  }

  /**
   * 发送 PUT 请求
   */
  public async put<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.client.put<T>(url, data, options).then((response) => response.data);
  }

  /**
   * 发送 PATCH 请求
   */
  public async patch<T = any>(url: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.client.patch<T>(url, data, options).then((response) => response.data);
  }

  /**
   * 发送 DELETE 请求
   */
  public async delete<T = any>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.client.delete<T>(url, options).then((response) => response.data);
  }

  /**
   * 上传文件
   */
  public async upload<T = any>(
    url: string,
    file: File | Blob,
    options: RequestOptions = {}
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post<T>(url, formData, {
      ...options,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options.headers,
      },
      onUploadProgress: options.onUploadProgress,
    }).then((response) => response.data);
  }

  /**
   * 批量请求
   */
  public async batch<T = any>(requests: Array<{ url: string; options?: RequestOptions }>): Promise<T[]> {
    return Promise.all(requests.map((req) => this.get<T>(req.url, req.options)));
  }

  /**
   * 清除缓存
   */
  public clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // 清除匹配模式的缓存
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 取消所有进行中的请求
   */
  public cancelAllRequests(): void {
    for (const [, promise] of this.pendingRequests) {
      // 这里需要实现请求取消逻辑
      // 可以使用 axios 的 CancelToken
    }
    this.pendingRequests.clear();
  }
}

// 创建默认实例
export const apiClient = new EnhancedApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
);

// 导出类以便创建自定义实例
export { EnhancedApiClient };
