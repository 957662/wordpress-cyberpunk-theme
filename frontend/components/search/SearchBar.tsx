'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface SearchResult {
  id: string;
  type: 'post' | 'page' | 'portfolio' | 'category' | 'tag';
  title: string;
  slug: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string;
  publishedAt?: string;
}

export interface SearchBarProps {
  onSearch?: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  autoFocus?: boolean;
  showRecent?: boolean;
  showTrending?: boolean;
  recentSearches?: string[];
  trendingSearches?: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = '搜索文章、标签、分类...',
  autoFocus = false,
  showRecent = true,
  showTrending = true,
  recentSearches = [],
  trendingSearches = []
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          if (onSearch) {
            const searchResults = await onSearch(query);
            setResults(searchResults);
          }
          setShowResults(true);
        } catch (error) {
          console.error('搜索失败:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

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
        if (selectedIndex >= 0) {
          const result = results[selectedIndex];
          const url = getResultUrl(result);
          router.push(url);
          setShowResults(false);
          setQuery('');
        }
        break;
      case 'Escape':
        setShowResults(false);
        inputRef.current?.blur();
        break;
    }
  };

  const getResultUrl = (result: SearchResult): string => {
    switch (result.type) {
      case 'post':
        return `/blog/${result.slug}`;
      case 'page':
        return `/${result.slug}`;
      case 'portfolio':
        return `/portfolio/${result.slug}`;
      case 'category':
        return `/categories/${result.slug}`;
      case 'tag':
        return `/tags/${result.slug}`;
      default:
        return '/';
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setQuery('');
    }
  };

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery);
    handleSearch(recentQuery);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    const labels = {
      post: '文章',
      page: '页面',
      portfolio: '作品',
      category: '分类',
      tag: '标签'
    };
    return labels[type];
  };

  const getTypeColor = (type: SearchResult['type']) => {
    const colors = {
      post: 'from-cyber-cyan to-blue-500',
      page: 'from-cyber-purple to-pink-500',
      portfolio: 'from-cyber-pink to-red-500',
      category: 'from-green-400 to-emerald-500',
      tag: 'from-yellow-400 to-orange-500'
    };
    return colors[type];
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim().length >= 2 || recentSearches.length > 0 || trendingSearches.length > 0) {
                setShowResults(true);
              }
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 rounded-2xl bg-dark-bg/80 border-2 border-dark-border text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none transition-all duration-300"
          />
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={clearSearch}
              className="absolute right-4 p-1 rounded-full hover:bg-dark-bg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </motion.button>
          )}
        </div>

        {/* 加载指示器 */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-14 top-1/2 -translate-y-1/2"
          >
            <div className="w-5 h-5 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-dark-bg border-2 border-dark-border rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[600px] overflow-y-auto"
          >
            {/* 搜索结果 */}
            {results.length > 0 && (
              <div className="p-2">
                <div className="px-4 py-2 text-xs text-gray-500 font-semibold">
                  找到 {results.length} 个结果
                </div>
                {results.map((result, index) => (
                  <motion.a
                    key={result.id}
                    href={getResultUrl(result)}
                    className={`
                      flex items-start gap-3 p-3 rounded-xl transition-all duration-200
                      ${index === selectedIndex ? 'bg-cyber-cyan/10' : 'hover:bg-dark-bg/50'}
                    `}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => {
                      setShowResults(false);
                      setQuery('');
                    }}
                  >
                    {result.thumbnail && (
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={result.thumbnail}
                          alt={result.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`
                            px-2 py-0.5 rounded-full text-xs font-semibold text-white
                            bg-gradient-to-r ${getTypeColor(result.type)}
                          `}
                        >
                          {getTypeLabel(result.type)}
                        </span>
                        {result.category && (
                          <span className="text-xs text-gray-500">{result.category}</span>
                        )}
                      </div>
                      <h4 className="text-white font-semibold line-clamp-1">
                        {result.title}
                      </h4>
                      {result.excerpt && (
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {result.excerpt}
                        </p>
                      )}
                    </div>
                  </motion.a>
                ))}
              </div>
            )}

            {/* 无结果 */}
            {query.trim().length >= 2 && !isSearching && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-500 mb-2">未找到相关结果</p>
                <p className="text-sm text-gray-600">试试其他关键词吧</p>
              </div>
            )}

            {/* 推荐搜索 */}
            {query.trim().length < 2 && (
              <div className="p-4">
                {/* 最近搜索 */}
                {showRecent && recentSearches.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-semibold text-gray-400">最近搜索</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((recent, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentClick(recent)}
                          className="px-3 py-1.5 rounded-lg bg-dark-bg border border-dark-border text-sm text-gray-400 hover:border-cyber-cyan hover:text-cyber-cyan transition-all"
                        >
                          {recent}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 热门搜索 */}
                {showTrending && trendingSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-4 h-4 text-cyber-cyan" />
                      <span className="text-sm font-semibold text-gray-400">热门搜索</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((trending, index) => (
                        <button
                          key={index}
                          onClick={() => handleRecentClick(trending)}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyber-cyan/10 to-blue-500/10 border border-cyber-cyan/20 text-sm text-cyber-cyan hover:shadow-neon transition-all"
                        >
                          {trending}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 快捷键提示 */}
            {results.length > 0 && (
              <div className="px-4 py-2 bg-dark-bg/50 border-t border-dark-border">
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border">↑↓</kbd>
                    导航
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border">Enter</kbd>
                    选择
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-dark-bg border border-dark-border">Esc</kbd>
                    关闭
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
