/**
 * useKeyboard Hook
 * 键盘事件 Hook - 监听键盘快捷键
 */

import { useEffect, useCallback } from 'react';

export interface UseKeyboardOptions {
  /**
   * 键组合 (e.g., 'ctrl+s', 'cmd+s')
   */
  key: string;

  /**
   * 回调函数
   */
  callback: (event: KeyboardEvent) => void;

  /**
   * 是否启用
   */
  enabled?: boolean;

  /**
   * 是否阻止默认行为
   */
  preventDefault?: boolean;
}

export function useKeyboard({
  key,
  callback,
  enabled = true,
  preventDefault = true,
}: UseKeyboardOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // 解析键组合
      const keys = key.toLowerCase().split('+');
      const targetKey = keys[keys.length - 1];
      const modifiers = keys.slice(0, -1);

      // 检查修饰键
      const ctrl = modifiers.includes('ctrl') || modifiers.includes('cmd');
      const shift = modifiers.includes('shift');
      const alt = modifiers.includes('alt');
      const meta = modifiers.includes('meta');

      // 检查键是否匹配
      const isModifierMatch =
        (!ctrl || event.ctrlKey || event.metaKey) &&
        (!shift || event.shiftKey) &&
        (!alt || event.altKey) &&
        (!meta || event.metaKey);

      const isKeyMatch = event.key.toLowerCase() === targetKey;

      if (isModifierMatch && isKeyMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        callback(event);
      }
    },
    [key, callback, enabled, preventDefault]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

/**
 * 便捷 Hook - 常用快捷键
 */

export function useEscapeKey(callback: () => void, enabled = true) {
  useKeyboard({
    key: 'escape',
    callback,
    enabled,
  });
}

export function useEnterKey(callback: () => void, enabled = true) {
  useKeyboard({
    key: 'enter',
    callback,
    enabled,
  });
}

export function useSaveShortcut(callback: () => void, enabled = true) {
  useKeyboard({
    key: 'ctrl+s',
    callback,
    enabled,
  });
}

/**
 * 使用示例:
 *
 * function MyComponent() {
 *   useKeyboard({
 *     key: 'ctrl+k',
 *     callback: () => console.log('Command palette opened'),
 *   });
 *
 *   useEscapeKey(() => {
 *     console.log('Escape pressed');
 *   });
 *
 *   return <div>Press Ctrl+K</div>;
 * }
 */
