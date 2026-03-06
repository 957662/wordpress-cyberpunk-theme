'use client';

/**
 * 增强型搜索栏组件
 * 支持实时搜索、搜索建议、搜索历史、热门搜索
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Tag } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';
import { useSearchParams, useRouter } from 'next/navigation';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

export interface SearchBarEnhancedProps {
  placeholder?: string;
  initialQuery?: string;
  onSearch?: (query: string) => void;
  suggestions?: SearchSuggestion[];
  popularSearches?: string[];
  showHistory?: boolean;
  showTrending?: boolean;
  maxHistoryItems?: number;
  debounceDelay?: number;
  className?: string;
}

export function SearchBarEnhanced({
  placeholder = '搜索文章、标签、作者...',
  initialQuery = '',
  onSearch,
  suggestions: propSuggestions = [],
  popularSearches = [],
  showHistory = true,
  showTrending = true,
  maxHistoryItems = 5,
  debounceDelay = 300,
  className = '',
}: SearchBarEnhancedProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>(propSuggestions);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 从 URL 获取初始查询
  useEffect(() => {
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      setQuery(searchQuery);
    }
  }, [searchParams]);

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (onSearch) {
        onSearch(value);
      } else {
        // 默认行为:更新 URL
        const params = new URLSearchParams(searchParams);
        if (value) {
          params.set('q', value);
        } else {
          params.delete('q');
        }
        router.push(`/search?${params.toString()}`);
      }
      setIsLoading(false);
    }, debounceDelay),
    [onSearch, searchParams, router, debounceDelay]
  );

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsLoading(true);

    // 生成建议
    if (value.trim()) {
      const filteredSuggestions = propSuggestions.filter((s) =>
        s.text.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions.slice(0, 5));
    } else {
      setSuggestions(propSuggestions.slice(0, 5));
    }

    debouncedSearch(value);
    setSelectedIndex(-1);
  };

  // 处理搜索
  const handleSearch = useCallback(
    (searchQuery?: string) => {
      const finalQuery = searchQuery ?? query;
      if (finalQuery.trim()) {
        // 保存到历史记录
        if (showHistory) {
          const history = getSearchHistory();
          const newHistory = [
            { id: Date.now().toString(), text: finalQuery, type: 'history' as const },
            ...history.filter((h) => h.text !== finalQuery),
          ].slice(0, maxHistoryItems);
          saveSearchHistory(newHistory);
        }

        if (onSearch) {
          onSearch(finalQuery);
        } else {
          router.push(`/search?q=${encodeURIComponent(finalQuery)}`);
        }
        setIsFocused(false);
      }
    },
    [query, onSearch, router, showHistory, maxHistoryItems]
  );

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSearch(suggestions[selectedIndex].text);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  // 清除输入
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // 获取搜索历史
  const getSearchHistory = (): SearchSuggestion[] => {
    if (typeof window === 'undefined') return [];
    try {
      const history = localStorage.getItem('search-history');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  };

  // 保存搜索历史
  const saveSearchHistory = (history: SearchSuggestion[]) => {
    try {
      localStorage.setItem('search-history', JSON.stringify(history));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  };

  // 清除搜索历史
  const clearHistory = () => {
    try {
      localStorage.removeItem('search-history');
      setSuggestions((prev) => prev.filter((s) => s.type !== 'history'));
    } catch (error) {
      console.error('清除搜索历史失败:', error);
    }
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 聚焦时显示建议
  const handleFocus = () => {
    setIsFocused(true);
    if (!query.trim()) {
      const history = showHistory ? getSearchHistory().slice(0, maxHistoryItems) : [];
      const trending = showTrending
        ? popularSearches.slice(0, 5).map((text, id) => ({
            id: `trending-${id}`,
            text,
            type: 'trending' as const,
          }))
        : [];
      setSuggestions([...history, ...trending]);
    }
  };

  // 渲染建议项
  const renderSuggestionItem = (suggestion: SearchSuggestion, index: number) => {
    const isSelected = selectedIndex === index;

    return (
      <motion.button
        key={suggestion.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => handleSearch(suggestion.text)}
        className={cn(
          'w-full flex items-center gap-3 p-3 rounded-lg transition-all',
          isSelected
            ? 'bg-cyber-cyan/20 text-cyber-cyan'
            : 'hover:bg-cyber-muted/50 text-cyber-muted hover:text-white'
        )}
      >
        {suggestion.type === 'history' && (
          <Clock className="w-4 h-4 flex-shrink-0" />
        )}
        {suggestion.type === 'trending' && (
          <TrendingUp className="w-4 h-4 flex-shrink-0 text-cyber-pink" />
        )}
        {suggestion.type === 'suggestion' && (
          <Tag className="w-4 h-4 flex-shrink-0" />
        )}

        <span className="flex-1 text-left truncate">{suggestion.text}</span>

        {suggestion.count !== undefined && (
          <span className="text-xs text-cyber-muted">
            {suggestion.count.toLocaleString()}
          </span>
        )}
      </motion.button>
    );
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-cyber-muted" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={cn(
            'w-full h-12 pl-12 pr-12 rounded-lg border',
            'bg-cyber-dark text-white placeholder:text-cyber-muted',
            'border-cyber-border focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20',
            'transition-all outline-none'
          )}
          aria-label="搜索"
          aria-expanded={isFocused}
          aria-controls="search-suggestions"
          role="combobox"
          aria-autocomplete="list"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-cyber-muted transition-colors"
            aria-label="清除"
          >
            <X className="w-4 h-4 text-cyber-muted" />
          </button>
        )}
      </div>

      {/* 搜索建议 */}
      <AnimatePresence>
        {isFocused && suggestions.length > 0 && (
          <motion.div
            id="search-suggestions"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-cyber-dark border border-cyber-border rounded-lg shadow-xl overflow-hidden z-50"
            role="listbox"
          >
            <div className="p-2 max-h-80 overflow-y-auto">
              {/* 历史记录 */}
              {showHistory && suggestions.some((s) => s.type === 'history') && (
                <div className="mb-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs font-medium text-cyber-muted">
                      搜索历史
                    </span>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-cyber-cyan hover:underline"
                    >
                      清除
                    </button>
                  </div>
                  {suggestions
                    .filter((s) => s.type === 'history')
                    .map((suggestion, index) => renderSuggestionItem(suggestion, index))}
                </div>
              )}

              {/* 热门搜索 */}
              {showTrending && suggestions.some((s) => s.type === 'trending') && (
                <div className="mb-2">
                  <div className="px-3 py-2">
                    <span className="text-xs font-medium text-cyber-muted">
                      热门搜索
                    </span>
                  </div>
                  {suggestions
                    .filter((s) => s.type === 'trending')
                    .map((suggestion, index) =>
                      renderSuggestionItem(
                        suggestion,
                        index + (showHistory ? suggestions.filter((s) => s.type === 'history').length : 0)
                      )
                    )}
                </div>
              )}

              {/* 其他建议 */}
              {suggestions.some((s) => s.type === 'suggestion') && (
                <div>
                  <div className="px-3 py-2">
                    <span className="text-xs font-medium text-cyber-muted">
                      相关建议
                    </span>
                  </div>
                  {suggestions
                    .filter((s) => s.type === 'suggestion')
                    .map((suggestion, index) =>
                      renderSuggestionItem(
                        suggestion,
                        index +
                          (showHistory ? suggestions.filter((s) => s.type === 'history').length : 0) +
                          (showTrending ? suggestions.filter((s) => s.type === 'trending').length : 0)
                      )
                    )}
                </div>
              )}
            </div>

            {/* 底部提示 */}
            <div className="px-4 py-2 border-t border-cyber-border bg-cyber-muted/30">
              <p className="text-xs text-cyber-muted">
                使用 <kbd className="px-1.5 py-0.5 rounded bg-cyber-dark border border-cyber-border">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-cyber-dark border border-cyber-border mx-1">↓</kbd>
                导航,
                <kbd className="px-1.5 py-0.5 rounded bg-cyber-dark border border-cyber-border mx-1">Enter</kbd>
                搜索
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBarEnhanced;
