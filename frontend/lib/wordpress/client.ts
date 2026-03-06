/**
 * WordPress REST API Client
 * 用于与 WordPress 后端通信
 */

export interface WPConfig {
  baseUrl: string;
  apiKey?: string;
}

export interface WPArticle {
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

export interface WPCategory {
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

export interface WPTag {
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

export interface WPMedia {
  id: number;
  date: string;
  link: string;
  slug: string;
  type: string;
  title: {
    rendered: string;
  };
  author: number;
  caption: string;
  alt_text: string;
  media_type: string;
  mime_type: string;
  source_url: string;
  _links: any;
}

class WordPressClient {
  private config: WPConfig;

  constructor(config: WPConfig) {
    this.config = config;
  }

  /**
   * 获取所有文章
   */
  async getPosts(options: {
    page?: number;
    per_page?: number;
    category?: number;
    tag?: number;
    search?: string;
    order?: 'asc' | 'desc';
    orderby?: string;
    _embed?: boolean;
  } = {}): Promise<WPArticle[]> {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page.toString());
    if (options.per_page) params.append('per_page', options.per_page.toString());
    if (options.category) params.append('categories', options.category.toString());
    if (options.tag) params.append('tags', options.tag.toString());
    if (options.search) params.append('search', options.search);
    if (options.order) params.append('order', options.order);
    if (options.orderby) params.append('orderby', options.orderby);
    if (options._embed) params.append('_embed', 'true');

    const response = await fetch(
      `${this.config.baseUrl}/wp/v2/posts?${params.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.statusText}`);
    }

    const totalCount = response.headers.get('X-WP-Total');
    const totalPages = response.headers.get('X-WP-TotalPages');
    
    const posts: WPArticle[] = await response.json();
    
    return posts;
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number, _embed = true): Promise<WPArticle> {
    const params = _embed ? '?_embed=true' : '';
    const response = await fetch(
      `${this.config.baseUrl}/wp/v2/posts/${id}${params}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 根据 slug 获取文章
   */
  async getPostBySlug(slug: string, _embed = true): Promise<WPArticle> {
    const params = _embed ? '?_embed=true' : '';
    const response = await fetch(
      `${this.config.baseUrl}/wp/v2/posts/by-slug/${slug}${params}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post by slug: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取分类列表
   */
  async getCategories(options: {
    page?: number;
    per_page?: number;
  } = {}): Promise<WPCategory[]> {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.per_page) params.append('per_page', options.per_page.toString());

    const response = await fetch(
      `${this.config.baseUrl}/wp/v2/categories?${params.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取标签列表
   */
  async getTags(options: {
    page?: number;
    per_page?: number;
  } = {}): Promise<WPTag[]> {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.per_page) params.append('per_page', options.per_page.toString());

    const response = await fetch(
      `${this.config.baseUrl}/wp/v2/tags?${params.toString()}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取媒体文件
   */
  async getMedia(id: number): Promise<WPMedia> {
    const response = await fetch(
      `${this.config.baseUrl}/wp/v2/media/${id}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch media: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 搜索文章
   */
  async search(query: string, options: {
    page?: number;
    per_page?: number;
  } = {}): Promise<WPArticle[]> {
    return this.getPosts({
      ...options,
      search: query,
    });
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }
}

// 创建默认客户端实例
const defaultConfig: WPConfig = {
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-wordpress-site.com/wp-json',
  apiKey: process.env.NEXT_PUBLIC_WORDPRESS_API_KEY,
};

export const wpClient = new WordPressClient(defaultConfig);

export default WordPressClient;
