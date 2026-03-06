/**
 * Custom React Hook for API Calls
 *
 * Provides a clean interface for making API requests with loading states
 */

import { useState, useCallback, useEffect } from 'react';
import { api } from '@/lib/api/axios-config';

export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export interface UseApiLazyResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
}

/**
 * Hook for automatic data fetching
 * @param url - API endpoint URL
 * @param options - Axios request options
 */
export function useApi<T = any>(url: string, options?: any): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<T>(url, options);
      setData(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for lazy data fetching (manual trigger)
 * @param url - API endpoint URL
 * @param method - HTTP method (default: GET)
 * @param options - Axios request options
 */
export function useApiLazy<T = any>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  options?: any
): UseApiLazyResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      switch (method) {
        case 'POST':
          response = await api.post<T>(url, options?.data, options);
          break;
        case 'PUT':
          response = await api.put<T>(url, options?.data, options);
          break;
        case 'PATCH':
          response = await api.patch<T>(url, options?.data, options);
          break;
        case 'DELETE':
          response = await api.delete<T>(url, options);
          break;
        default:
          response = await api.get<T>(url, options);
      }

      setData(response.data);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, options]);

  return { data, loading, error, execute };
}

/**
 * Hook for pagination
 */
export function usePagination<T = any>(
  url: string,
  initialPage: number = 1,
  perPage: number = 10
) {
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: T[]; total: number; total_pages: number }>(
        `${url}?page=${pageNum}&per_page=${perPage}`
      );

      setData(response.data.data);
      setTotal(response.data.total);
      setTotalPages(response.data.total_pages);
      setPage(pageNum);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [url, perPage]);

  useEffect(() => {
    fetchPage(initialPage);
  }, [url, initialPage, perPage]);

  const nextPage = () => {
    if (page < totalPages) {
      fetchPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      fetchPage(page - 1);
    }
  };

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      fetchPage(pageNum);
    }
  };

  return {
    data,
    loading,
    error,
    page,
    total,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    refetch: () => fetchPage(page),
  };
}

/**
 * Hook for infinite scroll
 */
export function useInfiniteScroll<T = any>(url: string, perPage: number = 10) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<{ data: T[]; has_more: boolean }>(
        `${url}?page=${page}&per_page=${perPage}`
      );

      setData((prev) => [...prev, ...response.data.data]);
      setHasMore(response.data.has_more);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, url, perPage]);

  const reset = () => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<T = any, D = any>(
  url: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (requestData?: D) => {
      setLoading(true);
      setError(null);

      try {
        let response;

        switch (method) {
          case 'POST':
            response = await api.post<T>(url, requestData);
            break;
          case 'PUT':
            response = await api.put<T>(url, requestData);
            break;
          case 'PATCH':
            response = await api.patch<T>(url, requestData);
            break;
          case 'DELETE':
            response = await api.delete<T>(url);
            break;
        }

        setData(response.data);
        return response.data;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, method]
  );

  const reset = () => {
    setData(null);
    setError(null);
  };

  return { data, loading, error, mutate, reset };
}
