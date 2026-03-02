'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  FileText,
  Tag,
  User,
  Calendar,
  ArrowRight,
  Filter,
  SlidersHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { debounce } from '@/lib/utils/debounce';

// 模拟搜索结果类型
interface SearchResult {
  id: string;
  type: 'post' | 'page' | 'portfolio' | 'tag' | 'author';
  title: string;
  excerpt?: string;
  url: string;
  date?: string;
  category?: string;
  tags?: string[];
  author?: string;
  relevance?: number;
}

// 搜索建议类型
interface SearchSuggestion {
  text: string;
  type: 'history' | 'trending' | 'suggestion';
}

export default function GlobalSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    date: 'all',
    category: 'all',
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // 模拟热门搜索
  const trendingSearches = [
    'React Hooks',
    'Next.js 14',
    'TypeScript',
    'Tailwind CSS',
    '性能优化',
  ];

  // 模拟数据
  const mockData: SearchResult[] = [
    {
      id: '1',
      type: 'post',
      title: 'React Hooks 完全指南',
      excerpt: '深入了解 React Hooks 的使用方法和最佳实践',
      url: '/blog/react-hooks-guide',
      date: '2026-02-28',
      category: '教程',
      tags: ['React', 'JavaScript'],
      author: '张三',
      relevance: 0.95,
    },
    {
      id: '2',
      type: 'post',
      title: 'Next.js 14 新特性解析',
      excerpt: '全面解析 Next.js 14 的 Server Actions 和其他新特性',
      url: '/blog/nextjs-14-features',
      date: '2026-03-01',
      category: '技术',
      tags: ['Next.js', 'React'],
      author: '李四',
      relevance: 0.92,
    },
    {
      id: '3',
      type: 'portfolio',
      title: '电商网站设计案例',
      excerpt: '使用 Next.js 和 Tailwind CSS 构建的现代化电商网站',
      url: '/portfolio/ecommerce-design',
      date: '2026-02-20',
      category: '作品集',
      relevance: 0.88,
    },
    {
      id: '4',
      type: 'page',
      title: '关于我们',
      excerpt: '了解更多关于我们的信息',
      url: '/about',
      relevance: 0.85,
    },
  ];

  // 加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = useCallback((searchQuery: string) => {
    setSearchHistory((prev) => {
      const updated = [searchQuery, ...prev.filter((q) => q !== searchQuery)].slice(0, 10);
      localStorage.setItem('searchHistory', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 执行搜索
  const performSearch = useCallback(
    debounce((searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      // 模拟搜索延迟
      setTimeout(() => {
        let filtered = mockData.filter(
          (item) =>
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // 应用过滤器
        if (filters.type !== 'all') {
          filtered = filtered.filter((item) => item.type === filters.type);
        }

        setResults(filtered);
        setIsSearching(false);
      }, 300);
    }, 300),
    [filters]
  );

  // 更新搜索查询
  useEffect(() => {
    if (query) {
      performSearch(query);
      // 生成建议
      const historySuggestions = searchHistory
        .filter((h) => h.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map((text) => ({ text, type: 'history' as const }));

      const trendingSuggestions = trendingSearches
        .filter((t) => t.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)
        .map((text) => ({ text, type: 'trending' as const }));

      setSuggestions([...historySuggestions, ...trendingSuggestions]);
    } else {
      setResults([]);
      setSuggestions(
        searchHistory.slice(0, 5).map((text) => ({ text, type: 'history' as const }))
      );
    }
  }, [query, performSearch, searchHistory]);

  // 处理搜索
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      saveToHistory(searchQuery);
    }
  };

  // 清空搜索
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
  };

  // 类型图标映射
  const typeIcons = {
    post: <FileText size={18} className="text-cyan-400" />,
    page: <FileText size={18} className="text-purple-400" />,
    portfolio: <FileText size={18} className="text-pink-400" />,
    tag: <Tag size={18} className="text-yellow-400" />,
    author: <User size={18} className="text-green-400" />,
  };

  const typeLabels = {
    post: '文章',
    page: '页面',
    portfolio: '作品',
    tag: '标签',
    author: '作者',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      {/* 搜索头部 */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold text-white text-center mb-8">全局搜索</h1>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章、页面、作品集..."
                className={cn(
                  'w-full pl-12 pr-24 py-4',
                  'bg-gray-800/50 border border-gray-700',
                  'rounded-xl',
                  'text-white placeholder-gray-400',
                  'focus:outline-none focus:border-cyan-500/50',
                  'transition-all duration-300',
                  'text-lg'
                )}
                autoFocus
              />

              {query && (
                <button
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              )}

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  'absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg',
                  'hover:bg-gray-700',
                  'text-gray-400 hover:text-white',
                  'transition-colors',
                  showFilters && 'bg-gray-700 text-cyan-400'
                )}
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>

            {/* 过滤器 */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-4 pt-4"
                >
                  <Filter size={18} className="text-gray-400" />
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="all">全部类型</option>
                    <option value="post">文章</option>
                    <option value="page">页面</option>
                    <option value="portfolio">作品集</option>
                  </select>

                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="all">全部分类</option>
                    <option value="tutorial">教程</option>
                    <option value="tech">技术</option>
                    <option value="design">设计</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* 搜索内容 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 搜索建议 */}
        {!query && (
          <div className="space-y-6">
            {/* 搜索历史 */}
            {searchHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock size={20} className="text-cyan-400" />
                    搜索历史
                  </h2>
                  <button
                    onClick={() => {
                      setSearchHistory([]);
                      localStorage.removeItem('searchHistory');
                    }}
                    className="text-sm text-gray-400 hover:text-red-400 transition-colors"
                  >
                    清空
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(item)}
                      className="px-4 py-2 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-cyan-500/50 rounded-lg text-gray-300 hover:text-white transition-all"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 热门搜索 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                <TrendingUp size={20} className="text-pink-400" />
                热门搜索
              </h2>

              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(item)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 hover:from-cyan-500/20 hover:to-purple-500/20 border border-cyan-500/30 hover:border-cyan-500/50 rounded-lg text-gray-300 hover:text-white transition-all"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* 搜索结果 */}
        {query && (
          <div className="space-y-4">
            {/* 结果统计 */}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
              <span>
                找到 <span className="text-cyan-400 font-semibold">{results.length}</span> 个结果
              </span>
              <span>搜索 "{query}"</span>
            </div>

            {/* 加载状态 */}
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                  <span>搜索中...</span>
                </div>
              </div>
            )}

            {/* 结果列表 */}
            <AnimatePresence>
              {results.map((result, index) => (
                <motion.a
                  key={result.id}
                  href={result.url}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'block p-6 rounded-xl',
                    'bg-gray-900/50 border border-gray-800',
                    'hover:border-cyan-500/50 hover:bg-gray-800/50',
                    'transition-all duration-300',
                    'group'
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* 类型图标 */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                      {typeIcons[result.type]}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {result.title}
                        </h3>
                        <ArrowRight size={18} className="text-gray-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                      </div>

                      {result.excerpt && (
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                          {result.excerpt}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          {typeIcons[result.type]}
                          {typeLabels[result.type]}
                        </span>

                        {result.category && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {result.category}
                          </span>
                        )}

                        {result.author && (
                          <span className="flex items-center gap-1">
                            <User size={14} />
                            {result.author}
                          </span>
                        )}

                        {result.date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {result.date}
                          </span>
                        )}
                      </div>

                      {result.tags && result.tags.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                          {result.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 text-xs rounded bg-gray-800 text-gray-400"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))
            )}
            </AnimatePresence>

            {/* 无结果 */}
            {!isSearching && results.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Search size={48} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  未找到相关结果
                </h3>
                <p className="text-gray-400">
                  试试其他关键词或调整搜索条件
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
