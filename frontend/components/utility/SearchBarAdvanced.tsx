'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Search, X, Filter, Clock, TrendingUp } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'history' | 'trending' | 'suggestion';
}

interface SearchBarAdvancedProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  showFilters?: boolean;
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  onFilterChange?: (filters: Record<string, string>) => void;
  className?: string;
  debounceMs?: number;
}

export const SearchBarAdvanced: React.FC<SearchBarAdvancedProps> = ({
  onSearch,
  placeholder = '搜索...',
  suggestions = [],
  recentSearches = [],
  showFilters = false,
  filters = [],
  onFilterChange,
  className,
  debounceMs = 300
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 防抖搜索
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearch(value);
        }, debounceMs);
      };
    })(),
    [onSearch, debounceMs]
  );

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length > 0);
    debouncedSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    onSearch('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);
    onSearch(suggestion.text);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowFilterPanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤建议
  const filteredSuggestions = suggestions.filter(s =>
    s.text.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* 搜索输入框 */}
      <div className="relative flex items-center gap-2">
        {/* 搜索图标 */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          <Search className="w-5 h-5 text-gray-500" />
        </div>

        {/* 输入框 */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(query.length > 0)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-20 py-3 bg-cyber-dark/50',
            'border border-cyber-cyan/30 rounded-lg',
            'text-white placeholder-gray-500',
            'focus:outline-none focus:border-cyber-cyan',
            'transition-colors duration-200'
          )}
        />

        {/* 清除按钮 */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* 筛选按钮 */}
        {showFilters && filters.length > 0 && (
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded',
              'transition-colors',
              showFilterPanel || Object.keys(selectedFilters).length > 0
                ? 'bg-cyber-cyan/20 text-cyber-cyan'
                : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <Filter className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 筛选面板 */}
      <AnimatePresence>
        {showFilterPanel && filters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-4 bg-cyber-dark/90 border border-cyber-cyan/30 rounded-lg backdrop-blur-sm z-20"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map(filter => (
                <div key={filter.key}>
                  <label className="block text-sm text-gray-400 mb-2">
                    {filter.label}
                  </label>
                  <select
                    value={selectedFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className={cn(
                      'w-full px-3 py-2 bg-cyber-dark/50',
                      'border border-cyber-cyan/30 rounded',
                      'text-white text-sm',
                      'focus:outline-none focus:border-cyber-cyan'
                    )}
                  >
                    <option value="">全部</option>
                    {filter.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 搜索建议 */}
      <AnimatePresence>
        {isOpen && (filteredSuggestions.length > 0 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-cyber-dark/90 border border-cyber-cyan/30 rounded-lg backdrop-blur-sm overflow-hidden z-20"
          >
            {/* 历史搜索 */}
            {recentSearches.length > 0 && query.length === 0 && (
              <div className="p-2 border-b border-gray-800">
                <div className="px-3 py-2 text-xs text-gray-500 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  历史搜索
                </div>
                {recentSearches.slice(0, 5).map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick({ id: String(index), text: search, type: 'history' })}
                    className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-cyber-cyan/10 rounded transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}

            {/* 搜索建议 */}
            {filteredSuggestions.length > 0 && (
              <div className="p-2">
                {filteredSuggestions.slice(0, 8).map(suggestion => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:text-white hover:bg-cyber-cyan/10 rounded transition-colors flex items-center gap-2"
                  >
                    {suggestion.type === 'trending' && <TrendingUp className="w-3 h-3 text-cyber-cyan" />}
                    {suggestion.type === 'history' && <Clock className="w-3 h-3 text-gray-500" />}
                    <span>{suggestion.text}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 活跃筛选标签 */}
      {Object.keys(selectedFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(selectedFilters).map(([key, value]) => {
            const filter = filters.find(f => f.key === key);
            const option = filter?.options.find(o => o.value === value);
            return option ? (
              <button
                key={key}
                onClick={() => handleFilterChange(key, '')}
                className={cn(
                  'px-3 py-1 text-sm rounded-full border',
                  'bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan',
                  'hover:bg-cyber-cyan/20 transition-colors',
                  'flex items-center gap-2'
                )}
              >
                <span>{filter?.label}: {option.label}</span>
                <X className="w-3 h-3" />
              </button>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

// 快速搜索框（简化版）
export const QuickSearch: React.FC<{
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ onSearch, placeholder = '搜索...', className }) => {
  const [query, setQuery] = useState('');

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onSearch(e.target.value);
        }}
        placeholder={placeholder}
        className={cn(
          'w-full pl-10 pr-4 py-2 bg-cyber-dark/50',
          'border border-cyber-cyan/30 rounded-lg',
          'text-white placeholder-gray-500',
          'focus:outline-none focus:border-cyber-cyan',
          'transition-colors'
        )}
      />
      {query && (
        <button
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBarAdvanced;
