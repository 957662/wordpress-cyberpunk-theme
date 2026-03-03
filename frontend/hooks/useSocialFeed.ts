/**
 * useSocialFeed Hook
 * 社交信息流的 React Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';

export interface FeedItem {
  id: string;
  type: 'post' | 'like' | 'follow' | 'comment' | 'bookmark';
  actor: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  target?: {
    id: string;
    type: 'post' | 'comment' | 'user';
    title?: string;
    excerpt?: string;
    thumbnail?: string;
  };
  metadata?: {
    likesCount?: number;
    commentsCount?: number;
    bookmarked?: boolean;
    liked?: boolean;
  };
  createdAt: string;
}

export interface UseSocialFeedOptions {
  type?: 'following' | 'trending' | 'for-you';
  pageSize?: number;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}

export interface UseSocialFeedReturn {
  items: FeedItem[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  refetch: () => void;
  fetchNextPage: () => void;
  mutate: (item: FeedItem) => void;
  totalCount: number;
}

export function useSocialFeed(options: UseSocialFeedOptions = {}): UseSocialFeedReturn {
  const {
    type = 'following',
    pageSize = 20,
    enabled = true,
    refetchOnWindowFocus = true,
  } = options;

  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchFeed = useCallback(
    async (pageNum: number, isRefetch = false) => {
      if (!enabled) return;

      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        if (pageNum === 1) {
          setIsLoading(true);
        } else {
          setIsFetchingNextPage(true);
        }
        setIsError(false);

        const response = await fetch(
          `/api/feed?type=${type}&page=${pageNum}&pageSize=${pageSize}`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch feed');
        }

        const data = await response.json();

        setItems((prev) => {
          if (isRefetch || pageNum === 1) {
            return data.items || [];
          }
          return [...prev, ...(data.items || [])];
        });

        setHasNextPage(data.hasMore || false);
        setTotalCount(data.total || 0);
        setPage(pageNum);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error fetching feed:', error);
          setIsError(true);
          toast.error('加载动态失败');
        }
      } finally {
        setIsLoading(false);
        setIsFetchingNextPage(false);
      }
    },
    [type, pageSize, enabled]
  );

  // 初始加载
  useEffect(() => {
    if (enabled) {
      fetchFeed(1, true);
    }
  }, [type, enabled]);

  // 窗口聚焦时重新获取
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchFeed(1, true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refetchOnWindowFocus, enabled, type]);

  const refetch = useCallback(() => {
    fetchFeed(1, true);
  }, [fetchFeed]);

  const fetchNextPage = useCallback(() => {
    if (!isLoading && hasNextPage && !isFetchingNextPage) {
      fetchFeed(page + 1);
    }
  }, [isLoading, hasNextPage, isFetchingNextPage, page, fetchFeed]);

  // 更新单个项目（乐观更新）
  const mutate = useCallback((updatedItem: FeedItem) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  }, []);

  return {
    items,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    fetchNextPage,
    mutate,
    totalCount,
  };
}
