/**
 * WordPress REST API Client
 *
 * A type-safe client for WordPress REST API
 */

import wordpressConfig from './wordpress-config';
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
  WPMediaParams,
  WPApiCollectionResponse,
  WPApiResponse,
} from '@/types/wordpress';

/**
 * WordPress API Client
 */
export class WordPressClient {
  private baseUrl: string;
  private apiVersion: string;
  private timeout: number;

  constructor(config: typeof wordpressConfig = wordpressConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiVersion = config.apiVersion;
    this.timeout = config.timeout;
  }

  /**
   * Build full API endpoint URL
   */
  private buildUrl(endpoint: string): string {
    return `${this.baseUrl}/${this.apiVersion}${endpoint}`;
  }

  /**
   * Build query string from parameters
   */
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

    const queryString = query.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Make API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<WPApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
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

  /**
   * GET request
   */
  private async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<WPApiResponse<T>> {
    const query = params ? this.buildQuery(params) : '';
    return this.request<T>(`${endpoint}${query}`, {
      method: 'GET',
    });
  }

  /**
   * Get posts
   */
  async getPosts(params?: WPPostParams): Promise<WPApiCollectionResponse<WPPost>> {
    return this.get<WPPost[]>('/posts', {
      ...params,
      _embed: params?._embed || true,
    }) as Promise<WPApiCollectionResponse<WPPost>>;
  }

  /**
   * Get a single post
   */
  async getPost(idOrSlug: string | number, params?: WPPostParams): Promise<WPApiResponse<WPPost>> {
    const endpoint = `/posts/${idOrSlug}`;
    return this.get<WPPost>(endpoint, {
      ...params,
      _embed: params?._embed || true,
    });
  }

  /**
   * Get categories
   */
  async getCategories(params?: WPCategoryParams): Promise<WPApiCollectionResponse<WPCategory>> {
    return this.get<WPCategory[]>('/categories', params) as Promise<WPApiCollectionResponse<WPCategory>>;
  }

  /**
   * Get a single category
   */
  async getCategory(idOrSlug: string | number): Promise<WPApiResponse<WPCategory>> {
    return this.get<WPCategory>(`/categories/${idOrSlug}`);
  }

  /**
   * Get tags
   */
  async getTags(params?: WPTagParams): Promise<WPApiCollectionResponse<WPTag>> {
    return this.get<WPTag[]>('/tags', params) as Promise<WPApiCollectionResponse<WPTag>>;
  }

  /**
   * Get a single tag
   */
  async getTag(idOrSlug: string | number): Promise<WPApiResponse<WPTag>> {
    return this.get<WPTag>(`/tags/${idOrSlug}`);
  }

  /**
   * Get users
   */
  async getUsers(params?: WPUserParams): Promise<WPApiCollectionResponse<WPUser>> {
    return this.get<WPUser[]>('/users', params) as Promise<WPApiCollectionResponse<WPUser>>;
  }

  /**
   * Get a single user
   */
  async getUser(id: number): Promise<WPApiResponse<WPUser>> {
    return this.get<WPUser>(`/users/${id}`);
  }

  /**
   * Get media
   */
  async getMedia(id: number): Promise<WPApiResponse<WPMedia>> {
    return this.get<WPMedia>(`/media/${id}`);
  }

  /**
   * Get comments for a post
   */
  async getComments(postId: number, params?: {
    page?: number;
    per_page?: number;
    order?: 'asc' | 'desc';
    orderby?: 'date' | 'date_gmt' | 'id' | 'post' | 'parent' | 'type';
  }): Promise<WPApiCollectionResponse<WPComment>> {
    return this.get<WPComment[]>(`/comments`, {
      post: postId,
      ...params,
    }) as Promise<WPApiCollectionResponse<WPComment>>;
  }

  /**
   * Search
   */
  async search(query: string, params?: {
    page?: number;
    per_page?: number;
    type?: string[];
    subtype?: string[];
  }): Promise<WPApiCollectionResponse<WPSearchResult>> {
    return this.get<WPSearchResult[]>('/search', {
      search: query,
      ...params,
    }) as Promise<WPApiCollectionResponse<WPSearchResult>>;
  }

  /**
   * Get post revisions
   */
  async getRevisions(postId: number): Promise<WPApiCollectionResponse<any>> {
    return this.get<any[]>(`/posts/${postId}/revisions`) as Promise<WPApiCollectionResponse<any>>;
  }

  /**
   * Get post categories
   */
  async getPostCategories(postId: number): Promise<WPApiResponse<WPCategory[]>> {
    return this.get<WPCategory[]>(`/posts/${postId}/categories`);
  }

  /**
   * Get post tags
   */
  async getPostTags(postId: number): Promise<WPApiResponse<WPTag[]>> {
    return this.get<WPTag[]>(`/posts/${postId}/tags`);
  }

  /**
   * Get posts by category
   */
  async getPostsByCategory(categoryId: number, params?: WPPostParams): Promise<WPApiCollectionResponse<WPPost>> {
    return this.getPosts({
      ...params,
      categories: categoryId,
    });
  }

  /**
   * Get posts by tag
   */
  async getPostsByTag(tagId: number, params?: WPPostParams): Promise<WPApiCollectionResponse<WPPost>> {
    return this.getPosts({
      ...params,
      tags: tagId,
    });
  }

  /**
   * Get posts by author
   */
  async getPostsByAuthor(authorId: number, params?: WPPostParams): Promise<WPApiCollectionResponse<WPPost>> {
    return this.getPosts({
      ...params,
      author: authorId,
    });
  }
}

/**
 * Create singleton instance
 */
export const wordpressClient = new WordPressClient();

/**
 * Export client instance as default
 */
export default wordpressClient;
