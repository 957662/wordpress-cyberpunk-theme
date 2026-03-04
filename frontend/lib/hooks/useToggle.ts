'use client';

import { useState, useCallback } from 'react';

export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setToggle = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, setToggle];
}

// Hook for managing multiple boolean states
export function useToggles<T extends string>(keys: T[]): Record<T, boolean> & { toggle: (key: T) => void; set: (key: T, value: boolean) => void; reset: () => void } {
  const initialState = keys.reduce((acc, key) => ({ ...acc, [key]: false }), {} as Record<T, boolean>);
  const [values, setValues] = useState<Record<T, boolean>>(initialState);

  const toggle = useCallback((key: T) => {
    setValues((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const set = useCallback((key: T, value: boolean) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialState);
  }, []);

  return {
    ...values,
    toggle,
    set,
    reset,
  };
}
