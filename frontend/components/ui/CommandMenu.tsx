/**
 * 赛博朋克风格命令菜单组件
 * 类似 VS Code 的命令面板
 */

'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, Command as CommandIcon, ArrowRight } from 'lucide-react';

export interface CommandItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  keywords?: string[];
  action?: () => void;
  disabled?: boolean;
}

export interface CommandGroup {
  label?: string;
  items: CommandItem[];
}

export interface CommandMenuProps {
  groups: CommandGroup[];
  placeholder?: string;
  emptyMessage?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export function CommandMenu({
  groups,
  placeholder = '搜索命令...',
  emptyMessage = '没有找到匹配的命令',
  open: controlledOpen,
  onOpenChange,
  className,
}: CommandMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen ?? internalOpen;

  // 展平所有项目以便于搜索和导航
  const allItems = React.useMemo(() => {
    return groups.flatMap((group, groupIndex) =>
      group.items.map((item) => ({ ...item, groupIndex }))
    );
  }, [groups]);

  // 过滤项目
  const filteredItems = React.useMemo(() => {
    if (!searchQuery) return allItems;

    const query = searchQuery.toLowerCase();
    return allItems.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.keywords?.some((keyword) => keyword.toLowerCase().includes(query))
    );
  }, [searchQuery, allItems]);

  // 处理快捷键
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K 打开命令菜单
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleOpen();
      }

      // Escape 关闭
      if (e.key === 'Escape' && isOpen) {
        close();
      }

      // 方向键导航
      if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(
            (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
          );
        } else if (e.key === 'Enter' && filteredItems.length > 0) {
          e.preventDefault();
          filteredItems[selectedIndex]?.action?.();
          close();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex]);

  // 自动聚焦输入框
  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const toggleOpen = () => {
    const newState = !isOpen;
    setInternalOpen(newState);
    onOpenChange?.(newState);
    if (newState) {
      setSearchQuery('');
    }
  };

  const close = () => {
    setInternalOpen(false);
    onOpenChange?.(false);
  };

  const handleSelect = (item: CommandItem) => {
    if (item.disabled) return;
    item.action?.();
    close();
  };

  // 按组分组过滤后的项目
  const filteredGroups = React.useMemo(() => {
    const result: CommandGroup[] = [];
    let currentItemIndex = 0;

    groups.forEach((group) => {
      const filteredGroupItems = group.items.filter((item) =>
        filteredItems.includes(item)
      );

      if (filteredGroupItems.length > 0) {
        result.push({
          label: group.label,
          items: filteredGroupItems.map((item) => ({
            ...item,
            globalIndex: currentItemIndex++,
          })),
        });
      }
    });

    return result;
  }, [groups, filteredItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={close}
          />

          {/* 命令菜单 */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'w-full max-w-xl mx-4',
                'bg-cyber-card border border-cyber-border rounded-lg',
                'shadow-neon-cyan/20 overflow-hidden',
                className
              )}
            >
              {/* 搜索框 */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-cyber-border">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                />
                <kbd
                  className={cn(
                    'hidden sm:inline-flex items-center gap-1',
                    'px-2 py-1 text-xs font-medium text-gray-400',
                    'bg-cyber-muted border border-cyber-border rounded'
                  )}
                >
                  <CommandIcon className="w-3 h-3" />
                  <span>K</span>
                </kbd>
              </div>

              {/* 命令列表 */}
              <div
                ref={listRef}
                className="max-h-[400px] overflow-y-auto py-2"
              >
                {filteredItems.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    {emptyMessage}
                  </div>
                ) : (
                  filteredGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      {group.label && (
                        <div className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {group.label}
                        </div>
                      )}
                      {group.items.map((item: any) => (
                        <motion.button
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelect(item)}
                          disabled={item.disabled}
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-2.5 text-sm',
                            'transition-colors',
                            'focus:outline-none',
                            item.disabled
                              ? 'opacity-50 cursor-not-allowed'
                              : 'cursor-pointer hover:bg-cyber-muted/30',
                            item.globalIndex === selectedIndex &&
                              'bg-cyber-cyan/20 text-cyber-cyan'
                          )}
                        >
                          {item.icon && (
                            <span className="w-4 h-4 flex-shrink-0">
                              {item.icon}
                            </span>
                          )}
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.shortcut && (
                            <kbd className="text-xs text-gray-500 font-mono">
                              {item.shortcut}
                            </kbd>
                          )}
                          {item.globalIndex === selectedIndex && (
                            <ArrowRight className="w-4 h-4 text-cyber-cyan ml-auto" />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ))
                )}
              </div>

              {/* 底部提示 */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-cyber-border text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-cyber-muted border border-cyber-border rounded">
                    ↑↓
                  </kbd>
                  <span>导航</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-cyber-muted border border-cyber-border rounded">
                    ↵
                  </kbd>
                  <span>选择</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-cyber-muted border border-cyber-border rounded">
                    esc
                  </kbd>
                  <span>关闭</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// 触发器按钮
export function CommandMenuTrigger({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 text-sm',
        'bg-cyber-muted border border-cyber-border rounded-md',
        'hover:bg-cyber-muted/70 hover:border-cyber-cyan/50',
        'transition-all duration-200',
        className
      )}
    >
      {children}
      <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-gray-400 bg-cyber-dark/50 rounded">
        <CommandIcon className="w-3 h-3" />K
      </kbd>
    </button>
  );
}
