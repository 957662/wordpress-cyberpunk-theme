'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X, ChevronLeft, ChevronRight, Spotlight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SearchHighlightProps {
  content: string;
  searchQuery?: string;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  useRegex?: boolean;
  highlightColor?: string;
  className?: string;
  onMatchFound?: (matches: number) => void;
  onMatchSelect?: (index: number, match: string) => void;
  showSearchBar?: boolean;
  showNavigation?: boolean;
  autoScroll?: boolean;
}

export const SearchHighlight: React.FC<SearchHighlightProps> = ({
  content,
  searchQuery = '',
  caseSensitive = false,
  wholeWord = false,
  useRegex = false,
  highlightColor = '#00f0ff',
  className,
  onMatchFound,
  onMatchSelect,
  showSearchBar = true,
  showNavigation = true,
  autoScroll = true,
}) => {
  const [query, setQuery] = useState(searchQuery);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);

  // 更新查询
  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  // 查找匹配项
  useEffect(() => {
    if (!query) {
      setMatches([]);
      setCurrentMatch(0);
      onMatchFound?.(0);
      return;
    }

    try {
      let regexPattern = query;

      if (!useRegex) {
        // 转义特殊字符
        regexPattern = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      if (wholeWord) {
        regexPattern = `\\b${regexPattern}\\b`;
      }

      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(regexPattern, flags);

      const found = content.match(regex);
      const matchedTexts = found || [];

      setMatches(matchedTexts);
      setCurrentMatch(0);
      onMatchFound?.(matchedTexts.length);
    } catch (error) {
      console.error('Regex error:', error);
      setMatches([]);
      setCurrentMatch(0);
      onMatchFound?.(0);
    }
  }, [query, content, caseSensitive, wholeWord, useRegex, onMatchFound]);

  // 高亮内容
  const highlightedContent = useMemo(() => {
    if (!query || matches.length === 0) {
      return content;
    }

    try {
      let regexPattern = query;

      if (!useRegex) {
        regexPattern = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }

      if (wholeWord) {
        regexPattern = `\\b${regexPattern}\\b`;
      }

      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(`(${regexPattern})`, flags);

      const parts = content.split(regex);

      return parts.map((part, index) => {
        const matchIndex = matches.findIndex(m => {
          if (caseSensitive) {
            return m === part;
          }
          return m.toLowerCase() === part.toLowerCase();
        });

        if (matchIndex !== -1) {
          const isCurrentMatch = matchIndex === currentMatch;
          return (
            <mark
              key={index}
              className={cn(
                'transition-all duration-200',
                isCurrentMatch ? 'animate-pulse' : ''
              )}
              style={{
                backgroundColor: isCurrentMatch
                  ? `${highlightColor}40`
                  : `${highlightColor}20`,
                borderBottom: isCurrentMatch
                  ? `2px solid ${highlightColor}`
                  : `1px solid ${highlightColor}80`,
                padding: '2px 4px',
                borderRadius: '2px',
              }}
            >
              {part}
            </mark>
          );
        }

        return part;
      });
    } catch (error) {
      return content;
    }
  }, [content, query, matches, currentMatch, caseSensitive, wholeWord, useRegex, highlightColor]);

  // 导航到上一个匹配
  const goToPrevious = useCallback(() => {
    if (matches.length === 0) return;
    setCurrentMatch(prev => (prev > 0 ? prev - 1 : matches.length - 1));
  }, [matches.length]);

  // 导航到下一个匹配
  const goToNext = useCallback(() => {
    if (matches.length === 0) return;
    setCurrentMatch(prev => (prev < matches.length - 1 ? prev + 1 : 0));
  }, [matches.length]);

  // 清除搜索
  const clearSearch = useCallback(() => {
    setQuery('');
    setMatches([]);
    setCurrentMatch(0);
  }, []);

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          goToPrevious();
        } else {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // 滚动到当前匹配
  useEffect(() => {
    if (autoScroll && currentMatch >= 0 && matches.length > 0) {
      const marks = document.querySelectorAll('mark[style*="border-bottom: 2px"]');
      const currentMark = marks[currentMatch] as HTMLElement;

      if (currentMark) {
        currentMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        onMatchSelect?.(currentMatch, matches[currentMatch]);
      }
    }
  }, [currentMatch, matches, autoScroll, onMatchSelect]);

  return (
    <div className={cn('space-y-2', className)}>
      {/* 搜索栏 */}
      {showSearchBar && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700"
        >
          <Search className="w-4 h-4 text-gray-400" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索内容..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder-gray-500"
          />

          {query && (
            <button
              onClick={clearSearch}
              className="p-1 rounded hover:bg-gray-700/50 transition-colors"
              aria-label="清除搜索"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}

          {/* 匹配计数 */}
          {matches.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-700/50">
              <span className="text-sm font-medium text-cyan-400">
                {currentMatch + 1}
              </span>
              <span className="text-sm text-gray-400">/</span>
              <span className="text-sm text-gray-400">{matches.length}</span>
            </div>
          )}

          {/* 导航按钮 */}
          {showNavigation && matches.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={goToPrevious}
                className="p-1 rounded hover:bg-gray-700/50 transition-colors"
                aria-label="上一个匹配"
                title="上一个 (Ctrl+Shift+G)"
              >
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={goToNext}
                className="p-1 rounded hover:bg-gray-700/50 transition-colors"
                aria-label="下一个匹配"
                title="下一个 (Ctrl+G)"
              >
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}

          {/* 选项按钮 */}
          <div className="flex items-center gap-1 border-l border-gray-700 pl-2">
            <button
              onClick={() => {}}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                caseSensitive
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:bg-gray-700/50'
              )}
              title="区分大小写"
            >
              Aa
            </button>
            <button
              onClick={() => {}}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                wholeWord
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:bg-gray-700/50'
              )}
              title="全字匹配"
            >
              W
            </button>
            <button
              onClick={() => {}}
              className={cn(
                'px-2 py-1 text-xs rounded transition-colors',
                useRegex
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'text-gray-400 hover:bg-gray-700/50'
              )}
              title="正则表达式"
            >
              .*
            </button>
          </div>
        </motion.div>
      )}

      {/* 高亮内容 */}
      <div className="text-gray-300 leading-relaxed">
        {highlightedContent}
      </div>

      {/* 快捷键提示 */}
      {showNavigation && matches.length > 1 && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700">Ctrl+G</kbd>
          <span>下一个</span>
          <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700">Ctrl+Shift+G</kbd>
          <span>上一个</span>
        </div>
      )}
    </div>
  );
};

