import { useEffect, useCallback } from 'react';

type KeyboardShortcut = {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: () => void;
};

export function useKeyboardShortcut(
  shortcuts: KeyboardShortcut[],
  enabled: boolean = true
): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      shortcuts.forEach((shortcut) => {
        const isKeyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const isCtrlMatch = shortcut.ctrlKey ? event.ctrlKey || event.metaKey : true;
        const isShiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
        const isAltMatch = shortcut.altKey ? event.altKey : !event.altKey;
        const isMetaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;

        if (isKeyMatch && isCtrlMatch && isShiftMatch && isAltMatch && isMetaMatch) {
          event.preventDefault();
          shortcut.handler();
        }
      });
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
