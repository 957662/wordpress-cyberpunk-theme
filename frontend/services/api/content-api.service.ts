/**
 * Content API Service
 * 内容管理API服务
 */

import { api } from '@/lib/api-client';
import type {
  Post,
  PostListItem,
  Category,
  Tag,
  Comment,
  PaginatedResponse,
  ApiResponse,
} from '@/types';

export class ContentApiService {
  private baseUrl = '/api/v1';

  // ==================== 文章相关 ====================

  /**
   * 获取文章列表
   */
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    category?: string;
    tag?: string;
    author?: string;
    search?: string;
    sort?: 'latest' | 'popular' | 'trending';
    status?: 'draft' | 'published' | 'all';
  }): Promise<ApiResponse<PaginatedResponse<PostListItem>>> {
    return api.get(`${this.baseUrl}/posts`, { params });
  }

  /**
   * 根据slug获取文章
   */
  async getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
    return api.get(`${this.baseUrl}/posts/slug/${slug}`);
  }

  /**
   * 根据ID获取文章
   */
  async getPostById(id: string): Promise<ApiResponse<Post>> {
    return api.get(`${this.baseUrl}/posts/${id}`);
  }

  /**
   * 创建文章
   */
  async createPost(data: {
    title: string;
    content: string;
    excerpt?: string;
    cover_image?: string;
    category_id: string;
    tags: string[];
    status: 'draft' | 'published';
    featured?: boolean;
  }): Promise<ApiResponse<Post>> {
    return api.post(`${this.baseUrl}/posts`, data);
  }

  /**
   * 更新文章
   */
  async updatePost(
    id: string,
    data: Partial<{
      title: string;
      content: string;
      excerpt: string;
      cover_image: string;
      category_id: string;
      tags: string[];
      status: 'draft' | 'published';
      featured: boolean;
    }>
  ): Promise<ApiResponse<Post>> {
    return api.patch(`${this.baseUrl}/posts/${id}`, data);
  }

  /**
   * 删除文章
   */
  async deletePost(id: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/posts/${id}`);
  }

  /**
   * 发布文章
   */
  async publishPost(id: string): Promise<ApiResponse<Post>> {
    return api.post(`${this.baseUrl}/posts/${id}/publish`);
  }

  /**
   * 取消发布文章
   */
  async unpublishPost(id: string): Promise<ApiResponse<Post>> {
    return api.post(`${this.baseUrl}/posts/${id}/unpublish`);
  }

  /**
   * 获取精选文章
   */
  async getFeaturedPosts(limit?: number): Promise<ApiResponse<PostListItem[]>> {
    return api.get(`${this.baseUrl}/posts/featured`, { params: { limit } });
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(postId: string, limit?: number): Promise<ApiResponse<PostListItem[]>> {
    return api.get(`${this.baseUrl}/posts/${postId}/related`, { params: { limit } });
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params?: {
    page?: number;
    per_page?: number;
    category?: string;
    tags?: string[];
  }): Promise<ApiResponse<PaginatedResponse<PostListItem>>> {
    return api.get(`${this.baseUrl}/posts/search`, {
      params: { q: query, ...params },
    });
  }

  // ==================== 分类相关 ====================

  /**
   * 获取所有分类
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return api.get(`${this.baseUrl}/categories`);
  }

  /**
   * 根据slug获取分类
   */
  async getCategoryBySlug(slug: string): Promise<ApiResponse<Category>> {
    return api.get(`${this.baseUrl}/categories/slug/${slug}`);
  }

  /**
   * 获取分类下的文章
   */
  async getCategoryPosts(
    slug: string,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResponse<PaginatedResponse<PostListItem>>> {
    return api.get(`${this.baseUrl}/categories/slug/${slug}/posts`, { params });
  }

  /**
   * 创建分类
   */
  async createCategory(data: {
    name: string;
    slug?: string;
    description?: string;
    parent_id?: string;
  }): Promise<ApiResponse<Category>> {
    return api.post(`${this.baseUrl}/categories`, data);
  }

  /**
   * 更新分类
   */
  async updateCategory(
    id: string,
    data: {
      name?: string;
      description?: string;
      parent_id?: string;
    }
  ): Promise<ApiResponse<Category>> {
    return api.patch(`${this.baseUrl}/categories/${id}`, data);
  }

  /**
   * 删除分类
   */
  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/categories/${id}`);
  }

  // ==================== 标签相关 ====================

  /**
   * 获取所有标签
   */
  async getTags(): Promise<ApiResponse<Tag[]>> {
    return api.get(`${this.baseUrl}/tags`);
  }

  /**
   * 获取热门标签
   */
  async getPopularTags(limit?: number): Promise<ApiResponse<Tag[]>> {
    return api.get(`${this.baseUrl}/tags/popular`, { params: { limit } });
  }

  /**
   * 根据slug获取标签
   */
  async getTagBySlug(slug: string): Promise<ApiResponse<Tag>> {
    return api.get(`${this.baseUrl}/tags/slug/${slug}`);
  }

  /**
   * 获取标签下的文章
   */
  async getTagPosts(
    slug: string,
    params?: { page?: number; per_page?: number }
  ): Promise<ApiResponse<PaginatedResponse<PostListItem>>> {
    return api.get(`${this.baseUrl}/tags/slug/${slug}/posts`, { params });
  }

  /**
   * 创建标签
   */
  async createTag(data: {
    name: string;
    slug?: string;
    description?: string;
  }): Promise<ApiResponse<Tag>> {
    return api.post(`${this.baseUrl}/tags`, data);
  }

  /**
   * 更新标签
   */
  async updateTag(
    id: string,
    data: {
      name?: string;
      description?: string;
    }
  ): Promise<ApiResponse<Tag>> {
    return api.patch(`${this.baseUrl}/tags/${id}`, data);
  }

  /**
   * 删除标签
   */
  async deleteTag(id: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/tags/${id}`);
  }

  // ==================== 评论相关 ====================

  /**
   * 获取文章评论
   */
  async getPostComments(
    postId: string,
    params?: { page?: number; per_page?: number; parent_id?: string }
  ): Promise<ApiResponse<PaginatedResponse<Comment>>> {
    return api.get(`${this.baseUrl}/comments/post/${postId}`, { params });
  }

  /**
   * 创建评论
   */
  async createComment(data: {
    post_id: string;
    content: string;
    parent_id?: string;
  }): Promise<ApiResponse<Comment>> {
    return api.post(`${this.baseUrl}/comments`, data);
  }

  /**
   * 更新评论
   */
  async updateComment(
    id: string,
    content: string
  ): Promise<ApiResponse<Comment>> {
    return api.patch(`${this.baseUrl}/comments/${id}`, { content });
  }

  /**
   * 删除评论
   */
  async deleteComment(id: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/comments/${id}`);
  }

  /**
   * 点赞评论
   */
  async likeComment(id: string): Promise<ApiResponse<void>> {
    return api.post(`${this.baseUrl}/comments/${id}/like`);
  }

  /**
   * 取消点赞评论
   */
  async unlikeComment(id: string): Promise<ApiResponse<void>> {
    return api.delete(`${this.baseUrl}/comments/${id}/like`);
  }

  // ==================== 全局搜索 ====================

  /**
   * 全局搜索
   */
  async globalSearch(query: string, filters?: {
    type?: 'all' | 'posts' | 'users' | 'tags';
    category?: string;
  }): Promise<ApiResponse<{
    posts: PostListItem[];
    tags: Tag[];
    total: number;
  }>> {
    return api.get(`${this.baseUrl}/search`, {
      params: { q: query, ...filters },
    });
  }

  /**
   * 获取搜索建议
   */
  async getSearchSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return api.get(`${this.baseUrl}/search/suggestions`, {
      params: { q: query },
    });
  }
}

