/**
 * 关注系统 Hook
 * 提供关注/取消关注、获取关注列表等功能
 */

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type {
  FollowStatus,
  FollowersResponse,
  FollowingResponse,
  FollowActionResult,
} from '@/types/follow.types';

const FOLLOW_QUERY_KEYS = {
  status: (userId: string) => ['follow', 'status', userId] as const,
  followers: (userId: string, page: number) => ['follow', 'followers', userId, page] as const,
  following: (userId: string, page: number) => ['follow', 'following', userId, page] as const,
  myFollowing: (page: number) => ['follow', 'my-following', page] as const,
  myFollowers: (page: number) => ['follow', 'my-followers', page] as const,
};

/**
 * 关注系统 Hook
 */
export function useFollow(targetUserId?: string) {
  const queryClient = useQueryClient();
  const [currentTargetUserId, setTargetUserId] = useState<string | undefined>(targetUserId);

  // 更新目标用户ID
  useEffect(() => {
    setTargetUserId(targetUserId);
  }, [targetUserId]);

  // ==================== 查询 ====================

  /**
   * 获取关注状态
   */
  const useFollowStatus = (userId: string) => {
    return useQuery<FollowStatus>({
      queryKey: FOLLOW_QUERY_KEYS.status(userId),
      queryFn: async () => {
        const response = await apiClient.get(`/api/v1/follows/check/${userId}`);
        return response.data;
      },
      enabled: !!userId && userId !== currentTargetUserId,
      staleTime: 1000 * 60 * 5, // 5分钟缓存
    });
  };

  /**
   * 获取粉丝列表
   */
  const useFollowers = (userId: string, page = 1, pageSize = 20) => {
    return useQuery<FollowersResponse>({
      queryKey: FOLLOW_QUERY_KEYS.followers(userId, page),
      queryFn: async () => {
        const response = await apiClient.get(`/api/v1/follows/followers/${userId}`, {
          params: { page, page_size: pageSize },
        });
        return response.data;
      },
      enabled: !!userId,
    });
  };

  /**
   * 获取关注列表
   */
  const useFollowing = (userId: string, page = 1, pageSize = 20) => {
    return useQuery<FollowingResponse>({
      queryKey: FOLLOW_QUERY_KEYS.following(userId, page),
      queryFn: async () => {
        const response = await apiClient.get(`/api/v1/follows/following/${userId}`, {
          params: { page, page_size: pageSize },
        });
        return response.data;
      },
      enabled: !!userId,
    });
  };

  /**
   * 获取当前用户的关注列表
   */
  const useMyFollowing = (page = 1, pageSize = 20) => {
    return useQuery<FollowingResponse>({
      queryKey: FOLLOW_QUERY_KEYS.myFollowing(page),
      queryFn: async () => {
        const response = await apiClient.get('/api/v1/follows/me/following', {
          params: { page, page_size: pageSize },
        });
        return response.data;
      },
    });
  };

  /**
   * 获取当前用户的粉丝列表
   */
  const useMyFollowers = (page = 1, pageSize = 20) => {
    return useQuery<FollowersResponse>({
      queryKey: FOLLOW_QUERY_KEYS.myFollowers(page),
      queryFn: async () => {
        const response = await apiClient.get('/api/v1/follows/me/followers', {
          params: { page, page_size: pageSize },
        });
        return response.data;
      },
    });
  };

  // ==================== 变更 ====================

  /**
   * 关注用户
   */
  const followMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.post(`/api/v1/follows/follow/${userId}`);
      return response.data;
    },
    onSuccess: (_, userId) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['follow'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  /**
   * 取消关注
   */
  const unfollowMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/api/v1/follows/unfollow/${userId}`);
    },
    onSuccess: (_, userId) => {
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: ['follow'] });
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
    },
  });

  // ==================== 操作函数 ====================

  /**
   * 关注用户
   */
  const followUser = useCallback(
    async (userId: string): Promise<FollowActionResult> => {
      try {
        await followMutation.mutateAsync(userId);
        return {
          success: true,
          isFollowing: true,
          message: '关注成功',
        };
      } catch (error: any) {
        return {
          success: false,
          isFollowing: false,
          message: error.response?.data?.detail || '关注失败',
        };
      }
    },
    [followMutation]
  );

  /**
   * 取消关注用户
   */
  const unfollowUser = useCallback(
    async (userId: string): Promise<FollowActionResult> => {
      try {
        await unfollowMutation.mutateAsync(userId);
        return {
          success: true,
          isFollowing: false,
          message: '已取消关注',
        };
      } catch (error: any) {
        return {
          success: false,
          isFollowing: true,
          message: error.response?.data?.detail || '取消关注失败',
        };
      }
    },
    [unfollowMutation]
  );

  /**
   * 切换关注状态
   */
  const toggleFollow = useCallback(
    async (userId: string, isCurrentlyFollowing: boolean): Promise<FollowActionResult> => {
      if (isCurrentlyFollowing) {
        return unfollowUser(userId);
      } else {
        return followUser(userId);
      }
    },
    [followUser, unfollowUser]
  );

  return {
    // 查询 hooks
    useFollowStatus,
    useFollowers,
    useFollowing,
    useMyFollowing,
    useMyFollowers,

    // 操作函数
    followUser,
    unfollowUser,
    toggleFollow,

    // 状态
    isFollowing: followMutation.isPending,
    isUnfollowing: unfollowMutation.isPending,
  };
}

export default useFollow;
