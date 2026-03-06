/**
 * 关注功能的自定义 Hook
 * 封装关注相关的逻辑和状态管理
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { followService, FollowStats } from '@/services/followService';

export interface UseFollowOptions {
  userId: string;
  initialIsFollowing?: boolean;
  autoLoadStats?: boolean;
}

export function useFollow({
  userId,
  initialIsFollowing = false,
  autoLoadStats = true,
}: UseFollowOptions) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<FollowStats | null>(null);

  // 加载关注统计
  const loadStats = useCallback(async () => {
    try {
      const data = await followService.getFollowStats(userId);
      setStats(data);
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error('Failed to load follow stats:', error);
    }
  }, [userId]);

  // 关注/取消关注
  const toggleFollow = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const newState = await followService.toggleFollow(userId, isFollowing);
      setIsFollowing(newState);

      // 更新统计
      if (stats) {
        setStats({
          ...stats,
          followerCount: newState
            ? stats.followerCount + 1
            : stats.followerCount - 1,
        });
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId, isFollowing, isLoading, stats]);

  // 关注用户
  const follow = useCallback(async () => {
    if (isFollowing) return;
    await toggleFollow();
  }, [isFollowing, toggleFollow]);

  // 取消关注
  const unfollow = useCallback(async () => {
    if (!isFollowing) return;
    await toggleFollow();
  }, [isFollowing, toggleFollow]);

  // 自动加载统计
  useEffect(() => {
    if (autoLoadStats) {
      loadStats();
    }
  }, [autoLoadStats, loadStats]);

  return {
    isFollowing,
    isLoading,
    stats,
    follow,
    unfollow,
    toggleFollow,
    loadStats,
    setIsFollowing,
  };
}
