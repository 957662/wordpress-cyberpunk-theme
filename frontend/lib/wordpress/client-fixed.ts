/**
 * WordPress REST API Client
 * 完整的 WordPress API 客户端实现
 */

export interface WPConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  timeout?: number;
}

export interface Post {
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
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      id: number;
      source_url: string;
      alt_text: string;
      media_details?: {
        width: number;
        height: number;
        file: string;
        sizes?: any;
      };
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      link: string;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
      url: string;
      description: string;
      link: string;
      slug: string;
      avatar_urls?: any;
    }>;
  };
}

export interface Category {
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

export interface Tag {
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

export interface Author {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: {
    24: string;
    48: string;
    96: string;
  };
  meta: any[];
  _links: any;
}

export interface Comment {
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
  author_avatar_urls?: any;
  meta: any[];
  _links: any;
}

export interface MediaItem {
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
  description: { rendered: string };
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes?: any;
    image_meta: any;
  };
  source_url: string;
  _links: any;
}

export interface Params {
  page?: number;
  per_page?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  slug?: string[];
  search?: string;
  categories?: number;
  tags?: number;
  exclude?: number[];
  include?: number[];
  sticky?: boolean;
  _embed?: boolean;
  status?: string;
}

class WordPressClient {
  private config: WPConfig;

  constructor(config: WPConfig) {
    this.config = {
      timeout: 10000,
      ...config,
    };
  }

  /**
   * 生成 API URL
   */
  private getUrl(endpoint: string, params?: Params): string {
    const url = new URL(endpoint, this.config.baseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      });
    }

    return url.toString();
  }

  /**
   * 发送请求
   */
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    // 添加基本认证
    if (this.config.username && this.config.password) {
      const auth = btoa(`${this.config.username}:${this.config.password}`);
      headers['Authorization'] = `Basic ${auth}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.config.timeout || 10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`请求失败: ${error.message}`);
      }
      throw new Error('请求失败');
    }
  }

  /**
   * 获取文章列表
   */
  async getPosts(params?: Params): Promise<Post[]> {
    const url = this.getUrl('/wp/v2/posts', { _embed: true, ...params });
    return this.request<Post[]>(url);
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string, params?: Params): Promise<Post> {
    const url = this.getUrl(`/wp/v2/posts/${id}`, { _embed: true, ...params });
    return this.request<Post>(url);
  }

  /**
   * 根据 slug 获取文章
   */
  async getPostBySlug(slug: string, params?: Params): Promise<Post> {
    const url = this.getUrl('/wp/v2/posts', { slug: [slug], _embed: true, ...params });
    const posts = await this.request<Post[]>(url);
    return posts[0];
  }

  /**
   * 获取分类列表
   */
  async getCategories(params?: Params): Promise<Category[]> {
    const url = this.getUrl('/wp/v2/categories', params);
    return this.request<Category[]>(url);
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<Category> {
    const url = this.getUrl(`/wp/v2/categories/${id}`);
    return this.request<Category>(url);
  }

  /**
   * 获取标签列表
   */
  async getTags(params?: Params): Promise<Tag[]> {
    const url = this.getUrl('/wp/v2/tags', params);
    return this.request<Tag[]>(url);
  }

  /**
   * 获取作者列表
   */
  async getAuthors(params?: Params): Promise<Author[]> {
    const url = this.getUrl('/wp/v2/users', params);
    return this.request<Author[]>(url);
  }

  /**
   * 获取单个作者
   */
  async getAuthor(id: number): Promise<Author> {
    const url = this.getUrl(`/wp/v2/users/${id}`);
    return this.request<Author>(url);
  }

  /**
   * 获取评论列表
   */
  async getComments(params?: Params): Promise<Comment[]> {
    const url = this.getUrl('/wp/v2/comments', params);
    return this.request<Comment[]>(url);
  }

  /**
   * 获取文章的评论
   */
  async getPostComments(postId: number, params?: Params): Promise<Comment[]> {
    const url = this.getUrl('/wp/v2/comments', { post: postId, ...params });
    return this.request<Comment[]>(url);
  }

  /**
   * 获取媒体列表
   */
  async getMedia(params?: Params): Promise<MediaItem[]> {
    const url = this.getUrl('/wp/v2/media', params);
    return this.request<MediaItem[]>(url);
  }

  /**
   * 获取单个媒体
   */
  async getMediaItem(id: number): Promise<MediaItem> {
    const url = this.getUrl(`/wp/v2/media/${id}`);
    return this.request<MediaItem>(url);
  }

  /**
   * 搜索文章
   */
  async search(query: string, params?: Params): Promise<Post[]> {
    const url = this.getUrl('/wp/v2/posts', { search: query, _embed: true, ...params });
    return this.request<Post[]>(url);
  }

  /**
   * 获取文章总数
   */
  async getTotalPosts(): Promise<number> {
    const url = this.getUrl('/wp/v2/posts', { per_page: 1 });
    const response = await fetch(url, { method: 'HEAD' });
    const total = response.headers.get('X-WP-Total');
    return total ? parseInt(total, 10) : 0;
  }

  /**
   * 获取分类总数
   */
  async getTotalCategories(): Promise<number> {
    const url = this.getUrl('/wp/v2/categories', { per_page: 1 });
    const response = await fetch(url, { method: 'HEAD' });
    const total = response.headers.get('X-WP-Total');
    return total ? parseInt(total, 10) : 0;
  }

  /**
   * 批量获取文章
   */
  async getPostsBatch(
    callback: (posts: Post[], page: number) => Promise<void> | void,
    params?: Params
  ): Promise<void> {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const posts = await this.getPosts({ ...params, page });
      await callback(posts, page);

      if (posts.length < (params?.per_page || 10)) {
        hasMore = false;
      } else {
        page++;
      }
    }
  }
}

// 创建默认客户端实例
function createWordPressClient(config: WPConfig): WordPressClient {
  return new WordPressClient(config);
}

export { WordPressClient, createWordPressClient };
export default WordPressClient;
