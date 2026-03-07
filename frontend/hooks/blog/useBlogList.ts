'use client';

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogPost } from '@/types/models/blog';
import { wordpressService } from '@/services/wordpress-service';
import { debounce } from '@/lib/utils';

export interface UseBlogListParams {
  page?: number;
  perPage?: number;
  category?: number;
  tag?: number;
  search?: string;
  orderBy?: 'date' | 'title' | 'modified';
  order?: 'asc' | 'desc';
  enabled?: boolean;
}

export interface UseBlogListResult {
  posts: BlogPost[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  refetch: () => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (categoryId: number | undefined) => void;
  setTagFilter: (tagId: number | undefined) => void;
}

/**
 * useBlogList - 博客列表 Hook
 * 提供完整的博客列表功能，包括分页、搜索、筛选
 */
export function useBlogList(params: UseBlogListParams = {}): UseBlogListResult {
  const {
    page: initialPage = 1,
    perPage = 12,
    category: initialCategory,
    tag: initialTag,
    search: initialSearch = '',
    orderBy = 'date',
    order = 'desc',
    enabled = true,
  } = params;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQueryState] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [tagFilter, setTagFilter] = useState(initialTag);
  const queryClient = useQueryClient();

  // 获取文章列表
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      'blog-posts',
      currentPage,
      perPage,
      categoryFilter,
      tagFilter,
      searchQuery,
      orderBy,
      order,
    ],
    queryFn: async () => {
      return wordpressService.getPosts({
        page: currentPage,
        per_page: perPage,
        categories: categoryFilter,
        tags: tagFilter,
        search: searchQuery || undefined,
        orderby: orderBy,
        order,
      });
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 分钟
  });

  const posts = data?.posts || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQueryState(query);
      setCurrentPage(1); // 搜索时重置到第一页
    }, 300),
    []
  );

  // 分页操作
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  // 搜索操作
  const setSearchQuery = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  // 筛选操作
  const setCategoryFilterCallback = useCallback((categoryId: number | undefined) => {
    setCategoryFilter(categoryId);
    setCurrentPage(1);
  }, []);

  const setTagFilterCallback = useCallback((tagId: number | undefined) => {
    setTagFilter(tagId);
    setCurrentPage(1);
  }, []);

  return {
    posts,
    total,
    totalPages,
    currentPage,
    isLoading,
    isError,
    error: error as Error | null,
    isFetching,
    refetch,
    nextPage,
    prevPage,
    goToPage,
    setSearchQuery,
    setCategoryFilter: setCategoryFilterCallback,
    setTagFilter: setTagFilterCallback,
  };
}

/**
 * useBlogListInfinite - 无限滚动博客列表 Hook
 */
export function useBlogListInfinite(params: Omit<UseBlogListParams, 'page'> = {}) {
  const {
    perPage = 12,
    category,
    tag,
    search = '',
    orderBy = 'date',
    order = 'desc',
    enabled = true,
  } = params;

  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useQuery({
    queryKey: ['blog-posts-infinite', perPage, category, tag, search, orderBy, order],
    queryFn: async () => {
      return wordpressService.getPosts({
        page: 1,
        per_page: perPage * 3, // 获取更多页面用于无限滚动
        categories: category,
        tags: tag,
        search: search || undefined,
        orderby: orderBy,
        order,
      });
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  const posts = data?.posts || [];
  const total = data?.total || 0;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    posts,
    total,
    isLoading,
    isError,
    error: error as Error | null,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    refetch,
  };
}

/**
 * useBlogSearch - 博客搜索 Hook
 */
export function useBlogSearch(enabled = true) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: searchResults = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['blog-search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return [];
      }
      return wordpressService.searchPosts(debouncedQuery);
    },
    enabled: enabled && debouncedQuery.length > 2,
    staleTime: 2 * 60 * 1000,
  });

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isLoading,
    isError,
    error: error as Error | null,
  };
}

export default useBlogList;
