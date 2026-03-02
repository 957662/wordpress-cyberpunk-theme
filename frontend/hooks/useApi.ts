'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ApiOptions<T> {
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retry?: number;
  retryDelay?: number;
}

export interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isSuccess: boolean;
}

export interface UseApiReturn<T> extends ApiState<T> {
  refetch: () => Promise<void>;
  mutate: (data: T) => void;
}

export function useApi<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: ApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus = false,
    onSuccess,
    onError,
    retry = 0,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: true,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState((prev) => ({ ...prev, isLoading: true, isError: false }));

    try {
      const data = await fetcher();
      setState({
        data,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      });
      retryCountRef.current = 0;
      onSuccess?.(data);
    } catch (error) {
      const err = error as Error;

      // Retry logic
      if (retryCountRef.current < retry) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData();
        }, retryDelay * retryCountRef.current);
        return;
      }

      setState({
        data: null,
        isLoading: false,
        isError: true,
        error: err,
        isSuccess: false,
      });
      onError?.(err);
    }
  }, [enabled, fetcher, retry, retryDelay, onSuccess, onError]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const mutate = useCallback((data: T) => {
    setState({
      data,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
    });
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refetch interval
  useEffect(() => {
    if (!refetchInterval) return;

    const intervalId = setInterval(() => {
      refetch();
    }, refetchInterval);

    return () => clearInterval(intervalId);
  }, [refetchInterval, refetch]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      refetch();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, refetch]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    mutate,
  };
}

// Mutations
export interface UseMutationOptions<TData, TVariables, TError = Error> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  onSettled?: () => void;
  retry?: number;
  retryDelay?: number;
}

export interface UseMutationState<TData, TError> {
  data: TData | null;
  isLoading: boolean;
  isError: boolean;
  error: TError | null;
  isSuccess: boolean;
}

export interface UseMutationReturn<TData, TVariables, TError> extends UseMutationState<TData, TError> {
  mutate: (variables: TVariables) => Promise<TData>;
  reset: () => void;
}

export function useMutation<TData = any, TVariables = void, TError = Error>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables, TError> = {}
): UseMutationReturn<TData, TVariables, TError> {
  const {
    onSuccess,
    onError,
    onSettled,
    retry = 0,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<UseMutationState<TData, TError>>({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
    isSuccess: false,
  });

  const retryCountRef = useRef(0);

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setState((prev) => ({ ...prev, isLoading: true, isError: false }));

    try {
      const data = await mutationFn(variables);
      setState({
        data,
        isLoading: false,
        isError: false,
        error: null,
        isSuccess: true,
      });
      retryCountRef.current = 0;
      onSuccess?.(data);
      onSettled?.();
      return data;
    } catch (error) {
      const err = error as TError;

      // Retry logic
      if (retryCountRef.current < retry) {
        retryCountRef.current++;
        await new Promise((resolve) => setTimeout(resolve, retryDelay * retryCountRef.current));
        return mutate(variables);
      }

      setState({
        data: null,
        isLoading: false,
        isError: true,
        error: err,
        isSuccess: false,
      });
      onError?.(err);
      onSettled?.();
      throw err;
    }
  }, [mutationFn, retry, retryDelay, onSuccess, onError, onSettled]);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: false,
    });
    retryCountRef.current = 0;
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

// Infinite scroll
export interface UseInfiniteApiOptions<T> {
  enabled?: boolean;
  getNextPageParam?: (lastPage: T, allPages: T[]) => number | string | null | undefined;
  onSuccess?: (data: T[]) => void;
  onError?: (error: Error) => void;
}

export interface UseInfiniteApiReturn<T> extends UseApiReturn<T[]> {
  fetchNextPage: () => Promise<void>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export function useInfiniteApi<T>(
  key: string,
  fetcher: (page: number) => Promise<T[]>,
  options: UseInfiniteApiOptions<T> = {}
): UseInfiniteApiReturn<T> {
  const {
    enabled = true,
    getNextPageParam,
    onSuccess,
    onError,
  } = options;

  const [pages, setPages] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage || !enabled) return;

    setIsFetchingNextPage(true);

    try {
      const newItems = await fetcher(page);

      setPages((prev) => [...prev, ...newItems]);
      setPage((prev) => prev + 1);

      if (getNextPageParam) {
        const nextPageParam = getNextPageParam(newItems[0], [...pages, ...newItems]);
        setHasNextPage(nextPageParam !== null && nextPageParam !== undefined);
      } else {
        setHasNextPage(newItems.length > 0);
      }

      onSuccess?.([...pages, ...newItems]);
    } catch (error) {
      onError?.(error as Error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [hasNextPage, isFetchingNextPage, enabled, fetcher, page, pages, getNextPageParam, onSuccess, onError]);

  const reset = useCallback(() => {
    setPages([]);
    setPage(1);
    setHasNextPage(true);
    setIsFetchingNextPage(false);
  }, []);

  const mutate = useCallback((data: T[]) => {
    setPages(data);
  }, []);

  // Initial fetch
  useEffect(() => {
    if (enabled && pages.length === 0) {
      fetchNextPage();
    }
  }, [enabled]);

  return {
    data: pages,
    isLoading: pages.length === 0 && enabled,
    isError: false,
    error: null,
    isSuccess: pages.length > 0,
    refetch: reset,
    mutate,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } as UseInfiniteApiReturn<T>;
}

export default useApi;
