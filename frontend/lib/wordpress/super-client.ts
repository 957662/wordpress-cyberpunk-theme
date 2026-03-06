/**
 * WordPress REST API Super Client
 * 超级WordPress客户端 - 集成所有高级功能
 */

import axios, { AxiosInstance } from 'axios';

export interface WPSuperConfig {
  baseUrl: string;
  timeout?: number;
  enableCache?: boolean;
  cacheTimeout?: number;
  retries?: number;
}

export interface WPCacheItem {
  data: any;
  timestamp: number;
}

class WPSuperClient {
  private client: AxiosInstance;
  private cache: Map<string, WPCacheItem>;
  private config: Required<WPSuperConfig>;

  constructor(config: WPSuperConfig) {
    this.config = {
      timeout: 10000,
      enableCache: true,
      cacheTimeout: 5 * 60 * 1000,
      retries: 3,
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
    });

    this.cache = new Map();
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[WP API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;

        if (!config._retry && config._retryCount < this.config.retries) {
          config._retry = true;
          config._retryCount = config._retryCount || 0;
          config._retryCount++;

          const delay = Math.pow(2, config._retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));

          return this.client(config);
        }

        return Promise.reject(error);
      }
    );
  }

  async get<T>(endpoint: string, params?: any): Promise<T> {
    const cacheKey = `${endpoint}?${JSON.stringify(params || {})}`;

    // 检查缓存
    if (this.config.enableCache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
        console.log('[WP API] Cache hit:', cacheKey);
        return cached.data;
      }
    }

    const response = await this.client.get(endpoint, { params });

    // 存入缓存
    if (this.config.enableCache) {
      this.cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response.data;
  }

  clearCache() {
    this.cache.clear();
    console.log('[WP API] Cache cleared');
  }

  // Posts
  async getPosts(params?: any) {
    return this.get('/wp/v2/posts', params);
  }

  async getPost(id: number) {
    return this.get(`/wp/v2/posts/${id}`);
  }

  // Categories
  async getCategories(params?: any) {
    return this.get('/wp/v2/categories', params);
  }

  // Tags
  async getTags(params?: any) {
    return this.get('/wp/v2/tags', params);
  }

  // Media
  async getMedia(params?: any) {
    return this.get('/wp/v2/media', params);
  }

  // Comments
  async getComments(params?: any) {
    return this.get('/wp/v2/comments', params);
  }

  // Users
  async getUsers(params?: any) {
    return this.get('/wp/v2/users', params);
  }

  // Search
  async search(query: string, params?: any) {
    return this.get('/wp/v2/search', { search: query, ...params });
  }
}

// 创建默认实例
const wpSuperClient = new WPSuperClient({
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://demo.wp-api.org/wp-json',
});

export default wpSuperClient;
