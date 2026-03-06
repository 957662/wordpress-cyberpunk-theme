/**
 * Blog Service
 * Handles all blog-related API calls
 */

import { API_BASE_URL } from '@/config/api';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

class BlogService {
  private baseUrl = `${API_BASE_URL}/blog`;

  /**
   * Get all posts with pagination and filters
   */
  async getPosts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    sortBy?: 'recent' | 'popular' | 'trending';
  }): Promise<{ posts: Post[]; total: number; page: number; limit: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sort', params.sortBy);

    const response = await fetch(`${this.baseUrl}?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  }

  /**
   * Get a single post by slug
   */
  async getPost(slug: string): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  }

  /**
   * Get related posts
   */
  async getRelatedPosts(slug: string, limit = 3): Promise<Post[]> {
    const response = await fetch(`${this.baseUrl}/${slug}/related?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch related posts');
    return response.json();
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${this.baseUrl}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<Tag[]> {
    const response = await fetch(`${this.baseUrl}/tags`);
    if (!response.ok) throw new Error('Failed to fetch tags');
    return response.json();
  }

  /**
   * Like a post
   */
  async likePost(slug: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${slug}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to like post');
  }

  /**
   * Unlike a post
   */
  async unlikePost(slug: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${slug}/like`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to unlike post');
  }

  /**
   * Bookmark a post
   */
  async bookmarkPost(slug: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${slug}/bookmark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to bookmark post');
  }

  /**
   * Remove bookmark
   */
  async removeBookmark(slug: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/${slug}/bookmark`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to remove bookmark');
  }

  /**
   * Get bookmarked posts
   */
  async getBookmarks(): Promise<Post[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/bookmarks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch bookmarks');
    return response.json();
  }

  /**
   * Search posts
   */
  async searchPosts(query: string, filters?: {
    category?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
    sortBy?: 'relevance' | 'recent' | 'popular';
  }): Promise<Post[]> {
    const queryParams = new URLSearchParams({ q: query });
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.sortBy) queryParams.append('sort', filters.sortBy);
    if (filters?.dateFrom) queryParams.append('from', filters.dateFrom);
    if (filters?.dateTo) queryParams.append('to', filters.dateTo);

    const response = await fetch(`${this.baseUrl}/search?${queryParams}`);
    if (!response.ok) throw new Error('Failed to search posts');
    return response.json();
  }

  /**
   * Get trending posts
   */
  async getTrendingPosts(limit = 5): Promise<Post[]> {
    const response = await fetch(`${this.baseUrl}/trending?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch trending posts');
    return response.json();
  }
}

export const blogService = new BlogService();
