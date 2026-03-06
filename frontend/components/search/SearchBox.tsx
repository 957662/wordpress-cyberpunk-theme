'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  showSuggestions?: boolean;
}

interface Suggestion {
  type: 'post' | 'user' | 'tag';
  id: string | number;
  title: string;
  slug?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = '搜索文章、用户、标签...',
  onSearch,
  className,
  showSuggestions = true,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 获取搜索建议
  useEffect(() => {
    if (query.length >= 2 && showSuggestions) {
      fetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // 获取热门搜索和最近搜索
  useEffect(() => {
    if (isOpen && !query) {
      fetchTrendingAndRecent();
    }
  }, [isOpen, query]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (q: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/search/suggestions?q=${encodeURIComponent(q)}&limit=5`);
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTrendingAndRecent = async () => {
    // 获取热门搜索
    try {
      const response = await fetch('/api/v1/search/trending?limit=5');
      const data = await response.json();
      setTrending(data.trending || []);
    } catch (error) {
      console.error('Failed to fetch trending:', error);
    }

    // 获取最近搜索（从本地存储）
    const recentSearches = localStorage.getItem('recent_searches');
    if (recentSearches) {
      setRecent(JSON.parse(recentSearches));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    // 保存到最近搜索
    const updatedRecent = [finalQuery, ...recent.filter(r => r !== finalQuery)].slice(0, 5);
    setRecent(updatedRecent);
    localStorage.setItem('recent_searches', JSON.stringify(updatedRecent));

    // 执行搜索
    onSearch?.(finalQuery);
    setIsOpen(false);
    setQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const clearInput = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    handleSearch(suggestion.title);
  };

  return (
    <div className={cn('relative w-full', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-3 rounded-lg',
            'bg-black/60 border border-gray-700',
            'text-white placeholder-gray-500',
            'focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan',
            'transition-all',
            'backdrop-blur-sm'
          )}
        />
        {query && (
          <button
            onClick={clearInput}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
          </button>
        )}
      </div>

      {/* 下拉建议框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 w-full mt-2',
              'bg-black/95 border border-gray-700 rounded-lg',
              'shadow-2xl backdrop-blur-sm',
              'overflow-hidden'
            )}
          >
            {/* 搜索建议 */}
            {query && suggestions.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">
                  搜索建议
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}-${index}`}
                    onClick={() => selectSuggestion(suggestion)}
                    className={cn(
                      'w-full px-3 py-2 rounded-md',
                      'text-left flex items-center gap-3',
                      'hover:bg-cyber-cyan/10 transition-colors',
                      'group'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded flex items-center justify-center flex-shrink-0',
                      suggestion.type === 'post' && 'bg-cyber-cyan/20',
                      suggestion.type === 'user' && 'bg-cyber-purple/20',
                      suggestion.type === 'tag' && 'bg-cyber-yellow/20'
                    )}>
                      {suggestion.type === 'post' && (
                        <Search className="w-4 h-4 text-cyber-cyan" />
                      )}
                      {suggestion.type === 'user' && (
                        <div className="w-4 h-4 rounded-full bg-cyber-purple" />
                      )}
                      {suggestion.type === 'tag' && (
                        <span className="text-cyber-yellow text-sm">#</span>
                      )}
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {suggestion.title}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* 热门搜索 */}
            {!query && trending.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-3 h-3" />
                  热门搜索
                </div>
                {trending.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className={cn(
                      'w-full px-3 py-2 rounded-md',
                      'text-left hover:bg-cyber-cyan/10 transition-colors',
                      'text-gray-300 hover:text-white'
                    )}
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}

            {/* 最近搜索 */}
            {!query && recent.length > 0 && (
              <div className="p-2 border-t border-gray-800">
                <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  最近搜索
                </div>
                {recent.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className={cn(
                      'w-full px-3 py-2 rounded-md',
                      'text-left hover:bg-cyber-cyan/10 transition-colors',
                      'text-gray-300 hover:text-white'
                    )}
                  >
                    {term}
                  </button>
                ))}
                {recent.length > 0 && (
                  <button
                    onClick={() => {
                      setRecent([]);
                      localStorage.removeItem('recent_searches');
                    }}
                    className="w-full px-3 py-2 text-sm text-red-400 hover:text-red-300"
                  >
                    清除搜索历史
                  </button>
                )}
              </div>
            )}

            {/* 加载状态 */}
            {isLoading && (
              <div className="p-4 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* 空状态 */}
            {!isLoading && query && suggestions.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                没有找到相关建议
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBox;
