/**
 * 收藏 Hook
 * 简化收藏功能的使用
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { bookmarkService } from '../services/bookmark-service-new';
import { BookmarkTargetType, BookmarkStatusResponse } from '@/types/bookmark.types';
import toast from 'react-hot-toast';

export interface UseBookmarkOptions {
  targetType: BookmarkTargetType;
  targetId: string | number;
  initialBookmarked?: boolean;
  onSuccess?: (bookmarked: boolean) => void;
  onError?: (error: Error) => void;
}

export interface UseBookmarkReturn {
  isBookmarked: boolean;
  bookmarkId: string | undefined;
  isLoading: boolean;
  isMutating: boolean;
  toggle: (notes?: string) => Promise<void>;
  bookmark: (notes?: string) => Promise<void>;
  unbookmark: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useBookmark({
  targetType,
  targetId,
  initialBookmarked = false,
  onSuccess,
  onError,
}: UseBookmarkOptions): UseBookmarkReturn {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [bookmarkId, setBookmarkId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  /**
   * 加载收藏状态
   */
  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await bookmarkService.getBookmarkStatus(targetType, targetId);
      setIsBookmarked(status.is_bookmarked);
      setBookmarkId(status.bookmark_id);
    } catch (error) {
      console.error('加载收藏状态失败:', error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [targetType, targetId, onError]);

  /**
   * 切换收藏状态
   */
  const toggle = useCallback(async (notes?: string) => {
    setIsMutating(true);
    try {
      // 乐观更新
      const newBookmarkedState = !isBookmarked;
      setIsBookmarked(newBookmarkedState);

      // 调用API
      const result = await bookmarkService.toggleBookmark(targetType, targetId, notes);

      // 更新状态
      setIsBookmarked(result.is_bookmarked);
      setBookmarkId(result.bookmark_id);

      // 成功回调
      onSuccess?.(result.is_bookmarked);

      // 提示
      if (result.is_bookmarked) {
        toast.success('已添加到收藏');
      } else {
        toast.success('已取消收藏');
      }
    } catch (error) {
      // 回滚
      setIsBookmarked(!isBookmarked);
      console.error('收藏操作失败:', error);
      toast.error('操作失败，请重试');
      onError?.(error as Error);
    } finally {
      setIsMutating(false);
    }
  }, [isBookmarked, targetType, targetId, onSuccess, onError]);

  /**
   * 添加收藏
   */
  const bookmark = useCallback(async (notes?: string) => {
    if (isBookmarked) return;

    setIsMutating(true);
    try {
      const result = await bookmarkService.createBookmark({
        target_type: targetType,
        target_id: targetId,
        notes,
      });

      // 更新状态
      setIsBookmarked(true);
      setBookmarkId(result.id);

      // 成功回调
      onSuccess?.(true);
      toast.success('已添加到收藏');
    } catch (error) {
      console.error('收藏失败:', error);
      toast.error('操作失败，请重试');
      onError?.(error as Error);
    } finally {
      setIsMutating(false);
    }
  }, [isBookmarked, targetType, targetId, onSuccess, onError]);

  /**
   * 取消收藏
   */
  const unbookmark = useCallback(async () => {
    if (!isBookmarked || !bookmarkId) return;

    setIsMutating(true);
    try {
      await bookmarkService.deleteBookmark(bookmarkId);

      // 更新状态
      setIsBookmarked(false);
      setBookmarkId(undefined);

      // 成功回调
      onSuccess?.(false);
      toast.success('已取消收藏');
    } catch (error) {
      console.error('取消收藏失败:', error);
      toast.error('操作失败，请重试');
      onError?.(error as Error);
    } finally {
      setIsMutating(false);
    }
  }, [isBookmarked, bookmarkId, onSuccess, onError]);

  // 初始加载
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    isBookmarked,
    bookmarkId,
    isLoading,
    isMutating,
    toggle,
    bookmark,
    unbookmark,
    refresh,
  };
}

/**
 * 收藏列表 Hook
 */
export interface UseBookmarkListOptions {
  targetType?: BookmarkTargetType;
  initialSkip?: number;
  initialLimit?: number;
  enabled?: boolean;
}

export function useBookmarkList({
  targetType,
  initialSkip = 0,
  initialLimit = 20,
  enabled = true,
}: UseBookmarkListOptions = {}) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async (skip = initialSkip, limit = initialLimit) => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await bookmarkService.getMyBookmarks(skip, limit, targetType);
      setBookmarks(result.items);
      setTotal(result.total);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('加载收藏列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, initialSkip, initialLimit, targetType]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const loadMore = useCallback(async () => {
    if (bookmarks.length >= total) return;
    await fetch(bookmarks.length, initialLimit);
  }, [bookmarks.length, total, fetch, initialLimit]);

  return {
    bookmarks,
    total,
    isLoading,
    error,
    fetch,
    loadMore,
    hasMore: bookmarks.length < total,
  };
}

/**
 * 批量收藏 Hook
 * 用于批量获取多个目标的收藏状态
 */
export interface UseBatchBookmarksOptions {
  targets: Array<{ targetType: BookmarkTargetType; targetId: string | number }>;
  enabled?: boolean;
}

export function useBatchBookmarks({ targets, enabled = true }: UseBatchBookmarksOptions) {
  const [statusMap, setStatusMap] = useState<Map<string, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!enabled || targets.length === 0) return;

    setIsLoading(true);
    try {
      const result = await bookmarkService.getBatchBookmarkStatus(targets);
      setStatusMap(result);
    } catch (error) {
      console.error('批量加载收藏状态失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, [targets, enabled]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isBookmarked = useCallback((targetType: BookmarkTargetType, targetId: string | number) => {
    return statusMap.get(`${targetType}:${targetId}`) || false;
  }, [statusMap]);

  return {
    isBookmarked,
    refresh,
    isLoading,
  };
}
