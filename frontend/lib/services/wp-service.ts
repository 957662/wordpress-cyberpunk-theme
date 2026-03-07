/**
 * WordPress Service - Enhanced WordPress API Integration
 * 高级 WordPress API 服务层
 */

import { WordPressApiClient } from '../wordpress/api-client';
import type {
  WPPost,
  WPCategory,
  WPTag,
  WPPage,
  WPMedia,
  WPComment,
  WPUser,
} from '../wordpress/types';

export interface WordPressServiceConfig {
  baseUrl?: string;
  timeout?: number;
  cacheEnabled?: boolean;
  cacheTimeout?: number;
}

export interface PostsQueryParams {
  page?: number;
  perPage?: number;
  offset?: number;
  orderBy?: 'date' | 'relevance' | 'id' | 'title' | 'slug';
  order?: 'asc' | 'desc';
  categories?: number[];
  tags?: number[];
  exclude?: number[];
  include?: number[];
  search?: string;
  author?: number;
  status?: string;
  sticky?: boolean;
}

export interface SearchParams {
  search: string;
  page?: number;
  perPage?: number;
  type?: ('post' | 'page' | 'attachment')[];
  subtype?: string[];
}

export class WordPressService {
  private client: WordPressApiClient;
  private cache: Map<string, { data: any; timestamp: number }>;
  private config: Required<WordPressServiceConfig>;

  constructor(config: WordPressServiceConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
      timeout: config.timeout || 30000,
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTimeout: config.cacheTimeout || 300000, // 5 minutes
    };

    this.client = new WordPressApiClient(this.config.baseUrl);
    this.cache = new Map();
  }

  /**
   * 获取缓存或请求新数据
   */
  private async getWithCache<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    if (!this.config.cacheEnabled) {
      return fetcher();
    }

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
      return cached.data as T;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  /**
   * 清除缓存
   */
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * 获取文章列表
   */
  async getPosts(params: PostsQueryParams = {}): Promise<{
    posts: WPPost[];
    total: number;
    totalPages: number;
  }> {
    const cacheKey = `posts-${JSON.stringify(params)}`;

    return this.getWithCache(cacheKey, async () => {
      const response = await this.client.get('/wp/v2/posts', {
        params: {
          page: params.page || 1,
          per_page: params.perPage || 10,
          offset: params.offset,
          orderby: params.orderBy || 'date',
          order: params.order || 'desc',
          categories: params.categories?.join(','),
          tags: params.tags?.join(','),
          exclude: params.exclude?.join(','),
          include: params.include?.join(','),
          search: params.search,
          author: params.author,
          status: params.status || 'publish',
          sticky: params.sticky,
        },
      });

      return {
        posts: response.data,
        total: parseInt(response.headers['x-wp-total'] || '0', 10),
        totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10),
      };
    });
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string, params?: {
    password?: string;
  }): Promise<WPPost> {
    return this.client.get(`/wp/v2/posts/${id}`, {
      params: { password: params?.password },
    }).then(res => res.data);
  }

  /**
   * 获取分类列表
   */
  async getCategories(params?: {
    page?: number;
    perPage?: number;
    hideEmpty?: boolean;
    include?: number[];
    exclude?: number[];
  }): Promise<WPCategory[]> {
    const cacheKey = `categories-${JSON.stringify(params)}`;

    return this.getWithCache(cacheKey, () =>
      this.client.get('/wp/v2/categories', {
        params: {
          page: params?.page || 1,
          per_page: params?.perPage || 100,
          hide_empty: params?.hideEmpty ?? true,
          include: params?.include?.join(','),
          exclude: params?.exclude?.join(','),
        },
      }).then(res => res.data)
    );
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WPCategory> {
    return this.client.get(`/wp/v2/categories/${id}`)
      .then(res => res.data);
  }

  /**
   * 获取标签列表
   */
  async getTags(params?: {
    page?: number;
    perPage?: number;
    hideEmpty?: boolean;
    include?: number[];
    exclude?: number[];
  }): Promise<WPTag[]> {
    const cacheKey = `tags-${JSON.stringify(params)}`;

    return this.getWithCache(cacheKey, () =>
      this.client.get('/wp/v2/tags', {
        params: {
          page: params?.page || 1,
          per_page: params?.perPage || 100,
          hide_empty: params?.hideEmpty ?? true,
          include: params?.include?.join(','),
          exclude: params?.exclude?.join(','),
        },
      }).then(res => res.data)
    );
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WPTag> {
    return this.client.get(`/wp/v2/tags/${id}`)
      .then(res => res.data);
  }

  /**
   * 获取评论列表
   */
  async getComments(params?: {
    page?: number;
    perPage?: number;
    post?: number;
    parent?: number[];
    author?: number[];
  }): Promise<{
    comments: WPComment[];
    total: number;
    totalPages: number;
  }> {
    const response = await this.client.get('/wp/v2/comments', {
      params: {
        page: params?.page || 1,
        per_page: params?.perPage || 10,
        post: params?.post,
        parent: params?.parent?.join(','),
        author: params?.author?.join(','),
      },
    });

    return {
      comments: response.data,
      total: parseInt(response.headers['x-wp-total'] || '0', 10),
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10),
    };
  }

  /**
   * 提交评论
   */
  async createComment(
    postId: number,
    content: string,
    author: {
      name: string;
      email: string;
      url?: string;
    },
    parentId?: number
  ): Promise<WPComment> {
    return this.client.post(`/wp/v2/comments`, {
      post: postId,
      content,
      author_name: author.name,
      author_email: author.email,
      author_url: author.url,
      parent: parentId,
    }).then(res => res.data);
  }

  /**
   * 搜索内容
   */
  async search(params: SearchParams): Promise<{
    results: Array<WPPost | WPPage | WPMedia>;
    total: number;
  }> {
    const cacheKey = `search-${JSON.stringify(params)}`;

    return this.getWithCache(cacheKey, async () => {
      const response = await this.client.get('/wp/v2/search', {
        params: {
          search: params.search,
          page: params.page || 1,
          per_page: params.perPage || 10,
          type: params.type?.join(',') || 'post',
          subtype: params.subtype?.join(','),
        },
      });

      return {
        results: response.data,
        total: parseInt(response.headers['x-wp-total'] || '0', 10),
      };
    });
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

// 导出单例实例
export const wpService = new WordPressService();

// 导出类型
export type { PostsQueryParams, SearchParams };
