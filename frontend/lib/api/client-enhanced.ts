/**
 * 增强的 API 客户端
 * 提供更好的错误处理、重试机制和缓存功能
 */

import { useState, useEffect } from 'react';

// API 配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const DEFAULT_TIMEOUT = 30000; // 30秒
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1秒

// 错误类型
export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// 请求选项
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheTTL?: number; // 缓存时间（毫秒）
  signal?: AbortSignal;
}

// 响应类型
export interface APIResponse<T = any> {
  data: T;
  status: number;
  headers: Headers;
  cached?: boolean;
}

// 简单的内存缓存
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

function getCacheKey(url: string, options?: RequestOptions): string {
  const method = options?.method || 'GET';
  const body = options?.body ? JSON.stringify(options.body) : '';
  return `${method}:${url}:${body}`;
}

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

function setCache(key: string, data: any, ttl: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

function clearCache(pattern?: string): void {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

// 延迟函数
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 获取认证 token
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// 主 API 客户端函数
export async function fetchAPI<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<APIResponse<T>> {
  const {
    method = 'GET',
    body,
    headers = {},
    timeout = DEFAULT_TIMEOUT,
    retries = MAX_RETRIES,
    cache: useCache = false,
    cacheTTL = 5 * 60 * 1000, // 5分钟
    signal,
  } = options;

  const url = `${API_BASE_URL}${endpoint}`;
  const cacheKey = getCacheKey(url, { method, body });

  // 检查缓存
  if (method === 'GET' && useCache) {
    const cached = getFromCache(cacheKey);
    if (cached) {
      return {
        data: cached,
        status: 200,
        headers: new Headers(),
        cached: true,
      };
    }
  }

  // 准备请求头
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const token = getAuthToken();
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  // 准备请求体
  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
    signal,
  };

  if (body && method !== 'GET') {
    requestInit.body = JSON.stringify(body);
  }

  // 重试逻辑
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // 创建超时控制器
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // 如果提供了外部 signal，与超时信号组合
      if (signal) {
        signal.addEventListener('abort', () => controller.abort());
      }

      const response = await fetch(url, {
        ...requestInit,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 处理响应
      let data: any;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        data = await response.text();
      } else {
        data = await response.blob();
      }

      // 检查 HTTP 错误状态
      if (!response.ok) {
        throw new APIError(
          response.status,
          data?.code || 'HTTP_ERROR',
          data?.message || data?.detail || `HTTP ${response.status}`,
          data
        );
      }

      // 缓存成功响应
      if (method === 'GET' && useCache && response.ok) {
        setCache(cacheKey, data, cacheTTL);
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
        cached: false,
      };

    } catch (error: any) {
      lastError = error;

      // 如果是 AbortError，可能是超时或取消
      if (error.name === 'AbortError') {
        throw new APIError(408, 'TIMEOUT', '请求超时');
      }

      // 如果是 APIError，直接抛出（除非是网络错误）
      if (error instanceof APIError) {
        // 5xx 错误可以重试
        if (error.status >= 500 && error.status < 600 && attempt < retries) {
          await delay(RETRY_DELAY * (attempt + 1));
          continue;
        }
        throw error;
      }

      // 网络错误可以重试
      if (attempt < retries) {
        await delay(RETRY_DELAY * (attempt + 1));
        continue;
      }

      throw new APIError(0, 'NETWORK_ERROR', '网络请求失败', error);
    }
  }

  // 所有重试都失败
  throw lastError || new APIError(0, 'UNKNOWN_ERROR', '未知错误');
}

// 便捷方法
export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body: any, options?: RequestOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T = any>(endpoint: string, body: any, options?: RequestOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T = any>(endpoint: string, body: any, options?: RequestOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    fetchAPI<T>(endpoint, { ...options, method: 'DELETE' }),
};

// 导出缓存工具
export const cacheUtils = {
  clear: clearCache,
  clearPattern: (pattern: string) => clearCache(pattern),
  has: (key: string) => cache.has(key),
  size: () => cache.size,
};

// React Hook for API calls
export function useAPI<T = any>(
  endpoint: string,
  options?: RequestOptions & {
    enabled?: boolean;
    refetchInterval?: number;
  }
) {
  const { enabled = true, refetchInterval, ...fetchOptions } = options || {};

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [cached, setCached] = useState<boolean>(false);

  const fetchData = async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      const response = await fetchAPI<T>(endpoint, fetchOptions);
      setData(response.data);
      setError(null);
      setCached(response.cached || false);
    } catch (err) {
      setError(err as APIError);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (refetchInterval) {
      const interval = setInterval(fetchData, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [endpoint, enabled]);

  return { data, error, loading, cached, refetch: fetchData };
}

// React Hook for mutations
export function useMutation<T = any, V = any>(
  mutationFn: (variables: V) => Promise<APIResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: APIError) => void;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<APIError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const mutate = async (variables: V) => {
    try {
      setLoading(true);
      const response = await mutationFn(variables);
      setData(response.data);
      setError(null);
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const apiError = err as APIError;
      setError(apiError);
      options?.onError?.(apiError);
      throw apiError;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, data, error, loading };
}

// 错误处理工具
export function handleAPIError(error: APIError): string {
  // 根据错误类型返回用户友好的消息
  switch (error.code) {
    case 'NETWORK_ERROR':
      return '网络连接失败，请检查网络设置';
    case 'TIMEOUT':
      return '请求超时，请稍后重试';
    case 'UNAUTHORIZED':
    case 'AUTHENTICATION_FAILED':
      return '登录已过期，请重新登录';
    case 'FORBIDDEN':
      return '没有权限执行此操作';
    case 'NOT_FOUND':
      return '请求的资源不存在';
    case 'VALIDATION_ERROR':
      return error.details?.message || '输入数据验证失败';
    case 'RATE_LIMIT_EXCEEDED':
      return '请求过于频繁，请稍后再试';
    case 'SERVER_ERROR':
      return '服务器错误，请稍后重试';
    default:
      return error.message || '未知错误';
  }
}

// 批量请求
export async function batchAPI<T = any>(
  requests: Array<{ endpoint: string; options?: RequestOptions }>
): Promise<APIResponse<T>[]> {
  return Promise.all(
    requests.map(req => fetchAPI<T>(req.endpoint, req.options))
  );
}

// 并行请求（限制并发数）
export async function parallelAPI<T = any>(
  requests: Array<{ endpoint: string; options?: RequestOptions }>,
  concurrency: number = 5
): Promise<APIResponse<T>[]> {
  const results: APIResponse<T>[] = [];

  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map(req => fetchAPI<T>(req.endpoint, req.options))
    );
    results.push(...batchResults);
  }

  return results;
}

// 顺序请求
export async function serialAPI<T = any>(
  requests: Array<{ endpoint: string; options?: RequestOptions }>
): Promise<APIResponse<T>[]> {
  const results: APIResponse<T>[] = [];

  for (const req of requests) {
    const result = await fetchAPI<T>(req.endpoint, req.options);
    results.push(result);
  }

  return results;
}

export default api;
