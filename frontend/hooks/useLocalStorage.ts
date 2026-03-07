/**
 * Local Storage Hooks
 * Custom hooks for managing localStorage and sessionStorage with state sync
 */

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// Type Definitions
// ============================================================================

type StorageType = 'localStorage' | 'sessionStorage';

interface StorageOptions<T> {
  serializer?: {
    stringify: (value: T) => string;
    parse: (value: string) => T;
  };
  syncAcrossTabs?: boolean;
}

// ============================================================================
// useLocalStorage Hook
// ============================================================================

/**
 * Hook to manage localStorage with React state
 * @param key - The storage key
 * @param initialValue - The initial value if key doesn't exist
 * @param options - Configuration options
 * @returns [storedValue, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: StorageOptions<T> = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const { serializer, syncAcrossTabs = true } = options;

  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? (serializer?.parse(item) ?? JSON.parse(item)) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          const serialized = serializer?.stringify(valueToStore) ?? JSON.stringify(valueToStore);
          window.localStorage.setItem(key, serialized);

          // Trigger storage event for cross-tab sync
          if (syncAcrossTabs) {
            window.dispatchEvent(new StorageEvent('storage', {
              key,
              newValue: serialized,
              storageArea: window.localStorage,
            }));
          }
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer, syncAcrossTabs]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);

        if (syncAcrossTabs) {
          window.dispatchEvent(new StorageEvent('storage', {
            key,
            newValue: null,
            storageArea: window.localStorage,
          }));
        }
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, syncAcrossTabs]);

  // Listen for changes from other tabs
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === window.localStorage) {
        try {
          const newValue = e.newValue
            ? serializer?.parse(e.newValue) ?? JSON.parse(e.newValue)
            : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, serializer, syncAcrossTabs]);

  return [storedValue, setValue, removeValue];
}

// ============================================================================
// useSessionStorage Hook
// ============================================================================

/**
 * Hook to manage sessionStorage with React state
 * @param key - The storage key
 * @param initialValue - The initial value if key doesn't exist
 * @param options - Configuration options
 * @returns [storedValue, setValue, removeValue]
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T,
  options: StorageOptions<T> = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const { serializer } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (serializer?.parse(item) ?? JSON.parse(item)) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          const serialized = serializer?.stringify(valueToStore) ?? JSON.stringify(valueToStore);
          window.sessionStorage.setItem(key, serialized);
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// ============================================================================
// useStorage Hook (Generic)
// ============================================================================

/**
 * Generic storage hook that can use either localStorage or sessionStorage
 * @param type - The type of storage ('localStorage' or 'sessionStorage')
 * @param key - The storage key
 * @param initialValue - The initial value if key doesn't exist
 * @returns [storedValue, setValue, removeValue]
 */
export function useStorage<T>(
  type: StorageType,
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const storage = type === 'localStorage' ? useLocalStorage : useSessionStorage;
  return storage(key, initialValue);
}

// ============================================================================
// useLocalStorageState Hook (Advanced)
// ============================================================================

interface LocalStorageStateOptions<T> {
  serializer?: {
    read: (value: string) => T;
    write: (value: T) => string;
  };
  onError?: (error: Error) => void;
}

/**
 * Advanced localStorage state hook with better error handling
 */
export function useLocalStorageState<T>(
  key: string,
  options?: LocalStorageStateOptions<T>
): [T | undefined, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const { serializer, onError } = options || {};

  const [state, setState] = useState<T | undefined>(() => {
    if (typeof window === 'undefined') return undefined;

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return undefined;
      return serializer?.read(item) ?? (JSON.parse(item) as T);
    } catch (error) {
      onError?.(error as Error);
      return undefined;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (state === undefined) {
        window.localStorage.removeItem(key);
      } else {
        const serialized = serializer?.write(state) ?? JSON.stringify(state);
        window.localStorage.setItem(key, serialized);
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, state, serializer, onError]);

  const removeState = useCallback(() => {
    setState(undefined);
  }, []);

  return [state, setState, removeState];
}

// ============================================================================
// useObjectStorage Hook
// ============================================================================

/**
 * Hook for storing objects with automatic JSON serialization
 */
export function useObjectStorage<T extends object>(
  key: string,
  initialValue: T,
  storageType: StorageType = 'localStorage'
): [T, (value: Partial<T> | ((val: T) => Partial<T>)) => void, () => void] {
  const [storedValue, setStoredValue, removeValue] = useStorage(
    storageType,
    key,
    initialValue
  );

  const updateValue = useCallback(
    (updates: Partial<T> | ((val: T) => Partial<T>)) => {
      setStoredValue((current) => ({
        ...current,
        ...(updates instanceof Function ? updates(current) : updates),
      }));
    },
    [setStoredValue]
  );

  return [storedValue, updateValue, removeValue];
}

// ============================================================================
// useArrayStorage Hook
// ============================================================================

/**
 * Hook for storing arrays with helper methods
 */
export function useArrayStorage<T>(
  key: string,
  initialValue: T[] = [],
  storageType: StorageType = 'localStorage'
) {
  const [storedArray, setStoredArray, removeArray] = useStorage(
    storageType,
    key,
    initialValue
  );

  const addItem = useCallback(
    (item: T) => {
      setStoredArray((current) => [...current, item]);
    },
    [setStoredArray]
  );

  const removeItem = useCallback(
    (index: number) => {
      setStoredArray((current) => current.filter((_, i) => i !== index));
    },
    [setStoredArray]
  );

  const updateItem = useCallback(
    (index: number, item: T) => {
      setStoredArray((current) =>
        current.map((existingItem, i) => (i === index ? item : existingItem))
      );
    },
    [setStoredArray]
  );

  const clearArray = useCallback(() => {
    setStoredArray([]);
  }, [setStoredArray]);

  return {
    array: storedArray,
    setArray: setStoredArray,
    addItem,
    removeItem,
    updateItem,
    clearArray,
    removeArray,
  };
}

// ============================================================================
// Export All Hooks
// ============================================================================

export const storageHooks = {
  useLocalStorage,
  useSessionStorage,
  useStorage,
  useLocalStorageState,
  useObjectStorage,
  useArrayStorage,
};

export default useLocalStorage;
