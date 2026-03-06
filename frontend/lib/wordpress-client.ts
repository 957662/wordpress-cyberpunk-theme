/**
 * WordPress REST API 客户端
 * 用于与 WordPress 后端进行数据交互
 */

export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
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
      media_details: {
        sizes?: {
          full?: { source_url: string };
          medium?: { source_url: string };
          thumbnail?: { source_url: string };
        };
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
      avatar_urls?: {
        '24': string;
        '48': string;
        '96': string;
      };
    }>;
  };
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
  avatar_urls?: {
    '24': string;
    '48': string;
    '96': string;
  };
  _links: any;
}

export interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_url: string;
  date: string;
  date_gmt: string;
  content: {
    rendered: string;
  };
  link: string;
  status: string;
  type: string;
  author_avatar_urls?: {
    '24': string;
    '48': string;
    '96': string;
  };
  meta: any[];
  _links: any;
}

export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: string;
  ping_status: string;
  alt_text: string;
  caption: {
    rendered: string;
  };
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes?: {
      full?: { source_url: string; width: number; height: number };
      medium?: { source_url: string; width: number; height: number };
      thumbnail?: { source_url: string; width: number; height: number };
    };
  };
  source_url: string;
  _links: any;
}

export interface WPPaginationParams {
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  slug?: string[];
  status?: string[];
  categories?: number[];
  tags?: number[];
  sticky?: boolean;
}

export interface WPResponse<T> {
  data: T[];
  headers: {
    'x-wp-total': string;
    'x-wp-totalpages': string;
  };
}

/**
 * WordPress API 客户端类
 */
