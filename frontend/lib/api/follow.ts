/**
 * Follow API Client
 * 关注相关的 API 客户端
 */

import { apiClient } from './client';

export interface FollowStats {
  followers_count: number;
  following_count: number;
}

export interface FollowStatus {
  is_following: boolean;
  is_followed_by: boolean;
}

export interface FollowerInfo {
  id: number;
  user_id: number;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  followed_at: string;
}

export interface FollowersListResponse {
  followers: FollowerInfo[];
  total: number;
  page: number;
  page_size: number;
}

export interface FollowingListResponse {
  following: FollowerInfo[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * 关注 API 客户端
 */
export const followApi = {
  /**
   * 关注用户
   */
  async followUser(userId: number): Promise<void> {
    await apiClient.post(`/follows/follow/${userId}`);
  },

  /**
   * 取消关注用户
   */
  async unfollowUser(userId: number): Promise<void> {
    await apiClient.delete(`/follows/unfollow/${userId}`);
  },

  /**
   * 检查关注状态
   */
  async checkFollowStatus(userId: number): Promise<FollowStatus> {
    return await apiClient.get<FollowStatus>(`/follows/check/${userId}`);
  },

  /**
   * 获取粉丝列表
   */
  async getFollowers(
    userId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<FollowersListResponse> {
    return await apiClient.get<FollowersListResponse>(
      `/follows/followers/${userId}`,
      { params: { page, page_size: pageSize } }
    );
  },

  /**
   * 获取关注列表
   */
  async getFollowing(
    userId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<FollowingListResponse> {
    return await apiClient.get<FollowingListResponse>(
      `/follows/following/${userId}`,
      { params: { page, page_size: pageSize } }
    );
  },

  /**
   * 获取关注统计
   */
  async getFollowStats(userId: number): Promise<FollowStats> {
    return await apiClient.get<FollowStats>(`/follows/stats/${userId}`);
  },

  /**
   * 获取当前用户的关注列表
   */
  async getMyFollowing(
    page: number = 1,
    pageSize: number = 20
  ): Promise<FollowingListResponse> {
    return await apiClient.get<FollowingListResponse>('/follows/me/following', {
      params: { page, page_size: pageSize },
    });
  },

  /**
   * 获取当前用户的粉丝列表
   */
  async getMyFollowers(
    page: number = 1,
    pageSize: number = 20
  ): Promise<FollowersListResponse> {
    return await apiClient.get<FollowersListResponse>('/follows/me/followers', {
      params: { page, page_size: pageSize },
    });
  },
};
