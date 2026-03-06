/**
 * API 客户端基础类
 */

export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error: ${status} ${statusText}`);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(
    baseURL: string,
    defaultHeaders: Record<string, string> = {},
    defaultTimeout = 10000
  ) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
    this.defaultTimeout = defaultTimeout;
  }

  private buildUrl(path: string, params?: Record<string, string | number>): string {
    const url = new URL(path, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    return url.toString();
  }

  private async request<T>(
    path: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      params,
      timeout = this.defaultTimeout,
    } = config;

    const url = this.buildUrl(path, params);
    const requestHeaders = { ...this.defaultHeaders, ...headers };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body);
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(response.status, response.statusText, data);
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(0, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async get<T>(path: string, params?: Record<string, string | number>, config?: Omit<RequestConfig, 'params' | 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: 'GET', params });
  }

  async post<T>(path: string, body?: any, config?: Omit<RequestConfig, 'body' | 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: 'POST', body });
  }

  async put<T>(path: string, body?: any, config?: Omit<RequestConfig, 'body' | 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: 'PUT', body });
  }

  async delete<T>(path: string, config?: Omit<RequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...config, method: 'DELETE' });
  }
}

const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = new ApiClient(apiBaseURL, {
  'Accept': 'application/json',
});

export const createAuthApiClient = (token: string) => {
  return new ApiClient(apiBaseURL, {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  });
};
