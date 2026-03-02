'use client';

/**
 * useKeyboardShortcuts Hook
 * 键盘快捷键 Hook - 处理键盘事件
 */

import { useEffect, useCallback } from 'react';

type KeyboardHandler = (event: KeyboardEvent) => void;

interface ShortcutConfig {
  key: string;
  handler: KeyboardHandler;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
}

interface UseKeyboardShortcutsOptions {
  disabled?: boolean;
  capture?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutConfig[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { disabled = false, capture = false } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (disabled) return;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl === undefined || event.ctrlKey === shortcut.ctrl;
        const shiftMatch = shortcut.shift === undefined || event.shiftKey === shortcut.shift;
        const altMatch = shortcut.alt === undefined || event.altKey === shortcut.alt;
        const metaMatch = shortcut.meta === undefined || event.metaKey === shortcut.meta;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          if (shortcut.preventDefault) {
            event.preventDefault();
          }
          shortcut.handler(event);
          break;
        }
      }
    },
    [shortcuts, disabled]
  );

  useEffect(() => {
    if (disabled) return;

    document.addEventListener('keydown', handleKeyDown, capture);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, capture);
    };
  }, [handleKeyDown, disabled, capture]);
}
