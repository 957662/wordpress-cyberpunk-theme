'use client';

/**
 * useToggle Hook
 * Simple boolean toggle with helpful utilities
 */

import { useState, useCallback, useMemo } from 'react';

export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return useMemo(
    () => ({
      value,
      setValue,
      toggle,
      setTrue,
      setFalse,
    }),
    [value, toggle, setTrue, setFalse]
  );
}
