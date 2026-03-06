/**
 * WordPress REST API 完整客户端
 * 包含媒体、用户、评论等完整功能
 */

import { WordPressClientConfig, Post, Category, Tag, Author, Comment, Media } from './types';

class WordPressClient {
  private baseUrl: string;
  private perPage: number;
  private timeout: number;

  constructor(config: WordPressClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // 移除尾部斜杠
    this.perPage = config.perPage || 10;
    this.timeout = config.timeout || 10000;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // ==================== 文章相关 ====================

  /**
   * 获取文章列表
   */
  async getPosts(options: {
    page?: number;
    perPage?: number;
    category?: number;
    tag?: number;
    search?: string;
    author?: number;
    orderBy?: 'date' | 'title' | 'relevance';
    order?: 'asc' | 'desc';
    status?: string;
  } = {}): Promise<Post[]> {
    const params = new URLSearchParams();

    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // 转换 camelCase 到 snake_case
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        params.append(snakeKey, value.toString());
      }
    });

    if (!options.perPage) {
      params.append('per_page', this.perPage.toString());
    }

    return this.request<Post[]>(`/wp/v2/posts?${params}`);
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string): Promise<Post> {
    return this.request<Post>(`/wp/v2/posts/${id}`);
  }

  /**
   * 通过 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<Post> {
    const posts = await this.request<Post[]>(`/wp/v2/posts?slug=${slug}`);
    return posts[0];
  }

  // ==================== 分类相关 ====================

  /**
   * 获取分类列表
   */
  async getCategories(options: {
    page?: number;
    perPage?: number;
    hideEmpty?: boolean;
  } = {}): Promise<Category[]> {
    const params = new URLSearchParams();

    if (options.page) params.append('page', options.page.toString());
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.hideEmpty) params.append('hide_empty', '1');

    return this.request<Category[]>(`/wp/v2/categories?${params}`);
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<Category> {
    return this.request<Category>(`/wp/v2/categories/${id}`);
  }

  // ==================== 标签相关 ====================

  /**
   * 获取标签列表
   */
  async getTags(options: {
    page?: number;
    perPage?: number;
    hideEmpty?: boolean;
  } = {}): Promise<Tag[]> {
    const params = new URLSearchParams();

    if (options.page) params.append('page', options.page.toString());
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.hideEmpty) params.append('hide_empty', '1');

    return this.request<Tag[]>(`/wp/v2/tags?${params}`);
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<Tag> {
    return this.request<Tag>(`/wp/v2/tags/${id}`);
  }

  // ==================== 作者相关 ====================

  /**
   * 获取作者列表
   */
  async getAuthors(options: {
    page?: number;
    perPage?: number;
  } = {}): Promise<Author[]> {
    const params = new URLSearchParams();

    if (options.page) params.append('page', options.page.toString());
    if (options.perPage) params.append('per_page', options.perPage.toString());

    return this.request<Author[]>(`/wp/v2/users?${params}`);
  }

  /**
   * 获取单个作者
   */
  async getAuthor(id: number): Promise<Author> {
    return this.request<Author>(`/wp/v2/users/${id}`);
  }

  // ==================== 评论相关 ====================

  /**
   * 获取评论列表
   */
  async getComments(postId: number, options: {
    page?: number;
    perPage?: number;
  } = {}): Promise<Comment[]> {
    const params = new URLSearchParams();
    params.append('post', postId.toString());

    if (options.page) params.append('page', options.page.toString());
    if (options.perPage) params.append('per_page', options.perPage.toString());

    return this.request<Comment[]>(`/wp/v2/comments?${params}`);
  }

  /**
   * 获取单条评论
   */
  async getComment(id: number): Promise<Comment> {
    return this.request<Comment>(`/wp/v2/comments/${id}`);
  }

  /**
   * 创建评论
   */
  async createComment(postId: number, comment: {
    author: string;
    authorEmail: string;
    content: string;
    parentId?: number;
  }): Promise<Comment> {
    return this.request<Comment>(`/wp/v2/comments`, {
      method: 'POST',
      body: JSON.stringify({
        post: postId,
        author_name: comment.author,
        author_email: comment.authorEmail,
        content: comment.content,
        parent: comment.parentId || 0,
      }),
    });
  }

  // ==================== 媒体相关 ====================

  /**
   * 获取媒体文件
   */
  async getMedia(id: number): Promise<Media> {
    return this.request<Media>(`/wp/v2/media/${id}`);
  }

  /**
   * 获取媒体列表
   */
  async getMediaList(options: {
    page?: number;
    perPage?: number;
    search?: string;
  } = {}): Promise<Media[]> {
    const params = new URLSearchParams();

    if (options.page) params.append('page', options.page.toString());
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.search) params.append('search', options.search);

    return this.request<Media[]>(`/wp/v2/media?${params}`);
  }

  // ==================== 搜索相关 ====================

  /**
   * 搜索
   */
  async search(query: string, options: {
    page?: number;
    perPage?: number;
    subtype?: string[];
  } = {}): Promise<any[]> {
    const params = new URLSearchParams();
    params.append('search', query);

    if (options.page) params.append('page', options.page.toString());
    if (options.perPage) params.append('per_page', options.perPage.toString());
    if (options.subtype) {
      options.subtype.forEach(subtype => {
        params.append('type', subtype);
      });
    }

    return this.request<any[]>(`/wp/v2/search?${params}`);
  }

  // ==================== 统计相关 ====================

  /**
   * 获取总数
   */
  private async getTotal(endpoint: string): Promise<number> {
    const response = await fetch(`${this.baseUrl}${endpoint}?per_page=1`);
    const total = response.headers.get('X-WP-Total');
    return total ? parseInt(total) : 0;
  }

  /**
   * 获取总页数
   */
  private async getTotalPages(endpoint: string): Promise<number> {
    const response = await fetch(`${this.baseUrl}${endpoint}?per_page=1`);
    const totalPages = response.headers.get('X-WP-TotalPages');
    return totalPages ? parseInt(totalPages) : 0;
  }

  /**
   * 获取文章总数
   */
  async getTotalPosts(): Promise<number> {
    return this.getTotal('/wp/v2/posts');
  }

  /**
   * 获取文章总页数
   */
  async getTotalPagesPosts(): Promise<number> {
    return this.getTotalPages('/wp/v2/posts');
  }

  /**
   * 获取分类总数
   */
  async getTotalCategories(): Promise<number> {
    return this.getTotal('/wp/v2/categories');
  }

  /**
   * 获取标签总数
   */
  async getTotalTags(): Promise<number> {
    return this.getTotal('/wp/v2/tags');
  }

  /**
   * 获取作者总数
   */
  async getTotalAuthors(): Promise<number> {
    return this.getTotal('/wp/v2/users');
  }

  /**
   * 获取评论总数
   */
  async getTotalComments(postId?: number): Promise<number> {
    const endpoint = postId ? `/wp/v2/comments?post=${postId}` : '/wp/v2/comments';
    return this.getTotal(endpoint);
  }
}

// 创建默认实例
const defaultClient = new WordPressClient({
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-wordpress-site.com/wp-json',
  perPage: 10,
  timeout: 10000,
});

export default defaultClient;
export { WordPressClient };
