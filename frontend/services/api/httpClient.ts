/**
 * HTTP 客户端
 * 基于 axios 的封装，提供统一的 API 请求接口
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandler?: boolean;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor(baseURL: string, timeout: number = 10000) {
    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 从 localStorage 获取 token
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      (error) => {
        if (error.response) {
          const { status, data } = error.response;

          // 处理特定错误状态
          switch (status) {
            case 401:
              // 未授权，清除 token 并跳转到登录页
              this.clearToken();
              if (typeof window !== 'undefined') {
                window.location.href = '/auth/login';
              }
              break;
            case 403:
              console.error('没有权限访问');
              break;
            case 404:
              console.error('请求的资源不存在');
              break;
            case 500:
              console.error('服务器错误');
              break;
          }

          return Promise.reject(data || error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
  }

  async get<T = any>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: HttpRequestConfig): Promise<T> {
    return this.client.patch(url, data, config);
  }

  async delete<T = any>(url: string, config?: HttpRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

// 创建默认实例
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
export const httpClient = new HttpClient(baseURL);
