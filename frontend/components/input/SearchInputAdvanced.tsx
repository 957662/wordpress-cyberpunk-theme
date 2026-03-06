'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Search, X, Clock, TrendingUp } from 'lucide-react';

export interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'history' | 'trending' | 'suggestion';
}

interface SearchInputAdvancedProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  className?: string;
  showHistory?: boolean;
  showTrending?: boolean;
  recentSearches?: string[];
  clearable?: boolean;
  debounceMs?: number;
}

/**
 * SearchInputAdvanced - 高级搜索输入组件
 * 带有搜索建议、历史记录等功能
 */
export const SearchInputAdvanced: React.FC<SearchInputAdvancedProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = '搜索...',
  suggestions = [],
  className,
  showHistory = true,
  showTrending = true,
  recentSearches = [],
  clearable = true,
  debounceMs = 300,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
    setIsFocused(false);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    onSearch(suggestion.text);
    setIsFocused(false);
  };

  const hasSuggestions = suggestions.length > 0 || recentSearches.length > 0;

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-10 pr-10 py-2.5',
              'bg-gray-900 border border-gray-800 rounded-lg',
              'text-gray-100 placeholder-gray-500',
              'focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500',
              'transition-all'
            )}
          />

          {clearable && value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {isFocused && hasSuggestions && (
        <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
          {recentSearches.length > 0 && showHistory && (
            <div className="p-2">
              <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                <span>历史搜索</span>
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick({
                    id: `history-${index}`,
                    text: search,
                    type: 'history',
                  })}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors flex items-center space-x-2"
                >
                  <Clock className="w-3 h-3 text-gray-600" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="p-2 border-t border-gray-800">
              <div className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">
                <TrendingUp className="w-3 h-3" />
                <span>搜索建议</span>
              </div>
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors flex items-center space-x-2"
                >
                  <Search className="w-3 h-3 text-gray-600" />
                  <span>{suggestion.text}</span>
                </button>
              ))}
            </div>
          )}

          <div className="p-2 border-t border-gray-800 bg-gray-900/50">
            <p className="text-xs text-gray-600 px-3">
              按 Enter 搜索，ESC 关闭
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInputAdvanced;
