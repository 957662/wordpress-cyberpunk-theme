'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils';

export interface SearchSuggestion {
  id: string;
  type: 'post' | 'tag' | 'category';
  title: string;
  url: string;
  count?: number;
}

export interface BlogSearchProps {
  onSearch: (query: string) => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  trendingSearches?: string[];
  placeholder?: string;
  showSuggestions?: boolean;
  showRecent?: boolean;
  showTrending?: boolean;
  debounceMs?: number;
  className?: string;
}

export function BlogSearch({
  onSearch,
  suggestions = [],
  recentSearches = [],
  trendingSearches = [],
  placeholder = '搜索文章、标签、分类...',
  showSuggestions = true,
  showRecent = true,
  showTrending = true,
  debounceMs = 300,
  className,
}: BlogSearchProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearch(value);
    }, debounceMs),
    [onSearch, debounceMs]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    onSearch(suggestion.title);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = getSuggestions();

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allItems[selectedIndex]) {
          handleSuggestionClick(allItems[selectedIndex]);
        } else {
          onSearch(query);
          setIsFocused(false);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const getSuggestions = (): SearchSuggestion[] => {
    if (!query.trim()) return [];
    const filtered = suggestions.filter((s) =>
      s.title.toLowerCase().includes(query.toLowerCase())
    );
    return filtered.slice(0, 8);
  };

  const suggestionList = getSuggestions();
  const showDropdown = isFocused && (showSuggestions || (showRecent && recentSearches.length > 0) || (showTrending && trendingSearches.length > 0));

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-cyan" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="cyber-input w-full pl-12 pr-12"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyber-cyan transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 cyber-card overflow-hidden"
          >
            {query && suggestionList.length > 0 && showSuggestions && (
              <div className="p-2">
                <div className="text-xs text-gray-400 px-3 py-2 uppercase tracking-wider">
                  搜索结果
                </div>
                {suggestionList.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg transition-colors',
                      'hover:bg-cyber-cyan/10 hover:text-cyber-cyan',
                      selectedIndex === index && 'bg-cyber-cyan/10 text-cyber-cyan'
                    )}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center justify-between">
                      <span>{suggestion.title}</span>
                      {suggestion.type === 'post' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan">
                          文章
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {!query && recentSearches.length > 0 && showRecent && (
              <div className="p-2 border-t border-cyber-cyan/20">
                <div className="text-xs text-gray-400 px-3 py-2 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  最近搜索
                </div>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setQuery(search);
                      onSearch(search);
                      setIsFocused(false);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg transition-colors',
                      'hover:bg-cyber-cyan/10 hover:text-cyber-cyan',
                      selectedIndex === index && 'bg-cyber-cyan/10 text-cyber-cyan'
                    )}
                    whileHover={{ x: 4 }}
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            )}

            {!query && trendingSearches.length > 0 && showTrending && (
              <div className="p-2 border-t border-cyber-cyan/20">
                <div className="text-xs text-gray-400 px-3 py-2 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  热门搜索
                </div>
                {trendingSearches.slice(0, 5).map((search, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setQuery(search);
                      onSearch(search);
                      setIsFocused(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-cyber-cyan/10 hover:text-cyber-cyan"
                    whileHover={{ x: 4 }}
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            )}

            {query && suggestionList.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>没有找到相关结果</p>
                <p className="text-sm mt-1">试试其他关键词</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BlogSearch;
