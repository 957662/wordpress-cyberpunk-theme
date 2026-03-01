/**
 * 搜索栏组件
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, CloseIcon } from '@/components/icons';
import { Input } from '@/components/ui/Input';
import { debounce } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ onSearch, placeholder = '搜索...', className }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const debouncedSearch = debounce((q: string) => {
    onSearch?.(q);
  }, 300);

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => document.getElementById('search-input')?.focus(), 100);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className={cn('p-2 text-gray-400 hover:text-cyber-cyan transition-colors', className)}
        aria-label="搜索"
      >
        <SearchIcon className="w-5 h-5" />
      </motion.button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={handleToggle}
            />

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50"
            >
              <div className="bg-cyber-card border-2 border-cyber-cyan rounded-lg shadow-neon-cyan overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <SearchIcon className="w-5 h-5 text-cyber-cyan flex-shrink-0" />
                  <input
                    id="search-input"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  />
                  {query && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      onClick={() => setQuery('')}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>

                {/* Search Tips */}
                {query === '' && (
                  <div className="px-4 pb-4 border-t border-cyber-border">
                    <p className="text-xs text-gray-500 mt-3">
                      按下 <kbd className="px-1.5 py-0.5 bg-cyber-muted rounded text-cyber-cyan">Esc</kbd> 关闭
                      · 输入关键词搜索文章、标签或分类
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
