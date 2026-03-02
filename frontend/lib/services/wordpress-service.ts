/**
 * WordPress API Service
 * 与 WordPress REST API 交互
 */

import { logger } from '@/lib/utils/logger';

export interface WordPressPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  status: string;
  date: string;
  modified: string;
  link: string;
  author: number;
  categories: number[];
  tags: number[];
  featured_media?: number;
  _embedded?: {
    author?: Array<{ id: number; name: string; avatar_urls?: Record<string, string> }>;
    'wp:featuredmedia'?: Array<{ source_url?: string; alt_text?: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string }>>;
  };
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  parent: number;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressComment {
  id: number;
  post: number;
  author_name: string;
  author_email?: string;
  content: { rendered: string };
  date: string;
  parent: number;
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  title: { rendered: string };
  alt_text: string;
  caption: { rendered: string };
  media_type: string;
  mime_type: string;
}

export interface PostQueryParams {
  page?: number;
  per_page?: number;
  categories?: number;
  tags?: number;
  search?: string;
  orderby?: 'date' | 'relevance' | 'slug' | 'include' | 'title';
  order?: 'asc' | 'desc';
  status?: string;
  _embed?: boolean;
}

/**
 * WordPress API 服务类
 */
class WordPressService {
  private baseUrl: string;
  private username?: string;
  private password?: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '/wp-json/wp/v2';
    this.timeout = 30000;
  }

  /**
   * 创建认证头
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.username && this.password) {
      const auth = btoa(`${this.username}:${this.password}`);
      headers['Authorization'] = `Basic ${auth}`;
    }

    return headers;
  }

  /**
   * 发起请求
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T | null> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('WordPress API request failed:', error);
      return null;
    }
  }

  /**
   * 获取文章列表
   */
  async getPosts(params: PostQueryParams = {}): Promise<WordPressPost[]> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params.categories) queryParams.append('categories', params.categories.toString());
    if (params.tags) queryParams.append('tags', params.tags.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.orderby) queryParams.append('orderby', params.orderby);
    if (params.order) queryParams.append('order', params.order);
    if (params.status) queryParams.append('status', params.status);
    if (params._embed) queryParams.append('_embed', '1');

    const endpoint = `/posts${queryParams.toString() ? `?${queryParams}` : ''}`;
    const posts = await this.request<WordPressPost[]>(endpoint);

    return posts || [];
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number): Promise<WordPressPost | null> {
    return await this.request<WordPressPost>(`/posts/${id}?_embed=1`);
  }

  /**
   * 根据 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    const posts = await this.request<WordPressPost[]>(`/posts?slug=${slug}&_embed=1`);
    return posts && posts.length > 0 ? posts[0] : null;
  }

  /**
   * 创建文章
   */
  async createPost(postData: Partial<WordPressPost>): Promise<WordPressPost | null> {
    return await this.request<WordPressPost>(`/posts`, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  /**
   * 更新文章
   */
  async updatePost(
    id: number,
    postData: Partial<WordPressPost>
  ): Promise<WordPressPost | null> {
    return await this.request<WordPressPost>(`/posts/${id}`, {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  /**
   * 删除文章
   */
  async deletePost(id: number): Promise<boolean> {
    const result = await this.request<{ deleted: boolean }>(`/posts/${id}`, {
      method: 'DELETE',
    });
    return result?.deleted || false;
  }

  /**
   * 获取分类列表
   */
  async getCategories(hideEmpty: boolean = false): Promise<WordPressCategory[]> {
    const endpoint = `/categories?hide_empty=${hideEmpty}&per_page=100`;
    const categories = await this.request<WordPressCategory[]>(endpoint);

    return categories || [];
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WordPressCategory | null> {
    return await this.request<WordPressCategory>(`/categories/${id}`);
  }

  /**
   * 获取标签列表
   */
  async getTags(hideEmpty: boolean = false): Promise<WordPressTag[]> {
    const endpoint = `/tags?hide_empty=${hideEmpty}&per_page=100`;
    const tags = await this.request<WordPressTag[]>(endpoint);

    return tags || [];
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WordPressTag | null> {
    return await this.request<WordPressTag>(`/tags/${id}`);
  }

  /**
   * 获取评论列表
   */
  async getComments(postId?: number, page: number = 1): Promise<WordPressComment[]> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('order', 'asc');
    if (postId) params.append('post', postId.toString());

    const endpoint = `/comments?${params}`;
    const comments = await this.request<WordPressComment[]>(endpoint);

    return comments || [];
  }

  /**
   * 创建评论
   */
  async createComment(commentData: {
    post: number;
    content: string;
    author_name: string;
    author_email?: string;
    parent?: number;
  }): Promise<WordPressComment | null> {
    return await this.request<WordPressComment>('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  /**
   * 获取媒体列表
   */
  async getMedia(page: number = 1, perPage: number = 20): Promise<WordPressMedia[]> {
    const endpoint = `/media?page=${page}&per_page=${perPage}`;
    const media = await this.request<WordPressMedia[]>(endpoint);

    return media || [];
  }

  /**
   * 获取单个媒体
   */
  async getMediaItem(id: number): Promise<WordPressMedia | null> {
    return await this.request<WordPressMedia>(`/media/${id}`);
  }

  /**
   * 上传媒体文件
   */
  async uploadMedia(file: File): Promise<WordPressMedia | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('status', 'publish');

    try {
      const url = `${this.baseUrl}/media`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: formData,
        signal: AbortSignal.timeout(60000), // 60秒超时
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      logger.error('Media upload failed:', error);
      return null;
    }
  }

  /**
   * 搜索内容
   */
  async search(query: string, subtype?: string): Promise<WordPressPost[]> {
    const params = new URLSearchParams();
    params.append('search', query);
    params.append('per_page', '20');
    params.append('_embed', '1');
    if (subtype) params.append('type', subtype);

    const endpoint = `/posts?${params}`;
    const results = await this.request<WordPressPost[]>(endpoint);

    return results || [];
  }

  /**
   * 获取站点信息
   */
  async getSiteInfo(): Promise<{
    name: string;
    description: string;
    url: string;
    home: string;
  } | null> {
    try {
      const response = await fetch(this.baseUrl.replace('/wp/v2', ''));
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      logger.error('Failed to fetch site info:', error);
    }
    return null;
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const info = await this.getSiteInfo();
      return info !== null;
    } catch {
      return false;
    }
  }

  /**
   * 设置认证
   */
  setAuth(username: string, password: string): void {
    this.username = username;
    this.password = password;
  }

  /**
   * 清除认证
   */
  clearAuth(): void {
    this.username = undefined;
    this.password = undefined;
  }
}

// 创建全局服务实例
export const wordpressService = new WordPressService();

// 默认导出
export default wordpressService;
