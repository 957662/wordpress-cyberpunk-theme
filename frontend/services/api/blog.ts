/**
 * 博客 API 服务
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

export interface BlogListResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BlogListParams {
  page?: number;
  pageSize?: number;
  category?: string;
  tag?: string;
  search?: string;
  sortBy?: 'latest' | 'popular' | 'trending';
}

class BlogService {
  private client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * 获取博客文章列表
   */
  async getPosts(params?: BlogListParams): Promise<BlogListResponse> {
    const response = await this.client.get('/blog/posts', { params });
    return response.data;
  }

  /**
   * 获取单篇博客文章
   */
  async getPost(id: string): Promise<BlogPost> {
    const response = await this.client.get(`/blog/posts/${id}`);
    return response.data;
  }

  /**
   * 获取精选文章
   */
  async getFeaturedPosts(limit = 5): Promise<BlogPost[]> {
    const response = await this.client.get('/blog/posts/featured', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(postId: string, limit = 4): Promise<BlogPost[]> {
    const response = await this.client.get(`/blog/posts/${postId}/related`, {
      params: { limit },
    });
    return response.data;
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, page = 1, pageSize = 10): Promise<BlogListResponse> {
    const response = await this.client.get('/blog/posts/search', {
      params: { q: query, page, pageSize },
    });
    return response.data;
  }

  /**
   * 点赞文章
   */
  async likePost(postId: string): Promise<{ liked: boolean; likesCount: number }> {
    const response = await this.client.post(`/blog/posts/${postId}/like`);
    return response.data;
  }

  /**
   * 取消点赞文章
   */
  async unlikePost(postId: string): Promise<{ liked: boolean; likesCount: number }> {
    const response = await this.client.delete(`/blog/posts/${postId}/like`);
    return response.data;
  }

  /**
   * 收藏文章
   */
  async bookmarkPost(postId: string): Promise<{ bookmarked: boolean }> {
    const response = await this.client.post(`/blog/posts/${postId}/bookmark`);
    return response.data;
  }

  /**
   * 取消收藏文章
   */
  async unbookmarkPost(postId: string): Promise<{ bookmarked: boolean }> {
    const response = await this.client.delete(`/blog/posts/${postId}/bookmark`);
    return response.data;
  }

  /**
   * 获取用户收藏的文章
   */
  async getBookmarkedPosts(page = 1, pageSize = 10): Promise<BlogListResponse> {
    const response = await this.client.get('/blog/posts/bookmarked', {
      params: { page, pageSize },
    });
    return response.data;
  }

  /**
   * 增加浏览量
   */
  async incrementViews(postId: string): Promise<void> {
    await this.client.post(`/blog/posts/${postId}/views`);
  }
}

export const blogService = new BlogService();
