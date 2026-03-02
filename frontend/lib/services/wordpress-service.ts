/**
 * WordPress REST API 服务
 * 完整的 WordPress API 集成服务
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API 配置
const API_BASE_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-site.com/wp-json';
const API_TIMEOUT = 30000;

/**
 * WordPress API 响应接口
 */
export interface WPApiResponse<T> {
  data?: T;
  headers?: any;
  status: number;
  statusText: string;
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number;
  per_page?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
}

/**
 * 文章参数
 */
export interface PostsParams extends PaginationParams {
  slug?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  search?: string;
  status?: string;
  _fields?: string;
  sticky?: boolean;
}

/**
 * 分类参数
 */
export interface CategoriesParams extends PaginationParams {
  slug?: string;
  exclude?: number[];
  hide_empty?: boolean;
}

/**
 * 标签参数
 */
export interface TagsParams extends PaginationParams {
  slug?: string;
  exclude?: number[];
  hide_empty?: boolean;
}

/**
 * 评论参数
 */
export interface CommentsParams extends PaginationParams {
  post?: number;
  author_email?: string;
  karma?: number;
}

/**
 * 媒体参数
 */
export interface MediaParams extends PaginationParams {
  search?: string;
  parent?: number;
}

/**
 * WordPress 服务类
 */
