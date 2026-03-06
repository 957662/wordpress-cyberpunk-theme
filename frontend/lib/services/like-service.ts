/**
 * 点赞服务
 * 处理点赞相关的API调用
 */

import { httpClient } from '../http-client';
import {
  CreateLikeRequest,
  LikeResponse,
  LikeStatusResponse,
  LikeStatsResponse,
  LikeListResponse,
  LikeTargetType,
} from '@/types/like.types';

export class LikeService {
  private baseUrl = '/api/v1/likes';

  /**
   * 创建点赞
   */
  async createLike(request: CreateLikeRequest): Promise<LikeResponse> {
    return await httpClient.post<LikeResponse>(this.baseUrl, {
      target_type: request.target_type,
      target_id: String(request.target_id),
    });
  }

  /**
   * 取消点赞
   */
  async deleteLike(targetType: LikeTargetType, targetId: string | number): Promise<void> {
    await httpClient.delete(`${this.baseUrl}/${targetType}/${targetId}`);
  }

  /**
   * 切换点赞状态
   */
  async toggleLike(targetType: LikeTargetType, targetId: string | number): Promise<LikeStatusResponse> {
    return await httpClient.post<LikeStatusResponse>(`${this.baseUrl}/toggle/${targetType}/${targetId}`);
  }

  /**
   * 获取点赞状态
   */
  async getLikeStatus(targetType: LikeTargetType, targetId: string | number): Promise<LikeStatusResponse> {
    return await httpClient.get<LikeStatusResponse>(`${this.baseUrl}/status/${targetType}/${targetId}`);
  }

  /**
   * 获取点赞数量（公开接口）
   */
  async getLikeCount(targetType: LikeTargetType, targetId: string | number): Promise<{ count: number }> {
    return await httpClient.get<{ count: number }>(`${this.baseUrl}/count/${targetType}/${targetId}`);
  }

  /**
   * 获取我的点赞列表
   */
  async getMyLikes(skip = 0, limit = 20): Promise<LikeListResponse> {
    return await httpClient.get<LikeListResponse>(`${this.baseUrl}/my`, {
      params: { skip, limit },
    });
  }

  /**
   * 获取目标的点赞列表（公开接口）
   */
  async getTargetLikes(targetType: LikeTargetType, targetId: string | number, skip = 0, limit = 20): Promise<LikeListResponse> {
    return await httpClient.get<LikeListResponse>(`${this.baseUrl}/target/${targetType}/${targetId}`, {
      params: { skip, limit },
    });
  }

  /**
   * 获取点赞统计（公开接口）
   */
  async getLikeStats(): Promise<LikeStatsResponse> {
    return await httpClient.get<LikeStatsResponse>(`${this.baseUrl}/stats`);
  }

  /**
   * 批量获取点赞状态
   */
  async getBatchLikeStatus(targets: Array<{ targetType: LikeTargetType; targetId: string | number }>): Promise<Map<string, boolean>> {
    // 注意：如果后端不支持批量接口，可以使用 Promise.all 并行请求
    const promises = targets.map(({ targetType, targetId }) =>
      this.getLikeStatus(targetType, targetId).then(res => ({
        key: `${targetType}:${targetId}`,
        isLiked: res.is_liked,
      }))
    );

    const results = await Promise.all(promises);
    const statusMap = new Map<string, boolean>();

    results.forEach(({ key, isLiked }) => {
      statusMap.set(key, isLiked);
    });

    return statusMap;
  }
}

// 导出单例
export const likeService = new LikeService();
