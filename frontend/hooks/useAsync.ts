import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useAsync Hook
 *
 * 用于处理异步操作的 Hook
 *
 * @example
 * ```tsx
 * function UserProfile({ userId }: { userId: string }) {
 *   const { data, loading, error, execute } = useAsync(async () => {
 *     const response = await fetch(`/api/users/${userId}`);
 *     return response.json();
 *   });
 *
 *   useEffect(() => {
 *     execute();
 *   }, [userId]);
 *
 *   if (loading) return <div>加载中...</div>;
 *   if (error) return <div>错误: {error.message}</div>;
 *   return <div>{data.name}</div>;
 * }
 * ```
 */
export interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAsyncReturn<T> extends UseAsyncState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: (...args: any[]) => Promise<T>,
  immediate = true
): UseAsyncReturn<T> {
  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await asyncFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setState({ data: null, loading: false, error: err });
        throw err;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute, reset };
}

/**
 * useFetch Hook
 *
 * 用于数据请求的 Hook
 *
 * @example
 * ```tsx
 * function PostList() {
 *   const { data, loading, error, refetch } = useFetch<Post[]>('/api/posts');
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return (
 *     <ul>
 *       {data?.map(post => <li key={post.id}>{post.title}</li>)}
 *     </ul>
 *   );
 * }
 * ```
 */
export interface UseFetchOptions extends RequestInit {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useFetch<T = any>(
  url: string,
  options: UseFetchOptions = {}
): UseAsyncReturn<T> & { refetch: () => Promise<T> } {
  const { immediate = true, onSuccess, onError, ...fetchOptions } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: immediate,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (): Promise<T> => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    setState({ data: null, loading: true, error: null });

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
      onSuccess?.(data);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      // 忽略 AbortError
      if (err.name === 'AbortError') {
        return state.data as T;
      }
      setState({ data: null, loading: false, error: err });
      onError?.(err);
      throw err;
    }
  }, [url, JSON.stringify(fetchOptions), onSuccess, onError]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, immediate]);

  return { ...state, execute, refetch, reset: () => setState({ data: null, loading: false, error: null }) };
}

/**
 * usePaginatedFetch Hook
 *
 * 用于分页数据请求
 *
 * @example
 * ```tsx
 * function PaginatedList() {
 *   const { data, loading, error, nextPage, prevPage, hasNextPage, hasPrevPage } =
 *     usePaginatedFetch('/api/posts', { pageSize: 10 });
 *
 *   return (
 *     <div>
 *       <button onClick={prevPage} disabled={!hasPrevPage}>上一页</button>
 *       <button onClick={nextPage} disabled={!hasNextPage}>下一页</button>
 *       {data?.items.map(item => <div key={item.id}>{item.title}</div>)}
 *     </div>
 *   );
 * }
 * ```
 */
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UsePaginatedFetchOptions {
  pageSize?: number;
  immediate?: boolean;
}

export function usePaginatedFetch<T>(
  url: string,
  options: UsePaginatedFetchOptions = {}
) {
  const { pageSize = 10, immediate = true } = options;

  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedData<T> | null>(null);

  const fetchUrl = `${url}?page=${page}&pageSize=${pageSize}`;

  const { data: responseData, loading, error, execute } = useFetch<PaginatedData<T>>(
    fetchUrl,
    { immediate }
  );

  useEffect(() => {
    if (responseData) {
      setData(responseData);
    }
  }, [responseData]);

  const nextPage = useCallback(() => {
    if (data && page < data.totalPages) {
      setPage((p) => p + 1);
    }
  }, [data, page]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  }, [page]);

  const goToPage = useCallback((targetPage: number) => {
    if (data && targetPage >= 1 && targetPage <= data.totalPages) {
      setPage(targetPage);
    }
  }, [data]);

  return {
    data,
    loading,
    error,
    page,
    nextPage,
    prevPage,
    goToPage,
    hasNextPage: data ? page < data.totalPages : false,
    hasPrevPage: page > 1,
    refetch: execute
  };
}

/**
 * useInfiniteScroll Hook
 *
 * 无限滚动加载
 *
 * @example
 * ```tsx
 * function InfiniteList() {
 *   const { data, loading, error, loadMore, hasMore } =
 *     useInfiniteScroll('/api/posts', { pageSize: 20 });
 *
 *   return (
 *     <InfiniteScroll hasMore={hasMore} onLoadMore={loadMore}>
 *       {data.map(item => <div key={item.id}>{item.title}</div>)}
 *     </InfiniteScroll>
 *   );
 * }
 * ```
 */
export interface UseInfiniteScrollOptions {
  pageSize?: number;
  initialPage?: number;
}

export function useInfiniteScroll<T>(
  url: string,
  options: UseInfiniteScrollOptions = {}
) {
  const { pageSize = 20, initialPage = 1 } = options;

  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${url}?page=${page}&pageSize=${pageSize}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newData: T[] = await response.json();
      setData((prev) => [...prev, ...newData]);
      setPage((p) => p + 1);

      if (newData.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [url, page, pageSize, loading, hasMore]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  return {
    data,
    loading,
    error,
    loadMore,
    hasMore,
    reset
  };
}

/**
 * useMutation Hook
 *
 * 用于执行变更操作（POST、PUT、DELETE）
 *
 * @example
 * ```tsx
 * function CreatePost() {
 *   const { execute, loading, error } = useMutation(
 *     async (data: PostData) => {
 *       const response = await fetch('/api/posts', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify(data)
 *       });
 *       return response.json();
 *     }
 *   );
 *
 *   const handleSubmit = (data: PostData) => {
 *     execute(data).then(() => {
 *       // 成功处理
 *     });
 *   };
 *
 *   return <PostForm onSubmit={handleSubmit} loading={loading} />;
 * }
 * ```
 */
export interface UseMutationReturn<T, P = any> {
  execute: (params: P) => Promise<T>;
  loading: boolean;
  error: Error | null;
  data: T | null;
  reset: () => void;
}

export function useMutation<T, P = any>(
  mutationFn: (params: P) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
): UseMutationReturn<T, P> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (params: P): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        const result = await mutationFn(params);
        setData(result);
        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn, options]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return { execute, loading, error, data, reset };
}

/**
 * useDebouncedFetch Hook
 *
 * 防抖的数据请求
 *
 * @example
 * ```tsx
 * function SearchBox() {
 *   const [query, setQuery] = useState('');
 *   const { data, loading } = useDebouncedFetch(
 *     '/api/search',
 *     query,
 *     { delay: 300 }
 *   );
 *
 *   return (
 *     <input
 *       value={query}
 *       onChange={(e) => setQuery(e.target.value)}
 *       placeholder="搜索..."
 *     />
 *   );
 * }
 * ```
 */
export function useDebouncedFetch<T>(
  url: string,
  query: string,
  options: {
    delay?: number;
    enabled?: boolean;
  } = {}
) {
  const { delay = 300, enabled = true } = options;
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const shouldFetch = enabled && debouncedQuery.length > 0;
  const fetchUrl = shouldFetch ? `${url}?q=${encodeURIComponent(debouncedQuery)}` : null;

  return useFetch<T>(fetchUrl || '', { immediate: shouldFetch });
}
