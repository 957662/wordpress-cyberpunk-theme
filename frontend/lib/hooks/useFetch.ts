'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface UseFetchReturn<T> extends FetchState<T> {
  refetch: () => Promise<void>;
  abort: () => void;
}

export function useFetch<T>(
  url: string,
  options: RequestInit = {},
  immediate = true
): UseFetchReturn<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setState({ data: null, loading: true, error: null });

    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Ignore abort errors
      }
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [url, JSON.stringify(options)]);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }

    return () => {
      abort();
    };
  }, [fetchData, immediate, abort]);

  return {
    ...state,
    refetch: fetchData,
    abort,
  };
}

// Hook for POST requests
export function usePost<T = any, B = any>(
  url: string,
  options: Omit<RequestInit, 'method' | 'body'> = {}
) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const post = useCallback(
    async (body: B) => {
      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setState({ data: null, loading: true, error: null });

      try {
        const response = await fetch(url, {
          ...options,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: JSON.stringify(body),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return; // Ignore abort errors
        }
        setState({ data: null, loading: false, error: error as Error });
        throw error;
      }
    },
    [url, JSON.stringify(options)]
  );

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  useEffect(() => {
    return () => {
      abort();
    };
  }, [abort]);

  return { ...state, post, abort };
}

import { useRef } from 'react';
