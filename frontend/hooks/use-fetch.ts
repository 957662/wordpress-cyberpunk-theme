/**
 * useFetch Hook
 * 通用数据获取 Hook - 支持缓存、重试、错误处理
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseFetchOptions<T> {
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
  retry?: number;
  retryDelay?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  transform?: (data: any) => T;
}

export interface UseFetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
  mutate: (data: T) => void;
}

export function useFetch<T = any>(
  url: string | null,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus = false,
    retry = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    transform,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const retryCountRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!url || !enabled) return;

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const transformedData = transform ? transform(json) : json;

      setData(transformedData);
      setIsSuccess(true);
      retryCountRef.current = 0;
      onSuccess?.(transformedData);
    } catch (err) {
      const error = err as Error;

      // 如果是主动取消，不处理错误
      if (error.name === 'AbortError') {
        return;
      }

      // 重试逻辑
      if (retryCountRef.current < retry) {
        retryCountRef.current++;
        setTimeout(() => {
          fetchData();
        }, retryDelay);
        return;
      }

      setError(error);
      setIsError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [url, enabled, retry, retryDelay, transform, onSuccess, onError]);

  // 窗口聚焦时重新获取
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, enabled, fetchData]);

  // 定时重新获取
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, enabled, fetchData]);

  // 初始获取
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 手动重新获取
  const refetch = useCallback(() => {
    retryCountRef.current = 0;
    fetchData();
  }, [fetchData]);

  // 手动更新数据
  const mutate = useCallback((newData: T) => {
    setData(newData);
    setIsSuccess(true);
  }, []);

  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    refetch,
    mutate,
  };
}

/**
 * usePost Hook - 用于 POST 请求
 */
export interface UsePostOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  transform?: (data: any) => T;
}

export interface UsePostResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  post: (body: any) => Promise<void>;
  reset: () => void;
}

export function usePost<T = any>(
  url: string,
  options: UsePostOptions<T> = {}
): UsePostResult<T> {
  const { onSuccess, onError, transform } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const post = useCallback(async (body: any) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const transformedData = transform ? transform(json) : json;

      setData(transformedData);
      setIsSuccess(true);
      onSuccess?.(transformedData);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsError(true);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [url, transform, onSuccess, onError]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsSuccess(false);
    setIsError(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    post,
    reset,
  };
}

/**
 * useDelete Hook - 用于 DELETE 请求
 */
export interface UseDeleteResult {
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  delete: (id: string | number) => Promise<void>;
  reset: () => void;
}

export function useDelete(url: string): UseDeleteResult {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const deleteItem = useCallback(async (id: string | number) => {
    setIsLoading(true);
    setError(null);
    setIsError(false);
    setIsSuccess(false);

    try {
      const response = await fetch(`${url}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsSuccess(true);
    } catch (err) {
      const error = err as Error;
      setError(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
    setIsError(false);
  }, []);

  return {
    error,
    isLoading,
    isError,
    isSuccess,
    delete: deleteItem,
    reset,
  };
}
