/**
 * 点赞 Hook
 * 简化点赞功能的使用
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { likeService } from '../services/like-service';
import { LikeTargetType, LikeStatusResponse } from '@/types/like.types';
import toast from 'react-hot-toast';

export interface UseLikeOptions {
  targetType: LikeTargetType;
  targetId: string | number;
  initialLiked?: boolean;
  initialCount?: number;
  onSuccess?: (liked: boolean) => void;
  onError?: (error: Error) => void;
}

export interface UseLikeReturn {
  isLiked: boolean;
  likeCount: number;
  isLoading: boolean;
  isMutating: boolean;
  toggle: () => Promise<void>;
  like: () => Promise<void>;
  unlike: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useLike({
  targetType,
  targetId,
  initialLiked = false,
  initialCount = 0,
  onSuccess,
  onError,
}: UseLikeOptions): UseLikeReturn {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  /**
   * 加载点赞状态
   */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await likeService.getLikeStatus(targetType, targetId);
      setIsLiked(status.is_liked);
      setLikeCount(status.like_count);
    } catch (error) {
      console.error('加载点赞状态失败:', error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [targetType, targetId, onError]);

  /**
   * 切换点赞状态
   */
  const toggle = useCallback(async () => {
    setIsMutating(true);
    try {
      // 乐观更新
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikeCount((prev) => (newLikedState ? prev + 1 : prev - 1));

      // 调用API
      const result = await likeService.toggleLike(targetType, targetId);

      // 更新状态
      setIsLiked(result.is_liked);
      setLikeCount(result.like_count);

      // 成功回调
      onSuccess?.(result.is_liked);

      // 提示
      if (result.is_liked) {
        toast.success('点赞成功！');
      } else {
        toast.success('已取消点赞');
      }
    } catch (error) {
      // 回滚
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      console.error('点赞操作失败:', error);
      toast.error('操作失败，请重试');
      onError?.(error as Error);
    } finally {
      setIsMutating(false);
    }
  }, [isLiked, targetType, targetId, onSuccess, onError]);

  /**
   * 点赞
   */
  const like = useCallback(async () => {
    if (isLiked) return;

    setIsMutating(true);
    try {
      const result = await likeService.createLike({ target_type: targetType, target_id: targetId });

      // 更新状态
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);

      // 成功回调
      onSuccess?.(true);
      toast.success('点赞成功！');
    } catch (error) {
      console.error('点赞失败:', error);
      toast.error('操作失败，请重试');
      onError?.(error as Error);
    } finally {
      setIsMutating(false);
    }
  }, [isLiked, targetType, targetId, onSuccess, onError]);

  /**
   * 取消点赞
   */
  const unlike = useCallback(async () => {
    if (!isLiked) return;

    setIsMutating(true);
    try {
      await likeService.deleteLike(targetType, targetId);

      // 更新状态
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);

      // 成功回调
      onSuccess?.(false);
      toast.success('已取消点赞');
    } catch (error) {
      console.error('取消点赞失败:', error);
      toast.error('操作失败，请重试');
      onError?.(error as Error);
    } finally {
      setIsMutating(false);
    }
  }, [isLiked, targetType, targetId, onSuccess, onError]);

  // 初始加载
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    isLiked,
    likeCount,
    isLoading,
    isMutating,
    toggle,
    like,
    unlike,
    refresh,
  };
}

/**
 * 批量点赞 Hook
 * 用于批量获取多个目标的点赞状态
 */
export interface UseBatchLikesOptions {
  targets: Array<{ targetType: LikeTargetType; targetId: string | number }>;
  enabled?: boolean;
}

export function useBatchLikes({ targets, enabled = true }: UseBatchLikesOptions) {
  const [statusMap, setStatusMap] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled || targets.length === 0) return;

    setIsLoading(true);
    try {
      const result = await likeService.getBatchLikeStatus(targets);
      setStatusMap(result);
    } catch (error) {
      console.error('批量加载点赞状态失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [targets, enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isLiked = useCallback((targetType: LikeTargetType, targetId: string | number) => {
    return statusMap.get(`${targetType}:${targetId}`) || false;
  }, [statusMap]);

  return {
    isLiked,
    refresh,
    isLoading,
  };
}
