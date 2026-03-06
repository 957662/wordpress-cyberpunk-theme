'use client';

/**
 * 实时搜索组件
 * 支持文章、标签、作者的实时搜索
 * 带有搜索建议和历史记录
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, TrendingUp, FileText, User, Tag } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { debounce } from '@/lib/utils/performance-utils';

// 搜索结果类型
interface SearchResult {
  id: string;
  type: 'post' | 'tag' | 'author';
  title: string;
  excerpt?: string;
  slug: string;
  imageUrl?: string;
}

// 搜索建议类型
interface SearchSuggestion {
  text: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}

interface RealtimeSearchProps {
  onSearch?: (query: string) => void;
  onSelectResult?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  showHistory?: boolean;
  maxResults?: number;
}

export function RealtimeSearch({
  onSearch,
  onSelectResult,
  placeholder = '搜索文章、标签、作者...',
  className = '',
  showSuggestions = true,
  showHistory = true,
  maxResults = 5,
}: RealtimeSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 模拟搜索API - 实际项目中应该调用真实的API
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSuggestions(getDefaultSuggestions());
      return;
    }

    setIsSearching(true);

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      // 模拟搜索结果
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'post',
          title: `${searchQuery} 相关文章 1`,
          excerpt: '这是一篇关于搜索结果的文章摘要...',
          slug: 'post-1',
        },
        {
          id: '2',
          type: 'post',
          title: `${searchQuery} 相关文章 2`,
          excerpt: '另一篇相关的文章内容...',
          slug: 'post-2',
        },
        {
          id: '3',
          type: 'tag',
          title: searchQuery,
          slug: `tag-${searchQuery}`,
        },
      ];

      setResults(mockResults.slice(0, maxResults));

      // 更新建议
      const mockSuggestions: SearchSuggestion[] = [
        { text: `${searchQuery} 教程`, type: 'suggestion' },
        { text: `${searchQuery} 最佳实践`, type: 'suggestion' },
        { text: `如何使用 ${searchQuery}`, type: 'suggestion' },
      ];
      setSuggestions(mockSuggestions);

      onSearch?.(searchQuery);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setIsSearching(false);
    }
  }, [maxResults, onSearch]);

  // 防抖搜索函数
  const debouncedSearch = useCallback(
    debounce(performSearch, 300),
    [performSearch]
  );

  // 获取默认建议（热门搜索和历史记录）
  const getDefaultSuggestions = (): SearchSuggestion[] => {
    const trending: SearchSuggestion[] = [
      { text: 'React Hooks', type: 'trending', count: 1234 },
      { text: 'TypeScript', type: 'trending', count: 987 },
      { text: 'Next.js 14', type: 'trending', count: 756 },
    ];

    const history: SearchSuggestion[] = [
      { text: 'FastAPI 教程', type: 'history' },
      { text: 'Tailwind CSS', type: 'history' },
    ];

    return showHistory ? [...trending, ...history] : trending;
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    debouncedSearch(value);
  };

  // 处理清空搜索
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setSuggestions(getDefaultSuggestions());
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // 处理结果选择
  const handleSelectResult = (result: SearchResult) => {
    setQuery(result.title);
    setShowDropdown(false);
    onSelectResult?.(result);
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    performSearch(suggestion.text);
    setShowDropdown(false);
  };

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = [...results, ...suggestions];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < items.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          if (selectedIndex < results.length) {
            handleSelectResult(results[selectedIndex]);
          } else {
            handleSuggestionClick(
              suggestions[selectedIndex - results.length]
            );
          }
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

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

  // 初始化默认建议
  useEffect(() => {
    setSuggestions(getDefaultSuggestions());
  }, [showHistory]);

  // 获取结果类型图标
  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'post':
        return <FileText className="w-4 h-4" />;
      case 'tag':
        return <Tag className="w-4 h-4" />;
      case 'author':
        return <User className="w-4 h-4" />;
    }
  };

  // 获取建议类型图标
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'history':
        return <Clock className="w-4 h-4 text-cyber-muted" />;
      case 'trending':
        return <TrendingUp className="w-4 h-4 text-cyber-pink" />;
      case 'suggestion':
        return <Search className="w-4 h-4 text-cyber-cyan" />;
    }
  };

  return (
    <div ref={searchRef} className={cn('relative w-full max-w-2xl mx-auto', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <motion.div
          className="relative flex items-center"
          initial={false}
          animate={showDropdown ? 'active' : 'inactive'}
        >
          <Search className="absolute left-4 w-5 h-5 text-cyber-muted pointer-events-none" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-12 pr-12 py-4 rounded-lg',
              'bg-cyber-card border border-cyber-border',
              'text-white placeholder:text-cyber-muted',
              'focus:outline-none focus:border-cyber-cyan',
              'transition-all duration-200',
              'shadow-lg shadow-cyber-cyan/5'
            )}
          />

          {query && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleClear}
              className="absolute right-4 p-1 rounded-full hover:bg-cyber-muted transition-colors"
              aria-label="清空搜索"
            >
              <X className="w-5 h-5 text-cyber-muted" />
            </motion.button>
          )}
        </motion.div>

        {/* 搜索加载指示器 */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-12 top-1/2 -translate-y-1/2"
          >
            <div className="w-5 h-5 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      <AnimatePresence>
        {showDropdown && (results.length > 0 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 rounded-lg bg-cyber-card border border-cyber-border shadow-xl overflow-hidden"
          >
            {/* 搜索结果 */}
            {results.length > 0 && (
              <div className="p-2 border-b border-cyber-border">
                <div className="px-3 py-2 text-xs font-medium text-cyber-muted uppercase tracking-wider">
                  搜索结果
                </div>
                {results.map((result, index) => (
                  <motion.button
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectResult(result)}
                    className={cn(
                      'w-full flex items-start gap-3 px-3 py-2 rounded-md',
                      'text-left hover:bg-cyber-muted/50 transition-colors',
                      selectedIndex === index && 'bg-cyber-muted/50'
                    )}
                  >
                    <div className="mt-0.5 text-cyber-cyan">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {result.title}
                      </div>
                      {result.excerpt && (
                        <div className="text-xs text-cyber-muted truncate mt-0.5">
                          {result.excerpt}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* 搜索建议 */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-medium text-cyber-muted uppercase tracking-wider">
                  {query ? '搜索建议' : '热门搜索'}
                </div>
                {suggestions.map((suggestion, index) => {
                  const itemIndex = results.length + index;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-md',
                        'text-left hover:bg-cyber-muted/50 transition-colors',
                        selectedIndex === itemIndex && 'bg-cyber-muted/50'
                      )}
                    >
                      <div>{getSuggestionIcon(suggestion.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">
                          {suggestion.text}
                        </div>
                      </div>
                      {suggestion.count && (
                        <div className="text-xs text-cyber-muted">
                          {suggestion.count}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RealtimeSearch;