export class WordPressClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string, timeout: number = 10000) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.timeout = timeout;
  }

  /**
   * 获取所有文章
   */
  async getPosts(params?: WPPaginationParams): Promise<WordPressPost[]> {
    const url = this.buildUrl('/wp/v2/posts', params);
    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number): Promise<WordPressPost> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/wp/v2/posts/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 通过 slug 获取文章
   */
  async getPostBySlug(slug: string): Promise<WordPressPost | null> {
    const posts = await this.getPosts({ slug: [slug], per_page: 1 });
    return posts[0] || null;
  }

  /**
   * 获取分类
   */
  async getCategories(params?: Partial<WPPaginationParams>): Promise<WordPressCategory[]> {
    const url = this.buildUrl('/wp/v2/categories', params);
    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WordPressCategory> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/wp/v2/categories/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch category: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取标签
   */
  async getTags(params?: Partial<WPPaginationParams>): Promise<WordPressTag[]> {
    const url = this.buildUrl('/wp/v2/tags', params);
    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WordPressTag> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/wp/v2/tags/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tag: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取作者
   */
  async getAuthor(id: number): Promise<WordPressAuthor> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/wp/v2/users/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch author: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取所有作者
   */
  async getAuthors(params?: Partial<WPPaginationParams>): Promise<WordPressAuthor[]> {
    const url = this.buildUrl('/wp/v2/users', params);
    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch authors: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取文章评论
   */
  async getComments(postId?: number, params?: Partial<WPPaginationParams>): Promise<WordPressComment[]> {
    const queryParams = postId ? { ...params, post: postId } : params;
    const url = this.buildUrl('/wp/v2/comments', queryParams);
    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取媒体
   */
  async getMedia(id: number): Promise<WordPressMedia> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/wp/v2/media/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 搜索文章
   */
  async search(query: string, params?: Partial<WPPaginationParams>): Promise<WordPressPost[]> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/wp/v2/search?search=${encodeURIComponent(query)}&subtype=post`
    );

    if (!response.ok) {
      throw new Error(`Failed to search: ${response.statusText}`);
    }

    const results = await response.json();

    // 获取实际的文章数据
    const postIds = results.map((result: any) => result.id);
    if (postIds.length === 0) return [];

    return this.getPosts({ include: postIds, ...params });
  }

  /**
   * 获取文章总数
   */
  async getTotalPosts(params?: WPPaginationParams): Promise<number> {
    const url = this.buildUrl('/wp/v2/posts', { ...params, per_page: 1 });
    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Failed to get total posts: ${response.statusText}`);
    }

    const total = response.headers.get('x-wp-total');
    return total ? parseInt(total, 10) : 0;
  }

  /**
   * 获取总页数
   */
  async getTotalPages(params?: WPPaginationParams): Promise<number> {
    const url = this.buildUrl('/wp/v2/posts', { ...params, per_page: 1 });
    const response = await this.fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Failed to get total pages: ${response.statusText}`);
    }

    const totalPages = response.headers.get('x-wp-totalpages');
    return totalPages ? parseInt(totalPages, 10) : 0;
  }

  /**
   * 构建带查询参数的 URL
   */
  private buildUrl(endpoint: string, params?: any): string {
    if (!params || Object.keys(params).length === 0) {
      return `${this.baseUrl}${endpoint}`;
    }

    const queryString = new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)])
    ).toString();

    return `${this.baseUrl}${endpoint}?${queryString}`;
  }

  /**
   * 带超时的 fetch
   */
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * 获取文章并嵌入关联数据
   */
  async getPostsWithEmbedded(params?: WPPaginationParams): Promise<WordPressPost[]> {
    const url = this.buildUrl('/wp/v2/posts', params);
    const response = await this.fetchWithTimeout(`${url}&_embed`);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts with embedded: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取特色文章（sticky posts）
   */
  async getStickyPosts(params?: Partial<WPPaginationParams>): Promise<WordPressPost[]> {
    return this.getPosts({ ...params, sticky: true });
  }

  /**
   * 获取热门文章（按浏览量排序 - 需要插件支持）
   */
  async getPopularPosts(params?: Partial<WPPaginationParams>): Promise<WordPressPost[]> {
    // 这需要安装如 WordPress Popular Posts 等插件
    return this.getPosts({ ...params, orderby: 'post_views', order: 'desc' });
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(postId: number, params?: Partial<WPPaginationParams>): Promise<WordPressPost[]> {
    try {
      const post = await this.getPost(postId);
      const categories = post.categories || [];

      return this.getPosts({
        ...params,
        categories,
        exclude: [postId],
        per_page: 4,
      });
    } catch {
      return [];
    }
  }

  /**
   * 获取最新文章
   */
  async getLatestPosts(limit: number = 10): Promise<WordPressPost[]> {
    return this.getPosts({ per_page: limit, orderby: 'date', order: 'desc' });
  }

  /**
   * 获取随机文章
   */
  async getRandomPosts(limit: number = 10): Promise<WordPressPost[]> {
    return this.getPosts({ per_page: limit, orderby: 'rand' });
  }

  /**
   * 批量获取文章
   */
  async getPostsByIds(ids: number[]): Promise<WordPressPost[]> {
    return this.getPosts({ include: ids, per_page: 100 });
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/wp-json/`, {
        method: 'HEAD',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * 获取站点信息
   */
  async getSiteInfo(): Promise<any> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}/wp-json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch site info: ${response.statusText}`);
    }

    return response.json();
  }
}

// 创建默认实例
export const wpClient = new WordPressClient(
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-site.com/wp-json'
);

// 导出便捷函数
export const getPosts = (params?: WPPaginationParams) => wpClient.getPosts(params);
export const getPost = (id: number) => wpClient.getPost(id);
export const getPostBySlug = (slug: string) => wpClient.getPostBySlug(slug);
export const getCategories = (params?: Partial<WPPaginationParams>) => wpClient.getCategories(params);
export const getTags = (params?: Partial<WPPaginationParams>) => wpClient.getTags(params);
export const getAuthor = (id: number) => wpClient.getAuthor(id);
export const getComments = (postId?: number, params?: Partial<WPPaginationParams>) =>
  wpClient.getComments(postId, params);
export const searchPosts = (query: string, params?: Partial<WPPaginationParams>) =>
  wpClient.search(query, params);
export const getLatestPosts = (limit?: number) => wpClient.getLatestPosts(limit);
export const getRelatedPosts = (postId: number, params?: Partial<WPPaginationParams>) =>
  wpClient.getRelatedPosts(postId, params);
