/**
 * 请求管理器
 * 统一管理 HTTP 请求，支持缓存、队列、重试等功能
 */

export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean | number; // false | true (default 5min) | milliseconds
  queue?: boolean;
}

export interface RequestResult<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
  cached: boolean;
}

interface CacheEntry {
  data: any;
  timestamp: number;
  expireTime: number;
}

interface QueuedRequest {
  config: RequestConfig;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

class RequestManager {
  private cache: Map<string, CacheEntry> = new Map();
  private queue: QueuedRequest[] = [];
  private activeRequests: Set<string> = new Set();
  private maxConcurrent: number = 6;
  private defaultOptions: Partial<RequestConfig> = {
    timeout: 10000,
    retries: 3,
    retryDelay: 1000,
    cache: false,
    queue: false,
  };

  /**
   * 发送请求
   */
  async request<T = any>(config: RequestConfig): Promise<RequestResult<T>> {
    const options = { ...this.defaultOptions, ...config };
    const cacheKey = this.getCacheKey(options);

    // 检查缓存
    if (options.cache && !['GET', 'HEAD'].includes(options.method || 'GET')) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        return { ...cached, cached: true };
      }
    }

    // 队列处理
    if (options.queue) {
      return this.enqueueRequest<T>(options);
    }

    // 发送请求
    return this.fetchWithRetry<T>(options);
  }

  /**
   * 带重试的请求
   */
  private async fetchWithRetry<T>(
    config: RequestConfig,
    attempt: number = 1
  ): Promise<RequestResult<T>> {
    try {
      const result = await this.fetch<T>(config);

      // 缓存结果
      if (config.cache && (config.cache === true || config.cache > 0)) {
        const cacheTime = config.cache === true ? 300000 : config.cache; // 默认 5 分钟
        this.setCache(this.getCacheKey(config), result.data, cacheTime);
      }

      return { ...result, cached: false };
    } catch (error) {
      const retries = config.retries || this.defaultOptions.retries!;

      if (attempt < retries && this.shouldRetry(error)) {
        const delay = (config.retryDelay || this.defaultOptions.retryDelay!) * attempt;
        await this.sleep(delay);
        return this.fetchWithRetry<T>(config, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * 发送请求
   */
  private async fetch<T>(config: RequestConfig): Promise<RequestResult<T>> {
    const { url, method = 'GET', headers = {}, body, timeout } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        cached: false,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    }
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: any): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes('timeout') ||
        error.message.includes('network') ||
        error.message.includes('fetch')
      );
    }
    return false;
  }

  /**
   * 将请求加入队列
   */
  private async enqueueRequest<T>(
    config: RequestConfig
  ): Promise<RequestResult<T>> {
    return new Promise((resolve, reject) => {
      this.queue.push({ config, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * 处理队列
   */
  private async processQueue() {
    while (
      this.queue.length > 0 &&
      this.activeRequests.size < this.maxConcurrent
    ) {
      const { config, resolve, reject } = this.queue.shift()!;
      const cacheKey = this.getCacheKey(config);

      this.activeRequests.add(cacheKey);

      try {
        const result = await this.fetchWithRetry(config);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this.activeRequests.delete(cacheKey);
        this.processQueue();
      }
    }
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(config: RequestConfig): string {
    return `${config.method || 'GET'}:${config.url}:${JSON.stringify(config.body || '')}`;
  }

  /**
   * 从缓存获取
   */
  private getFromCache<T>(key: string): RequestResult<T> | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expireTime) {
      this.cache.delete(key);
      return null;
    }

    return {
      data: entry.data,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      cached: true,
    };
  }

  /**
   * 设置缓存
   */
  private setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expireTime: Date.now() + ttl,
    });

    // 清理过期缓存
    this.cleanCache();
  }

  /**
   * 清理过期缓存
   */
  private cleanCache(): void {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expireTime) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 清空队列
   */
  clearQueue(): void {
    this.queue.forEach((req) => {
      req.reject(new Error('Request cancelled'));
    });
    this.queue = [];
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): {
    size: number;
    entries: Array<{ key: string; size: number; age: number }>;
  } {
    const now = Date.now();

    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        size: JSON.stringify(entry.data).length,
        age: now - entry.timestamp,
      })),
    };
  }

  /**
   * 获取队列统计
   */
  getQueueStats(): {
    queued: number;
    active: number;
  } {
    return {
      queued: this.queue.length,
      active: this.activeRequests.size,
    };
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 设置默认选项
   */
  setDefaultOptions(options: Partial<RequestConfig>): void {
    this.defaultOptions = { ...this.defaultOptions, ...options };
  }

  /**
   * 设置最大并发数
   */
  setMaxConcurrent(max: number): void {
    this.maxConcurrent = max;
  }
}

// 创建单例实例
export const requestManager = new RequestManager();

/**
 * 便捷方法
 */
export const request = {
  get: <T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) =>
    requestManager.request<T>({ ...config, url, method: 'GET' }),

  post: <T = any>(
    url: string,
    body?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'body'>
  ) => requestManager.request<T>({ ...config, url, method: 'POST', body }),

  put: <T = any>(
    url: string,
    body?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'body'>
  ) => requestManager.request<T>({ ...config, url, method: 'PUT', body }),

  patch: <T = any>(
    url: string,
    body?: any,
    config?: Omit<RequestConfig, 'url' | 'method' | 'body'>
  ) => requestManager.request<T>({ ...config, url, method: 'PATCH', body }),

  delete: <T = any>(url: string, config?: Omit<RequestConfig, 'url' | 'method'>) =>
    requestManager.request<T>({ ...config, url, method: 'DELETE' }),

  clearCache: () => requestManager.clearCache(),
  clearQueue: () => requestManager.clearQueue(),
  getCacheStats: () => requestManager.getCacheStats(),
  getQueueStats: () => requestManager.getQueueStats(),
};

/**
 * Hook: 使用请求管理器
 */
export function useRequest() {
  return {
    request: requestManager.request.bind(requestManager),
    get: request.get,
    post: request.post,
    put: request.put,
    patch: request.patch,
    delete: request.delete,
    clearCache: request.clearCache,
    clearQueue: request.clearQueue,
    getCacheStats: request.getCacheStats,
    getQueueStats: request.getQueueStats,
  };
}

export default requestManager;
