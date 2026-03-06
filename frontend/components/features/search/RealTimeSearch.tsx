'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, debounce } from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Types
export interface SearchResult {
  id: string;
  type: 'post' | 'category' | 'tag' | 'user';
  title: string;
  excerpt?: string;
  url: string;
  thumbnail?: string;
  category?: string;
  tags?: string[];
  author?: {
    name: string;
    avatar?: string;
  };
  publishedAt?: string;
  relevance?: number;
}

interface SearchHistory {
  query: string;
  timestamp: number;
}

interface RealTimeSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  maxResults?: number;
  showHistory?: boolean;
  showSuggestions?: boolean;
  className?: string;
}

export function RealTimeSearch({
  onSearch,
  placeholder = '搜索文章、标签、分类...',
  maxResults = 8,
  showHistory = true,
  showSuggestions = true,
  className
}: RealTimeSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [suggestions] = useState<string[]>([
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Framer Motion',
    'React Hooks',
    'FastAPI',
    '赛博朋克',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('search-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHistory(parsed.slice(0, 5)); // Keep only last 5 searches
      } catch (err) {
        console.error('Failed to parse search history:', err);
      }
    }
  }, []);

  // Save search history to localStorage
  const saveHistory = useCallback((newQuery: string) => {
    if (!newQuery.trim()) return;

    const newHistory = [
      { query: newQuery, timestamp: Date.now() },
      ...history.filter(h => h.query.toLowerCase() !== newQuery.toLowerCase()),
    ].slice(0, 5);

    setHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));
  }, [history]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await onSearch(searchQuery);
        setResults(searchResults.slice(0, maxResults));
        setShowResults(true);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [onSearch, maxResults]
  );

  // Handle search query change
  useEffect(() => {
    debouncedSearch(query);
    setActiveIndex(-1);
  }, [query, debouncedSearch]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showResults) return;

      const totalItems = results.length;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        const result = results[activeIndex];
        if (result) {
          handleResultClick(result);
        }
      } else if (e.key === 'Escape') {
        setShowResults(false);
        setActiveIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResults, results, activeIndex]);

  const handleResultClick = (result: SearchResult) => {
    saveHistory(query);
    setShowResults(false);
    setQuery('');
    router.push(result.url);
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    saveHistory(historyQuery);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('search-history');
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setActiveIndex(-1);
  };

  const getIconForType = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
        return '📝';
      case 'category':
        return '📁';
      case 'tag':
        return '🏷️';
      case 'user':
        return '👤';
      default:
        return '🔍';
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-cyber-cyan/30 text-cyber-cyan rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className={cn('relative w-full max-w-3xl mx-auto', className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query || history.length > 0 || showSuggestions) {
              setShowResults(true);
            }
          }}
          placeholder={placeholder}
          className={cn(
            'pl-12 pr-12 py-3 bg-cyber-dark/50 backdrop-blur-sm border-cyber-cyan/30',
            'focus:border-cyber-cyan focus:ring-cyber-cyan/50 text-white placeholder:text-gray-500',
            'transition-all duration-200'
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2"
          >
            <Card className="bg-cyber-dark/95 backdrop-blur-sm border-cyber-cyan/20 shadow-xl overflow-hidden">
              {/* Loading State */}
              {isLoading && (
                <div className="p-8 text-center text-gray-400">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-cyber-cyan border-t-transparent" />
                  <p className="mt-2">搜索中...</p>
                </div>
              )}

              {/* Search Results */}
              {!isLoading && results.length > 0 && (
                <div className="max-h-[500px] overflow-y-auto">
                  <div className="px-4 py-2 border-b border-cyber-cyan/20 text-sm text-gray-400">
                    找到 {results.length} 个结果
                  </div>
                  {results.map((result, index) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleResultClick(result)}
                      className={cn(
                        'w-full px-4 py-3 text-left hover:bg-cyber-cyan/10 transition-colors border-b border-cyber-cyan/10 last:border-b-0',
                        activeIndex === index && 'bg-cyber-cyan/10 border-l-2 border-l-cyber-cyan'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl">{getIconForType(result.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-cyber-cyan truncate">
                              {highlightMatch(result.title, query)}
                            </h4>
                            {result.relevance !== undefined && (
                              <Badge variant="outline" className="text-xs">
                                {Math.round(result.relevance * 100)}%
                              </Badge>
                            )}
                          </div>
                          {result.excerpt && (
                            <p className="text-sm text-gray-400 line-clamp-2">
                              {highlightMatch(result.excerpt, query)}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            {result.category && (
                              <Badge variant="secondary" className="text-xs">
                                {result.category}
                              </Badge>
                            )}
                            {result.tags && result.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {!isLoading && query && results.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-400 mb-4">没有找到相关结果</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(query)}`);
                      setShowResults(false);
                    }}
                    className="border-cyber-cyan/30"
                  >
                    查看更多结果
                  </Button>
                </div>
              )}

              {/* Search History */}
              {!isLoading && !query && showHistory && history.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>搜索历史</span>
                    </div>
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-cyber-pink hover:text-cyber-pink/80 transition-colors"
                    >
                      清除
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((item, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        onClick={() => handleHistoryClick(item.query)}
                        className="cursor-pointer hover:bg-cyber-cyan/10 border-cyber-cyan/30"
                      >
                        {item.query}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {!isLoading && !query && showSuggestions && suggestions.length > 0 && (
                <div className="p-4 border-t border-cyber-cyan/10">
                  <div className="flex items-center gap-2 mb-3 text-sm text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>热门搜索</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        onClick={() => {
                          setQuery(suggestion);
                          saveHistory(suggestion);
                        }}
                        className="cursor-pointer hover:bg-cyber-cyan/10 border-cyber-cyan/30"
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RealTimeSearch;
