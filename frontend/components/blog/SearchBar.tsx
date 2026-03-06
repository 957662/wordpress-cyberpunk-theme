/**
 * SearchBar Component
 * 博客搜索栏组件
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  className?: string;
  delay?: number;
  autoFocus?: boolean;
  showSuggestions?: boolean;
  suggestions?: string[];
  loading?: boolean;
}

export function SearchBar({
  placeholder = '搜索...',
  onSearch,
  onClear,
  className,
  delay = 300,
  autoFocus = false,
  showSuggestions = false,
  suggestions = [],
  loading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionList, setShowSuggestionList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch?.(searchQuery);
    }, delay),
    [onSearch, delay]
  );

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      debouncedSearch(value);
      if (showSuggestions && suggestions.length > 0) {
        setShowSuggestionList(true);
      }
    } else {
      onClear?.();
      setShowSuggestionList(false);
    }
  };

  // 处理清除
  const handleClear = () => {
    setQuery('');
    onClear?.();
    setShowSuggestionList(false);
    inputRef.current?.focus();
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestionList(false);
    onSearch?.(suggestion);
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setShowSuggestionList(false);
    }
  };

  // 点击外部关闭建议列表
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestionList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤建议
  const filteredSuggestions = showSuggestions
    ? suggestions.filter(s =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'relative flex items-center transition-all duration-200',
          'bg-white dark:bg-gray-800',
          'border border-gray-300 dark:border-gray-600',
          'rounded-lg overflow-hidden',
          isFocused && 'ring-2 ring-cyber-cyan/50 border-cyber-cyan'
        )}
      >
        {/* 搜索图标 */}
        <div className="pl-3 pr-2">
          {loading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            // 延迟关闭建议列表，以便处理点击事件
            setTimeout(() => setShowSuggestionList(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'flex-1 py-3 pr-3 outline-none',
            'bg-transparent',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400',
            'min-w-[200px]'
          )}
        />

        {/* 清除按钮 */}
        {query && (
          <button
            onClick={handleClear}
            className={cn(
              'pr-3 pl-2',
              'text-gray-400 hover:text-gray-600',
              'dark:text-gray-500 dark:hover:text-gray-300',
              'transition-colors',
              'focus:outline-none'
            )}
            aria-label="清除搜索"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 搜索建议 */}
      {showSuggestionList && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className={cn(
            'absolute z-50 w-full mt-2',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg',
            'max-h-60 overflow-y-auto'
          )}
        >
          <ul className="py-2">
            {filteredSuggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    'w-full px-4 py-2 text-left',
                    'text-gray-900 dark:text-white',
                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                    'transition-colors',
                    'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>{suggestion}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 搜索提示 */}
      {query && !loading && filteredSuggestions.length === 0 && showSuggestions && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2',
            'bg-white dark:bg-gray-800',
            'border border-gray-200 dark:border-gray-700',
            'rounded-lg shadow-lg',
            'px-4 py-3',
            'text-sm text-gray-600 dark:text-gray-400'
          )}
        >
          按下 Enter 搜索 "{query}"
        </div>
      )}
    </div>
  );
}

export default SearchBar;
