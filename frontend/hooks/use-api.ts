/**
 * Custom hooks for API interactions
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, ApiResponse } from '@/services/api.service';

/**
 * Hook for fetching data with loading and error states
 */
export function useFetch<T = any>(
  fetcher: () => Promise<ApiResponse<T>>,
  options: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {}
) {
  const { immediate = true, onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetcher();
      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      setError(err);
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, isLoading, error, execute, refetch: execute };
}

/**
 * Hook for paginated data
 */
export function usePagination<T = any>(
  fetcher: (params: { page: number; limit: number }) => Promise<ApiResponse<{ data: T[]; total: number }>>,
  options: {
    initialPage?: number;
    initialLimit?: number;
    immediate?: boolean;
  } = {}
) {
  const { initialPage = 1, initialLimit = 10, immediate = true } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetcher({ page, limit });
      setData(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, page, limit]);

  useEffect(() => {
    if (immediate) {
      fetch();
    }
  }, [fetch, immediate]);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((pageNumber: number) => {
    setPage(Math.max(1, pageNumber));
  }, []);

  const changeLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  }, []);

  return {
    data,
    total,
    page,
    limit,
    isLoading,
    error,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    refetch: fetch,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
}

/**
 * Hook for infinite scroll
 */
export function useInfiniteScroll<T = any>(
  fetcher: (params: { page: number; limit: number }) => Promise<ApiResponse<{ data: T[]; total: number }>>,
  options: {
    initialLimit?: number;
    threshold?: number;
    immediate?: boolean;
  } = {}
) {
  const { initialLimit = 10, threshold = 100, immediate = true } = options;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (isLoadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await fetcher({ page: pageNum, limit: initialLimit });
        const newData = response.data.data;

        if (isLoadMore) {
          setData((prev) => [...prev, ...newData]);
        } else {
          setData(newData);
        }

        setHasMore(newData.length === initialLimit);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [fetcher, initialLimit]
  );

  useEffect(() => {
    if (immediate) {
      fetch(1);
    }
  }, [fetch, immediate]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetch(nextPage, true);
    }
  }, [isLoadingMore, hasMore, page, fetch]);

  const refetch = useCallback(() => {
    setPage(1);
    fetch(1);
  }, [fetch]);

  return {
    data,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
  };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<T = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<T>>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {}
) {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await mutationFn(variables);
        setData(response.data);
        onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        setError(err);
        onError?.(err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, isLoading, error, mutate, reset };
}

/**
 * Hook for posts
 */
export function usePosts(options?: {
  category?: string;
  tag?: string;
  search?: string;
  status?: 'draft' | 'published' | 'archived';
  page?: number;
  limit?: number;
}) {
  return useFetch(
    () => apiService.getPosts(options),
    { immediate: true }
  );
}

/**
 * Hook for single post
 */
export function usePost(id?: string, slug?: string) {
  return useFetch(
    () => (id ? apiService.getPost(id) : apiService.getPostBySlug(slug!)),
    { immediate: !!(id || slug) }
  );
}

/**
 * Hook for comments
 */
export function useComments(postId: string) {
  return useFetch(
    () => apiService.getComments(postId),
    { immediate: !!postId }
  );
}

/**
 * Hook for creating comments
 */
export function useCreateComment() {
  return useMutation(
    ({ postId, content, parentId }: { postId: string; content: string; parentId?: string }) =>
      apiService.createComment(postId, { content, parentId })
  );
}

/**
 * Hook for liking items
 */
export function useLike() {
  return useMutation(
    ({ itemId, itemType }: { itemId: string; itemType: 'post' | 'comment' }) =>
      apiService.likeItem(itemId, itemType)
  );
}

/**
 * Hook for unliking items
 */
export function useUnlike() {
  return useMutation(
    ({ itemId }: { itemId: string }) =>
      apiService.unlikeItem(itemId)
  );
}

/**
 * Hook for bookmarking items
 */
export function useBookmark() {
  return useMutation(
    ({ itemId, itemType, folder }: { itemId: string; itemType: 'post' | 'comment'; folder?: string }) =>
      apiService.bookmarkItem(itemId, itemType, folder)
  );
}

