'use client';

import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// Hook for comparing current and previous values
export function useCompare<T>(value: T): boolean {
  const prevValue = usePrevious(value);
  return prevValue !== value;
}

// Hook for tracking changes
export function useChanged<T>(value: T): boolean {
  const prevValue = usePrevious(value);
  const hasChanged = prevValue !== value;
  const wasInitialized = useRef(false);

  useEffect(() => {
    wasInitialized.current = true;
  }, []);

  // Return false on first render
  if (!wasInitialized.current) {
    return false;
  }

  return hasChanged;
}
