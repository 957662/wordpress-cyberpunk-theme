/**
 * 博客相关 API 服务
 */

import { apiClient, createAuthApiClient } from './api-client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  category?: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: 'latest' | 'popular' | 'trending';
}

export class BlogService {
  async getPosts(params?: BlogListParams) {
    const { data } = await apiClient.get('/api/posts', params);
    return data;
  }

  async getPost(slug: string): Promise<BlogPost> {
    const { data } = await apiClient.get<BlogPost>(`/api/posts/${slug}`);
    return data;
  }

  async getRelatedPosts(postId: string, limit = 3): Promise<BlogPost[]> {
    const { data } = await apiClient.get<BlogPost[]>(`/api/posts/${postId}/related`, { limit });
    return data;
  }

  async searchPosts(query: string, params?: Omit<BlogListParams, 'search'>) {
    const { data } = await apiClient.get('/api/posts/search', { q: query, ...params });
    return data;
  }

  async createPost(post: Partial<BlogPost>, token: string): Promise<BlogPost> {
    const client = createAuthApiClient(token);
    const { data } = await client.post<BlogPost>('/api/posts', post);
    return data;
  }

  async updatePost(postId: string, post: Partial<BlogPost>, token: string): Promise<BlogPost> {
    const client = createAuthApiClient(token);
    const { data } = await client.put<BlogPost>(`/api/posts/${postId}`, post);
    return data;
  }

  async deletePost(postId: string, token: string): Promise<void> {
    const client = createAuthApiClient(token);
    await client.delete(`/api/posts/${postId}`);
  }
}

export const blogService = new BlogService();
