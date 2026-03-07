/**
 * Base API Service
 * Core HTTP client with interceptors, caching, and error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

// ============================================================================
// Types
// ============================================================================

export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipError?: boolean;
  cache?: boolean;
  cacheTTL?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// ============================================================================
// Cache Interface
// ============================================================================

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

class APICache {
  private cache: Map<string, CacheEntry> = new Map();

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// ============================================================================
// Base API Service
// ============================================================================

class BaseAPIService {
  private client: AxiosInstance;
  private cache: APICache;

  constructor(config: ApiConfig = {}) {
    this.cache = new APICache();

    this.client = axios.create({
      baseURL: config.baseURL || process.env.NEXT_PUBLIC_API_URL || '/api',
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
      withCredentials: config.withCredentials ?? true,
    });

    this.setupInterceptors();
  }

  // ============================================================================
  // Interceptors
  // ============================================================================

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        if (!config.skipAuth) {
          const token = this.getAuthToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }

        // Add request timestamp
        config.metadata = { startTime: new Date() };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Calculate request duration
        const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime();
        
        // Log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`);
        }

        return response;
      },
      (error: AxiosError) => {
        return this.handleError(error);
      }
    );
  }

  // ============================================================================
  // Auth Token Management
  // ============================================================================

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  // ============================================================================
  // Error Handling
  // ============================================================================

  private async handleError(error: AxiosError): Promise<never> {
    const config = error.config as any;

    // Skip error handling if requested
    if (config?.skipError) {
      throw error;
    }

    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      switch (status) {
        case 401:
          this.handleUnauthorized();
          break;

        case 403:
          toast.error('You do not have permission to perform this action');
          break;

        case 404:
          toast.error('The requested resource was not found');
          break;

        case 429:
          toast.error('Too many requests. Please try again later');
          break;

        case 500:
          toast.error('Server error. Please try again later');
          break;

        default:
          const message = data?.message || data?.error || 'An error occurred';
          toast.error(message);
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection');
    } else {
      toast.error('An unexpected error occurred');
    }

    throw error;
  }

  private handleUnauthorized(): void {
    // Clear auth token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }

    toast.error('Your session has expired. Please log in again');

    // Redirect to login
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1000);
    }
  }

  // ============================================================================
  // Cache Helpers
  // ============================================================================

  private getCacheKey(config: RequestConfig): string {
    return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}`;
  }

  // ============================================================================
  // HTTP Methods
  // ============================================================================

  async get<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const cacheKey = this.getCacheKey({ ...config, method: 'get', url });

    // Check cache
    if (config.cache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const response = await this.client.get<T>(url, config);

    // Cache response
    if (config.cache !== false) {
      const ttl = config.cacheTTL || 300000; // 5 minutes default
      this.cache.set(cacheKey, response, ttl);
    }

    return response;
  }

  async post<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, config);

    // Invalidate related cache
    const cacheKey = this.getCacheKey({ method: 'get', url });
    this.cache.delete(cacheKey);

    return response;
  }

  async put<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, config);

    // Invalidate related cache
    const cacheKey = this.getCacheKey({ method: 'get', url });
    this.cache.delete(cacheKey);

    return response;
  }

  async patch<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(url, data, config);

    // Invalidate related cache
    const cacheKey = this.getCacheKey({ method: 'get', url });
    this.cache.delete(cacheKey);

    return response;
  }

  async delete<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, config);

    // Invalidate related cache
    const cacheKey = this.getCacheKey({ method: 'get', url });
    this.cache.delete(cacheKey);

    return response;
  }

  // ============================================================================
  // File Upload
  // ============================================================================

  async uploadFile<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response;
  }

  // ============================================================================
  // File Download
  // ============================================================================

  async downloadFile(url: string, filename?: string, config: RequestConfig = {}): Promise<void> {
    const response = await this.client.get(url, {
      ...config,
      responseType: 'blob',
    });

    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  clearCache(): void {
    this.cache.clear();
  }

  clearCachePattern(pattern: string): void {
    // Simple pattern matching
    const keys = Array.from((this.cache as any).cache.keys());
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }
}

// ============================================================================
// Export Singleton Instance
// ============================================================================

export const http = new BaseAPIService({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  withCredentials: true,
});

export default BaseAPIService;
