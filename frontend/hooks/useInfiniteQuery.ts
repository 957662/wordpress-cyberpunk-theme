/**
 * useInfiniteQuery - 无限滚动查询 Hook
 * 使用 React Query 实现无限滚动加载
 */

'use client';

import { useInfiniteQuery as useReactInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface InfiniteQueryOptions<T> {
  queryKey: string[];
  queryFn: (page: number, pageSize: number) => Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;
  initialPageSize?: number;
  enabled?: boolean;
}

export function useInfiniteQuery<T>({
  queryKey,
  queryFn,
  initialPageSize = 10,
  enabled = true,
}: InfiniteQueryOptions<T>) {
  const [allData, setAllData] = useState<T[]>([]);

  const {
    data,
    error,
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useReactInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 1 }) => queryFn(pageParam, initialPageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled,
  });

  // 合并所有页面的数据
  useEffect(() => {
    if (data) {
      const flattened = data.pages.flatMap((page) => page.data);
      setAllData(flattened);
    }
  }, [data]);

  // 加载更多
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // 检查是否还有更多数据
  const hasMore = hasNextPage && !isFetchingNextPage;

  // 获取总数
  const total = data?.pages?.[0]?.total || 0;

  return {
    data: allData,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasMore,
    hasNextPage,
    loadMore,
    refetch,
    total,
    pages: data?.pages || [],
  };
}