// 文本搜索组件（独立版本）
export interface TextSearchProps {
  texts: string[];
  onSearch?: (query: string, results: Array<{ text: string; index: number }>) => void;
  placeholder?: string;
  className?: string;
}

export const TextSearch: React.FC<TextSearchProps> = ({
  texts,
  onSearch,
  placeholder = '搜索文本...',
  className,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ text: string; index: number }>>([]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);

    if (!searchQuery.trim()) {
      setResults([]);
      onSearch?.('', []);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const searchResults = texts
      .map((text, index) => ({ text, index }))
      .filter(({ text }) => text.toLowerCase().includes(lowerQuery));

    setResults(searchResults);
    onSearch?.(searchQuery, searchResults);
  }, [texts, onSearch]);

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <mark
            key={index}
            className="bg-cyan-500/20 text-cyan-400 px-1 rounded"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* 搜索输入 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
        {query && (
          <button
            onClick={() => handleSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* 搜索结果 */}
      <AnimatePresence>
        {query && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-gray-800/30 border border-gray-700"
          >
            <p className="text-sm text-gray-400 mb-2">
              找到 <span className="text-cyan-400 font-medium">{results.length}</span> 个结果
            </p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {results.map(({ text, index }) => (
                <div
                  key={index}
                  className="p-2 rounded bg-gray-700/30 hover:bg-gray-700/50 transition-colors"
                >
                  <p className="text-sm text-gray-300">
                    {highlightMatch(text, query)}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 无结果提示 */}
      {query && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-lg bg-gray-800/30 border border-gray-700 text-center"
        >
          <p className="text-gray-400">未找到匹配的结果</p>
        </motion.div>
      )}
    </div>
  );
};

export default SearchHighlight;
