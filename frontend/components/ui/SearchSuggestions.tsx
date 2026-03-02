'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from '@/lib/utils';

export interface SuggestionItem {
  id: string;
  title: string;
  type: 'post' | 'category' | 'tag' | 'page' | 'user';
  url?: string;
  description?: string;
  icon?: string;
}

export interface SearchSuggestionsProps {
  suggestions: SuggestionItem[];
  loading?: boolean;
  onSearch: (query: string) => void;
  onSelect?: (item: SuggestionItem) => void;
  placeholder?: string;
  debounceMs?: number;
  maxSuggestions?: number;
  className?: string;
}

/**
 * 智能搜索建议组件
 */
export function SearchSuggestions({
  suggestions,
  loading = false,
  onSearch,
  onSelect,
  placeholder = 'Search...',
  debounceMs = 300,
  maxSuggestions = 8,
  className = '',
}: SearchSuggestionsProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 防抖搜索
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim()) {
        onSearch(value);
      }
    }, debounceMs),
    [onSearch, debounceMs]
  );

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  // 过滤和限制建议数量
  const filteredSuggestions = suggestions.slice(0, maxSuggestions);

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(filteredSuggestions[selectedIndex]);
        } else if (query.trim()) {
          onSearch(query);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 处理选择
  const handleSelect = (item: SuggestionItem) => {
    setQuery(item.title);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect?.(item);
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 获取类型图标
  const getTypeIcon = (type: SuggestionItem['type']) => {
    const icons: Record<string, string> = {
      post: '📝',
      category: '📁',
      tag: '🏷️',
      page: '📄',
      user: '👤',
    };
    return icons[type] || '🔍';
  };

  // 高亮匹配文本
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-cyan-500/30 text-cyan-300 rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pl-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {loading ? (
            <motion.div
              className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 建议下拉框 */}
      <AnimatePresence>
        {isOpen && (query.trim() || filteredSuggestions.length > 0) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                <motion.div
                  className="inline-block w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <p className="mt-2 text-sm">Searching...</p>
              </div>
            ) : filteredSuggestions.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {filteredSuggestions.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-800/50 transition-colors ${
                      index === selectedIndex ? 'bg-gray-800/50' : ''
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <span className="text-xl mt-0.5">{item.icon || getTypeIcon(item.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-cyan-100 text-sm font-medium truncate">
                        {highlightMatch(item.title, query)}
                      </div>
                      {item.description && (
                        <div className="text-gray-500 text-xs truncate mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 uppercase tracking-wider">
                      {item.type}
                    </span>
                  </motion.button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400">No results found for "{query}"</p>
                <p className="text-gray-600 text-sm mt-1">Try different keywords</p>
              </div>
            ) : (
              <div className="p-4">
                <div className="text-gray-500 text-sm mb-2">Quick Search Tips:</div>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• Use specific keywords for better results</li>
                  <li>• Press ↑↓ to navigate suggestions</li>
                  <li>• Press Enter to select or search</li>
                  <li>• Press Esc to close</li>
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 搜索历史建议
 */
export function SearchWithHistory({
  onSearch,
  maxHistory = 5,
  ...props
}: SearchSuggestionsProps & { maxHistory?: number }) {
  const [history, setHistory] = useState<string[]>([]);

  // 从 localStorage 加载历史
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse search history:', e);
      }
    }
  }, []);

  // 添加到历史
  const addToHistory = (query: string) => {
    if (!query.trim()) return;

    setHistory((prev) => {
      const newHistory = [query, ...prev.filter((h) => h !== query)].slice(0, maxHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = (query: string) => {
    addToHistory(query);
    onSearch(query);
  };

  const handleSelect = (item: SuggestionItem) => {
    addToHistory(item.title);
    props.onSelect?.(item);
  };

  return (
    <SearchSuggestions
      {...props}
      onSearch={handleSearch}
      onSelect={handleSelect}
      suggestions={[
        ...history.map((h) => ({
          id: `history-${h}`,
          title: h,
          type: 'post' as const,
          icon: '🕐',
        })),
        ...props.suggestions,
      ]}
    />
  );
}

/**
 * 热门搜索标签
 */
export function PopularSearches({
  searches,
  onSelect,
  className = '',
}: {
  searches: string[];
  onSelect: (query: string) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-sm font-medium text-gray-400 mb-3">Popular Searches</h3>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, index) => (
          <motion.button
            key={index}
            onClick={() => onSelect(search)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-3 py-1.5 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-gray-300 hover:border-cyan-500/50 hover:text-cyan-300 transition-all"
          >
            {search}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default SearchSuggestions;
