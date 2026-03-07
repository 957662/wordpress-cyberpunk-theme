/**
 * WordPress API Client
 * 完整的 WordPress REST API 客户端
 *
 * @author AI Development Team
 * @version 2.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 类型定义
export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: any[];
  categories: number[];
  tags: number[];
  _links: any;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links: any;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  _links: any;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: { [key: string]: string };
  _links: any;
}

export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  comment_status: string;
  ping_status: string;
  alt_text: string;
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
    image_meta: {
      aperture: string;
      credit: string;
      camera: string;
      caption: string;
      created_timestamp: string;
      copyright: string;
      focal_length: string;
      iso: string;
      shutter_speed: string;
      title: string;
      orientation: string;
      keywords: string[];
    };
  };
  source_url: string;
  _links: any;
}

export interface WPComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  date_gmt: string;
  content: { rendered: string };
  link: string;
  status: string;
  type: string;
  author_avatar_urls: { [key: string]: string };
  meta: any[];
  _links: any;
}

export interface WPParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  exclude?: number[];
  include?: number[];
  order?: 'asc' | 'desc';
  orderby?: string;
  slug?: string[];
  status?: string;
  sticky?: boolean;
  _embed?: boolean;
  _fields?: string[];
}

export interface WPResponse<T> {
  data: T;
  headers: any;
  status: number;
}

class WordPressAPIClient {
  private client: AxiosInstance;
  private baseURL: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5分钟缓存

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加认证令牌（如果需要）
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('WordPress API Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * 获取认证令牌
   */
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('wp_auth_token');
  }

  /**
   * 设置认证令牌
   */
  setAuthToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wp_auth_token', token);
    }
  }

  /**
   * 清除认证令牌
   */
  clearAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wp_auth_token');
    }
  }

  /**
   * 处理错误
   */
  private handleError(error: any) {
    if (error.response) {
      // 服务器响应错误
      return {
        message: error.response.data.message || 'API Error',
        status: error.response.status,
        code: error.response.data.code,
      };
    } else if (error.request) {
      // 请求发送但没有响应
      return {
        message: 'No response from server',
        status: 0,
        code: 'NETWORK_ERROR',
      };
    } else {
      // 请求设置错误
      return {
        message: error.message,
        status: 0,
        code: 'REQUEST_ERROR',
      };
    }
  }

  /**
   * 生成缓存键
   */
  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  /**
   * 获取缓存数据
   */
  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * 设置缓存数据
   */
  private setCache(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    params?: any,
    data?: any,
    useCache = true
  ): Promise<WPResponse<T>> {
    const cacheKey = this.getCacheKey(endpoint, { method, params, data });

    // 尝试从缓存获取（仅 GET 请求）
    if (method === 'GET' && useCache) {
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      params,
      data,
    };

    const response: AxiosResponse<T> = await this.client.request(config);

    const result: WPResponse<T> = {
      data: response.data,
      headers: response.headers,
      status: response.status,
    };

    // 缓存 GET 请求
    if (method === 'GET' && useCache) {
      this.setCache(cacheKey, result);
    }

    return result;
  }

  /**
   * 获取文章列表
   */
  async getPosts(params?: WPParams): Promise<WPPost[]> {
    const response = await this.request<WPPost[]>('GET', '/wp/v2/posts', params);
    return response.data;
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number, params?: WPParams): Promise<WPPost> {
    const response = await this.request<WPPost>('GET', `/wp/v2/posts/${id}`, params);
    return response.data;
  }

  /**
   * 根据 slug 获取文章
   */
  async getPostBySlug(slug: string, params?: WPParams): Promise<WPPost> {
    const response = await this.request<WPPost[]>('GET', '/wp/v2/posts', { slug, ...params });
    return response.data[0];
  }

  /**
   * 获取分类列表
   */
  async getCategories(params?: WPParams): Promise<WPCategory[]> {
    const response = await this.request<WPCategory[]>('GET', '/wp/v2/categories', params);
    return response.data;
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WPCategory> {
    const response = await this.request<WPCategory>('GET', `/wp/v2/categories/${id}`);
    return response.data;
  }

  /**
   * 获取标签列表
   */
  async getTags(params?: WPParams): Promise<WPTag[]> {
    const response = await this.request<WPTag[]>('GET', '/wp/v2/tags', params);
    return response.data;
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WPTag> {
    const response = await this.request<WPTag>('GET', `/wp/v2/tags/${id}`);
    return response.data;
  }

  /**
   * 获取作者列表
   */
  async getAuthors(params?: WPParams): Promise<WPAuthor[]> {
    const response = await this.request<WPAuthor[]>('GET', '/wp/v2/users', params);
    return response.data;
  }

  /**
   * 获取单个作者
   */
  async getAuthor(id: number): Promise<WPAuthor> {
    const response = await this.request<WPAuthor>('GET', `/wp/v2/users/${id}`);
    return response.data;
  }

  /**
   * 获取媒体文件
   */
  async getMedia(id: number): Promise<WPMedia> {
    const response = await this.request<WPMedia>('GET', `/wp/v2/media/${id}`);
    return response.data;
  }

  /**
   * 获取评论列表
   */
  async getComments(params?: WPParams): Promise<WPComment[]> {
    const response = await this.request<WPComment[]>('GET', '/wp/v2/comments', params);
    return response.data;
  }

  /**
   * 提交评论
   */
  async postComment(postId: number, comment: {
    author_name: string;
    author_email: string;
    content: string;
    parent?: number;
  }): Promise<WPComment> {
    const response = await this.request<WPComment>(
      'POST',
      '/wp/v2/comments',
      { post: postId },
      comment,
      false
    );
    return response.data;
  }

  /**
   * 搜索内容
   */
  async search(query: string, params?: WPParams): Promise<any[]> {
    const response = await this.request<any[]>('GET', '/wp/v2/search', {
      search: query,
      ...params,
    });
    return response.data;
  }

  /**
   * 获取总页数
   */
  getTotalPages(headers: any): number {
    return parseInt(headers['x-wp-totalpages'] || '1', 10);
  }

  /**
   * 获取总数
   */
  getTotal(headers: any): number {
    return parseInt(headers['x-wp-total'] || '0', 10);
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.request('GET', '/wp/v2');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 获取站点信息
   */
  async getSiteInfo(): Promise<any> {
    const response = await this.request('GET', '/wp/v2');
    return response.data;
  }
}

// 创建单例实例
let clientInstance: WordPressAPIClient | null = null;

export function createWordPressClient(baseURL?: string): WordPressAPIClient {
  const url = baseURL || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';

  if (!url) {
    throw new Error('WordPress API URL is required');
  }

  if (!clientInstance || clientInstance['baseURL'] !== url) {
    clientInstance = new WordPressAPIClient(url);
  }

  return clientInstance;
}

export default WordPressAPIClient;