class WordPressService {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 添加认证 token（如果存在）
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
        // 统一错误处理
        if (error.response?.status === 401) {
          // Token 过期，清除本地存储
          this.clearAuthToken();
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取认证 token
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('wp_auth_token');
    }
    return null;
  }

  /**
   * 设置认证 token
   */
  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wp_auth_token', token);
    }
  }

  /**
   * 清除认证 token
   */
  clearAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wp_auth_token');
    }
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<WPApiResponse<T>> {
    try {
      const response = await this.client.request<T>({
        method,
        url: endpoint,
        data,
        ...config,
      });

      return {
        data: response.data,
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error: any) {
      throw new Error(
        `WordPress API Error: ${error.response?.data?.message || error.message}`
      );
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, params?: any): Promise<WPApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, { params });
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data: any): Promise<WPApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, data: any): Promise<WPApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string): Promise<WPApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }

  /**
   * 获取文章列表
   */
  async getPosts(params?: PostsParams) {
    const response = await this.get<any[]>('/wp/v2/posts', params);
    return {
      data: response.data,
      total: parseInt(response.headers?.['x-wp-total'] || '0'),
      totalPages: parseInt(response.headers?.['x-wp-totalpages'] || '0'),
    };
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string, params?: any) {
    return this.get<any>(`/wp/v2/posts/${id}`, params);
  }

  /**
   * 创建文章
   */
  async createPost(data: any) {
    return this.post<any>('/wp/v2/posts', data);
  }

  /**
   * 更新文章
   */
  async updatePost(id: number, data: any) {
    return this.put<any>(`/wp/v2/posts/${id}`, data);
  }

  /**
   * 删除文章
   */
  async deletePost(id: number) {
    return this.delete<any>(`/wp/v2/posts/${id}`);
  }

  /**
   * 获取分类列表
   */
  async getCategories(params?: CategoriesParams) {
    const response = await this.get<any[]>('/wp/v2/categories', params);
    return {
      data: response.data,
      total: parseInt(response.headers?.['x-wp-total'] || '0'),
    };
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number) {
    return this.get<any>(`/wp/v2/categories/${id}`);
  }

  /**
   * 获取标签列表
   */
  async getTags(params?: TagsParams) {
    const response = await this.get<any[]>('/wp/v2/tags', params);
    return {
      data: response.data,
      total: parseInt(response.headers?.['x-wp-total'] || '0'),
    };
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number) {
    return this.get<any>(`/wp/v2/tags/${id}`);
  }

  /**
   * 获取评论列表
   */
  async getComments(params?: CommentsParams) {
    const response = await this.get<any[]>('/wp/v2/comments', params);
    return {
      data: response.data,
      total: parseInt(response.headers?.['x-wp-total'] || '0'),
    };
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
  }) {
    return this.post<any>('/wp/v2/comments', data);
  }

  /**
   * 获取媒体列表
   */
  async getMedia(params?: MediaParams) {
    return this.get<any[]>('/wp/v2/media', params);
  }

  /**
   * 上传媒体
   */
  async uploadMedia(file: File, additionalData?: any) {
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
    });
  }

  /**
   * 获取用户列表
   */
  async getUsers(params?: PaginationParams) {
    const response = await this.get<any[]>('/wp/v2/users', params);
    return {
      data: response.data,
      total: parseInt(response.headers?.['x-wp-total'] || '0'),
    };
  }

  /**
   * 获取单个用户
   */
  async getUser(id: number) {
    return this.get<any>(`/wp/v2/users/${id}`);
  }

  /**
   * 获取当前用户
   */
  async getCurrentUser() {
    return this.get<any>('/wp/v2/users/me');
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params?: PostsParams) {
    return this.getPosts({
      ...params,
      search: query,
    });
  }

  /**
   * 获取文章的评论
   */
  async getPostComments(postId: number, params?: CommentsParams) {
    return this.getComments({
      ...params,
      post: postId,
    });
  }

  /**
   * 点赞文章
   */
  async likePost(postId: number) {
    return this.post<any>(`/cyberpress/v1/posts/${postId}/like`, {});
  }

  /**
   * 取消点赞
   */
  async unlikePost(postId: number) {
    return this.delete<any>(`/cyberpress/v1/posts/${postId}/like`);
  }

  /**
   * 获取文章点赞数
   */
  async getPostLikes(postId: number) {
    return this.get<any>(`/cyberpress/v1/posts/${postId}/likes`);
  }

  /**
   * 添加书签
   */
  async addBookmark(postId: number) {
    return this.post<any>('/cyberpress/v1/bookmarks', { post_id: postId });
  }

  /**
   * 移除书签
   */
  async removeBookmark(postId: number) {
    return this.delete<any>(`/cyberpress/v1/bookmarks/${postId}`);
  }

  /**
   * 获取用户书签
   */
  async getBookmarks(params?: PaginationParams) {
    return this.get<any[]>('/cyberpress/v1/bookmarks', params);
  }

  /**
   * 添加到阅读列表
   */
  async addToReadingList(postId: number) {
    return this.post<any>('/cyberpress/v1/reading-list', { post_id: postId });
  }

  /**
   * 更新阅读进度
   */
  async updateReadingProgress(postId: number, progress: number) {
    return this.post<any>(`/cyberpress/v1/reading-list/${postId}`, { progress });
  }

  /**
   * 获取阅读列表
   */
  async getReadingList(params?: PaginationParams) {
    return this.get<any[]>('/cyberpress/v1/reading-list', params);
  }

  /**
   * 订阅邮件列表
   */
  async subscribeNewsletter(email: string) {
    return this.post<any>('/cyberpress/v1/newsletter', { email });
  }

  /**
   * 提交联系表单
   */
  async submitContactForm(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return this.post<any>('/cyberpress/v1/contact', data);
  }

  /**
   * 获取站点信息
   */
  async getSiteInfo() {
    return this.get<any>('/wp/v2/settings');
  }

  /**
   * 批量获取文章
   */
  async getPostsByIds(ids: number[]) {
    return this.get<any[]>('/wp/v2/posts', {
      include: ids.join(','),
      per_page: ids.length,
    });
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(postId: number, limit: number = 5) {
    return this.get<any[]>(`/cyberpress/v1/posts/${postId}/related`, {
      per_page: limit,
    });
  }

  /**
   * 获取热门文章
   */
  async getPopularPosts(limit: number = 10, timeframe: 'day' | 'week' | 'month' | 'all' = 'all') {
    return this.get<any[]>('/cyberpress/v1/posts/popular', {
      per_page: limit,
      timeframe,
    });
  }

  /**
   * 获取统计信息
   */
  async getStats() {
    return this.get<any>('/cyberpress/v1/stats');
  }

  /**
   * 搜索
   */
  async search(query: string, params?: {
    type?: 'post' | 'page' | 'any';
    subtype?: string[];
    per_page?: number;
  }) {
    return this.get<any[]>('/wp/v2/search', {
      search: query,
      ...params,
    });
  }
}

// 创建单例实例
const wordpressService = new WordPressService();

export default wordpressService;

// 导出类型和服务
export { WordPressService };
export type {
  WPApiResponse,
  PaginationParams,
  PostsParams,
  CategoriesParams,
  TagsParams,
  CommentsParams,
  MediaParams,
};
