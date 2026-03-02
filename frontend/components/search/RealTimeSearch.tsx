'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'post' | 'portfolio' | 'user' | 'tag';
  title: string;
  excerpt?: string;
  url: string;
  image?: string;
  date?: string;
  views?: number;
}

interface RealTimeSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  debounceMs?: number;
  maxResults?: number;
  showRecent?: boolean;
  showTrending?: boolean;
  recentSearches?: string[];
  trendingSearches?: string[];
}

export const RealTimeSearch: React.FC<RealTimeSearchProps> = ({
  className,
  placeholder = '搜索文章、作品、标签...',
  onSearch,
  debounceMs = 300,
  maxResults = 8,
  showRecent = true,
  showTrending = true,
  recentSearches = [],
  trendingSearches = [],
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            window.location.href = results[selectedIndex].url;
          }
          break;
        case 'Escape':
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, results]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      if (onSearch) {
        const searchResults = await onSearch(searchQuery);
        setResults(searchResults.slice(0, maxResults));
      } else {
        // Mock search results
        const mockResults: SearchResult[] = [
          {
            id: '1',
            type: 'post',
            title: `${searchQuery} 相关文章`,
            excerpt: '这是一篇关于搜索内容的文章摘要...',
            url: `/blog/post-${searchQuery}`,
            date: '2026-03-01',
            views: 1234,
          },
          {
            id: '2',
            type: 'portfolio',
            title: `${searchQuery} 项目展示`,
            excerpt: '项目描述和详情...',
            url: `/portfolio/project-${searchQuery}`,
            views: 567,
          },
        ];
        setResults(mockResults);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    window.location.href = result.url;
  };

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery);
    performSearch(recentQuery);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'text-cyber-cyan';
      case 'portfolio':
        return 'text-cyber-purple';
      case 'user':
        return 'text-cyber-pink';
      case 'tag':
        return 'text-cyber-green';
      default:
        return 'text-cyber-gray';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'post':
        return '文章';
      case 'portfolio':
        return '作品';
      case 'user':
        return '用户';
      case 'tag':
        return '标签';
      default:
        return type;
    }
  };

  return (
    <div ref={searchRef} className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyber-gray" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-12 py-4 bg-cyber-dark/80 backdrop-blur-sm',
            'border-2 border-cyber-cyan/30 rounded-xl',
            'text-cyber-white placeholder:text-cyber-gray',
            'focus:outline-none focus:border-cyber-cyan focus:shadow-[0_0_20px_rgba(0,240,255,0.3)]',
            'transition-all duration-300'
          )}
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-cyber-gray/20 transition-colors"
          >
            <X className="w-5 h-5 text-cyber-gray" />
          </motion.button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="bg-cyber-dark/95 backdrop-blur-md border border-cyber-cyan/30 rounded-xl shadow-2xl overflow-hidden">
              {/* Loading State */}
              {isLoading && (
                <div className="p-8 text-center text-cyber-gray">
                  <div className="inline-block w-6 h-6 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
                  <p className="mt-2 text-sm">搜索中...</p>
                </div>
              )}

              {/* No Results */}
              {!isLoading && query.length >= 2 && results.length === 0 && (
                <div className="p-8 text-center text-cyber-gray">
                  <p className="text-sm">没有找到相关结果</p>
                </div>
              )}

              {/* Search Results */}
              {!isLoading && results.length > 0 && (
                <div className="max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <motion.a
                      key={result.id}
                      href={result.url}
                      onClick={(e) => {
                        e.preventDefault();
                        handleResultClick(result);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        'flex items-start gap-4 p-4 border-b border-cyber-gray/20 last:border-b-0',
                        'hover:bg-cyber-cyan/10 transition-colors cursor-pointer',
                        selectedIndex === index && 'bg-cyber-cyan/20'
                      )}
                    >
                      {result.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-xs font-medium uppercase', getTypeColor(result.type))}>
                            {getTypeLabel(result.type)}
                          </span>
                          {result.date && (
                            <span className="text-xs text-cyber-gray">{result.date}</span>
                          )}
                        </div>
                        <h4 className="text-cyber-white font-medium line-clamp-1">{result.title}</h4>
                        {result.excerpt && (
                          <p className="text-sm text-cyber-gray line-clamp-2">{result.excerpt}</p>
                        )}
                      </div>
                      {result.views && (
                        <div className="text-xs text-cyber-gray flex-shrink-0">
                          {result.views} 浏览
                        </div>
                      )}
                    </motion.a>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {!isLoading && query.length < 2 && showRecent && recentSearches.length > 0 && (
                <div className="p-4 border-b border-cyber-gray/20">
                  <div className="flex items-center gap-2 mb-3 text-sm text-cyber-gray">
                    <Clock className="w-4 h-4" />
                    <span>最近搜索</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((recent, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentClick(recent)}
                        className="px-3 py-1.5 text-sm bg-cyber-gray/10 hover:bg-cyber-gray/20 text-cyber-gray rounded-lg transition-colors"
                      >
                        {recent}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              {!isLoading && query.length < 2 && showTrending && trendingSearches.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3 text-sm text-cyber-gray">
                    <TrendingUp className="w-4 h-4" />
                    <span>热门搜索</span>
                  </div>
                  <div className="space-y-2">
                    {trendingSearches.map((trending, index) => (
                      <button
                        key={index}
                        onClick={() => handleRecentClick(trending)}
                        className="flex items-center gap-3 w-full p-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors text-left"
                      >
                        <span className={cn(
                          'w-6 h-6 flex items-center justify-center text-xs font-bold rounded',
                          index < 3 ? 'bg-cyber-pink/20 text-cyber-pink' : 'bg-cyber-gray/20 text-cyber-gray'
                        )}>
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm text-cyber-gray">{trending}</span>
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
};

export default RealTimeSearch;
