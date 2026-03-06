import { useCallback, useRef } from 'react';

export function useMemoizedCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList = []
): T {
  const callbackRef = useRef(callback);

  // Update callback ref if callback changes
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Return stable callback
  return useCallback((...args: Parameters<T>) => {
    return callbackRef.current(...args);
  }, deps) as T;
}

// Version with deep comparison
export function useMemoizedCallbackDeep<T extends (...args: any[]) => any>(
  callback: T,
  deepDeps: any[]
): T {
  const prevDeps = useRef(deepDeps);

  const hasChanged = deepDeps.some((dep, i) => {
    return !isEqual(dep, prevDeps.current[i]);
  });

  if (hasChanged) {
    prevDeps.current = deepDeps;
  }

  return useCallback(callback, hasChanged ? deepDeps : prevDeps.current) as T;
}

// Simple deep equality check
function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) => isEqual(a[key], b[key]));
}
