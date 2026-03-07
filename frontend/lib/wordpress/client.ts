/**
 * WordPress REST API Client
 *
 * Enhanced WordPress API client with caching, retry logic, and error handling
 */

import wordpressConfig from './config';
import type {
  WPPost,
  WPCategory,
  WPTag,
  WPUser,
  WPMedia,
  WPComment,
  WPSearchResult,
  WPPostParams,
  WPCategoryParams,
  WPTagParams,
  WPUserParams,
  WPApiCollectionResponse,
  WPApiResponse,
} from '@/types/wordpress';

export class WordPressClient {
  private baseUrl: string;
  private apiVersion: string;
  private timeout: number;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheExpiry: number;

  constructor(config: typeof wordpressConfig = wordpressConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiVersion = config.apiVersion;
    this.timeout = config.timeout;
    this.cache = new Map();
    this.cacheExpiry = config.cacheTimeout;
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${this.apiVersion}${endpoint}`;
  }

  private buildQuery(params: Record<string, any>): string {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => query.append(key, String(v)));
        } else {
          query.append(key, String(value));
        }
      }
    });
    return query.toString() ? `?${query.toString()}` : '';
  }

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    return `${endpoint}?${JSON.stringify(params || {})}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheExpiry;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<WPApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        data,
        headers,
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    useCache: boolean = true
  ): Promise<WPApiResponse<T>> {
    const query = params ? this.buildQuery(params) : '';
    const cacheKey = this.getCacheKey(endpoint, params);

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (this.isCacheValid(cached.timestamp)) {
        return cached.data;
      }
    }

    const result = await this.request<T>(`${endpoint}${query}`, {
      method: 'GET',
    });

    if (useCache) {
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
    }

    return result;
  }

  public clearCache(endpoint?: string): void {
    if (endpoint) {
      const keys = Array.from(this.cache.keys()).filter(key => key.startsWith(endpoint));
      keys.forEach(key => this.cache.delete(key));
    } else {
      this.cache.clear();
    }
  }

  async getPosts(params?: WPPostParams): Promise<WPApiCollectionResponse<WPPost>> {
    return this.get<WPPost[]>('/posts', {
      ...params,
      _embed: params?._embed !== false,
    }) as Promise<WPApiCollectionResponse<WPPost>>;
  }

  async getPost(idOrSlug: string | number, params?: WPPostParams): Promise<WPApiResponse<WPPost>> {
    return this.get<WPPost>(`/posts/${idOrSlug}`, {
      ...params,
      _embed: params?._embed !== false,
    });
  }

  async getCategories(params?: WPCategoryParams): Promise<WPApiCollectionResponse<WPCategory>> {
    return this.get<WPCategory[]>('/categories', params) as Promise<WPApiCollectionResponse<WPCategory>>;
  }

  async getCategory(idOrSlug: string | number): Promise<WPApiResponse<WPCategory>> {
    return this.get<WPCategory>(`/categories/${idOrSlug}`);
  }

  async getTags(params?: WPTagParams): Promise<WPApiCollectionResponse<WPTag>> {
    return this.get<WPTag[]>('/tags', params) as Promise<WPApiCollectionResponse<WPTag>>;
  }

  async getTag(idOrSlug: string | number): Promise<WPApiResponse<WPTag>> {
    return this.get<WPTag>(`/tags/${idOrSlug}`);
  }

  async getUsers(params?: WPUserParams): Promise<WPApiCollectionResponse<WPUser>> {
    return this.get<WPUser[]>('/users', params) as Promise<WPApiCollectionResponse<WPUser>>;
  }

  async getUser(id: number): Promise<WPApiResponse<WPUser>> {
    return this.get<WPUser>(`/users/${id}`);
  }

  async getMedia(id: number): Promise<WPApiResponse<WPMedia>> {
    return this.get<WPMedia>(`/media/${id}`, undefined, false);
  }

  async getComments(postId: number, params?: {
    page?: number;
    per_page?: number;
    order?: 'asc' | 'desc';
  }): Promise<WPApiCollectionResponse<WPComment>> {
    return this.get<WPComment[]>('/comments', {
      post: postId,
      ...params,
    }) as Promise<WPApiCollectionResponse<WPComment>>;
  }

  async search(query: string, params?: {
    page?: number;
    per_page?: number;
    type?: string[];
  }): Promise<WPApiCollectionResponse<WPSearchResult>> {
    return this.get<WPSearchResult[]>('/search', {
      search: query,
      ...params,
    }) as Promise<WPApiCollectionResponse<WPSearchResult>>;
  }
}

export const wordpressClient = new WordPressClient();
export default wordpressClient;
