/**
 * HTTP Client Service
 * A comprehensive HTTP client with interceptors, caching, and error handling
 */

import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  cache?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
  retry?: number;
  retryDelay?: number;
}

export interface RequestResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

export interface RequestError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor<T = any> = (response: AxiosResponse<T>) => AxiosResponse<T> | Promise<AxiosResponse<T>>;
type ErrorInterceptor = (error: AxiosError) => any;

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

/**
 * HTTP Client Class
 */
export class HttpClient {
  private instance: AxiosInstance;
  private cache: Map<string, CacheEntry>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseConfig: RequestConfig = {}) {
    this.cache = new Map();

    // Create axios instance with default config
    this.instance = axios.create({
      baseURL: baseConfig.baseURL || process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: baseConfig.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...baseConfig.headers
      }
    });

    this.setupInterceptors();
  }

  /**
   * Setup default interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - Auth token
    this.instance.interceptors.request.use(
      (config) => {
        // Add auth token if available and not skipped
        if (!(config as RequestConfig).skipAuth) {
          const token = this.getAuthToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Add request timestamp
        config.metadata = { startTime: new Date() };

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Error handling
    this.instance.interceptors.response.use(
      (response) => {
        // Calculate request duration
        const endTime = new Date();
        const duration = endTime.getTime() - response.config.metadata?.startTime?.getTime();

        // Log request duration in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[HTTP] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
        }

        return response;
      },
      (error) => {
        return this.handleError(error);
      }
    );
  }

  /**
   * Get auth token from storage
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: AxiosError): Promise<never> {
    const requestError: RequestError = {
      message: error.message || 'An error occurred'
    };

    if (error.response) {
      // Server responded with error
      requestError.status = error.response.status;
      requestError.code = error.code;
      requestError.details = error.response.data;

      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - Clear token and redirect to login
          this.clearAuthToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          requestError.message = 'Authentication required';
          break;

        case 403:
          requestError.message = 'Access denied';
          break;

        case 404:
          requestError.message = 'Resource not found';
          break;

        case 429:
          requestError.message = 'Too many requests';
          break;

        case 500:
          requestError.message = 'Server error';
          break;

        default:
          requestError.message = (error.response.data as any)?.message || error.message;
      }
    } else if (error.request) {
      // Request made but no response
      requestError.message = 'No response from server';
    }

    return Promise.reject(requestError);
  }

  /**
   * Clear auth token
   */
  private clearAuthToken(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
  }

  /**
   * Generate cache key
   */
  private getCacheKey(config: RequestConfig): string {
    const { method, url, params, data } = config;
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }

  /**
   * Get cached response
   */
  private getCached(cacheKey: string): any | null {
    const entry = this.cache.get(cacheKey);

    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(cacheKey);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache
   */
  private setCached(cacheKey: string, data: any, ttl: number): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Make HTTP request with retry logic
   */
  private async request<T = any>(config: RequestConfig): Promise<RequestResponse<T>> {
    const { retry = 0, retryDelay = 1000, cache, cacheTTL = 300000 } = config;

    // Check cache
    if (cache && config.method === 'GET') {
      const cacheKey = this.getCacheKey(config);
      const cached = this.getCached(cacheKey);

      if (cached) {
        return {
          data: cached,
          status: 200,
          statusText: 'OK (Cached)',
          headers: {}
        };
      }
    }

    // Apply request interceptors
    let finalConfig = config;
    for (const interceptor of this.requestInterceptors) {
      finalConfig = await interceptor(finalConfig);
    }

    // Retry logic
    let lastError: any;

    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        const response = await this.instance.request<T>(finalConfig);

        // Apply response interceptors
        let finalResponse = response;
        for (const interceptor of this.responseInterceptors) {
          finalResponse = await interceptor(finalResponse);
        }

        // Cache response
        if (cache && config.method === 'GET') {
          const cacheKey = this.getCacheKey(config);
          this.setCached(cacheKey, finalResponse.data, cacheTTL);
        }

        return {
          data: finalResponse.data,
          status: finalResponse.status,
          statusText: finalResponse.statusText,
          headers: finalResponse.headers
        };
      } catch (error) {
        lastError = error;

        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          break;
        }

        // Wait before retry
        if (attempt < retry) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    // Apply error interceptors
    for (const interceptor of this.errorInterceptors) {
      lastError = interceptor(lastError);
    }

    throw lastError;
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, config: RequestConfig = {}): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, config: RequestConfig = {}): Promise<RequestResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  /**
   * Upload file with progress
   */
  async upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config: RequestConfig = {}
  ): Promise<RequestResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<T>({
      ...config,
      method: 'POST',
      url,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      }
    });
  }

  /**
   * Download file
   */
  async download(url: string, filename?: string, config: RequestConfig = {}): Promise<void> {
    const response = await this.request<Blob>({
      ...config,
      method: 'GET',
      url,
      responseType: 'blob'
    });

    // Create download link
    const blobUrl = window.URL.createObjectURL(response.data as unknown as Blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Remove specific cache entry
   */
  removeCache(url: string, method: string = 'GET', params?: any): void {
    const config = { method, url, params };
    const cacheKey = this.getCacheKey(config);
    this.cache.delete(cacheKey);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
const httpClient = new HttpClient();

export default httpClient;
