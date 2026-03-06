/**
 * CyberPress Platform - API Hooks
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/services/api-client';
import type { ApiError } from '@/types';

// =====================================================
// 通用 API Hook 配置
// =====================================================

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  retry?: number;
  retryDelay?: number;
}

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: ApiError | null;
}

// =====================================================
// 通用 API Hook
// =====================================================

export function useApi<T = any>(
  endpoint: string,
  options?: UseApiOptions
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: options?.immediate ?? false,
    isRefreshing: false,
    error: null,
  });

  const retryCount = useRef(0);
  const abortController = useRef<AbortController | null>(null);

  const execute = useCallback(async (isRefresh = false) => {
    // 取消之前的请求
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();

    setState(prev => ({
      ...prev,
      isLoading: !isRefresh,
      isRefreshing: isRefresh,
      error: null,
    }));

    try {
      const data = await api.get<T>(endpoint);
      retryCount.current = 0;

      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        isRefreshing: false,
      }));

      options?.onSuccess?.(data);
      return data;
    } catch (error) {
      const apiError = error as ApiError;

      // 重试逻辑
      if (
        options?.retry &&
        retryCount.current < options.retry &&
        apiError.statusCode >= 500
      ) {
        retryCount.current++;
        await new Promise(resolve => setTimeout(resolve, options.retryDelay || 1000));
        return execute(isRefresh);
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        isRefreshing: false,
        error: apiError,
      }));

      options?.onError?.(apiError);
      throw apiError;
    }
  }, [endpoint, options]);

  useEffect(() => {
    if (options?.immediate) {
      execute();
    }

    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, [execute, options?.immediate]);

  return {
    ...state,
    execute,
    refresh: () => execute(true),
  };
}

// =====================================================
// 列表数据 Hook
// =====================================================

interface ListData<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export function useList<T = any>(
  endpoint: string,
  initialParams?: Record<string, any>,
  options?: UseApiOptions
) {
  const [params, setParams] = useState<Record<string, any>>(initialParams || {});
  const { data, isLoading, error, execute } = useApi<ListData<T>>(
    endpoint,
    options
  );

  const items = data?.items || [];
  const total = data?.total || 0;
  const page = data?.page || 1;
  const pageSize = data?.page_size || 10;
  const totalPages = data?.total_pages || 0;

  const updateParams = useCallback((newParams: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => {
    setParams(prev => {
      const updated = typeof newParams === 'function' ? newParams(prev) : newParams;
      return { ...prev, ...updated, page: 1 };
    });
  }, []);

  const setPage = useCallback((newPage: number) => {
    setParams(prev => ({ ...prev, page: newPage }));
  }, []);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages, setPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page, setPage]);

  const refresh = useCallback(() => {
    return execute();
  }, [execute]);

  // 当参数变化时重新获取数据
  useEffect(() => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.set(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    execute();
  }, [params, endpoint]); // execute 未包含在依赖中以避免无限循环

  return {
    items,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    error,
    params,
    updateParams,
    setPage,
    nextPage,
    prevPage,
    refresh,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

// =====================================================
// 变更操作 Hook
// =====================================================

interface MutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void;
  onError?: (error: ApiError) => void;
  onSettled?: () => void;
}

export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: MutationOptions<TData, TVariables>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutationFn(variables);
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options?.onError?.(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
      options?.onSettled?.();
    }
  }, [mutationFn, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    data,
    isLoading,
    error,
    reset,
  };
}

// =====================================================
// 无限滚动 Hook
// =====================================================

export function useInfiniteScroll<T = any>(
  endpoint: string,
  initialParams?: Record<string, any>,
  options?: UseApiOptions
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      Object.entries({ ...initialParams, page }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.set(key, String(value));
        }
      });

      const data = await api.get<ListData<T>>(
        `${endpoint}?${searchParams.toString()}`
      );

      setItems(prev => [...prev, ...data.items]);
      setPage(prev => prev + 1);
      setHasMore(data.items.length > 0);
      options?.onSuccess?.(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
      options?.onError?.(apiError);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, page, hasMore, isLoading, initialParams, options]);

  const refresh = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    items,
    loadMore,
    refresh,
    isLoading,
    error,
    hasMore,
  };
}

// =====================================================
// 实时数据 Hook
// =====================================================

export function useRealtimeData<T = any>(
  endpoint: string,
  enabled = true,
  interval = 5000
) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let intervalId: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        const result = await api.get<T>(endpoint);
        setData(result);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError);
        setIsConnected(false);
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [endpoint, enabled, interval]);

  return { data, isConnected, error };
}

// =====================================================
// 导出
// =====================================================

export default {
  useApi,
  useList,
  useMutation,
  useInfiniteScroll,
  useRealtimeData,
};
