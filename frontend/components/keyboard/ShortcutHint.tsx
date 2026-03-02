'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Shortcut {
  key: string;
  description: string;
  category?: string;
  action?: () => void;
}

export interface ShortcutHintProps {
  shortcuts: Shortcut[];
  triggerKey?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export const ShortcutHint: React.FC<ShortcutHintProps> = ({
  shortcuts,
  triggerKey = '?',
  position = 'bottom-right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === triggerKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerKey, isOpen]);

  // 按类别分组
  const grouped = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  // 位置样式
  const positionStyles: Record<string, string> = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <>
      {/* 触发按钮 */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed z-40 p-3 rounded-xl border-2 backdrop-blur-md transition-all duration-200',
          isOpen
            ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/30'
            : 'bg-gray-900/80 border-gray-700 hover:border-gray-600',
          positionStyles[position],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Keyboard className={cn(
          'w-5 h-5',
          isOpen ? 'text-cyan-400' : 'text-gray-400'
        )} />
      </motion.button>

      {/* 快捷键面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* 面板 */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-xl border-2 bg-gray-900/95 backdrop-blur-md shadow-2xl border-gray-700"
              >
                {/* 头部 */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                  <div className="flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-white">键盘快捷键</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded hover:bg-gray-700/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* 内容 */}
                <div className="p-4 overflow-y-auto max-h-96">
                  {Object.entries(grouped).map(([category, categoryShortcuts]) => (
                    <div key={category} className="mb-6 last:mb-0">
                      <h4 className="text-sm font-medium text-gray-400 capitalize mb-3">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {categoryShortcuts.map((shortcut, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors cursor-pointer"
                            onClick={() => {
                              shortcut.action?.();
                              setIsOpen(false);
                            }}
                          >
                            <span className="text-sm text-gray-300">
                              {shortcut.description}
                            </span>
                            <kbd className="px-2 py-1 text-sm bg-gray-700 text-cyan-400 rounded">
                              {shortcut.key}
                            </kbd>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 底部提示 */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700 bg-gray-800/30">
                  <p className="text-xs text-gray-500">
                    按 <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">{triggerKey}</kbd> 打开/关闭
                  </p>
                  <p className="text-xs text-gray-500">
                    按 <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">ESC</kbd> 关闭
                  </p>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// 快捷键提示工具提示
export interface ShortcutTooltipProps {
  shortcut: string[];
  children: React.ReactNode;
  className?: string;
}

export const ShortcutTooltip: React.FC<ShortcutTooltipProps> = ({
  shortcut,
  children,
  className,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-gray-900 border border-gray-700 whitespace-nowrap z-50"
          >
            <div className="flex items-center gap-1">
              {shortcut.map((key, i) => (
                <kbd
                  key={i}
                  className="px-1.5 py-0.5 text-xs bg-gray-800 text-cyan-400 rounded"
                >
                  {key}
                </kbd>
              ))}
            </div>
            {/* 小三角 */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-700" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 快捷键徽章
export interface ShortcutBadgeProps {
  shortcut: string[];
  className?: string;
}

export const ShortcutBadge: React.FC<ShortcutBadgeProps> = ({
  shortcut,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {shortcut.map((key, i) => (
        <kbd
          key={i}
          className="px-1.5 py-0.5 text-xs bg-gray-800 text-gray-400 rounded border border-gray-700"
        >
          {key}
        </kbd>
      ))}
    </div>
  );
};

export default ShortcutHint;
