/**
 * WordPress REST API 客户端
 * 用于获取文章、分类、标签等数据
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// API 配置
const API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost:8080/wp-json';

// 类型定义
export interface WPPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
    author?: Array<{
      id: number;
      name: string;
      avatar_urls?: {
        [size: string]: string;
      };
    }>;
  };
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface WPUser {
  id: number;
  name: string;
  description: string;
  avatar_urls?: {
    [size: string]: string;
  };
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: {
    width: number;
    height: number;
    sizes?: {
      [size: string]: {
        source_url: string;
        width: number;
        height: number;
      };
    };
  };
}

// 分页响应
export interface WPPaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
}

// API 客户端类
class WordPressClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = API_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 获取文章列表
  async getPosts(options: {
    page?: number;
    perPage?: number;
    categories?: number[];
    tags?: number[];
    search?: string;
    orderBy?: 'date' | 'title' | 'id';
    order?: 'asc' | 'desc';
    _embed?: boolean;
  } = {}): Promise<WPPaginatedResponse<WPPost>> {
    const {
      page = 1,
      perPage = 10,
      categories,
      tags,
      search,
      orderBy = 'date',
      order = 'desc',
      _embed = true,
    } = options;

    const params: Record<string, unknown> = {
      page,
      per_page: perPage,
      orderby: orderBy,
      order,
      _embed,
    };

    if (categories?.length) params.categories = categories.join(',');
    if (tags?.length) params.tags = tags.join(',');
    if (search) params.search = search;

    const response = await this.client.get('/wp/v2/posts', {
      params,
    } as AxiosRequestConfig);

    return {
      data: response.data,
      total: parseInt(response.headers['x-wp-total'] || '0', 10),
      totalPages: parseInt(response.headers['x-wp-totalpages'] || '0', 10),
      page,
    };
  }

  // 获取单篇文章
  async getPost(id: number, _embed = true): Promise<WPPost> {
    const response = await this.client.get(`/wp/v2/posts/${id}`, {
      params: { _embed },
    });
    return response.data;
  }

  // 通过 slug 获取文章
  async getPostBySlug(slug: string, _embed = true): Promise<WPPost | null> {
    const response = await this.client.get('/wp/v2/posts', {
      params: { slug, _embed },
    });
    return response.data[0] || null;
  }

  // 获取分类列表
  async getCategories(options: { hideEmpty?: boolean } = {}): Promise<WPCategory[]> {
    const params: Record<string, unknown> = { per_page: 100 };
    if (options.hideEmpty !== false) params.hide_empty = true;

    const response = await this.client.get('/wp/v2/categories', { params });
    return response.data;
  }

  // 获取标签列表
  async getTags(options: { hideEmpty?: boolean } = {}): Promise<WPTag[]> {
    const params: Record<string, unknown> = { per_page: 100 };
    if (options.hideEmpty !== false) params.hide_empty = true;

    const response = await this.client.get('/wp/v2/tags', { params });
    return response.data;
  }

  // 获取用户信息
  async getUser(id: number): Promise<WPUser> {
    const response = await this.client.get(`/wp/v2/users/${id}`);
    return response.data;
  }

  // 获取媒体
  async getMedia(id: number): Promise<WPMedia> {
    const response = await this.client.get(`/wp/v2/media/${id}`);
    return response.data;
  }

  // 搜索
  async search(query: string, type: 'post' | 'page' | 'all' = 'all'): Promise<WPPost[]> {
    const response = await this.client.get('/wp/v2/search', {
      params: {
        search: query,
        type,
        per_page: 20,
      },
    });
    return response.data;
  }
}

// 导出单例
export const wpClient = new WordPressClient();

// React Query keys
export const wpKeys = {
  all: ['wordpress'] as const,
  posts: () => [...wpKeys.all, 'posts'] as const,
  post: (id: number) => [...wpKeys.posts(), id] as const,
  postBySlug: (slug: string) => [...wpKeys.posts(), 'slug', slug] as const,
  categories: () => [...wpKeys.all, 'categories'] as const,
  tags: () => [...wpKeys.all, 'tags'] as const,
  user: (id: number) => [...wpKeys.all, 'user', id] as const,
  media: (id: number) => [...wpKeys.all, 'media', id] as const,
};
