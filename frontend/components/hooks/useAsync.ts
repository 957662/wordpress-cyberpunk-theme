/**
 * useAsync Hook
 * 处理异步操作的 Hook
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  status: 'idle' | 'pending' | 'success' | 'error';
}

export interface UseAsyncOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

export function useAsync<T = any>(
  asyncFunction?: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const { immediate = false, onSuccess, onError, onSettled } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    status: 'idle',
  });

  const isMountedRef = useRef(true);

  // 执行异步函数
  const execute = useCallback(
    async (...args: any[]): Promise<T | undefined> => {
      setState({ data: null, error: null, status: 'pending' });

      try {
        const promise = asyncFunction ? asyncFunction(...args) : Promise.resolve(args[0]);
        const data = await promise;

        if (isMountedRef.current) {
          setState({ data, error: null, status: 'success' });
          if (onSuccess) {
            onSuccess(data);
          }
          if (onSettled) {
            onSettled();
          }
        }

        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (isMountedRef.current) {
          setState({ data: null, error: err, status: 'error' });
          if (onError) {
            onError(err);
          }
          if (onSettled) {
            onSettled();
          }
        }
        throw err;
      }
    },
    [asyncFunction, onSuccess, onError, onSettled]
  );

  // 重置状态
  const reset = useCallback(() => {
    setState({ data: null, error: null, status: 'idle' });
  }, []);

  // 手动设置数据
  const setData = useCallback((data: T) => {
    setState({ data, error: null, status: 'success' });
  }, []);

  // 手动设置错误
  const setError = useCallback((error: Error) => {
    setState({ data: null, error, status: 'error' });
  }, []);

  // 立即执行
  useEffect(() => {
    if (immediate && asyncFunction) {
      execute();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [immediate]);

  return {
    ...state,
    isIdle: state.status === 'idle',
    isLoading: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    execute,
    reset,
    setData,
    setError,
  };
}

/**
 * 使用示例:
 *
 * const { data, error, isLoading, execute } = useAsync(
 *   () => fetch('/api/posts').then(res => res.json()),
 *   { immediate: true }
 * );
 */

// ============================================
// useFetch Hook - 专门用于数据请求
// ============================================

export interface UseFetchOptions extends UseAsyncOptions {
  dependencies?: any[];
  condition?: boolean;
}

export function useFetch<T = any>(
  url: string,
  options: RequestInit = {},
  asyncOptions: UseFetchOptions = {}
) {
  const { dependencies = [], condition = true, ...asyncOptions } = asyncOptions;

  const fetchFn = useCallback(async () => {
    if (!condition) {
      throw new Error('Fetch condition not met');
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json() as Promise<T>;
  }, [url, JSON.stringify(options), condition]);

  return useAsync<T>(fetchFn, {
    ...asyncOptions,
    immediate: true,
  });
}

/**
 * 使用示例:
 *
 * const { data, isLoading, error } = useFetch<Post[]>(
 *   '/api/posts',
 *   { method: 'GET' },
 *   {
 *     dependencies: [category],
 *     condition: !!category
 *   }
 * );
 */

// ============================================
// useMutation Hook - 用于数据变更操作
// ============================================

export interface MutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void;
}

export function useMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TVariables> = {}
) {
  const [state, setState] = useState<AsyncState<TData>>({
    data: null,
    error: null,
    status: 'idle',
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setState({ data: null, error: null, status: 'pending' });

      try {
        const data = await mutationFn(variables);
        setState({ data, error: null, status: 'success' });

        if (options.onSuccess) {
          options.onSuccess(data, variables);
        }
        if (options.onSettled) {
          options.onSettled(data, null, variables);
        }

        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ data: null, error: err, status: 'error' });

        if (options.onError) {
          options.onError(err, variables);
        }
        if (options.onSettled) {
          options.onSettled(undefined, err, variables);
        }

        throw err;
      }
    },
    [mutationFn, options]
  );

  const reset = useCallback(() => {
    setState({ data: null, error: null, status: 'idle' });
  }, []);

  return {
    ...state,
    mutate,
    reset,
    isIdle: state.status === 'idle',
    isLoading: state.status === 'pending',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
  };
}

/**
 * 使用示例:
 *
 * const { mutate, isLoading, error } = useMutation(
 *   ({ email, password }) => api.login({ email, password }),
 *   {
 *     onSuccess: (data) => {
 *       router.push('/dashboard');
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     },
 *   }
 * );
 */
