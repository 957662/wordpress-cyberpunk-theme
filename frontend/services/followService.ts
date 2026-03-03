/**
 * 用户关注服务
 * 处理用户关注/取消关注、获取粉丝列表等功能
 */

import { apiClient } from '@/lib/api-client';

export interface FollowStats {
  followingCount: number;
  followerCount: number;
  isFollowing: boolean;
}

export interface UserFollow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower: {
    id: string;
    username: string;
    avatar?: string;
    displayName?: string;
  };
}

export interface FollowListResponse {
  items: UserFollow[];
  total: number;
  page: number;
  pageSize: number;
}

class FollowService {
  private baseUrl = '/api/follow';

  /**
   * 关注用户
   */
  async followUser(userId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${userId}`);
  }

  /**
   * 取消关注用户
   */
  async unfollowUser(userId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${userId}`);
  }

  /**
   * 切换关注状态
   */
  async toggleFollow(userId: string, isCurrentlyFollowing: boolean): Promise<boolean> {
    if (isCurrentlyFollowing) {
      await this.unfollowUser(userId);
      return false;
    } else {
      await this.followUser(userId);
      return true;
    }
  }

  /**
   * 获取用户的关注统计
   */
  async getFollowStats(userId: string): Promise<FollowStats> {
    const response = await apiClient.get<FollowStats>(`${this.baseUrl}/${userId}/stats`);
    return response.data;
  }

  /**
   * 获取用户的关注列表（我关注的人）
   */
  async getFollowingList(
    userId: string,
    page = 1,
    pageSize = 20
  ): Promise<FollowListResponse> {
    const response = await apiClient.get<FollowListResponse>(
      `${this.baseUrl}/${userId}/following`,
      { params: { page, pageSize } }
    );
    return response.data;
  }

  /**
   * 获取用户的粉丝列表（关注我的人）
   */
  async getFollowersList(
    userId: string,
    page = 1,
    pageSize = 20
  ): Promise<FollowListResponse> {
    const response = await apiClient.get<FollowListResponse>(
      `${this.baseUrl}/${userId}/followers`,
      { params: { page, pageSize } }
    );
    return response.data;
  }

  /**
   * 批量关注用户
   */
  async batchFollow(userIds: string[]): Promise<void> {
    await apiClient.post(`${this.baseUrl}/batch`, { userIds });
  }

  /**
   * 批量取消关注
   */
  async batchUnfollow(userIds: string[]): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/batch`, { data: { userIds } });
  }
}

export const followService = new FollowService();
