/**
 * WordPress REST API 客户端
 * 用于与 WordPress 后端进行通信
 */

export interface WPConfig {
  baseUrl: string;
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
  avatar_urls?: {
    '24'?: string;
    '48'?: string;
    '96'?: string;
  };
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

export interface WPApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
  headers?: Headers;
}

export interface WPParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: string;
  tags?: string;
  author?: string;
  orderby?: 'date' | 'relevance' | 'id' | 'include' | 'title' | 'slug';
  order?: 'asc' | 'desc';
  exclude?: string;
  include?: string;
  slug?: string;
  status?: string;
  sticky?: boolean;
}

class WordPressClient {
  private config: WPConfig;

  constructor(config: WPConfig) {
    this.config = {
      ...config,
      timeout: config.timeout || 10000,
    };
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    params?: WPParams
  ): Promise<WPApiResponse<T>> {
    const url = new URL(`${this.config.baseUrl}/wp/v2${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.message || '请求失败',
          status: response.status,
        };
      }

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { error: '请求超时', status: 0 };
        }
        return { error: error.message, status: 0 };
      }
      return { error: '未知错误', status: 0 };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * 获取文章列表
   */
  async getPosts(params?: WPParams): Promise<WPApiResponse<WPPost[]>> {
    return this.request<WPPost[]>('/posts', params);
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string): Promise<WPApiResponse<WPPost>> {
    return this.request<WPPost>(`/posts/${id}`);
  }

  /**
   * 通过 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<WPApiResponse<WPPost>> {
    const response = await this.request<WPPost[]>('/posts', { slug });
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      return { data: response.data[0], status: response.status };
    }
    return { error: '文章未找到', status: 404 };
  }

  /**
   * 获取分类列表
   */
  async getCategories(params?: Pick<WPParams, 'page' | 'per_page' | 'search' | 'exclude' | 'include'>): Promise<WPApiResponse<WPCategory[]>> {
    return this.request<WPCategory[]>('/categories', params);
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WPApiResponse<WPCategory>> {
    return this.request<WPCategory>(`/categories/${id}`);
  }

  /**
   * 获取标签列表
   */
  async getTags(params?: Pick<WPParams, 'page' | 'per_page' | 'search' | 'exclude' | 'include'>): Promise<WPApiResponse<WPTag[]>> {
    return this.request<WPTag[]>('/tags', params);
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WPApiResponse<WPTag>> {
    return this.request<WPTag>(`/tags/${id}`);
  }

  /**
   * 获取作者列表
   */
  async getAuthors(params?: Pick<WPParams, 'page' | 'per_page' | 'search' | 'exclude' | 'include'>): Promise<WPApiResponse<WPAuthor[]>> {
    return this.request<WPAuthor[]>('/users', params);
  }

  /**
   * 获取单个作者
   */
  async getAuthor(id: number): Promise<WPApiResponse<WPAuthor>> {
    return this.request<WPAuthor>(`/users/${id}`);
  }

  /**
   * 获取文章评论
   */
  async getComments(postId: number): Promise<WPApiResponse<WPComment[]>> {
    return this.request<WPComment[]>(`/comments?post=${postId}`);
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params?: Omit<WPParams, 'search'>): Promise<WPApiResponse<WPPost[]>> {
    return this.request<WPPost[]>('/posts', { ...params, search: query });
  }

  /**
   * 获取文章总数
   */
  async getTotalPosts(params?: Pick<WPParams, 'search' | 'categories' | 'tags' | 'author'>): Promise<number> {
    const url = new URL(`${this.config.baseUrl}/wp/v2/posts`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const totalCount = response.headers.get('X-WP-Total');
    return totalCount ? parseInt(totalCount, 10) : 0;
  }

  /**
   * 获取总页数
   */
  getTotalPages(headers: Headers): number {
    return parseInt(headers.get('X-WP-TotalPages') || '0', 10);
  }

  /**
   * 获取总记录数
   */
  getTotal(headers: Headers): number {
    return parseInt(headers.get('X-WP-Total') || '0', 10);
  }

  /**
   * 获取媒体信息
   */
  async getMedia(id: number): Promise<WPApiResponse<any>> {
    return this.request(`/media/${id}`);
  }
}

// 创建默认实例
const defaultConfig: WPConfig = {
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-site.com/wp-json',
};

export const wpClient = new WordPressClient(defaultConfig);

// 导出类型（已经在顶部导出）
export { WordPressClient };
