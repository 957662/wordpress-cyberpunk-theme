/**
 * useAsync Hook
 * 异步操作 Hook - 用于管理异步状态
 */

import { useState, useCallback, useEffect } from 'react';

export interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: () => Promise<void>;
  reset: () => void;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [asyncFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, reset };
}

// 使用示例:
// const { data, loading, error, execute, reset } = useAsync(fetchData);
