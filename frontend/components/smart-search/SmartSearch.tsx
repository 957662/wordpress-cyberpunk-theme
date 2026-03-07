'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, Tag, User, FileText, Hash, ChevronRight } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'article' | 'user' | 'tag' | 'category';
  title: string;
  description?: string;
  url?: string;
  icon?: React.ReactNode;
  meta?: string;
  trending?: boolean;
}

interface SmartSearchProps {
  placeholder?: string;
  maxResults?: number;
  showRecent?: boolean;
  showTrending?: boolean;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onSelect?: (result: SearchResult) => void;
  className?: string;
}

export const SmartSearch: React.FC<SmartSearchProps> = ({
  placeholder = '搜索文章、用户、标签...',
  maxResults = 8,
  showRecent = true,
  showTrending = true,
  onSearch,
  onSelect,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Next.js 14 教程',
    'TypeScript 最佳实践',
    '赛博朋克设计',
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock trending searches
  const trendingSearches = [
    { id: '1', term: 'React Server Components', count: 1234 },
    { id: '2', term: 'TypeScript 5.4', count: 892 },
    { id: '3', term: 'Next.js 14', count: 756 },
    { id: '4', term: 'Tailwind CSS', count: 543 },
  ];

  // Mock search results
  const mockSearchResults = (q: string): SearchResult[] => {
    if (!q) return [];

    return [
      {
        id: '1',
        type: 'article',
        title: `${q} - 深入指南`,
        description: `关于 ${q} 的详细教程和最佳实践...`,
        url: `/articles/${encodeURIComponent(q)}`,
        meta: '5 分钟阅读',
      },
      {
        id: '2',
        type: 'article',
        title: `${q} 实战案例`,
        description: `使用 ${q} 构建实际项目的经验分享...`,
        url: `/articles/${encodeURIComponent(q)}-case`,
        meta: '10 分钟阅读',
      },
      {
        id: '3',
        type: 'user',
        title: `@${q.toLowerCase().replace(/\s/g, '')}`,
        description: '前端开发工程师',
        url: `/users/${q}`,
        meta: '128 篇文章',
      },
      {
        id: '4',
        type: 'tag',
        title: `#${q}`,
        description: `${Math.floor(Math.random() * 100)} 篇相关文章`,
        url: `/tags/${encodeURIComponent(q)}`,
        meta: `${Math.floor(Math.random() * 1000)} 关注`,
      },
    ];
  };

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);

        let searchResults: SearchResult[];
        if (onSearch) {
          searchResults = await onSearch(query);
        } else {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 300));
          searchResults = mockSearchResults(query);
        }

        setResults(searchResults.slice(0, maxResults));
        setIsSearching(false);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, maxResults, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SearchResult) => {
    setQuery(result.title);
    setShowDropdown(false);

    // Add to recent searches
    if (!recentSearches.includes(result.title)) {
      setRecentSearches(prev => [result.title, ...prev.slice(0, 4)]);
    }

    onSelect?.(result);
  };

  const handleRecentSearch = (term: string) => {
    setQuery(term);
    setShowDropdown(true);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const getIcon = (type: SearchResult['type']) => {
    const icons = {
      article: <FileText className="w-4 h-4" />,
      user: <User className="w-4 h-4" />,
      tag: <Tag className="w-4 h-4" />,
      category: <Hash className="w-4 h-4" />,
    };
    return icons[type];
  };

  const getTypeColor = (type: SearchResult['type']) => {
    const colors = {
      article: 'text-cyber-cyan',
      user: 'text-cyber-purple',
      tag: 'text-cyber-pink',
      category: 'text-cyber-green',
    };
    return colors[type];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = [...recentSearches, ...results];
    const maxIndex = items.length - 1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = items[selectedIndex];
      if (selected) {
        if (typeof selected === 'string') {
          handleRecentSearch(selected);
        } else {
          handleSelect(selected);
        }
      }
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-cyber-cyan/50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full pl-12 pr-12 py-4 bg-cyber-dark/90 border-2 border-cyber-cyan/30 rounded-xl text-white placeholder-cyber-cyan/50 focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20 transition-all backdrop-blur-xl"
            />
            {query && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => {
                  setQuery('');
                  setResults([]);
                }}
                className="absolute right-4 p-1 hover:bg-cyber-cyan/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-cyber-cyan/50 hover:text-cyber-cyan" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Loading Indicator */}
        {isSearching && (
          <div className="absolute right-14 top-1/2 -translate-y-1/2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-cyber-dark/95 border border-cyber-cyan/30 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl z-50"
          >
            <div className="max-h-[400px] overflow-y-auto">
              {/* Search Results */}
              {results.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-cyber-cyan/50 uppercase tracking-wider">
                    搜索结果
                  </div>
                  {results.map((result, index) => (
                    <motion.button
                      key={result.id}
                      whileHover={{ x: 4 }}
                      onClick={() => handleSelect(result)}
                      className={`w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-all ${
                        selectedIndex === index
                          ? 'bg-cyber-cyan/20'
                          : 'hover:bg-cyber-muted/50'
                      }`}
                    >
                      <div className={`flex-shrink-0 mt-0.5 ${getTypeColor(result.type)}`}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{result.title}</p>
                        {result.description && (
                          <p className="text-cyber-cyan/50 text-xs truncate mt-0.5">
                            {result.description}
                          </p>
                        )}
                        {result.meta && (
                          <p className="text-cyber-cyan/30 text-xs mt-1">{result.meta}</p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-cyber-cyan/30 flex-shrink-0 mt-1" />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {!query && showRecent && recentSearches.length > 0 && (
                <div className="p-2 border-t border-cyber-cyan/20">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyber-cyan/50 uppercase tracking-wider">
                      <Clock className="w-3 h-3" />
                      最近搜索
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-cyber-cyan/50 hover:text-cyber-cyan transition-colors"
                    >
                      清除
                    </button>
                  </div>
                  {recentSearches.map((term, index) => (
                    <motion.button
                      key={term}
                      whileHover={{ x: 4 }}
                      onClick={() => handleRecentSearch(term)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                        selectedIndex === index
                          ? 'bg-cyber-cyan/20'
                          : 'hover:bg-cyber-muted/50'
                      }`}
                    >
                      <Clock className="w-4 h-4 text-cyber-cyan/30" />
                      <span className="text-sm text-cyber-cyan/70">{term}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Trending Searches */}
              {!query && showTrending && (
                <div className="p-2 border-t border-cyber-cyan/20">
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-cyber-cyan/50 uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3" />
                    热门搜索
                  </div>
                  {trendingSearches.map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 4 }}
                      onClick={() => handleRecentSearch(item.term)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-cyber-muted/50 transition-all"
                    >
                      <TrendingUp className="w-4 h-4 text-cyber-pink" />
                      <span className="flex-1 text-sm text-cyber-cyan/70">{item.term}</span>
                      <span className="text-xs text-cyber-cyan/30">{item.count}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query && !isSearching && results.length === 0 && (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-cyber-cyan/20 mx-auto mb-3" />
                  <p className="text-cyber-cyan/50 text-sm">未找到相关结果</p>
                  <p className="text-cyber-cyan/30 text-xs mt-1">试试其他关键词</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmartSearch;
