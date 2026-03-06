/**
 * WordPress API 集成层
 * 提供与 WordPress REST API 的完整集成
 */

import { WordPressPost, wpPostToBlogCardData, BlogCardData } from '@/types/blog';

export interface WordPressConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  timeout?: number;
}

export interface WordPressSearchParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  orderby?: 'date' | 'relevance' | 'id' | 'title' | 'slug';
  order?: 'asc' | 'desc';
  sticky?: boolean;
  _embed?: boolean;
}

export class WordPressIntegration {
  private config: WordPressConfig;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  constructor(config: WordPressConfig) {
    this.config = {
      ...config,
      timeout: config.timeout || 10000,
    };
    this.cache = new Map();
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
  ): Promise<T> {
    const url = `${this.config.baseUrl}/wp-json/wp/v2/${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * 带缓存的请求
   */
  private async cachedRequest<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * 获取文章列表
   */
  async getPosts(params: WordPressSearchParams = {}): Promise<BlogCardData[]> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.orderby) queryParams.append('orderby', params.orderby);
    if (params.order) queryParams.append('order', params.order);
    if (params.sticky !== undefined) queryParams.append('sticky', params.sticky.toString());
    if (params.categories?.length) {
      params.categories.forEach(cat => queryParams.append('categories[]', cat.toString()));
    }
    if (params.tags?.length) {
      params.tags.forEach(tag => queryParams.append('tags[]', tag.toString()));
    }
    if (params.author) queryParams.append('author', params.author.toString());
    queryParams.append('_embed', 'true');

    const cacheKey = `posts-${queryParams.toString()}`;
    return this.cachedRequest(cacheKey, async () => {
      const posts: WordPressPost[] = await this.request(
        `posts?${queryParams.toString()}`
      );
      return posts.map(wpPostToBlogCardData);
    });
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string): Promise<BlogCardData | null> {
    try {
      const post: WordPressPost = await this.request(
        `posts/${id}?_embed=true`
      );
      return wpPostToBlogCardData(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  /**
   * 根据 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<BlogCardData | null> {
    try {
      const posts: WordPressPost[] = await this.request(
        `posts?slug=${slug}&_embed=true`
      );
      if (posts.length > 0) {
        return wpPostToBlogCardData(posts[0]);
      }
      return null;
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return null;
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<Array<{ id: number; name: string; slug: string; count: number }>> {
    const cacheKey = 'categories';
    return this.cachedRequest(cacheKey, () =>
      this.request('categories?per_page=100')
    );
  }

  /**
   * 获取标签列表
   */
  async getTags(): Promise<Array<{ id: number; name: string; slug: string; count: number }>> {
    const cacheKey = 'tags';
    return this.cachedRequest(cacheKey, () =>
      this.request('tags?per_page=100')
    );
  }

  /**
   * 获取作者列表
   */
  async getAuthors(): Promise<Array<{ id: number; name: string; slug: string; link: string }>> {
    const cacheKey = 'users';
    return this.cachedRequest(cacheKey, () =>
      this.request('users?per_page=100')
    );
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, page = 1, perPage = 10): Promise<BlogCardData[]> {
    return this.getPosts({
      search: query,
      page,
      per_page: perPage,
      orderby: 'relevance',
    });
  }

  /**
   * 获取置顶文章
   */
  async getStickyPosts(): Promise<BlogCardData[]> {
    return this.getPosts({
      sticky: true,
      per_page: 10,
    });
  }

  /**
   * 获取最新文章
   */
  async getLatestPosts(count = 10): Promise<BlogCardData[]> {
    return this.getPosts({
      per_page: count,
      orderby: 'date',
      order: 'desc',
    });
  }

  /**
   * 获取分类下的文章
   */
  async getPostsByCategory(categoryId: number, page = 1, perPage = 10): Promise<BlogCardData[]> {
    return this.getPosts({
      categories: [categoryId],
      page,
      per_page: perPage,
    });
  }

  /**
   * 获取标签下的文章
   */
  async getPostsByTag(tagId: number, page = 1, perPage = 10): Promise<BlogCardData[]> {
    return this.getPosts({
      tags: [tagId],
      page,
      per_page: perPage,
    });
  }

  /**
   * 获取作者的文章
   */
  async getPostsByAuthor(authorId: number, page = 1, perPage = 10): Promise<BlogCardData[]> {
    return this.getPosts({
      author: authorId,
      page,
      per_page: perPage,
    });
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 清除特定缓存
   */
  clearCacheByKey(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }
}

// 创建默认实例
export const createWordPressClient = (config: WordPressConfig) => {
  return new WordPressIntegration(config);
};

// 从环境变量创建客户端
export const createClientFromEnv = () => {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  const username = process.env.NEXT_PUBLIC_WORDPRESS_USERNAME;
  const password = process.env.NEXT_PUBLIC_WORDPRESS_PASSWORD;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_WORDPRESS_URL environment variable is required');
  }

  return createWordPressClient({
    baseUrl,
    username,
    password,
  });
};

// 默认客户端实例（延迟初始化）
let defaultClient: WordPressIntegration | null = null;

export const getWordPressClient = () => {
  if (!defaultClient) {
    defaultClient = createClientFromEnv();
  }
  return defaultClient;
};
