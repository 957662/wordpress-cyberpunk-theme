'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Types
interface SearchResult {
  id: string;
  type: 'post' | 'portfolio' | 'page';
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => Promise<SearchResult[]>;
  colorScheme?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
  trendingSearches?: string[];
}

// Color schemes
const colorSchemes = {
  cyan: {
    primary: 'from-cyan-500 to-blue-500',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    glow: 'shadow-cyan-500/50',
  },
  purple: {
    primary: 'from-purple-500 to-pink-500',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/50',
  },
  pink: {
    primary: 'from-pink-500 to-rose-500',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/50',
  },
  green: {
    primary: 'from-green-500 to-emerald-500',
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    glow: 'shadow-green-500/50',
  },
  orange: {
    primary: 'from-orange-500 to-amber-500',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    glow: 'shadow-orange-500/50',
  },
};

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  isOpen,
  onClose,
  onSearch,
  colorScheme = 'cyan',
  trendingSearches = [],
}) => {
  const colors = colorSchemes[colorScheme];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentSearches(parsed.slice(0, 5)); // Keep only 5 recent searches
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const searchResults = await onSearch(query);
          setResults(searchResults);
        } catch (error) {
          console.error('Search failed:', error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const newRecentSearch: RecentSearch = {
      query: searchQuery,
      timestamp: Date.now(),
    };

    const updatedRecentSearches = [
      newRecentSearch,
      ...recentSearches.filter((s) => s.query !== searchQuery),
    ].slice(0, 5);

    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));

    setQuery(searchQuery);
  };

  const handleResultClick = (result: SearchResult) => {
    onClose();
    // Navigate will be handled by Link component
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 max-w-4xl mx-auto mt-4 mx-4 md:mx-auto"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-4 p-6 border-b border-gray-800">
                <Search className={`w-6 h-6 ${colors.text}`} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="搜索文章、作品、页面..."
                  className="flex-1 bg-transparent text-white text-xl placeholder-gray-500 focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query.trim().length >= 2 ? (
                  // Search Results
                  <div className="p-4">
                    {isSearching ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-2">
                        {results.map((result) => (
                          <Link
                            key={result.id}
                            href={
                              result.type === 'post'
                                ? `/blog/${result.slug}`
                                : result.type === 'portfolio'
                                ? `/portfolio/${result.slug}`
                                : `/${result.slug}`
                            }
                            onClick={() => handleResultClick(result)}
                            className="block group"
                          >
                            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-800/50 transition-colors">
                              {result.featuredImage && (
                                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                  <Image
                                    src={result.featuredImage}
                                    alt={result.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="text-white font-medium group-hover:text-cyan-400 transition-colors truncate">
                                    {result.title}
                                  </h4>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                    {result.type === 'post' ? '文章' : result.type === 'portfolio' ? '作品' : '页面'}
                                  </span>
                                </div>
                                {result.excerpt && (
                                  <p className="text-sm text-gray-400 line-clamp-1">{result.excerpt}</p>
                                )}
                                {result.category && (
                                  <p className={`text-xs mt-1 ${colors.text}`}>{result.category}</p>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-400">没有找到相关结果</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Default State
                  <div className="p-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            最近搜索
                          </h3>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-gray-500 hover:text-white transition-colors"
                          >
                            清除
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearch(search.query)}
                              className="px-3 py-1.5 rounded-lg bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
                            >
                              {search.query}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Trending Searches */}
                    {trendingSearches.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 flex items-center gap-2 mb-4">
                          <TrendingUp className="w-4 h-4" />
                          热门搜索
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {trendingSearches.map((trending, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearch(trending)}
                              className="p-3 rounded-lg bg-gray-800 text-left hover:bg-gray-700 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`text-lg font-bold ${colors.text} opacity-50`}>
                                  {index + 1}
                                </span>
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                                  {trending}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Search Tips */}
                    <div className="mt-8 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                      <p className="text-xs text-gray-400 text-center">
                        按 <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">Enter</kbd> 搜索
                        {' · '}
                        按 <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-300">Esc</kbd> 关闭
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
