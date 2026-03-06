/**
 * 文章服务
 * 处理文章相关API调用
 */

import { httpClient } from '../http-client';

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  author_id: number;
  category_id?: number;
  status: string;
  is_featured: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: number;
    username: string;
    full_name?: string;
    avatar_url?: string;
  };
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface PostCreate {
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category_id?: number;
  status?: string;
  is_featured?: boolean;
  comment_status?: string;
  tags?: number[];
}

export interface PostUpdate {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  category_id?: number;
  status?: string;
  is_featured?: boolean;
  comment_status?: string;
  tags?: number[];
}

export class PostService {
  private baseUrl = '/api/v1/posts';

  /**
   * 获取文章列表
   */
  async getPosts(params?: {
    page?: number;
    per_page?: number;
    category_id?: number;
    tag_id?: number;
    status?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<PostListResponse> {
    return await httpClient.get<PostListResponse>(this.baseUrl, { params });
  }

  /**
   * 获取文章详情
   */
  async getPostById(id: number): Promise<Post> {
    return await httpClient.get<Post>(`${this.baseUrl}/${id}`);
  }

  /**
   * 根据slug获取文章
   */
  async getPostBySlug(slug: string): Promise<Post> {
    return await httpClient.get<Post>(`${this.baseUrl}/slug/${slug}`);
  }

  /**
   * 获取精选文章
   */
  async getFeaturedPosts(limit = 5): Promise<Post[]> {
    return await httpClient.get<Post[]>(`${this.baseUrl}/featured`, {
      params: { limit },
    });
  }

  /**
   * 获取热门文章
   */
  async getTrendingPosts(limit = 10, days = 7): Promise<Post[]> {
    return await httpClient.get<Post[]>(`${this.baseUrl}/trending`, {
      params: { limit, days },
    });
  }

  /**
   * 获取相关文章
   */
  async getRelatedPosts(postId: number, limit = 5): Promise<Post[]> {
    return await httpClient.get<Post[]>(`${this.baseUrl}/related/${postId}`, {
      params: { limit },
    });
  }

  /**
   * 搜索文章
   */
  async searchPosts(query: string, params?: {
    page?: number;
    per_page?: number;
    category_id?: number;
    tag_id?: number;
  }): Promise<PostListResponse> {
    return await httpClient.get<PostListResponse>(`${this.baseUrl}/search`, {
      params: { q: query, ...params },
    });
  }

  /**
   * 创建文章
   */
  async createPost(data: PostCreate): Promise<Post> {
    return await httpClient.post<Post>(this.baseUrl, data);
  }

  /**
   * 更新文章
   */
  async updatePost(id: number, data: PostUpdate): Promise<Post> {
    return await httpClient.put<Post>(`${this.baseUrl}/${id}`, data);
  }

  /**
   * 删除文章
   */
  async deletePost(id: number): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * 点赞文章
   */
  async likePost(id: number): Promise<Post> {
    return await httpClient.post<Post>(`${this.baseUrl}/${id}/like`);
  }

  /**
   * 收藏文章
   */
  async bookmarkPost(id: number): Promise<void> {
    await httpClient.post(`${this.baseUrl}/${id}/bookmark`);
  }

  /**
   * 获取作者的文章
   */
  async getPostsByAuthor(
    authorId: number,
    page = 1,
    perPage = 10
  ): Promise<PostListResponse> {
    return await httpClient.get<PostListResponse>(`${this.baseUrl}/author/${authorId}`, {
      params: { page, per_page: perPage },
    });
  }
}

// 导出单例
export const postService = new PostService();
