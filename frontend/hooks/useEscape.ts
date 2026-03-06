import { useEffect } from 'react';

/**
 * Escape 键 Hook
 * @param callback 按 Escape 键时的回调函数
 */
export function useEscape(callback: () => void) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback]);
}
