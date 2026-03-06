/**
 * useKeyboardShortcuts - 键盘快捷键 Hook
 *
 * 用于注册和管理键盘快捷键
 *
 * @example
 * useKeyboardShortcuts({
 *   'Ctrl+K': () => console.log('Search'),
 *   'Escape': () => closeModal(),
 * }, { enabled: true });
 */

import { useEffect, useCallback, useRef } from 'react';

type KeyHandler = () => void;

interface KeyboardShortcuts {
  [key: string]: KeyHandler;
}

interface UseKeyboardShortcutsOptions {
  /**
   * 是否启用快捷键
   */
  enabled?: boolean;

  /**
   * 作用域标识，用于区分不同的快捷键组
   */
  scope?: string;

  /**
   * 是否阻止默认行为
   */
  preventDefault?: boolean;

  /**
   * 目标元素，默认为 window
   */
  target?: HTMLElement | Document | Window;
}

/**
 * 解析快捷键字符串
 */
function parseShortcut(shortcut: string): {
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
} {
  const parts = shortcut.toLowerCase().split('+');
  
  return {
    key: parts[parts.length - 1],
    ctrl: parts.includes('ctrl') || parts.includes('control') || parts.includes('⌃'),
    shift: parts.includes('shift') || parts.includes('⇧'),
    alt: parts.includes('alt') || parts.includes('⌥') || parts.includes('option'),
    meta: parts.includes('meta') || parts.includes('⌘') || parts.includes('cmd'),
  };
}

/**
 * 检查事件是否匹配快捷键
 */
function matchShortcut(
  event: KeyboardEvent,
  shortcut: string
): boolean {
  const parsed = parseShortcut(shortcut);
  const eventKey = event.key.toLowerCase();

  // 特殊键处理
  const keyMap: Record<string, string> = {
    ' ': 'space',
    'escape': 'esc',
    'arrowup': 'up',
    'arrowdown': 'down',
    'arrowleft': 'left',
    'arrowright': 'right',
  };

  const normalizedKey = keyMap[eventKey] || eventKey;
  const normalizedShortcutKey = keyMap[parsed.key] || parsed.key;

  return (
    normalizedKey === normalizedShortcutKey &&
    event.ctrlKey === parsed.ctrl &&
    event.shiftKey === parsed.shift &&
    event.altKey === parsed.alt &&
    event.metaKey === parsed.meta
  );
}

/**
 * 格式化快捷键为显示文本
 */
export function formatShortcut(shortcut: string): string {
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  
  return shortcut
    .toLowerCase()
    .replace(/\+/g, isMac ? ' ' : ' + ')
    .replace('ctrl', isMac ? '⌃' : 'Ctrl')
    .replace('control', isMac ? '⌃' : 'Ctrl')
    .replace('shift', isMac ? '⇧' : 'Shift')
    .replace('alt', isMac ? '⌥' : 'Alt')
    .replace('option', isMac ? '⌥' : 'Alt')
    .replace('meta', isMac ? '⌘' : 'Win')
    .replace('cmd', isMac ? '⌘' : 'Win')
    .replace('escape', 'Esc')
    .replace('arrowup', '↑')
    .replace('arrowdown', '↓')
    .replace('arrowleft', '←')
    .replace('arrowright', '→')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(isMac ? '' : ' + ');
}

/**
 * 主 Hook
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcuts,
  options: UseKeyboardShortcutsOptions = {}
) {
  const {
    enabled = true,
    scope = 'global',
    preventDefault = true,
    target = window,
  } = options;

  // 使用 ref 存储最新的 shortcuts，避免依赖变化
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // 检查用户是否在输入框中
      const target = event.target as HTMLElement;
      const isInputElement = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // 如果在输入框中且不是 Escape 键，则不处理
      if (isInputElement && event.key !== 'Escape') {
        return;
      }

      // 查找匹配的快捷键
      for (const [shortcut, handler] of Object.entries(shortcutsRef.current)) {
        if (matchShortcut(event, shortcut)) {
          if (preventDefault) {
            event.preventDefault();
            event.stopPropagation();
          }

          try {
            handler();
          } catch (error) {
            console.error(`Error executing shortcut "${shortcut}":`, error);
          }

          return;
        }
      }
    },
    [enabled, preventDefault]
  );

  useEffect(() => {
    if (!enabled) return;

    const targetElement = target;
    targetElement.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown as EventListener);
    };
  }, [enabled, target, handleKeyDown]);
}

/**
 * useHotkey - 单个快捷键 Hook
 *
 * @example
 * useHotkey('Ctrl+K', () => openSearch());
 */
export function useHotkey(
  shortcut: string,
  handler: KeyHandler,
  options: Omit<UseKeyboardShortcutsOptions, 'scope'> = {}
) {
  return useKeyboardShortcuts({ [shortcut]: handler }, options);
}

/**
 * useShortcutGroup - 分组的快捷键 Hook
 *
 * 允许在不同的作用域中注册快捷键
 */
interface ShortcutGroup {
  scope: string;
  shortcuts: KeyboardShortcuts;
}

export function useShortcutGroup() {
  const [groups, setGroups] = useState<ShortcutGroup[]>([]);
  const [activeScope, setActiveScope] = useState<string>('global');

  const registerGroup = useCallback((scope: string, shortcuts: KeyboardShortcuts) => {
    setGroups((prev) => {
      const filtered = prev.filter((g) => g.scope !== scope);
      return [...filtered, { scope, shortcuts }];
    });
  }, []);

  const activateScope = useCallback((scope: string) => {
    setActiveScope(scope);
  }, []);

  // 合并所有快捷键，但当前作用域的优先级最高
  const activeShortcuts = groups.reduce<KeyboardShortcuts>((acc, group) => {
    // 如果是当前激活的作用域，或者是全局作用域
    if (group.scope === activeScope || group.scope === 'global') {
      return { ...acc, ...group.shortcuts };
    }
    return acc;
  }, {});

  useKeyboardShortcuts(activeShortcuts, { scope: activeScope });

  return {
    registerGroup,
    activateScope,
    activeScope,
    groups,
  };
}

/**
 * 常用的快捷键预设
 */
export const commonShortcuts = {
  save: 'Ctrl+S',
  saveAs: 'Ctrl+Shift+S',
  open: 'Ctrl+O',
  close: 'Ctrl+W',
  find: 'Ctrl+F',
  replace: 'Ctrl+H',
  undo: 'Ctrl+Z',
  redo: 'Ctrl+Shift+Z',
  cut: 'Ctrl+X',
  copy: 'Ctrl+C',
  paste: 'Ctrl+V',
  selectAll: 'Ctrl+A',
  search: 'Ctrl+K',
  settings: 'Ctrl+,',
  help: '?',
  escape: 'Escape',
  enter: 'Enter',
  space: 'Space',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
};

/**
 * 显示快捷键提示的组件辅助函数
 */
export function useShortcutTooltip(shortcut: string): string {
  return formatShortcut(shortcut);
}

export default useKeyboardShortcuts;
