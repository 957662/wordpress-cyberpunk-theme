/**
 * useKeyboardShortcuts Hook
 * 全局键盘快捷键管理
 */

import { useEffect, useCallback } from 'react';

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: (event: KeyboardEvent) => void;
  description?: string;
}

interface KeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export function useKeyboardShortcuts(
  shortcuts: Shortcut[],
  options: KeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey === undefined || event.ctrlKey === shortcut.ctrlKey;
        const shiftMatch = shortcut.shiftKey === undefined || event.shiftKey === shortcut.shiftKey;
        const altMatch = shortcut.altKey === undefined || event.altKey === shortcut.altKey;
        const metaMatch = shortcut.metaKey === undefined || event.metaKey === shortcut.metaKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          shortcut.handler(event);
          break;
        }
      }
    },
    [shortcuts, enabled, preventDefault]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// 预定义的常用快捷键
export const commonShortcuts = {
  // 搜索
  search: {
    key: 'k',
    ctrlKey: true,
    description: '打开搜索',
  },

  // 导航
  goToHome: {
    key: 'g',
    shiftKey: true,
    description: '回到首页',
  },
  goToBlog: {
    key: 'b',
    shiftKey: true,
    description: '前往博客',
  },
  goToPortfolio: {
    key: 'p',
    shiftKey: true,
    description: '前往作品集',
  },

  // 功能
  toggleTheme: {
    key: 't',
    ctrlKey: true,
    shiftKey: true,
    description: '切换主题',
  },
  toggleSidebar: {
    key: 's',
    ctrlKey: true,
    description: '切换侧边栏',
  },

  // 操作
  focusSearch: {
    key: '/',
    description: '聚焦搜索框',
  },
  escape: {
    key: 'Escape',
    description: '关闭弹窗',
  },
};

// 快捷键提示组件
export function KeyboardShortcutTooltip({ shortcut }: { shortcut: Shortcut }) {
  const keys = [];

  if (shortcut.ctrlKey) keys.push('Ctrl');
  if (shortcut.shiftKey) keys.push('Shift');
  if (shortcut.altKey) keys.push('Alt');
  if (shortcut.metaKey) keys.push('Cmd');
  keys.push(shortcut.key.toUpperCase());

  return (
    <div className="flex items-center gap-1">
      {keys.map((key, index) => (
        <kbd
          key={index}
          className="px-1.5 py-0.5 text-xs bg-cyber-muted border border-cyber-border rounded text-gray-400"
        >
          {key}
        </kbd>
      ))}
    </div>
  );
}
