'use client';

import { useEffect, useState, useCallback } from 'react';
import { Keyboard, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Shortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
  category?: string;
}

interface KeyboardShortcutsProps {
  /**
   * 快捷键列表
   */
  shortcuts: Shortcut[];

  /**
   * 是否显示帮助按钮
   */
  showHelpButton?: boolean;

  /**
   * 帮助按钮位置
   */
  helpButtonPosition?: 'bottom-left' | 'bottom-right';

  /**
   * 是否启用
   */
  enabled?: boolean;

  /**
   * 全局快捷键（不需要聚焦）
   */
  global?: boolean;
}

export function KeyboardShortcuts({
  shortcuts,
  showHelpButton = true,
  helpButtonPosition = 'bottom-right',
  enabled = true,
  global = true,
}: KeyboardShortcutsProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [justPressed, setJustPressed] = useState<string | null>(null);

  // 按键检测
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;
      const meta = event.metaKey;

      // 查找匹配的快捷键
      const matchedShortcut = shortcuts.find((shortcut) => {
        return (
          shortcut.key.toLowerCase() === key &&
          !!shortcut.ctrl === ctrl &&
          !!shortcut.shift === shift &&
          !!shortcut.alt === alt &&
          !!shortcut.meta === meta
        );
      });

      if (matchedShortcut) {
        event.preventDefault();
        matchedShortcut.action();

        // 显示按键反馈
        setJustPressed(matchedShortcut.key);
        setTimeout(() => setJustPressed(null), 500);
      }

      // 打开帮助的快捷键 (默认 ?)
      if (key === '?' && global) {
        setIsHelpOpen((prev) => !prev);
      }
    };

    if (global) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (global) {
        window.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [shortcuts, enabled, global]);

  // 按ESC关闭帮助
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsHelpOpen(false);
      }
    };

    if (isHelpOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isHelpOpen]);

  // 格式化快捷键显示
  const formatShortcut = (shortcut: Shortcut): string => {
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.meta) parts.push('⌘');
    parts.push(shortcut.key.toUpperCase());
    return parts.join(' + ');
  };

  // 按分类分组
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || '其他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  return (
    <>
      {/* 帮助按钮 */}
      {showHelpButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsHelpOpen(true)}
          className={`fixed ${
            helpButtonPosition === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4'
          } bg-cyber-dark/90 border border-cyber-cyan/30 text-cyber-cyan p-3 rounded-full shadow-lg hover:border-cyber-cyan/60 transition-colors z-40 backdrop-blur-sm`}
          title="键盘快捷键 (?)"
        >
          <Keyboard size={20} />
        </motion.button>
      )}

      {/* 帮助面板 */}
      <AnimatePresence>
        {isHelpOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setIsHelpOpen(false)}
            />

            {/* 面板内容 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-cyber-dark border border-cyber-cyan/30 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Keyboard className="text-cyber-cyan" size={24} />
                  <h2 className="text-lg font-semibold text-white">键盘快捷键</h2>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  <X size={24} />
                </button>
              </div>

              {/* 内容区 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-cyber-purple mb-2">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {categoryShortcuts.map((shortcut, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded bg-cyber-muted/30 hover:bg-cyber-muted/50 transition-colors"
                        >
                          <span className="text-sm text-gray-300 flex-1">
                            {shortcut.description}
                          </span>
                          <kbd className="px-2 py-1 bg-cyber-dark border border-cyber-cyan/30 rounded text-xs text-cyber-cyan font-mono">
                            {formatShortcut(shortcut)}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* 提示信息 */}
                <div className="flex items-start gap-2 p-3 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-lg">
                  <Info className="text-cyber-cyan flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-gray-400">
                    按 <kbd className="px-1 bg-cyber-dark border border-cyber-cyan/30 rounded text-cyber-cyan">?</kbd> 键打开或关闭此面板，
                    按 <kbd className="px-1 bg-cyber-dark border border-cyber-cyan/30 rounded text-cyber-cyan">ESC</kbd> 键关闭
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 按键反馈 */}
      <AnimatePresence>
        {justPressed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-cyber-cyan/20 border border-cyber-cyan/40 text-cyber-cyan px-4 py-2 rounded-lg text-sm font-medium z-50 backdrop-blur-sm"
          >
            {justPressed.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * 使用键盘快捷键的 Hook
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    enabled?: boolean;
  } = {}
) {
  const { ctrl = false, shift = false, alt = false, meta = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const isMatch =
        event.key.toLowerCase() === key.toLowerCase() &&
        event.ctrlKey === ctrl &&
        event.shiftKey === shift &&
        event.altKey === alt &&
        event.metaKey === meta;

      if (isMatch) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ctrl, shift, alt, meta, enabled]);
}

/**
 * 快捷键提示组件
 */
export function ShortcutHint({
  keys,
  description,
}: {
  keys: string[];
  description: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <span>{description}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="text-gray-600">+</span>}
            <kbd className="px-2 py-1 bg-cyber-muted/50 border border-gray-700 rounded text-xs text-gray-300 font-mono">
              {key}
            </kbd>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * 常用快捷键预设
 */
export const commonShortcuts: Shortcut[] = [
  {
    key: 'k',
    ctrl: true,
    description: '打开搜索',
    action: () => console.log('Open search'),
    category: '导航',
  },
  {
    key: '/',
    description: '跳转到首页',
    action: () => (window.location.href = '/'),
    category: '导航',
  },
  {
    key: 'n',
    ctrl: true,
    description: '新建文章',
    action: () => console.log('New post'),
    category: '创作',
  },
  {
    key: 's',
    ctrl: true,
    description: '保存',
    action: () => console.log('Save'),
    category: '编辑',
  },
  {
    key: 'b',
    ctrl: true,
    description: '加粗',
    action: () => console.log('Bold'),
    category: '格式',
  },
  {
    key: 'i',
    ctrl: true,
    description: '斜体',
    action: () => console.log('Italic'),
    category: '格式',
  },
];

export default KeyboardShortcuts;
