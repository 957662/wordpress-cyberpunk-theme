'use client';

/**
 * RealtimeSearch - 实时搜索组件
 * 支持文章搜索、搜索建议、搜索历史
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  tags: string[];
}

interface RealtimeSearchProps {
  className?: string;
}

export function RealtimeSearch({ className }: RealtimeSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 模拟搜索 API - 实际项目中应该调用真实 API
  const searchArticles = useCallback(async (q: string) => {
    if (!q.trim()) return [];

    setIsLoading(true);

    // 模拟 API 延迟
    await new Promise(resolve => setTimeout(resolve, 300));

    // 模拟搜索结果
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: `${q} 相关文章 1`,
        excerpt: `关于 ${q} 的详细介绍和教程...`,
        slug: 'article-1',
        category: '技术',
        tags: ['前端', 'React'],
      },
      {
        id: '2',
        title: `${q} 深度解析`,
        excerpt: `深入探讨 ${q} 的核心概念...`,
        slug: 'article-2',
        category: '教程',
        tags: ['JavaScript', 'TypeScript'],
      },
    ];

    setIsLoading(false);
    return mockResults;
  }, []);

  // 更新搜索建议
  const updateSuggestions = useCallback((q: string) => {
    const mockSuggestions = [
      `${q} 教程`,
      `${q} 最佳实践`,
      `${q} 指南`,
      `${q} 示例`,
      `${q} 2024`,
    ];
    setSuggestions(mockSuggestions);
  }, []);

  // 监听输入变化
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        const searchResults = await searchArticles(query);
        setResults(searchResults);
        updateSuggestions(query);
        setIsOpen(true);
      } else {
        setResults([]);
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchArticles, updateSuggestions]);

  // 提交搜索
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // 更新搜索历史
    setSearchHistory(prev => {
      const newHistory = [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      return newHistory;
    });

    // 跳转到搜索结果页
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setQuery('');
  };

  // 加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // 清除搜索历史
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="搜索文章..."
          className={cn(
            'w-full pl-10 pr-10 py-3',
            'bg-cyber-dark border border-cyber-border rounded-lg',
            'text-white placeholder-gray-500',
            'focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20',
            'transition-all duration-200'
          )}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setSuggestions([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <div className="cyber-card border border-cyber-border rounded-lg overflow-hidden shadow-xl">
              {/* Search Suggestions */}
              {suggestions.length > 0 && !query && (
                <div className="p-3 border-b border-cyber-border">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>热门搜索</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(suggestion)}
                        className="px-3 py-1.5 text-sm bg-cyber-dark border border-cyber-border rounded-md text-gray-300 hover:border-cyber-cyan hover:text-cyber-cyan transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {results.length > 0 && (
                <div className="max-h-[400px] overflow-y-auto">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => router.push(`/blog/${result.slug}`)}
                      className="w-full p-4 text-left hover:bg-cyber-cyan/5 transition-colors border-b border-cyber-border last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white mb-1 truncate">
                            {result.title}
                          </h4>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {result.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 bg-cyber-purple/20 text-cyber-purple rounded">
                              {result.category}
                            </span>
                            {result.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="text-xs text-gray-500">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && !query && (
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>搜索历史</span>
                    </div>
                    <button
                      onClick={clearHistory}
                      className="text-xs text-gray-500 hover:text-cyber-cyan transition-colors"
                    >
                      清除
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(item)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-cyber-dark rounded transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="p-8 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-cyber-cyan border-t-transparent" />
                  <p className="text-sm mt-2">搜索中...</p>
                </div>
              )}

              {/* No Results */}
              {!isLoading && query && results.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">没有找到相关文章</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default RealtimeSearch;
