/**
 * 请求拦截器
 * 统一处理 API 请求的拦截逻辑
 */

import { STORAGE_KEYS } from '../config/constants';

/**
 * 获取认证 Token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || 
         sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
}

/**
 * 设置认证 Token
 */
export function setAuthToken(token: string, persist: boolean = true): void {
  if (typeof window === 'undefined') return;
  
  if (persist) {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } else {
    sessionStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  }
}

/**
 * 清除认证 Token
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  sessionStorage.removeItem(STORAGE_KEYS.USER_INFO);
}

/**
 * 请求拦截器配置
 */
export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

/**
 * 创建请求拦截器
 */
export function createRequestInterceptor(baseConfig: RequestConfig = {}) {
  return async (
    url: string,
    options: RequestInit = {},
    config: RequestConfig = {}
  ): Promise<Response> => {
    // 合并配置
    const mergedConfig = { ...baseConfig, ...config };
    
    // 构建请求头
    const headers = new Headers(options.headers);
    
    // 添加认证 Token
    const token = getAuthToken();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    
    // 添加默认请求头
    if (!headers.has('Content-Type')) {
      headers.append('Content-Type', 'application/json');
    }
    
    // 添加自定义请求头
    if (mergedConfig.headers) {
      Object.entries(mergedConfig.headers).forEach(([key, value]) => {
        headers.append(key, value);
      });
    }
    
    // 构建请求选项
    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: mergedConfig.withCredentials ? 'include' : 'same-origin',
    };
    
    // 添加超时控制
    if (mergedConfig.timeout) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), mergedConfig.timeout);
      requestOptions.signal = controller.signal;
      
      try {
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    }
    
    return fetch(url, requestOptions);
  };
}

/**
 * 响应拦截器
 */
export async function responseInterceptor<T = any>(
  response: Response
): Promise<T> {
  // 检查响应状态
  if (!response.ok) {
    // 处理 401 未授权错误
    if (response.status === 401) {
      clearAuthToken();
      // 可以在这里触发跳转到登录页
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    
    // 抛出错误
    const error = await response.json().catch(() => ({
      message: response.statusText || '请求失败',
      status: response.status,
    }));
    
    throw error;
  }
  
  // 解析响应数据
  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as any;
}

/**
 * 创建默认的请求拦截器实例
 */
export const request = createRequestInterceptor({
  timeout: 30000,
  withCredentials: true,
});

/**
 * 快捷方法
 */
export const http = {
  get: <T = any>(url: string, config?: RequestConfig) =>
    request(url, { method: 'GET' }, config).then(responseInterceptor<T>),
  
  post: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    request(
      url,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      config
    ).then(responseInterceptor<T>),
  
  put: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    request(
      url,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      config
    ).then(responseInterceptor<T>),
  
  patch: <T = any>(url: string, data?: any, config?: RequestConfig) =>
    request(
      url,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      },
      config
    ).then(responseInterceptor<T>),
  
  delete: <T = any>(url: string, config?: RequestConfig) =>
    request(url, { method: 'DELETE' }, config).then(responseInterceptor<T>),
};

export default {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  createRequestInterceptor,
  responseInterceptor,
  request,
  http,
};
