'use client';

/**
 * useWindowSize Hook
 * Track window dimensions with debouncing
 */

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

interface UseWindowSizeOptions {
  debounceMs?: number;
  initializeWithValue?: boolean;
}

export function useWindowSize(options: UseWindowSizeOptions = {}) {
  const { debounceMs = 100, initializeWithValue = true } = options;

  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (initializeWithValue && typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }
    return {
      width: 1024,
      height: 768,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, debounceMs);
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Initial call
    handleResize();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceMs]);

  return windowSize;
}
