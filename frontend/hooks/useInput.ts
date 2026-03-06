import { useState, useCallback } from 'react';

/**
 * 输入框 Hook
 * @param initialValue 初始值
 */
export function useInput<T = string>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [focused, setFocused] = useState(false);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(e.target.value as unknown as T);
    },
    []
  );

  const onFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const onBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return {
    value,
    focused,
    setValue,
    onChange,
    onFocus,
    onBlur,
    reset,
    props: {
      value,
      onChange,
      onFocus,
      onBlur,
    },
  };
}
