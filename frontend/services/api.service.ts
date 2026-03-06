/**
 * API Service Layer
 * Handles all HTTP requests to the backend
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp
        config.metadata = { startTime: new Date() };

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: any) => {
        // Calculate request duration
        const endTime = new Date();
        const duration = endTime.getTime() - response.config.metadata.startTime.getTime();

        // Log performance in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
        }

        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              this.setToken(newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Redirect to login if refresh fails
            this.clearToken();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        // Handle other errors
        const apiError: ApiError = {
          message: error.response?.data?.message || 'An error occurred',
          code: error.response?.data?.code,
          status: error.response?.status,
          details: error.response?.data?.details,
        };

        return Promise.reject(apiError);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', token);
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return null;

    try {
      const response = await axios.post(`${this.baseURL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const newToken = response.data.access_token;
      localStorage.setItem('access_token', newToken);
      return newToken;
    } catch (error) {
      return null;
    }
  }

  // HTTP Methods
  private async request<T = any>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client.request(config);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data, ...config });
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }

  // Blog API
  async getPosts(params?: PaginationParams & {
    category?: string;
    tag?: string;
    search?: string;
    status?: 'draft' | 'published' | 'archived';
  }): Promise<ApiResponse<PaginatedResponse<any>>> {
    return this.get('/posts', { params });
  }

  async getPost(id: string): Promise<ApiResponse<any>> {
    return this.get(`/posts/${id}`);
  }

  async getPostBySlug(slug: string): Promise<ApiResponse<any>> {
    return this.get(`/posts/slug/${slug}`);
  }

  async createPost(data: any): Promise<ApiResponse<any>> {
    return this.post('/posts', data);
  }

  async updatePost(id: string, data: any): Promise<ApiResponse<any>> {
    return this.put(`/posts/${id}`, data);
  }

  async deletePost(id: string): Promise<ApiResponse<void>> {
    return this.delete(`/posts/${id}`);
  }

  // Category API
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.get('/categories');
  }

  async getCategory(id: string): Promise<ApiResponse<any>> {
    return this.get(`/categories/${id}`);
  }

  // Tag API
  async getTags(): Promise<ApiResponse<any[]>> {
    return this.get('/tags');
  }

  async getTag(id: string): Promise<ApiResponse<any>> {
    return this.get(`/tags/${id}`);
  }

  // Comment API
  async getComments(postId: string): Promise<ApiResponse<any[]>> {
    return this.get(`/posts/${postId}/comments`);
  }

  async createComment(postId: string, data: {
    content: string;
    parentId?: string;
  }): Promise<ApiResponse<any>> {
    return this.post(`/posts/${postId}/comments`, data);
  }

  async updateComment(commentId: string, data: {
    content: string;
  }): Promise<ApiResponse<any>> {
    return this.put(`/comments/${commentId}`, data);
  }

  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    return this.delete(`/comments/${commentId}`);
  }

  // Like API
  async likeItem(itemId: string, itemType: 'post' | 'comment'): Promise<ApiResponse<any>> {
    return this.post(`/likes`, { item_id: itemId, item_type: itemType });
  }

  async unlikeItem(itemId: string, itemType: 'post' | 'comment'): Promise<ApiResponse<void>> {
    return this.delete(`/likes/${itemId}`);
  }

  // Bookmark API
  async bookmarkItem(itemId: string, itemType: 'post' | 'comment', folder?: string): Promise<ApiResponse<any>> {
    return this.post(`/bookmarks`, { item_id: itemId, item_type: itemType, folder });
  }

  async unbookmarkItem(itemId: string): Promise<ApiResponse<void>> {
    return this.delete(`/bookmarks/${itemId}`);
  }

  async getBookmarks(folder?: string): Promise<ApiResponse<any[]>> {
    return this.get('/bookmarks', { params: { folder } });
  }

  // Follow API
  async followUser(userId: string): Promise<ApiResponse<any>> {
    return this.post(`/social/follow/${userId}`);
  }

  async unfollowUser(userId: string): Promise<ApiResponse<void>> {
    return this.delete(`/social/follow/${userId}`);
  }

  async getFollowers(userId: string): Promise<ApiResponse<any[]>> {
    return this.get(`/social/followers/${userId}`);
  }

  async getFollowing(userId: string): Promise<ApiResponse<any[]>> {
    return this.get(`/social/following/${userId}`);
  }

  // Search API
  async search(query: string, filters?: {
    type?: 'post' | 'category' | 'tag' | 'user';
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    return this.get('/search', { params: { q: query, ...filters } });
  }

  // User API
  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.get('/users/me');
  }

  async getUser(id: string): Promise<ApiResponse<any>> {
    return this.get(`/users/${id}`);
  }

  async updateUser(id: string, data: any): Promise<ApiResponse<any>> {
    return this.put(`/users/${id}`, data);
  }

  async uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Auth API
  async login(email: string, password: string): Promise<ApiResponse<{
    access_token: string;
    refresh_token: string;
    user: any;
  }>> {
    const response = await this.post('/auth/login', { email, password });

    // Store tokens
    if (response.data.access_token) {
      this.setToken(response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
    }

    return response;
  }

  async register(data: {
    email: string;
    password: string;
    username: string;
  }): Promise<ApiResponse<any>> {
    return this.post('/auth/register', data);
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await this.post('/auth/logout');
    } finally {
      this.clearToken();
    }
  }

  async resetPassword(email: string): Promise<ApiResponse<void>> {
    return this.post('/auth/reset-password', { email });
  }

  // Notification API
  async getNotifications(params?: {
    unread_only?: boolean;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    return this.get('/notifications', { params });
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return this.put(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.put('/notifications/read-all');
  }

  // Analytics API
  async getPostStats(postId: string): Promise<ApiResponse<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }>> {
    return this.get(`/posts/${postId}/stats`);
  }

  async getUserStats(userId: string): Promise<ApiResponse<{
    posts: number;
    followers: number;
    following: number;
    totalLikes: number;
  }>> {
    return this.get(`/users/${userId}/stats`);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for testing
export default ApiService;
