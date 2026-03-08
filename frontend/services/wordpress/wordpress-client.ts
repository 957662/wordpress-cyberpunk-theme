/**
 * WordPress REST API Client
 * 用于与 WordPress 后端通信
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface WPConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  timeout?: number;
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
  content: { rendered: string };
  excerpt: { rendered: string };
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
  meta: any[];
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
  media_type: string;
  mime_type: string;
  media_details: any;
  source_url: string;
  _links: any;
}

export interface WPUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: { [key: string]: string };
  meta: any[];
  _links: any;
}

export class WordPressClient {
  private client: AxiosInstance;
  private config: WPConfig;

  constructor(config: WPConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `${config.baseUrl}/wp-json/wp/v2`,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加认证（如果提供）
    if (config.username && config.password) {
      const auth = Buffer.from(`${config.username}:${config.password}`).toString('base64');
      this.client.defaults.headers.common['Authorization'] = `Basic ${auth}`;
    }

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[WordPress API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('[WordPress API Error]', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // ==================== 文章 API ====================

  /**
   * 获取文章列表
   */
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    status?: string;
    orderby?: 'date' | 'relevance' | 'id' | 'include' | 'title' | 'slug';
    order?: 'asc' | 'desc';
    slug?: string[];
    _embed?: boolean;
  }): Promise<WPPost[]> {
    const response: AxiosResponse<WPPost[]> = await this.client.get('/posts', { params });
    return response.data;
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number, params?: { _embed?: boolean }): Promise<WPPost> {
    const response: AxiosResponse<WPPost> = await this.client.get(`/posts/${id}`, { params });
    return response.data;
  }

  /**
   * 通过 slug 获取文章
   */
  async getPostBySlug(slug: string, params?: { _embed?: boolean }): Promise<WPPost> {
    const response: AxiosResponse<WPPost[]> = await this.client.get('/posts', {
      params: { slug, ...params },
    });
    return response.data[0];
  }

  /**
   * 创建文章
   */
  async createPost(post: Partial<WPPost>): Promise<WPPost> {
    const response: AxiosResponse<WPPost> = await this.client.post('/posts', post);
    return response.data;
  }

  /**
   * 更新文章
   */
  async updatePost(id: number, post: Partial<WPPost>): Promise<WPPost> {
    const response: AxiosResponse<WPPost> = await this.client.post(`/posts/${id}`, post);
    return response.data;
  }

  /**
   * 删除文章
   */
  async deletePost(id: number, force?: boolean): Promise<void> {
    await this.client.delete(`/posts/${id}`, { params: { force } });
  }

  // ==================== 分类 API ====================

  /**
   * 获取分类列表
   */
  async getCategories(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    order?: 'asc' | 'desc';
    orderby?: string;
    hide_empty?: boolean;
    post?: number;
  }): Promise<WPCategory[]> {
    const response: AxiosResponse<WPCategory[]> = await this.client.get('/categories', { params });
    return response.data;
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WPCategory> {
    const response: AxiosResponse<WPCategory> = await this.client.get(`/categories/${id}`);
    return response.data;
  }

  /**
   * 创建分类
   */
  async createCategory(category: Partial<WPCategory>): Promise<WPCategory> {
    const response: AxiosResponse<WPCategory> = await this.client.post('/categories', category);
    return response.data;
  }

  // ==================== 标签 API ====================

  /**
   * 获取标签列表
   */
  async getTags(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    order?: 'asc' | 'desc';
    orderby?: string;
    hide_empty?: boolean;
    post?: number;
  }): Promise<WPTag[]> {
    const response: AxiosResponse<WPTag[]> = await this.client.get('/tags', { params });
    return response.data;
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WPTag> {
    const response: AxiosResponse<WPTag> = await this.client.get(`/tags/${id}`);
    return response.data;
  }

  /**
   * 创建标签
   */
  async createTag(tag: Partial<WPTag>): Promise<WPTag> {
    const response: AxiosResponse<WPTag> = await this.client.post('/tags', tag);
    return response.data;
  }

  // ==================== 评论 API ====================

  /**
   * 获取评论列表
   */
  async getComments(params?: {
    page?: number;
    per_page?: number;
    post?: number;
    parent?: number[];
    author?: number[];
    author_email?: string[];
    author_exclude?: number[];
    search?: string;
    status?: string;
  }): Promise<WPComment[]> {
    const response: AxiosResponse<WPComment[]> = await this.client.get('/comments', { params });
    return response.data;
  }

  /**
   * 获取单条评论
   */
  async getComment(id: number): Promise<WPComment> {
    const response: AxiosResponse<WPComment> = await this.client.get(`/comments/${id}`);
    return response.data;
  }

  /**
   * 创建评论
   */
  async createComment(comment: Partial<WPComment>): Promise<WPComment> {
    const response: AxiosResponse<WPComment> = await this.client.post('/comments', comment);
    return response.data;
  }

  // ==================== 媒体 API ====================

  /**
   * 获取媒体列表
   */
  async getMedia(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    parent?: number[];
    author?: number;
  }): Promise<WPMedia[]> {
    const response: AxiosResponse<WPMedia[]> = await this.client.get('/media', { params });
    return response.data;
  }

  /**
   * 获取单个媒体
   */
  async getMediaItem(id: number): Promise<WPMedia> {
    const response: AxiosResponse<WPMedia> = await this.client.get(`/media/${id}`);
    return response.data;
  }

  /**
   * 上传媒体
   */
  async uploadMedia(file: File, additionalData?: any): Promise<WPMedia> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('status', 'publish');

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
    }

    const response: AxiosResponse<WPMedia> = await this.client.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // ==================== 用户 API ====================

  /**
   * 获取用户列表
   */
  async getUsers(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    order?: 'asc' | 'desc';
    orderby?: string;
    roles?: string[];
  }): Promise<WPUser[]> {
    const response: AxiosResponse<WPUser[]> = await this.client.get('/users', { params });
    return response.data;
  }

  /**
   * 获取单个用户
   */
  async getUser(id: number): Promise<WPUser> {
    const response: AxiosResponse<WPUser> = await this.client.get(`/users/${id}`);
    return response.data;
  }

  // ==================== 搜索 API ====================

  /**
   * 搜索内容
   */
  async search(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    subtype?: string[];
    type?: string[];
  }): Promise<any[]> {
    const response: AxiosResponse<any[]> = await this.client.get('/search', { params });
    return response.data;
  }
}

// 创建单例实例
let wpClient: WordPressClient | null = null;

export function getWordPressClient(config?: WPConfig): WordPressClient {
  if (!wpClient) {
    if (!config) {
      throw new Error('WordPress config is required');
    }
    wpClient = new WordPressClient(config);
  }
  return wpClient;
}

// 默认导出
export default WordPressClient;
