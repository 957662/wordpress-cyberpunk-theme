/**
 * 增强搜索栏组件
 * 提供实时搜索、建议、历史记录等功能
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';
import { useBlogSearch } from '@/hooks/use-blog-data';

export interface SearchBarEnhancedProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  showHistory?: boolean;
  maxSuggestions?: number;
  maxHistory?: number;
}

export function SearchBarEnhanced({
  placeholder = '搜索文章...',
  className,
  onSearch,
  showSuggestions = true,
  showHistory = true,
  maxSuggestions = 5,
  maxHistory = 5,
}: SearchBarEnhancedProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, loading } = useBlogSearch(query);

  // 加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setHistory(prev => {
      const newHistory = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, maxHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  }, [maxHistory]);

  // 处理搜索
  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;

    saveToHistory(searchQuery);
    onSearch?.(searchQuery);
    setIsFocused(false);
  }, [onSearch, saveToHistory]);

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim()) {
        handleSearch(value);
      }
    }, 300),
    [handleSearch]
  );

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // 清空搜索
  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 热门搜索词
  const trendingSearches = ['React', 'Next.js', 'TypeScript', '赛博朋克', '前端开发'];

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 transition-colors',
            isFocused ? 'text-blue-500' : 'text-gray-400'
          )}
          size={20}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-3 rounded-lg border transition-all',
            'bg-white dark:bg-gray-900',
            'border-gray-300 dark:border-gray-700',
            'focus:border-blue-500 dark:focus:border-blue-400',
            'focus:ring-2 focus:ring-blue-500/20',
            'placeholder:text-gray-400',
            isFocused && 'shadow-lg'
          )}
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* 下拉建议 */}
      {isFocused && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* 搜索历史 */}
          {showHistory && history.length > 0 && !query && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <Clock size={16} />
                <span>搜索历史</span>
              </div>
              {history.slice(0, maxHistory).map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(item);
                    handleSearch(item);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* 热门搜索 */}
          {!query && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <TrendingUp size={16} />
                <span>热门搜索</span>
              </div>
              {trendingSearches.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(item);
                    handleSearch(item);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          )}

          {/* 搜索建议 */}
          {showSuggestions && query && results.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                搜索结果 ({results.length})
              </div>
              {results.slice(0, maxSuggestions).map((post) => (
                <button
                  key={post.id}
                  onClick={() => {
                    setQuery(post.title);
                    handleSearch(post.title);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {post.title}
                  </div>
                  {post.excerpt && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {post.excerpt}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 加载状态 */}
          {loading && query && (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              搜索中...
            </div>
          )}

          {/* 无结果 */}
          {!loading && query && results.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              未找到相关结果
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBarEnhanced;
