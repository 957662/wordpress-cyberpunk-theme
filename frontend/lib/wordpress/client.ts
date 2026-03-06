/**
 * WordPress REST API 客户端
 * 用于与 WordPress 后端进行通信
 */

interface WPConfig {
  baseUrl: string;
  timeout?: number;
}

interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: rendered;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: rendered;
  content: rendered;
  excerpt: rendered;
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

interface WPCategory {
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

interface WPTag {
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

interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: any;
  _links: any;
}

interface WPParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: string;
  tags?: string;
  author?: string;
  orderby?: 'date' | 'relevance' | 'id' | 'include' | 'title' | 'slug';
  order?: 'asc' | 'desc';
  exclude?: string;
  include?: string;
  slug?: string;
  status?: string;
}

class WordPressClient {
  private config: WPConfig;

  constructor(config: WPConfig) {
    this.config = {
      ...config,
      timeout: config.timeout || 10000,
    };
  }

  private async request<T>(
    endpoint: string,
    params?: WPParams
  ): Promise<T> {
    const url = new URL(`${this.config.baseUrl}/wp/v2${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url.toString(), {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('请求超时');
        }
        throw error;
      }
      throw new Error('未知错误');
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // 获取文章列表
  async getPosts(params?: WPParams): Promise<WPPost[]> {
    return this.request<WPPost[]>('/posts', params);
  }

  // 获取单篇文章
  async getPost(id: number | string): Promise<WPPost> {
    return this.request<WPPost>(`/posts/${id}`);
  }

  // 通过 slug 获取文章
  async getPostBySlug(slug: string): Promise<WPPost[]> {
    return this.request<WPPost[]>('/posts', { slug });
  }

  // 获取分类列表
  async getCategories(params?: Pick<WPParams, 'page' | 'per_page' | 'search' | 'exclude' | 'include'>): Promise<WPCategory[]> {
    return this.request<WPCategory[]>('/categories', params);
  }

  // 获取单个分类
  async getCategory(id: number): Promise<WPCategory> {
    return this.request<WPCategory>(`/categories/${id}`);
  }

  // 获取标签列表
  async getTags(params?: Pick<WPParams, 'page' | 'per_page' | 'search' | 'exclude' | 'include'>): Promise<WPTag[]> {
    return this.request<WPTag[]>('/tags', params);
  }

  // 获取单个标签
  async getTag(id: number): Promise<WPTag> {
    return this.request<WPTag>(`/tags/${id}`);
  }

  // 获取作者列表
  async getAuthors(params?: Pick<WPParams, 'page' | 'per_page' | 'search' | 'exclude' | 'include'>): Promise<WPAuthor[]> {
    return this.request<WPAuthor[]>('/users', params);
  }

  // 获取单个作者
  async getAuthor(id: number): Promise<WPAuthor> {
    return this.request<WPAuthor>(`/users/${id}`);
  }

  // 搜索文章
  async searchPosts(query: string, params?: Omit<WPParams, 'search'>): Promise<WPPost[]> {
    return this.request<WPPost[]>('/posts', { ...params, search: query });
  }

  // 获取文章总数
  async getTotalPosts(params?: Pick<WPParams, 'search' | 'categories' | 'tags' | 'author'>): Promise<number> {
    const url = new URL(`${this.config.baseUrl}/wp/v2/posts`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const totalCount = response.headers.get('X-WP-Total');
    return totalCount ? parseInt(totalCount, 10) : 0;
  }
}

// 创建默认实例
const defaultConfig: WPConfig = {
  baseUrl: process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-site.com/wp-json',
};

export const wpClient = new WordPressClient(defaultConfig);

// 导出类型
export type { WPPost, WPCategory, WPTag, WPAuthor, WPParams, WPConfig };
export { WordPressClient };
