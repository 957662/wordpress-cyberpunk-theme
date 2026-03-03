/**
 * 点赞系统相关 Hooks
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { likeService } from '../../services/like/like-service';
import {
  LikeStats,
  LikeUsersResponse,
  BatchLikeStatus,
  LikeTargetType,
} from '../../types/like.types';

/**
 * 点赞统计 Hook
 */
export function useLikeStats(targetType: LikeTargetType, targetId: string) {
  const queryClient = useQueryClient();

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['like-stats', targetType, targetId],
    queryFn: () => likeService.getLikeStats(targetType, targetId),
    enabled: !!targetId,
    staleTime: 2 * 60 * 1000, // 2分钟缓存
  });

  const toggleLikeMutation = useMutation({
    mutationFn: () => likeService.toggleLike(targetType, targetId),
    onSuccess: (newStats) => {
      // 更新缓存
      queryClient.setQueryData(['like-stats', targetType, targetId], newStats);
    },
  });

  const toggleLike = useCallback(() => {
    toggleLikeMutation.mutate();
  }, [toggleLikeMutation]);

  return {
    count: stats?.count ?? 0,
    isLiked: stats?.isLiked ?? false,
    recentUsers: stats?.recentUsers ?? [],
    isLoading,
    error,
    toggleLike,
    isPending: toggleLikeMutation.isPending,
  };
}

/**
 * 批量点赞状态 Hook
 */
export function useBatchLikeStats(
  items: Array<{ targetType: LikeTargetType; targetId: string }>
) {
  const {
    data: likeStatuses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['like-stats-batch', items],
    queryFn: () => likeService.getBatchLikeStats(items),
    enabled: items.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  return {
    likeStatuses: likeStatuses ?? {},
    isLoading,
    error,
  };
}

/**
 * 点赞用户列表 Hook
 */
export function useLikeUsers(
  targetType: LikeTargetType,
  targetId: string,
  page: number = 1
) {
  const {
    data: likeUsersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['like-users', targetType, targetId, page],
    queryFn: () => likeService.getLikeUsers(targetType, targetId, page),
    enabled: !!targetId,
  });

  return {
    users: likeUsersData?.users ?? [],
    total: likeUsersData?.total ?? 0,
    page: likeUsersData?.page ?? page,
    pageSize: likeUsersData?.pageSize ?? 20,
    isLoading,
    error,
  };
}

/**
 * 用户点赞历史 Hook
 */
export function useUserLikes(targetType?: LikeTargetType, page: number = 1) {
  const {
    data: userLikesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user-likes', targetType, page],
    queryFn: () => likeService.getUserLikes(targetType, page),
  });

  return {
    likes: userLikesData?.likes ?? [],
    total: userLikesData?.total ?? 0,
    isLoading,
    error,
  };
}

/**
 * 快速点赞检查 Hook
 */
export function useIsLiked(targetType: LikeTargetType, targetId: string) {
  const {
    data: isLiked,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['is-liked', targetType, targetId],
    queryFn: () => likeService.isLiked(targetType, targetId),
    enabled: !!targetId,
    staleTime: 2 * 60 * 1000,
  });

  return {
    isLiked: isLiked ?? false,
    isLoading,
    error,
  };
}
