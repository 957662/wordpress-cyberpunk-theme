// ============================================
// CyberPress Platform - API 客户端
// ============================================
// 版本: 1.0.0
// 描述: 统一的 API 请求客户端
// ============================================

// ============================================
// 类型定义
// ============================================

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  body?: any;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// ============================================
// API 客户端类
// ============================================

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;
  private defaultRetries: number;

  constructor(config: {
    baseURL: string;
    headers?: Record<string, string>;
    timeout?: number;
    retries?: number;
  }) {
    this.baseURL = config.baseURL.replace(/\/$/, '');
    this.defaultHeaders = config.headers || {};
    this.defaultTimeout = config.timeout || 10000;
    this.defaultRetries = config.retries || 3;
  }

  /**
   * 构建完整的 URL
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 发送请求
   */
  async request<T = any>(
    endpoint: string,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      params,
      body,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      cache = 'no-cache',
    } = config;

    let lastError: Error | null = null;

    // 重试逻辑
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const url = this.buildUrl(endpoint, params);

        const requestHeaders: Record<string, string> = {
          ...this.defaultHeaders,
          ...headers,
        };

        // 如果有 body，添加 Content-Type
        if (body && !requestHeaders['Content-Type']) {
          requestHeaders['Content-Type'] = 'application/json';
        }

        const requestBody = body
          ? typeof body === 'string'
            ? body
            : JSON.stringify(body)
          : undefined;

        // 创建 AbortController 用于超时
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: requestBody,
          cache,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // 处理非 2xx 响应
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiErrorClass(
            errorData.message || response.statusText,
            response.status,
            errorData.code,
            errorData
          );
        }

        const data = await response.json();

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };
      } catch (error) {
        lastError = error as Error;

        // 如果是 AbortError，说明超时，重试
        // 如果是网络错误，重试
        // 其他错误不重试
        const shouldRetry =
          attempt < retries &&
          (error instanceof ApiErrorClass
            ? error.status >= 500 || error.status === 429
            : error.name === 'AbortError' || error.message.includes('fetch'));

        if (!shouldRetry) {
          throw error;
        }

        // 指数退避
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * GET 请求
   */
  async get<T = any>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<ApiRequestConfig, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<ApiRequestConfig, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    config?: Omit<ApiRequestConfig, 'method'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(
    endpoint: string,
    config?: Omit<ApiRequestConfig, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * 设置默认请求头
   */
  setDefaultHeader(key: string, value: string): void {
    this.defaultHeaders[key] = value;
  }

  /**
   * 移除默认请求头
   */
  removeDefaultHeader(key: string): void {
    delete this.defaultHeaders[key];
  }

  /**
   * 设置认证 Token
   */
  setAuthToken(token: string): void {
    this.setDefaultHeader('Authorization', `Bearer ${token}`);
  }

  /**
   * 移除认证 Token
   */
  removeAuthToken(): void {
    this.removeDefaultHeader('Authorization');
  }
}

// ============================================
// API 错误类
// ============================================

class ApiErrorClass extends Error implements ApiError {
  status?: number;
  code?: string;
  details?: any;

  constructor(message: string, status?: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// ============================================
// 创建默认的 API 客户端实例
// ============================================

const getBaseURL = (): string => {
  if (typeof window === 'undefined') {
    // 服务端渲染
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  }
  // 客户端
  return process.env.NEXT_PUBLIC_API_URL || '/api/v1';
};

export const apiClient = new ApiClient({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  retries: 3,
});

// ============================================
// API 服务（按功能模块划分）
// ============================================

// 认证服务
export const authApi = {
  login: (data: { username: string; password: string }) =>
    apiClient.post('/auth/login', data),

  register: (data: { username: string; email: string; password: string }) =>
    apiClient.post('/auth/register', data),

  logout: () => apiClient.post('/auth/logout'),

  refreshToken: (token: string) =>
    apiClient.post('/auth/refresh', { token }),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),
};

// 用户服务
export const userApi = {
  getProfile: (userId: string) =>
    apiClient.get(`/users/${userId}`),

  updateProfile: (userId: string, data: any) =>
    apiClient.patch(`/users/${userId}`, data),

  uploadAvatar: (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  followUser: (userId: string) =>
    apiClient.post(`/users/${userId}/follow`),

  unfollowUser: (userId: string) =>
    apiClient.delete(`/users/${userId}/follow`),

  getFollowers: (userId: string, params?: any) =>
    apiClient.get(`/users/${userId}/followers`, { params }),

  getFollowing: (userId: string, params?: any) =>
    apiClient.get(`/users/${userId}/following`, { params }),
};

// 文章服务
export const postApi = {
  getPosts: (params?: any) =>
    apiClient.get('/posts', { params }),

  getPost: (postId: string) =>
    apiClient.get(`/posts/${postId}`),

  getPostBySlug: (slug: string) =>
    apiClient.get(`/posts/slug/${slug}`),

  createPost: (data: any) =>
    apiClient.post('/posts', data),

  updatePost: (postId: string, data: any) =>
    apiClient.patch(`/posts/${postId}`, data),

  deletePost: (postId: string) =>
    apiClient.delete(`/posts/${postId}`),

  likePost: (postId: string) =>
    apiClient.post(`/posts/${postId}/like`),

  unlikePost: (postId: string) =>
    apiClient.delete(`/posts/${postId}/like`),

  bookmarkPost: (postId: string) =>
    apiClient.post(`/posts/${postId}/bookmark`),

  unbookmarkPost: (postId: string) =>
    apiClient.delete(`/posts/${postId}/bookmark`),

  incrementView: (postId: string) =>
    apiClient.post(`/posts/${postId}/view`),
};

// 评论服务
export const commentApi = {
  getComments: (postId: string, params?: any) =>
    apiClient.get(`/posts/${postId}/comments`, { params }),

  createComment: (postId: string, data: any) =>
    apiClient.post(`/posts/${postId}/comments`, data),

  updateComment: (commentId: string, data: any) =>
    apiClient.patch(`/comments/${commentId}`, data),

  deleteComment: (commentId: string) =>
    apiClient.delete(`/comments/${commentId}`),

  likeComment: (commentId: string) =>
    apiClient.post(`/comments/${commentId}/like`),

  unlikeComment: (commentId: string) =>
    apiClient.delete(`/comments/${commentId}/like`),
};

// 分类和标签服务
export const categoryApi = {
  getCategories: () =>
    apiClient.get('/categories'),

  getCategory: (categoryId: string) =>
    apiClient.get(`/categories/${categoryId}`),

  getCategoryBySlug: (slug: string) =>
    apiClient.get(`/categories/slug/${slug}`),
};

export const tagApi = {
  getTags: (params?: any) =>
    apiClient.get('/tags', { params }),

  getTag: (tagId: string) =>
    apiClient.get(`/tags/${tagId}`),

  getTagBySlug: (slug: string) =>
    apiClient.get(`/tags/slug/${slug}`),

  getTrendingTags: () =>
    apiClient.get('/tags/trending'),
};

// 搜索服务
export const searchApi = {
  search: (query: string, params?: any) =>
    apiClient.get('/search', { params: { q: query, ...params } }),

  getSuggestions: (query: string) =>
    apiClient.get('/search/suggestions', { params: { q: query } }),
};

// 通知服务
export const notificationApi = {
  getNotifications: (params?: any) =>
    apiClient.get('/notifications', { params }),

  markAsRead: (notificationId: string) =>
    apiClient.patch(`/notifications/${notificationId}/read`),

  markAllAsRead: () =>
    apiClient.post('/notifications/read-all'),

  deleteNotification: (notificationId: string) =>
    apiClient.delete(`/notifications/${notificationId}`),
};

export default apiClient;
