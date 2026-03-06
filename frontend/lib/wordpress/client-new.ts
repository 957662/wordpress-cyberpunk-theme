/**
 * WordPress API 客户端
 * 统一管理所有 WordPress API 请求
 */

import { Post, Category, Tag, Author, Comment, PaginationMeta } from '@/types/blog';

interface WPConfig {
  baseUrl: string;
  apiVersion?: string;
  timeout?: number;
}

interface WPResponse<T> {
  data: T;
  meta?: PaginationMeta;
  headers?: Headers;
}

class WordPressClient {
  private config: WPConfig;
  private baseUrl: string;

  constructor(config: WPConfig) {
    this.config = {
      apiVersion: 'wp/v2',
      timeout: 10000,
      ...config,
    };
    this.baseUrl = `${this.config.baseUrl}/wp-json/${this.config.apiVersion}`;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<WPResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 构建查询字符串
   */
  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.set(key, String(value));
        }
      }
    });
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getPosts(params: any = {}): Promise<WPResponse<Post[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<Post[]>(`/posts${queryString}`);
  }

  async getPost(id: string | number): Promise<WPResponse<Post>> {
    return this.request<Post>(`/posts/${id}`);
  }

  async getCategories(params: any = {}): Promise<WPResponse<Category[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<Category[]>(`/categories${queryString}`);
  }

  async getTags(params: any = {}): Promise<WPResponse<Tag[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<Tag[]>(`/tags${queryString}`);
  }

  async getAuthors(params: any = {}): Promise<WPResponse<Author[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<Author[]>(`/users${queryString}`);
  }

  async getComments(params: any = {}): Promise<WPResponse<Comment[]>> {
    const queryString = this.buildQueryString(params);
    return this.request<Comment[]>(`/comments${queryString}`);
  }
}

const wpConfig: WPConfig = {
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8000',
};

export const wpClient = new WordPressClient(wpConfig);
export default WordPressClient;
