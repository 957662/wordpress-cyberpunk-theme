/**
 * WordPress REST API Client
 *
 * 完整的 WordPress API 集成客户端
 * 支持文章、分类、标签、评论、用户等操作
 */

export interface WPConfig {
  baseUrl: string;
  apiPath?: string;
  auth?: {
    username: string;
    password: string;
  };
  timeout?: number;
}

export interface Post {
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

export interface Comment {
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
  author_avatar_urls: any;
  meta: any[];
  _links: any;
}

export interface User {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: any;
  meta: any[];
  _links: any;
}

export interface Media {
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
  caption: string;
  description: string;
  media_type: string;
  mime_type: string;
  media_details: any;
  source_url: string;
  _links: any;
}

export interface PostsParams {
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
  status?: string;
  categories?: number[];
  categories_exclude?: number[];
  tags?: number[];
  tags_exclude?: number[];
  sticky?: boolean;
  author?: number[];
  author_exclude?: number[];
}

export interface TaxonomyParams {
  page?: number;
  per_page?: number;
  search?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: string;
  slug?: string[];
  hide_empty?: boolean;
  post?: number;
}

export class WordPressClient {
  private config: WPConfig;
  private authHeader: string | null = null;

  constructor(config: WPConfig) {
    this.config = {
      apiPath: '/wp-json/wp/v2',
      timeout: 10000,
      ...config,
    };

    if (this.config.auth) {
      this.authHeader = 'Basic ' + btoa(`${this.config.auth.username}:${this.config.auth.password}`);
    }
  }

  private getEndpoint(route: string): string {
    return `${this.config.baseUrl}${this.config.apiPath}${route}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.getEndpoint(endpoint);
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.authHeader) {
      headers['Authorization'] = this.authHeader;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(this.config.timeout || 10000),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WordPress API request failed:', error);
      throw error;
    }
  }

  // Posts API
  async getPosts(params: PostsParams = {}): Promise<Post[]> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    const query = queryParams.toString();
    return this.request<Post[]>(`/posts?${query}`);
  }

  async getPost(id: number): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async getPostBySlug(slug: string): Promise<Post[]> {
    return this.request<Post[]>(`/posts?slug=${slug}`);
  }

  async createPost(post: Partial<Post>): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async deletePost(id: number): Promise<void> {
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories(params: TaxonomyParams = {}): Promise<Category[]> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    const query = queryParams.toString();
    return this.request<Category[]>(`/categories?${query}`);
  }

  async getCategory(id: number): Promise<Category> {
    return this.request<Category>(`/categories/${id}`);
  }

  // Tags API
  async getTags(params: TaxonomyParams = {}): Promise<Tag[]> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    const query = queryParams.toString();
    return this.request<Tag[]>(`/tags?${query}`);
  }

  async getTag(id: number): Promise<Tag> {
    return this.request<Tag>(`/tags/${id}`);
  }

  // Comments API
  async getComments(postId?: number): Promise<Comment[]> {
    const query = postId ? `?post=${postId}` : '';
    return this.request<Comment[]>(`/comments${query}`);
  }

  async getComment(id: number): Promise<Comment> {
    return this.request<Comment>(`/comments/${id}`);
  }

  async createComment(comment: Partial<Comment>): Promise<Comment> {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  // Users API
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  // Media API
  async getMedia(): Promise<Media[]> {
    return this.request<Media[]>('/media');
  }

  async getMediaItem(id: number): Promise<Media> {
    return this.request<Media>(`/media/${id}`);
  }

  // Search API
  async search(query: string, type?: string[]): Promise<any[]> {
    const typeParams = type ? `&type=${type.join(',')}` : '';
    return this.request<any[]>(`/search?search=${encodeURIComponent(query)}${typeParams}`);
  }
}

// Singleton instance
let wpClient: WordPressClient | null = null;

export function initWordPressClient(config: WPConfig): WordPressClient {
  wpClient = new WordPressClient(config);
  return wpClient;
}

export function getWordPressClient(): WordPressClient {
  if (!wpClient) {
    throw new Error('WordPress client not initialized. Call initWordPressClient first.');
  }
  return wpClient;
}

// Default export for convenience
export default WordPressClient;
