'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, FileText, Settings, Users, Zap, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  action: () => void;
  keywords?: string[];
  category?: string;
}

export interface CommandCategory {
  id: string;
  label: string;
  icon?: React.ReactNode;
  items: CommandItem[];
}

export interface CommandPaletteProps {
  commands?: CommandItem[];
  categories?: CommandCategory[];
  placeholder?: string;
  triggerKeys?: string[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  recentlyUsed?: string[];
  onCommandExecute?: (commandId: string) => void;
}

// 默认命令
const defaultCommands: CommandItem[] = [
  {
    id: 'new-post',
    label: '新建文章',
    icon: <FileText className="w-4 h-4" />,
    shortcut: ['⌘', 'N'],
    action: () => console.log('New post'),
    keywords: ['create', 'article', 'blog'],
    category: 'content',
  },
  {
    id: 'search',
    label: '搜索内容',
    icon: <Search className="w-4 h-4" />,
    shortcut: ['⌘', 'K'],
    action: () => console.log('Search'),
    keywords: ['find', 'lookup'],
    category: 'navigation',
  },
  {
    id: 'settings',
    label: '打开设置',
    icon: <Settings className="w-4 h-4" />,
    shortcut: ['⌘', ','],
    action: () => console.log('Settings'),
    keywords: ['preferences', 'config'],
    category: 'settings',
  },
  {
    id: 'users',
    label: '用户管理',
    icon: <Users className="w-4 h-4" />,
    shortcut: ['⌘', 'U'],
    action: () => console.log('Users'),
    keywords: ['people', 'team'],
    category: 'admin',
  },
  {
    id: 'theme',
    label: '切换主题',
    icon: <Zap className="w-4 h-4" />,
    shortcut: ['⌘', 'T'],
    action: () => console.log('Toggle theme'),
    keywords: ['dark', 'light'],
    category: 'settings',
  },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  commands = defaultCommands,
  categories,
  placeholder = '输入命令或搜索...',
  triggerKeys = ['⌘', 'K'],
  isOpen: controlledIsOpen,
  onOpenChange,
  className,
  recentlyUsed = [],
  onCommandExecute,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledIsOpen ?? internalIsOpen;
  const setIsOpen = onOpenChange ?? setInternalIsOpen;

  // 合并命令
  const allCommands = useMemo(() => {
    if (categories) {
      return categories.flatMap(category =>
        category.items.map(item => ({
          ...item,
          category: category.id,
        }))
      );
    }
    return commands;
  }, [commands, categories]);

  // 过滤命令
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      return allCommands;
    }

    const lowerQuery = query.toLowerCase();
    return allCommands.filter(command => {
      const matchesLabel = command.label.toLowerCase().includes(lowerQuery);
      const matchesKeywords = command.keywords?.some(keyword =>
        keyword.toLowerCase().includes(lowerQuery)
      );
      return matchesLabel || matchesKeywords;
    });
  }, [allCommands, query]);

  // 分组命令
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};

    filteredCommands.forEach(command => {
      const category = command.category || 'other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(command);
    });

    return groups;
  }, [filteredCommands]);

  // 最近使用的命令
  const recentCommands = useMemo(() => {
    if (query.trim()) return [];
    return recentlyUsed
      .map(id => allCommands.find(cmd => cmd.id === id))
      .filter(Boolean) as CommandItem[];
  }, [recentlyUsed, allCommands, query]);

  // 切换打开状态
  const toggle = useCallback(() => {
    setIsOpen(!isOpen);
    setQuery('');
    setSelectedIndex(0);
  }, [isOpen, setIsOpen]);

  // 关闭
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, [setIsOpen]);

  // 执行命令
  const executeCommand = useCallback((command: CommandItem) => {
    command.action();
    onCommandExecute?.(command.id);
    close();
  }, [close, onCommandExecute]);

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查触发键
      const isModKey = e.metaKey || e.ctrlKey;
      const isTriggerKey = triggerKeys.length === 2 && isModKey && e.key === triggerKeys[1].toLowerCase();

      if (isTriggerKey) {
        e.preventDefault();
        toggle();
        return;
      }

      // 如果打开，处理导航
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          executeCommand(selectedCommand);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggle, close, filteredCommands, selectedIndex, triggerKeys, executeCommand]);

  // 自动聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 滚动到选中项
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // 渲染命令项
  const renderCommandItem = (command: CommandItem, index: number) => {
    const isSelected = index === selectedIndex;

    return (
      <motion.button
        key={command.id}
        onClick={() => executeCommand(command)}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          'text-left group',
          isSelected
            ? 'bg-cyan-500/20 border border-cyan-500/30'
            : 'hover:bg-gray-800/50 border border-transparent'
        )}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        {/* 图标 */}
        <div className={cn(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          isSelected ? 'bg-cyan-500/20' : 'bg-gray-700/50'
        )}>
          {command.icon}
        </div>

        {/* 标签 */}
        <span className={cn(
          'flex-1 text-sm font-medium',
          isSelected ? 'text-cyan-400' : 'text-gray-300'
        )}>
          {command.label}
        </span>

        {/* 快捷键 */}
        {command.shortcut && (
          <div className="flex items-center gap-1">
            {command.shortcut.map((key, i) => (
              <kbd
                key={i}
                className={cn(
                  'px-1.5 py-0.5 text-xs rounded',
                  isSelected
                    ? 'bg-cyan-500/30 text-cyan-400'
                    : 'bg-gray-700 text-gray-400'
                )}
              >
                {key}
              </kbd>
            ))}
          </div>
        )}

        {/* 箭头 */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </motion.div>
        )}
      </motion.button>
    );
  };

  return (
    <>
      {/* 触发按钮（可选） */}
      {/* <button onClick={toggle} className="...">
        <Command className="w-4 h-4" />
      </button> */}

      {/* 命令面板 */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={close}
            />

            {/* 面板 */}
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'w-full max-w-2xl rounded-xl border-2 bg-gray-900/95 backdrop-blur-md shadow-2xl overflow-hidden',
                  'border-gray-700',
                  className
                )}
              >
                {/* 搜索输入 */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-700">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  />
                  <kbd className="px-2 py-1 text-xs bg-gray-800 text-gray-400 rounded">
                    ESC
                  </kbd>
                </div>

                {/* 命令列表 */}
                <div
                  ref={listRef}
                  className="max-h-80 overflow-y-auto p-2"
                >
                  {/* 最近使用 */}
                  {!query && recentCommands.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 font-medium">
                        <Clock className="w-3 h-3" />
                        最近使用
                      </div>
                      <div className="space-y-1">
                        {recentCommands.map((command, index) =>
                          renderCommandItem(command, index)
                        )}
                      </div>
                    </div>
                  )}

                  {/* 分组命令 */}
                  {Object.entries(groupedCommands).map(([category, commands]) => (
                    <div key={category} className="mb-4 last:mb-0">
                      <div className="px-2 py-1 text-xs text-gray-500 font-medium capitalize">
                        {category}
                      </div>
                      <div className="space-y-1">
                        {commands.map((command, index) =>
                          renderCommandItem(
                            command,
                            filteredCommands.indexOf(command)
                          )
                        )}
                      </div>
                    </div>
                  ))}

                  {/* 无结果 */}
                  {filteredCommands.length === 0 && (
                    <div className="py-8 text-center text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>未找到匹配的命令</p>
                    </div>
                  )}
                </div>

                {/* 底部提示 */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-gray-700 bg-gray-800/30">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑↓</kbd>
                      导航
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↵</kbd>
                      选择
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">ESC</kbd>
                      关闭
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
