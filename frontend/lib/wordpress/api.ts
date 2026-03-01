/**
 * WordPress API 客户端
 * 与 WordPress 后端通信
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type {
  Post,
  Page,
  Category,
  Tag,
  Author,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

// WordPress API 配置
interface WPConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  timeout?: number;
}

export class WordPressClient {
  private client: AxiosInstance;
  private config: WPConfig;

  constructor(config: WPConfig) {
    this.config = config;

    // 创建 axios 实例
    this.client = axios.create({
      baseURL: `${config.baseUrl}/wp-json/wp/v2`,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加认证
        if (this.config.username && this.config.password) {
          config.auth = {
            username: this.config.username,
            password: this.config.password,
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 添加响应拦截器
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        // 统一错误处理
        if (error.response) {
          // 服务器响应错误
          throw new Error(error.response.data.message || '请求失败');
        } else if (error.request) {
          // 请求发送但无响应
          throw new Error('网络错误，请检查您的连接');
        } else {
          // 请求配置错误
          throw new Error(error.message);
        }
      }
    );
  }

  /**
   * 获取文章列表
   */
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    categories?: number[];
    tags?: number[];
    search?: string;
    orderby?: 'date' | 'title' | 'relevance';
    order?: 'asc' | 'desc';
    status?: 'publish' | 'draft' | 'pending';
  }): Promise<PaginatedResponse<Post>> {
    const response = await this.client.get('/posts', { params });
    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    return {
      data: response,
      total,
      totalPages,
      currentPage: params?.page || 1,
      pageSize: params?.per_page || 10,
    };
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string): Promise<Post> {
    return await this.client.get(`/posts/${id}`);
  }

  /**
   * 通过 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<Post> {
    const posts = await this.client.get('/posts', { params: { slug } });
    return posts[0];
  }

  /**
   * 创建文章
   */
  async createPost(data: Partial<Post>): Promise<Post> {
    return await this.client.post('/posts', data);
  }

  /**
   * 更新文章
   */
  async updatePost(id: number, data: Partial<Post>): Promise<Post> {
    return await this.client.post(`/posts/${id}`, data);
  }

  /**
   * 删除文章
   */
  async deletePost(id: number, force?: boolean): Promise<void> {
    await this.client.delete(`/posts/${id}`, { params: { force } });
  }

  /**
   * 获取页面列表
   */
  async getPages(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    orderby?: 'date' | 'title' | 'menu_order';
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Page>> {
    const response = await this.client.get('/pages', { params });
    const total = parseInt(response.headers['x-wp-total'] || '0', 10);
    const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

    return {
      data: response,
      total,
      totalPages,
      currentPage: params?.page || 1,
      pageSize: params?.per_page || 10,
    };
  }

  /**
   * 获取单个页面
   */
  async getPage(id: number | string): Promise<Page> {
    return await this.client.get(`/pages/${id}`);
  }

  /**
   * 获取分类列表
   */
  async getCategories(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<Category>> {
    const response = await this.client.get('/categories', { params });
    const total = parseInt(response.headers['x-wp-total'] || '0', 10);

    return {
      data: response,
      total,
      totalPages: 1,
      currentPage: params?.page || 1,
      pageSize: params?.per_page || 10,
    };
  }

  /**
   * 获取标签列表
   */
  async getTags(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<PaginatedResponse<Tag>> {
    const response = await this.client.get('/tags', { params });
    const total = parseInt(response.headers['x-wp-total'] || '0', 10);

    return {
      data: response,
      total,
      totalPages: 1,
      currentPage: params?.page || 1,
      pageSize: params?.per_page || 10,
    };
  }

  /**
   * 获取作者列表
   */
  async getAuthors(params?: {
    page?: number;
    per_page?: number;
  }): Promise<PaginatedResponse<Author>> {
    const response = await this.client.get('/users', { params });
    const total = parseInt(response.headers['x-wp-total'] || '0', 10);

    return {
      data: response,
      total,
      totalPages: 1,
      currentPage: params?.page || 1,
      pageSize: params?.per_page || 10,
    };
  }

  /**
   * 搜索内容
   */
  async search(params: {
    search: string;
    subtype?: 'post' | 'page' | 'any';
    per_page?: number;
    page?: number;
  }): Promise<PaginatedResponse<any>> {
    const response = await this.client.get('/search', { params });
    const total = parseInt(response.headers['x-wp-total'] || '0', 10);

    return {
      data: response,
      total,
      totalPages: 1,
      currentPage: params.page || 1,
      pageSize: params.per_page || 10,
    };
  }

  /**
   * 获取媒体文件
   */
  async getMedia(id: number): Promise<any> {
    return await this.client.get(`/media/${id}`);
  }

  /**
   * 上传媒体文件
   */
  async uploadMedia(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('status', 'publish');

    return await this.client.post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * 获取评论列表
   */
  async getComments(postId?: number): Promise<any[]> {
    const params = postId ? { post: postId } : {};
    return await this.client.get('/comments', { params });
  }

  /**
   * 创建评论
   */
  async createComment(data: {
    post: number;
    author_name: string;
    author_email: string;
    content: string;
    parent?: number;
  }): Promise<any> {
    return await this.client.post('/comments', data);
  }
}

// 创建默认客户端实例
let wpClient: WordPressClient | null = null;

export function initWordPress(config: WPConfig) {
  wpClient = new WordPressClient(config);
  return wpClient;
}

export function getWordPress(): WordPressClient {
  if (!wpClient) {
    throw new Error('WordPress client not initialized. Call initWordPress first.');
  }
  return wpClient;
}

// 导出类型
export type { WPConfig };
