import { useState, useCallback } from 'react';

/**
 * 下拉选择 Hook
 * @param initialValue 初始值
 */
export function useSelect<T = string>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isOpen, setIsOpen] = useState(false);

  const onSelect = useCallback((newValue: T) => {
    setValue(newValue);
    setIsOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    isOpen,
    setValue: onSelect,
    toggle,
    reset,
    props: {
      value,
      open: isOpen,
      onToggle: toggle,
    },
  };
}
