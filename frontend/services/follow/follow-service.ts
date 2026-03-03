/**
 * 关注服务
 * 处理用户关注、取消关注、粉丝列表等操作
 */

import { apiClient } from '../api-client';
import {
  Follow,
  FollowStatus,
  FollowRequest,
  UnfollowRequest,
  FollowersResponse,
  FollowingResponse,
  FollowActionResult,
} from '../../types/follow.types';

class FollowService {
  private readonly baseUrl = '/api/follow';

  /**
   * 关注用户
   */
  async followUser(request: FollowRequest): Promise<FollowActionResult> {
    try {
      const response = await apiClient.post<FollowActionResult>(
        `${this.baseUrl}/follow`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Failed to follow user:', error);
      throw error;
    }
  }

  /**
   * 取消关注用户
   */
  async unfollowUser(request: UnfollowRequest): Promise<FollowActionResult> {
    try {
      const response = await apiClient.post<FollowActionResult>(
        `${this.baseUrl}/unfollow`,
        request
      );
      return response.data;
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      throw error;
    }
  }

  /**
   * 切换关注状态
   */
  async toggleFollow(userId: string): Promise<FollowActionResult> {
    try {
      const response = await apiClient.post<FollowActionResult>(
        `${this.baseUrl}/toggle`,
        { followingId: userId }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      throw error;
    }
  }

  /**
   * 获取关注状态
   */
  async getFollowStatus(userId: string): Promise<FollowStatus> {
    try {
      const response = await apiClient.get<FollowStatus>(
        `${this.baseUrl}/status/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get follow status:', error);
      throw error;
    }
  }

  /**
   * 获取粉丝列表
   */
  async getFollowers(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<FollowersResponse> {
    try {
      const response = await apiClient.get<FollowersResponse>(
        `${this.baseUrl}/followers/${userId}`,
        { params: { page, pageSize } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get followers:', error);
      throw error;
    }
  }

  /**
   * 获取关注列表
   */
  async getFollowing(
    userId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<FollowingResponse> {
    try {
      const response = await apiClient.get<FollowingResponse>(
        `${this.baseUrl}/following/${userId}`,
        { params: { page, pageSize } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get following:', error);
      throw error;
    }
  }

  /**
   * 批量获取关注状态
   */
  async getBatchFollowStatus(userIds: string[]): Promise<Record<string, boolean>> {
    try {
      const response = await apiClient.post<Record<string, boolean>>(
        `${this.baseUrl}/status/batch`,
        { userIds }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get batch follow status:', error);
      throw error;
    }
  }

  /**
   * 搜索关注用户
   */
  async searchFollowers(
    userId: string,
    query: string,
    page: number = 1
  ): Promise<FollowersResponse> {
    try {
      const response = await apiClient.get<FollowersResponse>(
        `${this.baseUrl}/followers/${userId}/search`,
        { params: { query, page } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to search followers:', error);
      throw error;
    }
  }

  /**
   * 搜索关注的用户
   */
  async searchFollowing(
    userId: string,
    query: string,
    page: number = 1
  ): Promise<FollowingResponse> {
    try {
      const response = await apiClient.get<FollowingResponse>(
        `${this.baseUrl}/following/${userId}/search`,
        { params: { query, page } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to search following:', error);
      throw error;
    }
  }

  /**
   * 移除粉丝
   */
  async removeFollower(followerId: string): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.delete<{ success: boolean }>(
        `${this.baseUrl}/followers/${followerId}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to remove follower:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const followService = new FollowService();
