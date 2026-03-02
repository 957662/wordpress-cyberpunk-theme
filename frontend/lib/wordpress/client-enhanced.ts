/**
 * 增强的 WordPress REST API 客户端
 * 提供完整的 API 封装、缓存、错误处理和类型安全
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface WPConfig {
  baseUrl: string;
  apiPath?: string;
  auth?: {
    username: string;
    password: string;
  };
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
  meta: unknown[];
  categories: number[];
  tags: number[];
  _links: Record<string, unknown>;
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
  meta: unknown[];
  _links: Record<string, unknown>;
}

export interface WPTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: unknown[];
  _links: Record<string, unknown>;
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
  meta: unknown[];
  _links: Record<string, unknown>;
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
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: Record<string, { file: string; width: number; height: number; mime_type: string; source_url: string }>;
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
  _links: Record<string, unknown>;
}

export interface WPUser {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: Record<string, string>;
  meta: unknown[];
  _links: Record<string, unknown>;
}

export interface WPPage extends WPPost {
  // 页面特定的属性
}

export interface WPPortfolioItem {
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
  template: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
  acf?: {
    project_url?: string;
    client?: string;
    technologies?: string[];
    completion_date?: string;
    gallery?: string[];
  };
  _links: Record<string, unknown>;
}

/**
 * WordPress REST API 客户端类
 */
export class WordPressClient {
  private client: AxiosInstance;
  private config: WPConfig;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000; // 5分钟缓存

