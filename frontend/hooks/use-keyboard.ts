/**
 * useKeyboard Hook
 * 键盘 Hook - 用于监听键盘事件
 */

import { useEffect, useCallback } from 'react';

export interface KeyboardOptions {
  /** 键盘组合键，如 'ctrl+s'、'shift+a' */
  hotkey: string;
  /** 回调函数 */
  callback: (event: KeyboardEvent) => void;
  /** 是否启用 */
  enabled?: boolean;
  /** 事件触发时机 */
  onKeyDown?: boolean;
  onKeyUp?: boolean;
}

export function useKeyboard({
  hotkey,
  callback,
  enabled = true,
  onKeyDown = true,
  onKeyUp = false,
}: KeyboardOptions) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // 解析热键
      const keys = hotkey.toLowerCase().split('+');
      const pressedKeys: string[] = [];

      if (event.ctrlKey) pressedKeys.push('ctrl');
      if (event.altKey) pressedKeys.push('alt');
      if (event.shiftKey) pressedKeys.push('shift');
      if (event.metaKey) pressedKeys.push('meta');

      pressedKeys.push(event.key.toLowerCase());

      // 检查是否匹配
      const isMatch = keys.every((key) => pressedKeys.includes(key));

      if (isMatch) {
        event.preventDefault();
        callback(event);
      }
    },
    [hotkey, callback, enabled]
  );

  useEffect(() => {
    if (onKeyDown) {
      window.addEventListener('keydown', handleKeyPress);
    }

    if (onKeyUp) {
      window.addEventListener('keyup', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyPress);
    };
  }, [handleKeyPress, onKeyDown, onKeyUp]);
}

// 便捷 Hooks
export function useEscapeKey(callback: () => void, enabled = true) {
  useKeyboard({
    hotkey: 'escape',
    callback,
    enabled,
  });
}

export function useEnterKey(callback: () => void, enabled = true) {
  useKeyboard({
    hotkey: 'enter',
    callback,
    enabled,
  });
}

export function useSaveShortcut(callback: () => void, enabled = true) {
  useKeyboard({
    hotkey: 'ctrl+s',
    callback,
    enabled,
  });
}

// 使用示例:
// useKeyboard({ hotkey: 'ctrl+s', callback: handleSave });
// useEscapeKey(() => closeModal());
