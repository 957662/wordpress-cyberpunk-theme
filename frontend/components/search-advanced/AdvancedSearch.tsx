'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Filter,
  SlidersHorizontal,
  Calendar,
  Tag,
  User,
  FileText,
  ChevronDown,
  Check,
  Star,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';

export interface SearchFilter {
  query: string;
  type?: string;
  category?: string;
  tags?: string[];
  author?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'relevance' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilter) => void;
  placeholder?: string;
  suggestions?: string[];
  filters?: {
    types?: string[];
    categories?: string[];
    tags?: string[];
    authors?: string[];
  };
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  placeholder = '搜索文章、标签、作者...',
  suggestions = [],
  filters,
  className = '',
  variant = 'default'
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SearchFilter>({ query: '' });
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    const filters: SearchFilter = {
      ...selectedFilters,
      query: query.trim()
    };
    onSearch(filters);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && suggestions[activeSuggestionIndex]) {
        setQuery(suggestions[activeSuggestionIndex]);
      }
      handleSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedFilters({ query: '' });
    inputRef.current?.focus();
  };

  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-10 py-3 bg-dark-bg/50 border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50 transition-colors"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={searchRef} className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-4 bg-dark-bg/50 border border-cyber-cyan/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyber-cyan/50 transition-colors"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearSearch}
              className="p-2 hover:bg-dark-bg/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`
              p-2 rounded-lg transition-colors flex items-center gap-2
              ${showFilters ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'hover:bg-dark-bg/50 text-gray-500'}
            `}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="text-sm">筛选</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="px-6 py-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple rounded-lg text-white font-medium hover:shadow-neon-cyan transition-all duration-300"
          >
            搜索
          </motion.button>
        </div>

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-dark-bg border border-cyber-cyan/30 rounded-xl overflow-hidden shadow-neon-cyan z-50"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(suggestion);
                    handleSearch();
                  }}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-dark-bg/50 transition-colors flex items-center gap-3
                    ${index === activeSuggestionIndex ? 'bg-cyber-cyan/10' : ''}
                  `}
                >
                  <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span className="text-gray-300">{suggestion}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-6 bg-dark-bg/30 border border-dark-border rounded-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              {filters?.types && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">类型</label>
                  <select
                    value={selectedFilters.type || ''}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, type: e.target.value || undefined })}
                    className="w-full px-4 py-2 bg-dark-bg/50 border border-dark-border rounded-lg text-white focus:outline-none focus:border-cyber-cyan/50"
                  >
                    <option value="">全部</option>
                    {filters.types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category Filter */}
              {filters?.categories && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">分类</label>
                  <select
                    value={selectedFilters.category || ''}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, category: e.target.value || undefined })}
                    className="w-full px-4 py-2 bg-dark-bg/50 border border-dark-border rounded-lg text-white focus:outline-none focus:border-cyber-cyan/50"
                  >
                    <option value="">全部</option>
                    {filters.categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Author Filter */}
              {filters?.authors && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">作者</label>
                  <select
                    value={selectedFilters.author || ''}
                    onChange={(e) => setSelectedFilters({ ...selectedFilters, author: e.target.value || undefined })}
                    className="w-full px-4 py-2 bg-dark-bg/50 border border-dark-border rounded-lg text-white focus:outline-none focus:border-cyber-cyan/50"
                  >
                    <option value="">全部</option>
                    {filters.authors.map(author => (
                      <option key={author} value={author}>{author}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">排序</label>
                <select
                  value={selectedFilters.sortBy || 'relevance'}
                  onChange={(e) => setSelectedFilters({ ...selectedFilters, sortBy: e.target.value as any })}
                  className="w-full px-4 py-2 bg-dark-bg/50 border border-dark-border rounded-lg text-white focus:outline-none focus:border-cyber-cyan/50"
                >
                  <option value="relevance">相关度</option>
                  <option value="date">发布日期</option>
                  <option value="popularity">热度</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedFilters.type || selectedFilters.category || selectedFilters.author) && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                <div className="flex flex-wrap gap-2">
                  {selectedFilters.type && (
                    <FilterChip
                      label={`类型: ${selectedFilters.type}`}
                      onRemove={() => setSelectedFilters({ ...selectedFilters, type: undefined })}
                    />
                  )}
                  {selectedFilters.category && (
                    <FilterChip
                      label={`分类: ${selectedFilters.category}`}
                      onRemove={() => setSelectedFilters({ ...selectedFilters, category: undefined })}
                    />
                  )}
                  {selectedFilters.author && (
                    <FilterChip
                      label={`作者: ${selectedFilters.author}`}
                      onRemove={() => setSelectedFilters({ ...selectedFilters, author: undefined })}
                    />
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Filter Chip Component
interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0 }}
    className="flex items-center gap-2 px-3 py-1.5 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg"
  >
    <span className="text-sm text-cyber-cyan">{label}</span>
    <button
      onClick={onRemove}
      className="p-0.5 hover:bg-cyber-cyan/20 rounded transition-colors"
    >
      <X className="w-3 h-3 text-cyber-cyan" />
    </button>
  </motion.div>
);

// Quick Search Tags
interface QuickSearchTagsProps {
  tags: string[];
  onSelect: (tag: string) => void;
  className?: string;
}

export const QuickSearchTags: React.FC<QuickSearchTagsProps> = ({
  tags,
  onSelect,
  className = ''
}) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {tags.map((tag, index) => (
      <motion.button
        key={tag}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => onSelect(tag)}
        className="px-4 py-2 bg-dark-bg/50 border border-dark-border rounded-lg text-gray-400 hover:border-cyber-cyan/50 hover:text-white transition-all duration-300"
      >
        <Tag className="w-3 h-3 inline mr-2" />
        {tag}
      </motion.button>
    ))}
  </div>
);

// Search Results Info
interface SearchResultsInfoProps {
  query: string;
  totalResults: number;
  currentPage: number;
  resultsPerPage: number;
  timeTaken?: number;
  className?: string;
}

export const SearchResultsInfo: React.FC<SearchResultsInfoProps> = ({
  query,
  totalResults,
  currentPage,
  resultsPerPage,
  timeTaken,
  className = ''
}) => {
  const startResult = (currentPage - 1) * resultsPerPage + 1;
  const endResult = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dark-border ${className}`}>
      <div>
        <h2 className="text-xl font-bold text-white mb-1">
          "{query}" 的搜索结果
        </h2>
        <p className="text-sm text-gray-500">
          显示 {startResult} - {endResult} 条，共 {totalResults} 条
          {timeTaken && <span className="ml-2">({timeTaken.toFixed(2)}秒)</span>}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button className="px-4 py-2 bg-dark-bg/50 border border-dark-border rounded-lg text-gray-400 hover:border-cyber-cyan/50 hover:text-white transition-all duration-300 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span>相关度</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="p-2 bg-dark-bg/50 border border-dark-border rounded-lg text-gray-400 hover:border-cyber-cyan/50 hover:text-white transition-colors">
          <Clock className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AdvancedSearch;
