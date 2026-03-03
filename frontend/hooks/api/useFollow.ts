/**
 * 关注系统相关 Hooks
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followService } from '../../services/follow/follow-service';
import {
  FollowStatus,
  FollowRequest,
  UnfollowRequest,
  FollowersResponse,
  FollowingResponse,
} from '../../types/follow.types';

/**
 * 关注状态 Hook
 */
export function useFollowStatus(userId: string) {
  const queryClient = useQueryClient();

  const {
    data: followStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['follow-status', userId],
    queryFn: () => followService.getFollowStatus(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  const followMutation = useMutation({
    mutationFn: (request: FollowRequest) => followService.followUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', userId] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (request: UnfollowRequest) => followService.unfollowUser(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follow-status', userId] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
  });

  const toggleFollow = useCallback(() => {
    if (!followStatus) return;

    if (followStatus.isFollowing) {
      unfollowMutation.mutate({ followingId: userId });
    } else {
      followMutation.mutate({ followingId: userId });
    }
  }, [followStatus, userId, followMutation, unfollowMutation]);

  return {
    followStatus,
    isLoading,
    error,
    isFollowing: followStatus?.isFollowing ?? false,
    followerCount: followStatus?.followerCount ?? 0,
    followingCount: followStatus?.followingCount ?? 0,
    follow: () => followMutation.mutate({ followingId: userId }),
    unfollow: () => unfollowMutation.mutate({ followingId: userId }),
    toggleFollow,
    isPending: followMutation.isPending || unfollowMutation.isPending,
  };
}

/**
 * 粉丝列表 Hook
 */
export function useFollowers(userId: string, page: number = 1) {
  const {
    data: followersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['followers', userId, page],
    queryFn: () => followService.getFollowers(userId, page),
    enabled: !!userId,
  });

  return {
    followers: followersData?.followers ?? [],
    total: followersData?.total ?? 0,
    page: followersData?.page ?? page,
    pageSize: followersData?.pageSize ?? 20,
    isLoading,
    error,
  };
}

/**
 * 关注列表 Hook
 */
export function useFollowing(userId: string, page: number = 1) {
  const {
    data: followingData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['following', userId, page],
    queryFn: () => followService.getFollowing(userId, page),
    enabled: !!userId,
  });

  return {
    following: followingData?.following ?? [],
    total: followingData?.total ?? 0,
    page: followingData?.page ?? page,
    pageSize: followingData?.pageSize ?? 20,
    isLoading,
    error,
  };
}

/**
 * 批量关注状态 Hook
 */
export function useBatchFollowStatus(userIds: string[]) {
  const {
    data: followStatuses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['follow-status-batch', userIds],
    queryFn: () => followService.getBatchFollowStatus(userIds),
    enabled: userIds.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  return {
    followStatuses: followStatuses ?? {},
    isLoading,
    error,
  };
}

/**
 * 移除粉丝 Hook
 */
export function useRemoveFollower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followerId: string) => followService.removeFollower(followerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['follow-status'] });
    },
  });
}
