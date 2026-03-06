/**
 * BlogSearchBarEnhanced - 增强版博客搜索栏
 * 支持实时搜索、建议和历史记录
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BlogSearchBarEnhancedProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  showSuggestions?: boolean;
  showHistory?: boolean;
  debounceDelay?: number;
  className?: string;
}

export function BlogSearchBarEnhanced({
  onSearch,
  placeholder = '搜索文章...',
  showSuggestions = true,
  showHistory = true,
  debounceDelay = 300,
  className,
}: BlogSearchBarEnhancedProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // 加载搜索历史
  useEffect(() => {
    if (showHistory) {
      const savedHistory = localStorage.getItem('searchHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, [showHistory]);

  // 保存搜索历史
  const saveToHistory = (searchQuery: string) => {
    if (!showHistory) return;

    const newHistory = [searchQuery, ...history.filter(h => h !== searchQuery)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // 防抖搜索
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length >= 2) {
      setIsSearching(true);
      debounceRef.current = setTimeout(() => {
        onSearch?.(query);
        setIsSearching(false);
        // 这里可以添加获取建议的逻辑
        if (showSuggestions) {
          // 模拟建议
          setSuggestions([
            `${query} 教程`,
            `${query} 指南`,
            `${query} 最佳实践`,
          ]);
        }
      }, debounceDelay);
    } else {
      setIsSearching(false);
      setSuggestions([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, debounceDelay, onSearch, showSuggestions]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowDropdown(false);
    saveToHistory(searchQuery);
    onSearch?.(searchQuery);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    onSearch?.('');
  };

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <motion.div
          className={cn(
            'relative flex items-center',
            'bg-cyber-dark/80 border-2 rounded-lg',
            'transition-all duration-300',
            showDropdown
              ? 'border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)]'
              : 'border-cyber-cyan/30 hover:border-cyber-cyan/50'
          )}
        >
          {/* 搜索图标 */}
          <div className="absolute left-4 flex items-center pointer-events-none">
            {isSearching ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-cyber-cyan border-t-transparent rounded-full"
              />
            ) : (
              <svg
                className="w-5 h-5 text-cyber-cyan/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {/* 输入框 */}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => {
              if (query || history.length > 0) {
                setShowDropdown(true);
              }
            }}
            placeholder={placeholder}
            className={cn(
              'w-full px-12 py-3 bg-transparent',
              'text-white placeholder:text-cyber-muted/50',
              'focus:outline-none'
            )}
          />

          {/* 清除按钮 */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clearSearch}
                className="absolute right-4 p-1 text-cyber-muted/60 hover:text-cyber-cyan transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 下拉建议框 */}
        <AnimatePresence>
          {showDropdown && (query || history.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                'absolute top-full left-0 right-0 mt-2',
                'bg-cyber-dark/95 border border-cyber-cyan/30',
                'rounded-lg overflow-hidden',
                'backdrop-blur-sm shadow-xl',
                'z-50'
              )}
            >
              {/* 搜索历史 */}
              {!query && history.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-cyber-muted/50 font-medium">
                    最近搜索
                  </div>
                  {history.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(item)}
                      className={cn(
                        'w-full px-3 py-2 text-left',
                        'text-cyber-muted/70 hover:text-white',
                        'hover:bg-cyber-cyan/10',
                        'rounded transition-colors flex items-center gap-2'
                      )}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {item}
                    </button>
                  ))}
                </div>
              )}

              {/* 搜索建议 */}
              {query && suggestions.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs text-cyber-muted/50 font-medium">
                    搜索建议
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className={cn(
                        'w-full px-3 py-2 text-left',
                        'text-cyber-muted/70 hover:text-white',
                        'hover:bg-cyber-cyan/10',
                        'rounded transition-colors flex items-center gap-2'
                      )}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 快捷键提示 */}
              <div className="px-3 py-2 border-t border-cyber-cyan/20">
                <div className="flex items-center justify-between text-xs text-cyber-muted/40">
                  <span>按 Enter 搜索</span>
                  <div className="flex gap-1">
                    <kbd className="px-1.5 py-0.5 bg-cyber-dark/50 rounded text-cyber-muted/60">ESC</kbd>
                    <span>关闭</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default BlogSearchBarEnhanced;
