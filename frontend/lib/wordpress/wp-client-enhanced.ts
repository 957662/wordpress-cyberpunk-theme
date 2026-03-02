/**
 * WordPress REST API 增强客户端
 * 提供更强大、类型安全的 WordPress API 调用功能
 */

import {_wpClient } from './client';

/**
 * 基础配置
 */
const config = {
  baseUrl: process.env.NEXT_PUBLIC_WP_API_URL || '',
  username: process.env.NEXT_PUBLIC_WP_USERNAME || '',
  password: process.env.NEXT_PUBLIC_WP_APP_PASSWORD || '',
  timeout: 10000,
};

/**
 * 通用 API 请求函数
 */
async function wpRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.baseUrl}/wp/v2/${endpoint.replace(/^\//, '')}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 添加认证（如果需要）
  if (config.username && config.password) {
    const auth = btoa(`${config.username}:${config.password}`);
    headers['Authorization'] = `Basic ${auth}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(config.timeout),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        throw new Error('请求超时，请稍后重试');
      }
      throw error;
    }
    throw new Error('未知错误');
  }
}

/**
 * 文章相关 API
 */
export const postsApi = {
  /**
   * 获取文章列表
   */
  async list(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    orderby?: 'date' | 'title' | 'modified' | 'comment_count';
    order?: 'asc' | 'desc';
    status?: 'publish' | 'pending' | 'draft' | 'future' | 'private';
    slug?: string[];
  }) {
    const queryParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, String(v)));
        } else {
          queryParams.set(key, String(value));
        }
      }
    });

    const query = queryParams.toString();
    return wpRequest<any[]>(`posts${query ? `?${query}` : ''}`);
  },

  /**
   * 获取单篇文章
   */
  async get(id: number, params?: { context?: 'view' | 'embed' | 'edit' }) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return wpRequest<any>(`posts/${id}${query}`);
  },

  /**
   * 根据 slug 获取文章
   */
  async getBySlug(slug: string) {
    return wpRequest<any[]>(`posts?slug=${encodeURIComponent(slug)}`);
  },

  /**
   * 创建文章
   */
  async create(post: {
    title: string;
    content: string;
    excerpt?: string;
    status?: 'publish' | 'draft' | 'pending';
    categories?: number[];
    tags?: number[];
    featured_media?: number;
  }) {
    return wpRequest<any>('posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },

  /**
   * 更新文章
   */
  async update(id: number, post: Partial<{
    title: string;
    content: string;
    excerpt: string;
    status: 'publish' | 'draft' | 'pending';
    categories: number[];
    tags: number[];
    featured_media: number;
  }>) {
    return wpRequest<any>(`posts/${id}`, {
      method: 'POST',
      body: JSON.stringify(post),
    });
  },

  /**
   * 删除文章
   */
  async delete(id: number, force?: boolean) {
    return wpRequest<any>(`posts/${id}?force=${force ? 'true' : 'false'}`, {
      method: 'DELETE',
    });
  },
};

/**
 * 分类相关 API
 */
export const categoriesApi = {
  /**
   * 获取分类列表
   */
  async list(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    parent?: number;
    hide_empty?: boolean;
  }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return wpRequest<any[]>(`categories${query}`);
  },

  /**
   * 获取单个分类
   */
  async get(id: number) {
    return wpRequest<any>(`categories/${id}`);
  },

  /**
   * 创建分类
   */
  async create(category: {
    name: string;
    description?: string;
    slug?: string;
    parent?: number;
  }) {
    return wpRequest<any>('categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },
};

/**
 * 标签相关 API
 */
export const tagsApi = {
  /**
   * 获取标签列表
   */
  async list(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    hide_empty?: boolean;
  }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return wpRequest<any[]>(`tags${query}`);
  },

  /**
   * 获取单个标签
   */
  async get(id: number) {
    return wpRequest<any>(`tags/${id}`);
  },

  /**
   * 创建标签
   */
  async create(tag: {
    name: string;
    description?: string;
    slug?: string;
  }) {
    return wpRequest<any>('tags', {
      method: 'POST',
      body: JSON.stringify(tag),
    });
  },
};

/**
 * 媒体相关 API
 */
export const mediaApi = {
  /**
   * 获取媒体列表
   */
  async list(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    mime_type?: string;
  }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return wpRequest<any[]>(`media${query}`);
  },

  /**
   * 获取单个媒体
   */
  async get(id: number) {
    return wpRequest<any>(`media/${id}`);
  },

  /**
   * 上传媒体
   */
  async upload(file: File, metadata?: {
    title?: string;
    alt_text?: string;
    caption?: string;
    description?: string;
  }) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('status', 'publish');

    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: HeadersInit = {};
    if (config.username && config.password) {
      const auth = btoa(`${config.username}:${config.password}`);
      headers['Authorization'] = `Basic ${auth}`;
    }

    const response = await fetch(`${config.baseUrl}/wp/v2/media`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('媒体上传失败');
    }

    return response.json();
  },

  /**
   * 删除媒体
   */
  async delete(id: number, force?: boolean) {
    return wpRequest<any>(`media/${id}?force=${force ? 'true' : 'false'}`, {
      method: 'DELETE',
    });
  },
};

/**
 * 用户相关 API
 */
export const usersApi = {
  /**
   * 获取用户列表
   */
  async list(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    roles?: string[];
  }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return wpRequest<any[]>(`users${query}`);
  },

  /**
   * 获取单个用户
   */
  async get(id: number) {
    return wpRequest<any>(`users/${id}`);
  },

  /**
   * 获取当前用户
   */
  async me() {
    return wpRequest<any>('users/me');
  },
};

/**
 * 评论相关 API
 */
export const commentsApi = {
  /**
   * 获取评论列表
   */
  async list(params?: {
    page?: number;
    per_page?: number;
    post?: number;
    parent?: number;
    status?: 'hold' | 'approve' | 'spam' | 'trash';
  }) {
    const query = params ? `?${new URLSearchParams(params as any)}` : '';
    return wpRequest<any[]>(`comments${query}`);
  },

  /**
   * 获取单条评论
   */
  async get(id: number) {
    return wpRequest<any>(`comments/${id}`);
  },

  /**
   * 创建评论
   */
  async create(comment: {
    post: number;
    content: string;
    author?: string;
    author_email?: string;
    parent?: number;
  }) {
    return wpRequest<any>('comments', {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  },

  /**
   * 删除评论
   */
  async delete(id: number, force?: boolean) {
    return wpRequest<any>(`comments/${id}?force=${force ? 'true' : 'false'}`, {
      method: 'DELETE',
    });
  },
};

/**
 * 搜索相关 API
 */
export const searchApi = {
  /**
   * 全局搜索
   */
  async search(query: string, params?: {
    page?: number;
    per_page?: number;
    type?: ('post' | 'page' | 'attachment' | 'any')[];
    subtype?: string[];
  }) {
    const searchParams = new URLSearchParams({
      search: query,
      ...(params || {}),
    } as any);

    return wpRequest<any[]>(`search?${searchParams}`);
  },
};

/**
 * 自定义字段 API (ACF)
 */
export const acfApi = {
  /**
   * 获取文章的自定义字段
   */
  async getPostFields(postId: number) {
    return wpRequest<any>(`posts/${postId}?_fields=acf`);
  },

  /**
   * 获取选项页字段
   */
  async getOptions() {
    return wpRequest<any>('acf/options');
  },

  /**
   * 更新文章的自定义字段
   */
  async updatePostFields(postId: number, fields: Record<string, any>) {
    return wpRequest<any>(`posts/${postId}`, {
      method: 'POST',
      body: JSON.stringify({ acf: fields }),
    });
  },
};

/**
 * 缓存工具
 */
class WPCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 5 * 60 * 1000; // 5 分钟

  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}

export const wpCache = new WPCache();

/**
 * 带缓存的请求函数
 */
async function cachedWpRequest<T>(
  key: string,
  fetcher: () => Promise<T>,
  forceRefresh = false
): Promise<T> {
  if (!forceRefresh) {
    const cached = wpCache.get(key);
    if (cached) return cached;
  }

  const data = await fetcher();
  wpCache.set(key, data);
  return data;
}

/**
 * 批量请求
 */
async function batchWpRequest<T>(
  requests: Array<() => Promise<T>>
): Promise<T[]> {
  return Promise.all(requests.map(req => req()));
}

/**
 * 导出所有 API
 */
export const wpApi = {
  posts: postsApi,
  categories: categoriesApi,
  tags: tagsApi,
  media: mediaApi,
  users: usersApi,
  comments: commentsApi,
  search: searchApi,
  acf: acfApi,
  cache: wpCache,
  cached: cachedWpRequest,
  batch: batchWpRequest,
};

export default wpApi;
