'use client';

/**
 * BlogSearchAdvanced
 *
 * 高级博客搜索组件
 * 支持全文搜索、筛选、排序
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Calendar,
  Tag,
  User,
  SlidersHorizontal,
} from 'lucide-react';
import { debounce } from '@/lib/utils';
import { BlogCardAdaptive } from './BlogCardAdaptive';
import type { BlogPost } from '@/types/models/blog';

interface SearchFilters {
  query: string;
  category: string;
  tags: string[];
  author: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'relevance' | 'date' | 'popularity';
}

interface BlogSearchAdvancedProps {
  posts: BlogPost[];
  categories?: Array<{ id: number; name: string; slug: string }>;
  tags?: Array<{ id: number; name: string; slug: string }>;
  authors?: Array<{ id: number; name: string }>;
}

export function BlogSearchAdvanced({
  posts,
  categories = [],
  tags = [],
  authors = [],
}: BlogSearchAdvancedProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    tags: [],
    author: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'relevance',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<BlogPost[]>(posts);
  const [isSearching, setIsSearching] = useState(false);

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce((searchFilters: SearchFilters) => {
      performSearch(searchFilters);
    }, 300),
    [posts]
  );

  // 执行搜索
  const performSearch = (searchFilters: SearchFilters) => {
    setIsSearching(true);

    let filtered = [...posts];

    // 文本搜索
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(query)) ||
          (post.content && post.content.toLowerCase().includes(query))
      );
    }

    // 分类筛选
    if (searchFilters.category) {
      filtered = filtered.filter(
        (post) => post.category?.slug === searchFilters.category
      );
    }

    // 标签筛选
    if (searchFilters.tags.length > 0) {
      filtered = filtered.filter((post) =>
        searchFilters.tags.some((tagSlug) =>
          post.tags.some((tag) => tag.slug === tagSlug)
        )
      );
    }

    // 作者筛选
    if (searchFilters.author) {
      filtered = filtered.filter(
        (post) => post.author?.id.toString() === searchFilters.author
      );
    }

    // 日期筛选
    if (searchFilters.dateFrom) {
      filtered = filtered.filter(
        (post) => new Date(post.date) >= new Date(searchFilters.dateFrom)
      );
    }

    if (searchFilters.dateTo) {
      filtered = filtered.filter(
        (post) => new Date(post.date) <= new Date(searchFilters.dateTo)
      );
    }

    // 排序
    switch (searchFilters.sortBy) {
      case 'date':
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case 'popularity':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'relevance':
      default:
        // 保持原顺序或按相关性排序
        break;
    }

    setResults(filtered);
    setIsSearching(false);
  };

  // 监听筛选条件变化
  useEffect(() => {
    debouncedSearch(filters);
  }, [filters, debouncedSearch]);

  // 更新筛选条件
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 清除所有筛选
  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      tags: [],
      author: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'relevance',
    });
  };

  // 切换标签选择
  const toggleTag = (tagSlug: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagSlug)
        ? prev.tags.filter((t) => t !== tagSlug)
        : [...prev.tags, tagSlug],
    }));
  };

  return (
    <div className="min-h-screen bg-cyber-dark text-white">
      {/* Search Header */}
      <div className="sticky top-0 z-40 border-b border-cyber-border/50 bg-cyber-dark/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              placeholder="搜索文章标题、内容..."
              className="w-full pl-12 pr-12 py-4 bg-cyber-dark border border-cyber-border rounded-xl text-white placeholder-gray-500 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
            />
            {filters.query && (
              <button
                onClick={() => updateFilter('query', '')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              筛选选项
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Results Count */}
            <div className="text-sm text-gray-400">
              {isSearching ? (
                <span>搜索中...</span>
              ) : (
                <span>
                  找到 <span className="text-cyber-cyan font-semibold">{results.length}</span> 篇文章
                </span>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pb-6 border-b border-cyber-border">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      分类
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => updateFilter('category', e.target.value)}
                      className="w-full px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none"
                    >
                      <option value="">全部分类</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Author Filter */}
                  {authors.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        作者
                      </label>
                      <select
                        value={filters.author}
                        onChange={(e) => updateFilter('author', e.target.value)}
                        className="w-full px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none"
                      >
                        <option value="">全部作者</option>
                        {authors.map((author) => (
                          <option key={author.id} value={author.id.toString()}>
                            {author.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      日期范围
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => updateFilter('dateFrom', e.target.value)}
                        className="flex-1 px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white text-sm focus:border-cyber-cyan focus:outline-none"
                      />
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => updateFilter('dateTo', e.target.value)}
                        className="flex-1 px-3 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white text-sm focus:border-cyber-cyan focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      排序方式
                    </label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        updateFilter('sortBy', e.target.value as any)
                      }
                      className="w-full px-4 py-2 bg-cyber-dark border border-cyber-border rounded-lg text-white focus:border-cyber-cyan focus:outline-none"
                    >
                      <option value="relevance">相关性</option>
                      <option value="date">最新发布</option>
                      <option value="popularity">最受欢迎</option>
                    </select>
                  </div>
                </div>

                {/* Tags Filter */}
                {tags.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-400 mb-3">
                      <Tag className="inline w-4 h-4 mr-1" />
                      标签
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {tags.slice(0, 20).map((tag) => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.slug)}
                          className={`
                            px-3 py-1 rounded-full text-sm transition-colors
                            ${
                              filters.tags.includes(tag.slug)
                                ? 'bg-cyber-cyan text-cyber-dark font-medium'
                                : 'bg-cyber-dark border border-cyber-border text-gray-400 hover:border-cyber-cyan'
                            }
                          `}
                        >
                          #{tag.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clear Filters Button */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    清除所有筛选
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {results.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              没有找到相关文章
            </h3>
            <p className="text-gray-400 mb-6">
              尝试调整搜索关键词或筛选条件
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-cyber-cyan text-cyber-dark rounded-lg font-medium hover:bg-cyber-cyan/80 transition-colors"
            >
              清除筛选条件
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <BlogCardAdaptive post={post} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
