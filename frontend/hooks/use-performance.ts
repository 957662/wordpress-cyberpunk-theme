/**
 * Custom hooks for performance optimization
 */

import { useEffect, useState, useCallback, useRef, MutableRefObject } from 'react';
import { debounce, throttle, rafThrottle, CacheManager } from '@/lib/performance';

/**
 * Hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook for throttled values
 */
export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<Date>(new Date());

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value);
      lastRan.current = new Date();
    }, limit - (new Date().getTime() - lastRan.current.getTime()));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * Hook for lazy loading components
 */
export function useLazyLoad(
  threshold: number = 0.1,
  rootMargin: string = '50px'
): [MutableRefObject<HTMLDivElement | null>, boolean] {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [elementRef, isVisible];
}

/**
 * Hook for managing cache
 */
export function useCache<T>(key: string, ttl: number = 5 * 60 * 1000) {
  const cacheManager = useRef(new CacheManager<T>(100, ttl));
  const [data, setData] = useState<T | null>(() => {
    return cacheManager.current.get(key);
  });

  const setCache = useCallback(
    (value: T) => {
      cacheManager.current.set(key, value);
      setData(value);
    },
    [key]
  );

  const clearCache = useCallback(() => {
    cacheManager.current.clear();
    setData(null);
  }, []);

  const invalidate = useCallback(() => {
    cacheManager.current.clear();
    setData(null);
  }, []);

  return { data, setCache, clearCache, invalidate };
}

/**
 * Hook for measuring render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const renderTime = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Performance] ${componentName} rendered ${renderCount.current} times, last render took ${renderTime}ms`
      );
    }
  });

  return renderCount.current;
}

/**
 * Hook for optimized scroll handling
 */
export function useOptimizedScroll(
  callback: (event: Event) => void,
  options: {
    throttle?: number;
    raf?: boolean;
    enabled?: boolean;
  } = {}
) {
  const { throttle: throttleMs = 100, raf = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handler = raf
      ? rafThrottle(callback)
      : throttle(callback, throttleMs);

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [callback, throttleMs, raf, enabled]);
}

/**
 * Hook for optimized resize handling
 */
export function useOptimizedResize(
  callback: () => void,
  options: {
    debounce?: number;
    enabled?: boolean;
  } = {}
) {
  const { debounce: debounceMs = 150, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handler = debounce(callback, debounceMs);

    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [callback, debounceMs, enabled]);
}

/**
 * Hook for network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [effectiveType, setEffectiveType] = useState<string>('4g');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection API
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;

      const updateConnection = () => {
        setEffectiveType(connection.effectiveType);
      };

      connection.addEventListener('change', updateConnection);
      updateConnection();

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', updateConnection);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    effectiveType,
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g',
  };
}

/**
 * Hook for media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Hook for viewport size
 */
export function useViewportSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useOptimizedResize(
    useCallback(() => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, []),
    { debounce: 150 }
  );

  return size;
}

/**
 * Hook for element size
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return [ref, size] as [MutableRefObject<T | null>, { width: number; height: number }];
}

/**
 * Hook for previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * Hook for local storage with state
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for session storage with state
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from sessionStorage:`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(`Error saving ${key} to sessionStorage:`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
}

/**
 * Hook for async state
 */
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
    } catch (err) {
      setError(err as E);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

/**
 * Hook for click outside
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
}

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboardShortcut(
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  options: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  } = {}
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const keyMatch = keys.includes(event.key.toLowerCase());

      const modifierMatch =
        (!options.ctrl || event.ctrlKey) &&
        (!options.shift || event.shiftKey) &&
        (!options.alt || event.altKey) &&
        (!options.meta || event.metaKey);

      if (keyMatch && modifierMatch) {
        event.preventDefault();
        callback(event);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [keys, callback, options]);
}
