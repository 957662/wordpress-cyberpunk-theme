/**
 * Post Service
 * 文章服务 - 处理所有文章相关的业务逻辑
 */

import { wpApi } from '../api/wordpress-api';
import type { Post, Category, Tag, Author } from '@/types';

export interface PostQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: number[];
  tags?: number[];
  author?: number;
  orderby?: 'date' | 'title' | 'modified' | 'comment_count';
  order?: 'asc' | 'desc';
  status?: 'publish' | 'draft' | 'pending';
}

export interface PaginatedPostsResponse {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
}

class PostService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * 获取文章列表（带分页）
   */
  async getPosts(params: PostQueryParams = {}): Promise<PaginatedPostsResponse> {
    try {
      const queryParams = {
        page: params.page || 1,
        per_page: params.per_page || 10,
        search: params.search,
        categories: params.categories?.join(','),
        tags: params.tags?.join(','),
        author: params.author,
        orderby: params.orderby || 'date',
        order: params.order || 'desc',
        status: params.status || 'publish',
        _embed: true, // 包含关联数据
      };

      const cacheKey = `posts-${JSON.stringify(queryParams)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await wpApi.get('/posts', { params: queryParams });
      const total = parseInt(response.headers['x-wp-total'] || '0', 10);
      const totalPages = parseInt(response.headers['x-wp-totalpages'] || '0', 10);

      const result = {
        posts: response.data,
        total,
        totalPages,
        currentPage: params.page || 1,
      };

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error('Failed to fetch posts');
    }
  }

  /**
   * 根据 slug 获取单篇文章
   */
  async getPostBySlug(slug: string): Promise<Post> {
    try {
      const cacheKey = `post-${slug}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await wpApi.get('/posts', {
        params: { slug, _embed: true },
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('Post not found');
      }

      const post = response.data[0];
      this.setCache(cacheKey, post);
      return post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch post');
    }
  }

  /**
   * 根据 ID 获取单篇文章
   */
  async getPostById(id: number): Promise<Post> {
    try {
      const cacheKey = `post-${id}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await wpApi.get(`/posts/${id}`, {
        params: { _embed: true },
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw new Error('Failed to fetch post');
    }
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<Category[]> {
    try {
      const cacheKey = 'categories';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await wpApi.get('/categories', {
        params: { per_page: 100 },
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Failed to fetch categories');
    }
  }

  /**
   * 获取标签列表
   */
  async getTags(): Promise<Tag[]> {
    try {
      const cacheKey = 'tags';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await wpApi.get('/tags', {
        params: { per_page: 100 },
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw new Error('Failed to fetch tags');
    }
  }

  /**
   * 获取作者列表
   */
  async getAuthors(): Promise<Author[]> {
    try {
      const cacheKey = 'authors';
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await wpApi.get('/users', {
        params: { per_page: 100 },
      });

      this.setCache(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching authors:', error);
      throw new Error('Failed to fetch authors');
    }
  }

  /**
   * 根据分类获取文章
   */
  async getPostsByCategory(
    categoryId: number,
    params: Omit<PostQueryParams, 'categories'> = {}
  ): Promise<PaginatedPostsResponse> {
    return this.getPosts({ ...params, categories: [categoryId] });
  }

  /**
   * 根据标签获取文章
   */
  async getPostsByTag(
    tagId: number,
    params: Omit<PostQueryParams, 'tags'> = {}
  ): Promise<PaginatedPostsResponse> {
    return this.getPosts({ ...params, tags: [tagId] });
  }

  /**
   * 根据作者获取文章
   */
  async getPostsByAuthor(
    authorId: number,
    params: Omit<PostQueryParams, 'author'> = {}
  ): Promise<PaginatedPostsResponse> {
    return this.getPosts({ ...params, author: authorId });
  }

  /**
   * 搜索文章
   */
  async searchPosts(
    query: string,
    params: Omit<PostQueryParams, 'search'> = {}
  ): Promise<PaginatedPostsResponse> {
    if (!query.trim()) {
      return this.getPosts(params);
    }
    return this.getPosts({ ...params, search: query });
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(
    postId: number,
    categories?: number[],
    tags?: number[]
  ): Promise<Post[]> {
    try {
      const params: PostQueryParams = {
        per_page: 4,
        exclude: [postId],
        orderby: 'rand',
      };

      if (categories && categories.length > 0) {
        params.categories = categories;
      } else if (tags && tags.length > 0) {
        params.tags = tags;
      }

      const { posts } = await this.getPosts(params);
      return posts;
    } catch (error) {
      console.error('Error fetching related posts:', error);
      return [];
    }
  }

  /**
   * 获取最新文章
   */
  async getLatestPosts(limit: number = 5): Promise<Post[]> {
    try {
      const cacheKey = `latest-posts-${limit}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const { posts } = await this.getPosts({
        per_page: limit,
        orderby: 'date',
        order: 'desc',
      });

      this.setCache(cacheKey, posts);
      return posts;
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      return [];
    }
  }

  /**
   * 获取热门文章（按评论数）
   */
  async getPopularPosts(limit: number = 5): Promise<Post[]> {
    try {
      const cacheKey = `popular-posts-${limit}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const { posts } = await this.getPosts({
        per_page: limit,
        orderby: 'comment_count',
        order: 'desc',
      });

      this.setCache(cacheKey, posts);
      return posts;
    } catch (error) {
      console.error('Error fetching popular posts:', error);
      return [];
    }
  }

  /**
   * 缓存管理
   */
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
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
  clearCacheByKey(key: string): void {
    this.cache.delete(key);
  }
}

// 导出单例
export const postService = new PostService();
export default postService;
