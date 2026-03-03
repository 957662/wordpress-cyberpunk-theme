/**
 * 点赞服务
 * 处理点赞、取消点赞、点赞统计等操作
 */

import { apiClient } from '../api-client';
import {
  Like,
  LikeStats,
  LikeRequest,
  UnlikeRequest,
  LikeUsersResponse,
  BatchLikeStatus,
  LikeTargetType,
} from '../../types/like.types';

class LikeService {
  private readonly baseUrl = '/api/likes';
  private cache: Map<string, LikeStats> = new Map();
  private cacheExpiry: number = 5 * 60 * 1000; // 5分钟缓存

  /**
   * 点赞
   */
  async like(request: LikeRequest): Promise<Like> {
    try {
      const response = await apiClient.post<Like>(`${this.baseUrl}/like`, request);
      this.invalidateCache(request.targetType, request.targetId);
      return response.data;
    } catch (error) {
      console.error('Failed to like:', error);
      throw error;
    }
  }

  /**
   * 取消点赞
   */
  async unlike(request: UnlikeRequest): Promise<{ success: boolean }> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        `${this.baseUrl}/unlike`,
        request
      );
      this.invalidateCache(request.targetType, request.targetId);
      return response.data;
    } catch (error) {
      console.error('Failed to unlike:', error);
      throw error;
    }
  }

  /**
   * 切换点赞状态
   */
  async toggleLike(targetType: LikeTargetType, targetId: string): Promise<LikeStats> {
    try {
      const response = await apiClient.post<LikeStats>(
        `${this.baseUrl}/toggle`,
        { targetType, targetId }
      );
      this.invalidateCache(targetType, targetId);
      return response.data;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  }

  /**
   * 获取点赞统计
   */
  async getLikeStats(
    targetType: LikeTargetType,
    targetId: string
  ): Promise<LikeStats> {
    try {
      const cacheKey = `${targetType}:${targetId}`;
      const cached = this.cache.get(cacheKey);

      if (cached) {
        return cached;
      }

      const response = await apiClient.get<LikeStats>(
        `${this.baseUrl}/stats/${targetType}/${targetId}`
      );

      this.cache.set(cacheKey, response.data);

      // 设置缓存过期
      setTimeout(() => {
        this.cache.delete(cacheKey);
      }, this.cacheExpiry);

      return response.data;
    } catch (error) {
      console.error('Failed to get like stats:', error);
      throw error;
    }
  }

  /**
   * 批量获取点赞统计
   */
  async getBatchLikeStats(
    items: Array<{ targetType: LikeTargetType; targetId: string }>
  ): Promise<BatchLikeStatus> {
    try {
      const response = await apiClient.post<BatchLikeStatus>(
        `${this.baseUrl}/stats/batch`,
        { items }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get batch like stats:', error);
      throw error;
    }
  }

  /**
   * 获取点赞用户列表
   */
  async getLikeUsers(
    targetType: LikeTargetType,
    targetId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<LikeUsersResponse> {
    try {
      const response = await apiClient.get<LikeUsersResponse>(
        `${this.baseUrl}/users/${targetType}/${targetId}`,
        { params: { page, pageSize } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get like users:', error);
      throw error;
    }
  }

  /**
   * 检查是否已点赞
   */
  async isLiked(targetType: LikeTargetType, targetId: string): Promise<boolean> {
    try {
      const stats = await this.getLikeStats(targetType, targetId);
      return stats.isLiked;
    } catch (error) {
      console.error('Failed to check like status:', error);
      return false;
    }
  }

  /**
   * 获取用户的点赞历史
   */
  async getUserLikes(
    targetType?: LikeTargetType,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ likes: Like[]; total: number }> {
    try {
      const response = await apiClient.get<{ likes: Like[]; total: number }>(
        `${this.baseUrl}/user/likes`,
        { params: { targetType, page, pageSize } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get user likes:', error);
      throw error;
    }
  }

  /**
   * 清除缓存
   */
  private invalidateCache(targetType: LikeTargetType, targetId: string): void {
    const cacheKey = `${targetType}:${targetId}`;
    this.cache.delete(cacheKey);
  }

  /**
   * 清除所有缓存
   */
  clearAllCache(): void {
    this.cache.clear();
  }
}

// 导出单例实例
export const likeService = new LikeService();
