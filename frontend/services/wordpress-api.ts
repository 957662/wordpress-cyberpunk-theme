/**
 * CyberPress Platform - WordPress REST API 客户端
 * 完整的 WordPress REST API 集成服务
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// ============================================================================
// 类型定义
// ============================================================================

interface WordPressConfig {
  baseURL: string;
  username?: string;
  password?: string;
  timeout?: number;
}

interface PaginationParams {
  page?: number;
  per_page?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
}

interface PostParams extends PaginationParams {
  slug?: string;
  status?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  search?: string;
  before?: string;
  after?: string;
  sticky?: boolean;
}

interface CommentParams extends PaginationParams {
  post?: number;
  parent?: number;
  author?: number;
  author_email?: string;
  author_name?: string;
  status?: string;
}

// ============================================================================
// 数据模型类型
// ============================================================================

export interface WPMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  link: string;
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
  };
  source_url: string;
}

export interface WPTerm {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
}

export interface WPUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    [key: string]: string;
  };
  meta: any[];
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
  author_avatar_urls: {
    [key: string]: string;
  };
  meta: any[];
  _links: any;
}

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
  _links: {
    self: { href: string }[];
    collection: { href: string }[];
    about: { href: string }[];
    author: { embeddable: boolean; href: string }[];
    replies: { embeddable: boolean; href: string }[];
    'wp:term': { taxonomy: string; embeddable: boolean; href: string }[];
    curies: { name: string; href: string; templated: boolean }[];
  };
}

export interface WPPostWithExtras extends WPPost {
  _embedded?: {
    author?: WPUser[];
    'wp:term'?: WPTerm[][];
    'wp:featuredmedia'?: WPMedia[];
    replies?: WPComment[];
  };
}

// ============================================================================
// 响应包装类型
// ============================================================================

export interface WPResponse<T> {
  data: T;
  headers: any;
  status: number;
}

export interface WPPaginatedResponse<T> {
  data: T[];
  headers: any;
  total: number;
  totalPages: number;
}

// ============================================================================
// WordPress API 客户端类
// ============================================================================

export class WordPressAPIClient {
  private client: AxiosInstance;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTTL: number = 5 * 60 * 1000; // 5分钟缓存

  constructor(config: WordPressConfig) {
    this.cache = new Map();

    // 创建 axios 实例
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加认证
    if (config.username && config.password) {
      this.client.defaults.auth = {
        username: config.username,
        password: config.password,
      };
    }

    // 添加请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[WordPress API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[WordPress API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('[WordPress API] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // ============================================================================
  // 缓存方法
  // ============================================================================

  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}?${JSON.stringify(params || {})}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      console.log(`[WordPress API] Cache hit: ${key}`);
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
    // 清理过期缓存
    if (this.cache.size > 100) {
      const now = Date.now();
      for (const [k, v] of this.cache.entries()) {
        if (now - v.timestamp > this.cacheTTL) {
          this.cache.delete(k);
        }
      }
    }
  }

  private clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // ============================================================================
  // 通用 API 方法
  // ============================================================================

  private async request<T>(config: AxiosRequestConfig): Promise<WPResponse<T>> {
    const response: AxiosResponse<T> = await this.client.request(config);
    return {
      data: response.data,
      headers: response.headers,
      status: response.status,
    };
  }

  private async get<T>(url: string, params?: any, useCache = true): Promise<WPResponse<T>> {
    const cacheKey = this.getCacheKey(url, params);

    if (useCache) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const result = await this.request<T>({ method: 'GET', url, params });

    if (useCache) {
      this.setCache(cacheKey, result);
    }

    return result;
  }

  private async post<T>(url: string, data?: any): Promise<WPResponse<T>> {
    this.clearCache(url.split('/')[0]); // 清除相关缓存
    return this.request<T>({ method: 'POST', url, data });
  }

  private async put<T>(url: string, data?: any): Promise<WPResponse<T>> {
    this.clearCache(url.split('/')[0]);
    return this.request<T>({ method: 'PUT', url, data });
  }

  private async delete<T>(url: string): Promise<WPResponse<T>> {
    this.clearCache(url.split('/')[0]);
    return this.request<T>({ method: 'DELETE', url });
  }

  // ============================================================================
  // 文章 API
  // ============================================================================

  /**
   * 获取文章列表
   */
  async getPosts(params?: PostParams, useCache = true): Promise<WPPaginatedResponse<WPPostWithExtras>> {
    const response = await this.get<WPPostWithExtras[]>('/wp/v2/posts', {
      ...params,
      _embed: true, // 嵌入作者、分类、标签等信息
    }, useCache);

    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    return {
      data: response.data,
      headers: response.headers,
      total,
      totalPages,
    };
  }

  /**
   * 根据 slug 获取单篇文章
   */
  async getPostBySlug(slug: string, useCache = true): Promise<WPResponse<WPPostWithExtras>> {
    const response = await this.get<WPPostWithExtras[]>('/wp/v2/posts', {
      slug,
      _embed: true,
    }, useCache);

    if (!response.data || response.data.length === 0) {
      throw new Error(`Post with slug "${slug}" not found`);
    }

    return {
      data: response.data[0],
      headers: response.headers,
      status: response.status,
    };
  }

  /**
   * 根据 ID 获取单篇文章
   */
  async getPostById(id: number, useCache = true): Promise<WPResponse<WPPostWithExtras>> {
    return this.get<WPPostWithExtras>(`/wp/v2/posts/${id}`, {
      _embed: true,
    }, useCache);
  }

  /**
   * 创建文章
   */
  async createPost(post: Partial<WPPost>): Promise<WPResponse<WPPost>> {
    return this.post<WPPost>('/wp/v2/posts', post);
  }

  /**
   * 更新文章
   */
  async updatePost(id: number, post: Partial<WPPost>): Promise<WPResponse<WPPost>> {
    return this.put<WPPost>(`/wp/v2/posts/${id}`, post);
  }

  /**
   * 删除文章
   */
  async deletePost(id: number, force = false): Promise<WPResponse<WPPost>> {
    return this.delete<WPPost>(`/wp/v2/posts/${id}?force=${force}`);
  }

  // ============================================================================
  // 分类和标签 API
  // ============================================================================

  /**
   * 获取分类列表
   */
  async getCategories(params?: PaginationParams): Promise<WPPaginatedResponse<WPTerm>> {
    const response = await this.get<WPTerm[]>('/wp/v2/categories', params);

    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    return {
      data: response.data,
      headers: response.headers,
      total,
      totalPages,
    };
  }

  /**
   * 根据 slug 获取分类
   */
  async getCategoryBySlug(slug: string): Promise<WPResponse<WPTerm>> {
    const response = await this.get<WPTerm[]>('/wp/v2/categories', { slug });

    if (!response.data || response.data.length === 0) {
      throw new Error(`Category with slug "${slug}" not found`);
    }

    return {
      data: response.data[0],
      headers: response.headers,
      status: response.status,
    };
  }

  /**
   * 获取标签列表
   */
  async getTags(params?: PaginationParams): Promise<WPPaginatedResponse<WPTerm>> {
    const response = await this.get<WPTerm[]>('/wp/v2/tags', params);

    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    return {
      data: response.data,
      headers: response.headers,
      total,
      totalPages,
    };
  }

  // ============================================================================
  // 评论 API
  // ============================================================================

  /**
   * 获取文章评论列表
   */
  async getComments(params?: CommentParams): Promise<WPPaginatedResponse<WPComment>> {
    const response = await this.get<WPComment[]>('/wp/v2/comments', params);

    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    return {
      data: response.data,
      headers: response.headers,
      total,
      totalPages,
    };
  }

  /**
   * 创建评论
   */
  async createComment(comment: Partial<WPComment>): Promise<WPResponse<WPComment>> {
    this.clearCache('comments');
    return this.post<WPComment>('/wp/v2/comments', comment);
  }

  /**
   * 更新评论
   */
  async updateComment(id: number, comment: Partial<WPComment>): Promise<WPResponse<WPComment>> {
    this.clearCache('comments');
    return this.put<WPComment>(`/wp/v2/comments/${id}`, comment);
  }

  /**
   * 删除评论
   */
  async deleteComment(id: number, force = false): Promise<WPResponse<WPComment>> {
    this.clearCache('comments');
    return this.delete<WPComment>(`/wp/v2/comments/${id}?force=${force}`);
  }

  // ============================================================================
  // 用户 API
  // ============================================================================

  /**
   * 获取用户列表
   */
  async getUsers(params?: PaginationParams): Promise<WPPaginatedResponse<WPUser>> {
    const response = await this.get<WPUser[]>('/wp/v2/users', params);

    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    return {
      data: response.data,
      headers: response.headers,
      total,
      totalPages,
    };
  }

  /**
   * 根据 ID 获取用户
   */
  async getUserById(id: number): Promise<WPResponse<WPUser>> {
    return this.get<WPUser>(`/wp/v2/users/${id}`);
  }

  // ============================================================================
  // 媒体 API
  // ============================================================================

  /**
   * 获取媒体列表
   */
  async getMedia(params?: PaginationParams): Promise<WPPaginatedResponse<WPMedia>> {
    const response = await this.get<WPMedia[]>('/wp/v2/media', params);

    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    return {
      data: response.data,
      headers: response.headers,
      total,
      totalPages,
    };
  }

  /**
   * 根据 ID 获取媒体
   */
  async getMediaById(id: number): Promise<WPResponse<WPMedia>> {
    return this.get<WPMedia>(`/wp/v2/media/${id}`);
  }

  /**
   * 上传媒体
   */
  async uploadMedia(file: File, additionalData?: any): Promise<WPResponse<WPMedia>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }

    return this.client.post('/wp/v2/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => ({
      data: response.data,
      headers: response.headers,
      status: response.status,
    }));
  }

  // ============================================================================
  // 搜索 API
  // ============================================================================

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params?: PostParams): Promise<WPPaginatedResponse<WPPostWithExtras>> {
    return this.getPosts({ ...params, search: query }, false);
  }

  /**
   * 全局搜索
   */
  async search(query: string, subtype?: string[]): Promise<WPPaginatedResponse<any>> {
    const response = await this.get<any[]>('/wp/v2/search', {
      search: query,
      subtype: subtype?.join(','),
      _embed: true,
    }, false);

    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    return {
      data: response.data,
      headers: response.headers,
      total,
      totalPages,
    };
  }

  // ============================================================================
  // 工具方法
  // ============================================================================

  /**
   * 清除所有缓存
   */
  clearAllCache(): void {
    this.clearCache();
  }

  /**
   * 检查 API 连接状态
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/wp/v2', {}, false);
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// 创建默认实例
// ============================================================================

const defaultConfig: WordPressConfig = {
  baseURL: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080/wp-json',
  username: process.env.WORDPRESS_USERNAME,
  password: process.env.WORDPRESS_PASSWORD,
  timeout: 10000,
};

export const wpApi = new WordPressAPIClient(defaultConfig);

// ============================================================================
// 导出类型和客户端
// ============================================================================

export default wpApi;

export type {
  WordPressConfig,
  PaginationParams,
  PostParams,
  CommentParams,
};
