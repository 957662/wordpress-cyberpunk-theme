/**
 * 增强版搜索栏组件
 * 支持实时搜索、搜索建议、热门搜索、搜索历史等功能
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, FileText, Tag } from 'lucide-react';
import { useSearch, useSearchSuggestions } from '@/lib/wordpress/hooks';

interface SearchBarAdvancedProps {
  placeholder?: string;
  showSuggestions?: boolean;
  showRecentSearches?: boolean;
  showTrending?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

interface SearchResult {
  id: number;
  title: string;
  type: 'post' | 'page' | 'tag' | 'category';
  url: string;
}

const RECENT_SEARCHES_KEY = 'cyberpress_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function SearchBarAdvanced({
  placeholder = '搜索文章、标签...',
  showSuggestions = true,
  showRecentSearches = true,
  showTrending = true,
  onSearch,
  className = '',
}: SearchBarAdvancedProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    results: searchResults,
    loading: searchLoading,
  } = useSearch();

  const {
    query: suggestionQuery,
    setQuery: setSuggestionQuery,
    suggestions: searchSuggestions,
    loading: suggestionsLoading,
  } = useSearchSuggestions(3);

  // 加载最近搜索
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
    }
  }, []);

  // 保存搜索历史
  const saveSearch = (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    const updated = [
      trimmedQuery,
      ...recentSearches.filter(q => q !== trimmedQuery),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // 处理搜索
  const handleSearch = (searchQuery: string = query) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    saveSearch(trimmedQuery);
    onSearch?.(trimmedQuery);
    setIsFocused(false);
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSuggestionQuery(value);
    setSelectedIndex(-1);
  };

  // 清除搜索
  const handleClear = () => {
    setQuery('');
    setSuggestionQuery('');
  };

  // 选择建议
  const handleSelectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
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

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = [
      ...searchSuggestions,
      ...recentSearches,
    ];

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < allItems.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && allItems[selectedIndex]) {
        handleSelectSuggestion(allItems[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  // 热门搜索关键词
  const trendingSearches = [
    'Next.js',
    'React',
    'TypeScript',
    '赛博朋克',
    '设计系统',
    'Tailwind CSS',
    '性能优化',
    'Web 开发',
  ];

  const showDropdown = isFocused && (
    query.length > 0 ||
    (showRecentSearches && recentSearches.length > 0) ||
    (showTrending && trendingSearches.length > 0)
  );

  const allSuggestions = [
    ...searchSuggestions.map(s => ({ type: 'suggestion', value: s })),
    ...recentSearches.map(s => ({ type: 'recent', value: s })),
  ];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-12 py-3
            bg-cyber-dark/50 backdrop-blur-md
            border border-cyber-border
            rounded-lg
            text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50 focus:border-cyber-cyan
            transition-all duration-200
            ${isFocused ? 'ring-2 ring-cyber-cyan/50 border-cyber-cyan' : ''}
          `}
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 搜索下拉框 */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-cyber-dark/95 backdrop-blur-md border border-cyber-border rounded-lg shadow-xl overflow-hidden"
          >
            <div className="max-h-96 overflow-y-auto">
              {/* 搜索建议 */}
              {showSuggestions && searchSuggestions.length > 0 && query.length >= 3 && (
                <div className="border-b border-cyber-border">
                  <div className="px-4 py-2 bg-cyber-dark/50 text-xs text-gray-500 uppercase tracking-wider">
                    搜索建议
                  </div>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-4 py-3 text-left hover:bg-cyber-cyan/10 transition-colors flex items-center gap-3 ${
                        selectedIndex === index ? 'bg-cyber-cyan/10' : ''
                      }`}
                    >
                      <Search className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-300">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 最近搜索 */}
              {showRecentSearches && recentSearches.length > 0 && query.length === 0 && (
                <div className="border-b border-cyber-border">
                  <div className="px-4 py-2 bg-cyber-dark/50 text-xs text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    <span>最近搜索</span>
                    <button
                      onClick={() => {
                        setRecentSearches([]);
                        localStorage.removeItem(RECENT_SEARCHES_KEY);
                      }}
                      className="text-cyber-cyan hover:text-cyber-pink transition-colors"
                    >
                      清除
                    </button>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectSuggestion(search)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-4 py-3 text-left hover:bg-cyber-cyan/10 transition-colors flex items-center gap-3 ${
                        selectedIndex === index ? 'bg-cyber-cyan/10' : ''
                      }`}
                    >
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-300">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 热门搜索 */}
              {showTrending && trendingSearches.length > 0 && query.length === 0 && (
                <div className={recentSearches.length > 0 ? 'border-t border-cyber-border' : ''}>
                  <div className="px-4 py-2 bg-cyber-dark/50 text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>热门搜索</span>
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((trending, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectSuggestion(trending)}
                          className="px-3 py-1.5 text-sm bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/30 rounded-full hover:bg-cyber-cyan/20 hover:border-cyber-cyan transition-all"
                        >
                          {trending}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 搜索中状态 */}
              {suggestionsLoading && query.length >= 3 && searchSuggestions.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-cyber-cyan"></div>
                  <p className="mt-2 text-sm">搜索中...</p>
                </div>
              )}

              {/* 无结果 */}
              {!suggestionsLoading && query.length >= 3 && searchSuggestions.length === 0 && (
                <div className="px-4 py-8 text-center text-gray-500">
                  <p className="text-sm">没有找到相关建议</p>
                </div>
              )}
            </div>

            {/* 底部搜索按钮 */}
            <div className="border-t border-cyber-border bg-cyber-dark/50">
              <button
                onClick={() => handleSearch()}
                disabled={!query.trim()}
                className="w-full px-4 py-3 text-cyber-cyan hover:text-cyber-pink hover:bg-cyber-cyan/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Search className="h-4 w-4" />
                <span>搜索 "{query}"</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SearchBarAdvanced;
