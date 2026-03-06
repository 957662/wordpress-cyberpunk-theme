'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, FileText, User, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'tag' | 'category';
  title: string;
  slug: string;
  excerpt?: string;
  thumbnail?: string;
  category?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  metrics?: {
    views?: number;
    likes?: number;
  };
}

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

interface RealtimeSearchProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

/**
 * 实时搜索组件
 * 
 * 功能特性:
 * - 实时搜索建议
 * - 搜索历史记录
 * - 热门搜索推荐
 * - 键盘导航支持
 * - 多类型结果展示
 * - 防抖优化
 */
export default function RealtimeSearch({
  placeholder = '搜索文章、用户、标签...',
  className = '',
  onSearch,
}: RealtimeSearchProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [trending, setTrending] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  // 加载搜索历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // 加载热门搜索（这里应该从 API 获取）
    setTrending(['Next.js 14', 'TypeScript', 'React Server Components', 'Tailwind CSS']);
  }, []);

  // 执行搜索
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length + history.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleResultClick(selectedIndex);
          } else if (query) {
            handleSearch();
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, history, selectedIndex, query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      // 这里应该调用实际的搜索 API
      // 暂时使用模拟数据
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'post',
          title: `${searchQuery} - 完整指南`,
          slug: 'complete-guide',
          excerpt: `关于 ${searchQuery} 的详细教程和最佳实践...`,
          category: '教程',
        },
        {
          id: '2',
          type: 'post',
          title: `使用 ${searchQuery} 构建现代应用`,
          slug: 'build-modern-apps',
          excerpt: `探索如何使用 ${searchQuery} 构建高性能应用...`,
          category: '实战',
        },
        {
          id: '3',
          type: 'tag',
          title: searchQuery,
          slug: searchQuery.toLowerCase(),
        },
      ];

      setResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      // 保存到历史记录
      const newHistory: SearchHistoryItem = {
        query: query.trim(),
        timestamp: Date.now(),
      };
      
      const updatedHistory = [
        newHistory,
        ...history.filter(h => h.query !== query.trim()),
      ].slice(0, 10); // 保留最近 10 条

      setHistory(updatedHistory);
      localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));

      // 执行搜索
      onSearch?.(query);
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleResultClick = (index: number) => {
    const totalItems = history.length + results.length;
    
    if (index < history.length) {
      // 点击历史记录
      const historyItem = history[index];
      setQuery(historyItem.query);
      performSearch(historyItem.query);
    } else {
      // 点击搜索结果
      const result = results[index - history.length];
      
      if (result.type === 'post') {
        router.push(`/blog/${result.slug}`);
      } else if (result.type === 'user') {
        router.push(`/user/${result.slug}`);
      } else if (result.type === 'tag' || result.type === 'category') {
        router.push(`/blog?tag=${result.slug}`);
      }
    }
    
    setIsOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const getIconForType = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
        return FileText;
      case 'user':
        return User;
      case 'tag':
      case 'category':
        return Tag;
      default:
        return Search;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-cyan-500/30 focus:outline-none focus:border-cyan-500 transition-colors"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-gray-900 border border-cyan-500/30 shadow-xl overflow-hidden z-50 max-h-[600px] overflow-y-auto"
          >
            {/* Search History */}
            {query.length < 2 && history.length > 0 && (
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>搜索历史</span>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    清除
                  </button>
                </div>
                <div className="space-y-1">
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleResultClick(index)}
                      className={`w-full text-left px-3 py-2 rounded text-sm text-gray-300 hover:bg-gray-800 transition-colors ${
                        selectedIndex === index ? 'bg-gray-800' : ''
                      }`}
                    >
                      {item.query}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {query.length < 2 && trending.length > 0 && (
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>热门搜索</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trending.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(term);
                        performSearch(term);
                      }}
                      className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm hover:bg-cyan-500/20 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query.length >= 2 && (
              <div className="p-2">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((result, index) => {
                      const Icon = getIconForType(result.type);
                      const actualIndex = history.length + index;
                      
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(actualIndex)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-800 transition-colors ${
                            selectedIndex === actualIndex ? 'bg-gray-800' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Icon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white text-sm">
                                  {result.title}
                                </span>
                                <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 capitalize">
                                  {result.type}
                                </span>
                              </div>
                              {result.excerpt && (
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                  {result.excerpt}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    
                    {/* View All Results */}
                    <Link
                      href={`/search?q=${encodeURIComponent(query)}`}
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center py-2 text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      查看所有 "{query}" 的结果
                    </Link>
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    没有找到 "{query}" 的相关结果
                  </div>
                )}
              </div>
            )}

            {/* Keyboard Shortcut Hint */}
            <div className="px-4 py-2 bg-gray-800/50 border-t border-gray-700">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-700">↑↓</kbd>
                  导航
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-700">Enter</kbd>
                  选择
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-gray-700">Esc</kbd>
                  关闭
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
