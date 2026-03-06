/**
 * 增强的 WordPress REST API 客户端
 * 支持完整的 CRUD 操作、搜索、分页等功能
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// ==================== 类型定义 ====================

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
    raw: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  type: string;
  link: string;
  title: {
    rendered: string;
    raw: string;
  };
  content: {
    rendered: string;
    raw: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    raw: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: 'standard' | 'aside' | 'chat' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio';
  meta: any[];
  categories: number[];
  tags: number[];
  _links?: any;
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:term'?: Array<Array<WordPressCategory | WordPressTag>>;
    'wp:author'?: WordPressAuthor[];
    'replies'?: any[];
  };
  // 扩展字段
  view_count?: number;
  like_count?: number;
  reading_time?: number;
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  _links?: any;
  // 扩展字段
  color?: string;
  icon?: string;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: any[];
  _links?: any;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: {
    '24': string;
    '48': string;
    '96': string;
    '128': string;
    '256': string;
  };
  meta: any[];
  _links?: any;
  // 扩展字段
  role?: string;
  social?: {
    twitter?: string;
    github?: string;
    website?: string;
  };
}

export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
    raw: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
    raw: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  alt_text: string;
  caption: {
    rendered: string;
    raw: string;
  };
  description: {
    rendered: string;
    raw: string;
  };
  media_type: 'image' | 'file' | 'video' | 'audio';
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes?: {
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
  post: number;
  source_url: string;
  meta: any[];
  _links?: any;
}

export interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  author_email?: string;
  author_avatar_urls?: {
    '24': string;
    '48': string;
    '96': string;
  };
  author_ip: string;
  date: string;
  date_gmt: string;
  content: {
    rendered: string;
    raw: string;
  };
  link: string;
  status: string;
  type: string;
  meta: any[];
  karma: number;
  _links?: any;
}

export interface WordPressPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: any[];
  _links?: any;
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[];
    'wp:author'?: WordPressAuthor[];
  };
}

// ==================== API 客户端类 ====================

export interface ClientConfig {
  baseURL?: string;
  timeout?: number;
  namespace?: string;
}

export class WordPressClient {
  private client: AxiosInstance;
  private namespace: string;

  constructor(config: ClientConfig = {}) {
    const {
      baseURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://localhost:8080/wp-json',
      timeout = 30000,
      namespace = 'wp/v2',
    } = config;

    this.namespace = namespace;

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        // 可以在这里添加认证 token
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // 统一错误处理
        if (error.response) {
          // 服务器返回错误状态码
          console.error('API Error:', error.response.data);
        } else if (error.request) {
          // 请求已发出但没有收到响应
          console.error('Network Error:', error.message);
        } else {
          // 请求配置出错
          console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 获取原始响应（包含 headers）
   */
  async getRawResponse<T>(endpoint: string, params?: any): Promise<{
    data: T;
    headers: any;
  }> {
    const response: AxiosResponse<T> = await this.client.get(endpoint, { params });
    return {
      data: response.data,
      headers: response.headers,
    };
  }

  // ==================== Posts ====================

  /**
   * 获取文章列表
   */
  async getPosts(params: {
    page?: number;
    per_page?: number;
    search?: string;
    after?: string;
    before?: string;
    author?: number;
    author_exclude?: number[];
    categories?: number[];
    categories_exclude?: number[];
    tags?: number[];
    tags_exclude?: number[];
    sticky?: boolean;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'relevance' | 'id' | 'include' | 'title' | 'slug';
    slug?: string[];
    status?: string;
    _embed?: boolean;
  } = {}): Promise<WordPressPost[]> {
    const response = await this.client.get('/posts', { params });
    return response.data;
  }

  /**
   * 获取文章总数
   */
  async getPostsCount(): Promise<number> {
    const response = await this.client.get('/posts', {
      params: { per_page: 1, page: 1 },
    });
    return parseInt(response.headers['x-wp-total'] || '0', 10);
  }

  /**
   * 获取单篇文章（通过 ID）
   */
  async getPost(id: number, params: { _embed?: boolean } = {}): Promise<WordPressPost> {
    const response = await this.client.get(`/posts/${id}`, { params });
    return response.data;
  }

  /**
   * 获取单篇文章（通过 slug）
   */
  async getPostBySlug(slug: string, params: { _embed?: boolean } = {}): Promise<WordPressPost | null> {
    const response = await this.client.get('/posts', {
      params: { slug, ...params, per_page: 1 },
    });
    return response.data[0] || null;
  }

  /**
   * 搜索文章
   */
  async searchPosts(searchQuery: string, params: any = {}): Promise<WordPressPost[]> {
    return this.getPosts({ search: searchQuery, ...params });
  }

  // ==================== Pages ====================

  /**
   * 获取页面列表
   */
  async getPages(params: any = {}): Promise<WordPressPage[]> {
    const response = await this.client.get('/pages', { params });
    return response.data;
  }

  /**
   * 获取单个页面
   */
  async getPage(id: number, params: any = {}): Promise<WordPressPage> {
    const response = await this.client.get(`/pages/${id}`, { params });
    return response.data;
  }

  /**
   * 通过 slug 获取页面
   */
  async getPageBySlug(slug: string, params: any = {}): Promise<WordPressPage | null> {
    const response = await this.client.get('/pages', {
      params: { slug, ...params, per_page: 1 },
    });
    return response.data[0] || null;
  }

  // ==================== Categories ====================

  /**
   * 获取分类列表
   */
  async getCategories(params: {
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    order?: 'asc' | 'desc';
    orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count';
    hide_empty?: boolean;
    parent?: number;
    post?: number;
    slug?: string[];
  } = {}): Promise<WordPressCategory[]> {
    const response = await this.client.get('/categories', { params });
    return response.data;
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number, params: any = {}): Promise<WordPressCategory> {
    const response = await this.client.get(`/categories/${id}`, { params });
    return response.data;
  }

  /**
   * 通过 slug 获取分类
   */
  async getCategoryBySlug(slug: string, params: any = {}): Promise<WordPressCategory | null> {
    const response = await this.client.get('/categories', {
      params: { slug, ...params, per_page: 1 },
    });
    return response.data[0] || null;
  }

  // ==================== Tags ====================

  /**
   * 获取标签列表
   */
  async getTags(params: {
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    order?: 'asc' | 'desc';
    orderby?: 'id' | 'include' | 'name' | 'slug' | 'term_group' | 'description' | 'count';
    hide_empty?: boolean;
    post?: number;
    slug?: string[];
  } = {}): Promise<WordPressTag[]> {
    const response = await this.client.get('/tags', { params });
    return response.data;
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number, params: any = {}): Promise<WordPressTag> {
    const response = await this.client.get(`/tags/${id}`, { params });
    return response.data;
  }

  /**
   * 通过 slug 获取标签
   */
  async getTagBySlug(slug: string, params: any = {}): Promise<WordPressTag | null> {
    const response = await this.client.get('/tags', {
      params: { slug, ...params, per_page: 1 },
    });
    return response.data[0] || null;
  }

  // ==================== Authors ====================

  /**
   * 获取作者列表
   */
  async getAuthors(params: any = {}): Promise<WordPressAuthor[]> {
    const response = await this.client.get('/users', { params });
    return response.data;
  }

  /**
   * 获取单个作者
   */
  async getAuthor(id: number, params: any = {}): Promise<WordPressAuthor> {
    const response = await this.client.get(`/users/${id}`, { params });
    return response.data;
  }

  /**
   * 通过 slug 获取作者
   */
  async getAuthorBySlug(slug: string, params: any = {}): Promise<WordPressAuthor | null> {
    const response = await this.client.get('/users', {
      params: { slug, ...params, per_page: 1 },
    });
    return response.data[0] || null;
  }

  // ==================== Media ====================

  /**
   * 获取媒体列表
   */
  async getMediaList(params: any = {}): Promise<WordPressMedia[]> {
    const response = await this.client.get('/media', { params });
    return response.data;
  }

  /**
   * 获取单个媒体
   */
  async getMedia(id: number, params: any = {}): Promise<WordPressMedia> {
    const response = await this.client.get(`/media/${id}`, { params });
    return response.data;
  }

  // ==================== Comments ====================

  /**
   * 获取评论列表
   */
  async getComments(params: {
    page?: number;
    per_page?: number;
    post?: number;
    parent?: number[];
    parent_exclude?: number[];
    author?: number;
    author_exclude?: number[];
    author_email?: string;
    karma?: number;
    search?: string;
    status?: string;
    type?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
    _embed?: boolean;
  } = {}): Promise<WordPressComment[]> {
    const response = await this.client.get('/comments', { params });
    return response.data;
  }

  /**
   * 获取单条评论
   */
  async getComment(id: number, params: any = {}): Promise<WordPressComment> {
    const response = await this.client.get(`/comments/${id}`, { params });
    return response.data;
  }

  /**
   * 提交评论
   */
  async createComment(data: {
    post: number;
    content: string;
    author_name: string;
    author_email: string;
    author_url?: string;
    parent?: number;
  }): Promise<WordPressComment> {
    const response = await this.client.post('/comments', data);
    return response.data;
  }

  // ==================== Search ====================

  /**
   * 全局搜索
   */
  async search(params: {
    search: string;
    page?: number;
    per_page?: number;
    type?: string[];
    subtype?: string[];
  } = {}): Promise<any[]> {
    const response = await this.client.get('/search', { params });
    return response.data;
  }

  // ==================== Utilities ====================

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

  /**
   * 获取站点信息
   */
  async getSiteInfo(): Promise<any> {
    const response = await this.client.get('/');
    return response.data;
  }
}

// ==================== 导出单例 ====================

export const wpClient = new WordPressClient();

export default wpClient;
