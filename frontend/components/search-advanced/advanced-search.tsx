'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  Calendar,
  Tag,
  User,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type SearchCategory = 'all' | 'blog' | 'portfolio' | 'about';
export type SortOption = 'relevance' | 'date-desc' | 'date-asc' | 'title';

interface SearchFilters {
  category: SearchCategory;
  dateRange?: {
    from: Date;
    to: Date;
  };
  tags?: string[];
  author?: string;
  minReadTime?: number;
  maxReadTime?: number;
}

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  category: SearchCategory;
  author: string;
  date: Date;
  readTime: number;
  tags: string[];
  url: string;
}

interface AdvancedSearchProps {
  className?: string;
  onSearch?: (query: string, filters: SearchFilters) => Promise<SearchResult[]>;
  placeholder?: string;
  initialQuery?: string;
  suggestions?: string[];
}

const CATEGORIES = [
  { value: 'all' as const, label: '全部', icon: FileText },
  { value: 'blog' as const, label: '博客', icon: FileText },
  { value: 'portfolio' as const, label: '作品集', icon: FileText },
  { value: 'about' as const, label: '关于', icon: User }
];

const SORT_OPTIONS = [
  { value: 'relevance' as const, label: '相关性' },
  { value: 'date-desc' as const, label: '最新优先' },
  { value: 'date-asc' as const, label: '最早优先' },
  { value: 'title' as const, label: '标题' }
];

const POPULAR_TAGS = [
  'React', 'Next.js', 'TypeScript', 'Python', 'AI',
  'Web3', 'Design', 'Database', 'DevOps', 'Testing'
];

export function AdvancedSearch({
  className,
  onSearch,
  placeholder = '搜索文章、作品集、页面...',
  initialQuery = '',
  suggestions = []
}: AdvancedSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all'
  });
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (query.trim()) {
        setIsSearching(true);
        try {
          if (onSearch) {
            const searchResults = await onSearch(query, {
              ...filters,
              tags: selectedTags.length > 0 ? selectedTags : undefined
            });
            setResults(searchResults);
          } else {
            // 模拟搜索结果
            const mockResults: SearchResult[] = [
              {
                id: '1',
                title: `${query} - 相关文章`,
                excerpt: `这是关于 "${query}" 的搜索结果...`,
                category: 'blog',
                author: 'CyberPress',
                date: new Date(),
                readTime: 5,
                tags: ['React', 'Next.js'],
                url: '#'
              },
              {
                id: '2',
                title: `了解 ${query} 的最佳实践`,
                excerpt: `深入探讨 ${query} 的应用场景...`,
                category: 'portfolio',
                author: 'CyberPress',
                date: new Date(),
                readTime: 8,
                tags: ['Best Practices'],
                url: '#'
              }
            ];
            setResults(mockResults);
          }
        } catch (error) {
          console.error('搜索失败:', error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, filters, sortBy, selectedTags, onSearch]);

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setSelectedTags([]);
  };

  const handleSelectTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className={cn(
      'bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-500/30 overflow-hidden',
      'shadow-[0_0_40px_rgba(0,240,255,0.1)]',
      className
    )}>
      {/* Search Input */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-12 pr-24 py-4 bg-gray-900/50 border border-cyan-500/30 rounded-xl',
              'focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20',
              'text-white placeholder:text-gray-500',
              'transition-all duration-300'
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={handleClearSearch}
                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'p-2 rounded-lg transition-all',
                showFilters
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'hover:bg-gray-800 text-gray-400'
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && query && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-gray-900 border border-cyan-500/30 rounded-xl shadow-xl overflow-hidden"
            >
              {suggestions.slice(0, 5).map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                  onClick={() => {
                    setQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                  className="w-full px-4 py-3 text-left text-gray-300 hover:text-cyan-400 flex items-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedTags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-cyan-500/20 bg-gray-900/30"
          >
            <div className="p-6 space-y-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  分类
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <motion.button
                      key={category.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        setFilters({ ...filters, category: category.value })
                      }
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                        filters.category === category.value
                          ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                      )}
                    >
                      {category.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  热门标签
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_TAGS.map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectTag(tag)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm transition-all duration-300',
                        selectedTags.includes(tag)
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-transparent'
                      )}
                    >
                      #{tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  排序方式
                </label>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSortBy(option.value)}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                        sortBy === option.value
                          ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                      )}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="p-6">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mb-4"
            />
            <p className="text-gray-400">搜索中...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                找到 <span className="text-cyan-400 font-medium">{results.length}</span> 个结果
              </p>
            </div>
            {results.map((result) => (
              <motion.a
                key={result.id}
                href={result.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="block p-4 bg-gray-900/30 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 hover:bg-gray-900/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-2 hover:text-cyan-400 transition-colors">
                      {result.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                      {result.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="capitalize">{result.category}</span>
                      <span>•</span>
                      <span>{result.author}</span>
                      <span>•</span>
                      <span>{result.readTime} 分钟阅读</span>
                      <span>•</span>
                      <span>{result.date.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        ) : query ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <p className="text-gray-400 mb-2">没有找到相关结果</p>
            <p className="text-sm text-gray-500">尝试调整搜索词或筛选条件</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <p className="text-gray-400 mb-2">开始搜索</p>
            <p className="text-sm text-gray-500">输入关键词搜索文章、作品集等内容</p>
          </div>
        )}
      </div>
    </div>
  );
}
