/**
 * 点赞系统 Hook
 * 提供点赞/取消点赞、获取点赞列表等功能
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  LikeStats,
  LikeUsersResponse,
  LikeTargetType,
  BatchLikeStatus,
} from '@/types/like.types';

const LIKE_QUERY_KEYS = {
  stats: (targetType: LikeTargetType, targetId: string) =>
    ['like', 'stats', targetType, targetId] as const,
  users: (targetType: LikeTargetType, targetId: string, page: number) =>
    ['like', 'users', targetType, targetId, page] as const,
  batch: (targetIds: string[]) => ['like', 'batch', ...targetIds] as const,
};

/**
 * 点赞系统 Hook
 */
export function useLike() {
  const queryClient = useQueryClient();

  // ==================== 查询 ====================

  /**
   * 获取点赞统计
   */
  const useLikeStats = (targetType: LikeTargetType, targetId: string) => {
    return useQuery<LikeStats>({
      queryKey: LIKE_QUERY_KEYS.stats(targetType, targetId),
      queryFn: async () => {
        const response = await apiClient.get(`/api/v1/likes/stats/${targetType}/${targetId}`);
        return response.data;
      },
      enabled: !!targetId,
      staleTime: 1000 * 60 * 5, // 5分钟缓存
    });
  };

  /**
   * 获取点赞用户列表
   */
  const useLikeUsers = (
    targetType: LikeTargetType,
    targetId: string,
    page = 1,
    pageSize = 20
  ) => {
    return useQuery<LikeUsersResponse>({
      queryKey: LIKE_QUERY_KEYS.users(targetType, targetId, page),
      queryFn: async () => {
        const response = await apiClient.get(
          `/api/v1/likes/users/${targetType}/${targetId}`,
          {
            params: { page, page_size: pageSize },
          }
        );
        return response.data;
      },
      enabled: !!targetId,
    });
  };

  /**
   * 批量获取点赞状态
   */
  const useBatchLikeStatus = (targetType: LikeTargetType, targetIds: string[]) => {
    return useQuery<BatchLikeStatus>({
      queryKey: LIKE_QUERY_KEYS.batch(targetIds),
      queryFn: async () => {
        const response = await apiClient.post('/api/v1/likes/batch-status', {
          target_type: targetType,
          target_ids: targetIds,
        });
        return response.data;
      },
      enabled: targetIds.length > 0,
      staleTime: 1000 * 60 * 2, // 2分钟缓存
    });
  };

  // ==================== 变更 ====================

  /**
   * 点赞
   */
  const likeMutation = useMutation({
    mutationFn: async ({ targetType, targetId }: { targetType: LikeTargetType; targetId: string }) => {
      const response = await apiClient.post(`/api/v1/likes/like`, {
        target_type: targetType,
        target_id: targetId,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // 使相关查询失效
      queryClient.invalidateQueries({
        queryKey: ['like', 'stats', variables.targetType, variables.targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ['like', 'users', variables.targetType, variables.targetId],
      });
    },
  });

  /**
   * 取消点赞
   */
  const unlikeMutation = useMutation({
    mutationFn: async ({ targetType, targetId }: { targetType: LikeTargetType; targetId: string }) => {
      const response = await apiClient.delete(`/api/v1/likes/unlike`, {
        data: {
          target_type: targetType,
          target_id: targetId,
        },
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // 使相关查询失效
      queryClient.invalidateQueries({
        queryKey: ['like', 'stats', variables.targetType, variables.targetId],
      });
      queryClient.invalidateQueries({
        queryKey: ['like', 'users', variables.targetType, variables.targetId],
      });
    },
  });

  // ==================== 操作函数 ====================

  /**
   * 点赞
   */
  const like = useCallback(
    async (targetType: LikeTargetType, targetId: string): Promise<boolean> => {
      try {
        await likeMutation.mutateAsync({ targetType, targetId });
        return true;
      } catch (error) {
        console.error('点赞失败:', error);
        return false;
      }
    },
    [likeMutation]
  );

  /**
   * 取消点赞
   */
  const unlike = useCallback(
    async (targetType: LikeTargetType, targetId: string): Promise<boolean> => {
      try {
        await unlikeMutation.mutateAsync({ targetType, targetId });
        return true;
      } catch (error) {
        console.error('取消点赞失败:', error);
        return false;
      }
    },
    [unlikeMutation]
  );

  /**
   * 切换点赞状态
   */
  const toggleLike = useCallback(
    async (targetType: LikeTargetType, targetId: string, isLiked: boolean): Promise<boolean> => {
      if (isLiked) {
        return unlike(targetType, targetId);
      } else {
        return like(targetType, targetId);
      }
    },
    [like, unlike]
  );

  return {
    // 查询 hooks
    useLikeStats,
    useLikeUsers,
    useBatchLikeStatus,

    // 操作函数
    like,
    unlike,
    toggleLike,

    // 状态
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
}

export default useLike;
