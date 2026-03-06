/**
 * 博客 API 服务
 * 提供博客相关的 API 调用方法
 */

import { Post, Category, Tag, Comment, User } from '@/types';

// API 基础配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const BLOG_API_BASE = `${API_BASE_URL}/blog`;

/**
 * API 请求封装
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BLOG_API_BASE}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // 添加认证token
  const token = localStorage.getItem('auth_token');
  if (token) {
    (defaultOptions.headers as Record<string, string>)['Authorization'] =
      `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: '请求失败',
      }));
      throw new Error(error.message || '网络请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

/**
 * 博客 API 服务类
 */
export class BlogApiService {
  /**
   * 获取文章列表
   */
  static async getPosts(params: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
    status?: 'published' | 'draft' | 'all';
    sortBy?: 'latest' | 'popular' | 'views';
  } = {}): Promise<{
    posts: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.tag) queryParams.append('tag', params.tag);
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const query = queryParams.toString();
    return request<{ posts: Post[]; total: number; page: number; limit: number; totalPages: number }>(
      `/posts${query ? `?${query}` : ''}`
    );
  }

  /**
   * 获取单篇文章
   */
  static async getPost(id: string | number): Promise<Post> {
    return request<Post>(`/posts/${id}`);
  }

  /**
   * 通过slug获取文章
   */
  static async getPostBySlug(slug: string): Promise<Post> {
    return request<Post>(`/posts/slug/${slug}`);
  }

  /**
   * 创建文章
   */
  static async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    categoryId?: string;
    tags?: string[];
    status?: 'draft' | 'published';
  }): Promise<Post> {
    return request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 更新文章
   */
  static async updatePost(
    id: string | number,
    data: Partial<Post>
  ): Promise<Post> {
    return request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * 删除文章
   */
  static async deletePost(id: string | number): Promise<void> {
    return request<void>(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 点赞文章
   */
  static async likePost(id: string | number): Promise<{
    liked: boolean;
    count: number;
  }> {
    return request<{ liked: boolean; count: number }>(
      `/posts/${id}/like`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * 收藏文章
   */
  static async bookmarkPost(id: string | number): Promise<{
    bookmarked: boolean;
  }> {
    return request<{ bookmarked: boolean }>(
      `/posts/${id}/bookmark`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * 获取分类列表
   */
  static async getCategories(): Promise<Category[]> {
    return request<Category[]>('/categories');
  }

  /**
   * 获取单个分类
   */
  static async getCategory(id: string | number): Promise<Category> {
    return request<Category>(`/categories/${id}`);
  }

  /**
   * 创建分类
   */
  static async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    parentId?: string;
  }): Promise<Category> {
    return request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 更新分类
   */
  static async updateCategory(
    id: string | number,
    data: Partial<Category>
  ): Promise<Category> {
    return request<Category>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * 删除分类
   */
  static async deleteCategory(id: string | number): Promise<void> {
    return request<void>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 获取标签列表
   */
  static async getTags(): Promise<Tag[]> {
    return request<Tag[]>('/tags');
  }

  /**
   * 获取单个标签
   */
  static async getTag(id: string | number): Promise<Tag> {
    return request<Tag>(`/tags/${id}`);
  }

  /**
   * 创建标签
   */
  static async createTag(data: {
    name: string;
    slug?: string;
    description?: string;
  }): Promise<Tag> {
    return request<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 更新标签
   */
  static async updateTag(
    id: string | number,
    data: Partial<Tag>
  ): Promise<Tag> {
    return request<Tag>(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * 删除标签
   */
  static async deleteTag(id: string | number): Promise<void> {
    return request<void>(`/tags/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * 获取文章评论
   */
  static async getComments(postId: string | number, params: {
    page?: number;
    limit?: number;
    sortBy?: 'latest' | 'oldest' | 'popular';
  } = {}): Promise<{
    comments: Comment[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);

    const query = queryParams.toString();
    return request<{
      comments: Comment[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(
      `/posts/${postId}/comments${query ? `?${query}` : ''}`
    );
  }

  /**
   * 创建评论
   */
  static async createComment(
    postId: string | number,
    data: {
      content: string;
      authorName?: string;
      authorEmail?: string;
      parentId?: string;
    }
  ): Promise<Comment> {
    return request<Comment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * 更新评论
   */
  static async updateComment(
    postId: string | number,
    commentId: string | number,
    data: { content: string }
  ): Promise<Comment> {
    return request<Comment>(
      `/posts/${postId}/comments/${commentId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
  }

  /**
   * 删除评论
   */
  static async deleteComment(
    postId: string | number,
    commentId: string | number
  ): Promise<void> {
    return request<void>(
      `/posts/${postId}/comments/${commentId}`,
      {
        method: 'DELETE',
      }
    );
  }

  /**
   * 点赞评论
   */
  static async likeComment(
    postId: string | number,
    commentId: string | number
  ): Promise<{
    liked: boolean;
    count: number;
  }> {
    return request<{ liked: boolean; count: number }>(
      `/posts/${postId}/comments/${commentId}/like`,
      {
        method: 'POST',
      }
    );
  }

  /**
   * 上传图片
   */
  static async uploadImage(file: File, type: 'featured' | 'content' = 'content'): Promise<{
    url: string;
    name: string;
    size: number;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return request<{ url: string; name: string; size: number }>(
      '/upload/image',
      {
        method: 'POST',
        headers: {},
        body: formData,
      }
    );
  }

  /**
   * 批量上传图片
   */
  static async uploadImages(
    files: File[],
    type: 'featured' | 'content' = 'content'
  ): Promise<Array<{
    url: string;
    name: string;
    size: number;
  }>> {
    const uploadPromises = files.map(file => this.uploadImage(file, type));
    return Promise.all(uploadPromises);
  }

  /**
   * 搜索文章
   */
  static async searchPosts(query: string, params: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
  } = {}): Promise<{
    posts: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return this.getPosts({ ...params, search: query });
  }

  /**
   * 获取相关文章
   */
  static async getRelatedPosts(
    postId: string | number,
    limit: number = 4
  ): Promise<Post[]> {
    return request<Post[]>(`/posts/${postId}/related?limit=${limit}`);
  }

  /**
   * 获取热门文章
   */
  static async getTrendingPosts(limit: number = 10): Promise<Post[]> {
    return request<Post[]>(`/posts/trending?limit=${limit}`);
  }

  /**
   * 获取最新文章
   */
  static async getLatestPosts(limit: number = 10): Promise<Post[]> {
    return request<Post[]>(`/posts/latest?limit=${limit}`);
  }

  /**
   * 获取推荐文章
   */
  static async getRecommendedPosts(limit: number = 10): Promise<Post[]> {
    return request<Post[]>(`/posts/recommended?limit=${limit}`);
  }

  /**
   * 获取文章统计
   */
  static async getPostStats(postId: string | number): Promise<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
  }> {
    return request<{
      views: number;
      likes: number;
      comments: number;
      shares: number;
    }>(`/posts/${postId}/stats`);
  }

  /**
   * 增加浏览量
   */
  static async incrementViews(postId: string | number): Promise<void> {
    return request<void>(`/posts/${postId}/views`, {
      method: 'POST',
    });
  }

  /**
   * 分享文章
   */
  static async sharePost(
    postId: string | number,
    platform: 'twitter' | 'facebook' | 'linkedin' | 'whatsapp'
  ): Promise<{ url: string }> {
    return request<{ url: string }>(
      `/posts/${postId}/share`,
      {
        method: 'POST',
        body: JSON.stringify({ platform }),
      }
    );
  }

  /**
   * 获取作者文章
   */
  static async getAuthorPosts(
    authorId: string | number,
    params: { page?: number; limit?: number } = {}
  ): Promise<{
    posts: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return request<{
      posts: Post[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(
      `/authors/${authorId}/posts${query ? `?${query}` : ''}`
    );
  }

  /**
   * 获取作者信息
   */
  static async getAuthor(authorId: string | number): Promise<User> {
    return request<User>(`/authors/${authorId}`);
  }
}

// 默认导出
export default BlogApiService;
