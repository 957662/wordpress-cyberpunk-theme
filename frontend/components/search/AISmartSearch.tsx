'use client';

/**
 * AISmartSearch - AI驱动的智能搜索组件
 * 支持自然语言搜索、自动补全、智能建议
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Clock, TrendingUp, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  category?: string;
  relevance: number;
  timestamp?: Date;
}

interface SearchSuggestion {
  text: string;
  type: 'history' | 'trending' | 'ai';
  metadata?: Record<string, any>;
}

interface AISmartSearchProps {
  onSearch: (query: string, filters?: SearchFilters) => Promise<SearchResult[]>;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
  showFilters?: boolean;
  showHistory?: boolean;
  showTrending?: boolean;
  debounceMs?: number;
}

interface SearchFilters {
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'relevance' | 'date' | 'popularity';
}

// ============================================
// Sub-components
// ============================================

const SearchInput: React.FC<{
  query: string;
  setQuery: (query: string) => void;
  onFocus: () => void;
  placeholder: string;
  isLoading: boolean;
}> = ({ query, setQuery, onFocus, placeholder, isLoading }) => {
  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyber-cyan" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-cyber-cyan/30 bg-cyber-dark/50 py-4 pl-12 pr-12 text-white placeholder:text-cyber-gray/50 focus:border-cyber-cyan focus:outline-none focus:ring-2 focus:ring-cyber-cyan/20"
      />
      {query && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={() => setQuery('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-gray transition-colors hover:text-cyber-white"
        >
          <X className="h-5 w-5" />
        </motion.button>
      )}
      {isLoading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <Sparkles className="h-5 w-5 text-cyber-purple" />
        </motion.div>
      )}
    </div>
  );
};

const SearchSuggestions: React.FC<{
  suggestions: SearchSuggestion[];
  query: string;
  onSelect: (suggestion: SearchSuggestion) => void;
  isVisible: boolean;
}> = ({ suggestions, query, onSelect, isVisible }) => {
  if (!isVisible || suggestions.length === 0) return null;

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="rounded bg-cyber-cyan/20 px-1 text-cyber-cyan">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'history':
        return <Clock className="h-4 w-4 text-cyber-gray" />;
      case 'trending':
        return <TrendingUp className="h-4 w-4 text-cyber-pink" />;
      case 'ai':
        return <Sparkles className="h-4 w-4 text-cyber-purple" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 mt-2 w-full rounded-xl border border-cyber-cyan/30 bg-cyber-dark/95 p-2 shadow-2xl backdrop-blur-sm"
        >
          <div className="max-h-[400px] overflow-auto">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                onClick={() => onSelect(suggestion)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors"
              >
                {getSuggestionIcon(suggestion.type)}
                <span className="flex-1 text-sm text-cyber-white">
                  {highlightMatch(suggestion.text, query)}
                </span>
                {suggestion.metadata?.count && (
                  <span className="text-xs text-cyber-gray">
                    {suggestion.metadata.count} results
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FilterPanel: React.FC<{
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  isVisible: boolean;
}> = ({ filters, setFilters, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-4 rounded-lg border border-cyber-purple/30 bg-cyber-purple/5 p-4"
    >
      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-cyber-purple">
        <Filter className="h-4 w-4" />
        Filters
      </h4>

      <div className="space-y-4">
        {/* 类别筛选 */}
        <div>
          <label className="mb-2 block text-xs font-medium text-cyber-gray">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value || undefined })
            }
            className="w-full rounded-lg border border-cyber-purple/30 bg-cyber-dark/50 px-3 py-2 text-sm text-white focus:border-cyber-purple focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="blog">Blog</option>
            <option value="portfolio">Portfolio</option>
            <option value="docs">Documentation</option>
            <option value="community">Community</option>
          </select>
        </div>

        {/* 排序方式 */}
        <div>
          <label className="mb-2 block text-xs font-medium text-cyber-gray">
            Sort By
          </label>
          <div className="flex gap-2">
            {(['relevance', 'date', 'popularity'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setFilters({ ...filters, sortBy: option })}
                className={cn(
                  'flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-colors',
                  filters.sortBy === option
                    ? 'border-cyber-purple bg-cyber-purple/20 text-cyber-purple'
                    : 'border-cyber-gray/30 bg-cyber-dark/30 text-cyber-gray hover:bg-cyber-gray/20'
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SearchResults: React.FC<{
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}> = ({ results, isLoading, query }) => {
  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="h-32 rounded-lg border border-cyber-cyan/20 bg-cyber-dark/30"
          />
        ))}
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-12 text-center"
      >
        <Search className="mx-auto mb-4 h-16 w-16 text-cyber-gray" />
        <h3 className="text-xl font-bold text-cyber-white">No results found</h3>
        <p className="mt-2 text-sm text-cyber-gray">
          Try different keywords or remove filters
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 py-8">
      <AnimatePresence>
        {results.map((result, index) => (
          <motion.a
            key={result.id}
            href={result.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
            className="block rounded-lg border border-cyber-cyan/20 bg-cyber-dark/30 p-6 transition-all hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-cyber-white">{result.title}</h3>
                <p className="mt-2 text-sm text-cyber-gray">{result.description}</p>

                <div className="mt-3 flex items-center gap-4 text-xs">
                  {result.category && (
                    <span className="rounded-full bg-cyber-purple/10 px-2 py-1 text-cyber-purple">
                      {result.category}
                    </span>
                  )}
                  {result.timestamp && (
                    <span className="text-cyber-gray">
                      {result.timestamp.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-4 flex items-center gap-2">
                <div className="rounded-lg bg-cyber-cyan/10 px-3 py-1 text-xs font-bold text-cyber-cyan">
                  {Math.round(result.relevance * 100)}%
                </div>
              </div>
            </div>
          </motion.a>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// Main Component
// ============================================

export const AISmartSearch: React.FC<AISmartSearchProps> = ({
  onSearch,
  onSuggestionClick,
  placeholder = 'Search anything... Use natural language',
  className,
  showFilters = true,
  showHistory = true,
  showTrending = true,
  debounceMs = 300,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // 模拟建议生成
  const generateSuggestions = useCallback(
    (inputQuery: string) => {
      if (!inputQuery) {
        const allSuggestions: SearchSuggestion[] = [];

        if (showHistory) {
          searchHistory.slice(0, 3).forEach((item) => {
            allSuggestions.push({ text: item, type: 'history' });
          });
        }

        if (showTrending) {
          allSuggestions.push(
            { text: 'How to get started', type: 'trending', metadata: { count: 1234 } },
            { text: 'API documentation', type: 'trending', metadata: { count: 856 } },
            { text: 'Best practices', type: 'trending', metadata: { count: 642 } }
          );
        }

        return allSuggestions;
      }

      const aiSuggestions: SearchSuggestion[] = [
        { text: `${inputQuery} tutorial`, type: 'ai' },
        { text: `${inputQuery} examples`, type: 'ai' },
        { text: `Best ${inputQuery} practices`, type: 'ai' },
        { text: `${inputQuery} documentation`, type: 'ai' },
      ];

      return aiSuggestions;
    },
    [showHistory, showTrending, searchHistory]
  );

  // 执行搜索
  const performSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await onSearch(query, filters);
      setResults(searchResults);

      // 保存到历史记录
      setSearchHistory((prev) => {
        const newHistory = [query, ...prev.filter((q) => q !== query)];
        return newHistory.slice(0, 10);
      });
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, onSearch]);

  // 防抖搜索
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (query) {
        performSearch();
        setShowSuggestions(false);
      }
    }, debounceMs);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, debounceMs, performSearch]);

  // 更新建议
  useEffect(() => {
    setSuggestions(generateSuggestions(query));
  }, [query, generateSuggestions]);

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSuggestionClick?.(suggestion);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* 搜索输入 */}
      <div>
        <SearchInput
          query={query}
          setQuery={setQuery}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          isLoading={isLoading}
        />

        {/* 筛选按钮 */}
        {showFilters && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="mt-3 flex items-center gap-2 text-sm text-cyber-gray transition-colors hover:text-cyber-white"
          >
            <Filter className="h-4 w-4" />
            {showFilterPanel ? 'Hide' : 'Show'} Filters
          </motion.button>
        )}
      </div>

      {/* 搜索建议 */}
      <SearchSuggestions
        suggestions={suggestions}
        query={query}
        onSelect={handleSuggestionSelect}
        isVisible={showSuggestions}
      />

      {/* 筛选面板 */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          isVisible={showFilterPanel}
        />
      )}

      {/* 搜索结果 */}
      <SearchResults results={results} isLoading={isLoading} query={query} />

      {/* 结果统计 */}
      {results.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-4 text-center text-sm text-cyber-gray"
        >
          Found {results.length} results for "{query}"
        </motion.div>
      )}
    </div>
  );
};

export default AISmartSearch;
