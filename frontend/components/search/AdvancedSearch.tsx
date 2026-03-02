'use client';

/**
 * Advanced Search Component
 * 高级搜索组件 - 支持全文搜索、筛选、排序、保存搜索
 */

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Bookmark, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// ============================================
// 类型定义
// ============================================

export interface SearchFilters {
  category?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  author?: string;
  sortBy?: 'relevance' | 'date' | 'views' | 'likes';
  sortOrder?: 'asc' | 'desc';
}

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: SearchFilters;
  createdAt: Date;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'history' | 'popular' | 'related';
}

interface AdvancedSearchProps {
  className?: string;
  onSearch?: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
}

// ============================================
// Component
// ============================================

export const AdvancedSearch = ({
  className = '',
  onSearch,
  placeholder = 'Search articles, tags, authors...',
  showFilters = true,
}: AdvancedSearchProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'relevance',
    sortOrder: 'desc',
  });
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 获取历史搜索（从 localStorage）
  useEffect(() => {
    const history = localStorage.getItem('search-history');
    if (history) {
      const items: SearchSuggestion[] = JSON.parse(history).map((text: string, idx: number) => ({
        id: `hist-${idx}`,
        text,
        type: 'history' as const,
      }));
      setSuggestions(items);
    }

    const saved = localStorage.getItem('saved-searches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  // 执行搜索
  const performSearch = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    // 保存到历史记录
    const history = localStorage.getItem('search-history');
    const historyItems: string[] = history ? JSON.parse(history) : [];
    const newHistory = [searchQuery, ...historyItems.filter((q) => q !== searchQuery)].slice(0, 10);
    localStorage.setItem('search-history', JSON.stringify(newHistory));

    // 构建查询参数
    const params = new URLSearchParams();
    params.set('q', searchQuery);

    if (searchFilters.category) params.set('category', searchFilters.category);
    if (searchFilters.tags?.length) params.set('tags', searchFilters.tags.join(','));
    if (searchFilters.dateFrom) params.set('from', searchFilters.dateFrom);
    if (searchFilters.dateTo) params.set('to', searchFilters.dateTo);
    if (searchFilters.author) params.set('author', searchFilters.author);
    if (searchFilters.sortBy) params.set('sort', searchFilters.sortBy);
    if (searchFilters.sortOrder) params.set('order', searchFilters.sortOrder);

    // 路由跳转
    router.push(`/search?${params.toString()}`);

    // 回调
    if (onSearch) {
      onSearch(searchQuery, searchFilters);
    }

    setIsSearching(false);
    setShowSuggestions(false);
  }, [router, onSearch]);

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, filters);
  };

  // 保存搜索
  const saveSearch = () => {
    if (!query.trim()) return;

    const name = prompt('Name this search:');
    if (!name) return;

    const newSavedSearch: SavedSearch = {
      id: `saved-${Date.now()}`,
      name,
      query,
      filters,
      createdAt: new Date(),
    };

    const updated = [...savedSearches, newSavedSearch];
    setSavedSearches(updated);
    localStorage.setItem('saved-searches', JSON.stringify(updated));
  };

  // 加载保存的搜索
  const loadSavedSearch = (saved: SavedSearch) => {
    setQuery(saved.query);
    setFilters(saved.filters);
    performSearch(saved.query, saved.filters);
  };

  // 清除筛选
  const clearFilters = () => {
    setFilters({
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`w-5 h-5 ${isSearching ? 'animate-pulse text-cyan-400' : 'text-gray-400'}`} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(query.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className={`
              w-full pl-12 pr-24 py-4
              bg-gray-900/50 backdrop-blur-md
              border border-gray-700 rounded-lg
              text-white placeholder-gray-400
              focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20
              transition-all duration-200
            `}
          />

          {/* Action Buttons */}
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {showFilters && (
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`
                  p-2 rounded transition-colors
                  ${showAdvanced ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:text-white'}
                `}
                title="Advanced filters"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={saveSearch}
              className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
              title="Save search"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!query.trim() || isSearching}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-md font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl overflow-hidden"
          >
            {suggestions.slice(0, 5).map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => {
                  setQuery(suggestion.text);
                  performSearch(suggestion.text, filters);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors flex items-center gap-3"
              >
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">{suggestion.text}</span>
                <span className="ml-auto text-xs text-gray-500 capitalize">{suggestion.type}</span>
              </button>
            ))}
          </motion.div>
        )}
      </form>

      {/* Advanced Filters */}
      {showAdvanced && showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-4 p-6 bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="">All Categories</option>
                <option value="technology">Technology</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="tutorials">Tutorials</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="relevance">Relevance</option>
                <option value="date">Date</option>
                <option value="views">Views</option>
                <option value="likes">Likes</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">From</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">To</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear filters
            </button>

            <button
              type="submit"
              onClick={() => performSearch(query, filters)}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Saved Searches</h3>
          <div className="flex flex-wrap gap-2">
            {savedSearches.map((saved) => (
              <button
                key={saved.id}
                onClick={() => loadSavedSearch(saved)}
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-300 transition-colors"
              >
                {saved.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
