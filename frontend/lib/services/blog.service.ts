/**
 * 博客 API 服务
 */

import { APIResponse, Post, Category, Tag, Comment } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * 通用请求函数
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: '请求失败',
      }));
      throw new Error(error.message || '网络错误');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('未知错误');
  }
}

export class BlogService {
  static async getPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    sort?: 'latest' | 'popular' | 'trending';
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort) queryParams.append('sort', params.sort);

    return request<Post[]>(`/posts?${queryParams.toString()}`);
  }

  static async getPost(slug: string) {
    return request<Post>(`/posts/${slug}`);
  }

  static async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    category?: string;
    tags?: string[];
    featured_image?: string;
    status?: 'draft' | 'published';
  }) {
    return request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updatePost(id: string, data: Partial<Post>) {
    return request<Post>(`/posts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async deletePost(id: string) {
    return request(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  static async likePost(id: string) {
    return request<{ liked: boolean; count: number }>(`/posts/${id}/like`, {
      method: 'POST',
    });
  }

  static async getComments(postId: string, params?: {
    page?: number;
    limit?: number;
    sort?: 'latest' | 'oldest' | 'popular';
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    return request<Comment[]>(`/posts/${postId}/comments?${queryParams.toString()}`);
  }

  static async createComment(postId: string, data: {
    content: string;
    parent_id?: string;
    author_name?: string;
    author_email?: string;
  }) {
    return request<Comment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default BlogService;
