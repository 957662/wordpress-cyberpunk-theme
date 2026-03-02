'use client';

import { useEffect, useState } from 'react';

/**
 * Hook: 键盘按键检测
 */
export function useKeyboard() {
  const [keys, setKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return {
    keys,
    isPressed: (key: string) => keys.has(key),
    isCtrlPressed: () => keys.has('Control'),
    isShiftPressed: () => keys.has('Shift'),
    isAltPressed: () => keys.has('Alt'),
    isMetaPressed: () => keys.has('Meta'),
    isEscape: () => keys.has('Escape'),
    isEnter: () => keys.has('Enter')
  };
}

/**
 * Hook: 快捷键监听
 */
export function useShortcut(
  keys: string[],
  callback: () => void,
  options: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    preventDefault?: boolean;
  } = {}
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMatch = keys.includes(e.key);
      const ctrlMatch = options.ctrl === undefined || e.ctrlKey === options.ctrl;
      const shiftMatch = options.shift === undefined || e.shiftKey === options.shift;
      const altMatch = options.alt === undefined || e.altKey === options.alt;
      const metaMatch = options.meta === undefined || e.metaKey === options.meta;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        if (options.preventDefault) {
          e.preventDefault();
        }
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, callback, options]);
}

/**
 * Hook: 键输入监听
 */
export function useKeyPress(targetKey: string): boolean {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setIsPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === targetKey) {
        setIsPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [targetKey]);

  return isPressed;
}
