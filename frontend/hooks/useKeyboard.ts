/**
 * useKeyboard Hook
 * 键盘快捷键支持
 */

import { useEffect, useRef } from 'react';

type KeyboardHandler = (event: KeyboardEvent) => void;

interface KeyboardOptions {
  /**
   * 是否在输入框中触发
   * @default false
   */
  ignoreInputs?: boolean;

  /**
   * 事件目标
   * @default window
   */
  target?: EventTarget;
}

interface KeyMap {
  [key: string]: KeyboardHandler;
}

export function useKeyboard(
  keyMap: KeyMap,
  options: KeyboardOptions = {}
) {
  const { ignoreInputs = false, target = window } = options;
  const latestKeyMap = useRef(keyMap);

  // 更新最新的 keyMap
  useEffect(() => {
    latestKeyMap.current = keyMap;
  }, [keyMap]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 检查是否在输入框中
      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      // 构建按键组合
      const keys: string[] = [];
      if (event.ctrlKey) keys.push('ctrl');
      if (event.metaKey) keys.push('cmd');
      if (event.altKey) keys.push('alt');
      if (event.shiftKey) keys.push('shift');
      keys.push(event.key.toLowerCase());

      const keyCombo = keys.join('+');

      // 查找并执行对应的处理函数
      const handler = latestKeyMap.current[keyCombo];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    };

    target.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      target.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [ignoreInputs, target]);
}

// 常用的快捷键组合
export const shortcuts = {
  save: 'ctrl+s',
  open: 'ctrl+o',
  find: 'ctrl+f',
  replace: 'ctrl+h',
  undo: 'ctrl+z',
  redo: 'ctrl+shift+z',
  selectAll: 'ctrl+a',
  copy: 'ctrl+c',
  paste: 'ctrl+v',
  cut: 'ctrl+x',
  bold: 'ctrl+b',
  italic: 'ctrl+i',
  escape: 'escape',
  enter: 'enter',
  space: ' ',
  arrowUp: 'arrowup',
  arrowDown: 'arrowdown',
  arrowLeft: 'arrowleft',
  arrowRight: 'arrowright',
};
