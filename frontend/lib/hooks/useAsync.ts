import { useState, useCallback, useRef, useEffect } from 'react';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
};

type AsyncFunction<T> = () => Promise<T>;

/**
 * 管理异步操作的 Hook
 * @param asyncFunction - 异步函数
 * @returns 状态和执行函数
 */
export function useAsync<T>(
  asyncFunction: AsyncFunction<T>,
  immediate: boolean = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const asyncFunctionRef = useRef(asyncFunction);

  // 保持 asyncFunction 引用最新
  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const data = await asyncFunctionRef.current();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
      throw error;
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { ...state, execute };
}

/**
 * 管理多个异步操作的 Hook
 */
export function useAsyncPool<T>(
  asyncFunctions: AsyncFunction<T>[],
  options: { maxConcurrent?: number; stopOnError?: boolean } = {}
) {
  const { maxConcurrent = 3, stopOnError = true } = options;
  const [results, setResults] = useState<(T | Error)[]>([]);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(0);

  const execute = useCallback(async () => {
    setLoading(true);
    setResults([]);
    setCompleted(0);

    const executeBatch = async (functions: AsyncFunction<T>[]): Promise<(T | Error)[]> => {
      const batch = functions.map(async (fn) => {
        try {
          return await fn();
        } catch (error) {
          if (stopOnError) throw error;
          return error as Error;
        }
      });

      return Promise.all(batch);
    };

    try {
      const allResults: (T | Error)[] = [];

      for (let i = 0; i < asyncFunctions.length; i += maxConcurrent) {
        const batch = asyncFunctions.slice(i, i + maxConcurrent);
        const batchResults = await executeBatch(batch);
        allResults.push(...batchResults);
        setCompleted(i + batchResults.length);
      }

      setResults(allResults);
      return allResults;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, [asyncFunctions, maxConcurrent, stopOnError]);

  return { results, loading, completed, execute };
}

/**
 * 防抖异步操作的 Hook
 */
export function useAsyncDebounce<T>(
  asyncFunction: (params: any) => Promise<T>,
  delay: number = 500
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  const execute = useCallback(
    (params: any) => {
      // 清除之前的 timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setState({ data: null, loading: true, error: null });

      return new Promise<T>((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            const data = await asyncFunction(params);
            setState({ data, loading: false, error: null });
            resolve(data);
          } catch (error) {
            setState({ data: null, loading: false, error: error as Error });
            reject(error);
          }
        }, delay);
      });
    },
    [asyncFunction, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { ...state, execute };
}

/**
 * 轮询异步操作的 Hook
 */
export function useAsyncPoll<T>(
  asyncFunction: AsyncFunction<T>,
  interval: number = 5000,
  immediate: boolean = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const intervalRef = useRef<NodeJS.Timeout>();
  const asyncFunctionRef = useRef(asyncFunction);

  useEffect(() => {
    asyncFunctionRef.current = asyncFunction;
  }, [asyncFunction]);

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await asyncFunctionRef.current();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: error as Error }));
      throw error;
    }
  }, []);

  useEffect(() => {
    if (!immediate) return;

    execute();

    intervalRef.current = setInterval(() => {
      execute();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval, immediate, execute]);

  return { ...state, execute };
}
