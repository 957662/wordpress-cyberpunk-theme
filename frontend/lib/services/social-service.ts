/**
 * 社交服务
 * 处理社交功能相关API调用
 */

import { httpClient } from '../http-client';

export interface UserProfile {
  id: number;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  followers_count: number;
  following_count: number;
  is_following?: boolean;
}

export interface Follow {
  id: number;
  follower_id: number;
  following_id: number;
  created_at: string;
}

export interface FollowerListResponse {
  followers: Array<{
    id: number;
    username: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    followed_at: string;
  }>;
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface FollowingListResponse {
  following: Array<{
    id: number;
    username: string;
    full_name?: string;
    avatar_url?: string;
    bio?: string;
    followed_at: string;
  }>;
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface Activity {
  id: number;
  type: string;
  user_id: number;
  target_user_id?: number;
  target_post_id?: number;
  created_at: string;
}

export class SocialService {
  private baseUrl = '/api/v1/social';

  /**
   * 关注用户
   */
  async followUser(userId: number): Promise<Follow> {
    return await httpClient.post<Follow>(`${this.baseUrl}/follow/${userId}`);
  }

  /**
   * 取消关注用户
   */
  async unfollowUser(userId: number): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/follow/${userId}`);
  }

  /**
   * 检查是否关注用户
   */
  async isFollowing(userId: number): Promise<boolean> {
    try {
      const response = await httpClient.get<{ following: boolean }>(
        `${this.baseUrl}/is-following/${userId}`
      );
      return response.following;
    } catch {
      return false;
    }
  }

  /**
   * 获取粉丝列表
   */
  async getFollowers(
    userId: number,
    page = 1,
    perPage = 20
  ): Promise<FollowerListResponse> {
    return await httpClient.get<FollowerListResponse>(
      `${this.baseUrl}/followers/${userId}`,
      { params: { page, per_page: perPage } }
    );
  }

  /**
   * 获取关注列表
   */
  async getFollowing(
    userId: number,
    page = 1,
    perPage = 20
  ): Promise<FollowingListResponse> {
    return await httpClient.get<FollowingListResponse>(
      `${this.baseUrl}/following/${userId}`,
      { params: { page, per_page: perPage } }
    );
  }

  /**
   * 获取活动动态
   */
  async getActivityFeed(page = 1, perPage = 20): Promise<Activity[]> {
    return await httpClient.get<Activity[]>(`${this.baseUrl}/feed`, {
      params: { page, per_page: perPage },
    });
  }

  /**
   * 点赞文章
   */
  async likePost(postId: number): Promise<{ message: string; liked: boolean }> {
    return await httpClient.post(`${this.baseUrl}/like/${postId}`);
  }

  /**
   * 收藏文章
   */
  async bookmarkPost(postId: number): Promise<{
    message: string;
    bookmarked: boolean;
  }> {
    return await httpClient.post(`${this.baseUrl}/bookmark/${postId}`);
  }

  /**
   * 获取收藏列表
   */
  async getBookmarks(page = 1, perPage = 20): Promise<any[]> {
    return await httpClient.get<any[]>(`${this.baseUrl}/bookmarks`, {
      params: { page, per_page: perPage },
    });
  }

  /**
   * 获取推荐用户
   */
  async getRecommendedUsers(limit = 10): Promise<UserProfile[]> {
    return await httpClient.get<UserProfile[]>(`${this.baseUrl}/recommendations/users`, {
      params: { limit },
    });
  }

  /**
   * 获取用户社交统计
   */
  async getSocialStats(userId: number): Promise<{
    user_id: number;
    followers_count: number;
    following_count: number;
  }> {
    return await httpClient.get(`${this.baseUrl}/stats/${userId}`);
  }

  /**
   * 搜索用户
   */
  async searchUsers(query: string, page = 1, perPage = 20): Promise<{
    users: UserProfile[];
    total: number;
  }> {
    return await httpClient.get(`${this.baseUrl}/search`, {
      params: { q: query, page, per_page: perPage },
    });
  }
}

// 导出单例
export const socialService = new SocialService();