  constructor(config: WPConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: `${config.baseUrl}/${config.apiPath || 'wp-json/wp/v2'}`,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器 - 添加认证
    this.client.interceptors.request.use((config) => {
      if (this.config.auth) {
        config.auth = {
          username: this.config.auth.username,
          password: this.config.auth.password,
        };
      }
      return config;
    });

    // 响应拦截器 - 统一错误处理
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // 服务器响应错误
          throw new Error(error.response.data.message || 'API 请求失败');
        } else if (error.request) {
          // 网络错误
          throw new Error('网络连接失败，请检查网络设置');
        } else {
          // 请求配置错误
          throw new Error(error.message || '请求配置错误');
        }
      }
    );
  }

  /**
   * 通用 GET 请求方法（带缓存）
   */
  private async get<T>(endpoint: string, config?: AxiosRequestConfig, useCache = true): Promise<T> {
    const cacheKey = `${endpoint}?${JSON.stringify(config)}`;

    // 检查缓存
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data as T;
      }
    }

    const response = await this.client.get<T>(endpoint, config);

    // 缓存结果
    if (useCache) {
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response.data;
  }

  /**
   * 通用 POST 请求方法
   */
  private async post<T>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    // 清除相关缓存
    this.clearCache();

    const response = await this.client.post<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取文章列表
   */
  async getPosts(options?: {
    page?: number;
    perPage?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    exclude?: number[];
    include?: number[];
    order?: 'asc' | 'desc';
    orderBy?: 'date' | 'title' | 'slug' | 'modified';
    sticky?: boolean;
  }): Promise<WPPost[]> {
    const params = new URLSearchParams();

    if (options?.page) params.append('page', options.page.toString());
    if (options?.perPage) params.append('per_page', options.perPage.toString());
    if (options?.search) params.append('search', options.search);
    if (options?.categories) options.categories.forEach((c) => params.append('categories[]', c.toString()));
    if (options?.tags) options.tags.forEach((t) => params.append('tags[]', t.toString()));
    if (options?.exclude) options.exclude.forEach((e) => params.append('exclude[]', e.toString()));
    if (options?.include) options.include.forEach((i) => params.append('include[]', i.toString()));
    if (options?.order) params.append('order', options.order);
    if (options?.orderBy) params.append('orderby', options.orderBy);
    if (options?.sticky !== undefined) params.append('sticky', options.sticky.toString());

    const queryString = params.toString();
    return this.get<WPPost[]>(`/posts${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number): Promise<WPPost> {
    return this.get<WPPost>(`/posts/${id}`);
  }

  /**
   * 通过 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<WPPost> {
    const posts = await this.get<WPPost[]>(`/posts?slug=${slug}`);
    return posts[0];
  }

  /**
   * 获取分类列表
   */
  async getCategories(options?: {
    hideEmpty?: boolean;
    exclude?: number[];
    include?: number[];
  }): Promise<WPCategory[]> {
    const params = new URLSearchParams();
    if (options?.hideEmpty) params.append('hide_empty', 'true');
    if (options?.exclude) options.exclude.forEach((e) => params.append('exclude[]', e.toString()));
    if (options?.include) options.include.forEach((i) => params.append('include[]', i.toString()));

    const queryString = params.toString();
    return this.get<WPCategory[]>(`/categories${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WPCategory> {
    return this.get<WPCategory>(`/categories/${id}`);
  }

  /**
   * 获取标签列表
   */
  async getTags(options?: {
    hideEmpty?: boolean;
    exclude?: number[];
    include?: number[];
  }): Promise<WPTag[]> {
    const params = new URLSearchParams();
    if (options?.hideEmpty) params.append('hide_empty', 'true');
    if (options?.exclude) options.exclude.forEach((e) => params.append('exclude[]', e.toString()));
    if (options?.include) options.include.forEach((i) => params.append('include[]', i.toString()));

    const queryString = params.toString();
    return this.get<WPTag[]>(`/tags${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WPTag> {
    return this.get<WPTag>(`/tags/${id}`);
  }

  /**
   * 获取媒体
   */
  async getMedia(id: number): Promise<WPMedia> {
    return this.get<WPMedia>(`/media/${id}`);
  }

  /**
   * 获取用户
   */
  async getUser(id: number): Promise<WPUser> {
    return this.get<WPUser>(`/users/${id}`);
  }

  /**
   * 获取页面列表
   */
  async getPages(options?: {
    page?: number;
    perPage?: number;
    exclude?: number[];
    include?: number[];
    order?: 'asc' | 'desc';
    orderBy?: 'date' | 'title' | 'slug' | 'modified';
  }): Promise<WPPage[]> {
    const params = new URLSearchParams();

    if (options?.page) params.append('page', options.page.toString());
    if (options?.perPage) params.append('per_page', options.perPage.toString());
    if (options?.exclude) options.exclude.forEach((e) => params.append('exclude[]', e.toString()));
    if (options?.include) options.include.forEach((i) => params.append('include[]', i.toString()));
    if (options?.order) params.append('order', options.order);
    if (options?.orderBy) params.append('orderby', options.orderBy);

    const queryString = params.toString();
    return this.get<WPPage[]>(`/pages${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * 获取单个页面
   */
  async getPage(id: number): Promise<WPPage> {
    return this.get<WPPage>(`/pages/${id}`);
  }

  /**
   * 通过 slug 获取页面
   */
  async getPageBySlug(slug: string): Promise<WPPage> {
    const pages = await this.get<WPPage[]>(`/pages?slug=${slug}`);
    return pages[0];
  }

  /**
   * 获取评论列表
   */
  async getComments(options?: {
    post?: number;
    page?: number;
    perPage?: number;
    order?: 'asc' | 'desc';
  }): Promise<WPComment[]> {
    const params = new URLSearchParams();

    if (options?.post) params.append('post', options.post.toString());
    if (options?.page) params.append('page', options.page.toString());
    if (options?.perPage) params.append('per_page', options.perPage.toString());
    if (options?.order) params.append('order', options.order);

    const queryString = params.toString();
    return this.get<WPComment[]>(`/comments${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * 提交评论
   */
  async postComment(data: {
    post: number;
    author_name: string;
    author_email: string;
    content: string;
    parent?: number;
  }): Promise<WPComment> {
    return this.post<WPComment>('/comments', data);
  }

  /**
   * 搜索
   */
  async search(query: string, options?: {
    page?: number;
    perPage?: number;
    type?: string[];
    subtype?: string[];
  }): Promise<Array<WPPost | WPPage | WPMedia>> {
    const params = new URLSearchParams();
    params.append('search', query);

    if (options?.page) params.append('page', options.page.toString());
    if (options?.perPage) params.append('per_page', options.perPage.toString());
    if (options?.type) options.type.forEach((t) => params.append('type[]', t));
    if (options?.subtype) options.subtype.forEach((s) => params.append('subtype[]', s));

    const queryString = params.toString();
    return this.get<Array<WPPost | WPPage | WPMedia>>(`/search${queryString ? `?${queryString}` : ''}`, undefined, false);
  }

  /**
   * 获取作品集项目（自定义文章类型）
   */
  async getPortfolioItems(options?: {
    page?: number;
    perPage?: number;
    exclude?: number[];
    include?: number[];
    order?: 'asc' | 'desc';
    orderBy?: 'date' | 'title' | 'slug' | 'modified';
  }): Promise<WPPortfolioItem[]> {
    const params = new URLSearchParams();

    if (options?.page) params.append('page', options.page.toString());
    if (options?.perPage) params.append('per_page', options.perPage.toString());
    if (options?.exclude) options.exclude.forEach((e) => params.append('exclude[]', e.toString()));
    if (options?.include) options.include.forEach((i) => params.append('include[]', i.toString()));
    if (options?.order) params.append('order', options.order);
    if (options?.orderBy) params.append('orderby', options.orderBy);

    const queryString = params.toString();
    return this.get<WPPortfolioItem[]>(`/portfolio${queryString ? `?${queryString}` : ''}`);
  }

  /**
   * 获取单个作品集项目
   */
  async getPortfolioItem(id: number): Promise<WPPortfolioItem> {
    return this.get<WPPortfolioItem>(`/portfolio/${id}`);
  }

  /**
   * 通过 slug 获取作品集项目
   */
  async getPortfolioItemBySlug(slug: string): Promise<WPPortfolioItem> {
    const items = await this.get<WPPortfolioItem[]>(`/portfolio?slug=${slug}`);
    return items[0];
  }
}

/**
 * 创建 WordPress 客户端实例
 */
export function createWordPressClient(config: WPConfig): WordPressClient {
  return new WordPressClient(config);
}

/**
 * 默认客户端实例
 */
export const wpClient = new WordPressClient({
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
  timeout: 10000,
});

/**
 * React Query 键工厂
 */
export const wpKeys = {
  all: ['wordpress'] as const,
  posts: () => [...wpKeys.all, 'posts'] as const,
  post: (id: number) => [...wpKeys.posts(), id] as const,
  postBySlug: (slug: string) => [...wpKeys.posts(), 'slug', slug] as const,
  categories: () => [...wpKeys.all, 'categories'] as const,
  category: (id: number) => [...wpKeys.categories(), id] as const,
  tags: () => [...wpKeys.all, 'tags'] as const,
  tag: (id: number) => [...wpKeys.tags(), id] as const,
  pages: () => [...wpKeys.all, 'pages'] as const,
  page: (id: number) => [...wpKeys.pages(), id] as const,
  pageBySlug: (slug: string) => [...wpKeys.pages(), 'slug', slug] as const,
  comments: (postId?: number) => [...wpKeys.all, 'comments', postId] as const,
  media: (id: number) => [...wpKeys.all, 'media', id] as const,
  user: (id: number) => [...wpKeys.all, 'users', id] as const,
  portfolio: () => [...wpKeys.all, 'portfolio'] as const,
  portfolioItem: (id: number) => [...wpKeys.portfolio(), id] as const,
  portfolioItemBySlug: (slug: string) => [...wpKeys.portfolio(), 'slug', slug] as const,
  search: (query: string) => [...wpKeys.all, 'search', query] as const,
};
