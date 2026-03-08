/**
 * Enhanced Blog Search Component
 * 增强的博客搜索组件
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils/performance';

export interface BlogSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  initialQuery?: string;
}

export function BlogSearch({
  onSearch,
  placeholder = '搜索文章...',
  className,
  showSuggestions = true,
  initialQuery = '',
}: BlogSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // 加载最近的搜索
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recent-blog-searches');
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse recent searches:', e);
        }
      }
    }
  }, []);

  // 保存搜索历史
  const saveSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('recent-blog-searches', JSON.stringify(updated));
    }
  }, [recentSearches]);

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
      if (value.trim()) {
        saveSearch(value);
      }
    }, 300),
    [onSearch, saveSearch]
  );

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // 清除搜索
  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  // 提交搜索
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    if (query.trim()) {
      saveSearch(query);
    }
    setIsFocused(false);
  };

  // 点击最近搜索
  const handleRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setIsFocused(false);
  };

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input */}
        <div className="relative">
          <Search
            className={cn(
              'absolute left-4 top-1/2 -translate-y-1/2 transition-colors',
              isFocused ? 'text-cyber-cyan' : 'text-gray-400'
            )}
            size={20}
          />
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all',
              'bg-white dark:bg-gray-800',
              'placeholder:text-gray-400',
              isFocused
                ? 'border-cyber-cyan shadow-lg shadow-cyber-cyan/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
              'focus:outline-none'
            )}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                <Clock size={16} />
                <span>最近搜索</span>
              </div>
              <div className="space-y-1">
                {recentSearches.map((searchQuery, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(searchQuery)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {searchQuery}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions (Mock) */}
          {query && suggestions.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                <TrendingUp size={16} />
                <span>热门搜索</span>
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearch(suggestion)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Action */}
          {query && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSubmit}
                className="w-full py-2 px-4 bg-cyber-cyan hover:bg-cyber-cyan/90 text-white rounded-lg font-medium transition-colors"
              >
                搜索 "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BlogSearch;
