/**
 * WordPress REST API Service
 * 与 WordPress 后端通信的核心服务
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  WPPost,
  WPPage,
  WPCategory,
  WPTag,
  WPComment,
  WPAuthor,
  WPErrorResponse,
  WPParams,
} from '@/types/wordpress';

// WordPress API 配置
const WP_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080/wp-json';
const WP_API_USERNAME = process.env.NEXT_PUBLIC_WORDPRESS_API_USERNAME || '';
const WP_API_PASSWORD = process.env.NEXT_PUBLIC_WORDPRESS_API_PASSWORD || '';

// 创建 axios 实例
class WordPressService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: WP_API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器 - 添加认证
    this.client.interceptors.request.use(
      (config) => {
        if (WP_API_USERNAME && WP_API_PASSWORD) {
          config.auth = {
            username: WP_API_USERNAME,
            password: WP_API_PASSWORD,
          };
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 错误处理
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<WPErrorResponse>) => {
        if (error.response?.data) {
          console.error('WordPress API Error:', error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取文章列表
   */
  async getPosts(params?: WPParams): Promise<WPPost[]> {
    const response = await this.client.get<WPPost[]>('/wp/v2/posts', {
      params: {
        per_page: 10,
        page: 1,
        _embed: true,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * 获取单个文章
   */
  async getPost(id: number): Promise<WPPost> {
    const response = await this.client.get<WPPost>(`/wp/v2/posts/${id}`, {
      params: { _embed: true },
    });
    return response.data;
  }

  /**
   * 根据 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<WPPost> {
    const response = await this.client.get<WPPost[]>('/wp/v2/posts', {
      params: {
        slug,
        _embed: true,
      },
    });
    return response.data[0];
  }

  /**
   * 创建文章
   */
  async createPost(post: Partial<WPPost>): Promise<WPPost> {
    const response = await this.client.post<WPPost>('/wp/v2/posts', post);
    return response.data;
  }

  /**
   * 更新文章
   */
  async updatePost(id: number, post: Partial<WPPost>): Promise<WPPost> {
    const response = await this.client.put<WPPost>(`/wp/v2/posts/${id}`, post);
    return response.data;
  }

  /**
   * 删除文章
   */
  async deletePost(id: number): Promise<void> {
    await this.client.delete(`/wp/v2/posts/${id}?force=true`);
  }

  /**
   * 获取页面列表
   */
  async getPages(params?: WPParams): Promise<WPPage[]> {
    const response = await this.client.get<WPPage[]>('/wp/v2/pages', {
      params: {
        per_page: 100,
        _embed: true,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * 获取单个页面
   */
  async getPage(id: number): Promise<WPPage> {
    const response = await this.client.get<WPPage>(`/wp/v2/pages/${id}`, {
      params: { _embed: true },
    });
    return response.data;
  }

  /**
   * 根据 slug 获取页面
   */
  async getPageBySlug(slug: string): Promise<WPPage> {
    const response = await this.client.get<WPPage[]>('/wp/v2/pages', {
      params: {
        slug,
        _embed: true,
      },
    });
    return response.data[0];
  }

  /**
   * 获取分类列表
   */
  async getCategories(params?: WPParams): Promise<WPCategory[]> {
    const response = await this.client.get<WPCategory[]>('/wp/v2/categories', {
      params: {
        per_page: 100,
        hide_empty: true,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WPCategory> {
    const response = await this.client.get<WPCategory>(`/wp/v2/categories/${id}`);
    return response.data;
  }

  /**
   * 获取标签列表
   */
  async getTags(params?: WPParams): Promise<WPTag[]> {
    const response = await this.client.get<WPTag[]>('/wp/v2/tags', {
      params: {
        per_page: 100,
        hide_empty: true,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WPTag> {
    const response = await this.client.get<WPTag>(`/wp/v2/tags/${id}`);
    return response.data;
  }

  /**
   * 获取评论列表
   */
  async getComments(postId?: number, params?: WPParams): Promise<WPComment[]> {
    const response = await this.client.get<WPComment[]>('/wp/v2/comments', {
      params: {
        post: postId,
        per_page: 100,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * 创建评论
   */
  async createComment(comment: Partial<WPComment>): Promise<WPComment> {
    const response = await this.client.post<WPComment>('/wp/v2/comments', comment);
    return response.data;
  }

  /**
   * 获取作者列表
   */
  async getAuthors(params?: WPParams): Promise<WPAuthor[]> {
    const response = await this.client.get<WPAuthor[]>('/wp/v2/users', {
      params: {
        per_page: 100,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * 获取单个作者
   */
  async getAuthor(id: number): Promise<WPAuthor> {
    const response = await this.client.get<WPAuthor>(`/wp/v2/users/${id}`);
    return response.data;
  }

  /**
   * 搜索文章
   */
  async search(query: string, params?: WPParams): Promise<WPPost[]> {
    const response = await this.client.get<WPPost[]>('/wp/v2/search', {
      params: {
        search: query,
        subtype: 'post',
        _embed: true,
        ...params,
      },
    });
    return response.data;
  }

  /**
   * 获取媒体文件
   */
  async getMedia(id: number): Promise<any> {
    const response = await this.client.get(`/wp/v2/media/${id}`);
    return response.data;
  }

  /**
   * 上传媒体文件
   */
  async uploadMedia(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post('/wp/v2/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * 获取站点信息
   */
  async getSiteInfo(): Promise<any> {
    const response = await this.client.get('/');
    return response.data;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/');
      return true;
    } catch {
      return false;
    }
  }
}

// 导出单例
export const wordpressService = new WordPressService();

// 导出类型
export type { WordPressService };

// 默认导出
export default wordpressService;
