/**
 * WordPress Remote Service
 * Handles all communication with WordPress REST API
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface WPPost {
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
  content: { rendered: string };
  excerpt: { rendered: string };
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

export interface WPMedia {
  id: number;
  date: string;
  link: string;
  slug: string;
  type: string;
  title: { rendered: string };
  author: number;
  featured_media: number;
  caption: { rendered: string };
  alt_text: string;
  media_type: string;
  mime_type: string;
  media_details: any;
  source_url: string;
  _links: any;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls: { [key: string]: string };
  _links: any;
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
  _links: any;
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
  _links: any;
}

class WordPressRemoteService {
  private api: AxiosInstance;
  private baseUrl: string;
  private username?: string;
  private password?: string;

  constructor(baseUrl: string, username?: string, password?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.username = username;
    this.password = password;

    this.api = axios.create({
      baseURL: `${this.baseUrl}/wp-json/wp/v2`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth if provided
    if (username && password) {
      this.api.defaults.auth = {
        username,
        password,
      };
    }
  }

  /**
   * Fetch posts with optional filtering
   */
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    categories?: number[];
    tags?: number[];
    author?: number;
    order?: 'asc' | 'desc';
    orderby?: string;
    status?: string;
  }): Promise<WPPost[]> {
    try {
      const response = await this.api.get<WPPost[]>('/posts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  /**
   * Fetch a single post by ID
   */
  async getPost(id: number): Promise<WPPost> {
    try {
      const response = await this.api.get<WPPost>(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  /**
   * Fetch a post by slug
   */
  async getPostBySlug(slug: string): Promise<WPPost> {
    try {
      const response = await this.api.get<WPPost[]>('/posts', {
        params: { slug },
      });
      if (response.data.length === 0) {
        throw new Error('Post not found');
      }
      return response.data[0];
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      throw error;
    }
  }

  /**
   * Create a new post
   */
  async createPost(post: Partial<WPPost>): Promise<WPPost> {
    try {
      const response = await this.api.post<WPPost>('/posts', post);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  /**
   * Update an existing post
   */
  async updatePost(id: number, post: Partial<WPPost>): Promise<WPPost> {
    try {
      const response = await this.api.post<WPPost>(`/posts/${id}`, post);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  /**
   * Delete a post
   */
  async deletePost(id: number): Promise<void> {
    try {
      await this.api.delete(`/posts/${id}?force=true`);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  /**
   * Fetch categories
   */
  async getCategories(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<WPCategory[]> {
    try {
      const response = await this.api.get<WPCategory[]>('/categories', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Fetch tags
   */
  async getTags(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<any[]> {
    try {
      const response = await this.api.get('/tags', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  /**
   * Fetch media items
   */
  async getMedia(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<WPMedia[]> {
    try {
      const response = await this.api.get<WPMedia[]>('/media', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  }

  /**
   * Upload media
   */
  async uploadMedia(file: File, additionalData?: any): Promise<WPMedia> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('status', 'publish');

      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value as string);
        });
      }

      const response = await this.api.post<WPMedia>('/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading media:', error);
      throw error;
    }
  }

  /**
   * Fetch comments for a post
   */
  async getComments(postId: number, params?: {
    page?: number;
    per_page?: number;
  }): Promise<WPComment[]> {
    try {
      const response = await this.api.get<WPComment[]>('/comments', {
        params: { post: postId, ...params },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  /**
   * Create a comment
   */
  async createComment(comment: Partial<WPComment>): Promise<WPComment> {
    try {
      const response = await this.api.post<WPComment>('/comments', comment);
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  }

  /**
   * Fetch authors
   */
  async getAuthors(params?: {
    page?: number;
    per_page?: number;
  }): Promise<WPAuthor[]> {
    try {
      const response = await this.api.get<WPAuthor[]>('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching authors:', error);
      throw error;
    }
  }

  /**
   * Search content
   */
  async search(query: string, params?: {
    page?: number;
    per_page?: number;
    type?: string[];
  }): Promise<any[]> {
    try {
      const response = await this.api.get('/search', {
        params: { search: query, ...params },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  }
}

// Singleton instance
let wpService: WordPressRemoteService | null = null;

export const getWordPressService = (
  baseUrl?: string,
  username?: string,
  password?: string
): WordPressRemoteService => {
  if (!wpService) {
    const url = baseUrl || process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
    if (!url) {
      throw new Error('WordPress API URL is required');
    }
    wpService = new WordPressRemoteService(url, username, password);
  }
  return wpService;
};

export default WordPressRemoteService;
