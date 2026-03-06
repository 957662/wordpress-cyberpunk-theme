/**
 * Command Dialog 命令对话框组件
 * 类似 VS Code 的命令面板，用于快速执行命令
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, FileText, Settings, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  keywords?: string[];
  action: () => void | Promise<void>;
  shortcut?: string;
  category?: string;
}

export interface CommandCategory {
  id: string;
  label: string;
  commands: Command[];
}

export interface CommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
  placeholder?: string;
  className?: string;
}

export function CommandDialog({
  isOpen,
  onClose,
  commands,
  placeholder = '输入命令或搜索...',
  className,
}: CommandDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 过滤命令
  const filteredCommands = useCallback(() => {
    if (!searchQuery) return commands;

    const query = searchQuery.toLowerCase();
    return commands.filter(command => {
      const matchLabel = command.label.toLowerCase().includes(query);
      const matchDescription = command.description?.toLowerCase().includes(query);
      const matchKeywords = command.keywords?.some(keyword =>
        keyword.toLowerCase().includes(query)
      );
      return matchLabel || matchDescription || matchKeywords;
    });
  }, [commands, searchQuery]);

  // 按分类分组
  const groupedCommands = useCallback(() => {
    const filtered = filteredCommands();
    const groups: Record<string, Command[]> = {};

    filtered.forEach(command => {
      const category = command.category || '其他';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(command);
    });

    return Object.entries(groups).map(([category, cmds]) => ({
      category,
      commands: cmds,
    }));
  }, [filteredCommands]);

  // 自动聚焦输入框
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 重置状态
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const filtered = filteredCommands();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
        break;
      case 'Enter':
        e.preventDefault();
        const selectedCommand = filtered[selectedIndex];
        if (selectedCommand) {
          selectedCommand.action();
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  // 滚动到选中项
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const groups = groupedCommands();
  const hasNoResults = groups.length === 0 || groups.every(g => g.commands.length === 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* 对话框 */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'w-full max-w-2xl mx-4 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden',
                className
              )}
            >
              {/* 搜索框 */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-800">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-base"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    aria-label="清除搜索"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-800 rounded">
                  ESC
                </kbd>
              </div>

              {/* 命令列表 */}
              <div
                ref={listRef}
                className="max-h-[400px] overflow-y-auto overflow-x-hidden p-2"
              >
                {hasNoResults ? (
                  <div className="py-8 text-center text-gray-500">
                    没有找到匹配的命令
                  </div>
                ) : (
                  groups.map((group, groupIndex) => (
                    <div key={group.category} className={cn(groupIndex > 0 && 'mt-4')}>
                      {/* 分类标题 */}
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                        {group.category}
                      </div>

                      {/* 命令项 */}
                      {group.commands.map((command, commandIndex) => {
                        const globalIndex = commands.indexOf(command);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <motion.button
                            key={command.id}
                            onClick={() => {
                              command.action();
                              onClose();
                            }}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-3 rounded-lg',
                              'text-left transition-all duration-150',
                              'group',
                              isSelected
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'text-gray-300 hover:bg-gray-800'
                            )}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            {command.icon && (
                              <span className="flex-shrink-0 w-5 h-5 text-current">
                                {command.icon}
                              </span>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{command.label}</span>
                                {isSelected && (
                                  <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-xs"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </motion.span>
                                )}
                              </div>
                              {command.description && (
                                <div className="text-xs text-gray-500 mt-0.5 truncate">
                                  {command.description}
                                </div>
                              )}
                            </div>
                            {command.shortcut && (
                              <kbd className="hidden sm:inline-flex px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-800 rounded">
                                {command.shortcut}
                              </kbd>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* 底部提示 */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800 text-xs text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↑↓</kbd>
                    <span>导航</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">↵</kbd>
                    <span>选择</span>
                  </span>
                </div>
                <span>{filteredCommands().length} 个命令</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * 快捷触发器
 */
export interface CommandTriggerProps {
  icon?: React.ReactNode;
  label?: string;
  shortcut?: string;
  onOpen: () => void;
  className?: string;
}

export function CommandTrigger({
  icon = <Search className="w-4 h-4" />,
  label = '搜索',
  shortcut = '⌘K',
  onOpen,
  className,
}: CommandTriggerProps) {
  return (
    <button
      onClick={onOpen}
      className={cn(
        'flex items-center gap-2 px-3 py-2',
        'bg-gray-900 border border-gray-800 rounded-lg',
        'text-gray-400 hover:text-white hover:border-gray-700',
        'transition-all duration-200',
        className
      )}
    >
      {icon}
      {label && <span className="text-sm">{label}</span>}
      <kbd className="hidden sm:inline-flex ml-auto px-2 py-0.5 text-xs font-semibold bg-gray-800 rounded">
        {shortcut}
      </kbd>
    </button>
  );
}

/**
 * Hook - 全局快捷键支持
 */
export function useCommandDialogShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onOpen]);
}

/**
 * 预设命令
 */
export const defaultCommands: Command[] = [
  {
    id: 'new-post',
    label: '新建文章',
    description: '创建一篇新的博客文章',
    icon: <FileText className="w-4 h-4" />,
    keywords: ['post', 'article', 'write', 'create'],
    action: () => console.log('创建新文章'),
    shortcut: '⌘N',
    category: '内容',
  },
  {
    id: 'settings',
    label: '设置',
    description: '打开系统设置',
    icon: <Settings className="w-4 h-4" />,
    keywords: ['preferences', 'config', 'options'],
    action: () => console.log('打开设置'),
    shortcut: '⌘,',
    category: '系统',
  },
  {
    id: 'profile',
    label: '个人资料',
    description: '查看和编辑个人资料',
    icon: <User className="w-4 h-4" />,
    keywords: ['account', 'user', 'profile'],
    action: () => console.log('打开个人资料'),
    category: '账户',
  },
  {
    id: 'logout',
    label: '退出登录',
    description: '退出当前账户',
    icon: <LogOut className="w-4 h-4" />,
    keywords: ['signout', 'exit', 'quit'],
    action: () => console.log('退出登录'),
    category: '账户',
  },
];

/**
 * 完整的 Command Dialog 组件示例
 */
export interface FullCommandDialogProps {
  isOpen: boolean;
  onClose: () => void;
  additionalCommands?: Command[];
}

export function FullCommandDialog({
  isOpen,
  onClose,
  additionalCommands = [],
}: FullCommandDialogProps) {
  return (
    <CommandDialog
      isOpen={isOpen}
      onClose={onClose}
      commands={[...defaultCommands, ...additionalCommands]}
    />
  );
}
