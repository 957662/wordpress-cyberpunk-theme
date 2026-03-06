/**
 * 社交服务 - 封装所有社交功能相关的 API 调用
 */

import { Like, Bookmark, Follow, Comment } from '@/types';

export interface ToggleLikeResponse {
  liked: boolean;
  likesCount: number;
}

export interface ToggleBookmarkResponse {
  bookmarked: boolean;
}

export interface ToggleFollowResponse {
  following: boolean;
  followersCount: number;
}

class SocialService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  }

  /**
   * 获取认证令牌
   */
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  /**
   * 发起认证请求
   */
  private async authRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = this.getAuthToken();

    return fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  }

  /**
   * 点赞/取消点赞文章
   */
  async toggleLike(postId: string | number): Promise<ToggleLikeResponse> {
    const response = await this.authRequest('/social/likes', {
      method: 'POST',
      body: JSON.stringify({ post_id: postId }),
    });

    if (!response.ok) {
      throw new Error('操作失败');
    }

    return await response.json();
  }

  /**
   * 检查是否已点赞
   */
  async checkLike(postId: string | number): Promise<boolean> {
    const response = await this.authRequest(`/social/likes/check?post_id=${postId}`);

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.liked || false;
  }

  /**
   * 获取点赞列表
   */
  async getLikes(postId: string | number): Promise<Like[]> {
    const response = await this.authRequest(`/social/likes?post_id=${postId}`);

    if (!response.ok) {
      throw new Error('获取点赞列表失败');
    }

    return await response.json();
  }

  /**
   * 收藏/取消收藏文章
   */
  async toggleBookmark(postId: string | number): Promise<ToggleBookmarkResponse> {
    const response = await this.authRequest('/social/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ post_id: postId }),
    });

    if (!response.ok) {
      throw new Error('操作失败');
    }

    return await response.json();
  }

  /**
   * 检查是否已收藏
   */
  async checkBookmark(postId: string | number): Promise<boolean> {
    const response = await this.authRequest(
      `/social/bookmarks/check?post_id=${postId}`
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.bookmarked || false;
  }

  /**
   * 获取收藏列表
   */
  async getBookmarks(params: { page?: number; perPage?: number } = {}): Promise<{
    bookmarks: Bookmark[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, perPage = 20 } = params;
    const response = await this.authRequest(
      `/social/bookmarks?page=${page}&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error('获取收藏列表失败');
    }

    return await response.json();
  }

  /**
   * 关注/取消关注用户
   */
  async toggleFollow(userId: string | number): Promise<ToggleFollowResponse> {
    const response = await this.authRequest('/social/follows', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });

    if (!response.ok) {
      throw new Error('操作失败');
    }

    return await response.json();
  }

  /**
   * 检查是否已关注
   */
  async checkFollow(userId: string | number): Promise<boolean> {
    const response = await this.authRequest(`/social/follows/check?user_id=${userId}`);

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.following || false;
  }

  /**
   * 获取关注列表
   */
  async getFollowing(params: { page?: number; perPage?: number } = {}): Promise<{
    users: any[];
    total: number;
    page: number;
  }> {
    const { page = 1, perPage = 20 } = params;
    const response = await this.authRequest(
      `/social/follows/following?page=${page}&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error('获取关注列表失败');
    }

    return await response.json();
  }

  /**
   * 获取粉丝列表
   */
  async getFollowers(params: { page?: number; perPage?: number } = {}): Promise<{
    users: any[];
    total: number;
    page: number;
  }> {
    const { page = 1, perPage = 20 } = params;
    const response = await this.authRequest(
      `/social/follows/followers?page=${page}&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error('获取粉丝列表失败');
    }

    return await response.json();
  }

  /**
   * 发表评论
   */
  async createComment(data: {
    postId: string | number;
    content: string;
    parentId?: string | number;
  }): Promise<Comment> {
    const response = await this.authRequest('/social/comments', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('发表评论失败');
    }

    return await response.json();
  }

  /**
   * 获取评论列表
   */
  async getComments(
    postId: string | number,
    params: { page?: number; perPage?: number; parent?: number } = {}
  ): Promise<{
    comments: Comment[];
    total: number;
    page: number;
  }> {
    const { page = 1, perPage = 20, parent = 0 } = params;
    const response = await this.authRequest(
      `/social/comments?post_id=${postId}&page=${page}&per_page=${perPage}&parent=${parent}`
    );

    if (!response.ok) {
      throw new Error('获取评论失败');
    }

    return await response.json();
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId: string | number): Promise<void> {
    const response = await this.authRequest(`/social/comments/${commentId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('删除评论失败');
    }
  }

  /**
   * 点赞评论
   */
  async likeComment(commentId: string | number): Promise<void> {
    const response = await this.authRequest(`/social/comments/${commentId}/like`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('操作失败');
    }
  }

  /**
   * 获取用户统计
   */
  async getUserStats(userId: string | number): Promise<{
    posts: number;
    comments: number;
    likes: number;
    followers: number;
    following: number;
  }> {
    const response = await this.authRequest(`/social/users/${userId}/stats`);

    if (!response.ok) {
      throw new Error('获取统计失败');
    }

    return await response.json();
  }

  /**
   * 获取活动流
   */
  async getActivityFeed(params: { page?: number; perPage?: number } = {}): Promise<{
    activities: any[];
    total: number;
    page: number;
  }> {
    const { page = 1, perPage = 20 } = params;
    const response = await this.authRequest(
      `/social/activity?page=${page}&per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error('获取活动流失败');
    }

    return await response.json();
  }
}

// 导出单例
export const socialService = new SocialService();
export default socialService;
