/**
 * EnhancedSearch - 增强型搜索组件
 * 支持实时搜索建议、热门搜索、搜索历史
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CyberInput } from '@/components/ui';
import { CyberTag } from '@/components/ui';

export interface SearchSuggestion {
  id: string;
  title: string;
  type: 'post' | 'category' | 'tag' | 'author';
  url: string;
}

export interface EnhancedSearchProps {
  onSearch?: (query: string) => void;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  hotSearches?: string[];
  placeholder?: string;
  className?: string;
}

export const EnhancedSearch = ({
  onSearch,
  suggestions = [],
  recentSearches = [],
  hotSearches = [],
  placeholder = '搜索文章、标签、作者...',
  className,
}: EnhancedSearchProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // 过滤建议
  useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [query, suggestions]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery);
      setIsOpen(false);
      setQuery(searchQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setFilteredSuggestions([]);
  };

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-10 py-3',
            'bg-cyber-dark/80 border border-cyber-border rounded-lg',
            'text-white placeholder-gray-500',
            'focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/20',
            'transition-all duration-200'
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
      </div>

      {/* 搜索建议下拉框 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-cyber-dark/95 backdrop-blur-xl border border-cyber-border rounded-lg shadow-2xl overflow-hidden"
          >
            {/* 搜索建议 */}
            {query && filteredSuggestions.length > 0 && (
              <div className="p-2 border-b border-cyber-border">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  搜索建议
                </div>
                {filteredSuggestions.map((suggestion) => (
                  <a
                    key={suggestion.id}
                    href={suggestion.url}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors group"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-cyber-cyan" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-white truncate">
                        {suggestion.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {suggestion.type === 'post' && '文章'}
                        {suggestion.type === 'category' && '分类'}
                        {suggestion.type === 'tag' && '标签'}
                        {suggestion.type === 'author' && '作者'}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* 热门搜索 */}
            {!query && hotSearches.length > 0 && (
              <div className="p-4 border-b border-cyber-border">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-cyber-pink" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    热门搜索
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hotSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(item)}
                      className="text-sm"
                    >
                      <CyberTag variant="outline" color="pink" size="sm">
                        {item}
                      </CyberTag>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 搜索历史 */}
            {!query && recentSearches.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-cyber-cyan" />
                  <span className="text-xs font-semibold text-gray-500 uppercase">
                    搜索历史
                  </span>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(item)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-cyber-cyan/10 rounded-lg transition-colors text-left"
                    >
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-300">{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 无结果 */}
            {query && filteredSuggestions.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">没有找到相关结果</p>
                <button
                  onClick={() => handleSearch(query)}
                  className="mt-3 text-sm text-cyber-cyan hover:underline"
                >
                  搜索 "{query}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearch;
