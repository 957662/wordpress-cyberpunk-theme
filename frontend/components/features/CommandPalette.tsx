'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  FileText,
  User,
  Settings,
  Home,
  Tag,
  Folder,
  X,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Command {
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string[];
  action: () => void;
  category?: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  commands: Command[];
  placeholder?: string;
  onClose?: () => void;
}

export function CommandPalette({
  commands,
  placeholder = '输入命令或搜索...',
  onClose,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 过滤命令
  const filteredCommands = React.useMemo(() => {
    if (!search) return commands;

    const searchLower = search.toLowerCase();
    return commands.filter((command) => {
      const matchLabel = command.label.toLowerCase().includes(searchLower);
      const matchDesc = command.description?.toLowerCase().includes(searchLower);
      const matchKeywords = command.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      );
      return matchLabel || matchDesc || matchKeywords;
    });
  }, [commands, search]);

  // 分组命令
  const groupedCommands = React.useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filteredCommands.forEach((command) => {
      const category = command.category || '其他';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(command);
    });
    return groups;
  }, [filteredCommands]);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K 打开
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      // Escape 关闭
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }

      // 导航
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
        }
        if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
          e.preventDefault();
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  // 自动聚焦输入框
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // 滚动到选中项
  useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      selectedElement?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleCommandClick = useCallback((command: Command) => {
    command.action();
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  }, []);

  // 获取图标
  const getDefaultIcon = (category: string) => {
    switch (category) {
      case '页面':
        return FileText;
      case '用户':
        return User;
      case '设置':
        return Settings;
      case '导航':
        return Home;
      case '标签':
        return Tag;
      case '文件夹':
        return Folder;
      default:
        return ArrowRight;
    }
  };

  return (
    <>
      {/* 触发按钮 */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 w-full max-w-2xl mx-auto
            bg-cyber-card border border-cyber-border rounded-lg
            hover:border-cyber-cyan transition-colors group"
        >
          <Search className="w-5 h-5 text-gray-400 group-hover:text-cyber-cyan transition-colors" />
          <span className="flex-1 text-left text-gray-400">{placeholder}</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium
            bg-cyber-muted border border-cyber-border rounded text-gray-500">
            <span>⌘</span>
            <span>K</span>
          </kbd>
        </motion.button>
      )}

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
              onClick={() => setIsOpen(false)}
            />

            {/* 面板 */}
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-2xl bg-cyber-card border border-cyber-border
                  rounded-xl shadow-2xl shadow-cyber-cyan/10 overflow-hidden"
              >
                {/* 搜索框 */}
                <div className="flex items-center gap-3 p-4 border-b border-cyber-border">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  />
                  {search && (
                    <button
                      onClick={() => {
                        setSearch('');
                        setSelectedIndex(0);
                      }}
                      className="p-1 hover:bg-cyber-muted rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium
                    bg-cyber-muted border border-cyber-border rounded text-gray-500">
                    <span>ESC</span>
                  </kbd>
                </div>

                {/* 命令列表 */}
                <div
                  ref={listRef}
                  className="max-h-[400px] overflow-y-auto p-2"
                >
                  {filteredCommands.length === 0 ? (
                    <div className="py-12 text-center text-gray-500">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>没有找到相关命令</p>
                    </div>
                  ) : (
                    Object.entries(groupedCommands).map(([category, commands]) => (
                      <div key={category} className="mb-4">
                        {/* 分类标题 */}
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {category}
                        </div>

                        {/* 命令项 */}
                        {commands.map((command, index) => {
                          const Icon = command.icon || getDefaultIcon(category);
                          const globalIndex = filteredCommands.indexOf(command);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <motion.button
                              key={command.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.03 }}
                              onClick={() => handleCommandClick(command)}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-3 rounded-lg',
                                'transition-all duration-150',
                                'hover:bg-cyber-muted group',
                                isSelected && 'bg-cyber-cyan/10 border border-cyber-cyan/30'
                              )}
                            >
                              {/* 图标 */}
                              <div
                                className={cn(
                                  'p-2 rounded-md',
                                  isSelected
                                    ? 'bg-cyber-cyan/20 text-cyber-cyan'
                                    : 'bg-cyber-muted text-gray-400 group-hover:text-gray-300'
                                )}
                              >
                                <Icon className="w-4 h-4" />
                              </div>

                              {/* 文本 */}
                              <div className="flex-1 text-left">
                                <div
                                  className={cn(
                                    'text-sm font-medium',
                                    isSelected ? 'text-white' : 'text-gray-300'
                                  )}
                                >
                                  {command.label}
                                </div>
                                {command.description && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {command.description}
                                  </div>
                                )}
                              </div>

                              {/* 快捷键 */}
                              {command.shortcut && (
                                <div className="flex gap-1">
                                  {command.shortcut.map((key, i) => (
                                    <kbd
                                      key={i}
                                      className="px-1.5 py-0.5 text-xs font-medium
                                        bg-cyber-muted border border-cyber-border rounded text-gray-500"
                                    >
                                      {key}
                                    </kbd>
                                  ))}
                                </div>
                              )}

                              {/* 选中指示器 */}
                              {isSelected && (
                                <ChevronRight className="w-4 h-4 text-cyber-cyan" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>

                {/* 底部提示 */}
                <div className="flex items-center justify-between px-4 py-2 border-t border-cyber-border text-xs text-gray-500">
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-cyber-muted rounded">↑↓</kbd>
                      导航
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-cyber-muted rounded">↵</kbd>
                      选择
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-cyber-muted rounded">ESC</kbd>
                      关闭
                    </span>
                  </div>
                  <span>{filteredCommands.length} 个结果</span>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// 命令调色板 Hook
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