// 导出单例
export const contentApiService = new ContentApiService();

// 导出便捷函数
export const contentApi = {
  // 文章
  getPosts: (params?: any) => contentApiService.getPosts(params),
  getPostBySlug: (slug: string) => contentApiService.getPostBySlug(slug),
  getPostById: (id: string) => contentApiService.getPostById(id),
  createPost: (data: any) => contentApiService.createPost(data),
  updatePost: (id: string, data: any) =>
    contentApiService.updatePost(id, data),
  deletePost: (id: string) => contentApiService.deletePost(id),
  publishPost: (id: string) => contentApiService.publishPost(id),
  unpublishPost: (id: string) => contentApiService.unpublishPost(id),
  getFeaturedPosts: (limit?: number) =>
    contentApiService.getFeaturedPosts(limit),
  getRelatedPosts: (postId: string, limit?: number) =>
    contentApiService.getRelatedPosts(postId, limit),
  searchPosts: (query: string, params?: any) =>
    contentApiService.searchPosts(query, params),

  // 分类
  getCategories: () => contentApiService.getCategories(),
  getCategoryBySlug: (slug: string) =>
    contentApiService.getCategoryBySlug(slug),
  getCategoryPosts: (slug: string, params?: any) =>
    contentApiService.getCategoryPosts(slug, params),
  createCategory: (data: any) => contentApiService.createCategory(data),
  updateCategory: (id: string, data: any) =>
    contentApiService.updateCategory(id, data),
  deleteCategory: (id: string) => contentApiService.deleteCategory(id),

  // 标签
  getTags: () => contentApiService.getTags(),
  getPopularTags: (limit?: number) =>
    contentApiService.getPopularTags(limit),
  getTagBySlug: (slug: string) => contentApiService.getTagBySlug(slug),
  getTagPosts: (slug: string, params?: any) =>
    contentApiService.getTagPosts(slug, params),
  createTag: (data: any) => contentApiService.createTag(data),
  updateTag: (id: string, data: any) =>
    contentApiService.updateTag(id, data),
  deleteTag: (id: string) => contentApiService.deleteTag(id),

  // 评论
  getPostComments: (postId: string, params?: any) =>
    contentApiService.getPostComments(postId, params),
  createComment: (data: any) => contentApiService.createComment(data),
  updateComment: (id: string, content: string) =>
    contentApiService.updateComment(id, content),
  deleteComment: (id: string) => contentApiService.deleteComment(id),
  likeComment: (id: string) => contentApiService.likeComment(id),
  unlikeComment: (id: string) => contentApiService.unlikeComment(id),

  // 搜索
  globalSearch: (query: string, filters?: any) =>
    contentApiService.globalSearch(query, filters),
  getSearchSuggestions: (query: string) =>
    contentApiService.getSearchSuggestions(query),
};

export default contentApiService;
