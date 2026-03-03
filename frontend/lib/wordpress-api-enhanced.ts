/**
 * WordPress API 增强服务
 * 提供完整的 WordPress REST API 封装，包含缓存、错误处理、类型安全
 *
 * @version 2.0.0
 * @author CyberPress Team
 */

import { apiClient } from '@/services/api-client';

// =====================================================
// 类型定义
// =====================================================

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string; protected: boolean };
  excerpt: { rendered: string; protected: boolean };
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: 'standard' | 'aside' | 'chat' | 'gallery' | 'link' | 'image' | 'quote' | 'status' | 'video' | 'audio';
  meta: any[];
  categories: number[];
  tags: number[];
  _links?: any;
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
  _links?: any;
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
  _links?: any;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: { [key: string]: string };
  meta: any[];
  _links?: any;
}

export interface WPMedia {
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
  alt_text: string;
  media_type: 'image' | 'file';
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    sizes: {
      [key: string]: {
        file: string;
        width: number;
        height: number;
        mime_type: string;
        source_url: string;
      };
    };
    image_meta: {
      aperture: string;
      credit: string;
      camera: string;
      caption: string;
      created_timestamp: string;
      copyright: string;
      focal_length: string;
      iso: string;
      shutter_speed: string;
      title: string;
      orientation: string;
      keywords: array[];
    };
  };
  source_url: string;
  _links?: any;
}

export interface WPComment {
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
  author_avatar_urls: { [key: string]: string };
  meta: any[];
  _links?: any;
}

export interface WPPage extends WPPost {
  template: string;
}

export interface WPSearchResult {
  id: number;
  title: string;
  url: string;
  type: string;
  subtype: string;
}

// =====================================================
// 查询参数类型
// =====================================================

export interface WPPostsQuery {
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'relevance' | 'id' | 'include' | 'title' | 'slug';
  slug?: string[];
  status?: string;
  categories?: number[];
  tags?: number[];
  sticky?: boolean;
  author?: number[];
  _fields?: string[];
}

export interface WPCommentsQuery {
  page?: number;
  per_page?: number;
  post?: number;
  parent?: number[];
  parent_exclude?: number[];
  status?: string;
  type?: string;
  _embed?: boolean;
}

// =====================================================
// API 响应类型
// =====================================================

export interface WPApiResponse<T> {
  data?: T;
  headers: {
    'X-WP-Total': string;
    'X-WP-TotalPages': string;
    [key: string]: string;
  };
  success: boolean;
  error?: {
    code: string;
    message: string;
    data: { status: number };
  };
}

export interface WPPaginationInfo {
  total: number;
  totalPages: number;
}

// =====================================================
// WordPress API 客户端类
// =====================================================

