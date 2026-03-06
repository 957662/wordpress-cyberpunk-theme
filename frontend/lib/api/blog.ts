/**
 * Blog API Client
 * 提供博客相关的API调用
 */

import { ApiResponse, PaginatedResponse } from './types';

/**
 * 文章类型定义
 */
export interface Post {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    id: string | number;
    name: string;
    avatar?: string;
  };
  category: {
    id: string | number;
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string | number;
    name: string;
    slug: string;
  }>;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  published_at: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  reading_time?: number;
}

/**
 * 文章创建/更新表单
 */
export interface PostFormData {
  title: string;
  content: string;
  excerpt?: string;
  category_id: string | number;
  tags?: Array<string | number>;
  featured_image?: string;
  status?: 'draft' | 'published';
}

/**
 * 文章列表查询参数
 */
export interface PostQueryParams {
  page?: number;
  per_page?: number;
  category?: string;
  tag?: string;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  author?: string | number;
  sort?: 'latest' | 'popular' | 'trending';
  featured?: boolean;
}

/**
 * 评论类型定义
 */
export interface Comment {
  id: string | number;
  post_id: string | number;
  author: {
    id: string | number;
    name: string;
    avatar?: string;
  };
  content: string;
  parent_id?: string | number;
  created_at: string;
  updated_at: string;
  like_count: number;
  replies?: Comment[];
}

/**
 * 评论创建表单
 */
export interface CommentFormData {
  post_id: string | number;
  content: string;
  parent_id?: string | number;
}

/**
 * 分类类型定义
 */
export interface Category {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
}

/**
 * 标签类型定义
 */
export interface Tag {
  id: string | number;
  name: string;
  slug: string;
  post_count: number;
}

/**
 * Blog API 客户端类
 */
class BlogAPI {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '/api';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * 设置认证令牌
   */
  setAuthToken(token: string) {
    this.headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * 清除认证令牌
   */
  clearAuthToken() {
    const { Authorization, ...rest } = this.headers as any;
    this.headers = rest;
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: this.headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '请求失败');
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      };
    }
  }

  /**
   * 获取文章列表
   */
  async getPosts(
    params?: PostQueryParams
  ): Promise<ApiResponse<PaginatedResponse<Post>>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
    }

    return this.request<PaginatedResponse<Post>>(
      `/posts?${queryParams.toString()}`
    );
  }

  /**
   * 获取单篇文章
   */
  async getPost(id: string | number): Promise<ApiResponse<Post>> {
    return this.request<Post>(`/posts/${id}`);
  }

  /**
   * 通过slug获取文章
   */
  async getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
    return this.request<Post>(`/posts/slug/${slug}`);
  }

  /**
   * 创建文章
   */
  async createPost(data: PostFormData): Promise<ApiResponse<Post>> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 更新文章
   */
  async updatePost(
    id: string | number,
    data: Partial<PostFormData>
  ): Promise<ApiResponse<Post>> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * 删除文章
   */
  async deletePost(id: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(
    postId: string | number,
    limit: number = 4
  ): Promise<ApiResponse<Post[]>> {
    return this.request<Post[]>(`/posts/${postId}/related?limit=${limit}`);
  }

  /**
   * 获取文章评论
   */
  async getComments(
    postId: string | number,
    page: number = 1
  ): Promise<ApiResponse<PaginatedResponse<Comment>>> {
    return this.request<PaginatedResponse<Comment>>(
      `/posts/${postId}/comments?page=${page}`
    );
  }

  /**
   * 创建评论
   */
  async createComment(data: CommentFormData): Promise<ApiResponse<Comment>> {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 删除评论
   */
  async deleteComment(id: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/comments/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 点赞文章
   */
  async likePost(postId: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  /**
   * 取消点赞文章
   */
  async unlikePost(postId: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/posts/${postId}/like`, {
      method: 'DELETE',
    });
  }

  /**
   * 收藏文章
   */
  async bookmarkPost(postId: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/posts/${postId}/bookmark`, {
      method: 'POST',
    });
  }

  /**
   * 取消收藏文章
   */
  async unbookmarkPost(postId: string | number): Promise<ApiResponse<void>> {
    return this.request<void>(`/posts/${postId}/bookmark`, {
      method: 'DELETE',
    });
  }

  /**
   * 获取分类列表
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories');
  }

  /**
   * 获取单个分类
   */
  async getCategory(id: string | number): Promise<ApiResponse<Category>> {
    return this.request<Category>(`/categories/${id}`);
  }

  /**
   * 获取标签列表
   */
  async getTags(): Promise<ApiResponse<Tag[]>> {
    return this.request<Tag[]>('/tags');
  }

  /**
   * 获取热门标签
   */
  async getPopularTags(limit: number = 20): Promise<ApiResponse<Tag[]>> {
    return this.request<Tag[]>(`/tags/popular?limit=${limit}`);
  }

  /**
   * 搜索文章
   */
  async searchPosts(
    query: string,
    page: number = 1
  ): Promise<ApiResponse<PaginatedResponse<Post>>> {
    return this.request<PaginatedResponse<Post>>(
      `/search?q=${encodeURIComponent(query)}&page=${page}`
    );
  }

  /**
   * 获取推荐文章
   */
  async getRecommendedPosts(
    limit: number = 5
  ): Promise<ApiResponse<Post[]>> {
    return this.request<Post[]>(`/posts/recommended?limit=${limit}`);
  }

  /**
   * 获取趋势文章
   */
  async getTrendingPosts(
    limit: number = 10
  ): Promise<ApiResponse<Post[]>> {
    return this.request<Post[]>(`/posts/trending?limit=${limit}`);
  }
}

/**
 * 导出单例实例
 */
export const blogApi = new BlogAPI();

/**
 * 导出类型
 */
export type {
  Post,
  PostFormData,
  PostQueryParams,
  Comment,
  CommentFormData,
  Category,
  Tag,
};