/**
 * Hook for unbookmarking items
 */
export function useUnbookmark() {
  return useMutation(
    ({ itemId }: { itemId: string }) =>
      apiService.unbookmarkItem(itemId)
  );
}

/**
 * Hook for following users
 */
export function useFollow() {
  return useMutation(
    ({ userId }: { userId: string }) =>
      apiService.followUser(userId)
  );
}

/**
 * Hook for unfollowing users
 */
export function useUnfollow() {
  return useMutation(
    ({ userId }: { userId: string }) =>
      apiService.unfollowUser(userId)
  );
}

/**
 * Hook for search
 */
export function useSearch(query: string, options?: {
  debounce?: number;
  type?: 'post' | 'category' | 'tag' | 'user';
}) {
  const { debounce: debounceMs = 300 } = options;

  return useFetch(
    () => apiService.search(query, options),
    { immediate: false }
  );
}

/**
 * Hook for current user
 */
export function useCurrentUser() {
  return useFetch(
    () => apiService.getCurrentUser(),
    { immediate: true }
  );
}

/**
 * Hook for user profile
 */
export function useUserProfile(userId: string) {
  return useFetch(
    () => apiService.getUser(userId),
    { immediate: !!userId }
  );
}

/**
 * Hook for notifications
 */
export function useNotifications(options?: {
  unreadOnly?: boolean;
  limit?: number;
}) {
  return useFetch(
    () => apiService.getNotifications(options),
    { immediate: true }
  );
}

/**
 * Hook for bookmarks
 */
export function useBookmarks(folder?: string) {
  return useFetch(
    () => apiService.getBookmarks(folder),
    { immediate: true }
  );
}

/**
 * Hook for auth actions
 */
export function useAuth() {
  const login = useMutation(
    ({ email, password }: { email: string; password: string }) =>
      apiService.login(email, password)
  );

  const register = useMutation(
    ({ email, password, username }: { email: string; password: string; username: string }) =>
      apiService.register({ email, password, username })
  );

  const logout = useMutation(
    () => apiService.logout()
  );

  const resetPassword = useMutation(
    ({ email }: { email: string }) =>
      apiService.resetPassword(email)
  );

  return {
    login,
    register,
    logout,
    resetPassword,
  };
}

/**
 * Hook for file upload
 */
export function useUploadAvatar() {
  return useMutation(
    ({ file }: { file: File }) =>
      apiService.uploadAvatar(file)
  );
}

/**
 * Hook for real-time data with polling
 */
export function usePoll<T = any>(
  fetcher: () => Promise<ApiResponse<T>>,
  options: {
    interval?: number;
    immediate?: boolean;
    enabled?: boolean;
  } = {}
) {
  const { interval = 5000, immediate = true, enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetcher();
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, enabled]);

  useEffect(() => {
    if (immediate) {
      fetch();
    }

    if (enabled && interval > 0) {
      const timer = setInterval(fetch, interval);
      return () => clearInterval(timer);
    }
  }, [fetch, immediate, enabled, interval]);

  return { data, isLoading, error, refetch: fetch };
}

/**
 * Hook for cached data
 */
export function useCachedFetch<T = any>(
  key: string,
  fetcher: () => Promise<ApiResponse<T>>,
  options: {
    ttl?: number; // Time to live in milliseconds
    staleWhileRevalidate?: boolean;
  } = {}
) {
  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;

  const [data, setData] = useState<T | null>(() => {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < ttl) {
          return data;
        }
      }
    } catch (err) {
      console.error('Error reading from cache:', err);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(!data);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetcher();
      const newData = response.data;

      setData(newData);

      // Cache the data
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          key,
          JSON.stringify({
            data: newData,
            timestamp: Date.now(),
          })
        );
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, key]);

  useEffect(() => {
    if (!data || !staleWhileRevalidate) {
      fetch();
    } else if (staleWhileRevalidate) {
      // Fetch in background but keep showing stale data
      fetch();
    }
  }, [fetch, data, staleWhileRevalidate]);

  return { data, isLoading, error, refetch: fetch };
}