class WordPressAPIClient {
  private baseURL: string;
  private namespace = 'wp/v2';

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '/wp-json';
  }

  /**
   * 获取文章列表
   */
  async getPosts(query: WPPostsQuery = {}): Promise<{ posts: WPPost[]; pagination: WPPaginationInfo }> {
    const response = await apiClient.get<WPPost[]>(
      `${this.buildURL('posts')}`,
      {
        params: query,
        cache: true,
        cacheTTL: 5 * 60 * 1000, // 5分钟缓存
      }
    );

    if (!response.success || !response.data) {
      return { posts: [], pagination: { total: 0, totalPages: 0 } };
    }

    // 从响应头获取分页信息
    const total = parseInt(response.meta?.pagination?.total || '0');
    const totalPages = parseInt(response.meta?.pagination?.totalPages || '0');

    return {
      posts: response.data,
      pagination: { total, totalPages },
    };
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: number | string, options: { context?: 'view' | 'embed' | 'edit' } = {}): Promise<WPPost | null> {
    const response = await apiClient.get<WPPost>(
      `${this.buildURL(`posts/${id}`)}`,
      {
        params: options,
        cache: true,
        cacheTTL: 10 * 60 * 1000, // 10分钟缓存
      }
    );

    return response.success ? response.data || null : null;
  }

  /**
   * 获取分类列表
   */
  async getCategories(params: { page?: number; per_page?: number; exclude?: number[] } = {}): Promise<WPCategory[]> {
    const response = await apiClient.get<WPCategory[]>(
      `${this.buildURL('categories')}`,
      {
        params,
        cache: true,
        cacheTTL: 15 * 60 * 1000, // 15分钟缓存
      }
    );

    return response.success ? response.data || [] : [];
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: number): Promise<WPCategory | null> {
    const response = await apiClient.get<WPCategory>(
      `${this.buildURL(`categories/${id}`)}`,
      {
        cache: true,
        cacheTTL: 15 * 60 * 1000,
      }
    );

    return response.success ? response.data || null : null;
  }

  /**
   * 获取标签列表
   */
  async getTags(params: { page?: number; per_page?: number; exclude?: number[] } = {}): Promise<WPTag[]> {
    const response = await apiClient.get<WPTag[]>(
      `${this.buildURL('tags')}`,
      {
        params,
        cache: true,
        cacheTTL: 15 * 60 * 1000,
      }
    );

    return response.success ? response.data || [] : [];
  }

  /**
   * 获取单个标签
   */
  async getTag(id: number): Promise<WPTag | null> {
    const response = await apiClient.get<WPTag>(
      `${this.buildURL(`tags/${id}`)}`,
      {
        cache: true,
        cacheTTL: 15 * 60 * 1000,
      }
    );

    return response.success ? response.data || null : null;
  }

  /**
   * 获取作者列表
   */
  async getAuthors(params: { page?: number; per_page?: number } = {}): Promise<WPAuthor[]> {
    const response = await apiClient.get<WPAuthor[]>(
      `${this.buildURL('users')}`,
      {
        params,
        cache: true,
        cacheTTL: 30 * 60 * 1000, // 30分钟缓存
      }
    );

    return response.success ? response.data || [] : [];
  }

  /**
   * 获取单个作者
   */
  async getAuthor(id: number): Promise<WPAuthor | null> {
    const response = await apiClient.get<WPAuthor>(
      `${this.buildURL(`users/${id}`)}`,
      {
        cache: true,
        cacheTTL: 30 * 60 * 1000,
      }
    );

    return response.success ? response.data || null : null;
  }

  /**
   * 获取媒体列表
   */
  async getMedia(params: { page?: number; per_page?: number; parent?: number } = {}): Promise<WPMedia[]> {
    const response = await apiClient.get<WPMedia[]>(
      `${this.buildURL('media')}`,
      {
        params,
        cache: true,
        cacheTTL: 60 * 60 * 1000, // 1小时缓存
      }
    );

    return response.success ? response.data || [] : [];
  }

  /**
   * 获取单个媒体
   */
  async getMediaItem(id: number): Promise<WPMedia | null> {
    const response = await apiClient.get<WPMedia>(
      `${this.buildURL(`media/${id}`)}`,
      {
        cache: true,
        cacheTTL: 60 * 60 * 1000,
      }
    );

    return response.success ? response.data || null : null;
  }

  /**
   * 上传媒体
   */
  async uploadMedia(file: File, onProgress?: (progress: number) => void): Promise<WPMedia | null> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('status', 'publish');

    try {
      const xhr = new XMLHttpRequest();

      // 监听上传进度
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress(progress);
          }
        });
      }

      return new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 201) {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } else {
            reject(new Error(`Upload failed: ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));

        xhr.open('POST', `${this.baseURL}/${this.namespace}/media`);
        xhr.setRequestHeader('Authorization', `Bearer ${apiClient['getAccessToken']?.() || ''}`);
        xhr.send(formData);
      });
    } catch (error) {
      console.error('Upload media error:', error);
      return null;
    }
  }

  /**
   * 获取页面列表
   */
  async getPages(query: WPPostsQuery = {}): Promise<{ pages: WPPage[]; pagination: WPPaginationInfo }> {
    const response = await apiClient.get<WPPage[]>(
      `${this.buildURL('pages')}`,
      {
        params: query,
        cache: true,
        cacheTTL: 10 * 60 * 1000,
      }
    );

    if (!response.success || !response.data) {
      return { pages: [], pagination: { total: 0, totalPages: 0 } };
    }

    const total = parseInt(response.meta?.pagination?.total || '0');
    const totalPages = parseInt(response.meta?.pagination?.totalPages || '0');

    return {
      pages: response.data,
      pagination: { total, totalPages },
    };
  }

  /**
   * 获取单个页面
   */
  async getPage(id: number | string): Promise<WPPage | null> {
    const response = await apiClient.get<WPPage>(
      `${this.buildURL(`pages/${id}`)}`,
      {
        cache: true,
        cacheTTL: 10 * 60 * 1000,
      }
    );

    return response.success ? response.data || null : null;
  }

  /**
   * 获取评论列表
   */
  async getComments(query: WPCommentsQuery = {}): Promise<WPComment[]> {
    const response = await apiClient.get<WPComment[]>(
      `${this.buildURL('comments')}`,
      {
        params: query,
        cache: true,
        cacheTTL: 2 * 60 * 1000, // 2分钟缓存
      }
    );

    return response.success ? response.data || [] : [];
  }

  /**
   * 获取单个评论
   */
  async getComment(id: number): Promise<WPComment | null> {
    const response = await apiClient.get<WPComment>(
      `${this.buildURL(`comments/${id}`)}`,
      {
        cache: true,
        cacheTTL: 2 * 60 * 1000,
      }
    );

    return response.success ? response.data || null : null;
  }

  /**
   * 创建评论
   */
  async createComment(postId: number, content: string, author: {
    name: string;
    email: string;
    url?: string;
  }): Promise<WPComment | null> {
    const response = await apiClient.post<WPComment>(
      `${this.buildURL('comments')}`,
      {
        post: postId,
        content,
        author_name: author.name,
        author_email: author.email,
        author_url: author.url,
        status: 'hold', // 待审核
      }
    );

    return response.success ? response.data || null : null;
  }

  /**
   * 搜索内容
   */
  async search(query: string, subtype?: string[], perPage: number = 10): Promise<WPSearchResult[]> {
    const response = await apiClient.get<WPSearchResult[]>(
      `${this.baseURL}/wp/v2/search`,
      {
        params: {
          search: query,
          subtype,
          per_page: perPage,
        },
        cache: true,
        cacheTTL: 5 * 60 * 1000,
      }
    );

    return response.success ? response.data || [] : [];
  }

  /**
   * 获取文章分类
   */
  async getPostCategories(postId: number): Promise<WPCategory[]> {
    const response = await apiClient.get<WPCategory[]>(
      `${this.buildURL(`posts/${postId}/categories`)}`,
      {
        cache: true,
        cacheTTL: 15 * 60 * 1000,
      }
    );

    return response.success ? response.data || [] : [];
  }

  /**
   * 获取文章标签
   */
  async getPostTags(postId: number): Promise<WPTag[]> {
    const response = await apiClient.get<WPTag[]>(
      `${this.buildURL(`posts/${postId}/tags`)}`,
      {
        cache: true,
        cacheTTL: 15 * 60 * 1000,
      }
    );

    return response.success ? response.data || [] : [];
  }

  /**
   * 获取文章评论
   */
  async getPostComments(postId: number): Promise<WPComment[]> {
    const response = await apiClient.get<WPComment[]>(
      `${this.buildURL(`comments`)}`,
      {
        params: { post: postId },
        cache: true,
        cacheTTL: 2 * 60 * 1000,
      }
    );

    return response.success ? response.data || [] : [];
  }

  /**
   * 构建完整 URL
   */
  private buildURL(endpoint: string): string {
    return `${this.baseURL}/${this.namespace}/${endpoint}`;
  }

  /**
   * 清除缓存
   */
  clearCache(pattern?: string): void {
    apiClient.clearCache(pattern);
  }
}

// =====================================================
// 导出单例实例
// =====================================================

export const wpAPI = new WordPressAPIClient();

// =====================================================
// 便捷的 Query Keys (用于 React Query)
// =====================================================

export const wpQueryKeys = {
  posts: () => ['wp', 'posts'] as const,
  post: (id: number | string) => ['wp', 'posts', id] as const,
  categories: () => ['wp', 'categories'] as const,
  category: (id: number) => ['wp', 'categories', id] as const,
  tags: () => ['wp', 'tags'] as const,
  tag: (id: number) => ['wp', 'tags', id] as const,
  authors: () => ['wp', 'authors'] as const,
  author: (id: number) => ['wp', 'authors', id] as const,
  media: () => ['wp', 'media'] as const,
  mediaItem: (id: number) => ['wp', 'media', id] as const,
  pages: () => ['wp', 'pages'] as const,
  page: (id: number | string) => ['wp', 'pages', id] as const,
  comments: () => ['wp', 'comments'] as const,
  comment: (id: number) => ['wp', 'comments', id] as const,
  postComments: (postId: number) => ['wp', 'posts', postId, 'comments'] as const,
  search: (query: string) => ['wp', 'search', query] as const,
};

export default wpAPI;
