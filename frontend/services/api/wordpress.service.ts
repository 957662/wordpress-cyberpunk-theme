/**
 * WordPress API Service
 * WordPress API 服务
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// WordPress API 配置
const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080/wp-json';
const WP_API_USERNAME = process.env.NEXT_PUBLIC_WORDPRESS_API_USERNAME;
const WP_API_PASSWORD = process.env.NEXT_PUBLIC_WORDPRESS_API_PASSWORD;
const WP_API_NONCE = process.env.NEXT_PUBLIC_WORDPRESS_API_NONCE;

// 基础 API 响应类型
export interface WPApiResponse<T> {
  data: T;
  status: number;
  headers: any;
}

// 分页参数
export interface WPQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  before?: string;
  after?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  slug?: string[];
  status?: string;
  categories?: number[];
  tags?: number[];
  sticky?: boolean;
}

// 文章类型
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
  featured_image?: string;
  author_data?: WPAuthor;
}

// 作者类型
export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: { [key: string]: string };
}

// 分类类型
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
}

// 标签类型
export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
}

// 媒体类型
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
  media_details: any;
  source_url: string;
}

// 评论类型
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
}

// 用户类型
export interface WPUser {
  id: number;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  url: string;
  description: string;
  link: string;
  avatar_urls: { [key: string]: string };
  meta: any[];
}

// 创建 axios 实例
function createApiInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: WP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 添加认证信息
      if (WP_API_USERNAME && WP_API_PASSWORD) {
        config.auth = {
          username: WP_API_USERNAME,
          password: WP_API_PASSWORD,
        };
      }

      // 添加 nonce
      if (WP_API_NONCE) {
        config.headers['X-WP-Nonce'] = WP_API_NONCE;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // 统一错误处理
      if (error.response) {
        console.error('API Error:', error.response.data);
      } else if (error.request) {
        console.error('Network Error:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

const api = createApiInstance();

// WordPress API 服务类
export class WordPressService {
  /**
   * 获取文章列表
   */
  static async getPosts(params: WPQueryParams = {}): Promise<AxiosResponse<WPPost[]>> {
    return api.get<WPPost[]>('/wp/v2/posts', { params });
  }

  /**
   * 获取单篇文章
   */
  static async getPost(id: number): Promise<AxiosResponse<WPPost>> {
    return api.get<WPPost>(`/wp/v2/posts/${id}`);
  }

  /**
   * 根据slug获取文章
   */
  static async getPostBySlug(slug: string): Promise<AxiosResponse<WPPost[]>> {
    return api.get<WPPost[]>('/wp/v2/posts', { params: { slug } });
  }

  /**
   * 搜索文章
   */
  static async searchPosts(query: string, params: WPQueryParams = {}): Promise<AxiosResponse<WPPost[]>> {
    return api.get<WPPost[]>('/wp/v2/posts', {
      params: { ...params, search: query },
    });
  }

  /**
   * 获取分类列表
   */
  static async getCategories(params: WPQueryParams = {}): Promise<AxiosResponse<WPCategory[]>> {
    return api.get<WPCategory[]>('/wp/v2/categories', { params });
  }

  /**
   * 获取单个分类
   */
  static async getCategory(id: number): Promise<AxiosResponse<WPCategory>> {
    return api.get<WPCategory>(`/wp/v2/categories/${id}`);
  }

  /**
   * 获取标签列表
   */
  static async getTags(params: WPQueryParams = {}): Promise<AxiosResponse<WPTag[]>> {
    return api.get<WPTag[]>('/wp/v2/tags', { params });
  }

  /**
   * 获取单个标签
   */
  static async getTag(id: number): Promise<AxiosResponse<WPTag>> {
    return api.get<WPTag>(`/wp/v2/tags/${id}`);
  }

  /**
   * 获取作者列表
   */
  static async getAuthors(params: WPQueryParams = {}): Promise<AxiosResponse<WPAuthor[]>> {
    return api.get<WPAuthor[]>('/wp/v2/users', { params });
  }

  /**
   * 获取单个作者
   */
  static async getAuthor(id: number): Promise<AxiosResponse<WPAuthor>> {
    return api.get<WPAuthor>(`/wp/v2/users/${id}`);
  }

  /**
   * 获取媒体列表
   */
  static async getMedia(params: WPQueryParams = {}): Promise<AxiosResponse<WPMedia[]>> {
    return api.get<WPMedia[]>('/wp/v2/media', { params });
  }

  /**
   * 获取单个媒体
   */
  static async getMediaItem(id: number): Promise<AxiosResponse<WPMedia>> {
    return api.get<WPMedia>(`/wp/v2/media/${id}`);
  }

  /**
   * 获取评论列表
   */
  static async getComments(params: WPQueryParams = {}): Promise<AxiosResponse<WPComment[]>> {
    return api.get<WPComment[]>('/wp/v2/comments', { params });
  }

  /**
   * 获取文章的评论
   */
  static async getPostComments(postId: number): Promise<AxiosResponse<WPComment[]>> {
    return api.get<WPComment[]>(`/wp/v2/comments`, { params: { post: postId } });
  }

  /**
   * 创建评论
   */
  static async createComment(comment: Partial<WPComment>): Promise<AxiosResponse<WPComment>> {
    return api.post<WPComment>('/wp/v2/comments', comment);
  }

  /**
   * 获取页面列表
   */
  static async getPages(params: WPQueryParams = {}): Promise<AxiosResponse<WPPost[]>> {
    return api.get<WPPost[]>('/wp/v2/pages', { params });
  }

  /**
   * 获取单个页面
   */
  static async getPage(id: number): Promise<AxiosResponse<WPPost>> {
    return api.get<WPPost>(`/wp/v2/pages/${id}`);
  }

  /**
   * 获取自定义文章类型
   */
  static async getCustomPostType(
    postType: string,
    params: WPQueryParams = {}
  ): Promise<AxiosResponse<any[]>> {
    return api.get<any[]>(`/wp/v2/${postType}`, { params });
  }

  /**
   * 获取分类法
   */
  static async getTaxonomy(taxonomy: string, params: WPQueryParams = {}): Promise<AxiosResponse<any[]>> {
    return api.get<any[]>(`/wp/v2/${taxonomy}`, { params });
  }
}

// 导出单例
export default WordPressService;
