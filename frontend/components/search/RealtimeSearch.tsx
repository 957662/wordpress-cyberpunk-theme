'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'post' | 'page' | 'portfolio' | 'tag';
  url: string;
}

interface RealtimeSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  className?: string;
  minChars?: number;
  showHistory?: boolean;
  showTrending?: boolean;
}

/**
 * RealtimeSearch - 实时搜索组件
 *
 * 特性：
 * - 实时搜索建议
 * - 搜索历史记录
 * - 热门搜索
 * - 键盘导航
 * - 防抖优化
 * - 赛博朋克风格
 */
export function RealtimeSearch({
  onSearch,
  placeholder = 'Search articles, pages, portfolios...',
  className,
  minChars = 2,
  showHistory = true,
  showTrending = true
}: RealtimeSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Save search to history
  const saveToHistory = (searchQuery: string) => {
    const updated = [searchQuery, ...searchHistory.filter(q => q !== searchQuery)].slice(0, 5);
    setSearchHistory(updated);
    localStorage.setItem('searchHistory', JSON.stringify(updated));
  };

  // Perform search
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < minChars) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await onSearch(debouncedQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery, minChars, onSearch]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    saveToHistory(query);
    window.location.href = result.url;
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    inputRef.current?.focus();
  };

  const clearInput = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const trendingSearches = ['React', 'Next.js', 'TypeScript', 'Cyberpunk Design', 'Performance'];

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-muted/60" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-12 py-4 rounded-lg',
            'bg-cyber-dark/80 backdrop-blur-sm',
            'border border-cyber-cyan/30',
            'text-cyber-cyan placeholder:text-cyber-muted/40',
            'focus:outline-none focus:border-cyber-cyan/60',
            'focus:shadow-[0_0_20px_rgba(0,240,255,0.2)]',
            'transition-all duration-200'
          )}
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={clearInput}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-muted/60 hover:text-cyber-cyan transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Search results dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'rounded-lg border border-cyber-cyan/30',
              'bg-cyber-dark/95 backdrop-blur-sm',
              'shadow-[0_0_30px_rgba(0,240,255,0.2)]',
              'overflow-hidden'
            )}
          >
            <div className="max-h-[400px] overflow-y-auto">
              {/* Loading state */}
              {isLoading && (
                <div className="p-4 text-center text-cyber-muted/60">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-6 h-6 border-2 border-cyber-cyan border-t-transparent rounded-full"
                  />
                </div>
              )}

              {/* No results */}
              {!isLoading && query.length >= minChars && results.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-cyber-muted/60">No results found for "{query}"</p>
                </div>
              )}

              {/* Search results */}
              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  <div className="px-4 py-2 text-xs font-medium text-cyber-muted/60 uppercase">
                    Results
                  </div>
                  {results.map((result, index) => (
                    <motion.button
                      key={result.id}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        'w-full text-left px-4 py-3 rounded-md',
                        'transition-all duration-200',
                        'flex items-start gap-3',
                        selectedIndex === index
                          ? 'bg-cyber-cyan/20 text-cyber-cyan'
                          : 'hover:bg-cyber-muted/20 text-cyber-muted/80 hover:text-cyber-cyan'
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.title}</p>
                        {result.description && (
                          <p className="text-sm opacity-60 truncate">{result.description}</p>
                        )}
                      </div>
                      <span className="text-xs px-2 py-1 rounded bg-cyber-muted/30 uppercase">
                        {result.type}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Search history */}
              {!isLoading && query.length < minChars && showHistory && searchHistory.length > 0 && (
                <div className="p-2 border-t border-cyber-cyan/10">
                  <div className="px-4 py-2 text-xs font-medium text-cyber-muted/60 uppercase flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Recent Searches
                  </div>
                  {searchHistory.map((historyQuery) => (
                    <button
                      key={historyQuery}
                      onClick={() => handleHistoryClick(historyQuery)}
                      className="w-full text-left px-4 py-2 rounded-md hover:bg-cyber-muted/20 text-cyber-muted/80 hover:text-cyber-cyan transition-colors text-sm"
                    >
                      {historyQuery}
                    </button>
                  ))}
                </div>
              )}

              {/* Trending searches */}
              {!isLoading && query.length < minChars && showTrending && (
                <div className="p-2 border-t border-cyber-cyan/10">
                  <div className="px-4 py-2 text-xs font-medium text-cyber-muted/60 uppercase flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </div>
                  <div className="flex flex-wrap gap-2 px-4 pb-4">
                    {trendingSearches.map((trending) => (
                      <button
                        key={trending}
                        onClick={() => handleHistoryClick(trending)}
                        className="px-3 py-1.5 rounded-full bg-cyber-muted/30 border border-cyber-cyan/20 text-cyber-cyan/80 text-sm hover:bg-cyber-cyan/20 hover:border-cyber-cyan/40 transition-all"
                      >
                        {trending}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * SearchBar - 简化的搜索栏组件
 */
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  placeholder = 'Search...',
  className
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative w-full', className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-muted/60" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full pl-12 pr-4 py-3 rounded-lg',
          'bg-cyber-dark/80 backdrop-blur-sm',
          'border border-cyber-cyan/30',
          'text-cyber-cyan placeholder:text-cyber-muted/40',
          'focus:outline-none focus:border-cyber-cyan/60',
          'focus:shadow-[0_0_20px_rgba(0,240,255,0.2)]',
          'transition-all duration-200'
        )}
      />
    </form>
  );
}
