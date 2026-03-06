/**
 * 统一的博客 API 服务
 * 整合所有博客相关的 API 调用
 */

import { wordpressApi } from '../wordpress-api';

// ==================== 类型定义 ====================

export interface WordPressPost {
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
  _links: any;
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
  _links: any;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: { [key: string]: string };
  _links: any;
}

export interface WordPressMedia {
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
  source_url: string;
  _links: any;
}

export interface BlogListParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  orderby?: 'date' | 'modified' | 'title' | 'relevance';
  order?: 'asc' | 'desc';
  sticky?: boolean;
}

export interface BlogListResponse {
  posts: WordPressPost[];
  totalPages: number;
  totalPosts: number;
}

// ==================== Blog API 服务类 ====================

class BlogApiService {
  private baseUrl: string;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTimeout: number = 5 * 60 * 1000; // 5分钟缓存

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
    this.cache = new Map();
  }

  /**
   * 获取缓存键
   */
  private getCacheKey(endpoint: string, params?: any): string {
    return `${endpoint}?${JSON.stringify(params || {})}`;
  }

  /**
   * 获取缓存数据
   */
  private getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  /**
   * 设置缓存
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取文章列表
   */
  async getPosts(params: BlogListParams = {}): Promise<BlogListResponse> {
    try {
      const queryParams: any = {
        page: params.page || 1,
        per_page: params.per_page || 10,
        orderby: params.orderby || 'date',
        order: params.order || 'desc',
        _embed: true,
      };

      if (params.search) {
        queryParams.search = params.search;
      }

      if (params.categories && params.categories.length > 0) {
        queryParams.categories = params.categories.join(',');
      }

      if (params.tags && params.tags.length > 0) {
        queryParams.tags = params.tags.join(',');
      }

      if (params.author) {
        queryParams.author = params.author;
      }

      if (params.sticky !== undefined) {
        queryParams.sticky = params.sticky;
      }

      const cacheKey = this.getCacheKey('/posts', queryParams);
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.baseUrl}/posts?${new URLSearchParams(queryParams)}`);

      if (!response.ok) {
        throw new Error(`获取文章列表失败: ${response.statusText}`);
      }

      const posts: WordPressPost[] = await response.json();

      // 获取总数
      const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0', 10);
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);

      const result = {
        posts,
        totalPages,
        totalPosts,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('获取文章列表出错:', error);
      throw error;
    }
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string): Promise<WordPressPost> {
    try {
      const cacheKey = this.getCacheKey(`/posts/${id}`);
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.baseUrl}/posts/${id}?_embed`);

      if (!response.ok) {
        throw new Error(`获取文章失败: ${response.statusText}`);
      }

      const post: WordPressPost = await response.json();
      this.setCache(cacheKey, post);
      return post;
    } catch (error) {
      console.error('获取文章出错:', error);
      throw error;
    }
  }

  /**
   * 根据 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<WordPressPost> {
    try {
      const cacheKey = this.getCacheKey('/posts', { slug });
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.baseUrl}/posts?slug=${slug}&_embed`);

      if (!response.ok) {
        throw new Error(`获取文章失败: ${response.statusText}`);
      }

      const posts: WordPressPost[] = await response.json();

      if (posts.length === 0) {
        throw new Error('文章不存在');
      }

      const post = posts[0];
      this.setCache(cacheKey, post);
      return post;
    } catch (error) {
      console.error('获取文章出错:', error);
      throw error;
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories(params: { page?: number; per_page?: number } = {}): Promise<WordPressCategory[]> {
    try {
      const queryParams: any = {
        page: params.page || 1,
        per_page: params.per_page || 100,
      };

      const cacheKey = this.getCacheKey('/categories', queryParams);
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.baseUrl}/categories?${new URLSearchParams(queryParams)}`);

      if (!response.ok) {
        throw new Error(`获取分类失败: ${response.statusText}`);
      }

      const categories: WordPressCategory[] = await response.json();
      this.setCache(cacheKey, categories);
      return categories;
    } catch (error) {
      console.error('获取分类出错:', error);
      throw error;
    }
  }

  /**
   * 获取标签列表
   */
  async getTags(params: { page?: number; per_page?: number } = {}): Promise<WordPressTag[]> {
    try {
      const queryParams: any = {
        page: params.page || 1,
        per_page: params.per_page || 100,
      };

      const cacheKey = this.getCacheKey('/tags', queryParams);
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.baseUrl}/tags?${new URLSearchParams(queryParams)}`);

      if (!response.ok) {
        throw new Error(`获取标签失败: ${response.statusText}`);
      }

      const tags: WordPressTag[] = await response.json();
      this.setCache(cacheKey, tags);
      return tags;
    } catch (error) {
      console.error('获取标签出错:', error);
      throw error;
    }
  }

  /**
   * 获取作者信息
   */
  async getAuthor(id: number): Promise<WordPressAuthor> {
    try {
      const cacheKey = this.getCacheKey(`/users/${id}`);
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.baseUrl}/users/${id}`);

      if (!response.ok) {
        throw new Error(`获取作者失败: ${response.statusText}`);
      }

      const author: WordPressAuthor = await response.json();
      this.setCache(cacheKey, author);
      return author;
    } catch (error) {
      console.error('获取作者出错:', error);
      throw error;
    }
  }

  /**
   * 获取媒体文件
   */
  async getMedia(id: number): Promise<WordPressMedia> {
    try {
      const cacheKey = this.getCacheKey(`/media/${id}`);
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const response = await fetch(`${this.baseUrl}/media/${id}`);

      if (!response.ok) {
        throw new Error(`获取媒体失败: ${response.statusText}`);
      }

      const media: WordPressMedia = await response.json();
      this.setCache(cacheKey, media);
      return media;
    } catch (error) {
      console.error('获取媒体出错:', error);
      throw error;
    }
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params: Omit<BlogListParams, 'search'> = {}): Promise<BlogListResponse> {
    return this.getPosts({ ...params, search: query });
  }

  /**
   * 获取相关文章（根据标签或分类）
   */
  async getRelatedPosts(
    postId: number,
    categories?: number[],
    tags?: number[],
    limit: number = 4
  ): Promise<WordPressPost[]> {
    try {
      // 优先使用标签查找相关文章
      if (tags && tags.length > 0) {
        const result = await this.getPosts({
          tags: [tags[0]],
          per_page: limit + 1, // 多获取一个，因为可能包含当前文章
        });

        // 过滤掉当前文章
        return result.posts.filter(post => post.id !== postId).slice(0, limit);
      }

      // 如果没有标签，使用分类
      if (categories && categories.length > 0) {
        const result = await this.getPosts({
          categories: [categories[0]],
          per_page: limit + 1,
        });

        return result.posts.filter(post => post.id !== postId).slice(0, limit);
      }

      // 如果都没有，返回最新文章
      const result = await this.getPosts({ per_page: limit });
      return result.posts.filter(post => post.id !== postId).slice(0, limit);
    } catch (error) {
      console.error('获取相关文章出错:', error);
      return [];
    }
  }

  /**
   * 获取置顶文章
   */
  async getStickyPosts(limit: number = 5): Promise<WordPressPost[]> {
    try {
      const cacheKey = this.getCacheKey('/posts', { sticky: true, limit });
      const cached = this.getCache(cacheKey);
      if (cached) {
        return cached;
      }

      const result = await this.getPosts({
        sticky: true,
        per_page: limit,
      });

      this.setCache(cacheKey, result.posts);
      return result.posts;
    } catch (error) {
      console.error('获取置顶文章出错:', error);
      return [];
    }
  }

  /**
   * 获取最新文章
   */
  async getLatestPosts(limit: number = 10): Promise<WordPressPost[]> {
    try {
      const result = await this.getPosts({
        per_page: limit,
        orderby: 'date',
        order: 'desc',
      });
      return result.posts;
    } catch (error) {
      console.error('获取最新文章出错:', error);
      return [];
    }
  }

  /**
   * 获取热门文章（基于评论数或浏览量，如果 WP 支持的话）
   */
  async getPopularPosts(limit: number = 10): Promise<WordPressPost[]> {
    try {
      // WordPress 默认不支持按浏览量排序
      // 这里返回最新文章作为备选
      const result = await this.getPosts({
        per_page: limit,
        orderby: 'date',
        order: 'desc',
      });
      return result.posts;
    } catch (error) {
      console.error('获取热门文章出错:', error);
      return [];
    }
  }
}

