'use client';

import { useState, useCallback } from 'react';

export interface UseCounterReturn {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setValue: (value: number) => void;
}

export function useCounter(initialValue: number = 0): UseCounterReturn {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value: number) => {
    setCount(value);
  }, []);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
  };
}

// Counter with min/max limits
export function useBoundedCounter(
  initialValue: number = 0,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
): UseCounterReturn {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + 1, max));
  }, [max]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - 1, min));
  }, [min]);

  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);

  const setValue = useCallback((value: number) => {
    setCount(Math.max(min, Math.min(max, value)));
  }, [min, max]);

  return {
    count,
    increment,
    decrement,
    reset,
    setValue,
  };
}
