/**
 * Blog Search Bar Component
 * 博客搜索栏组件
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface BlogSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  minLength?: number;
  debounceMs?: number;
  className?: string;
  variant?: 'default' | 'minimal' | 'expanded';
  showSuggestions?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  autoFocus?: boolean;
}

export const BlogSearchBar: React.FC<BlogSearchBarProps> = ({
  onSearch,
  placeholder = '搜索文章...',
  minLength = 2,
  debounceMs = 300,
  className = '',
  variant = 'default',
  showSuggestions = false,
  suggestions = [],
  onSuggestionClick,
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length >= minLength || searchQuery.length === 0) {
        onSearch(searchQuery);
        setIsSearching(false);
      }
    }, debounceMs),
    [onSearch, minLength, debounceMs]
  );

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsSearching(true);
    debouncedSearch(value);
  };

  // 清除搜索
  const handleClear = () => {
    setQuery('');
    onSearch('');
    setIsSearching(false);
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    onSuggestionClick?.(suggestion);
    setIsFocused(false);
  };

  // 键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  // 过滤建议
  const filteredSuggestions = showSuggestions
    ? suggestions.filter(s =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // 清理防抖函数
  useEffect(() => {
    return () => {
      debouncedSearch.cancel?.();
    };
  }, [debouncedSearch]);

  return (
    <div className={cn('cyber-search-bar relative', className)}>
      {/* 搜索输入框 */}
      <div
        className={cn(
          'cyber-search-input-wrapper',
          'relative flex items-center',
          'bg-gray-900/50 border border-gray-800',
          'rounded-lg overflow-hidden',
          'transition-all duration-300',
          isFocused && 'border-cyber-cyan/50 shadow-neon-cyan',
          variant === 'expanded' && 'w-full'
        )}
      >
        {/* 搜索图标 */}
        <Search
          className={cn(
            'w-5 h-5 text-gray-400 mx-3',
            'transition-colors',
            isFocused && 'text-cyber-cyan'
          )}
        />

        {/* 输入框 */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // 延迟关闭，以便点击建议
            setTimeout(() => setIsFocused(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'cyber-search-input',
            'flex-1 bg-transparent',
            'text-white placeholder-gray-500',
            'outline-none',
            'py-3 pr-12'
          )}
          aria-label="搜索文章"
          aria-expanded={isFocused && filteredSuggestions.length > 0}
          aria-controls="search-suggestions"
          role="combobox"
        />

        {/* 搜索中图标 */}
        {isSearching && (
          <div className="absolute right-12">
            <Loader2 className="w-5 h-5 text-cyber-cyan animate-spin" />
          </div>
        )}

        {/* 清除按钮 */}
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className={cn(
              'cyber-search-clear',
              'absolute right-3 p-1',
              'rounded-full',
              'hover:bg-gray-800',
              'transition-colors'
            )}
            aria-label="清除搜索"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </motion.button>
        )}
      </div>

      {/* 搜索建议 */}
      <AnimatePresence>
        {isFocused &&
          showSuggestions &&
          filteredSuggestions.length > 0 && (
            <motion.div
              id="search-suggestions"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'cyber-search-suggestions',
                'absolute top-full left-0 right-0 mt-2',
                'bg-gray-900/95 border border-gray-800',
                'rounded-lg overflow-hidden',
                'backdrop-blur-sm',
                'z-50'
              )}
              role="listbox"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    'cyber-search-suggestion-item',
                    'w-full px-4 py-3',
                    'text-left',
                    'text-gray-300 hover:text-white',
                    'hover:bg-cyber-cyan/10',
                    'transition-colors',
                    'first:border-t-0 border-t border-gray-800'
                  )}
                  role="option"
                  tabIndex={0}
                >
                  <Search className="w-4 h-4 inline mr-2 text-gray-500" />
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default BlogSearchBar;
