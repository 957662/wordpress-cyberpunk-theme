/**
 * WordPress REST API 客户端
 * 连接 Next.js 前端与 WordPress 后端的核心模块
 */

interface WPConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  timeout?: number;
}

interface WPResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

interface Post {
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

interface Category {
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

interface Tag {
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

interface Comment {
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

interface Media {
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
  post: number;
  source_url: string;
  meta: any[];
  _links: any;
}

interface User {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: any;
  meta: any[];
  _links: any;
}

class WordPressClient {
  private config: WPConfig;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTimeout: number = 5 * 60 * 1000; // 5分钟缓存

  constructor(config: WPConfig) {
    this.config = {
      ...config,
      timeout: config.timeout || 10000,
    };
    this.cache = new Map();
  }

  /**
   * 获取完整的API端点URL
   */
  private getEndpoint(endpoint: string): string {
    const baseUrl = this.config.baseUrl.replace(/\/$/, '');
    return `${baseUrl}/wp-json/wp/v2/${endpoint.replace(/^\//, '')}`;
  }

  /**
   * 获取认证头
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.config.username && this.config.password) {
      headers['Authorization'] = `Basic ${btoa(`${this.config.username}:${this.config.password}`)}`;
    }

    return headers;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<WPResponse<T>> {
    const url = this.getEndpoint(endpoint);
    const cacheKey = `${options.method || 'GET'}:${url}`;

    // 检查缓存
    if (options.method === 'GET' || !options.method) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return { data: cached.data, error: null, status: 200 };
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          data: null,
          error: data.message || '请求失败',
          status: response.status,
        };
      }

      // 缓存成功响应
      if (response.ok && (options.method === 'GET' || !options.method)) {
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
      }

      return {
        data,
        error: null,
        status: response.status,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : '未知错误',
        status: 0,
      };
    }
  }

  /**
   * 清除缓存
   */
  public clearCache(pattern?: string): void {
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

  // ==================== 文章相关 ====================

  /**
   * 获取文章列表
   */
  async getPosts(params: {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    orderby?: 'date' | 'relevance' | 'id' | 'title' | 'slug';
    order?: 'asc' | 'desc';
    status?: string;
  } = {}): Promise<WPResponse<Post[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return this.request<Post[]>(`posts?${queryString}`);
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string): Promise<WPResponse<Post>> {
    return this.request<Post>(`posts/${id}`);
  }

  /**
   * 根据slug获取文章
   */
  async getPostBySlug(slug: string): Promise<WPResponse<Post[]>> {
    return this.request<Post[]>(`posts?slug=${slug}`);
  }

  /**
   * 创建文章
   */
  async createPost(post: Partial<Post>): Promise<WPResponse<Post>> {
    return this.request<Post>('posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  /**
   * 更新文章
   */
  async updatePost(id: number, post: Partial<Post>): Promise<WPResponse<Post>> {
    return this.request<Post>(`posts/${id}`, {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  /**
   * 删除文章
   */
  async deletePost(id: number, force: boolean = false): Promise<WPResponse<Post>> {
    return this.request<Post>(`posts/${id}?force=${force}`, {
      method: 'DELETE',
    });
  }

  // ==================== 分类相关 ====================

  /**
   * 获取分类列表
   */
  async getCategories(params: {
    page?: number;
    per_page?: number;
    search?: string;
    parent?: number;
    hide_empty?: boolean;
  } = {}): Promise<WPResponse<Category[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return this.request<Category[]>(`categories?${queryString}`);
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WPResponse<Category>> {
    return this.request<Category>(`categories/${id}`);
  }

  // ==================== 标签相关 ====================

  /**
   * 获取标签列表
   */
  async getTags(params: {
    page?: number;
    per_page?: number;
    search?: string;
    hide_empty?: boolean;
  } = {}): Promise<WPResponse<Tag[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return this.request<Tag[]>(`tags?${queryString}`);
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WPResponse<Tag>> {
    return this.request<Tag>(`tags/${id}`);
  }

  // ==================== 评论相关 ====================

  /**
   * 获取评论列表
   */
  async getComments(params: {
    post?: number;
    page?: number;
    per_page?: number;
    parent?: number;
    status?: string;
  } = {}): Promise<WPResponse<Comment[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return this.request<Comment[]>(`comments?${queryString}`);
  }

  /**
   * 获取单条评论
   */
  async getComment(id: number): Promise<WPResponse<Comment>> {
    return this.request<Comment>(`comments/${id}`);
  }

  /**
   * 创建评论
   */
  async createComment(comment: Partial<Comment>): Promise<WPResponse<Comment>> {
    return this.request<Comment>('comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  /**
   * 更新评论
   */
  async updateComment(id: number, comment: Partial<Comment>): Promise<WPResponse<Comment>> {
    return this.request<Comment>(`comments/${id}`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  /**
   * 删除评论
   */
  async deleteComment(id: number, force: boolean = false): Promise<WPResponse<Comment>> {
    return this.request<Comment>(`comments/${id}?force=${force}`, {
      method: 'DELETE',
    });
  }

  // ==================== 媒体相关 ====================

  /**
   * 获取媒体列表
   */
  async getMedia(params: {
    page?: number;
    per_page?: number;
    search?: string;
    parent?: number;
  } = {}): Promise<WPResponse<Media[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return this.request<Media[]>(`media?${queryString}`);
  }

  /**
   * 获取单个媒体
   */
  async getMediaItem(id: number): Promise<WPResponse<Media>> {
    return this.request<Media>(`media/${id}`);
  }

  /**
   * 上传媒体
   */
  async uploadMedia(file: File, additionalData?: any): Promise<WPResponse<Media>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('status', 'publish');

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    return this.request<Media>('media', {
      method: 'POST',
      headers: {
        // 不设置 Content-Type，让浏览器自动设置
      },
      body: formData,
    } as any);
  }

  // ==================== 用户相关 ====================

  /**
   * 获取用户列表
   */
  async getUsers(params: {
    page?: number;
    per_page?: number;
    search?: string;
    roles?: string[];
  } = {}): Promise<WPResponse<User[]>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return this.request<User[]>(`users?${queryString}`);
  }

  /**
   * 获取单个用户
   */
  async getUser(id: number): Promise<WPResponse<User>> {
    return this.request<User>(`users/${id}`);
  }

  /**
   * 获取当前用户
   */
  async getCurrentUser(): Promise<WPResponse<User>> {
    return this.request<User>('users/me');
  }

  // ==================== 搜索相关 ====================

  /**
   * 全局搜索
   */
  async search(query: string, params: {
    page?: number;
    per_page?: number;
    type?: ('post' | 'page' | 'attachment' | any)[];
    subtype?: string[];
  } = {}): Promise<WPResponse<any[]>> {
    const searchParams = new URLSearchParams();
    searchParams.append('search', query);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          searchParams.append(key, value.join(','));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return this.request<any[]>(`search?${queryString}`);
  }
}

// 创建默认实例
let defaultClient: WordPressClient | null = null;

/**
 * 初始化 WordPress API 客户端
 */
export function initWordPressClient(config: WPConfig): WordPressClient {
  defaultClient = new WordPressClient(config);
  return defaultClient;
}

/**
 * 获取默认客户端实例
 */
export function getWordPressClient(): WordPressClient {
  if (!defaultClient) {
    // 从环境变量读取配置
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080';
    const username = process.env.WORDPRESS_API_USERNAME;
    const password = process.env.WORDPRESS_API_PASSWORD;

    defaultClient = new WordPressClient({
      baseUrl,
      username,
      password,
    });
  }
  return defaultClient;
}

export { WordPressClient };
export type {
  Post,
  Category,
  Tag,
  Comment,
  Media,
  User,
  WPConfig,
  WPResponse,
};
