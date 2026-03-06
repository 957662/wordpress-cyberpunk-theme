'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';
import { useSearchPosts } from '@/hooks/blog/useBlogPosts';
import type { BlogPost } from '@/types/blog';

export interface SearchSuggestionsProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * SearchSuggestions Component
 * 带建议的搜索组件
 */
export function SearchSuggestions({
  onSearch,
  placeholder = '搜索文章...',
  className,
  autoFocus = false,
}: SearchSuggestionsProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取搜索历史
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 搜索文章
  const { data: searchResults, isLoading } = useSearchPosts(query, {
    perPage: 5,
  });

  // 防抖搜索
  const debouncedSearch = debounce((value: string) => {
    if (value.trim()) {
      // 搜索逻辑
    }
  }, 300);

  useEffect(() => {
    // 从localStorage加载搜索历史
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    const suggestions = getSuggestions();
    const maxIndex = suggestions.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const suggestion = suggestions[selectedIndex];
          if (typeof suggestion === 'string') {
            handleSelectSuggestion(suggestion);
          } else {
            handleSelectPost(suggestion);
          }
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setIsOpen(false);
    handleSearch();
  };

  const handleSelectPost = (post: BlogPost) => {
    setIsOpen(false);
    window.location.href = `/blog/${post.slug}`;
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    // 保存到搜索历史
    const newHistory = [query, ...searchHistory.filter((h) => h !== query)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    onSearch?.(query);
    setIsOpen(false);
  };

  const getSuggestions = (): Array<string | BlogPost> => {
    const suggestions: Array<string | BlogPost> = [];

    // 添加搜索历史
    if (searchHistory.length > 0 && query.length === 0) {
      suggestions.push(...searchHistory);
    }

    // 添加搜索结果
    if (searchResults && searchResults.length > 0) {
      suggestions.push(...searchResults);
    }

    return suggestions;
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // 延迟关闭以允许点击建议
            setTimeout(() => setIsOpen(false), 200);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-900',
            'border border-gray-300 dark:border-gray-700 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
            'transition-all duration-200',
            'placeholder:text-gray-400'
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        )}
        <button
          onClick={handleSearch}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2',
            'px-3 py-1 bg-cyan-500 hover:bg-cyan-600',
            'text-white text-sm font-medium rounded',
            'transition-colors duration-200',
            !query && 'opacity-50 cursor-not-allowed'
          )}
          disabled={!query}
        >
          搜索
        </button>
      </div>

      {/* 搜索建议下拉框 */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute z-50 w-full mt-2 bg-white dark:bg-gray-900',
            'border border-gray-300 dark:border-gray-700 rounded-lg',
            'shadow-lg max-h-96 overflow-y-auto',
            'animate-in slide-in-from-top-2 duration-200'
          )}
        >
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              搜索中...
            </div>
          ) : (
            <>
              {searchHistory.length > 0 && query.length === 0 && (
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4" />
                      搜索历史
                    </div>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      清除
                    </button>
                  </div>
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSuggestion(item)}
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm rounded-lg',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'transition-colors duration-150',
                        selectedIndex === index && 'bg-gray-100 dark:bg-gray-800'
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

              {searchResults && searchResults.length > 0 && (
                <div className="p-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <TrendingUp className="w-4 h-4" />
                    热门文章
                  </div>
                  {searchResults.map((post, index) => (
                    <button
                      key={post.id}
                      onClick={() => handleSelectPost(post)}
                      className={cn(
                        'w-full px-3 py-2 text-left rounded-lg',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'transition-colors duration-150',
                        selectedIndex === searchHistory.length + index && 'bg-gray-100 dark:bg-gray-800'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {post.featuredImage && (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {post.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!isLoading && searchHistory.length === 0 && (!searchResults || searchResults.length === 0) && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  {query ? '没有找到相关内容' : '输入关键词开始搜索'}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchSuggestions;
