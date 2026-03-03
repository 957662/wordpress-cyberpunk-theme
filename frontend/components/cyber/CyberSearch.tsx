/**
 * CyberSearch - 增强的全局搜索组件
 * 支持实时搜索、搜索建议、历史记录、键盘导航
 *
 * @version 1.0.0
 * @author CyberPress Team
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  FileText,
  User,
  Tag,
  ChevronRight,
  Command,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

// =====================================================
// 类型定义
// =====================================================

export interface SearchSuggestion {
  id: string;
  type: 'query' | 'post' | 'page' | 'user' | 'tag';
  title: string;
  url?: string;
  subtitle?: string;
  icon?: React.ElementType;
}

export interface SearchResult {
  id: string;
  type: 'post' | 'page' | 'user' | 'tag' | 'comment';
  title: string;
  excerpt?: string;
  url: string;
  author?: string;
  date?: string;
  views?: number;
  tags?: string[];
  highlights?: {
    title?: string;
    content?: string;
  };
}

export interface CyberSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onSuggestion?: (query: string) => Promise<SearchSuggestion[]>;
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  shortcut?: string;
  showHistory?: boolean;
  showSuggestions?: boolean;
  maxHistory?: number;
  maxSuggestions?: number;
  debounceMs?: number;
  minQueryLength?: number;
}

// =====================================================
// 主组件
// =====================================================

export const CyberSearch: React.FC<CyberSearchProps> = ({
  onSearch,
  onSuggestion,
  onResultClick,
  placeholder = '搜索文章、页面、标签...',
  className,
  shortcut = '⌘K',
  showHistory = true,
  showSuggestions = true,
  maxHistory = 5,
  maxSuggestions = 8,
  debounceMs = 300,
  minQueryLength = 2,
}) => {
  // 状态管理
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

  // Refs
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 防抖搜索
  const debouncedQuery = useDebounce(query, debounceMs);

  // =====================================================
  // 加载搜索历史
  // =====================================================

  useEffect(() => {
    const savedHistory = localStorage.getItem('search_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load search history:', error);
      }
    }
  }, []);

  // 保存搜索历史
  const saveToHistory = (query: string) => {
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, maxHistory);
    setHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  // =====================================================
  // 搜索逻辑
  // =====================================================

  useEffect(() => {
    if (debouncedQuery.length >= minQueryLength) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);

    try {
      // 执行搜索
      const searchResults = await onSearch(searchQuery);
      setResults(searchResults);

      // 获取建议
      if (onSuggestion && showSuggestions) {
        const suggestionResults = await onSuggestion(searchQuery);
        setSuggestions(suggestionResults.slice(0, maxSuggestions));
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // =====================================================
  // 键盘导航
  // =====================================================

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = [...suggestions, ...results];
    const maxIndex = items.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          handleItemClick(items[selectedIndex]);
        } else if (query.length >= minQueryLength) {
          handleSearch();
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // =====================================================
  // 事件处理
  // =====================================================

  const handleSearch = () => {
    if (query.length >= minQueryLength) {
      saveToHistory(query);
      performSearch(query);
    }
  };

  const handleItemClick = (item: SearchSuggestion | SearchResult) => {
    if ('url' in item) {
      // SearchResult
      onResultClick?.(item as SearchResult);
      saveToHistory(query);
      setIsOpen(false);
    } else if ('url' in item && item.url) {
      // SearchSuggestion with URL
      window.location.href = item.url;
      setIsOpen(false);
    } else if ('type' in item && item.type === 'query') {
      // Query suggestion
      setQuery(item.title);
      performSearch(item.title);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // =====================================================
  // 全局快捷键
  // =====================================================

  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K 打开搜索
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => {
          if (!prev) {
            inputRef.current?.focus();
          }
          return !prev;
        });
      }

      // Escape 关闭搜索
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  }, [isOpen]);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // =====================================================
  // 渲染辅助函数
  // =====================================================

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post':
      case 'page':
        return FileText;
      case 'user':
        return User;
      case 'tag':
        return Tag;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'text-cyber-cyan';
      case 'page':
        return 'text-cyber-purple';
      case 'user':
        return 'text-cyber-pink';
      case 'tag':
        return 'text-cyber-green';
      default:
        return 'text-gray-400';
    }
  };

  // =====================================================
  // 渲染
  // =====================================================

  return (
    <div
      ref={searchRef}
      className={cn('cyber-search relative', className)}
    >
      {/* 搜索输入框 */}
      <div
        className={cn(
          'relative flex items-center gap-3',
          'bg-dark-bg/80 border border-cyber-cyan/30 rounded-lg',
          'backdrop-blur-sm transition-all duration-300',
          isOpen && 'ring-2 ring-cyber-cyan/50 shadow-neon'
        )}
      >
        <Search className="w-5 h-5 text-cyber-cyan ml-4 flex-shrink-0" />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'flex-1 py-3 pr-12 bg-transparent text-white',
            'placeholder:text-gray-600 focus:outline-none'
          )}
        />

        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-12 p-1 rounded-full hover:bg-cyber-cyan/20 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-white" />
          </motion.button>
        )}

        <div className="absolute right-4 flex items-center gap-2 text-xs text-gray-600">
          <kbd className="px-2 py-1 bg-dark-bg border border-gray-700 rounded">
            {shortcut}
          </kbd>
        </div>
      </div>

      {/* 搜索结果下拉 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-dark-bg/95 border border-cyber-cyan/30 rounded-lg',
              'backdrop-blur-sm shadow-2xl overflow-hidden',
              'max-h-[600px] overflow-y-auto'
            )}
          >
            {/* 搜索中 */}
            {isSearching && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3 text-cyber-cyan">
                  <div className="w-5 h-5 border-2 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin" />
                  <span>搜索中...</span>
                </div>
              </div>
            )}

            {/* 搜索历史 */}
            {!isSearching && query.length < minQueryLength && history.length > 0 && showHistory && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    搜索历史
                  </h3>
                  <button
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem('search_history');
                    }}
                    className="text-xs text-gray-600 hover:text-cyber-cyan transition-colors"
                  >
                    清除
                  </button>
                </div>

                <div className="space-y-1">
                  {history.map((item, index) => (
                    <motion.button
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        setQuery(item);
                        performSearch(item);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                        'text-left text-gray-400 hover:text-white hover:bg-cyber-cyan/10',
                        'transition-all duration-200',
                        selectedIndex === index && 'bg-cyber-cyan/20 text-white'
                      )}
                    >
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 truncate">{item}</span>
                      <ChevronRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100" />
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* 搜索建议 */}
            {!isSearching && suggestions.length > 0 && (
              <div className="p-4 border-t border-cyber-cyan/20">
                <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  搜索建议
                </h3>

                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon || getTypeIcon(suggestion.type);
                    return (
                      <motion.button
                        key={suggestion.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleItemClick(suggestion)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg',
                          'text-left hover:bg-cyber-cyan/10 transition-all duration-200',
                          selectedIndex === index && 'bg-cyber-cyan/20'
                        )}
                      >
                        <Icon className={cn('w-4 h-4 flex-shrink-0', getTypeColor(suggestion.type))} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white truncate">{suggestion.title}</div>
                          {suggestion.subtitle && (
                            <div className="text-xs text-gray-600 truncate">{suggestion.subtitle}</div>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-600" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 搜索结果 */}
            {!isSearching && results.length > 0 && (
              <div className="p-4 border-t border-cyber-cyan/20">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">
                  找到 {results.length} 个结果
                </h3>

                <div className="space-y-2">
                  {results.map((result, index) => {
                    const ItemIndex = suggestions.length + index;
                    const Icon = getTypeIcon(result.type);

                    return (
                      <motion.button
                        key={result.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleItemClick(result)}
                        className={cn(
                          'w-full flex items-start gap-3 px-3 py-3 rounded-lg',
                          'text-left hover:bg-cyber-cyan/10 transition-all duration-200',
                          selectedIndex === ItemIndex && 'bg-cyber-cyan/20'
                        )}
                      >
                        <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', getTypeColor(result.type))} />

                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-white font-medium truncate">
                            {result.title}
                          </div>
                          {result.excerpt && (
                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {result.excerpt}
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                            {result.author && <span>{result.author}</span>}
                            {result.date && <span>{result.date}</span>}
                            {result.views && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                {result.views}
                              </span>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-600" />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 无结果 */}
            {!isSearching && query.length >= minQueryLength && results.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>没有找到相关结果</p>
                <p className="text-sm mt-1">试试其他关键词</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CyberSearch;
