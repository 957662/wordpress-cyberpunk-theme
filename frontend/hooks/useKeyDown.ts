'use client';

import { useEffect, RefObject } from 'react';

/**
 * Key Down Hook
 * 监听键盘按键
 */
export function useKeyDown(
  callback: (event: KeyboardEvent) => void,
  options: {
    targetKey?: string | string[];
    keyCodes?: string[];
    disabled?: boolean;
    capture?: boolean;
  } = {}
): void {
  const { targetKey, keyCodes, disabled = false, capture = false } = options;

  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // 检查是否匹配目标按键
      if (targetKey) {
        const keys = Array.isArray(targetKey) ? targetKey : [targetKey];
        if (!keys.includes(event.key) && !keys.includes(event.code)) {
          return;
        }
      }

      // 检查是否匹配键码
      if (keyCodes) {
        if (!keyCodes.includes(event.code)) {
          return;
        }
      }

      callback(event);
    };

    document.addEventListener('keydown', handleKeyDown, capture);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, capture);
    };
  }, [callback, targetKey, keyCodes, disabled, capture]);
}

/**
 * Escape Key Hook
 * 监听 ESC 键
 */
export function useEscapeKey(
  callback: () => void,
  options: {
    disabled?: boolean;
  } = {}
): void {
  useKeyDown(callback, {
    targetKey: 'Escape',
    ...options,
  });
}

/**
 * Enter Key Hook
 * 监听 Enter 键
 */
export function useEnterKey(
  callback: () => void,
  options: {
    disabled?: boolean;
  } = {}
): void {
  useKeyDown(callback, {
    targetKey: 'Enter',
    ...options,
  });
}

/**
 * Keyboard Shortcut Hook
 * 监听键盘快捷键组合
 */
export function useKeyboardShortcut(
  keys: string[],
  callback: (event: KeyboardEvent) => void,
  options: {
    disabled?: boolean;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  } = {}
): void {
  const { disabled = false, ctrl = false, shift = false, alt = false, meta = false } = options;

  useEffect(() => {
    if (disabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // 检查修饰键
      if (ctrl && !event.ctrlKey) return;
      if (shift && !event.shiftKey) return;
      if (alt && !event.altKey) return;
      if (meta && !event.metaKey) return;

      // 检查主键
      if (keys.includes(event.key) || keys.includes(event.code)) {
        event.preventDefault();
        callback(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [keys, callback, disabled, ctrl, shift, alt, meta]);
}

/**
 * Target Key Down Hook
 * 监听特定元素的键盘事件
 */
export function useTargetKeyDown<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (event: KeyboardEvent) => void,
  options: {
    disabled?: boolean;
    targetKey?: string | string[];
  } = {}
): void {
  const { disabled = false, targetKey } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (targetKey) {
        const keys = Array.isArray(targetKey) ? targetKey : [targetKey];
        if (!keys.includes(event.key) && !keys.includes(event.code)) {
          return;
        }
      }

      callback(event);
    };

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, callback, disabled, targetKey]);
}
