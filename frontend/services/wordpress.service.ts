/**
 * WordPress REST API Service
 * WordPress REST API 服务
 */

import { WordPressPost } from '@/types/blog';

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
}

export interface WordPressAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: {
    '24': string;
    '48': string;
    '96': string;
  };
}

export interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      medium?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
      large?: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
  };
  source_url: string;
}

export interface WordPressParams {
  page?: number;
  per_page?: number;
  search?: string;
  categories?: string;
  tags?: string;
  author?: string;
  exclude?: string;
  include?: string;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'relevance' | 'id' | 'title' | 'slug';
  slug?: string[];
  status?: string;
  _embed?: boolean;
  _fields?: string[];
}

class WordPressService {
  private baseUrl: string;

  constructor(baseUrl: string = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://your-site.com/wp-json/wp/v2') {
    this.baseUrl = baseUrl;
  }

  /**
   * 构建查询参数
   */
  private buildQuery(params: WordPressParams = {}): string {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => query.append(key, String(v)));
        } else {
          query.append(key, String(value));
        }
      }
    });

    return query.toString();
  }

  /**
   * 通用请求方法
   */
  private async request<T>(endpoint: string, params: WordPressParams = {}): Promise<T> {
    const query = this.buildQuery(params);
    const url = `${this.baseUrl}${endpoint}${query ? `?${query}` : ''}`;

    const response = await fetch(url, {
      next: { revalidate: 60 }, // 缓存 60 秒
    });

    if (!response.ok) {
      throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * 获取文章列表
   */
  async getPosts(params: WordPressParams = {}): Promise<WordPressPost[]> {
    return this.request<WordPressPost[]>('/posts', { ...params, _embed: true });
  }

  /**
   * 获取单篇文章
   */
  async getPost(slug: string, params: WordPressParams = {}): Promise<WordPressPost> {
    const posts = await this.getPosts({ ...params, slug: [slug] });
    return posts[0];
  }

  /**
   * 获取分类列表
   */
  async getCategories(params: WordPressParams = {}): Promise<WordPressCategory[]> {
    return this.request<WordPressCategory[]>('/categories', params);
  }

  /**
   * 获取单个分类
   */
  async getCategory(slug: string): Promise<WordPressCategory> {
    const categories = await this.getCategories({ slug: [slug] });
    return categories[0];
  }

  /**
   * 获取标签列表
   */
  async getTags(params: WordPressParams = {}): Promise<WordPressTag[]> {
    return this.request<WordPressTag[]>('/tags', params);
  }

  /**
   * 获取单个标签
   */
  async getTag(slug: string): Promise<WordPressTag> {
    const tags = await this.getTags({ slug: [slug] });
    return tags[0];
  }

  /**
   * 获取作者列表
   */
  async getAuthors(params: WordPressParams = {}): Promise<WordPressAuthor[]> {
    return this.request<WordPressAuthor[]>('/users', params);
  }

  /**
   * 获取单个作者
   */
  async getAuthor(id: number): Promise<WordPressAuthor> {
    return this.request<WordPressAuthor>(`/users/${id}`);
  }

  /**
   * 获取媒体文件
   */
  async getMedia(id: number): Promise<WordPressMedia> {
    return this.request<WordPressMedia>(`/media/${id}`);
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params: WordPressParams = {}): Promise<WordPressPost[]> {
    return this.getPosts({ ...params, search: query });
  }

  /**
   * 获取页数信息
   */
  async getTotalPages(endpoint: string, params: WordPressParams = {}): Promise<number> {
    const query = this.buildQuery({ ...params, per_page: 1, page: 1 });
    const url = `${this.baseUrl}${endpoint}${query ? `?${query}` : ''}`;

    const response = await fetch(url);
    const totalCount = response.headers.get('X-WP-TotalPages');
    return totalCount ? parseInt(totalCount) : 1;
  }

  /**
   * 获取总数
   */
  async getTotalCount(endpoint: string, params: WordPressParams = {}): Promise<number> {
    const query = this.buildQuery({ ...params, per_page: 1, page: 1 });
    const url = `${this.baseUrl}${endpoint}${query ? `?${query}` : ''}`;

    const response = await fetch(url);
    const totalCount = response.headers.get('X-WP-Total');
    return totalCount ? parseInt(totalCount) : 0;
  }
}

// 导出单例
export const wordPressService = new WordPressService();

// 导出类型
export type { WordPressParams, WordPressCategory, WordPressTag, WordPressAuthor, WordPressMedia };
