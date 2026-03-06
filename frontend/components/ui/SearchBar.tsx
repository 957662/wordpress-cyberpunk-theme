'use client';

import React, { useState, useCallback } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchResult {
  id: string | number;
  title: string;
  excerpt?: string;
  type: 'post' | 'page' | 'category' | 'tag';
  url: string;
}

interface SearchBarProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  placeholder?: string;
  className?: string;
  onSelectResult?: (result: SearchResult) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = '搜索文章、页面...',
  className,
  onSelectResult,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await onSearch(searchQuery);
      setResults(searchResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [onSearch]);

  React.useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    onSelectResult?.(result);
    // Navigate to result URL
    window.location.href = result.url;
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-3',
            'rounded-lg',
            'border border-cyber-cyan/20',
            'bg-cyber-dark/80 backdrop-blur-sm',
            'text-white placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-cyber-cyan/50',
            'transition-all duration-200',
            'hover:border-cyber-cyan/30'
          )}
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute inset-y-0 right-10 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-cyber-cyan animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2',
            'rounded-lg',
            'border border-cyber-cyan/20',
            'bg-cyber-dark/95 backdrop-blur-sm',
            'shadow-lg shadow-cyber-cyan/10',
            'max-h-96 overflow-y-auto'
          )}
        >
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className={cn(
                'w-full px-4 py-3 text-left',
                'flex items-start gap-3',
                'border-b border-cyber-cyan/10 last:border-b-0',
                'transition-colors duration-200',
                index === selectedIndex
                  ? 'bg-cyber-cyan/10'
                  : 'hover:bg-cyber-cyan/5'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      'bg-cyber-cyan/10 text-cyber-cyan',
                      'uppercase font-medium'
                    )}
                  >
                    {result.type}
                  </span>
                  <h4 className="font-medium text-white truncate">
                    {result.title}
                  </h4>
                </div>
                {result.excerpt && (
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {result.excerpt}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && !isLoading && results.length === 0 && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2',
            'rounded-lg',
            'border border-cyber-cyan/20',
            'bg-cyber-dark/95 backdrop-blur-sm',
            'p-4 text-center text-gray-400'
          )}
        >
          没有找到相关结果
        </div>
      )}
    </div>
  );
};

export default SearchBar;
