/**
 * Debounce and Throttle Hooks
 * Custom hooks for debouncing and throttling values and callbacks
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// useDebounce Hook
// ============================================================================

/**
 * Debounce a value change
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds (default: 500)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timer if value changes before delay expires
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// useDebounceCallback Hook
// ============================================================================

/**
 * Debounce a callback function
 * @param callback - The function to debounce
 * @param delay - The delay in milliseconds (default: 500)
 * @param deps - Dependencies array (default: [])
 * @returns The debounced callback function
 */
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500,
  deps: any[] = []
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay, ...deps]
  ) as T;
}

// ============================================================================
// useThrottle Hook
// ============================================================================

/**
 * Throttle a value change
 * @param value - The value to throttle
 * @param limit - The time limit in milliseconds (default: 500)
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, limit: number = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<Date>(new Date());

  useEffect(() => {
    const now = new Date();
    const timeSinceLastRun = now.getTime() - lastRan.current.getTime();

    if (timeSinceLastRun >= limit) {
      setThrottledValue(value);
      lastRan.current = now;
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value);
        lastRan.current = new Date();
      }, limit - timeSinceLastRun);

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}

// ============================================================================
// useThrottleCallback Hook
// ============================================================================

/**
 * Throttle a callback function
 * @param callback - The function to throttle
 * @param limit - The time limit in milliseconds (default: 500)
 * @param deps - Dependencies array (default: [])
 * @returns The throttled callback function
 */
export function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 500,
  deps: any[] = []
): T {
  const lastRun = useRef<Date>(new Date());
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = new Date();
      const timeSinceLastRun = now.getTime() - lastRun.current.getTime();

      if (timeSinceLastRun >= limit) {
        callbackRef.current(...args);
        lastRun.current = now;
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          callbackRef.current(...args);
          lastRun.current = new Date();
          timeoutRef.current = undefined;
        }, limit - timeSinceLastRun);
      }
    },
    [limit, ...deps]
  ) as T;
}

// ============================================================================
// useDebouncedValue Hook (Advanced)
// ============================================================================

interface DebouncedValueOptions {
  delay?: number;
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Advanced debounced value hook with leading/trailing options
 * @param value - The value to debounce
 * @param options - Configuration options
 * @returns The debounced value
 */
export function useDebouncedValue<T>(
  value: T,
  options: DebouncedValueOptions = {}
): T {
  const { delay = 500, leading = false, trailing = true } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (leading && firstUpdate.current) {
      setDebouncedValue(value);
      firstUpdate.current = false;
      return;
    }

    if (trailing) {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [value, delay, leading, trailing]);

  return debouncedValue;
}

// ============================================================================
// useDebouncedState Hook
// ============================================================================

/**
 * Debounce state updates
 * @param initialValue - The initial state value
 * @param delay - The delay in milliseconds (default: 500)
 * @returns [state, setState, debouncedState]
 */
export function useDebouncedState<S>(
  initialValue: S | (() => S),
  delay: number = 500
): [S, React.Dispatch<React.SetStateAction<S>>, S] {
  const [state, setState] = useState<S>(initialValue);
  const [debouncedState, setDebouncedState] = useState<S>(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedState(state);
    }, delay);

    return () => clearTimeout(timer);
  }, [state, delay]);

  return [state, setState, debouncedState];
}

// ============================================================================
// Export All Hooks
// ============================================================================

export const debounceHooks = {
  useDebounce,
  useDebounceCallback,
  useDebouncedValue,
  useDebouncedState,
  throttle: {
    useThrottle,
    useThrottleCallback,
  },
};

export default useDebounce;