// ==================== 导出单例 ====================

export const blogApiService = new BlogApiService();

// ==================== 导出便捷函数 ====================

export const getPosts = (params?: BlogListParams) => blogApiService.getPosts(params);
export const getPost = (id: number | string) => blogApiService.getPost(id);
export const getPostBySlug = (slug: string) => blogApiService.getPostBySlug(slug);
export const getCategories = (params?: { page?: number; per_page?: number }) =>
  blogApiService.getCategories(params);
export const getTags = (params?: { page?: number; per_page?: number }) =>
  blogApiService.getTags(params);
export const getAuthor = (id: number) => blogApiService.getAuthor(id);
export const getMedia = (id: number) => blogApiService.getMedia(id);
export const searchPosts = (query: string, params?: Omit<BlogListParams, 'search'>) =>
  blogApiService.searchPosts(query, params);
export const getRelatedPosts = (
  postId: number,
  categories?: number[],
  tags?: number[],
  limit?: number
) => blogApiService.getRelatedPosts(postId, categories, tags, limit);
export const getStickyPosts = (limit?: number) => blogApiService.getStickyPosts(limit);
export const getLatestPosts = (limit?: number) => blogApiService.getLatestPosts(limit);
export const getPopularPosts = (limit?: number) => blogApiService.getPopularPosts(limit);
export const clearBlogCache = () => blogApiService.clearCache();

export default blogApiService;
